"""Record AUD-ADOPT-002 and close its local-only cycle; no audit execution.

Run with --check for read-only validation or --apply for the authorized record batch.
Existing audit, subject, evidence, trial and snapshot files are never rewritten.
"""
import argparse
import copy
import re
from records import *
from precheck import check

REQUEST = 'AR-ADOPT-002'
OPERATION = 'OP-ADOPT-002'
CLOSURE = 'OP-CLOSE-001'
RECORD_EXECUTION = 'EXEC-RECORD-005'
RECEIPT = 'evidence/AUD-ADOPT-002-record-accepted.md'
HANDOFF = 'evidence/C-001-next-plan-candidates.md'
VERIFY = 'evidence/AUD-ADOPT-002-record-verification.json'
BUNDLE = 'design/candidates/OP-ADOPT-002/bundle.json'
NEW_PATHS = [RECEIPT, HANDOFF, VERIFY, BUNDLE, 'experiments/E-001.md',
             'operations/OP-CLOSE-001.md', 'operations/OP-CLOSE-001-payload.json']


def require(condition, message):
    if not condition:
        raise ValueError(message)


def references(value):
    """Verify every nested immutable reference without following paths outside ROOT."""
    if isinstance(value, dict):
        if 'immutable_ref' in value:
            path = snapshot.checked_path(ROOT, value['immutable_ref'])
            require(path.is_file() and snapshot.digest(path.read_bytes()) == value['sha256'],
                    'Immutable reference differs: ' + value['immutable_ref'])
        for child in value.values():
            references(child)
    elif isinstance(value, list):
        for child in value:
            references(child)


