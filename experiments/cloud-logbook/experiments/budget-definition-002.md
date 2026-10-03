---
{
  "id":"BUDGET-02","revision":1,"semantic_revision":1,"owner":"learning",
  "experiment_id":"E-002","cycle_id":"C-002","account_id":"LOCAL-E002",
  "scope":["CTX-LOG","FIT-01","SIT-01","SYS-LOG"],
  "parent_account_refs":["LOCAL-01"],"delegation_ref":"operations/delegation-002.md",
  "limits":{
    "external_spend":{"unit":"JPY-new-external-purchases","limit":0,"activities":["trial","audit","record"]},
    "trials":{"unit":"verification-round","limit":1,"activities":["trial"]},
    "audits":{"unit":"independent-review-execution","limit":2,"activities":["audit"]},
    "record_batches":{"unit":"administrative-batch","limit":6,"activities":["record"]}
  },
  "parent_limits_unchanged":{"external_spend":0,"trials":6,"audits":6,"record_batches":80},
  "parent_used_at_intake":{"external_spend":0,"trials":5,"audits":3,"record_batches":5},
  "parent_outstanding_at_intake":{"external_spend":0,"trials":0,"audits":0,"record_batches":0}
}
---

# 既存の残枠から E-002 を配分する

LOCAL-01 の総枠（試行6・独立監査6・記録80・追加購入0円）と C-001 の実績を引き継ぎ、枠を増やしたり累計をリセットしない。LOCAL-E002 を子口座として試行1・監査2・記録6を配分する。plan 監査1と、将来の adoption 監査1を想定する。配分は実行予約とは別で、今回は plan 監査1だけを予約して未送信で保持する。

今回の計画保存と precheck は EXEC-RECORD-006 の1記録バッチにまとめる。親で先行予約した分を子にも対応付け、同じ実行を親と子にそれぞれ1回だけ計上する。plan 監査は EXEC-AUDIT-PLAN-002 を両口座に予約する。両口座で「累計＋当該口座に属する未決予約＋次回上限」が各上限以下であることを確認する。子だけの余裕を根拠に親の上限を回避しない。

将来の試行1は固定実装版に対する UT/SIT/FIT をまとめた1ラウンド。同じ版の観測・テストが含まれるだけで、修正後の再試行を同じラウンドへ混ぜない。失敗時は結果を保存し、残試行枠0なら paused。予算変更の利用者確認と新しい定義の固定・台帳同期なしに再実行しない。既存の hard-coded LOCAL-01 用 reserve/settle 補助だけでは子口座を精算できないため、記録役が両口座を同じ state 更新で照合・予約・精算する。

外部購入上限0円。今回のローカル読み書き・構造確認は外部費用0の根拠を持つ。モデル利用費用は計測不能で unknown、時間・トークンの上限は利用者から未指定であり無制限と解釈しない。外部独立監査の利用契約・利用量は監査者側が開始前に確認し、新規課金が必要なら予約を実行せず held-budget にする。
