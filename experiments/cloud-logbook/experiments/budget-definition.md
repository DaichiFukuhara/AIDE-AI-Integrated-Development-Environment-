---
{
  "id": "BUDGET-01",
  "revision": 1,
  "semantic_revision": 1,
  "owner": "learning",
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "limits": {
    "external_spend": {
      "unit": "JPY-new-external-purchases",
      "limit": 0,
      "activities": [
        "trial",
        "audit",
        "record"
      ]
    },
    "trials": {
      "unit": "verification-round",
      "limit": 6,
      "activities": [
        "trial"
      ]
    },
    "audits": {
      "unit": "independent-review-execution",
      "limit": 6,
      "activities": [
        "audit"
      ]
    },
    "record_batches": {
      "unit": "administrative-batch",
      "limit": 80,
      "activities": [
        "record"
      ]
    }
  },
  "delegation_ref": "operations/delegation.md"
}
---

# 実行枠
内部上限は試行6、独立監査6、記録80バッチ。新たな外部購入0円。既存セッションのトークン費用はunknownで0円としない。本番リソースの課金条件が未確認なら本番実行を保留し、ローカル実装と検証を進める。予約・累計・未決分を毎回照合し、修正後は別trialへ保存する。
