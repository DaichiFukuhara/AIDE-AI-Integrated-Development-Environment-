---
{
  "project_id": "HARNESS-LOGBOOK",
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
    "source_ref": "harness-v3/protocols/messages.md#サイクル終了と周期要求"
  },
  "writer": "/root (record role)",
  "current_bundle": {
    "id": "BUNDLE-001",
    "immutable_ref": "design/snapshots/SN-afb709d14befc37ffe909fc08aef67e96574f36710a9ebc26941d66bb7be34ac/files/design/candidates/OP-ADOPT-002/bundle.json",
    "sha256": "b4090fe0cb3fcdfbef7c013da3416adc84b7279fef4e28546cbf8ba836fe8348"
  },
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
      "subject_hash": "9431c95d8b589849d3eeca9c842f065818af2f284ef8be1dcb84b2cd4c567ae3",
      "subject_ref": "audits/subjects/PLAN-001.json",
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-4442e0be12628716554f9ee4548c74953f99eb1f5ae698f3a4b618147922049b/files/audits/AUD-PLAN-001.md",
        "sha256": "424f817b160eb89cce4f5240e532c5660c0327d01fae94456f8fe22fefb9ca7a"
      },
      "accepted_at": "2026-09-27T08:19:19.087622+00:00"
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
      "subject_hash": "9431c95d8b589849d3eeca9c842f065818af2f284ef8be1dcb84b2cd4c567ae3",
      "subject_ref": "audits/subjects/PLAN-001.json",
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-4442e0be12628716554f9ee4548c74953f99eb1f5ae698f3a4b618147922049b/files/audits/AUD-PLAN-001.md",
        "sha256": "424f817b160eb89cce4f5240e532c5660c0327d01fae94456f8fe22fefb9ca7a"
      },
      "accepted_at": "2026-09-27T08:19:19.087648+00:00"
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
      "subject_hash": "9431c95d8b589849d3eeca9c842f065818af2f284ef8be1dcb84b2cd4c567ae3",
      "subject_ref": "audits/subjects/PLAN-001.json",
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-4442e0be12628716554f9ee4548c74953f99eb1f5ae698f3a4b618147922049b/files/audits/AUD-PLAN-001.md",
        "sha256": "424f817b160eb89cce4f5240e532c5660c0327d01fae94456f8fe22fefb9ca7a"
      },
      "accepted_at": "2026-09-27T08:19:19.087655+00:00"
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
      "subject_hash": "9431c95d8b589849d3eeca9c842f065818af2f284ef8be1dcb84b2cd4c567ae3",
      "subject_ref": "audits/subjects/PLAN-001.json",
      "audit_request_id": "AR-PLAN-001",
      "result_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-4442e0be12628716554f9ee4548c74953f99eb1f5ae698f3a4b618147922049b/files/audits/AUD-PLAN-001.md",
        "sha256": "424f817b160eb89cce4f5240e532c5660c0327d01fae94456f8fe22fefb9ca7a"
      },
      "accepted_at": "2026-09-27T08:19:19.087660+00:00"
    },
    {
      "scope_id": "CTX-LOG",
      "phase": "implementation",
      "criteria_version": 1,
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "subject_hash": "dfa9272bbad7a6102b5a00787af56e6251068287a61252fee1dba4e9677f32bb",
      "subject_ref": {
        "id": "SUBJECT-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/subjects/ADOPT-002.json",
        "sha256": "401fa22562711fb0583dafcb5b9ca9558a6589616f7e59336499fd9d72e24c1e"
      },
      "audit_request_id": "AR-ADOPT-002",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      },
      "accepted_at": "2026-09-29T06:56:45.405098+00:00"
    },
    {
      "scope_id": "FIT-01",
      "phase": "implementation",
      "criteria_version": 1,
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "subject_hash": "dfa9272bbad7a6102b5a00787af56e6251068287a61252fee1dba4e9677f32bb",
      "subject_ref": {
        "id": "SUBJECT-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/subjects/ADOPT-002.json",
        "sha256": "401fa22562711fb0583dafcb5b9ca9558a6589616f7e59336499fd9d72e24c1e"
      },
      "audit_request_id": "AR-ADOPT-002",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      },
      "accepted_at": "2026-09-29T06:56:45.405110+00:00"
    },
    {
      "scope_id": "SIT-01",
      "phase": "implementation",
      "criteria_version": 1,
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "subject_hash": "dfa9272bbad7a6102b5a00787af56e6251068287a61252fee1dba4e9677f32bb",
      "subject_ref": {
        "id": "SUBJECT-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/subjects/ADOPT-002.json",
        "sha256": "401fa22562711fb0583dafcb5b9ca9558a6589616f7e59336499fd9d72e24c1e"
      },
      "audit_request_id": "AR-ADOPT-002",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      },
      "accepted_at": "2026-09-29T06:56:45.405119+00:00"
    },
    {
      "scope_id": "SYS-LOG",
      "phase": "implementation",
      "criteria_version": 1,
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "subject_hash": "dfa9272bbad7a6102b5a00787af56e6251068287a61252fee1dba4e9677f32bb",
      "subject_ref": {
        "id": "SUBJECT-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/subjects/ADOPT-002.json",
        "sha256": "401fa22562711fb0583dafcb5b9ca9558a6589616f7e59336499fd9d72e24c1e"
      },
      "audit_request_id": "AR-ADOPT-002",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      },
      "accepted_at": "2026-09-29T06:56:45.405127+00:00"
    }
  ],
  "unaudited_changes": [],
  "operations": {
    "OP-PLAN-001": {
      "payload_hash": "86081f3d77d0032f71304d9bb35037392d579b865b96c80c8a4b361eb6b34b9c",
      "kind": "plan",
      "subject_hash": "9431c95d8b589849d3eeca9c842f065818af2f284ef8be1dcb84b2cd4c567ae3",
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
        "immutable_ref": "design/snapshots/SN-4442e0be12628716554f9ee4548c74953f99eb1f5ae698f3a4b618147922049b/files/audits/AUD-PLAN-001.md",
        "sha256": "424f817b160eb89cce4f5240e532c5660c0327d01fae94456f8fe22fefb9ca7a"
      }
    },
    "OP-ADOPT-001": {
      "payload_hash": "3b3a2d915c667ddaeb9aaf04740808689fb1cd03fb44bf7e63cdd35ed73a4ea7",
      "kind": "adoption",
      "subject_hash": "c2d13158576611b8628edae06a075415d905c7d2e13b8a91f5e6fa074193f6ae",
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
        "immutable_ref": "design/snapshots/SN-08888bb614195fe493d4ddf547f9e9758f08f1eacfb5ad54bde052413d17608e/files/audits/AUD-ADOPT-001.md",
        "sha256": "9b357f0c192f705a2529fbf81a92c16e1217490e284ee6c8a734a0f8ed39c0c4"
      }
    },
    "OP-ADOPT-002": {
      "payload_hash": "2448f0aa6d9314d745df26ea9ca8549477ad65884080b0810e20ab1d4e54db39",
      "kind": "adoption",
      "subject_hash": "dfa9272bbad7a6102b5a00787af56e6251068287a61252fee1dba4e9677f32bb",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "state": "committed",
      "result": "applied",
      "bundle": {
        "id": "BUNDLE-001",
        "immutable_ref": "design/snapshots/SN-afb709d14befc37ffe909fc08aef67e96574f36710a9ebc26941d66bb7be34ac/files/design/candidates/OP-ADOPT-002/bundle.json",
        "sha256": "b4090fe0cb3fcdfbef7c013da3416adc84b7279fef4e28546cbf8ba836fe8348"
      },
      "audit_request_id": "AR-ADOPT-002",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      },
      "committed_at": "2026-09-29T06:56:45.405084+00:00"
    },
    "OP-CLOSE-001": {
      "kind": "cycle_closed",
      "payload_hash": "bba208d27ef66f317980f5dc7d0ff4b2bbe3fbd47e294b5dff590adf3bc89e91",
      "state": "committed",
      "result": "acknowledged",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "bundle": {
        "id": "BUNDLE-001",
        "immutable_ref": "design/snapshots/SN-afb709d14befc37ffe909fc08aef67e96574f36710a9ebc26941d66bb7be34ac/files/design/candidates/OP-ADOPT-002/bundle.json",
        "sha256": "b4090fe0cb3fcdfbef7c013da3416adc84b7279fef4e28546cbf8ba836fe8348"
      },
      "payload_ref": {
        "id": "OP-CLOSE-001",
        "immutable_ref": "design/snapshots/SN-7666b9e06c626a710fb25d0e6911c06e1acbefcaffc626858523dfe8549c072f/files/operations/OP-CLOSE-001-payload.json",
        "sha256": "db38e706e640afa842418142188ee693097a8d362674d63d5371e11c761143ac"
      }
    }
  },
  "tombstones": {},
  "outbox": [
    {
      "message_id": "AR-PLAN-001",
      "kind": "S-AUDIT-INPUT",
      "payload_ref": "audits/AR-PLAN-001-request.json",
      "target": "independent-auditor",
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
        "immutable_ref": "design/snapshots/SN-08888bb614195fe493d4ddf547f9e9758f08f1eacfb5ad54bde052413d17608e/files/audits/AUD-ADOPT-001.md",
        "sha256": "9b357f0c192f705a2529fbf81a92c16e1217490e284ee6c8a734a0f8ed39c0c4"
      }
    },
    {
      "message_id": "AR-ADOPT-002",
      "kind": "S-AUDIT-INPUT",
      "payload_ref": "audits/AR-ADOPT-002-request.json",
      "target": "/root/harness_auditor",
      "state": "acknowledged",
      "execution_id": "EXEC-AUDIT-ADOPT-002",
      "account_refs": [
        "LOCAL-01"
      ],
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      }
    },
    {
      "message_id": "OP-CLOSE-001",
      "kind": "S-PROPOSAL",
      "payload_ref": {
        "id": "OP-CLOSE-001",
        "immutable_ref": "design/snapshots/SN-7666b9e06c626a710fb25d0e6911c06e1acbefcaffc626858523dfe8549c072f/files/operations/OP-CLOSE-001-payload.json",
        "sha256": "db38e706e640afa842418142188ee693097a8d362674d63d5371e11c761143ac"
      },
      "target": "record",
      "state": "acknowledged"
    }
  ],
  "received_notifications": {
    "OP-CLOSE-001": {
      "payload_hash": "bba208d27ef66f317980f5dc7d0ff4b2bbe3fbd47e294b5dff590adf3bc89e91",
      "cycle_id": "C-001",
      "periodic_request_id": null,
      "periodic_status": "skipped",
      "skip_reason": "no-unaudited-implementation-changes: CHANGE-001/CHANGE-002の全scopeと結合条件を同一subjectの独立adoption監査で保証し、採用時に一括解消済み。採用後の製品変更なし。",
      "ack": "acknowledged",
      "acknowledged_at": "2026-09-29T06:56:51.987401+00:00",
      "policy": {
        "revision": 1,
        "cycle_closed_enabled": true,
        "after_days": 7,
        "timezone": "Asia/Tokyo",
        "source_ref": "harness-v3/protocols/messages.md#サイクル終了と周期要求"
      },
      "next_due": null,
      "waiting_state": null
    }
  },
  "pending_changes": [],
  "blocked_scopes": [
    {
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "state": "resolved",
      "finding_id": "F-ADOPT-001",
      "audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-08888bb614195fe493d4ddf547f9e9758f08f1eacfb5ad54bde052413d17608e/files/audits/AUD-ADOPT-001.md",
        "sha256": "9b357f0c192f705a2529fbf81a92c16e1217490e284ee6c8a734a0f8ed39c0c4"
      },
      "permitted_operations": [
        "TRIAL-003",
        "AR-ADOPT-002"
      ],
      "release_condition": "Independent re-audit confirms invalid stored evidence rejected, original bytes preserved, HTTP errors, and valid missing evidence history retained.",
      "correction_scope": "Evidence syntax validation and regression tests only; adoption stays held.",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      },
      "resolved_at": "2026-09-29T06:56:45.405046+00:00"
    }
  ],
  "budget_accounts": {
    "LOCAL-01": {
      "owner": "learning",
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "delegation_ref": {
        "id": "DELEGATION-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/operations/delegation.md",
        "sha256": "b8a963b0b669b593a5bf1262149940e23563f42cf0b5f322b2190d83c9da750f",
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
          "cumulative_used": 3
        },
        "audits": {
          "unit": "independent-review-execution",
          "limit": 6,
          "activities": [
            "audit"
          ],
          "cumulative_used": 3
        },
        "record_batches": {
          "unit": "administrative-batch",
          "limit": 80,
          "activities": [
            "record"
          ],
          "cumulative_used": 3
        }
      }
    }
  },
  "execution_reservations": {
    "EXEC-AUDIT-PLAN-001": {
      "activity": "audit",
      "operation_id": "AR-PLAN-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-27T08:14:52.580869+00:00",
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
          "outstanding": 0,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-09-27T08:19:19.171915+00:00",
      "evidence_ref": {
        "id": "AUD-PLAN-001",
        "immutable_ref": "design/snapshots/SN-4442e0be12628716554f9ee4548c74953f99eb1f5ae698f3a4b618147922049b/files/audits/AUD-PLAN-001.md",
        "sha256": "424f817b160eb89cce4f5240e532c5660c0327d01fae94456f8fe22fefb9ca7a"
      }
    },
    "EXEC-RECORD-001": {
      "activity": "record",
      "operation_id": "PREPARATION-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-27T08:17:33.114116+00:00",
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
          "outstanding": 1,
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
      "settled_at": "2026-09-27T08:19:19.209855+00:00",
      "evidence_ref": "evidence/precheck-plan-001.json"
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
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-27T08:19:19.258938+00:00",
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
      "settled_at": "2026-09-29T06:41:45.830394+00:00",
      "evidence_ref": "experiments/trials/TRIAL-002.md"
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
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-27T08:31:53.255002+00:00",
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
      "settled_at": "2026-09-27T08:35:42.957586+00:00",
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
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-27T08:37:05.560906+00:00",
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
      "settled_at": "2026-09-27T08:40:03.782855+00:00",
      "evidence_ref": "experiments/trials/TRIAL-002.md"
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
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-29T06:40:46.822702+00:00",
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
          "used": 2,
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
          "used": 1,
          "outstanding": 1,
          "next": 0,
          "limit": 80,
          "decision": "allow"
        }
      },
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-09-29T06:48:37.243892+00:00",
      "evidence_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-08888bb614195fe493d4ddf547f9e9758f08f1eacfb5ad54bde052413d17608e/files/audits/AUD-ADOPT-001.md",
        "sha256": "9b357f0c192f705a2529fbf81a92c16e1217490e284ee6c8a734a0f8ed39c0c4"
      }
    },
    "EXEC-RECORD-003": {
      "activity": "record",
      "operation_id": "OP-ADOPT-001",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-29T06:41:45.865290+00:00",
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
          "used": 2,
          "outstanding": 0,
          "next": 0,
          "limit": 6,
          "decision": "allow"
        },
        "audits": {
          "used": 1,
          "outstanding": 1,
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
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.",
      "settled_at": "2026-09-29T06:56:52.076275+00:00",
      "evidence_ref": "operations/OP-CLOSE-001.md"
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
      "corrective_finding": "F-ADOPT-001",
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-29T06:49:22.375942+00:00",
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
      "settled_at": "2026-09-29T06:52:01.032688+00:00",
      "evidence_ref": "experiments/trials/TRIAL-003.md"
    },
    "EXEC-AUDIT-ADOPT-002": {
      "activity": "audit",
      "operation_id": "AR-ADOPT-002",
      "scope": [
        "CTX-LOG",
        "FIT-01",
        "SIT-01",
        "SYS-LOG"
      ],
      "corrective_finding": "F-ADOPT-001",
      "account_refs": [
        "LOCAL-01"
      ],
      "definition_ref": {
        "id": "BUDGET-01",
        "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/budget-definition.md",
        "sha256": "58e88a8bfe1fcfc2aaa89810e08e04c234919e954046fc0a7c9e5877f3095e08",
        "semantic_revision": 1
      },
      "checked_at": "2026-09-29T06:52:11.137212+00:00",
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
          "used": 2,
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
      "settled_at": "2026-09-29T06:56:45.405350+00:00",
      "evidence_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      }
    }
  },
  "recovery_records": {},
  "observed_at": "2026-09-29T06:56:52.076303+00:00",
  "display": {
    "plan": "独立監査合格",
    "trial": "実使用まで確認",
    "audit": "実装の独立監査合格",
    "adoption": "試験採用済み",
    "cycle": "実験サイクル完了",
    "human_evaluation": "未確認",
    "next": "実ログを実際に読み、判断理由・根拠・次の操作が作業の再開に十分かを本人が確認する。HUMAN-01は未確認。"
  },
  "resolved_changes": [
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
      "first_changed_at": "2026-09-29T06:40:46.755510+00:00",
      "operation_id": "OP-ADOPT-001",
      "old_version": null,
      "new_version": {
        "id": "IMPL-002",
        "snapshot_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508",
        "files": [
          {
            "id": "src/app.js",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/app.js",
            "sha256": "daf1ba56650ce07bf3d2ed23442e72b2b71cdf5a4455eed266f30f6e066ac0a3"
          },
          {
            "id": "src/index.html",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/index.html",
            "sha256": "797b2928e2b29737841953f6412ed1ce7ae6542a35b0e3982cc5c4a31a9ddbe8"
          },
          {
            "id": "src/logbook.py",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/logbook.py",
            "sha256": "bd4e6a7e84b993176076faa43249ed50105bc3abe52ff3d9e649f23aa3154cf6"
          },
          {
            "id": "src/server.py",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/server.py",
            "sha256": "2b54a5225adb2601bb8feb57386909808ea0ca7c632ccb342c3f8a206c02ff69"
          },
          {
            "id": "src/styles.css",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/styles.css",
            "sha256": "8998f2e819f50b7c2fa53fd4dd9596f19a9e0ad1882050db90017433a86c3726"
          },
          {
            "id": "src/view.mjs",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/view.mjs",
            "sha256": "1daae34f73ea0026f14c4042289b01b071ed905d632434f770884fa53bbb77a6"
          },
          {
            "id": "tests/test_logbook.py",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/tests/test_logbook.py",
            "sha256": "054f898f5718736ac86d3aaebf2b22f70ea6b7a94ce8d44e0ebd5d73fc12cb33"
          },
          {
            "id": "tests/view.test.mjs",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/tests/view.test.mjs",
            "sha256": "8aaf5fc78a257c67759d59406a72cf9e89b12b3acd5b0b019251bafa8d12fe93"
          },
          {
            "id": "README.md",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/README.md",
            "sha256": "6f6b77740fd70cac52a66bca45909112b4abdf22e536e6370afb6c4ef3e017ad"
          }
        ]
      },
      "joint_condition": "CLI→保存→HTTP→画面の結合を分割せず同じsubjectで保証する",
      "reason": "初回の製品試験採用。旧試作は採用済みbundleではない。",
      "resolution": "audited-on-adoption",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      },
      "adopted_bundle": {
        "id": "BUNDLE-001",
        "immutable_ref": "design/snapshots/SN-afb709d14befc37ffe909fc08aef67e96574f36710a9ebc26941d66bb7be34ac/files/design/candidates/OP-ADOPT-002/bundle.json",
        "sha256": "b4090fe0cb3fcdfbef7c013da3416adc84b7279fef4e28546cbf8ba836fe8348"
      },
      "resolved_at": "2026-09-29T06:56:45.405142+00:00"
    },
    {
      "change_id": "CHANGE-002",
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
      "first_changed_at": "2026-09-29T06:52:11.046495+00:00",
      "operation_id": "OP-ADOPT-002",
      "old_version": {
        "id": "IMPL-002",
        "snapshot_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508",
        "files": [
          {
            "id": "src/app.js",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/app.js",
            "sha256": "daf1ba56650ce07bf3d2ed23442e72b2b71cdf5a4455eed266f30f6e066ac0a3"
          },
          {
            "id": "src/index.html",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/index.html",
            "sha256": "797b2928e2b29737841953f6412ed1ce7ae6542a35b0e3982cc5c4a31a9ddbe8"
          },
          {
            "id": "src/logbook.py",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/logbook.py",
            "sha256": "bd4e6a7e84b993176076faa43249ed50105bc3abe52ff3d9e649f23aa3154cf6"
          },
          {
            "id": "src/server.py",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/server.py",
            "sha256": "2b54a5225adb2601bb8feb57386909808ea0ca7c632ccb342c3f8a206c02ff69"
          },
          {
            "id": "src/styles.css",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/styles.css",
            "sha256": "8998f2e819f50b7c2fa53fd4dd9596f19a9e0ad1882050db90017433a86c3726"
          },
          {
            "id": "src/view.mjs",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/src/view.mjs",
            "sha256": "1daae34f73ea0026f14c4042289b01b071ed905d632434f770884fa53bbb77a6"
          },
          {
            "id": "tests/test_logbook.py",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/tests/test_logbook.py",
            "sha256": "054f898f5718736ac86d3aaebf2b22f70ea6b7a94ce8d44e0ebd5d73fc12cb33"
          },
          {
            "id": "tests/view.test.mjs",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/tests/view.test.mjs",
            "sha256": "8aaf5fc78a257c67759d59406a72cf9e89b12b3acd5b0b019251bafa8d12fe93"
          },
          {
            "id": "README.md",
            "immutable_ref": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508/files/README.md",
            "sha256": "6f6b77740fd70cac52a66bca45909112b4abdf22e536e6370afb6c4ef3e017ad"
          }
        ]
      },
      "new_version": {
        "id": "IMPL-003",
        "snapshot_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c",
        "files": [
          {
            "id": "src/app.js",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/src/app.js",
            "sha256": "daf1ba56650ce07bf3d2ed23442e72b2b71cdf5a4455eed266f30f6e066ac0a3"
          },
          {
            "id": "src/index.html",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/src/index.html",
            "sha256": "797b2928e2b29737841953f6412ed1ce7ae6542a35b0e3982cc5c4a31a9ddbe8"
          },
          {
            "id": "src/logbook.py",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/src/logbook.py",
            "sha256": "55a9812fab0e78f26ab4c987f8f959b2fc336d266119918c889aac30f7c143ec"
          },
          {
            "id": "src/server.py",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/src/server.py",
            "sha256": "2b54a5225adb2601bb8feb57386909808ea0ca7c632ccb342c3f8a206c02ff69"
          },
          {
            "id": "src/styles.css",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/src/styles.css",
            "sha256": "8998f2e819f50b7c2fa53fd4dd9596f19a9e0ad1882050db90017433a86c3726"
          },
          {
            "id": "src/view.mjs",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/src/view.mjs",
            "sha256": "1daae34f73ea0026f14c4042289b01b071ed905d632434f770884fa53bbb77a6"
          },
          {
            "id": "tests/test_logbook.py",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/tests/test_logbook.py",
            "sha256": "970563ed63f8e9e235d0e79f87d9b432d8ea3a6e4322bfed87a663d5d7ae93b9"
          },
          {
            "id": "tests/view.test.mjs",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/tests/view.test.mjs",
            "sha256": "8aaf5fc78a257c67759d59406a72cf9e89b12b3acd5b0b019251bafa8d12fe93"
          },
          {
            "id": "README.md",
            "immutable_ref": "design/snapshots/SN-ab067bd158eaf063473f087a2db3fc6f7a726f8375951c5666669ac1a750a91c/files/README.md",
            "sha256": "6f6b77740fd70cac52a66bca45909112b4abdf22e536e6370afb6c4ef3e017ad"
          }
        ]
      },
      "joint_condition": "CLI/storage/HTTP/UI remain one subject",
      "reason": "F-ADOPT-001 correction",
      "resolution": "audited-on-adoption",
      "result_ref": {
        "id": "AUD-ADOPT-002",
        "immutable_ref": "design/snapshots/SN-c5374d75334af84033b2b43d437e1e7cec34f6700252ddf43cf0affc030a73ab/files/audits/AUD-ADOPT-002.md",
        "sha256": "bc04358169efb1eab7283da95fd7a6c3333ac40ee0be805fc3594b47a6f8e193"
      },
      "adopted_bundle": {
        "id": "BUNDLE-001",
        "immutable_ref": "design/snapshots/SN-afb709d14befc37ffe909fc08aef67e96574f36710a9ebc26941d66bb7be34ac/files/design/candidates/OP-ADOPT-002/bundle.json",
        "sha256": "b4090fe0cb3fcdfbef7c013da3416adc84b7279fef4e28546cbf8ba836fe8348"
      },
      "resolved_at": "2026-09-29T06:56:45.405152+00:00"
    }
  ],
  "cycle_status": {
    "cycle_id": "C-001",
    "state": "complete",
    "closed_at": "2026-09-29T06:56:51.893775+00:00",
    "closure_id": "OP-CLOSE-001",
    "periodic": "reasoned-skip",
    "human_evaluation": "unverified",
    "project_complete": false
  }
}
---

# 現在の状態

frontmatterが記録役の正本です。current_bundleだけが採用済みの版集合を指します。ログの文言から採用や監査を推測しません。本人評価は未確認です。
