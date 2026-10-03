---
{
  "audit_id": "AUD-ADOPT-002",
  "audit_request_id": "AR-ADOPT-002",
  "origin_operation_id": "OP-ADOPT-002",
  "target_operation_id": null,
  "kind": "adoption",
  "review_mode": "normal",
  "recovery_ref": null,
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "phase": "implementation",
  "subject_hash": "4879824e8ef7935568ade85401bcfd7f311d126a53c00ee83660ec71d3d8263b",
  "subject_ref": "design/snapshots/SN-c9f08e3889e13bd79044800d4c3758f7e89de4fe1c80a9b4cc10caac006b0ebb/files/audits/subjects/ADOPT-002.json",
  "baseline_refs": {
    "CTX-LOG": "initial",
    "FIT-01": "initial",
    "SIT-01": "initial",
    "SYS-LOG": "initial"
  },
  "cumulative_diff_ref": {
    "from": "initial",
    "via": [
      {
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
      }
    ],
    "to": {
      "id": "IMPL-005",
      "snapshot_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b",
      "files": [
        {
          "id": "api/events.js",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/api/events.js",
          "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
        },
        {
          "id": "api/health.js",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/api/health.js",
          "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
        },
        {
          "id": "api/session.js",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/api/session.js",
          "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
        },
        {
          "id": "cli/logbook.py",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/cli/logbook.py",
          "sha256": "7e52fba9c73240dd0100d5ffb0796b72b93fb9cdb076c7beaa3fb8190f448682"
        },
        {
          "id": "dev/fixture-store.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/dev/fixture-store.mjs",
          "sha256": "c2673d0ce9867552bfa369b593e2679b9c09267be7a0bd0fd553e0e02280f0bd"
        },
        {
          "id": "lib/schema.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/lib/schema.mjs",
          "sha256": "db18c8098ace4501d8f58d5008afd80f1f3687a228aa2c94c5f7e200bfd625f9"
        },
        {
          "id": "lib/service.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/lib/service.mjs",
          "sha256": "7c9606f48cf2944babde983dee4ed339c6c935cfb4328f841168ee4c5c796f6c"
        },
        {
          "id": "lib/supabase.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/lib/supabase.mjs",
          "sha256": "43dac404d5ade374f2bbe21081f471be5ef6a658558de18e4e0c98c941597d45"
        },
        {
          "id": "public/app.js",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/public/app.js",
          "sha256": "812c016e15c340754ee585dbc78b2a5c499ade6461699eb15618160491329b50"
        },
        {
          "id": "public/index.html",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/public/index.html",
          "sha256": "7f523a5bc31620ff908e328c866874c9be5d371b178630a758498890ee56eb37"
        },
        {
          "id": "public/styles.css",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/public/styles.css",
          "sha256": "71f24000802dac2d9a419548190790cb38480ee20f94ab39def7fa423481641a"
        },
        {
          "id": "scripts/dev.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/scripts/dev.mjs",
          "sha256": "f728fed42994d6f034d40d34ca0ee819fee7abd7b8d43b9058cca45e2c0d1a87"
        },
        {
          "id": "scripts/writer-key.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/scripts/writer-key.mjs",
          "sha256": "d1a4bd044652e11bbb37c2e8e136eebf212be05361e84cb37d7320d30b4d2fc8"
        },
        {
          "id": "supabase/migrations/202610030001_logbook.sql",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/supabase/migrations/202610030001_logbook.sql",
          "sha256": "55c67bbbb1c80599c1049852d04b1298312d2f3cd3e48126e3f997621bd3bfaa"
        },
        {
          "id": "tests/auth-recovery.test.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/tests/auth-recovery.test.mjs",
          "sha256": "7d91c411eea8ed95802615d55a3753c5a11a762af4bbd117e143f03ee25c04fe"
        },
        {
          "id": "tests/integration.test.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/tests/integration.test.mjs",
          "sha256": "f15a603bd096889ec61c401a0c617948dd42da321d62d7eac20493263775dc02"
        },
        {
          "id": "tests/service.test.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/tests/service.test.mjs",
          "sha256": "95dba5725cb2e14a6bab71512c321fc0d386b521c17137d8e8ec46403dc72813"
        },
        {
          "id": "README.md",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/README.md",
          "sha256": "5816d7abedc45b79bfb5f677f7453e6e6fea4cf3cbf6fb9cc171194be5fe727a"
        },
        {
          "id": "agent-instructions.md",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/agent-instructions.md",
          "sha256": "17363ce8aa4bdfeda0bbed46320042065fe05e03576945128b54abc70c53f974"
        },
        {
          "id": "package.json",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/package.json",
          "sha256": "f1ace1b766ffdd7e85674db4a48a5c3269e75bd9243f2c1bd2b4b596fcd74a5c"
        },
        {
          "id": "vercel.json",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/vercel.json",
          "sha256": "aae1c40e107f781a55e1360e1fc4b277989b5871912d009ee25fefd9edd14daf"
        },
        {
          "id": ".env.example",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/.env.example",
          "sha256": "352910f4de835d3d62697760de4b0cf7b87368c8251bd3c99e13891587f9073f"
        },
        {
          "id": ".gitignore",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/.gitignore",
          "sha256": "8eddc449ef8e80bcb420c47db10931c282b08111728c0560cfd3a297ff4bf75b"
        },
        {
          "id": ".gitattributes",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/.gitattributes",
          "sha256": "bd9663d71ffce4f030fba3bf7285472e2fab87ce8f71d180d20c14060d0c42a1"
        }
      ]
    },
    "change_ids": [
      "CHANGE-001",
      "CHANGE-002"
    ],
    "correction_delta_ref": {
      "id": "DELTA-ADOPT-002",
      "immutable_ref": "design/snapshots/SN-c9f08e3889e13bd79044800d4c3758f7e89de4fe1c80a9b4cc10caac006b0ebb/files/audits/deltas/AR-ADOPT-002.json",
      "sha256": "a6d9bce982fd3e41fa5c573b57d2ec94a83bed9617b4f2630c6844388d6a33cc",
      "patch_ref": {
        "id": "audits/deltas/AR-ADOPT-002.patch",
        "immutable_ref": "design/snapshots/SN-c9f08e3889e13bd79044800d4c3758f7e89de4fe1c80a9b4cc10caac006b0ebb/files/audits/deltas/AR-ADOPT-002.patch",
        "sha256": "a099ce8dda7f55eebe96e987fd5af7f15b3fed95c573287a9961a6998e047d17"
      }
    }
  },
  "change_ids": [
    "CHANGE-001",
    "CHANGE-002"
  ],
  "previous_audit_ref": {
    "id": "AUD-ADOPT-001",
    "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
    "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
  },
  "previous_subject_ref": {
    "id": "ADOPT-001",
    "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/subjects/ADOPT-001.json",
    "sha256": "565361e6c92423f0abb0048c9ee9c6e14ffd3e359ce84f4da7b47b1b125e5cb9"
  },
  "open_finding_ids": [
    "F-CLOUD-ADOPT-001"
  ],
  "review_delta_ref": {
    "id": "DELTA-ADOPT-002",
    "immutable_ref": "design/snapshots/SN-c9f08e3889e13bd79044800d4c3758f7e89de4fe1c80a9b4cc10caac006b0ebb/files/audits/deltas/AR-ADOPT-002.json",
    "sha256": "a6d9bce982fd3e41fa5c573b57d2ec94a83bed9617b4f2630c6844388d6a33cc",
    "patch_ref": {
      "id": "audits/deltas/AR-ADOPT-002.patch",
      "immutable_ref": "design/snapshots/SN-c9f08e3889e13bd79044800d4c3758f7e89de4fe1c80a9b4cc10caac006b0ebb/files/audits/deltas/AR-ADOPT-002.patch",
      "sha256": "a099ce8dda7f55eebe96e987fd5af7f15b3fed95c573287a9961a6998e047d17"
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
      "part": "イベントの形式・4source・UTC正規化",
      "status": "reused",
      "previous_audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      },
      "input_refs": [
        {
          "id": "lib/schema.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/lib/schema.mjs",
          "sha256": "db18c8098ace4501d8f58d5008afd80f1f3687a228aa2c94c5f7e200bfd625f9"
        }
      ],
      "current_input_refs": [
        {
          "id": "lib/schema.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/lib/schema.mjs",
          "sha256": "db18c8098ace4501d8f58d5008afd80f1f3687a228aa2c94c5f7e200bfd625f9"
        }
      ],
      "dependency_refs": [
        {
          "id": "G-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/master.md",
          "sha256": "a29e568f7cccfd4939338b94ad9f6174479d3a1ee06278403920e1c0343278dc",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/design.md",
          "sha256": "8678d0b82ae089bf2fdbcc80f0680b349174cf92500f3e821b73b5c71030aa70",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/design.md",
          "sha256": "94d316a91d46fbe5206e2cc6f84f8141e5844a3bddf20f3633a49dfcfd328a2b",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/design.md",
          "sha256": "efec22804f60abd1d03fc815ef8dafec6329939e0d1bc26892e88c9b45bcd283",
          "semantic_revision": 1
        },
        {
          "id": "G-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/rationale.md",
          "sha256": "be21f5ccde1b685705d1b4a8c186ac61a17bacd0e46349982220ccddd59cce2b",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/rationale.md",
          "sha256": "2bccdf8c10e5f6bef65ab684c52335e1054dc3f9899259b754e0b91c15f32d85",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/rationale.md",
          "sha256": "3e383a55bf2915113234ea348193860db68cc5fbfb614a48ff0a0bf464290088",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/rationale.md",
          "sha256": "9381cedf0825e4ca0b24d706131805d6e184f1c8570642b4d64417e670e68521",
          "semantic_revision": 1
        },
        {
          "id": "DEF-LOG-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/design.md",
          "sha256": "8428b8239c44ea3c928bb919c0b8dd9c6676f4ef0421e2824ad314372b17d23b",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "DEF-LOG-01-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/rationale.md",
          "sha256": "a4dad2de8671663238e632c0a69fb6f18b44793791f43dabfe103313066e66dc",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "E-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "EVAL-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "DELEGATION-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
          "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
          "semantic_revision": 1
        },
        {
          "id": "BUDGET-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
          "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
          "semantic_revision": 1
        }
      ],
      "evidence_refs": [
        {
          "id": "evidence/TRIAL-003-automated.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-automated.json",
          "sha256": "9d1459bc43f00cd9efa0bd3d4aa3167f77a72c26f56083ac5d1d0c64ee19bb23"
        },
        {
          "id": "evidence/TRIAL-003-browser.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-browser.json",
          "sha256": "b9b30d657489d60ca2c1eacfe7a8ed562fa81f7d6a7938cc179bcda99ab7c110"
        },
        {
          "id": "evidence/TRIAL-003-cli-observations.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-cli-observations.json",
          "sha256": "16d2e7ab017c0d0fbcb1886a60b7b3b5dbb2cd73ab65066ac8dfbe21bab7e793"
        },
        {
          "id": "evidence/TRIAL-003-mobile.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-mobile.png",
          "sha256": "494c2580836d729ef04dc91cfb57cd8873bc884864f5b6368502fbb70056bd0b"
        },
        {
          "id": "evidence/TRIAL-003-offline.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-offline.png",
          "sha256": "cd70a21412b67811a3e4c942bc78ee2a3cbc1e4d2f8fadf619541c6030b89ffa"
        },
        {
          "id": "evidence/TRIAL-003-screen.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-screen.png",
          "sha256": "db18e63e0a79c0753eaf5baeb6a07c6fa92c3c499088de900cc97a96b2dcf4e3"
        },
        {
          "id": "experiments/implementation-003.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/experiments/implementation-003.json",
          "sha256": "3c2326164cb0f1ab0d49dc525ac3a32432bbd92501aa1d6e130a2aadae572f04"
        },
        {
          "id": "design/state.md",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/design/state.md",
          "sha256": "40223a905e5eb6d2c9916dc3aabdcac4b090f89fded643925c7c19b2a53f9f82"
        },
        {
          "id": "evidence/harness-observations.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/evidence/harness-observations.md",
          "sha256": "0e949f8e731abceaefcdb9b9a7f83eda3aef1441159b86151eb6b6cfce3e319d"
        },
        {
          "id": "audits/AUD-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/audits/AUD-PLAN-001.md",
          "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
        },
        {
          "id": "operations/OP-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/operations/OP-PLAN-001.md",
          "sha256": "a84e6a7bacd026c0a8bb93c352a5208d156b9668cea1465e13b23f90dc0ce896"
        }
      ],
      "reason": "対象ファイル内容hashと依拠する仕様・定義・計画・委任の参照が同一。変更Auth経路の証拠としては再利用しない。",
      "excluded": "Authエラー分類は再確認"
    },
    {
      "criterion": "DDD-03",
      "part": "SQLのunique/RPC/RLSとCLIキュー・再送",
      "status": "reused",
      "previous_audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      },
      "input_refs": [
        {
          "id": "supabase/migrations/202610030001_logbook.sql",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/supabase/migrations/202610030001_logbook.sql",
          "sha256": "55c67bbbb1c80599c1049852d04b1298312d2f3cd3e48126e3f997621bd3bfaa"
        },
        {
          "id": "cli/logbook.py",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/cli/logbook.py",
          "sha256": "7e52fba9c73240dd0100d5ffb0796b72b93fb9cdb076c7beaa3fb8190f448682"
        }
      ],
      "current_input_refs": [
        {
          "id": "supabase/migrations/202610030001_logbook.sql",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/supabase/migrations/202610030001_logbook.sql",
          "sha256": "55c67bbbb1c80599c1049852d04b1298312d2f3cd3e48126e3f997621bd3bfaa"
        },
        {
          "id": "cli/logbook.py",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/cli/logbook.py",
          "sha256": "7e52fba9c73240dd0100d5ffb0796b72b93fb9cdb076c7beaa3fb8190f448682"
        }
      ],
      "dependency_refs": [
        {
          "id": "G-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/master.md",
          "sha256": "a29e568f7cccfd4939338b94ad9f6174479d3a1ee06278403920e1c0343278dc",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/design.md",
          "sha256": "8678d0b82ae089bf2fdbcc80f0680b349174cf92500f3e821b73b5c71030aa70",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/design.md",
          "sha256": "94d316a91d46fbe5206e2cc6f84f8141e5844a3bddf20f3633a49dfcfd328a2b",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/design.md",
          "sha256": "efec22804f60abd1d03fc815ef8dafec6329939e0d1bc26892e88c9b45bcd283",
          "semantic_revision": 1
        },
        {
          "id": "G-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/rationale.md",
          "sha256": "be21f5ccde1b685705d1b4a8c186ac61a17bacd0e46349982220ccddd59cce2b",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/rationale.md",
          "sha256": "2bccdf8c10e5f6bef65ab684c52335e1054dc3f9899259b754e0b91c15f32d85",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/rationale.md",
          "sha256": "3e383a55bf2915113234ea348193860db68cc5fbfb614a48ff0a0bf464290088",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/rationale.md",
          "sha256": "9381cedf0825e4ca0b24d706131805d6e184f1c8570642b4d64417e670e68521",
          "semantic_revision": 1
        },
        {
          "id": "DEF-LOG-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/design.md",
          "sha256": "8428b8239c44ea3c928bb919c0b8dd9c6676f4ef0421e2824ad314372b17d23b",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "DEF-LOG-01-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/rationale.md",
          "sha256": "a4dad2de8671663238e632c0a69fb6f18b44793791f43dabfe103313066e66dc",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "E-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "EVAL-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "DELEGATION-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
          "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
          "semantic_revision": 1
        },
        {
          "id": "BUDGET-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
          "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
          "semantic_revision": 1
        }
      ],
      "evidence_refs": [
        {
          "id": "evidence/TRIAL-003-automated.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-automated.json",
          "sha256": "9d1459bc43f00cd9efa0bd3d4aa3167f77a72c26f56083ac5d1d0c64ee19bb23"
        },
        {
          "id": "evidence/TRIAL-003-browser.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-browser.json",
          "sha256": "b9b30d657489d60ca2c1eacfe7a8ed562fa81f7d6a7938cc179bcda99ab7c110"
        },
        {
          "id": "evidence/TRIAL-003-cli-observations.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-cli-observations.json",
          "sha256": "16d2e7ab017c0d0fbcb1886a60b7b3b5dbb2cd73ab65066ac8dfbe21bab7e793"
        },
        {
          "id": "evidence/TRIAL-003-mobile.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-mobile.png",
          "sha256": "494c2580836d729ef04dc91cfb57cd8873bc884864f5b6368502fbb70056bd0b"
        },
        {
          "id": "evidence/TRIAL-003-offline.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-offline.png",
          "sha256": "cd70a21412b67811a3e4c942bc78ee2a3cbc1e4d2f8fadf619541c6030b89ffa"
        },
        {
          "id": "evidence/TRIAL-003-screen.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-screen.png",
          "sha256": "db18e63e0a79c0753eaf5baeb6a07c6fa92c3c499088de900cc97a96b2dcf4e3"
        },
        {
          "id": "experiments/implementation-003.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/experiments/implementation-003.json",
          "sha256": "3c2326164cb0f1ab0d49dc525ac3a32432bbd92501aa1d6e130a2aadae572f04"
        },
        {
          "id": "design/state.md",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/design/state.md",
          "sha256": "40223a905e5eb6d2c9916dc3aabdcac4b090f89fded643925c7c19b2a53f9f82"
        },
        {
          "id": "evidence/harness-observations.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/evidence/harness-observations.md",
          "sha256": "0e949f8e731abceaefcdb9b9a7f83eda3aef1441159b86151eb6b6cfce3e319d"
        },
        {
          "id": "audits/AUD-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/audits/AUD-PLAN-001.md",
          "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
        },
        {
          "id": "operations/OP-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/operations/OP-PLAN-001.md",
          "sha256": "a84e6a7bacd026c0a8bb93c352a5208d156b9668cea1465e13b23f90dc0ce896"
        }
      ],
      "reason": "対象ファイル内容hashと依拠する仕様・定義・計画・委任の参照が同一。変更Auth経路の証拠としては再利用しない。",
      "excluded": "Auth障害時の表示保持は再確認"
    },
    {
      "criterion": "DDD-04",
      "part": "単一contextのseam非該当",
      "status": "reused",
      "previous_audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      },
      "input_refs": [],
      "current_input_refs": [],
      "dependency_refs": [
        {
          "id": "G-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/master.md",
          "sha256": "a29e568f7cccfd4939338b94ad9f6174479d3a1ee06278403920e1c0343278dc",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/design.md",
          "sha256": "8678d0b82ae089bf2fdbcc80f0680b349174cf92500f3e821b73b5c71030aa70",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/design.md",
          "sha256": "94d316a91d46fbe5206e2cc6f84f8141e5844a3bddf20f3633a49dfcfd328a2b",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/design.md",
          "sha256": "efec22804f60abd1d03fc815ef8dafec6329939e0d1bc26892e88c9b45bcd283",
          "semantic_revision": 1
        },
        {
          "id": "G-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/rationale.md",
          "sha256": "be21f5ccde1b685705d1b4a8c186ac61a17bacd0e46349982220ccddd59cce2b",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/rationale.md",
          "sha256": "2bccdf8c10e5f6bef65ab684c52335e1054dc3f9899259b754e0b91c15f32d85",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/rationale.md",
          "sha256": "3e383a55bf2915113234ea348193860db68cc5fbfb614a48ff0a0bf464290088",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/rationale.md",
          "sha256": "9381cedf0825e4ca0b24d706131805d6e184f1c8570642b4d64417e670e68521",
          "semantic_revision": 1
        },
        {
          "id": "DEF-LOG-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/design.md",
          "sha256": "8428b8239c44ea3c928bb919c0b8dd9c6676f4ef0421e2824ad314372b17d23b",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "DEF-LOG-01-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/rationale.md",
          "sha256": "a4dad2de8671663238e632c0a69fb6f18b44793791f43dabfe103313066e66dc",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "E-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "EVAL-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "DELEGATION-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
          "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
          "semantic_revision": 1
        },
        {
          "id": "BUDGET-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
          "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
          "semantic_revision": 1
        }
      ],
      "evidence_refs": [
        {
          "id": "evidence/TRIAL-003-automated.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-automated.json",
          "sha256": "9d1459bc43f00cd9efa0bd3d4aa3167f77a72c26f56083ac5d1d0c64ee19bb23"
        },
        {
          "id": "evidence/TRIAL-003-browser.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-browser.json",
          "sha256": "b9b30d657489d60ca2c1eacfe7a8ed562fa81f7d6a7938cc179bcda99ab7c110"
        },
        {
          "id": "evidence/TRIAL-003-cli-observations.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-cli-observations.json",
          "sha256": "16d2e7ab017c0d0fbcb1886a60b7b3b5dbb2cd73ab65066ac8dfbe21bab7e793"
        },
        {
          "id": "evidence/TRIAL-003-mobile.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-mobile.png",
          "sha256": "494c2580836d729ef04dc91cfb57cd8873bc884864f5b6368502fbb70056bd0b"
        },
        {
          "id": "evidence/TRIAL-003-offline.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-offline.png",
          "sha256": "cd70a21412b67811a3e4c942bc78ee2a3cbc1e4d2f8fadf619541c6030b89ffa"
        },
        {
          "id": "evidence/TRIAL-003-screen.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-screen.png",
          "sha256": "db18e63e0a79c0753eaf5baeb6a07c6fa92c3c499088de900cc97a96b2dcf4e3"
        },
        {
          "id": "experiments/implementation-003.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/experiments/implementation-003.json",
          "sha256": "3c2326164cb0f1ab0d49dc525ac3a32432bbd92501aa1d6e130a2aadae572f04"
        },
        {
          "id": "design/state.md",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/design/state.md",
          "sha256": "40223a905e5eb6d2c9916dc3aabdcac4b090f89fded643925c7c19b2a53f9f82"
        },
        {
          "id": "evidence/harness-observations.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/evidence/harness-observations.md",
          "sha256": "0e949f8e731abceaefcdb9b9a7f83eda3aef1441159b86151eb6b6cfce3e319d"
        },
        {
          "id": "audits/AUD-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/audits/AUD-PLAN-001.md",
          "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
        },
        {
          "id": "operations/OP-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/operations/OP-PLAN-001.md",
          "sha256": "a84e6a7bacd026c0a8bb93c352a5208d156b9668cea1465e13b23f90dc0ce896"
        }
      ],
      "reason": "対象ファイル内容hashと依拠する仕様・定義・計画・委任の参照が同一。変更Auth経路の証拠としては再利用しない。",
      "excluded": "内部Auth→service→UIは再確認"
    },
    {
      "criterion": "DDD-05",
      "part": "既存UT/SITの入力・キュー検証計画とテスト本文",
      "status": "reused",
      "previous_audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      },
      "input_refs": [
        {
          "id": "tests/service.test.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/tests/service.test.mjs",
          "sha256": "95dba5725cb2e14a6bab71512c321fc0d386b521c17137d8e8ec46403dc72813"
        },
        {
          "id": "tests/integration.test.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/tests/integration.test.mjs",
          "sha256": "f15a603bd096889ec61c401a0c617948dd42da321d62d7eac20493263775dc02"
        }
      ],
      "current_input_refs": [
        {
          "id": "tests/service.test.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/tests/service.test.mjs",
          "sha256": "95dba5725cb2e14a6bab71512c321fc0d386b521c17137d8e8ec46403dc72813"
        },
        {
          "id": "tests/integration.test.mjs",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/tests/integration.test.mjs",
          "sha256": "f15a603bd096889ec61c401a0c617948dd42da321d62d7eac20493263775dc02"
        }
      ],
      "dependency_refs": [
        {
          "id": "G-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/master.md",
          "sha256": "a29e568f7cccfd4939338b94ad9f6174479d3a1ee06278403920e1c0343278dc",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/design.md",
          "sha256": "8678d0b82ae089bf2fdbcc80f0680b349174cf92500f3e821b73b5c71030aa70",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/design.md",
          "sha256": "94d316a91d46fbe5206e2cc6f84f8141e5844a3bddf20f3633a49dfcfd328a2b",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/design.md",
          "sha256": "efec22804f60abd1d03fc815ef8dafec6329939e0d1bc26892e88c9b45bcd283",
          "semantic_revision": 1
        },
        {
          "id": "G-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/rationale.md",
          "sha256": "be21f5ccde1b685705d1b4a8c186ac61a17bacd0e46349982220ccddd59cce2b",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/rationale.md",
          "sha256": "2bccdf8c10e5f6bef65ab684c52335e1054dc3f9899259b754e0b91c15f32d85",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/rationale.md",
          "sha256": "3e383a55bf2915113234ea348193860db68cc5fbfb614a48ff0a0bf464290088",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/rationale.md",
          "sha256": "9381cedf0825e4ca0b24d706131805d6e184f1c8570642b4d64417e670e68521",
          "semantic_revision": 1
        },
        {
          "id": "DEF-LOG-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/design.md",
          "sha256": "8428b8239c44ea3c928bb919c0b8dd9c6676f4ef0421e2824ad314372b17d23b",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "DEF-LOG-01-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/rationale.md",
          "sha256": "a4dad2de8671663238e632c0a69fb6f18b44793791f43dabfe103313066e66dc",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "E-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "EVAL-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "DELEGATION-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
          "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
          "semantic_revision": 1
        },
        {
          "id": "BUDGET-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
          "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
          "semantic_revision": 1
        }
      ],
      "evidence_refs": [
        {
          "id": "evidence/TRIAL-003-automated.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-automated.json",
          "sha256": "9d1459bc43f00cd9efa0bd3d4aa3167f77a72c26f56083ac5d1d0c64ee19bb23"
        },
        {
          "id": "evidence/TRIAL-003-browser.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-browser.json",
          "sha256": "b9b30d657489d60ca2c1eacfe7a8ed562fa81f7d6a7938cc179bcda99ab7c110"
        },
        {
          "id": "evidence/TRIAL-003-cli-observations.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-cli-observations.json",
          "sha256": "16d2e7ab017c0d0fbcb1886a60b7b3b5dbb2cd73ab65066ac8dfbe21bab7e793"
        },
        {
          "id": "evidence/TRIAL-003-mobile.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-mobile.png",
          "sha256": "494c2580836d729ef04dc91cfb57cd8873bc884864f5b6368502fbb70056bd0b"
        },
        {
          "id": "evidence/TRIAL-003-offline.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-offline.png",
          "sha256": "cd70a21412b67811a3e4c942bc78ee2a3cbc1e4d2f8fadf619541c6030b89ffa"
        },
        {
          "id": "evidence/TRIAL-003-screen.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-screen.png",
          "sha256": "db18e63e0a79c0753eaf5baeb6a07c6fa92c3c499088de900cc97a96b2dcf4e3"
        },
        {
          "id": "experiments/implementation-003.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/experiments/implementation-003.json",
          "sha256": "3c2326164cb0f1ab0d49dc525ac3a32432bbd92501aa1d6e130a2aadae572f04"
        },
        {
          "id": "design/state.md",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/design/state.md",
          "sha256": "40223a905e5eb6d2c9916dc3aabdcac4b090f89fded643925c7c19b2a53f9f82"
        },
        {
          "id": "evidence/harness-observations.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/evidence/harness-observations.md",
          "sha256": "0e949f8e731abceaefcdb9b9a7f83eda3aef1441159b86151eb6b6cfce3e319d"
        },
        {
          "id": "audits/AUD-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/audits/AUD-PLAN-001.md",
          "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
        },
        {
          "id": "operations/OP-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/operations/OP-PLAN-001.md",
          "sha256": "a84e6a7bacd026c0a8bb93c352a5208d156b9668cea1465e13b23f90dc0ce896"
        }
      ],
      "reason": "対象ファイル内容hashと依拠する仕様・定義・計画・委任の参照が同一。変更Auth経路の証拠としては再利用しない。",
      "excluded": "新Auth回帰と実ブラウザFITは再確認"
    },
    {
      "criterion": "AIDE-01",
      "part": "4階層・固定計画・委任と対象外の範囲",
      "status": "reused",
      "previous_audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      },
      "input_refs": [],
      "current_input_refs": [],
      "dependency_refs": [
        {
          "id": "G-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/master.md",
          "sha256": "a29e568f7cccfd4939338b94ad9f6174479d3a1ee06278403920e1c0343278dc",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/design.md",
          "sha256": "8678d0b82ae089bf2fdbcc80f0680b349174cf92500f3e821b73b5c71030aa70",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/design.md",
          "sha256": "94d316a91d46fbe5206e2cc6f84f8141e5844a3bddf20f3633a49dfcfd328a2b",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/design.md",
          "sha256": "efec22804f60abd1d03fc815ef8dafec6329939e0d1bc26892e88c9b45bcd283",
          "semantic_revision": 1
        },
        {
          "id": "G-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/rationale.md",
          "sha256": "be21f5ccde1b685705d1b4a8c186ac61a17bacd0e46349982220ccddd59cce2b",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/rationale.md",
          "sha256": "2bccdf8c10e5f6bef65ab684c52335e1054dc3f9899259b754e0b91c15f32d85",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/rationale.md",
          "sha256": "3e383a55bf2915113234ea348193860db68cc5fbfb614a48ff0a0bf464290088",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/rationale.md",
          "sha256": "9381cedf0825e4ca0b24d706131805d6e184f1c8570642b4d64417e670e68521",
          "semantic_revision": 1
        },
        {
          "id": "DEF-LOG-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/design.md",
          "sha256": "8428b8239c44ea3c928bb919c0b8dd9c6676f4ef0421e2824ad314372b17d23b",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "DEF-LOG-01-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/rationale.md",
          "sha256": "a4dad2de8671663238e632c0a69fb6f18b44793791f43dabfe103313066e66dc",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "E-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "EVAL-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "DELEGATION-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
          "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
          "semantic_revision": 1
        },
        {
          "id": "BUDGET-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
          "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
          "semantic_revision": 1
        }
      ],
      "evidence_refs": [
        {
          "id": "evidence/TRIAL-003-automated.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-automated.json",
          "sha256": "9d1459bc43f00cd9efa0bd3d4aa3167f77a72c26f56083ac5d1d0c64ee19bb23"
        },
        {
          "id": "evidence/TRIAL-003-browser.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-browser.json",
          "sha256": "b9b30d657489d60ca2c1eacfe7a8ed562fa81f7d6a7938cc179bcda99ab7c110"
        },
        {
          "id": "evidence/TRIAL-003-cli-observations.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-cli-observations.json",
          "sha256": "16d2e7ab017c0d0fbcb1886a60b7b3b5dbb2cd73ab65066ac8dfbe21bab7e793"
        },
        {
          "id": "evidence/TRIAL-003-mobile.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-mobile.png",
          "sha256": "494c2580836d729ef04dc91cfb57cd8873bc884864f5b6368502fbb70056bd0b"
        },
        {
          "id": "evidence/TRIAL-003-offline.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-offline.png",
          "sha256": "cd70a21412b67811a3e4c942bc78ee2a3cbc1e4d2f8fadf619541c6030b89ffa"
        },
        {
          "id": "evidence/TRIAL-003-screen.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-screen.png",
          "sha256": "db18e63e0a79c0753eaf5baeb6a07c6fa92c3c499088de900cc97a96b2dcf4e3"
        },
        {
          "id": "experiments/implementation-003.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/experiments/implementation-003.json",
          "sha256": "3c2326164cb0f1ab0d49dc525ac3a32432bbd92501aa1d6e130a2aadae572f04"
        },
        {
          "id": "design/state.md",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/design/state.md",
          "sha256": "40223a905e5eb6d2c9916dc3aabdcac4b090f89fded643925c7c19b2a53f9f82"
        },
        {
          "id": "evidence/harness-observations.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/evidence/harness-observations.md",
          "sha256": "0e949f8e731abceaefcdb9b9a7f83eda3aef1441159b86151eb6b6cfce3e319d"
        },
        {
          "id": "audits/AUD-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/audits/AUD-PLAN-001.md",
          "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
        },
        {
          "id": "operations/OP-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/operations/OP-PLAN-001.md",
          "sha256": "a84e6a7bacd026c0a8bb93c352a5208d156b9668cea1465e13b23f90dc0ce896"
        }
      ],
      "reason": "対象ファイル内容hashと依拠する仕様・定義・計画・委任の参照が同一。変更Auth経路の証拠としては再利用しない。",
      "excluded": "新subject/予約/未確認の扱いは再確認"
    },
    {
      "criterion": "AIDE-02",
      "part": "画面の静的layoutとログの自己申告の意味",
      "status": "reused",
      "previous_audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      },
      "input_refs": [
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
          "id": "agent-instructions.md",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/agent-instructions.md",
          "sha256": "17363ce8aa4bdfeda0bbed46320042065fe05e03576945128b54abc70c53f974"
        }
      ],
      "current_input_refs": [
        {
          "id": "public/index.html",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/public/index.html",
          "sha256": "7f523a5bc31620ff908e328c866874c9be5d371b178630a758498890ee56eb37"
        },
        {
          "id": "public/styles.css",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/public/styles.css",
          "sha256": "71f24000802dac2d9a419548190790cb38480ee20f94ab39def7fa423481641a"
        },
        {
          "id": "agent-instructions.md",
          "immutable_ref": "design/snapshots/SN-60f3c2f3c64f6056df6636c55ad0bc509abc707990ab062d03bd3c753b95544b/files/agent-instructions.md",
          "sha256": "17363ce8aa4bdfeda0bbed46320042065fe05e03576945128b54abc70c53f974"
        }
      ],
      "dependency_refs": [
        {
          "id": "G-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/master.md",
          "sha256": "a29e568f7cccfd4939338b94ad9f6174479d3a1ee06278403920e1c0343278dc",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/design.md",
          "sha256": "8678d0b82ae089bf2fdbcc80f0680b349174cf92500f3e821b73b5c71030aa70",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/design.md",
          "sha256": "94d316a91d46fbe5206e2cc6f84f8141e5844a3bddf20f3633a49dfcfd328a2b",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/design.md",
          "sha256": "efec22804f60abd1d03fc815ef8dafec6329939e0d1bc26892e88c9b45bcd283",
          "semantic_revision": 1
        },
        {
          "id": "G-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/rationale.md",
          "sha256": "be21f5ccde1b685705d1b4a8c186ac61a17bacd0e46349982220ccddd59cce2b",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/rationale.md",
          "sha256": "2bccdf8c10e5f6bef65ab684c52335e1054dc3f9899259b754e0b91c15f32d85",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/rationale.md",
          "sha256": "3e383a55bf2915113234ea348193860db68cc5fbfb614a48ff0a0bf464290088",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/rationale.md",
          "sha256": "9381cedf0825e4ca0b24d706131805d6e184f1c8570642b4d64417e670e68521",
          "semantic_revision": 1
        },
        {
          "id": "DEF-LOG-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/design.md",
          "sha256": "8428b8239c44ea3c928bb919c0b8dd9c6676f4ef0421e2824ad314372b17d23b",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "DEF-LOG-01-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/rationale.md",
          "sha256": "a4dad2de8671663238e632c0a69fb6f18b44793791f43dabfe103313066e66dc",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "E-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "EVAL-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "DELEGATION-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
          "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
          "semantic_revision": 1
        },
        {
          "id": "BUDGET-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
          "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
          "semantic_revision": 1
        }
      ],
      "evidence_refs": [
        {
          "id": "evidence/TRIAL-003-automated.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-automated.json",
          "sha256": "9d1459bc43f00cd9efa0bd3d4aa3167f77a72c26f56083ac5d1d0c64ee19bb23"
        },
        {
          "id": "evidence/TRIAL-003-browser.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-browser.json",
          "sha256": "b9b30d657489d60ca2c1eacfe7a8ed562fa81f7d6a7938cc179bcda99ab7c110"
        },
        {
          "id": "evidence/TRIAL-003-cli-observations.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-cli-observations.json",
          "sha256": "16d2e7ab017c0d0fbcb1886a60b7b3b5dbb2cd73ab65066ac8dfbe21bab7e793"
        },
        {
          "id": "evidence/TRIAL-003-mobile.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-mobile.png",
          "sha256": "494c2580836d729ef04dc91cfb57cd8873bc884864f5b6368502fbb70056bd0b"
        },
        {
          "id": "evidence/TRIAL-003-offline.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-offline.png",
          "sha256": "cd70a21412b67811a3e4c942bc78ee2a3cbc1e4d2f8fadf619541c6030b89ffa"
        },
        {
          "id": "evidence/TRIAL-003-screen.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-screen.png",
          "sha256": "db18e63e0a79c0753eaf5baeb6a07c6fa92c3c499088de900cc97a96b2dcf4e3"
        },
        {
          "id": "experiments/implementation-003.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/experiments/implementation-003.json",
          "sha256": "3c2326164cb0f1ab0d49dc525ac3a32432bbd92501aa1d6e130a2aadae572f04"
        },
        {
          "id": "design/state.md",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/design/state.md",
          "sha256": "40223a905e5eb6d2c9916dc3aabdcac4b090f89fded643925c7c19b2a53f9f82"
        },
        {
          "id": "evidence/harness-observations.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/evidence/harness-observations.md",
          "sha256": "0e949f8e731abceaefcdb9b9a7f83eda3aef1441159b86151eb6b6cfce3e319d"
        },
        {
          "id": "audits/AUD-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/audits/AUD-PLAN-001.md",
          "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
        },
        {
          "id": "operations/OP-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/operations/OP-PLAN-001.md",
          "sha256": "a84e6a7bacd026c0a8bb93c352a5208d156b9668cea1465e13b23f90dc0ce896"
        }
      ],
      "reason": "対象ファイル内容hashと依拠する仕様・定義・計画・委任の参照が同一。変更Auth経路の証拠としては再利用しない。",
      "excluded": "app.jsのAuth障害表示は再確認"
    },
    {
      "criterion": "AIDE-03",
      "part": "旧snapshot・監査・失敗試行の固定入力",
      "status": "reused",
      "previous_audit_ref": {
        "id": "AUD-ADOPT-001",
        "immutable_ref": "design/snapshots/SN-036c3904c01c70798592c484abfc41670d730336c8971b53b059d72e55992c7a/files/audits/AUD-ADOPT-001.md",
        "sha256": "a49b3bbd46fe9a2a4e2cc33dbb6a77bcff62584487015b3494425674c90f42f3"
      },
      "input_refs": [],
      "current_input_refs": [],
      "dependency_refs": [
        {
          "id": "G-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/master.md",
          "sha256": "a29e568f7cccfd4939338b94ad9f6174479d3a1ee06278403920e1c0343278dc",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/design.md",
          "sha256": "8678d0b82ae089bf2fdbcc80f0680b349174cf92500f3e821b73b5c71030aa70",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/design.md",
          "sha256": "94d316a91d46fbe5206e2cc6f84f8141e5844a3bddf20f3633a49dfcfd328a2b",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/design.md",
          "sha256": "efec22804f60abd1d03fc815ef8dafec6329939e0d1bc26892e88c9b45bcd283",
          "semantic_revision": 1
        },
        {
          "id": "G-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/rationale.md",
          "sha256": "be21f5ccde1b685705d1b4a8c186ac61a17bacd0e46349982220ccddd59cce2b",
          "semantic_revision": 1
        },
        {
          "id": "SG-TRACE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/rationale.md",
          "sha256": "2bccdf8c10e5f6bef65ab684c52335e1054dc3f9899259b754e0b91c15f32d85",
          "semantic_revision": 1
        },
        {
          "id": "AP-FILE-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/goals/trace/approaches/file/rationale.md",
          "sha256": "3e383a55bf2915113234ea348193860db68cc5fbfb614a48ff0a0bf464290088",
          "semantic_revision": 1
        },
        {
          "id": "SYS-LOG-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/systems/console/rationale.md",
          "sha256": "9381cedf0825e4ca0b24d706131805d6e184f1c8570642b4d64417e670e68521",
          "semantic_revision": 1
        },
        {
          "id": "DEF-LOG-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/design.md",
          "sha256": "8428b8239c44ea3c928bb919c0b8dd9c6676f4ef0421e2824ad314372b17d23b",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "DEF-LOG-01-rationale",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/design/domains/log/rationale.md",
          "sha256": "a4dad2de8671663238e632c0a69fb6f18b44793791f43dabfe103313066e66dc",
          "semantic_revision": 1,
          "domain_id": "D-LOG",
          "context_id": "CTX-LOG",
          "canonical_owner": "SYS-LOG",
          "dependencies": []
        },
        {
          "id": "E-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "EVAL-001",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/E-001-plan.md",
          "sha256": "90a233f68c2135c29f23c4624865bc5513c45fad14b8d98ec8ac3401d05fa1de",
          "semantic_revision": 1
        },
        {
          "id": "DELEGATION-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/operations/delegation.md",
          "sha256": "391c97b9a2e3c17dd871740b80991832d713002c97d8207d7c5b9fe59c772d45",
          "semantic_revision": 1
        },
        {
          "id": "BUDGET-01",
          "immutable_ref": "design/snapshots/SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4/files/experiments/budget-definition.md",
          "sha256": "6eae3ab9ea2c13170219f30fd66b5a5795e102a737e6670da62e7e601f644406",
          "semantic_revision": 1
        }
      ],
      "evidence_refs": [
        {
          "id": "evidence/TRIAL-003-automated.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-automated.json",
          "sha256": "9d1459bc43f00cd9efa0bd3d4aa3167f77a72c26f56083ac5d1d0c64ee19bb23"
        },
        {
          "id": "evidence/TRIAL-003-browser.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-browser.json",
          "sha256": "b9b30d657489d60ca2c1eacfe7a8ed562fa81f7d6a7938cc179bcda99ab7c110"
        },
        {
          "id": "evidence/TRIAL-003-cli-observations.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-cli-observations.json",
          "sha256": "16d2e7ab017c0d0fbcb1886a60b7b3b5dbb2cd73ab65066ac8dfbe21bab7e793"
        },
        {
          "id": "evidence/TRIAL-003-mobile.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-mobile.png",
          "sha256": "494c2580836d729ef04dc91cfb57cd8873bc884864f5b6368502fbb70056bd0b"
        },
        {
          "id": "evidence/TRIAL-003-offline.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-offline.png",
          "sha256": "cd70a21412b67811a3e4c942bc78ee2a3cbc1e4d2f8fadf619541c6030b89ffa"
        },
        {
          "id": "evidence/TRIAL-003-screen.png",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/evidence/TRIAL-003-screen.png",
          "sha256": "db18e63e0a79c0753eaf5baeb6a07c6fa92c3c499088de900cc97a96b2dcf4e3"
        },
        {
          "id": "experiments/implementation-003.json",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/experiments/implementation-003.json",
          "sha256": "3c2326164cb0f1ab0d49dc525ac3a32432bbd92501aa1d6e130a2aadae572f04"
        },
        {
          "id": "design/state.md",
          "immutable_ref": "design/snapshots/SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62/files/design/state.md",
          "sha256": "40223a905e5eb6d2c9916dc3aabdcac4b090f89fded643925c7c19b2a53f9f82"
        },
        {
          "id": "evidence/harness-observations.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/evidence/harness-observations.md",
          "sha256": "0e949f8e731abceaefcdb9b9a7f83eda3aef1441159b86151eb6b6cfce3e319d"
        },
        {
          "id": "audits/AUD-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/audits/AUD-PLAN-001.md",
          "sha256": "b5665c4e9c86f8d10b04522b6be3fcef99a61c1c7c9487d0176cceeb1023d3f5"
        },
        {
          "id": "operations/OP-PLAN-001.md",
          "immutable_ref": "design/snapshots/SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79/files/operations/OP-PLAN-001.md",
          "sha256": "a84e6a7bacd026c0a8bb93c352a5208d156b9668cea1465e13b23f90dc0ce896"
        }
      ],
      "reason": "対象ファイル内容hashと依拠する仕様・定義・計画・委任の参照が同一。変更Auth経路の証拠としては再利用しない。",
      "excluded": "新入力hash・差分・台帳・FIT不足は再確認"
    }
  ],
  "budget_account_refs": [
    "LOCAL-01"
  ],
  "execution_id": "EXEC-AUDIT-ADOPT-002",
  "budget_check_ref": "design/state.md#EXEC-AUDIT-ADOPT-002",
  "policy_ref": null,
  "criteria_version": 1,
  "reviewer": "Claude Opus 5.5 (claude-opus-5-5, Claude Code desktop session 2026-10-03; external independent auditor; drafter/implementer/record Codex gpt-6.1-sol)",
  "independence": "independent",
  "self_check_delegation_ref": null,
  "observed_at": "2026-10-03T11:05:25Z",
  "result": "audit-pass",
  "finding_ids": [
    "F-CLOUD-ADOPT-002"
  ],
  "closed_finding_ids": [
    "F-CLOUD-ADOPT-001"
  ],
  "open_major_count": 0,
  "open_blocker_count": 0,
  "open_minor_count": 1,
  "evidence_refs": [
    "evidence/AUD-ADOPT-002-fit-browser.json",
    "evidence/AUD-ADOPT-002-fit-server.mjs"
  ],
  "unverified": [
    "DEPLOY-01: 実Supabase DB/Auth/RLS/RPC、Vercel HTTPS、Secure cookieは未確認。Authエラー分類は偽transportと自動テストでのみ確認。",
    "SOURCES-01: 4実環境からの送信は未確認。",
    "HUMAN-01: 本人評価は未確認。",
    "native download完了、他ブラウザ、長期運用、クラウドキュー持続性は未確認。",
    "採用確定/current反映/cycle_closed/周期判定はrecord担当の処理で未実施。"
  ],
  "next_due": null
}
---

