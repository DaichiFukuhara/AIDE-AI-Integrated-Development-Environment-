---
{
  "operation_id": "OP-ADOPT-001",
  "kind": "adoption",
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
  "phase": "implementation",
  "criteria_version": 1,
  "subject_ref": "audits/subjects/ADOPT-001.json",
  "subject_hash": "e98d6292c725145dd0bb3c30da77ce42e6410b1551c2e37c8fbc3126202c2a7a",
  "delegation_ref": {
    "id": "DELEGATION-01",
    "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
    "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
    "semantic_revision": 1
  },
  "change_ids": [
    "CHANGE-001"
  ],
  "baseline_refs": {
    "CTX-LOG": "initial",
    "FIT-01": "initial",
    "SIT-01": "initial",
    "SYS-LOG": "initial"
  },
  "review_mode": "normal",
  "recovery_ref": null,
  "revision": 1,
  "state": "requested",
  "payload_hash": "b5d44f83737b591d55f2270de00b7b95088552e6db0f1eb311bce35416da8996",
  "base_revision": 20,
  "result_ref": null
}
---

# ローカル技術的試験採用の提案
TRIAL-001/002の失敗・未確認を残し、TRIAL-003の観測で提案。currentは独立監査受理までnull。本番配備と4実環境、本人評価は未確認。
