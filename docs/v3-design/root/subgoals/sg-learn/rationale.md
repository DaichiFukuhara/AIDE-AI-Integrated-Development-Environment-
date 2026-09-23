---
id: SG-LEARN
kind: subgoal
title: 最小の動作を試し、証拠で次の方法を選べる
parent: G-V3
depth: 1
status: published
revision: 20
design_revision: 7
parent_revision: 5
updated_at: '2026-09-22T22:33:51+09:00'
children:
- id: A-LEARN
  relation: all_of
  group: null
  selected: true
  responsibility: 試作着手の条件と学習ループの原理を所有する。コマンド実行方法と測定ツールは将来担当へ委任する。
  expected_outcome: 未確認事項を検証可能な実験へ変え、得られた証拠を現在仕様へ取り込む方法を決める。
  acceptance:
  - L1
  - L2
  - L3
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
  revision: 3
  role: consumer
- id: S-PROPOSAL
  owner: G-V3
  revision: 3
  role: producer
source_refs:
- sources/requirements.md
unit_test_id: null
subgoal_integration_id: SIT-SG-LEARN
final_integration_id: FIT-G-V3
document: rationale
base_revision: 19
validation:
  structural:
    result: pass
    closure_id: CL-SG-LEARN-d7-t57-a2b0bb2db666
    checked_design_revision: 7
    checked_parent_design_revision: 5
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
    closure_id: CL-SG-LEARN-d7-t57-a2b0bb2db666
    checked_design_revision: 7
    checked_parent_design_revision: 5
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
  target: SG-LEARN
  done_when: 配下と引渡しの完了判定
---

# 最小の動作を試し、証拠で次の方法を選べる — 根拠

## 1. 入力根拠

入力はsources/requirements.md。ユーザー要求U1〜U8、既存v2の契約、可読性・運用ログを区別して参照する。古い複製版の問題を現行v2で実証済みの欠陥とみなさない。

## 2. 現在の判断

| decision ID | 設計の対象 | 理由 | 条件 |
| --- | --- | --- | --- |
| D-SG-LEARN | design.md §4〜7 | 設計だけで方法の有効性は確認できず、比較と実使用が必要。失敗した仮説にも再試行を減らす価値がある。 | L1, L2, L3 |

今回の修正理由: 仕様hashだけの照合では実装・証拠の差替えを検知できないためsubjectを固定する。サイクル終了と取消はcontext間の公開契約とし、内部の保存技術だけを委任する。上位の契約改訂に従い、この枝の責任と検証条件を再確認する。

追加修正AV3-005: domain/contextも意味の正本なので、subjectへ不変参照集合を加える。共有定義の変更は全利用先へ影響計算し、定義と利用先を一括採用する。4階層は維持し、内容をsystem本文へ複製する方式は同期漏れを招くため採らない。

## 3. 代替案

全systemの設計完了後に実装する案は最初の検証が遅い。無制限に試す案は範囲と費用を守れない。

選択済み: 一つの未確認事項を実験にし、予算内で実装・関連テスト・実使用を行う。結果と限界を根拠に採否を提案する。

再検討条件: 初回試行で文書更新負担が減らない、境界を跨ぐ修正が常態化する、意図や未確認事項を説明できない場合。

## 4. 仮定

入力のA1〜A5を継承する。初期はMarkdownと逐次反映で成立するという仮定で、外れたら並行実行・索引方式・監査周期を所有者の判断として改訂する。効率改善は推論であり計測結果ではない。

## 5. 分解候補

```yaml
candidate_ref: SG-LEARN-decomposition-3
parent_id: SG-LEARN
parent_design_revision: 7
next_kind: approach
children:
- id: A-LEARN
  relation: all_of
  group: null
  selected: true
  responsibility: 試作着手の条件と学習ループの原理を所有する。コマンド実行方法と測定ツールは将来担当へ委任する。
  expected_outcome: 未確認事項を検証可能な実験へ変え、得られた証拠を現在仕様へ取り込む方法を決める。
  acceptance:
  - L1
  - L2
  - L3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
  title: 範囲を固定した実験と証拠付きの反映
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
| R-SG-LEARN | 効率と理解の改善は未検証。規約を増やして逆に重くなる可能性。 | SG-LEARN | constrained: 後続試行で中断回数、最初の実物までの時間、手戻りと理解を評価する。 |
| O-SG-LEARN | 実行ツール、初期試行の具体的製品、環境ごとの予算。 | 将来の実装・試行担当 | constrained: §11の委任範囲。設計の公開契約を暗黙に変更しない。 |

## 7. finding

現在の版の構造・意味検査で記録する。結果はこの節とfrontmatterのworkflow情報に置き、意味snapshotへ含めない。

## 8. 検査結果

構造検査と意味検査は `CL-SG-LEARN-d7-t57-a2b0bb2db666` に対してpass。詳細: `checks/CL-SG-LEARN-d7-t57-a2b0bb2db666-structural.md` と `checks/CL-SG-LEARN-d7-t57-a2b0bb2db666-semantic.md`（設計ツリールート基準）。独立監査ではなく主担当の自己レビュー。

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
