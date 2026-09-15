# 旧版・過去資料

**最新版は [harness-v2](../harness-v2/README.md) です。**

ここには、旧ハーネス、旧CLIと、その時点の設計・検討資料を保存しています。
既存の未コミット変更も移動先に引き継いでいます。

## 移動先

| 以前の場所 | 現在の場所 | 内容 |
| --- | --- | --- |
| `harness/` | [harness/](harness/README.md) | `index.md` と `record.md` を使う旧ハーネス |
| `design-v2/` | [design-v2/](design-v2/) | 旧ハーネスの設計ツリーとレーン |
| `v2/` | [v2/](v2/AIDEv2-design.md) | 旧構想の下書き |
| `docs/` | [docs/](docs/) | 過去の設計、レビュー、改善案 |
| ルートのJS・`package.json` | [legacy-cli/](legacy-cli/README.md) | 旧CLI・MCPの実装 |
| `design/`・`test/`・`fixtures/` | `legacy-cli/` 配下の同名フォルダ | 旧CLIの設計成果物・テスト |
| `vscode-aide/`・`.vscode/` | `legacy-cli/` 配下の同名フォルダ | VS Code拡張・開発設定 |
| `design.md`・`design.minutes.md`・`test.md`・`.mdtalk/` | `legacy-cli/` 配下の同名ファイル・フォルダ | ローカルの動作確認用ファイル・状態 |
| ルートの旧 `README.md` | [legacy-cli/README.md](legacy-cli/README.md) | 旧CLIの操作説明 |

過去の判断記録やコード内の旧パス表記は、当時の内容として保存しています。旧ハーネスと旧設計資料のルート相対パスは、この `archive/` を基準に読み替えてください。
旧CLIの実行時の基準は `archive/legacy-cli/` です。過去資料の `aide.js` などはこのフォルダを参照します。

旧CLIの実行方法は [旧CLIのREADME](legacy-cli/README.md)にあります。
