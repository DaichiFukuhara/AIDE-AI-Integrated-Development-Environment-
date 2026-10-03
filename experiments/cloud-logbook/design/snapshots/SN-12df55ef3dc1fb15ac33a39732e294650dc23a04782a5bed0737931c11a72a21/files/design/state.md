---
{
  "project_id": "CLOUD-LOGBOOK",
  "revision": 32,
  "timezone": "Asia/Tokyo",
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "periodic_policy": {
    "revision": 1,
    "cycle_closed_enabled": true,
    "after_days": 7,
    "timezone": "Asia/Tokyo",
    "source_ref": "harness-v3/protocols/messages.md"
  },
  "writer": "/root",
  "current_bundle": null,
  "audit_baselines": [
    {
      "scope_id": "CTX-LOG",
      "phase": "plan",
      "criteria_version": 1,
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "subject_ref": "audits/subjects/PLAN-001.json",
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      },
      "accepted_at": "2026-10-02T18:15:35.151756+00:00"
    },
    {
      "scope_id": "FIT-01",
      "phase": "plan",
      "criteria_version": 1,
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "subject_ref": "audits/subjects/PLAN-001.json",
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      },
      "accepted_at": "2026-10-02T18:15:35.151782+00:00"
    },
    {
      "scope_id": "SIT-01",
      "phase": "plan",
      "criteria_version": 1,
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "subject_ref": "audits/subjects/PLAN-001.json",
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      },
      "accepted_at": "2026-10-02T18:15:35.151789+00:00"
    },
    {
      "scope_id": "SYS-LOG",
      "phase": "plan",
      "criteria_version": 1,
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "subject_ref": "audits/subjects/PLAN-001.json",
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      },
      "accepted_at": "2026-10-02T18:15:35.151794+00:00"
    }
  ],
  "unaudited_changes": [],
  "operations": {
    "OP-PLAN-001": {
      "payload_hash": "de74a9cc80e5c1f5836e10798e11e7cd04ae3c5452c1d094bff731fff82b6578",
      "kind": "plan",
      "subject_hash": "f87f44efbd5f5def45d4a83459cf6582ce192dc98a6fb335c4ce81de2097fdbb",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "state": "checked",
      "result": "audit-pass",
      "bundle": null,
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      }
    },
    "OP-ADOPT-001": {
      "payload_hash": "b5d44f83737b591d55f2270de00b7b95088552e6db0f1eb311bce35416da8996",
      "kind": "adoption",
      "subject_hash": "e98d6292c725145dd0bb3c30da77ce42e6410b1551c2e37c8fbc3126202c2a7a",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "state": "rejected",
      "result": "require-review",
      "bundle": null,
      "audit_request_id": "AR-ADOPT-001",
      "result_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      }
    }
  },
  "tombstones": {},
  "outbox": [
    {
      "message_id": "AR-PLAN-001",
      "kind": "S-AUDIT-INPUT",
      "payload_ref": "audits/AR-PLAN-001-request.json",
      "target": "/root/harness_auditor",
      "state": "acknowledged",
      "execution_id": "EXEC-AUDIT-PLAN-001",
      "account_refs": [
        "LOCAL-01"
      ]
    },
    {
      "message_id": "AR-ADOPT-001",
      "kind": "S-AUDIT-INPUT",
      "payload_ref": "audits/AR-ADOPT-001-request.json",
      "target": "/root/harness_auditor",
      "state": "acknowledged",
      "execution_id": "EXEC-AUDIT-ADOPT-001",
      "account_refs": [
        "LOCAL-01"
      ],
      "result_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      }
    }
  ],
  "received_notifications": {},
  "pending_changes": [
    {
      "change_id": "CHANGE-001",
      "affected_scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "phase": "implementation",
      "baseline_refs": {
        "CTX-LOG": "initial",
        "FIT-01": "initial",
        "SIT-01": "initial",
        "SYS-LOG": "initial"
      },
      "first_changed_at": "2026-10-02T18:43:31.407735+00:00",
      "operation_id": "OP-ADOPT-001",
      "old_version": null,
      "new_version": {
        "id": "IMPL-003",
        "snapshot_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2",
        "files": [
          {
            "id": "api/events.js",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/api/events.js",
            "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
          },
          {
            "id": "api/health.js",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/api/health.js",
            "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
          },
          {
            "id": "api/session.js",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/api/session.js",
            "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
          },
          {
            "id": "cli/logbook.py",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/cli/logbook.py",
            "sha256": "7e52fba9c73240dd0100d5ffb0796b72b93fb9cdb076c7beaa3fb8190f448682"
          },
          {
            "id": "dev/fixture-store.mjs",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/dev/fixture-store.mjs",
            "sha256": "c2673d0ce9867552bfa369b593e2679b9c09267be7a0bd0fd553e0e02280f0bd"
          },
          {
            "id": "lib/schema.mjs",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/lib/schema.mjs",
            "sha256": "db18c8098ace4501d8f58d5008afd80f1f3687a228aa2c94c5f7e200bfd625f9"
          },
          {
            "id": "lib/service.mjs",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/lib/service.mjs",
            "sha256": "6e550cd5136e02750ed45d8d761ed4a4479de0cd95208c26be01781eeee95851"
          },
          {
            "id": "lib/supabase.mjs",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/lib/supabase.mjs",
            "sha256": "d82ee069f287d063702e3524c369ed500b1d1b71026515403be6085994b78dc1"
          },
          {
            "id": "public/app.js",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/public/app.js",
            "sha256": "95d09ae920d049f8c45779d44ac7253a4e71bb33c08b0d112b1d282421dab1a9"
          },
          {
            "id": "public/index.html",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/public/index.html",
            "sha256": "7f523a5bc31620ff908e328c866874c9be5d371b178630a758498890ee56eb37"
          },
          {
            "id": "public/styles.css",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/public/styles.css",
            "sha256": "71f24000802dac2d9a419548190790cb38480ee20f94ab39def7fa423481641a"
          },
          {
            "id": "scripts/dev.mjs",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/scripts/dev.mjs",
            "sha256": "f728fed42994d6f034d40d34ca0ee819fee7abd7b8d43b9058cca45e2c0d1a87"
          },
          {
            "id": "scripts/writer-key.mjs",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/scripts/writer-key.mjs",
            "sha256": "d1a4bd044652e11bbb37c2e8e136eebf212be05361e84cb37d7320d30b4d2fc8"
          },
          {
            "id": "supabase/migrations/202610030001_logbook.sql",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/supabase/migrations/202610030001_logbook.sql",
            "sha256": "55c67bbbb1c80599c1049852d04b1298312d2f3cd3e48126e3f997621bd3bfaa"
          },
          {
            "id": "tests/integration.test.mjs",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/tests/integration.test.mjs",
            "sha256": "f15a603bd096889ec61c401a0c617948dd42da321d62d7eac20493263775dc02"
          },
          {
            "id": "tests/service.test.mjs",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/tests/service.test.mjs",
            "sha256": "95dba5725cb2e14a6bab71512c321fc0d386b521c17137d8e8ec46403dc72813"
          },
          {
            "id": "README.md",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/README.md",
            "sha256": "5816d7abedc45b79bfb5f677f7453e6e6fea4cf3cbf6fb9cc171194be5fe727a"
          },
          {
            "id": "agent-instructions.md",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/agent-instructions.md",
            "sha256": "17363ce8aa4bdfeda0bbed46320042065fe05e03576945128b54abc70c53f974"
          },
          {
            "id": "package.json",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/package.json",
            "sha256": "f1ace1b766ffdd7e85674db4a48a5c3269e75bd9243f2c1bd2b4b596fcd74a5c"
          },
          {
            "id": "vercel.json",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/vercel.json",
            "sha256": "aae1c40e107f781a55e1360e1fc4b277989b5871912d009ee25fefd9edd14daf"
          },
          {
            "id": ".env.example",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/.env.example",
            "sha256": "352910f4de835d3d62697760de4b0cf7b87368c8251bd3c99e13891587f9073f"
          },
          {
            "id": ".gitignore",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/.gitignore",
            "sha256": "8eddc449ef8e80bcb420c47db10931c282b08111728c0560cfd3a297ff4bf75b"
          },
          {
            "id": ".gitattributes",
            "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/.gitattributes",
            "sha256": "bd9663d71ffce4f030fba3bf7285472e2fab87ce8f71d180d20c14060d0c42a1"
          }
        ]
      },
      "joint_condition": "CLI→API→保存adapter→所有者認証読取→画面を同じsubjectで確認。SQLの安全性は独立レビュー、実DBは未確認。",
      "reason": "固定計画のローカル技術的試験採用。配備採用ではない。"
    }
  ],
  "blocked_scopes": [
    {
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "state": "active",
      "finding_id": "F-CLOUD-ADOPT-001",
      "audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      },
      "permitted_operations": [
        "TRIAL-004",
        "AR-ADOPT-002",
        "TRIAL-005"
      ],
      "release_condition": "独立再監査がAuth 500/429等の一時障害と真の認証拒否を区別し、cookie/前回表示保持と認証切れ消去の証拠を確認する。",
      "correction_scope": "Supabase応答分類・対応するsession/UIエラー表示・回帰検証。意味定義/評価/配備範囲は変更しない。"
    }
  ],
  "budget_accounts": {
    "LOCAL-01": {
      "owner": "learning",
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "delegation_ref": {
        "id": "DELEGATION-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
        "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
        "semantic_revision": 1
      },
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "activities": [
        "trial",
        "audit",
        "record"
      ],
      "parent_account_refs": [],
      "limits": {
        "external_spend": {
          "unit": "JPY-new-external-purchases",
          "limit": 0,
          "activities": [
            "trial",
            "audit",
            "record"
          ],
          "cumulative_used": 0
        },
        "trials": {
          "unit": "verification-round",
          "limit": 6,
          "activities": [
            "trial"
          ],
          "cumulative_used": 4
        },
        "audits": {
          "unit": "independent-review-execution",
          "limit": 6,
          "activities": [
            "audit"
          ],
          "cumulative_used": 2
        },
        "record_batches": {
          "unit": "administrative-batch",
          "limit": 80,
          "activities": [
            "record"
          ],
          "cumulative_used": 2
        }
      }
    }
  },
  "execution_reservations": {
    "EXEC-RECORD-001": {
      "activity": "record",
      "operation_id": "PLAN-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": null,
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-02T18:10:59.113801+00:00",
      "state": "settled",
      "decision_owner": "record",
      "limits": {
        "external_spend": 0,
        "trials": 0,
        "audits": 0,
        "record_batches": 1
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 0,
          "outstanding": 0,
          "next": 1,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-10-02T18:15:35.195625+00:00",
      "evidence_ref": "evidence/precheck-plan-001.json"
    },
    "EXEC-AUDIT-PLAN-001": {
      "activity": "audit",
      "operation_id": "AR-PLAN-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": null,
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-02T18:10:59.215294+00:00",
      "state": "settled",
      "decision_owner": "record",
      "limits": {
        "external_spend": 0,
        "trials": 0,
        "audits": 1,
        "record_batches": 0
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 0,
          "outstanding": 0,
          "next": 1,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 0,
          "outstanding": 1,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-10-02T18:15:35.172674+00:00",
      "evidence_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-61d392514bd38d9ca1232028190ec93e3c677db8c6779e85d38b92d2173b1cc1/files/audits/AUD-PLAN-001.md",
        "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
      }
    },
    "EXEC-RECORD-002": {
      "activity": "record",
      "operation_id": "IMPLEMENTATION-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": null,
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-02T18:15:35.230795+00:00",
      "state": "settled",
      "decision_owner": "record",
      "limits": {
        "external_spend": 0,
        "trials": 0,
        "audits": 0,
        "record_batches": 1
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 1,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 1,
          "outstanding": 0,
          "next": 1,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-10-02T18:43:31.463737+00:00",
      "evidence_ref": "audits/subjects/ADOPT-001.json"
    },
    "EXEC-TRIAL-001": {
      "activity": "trial",
      "operation_id": "TRIAL-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": null,
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-02T18:28:55.253071+00:00",
      "state": "settled",
      "decision_owner": "learning",
      "limits": {
        "external_spend": 0,
        "trials": 1,
        "audits": 0,
        "record_batches": 0
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 0,
          "outstanding": 0,
          "next": 1,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 1,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 1,
          "outstanding": 1,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-10-02T18:33:00.681398+00:00",
      "evidence_ref": "experiments/trials/TRIAL-001.md"
    },
    "EXEC-TRIAL-002": {
      "activity": "trial",
      "operation_id": "TRIAL-002",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": null,
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-02T18:33:27.308269+00:00",
      "state": "settled",
      "decision_owner": "learning",
      "limits": {
        "external_spend": 0,
        "trials": 1,
        "audits": 0,
        "record_batches": 0
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 1,
          "outstanding": 0,
          "next": 1,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 1,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 1,
          "outstanding": 1,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-10-02T18:36:37.467598+00:00",
      "evidence_ref": "experiments/trials/TRIAL-002.md"
    },
    "EXEC-TRIAL-003": {
      "activity": "trial",
      "operation_id": "TRIAL-003",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": null,
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-02T18:36:50.724183+00:00",
      "state": "settled",
      "decision_owner": "learning",
      "limits": {
        "external_spend": 0,
        "trials": 1,
        "audits": 0,
        "record_batches": 0
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 2,
          "outstanding": 0,
          "next": 1,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 1,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 1,
          "outstanding": 1,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-10-02T18:42:00.075367+00:00",
      "evidence_ref": "experiments/trials/TRIAL-003.md"
    },
    "EXEC-RECORD-003": {
      "activity": "record",
      "operation_id": "ADOPTION-CLOSURE-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": null,
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-02T18:43:31.497615+00:00",
      "state": "reserved",
      "decision_owner": "record",
      "limits": {
        "external_spend": 0,
        "trials": 0,
        "audits": 0,
        "record_batches": 1
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 3,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 1,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 2,
          "outstanding": 0,
          "next": 1,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero."
    },
    "EXEC-AUDIT-ADOPT-001": {
      "activity": "audit",
      "operation_id": "AR-ADOPT-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": null,
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-02T18:43:31.530389+00:00",
      "state": "settled",
      "decision_owner": "record",
      "limits": {
        "external_spend": 0,
        "trials": 0,
        "audits": 1,
        "record_batches": 0
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 3,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 1,
          "outstanding": 0,
          "next": 1,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 2,
          "outstanding": 1,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-10-03T10:51:30.084857+00:00",
      "evidence_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      }
    },
    "EXEC-TRIAL-004": {
      "activity": "trial",
      "operation_id": "TRIAL-004",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": "F-CLOUD-ADOPT-001",
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-03T10:53:49.438026+00:00",
      "state": "settled",
      "decision_owner": "learning",
      "limits": {
        "external_spend": 0,
        "trials": 1,
        "audits": 0,
        "record_batches": 0
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 3,
          "outstanding": 0,
          "next": 1,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 2,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 2,
          "outstanding": 1,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-10-03T10:55:28.010904+00:00",
      "evidence_ref": "experiments/trials/TRIAL-004.md"
    },
    "EXEC-TRIAL-005": {
      "activity": "trial",
      "operation_id": "TRIAL-005",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": "F-CLOUD-ADOPT-001",
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
        "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
        "semantic_revision": 1
      },
      "checked_at": "2026-10-03T10:55:29.298396+00:00",
      "state": "reserved",
      "decision_owner": "learning",
      "limits": {
        "external_spend": 0,
        "trials": 1,
        "audits": 0,
        "record_batches": 0
      },
      "checks": {
        "external_spend": {
          "used": 0,
          "outstanding": 0,
          "next": 0,
          "limit": 0,
          "decision": "allow"
        },
        "trials": {
          "used": 4,
          "outstanding": 0,
          "next": 1,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 2,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "record_batches": {
          "used": 2,
          "outstanding": 1,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero."
    }
  },
  "recovery_records": {},
  "observed_at": "2026-10-03T10:55:29.345272+00:00",
  "display": {
    "plan": "独立監査合格",
    "trial": "検証中",
    "audit": "重大指摘1件",
    "adoption": "採用保留",
    "cycle": "試行中",
    "human_evaluation": "未確認",
    "next": "固定実装の自動検証と実ブラウザを確認する。本番/4実環境/本人は未確認。"
  }
}
---

# 記録役の正本
製品ログから監査・採用を推測しない。
