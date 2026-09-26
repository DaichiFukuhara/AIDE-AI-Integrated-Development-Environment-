---
subject_hash: <SHA-256-of-body-json>
---

# 固定した監査対象

以下のJSONオブジェクトだけを規約化する。結果・状態を追加しない。

```json
{
  "scope": ["<condition-or-system-id>"],
  "phase": "plan",
  "spec_refs": [],
  "contract_refs": [],
  "model_definition_refs": [],
  "model_definitions_not_applicable_reason": null,
  "plan_ref": "<immutable-ref>",
  "plan_revision": 1,
  "evaluation_ref": "<immutable-ref>",
  "implementation_ref": null,
  "trial_refs": [],
  "evidence_refs": [],
  "delegation_ref": "<immutable-authorization-ref>",
  "recovery_ref": null,
  "unverified": []
}
```

空配列は必要な入力を省略する許可ではない。[subject契約](../protocols/subject.md)で適用を確認する。
