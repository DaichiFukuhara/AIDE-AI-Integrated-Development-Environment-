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
  "subject_hash": "c2d13158576611b8628edae06a075415d905c7d2e13b8a91f5e6fa074193f6ae",
  "delegation_ref": {
    "id": "DELEGATION-01",
    "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/operations/delegation.md",
    "sha256": "b8a963b0b669b593a5bf1262149940e23563f42cf0b5f322b2190d83c9da750f",
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
  "revision": 2,
  "state": "rejected",
  "payload_hash": "3b3a2d915c667ddaeb9aaf04740808689fb1cd03fb44bf7e63cdd35ed73a4ea7",
  "base_revision": 16,
  "result_ref": {
    "id": "AUD-ADOPT-001",
    "immutable_ref": "design/snapshots/SN-08888bb614195fe493d4ddf547f9e9758f08f1eacfb5ad54bde052413d17608e/files/audits/AUD-ADOPT-001.md",
    "sha256": "9b357f0c192f705a2529fbf81a92c16e1217490e284ee6c8a734a0f8ed39c0c4"
  },
  "result": "require-review"
}
---

# 技術的試験採用の提案

TRIAL-001の制約を残し、修正後のTRIAL-002の必須条件成功を根拠に提案する。本人評価は未確認。currentは監査結果受理までnullのまま。

独立監査で重大指摘F-ADOPT-001。採用せず修正待ち。旧subjectと失敗結果を保持する。
