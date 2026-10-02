---
{
  "operation_id": "OP-PLAN-001",
  "kind": "plan",
  "experiment_id": "E-001",
  "plan_revision": 1,
  "cycle_id": "C-001",
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "base_bundle": null,
  "phase": "plan",
  "criteria_version": 1,
  "subject_ref": "audits/subjects/PLAN-001.json",
  "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
  "delegation_ref": {
    "id": "DELEGATION-01",
    "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
    "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
    "semantic_revision": 1
  },
  "change_ids": [],
  "review_mode": "normal",
  "recovery_ref": null,
  "revision": 2,
  "state": "checked",
  "payload_hash": "de74a9cc80e5c1f5836e10798e11e7cd04ae3c5452c1d094bff731fff82b6578",
  "audit_request_id": "AR-PLAN-001",
  "result_ref": {
    "id": "AUD-PLAN-001",
    "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
    "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
  }
}
---

# 初回計画監査依頼
未実装。ローカル採用と本番/四環境/本人の未確認条件を固定する。

独立計画監査を受理。current_bundleはnullのまま。未実装を成功扱いしない。
