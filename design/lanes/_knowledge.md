# 共有知識ルーム
<!-- aide:knowledge generated
このファイルは AIDE が自動生成する読み取り専用の共有コンテキストです。
直接編集しても次回同期で上書きされます。元の master / pool / lane / report を更新してください。
-->

> レーンAIはこの内容を参照します。確定事項はマスター、統合待ちはプール、未確定の詳細は各レーンを正とします。

## 人間が明示した共有コンテキスト（.aide-context.md）

（追加の共有コンテキストなし）

## プロジェクト概要（README.md）

# AIDE

AIDEは、設計書を複数のMarkdownレーンに分け、人間とAIで並列に検討するためのツールです。

- `mdtalk`: Markdownの変更を検知し、Claudeが質問や提案を追記
- `aide`: レーンの作成、レビュー、承認、マスター設計への統合を管理
- `vscode-aide`: 一連の操作をVS Codeのサイドバーから実行

## 必要環境

- Node.js 20以上
- [Claude Code CLI](https://www.npmjs.com/package/@anthropic-ai/claude-code)
- Codex CLI（`aide observe`を使う場合）

## セットアップ

```sh
git clone <repository-url>
cd AIDE-AI-Integrated-Development-Environment-
npm link
```

`npm link`を使わない場合は、`node mdtalk.js` / `node aide.js`で直接実行できます。

## 基本フロー

```sh
aide init
aide lane auth
mdtalk design/lanes/auth.md

# 設計が固まったら別ターミナルで実行
aide observe design/lanes/auth.md
aide accept design/lanes/auth.md
aide integrate
```

成果物は次の場所に保存されます。

| パス | 内容 |
| --- | --- |
| `design/master.md` | 統合済みのマスター設計 |
| `design/lanes/*.md` | テーマ別の設計レーン |
| `design/reports/` | AIレビュー結果 |
| `design/pool.md` | 承認済み・未統合の内容 |
| `design/pool-archive.md` | 統合・差し戻しの履歴 |

## mdtalk

```sh
mdtalk <file.md> [options]
```

主なオプション:

- `--once`: 1回だけ処理して終了
- `--init`: 空のファイルに設計書のひな型を生成
- `--model <name>`: 対話モデルを指定
- `--model-minutes <name>`: 議事録モデルを指定
- `--model-summary <name>`: 章まとめモデルを指定
- `--no-minutes`: 議事録の自動生成を無効化

行頭に`@ai: 指示`を書くと、その指示を優先して処理します。`@ai(summary): 指示`では章のまとめを別ファイルへ生成します。

## aide

| コマンド | 内容 |
| --- | --- |
| `aide init [root]` | 設計ディレクトリを初期化 |
| `aide lane <topic> [root]` | レーンを作成 |
| `aide observe <lane.md>` | 矛盾や分割可能性をレビュー |
| `aide accept <lane.md>` | レビュー済み内容をプールへ追加 |
| `aide integrate [root]` | プールをマスター設計へ統合 |
| `aide knowledge [root]` | 共有知識ファイルを再生成 |
| `aide status [root] [--json]` | 現在の状態を表示 |

### Observeレベル

`mdtalk protocol`ヘッダの`observe-level`で、レーンごとの観察基準を選べます。

```md
<!-- mdtalk protocol
observe-level: light
-->
```

- `light`: マスターや他レーンとの矛盾だけを合否判定します。内部関数名、配置、既存コードへの接続方法など、安全に実装時判断できる詳細は未確定でもpassできます。
- `strict`: 矛盾に加え、レーン単独で実装できる粒度まで依存関係とインターフェースを確認します。
- 宣言がない既存レーンは`strict`として扱います。不正値、空値、重複宣言はObserve前にエラーになります。

矛盾検出、観察時のレーンハッシュ、観察後のstale検査はどちらのレベルでも有効です。使用したレベルは観察レポート、pool、`status --json`、VS Codeに記録・表示されます。

`AIDE_OBSERVER_CMD`と`AIDE_MASTER_CMD`でAIバックエンドを変更できます。既定コマンドは拡張子なしの`codex` / `claude`で、Windowsでも`.exe`とnpmの`.cmd` shimの両方を解決します。

詳しい設計は[mdtalk設計](docs/mdtalk-design.md)と[AIDEオーケストレーション設計](docs/design/aide-orchestration.md)を参照してください。

## VS Code拡張

```powershell
cd vscode-aide
npm install
npm run package
code --install-extension aide-buttons-0.2.0.vsix
```

操作方法は[VS Code拡張のREADME](vscode-aide/README.md)を参照してください。

## テスト

```sh
npm test
```

## License

[MIT](LICENSE)

## 確定済みの共通知識（master.md）

# マスター設計書
<!-- aide:master
このファイルは AIDE の「正」。アクセプト済みの内容だけが載る。
更新は `aide integrate`（マスターAI）経由。人間の直接編集も可
（次回統合時にマスターAIが整合を確認する）。
-->

## 目的 / 背景

（プロダクトの目的をここに書く）

## アーキテクチャ原則

## 機能・コンポーネント（アクセプト済み）

### Observeシステム: observe-level による厳しさ制御

Observeの厳しさをレーン単位で切り替えられるようにする。既存レーンの挙動を変えず、必要なレーンだけ明示的に緩和できる二段階の仕組みを導入する。

#### レベル定義

- `strict`（既定）: 従来どおり矛盾検出と分割可能性の両方を必須とする。
- `light`: 矛盾検出のみ必須とし、分割可能性の評価はスキップする。
- 将来のレベル追加を見据え、内部的には順序付きの段階として扱える構造にしておく（例: `light < standard < strict`）。ただし今回の実装スコープは `light` と `strict` の二段階のみ。

#### 宣言方法

- レーン先頭の第一 `<!-- mdtalk protocol ... -->` ブロック内に `observe-level: light|strict` を1行1キーの書式（`mdtalk-models: ...` と同じスタイル）で記述する。
- 2つ目以降の同種プロトコルコメントや、本文中の同名文字列は無視する。
- 宣言のないレーンは `strict` として解釈する（既存ファイル互換）。
- 実行時フラグ（`observe --quick` 等）や環境変数による上書きは提供しない。ファイルに残る宣言を唯一の指定方法とし、実行者によって判定条件が変わる事故を防ぐ。
- 同一レーンに `observe-level` が複数現れた場合は、同じ値の重複を含めて設定エラーとする。
- 不正値・未知値・空値・重複はすべて入力エラーとしてObserveを開始しない。エラーメッセージには検出値、許可値の一覧、宣言行番号を含める。設定エラーは他のObserveエラーと区別できる終了コードを割り当てる。

#### 解決ロジック

- ヘッダ解析は `resolveObserveLevel(laneText)` という純粋関数に分離し、CLI・status・プロンプト生成で共通利用する。
- 返り値は `{ level: 'light' | 'strict', source: 'declared' | 'default' }` のオブジェクト。宣言由来か既定由来かを呼び出し側が分岐なしで扱えるようにする。
- 不正値検出時はこの関数内で例外を投げる。

#### 観察者プロンプト

- `strict`: 現行どおり矛盾と分割可能性の2項目を評価対象とする。
- `light`: 分割可能性を評価対象から明示的に除外する文言を含め、モデルに「今回は分割可能性を評価しない」ことを伝える。項目を消すだけでモデルの気を利かせた言及に頼らない。

#### レポート形式

- レポートJSONの `separability` フィールドは以下の形式で固定する:
  - `strict`: `{ checked: true, ok: true|false, ... }`
  - `light`: `{ checked: false, ok: null, detail: 'observe-level: light のためスキップ' }`
- レポートメタデータに `observeLevel: light|strict` を追加し、`aide status --json` がメタデータから安定して取得できるようにする。
- `observeLevel` フィールドを持たない既存レポートは `strict` と解釈して読み込む（後方互換性）。
- verdictは矛盾検出の結果のみで決める。矛盾がなければ pass、あれば fail。未実施の分割可能性を pass 判定に混ぜない。
- 人間向けには「分割可能性: スキップ（observe-level: light）」のような明示表記をレポートに含める。単なる `OK` としない。
- レポートJSONに `contradictions` フィールドが存在することをコード側でも検証し、モデルが矛盾検出を省略した場合を検知できるようにする。

#### accept との連携

- `light` で pass したレポートも通常の `aide accept` を許可する。
- レポートおよびプールのメタデータには使用レベルを残し、後から監査できるようにする。
- accept 時にレポートの `observeLevel` と現在のヘッダ宣言を突き合わせ、レポートファイル手動改変によるすり抜けを防ぐ。
- `observe-level` を変更するとヘッダのハッシュが変わるため、既存レポートは自然に stale 扱いとなる（現行のハッシュ検証機構を維持）。
- 通常の accept は stale を必ず拒否する。`--force` は現行どおり stale 検査を迂回できる明示的な緊急回避手段として維持する。
- `light` でも矛盾検出、レーン本文のハッシュ検証、accept 前の stale 検査は省略しない。緩和対象は分割可能性のみに限定する。

#### 可視化

- CLIの開始ログに解決後のレベルを出力する。書式は `observe-level: light (explicit, 行N)` / `observe-level: strict (default)` のように、宣言由来か既定由来かを区別して示す。
- 未知値エラーのログは `不正値 'xxx' を行N で検出 — 許可値: light, strict` の並びで、検出値・許可値・宣言行番号を1行に揃える。
- `aide status --json` にも解決後のレベルを出力する。
- VS Code側は未観察・pass・fail に加えて、レポートで使用したレベルを説明欄で確認できるようにする。
- 未観察レーンでも現在の解決済みレベルを表示し、観察済みレーンでは現在値とレポート値を並べて表示する。両者が異なる場合はそれが stale の理由となる旨を説明する。

#### テスト方針

- 単体: 宣言なし・`strict` 明示の両方で分割可能性が要求されることを、プロンプト内容と生成レポートの両方で確認する。
- 単体: `light` では矛盾チェック文言が残り、分割可能性が合否条件に含まれないことを、プロンプト内容と判定関数の両方で確認する。レポートに `separability.checked: false` が出ることも見る。
- 単体: 未知値、空値、重複宣言（同値重複を含む）がエラーになることを確認する。
- 結合: `light` の pass を accept できること、Observe後にヘッダを `strict` へ変えると stale で accept できないこと（`--force` なし前提）を既存の accept テスト群へ追加する。`--force` の挙動は変更しない。
- 結合: `observeLevel` フィールドを持たない旧フォーマットのレポートを読み込んだ際に `accept` と `status` が正常動作すること（後方互換性）を検証する。

#### 文書化

- README、CLIヘルプ、VS Code README に、`light` と `strict` の違い、既定値、設定例、`light` でも残るチェックを記載する。
- 段階的ロールアウトは既定 `strict` のまま開始し、既存ユーザーの挙動が変わらないことを明示する。

#### 実装順序

1. `resolveObserveLevel` 純粋関数と単体テスト。
2. プロンプトビルダーの `light` / `strict` 分岐。
3. レポートスキーマ拡張（`separability` の形式固定、`observeLevel` メタデータ追加）。
4. accept / status の更新（レベル記録、突き合わせ、`contradictions` 検証）。
5. VS Code 表示更新。
6. 結合テスト（light pass→accept、header変更→stale reject、旧フォーマット互換）。
7. ドキュメント整備。

#### スコープ外

- `light` / `strict` 以外のレベル追加。
- ポリシー追加や例外ケースの詳細化。
- 実行時フラグや環境変数によるレベル上書き。

## 未決事項

## 変更履歴

- 2026-08-03: Observeシステムに `observe-level` によるレーン単位の厳しさ制御（`light` / `strict` の二段階）を追加。

## 人間が承認済み・統合待ちの知識（pool.md）

<!-- aide:pool
アクセプト済み・未統合の項目（ステージング）。`aide integrate` が消化する。
エントリの手編集はしない。
-->

## レーン索引

### ObserveSystem.md
- ## Observeシステムの改善案
- ### 最終決定

## 最新の観察結果

### ObserveSystem.md — pass/light
元レポート: reports/ObserveSystem-4.md

<!-- aide:report
lane: lanes/ObserveSystem.md
laneHash: 992b8a96f72a3145a85e70013d198f65677ece24c695bcdd3887187a92354505
verdict: pass
observeLevel: light
observeLevelSource: declared
date: 2026-08-03 18:33
-->

# 観察レポート: lanes/ObserveSystem.md (#4)

- verdict: **pass**
- 観察レベル: **light** (declared)
- 分割可能性: スキップ — observe-level: light のためスキップ（実装時に決められる詳細は合否対象外）
- 矛盾: なし

## 観察結果

マスター設計書および他レーンとの用語・インターフェース・前提の衝突はありません。

マスター設計書には競合するアクセプト済み仕様がなく、他レーンも存在しないため、判定は **pass** です。観察レベルが `light` のため、分割可能性は評価していません。