# クラウド版の採用再監査：Authの一時障害の分類は解消（audit-pass、minor 1件）

## 固定対象・予算・独立性

対象はCLOUD-LOGBOOKのAR-ADOPT-002、ADOPT-002、IMPL-005。phase=implementation、criteria version 1、scope=CTX-LOG/FIT-01/SIT-01/SYS-LOG。累積差分はinitial→IMPL-003（CHANGE-001）→IMPL-005（CHANGE-002）。
要求の固定入力を読む前に照合した結果は次のとおり。subject（ADOPT-002）・前回監査AUD-ADOPT-001・前回subject ADOPT-001・review delta DELTA-ADOPT-002・委任DELEGATION-01の実測SHA-256は要求と一致。subject本体のcanonical digestはsubject_hash 4879824e…263bと一致。作業ツリーのIMPL-005の全ファイルhashは実装記録と一致。
予約EXEC-AUDIT-ADOPT-002（activity=audit、corrective_finding=F-CLOUD-ADOPT-001、LOCAL-01、BUDGET-01）がstateにreservedで存在することを確認した。外部有料APIと購入はない。

監査担当はClaude Opus 5.5（Claude Code desktop、2026-10-03のセッション）。起草・実装・記録担当のCodex（gpt-6.1-sol）とは別のモデル・別のセッションである。
独立性の限界も記す。本監査担当は同じセッションで利用者の依頼によりCodexへの作業指示（codex-task-001/002）を書いた。そこには前回監査の解消条件を転記し、対象外の指摘を引き継ぎ記録とするよう指示した。製品コード・テスト・試行記録・stateは書いていない。本監査で追加したのは監査用ファイルだけである（evidence/AUD-ADOPT-002-fit-server.mjs、evidence/AUD-ADOPT-002-fit-browser.json、本ファイル）。

