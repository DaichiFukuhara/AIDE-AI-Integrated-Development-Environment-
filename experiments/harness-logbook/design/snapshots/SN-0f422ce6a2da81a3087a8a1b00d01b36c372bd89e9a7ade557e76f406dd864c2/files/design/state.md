---
{
  "project_id": "HARNESS-LOGBOOK",
  "revision": 10,
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
    }
  ],
  "received_notifications": {},
  "pending_changes": [],
  "blocked_scopes": [],
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
          "cumulative_used": 0
        },
        "audits": {
          "unit": "independent-review-execution",
          "limit": 6,
          "activities": [
            "audit"
          ],
          "cumulative_used": 1
        },
        "record_batches": {
          "unit": "administrative-batch",
          "limit": 80,
          "activities": [
            "record"
          ],
          "cumulative_used": 1
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
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero."
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
      "basis": "Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero."
    }
  },
  "recovery_records": {},
  "observed_at": "2026-09-27T08:31:53.433296+00:00",
  "display": {
    "plan": "独立監査合格",
    "trial": "検証中",
    "audit": "計画のみ合格",
    "adoption": "未採用",
    "cycle": "試行中",
    "human_evaluation": "未確認",
    "next": "固定した実装でUT/SITとブラウザ実使用を確認し、未確認を含めてtrialへ保存する。"
  }
}
---

# 現在の状態

frontmatterが記録役の正本です。current_bundleだけが採用済みの版集合を指します。ログの文言から採用や監査を推測しません。本人評価は未確認です。
