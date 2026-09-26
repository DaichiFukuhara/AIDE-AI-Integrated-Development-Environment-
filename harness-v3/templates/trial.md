---
trial_id: <immutable-id>
experiment_id: <id>
plan_revision: <integer>
plan_ref: <immutable-ref>
implementation_ref: <commit-or-hashed-file-set>
model_definition_refs: []
evaluation_ref: <immutable-ref>
evidence_refs: []
executed_at: <ISO-8601>
execution_id: <reservation-and-settlement-id>
budget_account_refs: []
budget_usage:
  <account-id/limit-id>:
    unit: <unit>
    used: unknown
    used_upper_bound: null
    bound_evidence_ref: null
budget_settlement_ref: <state-ledger-ref>
---

# <今回試したこと>

## 実行条件と生の結果

<コマンド、環境、データ、終了コード、標準出力・エラーの不変参照。
テストpass/fail/not-run/N-Aを理由付きで区別する>

## 実使用と人の評価

<実際に操作した結果、観測者、本人確認の有無。模擬データと実ユーザーを区別する>

## 評価・限界・次の案

<計画条件ごとの成立、比較不能、版不一致、採否の推奨。保証を別条件へ一般化しない>

この記録を訂正・再実行するときは新trial_idを発行し、旧版への参照を残す。