def inventory():
    paths = []
    for name in ['design', 'audits', 'evidence', 'experiments', 'operations', 'tools',
                 'api', 'cli', 'dev', 'lib', 'public', 'scripts', 'supabase', 'tests']:
        paths.extend(p for p in (ROOT / name).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
    paths.extend(ROOT / name for name in ['README.md', 'agent-instructions.md', 'package.json',
                                         'vercel.json', '.env.example', '.gitignore', '.gitattributes'])
    return {p.relative_to(ROOT).as_posix(): snapshot.digest(p.read_bytes()) for p in sorted(paths) if p.is_file()}


def validate():
    request = snapshot.read_json(ROOT / ('audits/' + REQUEST + '-request.json'))
    audit, audit_body = read_md('audits/AUD-ADOPT-002.md')
    for key in ['audit_request_id', 'origin_operation_id', 'scope', 'phase', 'subject_hash',
                'criteria_version', 'change_ids']:
        require(audit[key] == request[key], 'Audit identity mismatch: ' + key)
    for key in ['kind', 'baseline_refs', 'cumulative_diff_ref', 'review_mode', 'recovery_ref',
                'previous_audit_ref', 'previous_subject_ref', 'review_delta_ref', 'impact_scope',
                'execution_id', 'budget_account_refs']:
        require(audit[key] == request[key], 'Audit request correspondence differs: ' + key)
    require(audit['result'] == 'audit-pass' and audit['independence'] == 'independent'
            and 'Claude Opus 5.5' in audit['reviewer'], 'Independent audit-pass required')
    require(audit['open_major_count'] == audit['open_blocker_count'] == 0, 'Blocking findings remain')
    require(audit['closed_finding_ids'] == ['F-CLOUD-ADOPT-001']
            and audit['finding_ids'] == ['F-CLOUD-ADOPT-002'] and audit['open_minor_count'] == 1,
            'Inspect unexpected findings')
    subject_path = request['subject_ref']['immutable_ref']
    require(audit['subject_ref'] == subject_path, 'Subject reference differs')
    subject = snapshot.read_json(snapshot.checked_path(ROOT, subject_path))
    precheck = check(subject_path)
    require(precheck['subject_hash'] == request['subject_hash'], 'Subject digest differs')
    references(request)
    references(audit)
    require(request['cumulative_diff_ref']['to'] == subject['implementation_ref'], 'Diff endpoint differs')
    for item in subject['implementation_ref']['files']:
        path = snapshot.checked_path(ROOT, item['id'])
        require(snapshot.digest(path.read_bytes()) == item['sha256'], 'Working implementation differs: ' + item['id'])
    expected_evidence = ['evidence/AUD-ADOPT-002-fit-browser.json', 'evidence/AUD-ADOPT-002-fit-server.mjs']
    require(audit['evidence_refs'] == expected_evidence, 'Unexpected audit evidence')
    for path in expected_evidence:
        require(snapshot.checked_path(ROOT, path).is_file(), 'Missing audit evidence: ' + path)
    browser = snapshot.read_json(ROOT / expected_evidence[0])
    require(browser['audit_id'] == audit['audit_id'] and browser['implementation'] == 'IMPL-005'
            and browser['result'] == 'pass' and len(browser['checks']) == 9
            and all(c['pass'] for c in browser['checks']), 'Browser evidence does not correspond')
    require(browser['automated_tests_rerun'] == {'command': 'npm test (TMP/TEMP inside .local/tmp)',
                                              'tests': 29, 'pass': 29, 'fail': 0}, 'Test evidence differs')
    payload = snapshot.read_json(ROOT / ('operations/' + OPERATION + '-payload.json'))
    state, _ = read_md('design/state.md')
    operation = state['operations'][OPERATION]
    require(state['current_bundle'] == payload['base_bundle'] is None, 'Base bundle changed')
    require(operation['state'] == 'requested' and operation['payload_hash'] == digest(payload)
            and operation['subject_hash'] == request['subject_hash']
            and operation['audit_request_id'] == REQUEST, 'Operation changed')
    meta, _ = read_md('operations/' + OPERATION + '.md')
    require(meta['payload_hash'] == digest(payload) and meta['state'] == 'requested', 'Operation document differs')
    for key in ['subject_hash', 'scope', 'phase', 'criteria_version', 'change_ids', 'subject_ref',
                'baseline_refs', 'review_mode', 'recovery_ref']:
        require(payload[key] == request[key], 'Payload differs: ' + key)
    require(payload['delegation_ref'] == subject['delegation_ref'], 'Delegation differs')
    references(payload)
    require(not state['tombstones'] and not state['unaudited_changes'], 'Cancellation or unexpected adopted changes')
    active = [b for b in state['blocked_scopes'] if b['state'] == 'active']
    require(len(active) == 1 and active[0]['finding_id'] == 'F-CLOUD-ADOPT-001'
            and active[0]['scope'] == request['scope'] and REQUEST in active[0]['permitted_operations'],
            'Unexpected blocked scope')
    require({c['change_id'] for c in state['pending_changes']} == set(request['change_ids']), 'Pending changes differ')
    versions = [None] + request['cumulative_diff_ref']['via'] + [request['cumulative_diff_ref']['to']]
    for change in state['pending_changes']:
        require(change['phase'] == 'implementation' and set(change['affected_scope']) <= set(request['scope'])
                and change['old_version'] in versions and change['new_version'] in versions
                and versions.index(change['old_version']) < versions.index(change['new_version'])
                and change['baseline_refs'] == request['baseline_refs'], 'Change not fully covered')
    account = state['budget_accounts']['LOCAL-01']
    references(account)
    definition, _ = read_md(account['definition_ref']['immutable_ref'])
    require(definition['limits'] == {k: {x: y for x, y in v.items() if x != 'cumulative_used'}
                                   for k, v in account['limits'].items()}, 'Budget definition differs')
    require(account['definition_ref'] == subject['budget_definition_ref']
            and account['delegation_ref'] == subject['delegation_ref'], 'Budget/delegation provenance differs')
    reservation = state['execution_reservations']['EXEC-AUDIT-ADOPT-002']
    require(reservation['state'] == 'reserved' and reservation['operation_id'] == REQUEST
            and reservation['activity'] == 'audit' and reservation['scope'] == request['scope']
            and reservation['definition_ref'] == account['definition_ref']
            and reservation['limits'] == {'external_spend': 0, 'trials': 0, 'audits': 1, 'record_batches': 0},
            'Audit reservation differs')
    require(state['periodic_policy']['cycle_closed_enabled'] is True, 'Review different periodic policy')
    require(CLOSURE not in state['operations'] and RECORD_EXECUTION not in state['execution_reservations'],
            'Already received; use saved ledger result instead of applying twice')
    require(all(o['state'] in ('checked', 'committed', 'rejected') for k, o in state['operations'].items()
                if k != OPERATION), 'Related operation unfinished')
    for path in NEW_PATHS:
        require(not (ROOT / path).exists(), 'Refusing to replace existing record: ' + path)
    return request, audit, subject, payload, state, precheck


def settle_in_state(state, execution, evidence):
    reservation = state['execution_reservations'][execution]
    require(reservation['state'] == 'reserved', 'Reservation already settled: ' + execution)
    for key, amount in reservation['limits'].items():
        state['budget_accounts']['LOCAL-01']['limits'][key]['cumulative_used'] += amount
    reservation.update(state='settled', settled_at=now(), evidence_ref=evidence)


def apply():
    request, audit, subject, payload, original, precheck = validate()
    before = inventory()
    write_json('.local/tmp/AUD-ADOPT-002-before.json', before)
    reserve(RECORD_EXECUTION, 'record', REQUEST, 'F-CLOUD-ADOPT-001')
    state, _ = read_md('design/state.md')
    require(state['revision'] == original['revision'] + 1, 'Concurrent state update')
    audit_folder = freeze(['audits/AUD-ADOPT-002.md'] + audit['evidence_refs'])
    audit_ref = ref(audit_folder, 'audits/AUD-ADOPT-002.md', 'AUD-ADOPT-002')
    audit_evidence = [ref(audit_folder, path) for path in audit['evidence_refs']]
    unverified = [item for item in audit['unverified'] if not item.startswith('採用確定/')]
    handoff_body = '''# C-001から次計画への候補（未着手）
採用対象はIMPL-005のローカル技術的試験のみ。次の5件は新計画の候補であり、今回の製品コードは変更していない。優先順・実装・検証条件は次計画の学習担当が確定する。

| 候補 | 出所 | 次計画で決める内容 |
| --- | --- | --- |
| NEXT-01 起動時障害の再試行・ログアウト | AUD-ADOPT-002 / F-CLOUD-ADOPT-002（open minor、owner=SYS-LOG実装担当 Codex） | 再試行ボタンまたは再読み込み案内、cookie消去可能なログアウト、未知の400/401/403が続いた場合に再ログインを選べる方針。起動時障害・復旧・ログアウトを検証する。採用を妨げないが解消済みとはしない。 |
| NEXT-02 検索範囲の統一 | CORRECTION-004-HANDOFF | fixtureはイベント全体、SQLはtitle/body/reason/actor/project/run/next/evidenceのみ。source/phase/outcome/idを含める検索仕様と両adapterの一致を決める。 |
| NEXT-03 自己申告ログと自動記録の方針 | CORRECTION-004-HANDOFF | 現状はAIの自己申告。Claude Code hooks/Codex notifyによる自動記録・監視化は利用者の方針確認後に新計画で扱う。 |
| NEXT-04 一覧の自動更新 | CORRECTION-004-HANDOFF | 監視用途へ進む場合は定期取得と最終取得時刻表示、障害時の表示を計画する。 |
| NEXT-05 圧縮コードの整形 | CORRECTION-004-HANDOFF | service.mjs/app.js/styles.cssの1行圧縮を別サイクルで整形し、動作不変を確認する。 |

## 採用後も未確認・保留の確認
DEPLOY-01（実Supabase DB/Auth/RLS/RPC、実際のAuthエラー本文、Vercel HTTPS、Secure cookie）は未確認。本番資格・アカウント接続と課金条件の確認後、別計画で検証する。
SOURCES-01（Codex/Claudeのローカル・クラウド4実環境からのHTTPS送信）は未確認。ローカルで4source値を試した事実とは区別する。
HUMAN-01（本人の見やすさ・再開評価）、native download完了、他ブラウザ、長期運用、クラウドキュー持続性は未確認。製品全体完成はfalse。
FIT変更部分は独立監査の実ブラウザ9項目と自動29件で確認された。真の失効時のexport消去はブラウザでは個別観測されず、自動テストで確認。実Auth/HTTPSを保証しない。
固定ADOPT-002/TRIAL-005の「FIT未確認」は提出時点の履歴として保存し、現在の確認状況はAUD-ADOPT-002と受理記録を参照する。
'''
    write_md(HANDOFF, {'id': 'C-001-NEXT-PLAN-CANDIDATES', 'revision': 1, 'cycle_id': 'C-001',
                      'state': 'proposed-for-next-plan', 'recorded_at': now(), 'audit_ref': audit_ref,
                      'existing_handoff_ref': 'evidence/CORRECTION-004-handoff.md',
                      'candidate_ids': ['NEXT-01', 'NEXT-02', 'NEXT-03', 'NEXT-04', 'NEXT-05']}, handoff_body)
    receipt_meta = {'id': 'AUD-ADOPT-002-RECORD-ACCEPTED', 'revision': 1, 'record_owner': 'Codex / record',
                    'audit_request_id': REQUEST, 'origin_operation_id': OPERATION, 'audit_ref': audit_ref,
                    'audit_evidence_refs': audit_evidence, 'subject_ref': request['subject_ref'],
                    'subject_hash': request['subject_hash'], 'scope': request['scope'],
                    'phase': request['phase'], 'criteria_version': request['criteria_version'],
                    'change_ids': request['change_ids'], 'precheck': precheck, 'recorded_at': now(),
                    'independent_reviewer': audit['reviewer'], 'result': 'applied-local-technical-trial-only',
                    'released_finding_ids': ['F-CLOUD-ADOPT-001'], 'open_minor_ids': ['F-CLOUD-ADOPT-002'],
                    'unverified': unverified, 'next_plan_candidates_ref': HANDOFF,
                    'base_state_revision': original['revision'], 'adoption_state_revision': state['revision'] + 1}
    receipt_body = '''# 独立再監査の受理
要求identityの7項目、固定subjectの構造・参照hash、実装作業版、委任・予算・取消・基準bundle、累積差分initial→IMPL-003→IMPL-005を照合した。独立監査Claude Opus 5.5のaudit-pass（major/blocker 0、minor 1）をrecordとして受理する。Codexは正式監査や製品試験を再実行していない。
監査とブラウザJSON・FIT serverを新snapshotへ固定し、同一state更新でcurrent反映、実装phaseの4scopeの基準登録、CHANGE-001/002の全scope・共同条件の解消、F-CLOUD-ADOPT-001の解除根拠・後続要求、監査予約精算、送信待ちの結果参照を保存する。旧OP-ADOPT-001のrequire-reviewは保持する。
採用はE-001が許容するローカル技術的試験に限る。UT/SITの前回確認の有効な引継ぎとAuth自動29件・独立実ブラウザ9項目を監査が確認した。固定subject/TRIALにあるFIT未確認を上書きせず、今回の監査結果で確認状況を補う。真の失効時のexport消去は自動テストによる確認で、実ブラウザ個別観測とはしない。
F-CLOUD-ADOPT-002はopen minorで、起動時障害の再試行・cookie消去ログアウト・未知の400/401/403継続時の扱いを次計画へ保留する。監査が次サイクルで可・採用を妨げないと判定したため、この項目だけ未解消として引き継ぐ。
DEPLOY-01、SOURCES-01、HUMAN-01、native download、他ブラウザ、長期運用、クラウドキュー持続性は未確認。資格接続・課金条件・実環境・本人評価等の証拠不足のため、本番利用・4環境対応の実証・全体完成を保留する。
採用後のcycle_closedは全関連操作の確定結果、保存済みperiodic_policy、現在版と同一subjectの実装基準、差分なしを照合して理由付きskipを保存してからackする。新しい監査実行は不要。外部購入0、platform token費用unknownを維持する。
'''
    write_md(RECEIPT, receipt_meta, receipt_body)
    support_folder = freeze([RECEIPT, HANDOFF, 'evidence/CORRECTION-004-handoff.md'])
    receipt_ref = ref(support_folder, RECEIPT, receipt_meta['id'])
    handoff_ref = ref(support_folder, HANDOFF, 'C-001-NEXT-PLAN-CANDIDATES')
    bundle = {k: copy.deepcopy(subject[k]) for k in ['spec_refs', 'contract_refs', 'model_definition_refs',
               'implementation_ref', 'trial_refs', 'evidence_refs', 'plan_ref', 'plan_revision', 'evaluation_ref',
               'delegation_ref', 'budget_definition_ref', 'contracts_not_applicable_reason',
               'model_definitions_not_applicable_reason']}
    bundle.update(id='BUNDLE-001', subject_hash=request['subject_hash'], subject_ref=request['subject_ref'],
                  audit_ref=audit_ref, audit_evidence_refs=audit_evidence, record_ref=receipt_ref,
                  adoption_scope='local-technical-trial-only', scope=request['scope'], phase='implementation',
                  criteria_version=1, unverified=unverified, subject_unverified_at_submission=subject['unverified'],
                  open_minor_ids=['F-CLOUD-ADOPT-002'], next_plan_candidates_ref=handoff_ref,
                  verification_updates=[{'criterion': 'FIT-01', 'status': 'verified-with-local-fake-transport',
                                         'result_ref': audit_ref, 'evidence_refs': audit_evidence}])
    references(bundle)
    write_json(BUNDLE, bundle)
    bundle_folder = freeze([BUNDLE])
    bundle_ref = ref(bundle_folder, BUNDLE, 'BUNDLE-001')

    def adopt(s):
        require(s == state, 'Adoption CAS failed')
        references(bundle)
        s['current_bundle'] = bundle_ref
        s['operations'][OPERATION].update(state='committed', result='applied', bundle=bundle_ref,
                                          result_ref=audit_ref, record_ref=receipt_ref, committed_at=now())
        for scope_id in request['scope']:
            s['audit_baselines'].append({'scope_id': scope_id, 'phase': 'implementation', 'criteria_version': 1,
                'scope': request['scope'], 'subject_hash': request['subject_hash'], 'subject_ref': request['subject_ref'],
                'audit_request_id': REQUEST, 'result_ref': audit_ref, 'evidence_refs': audit_evidence, 'accepted_at': now()})
        s.setdefault('resolved_changes', []).extend(dict(c, resolution='audited-on-adoption', result_ref=audit_ref,
                adopted_bundle=bundle_ref, resolved_at=now()) for c in s['pending_changes'])
        s['pending_changes'] = []
        for blocked in s['blocked_scopes']:
            if blocked['state'] == 'active' and blocked['finding_id'] == 'F-CLOUD-ADOPT-001':
                blocked.update(state='released', released_at=now(), release_result_ref=audit_ref,
                    successor_request_id=REQUEST, phase='implementation',
                    release_reason='独立再監査が一時障害のcookie/旧表示保持・復旧と真の失効時消去を確認。',
                    evidence_refs=audit_evidence)
        for notification in s['received_notifications'].values():
            if notification.get('failed_request_id') == 'AR-ADOPT-001':
                notification.update(waiting_state=None, successor_request_id=REQUEST, successor_result_ref=audit_ref)
        for message in s['outbox']:
            if message['message_id'] == REQUEST:
                message.update(state='acknowledged', result_ref=audit_ref, acknowledged_at=now())
        settle_in_state(s, 'EXEC-AUDIT-ADOPT-002', audit_ref)
        s['open_findings'] = [{'finding_id': 'F-CLOUD-ADOPT-002', 'severity': 'minor', 'state': 'open',
            'owner': 'SYS-LOG実装担当（Codex）', 'result_ref': audit_ref, 'next_plan_candidates_ref': handoff_ref,
            'release_condition': '起動時障害の再試行案内/操作とcookie消去可能なログアウト、未知の400/401/403継続時の方針を次計画で実装・検証。',
            'blocks_local_adoption': False}]
        s['unverified'] = unverified
        s['next_plan_candidates_ref'] = handoff_ref
        s['display'].update(audit='独立再監査合格・major/blocker 0・minor 1未解消',
            trial='TRIAL-005自動29件合格・独立監査FIT 9項目確認（過去の失敗と未確認記録を保持）',
            adoption='ローカル技術的試験のみ採用', cycle='採用済み・終了通知処理待ち',
            production_deployment='DEPLOY-01 未確認', source_environments='SOURCES-01 未確認',
            human_evaluation='HUMAN-01 未確認', native_download='未確認',
            other_follow_up='実Authエラー本文・他ブラウザ・長期運用・クラウドキュー持続性は未確認',
            next='F-CLOUD-ADOPT-002と既存4件を次計画へ。配備・4実環境・本人評価などは未確認。')
    adopted = update_state(adopt)
    meta, body = read_md('operations/' + OPERATION + '.md')
    write_md('operations/' + OPERATION + '.md', dict(meta, revision=meta['revision'] + 1,
             state='committed', result='applied', result_ref=audit_ref, reflected_bundle=bundle_ref,
             record_ref=receipt_ref, committed_at=adopted['operations'][OPERATION]['committed_at']),
             body + '\n\nAUD-ADOPT-002を受理しローカル技術的試験のみ採用。提出時のFIT不足は独立監査が補完。旧失敗記録・未確認範囲・open minorは保存。stateの確定結果を参照する。')

    related = [{'operation_id': key, 'state': value['state'], 'result': value['result'],
                'result_ref': value.get('result_ref')} for key, value in adopted['operations'].items()]
    closure_payload = {'operation_id': CLOSURE, 'kind': 'cycle_closed', 'cycle_id': 'C-001',
        'experiment_id': 'E-001', 'plan_revision': 1, 'outcome': 'reflected', 'scope': request['scope'],
        'related_operations': related, 'reflected_bundle': bundle_ref, 'closed_at': now(),
        'review_mode': 'normal', 'recovery_ref': None, 'delegation_ref': subject['delegation_ref']}
    write_json('operations/' + CLOSURE + '-payload.json', closure_payload)
    closure_folder = freeze(['operations/' + CLOSURE + '-payload.json'])
    closure_ref = ref(closure_folder, 'operations/' + CLOSURE + '-payload.json', CLOSURE)
    experiment = {'experiment_id': 'E-001', 'revision': 2, 'plan_revision': 1, 'cycle_id': 'C-001',
        'state': 'reflected', 'cycle_state': 'notification-pending', 'plan_ref': subject['plan_ref'],
        'trial_history': ['experiments/trials/TRIAL-%03d.md' % n for n in range(1, 6)],
        'adopted_trial_refs': subject['trial_refs'], 'related_operations': related, 'adoption_ref': OPERATION,
        'reflected_bundle': bundle_ref, 'outbox': [{'message_id': CLOSURE, 'state': 'pending', 'payload_ref': closure_ref}],
        'human_evaluation': 'unverified', 'project_complete': False, 'unverified': unverified,
        'next_plan_candidates_ref': handoff_ref}
    experiment_body = '# ローカル技術的試験の終端\nTRIAL-001〜005の失敗・修正・観測履歴を保存する。OP-ADOPT-001はrequire-reviewのまま、後続OP-ADOPT-002の固定IMPL-005を独立再監査合格後に採用。監査追加の実ブラウザ証拠を受理し、製品コード・固定subject・trialは編集していない。\nDEPLOY-01、SOURCES-01、HUMAN-01、native download、他ブラウザ、長期運用、クラウドキュー持続性は未確認。minorと既存4件を次計画へ引き継ぐ。ローカルサイクルの完了は製品全体完成を意味しない。追加購入0、platform token費用unknown。'
    write_md('experiments/E-001.md', experiment, experiment_body)
    write_md('operations/' + CLOSURE + '.md', dict(closure_payload, revision=1, state='requested',
             payload_hash=digest(closure_payload)), '# cycle_closed\n全関連操作の終端と反映bundle、未確認・次計画候補を通知。')
    skip_reason = 'no-unaudited-implementation-changes: CHANGE-001/002の全scope・共同条件とinitial→IMPL-003→IMPL-005を同一subjectの独立adoption監査で保証し採用時に解消。採用後の製品変更なし。未確認配備等とopen minorを保証済みにしない。'

    def close(s):
        require(s == adopted, 'Closure CAS failed')
        require(s['current_bundle'] == bundle_ref and not s['pending_changes'] and not s['unaudited_changes']
                and not any(b['state'] == 'active' for b in s['blocked_scopes']), 'Cycle not ready')
        for item in request['scope']:
            require(any(b['scope_id'] == item and b['phase'] == 'implementation' and b['criteria_version'] == 1
                        and b['subject_hash'] == request['subject_hash'] for b in s['audit_baselines']), 'Guarantee missing')
        for entry in related:
            require(s['operations'][entry['operation_id']]['state'] == entry['state']
                    and s['operations'][entry['operation_id']]['result'] == entry['result'], 'Related operation changed')
        s['operations'][CLOSURE] = {'kind': 'cycle_closed', 'payload_hash': digest(closure_payload),
            'state': 'committed', 'result': 'acknowledged', 'scope': request['scope'],
            'bundle': bundle_ref, 'payload_ref': closure_ref}
        s['received_notifications'][CLOSURE] = {'payload_hash': digest(closure_payload), 'cycle_id': 'C-001',
            'periodic_request_id': None, 'periodic_status': 'skipped', 'skip_reason': skip_reason,
            'ack': 'acknowledged', 'acknowledged_at': now(), 'policy': copy.deepcopy(s['periodic_policy']),
            'next_due': None, 'waiting_state': None, 'related_operations': related, 'result_ref': audit_ref}
        s['outbox'].append({'message_id': CLOSURE, 'kind': 'S-PROPOSAL', 'payload_ref': closure_ref,
                           'target': 'record', 'state': 'acknowledged'})
        s['cycle_status'] = {'cycle_id': 'C-001', 'state': 'complete', 'closed_at': closure_payload['closed_at'],
            'closure_id': CLOSURE, 'periodic': 'reasoned-skip', 'adoption_scope': 'local-technical-trial-only',
            'human_evaluation': 'unverified', 'production_deployment': 'unverified',
            'source_environments': 'unverified', 'native_download': 'unverified',
            'open_minor_ids': ['F-CLOUD-ADOPT-002'], 'project_complete': False, 'unverified': unverified}
        s['display'].update(cycle='ローカル技術的試験サイクル完了・cycle_closed ack・周期監査は理由付きskip',
                            project_complete='未完了（配備・4実環境・本人評価等は未確認）')
        settle_in_state(s, RECORD_EXECUTION, receipt_ref)
    final = update_state(close)
    experiment.update(revision=3, cycle_state='complete',
                      periodic={'result': 'skip', 'reason': skip_reason, 'notification_ref': CLOSURE})
    experiment['outbox'][0]['state'] = 'acknowledged'
    write_md('experiments/E-001.md', experiment, experiment_body + '\n\n全関連操作を照合し、保存済み周期設定による差分なしskipと通知ackをstateに保存。')
    meta, body = read_md('operations/' + CLOSURE + '.md')
    write_md('operations/' + CLOSURE + '.md', dict(meta, revision=2, state='committed', result='acknowledged',
             result_ref='design/state.md#received_notifications/' + CLOSURE),
             body + '\n通知受領・理由付きperiodic skip・ackをstateの同一更新で保存。製品全体完成はfalse。')
    after = inventory()
    modified = [p for p in before if after.get(p) != before[p]]
    require(set(modified) == {'design/state.md', 'operations/OP-ADOPT-002.md'}, 'Unexpected existing file mutation')
    for folder in (ROOT / 'design/snapshots').iterdir():
        if folder.is_dir() and folder.name.startswith('SN-'):
            snapshot.verify(folder)
    references(bundle)
    reread, _ = read_md('design/state.md')
    require(reread == final and final['cycle_status']['state'] == 'complete', 'Final ledger differs')
    new_paths = sorted(p for p in after if p not in before)
    for p in modified + new_paths:
        data = (ROOT / p).read_text(encoding='utf-8')
        require(not re.search(r'\?{2,}', data) and '\ufffd' not in data, 'Encoding damage: ' + p)
    report = {'id': 'AUD-ADOPT-002-RECORD-VERIFICATION', 'verified_at': now(), 'result': 'pass',
        'base_revision': original['revision'], 'final_revision': final['revision'],
        'identity_fields': ['audit_request_id', 'origin_operation_id', 'scope', 'phase', 'subject_hash', 'criteria_version', 'change_ids'],
        'precheck': precheck, 'current_bundle': bundle_ref, 'active_blocked_scopes': [],
        'released_findings': ['F-CLOUD-ADOPT-001'], 'open_minor_ids': ['F-CLOUD-ADOPT-002'],
        'cycle': final['cycle_status'], 'periodic': final['received_notifications'][CLOSURE],
        'audit_execution': final['execution_reservations']['EXEC-AUDIT-ADOPT-002']['state'],
        'record_execution': final['execution_reservations'][RECORD_EXECUTION]['state'],
        'modified_existing_files': modified, 'new_files': new_paths + [VERIFY],
        'preservation': 'All inventoried pre-existing files except state and OP-ADOPT-002 unchanged; all snapshot manifests verified.',
        'utf8_and_question_mark_check': 'pass', 'unverified': unverified,
        'next_plan_candidates_ref': handoff_ref, 'git_operations': False, 'network_operations': False,
        'product_code_changed': False, 'audit_or_product_tests_rerun': False}
    write_json(VERIFY, report)
    print(json.dumps({'result': 'applied', 'state_revision': final['revision'], 'current_bundle': bundle_ref,
                      'active_blocked_scopes': 0, 'cycle': 'complete-local-only', 'verification': VERIFY,
                      'next_plan_candidates': HANDOFF}, ensure_ascii=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--check', action='store_true')
    mode.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if args.check:
        *_, state, precheck = validate()
        print(json.dumps({'identity': 'match', 'state_revision': state['revision'], 'precheck': precheck,
                          'record_ready': True}, ensure_ascii=False))
    else:
        apply()
