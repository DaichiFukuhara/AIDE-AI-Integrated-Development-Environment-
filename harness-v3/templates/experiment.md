---
experiment_id: <id>
revision: 1
plan_revision: 1
cycle_id: <id>
previous_cycle_ref: null
state: planned
goal_refs: []
system_refs: []
domain_context_refs: []
model_definition_refs: []
baseline_bundle: null
plan_subject_ref: <immutable-ref>
delegation_ref: <authorization-ref>
budget: <limit-and-unit>
budget_check:
  cumulative_used: unknown
  cumulative_upper_bound: null
  next_execution_upper_bound: null
  bound_evidence_ref: null
  decision: pending
  checked_at: null
  resume_condition: null
trial_refs: []
related_operations: []
outbox: []
---

# <一つの未確認事項>

## 仮説と最小出力

<何を作り、何が分かれば次の判断ができるか>

## 範囲と上限

<src/testsの対象、除外範囲、担当、予算、終了条件、許可。
budget_checkは各実行直前に再判定する。不明を0とせず、根拠ある上限でも予算内を保証できなければpaused。
複数の上限はそれぞれの判定を保存し、停止理由と再開条件を残す>

## 固定した評価条件

<条件ID、回帰・結合・仮説比較・実使用・人の評価、失敗と未実行の扱い。
確率的出力では分布・誤差・反復数・データ等も計画する>

## 採否と反映

<採用/修正/不採用/保留、理由、adoption IDと確定bundle>

## 中断・終了・再開

<残予算、再開条件、inconclusiveなら継続か終了か。
終端とcycle_closed outboxを同時に保存し、全関連操作の確定結果を添える>
