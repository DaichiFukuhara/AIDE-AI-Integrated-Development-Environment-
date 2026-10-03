---
{
  "id": "SG-TRACE",
  "kind": "subgoal",
  "revision": 3,
  "semantic_revision": 3,
  "status": "ready",
  "primary_parent": "G-LOG",
  "parent_semantic_revision": 3,
  "domain_id": "D-LOG",
  "context_id": "CTX-LOG",
  "source_refs": [
    "DELEGATION-02"
  ],
  "children": [
    {
      "id": "AP-FILE",
      "relation": "all_of",
      "group": null,
      "selected": true,
      "responsibility": "SIT-01",
      "expected_outcome": "ローカル保存から認証付きAPI・永続保存・閲覧まで版と結果を追う",
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
  "subgoal_integration_id": "SIT-01",
  "final_integration_id": null,
  "plan_ref": "E-002",
  "model_definition_versions": {
    "DEF-LOG-01": 3
  },
  "criteria_version": 2,
  "candidate_operation_id": "OP-PLAN-003",
  "adopted": false
}
---

# 観測と節目の記録を再送し、読み直せる

手動記録に加え、Claude Codeで実際に観測したcallbackだけを同じrunへまとめる。SIT-01はproducer→耐久キュー→認証API→fixture保存→読取の対応、資格制限・故障保持・冪等性・旧CLI互換を共同で確認する。AP-FILEへローカル耐久化と非同期送信を割り当てる。成功未確認をpassへ変換しない。

定義はDEF-LOG-01意味版3の候補に依拠する。既存14フィールド、認証・owner境界、HTTPS/loopback、同ID同内容duplicate・異内容409、認証切れ消去と一時障害時旧表示保持を維持する。既存条件UT-01/SIT-01/FIT-01を弱めず、EVAL-002が追加の確認を対応付ける。この候補はcurrentを変更しない。

seqとsummary件数の照合、start後endなしをSIT-AUTO-01で画面まで検証する。意図的省略・手動記録・未取得範囲を区別し、欠落の可能性の表示は完全性証明ではない。
