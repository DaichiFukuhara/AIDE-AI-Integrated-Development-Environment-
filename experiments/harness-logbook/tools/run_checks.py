"""Capture real process outputs for a previously reserved verification round."""
import argparse
import subprocess
import sys
from records import *

parser = argparse.ArgumentParser()
parser.add_argument('number')
args = parser.parse_args()
number = args.number
state, _ = read_md('design/state.md')
reservation = state['execution_reservations']['EXEC-TRIAL-' + number]
if reservation['state'] != 'reserved' or any(s['state'] == 'active' and (s['finding_id'] != reservation.get('corrective_finding') or reservation['operation_id'] not in s['permitted_operations']) for s in state['blocked_scopes']):
    raise SystemExit('Trial reservation is not valid')
implementation = snapshot.read_json(ROOT / f'experiments/implementation-{number}.json')
for item in implementation['files']:
    relative = item['id']
    if hashlib.sha256((ROOT / relative).read_bytes()).hexdigest() != item['sha256']:
        raise SystemExit('Implementation changed after freezing: ' + relative)
target = f'evidence/TRIAL-{number}-automated.json'
if (ROOT / target).exists():
    raise SystemExit('Evidence already exists; use a new trial for a rerun')
commands = [[sys.executable, '-B', '-m', 'unittest', 'discover', '-s', 'tests', '-v'], ['node', '--test', 'tests/view.test.mjs'], ['node', '--input-type=module', '--check']]
results = []
for command in commands:
    started = now()
    result = subprocess.run(command, cwd=ROOT, input=(ROOT / 'src/app.js').read_text(encoding='utf-8') if '--input-type=module' in command else None, capture_output=True, text=True, encoding='utf-8', errors='replace', env=dict(os.environ, PYTHONIOENCODING='utf-8'), timeout=90)
    results.append({'command': command, 'started_at': started, 'finished_at': now(), 'exit_code': result.returncode, 'stdout': result.stdout, 'stderr': result.stderr})
write_json(target, {'trial_id': 'TRIAL-' + number, 'implementation': implementation, 'results': results, 'result': 'pass' if all(r['exit_code'] == 0 for r in results) else 'fail', 'human_evaluation': 'unverified'})
print(json.dumps({'evidence': target, 'results': [{'command': r['command'], 'exit_code': r['exit_code'], 'output': (r['stdout'] + r['stderr'])[-1500:]} for r in results]}, ensure_ascii=False, indent=2))
raise SystemExit(0 if all(r['exit_code'] == 0 for r in results) else 1)
