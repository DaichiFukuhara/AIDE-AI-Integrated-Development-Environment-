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
periodicはtriggerと通知IDまたは期限、現行subject、baselineと累積差分の不変参照を本文に指定する。
state台帳の確定結果をこの文書へ反映する。古い文書からstateを巻戻さない。
