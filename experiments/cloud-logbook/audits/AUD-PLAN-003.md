---
{
  "audit_id": "AUD-PLAN-003",
  "audit_request_id": "AR-PLAN-003",
  "origin_operation_id": "OP-PLAN-003",
  "target_operation_id": null,
  "kind": "plan",
  "review_mode": "normal",
  "recovery_ref": null,
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "phase": "plan",
  "subject_hash": "12b4d977ec81c54f4b914d1cf1a628ef22b5a2635d2427cdb480839571c5b8d7",
  "subject_ref": "design/snapshots/SN-2b689218bab304597638d8a4f2e76a929a5bae3285f5f1dd0494ca49a37578e9/files/audits/subjects/PLAN-003.json",
  "baseline_refs": {
    "CTX-LOG": {
      "audit_request_id": "AR-PLAN-001",
      "subject_ref": {
        "id": "PLAN-001",
        "immutable_ref": "design/snapshots/SN-156f567a982e8062ea128ebee3febff4987104f4bf178754865ab7dff0ac52f5/files/audits/subjects/PLAN-001.json",
        "sha256": "8ed8fe5ca962656994d5cae889367a5d0989de5f961b01000a8a37cd430cdeda"
      },
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      },
      "criteria_version": 1,
      "phase": "plan",
      "reuse_as_pass": false
    },
    "FIT-01": {
      "audit_request_id": "AR-PLAN-001",
      "subject_ref": {
        "id": "PLAN-001",
        "immutable_ref": "design/snapshots/SN-156f567a982e8062ea128ebee3febff4987104f4bf178754865ab7dff0ac52f5/files/audits/subjects/PLAN-001.json",
        "sha256": "8ed8fe5ca962656994d5cae889367a5d0989de5f961b01000a8a37cd430cdeda"
      },
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      },
      "criteria_version": 1,
      "phase": "plan",
      "reuse_as_pass": false
    },
    "SIT-01": {
      "audit_request_id": "AR-PLAN-001",
      "subject_ref": {
        "id": "PLAN-001",
        "immutable_ref": "design/snapshots/SN-156f567a982e8062ea128ebee3febff4987104f4bf178754865ab7dff0ac52f5/files/audits/subjects/PLAN-001.json",
        "sha256": "8ed8fe5ca962656994d5cae889367a5d0989de5f961b01000a8a37cd430cdeda"
      },
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      },
      "criteria_version": 1,
      "phase": "plan",
      "reuse_as_pass": false
    },
    "SYS-LOG": {
      "audit_request_id": "AR-PLAN-001",
      "subject_ref": {
        "id": "PLAN-001",
        "immutable_ref": "design/snapshots/SN-156f567a982e8062ea128ebee3febff4987104f4bf178754865ab7dff0ac52f5/files/audits/subjects/PLAN-001.json",
        "sha256": "8ed8fe5ca962656994d5cae889367a5d0989de5f961b01000a8a37cd430cdeda"
      },
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      },
      "criteria_version": 1,
      "phase": "plan",
      "reuse_as_pass": false
    }
  },
  "cumulative_diff_ref": {
    "from": {
      "id": "BUNDLE-001",
      "immutable_ref": "design/snapshots/SN-fab1cd198c39ee2f406f70567117e5d71122b58da0ad97f93dc54eb969e868f3/files/design/candidates/OP-ADOPT-002/bundle.json",
      "sha256": "90c0dd3433cddb50240a8c1df5f8db70e5e9f11d82f9837caa6a6b6c6cef3742"
    },
    "via": {
      "id": "PLAN-DELTA-002",
      "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/design/candidates/OP-PLAN-002/change.json",
      "sha256": "4b0cd07c737b044b77af7f0f5caf1ba9f9813c72286c6be859bb44096220069f",
      "semantic_revision": 1
    },
    "correction_delta_ref": {
      "id": "PLAN-REVIEW-DELTA-003",
      "immutable_ref": "design/snapshots/SN-28806aa6ac92445128d04006f6ab02fcac255fde6f224b5aff19da0d0af973d1/files/audits/deltas/AR-PLAN-003.json",
      "sha256": "3f2e3b74e1bff5bb9a0c7d6e6a8c5b24aff5abec8d0f9dc829a699f6b3fa0b4d",
      "semantic_revision": 1,
      "patch_ref": {
        "id": "audits/deltas/AR-PLAN-003.patch",
        "immutable_ref": "design/snapshots/SN-28806aa6ac92445128d04006f6ab02fcac255fde6f224b5aff19da0d0af973d1/files/audits/deltas/AR-PLAN-003.patch",
        "sha256": "3165a74a1f34ffa3e8ce3f8410ea56c3938021a6b157e009c0d84e4b24242778"
      }
    },
    "to_subject_ref": {
      "id": "PLAN-003",
      "immutable_ref": "design/snapshots/SN-2b689218bab304597638d8a4f2e76a929a5bae3285f5f1dd0494ca49a37578e9/files/audits/subjects/PLAN-003.json",
      "sha256": "2bc64827291195c96b6987c813203aabaea2c81b316b8be205c173ca25532234"
    }
  },
  "change_ids": [],
  "previous_audit_ref": {
    "id": "AUD-PLAN-002",
    "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
    "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
  },
  "previous_subject_ref": {
    "id": "PLAN-002",
    "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
    "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
  },
  "open_finding_ids": [
    "F-CLOUD-PLAN-002-01",
    "F-CLOUD-PLAN-002-02",
    "F-CLOUD-PLAN-002-03",
    "F-CLOUD-ADOPT-002"
  ],
  "review_delta_ref": {
    "id": "PLAN-REVIEW-DELTA-003",
    "immutable_ref": "design/snapshots/SN-28806aa6ac92445128d04006f6ab02fcac255fde6f224b5aff19da0d0af973d1/files/audits/deltas/AR-PLAN-003.json",
    "sha256": "3f2e3b74e1bff5bb9a0c7d6e6a8c5b24aff5abec8d0f9dc829a699f6b3fa0b4d",
    "semantic_revision": 1,
    "patch_ref": {
      "id": "audits/deltas/AR-PLAN-003.patch",
      "immutable_ref": "design/snapshots/SN-28806aa6ac92445128d04006f6ab02fcac255fde6f224b5aff19da0d0af973d1/files/audits/deltas/AR-PLAN-003.patch",
      "sha256": "3165a74a1f34ffa3e8ce3f8410ea56c3938021a6b157e009c0d84e4b24242778"
    }
  },
  "impact_scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "reused_checks": [
    {
      "criterion": "DDD-01",
      "part": "既存14フィールド/enum/auto分類の基礎",
      "status": "reused",
      "criteria_version": 2,
      "previous_audit_ref": {
        "id": "AUD-PLAN-002",
        "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
        "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
      },
      "previous_subject_ref": {
        "id": "PLAN-002",
        "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
        "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
      },
      "excluded": "SessionEnd reasonとseq/countsは再確認",
      "reason": "前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。",
      "input_fragments": [
        {
          "locator": "イベントの14フィールド",
          "previous_ref": {
            "id": "DEF-LOG-01",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/design/candidates/OP-PLAN-002/DEF-LOG-01.md",
            "sha256": "97799519e373e3512766b676d6fdefa72280e8759813a9db2a59e16b99783414",
            "semantic_revision": 2,
            "domain_id": "D-LOG",
            "context_id": "CTX-LOG",
            "canonical_owner": "SYS-LOG",
            "dependencies": []
          },
          "current_ref": {
            "id": "DEF-LOG-01",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/design/candidates/OP-PLAN-003/DEF-LOG-01.md",
            "sha256": "2b7b5a69a9c203b43726a5ce6944a38b5943e65a52226e9398e3e0f08612ee21",
            "semantic_revision": 3,
            "domain_id": "D-LOG",
            "context_id": "CTX-LOG",
            "canonical_owner": "SYS-LOG",
            "dependencies": []
          },
          "previous_sha256": "ffae3ff374acee95e6ea108e77814bee5a64eca588a5ff35ef88e0f69fb87672",
          "current_sha256": "ffae3ff374acee95e6ea108e77814bee5a64eca588a5ff35ef88e0f69fb87672",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ],
      "dependency_fragments": [
        {
          "locator": "イベントの14フィールド",
          "previous_ref": {
            "id": "DEF-LOG-01",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/design/candidates/OP-PLAN-002/DEF-LOG-01.md",
            "sha256": "97799519e373e3512766b676d6fdefa72280e8759813a9db2a59e16b99783414",
            "semantic_revision": 2,
            "domain_id": "D-LOG",
            "context_id": "CTX-LOG",
            "canonical_owner": "SYS-LOG",
            "dependencies": []
          },
          "current_ref": {
            "id": "DEF-LOG-01",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/design/candidates/OP-PLAN-003/DEF-LOG-01.md",
            "sha256": "2b7b5a69a9c203b43726a5ce6944a38b5943e65a52226e9398e3e0f08612ee21",
            "semantic_revision": 3,
            "domain_id": "D-LOG",
            "context_id": "CTX-LOG",
            "canonical_owner": "SYS-LOG",
            "dependencies": []
          },
          "previous_sha256": "ffae3ff374acee95e6ea108e77814bee5a64eca588a5ff35ef88e0f69fb87672",
          "current_sha256": "ffae3ff374acee95e6ea108e77814bee5a64eca588a5ff35ef88e0f69fb87672",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ]
    },
    {
      "criterion": "DDD-02",
      "part": "送らない情報/許可キー/パス/固定分類/マスク/サイズ規則",
      "status": "reused",
      "criteria_version": 2,
      "previous_audit_ref": {
        "id": "AUD-PLAN-002",
        "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
        "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
      },
      "previous_subject_ref": {
        "id": "PLAN-002",
        "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
        "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
      },
      "excluded": "脅威モデル/資格取得経路/README・画面の限界は再確認",
      "reason": "前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。",
      "input_fragments": [
        {
          "locator": "## 送らない情報と変換規則",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "8597ff889c310d07762552e7fbee238a3d61d5b12557a074779b08a4f1a0b53a",
          "current_sha256": "8597ff889c310d07762552e7fbee238a3d61d5b12557a074779b08a4f1a0b53a",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ],
      "dependency_fragments": [
        {
          "locator": "## 送らない情報と変換規則",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "8597ff889c310d07762552e7fbee238a3d61d5b12557a074779b08a4f1a0b53a",
          "current_sha256": "8597ff889c310d07762552e7fbee238a3d61d5b12557a074779b08a4f1a0b53a",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ]
    },
    {
      "criterion": "DDD-03",
      "part": "ack/通信障害時の不変内容再送とbackoff",
      "status": "reused",
      "criteria_version": 2,
      "previous_audit_ref": {
        "id": "AUD-PLAN-002",
        "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
        "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
      },
      "previous_subject_ref": {
        "id": "PLAN-002",
        "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
        "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
      },
      "excluded": "seq/summary照合/明示timeout/async締切は再確認",
      "reason": "前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。",
      "input_fragments": [
        {
          "locator": "通信断・接続拒否",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "059c9f81089c3c864ea5c51f253f8e043d5a743d668e509b4d1d1156b31da33c",
          "current_sha256": "059c9f81089c3c864ea5c51f253f8e043d5a743d668e509b4d1d1156b31da33c",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ],
      "dependency_fragments": [
        {
          "locator": "通信断・接続拒否",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "059c9f81089c3c864ea5c51f253f8e043d5a743d668e509b4d1d1156b31da33c",
          "current_sha256": "059c9f81089c3c864ea5c51f253f8e043d5a743d668e509b4d1d1156b31da33c",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ]
    },
    {
      "criterion": "DDD-03",
      "part": "保存不能と送信不能の区別",
      "status": "reused",
      "criteria_version": 2,
      "previous_audit_ref": {
        "id": "AUD-PLAN-002",
        "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
        "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
      },
      "previous_subject_ref": {
        "id": "PLAN-002",
        "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
        "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
      },
      "excluded": "追加欠落表示は再確認",
      "reason": "前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。",
      "input_fragments": [
        {
          "locator": "queue のローカル保存不能",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "f0af141e6203312058ae7d86612bb5f3208511591e45d7890f23bfe1373a42a5",
          "current_sha256": "f0af141e6203312058ae7d86612bb5f3208511591e45d7890f23bfe1373a42a5",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ],
      "dependency_fragments": [
        {
          "locator": "queue のローカル保存不能",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "f0af141e6203312058ae7d86612bb5f3208511591e45d7890f23bfe1373a42a5",
          "current_sha256": "f0af141e6203312058ae7d86612bb5f3208511591e45d7890f23bfe1373a42a5",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ]
    },
    {
      "criterion": "DDD-04",
      "part": "単一contextとSYS-LOGの内部境界所有",
      "status": "reused",
      "criteria_version": 2,
      "previous_audit_ref": {
        "id": "AUD-PLAN-002",
        "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
        "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
      },
      "previous_subject_ref": {
        "id": "PLAN-002",
        "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
        "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
      },
      "excluded": "修正した内部変換のseq/資格/時間制約は再確認",
      "reason": "前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。",
      "input_fragments": [
        {
          "locator": "domain=D-LOG",
          "previous_ref": {
            "id": "DEF-LOG-01",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/design/candidates/OP-PLAN-002/DEF-LOG-01.md",
            "sha256": "97799519e373e3512766b676d6fdefa72280e8759813a9db2a59e16b99783414",
            "semantic_revision": 2,
            "domain_id": "D-LOG",
            "context_id": "CTX-LOG",
            "canonical_owner": "SYS-LOG",
            "dependencies": []
          },
          "current_ref": {
            "id": "DEF-LOG-01",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/design/candidates/OP-PLAN-003/DEF-LOG-01.md",
            "sha256": "2b7b5a69a9c203b43726a5ce6944a38b5943e65a52226e9398e3e0f08612ee21",
            "semantic_revision": 3,
            "domain_id": "D-LOG",
            "context_id": "CTX-LOG",
            "canonical_owner": "SYS-LOG",
            "dependencies": []
          },
          "previous_sha256": "1a02a82e07c0d13657843570cca0524967aff0270e5ba407b345885115ba4ed8",
          "current_sha256": "1a02a82e07c0d13657843570cca0524967aff0270e5ba407b345885115ba4ed8",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ],
      "dependency_fragments": [
        {
          "locator": "domain=D-LOG",
          "previous_ref": {
            "id": "DEF-LOG-01",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/design/candidates/OP-PLAN-002/DEF-LOG-01.md",
            "sha256": "97799519e373e3512766b676d6fdefa72280e8759813a9db2a59e16b99783414",
            "semantic_revision": 2,
            "domain_id": "D-LOG",
            "context_id": "CTX-LOG",
            "canonical_owner": "SYS-LOG",
            "dependencies": []
          },
          "current_ref": {
            "id": "DEF-LOG-01",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/design/candidates/OP-PLAN-003/DEF-LOG-01.md",
            "sha256": "2b7b5a69a9c203b43726a5ce6944a38b5943e65a52226e9398e3e0f08612ee21",
            "semantic_revision": 3,
            "domain_id": "D-LOG",
            "context_id": "CTX-LOG",
            "canonical_owner": "SYS-LOG",
            "dependencies": []
          },
          "previous_sha256": "1a02a82e07c0d13657843570cca0524967aff0270e5ba407b345885115ba4ed8",
          "current_sha256": "1a02a82e07c0d13657843570cca0524967aff0270e5ba407b345885115ba4ed8",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ]
    },
    {
      "criterion": "DDD-05",
      "part": "実機未発火/合成入力代替不可の評価原則",
      "status": "reused",
      "criteria_version": 2,
      "previous_audit_ref": {
        "id": "AUD-PLAN-002",
        "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
        "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
      },
      "previous_subject_ref": {
        "id": "PLAN-002",
        "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
        "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
      },
      "excluded": "追加UT/SIT/FIT項目と評価ref新版は再確認",
      "reason": "前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。",
      "input_fragments": [
        {
          "locator": "FIT-AUTO-01/02 は synthetic",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "2a0dc6166626c359626304699024fecbc204725477b74ce18b1ad02524c0d729",
          "current_sha256": "2a0dc6166626c359626304699024fecbc204725477b74ce18b1ad02524c0d729",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ],
      "dependency_fragments": [
        {
          "locator": "FIT-AUTO-01/02 は synthetic",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "2a0dc6166626c359626304699024fecbc204725477b74ce18b1ad02524c0d729",
          "current_sha256": "2a0dc6166626c359626304699024fecbc204725477b74ce18b1ad02524c0d729",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ]
    },
    {
      "criterion": "DDD-05",
      "part": "本人評価条件",
      "status": "reused",
      "criteria_version": 2,
      "previous_audit_ref": {
        "id": "AUD-PLAN-002",
        "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
        "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
      },
      "previous_subject_ref": {
        "id": "PLAN-002",
        "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
        "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
      },
      "excluded": "README/欠落表示の利用者理解は追加条件として再確認",
      "reason": "前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。",
      "input_fragments": [
        {
          "locator": "| HUMAN-AUTO-02",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "c51f5747883409f37cd002b30f52ea31be2f6a68849edaaaa4eb89fd655a8b55",
          "current_sha256": "c51f5747883409f37cd002b30f52ea31be2f6a68849edaaaa4eb89fd655a8b55",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ],
      "dependency_fragments": [
        {
          "locator": "| HUMAN-AUTO-02",
          "previous_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/E-002-plan.md",
            "sha256": "411dbd47ff12c537698feffbf7a65821f92caf71f3761ab565879e19fa439e85",
            "semantic_revision": 1
          },
          "current_ref": {
            "id": "E-002",
            "immutable_ref": "design/snapshots/SN-4b76c007db95d130072fd8a26b478ea43d3242bd2c1b32db5009249374cc1541/files/experiments/E-002-plan.md",
            "sha256": "13334a988bd7518e019711a0d96090408ede1bb5aee91c171a7c8a204b7a645d",
            "semantic_revision": 2
          },
          "previous_sha256": "c51f5747883409f37cd002b30f52ea31be2f6a68849edaaaa4eb89fd655a8b55",
          "current_sha256": "c51f5747883409f37cd002b30f52ea31be2f6a68849edaaaa4eb89fd655a8b55",
          "normalization": "UTF-8 text; paragraph/section ending one LF; no internal changes"
        }
      ]
    },
    {
      "criterion": "AIDE-03",
      "part": "既存current/履歴の固定",
      "status": "reused",
      "criteria_version": 2,
      "previous_audit_ref": {
        "id": "AUD-PLAN-002",
        "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
        "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
      },
      "previous_subject_ref": {
        "id": "PLAN-002",
        "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
        "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
      },
      "excluded": "新subject/precheck/台帳/予約/保留は再確認",
      "reason": "前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。",
      "input_refs": [
        {
          "id": "BUNDLE-001",
          "immutable_ref": "design/snapshots/SN-fab1cd198c39ee2f406f70567117e5d71122b58da0ad97f93dc54eb969e868f3/files/design/candidates/OP-ADOPT-002/bundle.json",
          "sha256": "90c0dd3433cddb50240a8c1df5f8db70e5e9f11d82f9837caa6a6b6c6cef3742"
        },
        {
          "id": "PLAN-002",
          "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
          "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
        },
        {
          "id": "AUD-PLAN-002",
          "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
          "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
        }
      ],
      "current_input_refs": [
        {
          "id": "BUNDLE-001",
          "immutable_ref": "design/snapshots/SN-fab1cd198c39ee2f406f70567117e5d71122b58da0ad97f93dc54eb969e868f3/files/design/candidates/OP-ADOPT-002/bundle.json",
          "sha256": "90c0dd3433cddb50240a8c1df5f8db70e5e9f11d82f9837caa6a6b6c6cef3742"
        },
        {
          "id": "PLAN-002",
          "immutable_ref": "design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237/files/audits/subjects/PLAN-002.json",
          "sha256": "159a16b0aed24780144a13a0d93806bbd48fb8bbdb699e0c1f0a4b0f84dd26f0"
        },
        {
          "id": "AUD-PLAN-002",
          "immutable_ref": "design/snapshots/SN-2031b501381d6763919763ef1ca444325f4cc133d59110f14bdff18cf00a58fc/files/audits/AUD-PLAN-002.md",
          "sha256": "8020060c11c495576c2d709d98afe42520fd5592542636e8a8135e03f7ee563c"
        }
      ]
    }
  ],
  "budget_account_refs": [
    "LOCAL-01",
    "LOCAL-E002"
  ],
  "execution_id": "EXEC-AUDIT-PLAN-003",
  "budget_check_ref": "design/state.md#EXEC-AUDIT-PLAN-003",
  "policy_ref": null,
  "criteria_version": 2,
  "reviewer": "Claude Opus 5.5 (claude-opus-5-5, Claude Code desktop session 2026-10-03; external independent re-auditor; drafter Codex gpt-6.1-sol)",
  "independence": "independent",
  "self_check_delegation_ref": null,
  "observed_at": "2026-10-03T12:07:35Z",
  "result": "audit-pass",
  "finding_ids": [],
  "closed_finding_ids": [
    "F-CLOUD-PLAN-002-01",
    "F-CLOUD-PLAN-002-02",
    "F-CLOUD-PLAN-002-03"
  ],
  "carried_open_finding_ids": [
    "F-CLOUD-ADOPT-002"
  ],
  "open_major_count": 0,
  "open_blocker_count": 0,
  "preconditions_before_implementation": [
    "UC-01",
    "UC-02",
    "UC-03",
    "LOCAL-E002 adoption audit allocation"
  ],
  "unverified": [
    "hookの実機入力・async・timeout・設定マージは文書確認のみ（FITで確認）。",
    "実装・試行は未実施（計画監査）。",
    "本番配備・4実環境・本人評価は対象外。"
  ],
  "next_due": null
}
---

# E-002 計画再監査：3指摘はすべて解消（audit-pass）

## 固定対象・予算・独立性

対象はAR-PLAN-003、subject PLAN-003（plan_revision 2）、phase=plan、criteria version 2、scope=CTX-LOG/FIT-01/SIT-01/SYS-LOG。
照合結果:
- subject・前回監査AUD-PLAN-002・前回subject PLAN-002・review deltaの実測SHA-256は、いずれも要求値と一致した。
- subjectのcanonical digestはsubject_hash 12b4d977…b8d7と一致した。
- subjectが参照するE-002-plan.mdは作業ツリーと同一である。
- 予約EXEC-AUDIT-PLAN-003はreservedである。

監査担当はClaude Opus 5.5、起草担当はCodex（gpt-6.1-sol）で、モデル・セッションは別である。
独立性の限界はAUD-PLAN-002と同じ。本監査担当は改訂指示（codex-task-005）を書き、AUD-PLAN-002の解消条件と、利用者のUC-04回答を転記した。計画本文は書いていない。

## 再監査の範囲

詳しく読み直したのは3件である。open指摘3件の解消条件、PLAN-002→PLAN-003の入力差分（E-002-plan.mdの空白を除いた差分は37行追加・22行削除）、その波及先（UI表示・README・FIT項目・UC）。
要求のreused_checks 8件（DDD-01〜05、AIDE-03の各部分）は、差分の外にあり依拠先も変わっていない。よって、AUD-PLAN-002で確認済みの内容をそのまま引き継ぐ。
公式ドキュメントの照会結果（AUD-PLAN-002に記載）は引き続き前提とし、実機確認はFITで行う。

## 指摘の解消確認

| 指摘 | 解消条件 | PLAN-003での対応 | 判定 |
| --- | --- | --- | --- |
| F-CLOUD-PLAN-002-01（major） | 脅威モデルの明記、欠落検出、資格を環境変数から外す、改ざん耐性の要否確認 | 「脅威モデルと利用者の決定」節で、停止・削除・偽装・資格ファイル読取を防がないと明記した。連番・件数も改変され得ると限界まで書いた。READMEと画面の限界表示をFIT-UI-02で確認する。「欠落の検出と表示」節でbody.seq（再送で同じ値・保存失敗で欠番）、summaryの予定件数、3条件の「欠落の可能性」表示と暫定判定を定義した。資格は.local/claude-hook-tokenからhook/workerが直接読み、Bashの`env`で非出力であることをFIT-AUTO-01で確認する。UC-04は回答済みで、本格的な改ざん耐性はNEXT-06とした。 | closed |
| F-CLOUD-PLAN-002-02（minor） | SessionEnd reasonを文書の値に合わせる | clear/resume/logout/prompt_input_exit/other（未知はother） | closed |
| F-CLOUD-PLAN-002-03（minor） | 明示timeout、asyncのworker上限、root設定マージの確認 | 全command hookにtimeout=1秒。worker総処理5秒を、起動から終了までの単調時計の締切として必須化した。UC-01とFITでrootのsettings.json / settings.local.jsonとのマージを確認する。 | closed |

新しい重大な反例は見つからなかった。欠落検出は同じ権限で改変され得るという限界を計画自身が明示しており、表示も「可能性」「暫定」に限定している。利用者の決定（UC-04）と整合する。

## 基準と根拠

| criterion | 適用と証拠 | 判定 |
| --- | --- | --- |
| DDD-01 | seq・予定件数の意味（意図的省略・集計callbackは数えない、sealed summaryと一致）が定義され、手動イベントと既存データは数えない。 | 確認済み（auto分類の基礎は引継ぎ） |
| DDD-02 | 資格がモデルの環境に入らない。ファイルの限界も明記。送らない情報の規則は引継ぎ。 | 確認済み |
| DDD-03 | timeout明示とworker締切で前景の上限が決まる。再送不変性は引継ぎ。 | 確認済み |
| DDD-04 | 内部境界の所有は変更なし（引継ぎ）。 | 引継ぎ |
| DDD-05 | 欠落3条件、限界表示、env非出力、設定マージがUT/SIT/FITに追加された。 | 確認済み |
| AIDE-01 | UC-01〜03は未回答で、実装前の確認条件として残る。UC-04は回答済み。 | 確認済み（下記の実装前条件あり） |
| AIDE-02 | 利用者の目的「監視」に対し、保証範囲（協調的な見える化）が画面・READMEで明示される。 | 確認済み |
| AIDE-03 | 計画のみ。current=BUNDLE-001/IMPL-005とC-001の完了を維持（引継ぎ）。 | 引継ぎ |

## 結果と次の処理

open major 0件、open blocker 0件。今回の3指摘はclosedである。既存のopen minor F-CLOUD-ADOPT-002（NEXT-01）は計画の対象外として継続する。結果はaudit-passとする。
受理（基準登録・予約精算）はrecord担当が行う。本監査は実装を許可するものではない。

実装前に満たすこと（本監査の指摘ではなく、計画自身の条件）:
- UC-01〜03の利用者確認（実験専用設定の範囲、粒度・量・保持、実Claude CodeセッションでのFIT実施と予算）。
- 将来の採用監査に使う監査枠がLOCAL-E002に残っていない。実装に入る前に、追加配分または予算変更の確認が必要。
