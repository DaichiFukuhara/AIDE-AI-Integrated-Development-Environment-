---
{
  "operation_id": "OP-CLOSE-001",
  "kind": "cycle_closed",
  "cycle_id": "C-001",
  "experiment_id": "E-001",
  "plan_revision": 1,
  "outcome": "reflected",
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "related_operations": [
    {
      "operation_id": "OP-PLAN-001",
      "state": "checked",
      "result": "audit-pass",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      }
    },
    {
      "operation_id": "OP-ADOPT-001",
      "state": "rejected",
      "result": "require-review",
      "result_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      }
    },
    {
      "operation_id": "OP-ADOPT-002",
      "state": "committed",
      "result": "applied",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-b8b093d9d560411450d3dfb284154696b239d7713edf544fcc8c25d58a2bfad7/files/audits/AUD-ADOPT-002.md",
        "sha256": "f3f94c7cb416631da6b6c5df52c4f6e40dd240ccf631a378370e06511a39efa2"
      }
    }
  ],
  "reflected_bundle": {
    "id": "BUNDLE-001",
    "immutable_ref": "design/snapshots/SN-fab1cd198c39ee2f406f70567117e5d71122b58da0ad97f93dc54eb969e868f3/files/design/candidates/OP-ADOPT-002/bundle.json",
    "sha256": "90c0dd3433cddb50240a8c1df5f8db70e5e9f11d82f9837caa6a6b6c6cef3742"
  },
  "closed_at": "2026-10-03T11:15:31.515218+00:00",
  "review_mode": "normal",
  "recovery_ref": null,
  "delegation_ref": {
    "id": "DELEGATION-01",
    "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
    "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
    "semantic_revision": 1
  },
  "revision": 2,
  "state": "committed",
  "payload_hash": "eeafb1603b99ef0a14fd185325cb23a3d578a5052a1b85c4e291b04ac87fab7c",
  "result": "acknowledged",
  "result_ref": "design/state.md#received_notifications/OP-CLOSE-001"
}
---

# cycle_closed
全関連操作の終端と反映bundle、未確認・次計画候補を通知。
通知受領・理由付きperiodic skip・ackをstateの同一更新で保存。製品全体完成はfalse。
