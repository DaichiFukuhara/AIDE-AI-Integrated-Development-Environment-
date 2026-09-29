"""Learning sends cycle_closed; record acknowledges a reasoned periodic skip."""
from records import *

state, _ = read_md('design/state.md')
if state['operations']['OP-ADOPT-002']['state'] != 'committed' or not state['current_bundle']:
    raise SystemExit('Adoption is not committed')
if state['pending_changes'] or state['unaudited_changes'] or any(s['state'] == 'active' for s in state['blocked_scopes']):
    raise SystemExit('Cannot skip unresolved implementation work')
if 'OP-CLOSE-001' in state['operations']:
    raise SystemExit('Closure already exists; inspect current ledger instead of resending a new payload')
bundle = state['current_bundle']
subject_hash = state['operations']['OP-ADOPT-002']['subject_hash']
for scope_id in state['scope']:
    if not any(b['scope_id'] == scope_id and b['phase'] == 'implementation' and b['subject_hash'] == subject_hash for b in state['audit_baselines']):
        raise SystemExit('Missing implementation guarantee')
closed_at = now()
related = [{'operation_id': identifier, 'state': state['operations'][identifier]['state'], 'result': state['operations'][identifier]['result']} for identifier in ['OP-PLAN-001', 'OP-ADOPT-001', 'OP-ADOPT-002']]
payload = {'operation_id': 'OP-CLOSE-001', 'kind': 'cycle_closed', 'cycle_id': 'C-001', 'experiment_id': 'E-001',
    'plan_revision': 1, 'outcome': 'reflected', 'scope': state['scope'], 'related_operations': related,
    'reflected_bundle': bundle, 'closed_at': closed_at, 'review_mode': 'normal', 'recovery_ref': None,
    'delegation_ref': state['budget_accounts']['LOCAL-01']['delegation_ref']}
write_json('operations/OP-CLOSE-001-payload.json', payload)
payload_folder = freeze(['operations/OP-CLOSE-001-payload.json'])
payload_ref = ref(payload_folder, 'operations/OP-CLOSE-001-payload.json', 'OP-CLOSE-001')
experiment = {'experiment_id': 'E-001', 'revision': 2, 'plan_revision': 1, 'cycle_id': 'C-001', 'state': 'reflected',
    'plan_ref': snapshot.read_json(ROOT / 'audits/subjects/PLAN-001.json')['plan_ref'],
    'trial_refs': ['experiments/trials/TRIAL-001.md', 'experiments/trials/TRIAL-002.md', 'experiments/trials/TRIAL-003.md'],
    'related_operations': related, 'adoption_ref': 'OP-ADOPT-002', 'reflected_bundle': bundle,
    'outbox': [{'message_id': 'OP-CLOSE-001', 'state': 'pending', 'payload_ref': payload_ref}],
    'human_evaluation': 'unverified'}
write_md('experiments/E-001.md', experiment, '''# 実験の採否と終端

第1試行は実使用で根拠遷移の問題が見つかったためneeds-fix。評価条件を変えず第2試行を行い、自動17件とブラウザ12項目の確認に成功。初回の実装監査で保存済み参照の検証漏れF-ADOPT-001が見つかり、採用せず修正した。第3試行は自動19件と実CLI・画面の再確認が成功。変更のないUI12項目は第2試行から根拠付きで再利用した。独立再監査で指摘解消と全体subjectの保証を確認し、BUNDLE-001を技術的に試験採用した。

これは本実験の終端であり、本人評価や製品全体の完成を表さない。終端とcycle_closed送信待ちはこの文書の同じ更新で保存した。記録側の受領・周期判定はstateを確認する。

未確認: HUMAN-01、長期運用、他環境の再現性。次: 利用者が実際のAI作業の記録を読み、足りない項目・使いにくい操作を確認して次サイクルの仮説へする。
''')
write_md('operations/OP-CLOSE-001.md', dict(payload, revision=1, state='requested', payload_hash=digest(payload)), '# サイクル終了通知\n\n学習担当から記録担当へ。採用確定結果と固定した通知を一度だけ送信する。')


def receive(latest):
    if latest['current_bundle'] != bundle or latest['pending_changes'] or latest['unaudited_changes']:
        raise ValueError('Adopted state changed before receiving closure')
    reason = 'no-unaudited-implementation-changes: CHANGE-001/CHANGE-002の全scopeと結合条件を同一subjectの独立adoption監査で保証し、採用時に一括解消済み。採用後の製品変更なし。'
    latest['operations']['OP-CLOSE-001'] = {'kind': 'cycle_closed', 'payload_hash': digest(payload), 'state': 'committed', 'result': 'acknowledged', 'scope': state['scope'], 'bundle': bundle, 'payload_ref': payload_ref}
    latest['received_notifications']['OP-CLOSE-001'] = {'payload_hash': digest(payload), 'cycle_id': 'C-001', 'periodic_request_id': None,
        'periodic_status': 'skipped', 'skip_reason': reason, 'ack': 'acknowledged', 'acknowledged_at': now(),
        'policy': latest['periodic_policy'], 'next_due': None, 'waiting_state': None}
    latest['outbox'].append({'message_id': 'OP-CLOSE-001', 'kind': 'S-PROPOSAL', 'payload_ref': payload_ref, 'target': 'record', 'state': 'acknowledged'})
    latest['display'].update(cycle='実験サイクル完了', next='実ログを実際に読み、判断理由・根拠・次の操作が作業の再開に十分かを本人が確認する。HUMAN-01は未確認。')
    latest['cycle_status'] = {'cycle_id': 'C-001', 'state': 'complete', 'closed_at': closed_at, 'closure_id': 'OP-CLOSE-001', 'periodic': 'reasoned-skip', 'human_evaluation': 'unverified', 'project_complete': False}


update_state(receive)
experiment['revision'] = 3
experiment['outbox'][0]['state'] = 'acknowledged'
experiment['cycle_state'] = 'complete'
experiment['periodic'] = {'result': 'skip', 'reason': 'no-unaudited-implementation-changes', 'notification_ref': 'OP-CLOSE-001'}
_, body = read_md('experiments/E-001.md')
write_md('experiments/E-001.md', experiment, body + '\n\n記録担当の通知受領と理由付き周期skipを確認し、この実験サイクルを完了した。本人評価は未確認のまま。')
meta, body = read_md('operations/OP-CLOSE-001.md')
write_md('operations/OP-CLOSE-001.md', dict(meta, revision=2, state='committed', result='acknowledged', result_ref='design/state.md#received_notifications/OP-CLOSE-001'), body + '\n\nstateに受領と差分なしskipを同時保存してackした。')
settle('EXEC-RECORD-003', 'operations/OP-CLOSE-001.md')
print(json.dumps({'cycle': 'C-001', 'state': 'complete', 'periodic': 'skip-no-unaudited-changes', 'project_complete': False, 'human_evaluation': 'unverified'}, ensure_ascii=False))
