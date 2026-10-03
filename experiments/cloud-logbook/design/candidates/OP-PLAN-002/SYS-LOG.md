---
{
  "id": "SYS-LOG",
  "kind": "system",
  "revision": 2,
  "semantic_revision": 2,
  "status": "ready",
  "primary_parent": "AP-FILE",
  "parent_semantic_revision": 2,
  "domain_id": "D-LOG",
  "context_id": "CTX-LOG",
  "source_refs": [
    "DELEGATION-02"
  ],
  "children": [],
  "uses_systems": [],
  "model_definition_refs": [
    "DEF-LOG-01"
  ],
  "owned_seams": [],
  "seam_refs": [],
  "dependencies": [],
  "unit_test_id": "UT-01",
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

# Claude hookを最小メタデータのイベントへ変換する

SYS-LOGはClaude Codeの外部callbackを未信頼入力として扱い、許可キーの抽出、マスク、切詰め、relative path、安全な固定コマンド分類、セッション識別、上限、ローカルqueue、非同期worker、表示区分を所有する。入力・結果・失敗・再送の完全な内部境界契約はE-002-plan.mdの対象イベント/変換/失敗時/量の節に固定する。

SessionStart/endと個別tool完了、prompt/Stop/SubagentStopのsummaryを観測する。raw JSON/transcript/tool_response文字列を保存しない。tool_use_idが未確認なら個別記録の成立を未確認とし、集計縮退は利用者確認対象。登録解除はproject設定を無効化し、既存queueを消さずflush可とする。Claudeの作業の取消や正式監査状態へ意味を変換しない。

正常例: Read完了を相対pathと実測duration、不明/明示成否で保存し認証画面へ表示。重要例外: HTTP停止でも前景は終了コード0で続行、保存済みイベントは後で同id/time/contentをflushする。ローカルdisk/lock障害時は保存成功を主張せず欠落を診断する。

UT-AUTO-01/02が単体条件、SIT-01/FIT-01が結合条件。秘密を送らないことと非阻害は必須。実装・設定・試行はまだ存在せず、監査予約で停止する。

定義はDEF-LOG-01意味版2の候補に依拠する。既存14フィールド、認証・owner境界、HTTPS/loopback、同ID同内容duplicate・異内容409、認証切れ消去と一時障害時旧表示保持を維持する。既存条件UT-01/SIT-01/FIT-01を弱めず、EVAL-002が追加の確認を対応付ける。この候補はcurrentを変更しない。
