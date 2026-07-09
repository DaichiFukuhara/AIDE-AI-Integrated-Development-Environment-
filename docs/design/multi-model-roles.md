# mdtalk マルチモデル役割分担（dialogue / minutes / summary）

## 目的 / 背景

mdtalk の AI を役割ごとに別モデルへ分担させる。対話（注釈）は sonnet、
議事録は haiku、章まとめは opus のように、コストと品質を役割に応じて
使い分ける。ユーザーの想定フロー:「対話は人間と sonnet がして、その議事録を
haiku が書き、できた設計書の1つの章を opus/fable がまとめる」。

## 役割の定義

| 役割 | 既定モデル | 動き | 出力先 |
|---|---|---|---|
| dialogue | sonnet | 既存の注釈ループ（変更なし） | 対象 MD（挿入のみ） |
| minutes | haiku | サイクル後に議事録エントリを追記 | `<base>.minutes.md` |
| summary | opus | `@ai(summary):` 指示で章を清書 | `<base>.summary.md` |

`<base>` は対象ファイルの拡張子を除いた名前。`design.md` →
`design.minutes.md` / `design.summary.md`（対象 MD と同じディレクトリ）。
**対象 MD 本体への書き込みは従来どおり挿入のみ**。minutes / summary は
別ファイルに書くことで「人間の文は不変」の約束を守る。

## 対象ファイル

- 変更: `mdtalk.js` — 役割別モデル解決、`@ai(...)` 構文、minutes 生成、
  summary 生成。引き続き単一ファイル・外部依存ゼロ
- 変更: `README.md` — 新オプション・新構文・新ファイルの説明を追記
- 変更: `test/unit.test.js`, `test/integration.test.js` — 下記テスト方針
- 実行時生成: `<base>.minutes.md`, `<base>.summary.md`

## インターフェース / シグネチャ

### CLI（追加オプション）

```
--model <name>            dialogue のモデル（既存。既定: sonnet）
--model-minutes <name>    minutes のモデル（既定: haiku）
--model-summary <name>    summary のモデル（既定: opus）
--no-minutes              議事録生成を無効化
```

### ファイル内モデル指定（動的切り替え）

プロトコルヘッダ（先頭の HTML コメント）内に次の1行を持てる:

```
mdtalk-models: dialogue=sonnet minutes=haiku summary=opus
```

- 各サイクルの冒頭でこの行をパースし、**ファイル内指定 > CLI > 既定値**の
  優先順で役割ごとのモデルを解決する。人間がこの行を書き換えて保存すれば
  次サイクルから反映される（動的切り替え）。
- ヘッダ新規挿入時にこの行をテンプレートとして含める（値は起動時の解決結果）。
- 一部の役割だけ書いてもよい（書いた役割だけ上書き）。不正な役割名は無視して
  警告ログ。
- プロトコルヘッダ内の行は注釈対象（人間の変更行）から除外する。

### `@ai(...)` ディレクティブ構文（拡張）

既存の `@ai: 指示` に加えて:

- `@ai(summary): この章をまとめて` — summary タスクとして処理
  （下記「summary の振る舞い」）
- `@ai(<モデル名>): 指示` — その1回だけ dialogue 呼び出しのモデルを
  `<モデル名>` に差し替える（例: `@ai(opus): 反論だけほしい`）
- カッコ内が `summary` なら役割、それ以外はモデル名として扱う。
  `dialogue` / `minutes` が書かれた場合はその役割のモデル名として解釈する
- 処理後の `<!-- done: ... -->` 変換は従来どおり（カッコ含め元の文字列を残す）

### Claude 応答スキーマ（役割別）

- dialogue: 既存の `{"insertions":[...]}`（変更なし）
- minutes: `{"minutes":"<Markdownエントリ本文>"}`
- summary: `{"summary":"<Markdown章本文>"}`
- パースは既存の `parseClaudeResponse`（envelope / コードフェンス対応）を
  共用する

## 振る舞い / データフロー

### minutes（議事録）

1. dialogue サイクルが「挿入を適用した」または「`@ai:` を消費した」場合、
   その直後に minutes モデルを1回呼ぶ。変更がないサイクルでは呼ばない
2. プロンプトに含めるもの: 今回人間が書いた/変えた行、今回挿入した注釈、
   直近の議事録エントリ（あれば末尾2エントリ、継続性のため）
3. 応答の `minutes` を `<base>.minutes.md` の末尾に
   `## <YYYY-MM-DD HH:MM>` 見出し付きで追記する（追記のみ・上書きしない）
4. minutes の失敗（タイムアウト・不正応答・書き込み失敗）は警告ログのみで、
   dialogue サイクルの成否には影響させない。リトライもしない
5. `--no-minutes` 時はこの手順全体をスキップ

### summary（章まとめ）

1. `@ai(summary):` 指示を検出したら、その行が属する章
   （直前の `##` 見出しから次の `##` 見出しの手前まで。見出しがなければ
   ファイル全体）を特定する
