"""Prepare and reserve AR-ADOPT-002; never execute or decide the independent audit."""
import copy
import difflib
from records import *
from precheck import check

state, _ = read_md('design/state.md')
request_path = 'audits/AR-ADOPT-002-request.json'
if (ROOT / request_path).exists() or 'OP-ADOPT-002' in state['operations']:
    raise SystemExit('Correction request already exists; preserve it')
if state['current_bundle'] is not None or state['operations']['OP-ADOPT-001']['result'] != 'require-review':
    raise SystemExit('Unexpected adoption state')
hold = next(h for h in state['blocked_scopes'] if h['state'] == 'active' and h['finding_id'] == 'F-CLOUD-ADOPT-001')
previous_audit = hold['audit_ref']
previous_subject_path = str(Path(previous_audit['immutable_ref']).parent / 'subjects/ADOPT-001.json').replace('\\', '/')
previous_subject = {'id': 'ADOPT-001', 'immutable_ref': previous_subject_path,
                    'sha256': hashlib.sha256((ROOT / previous_subject_path).read_bytes()).hexdigest()}
old = snapshot.read_json(ROOT / previous_subject_path)
implementation = snapshot.read_json(ROOT / 'experiments/implementation-005.json')
for item in implementation['files']:
    if hashlib.sha256((ROOT / item['id']).read_bytes()).hexdigest() != item['sha256']:
        raise SystemExit('Source changed after trial')
trial, _ = read_md('experiments/trials/TRIAL-005.md')
if trial['automated_result'] != 'pass' or trial['FIT-01'] != 'unverified':
    raise SystemExit('Inspect actual trial result')

write_md('evidence/CORRECTION-004-record-accepted.md', {
    'id': 'CORRECTION-004-RECORD-ACCEPTED', 'revision': 1, 'observed_at': now(),
    'audit_ref': previous_audit, 'previous_subject_ref': previous_subject,
    'state_revision_received': 26,
}, '''# 監査結果の受理
AUD-ADOPT-001の要求ID・起点操作・scope・phase・subject hash・基準版・change IDsを照合し、require-review/major 1件/F-CLOUD-ADOPT-001を受理した。OP-ADOPT-001はrejected、current_bundleはnull、指摘scopeは保留。監査予約1件を精算した。
初回試行は環境制約で停止、証拠は evidence/CORRECTION-004-record-blocked.json。正式状態変更ではないため独自のstate項目は追加していない。
今回のTRIAL-004は空cookieを扱う追加テストstubの不具合で26/29、終了コード1。固定版と失敗証拠を保持し、同じAuth修正範囲のTRIAL-005を追加予約。製品コードは同一、stubの空cookie処理だけを修正したIMPL-005で29/29、終了コード0。試行累計は5/6。
実ブラウザFITは未確認。Node VM/DOM stubのUI回帰を実ブラウザ成功へ読み替えない。独立再監査の結果受理までは指摘をopen、保留をactive、採用を未反映に保つ。
''')
write_md('evidence/CORRECTION-004-handoff.md', {
    'id': 'CORRECTION-004-HANDOFF', 'revision': 1, 'recorded_at': now(),
    'finding_id': 'F-CLOUD-ADOPT-001', 'next_request': request_path,
}, '''# 次の担当への引き継ぎ
Claude Opus 5.5は harness-v3/roles/audit.md に従い、AR-ADOPT-002の固定入力・予算予約を確認して独立再監査する。Codexは監査を実行していない。OP-ADOPT-001の失敗を上書きせず、新提案OP-ADOPT-002へ対応付けた。current_bundleはnullのまま。
TRIAL-004の失敗とTRIAL-005の自動29件合格を区別する。FIT-01の実ブラウザ確認が不足しているため、解除条件を満たすと自己判定していない。
実ブラウザではuser/refreshそれぞれ500・429・通信例外に対してcookie非削除、一覧・詳細・出力保持、「未更新」、復旧後の再取得を確認する。invalid grant/JWT/refresh token時はcookie、一覧、詳細、出力、閲覧者表示の消去を確認する。初回session確認時の障害はページ再読み込み後の復旧を確認する。観測は新記録として保存し、既存subject・trial・証拠へ追記しない。subject入力が変わる場合は新subject/要求とする。

## 次サイクル・新計画で扱う事項
- 検索範囲: dev/fixture-store.mjsはイベント全体、SQL migrationの44行はtitle/body/reason/actor/project/run/next/evidenceのみ。source/phase/outcome/idの検索で差が出る。今回は製品コードを変更していない。
- 現状はAIの自己申告ログ。Claude Code hooks/Codex notifyによる自動記録と監視化は計画外。利用者に方針を確認して新計画とする。
- 一覧の自動更新はない。監視用途に進むなら定期取得と最終取得時刻表示を計画する。
- service.mjs/app.js/styles.cssの1行圧縮コードの整形は別サイクル。

実DB/Auth/RLS/RPC、Vercel HTTPS配備、4実環境送信、クラウドキュー持続性、本人評価、native download完了、長期運用・他ブラウザは未確認。外部ネットワーク・本番資格・課金・commit/push・ブランチ操作・ACL変更は行っていない。
''')
record_folder = freeze(['evidence/CORRECTION-004-record-accepted.md'])
settle('EXEC-RECORD-003', ref(record_folder, 'evidence/CORRECTION-004-record-accepted.md'))
reserve('EXEC-RECORD-004', 'record', 'AR-ADOPT-002', 'F-CLOUD-ADOPT-001')

