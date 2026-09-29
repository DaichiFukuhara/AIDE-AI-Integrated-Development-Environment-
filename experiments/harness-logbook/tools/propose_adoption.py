"""Prepare the learning role's immutable proposal; record reserves the review."""
from records import *
from precheck import check

state, _ = read_md('design/state.md')
if state['current_bundle'] is not None or state['blocked_scopes'] or state['operations']['OP-PLAN-001']['state'] != 'checked':
    raise SystemExit('S-CONTEXT preconditions changed')
plan = snapshot.read_json(ROOT / 'audits/subjects/PLAN-001.json')
implementation = snapshot.read_json(ROOT / 'experiments/implementation-002.json')
for item in implementation['files']:
    if hashlib.sha256((ROOT / item['id']).read_bytes()).hexdigest() != item['sha256']:
        raise SystemExit('Working product changed after TRIAL-002: ' + item['id'])
trial, _ = read_md('experiments/trials/TRIAL-002.md')
if trial['result'] != 'pass':
    raise SystemExit('Trial not passed')
candidate_paths = []
for name in ['design', 'rationale']:
    meta, body = read_md(f'design/domains/log/systems/console/{name}.md')
    meta['revision'] = 2
    if name == 'design':
        body += '\n\n## 試行で確認した内部構成\nCLIと読取HTTPをPython標準ライブラリで実装し、HTML/CSS/JSが実ログと台帳を読み取る。根拠は画面内にテキスト表示する。受入条件・owner・定義の意味は変更していない。採用の権威はstate.current_bundleであり、この作業表示パスではない。'
    else:
        body += '\n\n## 今回の学び\nTRIAL-001では自動検証17件が成功しても、アプリ内ブラウザによるMarkdown直接遷移の拒否が分かった。根拠を画面内のテキストとして読ませる内部変更と、狭い画面での操作名補足を行いTRIAL-002で再確認した。Windowsではsnapshotの一時フォルダに起因する権限制約も観測した。ハーネス規約そのものは変更していない。本人評価は未確認のまま。試行の不変版は今回のimplementation subjectのtrial_refsに固定する。'
    path = f'design/candidates/OP-ADOPT-001/system-{name}.md'
    write_md(path, meta, body)
    candidate_paths.append(path)

