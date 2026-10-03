"""Record-role intake and budget helpers. Never execute or decide an audit."""
import copy
import re
from records import *
from precheck import check

ACCOUNTS = ['LOCAL-01', 'LOCAL-E002']
FINDINGS = ['F-CLOUD-PLAN-002-01', 'F-CLOUD-PLAN-002-02', 'F-CLOUD-PLAN-002-03']


def verify_ref(value):
    path = snapshot.checked_path(ROOT, value['immutable_ref'])
    if hashlib.sha256(path.read_bytes()).hexdigest() != value['sha256']:
        raise ValueError('Reference hash mismatch: ' + value['immutable_ref'])


def reserve_both(s, execution_id, activity, operation_id, corrective=False):
    if execution_id in s['execution_reservations']:
        raise ValueError('Execution ID already exists')
    for hold in s['blocked_scopes']:
        if hold['state'] == 'active' and (not corrective or hold['finding_id'] not in FINDINGS or operation_id not in hold['permitted_operations']):
            raise ValueError('Operation not allowed by hold')
    checks = {}
    for account_id in ACCOUNTS:
        account = s['budget_accounts'][account_id]
        verify_ref(account['definition_ref'])
        verify_ref(account['delegation_ref'])
        definition, _ = read_md(account['definition_ref']['immutable_ref'])
        limits = {k: {f: v for f, v in limit.items() if f != 'cumulative_used'} for k, limit in account['limits'].items()}
        if limits != definition['limits'] or account['scope'] != s['scope'] or activity not in account['activities']:
            raise ValueError('Budget definition/scope/activity mismatch')
        checks[account_id] = {}
        for key, limit in account['limits'].items():
            increment = int(activity in limit['activities'] and key != 'external_spend')
            outstanding = sum(r['limits'].get(key, 0) for r in s['execution_reservations'].values() if r['state'] in ('reserved', 'in-flight') and account_id in r.get('account_refs', []))
            used = limit['cumulative_used']
            if used + outstanding + increment > limit['limit']:
                raise ValueError('Budget exceeded: ' + account_id + '/' + key)
            checks[account_id][key] = dict(used=used, outstanding=outstanding, next=increment, limit=limit['limit'], decision='allow-reservation-only' if activity == 'audit' else 'allow')
    s['execution_reservations'][execution_id] = {
        'activity': activity, 'operation_id': operation_id, 'scope': s['scope'],
        'account_refs': ACCOUNTS, 'definition_ref': s['budget_accounts']['LOCAL-E002']['definition_ref'],
        'definition_refs': {a: s['budget_accounts'][a]['definition_ref'] for a in ACCOUNTS},
        'delegation_refs': {a: s['budget_accounts'][a]['delegation_ref'] for a in ACCOUNTS},
        'checked_at': now(), 'state': 'reserved', 'decision_owner': 'record',
        'limits': {k: v['next'] for k, v in checks['LOCAL-01'].items()}, 'checks': checks,
        'corrective_finding_ids': FINDINGS if corrective else [],
        'basis': 'User request 2026-10-03: accept require-review, revise plan, reserve re-audit only. Existing limits unchanged. New external purchases 0; platform cost unknown.',
        'execution_started': activity == 'record', 'dispatch_allowed_this_turn': False,
    }


def settle_both(s, execution_id, evidence):
    reservation = s['execution_reservations'][execution_id]
    if reservation['state'] != 'reserved' or reservation['account_refs'] != ACCOUNTS:
        raise ValueError('Unexpected reservation state/accounts')
    for account_id in reservation['account_refs']:
        for key, amount in reservation['limits'].items():
            s['budget_accounts'][account_id]['limits'][key]['cumulative_used'] += amount
    reservation.update(state='settled', execution_started=True, settled_at=now(), evidence_ref=evidence)


