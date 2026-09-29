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
  "subject_hash": "9431c95d8b589849d3eeca9c842f065818af2f284ef8be1dcb84b2cd4c567ae3",
  "delegation_ref": {
    "id": "DELEGATION-01",
    "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/operations/delegation.md",
    "sha256": "b8a963b0b669b593a5bf1262149940e23563f42cf0b5f322b2190d83c9da750f",
    "semantic_revision": 1
  },
  "change_ids": [],
  "review_mode": "normal",
  "recovery_ref": null,
  "revision": 2,
  "state": "checked",
  "payload_hash": "86081f3d77d0032f71304d9bb35037392d579b865b96c80c8a4b361eb6b34b9c",
  "audit_request_id": "AR-PLAN-001",
  "result_ref": {
    "id": "AUD-PLAN-001",
    "immutable_ref": "design/snapshots/SN-4442e0be12628716554f9ee4548c74953f99eb1f5ae698f3a4b618147922049b/files/audits/AUD-PLAN-001.md",
    "sha256": "424f817b160eb89cce4f5240e532c5660c0327d01fae94456f8fe22fefb9ca7a"
  }
}
---

# 計画の初回監査を依頼

未採用。計画段階の入力と確認条件だけを監査し、製品実装の成功は要求しない。

独立計画監査を受理。current_bundleはnullのまま。未実装を成功扱いしない。