## 読んだ対象と方法

詳しく読み直したのは次の範囲である。open指摘の解消条件、IMPL-003→IMPL-005の入力差分（lib/supabase.mjs、lib/service.mjs、public/app.js、tests/auth-recovery.test.mjs）、その波及先（Auth→viewer/session→GET session/events→app load/起動処理→cookie/表示）。
IMPL-004→IMPL-005の差分はテストファイル1件だけで、製品コードは同一だった。TRIAL-004の失敗（26/29）はテスト側のcookie模擬処理の誤りで、製品の挙動ではない。失敗記録も保存されている。
`npm test`を監査担当が再実行した（TMP/TEMPはリポジトリ内）。結果は29件中29件合格、失敗0件。
加えて、変更部分の前回未確認範囲（FIT-01の実ブラウザ確認）を監査担当が実施した。固定されたpublic/・service・supabaseアダプタを実ブラウザ（Claude desktop内蔵Chromium）で動かし、アダプタのtransportだけをSupabase Auth/PostgRESTの偽物に差し替えて障害を切り替えた。詳細はevidence/AUD-ADOPT-002-fit-browser.json。これは実Supabase Auth・HTTPS・Vercelの確認ではない。

## 基準と根拠

| criterion | 適用と証拠 | 判定・理由付きN/A |
| --- | --- | --- |
| DDD-01 | 一時Auth障害は503 storage_unavailableになり、真の資格・セッション拒否は401 authentication_failedになる。この結果分類をsupabase.mjsの分岐と29件のテスト、実ブラウザ9項目で確認した。イベント形式・4source・UTC正規化は前回確認を引き継ぐ（下記）。 | 確認済み |
| DDD-02 | writer認証・scope、service鍵は挿入のみ、閲覧はviewer JWTという権限配置は変更なし。認証まわりの変更はcookie無効化の条件を狭めただけで、新しい権限は生まない。認識できない400/401/403を503として扱う動きは、権限を広げない側（閲覧を許さず、cookieを残すだけ）である。 | 確認済み |
| DDD-03 | 前回指摘の反例を、user・refreshの両経路の500/429/通信例外で検証した。一覧・詳細・閲覧者表示とcookieが保持され、「未更新」が表示され、障害解除後は再ログインなしで再取得できた（実ブラウザ6項目と自動テスト）。真の失効では消去されてログイン画面に戻る。SQL/RPC/RLSとCLIキュー・再送は前回確認を引き継ぐ。 | F-CLOUD-ADOPT-001は解消 |
| DDD-04 | 単一contextのseamはN/A（前回から変更なし）。内部境界のAuth→service→UIのエラー変換は、今回の差分とテストで一貫していることを確認した。 | 確認済み |
| DDD-05 | 新しい回帰テスト（tests/auth-recovery.test.mjs、21件）は実アダプタ・実service・実app.jsをNode VMで結合し、偽物はtransportとDOMだけである。user/refresh×500/429/通信例外/真の失効（400 invalid_grant、401 bad_jwt、403 refresh token not found）/認識できない400-403/起動時障害/有効refreshでの更新を網羅する。これを実ブラウザFITが補う。 | 確認済み |
| AIDE-01 | 修正は前回のcorrection_scope（Auth応答分類・session/UI表示・回帰検証）の中に収まっている。検索範囲の不一致・自動記録・自動更新・コード整形は、製品を変えずに引き継ぎ記録（evidence/CORRECTION-004-handoff.md）へ回されている。 | 確認済み |
| AIDE-02 | 画面の文言は「未更新。」と「前回取得したログを表示しています。」に分かれ、空・未接続・失敗を区別できる。ログの自己申告の意味は変更なし（引き継ぎ）。 | 確認済み（下記minor 1件） |
| AIDE-03 | IMPL-004/005、TRIAL-004（失敗）/TRIAL-005、CORRECTION-004の停止記録（record-blocked）と受理記録が保存され、旧snapshot・旧監査結果は未変更。前回のfailを今回のpassへ読み替えていない。 | 確認済み |