paths = ['experiments/trials/TRIAL-004.md', 'experiments/trials/TRIAL-005.md',
         'evidence/CORRECTION-004-record-accepted.md', 'evidence/CORRECTION-004-handoff.md']
folder = freeze(paths)
subject = copy.deepcopy(old)
subject['implementation_ref'] = implementation
subject['trial_refs'] += [ref(folder, p, 'TRIAL-' + n) for p, n in zip(paths[:2], ['004', '005'])]
trial4, _ = read_md(paths[0])
subject['evidence_refs'] += trial4['evidence_refs'] + trial['evidence_refs'] + [ref(folder, p) for p in paths[2:]]
subject['unverified'] += ['FIT-01: IMPL-005のAuth 500/429/通信例外・真の失効・復旧を実ブラウザでは未確認。自動UI回帰はDOM stub。旧IMPL-003のブラウザ確認を変更部分へ流用しない。']
write_json('audits/subjects/ADOPT-002.json', subject)
precheck = check('audits/subjects/ADOPT-002.json')
write_json('evidence/precheck-adoption-002.json', precheck)

old_files = {i['id']: i for i in old['implementation_ref']['files']}
new_files = {i['id']: i for i in implementation['files']}
changed, unchanged, patch = [], [], []
for name in sorted(set(old_files) | set(new_files)):
    before, after = old_files.get(name), new_files.get(name)
    if before and after and before['sha256'] == after['sha256']:
        unchanged.append({'path': name, 'previous_ref': before, 'current_ref': after})
        continue
    changed.append({'path': name, 'previous_ref': before, 'current_ref': after})
    a = (ROOT / before['immutable_ref']).read_text(encoding='utf-8').splitlines(keepends=True) if before else []
    b = (ROOT / after['immutable_ref']).read_text(encoding='utf-8').splitlines(keepends=True) if after else []
    patch.extend(difflib.unified_diff(a, b, fromfile='IMPL-003/' + name, tofile='IMPL-005/' + name))
patch_path = 'audits/deltas/AR-ADOPT-002.patch'
(ROOT / patch_path).parent.mkdir(parents=True, exist_ok=True)
(ROOT / patch_path).write_text(''.join(patch), encoding='utf-8')
delta = {
    'id': 'DELTA-ADOPT-002', 'previous_subject_ref': previous_subject,
    'previous_subject_hash': digest(old), 'current_subject_hash': digest(subject),
    'from_implementation': old['implementation_ref'], 'to_implementation': implementation,
    'changed_files': changed, 'unchanged_files': unchanged,
    'subject_changed_fields': [k for k in subject if subject[k] != old.get(k)],
    'subject_unchanged_fields': [k for k in subject if subject[k] == old.get(k)],
    'trial_history': ['TRIAL-004: 26/29 exit 1; test cookie stub defect', 'TRIAL-005: 29/29 exit 0; FIT unverified'],
    'administrative_changes': ['tools/record_failed_audit.py finding ID', 'tools/run_checks.py test discovery',
                               'tools/close_correction_trial.py', 'tools/request_correction_audit.py'],
    'impact_paths': ['Supabase Auth response -> viewer/session -> GET session/events -> app load/bootstrap -> cookie/display retention or invalidation'],
    'excluded_product_changes': ['fixture/SQL search alignment', 'hooks/notify', 'automatic polling', 'code formatting'],
}
write_json('audits/deltas/AR-ADOPT-002.json', delta)

