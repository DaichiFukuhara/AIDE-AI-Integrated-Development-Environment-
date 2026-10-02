"""Freeze all product inputs before reserving a verification round."""
import argparse
from records import *
parser=argparse.ArgumentParser()
parser.add_argument('number')
parser.add_argument('--corrective-finding')
args=parser.parse_args()
number=args.number
state,_=read_md('design/state.md')
if state['operations']['OP-PLAN-001']['state']!='checked':
    raise SystemExit('Plan not checked')
if (ROOT/f'experiments/implementation-{number}.json').exists():
    raise SystemExit('Implementation already frozen')
paths=sorted(p.relative_to(ROOT).as_posix() for folder in ['api','lib','cli','public','scripts','dev','tests','supabase'] for p in (ROOT/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
paths+=['README.md','agent-instructions.md','package.json','vercel.json','.env.example','.gitignore','.gitattributes']
folder=freeze(paths)
implementation={'id':'IMPL-'+number,'snapshot_ref':folder,'files':[ref(folder,p) for p in paths]}
write_json(f'experiments/implementation-{number}.json',implementation)
reserve('EXEC-TRIAL-'+number,'trial','TRIAL-'+number,args.corrective_finding)
update_state(lambda s:s['display'].update(trial='検証中',cycle='試行中',next='固定実装の自動検証と実ブラウザを確認する。本番/4実環境/本人は未確認。'))
print(json.dumps({'trial':number,'snapshot':folder}))
