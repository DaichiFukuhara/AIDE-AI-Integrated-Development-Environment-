---
{
  "id": "BUDGET-01",
  "revision": 1,
  "semantic_revision": 1,
  "owner": "learning",
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
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "delegation_ref": "operations/delegation.md"
}
---

# 今回の実行枠

利用者が許可したローカルの作り直しを完結するため、担当が内部の実行枠として試行6回、独立監査6回、記録80バッチ以内に絞る。ユーザーが指定した金銭・時間の上限ではなく、勝手に広げない実行上の停止条件。追加の外部購入は0円。新規API・クラウド・パッケージの課金を使わないことを毎回照合する。

既存のCodexセッションのトークン数・契約上の費用は実測不能（unknown）。0円消費や無制限予算とは主張しない。ここで0とするのは新たな外部購入額のみ。上限は試行ラウンド・監査の物理実行・記録バッチをそれぞれ数え、同じ証拠の保存・照会を二重計上しない。試行は同一の固定実装に対するUT/SIT/FITの一組を一回とする。コード修正後の再実行は新試行。記録バッチは次の一工程の意味入力/結果を保存するまとまり。

数値枠に到達したら追加実行せず、証拠と未確認事項を保存して停止する。既存の許可で足りる間は再承認を求めない。
