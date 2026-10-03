---
{
  "id": "AP-FILE",
  "kind": "approach",
  "revision": 2,
  "semantic_revision": 2,
  "status": "ready",
  "primary_parent": "SG-TRACE",
  "parent_semantic_revision": 2,
  "domain_id": "D-LOG",
  "context_id": "CTX-LOG",
  "source_refs": [
    "DELEGATION-02"
  ],
  "children": [
    {
      "id": "SYS-LOG",
      "relation": "all_of",
      "group": null,
      "selected": true,
      "responsibility": "AP-01",
      "expected_outcome": "ローカル耐久キューとHTTPS APIを用い、Vercel/Supabaseへ配備する",
      "acceptance": "EVAL-002の対応UT/SIT/FIT条件とE-001の既存条件を保つ",
      "constraints": "Claude-localのみ、全文非収集、追加購入0、実機/本人未確認"
    }
  ],
  "uses_systems": [],
  "model_definition_refs": [
    "DEF-LOG-01"
  ],
  "owned_seams": [],
  "seam_refs": [],
  "dependencies": [],
  "unit_test_id": null,
  "subgoal_integration_id": null,
  "final_integration_id": null,
  "plan_ref": "E-002",
  "model_definition_versions": {
    "DEF-LOG-01": 2
  },
  "criteria_version": 2,
  "candidate_operation_id": "OP-PLAN-002",
  "adopted": false
}
---

# キュー先行と非同期HTTPで作業を守る

既存の1イベント1JSON・保存先行・同内容再送を使い、hookの前景からHTTPを除く。SYS-LOGが入力変換・短い排他・固定イベント・worker・旧CLIとUIの整合を一体で所有する。Vercel/Supabaseの方針を保ち、今回はloopback fixtureのみ。asyncとtimeoutが未確認なら設定を有効化しない。

定義はDEF-LOG-01意味版2の候補に依拠する。既存14フィールド、認証・owner境界、HTTPS/loopback、同ID同内容duplicate・異内容409、認証切れ消去と一時障害時旧表示保持を維持する。既存条件UT-01/SIT-01/FIT-01を弱めず、EVAL-002が追加の確認を対応付ける。この候補はcurrentを変更しない。
