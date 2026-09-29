---
{
  "trial_id": "TRIAL-001",
  "experiment_id": "E-001",
  "plan_revision": 1,
  "plan_ref": {
    "id": "E-001",
    "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/E-001-plan.md",
    "sha256": "58965cddce100a3539fbca080dfdba3e8a19c0bf153c0bdb34b29addbd40ad7d",
    "semantic_revision": 1
  },
  "implementation_ref": {
    "id": "IMPL-001",
    "snapshot_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1",
    "files": [
      {
        "id": "src/app.js",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/src/app.js",
        "sha256": "e13b7a8bb68e12579ecf469e2fe78fa069c8e4ef5657a05be6949a0c977799c8"
      },
      {
        "id": "src/index.html",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/src/index.html",
        "sha256": "35a2d11686480900505939b7672505f67269ea033a105be74418a7039a8a7034"
      },
      {
        "id": "src/logbook.py",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/src/logbook.py",
        "sha256": "bd4e6a7e84b993176076faa43249ed50105bc3abe52ff3d9e649f23aa3154cf6"
      },
      {
        "id": "src/server.py",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/src/server.py",
        "sha256": "2b54a5225adb2601bb8feb57386909808ea0ca7c632ccb342c3f8a206c02ff69"
      },
      {
        "id": "src/styles.css",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/src/styles.css",
        "sha256": "8998f2e819f50b7c2fa53fd4dd9596f19a9e0ad1882050db90017433a86c3726"
      },
      {
        "id": "src/view.mjs",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/src/view.mjs",
        "sha256": "1daae34f73ea0026f14c4042289b01b071ed905d632434f770884fa53bbb77a6"
      },
      {
        "id": "tests/test_logbook.py",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/tests/test_logbook.py",
        "sha256": "054f898f5718736ac86d3aaebf2b22f70ea6b7a94ce8d44e0ebd5d73fc12cb33"
      },
      {
        "id": "tests/view.test.mjs",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/tests/view.test.mjs",
        "sha256": "8aaf5fc78a257c67759d59406a72cf9e89b12b3acd5b0b019251bafa8d12fe93"
      },
      {
        "id": "README.md",
        "immutable_ref": "design/snapshots/SN-dc1980eca48d8de29a34d6f7ba56f3ddfb939d7a8551145d512106dabc3dfaf1/files/README.md",
        "sha256": "c18b5b3b4e09c8b9452816fa93e6fa3b17a90e6f78f586931c6fd242a944857d"
      }
    ]
  },
  "model_definition_refs": [
    {
      "id": "DEF-LOG-01",
      "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/design/domains/log/design.md",
      "sha256": "6b0c6ef8e5310605a2c70e694216c3389241333a9b69275cfc4cb203b9dc9f80",
      "semantic_revision": 1,
      "domain_id": "D-LOG",
      "context_id": "CTX-LOG",
      "canonical_owner": "SYS-LOG",
      "dependencies": []
    },
    {
      "id": "DEF-LOG-01-rationale",
      "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/design/domains/log/rationale.md",
      "sha256": "7ee274e0e6c2356eaaf36e4955d8b3a27df20e5bbff0ad2ff0e763f0e4715f29",
      "semantic_revision": 1,
      "domain_id": "D-LOG",
      "context_id": "CTX-LOG",
      "canonical_owner": "SYS-LOG",
      "dependencies": []
    }
  ],
  "evaluation_ref": {
    "id": "EVAL-001",
    "immutable_ref": "design/snapshots/SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585/files/experiments/E-001-plan.md",
    "sha256": "58965cddce100a3539fbca080dfdba3e8a19c0bf153c0bdb34b29addbd40ad7d",
    "semantic_revision": 1
  },
  "evidence_refs": [
    {
      "id": "evidence/TRIAL-001-automated.json",
      "immutable_ref": "design/snapshots/SN-0f422ce6a2da81a3087a8a1b00d01b36c372bd89e9a7ade557e76f406dd864c2/files/evidence/TRIAL-001-automated.json",
      "sha256": "11d1395fad500646d819b961c764d9420a1daa8810e93cc0fd9a282d34a6b6f4"
    },
    {
      "id": "evidence/TRIAL-001-browser.json",
      "immutable_ref": "design/snapshots/SN-0f422ce6a2da81a3087a8a1b00d01b36c372bd89e9a7ade557e76f406dd864c2/files/evidence/TRIAL-001-browser.json",
      "sha256": "d4f58f4e6e9f6acc62a8da86de278fb0d3a3a85982658e171d14368241ee1e2f"
    },
    {
      "id": "experiments/implementation-001.json",
      "immutable_ref": "design/snapshots/SN-0f422ce6a2da81a3087a8a1b00d01b36c372bd89e9a7ade557e76f406dd864c2/files/experiments/implementation-001.json",
      "sha256": "74cc082b058f428b992c94a230c7216c1c2a9d17bfd29b0f6dafc7a15d204880"
    },
    {
      "id": "data/events.json",
      "immutable_ref": "design/snapshots/SN-0f422ce6a2da81a3087a8a1b00d01b36c372bd89e9a7ade557e76f406dd864c2/files/data/events.json",
      "sha256": "97886276bde55b0abddb642d5751968d22a54cf3658251be69cd670b2ed96e56"
    },
    {
      "id": "design/state.md",
      "immutable_ref": "design/snapshots/SN-0f422ce6a2da81a3087a8a1b00d01b36c372bd89e9a7ade557e76f406dd864c2/files/design/state.md",
      "sha256": "22ccb0a23d11d7e8b3953ed314920c67d658f1f850686b08eef18ba79510fa4b"
    },
    {
      "id": "evidence/TRIAL-001-real-cli.json",
      "immutable_ref": "design/snapshots/SN-0f422ce6a2da81a3087a8a1b00d01b36c372bd89e9a7ade557e76f406dd864c2/files/evidence/TRIAL-001-real-cli.json",
      "sha256": "cbc22bd417a374140e0406e098c5442f6b2a23c9e78f2c585f12bf2cbe60dad9"
    }
  ],
  "executed_at": "2026-09-27T08:35:42.936177+00:00",
  "execution_id": "EXEC-TRIAL-001",
  "budget_account_refs": [
    "LOCAL-01"
  ],
  "budget_usage": {
    "LOCAL-01/trials": {
      "used": 1,
      "unit": "verification-round"
    },
    "LOCAL-01/external_spend": {
      "used": 0,
      "unit": "JPY-new-external-purchases"
    },
    "platform_token_cost": "unknown"
  },
  "budget_settlement_ref": "design/state.md#EXEC-TRIAL-001",
  "result": "needs-fix"
}
---

# TRIAL-001: UT13件と表示ロジック4件は成功。検索・工程絞り込み・詳細・再読保持は確認。根拠Markdownの別タブ表示がブラウザで拒否され、狭い画面の操作名も不足。画面内根拠表示とaria-labelを追加し同一計画で再試行する。

固定計画はplan_revision=1。実装の不変ファイル集合と、実行コマンド・終了コード・標準出力/エラー・ブラウザ観測をfrontmatterの不変参照に保存した。

## 観測と評価
UT13件と表示ロジック4件は成功。検索・工程絞り込み・詳細・再読保持は確認。根拠Markdownの別タブ表示がブラウザで拒否され、狭い画面の操作名も不足。画面内根拠表示とaria-labelを追加し同一計画で再試行する。

自動検証は実プロセスで実行。ブラウザの実使用はAI操作であり本人評価ではない。最初の計画・設計・計画監査のイベントは記録経路完成後の事後記録と本文に明記。実際のハーネス手順やツール結果から記録しており架空セッションではない。

## 限界と次
HUMAN-01、長期運用、全ブラウザ互換は未確認。修正後に同じ評価条件で新しいtrialを作り、旧試行を保存する。
