# AIDE

**最新版は [`harness-v3/`](harness-v3/README.md) です。**

AIDEは、AIとの対話で目標を具体化し、小さな実装・テスト・実使用から設計を育てる開発ハーネスです。
Markdownの規約・テンプレート・役割に、監査入力を固定する補助ツールと実行例を添えています。

## はじめる

1. [v3実行規約](harness-v3/README.md)を読む。
2. [入力の整理](harness-v3/roles/intake.md)で、目標と最初に試す範囲を決める。
3. [小規模実装の実行例](harness-v3/examples/task-summary/README.md)を試す。

AIに依頼するときの入口:

```text
harness-v3/README.md に従って、次の目標を開発してください。
目標: <実現したいこと>
プロジェクト: <保存先>
制約・既存の許可: <予算、変更範囲、外部公開の条件>
```

必要な枝から実装・検証し、採用した結果を設計へ反映します。設計だけを引き渡す場合は[v2](harness-v2/README.md)も利用できます。

## フォルダ構成

```text
.
├─ README.md                 このリポジトリの入口
├─ harness-v3/               実験・修正・設計反映を行う最新版
│  ├─ protocols/             記録・版・context間の受渡し
│  ├─ roles/                 各担当の実行手順
│  ├─ templates/             設計・計画・操作・監査の記録
│  ├─ criteria/              DDDとAIDEの確認基準
│  ├─ tools/                 不変snapshotの保存・検証
│  └─ examples/              小規模実装と修正の実行例
├─ harness-v2/               設計専用の旧安定版
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

設計の全体像は [AIDE v3の設計](docs/v3-design/README.md)、実装と検証は[v3実装記録](docs/v3-implementation/README.md)、旧パスの移動先は [archiveの案内](archive/README.md)を参照してください。
`archive/` 内の「v2」「現行」などの表現は、各資料を作成した当時の呼び名です。現在使う規約は `harness-v3/README.md` を入口にしてください。

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
