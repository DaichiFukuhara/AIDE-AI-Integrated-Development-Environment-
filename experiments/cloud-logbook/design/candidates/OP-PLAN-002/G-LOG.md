---
{
  "id": "G-LOG",
  "kind": "root_goal",
  "revision": 2,
  "semantic_revision": 2,
  "status": "ready",
  "primary_parent": null,
  "parent_semantic_revision": null,
  "domain_id": "D-LOG",
  "context_id": "CTX-LOG",
  "source_refs": [
    "DELEGATION-02"
  ],
  "children": [
    {
      "id": "SG-TRACE",
      "relation": "all_of",
      "group": null,
      "selected": true,
      "responsibility": "FIT-01",
      "expected_outcome": "4環境のログを一つの見やすい画面で読み、次の作業へ進める",
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
  "final_integration_id": "FIT-01",
  "plan_ref": "E-002",
  "model_definition_versions": {
    "DEF-LOG-01": 2
  },
  "criteria_version": 2,
  "candidate_operation_id": "OP-PLAN-002",
  "adopted": false
}
---

# 安全な作業記録を読み、次の作業へ進む

4環境の節目記録を同じ画面で読む目的を保つ。E-002はClaude Codeローカルの観測メタデータを追加する限定候補である。自動と手動を見分け、相対path・固定要約・不明結果・省略件数を読み取れることをFIT-01の追加条件とする。ライブ一覧、本番、他source、全操作の完全監視を保証しない。

SG-TRACEへ安全な取得・キュー・認証閲覧の条件を割り当て、rootは実セッションのhook観測から画面での確認までのFIT-AUTO-01/02・FIT-UI-02を共同条件として持つ。本人評価が未確認なら限定採用であり製品全体完成ではない。

定義はDEF-LOG-01意味版2の候補に依拠する。既存14フィールド、認証・owner境界、HTTPS/loopback、同ID同内容duplicate・異内容409、認証切れ消去と一時障害時旧表示保持を維持する。既存条件UT-01/SIT-01/FIT-01を弱めず、EVAL-002が追加の確認を対応付ける。この候補はcurrentを変更しない。
