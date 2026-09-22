---
id: A-ASSURE
kind: approach
title: 監査基準版からの差分をDDDの観点で判定する
parent: SG-ASSURE
depth: 2
status: published
revision: 6
design_revision: 3
parent_revision: 3
updated_at: '2026-09-22T00:49:04+09:00'
children:
- id: S-AUDIT
  relation: all_of
  group: null
  selected: true
  responsibility: 監査方針、auditsの正本、指摘と基準版の判定を所有する。設計を書き換えず、S-AUDIT-RESULTで結果を返す。
  expected_outcome: 候補を日常確認で進めるか監査へ回すかを説明し、監査の完了または必要な修正を版付きで返せる。
  acceptance:
  - AQ1
  - AQ2
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
subgoal_integration_id: SIT-SG-ASSURE
final_integration_id: FIT-G-V3
document: rationale
base_revision: 5
validation:
  structural:
    result: pass
    closure_id: CL-A-ASSURE-d3-t14-3f489e0e3ea0
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
    closure_id: CL-A-ASSURE-d3-t14-3f489e0e3ea0
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
  target: A-ASSURE
  done_when: 配下と引渡しの完了判定
---

# 監査基準版からの差分をDDDの観点で判定する — 根拠

## 1. 入力根拠

入力はsources/requirements.md。ユーザー要求U1〜U8、既存v2の契約、可読性・運用ログを区別して参照する。古い複製版の問題を現行v2で実証済みの欠陥とみなさない。

## 2. 現在の判断

| decision ID | 設計の対象 | 理由 | 条件 |
| --- | --- | --- | --- |
| D-A-ASSURE | design.md §4〜7 | 共通の原則があっても、合否条件が曖昧なら監査の要求は増える。具体的な支障を根拠に終了条件を固定する。 | AQ1, AQ2 |

## 3. 代替案

DDD完全準拠という一語を合格基準にする案は適用範囲が曖昧。全パターンの実装要求は小規模実験の目的に合わない。

選択済み: 最後に監査した意味版と現在候補の差分から、言葉・責任・不変条件・接続の変化を判定する。全項目を形式的に埋めるより、適用理由と証拠を要求する。

再検討条件: 初回試行で文書更新負担が減らない、境界を跨ぐ修正が常態化する、意図や未確認事項を説明できない場合。

## 4. 仮定

入力のA1〜A5を継承する。初期はMarkdownと逐次反映で成立するという仮定で、外れたら並行実行・索引方式・監査周期を所有者の判断として改訂する。効率改善は推論であり計測結果ではない。

## 5. 分解候補

```yaml
candidate_ref: A-ASSURE-decomposition-1
parent_id: A-ASSURE
parent_design_revision: 3
next_kind: system
children:
- id: S-AUDIT
  relation: all_of
  group: null
  selected: true
  responsibility: 監査方針、auditsの正本、指摘と基準版の判定を所有する。設計を書き換えず、S-AUDIT-RESULTで結果を返す。
  expected_outcome: 候補を日常確認で進めるか監査へ回すかを説明し、監査の完了または必要な修正を版付きで返せる。
  acceptance:
  - AQ1
  - AQ2
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
  title: 変更の振り分けとDDD差分監査を管理する判定機構
  provides_seams: []
  uses_seams: []
  non_responsibilities:
  - 設計正本への直接書込み、実験の実行、利用者の許可範囲の拡大
parent_retains:
- 上位成果との統合確認
seams: []
unassigned_required_acceptance: []
unexplained_overlap: []
```

## 6. リスクと未解決事項

| ID | 内容 | owner | 扱い |
| --- | --- | --- | --- |
| R-A-ASSURE | 効率と理解の改善は未検証。規約を増やして逆に重くなる可能性。 | A-ASSURE | constrained: 後続試行で中断回数、最初の実物までの時間、手戻りと理解を評価する。 |
| O-A-ASSURE | 実行ツール、初期試行の具体的製品、環境ごとの予算。 | 将来の実装・試行担当 | constrained: §11の委任範囲。設計の公開契約を暗黙に変更しない。 |

## 7. finding

現在の版の構造・意味検査で記録する。結果はこの節とfrontmatterのworkflow情報に置き、意味snapshotへ含めない。

## 8. 検査結果

構造検査と意味検査は `CL-A-ASSURE-d3-t14-3f489e0e3ea0` に対してpass。詳細: `checks/CL-A-ASSURE-d3-t14-3f489e0e3ea0-structural.md` と `checks/CL-A-ASSURE-d3-t14-3f489e0e3ea0-semantic.md`（設計ツリールート基準）。独立監査ではなく主担当の自己レビュー。

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
