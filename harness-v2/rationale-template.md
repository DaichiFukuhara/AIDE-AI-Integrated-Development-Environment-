# 設計根拠テンプレート

このテンプレートから各ノードの `rationale.md` を作る。これは生の作業履歴ではなく、
対応する設計版を現在も妥当と判断できる根拠である。

```yaml
---
id: <design.mdと同じnode-id>
document: rationale
status: draft | review-ready | validated | published | blocked | stale | superseded
revision: <design.mdと同じinteger>
design_revision: <design.mdと同じinteger>
parent_revision: <parent-design-revision-or-null>
base_revision: <操作開始時に読んだrevision>
updated_at: <ISO-8601>
validation:
  structural:
    result: pending | pass | fail
    closure_id: <authoring-closure-id-or-null>
    checked_design_revision: <integer-or-null>
    checked_parent_design_revision: <integer-or-null>
  semantic:
    result: pending | pass | fail
    closure_id: <authoring-closure-id-or-null>
    checked_design_revision: <integer-or-null>
    checked_parent_design_revision: <integer-or-null>
next_action:
  role: intake | author | decompose | precheck | review | orchestrate
  target: <node-id>
  done_when: <保存ファイルから判定できる条件>
---
```

## 1. 入力根拠

| source ref | 種別 | 要点 | 信頼範囲 | 反映した判断 |
| --- | --- | --- | --- | --- |
| `<source-id>` | 要求 / 既存設計 / 調査 / 規約 / 観測 | <要点> | <確実な範囲と限界> | `<decision-id>` |

- 外部資料は安定したパスまたは URL で参照する
- 直接確認できる事実と、そこから導いた推論を分ける
- 参照が失われても判断を理解できる最小限の要点を残す

## 2. 現在の判断

| decision ID | design.md の節 | 判断 | 根拠 | 支える条件ID |
| --- | --- | --- | --- | --- |
| `<decision-id>` | `<section>` | <現在の判断> | <この案を選ぶ理由> | `<goal/constraint/acceptance>` |

時系列ではなく、現在の設計を維持している理由を書く。

## 3. 代替案

| alternative ID | 案 | 採否 | 不採用理由 | 再検討条件 |
| --- | --- | --- | --- | --- |
| `<alternative-id>` | <案> | selected / not-selected | <現在の目的に劣る理由> | <どの条件が変われば戻すか> |

`one_of` の比較では group、選択基準、選択結果をここに残す。未選択案を必須経路の
設計ノードとして完成させる必要はない。

## 4. 仮定

| assumption ID | 仮定 | 置ける理由 | 外れた場合の影響 | 再確認トリガー |
| --- | --- | --- | --- | --- |
| `<assumption-id>` | <未確定事項の前提> | <安全性・可逆性> | <staleにする範囲> | <見直す事実> |

安全で可逆な仮定を置けない重大事項だけを `blocked` にする。

## 5. 分解候補

`system` は `該当なし` とする。非葉では、公開候補に含める子と条件割当を記載する。

```yaml
candidate_ref: <node-id>-decomposition-<sequence>
parent_id: <node-id>
parent_design_revision: <integer>
next_kind: <subgoal | approach | system>
children:
  - id: <child-id>
    title: <title>
    relation: all_of | one_of | optional
    group: <group-id-or-null>
    selected: true | false
    responsibility: <one sentence>
    expected_outcome: <observable result>
    acceptance: [<acceptance-id>]
    constraints: [<constraint-id>]
    provides_seams: [<seam-id>]
    uses_seams: [<seam-id>]
    non_responsibilities: [<text>]
parent_retains:
  - <統合責任>
seams:
  - id: <seam-id>
    owner: <node-id>
    from: <node-id>
    to: <node-id>
    direction: <direction>
    contract: <意味と保証>
    failure: <失敗時の扱い>
    revision: <integer>
unassigned_required_acceptance: []
unexplained_overlap: []
```

候補を確定したら、precheck より前に `selected: true` の子を staged stub として materialize し、
その子だけを `design.md` の「子への割り当て」と一致させる。未選択案は代替案として維持する。
staged child のID、path、design revision、candidate_ref を記録し、親が published になるまで
active な起草対象にはしない。

