# AIDE 再構築案のレビュー依頼

あなたには設計レビューをお願いします。実装はしないでください。

## 背景

AIDE は「自然言語（Markdown）で設計を固めてから実装に入る」ための開発支援ツールです。
既存実装が肥大化した（Node.js / 依存ゼロ / 4,143行）ため、機能を絞って作り直します。

残す要件は以下の10個です。

1. Markdown を正本にする
2. 人間が書いた文章を AI が勝手に変更しない
3. 設計を Lane（レーン）へ分割できる
4. AI による質問・提案・矛盾レビュー
5. 人間による明示的な承認
6. 承認時点のハッシュと、変更後の stale 検出
7. 判断・差し戻し・統合の履歴
8. 承認済み設計と下書きを区別する
9. MCP から実装AIへ承認済み設計を渡す
10. Claude / Codex などを交換できるバックエンド構造

## 中心にある一文

> 承認されていない設計では、実装が始まらない。

## 提案しているファイル構成

```
design/
  master.md              # 統合済み = 正本
  lanes/<topic>.md       # レーン（YAML front matter で状態を持つ）
  reviews/<topic>-<n>.md # AI の出力はここにしか書かれない
  history.jsonl          # append-only の判断ログ
```

lane ファイル:

```md
---
aide: lane
topic: login
status: draft          # draft | reviewed | approved | integrated
review: reviews/login-2.md
approvedHash: 8c41e0a2...
approvedAt: 2026-08-19T10:00:00Z
---

# login

## 目的
ユーザーがメールアドレスとパスワードでログインできる。
```

- front matter は決定的なツールコードだけが書く
- AI モデルは lanes/ と master.md を一度も開かない
- ハッシュは front matter を除いた本文のみ（CRLF・末尾空白を正規化）を対象にする

## 提案している最小の流れ

```
1. aide init / aide lane login
     → 人間が lanes/login.md に設計を書く

2. aide review design/lanes/login.md
     → reviews/login-1.md に「質問 / 矛盾 / 提案」を出力
     → lanes/login.md は開かない

3. 人間が質問への答えを本文に書く → 再度 aide review
     → 質問が尽きたらループ終了（終了条件が AI 側にある）

4. aide approve design/lanes/login.md
     → 本文の sha256 を approvedHash に記録、history.jsonl へ追記
     → 最新レビューが本文とズレている（stale）レーンは承認できない

5. aide integrate
     → master.md の `## login` セクションを機械的に差し替え（AI を使わない）

6. 承認後に本文を編集すると aide status が stale を検出

7. 実装AI が MCP 経由で問い合わせる
     aide_check_design("ログイン画面を作って")
       → outcome: covered / authority: master / stopRequired: false
     aide_check_design("パスワードリセットを作って")
       → outcome: unknown / stopRequired: true（承認済み設計に該当なし → 止まる）
     aide_check_design("ログインのレート制限を実装して")
       → outcome: draft_only / stopRequired: true（未承認の下書きは仕様ではない）
```

## 意図的に捨てたもの

- ファイル監視の常駐プロセス（保存で自動実行しない。コマンドを明示的に叩く）
- 議事録の自動生成、章まとめ
- 承認済み・未統合を保持する専用ファイル（pool.md）→ lane の status で表現
- 統合時に AI にマージさせること → 見出し単位の決定的な差し替えに変更
- レーン分割の AI 提案（最小版では人間が手動で切る）
- VS Code 拡張

## 聞きたいこと

以下について、賛成・反対とその理由を述べてください。特に**この設計が壊れるケース**を具体的に挙げてほしいです。

1. 上の 1〜7 の流れで「承認されていない設計では実装が始まらない」は成立しますか。抜け道はどこですか。

2. **AI の出力先を reviews/ に限定する方式**（人間のファイルを一切開かない）は、要件2の保証として妥当ですか。
   代案として「lane 内の `<!-- aide:ai -->` 以降だけ書き換え可 + 人間領域のハッシュ検証」も考えました。どちらが良いですか。

3. **integrate を決定的処理にする**（AI にマージさせない）判断は妥当ですか。
   レーン間で重複・冗長な記述が出たとき、master.md はどう劣化しますか。

4. **レビュー → 編集 → レビューのループ**は終わりますか。
   人間が答えるたびにレビューが stale になり、再レビューで新しい質問が出続けて収束しない危険はありませんか。

5. **stale の粒度**は本文全体のハッシュで妥当ですか。
   誤字修正のような無害な編集でも承認が無効になりますが、許容範囲ですか。

6. **MCP の outcome 判定**（covered / draft_only / unknown）で、
   「承認済み設計に該当がある」と誤って covered を返して実装が進んでしまう危険はどこにありますか。
   見出しの語の一致で判定する素朴な方式を想定しています。

7. この10要件に対して、**まだ足りていない**と思うものはありますか。逆に**最小版から更に削れる**ものはありますか。