def accept():
    s, _ = read_md('design/state.md')
    message = next(m for m in s['outbox'] if m['message_id'] == 'AR-PLAN-002')
    verify_ref(message['payload_ref'])
    request = snapshot.read_json(ROOT / message['payload_ref']['immutable_ref'])
    if snapshot.read_json(ROOT / 'audits/AR-PLAN-002-request.json') != request:
        raise ValueError('Working request differs from fixed request')
    audit, _ = read_md('audits/AUD-PLAN-002.md')
    keys = ['audit_request_id', 'origin_operation_id', 'kind', 'scope', 'phase', 'subject_hash', 'criteria_version', 'review_mode', 'recovery_ref', 'baseline_refs', 'cumulative_diff_ref', 'change_ids', 'previous_audit_ref', 'previous_subject_ref', 'open_finding_ids', 'review_delta_ref', 'impact_scope', 'reused_checks', 'execution_id', 'budget_account_refs', 'budget_check_ref']
    for key in keys:
        expected = request.get(key, request['scope'] if key == 'impact_scope' else [] if key == 'reused_checks' else None)
        if audit[key] != expected:
            raise ValueError('Audit identity mismatch: ' + key)
    if audit['subject_ref'] != request['subject_ref']['immutable_ref']:
        raise ValueError('Audit subject reference mismatch')
    verify_ref(request['subject_ref'])
    checked = check(request['subject_ref']['immutable_ref'])
    if checked['subject_hash'] != request['subject_hash']:
        raise ValueError('Subject digest mismatch')
    if audit['result'] != 'require-review' or audit['independence'] != 'independent' or audit['finding_ids'] != FINDINGS or [audit['open_major_count'], audit['open_minor_count'], audit['open_blocker_count']] != [1, 2, 0]:
        raise ValueError('Unexpected audit decision; inspect before intake')
    if s['revision'] != 45 or s['operations']['OP-PLAN-002']['state'] != 'requested' or s['execution_reservations']['EXEC-AUDIT-PLAN-002']['state'] != 'reserved':
        raise ValueError('State changed; stop and inspect')
    # Baseline only project records; never inspect local credentials or user settings.
    files = {}
    for path in ROOT.rglob('*'):
        rel = path.relative_to(ROOT)
        if any(part in ('.local', '.logbook-queue', '.claude', '__pycache__', 'node_modules') for part in rel.parts):
            continue
        if path.is_file() and (not path.name.startswith('.env') or path.name == '.env.example'):
            files[rel.as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    write_json('.local/plan-003-before.json', {'files': files, 'current_bundle': s['current_bundle'], 'audit_baselines': s['audit_baselines'], 'unaudited_changes': s['unaudited_changes'], 'cycle_history': s['cycle_history'], 'cycle_status': s['cycle_status']})
    update_state(lambda value: reserve_both(value, 'EXEC-RECORD-007', 'record', 'OP-PLAN-003'))
    folder = freeze(['audits/AUD-PLAN-002.md', 'audits/AR-PLAN-002-request.json'])
    result = ref(folder, 'audits/AUD-PLAN-002.md', 'AUD-PLAN-002')
    write_json('evidence/AUD-PLAN-002-record-verification.json', {
        'id': 'AUD-PLAN-002-RECORD-VERIFICATION', 'checked_at': now(), 'identity': 'match',
        'compared_fields': keys + ['subject_ref'], 'result_ref': result, 'previous_subject_ref': request['subject_ref'],
        'subject_precheck': checked, 'decision': 'require-review', 'counts': {'major': 1, 'minor': 2, 'blocker': 0},
        'audit_execution_to_settle': 'EXEC-AUDIT-PLAN-002', 'account_refs': ACCOUNTS,
    })
    def receive(value):
        value['operations']['OP-PLAN-002'].update(state='rejected', result='require-review', result_ref=result)
        settle_both(value, 'EXEC-AUDIT-PLAN-002', result)
        for m in value['outbox']:
            if m['message_id'] == 'AR-PLAN-002':
                m.update(state='acknowledged', delivery_status='result-received-externally', execution_started=True, result_ref=result, result='require-review', correction_state='awaiting-revision')
        for index, finding_id in enumerate(FINDINGS):
            release = [
                'UC-04回答・協調的観測の脅威モデル/README/画面限界、欠落3条件のUT/SIT/FIT-UI、資格ファイル方式とenv非出力FIT、改ざん耐性の別計画候補を独立再監査が確認。',
                'SessionEnd reasonをclear/resume/logout/prompt_input_exit/other（未知other）へ改訂しFIT-AUTO-01へ対応付けたことを独立再監査が確認。',
                '明示hook timeout 5秒以下・async worker総処理5秒必須・root設定マージのUC-01/FITを独立再監査が確認。',
            ][index]
            value['open_findings'].append({'finding_id': finding_id, 'severity': 'major' if index == 0 else 'minor', 'state': 'open', 'owner': '計画起草担当 Codex', 'result_ref': result, 'phase': 'plan', 'release_condition': release, 'blocks_plan_check': True})
            value['blocked_scopes'].append({'scope': request['scope'], 'phase': 'plan', 'state': 'active', 'finding_id': finding_id, 'audit_ref': result, 'permitted_operations': ['OP-PLAN-003', 'AR-PLAN-003'], 'release_condition': release, 'correction_scope': 'AUD-PLAN-002解消条件に限る計画・定義・評価・委任の改訂とprecheck/再監査予約。実装・試行・設定有効化は許可しない。'})
        value['active_cycle_status'].update(state='plan-revision-required', plan_checked=False, implementation_started=False, open_finding_ids=FINDINGS)
        value['display'].update(plan='E-002 require-review・計画保留', audit='AUD-PLAN-002受理 major 1/minor 2', cycle='C-001完了を保持 / C-002計画改訂待ち', next='解消条件に沿ってplan_revision 2を固定しAR-PLAN-003予約で停止する。')
    update_state(receive)
    meta, body = read_md('operations/OP-PLAN-002.md')
    write_md('operations/OP-PLAN-002.md', dict(meta, revision=2, state='rejected', result='require-review', result_ref=result), body + '\n\nAUD-PLAN-002のidentity完全一致を確認して受理。監査予約を親子両口座で1回精算し、major 1・minor 2をopen、plan scopeを保留とした。旧subject/要求/監査は固定参照のまま保持。')
    print(json.dumps({'identity': 'match', 'accepted': 'require-review', 'result_ref': result, 'state_revision': read_md('design/state.md')[0]['revision']}, ensure_ascii=False))


if __name__ == '__main__':
    accept()