再利用する確認（reused_checks）として、要求の7件（DDD-01形式、DDD-03 SQL/キュー、DDD-04 seam N/A、DDD-05既存テスト入力、AIDE-01範囲、AIDE-02静的layout、AIDE-03旧固定入力）の入力ファイルを照合した。lib/schema.mjs、SQL migration、cli/logbook.py、styles.css、index.htmlなどはIMPL-003とIMPL-005でhashが同一で、今回の波及経路（Auth→session→UI）の外にある。よって前回のAUD-ADOPT-001の確認を引き継ぐ。
適用基準はすべて「今回確認」「理由付きN/A」「有効な前回確認の引継ぎ」のいずれかで覆われている。

## 指摘

### F-CLOUD-ADOPT-001 — Authの一時障害を401に変換していた件（前回major）

- status: closed（IMPL-005で解消）
- 根拠: lib/supabase.mjsは/auth/の非2xxを一律401にせず、400/401/403のうち既知の拒否コード・文言だけを401にする。それ以外（429、5xx、認識できない400-403）は503にする。通信例外は従来どおり503。service.mjsのviewerはFaultの401だけでcookieを消す。app.jsは401以外で前回表示を保持し、「未更新。」を表示する。自動テスト29/29と実ブラウザ9項目で、解消条件（両経路、500/429/通信例外/真の失効、cookie非削除、旧ログ保持、復旧後取得、真の失効時消去）を確認した。

