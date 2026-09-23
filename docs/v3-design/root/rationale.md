---
id: G-V3
kind: root_goal
title: 試して学び、意図と現在の状態を説明できる開発
parent: null
depth: 0
status: published
revision: 18
design_revision: 5
parent_revision: null
updated_at: '2026-09-22T22:33:47+09:00'
children:
- id: SG-MODEL
  relation: all_of
  group: null
  selected: true
  responsibility: G1・G2の所有。記録の現在性とG6の競合回復を担当する。実験の実行と監査の判定は担当しない。
  expected_outcome: 利用者と実装担当が、同じ保存情報から目的、現在の動作、制約、未確認事項を説明できる。
  acceptance:
  - G1
  - G2
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
- id: SG-LEARN
  relation: all_of
  group: null
  selected: true
  responsibility: G3の所有。G6の失敗・取消・結果の古さへの対応を担う。設計正本への書込み判定は記録側へ依頼する。
  expected_outcome: 利用者が全体設計の完成を待たず動く結果を試し、方法の採用・変更・終了を判断できる。
  acceptance:
  - G3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
- id: SG-ASSURE
  relation: all_of
  group: null
  selected: true
  responsibility: G4・G5の所有。G6の重大欠陥・監査失効への対処を担う。仕様の起草と実験の実行を所有しない。
  expected_outcome: 利用者が小変更で毎回止まらず、変更の意味と監査の保証範囲を説明できる。
  acceptance:
  - G4
  - G5
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
subgoal_integration_id: null
final_integration_id: FIT-G-V3
document: rationale
base_revision: 17
validation:
  structural:
    result: pass
    closure_id: CL-G-V3-d5-t51-142309b2a5f5
    checked_design_revision: 5
    checked_parent_design_revision: null
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
    closure_id: CL-G-V3-d5-t51-142309b2a5f5
    checked_design_revision: 5
    checked_parent_design_revision: null
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
  target: G-V3
  done_when: 配下と引渡しの完了判定
---

# 試して学び、意図と現在の状態を説明できる開発 — 根拠

## 1. 入力根拠

入力はsources/requirements.md。ユーザー要求U1〜U8、既存v2の契約、可読性・運用ログを区別して参照する。古い複製版の問題を現行v2で実証済みの欠陥とみなさない。

## 2. 現在の判断

| decision ID | 設計の対象 | 理由 | 条件 |
| --- | --- | --- | --- |
| D-G-V3 | design.md §4〜7 | 小規模実装の学び、現在仕様の理解、更新の信頼は別々に確認できる成果で、三つが揃って目的を満たす。 | G1, G2, G3, G4, G5, G6 |

今回の修正理由: 仕様hashだけの照合では実装・証拠の差替えを検知できないためsubjectを固定する。サイクル終了と取消はcontext間の公開契約とし、内部の保存技術だけを委任する。上位の契約改訂に従い、この枝の責任と検証条件を再確認する。

追加修正AV3-005: domain/contextも意味の正本なので、subjectへ不変参照集合を加える。共有定義の変更は全利用先へ影響計算し、定義と利用先を一括採用する。4階層は維持し、内容をsystem本文へ複製する方式は同期漏れを招くため採らない。

## 3. 代替案

現行v2をそのまま利用する案は将来実装への引渡しで終わる。ドメインだけの木に置換する案は目的の追跡が弱くなるため不採用。

選択済み: 目標の4階層を骨格として保持する。ドメインは責任と言葉の境界として重ねる。実験・反映・定期監査を同じ保存情報から再開する。

再検討条件: 初回試行で文書更新負担が減らない、境界を跨ぐ修正が常態化する、意図や未確認事項を説明できない場合。

## 4. 仮定

入力のA1〜A5を継承する。初期はMarkdownと逐次反映で成立するという仮定で、外れたら並行実行・索引方式・監査周期を所有者の判断として改訂する。効率改善は推論であり計測結果ではない。

## 5. 分解候補

