"""Record independently audited local technical adoption with an atomic ledger update."""
from records import *
from precheck import check
request=snapshot.read_json(ROOT/'audits/AR-ADOPT-001-request.json')
audit,_=read_md('audits/AUD-ADOPT-001.md')
subject=snapshot.read_json(ROOT/request['subject_ref'])
payload=snapshot.read_json(ROOT/'operations/OP-ADOPT-001-payload.json')
for key in ['audit_request_id','origin_operation_id','scope','phase','subject_hash','criteria_version','change_ids']:
    if audit[key]!=request[key]: raise SystemExit('Audit identity mismatch: '+key)
if audit['result']!='audit-pass' or audit['independence']!='independent' or audit.get('open_major_count')!=0 or audit.get('open_blocker_count')!=0: raise SystemExit('Independent adoption did not pass')
if check(request['subject_ref'])['subject_hash']!=request['subject_hash']: raise SystemExit('Subject changed')
for item in subject['implementation_ref']['files']:
    if hashlib.sha256((ROOT/item['id']).read_bytes()).hexdigest()!=item['sha256']: raise SystemExit('Working source changed')
state,_=read_md('design/state.md')
revision=state['revision']
if state['current_bundle']!=payload['base_bundle'] or state['operations']['OP-ADOPT-001']['state']!='requested' or state['operations']['OP-ADOPT-001']['payload_hash']!=digest(payload) or state['tombstones'] or state['blocked_scopes'] or state['unaudited_changes']: raise SystemExit('Adoption state changed')
if {c['change_id'] for c in state['pending_changes']}!=set(request['change_ids']): raise SystemExit('Pending changes differ')
folder=freeze(['audits/AUD-ADOPT-001.md',request['subject_ref'],'audits/AR-ADOPT-001-request.json','operations/OP-ADOPT-001-payload.json','evidence/precheck-adoption-001.json'])
audit_ref=ref(folder,'audits/AUD-ADOPT-001.md','AUD-ADOPT-001')
subject_ref=ref(folder,request['subject_ref'],'SUBJECT-ADOPT-001')
bundle={k:subject[k] for k in ['spec_refs','contract_refs','model_definition_refs','implementation_ref','trial_refs','evidence_refs','unverified']}
bundle.update(id='BUNDLE-001',subject_hash=request['subject_hash'],subject_ref=subject_ref,audit_ref=audit_ref,adoption_scope='local-technical-trial-only')
write_json('design/candidates/OP-ADOPT-001/bundle.json',bundle)
folder=freeze(['design/candidates/OP-ADOPT-001/bundle.json'])
bundle_ref=ref(folder,'design/candidates/OP-ADOPT-001/bundle.json','BUNDLE-001')
def commit(s):
    if s['revision']!=revision or s['current_bundle'] is not None or s['tombstones']: raise ValueError('CAS failed')
    s['current_bundle']=bundle_ref
    s['operations']['OP-ADOPT-001'].update(state='committed',result='applied',bundle=bundle_ref,result_ref=audit_ref,committed_at=now())
    for scope_id in request['scope']:
        s['audit_baselines'].append({'scope_id':scope_id,'phase':'implementation','criteria_version':1,'scope':request['scope'],'subject_hash':request['subject_hash'],'subject_ref':subject_ref,'audit_request_id':request['audit_request_id'],'result_ref':audit_ref,'accepted_at':now()})
    s.setdefault('resolved_changes',[]).extend(dict(c,resolution='audited-on-adoption',result_ref=audit_ref,adopted_bundle=bundle_ref,resolved_at=now()) for c in s['pending_changes'])
    s['pending_changes']=[]
    for message in s['outbox']:
        if message['message_id']==request['audit_request_id']: message.update(state='acknowledged',result_ref=audit_ref)
    reservation=s['execution_reservations']['EXEC-AUDIT-ADOPT-001']
    if reservation['state']!='reserved': raise ValueError('Reservation changed')
    for key,amount in reservation['limits'].items(): s['budget_accounts']['LOCAL-01']['limits'][key]['cumulative_used']+=amount
    reservation.update(state='settled',settled_at=now(),evidence_ref=audit_ref)
    s['display'].update(audit='実装の独立監査合格',adoption='ローカル技術的試験採用',cycle='ローカル試行の終了処理',next='本番接続、4実環境送信、本人評価を未確認として次へ引き継ぐ。')
update_state(commit)
meta,body=read_md('operations/OP-ADOPT-001.md')
write_md('operations/OP-ADOPT-001.md',dict(meta,revision=2,state='committed',result_ref=audit_ref,reflected_bundle=bundle_ref,outcome='applied'),body+'\n\n固定subjectの独立監査を受理し、current・基準・差分解消・監査枠精算を一括保存。ローカル技術試験のみの採用。')
print(json.dumps({'result':'applied','bundle':bundle_ref,'unverified':bundle['unverified']},ensure_ascii=False))
