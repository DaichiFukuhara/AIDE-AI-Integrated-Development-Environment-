---
id: SG-MODEL
kind: subgoal
title: 意図と現在仕様を人が理解して訂正できる
parent: G-V3
depth: 1
status: published
revision: 6
design_revision: 3
parent_revision: 3
updated_at: '2026-09-22T00:47:13+09:00'
children:
- id: A-MODEL
  relation: all_of
  group: null
  selected: true
  responsibility: 記録形式、参照方法、読み順を選ぶ。日常の状態更新は配下systemが具体化する。
  expected_outcome: 一つの仕様を複製せず、目的と責任の二つの観点から読める表現を選ぶ。
  acceptance:
  - M1
  - M2
  - M3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
depends_on: []
owned_seams: []
seam_refs:
- id: S-CONTEXT
  owner: G-V3
  revision: 1
  role: producer
- id: S-PROPOSAL
  owner: G-V3
  revision: 1
  role: consumer
- id: S-AUDIT-INPUT
  owner: G-V3
  revision: 1
  role: producer
- id: S-AUDIT-RESULT
  owner: G-V3
  revision: 1
  role: consumer
source_refs:
- sources/requirements.md
unit_test_id: null
subgoal_integration_id: SIT-SG-MODEL
final_integration_id: FIT-G-V3
document: rationale
base_revision: 5
validation:
  structural:
    result: pass
    closure_id: CL-SG-MODEL-d3-t4-25d6868dd8cc
    checked_design_revision: 3
    checked_parent_design_revision: 3
    criteria:
    - A-01
    - A-02
    - A-03
    - B-01
    - B-02
    - B-03
    - C-01
    - C-02
    - C-03
    - C-04
    - D-01
    - D-02
    - D-03
    - D-04
    - E-01
    - E-02
    - E-03
    - F-01
    - F-02
    - F-03
    - G
    finding_ids: []
  semantic:
    result: pass
    closure_id: CL-SG-MODEL-d3-t4-25d6868dd8cc
    checked_design_revision: 3
    checked_parent_design_revision: 3
    criteria:
    - A-01
    - A-02
    - A-03
    - B-01
    - B-02
    - B-03
    - C-01
    - C-02
    - C-03
    - C-04
    - D-01
    - D-02
    - D-03
    - D-04
    - E-01
    - E-02
    - E-03
    - F-01
    - F-02
    - F-03
    - G
    finding_ids: []
next_action:
  role: orchestrate
  target: SG-MODEL
  done_when: 配下と引渡しの完了判定
---

# 意図と現在仕様を人が理解して訂正できる — 根拠

## 1. 入力根拠

入力はsources/requirements.md。ユーザー要求U1〜U8、既存v2の契約、可読性・運用ログを区別して参照する。古い複製版の問題を現行v2で実証済みの欠陥とみなさない。

## 2. 現在の判断

| decision ID | 設計の対象 | 理由 | 条件 |
| --- | --- | --- | --- |
| D-SG-MODEL | design.md §4〜7 | 理解できる説明と正本の一意性を同時に保つ必要がある。別の要約仕様を作ると同期の責任が増える。 | M1, M2, M3 |

## 3. 代替案

設計と人向け仕様を別の正本にする案は同期漏れを増やすため不採用。

選択済み: 目標階層とドメイン関係を併記し、仕様は一つの正本に置く。冒頭で意味を説明し、詳細契約へ進める。

再検討条件: 初回試行で文書更新負担が減らない、境界を跨ぐ修正が常態化する、意図や未確認事項を説明できない場合。

## 4. 仮定

入力のA1〜A5を継承する。初期はMarkdownと逐次反映で成立するという仮定で、外れたら並行実行・索引方式・監査周期を所有者の判断として改訂する。効率改善は推論であり計測結果ではない。

## 5. 分解候補

```yaml
candidate_ref: SG-MODEL-decomposition-1
parent_id: SG-MODEL
parent_design_revision: 3
next_kind: approach
children:
- id: A-MODEL
  relation: all_of
  group: null
  selected: true
  responsibility: 記録形式、参照方法、読み順を選ぶ。日常の状態更新は配下systemが具体化する。
  expected_outcome: 一つの仕様を複製せず、目的と責任の二つの観点から読める表現を選ぶ。
  acceptance:
  - M1
  - M2
  - M3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
  title: 正本への参照と同じ文書内の段階的説明
  provides_seams: []
  uses_seams: []
  non_responsibilities:
  - 実験実行の所有、監査結果の判定、利用者の許可範囲の拡大
parent_retains:
- 上位成果との統合確認
seams: []
unassigned_required_acceptance: []
unexplained_overlap: []
```

## 6. リスクと未解決事項

| ID | 内容 | owner | 扱い |
| --- | --- | --- | --- |
| R-SG-MODEL | 効率と理解の改善は未検証。規約を増やして逆に重くなる可能性。 | SG-MODEL | constrained: 後続試行で中断回数、最初の実物までの時間、手戻りと理解を評価する。 |
| O-SG-MODEL | 実行ツール、初期試行の具体的製品、環境ごとの予算。 | 将来の実装・試行担当 | constrained: §11の委任範囲。設計の公開契約を暗黙に変更しない。 |

## 7. finding

現在の版の構造・意味検査で記録する。結果はこの節とfrontmatterのworkflow情報に置き、意味snapshotへ含めない。

## 8. 検査結果

構造検査と意味検査は `CL-SG-MODEL-d3-t4-25d6868dd8cc` に対してpass。詳細: `checks/CL-SG-MODEL-d3-t4-25d6868dd8cc-structural.md` と `checks/CL-SG-MODEL-d3-t4-25d6868dd8cc-semantic.md`（設計ツリールート基準）。独立監査ではなく主担当の自己レビュー。

## 9. 変更影響

条件・責任・契約の変更はv2のchange eventにし、祖先統合、契約両端、条件継承先へ波及させる。意味のない表記変更で新しい意味版を発行しない。

今回の意味版は新規設計。v2の既存ノードや実行規約を書き換えない。

## 10. 現在の作業状態

frontmatterのstatus、revision、validation、next_actionを参照する。公開前はpending、公開後は設計完了として扱う。

## 11. 将来検証の根拠

| 対応 | 理由 |
| --- | --- |
| UT | 葉の単独責任を確認する予約ID。system以外はなし。 |
| SIT | 小目標の条件が配下systemで成立することを確認する予約ID。 |
| FIT | G1〜G6と契約の接続を全体として確認する予約ID。 |

## 12. system closure の根拠

該当なし。配下systemの目的チェーンへ含まれる。
