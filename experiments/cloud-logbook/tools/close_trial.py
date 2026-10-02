"""Close a trial without rewriting any prior evidence."""
import argparse
from records import *
parser=argparse.ArgumentParser()
parser.add_argument('number')
parser.add_argument('--result',choices=['pass','needs-fix'],required=True)
parser.add_argument('--summary',required=True)
args=parser.parse_args()
number=args.number
path=f'experiments/trials/TRIAL-{number}.md'
if (ROOT/path).exists(): raise SystemExit('Trial already closed')
implementation=snapshot.read_json(ROOT/f'experiments/implementation-{number}.json')
for item in implementation['files']:
    if hashlib.sha256((ROOT/item['id']).read_bytes()).hexdigest()!=item['sha256']: raise SystemExit('Fixed source changed')
paths=sorted(p.relative_to(ROOT).as_posix() for p in (ROOT/'evidence').glob(f'TRIAL-{number}-*') if p.is_file())+[f'experiments/implementation-{number}.json','design/state.md']
if f'evidence/TRIAL-{number}-browser.json' not in paths: raise SystemExit('Browser observation missing')
folder=freeze(paths)
plan=snapshot.read_json(ROOT/'audits/subjects/PLAN-001.json')
write_md(path,{'trial_id':'TRIAL-'+number,'experiment_id':'E-001','plan_revision':1,'plan_ref':plan['plan_ref'],'implementation_ref':implementation,'model_definition_refs':plan['model_definition_refs'],'evaluation_ref':plan['evaluation_ref'],'evidence_refs':[ref(folder,p) for p in paths],'executed_at':now(),'execution_id':'EXEC-TRIAL-'+number,'budget_account_refs':['LOCAL-01'],'budget_usage':{'LOCAL-01/trials':{'used':1,'unit':'verification-round'},'LOCAL-01/external_spend':{'used':0,'unit':'JPY-new-external-purchases'},'platform_token_cost':'unknown'},'budget_settlement_ref':'design/state.md#EXEC-TRIAL-'+number,'result':args.result},'# TRIAL-'+number+'\n\n'+args.summary+'\n\n実CLI・HTTP API・実ブラウザの観測。保存先は明示したメモリstub。SQL/RLSの実DB検証、Vercel配備、4実環境送信、本人評価は未確認。修正後は新しいtrialで検証し、この履歴を変更しない。')
settle('EXEC-TRIAL-'+number,path)
update_state(lambda s:s['display'].update(trial='修正が必要' if args.result=='needs-fix' else 'ローカル必須確認済み',cycle='修正中' if args.result=='needs-fix' else '採用監査待ち',next=args.summary))
print(json.dumps({'trial':number,'result':args.result,'snapshot':folder}))