## 6. リスクと未解決事項

| ID | 種別 | 内容 | 影響 | owner | 解除・再検討条件 | status |
| --- | --- | --- | --- | --- | --- | --- |
| `<item-id>` | risk / open-question | <内容> | <影響> | `<node-id-or-source>` | <条件> | open / constrained / resolved |

## 7. finding

現在の設計版に対する finding を記録する。解消後も、その検査版が published になるまでは
`resolved` として保持する。

```yaml
- finding_id: <finding-id>
  severity: blocker | major | minor
  criterion: <criterion-id>
  location: <design-or-rationale-section>
  evidence: <観測事実>
  required_change: <修正後に満たす状態>
  status: open | resolved | waived
  waiver_reason: <waivedの場合のみ>
```

open の `blocker` または `major` が1件でもあれば `validated` に進めない。

## 8. 検査結果

```yaml
structural:
  result: pending | pass | fail
  closure_id: <authoring-closure-id-or-null>
  checked_design_revision: <integer-or-null>
  checked_parent_design_revision: <integer-or-null>
  criteria: [<criterion-id>]
  finding_ids: [<finding-id>]
semantic:
  result: pending | pass | fail
  closure_id: <authoring-closure-id-or-null>
  checked_design_revision: <integer-or-null>
  checked_parent_design_revision: <integer-or-null>
  criteria: [<criterion-id>]
  finding_ids: [<finding-id>]
summary: <判定根拠>
```

設計の意味または closure が参照する parent / dependency / seam / tree の版が変わったら、両結果を
`pending` に戻す。workflow metadata だけが変わった場合は、同じ closure IDへの結果を維持できる。

## 9. 変更影響

| trigger/event ID | 変化 | 影響する判断・seam | stale にする範囲 | 再開 role |
| --- | --- | --- | --- | --- |
| `<id>` | <祖先・依存・事実の変化> | `<decision/seam>` | `<node IDs/subtree>` | `author/decompose` |

### この版の変更理由

- **before design revision**: <integer-or-null>
- **after design revision**: <integer>
- **changed decisions**: <一覧>
- **reason**: <変更理由>
- **impact**: <影響範囲または意味変更なしの根拠>

## 10. 現在の作業状態

- **base revision**: <integer>
- **current revision / design revision**: <integer> / <integer>
- **status**: <status>
- **last completed role**: <role>
- **next role / target**: <role> / <node-id>
- **done when**: <保存ファイルから判定できる条件>
- **open blocker**: なし / <必要な外部事実と解除条件>
- **partial materialization**: なし / <candidate_ref、作成済みID、復旧方法>

## 11. 将来検証の根拠

- **unit_test_id の根拠**: `system` の責務境界との1対1対応 / 該当なし
- **subgoal_integration_id の根拠**: 小目標の統合条件と採用 system 集合 / 該当なし
- **final_integration_id の根拠**: root の最終成功条件 / 該当なし
- **テストへ変換する条件ID**: <一覧>

## 12. system closure の根拠

`system` 以外は `該当なし` とする。

- 責務境界が凝集している理由
- I/O、状態、エラー、品質条件が十分である根拠
- system 条件が subgoal と root の条件へつながる対応
- 委任事項が選択可能範囲として閉じている根拠
- immutable closure manifest の参照と、別ファイルの handoff 検査結果

## 更新規則

1. 2文書の論理更新ごとに、両方の `revision` を同じ値へ増やす
2. 設計、根拠、分解候補の意味が変わったら、両方の `design_revision` も増やす
3. status、finding、検査結果だけの更新では `design_revision` を維持する
4. 検査は同じ immutable authoring closure IDを対象に固定する
5. 設計の意味が変わったら検査結果を `pending` に戻し、status を `draft` にする
6. `validated` から `published` への変更は、closure 内の全意味版と tree revision に競合がない場合だけ行う
7. 更新前に `base_revision` と現在 revision を比較し、古い版を無条件に上書きしない
