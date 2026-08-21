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

# AIが独立した論点を見つけると、レーン内に「分割の提案」を表示
# 人間が作成・このまま続行・保留・却下を判断

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
| `aide proposal <lane.md> <id> <action>` | AIのレーン分割案を判断（`create` / `continue` / `defer` / `reject`） |
| `aide observe <lane.md>` | 矛盾や分割可能性をレビュー |
| `aide accept <lane.md>` | レビュー済み内容をプールへ追加 |
| `aide integrate [root]` | プールをマスター設計へ統合 |
| `aide knowledge [root]` | 共有知識ファイルを再生成 |
| `aide status [root] [--json]` | 現在の状態を表示 |
| `aide mcp --root <絶対パス>` | MCPサーバーを起動（stdio・読み取り専用） |

### レーン分割の提案

`mdtalk`は、現在のレーンから独立して検討でき、固有の目的・成果・境界を持つ論点を見つけると、レーンを自動作成せずに分割案を提示します。提案には分割理由、新レーンの目的、対象範囲、依存関係が含まれます。

人間はVS CodeまたはCLIで次のいずれかを選びます。

- `create`: 提案内容を引き継いだ子レーンを作成
- `continue`: 現在のレーン内で検討を続ける
- `defer`: 後で判断するため保留
- `reject`: 却下し、同じ論点の再提案を抑制

同一レーンには判断待ちの提案を同時に1件しか追加せず、既に記録された同一topicは再提案しません。新規レーンは、目的、対象範囲、関係者、品質目標・制約、依存関係、選択肢、リスク、受け入れ条件を持つ構造化テンプレートから始まります。

`pending`または`deferred`の提案が残っているレーンはApproveできません。`--force`でもこの判断は迂回せず、作成・続行・却下のいずれかを人間が明示します。

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

## MCPサーバー

`aide mcp`は、実装中のAIエージェント（Codex、Claude Codeなど）が、コードを書く前に「この作業は設計のどこに対応するか」をAIDEへ問い合わせるための窓口です。stdio上のJSON-RPCで動き、**設計ファイルへ一切書き込みません**。

```sh
aide mcp --root /abs/path/to/design
```

`--root`は`design`ディレクトリの絶対パスです。外部エージェントが引数を組み立てるため、カレントディレクトリには依存しません。

| ツール | 内容 |
| --- | --- |
| `aide_check_design` | 依頼文から該当する設計を探す。**実装前の入口はこれ1つ** |
| `aide_get_section` | `aide_check_design`が返したセクションの本文を読む |
| `aide_status` | 全体状況（診断用） |

`observe` / `accept` / `integrate` は公開しません。人間のボタンだからです。

### authority — 承認済みと下書きを混同しない

`aide_check_design`が返すセクションには必ず出所が付きます。

- `master`: 統合済みの正
- `accepted_pool`: 人間が承認したが未統合
- `draft_lane`: **未承認の作業中。仕様ではない**

実装の根拠に使えるのは`approvedSections`だけです。`relatedDrafts`は参考情報で、これを根拠に実装してはいけません。

### outcome と stopRequired

| outcome | 意味 | stopRequired |
| --- | --- | --- |
| `covered` | 承認済み設計への強い一致が見つかった | false |
| `draft_only` | 一致したのは未承認の下書きだけ | true |
| `unknown` | 一致なし、または一致が弱い | true |

`covered`は**「字面が強く一致した」という意味であり、依頼された振る舞いがすべて仕様化されている証明ではありません**。本文を読んでも決まっていない製品判断が残る場合は、実装せず人間に確認してください。

検索は見出しの語による素朴な一致なので、**一致が弱い場合は`covered`にせず`unknown`で止めます**。長い語が1つ当たっただけでは足りず、その語が索引内で希少であることも要求します（`storage`のような一般語で実装許可が出ないようにするため）。「設計が存在しない」ことは証明できないため、一致ゼロも`missing`ではなく`unknown`を返します。

レーンは承認後も残り続けるため、下書きの併存だけでは停止させません（警告が常態化するとゲート全体が無視されるため）。`signals`に非ブロッキングの注意として出します。

一方、**本文や候補を切り詰めたときは停止します**。読めていない後半に制約がある可能性があるためです（`truncated` / `approvedSectionsTruncated`）。

### 登録例

Codex（`~/.codex/config.toml`）:

```toml
[mcp_servers.aide]
command = "node"
args = ["C:/abs/path/to/aide.js", "mcp", "--root", "C:/abs/path/to/design"]
```

Claude Code:

```sh
claude mcp add aide -- node /abs/path/to/aide.js mcp --root /abs/path/to/design
```

`aide` コマンドではなく `node <aide.jsの絶対パス>` で登録しています。npm製CLIはWindowsでは`aide.cmd`というshimになり、MCPホストがシェルを介さずにプロセスを起動する場合に解決できないためです（`callBackend`が同じ問題に対処しています）。

なお、MCPは**強制装置ではありません**。通常のファイル編集ツールを横取りできないため、エージェントに「聞きやすくする」ことはできても「必ず止める」ことはできません。確実に止めたい場合はpre-write hookやCIが別途必要です。

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

## 未決事項

## 変更履歴

## 人間が承認済み・統合待ちの知識（pool.md）

<!-- aide:pool
アクセプト済み・未統合の項目（ステージング）。`aide integrate` が消化する。
エントリの手編集はしない。
-->

## レーン索引

### concept.md
- ## 目的 / 背景
- ## 対象範囲
- ## 利用者・関係者
- ## 品質目標・制約
- ## 依存関係・インターフェース
- ## 選択肢・判断
- ## リスク・未決事項
- ## 最初に決めたいこと
- ## 受け入れ条件

## 最新の観察結果

（観察レポートなし）
