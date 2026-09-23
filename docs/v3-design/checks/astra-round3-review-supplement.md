---
event_id: EV-ASTRA-20260922-03
tree_revision: 80
reviewer: 主担当
independence: self-review
result: pass
---

# 第3改訂の検査記録の補足

新規CL検査記録の定型説明には前回イベントEV-ASTRA-20260922-01と旧4件への説明が残っている。今回の対象イベントはEV-ASTRA-20260922-03で、以下の固定closureに対する追加確認を記録する。前回の検査結果を新しい意味版へ流用したものではない。

AV3-005についてG-V3 §5、4本のseam版3、各systemのdomain/context版対応を照合した。共有定義だけが変わる反例ではmodel_definition_refsとsubject_hashが変わり、新要求と影響境界の監査が必要になる。参照先を再帰的に集め、未解決・矛盾版・owner不明はblocked。利用索引から全影響scopeを求め、currentの旧定義・新候補・過去保証を区別する。定義と利用先の一括切替はS-RECORD、計画と証拠の固定はS-CYCLE、対象集合と差分の照合はS-AUDITが所有する。

判定: D-01、D-03、E-01および意味レビュー2・5に対する設計上の不足は修正されている。F-03は今回の影響・失効・再公開イベントと親版・契約版3を照合しpass。これは主担当の自己レビューで、独立Astraの結果や製品テストを代用しない。

| ノード | 意味版 | 今回のauthoring closure |
| --- | --- | --- |
| G-V3 | 5 | CL-G-V3-d5-t51-142309b2a5f5 |
| SG-MODEL | 7 | CL-SG-MODEL-d7-t54-6ddecb861093 |
| A-MODEL | 7 | CL-A-MODEL-d7-t63-b29c072bcfe0 |
| S-RECORD | 6 | CL-S-RECORD-d6-t72-ce8b8a1e4cb8 |
| SG-LEARN | 7 | CL-SG-LEARN-d7-t57-a2b0bb2db666 |
| A-LEARN | 7 | CL-A-LEARN-d7-t66-d113e5afaca6 |
| S-CYCLE | 6 | CL-S-CYCLE-d6-t75-ccbe66730615 |
| SG-ASSURE | 7 | CL-SG-ASSURE-d7-t60-c83fb788965d |
| A-ASSURE | 7 | CL-A-ASSURE-d7-t69-29308d42e2d3 |
| S-AUDIT | 6 | CL-S-AUDIT-d6-t78-35ada102b0b2 |
