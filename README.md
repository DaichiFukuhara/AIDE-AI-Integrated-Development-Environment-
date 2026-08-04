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
