from records import *

request = snapshot.read_json(ROOT / 'audits/AR-ADOPT-001-request.json')
audit, body = read_md('audits/AUD-ADOPT-001.md')
for key in ['audit_request_id', 'origin_operation_id', 'scope', 'phase', 'subject_hash', 'criteria_version', 'change_ids']:
    assert audit[key] == request[key], key
assert audit['result'] == 'require-review' and audit['finding_ids'] == ['F-ADOPT-001']
folder = freeze(['audits/AUD-ADOPT-001.md', 'audits/subjects/ADOPT-001.json'])
result = ref(folder, 'audits/AUD-ADOPT-001.md', 'AUD-ADOPT-001')

def receive(state):
    assert state['current_bundle'] is None and state['operations']['OP-ADOPT-001']['state'] == 'requested'
    state['operations']['OP-ADOPT-001'].update(state='rejected', result='require-review', result_ref=result)
    reservation = state['execution_reservations']['EXEC-AUDIT-ADOPT-001']
    assert reservation['state'] == 'reserved'
    for key, amount in reservation['limits'].items():
        state['budget_accounts']['LOCAL-01']['limits'][key]['cumulative_used'] += amount
    reservation.update(state='settled', settled_at=now(), evidence_ref=result)
    for message in state['outbox']:
        if message['message_id'] == request['audit_request_id']:
            message.update(state='acknowledged', result_ref=result)
    state['blocked_scopes'].append({'scope': state['scope'], 'state': 'active', 'finding_id': 'F-ADOPT-001', 'audit_ref': result,
        'permitted_operations': ['TRIAL-003', 'AR-ADOPT-002'],
        'release_condition': 'Independent re-audit confirms invalid stored evidence rejected, original bytes preserved, HTTP errors, and valid missing evidence history retained.',
        'correction_scope': 'Evidence syntax validation and regression tests only; adoption stays held.'})
    state['display'].update(audit='重大指摘 1件', adoption='修正待ち', cycle='修正中', next='F-ADOPT-001の参照パス検証を修正し、TRIAL-003と独立再監査へ進む。')

update_state(receive)
meta, body = read_md('operations/OP-ADOPT-001.md')
write_md('operations/OP-ADOPT-001.md', dict(meta, revision=2, state='rejected', result='require-review', result_ref=result), body + '\n\n独立監査で重大指摘F-ADOPT-001。採用せず修正待ち。旧subjectと失敗結果を保持する。')
print('Recorded require-review; current remains null; corrective work authorized only for F-ADOPT-001.')