# Reuse is a proposal for the independent reviewer; it is not a new audit verdict.
groups = [
    ('DDD-01', 'イベントの形式・4source・UTC正規化', ['lib/schema.mjs'], 'Authエラー分類は再確認'),
    ('DDD-03', 'SQLのunique/RPC/RLSとCLIキュー・再送', ['supabase/migrations/202610030001_logbook.sql', 'cli/logbook.py'], 'Auth障害時の表示保持は再確認'),
    ('DDD-04', '単一contextのseam非該当', [], '内部Auth→service→UIは再確認'),
    ('DDD-05', '既存UT/SITの入力・キュー検証計画とテスト本文', ['tests/service.test.mjs', 'tests/integration.test.mjs'], '新Auth回帰と実ブラウザFITは再確認'),
    ('AIDE-01', '4階層・固定計画・委任と対象外の範囲', [], '新subject/予約/未確認の扱いは再確認'),
    ('AIDE-02', '画面の静的layoutとログの自己申告の意味', ['public/index.html', 'public/styles.css', 'agent-instructions.md'], 'app.jsのAuth障害表示は再確認'),
    ('AIDE-03', '旧snapshot・監査・失敗試行の固定入力', [], '新入力hash・差分・台帳・FIT不足は再確認'),
]
reused = []
for criterion, part, names, excluded in groups:
    if any(old_files[n]['sha256'] != new_files[n]['sha256'] for n in names):
        raise SystemExit('Reuse input changed')
    dependencies = subject['spec_refs'] + subject['model_definition_refs'] + [subject['plan_ref'], subject['evaluation_ref'], subject['delegation_ref'], subject['budget_definition_ref']]
    reused.append({'criterion': criterion, 'part': part, 'status': 'reuse-proposed',
                   'previous_audit_ref': previous_audit,
                   'input_refs': [old_files[n] for n in names], 'current_input_refs': [new_files[n] for n in names],
                   'dependency_refs': dependencies, 'evidence_refs': old['evidence_refs'],
                   'reason': '対象ファイル内容hashと依拠する仕様・定義・計画・委任の参照が同一。変更Auth経路の証拠としては再利用しない。',
                   'excluded': excluded})
delta_folder = freeze(['audits/deltas/AR-ADOPT-002.json', patch_path, 'audits/subjects/ADOPT-002.json', 'evidence/precheck-adoption-002.json'])
subject_ref = ref(delta_folder, 'audits/subjects/ADOPT-002.json', 'ADOPT-002')
review_delta_ref = ref(delta_folder, 'audits/deltas/AR-ADOPT-002.json', 'DELTA-ADOPT-002', patch_ref=ref(delta_folder, patch_path))
change = {'change_id': 'CHANGE-002', 'affected_scope': state['scope'], 'phase': 'implementation',
          'baseline_refs': {i: 'initial' for i in state['scope']}, 'first_changed_at': now(),
          'operation_id': 'OP-ADOPT-002', 'old_version': old['implementation_ref'], 'new_version': implementation,
          'joint_condition': 'Auth adapter/session/cookie/UIを一体で再確認。FIT未確認を維持。',
          'reason': 'F-CLOUD-ADOPT-001の修正。CHANGE-001とinitialからの累積差分を保持。'}
write_json('design/candidates/OP-ADOPT-002/change.json', change)
payload = {'operation_id': 'OP-ADOPT-002', 'kind': 'adoption', 'experiment_id': 'E-001', 'plan_revision': 1,
           'cycle_id': 'C-001', 'scope': state['scope'], 'base_bundle': None, 'phase': 'implementation',
           'criteria_version': 1, 'subject_ref': subject_ref, 'subject_hash': digest(subject),
           'delegation_ref': subject['delegation_ref'], 'change_ids': ['CHANGE-001', 'CHANGE-002'],
           'baseline_refs': change['baseline_refs'], 'review_mode': 'normal', 'recovery_ref': None,
           'previous_operation_id': 'OP-ADOPT-001'}
write_json('operations/OP-ADOPT-002-payload.json', payload)
write_md('operations/OP-ADOPT-002.md', dict(payload, revision=1, state='requested', payload_hash=digest(payload),
         base_revision=read_md('design/state.md')[0]['revision'], result_ref=None),
         '# Auth修正後のローカル採用提案\n自動29件合格。FITは未確認であり独立再監査待ち。旧失敗操作と累積差分を保持し、currentはnullのまま。')