```yaml
candidate_ref: G-V3-decomposition-3
parent_id: G-V3
parent_design_revision: 5
next_kind: subgoal
children:
- id: SG-MODEL
  relation: all_of
  group: null
  selected: true
  responsibility: G1・G2の所有。記録の現在性とG6の競合回復を担当する。実験の実行と監査の判定は担当しない。
  expected_outcome: 利用者と実装担当が、同じ保存情報から目的、現在の動作、制約、未確認事項を説明できる。
  acceptance:
  - G1
  - G2
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
  title: 意図と現在仕様を人が理解して訂正できる
  provides_seams:
  - S-CONTEXT
  - S-AUDIT-INPUT
  uses_seams:
  - S-PROPOSAL
  - S-AUDIT-RESULT
  non_responsibilities:
  - 実験実行の所有、監査結果の判定、利用者の許可範囲の拡大
- id: SG-LEARN
  relation: all_of
  group: null
  selected: true
  responsibility: G3の所有。G6の失敗・取消・結果の古さへの対応を担う。設計正本への書込み判定は記録側へ依頼する。
  expected_outcome: 利用者が全体設計の完成を待たず動く結果を試し、方法の採用・変更・終了を判断できる。
  acceptance:
  - G3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
  title: 最小の動作を試し、証拠で次の方法を選べる
  provides_seams:
  - S-PROPOSAL
  uses_seams:
  - S-CONTEXT
  non_responsibilities:
  - 設計正本への直接書込み、監査結果の判定、利用者の許可範囲の拡大
- id: SG-ASSURE
  relation: all_of
  group: null
  selected: true
  responsibility: G4・G5の所有。G6の重大欠陥・監査失効への対処を担う。仕様の起草と実験の実行を所有しない。
  expected_outcome: 利用者が小変更で毎回止まらず、変更の意味と監査の保証範囲を説明できる。
  acceptance:
  - G4
  - G5
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
  title: 必要な監査だけで意味と整合性を保てる
  provides_seams:
  - S-AUDIT-RESULT
  uses_seams:
  - S-AUDIT-INPUT
  non_responsibilities:
  - 設計正本への直接書込み、実験の実行、利用者の許可範囲の拡大
parent_retains:
- G6の全体整合
seams:
- id: S-CONTEXT
  owner: G-V3
  revision: 3
  canonical_ref: design.md:owned_seams
- id: S-PROPOSAL
  owner: G-V3
  revision: 3
  canonical_ref: design.md:owned_seams
- id: S-AUDIT-INPUT
  owner: G-V3
  revision: 3
  canonical_ref: design.md:owned_seams
- id: S-AUDIT-RESULT
  owner: G-V3
  revision: 3
  canonical_ref: design.md:owned_seams
unassigned_required_acceptance: []
unexplained_overlap: []
```

## 6. リスクと未解決事項

| ID | 内容 | owner | 扱い |
| --- | --- | --- | --- |
| R-G-V3 | 効率と理解の改善は未検証。規約を増やして逆に重くなる可能性。 | G-V3 | constrained: 後続試行で中断回数、最初の実物までの時間、手戻りと理解を評価する。 |
| O-G-V3 | 実行ツール、初期試行の具体的製品、環境ごとの予算。 | 将来の実装・試行担当 | constrained: §11の委任範囲。設計の公開契約を暗黙に変更しない。 |

## 7. finding

現在の版の構造・意味検査で記録する。結果はこの節とfrontmatterのworkflow情報に置き、意味snapshotへ含めない。

## 8. 検査結果

構造検査と意味検査は `CL-G-V3-d5-t51-142309b2a5f5` に対してpass。詳細: `checks/CL-G-V3-d5-t51-142309b2a5f5-structural.md` と `checks/CL-G-V3-d5-t51-142309b2a5f5-semantic.md`（設計ツリールート基準）。独立監査ではなく主担当の自己レビュー。

## 9. 変更影響

条件・責任・契約の変更はv2のchange eventにし、祖先統合、契約両端、条件継承先へ波及させる。意味のない表記変更で新しい意味版を発行しない。

EV-ASTRA-20260922-01による再設計。AV3-001〜003の公開契約を改訂し、親版・両端参照を伝播する。AV3-004の旧閉包は訂正検査で補い、歴史を上書きしない。v2実行規約は変更しない。

現在の再設計イベントはEV-ASTRA-20260922-03。前回の修正・訂正記録は履歴として保持する。

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
