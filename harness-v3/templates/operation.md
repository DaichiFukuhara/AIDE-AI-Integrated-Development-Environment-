---
operation_id: <new-id>
revision: 1
kind: <plan|adoption|withdrawal|cycle_closed|periodic|cancel>
origin_operation_id: null
target_operation_id: null
expected_subject_hash: null
experiment_id: null
plan_revision: null
cycle_id: null
scope: []
base_bundle: null
base_revision: <state-revision>
subject_ref: null
subject_hash: null
phase: <plan|implementation-or-null>
criteria_version: 1
change_ids: []
baseline_refs: {} # scope_id -> immutable origin references
previous_audit_ref: null
previous_subject_ref: null
open_finding_ids: []
review_delta_ref: null
impact_scope: []
reused_checks: []
budget_account_refs: []
policy_ref: null
delegation_ref: <authorization-ref>
change_refs: []
related_operations: []
outcome: null
reflected_bundle: null
closed_at: null
trigger: null
observed_at: <ISO-8601>
payload_hash: <canonical-request-hash>
state: requested
result_ref: null
---

# <この要求で行うこと>

<理由、条件・契約・定義の影響、結果と次の処理>

要求payloadは作成時に固定する。通常revision/state/result_refはpayload外の進行情報。
withdrawal/cancelは新IDと対象ID・期待hash・scope必須。
cycle_closedは関連操作の確定結果・outcome・反映bundle・closed_at必須。
periodicはtriggerと通知IDまたは期限、現行subject、baseline_refsと累積差分/change_idsの不変参照、policy_refを指定する。
正式なadoption監査も交わる既存項目と提案差分のchange_ids、各項目の起点baseline_refsを固定する。提案分のIDは採用前に割り当てる。
再監査は前回監査・subject、open指摘、入力差分、波及先、引継ぎ確認を固定する。初回は前回参照をnullにできる。
実行時のexecution_id・予約・予算判定は要求payloadへ後追いで混ぜず、state台帳の進行情報として持つ。
state台帳の確定結果をこの文書へ反映する。古い文書からstateを巻戻さない。
