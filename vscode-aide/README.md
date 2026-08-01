# AIDE — VS Code extension

AIDEの設計レーン、観察、Approve、統合、Markdown上のAI対話をVS Codeから操作する拡張です。
ロジックは同梱された`aide.js` / `mdtalk.js`をNode.jsの子プロセスとして実行します。

## 主な機能

- Activity BarのAIDEサイドバーでMaster、Lanes、Pool、Archiveを一覧
- レーンごとに未観察、pass、fail、観察後変更あり、AI対話中を表示
- 初期化、レーン作成、Observe、セクション／レーンApprove、Integrate
- 最新レポートやPoolエントリを該当位置で表示
- Markdownエディタのツールバー、CodeLens、ステータスバーからも操作可能
- 設計ファイルの変更を検出してサイドバーを自動更新

Integrateは`master.md`を書き換える前に確認します。ObserveとIntegrateは進捗通知からキャンセルできます。

## 必要環境

- VS Code 1.80以上
- Node.js 20以上（設定`aide.nodePath`、既定`node`）
- Observeを使う場合はCodex CLI
- AI対話／Integrateを使う場合はClaude CLI
- CLIを実行するため、信頼されたワークスペース

## インストール

PowerShellでVSIXをビルドしてインストールします。

```powershell
cd vscode-aide
npm install
npm run package
code --install-extension aide-buttons-0.2.0.vsix
```

VSIXにはAIDEエンジンが同梱されるため、`npm link`やAIDE本体のグローバルインストールは不要です。

## 設定

- `aide.designRoot`: ワークスペース内の設計ルート。既定`design`
- `aide.nodePath`: Node.js 20以上のコマンドまたは絶対パス。既定`node`

`aide.designRoot`には絶対パスやワークスペース外への相対パスを指定できません。

## 開発

リポジトリルートをVS Codeで開き、`vscode-aide`で依存関係をインストール後、F5で拡張機能開発ホストを起動します。

```powershell
cd vscode-aide
npm install
npm test
```
