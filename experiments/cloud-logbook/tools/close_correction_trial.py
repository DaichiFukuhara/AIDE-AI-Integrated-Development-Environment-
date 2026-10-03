"""Preserve each correction round and explicitly distinguish DOM stubs from FIT."""
import argparse
from records import *

parser = argparse.ArgumentParser()
parser.add_argument('number', choices=['004', '005'])
args = parser.parse_args()
number = args.number
path = f'experiments/trials/TRIAL-{number}.md'
if (ROOT / path).exists():
    raise SystemExit('Trial already closed')
implementation = snapshot.read_json(ROOT / f'experiments/implementation-{number}.json')
automated = snapshot.read_json(ROOT / f'evidence/TRIAL-{number}-automated.json')
passed = all(run['exit_code'] == 0 for run in automated['runs'])
if number == '005':
    for item in implementation['files']:
        if hashlib.sha256((ROOT / item['id']).read_bytes()).hexdigest() != item['sha256']:
            raise SystemExit('Fixed source changed')
browser_path = f'evidence/TRIAL-{number}-browser.json'
if (ROOT / browser_path).exists():
    raise SystemExit('Browser record already exists')
write_json(browser_path, {
    'implementation': implementation['id'], 'observed_at': now(),
    'result': 'unverified', 'FIT-01': '未確認',
    'reason': '許可範囲内のブラウザ制御手順は利用できず、実ブラウザを実行していない。外部のskill設定は読んでいない。',
    'automated_ui_boundary': '実app.jsをNode VMとDOM stubで実行。実ブラウザの描画・操作・cookie処理の証明ではない。',
    'required_checks': [
        'user/refresh両経路で500・429・通信例外を発生させ、旧ログ・詳細・出力とcookieを保持し「未更新」を表示する。',
        '障害解除後に更新操作で新しいログを取得する。初回session確認時の障害は再読み込み後の復旧を確認する。',
        '真のinvalid grant/JWT/refresh token失効ではcookie・一覧・詳細・出力・閲覧者表示を消去しログイン画面へ戻る。',
    ],
})
paths = [f'experiments/implementation-{number}.json', f'evidence/TRIAL-{number}-automated.json', browser_path, 'design/state.md']
folder = freeze(paths)
plan = snapshot.read_json(ROOT / 'audits/subjects/PLAN-001.json')
summary = ('自動29件合格、終了コード0。実ブラウザFITは未確認。' if passed else
           '自動29件中26件成功・3件失敗、終了コード1。空cookieを扱うテストstubの不具合。TRIAL-005で別版を検証し、失敗証拠を保持する。')
write_md(path, {
    'trial_id': 'TRIAL-' + number, 'experiment_id': 'E-001', 'plan_revision': 1,
    'plan_ref': plan['plan_ref'], 'implementation_ref': implementation,
    'model_definition_refs': plan['model_definition_refs'], 'evaluation_ref': plan['evaluation_ref'],
    'evidence_refs': [ref(folder, p) for p in paths], 'executed_at': now(),
    'execution_id': 'EXEC-TRIAL-' + number, 'corrective_finding': 'F-CLOUD-ADOPT-001',
    'budget_account_refs': ['LOCAL-01'],
    'budget_usage': {'LOCAL-01/trials': {'used': 1, 'unit': 'verification-round'},
                     'LOCAL-01/external_spend': {'used': 0, 'unit': 'JPY-new-external-purchases'}, 'platform_token_cost': 'unknown'},
    'budget_settlement_ref': 'design/state.md#EXEC-TRIAL-' + number,
    'result': 'partial' if passed else 'needs-fix', 'automated_result': 'pass' if passed else 'fail',
    'FIT-01': 'unverified', 'previous_trial_ref': 'experiments/trials/TRIAL-004.md' if number == '005' else None,
}, '# TRIAL-' + number + '\n\n' + summary +
    '\n\nAuth transportとDOMはstub、CLI/HTTP APIはローカル実行。実DB/Auth/HTTPS配備、4実環境、本人評価は未確認。独立監査待ちであり採用合格ではない。')
settle('EXEC-TRIAL-' + number, path)
def finish(s):
    s['display'].update(trial=summary, cycle='再監査準備中' if passed else '限定修正検証中', next=summary)
    if number == '004':
        for hold in s['blocked_scopes']:
            if hold['state'] == 'active' and hold['finding_id'] == 'F-CLOUD-ADOPT-001':
                hold['permitted_operations'].append('TRIAL-005')
update_state(finish)
print(summary)
