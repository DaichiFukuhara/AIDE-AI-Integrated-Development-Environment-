# テンプレートの使い分け

山括弧は実際の値へ置換する。nullと空配列は本文の適用条件が許す場合だけ使用する。
任意項目のために空の文書を量産しない。仕様・根拠と、実験・操作・監査の結果は正本の所有者を分ける。

| 保存物 | テンプレート |
| --- | --- |
| master / subgoal / approach / system | [spec](spec.md) + [rationale](rationale.md) |
| domain/contextの意味定義 | [model](model.md) + rationale |
| 現在参照・台帳・送信待ち | [state](state.md) |
| 一回の計画とサイクル状態 | [experiment](experiment.md) |
| 一回の不変試行・証拠 | [trial](trial.md) |
| plan/adoption/withdrawal/cycle_closed/監査要求 | [operation](operation.md) |
| 固定する監査対象 | [subject](subject.md) |
| 日常確認・独立監査・取消への応答 | [audit](audit.md) |

版付き参照の例（プロジェクト相対）: `{id: S-ONE, semantic_revision: 1, immutable_ref: "design/snapshots/SN-<hash>/files/design/domains/work/systems/one/design.md"}`。
操作結果や監査判定を固定subjectへ書き足さない。snapshot補助ツールが保存するmanifestはツールが生成する。
