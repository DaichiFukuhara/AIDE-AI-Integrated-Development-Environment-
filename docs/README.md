# 最新版の資料

- [v3実行規約](../harness-v3/README.md): 現在使用するハーネスの入口
- [v3実装・検証記録](v3-implementation/README.md): 規約・テンプレート・補助ツールと実行例
- [v2実行規約](../harness-v2/README.md): 設計専用版
- [AIDE v2の全体設計](harness-v2-design.md): 目的、設計契約、到達点
- [ハーネス自身の設計](meta-design/index.md): 設計作成・引渡し・変更管理の責任分解
- [AIDE v3の設計](v3-design/README.md): v2で具体化した設計。Astra再監査pass、重大指摘5件を解消
- [過去の設計・レビュー・改善案](../archive/docs/): 作成時点の検討資料
- [会話・検証の記録](../logs/): 実験結果と検討の経緯

## 取り込み元

`harness-v2/` と全体設計・メタ設計は、ローカルブランチ `codex/aide-v2-design-harness-v2` のコミット
`674114510f053cdf46494f7d3f85cad5b3190240` から取り込みました。
全体設計の元パスは `design-v2/master.md`、メタ設計は `design-v2/tree/` です。
取り込み後は、最新版の案内と配置に伴うパス参照だけを更新しています。

v2全体設計中の相対参照 `../harness-v2/` は、リポジトリ直下のv2実行規約を指します。
