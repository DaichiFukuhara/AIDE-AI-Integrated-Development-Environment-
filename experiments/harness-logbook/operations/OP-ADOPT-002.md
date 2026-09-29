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
  "subject_ref": "audits/subjects/ADOPT-002.json",
  "subject_hash": "dfa9272bbad7a6102b5a00787af56e6251068287a61252fee1dba4e9677f32bb",
  "delegation_ref": {
    "id": "DELEGATION-01",
    "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/operations/delegation.md",
    "sha256": "b8a963b0b669b593a5bf1262149940e23563f42cf0b5f322b2190d83c9da750f",
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
  "revision": 2,
  "state": "committed",
  "payload_hash": "2448f0aa6d9314d745df26ea9ca8549477ad65884080b0810e20ab1d4e54db39",
  "result_ref": {
    "id": "AUD-ADOPT-002",
    "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
    "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
  },
  "reflected_bundle": {
    "id": "BUNDLE-001",
    "immutable_ref": "design/snapshots/SN-afb709d14befc37ffe909fc08aef67e96574f36710a9ebc26941d66bb7be34ac/files/design/candidates/OP-ADOPT-002/bundle.json",
    "sha256": "b4090fe0cb3fcdfbef7c013da3416adc84b7279fef4e28546cbf8ba836fe8348"
  },
  "outcome": "applied"
}
---

# 修正後の試験採用提案

初回からの全体subjectを保持し、重大指摘の修正と新しい試行を再監査へ提出する。

同一subjectの独立監査を受理し、current・基準・差分の解消・監査予約精算を一括反映した。HUMAN-01は未確認で、製品全体完成ではない。
