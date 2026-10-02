"""Close local trial, acknowledge cycle_closed and preserve deployment follow-up."""
from records import *
state,_=read_md('design/state.md')
if state['operations']['OP-ADOPT-001']['state']!='committed' or not state['current_bundle'] or state['pending_changes'] or state['unaudited_changes'] or state['blocked_scopes']: raise SystemExit('Cycle not ready')
if 'OP-CLOSE-001' in state['operations']: raise SystemExit('Closure already exists')
bundle=state['current_bundle']
subject_hash=state['operations']['OP-ADOPT-001']['subject_hash']
for item in state['scope']:
    if not any(b['scope_id']==item and b['phase']=='implementation' and b['subject_hash']==subject_hash for b in state['audit_baselines']): raise SystemExit('Guarantee missing')
related=[{'operation_id':id,'state':state['operations'][id]['state'],'result':state['operations'][id]['result']} for id in ['OP-PLAN-001','OP-ADOPT-001']]
payload={'operation_id':'OP-CLOSE-001','kind':'cycle_closed','cycle_id':'C-001','experiment_id':'E-001','plan_revision':1,'outcome':'reflected','scope':state['scope'],'related_operations':related,'reflected_bundle':bundle,'closed_at':now(),'review_mode':'normal','recovery_ref':None,'delegation_ref':state['budget_accounts']['LOCAL-01']['delegation_ref']}
write_json('operations/OP-CLOSE-001-payload.json',payload)
folder=freeze(['operations/OP-CLOSE-001-payload.json'])
payload_ref=ref(folder,'operations/OP-CLOSE-001-payload.json','OP-CLOSE-001')
experiment={'experiment_id':'E-001','revision':2,'plan_revision':1,'cycle_id':'C-001','state':'reflected','plan_ref':snapshot.read_json(ROOT/'audits/subjects/PLAN-001.json')['plan_ref'],'trial_refs':[f'experiments/trials/TRIAL-{n}.md' for n in ['001','002','003']],'related_operations':related,'adoption_ref':'OP-ADOPT-001','reflected_bundle':bundle,'outbox':[{'message_id':'OP-CLOSE-001','state':'pending','payload_ref':payload_ref}],'human_evaluation':'unverified','project_complete':False}
body='''# ローカル技術的試行の終端
計画の独立監査後に実装し、TRIAL-001は環境option欠落を発見してneeds-fix。TRIAL-002は書出しの観測不足でneeds-fix。TRIAL-003は自動8件と実ブラウザ12項目を確認し、生成内容・JSONコピー経路で書出しを確認。全失敗履歴を保存。実装の独立監査で固定subjectを評価したうえで、ローカル試験版を採用した。
このcycleの終端は本番配備・4実環境・本人評価の完了ではない。アカウント接続後にSupabaseの実DB/RLS/RPC、Vercel HTTPS配備、各環境の送信を別の観測として検証する。ネイティブdownload完了、長期運用、他ブラウザは未確認。追加購入0、platform token費用unknown。
'''
write_md('experiments/E-001.md',experiment,body)
write_md('operations/OP-CLOSE-001.md',dict(payload,revision=1,state='requested',payload_hash=digest(payload)),'# cycle_closed\nローカル技術的試験の終端と次の未確認を記録担当へ通知。')
def receive(s):
    if s['current_bundle']!=bundle or s['pending_changes'] or s['unaudited_changes']: raise ValueError('State changed')
    s['operations']['OP-CLOSE-001']={'kind':'cycle_closed','payload_hash':digest(payload),'state':'committed','result':'acknowledged','scope':state['scope'],'bundle':bundle,'payload_ref':payload_ref}
    s['received_notifications']['OP-CLOSE-001']={'payload_hash':digest(payload),'cycle_id':'C-001','periodic_request_id':None,'periodic_status':'skipped','skip_reason':'no-unaudited-implementation-changes: CHANGE-001全scope/結合条件を同一subjectの独立adoption監査で保証し採用時に解消。採用後の製品変更なし。本番未確認を保証済みとしない。','ack':'acknowledged','acknowledged_at':now(),'policy':s['periodic_policy'],'next_due':None,'waiting_state':None}
    s['outbox'].append({'message_id':'OP-CLOSE-001','kind':'S-PROPOSAL','payload_ref':payload_ref,'target':'record','state':'acknowledged'})
    s['display'].update(cycle='ローカル試行サイクル完了',next='アカウント接続後にプロジェクト作成と本番確認を進める。4実環境と本人評価は未確認。')
    s['cycle_status']={'cycle_id':'C-001','state':'complete','closed_at':payload['closed_at'],'closure_id':'OP-CLOSE-001','periodic':'reasoned-skip','human_evaluation':'unverified','production_deployment':'unverified','source_environments':'unverified','project_complete':False}
update_state(receive)
experiment.update(revision=3,cycle_state='complete',periodic={'result':'skip','reason':'no-unaudited-implementation-changes','notification_ref':'OP-CLOSE-001'})
experiment['outbox'][0]['state']='acknowledged'
write_md('experiments/E-001.md',experiment,body+'\n通知受領・理由付きskip・ackをstateに確認。製品全体完了はfalse。')
meta,body=read_md('operations/OP-CLOSE-001.md')
write_md('operations/OP-CLOSE-001.md',dict(meta,revision=2,state='committed',result='acknowledged',result_ref='design/state.md#received_notifications/OP-CLOSE-001'),body+'\n記録役が通知受領と周期skipを同時保存しackした。')
settle('EXEC-RECORD-003','operations/OP-CLOSE-001.md')
print(json.dumps({'cycle':'complete','project_complete':False,'production':'unverified'},ensure_ascii=False))
