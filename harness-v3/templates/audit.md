---
audit_id: <id>
audit_request_id: <request-id>
origin_operation_id: <proposal-or-trigger-id>
target_operation_id: null
kind: <plan|adoption|periodic|cancel>
review_mode: normal
recovery_ref: null
scope: []
phase: <plan|implementation>
subject_hash: <hash>
subject_ref: <immutable-ref>
baseline_refs: {} # scope_id -> oldest selected change origins, or latest baseline / initial
cumulative_diff_ref: <immutable-ref-or-initial>
change_ids: []
previous_audit_ref: null
previous_subject_ref: null
open_finding_ids: []
review_delta_ref: null
impact_scope: []
reused_checks: []
budget_account_refs: []
execution_id: null
budget_check_ref: null
policy_ref: null
criteria_version: 1
reviewer: <identity-session-model>
independence: <independent|self-check>
self_check_delegation_ref: null
observed_at: <ISO-8601>
result: <daily-pass|require-review|audit-pass|blocked|stale|cancelled|pending-target|already-completed|rejected>
finding_ids: []
unverified: []
next_due: null
---

# <今回の判定と保証する範囲>

## 読んだ対象と限界

<固定入力、読めなかったもの、自己点検か独立監査か、実行方法>

## 基準と根拠

再監査ではreused_checksにcriterion、前回結果、同一の入力/依拠先hashと証拠、影響外の理由を保存する。
previous_audit_ref等は新要求の固定入力。詳細確認の範囲と、今回のsubject全体の保証範囲を区別する。
監査費用と予算判定はexecution_idでstateの予約・精算記録を参照する。周期要求ではpolicy_refと累積change_idsを固定する。
baseline-recoveryではloss record参照と対象change_idsを固定し、scopeごとのbaseline_refsをinitialとする。periodicでは現行subject、adoptionでは修正提案subject全体の証拠を確認し、失われた履歴を保証しないことも明示する。

| criterion | 適用と証拠 | 判定・理由付きN/A |
| --- | --- | --- |
| <DDD-01〜05 / AIDE-01〜03> | <不変の対象・結果参照> | <結果> |

## 指摘

<id、criterion、対象版・場所、観測/反例、影響、severity、解消条件、owner、open/closed>

## 次の処理

<受理担当、保留scope、必要な修正。監査結果自体はcurrentを切り替えない>
