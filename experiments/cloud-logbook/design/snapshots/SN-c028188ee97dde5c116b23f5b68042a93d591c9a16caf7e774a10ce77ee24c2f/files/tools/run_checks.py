"""Run the reserved fixed implementation and record actual process output."""
import argparse
import subprocess
from records import *
parser=argparse.ArgumentParser()
parser.add_argument('number')
args=parser.parse_args()
implementation=snapshot.read_json(ROOT/f'experiments/implementation-{args.number}.json')
for item in implementation['files']:
    if hashlib.sha256((ROOT/item['id']).read_bytes()).hexdigest()!=item['sha256']:
        raise SystemExit('Fixed source changed: '+item['id'])
commands=[['node','--test',*sorted(p.relative_to(ROOT).as_posix() for p in (ROOT/'tests').glob('*.test.mjs'))]]
results=[]
for command in commands:
    process=subprocess.run(command,cwd=ROOT,capture_output=True,text=True,encoding='utf-8',timeout=120)
    results.append({'command':command,'exit_code':process.returncode,'stdout':process.stdout,'stderr':process.stderr})
path=f'evidence/TRIAL-{args.number}-automated.json'
if (ROOT/path).exists():
    path=f'evidence/TRIAL-{args.number}-automated-permission-retry.json'
if (ROOT/path).exists():
    raise SystemExit('Evidence already exists; preserve history')
write_json(path,{'implementation':implementation['id'],'observed_at':now(),'result':'pass' if all(r['exit_code']==0 for r in results) else 'needs-fix','runs':results,'boundary':'Local in-memory Supabase boundary stub; SQL/RLS/live PostgreSQL not executed.'})
print(json.dumps(results,ensure_ascii=False))
