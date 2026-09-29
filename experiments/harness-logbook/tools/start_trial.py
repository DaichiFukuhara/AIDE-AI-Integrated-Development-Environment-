"""Freeze the product before a bounded verification round and reserve it."""
import argparse
from records import *

parser = argparse.ArgumentParser()
parser.add_argument('number')
parser.add_argument('--corrective-finding')
args = parser.parse_args()
number = args.number
state, _ = read_md('design/state.md')
if state['operations']['OP-PLAN-001']['state'] != 'checked':
    raise SystemExit('Plan is not checked')
paths = sorted(p.relative_to(ROOT).as_posix() for folder in ['src', 'tests'] for p in (ROOT / folder).iterdir() if p.is_file()) + ['README.md']
folder = freeze(paths)
implementation = {'id': 'IMPL-' + number, 'snapshot_ref': folder, 'files': [ref(folder, path) for path in paths]}
write_json(f'experiments/implementation-{number}.json', implementation)
reserve('EXEC-TRIAL-' + number, 'trial', 'TRIAL-' + number, args.corrective_finding)
update_state(lambda s: s['display'].update(trial='検証中', cycle='試行中', next='固定した実装でUT/SITとブラウザ実使用を確認し、未確認を含めてtrialへ保存する。'))
print(json.dumps({'trial': number, 'implementation': implementation['snapshot_ref'], 'state_revision': state['revision']}, ensure_ascii=False))
