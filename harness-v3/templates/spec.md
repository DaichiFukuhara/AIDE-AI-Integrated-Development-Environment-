---
id: <stable-id>
kind: <root_goal|subgoal|approach|system>
revision: 1
semantic_revision: 1
status: draft
primary_parent: <id-or-null>
parent_semantic_revision: <integer-or-null>
domain_id: <id-or-null>
context_id: <id-or-null>
source_refs: []
children: []
uses_systems: []
model_definition_refs: []
owned_seams: []
seam_refs: []
dependencies: []
unit_test_id: null
subgoal_integration_id: null
final_integration_id: null
---

# <この仕様で実現すること>

## 意味と理由

<誰が、何のために、何をできるようにするか。短い採用理由>

## 操作と結果

<正常な操作例、重要な例外、失敗・取消・再開時の結果>

## 守ること・できないこと

<責任、非責任、不変条件、制約、許可と委任の参照>

## 決定済みと未決

<今回決める意味、実装へ委任する内部選択、仮定と再確認条件>

## 詳細

<入力・出力・状態・品質・境界契約。owned_seamsはID、owner、from、to、意味版、全契約、失敗を持つ。
seam_refsはID、owner、意味版、producer/consumer役割を持つ。>

## 親条件と子への割当

<条件ID→担当子または親の統合責任。childrenはID、relation、group、selected、responsibility、expected_outcome、acceptance、constraints。
uses_systemsは対象ID、利用する役割、担当条件。systemはchildren=[]。>

## 受入条件と検証

| 条件ID | 観測できる成立状態 | UT/SIT/FIT・証拠 |
| --- | --- | --- |
| <id> | <期待する結果> | <対応ID・計画または不変の結果参照> |

利用者の理解: <確認済みの根拠 / 未確認>。根拠・代替案は対のrationaleへ。