write_md('evidence/harness-observations.md', {'id': 'OBS-HARNESS-001', 'revision': 1, 'recorded_at': now()}, '''
# ハーネスを使った結果、今回分かったこと

## 観測
1. 前回は画面だけを作り、手順の実使用をしなかった。今回は利用者の訂正後、4階層・定義・固定計画・予算を保存し、別担当のplan監査を受理してから製品コードを作り始めた。
2. 計画合格時にcurrent_bundle=nullを維持したことで、まだ作っていない製品が採用済みになる混同を避けられた。実際の画面も台帳とログ結果を別に表示する。
3. 自動検証だけではブラウザの根拠遷移制約が見つからなかった。TRIAL-001をneeds-fixとして凍結し、同じ条件のTRIAL-002で画面内表示を実使用確認した。失敗履歴は消していない。
4. Windows sandboxで既存snapshot補助ツールの一時フォルダ権限が保存と読取を妨げた。権限付きコマンドで成功した。規約やツールの変更はこの実験の対象外として、結果に制約を残す。
5. 準備時にはログCLI自体がないため、最初の5記録のうち計画・設計・計画監査などは後から追記した。本文に事後記録と原本を明示して時刻や実績を捏造していない。

## 推論と次の候補
版と未確認範囲を分ける仕組みは本事例で有効だった。小さな画面作成に対して初期文書・台帳処理が多く、準備負荷は観測したが、所要時間短縮・品質改善率は測っていない。次の候補は、snapshotのWindows運用と記録テンプレート準備の補助。ハーネス改修を勝手に本サイクルへ追加しない。

## 限界
1プロジェクト・1サイクル・同一Codex環境の結果。本人の使いやすさ、実務再開、他環境での再現性は未確認。採用監査とcycle_closedは本記録時点では未実行であり、完了を先取りしない。
''')
paths = candidate_paths + ['experiments/trials/TRIAL-001.md', 'experiments/trials/TRIAL-002.md', 'evidence/harness-observations.md', 'evidence/TRIAL-002-screen.png', 'audits/AUD-PLAN-001.md', 'operations/OP-PLAN-001.md']
folder = freeze(paths)
subject = dict(plan)
subject['phase'] = 'implementation'
subject['spec_refs'] = [item for item in plan['spec_refs'] if not item['id'].startswith('SYS-LOG')]
subject['spec_refs'] += [ref(folder, candidate_paths[0], 'SYS-LOG', 1), ref(folder, candidate_paths[1], 'SYS-LOG-rationale', 1)]
subject['implementation_ref'] = implementation
subject['trial_refs'] = [ref(folder, f'experiments/trials/TRIAL-{number}.md', 'TRIAL-' + number) for number in ['001', '002']]
subject['evidence_refs'] = trial['evidence_refs'] + [ref(folder, path) for path in ['evidence/harness-observations.md', 'evidence/TRIAL-002-screen.png', 'audits/AUD-PLAN-001.md', 'operations/OP-PLAN-001.md']]
subject['unverified'] = ['HUMAN-01: 本人の使いやすさ・実務再開は未確認。固定計画で技術的試験採用の必須条件から除外。', '長期運用・全ブラウザ互換・外部公開・多人同時書込みは対象外。', 'cycle_closedのackと周期skipは採用確定後に実施し、採用監査の結果と混同しない。']
write_json('audits/subjects/ADOPT-001.json', subject)
precheck = check('audits/subjects/ADOPT-001.json')
write_json('evidence/precheck-adoption-001.json', precheck)
subject_hash = digest(subject)
change = {'change_id': 'CHANGE-001', 'affected_scope': state['scope'], 'phase': 'implementation', 'baseline_refs': {item: 'initial' for item in state['scope']}, 'first_changed_at': now(), 'operation_id': 'OP-ADOPT-001', 'old_version': None, 'new_version': implementation, 'joint_condition': 'CLI→保存→HTTP→画面の結合を分割せず同じsubjectで保証する', 'reason': '初回の製品試験採用。旧試作は採用済みbundleではない。'}
write_json('design/candidates/OP-ADOPT-001/change.json', change)
payload = {'operation_id': 'OP-ADOPT-001', 'kind': 'adoption', 'experiment_id': 'E-001', 'plan_revision': 1, 'cycle_id': 'C-001', 'scope': state['scope'], 'base_bundle': None, 'phase': 'implementation', 'criteria_version': 1, 'subject_ref': 'audits/subjects/ADOPT-001.json', 'subject_hash': subject_hash, 'delegation_ref': plan['delegation_ref'], 'change_ids': ['CHANGE-001'], 'baseline_refs': change['baseline_refs'], 'review_mode': 'normal', 'recovery_ref': None}
write_json('operations/OP-ADOPT-001-payload.json', payload)
write_md('operations/OP-ADOPT-001.md', dict(payload, revision=1, state='requested', payload_hash=digest(payload), base_revision=state['revision'], result_ref=None), '# 技術的試験採用の提案\n\nTRIAL-001の制約を残し、修正後のTRIAL-002の必須条件成功を根拠に提案する。本人評価は未確認。currentは監査結果受理までnullのまま。')
update_state(lambda s: (s['operations'].update({'OP-ADOPT-001': {'payload_hash': digest(payload), 'kind': 'adoption', 'subject_hash': subject_hash, 'scope': state['scope'], 'state': 'requested', 'result': None, 'bundle': None, 'audit_request_id': 'AR-ADOPT-001'}}), s['pending_changes'].append(change), s['display'].update(audit='実装の監査待ち', adoption='採用候補', cycle='採用監査待ち', next='別担当が固定実装・試行・根拠を監査する。結果と取消を照合してからrecordが採否を確定する。')))
reserve('EXEC-AUDIT-ADOPT-001', 'audit', 'AR-ADOPT-001')
request = {'audit_request_id': 'AR-ADOPT-001', 'origin_operation_id': 'OP-ADOPT-001', 'kind': 'adoption', 'scope': state['scope'], 'phase': 'implementation', 'criteria_version': 1, 'subject_ref': 'audits/subjects/ADOPT-001.json', 'subject_hash': subject_hash, 'baseline_refs': change['baseline_refs'], 'cumulative_diff_ref': {'from': 'initial', 'to': implementation, 'change_ids': ['CHANGE-001']}, 'change_ids': ['CHANGE-001'], 'execution_id': 'EXEC-AUDIT-ADOPT-001', 'budget_account_refs': ['LOCAL-01'], 'budget_check_ref': 'design/state.md#EXEC-AUDIT-ADOPT-001', 'delegation_ref': plan['delegation_ref'], 'review_mode': 'normal', 'recovery_ref': None, 'previous_audit_ref': None, 'previous_subject_ref': None, 'open_finding_ids': [], 'observed_at': now()}
write_json('audits/AR-ADOPT-001-request.json', request)
update_state(lambda s: s['outbox'].append({'message_id': 'AR-ADOPT-001', 'kind': 'S-AUDIT-INPUT', 'payload_ref': 'audits/AR-ADOPT-001-request.json', 'target': '/root/harness_auditor', 'state': 'in-flight', 'execution_id': 'EXEC-AUDIT-ADOPT-001', 'account_refs': ['LOCAL-01']}))
print(json.dumps({'request': 'audits/AR-ADOPT-001-request.json', 'subject_hash': subject_hash, 'precheck': precheck}, ensure_ascii=False))
