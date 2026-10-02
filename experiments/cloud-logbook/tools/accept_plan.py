"""Record role: validate and accept the independently produced plan decision."""
from records import *
from precheck import check

request = snapshot.read_json(ROOT / 'audits/AR-PLAN-001-request.json')
audit, _ = read_md('audits/AUD-PLAN-001.md')
for key in ['audit_request_id', 'origin_operation_id', 'scope', 'phase', 'subject_hash', 'criteria_version']:
    if audit[key] != request[key]:
        raise SystemExit('Audit result mismatch: ' + key)
if audit['result'] != 'audit-pass' or audit['independence'] != 'independent':
    raise SystemExit('Plan is not independently passed; do not implement')
checked = check(request['subject_ref'])
if checked['subject_hash'] != request['subject_hash']:
    raise SystemExit('Subject changed')
folder = freeze(['audits/AUD-PLAN-001.md', 'audits/AR-PLAN-001-request.json', 'evidence/precheck-plan-001.json'])
result = ref(folder, 'audits/AUD-PLAN-001.md', 'AUD-PLAN-001')


def accept(state):
    if state['operations']['OP-PLAN-001']['state'] != 'requested' or state['current_bundle'] is not None or state['tombstones']:
        raise ValueError('Plan adoption precondition changed')
    state['operations']['OP-PLAN-001'].update(state='checked', result='audit-pass', result_ref=result)
    for item in request['scope']:
        state['audit_baselines'].append({'scope_id': item, 'phase': 'plan', 'criteria_version': 1, 'scope': request['scope'], 'subject_hash': request['subject_hash'], 'subject_ref': request['subject_ref'], 'audit_request_id': request['audit_request_id'], 'result_ref': result, 'accepted_at': now()})
    for message in state['outbox']:
        if message['message_id'] == request['audit_request_id']:
            message['state'] = 'acknowledged'
    state['display'].update(plan='独立監査合格', trial='未実行', audit='計画のみ合格', adoption='未採用', cycle='実装へ進行', next='checkedになった固定計画に沿ってCLI・HTML/CSS/JS画面を作り、UT/SIT/FITを行う。')


update_state(accept)
settle('EXEC-AUDIT-PLAN-001', result)
settle('EXEC-RECORD-001', 'evidence/precheck-plan-001.json')
meta, body = read_md('operations/OP-PLAN-001.md')
meta.update(revision=2, state='checked', result_ref=result)
write_md('operations/OP-PLAN-001.md', meta, body + '\n\n独立計画監査を受理。current_bundleはnullのまま。未実装を成功扱いしない。')
reserve('EXEC-RECORD-002', 'record', 'IMPLEMENTATION-001')
print(json.dumps({'state': 'checked', 'current_bundle': None, 'audit_result': result}, ensure_ascii=False))
