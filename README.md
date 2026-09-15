# AIDE

**最新版は [`harness-v2/`](harness-v2/README.md) です。**

AIDEは、AIとの対話を通じて、大本の目標を実装可能なシステム設計まで具体化するための設計ハーネスです。
現在のハーネスはMarkdownの規約・テンプレート・役割で構成されます。

## はじめる

1. [最新版の実行規約](harness-v2/README.md)を読む。
2. [入力の整理](harness-v2/roles/intake.md)から、大本の目標を設計ツリーへ落とし込む。
3. [書店の設計例](harness-v2/examples/bookstore.md)で、具体的な成果物を確認する。

AIに依頼するときの入口:

```text
harness-v2/README.md に従って、次の目標を設計してください。
目標: <実現したいこと>
保存先: design-tree/
```

`design-tree/` は利用時に作る成果物の保存先です。到達点は設計ファイルと設計閉包で、実装・テストは将来フェーズへ引き渡します。

## フォルダ構成

```text
.
├─ README.md                 このリポジトリの入口
├─ harness-v2/               最新版の設計ハーネス
│  ├─ README.md              実行規約
│  ├─ roles/                 各工程の役割
│  ├─ criteria/              品質基準・設計前例
│  ├─ examples/              設計例
│  ├─ node-template.md       設計書のテンプレート
│  └─ rationale-template.md  根拠のテンプレート
├─ docs/                     最新版の全体設計・資料案内
├─ logs/                     会話・検証の記録
└─ archive/                  旧版・旧CLI・過去の設計資料
   ├─ harness/               旧ハーネス
   ├─ design-v2/             旧ハーネスの設計ツリー・検討資料
   ├─ v2/                    旧構想の下書き
   ├─ docs/                  過去の設計・レビュー・改善案
   └─ legacy-cli/            旧CLI・MCP・VS Code拡張・テスト
```

設計の全体像は [AIDE v2の設計](docs/harness-v2-design.md)、旧パスの移動先は [archiveの案内](archive/README.md)を参照してください。
`archive/` 内の「v2」「現行」などの表現は、各資料を作成した当時の呼び名です。現在使う規約は `harness-v2/README.md` を入口にしてください。

## 旧CLIを使う場合

[旧CLIのREADME](archive/legacy-cli/README.md)を参照してください。実行場所は `archive/legacy-cli/` です。

```sh
cd archive/legacy-cli
npm test
# CLIをコマンドとして登録する場合
npm link
```

以前の配置で `npm link` していた場合は、移動先で再実行してください。MCPなどに絶対パスを登録している場合も、新しい `archive/legacy-cli/aide.js` のパスへ更新してください。
VS Code拡張の開発では `archive/legacy-cli/` をワークスペースとして開きます。

## License

[MIT](LICENSE)
