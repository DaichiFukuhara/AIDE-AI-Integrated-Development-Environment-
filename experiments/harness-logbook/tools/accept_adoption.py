"""Record the independent decision and atomically adopt its fixed bundle.

This one-experiment administrative script refuses to invent a missing decision.
"""
from records import *
from precheck import check

request = snapshot.read_json(ROOT / 'audits/AR-ADOPT-002-request.json')
audit, _ = read_md('audits/AUD-ADOPT-002.md')
subject = snapshot.read_json(ROOT / request['subject_ref'])
payload = snapshot.read_json(ROOT / 'operations/OP-ADOPT-002-payload.json')
for key in ['audit_request_id', 'origin_operation_id', 'scope', 'phase', 'subject_hash', 'criteria_version', 'change_ids']:
    if audit[key] != request[key]:
        raise SystemExit('Audit result mismatch: ' + key)
if (audit['result'] != 'audit-pass' or audit['independence'] != 'independent'
        or audit.get('open_major_count') != 0 or audit.get('open_blocker_count') != 0):
    raise SystemExit('Independent implementation audit did not pass')
if check(request['subject_ref'])['subject_hash'] != request['subject_hash']:
    raise SystemExit('Subject changed')
for item in subject['implementation_ref']['files']:
    if hashlib.sha256((ROOT / item['id']).read_bytes()).hexdigest() != item['sha256']:
        raise SystemExit('Working implementation changed: ' + item['id'])
state, _ = read_md('design/state.md')
base_revision = state['revision']
if (state['current_bundle'] != payload['base_bundle'] or state['operations']['OP-ADOPT-002']['state'] != 'requested'
        or state['operations']['OP-ADOPT-002']['payload_hash'] != digest(payload)
        or state['tombstones'] or any(s['state'] == 'active' and s['finding_id'] not in audit.get('closed_finding_ids', []) for s in state['blocked_scopes'])
        or state['unaudited_changes']):
    raise SystemExit('Adoption preconditions changed; no current switch')
if {change['change_id'] for change in state['pending_changes']} != set(request['change_ids']):
    raise SystemExit('Pending changes do not match audited cumulative change set')

decision_folder = freeze(['audits/AUD-ADOPT-002.md', request['subject_ref'], 'audits/AR-ADOPT-002-request.json', 'operations/OP-ADOPT-002-payload.json', 'evidence/precheck-adoption-002.json'])
audit_ref = ref(decision_folder, 'audits/AUD-ADOPT-002.md', 'AUD-ADOPT-002')
subject_ref = ref(decision_folder, request['subject_ref'], 'SUBJECT-ADOPT-002')
bundle = {'id': 'BUNDLE-001', 'subject_hash': request['subject_hash'], 'subject_ref': subject_ref,
          'spec_refs': subject['spec_refs'], 'contract_refs': subject['contract_refs'],
          'model_definition_refs': subject['model_definition_refs'], 'implementation_ref': subject['implementation_ref'],
          'trial_refs': subject['trial_refs'], 'evidence_refs': subject['evidence_refs'],
          'audit_ref': audit_ref, 'unverified': ['HUMAN-01: 本人の操作評価は未確認。技術的試験採用に限定。']}
write_json('design/candidates/OP-ADOPT-002/bundle.json', bundle)
bundle_folder = freeze(['design/candidates/OP-ADOPT-002/bundle.json'])
bundle_ref = ref(bundle_folder, 'design/candidates/OP-ADOPT-002/bundle.json', 'BUNDLE-001')


def commit(latest):
    if latest['revision'] != base_revision or latest['current_bundle'] is not None or latest['tombstones']:
        raise ValueError('State changed before atomic adoption')
    for blocked in latest['blocked_scopes']:
        if blocked['state'] == 'active':
            assert blocked['finding_id'] in audit['closed_finding_ids']
            blocked.update(state='resolved', result_ref=audit_ref, resolved_at=now())
    latest['current_bundle'] = bundle_ref
    latest['operations']['OP-ADOPT-002'].update(state='committed', result='applied', bundle=bundle_ref, result_ref=audit_ref, committed_at=now())
    for scope_id in request['scope']:
        latest['audit_baselines'].append({'scope_id': scope_id, 'phase': 'implementation', 'criteria_version': 1,
            'scope': request['scope'], 'subject_hash': request['subject_hash'], 'subject_ref': subject_ref,
            'audit_request_id': request['audit_request_id'], 'result_ref': audit_ref, 'accepted_at': now()})
    latest.setdefault('resolved_changes', []).extend(dict(change, resolution='audited-on-adoption',
        result_ref=audit_ref, adopted_bundle=bundle_ref, resolved_at=now()) for change in latest['pending_changes'])
    latest['pending_changes'] = []
    for message in latest['outbox']:
        if message['message_id'] == request['audit_request_id']:
            message.update(state='acknowledged', result_ref=audit_ref)
    for execution_id, evidence in [('EXEC-AUDIT-ADOPT-002', audit_ref)]:
        reservation = latest['execution_reservations'][execution_id]
        if reservation['state'] != 'reserved':
            raise ValueError('Audit reservation changed')
        for key, amount in reservation['limits'].items():
            latest['budget_accounts']['LOCAL-01']['limits'][key]['cumulative_used'] += amount
        reservation.update(state='settled', settled_at=now(), evidence_ref=evidence)
    latest['display'].update(audit='実装の独立監査合格', adoption='試験採用済み', cycle='終了処理中',
        next='採用結果を実験へ返し、cycle_closedの受領と周期判定を記録する。本人評価は未確認。')


update_state(commit)
# Refresh display paths only from immutable, audited candidates after current commits.
for item in subject['spec_refs']:
    if item['id'] in ('SYS-LOG', 'SYS-LOG-rationale'):
        name = 'design' if item['id'] == 'SYS-LOG' else 'rationale'
        (ROOT / f'design/domains/log/systems/console/{name}.md').write_bytes((ROOT / item['immutable_ref']).read_bytes())
meta, body = read_md('operations/OP-ADOPT-002.md')
meta.update(revision=2, state='committed', result_ref=audit_ref, reflected_bundle=bundle_ref, outcome='applied')
write_md('operations/OP-ADOPT-002.md', meta, body + '\n\n同一subjectの独立監査を受理し、current・基準・差分の解消・監査予約精算を一括反映した。HUMAN-01は未確認で、製品全体完成ではない。')
print(json.dumps({'result': 'applied', 'bundle': bundle_ref, 'audit': audit_ref}, ensure_ascii=False))
