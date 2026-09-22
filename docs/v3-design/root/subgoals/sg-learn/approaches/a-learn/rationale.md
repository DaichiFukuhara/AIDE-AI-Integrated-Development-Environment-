---
id: A-LEARN
kind: approach
title: 範囲を固定した実験と証拠付きの反映
parent: SG-LEARN
depth: 2
status: published
revision: 6
design_revision: 3
parent_revision: 3
updated_at: '2026-09-22T00:48:59+09:00'
children:
- id: S-CYCLE
  relation: all_of
  group: null
  selected: true
  responsibility: experimentsの正本と作業予算を所有する。設計bundleの反映はS-RECORD、監査の判定はS-AUDITへ渡す。
  expected_outcome: 今回作る最小動作とその結果を保存し、再開・修正・採用・破棄を一意に進められる。
  acceptance:
  - AL1
  - AL2
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
seam_refs: []
source_refs:
- sources/requirements.md
unit_test_id: null
subgoal_integration_id: SIT-SG-LEARN
final_integration_id: FIT-G-V3
document: rationale
base_revision: 5
validation:
  structural:
    result: pass
    closure_id: CL-A-LEARN-d3-t12-a62a96833319
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
    closure_id: CL-A-LEARN-d3-t12-a62a96833319
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
  target: A-LEARN
  done_when: 配下と引渡しの完了判定
---

# 範囲を固定した実験と証拠付きの反映 — 根拠

## 1. 入力根拠

入力はsources/requirements.md。ユーザー要求U1〜U8、既存v2の契約、可読性・運用ログを区別して参照する。古い複製版の問題を現行v2で実証済みの欠陥とみなさない。

## 2. 現在の判断

| decision ID | 設計の対象 | 理由 | 条件 |
| --- | --- | --- | --- |
| D-A-LEARN | design.md §4〜7 | 許可、仮説、証拠を分けることで人間の専門知識への依存と、試験合格を理由にした範囲拡大を減らせる。 | AL1, AL2 |

## 3. 代替案

常に捨てる試作品と常に本実装へ直結する方式を比較し、成果と品質条件に応じて採用または破棄を選ぶ方式にする。

選択済み: 実験計画・許可範囲・基準版・評価条件を固定し、候補を試す。採用時にだけ設計反映案を返し、失敗と不明も結果として残す。

再検討条件: 初回試行で文書更新負担が減らない、境界を跨ぐ修正が常態化する、意図や未確認事項を説明できない場合。

## 4. 仮定

入力のA1〜A5を継承する。初期はMarkdownと逐次反映で成立するという仮定で、外れたら並行実行・索引方式・監査周期を所有者の判断として改訂する。効率改善は推論であり計測結果ではない。

## 5. 分解候補

```yaml
candidate_ref: A-LEARN-decomposition-1
parent_id: A-LEARN
parent_design_revision: 3
next_kind: system
children:
- id: S-CYCLE
  relation: all_of
  group: null
  selected: true
  responsibility: experimentsの正本と作業予算を所有する。設計bundleの反映はS-RECORD、監査の判定はS-AUDITへ渡す。
  expected_outcome: 今回作る最小動作とその結果を保存し、再開・修正・採用・破棄を一意に進められる。
  acceptance:
  - AL1
  - AL2
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
  title: 実験計画・実行結果・採否を管理する学習機構
  provides_seams: []
  uses_seams: []
  non_responsibilities:
  - 設計正本への直接書込み、監査結果の判定、利用者の許可範囲の拡大
parent_retains:
- 上位成果との統合確認
seams: []
unassigned_required_acceptance: []
unexplained_overlap: []
```

## 6. リスクと未解決事項

| ID | 内容 | owner | 扱い |
| --- | --- | --- | --- |
| R-A-LEARN | 効率と理解の改善は未検証。規約を増やして逆に重くなる可能性。 | A-LEARN | constrained: 後続試行で中断回数、最初の実物までの時間、手戻りと理解を評価する。 |
| O-A-LEARN | 実行ツール、初期試行の具体的製品、環境ごとの予算。 | 将来の実装・試行担当 | constrained: §11の委任範囲。設計の公開契約を暗黙に変更しない。 |

## 7. finding

現在の版の構造・意味検査で記録する。結果はこの節とfrontmatterのworkflow情報に置き、意味snapshotへ含めない。

## 8. 検査結果

構造検査と意味検査は `CL-A-LEARN-d3-t12-a62a96833319` に対してpass。詳細: `checks/CL-A-LEARN-d3-t12-a62a96833319-structural.md` と `checks/CL-A-LEARN-d3-t12-a62a96833319-semantic.md`（設計ツリールート基準）。独立監査ではなく主担当の自己レビュー。

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
