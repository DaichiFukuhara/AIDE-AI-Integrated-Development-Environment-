from records import *
from precheck import check

state, _ = read_md('design/state.md')
assert state['current_bundle'] is None and state['operations']['OP-ADOPT-001']['result'] == 'require-review'
assert 'OP-ADOPT-002' not in state['operations']
previous = snapshot.read_json(ROOT / 'audits/subjects/ADOPT-001.json')
implementation = snapshot.read_json(ROOT / 'experiments/implementation-003.json')
trial, _ = read_md('experiments/trials/TRIAL-003.md')
assert trial['result'] == 'pass'
oldfiles = {item['id']: item for item in previous['implementation_ref']['files']}
changed = [item['id'] for item in implementation['files'] if item['sha256'] != oldfiles[item['id']]['sha256']]
assert set(changed) == {'src/logbook.py', 'tests/test_logbook.py'}
for item in implementation['files']:
    assert hashlib.sha256((ROOT / item['id']).read_bytes()).hexdigest() == item['sha256']
write_json('evidence/review-delta-002.json', {'id': 'DELTA-002', 'from': previous['implementation_ref'], 'to': implementation,
    'changed_files': changed, 'finding_ids': ['F-ADOPT-001'], 'impact_scope': state['scope'],
    'changes': 'Always validate stored evidence syntax; keep existence checks only for new references and serving. Add invalid stored paths/byte preservation/HTTP errors, retain missing historical evidence.',
    'evidence': trial['evidence_refs'], 'reused_checks': 'TRIAL-002 browser 12 checks reused after unchanged HTML/CSS/JS/server hash checks; TRIAL-003 fresh CLI/search/proof smoke and full automated regression.'})
folder = freeze(['audits/AUD-ADOPT-001.md', 'audits/subjects/ADOPT-001.json', 'evidence/review-delta-002.json', 'experiments/trials/TRIAL-003.md'])
subject = dict(previous)
subject['implementation_ref'] = implementation
subject['trial_refs'] = previous['trial_refs'] + [ref(folder, 'experiments/trials/TRIAL-003.md', 'TRIAL-003')]
subject['evidence_refs'] = previous['evidence_refs'] + trial['evidence_refs'] + [ref(folder, 'evidence/review-delta-002.json', 'DELTA-002')]
subject['previous_audit_ref'] = ref(folder, 'audits/AUD-ADOPT-001.md', 'AUD-ADOPT-001')
subject['previous_subject_ref'] = ref(folder, 'audits/subjects/ADOPT-001.json', 'SUBJECT-ADOPT-001')
write_json('audits/subjects/ADOPT-002.json', subject)
precheck = check('audits/subjects/ADOPT-002.json')
write_json('evidence/precheck-adoption-002.json', precheck)
change = {'change_id': 'CHANGE-002', 'affected_scope': state['scope'], 'phase': 'implementation',
    'baseline_refs': {item: 'initial' for item in state['scope']}, 'first_changed_at': now(), 'operation_id': 'OP-ADOPT-002',
    'old_version': previous['implementation_ref'], 'new_version': implementation, 'joint_condition': 'CLI/storage/HTTP/UI remain one subject', 'reason': 'F-ADOPT-001 correction'}
write_json('design/candidates/OP-ADOPT-002/change.json', change)
payload = dict(snapshot.read_json(ROOT / 'operations/OP-ADOPT-001-payload.json'), operation_id='OP-ADOPT-002', subject_ref='audits/subjects/ADOPT-002.json', subject_hash=digest(subject), change_ids=['CHANGE-001', 'CHANGE-002'])
write_json('operations/OP-ADOPT-002-payload.json', payload)
write_md('operations/OP-ADOPT-002.md', dict(payload, revision=1, state='requested', payload_hash=digest(payload)), '# 修正後の試験採用提案\n\n初回からの全体subjectを保持し、重大指摘の修正と新しい試行を再監査へ提出する。')
update_state(lambda s: (s['operations'].update({'OP-ADOPT-002': {'payload_hash': digest(payload), 'kind': 'adoption', 'subject_hash': digest(subject), 'scope': state['scope'], 'state': 'requested', 'result': None, 'bundle': None, 'audit_request_id': 'AR-ADOPT-002'}}), s['pending_changes'].append(change), s['display'].update(audit='修正後の再監査待ち', cycle='採用監査待ち', next='F-ADOPT-001の解消を別担当が固定版で確認する。')))
reserve('EXEC-AUDIT-ADOPT-002', 'audit', 'AR-ADOPT-002', 'F-ADOPT-001')
request = dict(snapshot.read_json(ROOT / 'audits/AR-ADOPT-001-request.json'), audit_request_id='AR-ADOPT-002', origin_operation_id='OP-ADOPT-002', subject_ref=payload['subject_ref'], subject_hash=payload['subject_hash'], change_ids=payload['change_ids'],
    cumulative_diff_ref={'from': 'initial', 'to': implementation, 'change_ids': payload['change_ids']}, execution_id='EXEC-AUDIT-ADOPT-002', budget_check_ref='design/state.md#EXEC-AUDIT-ADOPT-002',
    previous_audit_ref=subject['previous_audit_ref'], previous_subject_ref=subject['previous_subject_ref'], open_finding_ids=['F-ADOPT-001'], review_delta_ref=ref(folder, 'evidence/review-delta-002.json', 'DELTA-002'),
    impact_scope=state['scope'], reused_checks=[{'source': subject['previous_audit_ref'], 'scope': 'Unchanged definitions, design, UI and server; verify same hashes before reuse. Full subject remains in scope.'}], observed_at=now())
write_json('audits/AR-ADOPT-002-request.json', request)
update_state(lambda s: s['outbox'].append({'message_id': 'AR-ADOPT-002', 'kind': 'S-AUDIT-INPUT', 'payload_ref': 'audits/AR-ADOPT-002-request.json', 'target': '/root/harness_auditor', 'state': 'in-flight', 'execution_id': 'EXEC-AUDIT-ADOPT-002', 'account_refs': ['LOCAL-01']}))
print(json.dumps({'subject_hash': payload['subject_hash'], 'precheck': precheck}, ensure_ascii=False))
