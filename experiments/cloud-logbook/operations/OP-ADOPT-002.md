---
{
  "operation_id": "OP-ADOPT-002",
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
  "subject_ref": {
    "id": "ADOPT-002",
    "immutable_ref": "design/snapshots/SN-c9f08e3889e13bd79044800d4c3758f7e89de4fe1c80a9b4cc10caac006b0ebb/files/audits/subjects/ADOPT-002.json",
    "sha256": "87771dbcf17f7410cec77e947fd85e5defa6076a4ec52f76138618627110851c"
  },
  "subject_hash": "4879824e8ef7935568ade85401bcfd7f311d126a53c00ee83660ec71d3d8263b",
  "delegation_ref": {
    "id": "DELEGATION-01",
    "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
    "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
    "semantic_revision": 1
  },
  "change_ids": [
    "CHANGE-001",
    "CHANGE-002"
  ],
  "baseline_refs": {
    "CTX-LOG": "initial",
    "FIT-01": "initial",
    "SIT-01": "initial",
    "SYS-LOG": "initial"
  },
  "review_mode": "normal",
  "recovery_ref": null,
  "previous_operation_id": "OP-ADOPT-001",
  "revision": 2,
  "state": "committed",
  "payload_hash": "4929d5368d1bfcbefb571b621c1897cf51ed04eb7d930b36e9781500d5111e88",
  "base_revision": 36,
  "result_ref": {
    "id": "AUD-ADOPT-002",
    "immutable_ref": "design/snapshots/SN-b8b093d9d560411450d3dfb284154696b239d7713edf544fcc8c25d58a2bfad7/files/audits/AUD-ADOPT-002.md",
    "sha256": "f3f94c7cb416631da6b6c5df52c4f6e40dd240ccf631a378370e06511a39efa2"
  },
  "result": "applied",
  "reflected_bundle": {
    "id": "BUNDLE-001",
    "immutable_ref": "design/snapshots/SN-fab1cd198c39ee2f406f70567117e5d71122b58da0ad97f93dc54eb969e868f3/files/design/candidates/OP-ADOPT-002/bundle.json",
    "sha256": "90c0dd3433cddb50240a8c1df5f8db70e5e9f11d82f9837caa6a6b6c6cef3742"
  },
  "record_ref": {
    "id": "AUD-ADOPT-002-RECORD-ACCEPTED",
    "immutable_ref": "design/snapshots/SN-b1284207bc4df31dc1febd284de6292a9c444bc4b6182e29f6685a3c7696aaad/files/evidence/AUD-ADOPT-002-record-accepted.md",
    "sha256": "f89649460e6e4ee033fde0e4cecb1d408404fc5146119da8249358e0098603eb"
  },
  "committed_at": "2026-10-03T11:15:31.443587+00:00"
}
---

# Auth修正後のローカル採用提案
自動29件合格。FITは未確認であり独立再監査待ち。旧失敗操作と累積差分を保持し、currentはnullのまま。

AUD-ADOPT-002を受理しローカル技術的試験のみ採用。提出時のFIT不足は独立監査が補完。旧失敗記録・未確認範囲・open minorは保存。stateの確定結果を参照する。