reserve('EXEC-AUDIT-ADOPT-002', 'audit', 'AR-ADOPT-002', 'F-CLOUD-ADOPT-001')
request = {'audit_request_id': 'AR-ADOPT-002', 'origin_operation_id': 'OP-ADOPT-002', 'kind': 'adoption',
           'scope': state['scope'], 'phase': 'implementation', 'criteria_version': 1,
           'subject_ref': subject_ref, 'subject_hash': digest(subject), 'baseline_refs': change['baseline_refs'],
           'change_ids': payload['change_ids'],
           'cumulative_diff_ref': {'from': 'initial', 'via': [old['implementation_ref']], 'to': implementation,
                                   'change_ids': payload['change_ids'], 'correction_delta_ref': review_delta_ref},
           'previous_audit_ref': previous_audit, 'previous_subject_ref': previous_subject,
           'open_finding_ids': ['F-CLOUD-ADOPT-001'], 'review_delta_ref': review_delta_ref,
           'impact_scope': state['scope'], 'impact_paths': delta['impact_paths'], 'reused_checks': reused,
           'review_coverage': {'DDD-01': 'schema reuse; Auth classification review', 'DDD-02': 'writer unchanged; viewer/Auth permissions review',
                               'DDD-03': 'SQL/queue reuse; cookie/UI retention review', 'DDD-04': 'context N/A reuse; Auth boundary review',
                               'DDD-05': 'existing test inputs reuse; new regression/FIT gap review', 'AIDE-01': 'plan/delegation reuse; new proposal scope review',
                               'AIDE-02': 'static layout/log meaning reuse; stale UI review', 'AIDE-03': 'old immutable records reuse; new hashes/state/delta review'},
           'execution_id': 'EXEC-AUDIT-ADOPT-002', 'budget_account_refs': ['LOCAL-01'],
           'budget_check_ref': 'design/state.md#EXEC-AUDIT-ADOPT-002', 'delegation_ref': subject['delegation_ref'],
           'review_mode': 'normal', 'recovery_ref': None, 'reviewer': 'Claude Opus 5.5', 'independence': 'independent-required',
           'reviewer_role_ref': 'harness-v3/roles/audit.md', 'unverified': subject['unverified'], 'observed_at': now(),
           'instruction': '要求作成と予約のみ。起草/実装担当Codexは監査未実行。別モデルの外部独立監査でFIT不足と解除条件を判定する。'}
write_json(request_path, request)
request_folder = freeze([request_path, 'operations/OP-ADOPT-002.md', 'operations/OP-ADOPT-002-payload.json', 'design/candidates/OP-ADOPT-002/change.json',
                         'tools/record_failed_audit.py', 'tools/run_checks.py', 'tools/close_correction_trial.py', 'tools/request_correction_audit.py'])
fixed_request = ref(request_folder, request_path, 'AR-ADOPT-002')
def enqueue(s):
    s['operations']['OP-ADOPT-002'] = {'payload_hash': digest(payload), 'kind': 'adoption', 'subject_hash': digest(subject),
                                     'scope': state['scope'], 'state': 'requested', 'result': None, 'bundle': None, 'audit_request_id': 'AR-ADOPT-002'}
    s['pending_changes'].append(change)
    s['outbox'].append({'message_id': 'AR-ADOPT-002', 'kind': 'S-AUDIT-INPUT', 'payload_ref': fixed_request,
                        'target': 'Claude Opus 5.5 (external independent audit)', 'state': 'pending',
                        'execution_id': 'EXEC-AUDIT-ADOPT-002', 'account_refs': ['LOCAL-01']})
    s['display'].update(audit='重大指摘1件・独立再監査待ち', adoption='採用保留', cycle='独立再監査待ち・未完了',
                         trial='TRIAL-005 自動29件合格、FIT未確認（TRIAL-004失敗を保存）',
                         next='Claude Opus 5.5がAR-ADOPT-002を独立再監査する。実ブラウザFITは未確認。')
update_state(enqueue)
settle('EXEC-RECORD-004', fixed_request)
print(json.dumps({'request': request_path, 'immutable_request': fixed_request, 'subject_hash': digest(subject),
                  'precheck': precheck, 'changed_files': [i['path'] for i in changed], 'audit_executed': False}, ensure_ascii=False, indent=2))