2. summary モデルに渡す: 指示文、章の全文（注釈 blockquote 含む — AI との
   対話も清書の材料）、ファイル全体の見出し一覧（文脈用）
3. 応答の `summary` を `<base>.summary.md` に書く。summary ファイル内に
   同じ章見出し（`## <章名>`）のセクションが既にあれば**そのセクションを
   置換**、なければ末尾に追記（章単位で冪等）
4. 対象 MD には、指示行の `<!-- done -->` 変換に加えて、章末尾に
   `> 🧭 **AI**: まとめを <base>.summary.md「<章名>」に書きました（日時）`
   を挿入する（挿入のみの約束の範囲内）
5. summary 指示があるサイクルでは、その指示は dialogue プロンプトには
   渡さない（二重処理防止）。summary 以外の `@ai:` 指示は従来どおり
   dialogue に渡す
6. 失敗時は警告ログ＋指示行を消費しない（`<!-- done -->` にしない。
   次サイクルで再試行できる）

### モデル解決

- サイクルごとに `resolveModels(cliOpts, fileHeader)` で
  `{dialogue, minutes, summary}` を決める。優先順: ファイル内
  `mdtalk-models:` 行 > CLI オプション > 既定値
  （sonnet / haiku / opus）
- ログの1行サマリにモデル名を出す（例:
  `+2 notes (❓×1 💬×1) model=sonnet 3.2s` / `minutes model=haiku` /
  `summary model=opus → design.summary.md`）

## 受け入れ条件 (Acceptance Criteria)

- [ ] `--model-minutes` / `--model-summary` / `--no-minutes` が CLI で
      受理される
- [ ] 挿入が発生したサイクルの後、minutes モデルが呼ばれ
      `<base>.minutes.md` に日時見出し付きエントリが追記される
      （モックが受け取った `--model` 引数で haiku 既定を検証）
- [ ] 挿入ゼロ（空 insertions）のサイクルでは minutes が呼ばれない
- [ ] `--no-minutes` で minutes が一切呼ばれない
- [ ] `@ai(summary): ...` で summary モデルが呼ばれ、`<base>.summary.md` に
      章のまとめが書かれ、対象 MD の指示行が `<!-- done -->` になり、
      章末尾に参照 blockquote が挿入される
- [ ] summary ファイルに同章セクションが既存なら置換され、他章は保持される
- [ ] `@ai(opus): ...` がその1回の dialogue 呼び出しを `--model opus` で
      実行する（モックの受信引数で検証）
- [ ] ヘッダの `mdtalk-models:` 行が CLI 指定より優先される
- [ ] minutes の失敗（不正応答）が dialogue サイクルの成功を妨げない
- [ ] 対象 MD 本体は従来どおり「注釈挿入・ヘッダ・`@ai:`→done 変換」以外
      バイト単位で不変（既存テストが引き続き通る）

## エッジケース / エラー処理

- summary 指示行がどの `##` 見出しにも属さない（先頭にある等）→
  ファイル全体を1章として扱い、summary ファイルの見出しは
  `## (全体)` とする
- `mdtalk-models:` 行の壊れた書式 → 警告ログを出し、その行は無視
  （CLI/既定にフォールバック）
- minutes / summary ファイルが手で編集されていても構わない（minutes は
  追記のみ、summary は章見出し一致で置換。一致判定は見出しテキストの
  完全一致）
- summary / minutes ファイルは監視対象外（自己ループの心配なし）
- `@ai(存在しないモデル名):` → claude がエラーを返したら警告ログ＋
  指示は消費しない
- 同一サイクルに summary 指示が複数 → 上から順に逐次処理

## テスト方針

既存のモック（`MDTALK_CLAUDE_CMD` + `fixtures/mock-claude.js`）を拡張:
モックが受け取った argv（特に `--model`）と standard input を一時ファイルに
記録できるようにし、役割ごとに正しいモデルで呼ばれたことを検証する。
モックは入力プロンプト中のマーカー（応答スキーマの種類）で dialogue /
minutes / summary を判別して対応する固定 JSON を返す。

- ユニット: `mdtalk-models:` 行のパースと優先順解決 / `@ai(...)` 構文の
  解釈（summary・モデル名・既存 `@ai:` の互換）/ 章境界の特定 /
  summary ファイルの章置換ロジック
- 結合（--once）: 受け入れ条件の各項目。既存30テストは無変更で通ること
- 手動確認: 実 claude で `@ai(summary):` を1回試す

## スコープ外

- minutes / summary ファイルの監視・注釈（対象は本体 MD のみ）
- summary が本体 MD の章を書き換えること（別ファイル出力のみ）
- 役割の追加定義（ユーザー定義ロール）・設定ファイル（.mdtalkrc 等）
- fable 等モデル名のバリデーション（claude CLI にそのまま渡す）
- 複数ファイル監視（v0 と同じ）
