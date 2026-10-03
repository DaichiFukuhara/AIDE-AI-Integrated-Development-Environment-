---
{
  "operation_id": "OP-PLAN-002",
  "kind": "plan",
  "experiment_id": "E-002",
  "plan_revision": 1,
  "cycle_id": "C-002",
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "base_bundle": {
    "id": "BUNDLE-001",
    "immutable_ref": "design/snapshots/SN-fab1cd198c39ee2f406f70567117e5d71122b58da0ad97f93dc54eb969e868f3/files/design/candidates/OP-ADOPT-002/bundle.json",
    "sha256": "90c0dd3433cddb50240a8c1df5f8db70e5e9f11d82f9837caa6a6b6c6cef3742"
  },
  "base_revision": 43,
  "phase": "plan",
  "criteria_version": 2,
  "subject_ref": "audits/subjects/PLAN-002.json",
  "subject_hash": "d9835c76e2a240afe310b0c80e2e7387c312477d082b192d23b043ab09fd2308",
  "delegation_ref": {
    "id": "DELEGATION-02",
    "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/operations/delegation-002.md",
    "sha256": "ef9f016a14248e206e3942b588861c900f5ead281d54ae46923019242170a146",
    "semantic_revision": 1
  },
  "budget_account_refs": [
    "LOCAL-01",
    "LOCAL-E002"
  ],
  "review_delta_ref": {
    "id": "PLAN-DELTA-002",
    "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/design/candidates/OP-PLAN-002/change.json",
    "sha256": "4b0cd07c737b044b77af7f0f5caf1ba9f9813c72286c6be859bb44096220069f",
    "semantic_revision": 1
  },
  "change_ids": [],
  "change_refs": [
    {
      "id": "PLAN-DELTA-002",
      "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/design/candidates/OP-PLAN-002/change.json",
      "sha256": "4b0cd07c737b044b77af7f0f5caf1ba9f9813c72286c6be859bb44096220069f",
      "semantic_revision": 1
    }
  ],
  "review_mode": "normal",
  "recovery_ref": null,
  "revision": 2,
  "state": "rejected",
  "payload_hash": "e0d167958e173f37f3995199a759fb258b9da66b7852e4b22b87bfa8c76512ef",
  "audit_request_id": "AR-PLAN-002",
  "result_ref": {
    "id": "AUD-PLAN-002",
    "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
    "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
  },
  "result": "require-review"
}
---

# E-002の独立計画監査要求

構造確認後に監査要求を保存・予約し、未送信で停止する。currentはBUNDLE-001/IMPL-005。auto規約とhook内部境界の意味変更なので旧planのdaily-passを流用しない。UC-01〜03は未確認であり、plan合格後も実装の明示依頼前に開始しない。

AUD-PLAN-002のidentity完全一致を確認して受理。監査予約を親子両口座で1回精算し、major 1・minor 2をopen、plan scopeを保留とした。旧subject/要求/監査は固定参照のまま保持。