### F-CLOUD-ADOPT-002 — 起動時の障害画面に再試行・ログアウトの手段がない

- criterion: AIDE-02（利用者が状態を理解して次の操作をとれること）、DDD-03（障害時の振る舞い）
- 対象版/場所: IMPL-005、public/app.js 末尾の起動処理（`/api/session`が401以外で失敗した分岐）
- severity: minor
- owner: SYS-LOG実装担当（Codex）
- status: open
- 観測: ページを開いた時点（起動時）にAuthの一時障害があると、「保存先へ接続できません。 未更新。」だけが表示される。ログインフォーム・作業領域・ログアウトボタンはすべて非表示になる（実ブラウザ startup-outage-refresh-500）。復旧にはページの再読み込みが必要だが、その案内はない。
- 影響: 一時障害なら再読み込みで回復するので、データ損失や誤認証はない。ただしsupabase.mjsは「認識できない400/401/403」も一時障害（503）として扱う。将来Supabase Authがエラー表現を変えて真の失効が認識されなくなった場合、利用者はこの画面から抜けられない。refresh cookieの有効期限（30日）まで、ログアウトも別アカウントでのログインもできなくなる。現在既知のエラー表現（bad_jwt、invalid_grant、refresh token not found など）は正しく401になることを確認したので、現時点の目的・条件違反ではなくminorとする。
- 解消条件（次サイクルで可。採用は妨げない）: 起動時の障害画面に、再試行ボタン（または再読み込みの案内）と、cookieを消去できるログアウト操作を出す。あわせて、認識できない400/401/403を数回続けて受けた場合の扱いを決める（例: 一定回数で利用者に再ログインを選ばせる）。

## 次の処理と未確認範囲

open major 0件、open blocker 0件、open minor 1件（F-CLOUD-ADOPT-002）。適用基準はすべて証拠・理由付きN/A・有効な引継ぎで覆われているため、結果はaudit-passとする。
受理（基準への登録、F-CLOUD-ADOPT-001のblocked scope解除、予約EXEC-AUDIT-ADOPT-002の精算、採用/current判断、cycle_closed）はrecord担当の処理で、本監査は行わない。本結果自体はcurrentを切り替えない。
採用は「ローカル技術的試験の採用」に限る。次は未確認のまま残る: DEPLOY-01（実Supabase DB/Auth/RLS/RPC、Vercel HTTPS、Secure cookie）、SOURCES-01（4実環境からの送信）、HUMAN-01（本人評価）、native download完了、他ブラウザ・長期運用・クラウドキューの持続性。実Supabase Authの実際のエラー本文に対する分類は、偽transportでのみ確認した。
F-CLOUD-ADOPT-002と、引き継ぎ記録にある4件（検索範囲の不一致、自己申告であり監視ではない点、自動更新なし、1行圧縮コード）は次の計画で扱う。
