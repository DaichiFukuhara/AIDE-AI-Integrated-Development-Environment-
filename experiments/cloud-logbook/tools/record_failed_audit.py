"""Keep failed audit and hold adoption while allowing only its specified correction."""
from records import *
request=snapshot.read_json(ROOT/'audits/AR-ADOPT-001-request.json')
audit,_=read_md('audits/AUD-ADOPT-001.md')
for key in ['audit_request_id','origin_operation_id','scope','phase','subject_hash','criteria_version','change_ids']:
    if audit[key]!=request[key]: raise SystemExit('Audit identity mismatch')
if audit['result']!='require-review' or audit['finding_ids']!=['F-ADOPT-001']: raise SystemExit('Inspect actual finding before correcting')
paths=['audits/AUD-ADOPT-001.md','audits/subjects/ADOPT-001.json']
paths+=sorted(p.relative_to(ROOT).as_posix() for p in (ROOT/'evidence').glob('AUD-ADOPT-001-*') if p.is_file())
folder=freeze(paths)
result=ref(folder,'audits/AUD-ADOPT-001.md','AUD-ADOPT-001')
def receive(s):
    if s['current_bundle'] is not None or s['operations']['OP-ADOPT-001']['state']!='requested': raise ValueError('State changed')
    s['operations']['OP-ADOPT-001'].update(state='rejected',result='require-review',result_ref=result)
    r=s['execution_reservations']['EXEC-AUDIT-ADOPT-001']
    if r['state']!='reserved': raise ValueError('Reservation changed')
    for key,amount in r['limits'].items(): s['budget_accounts']['LOCAL-01']['limits'][key]['cumulative_used']+=amount
    r.update(state='settled',settled_at=now(),evidence_ref=result)
    for m in s['outbox']:
        if m['message_id']==request['audit_request_id']: m.update(state='acknowledged',result_ref=result)
    s['blocked_scopes'].append({'scope':s['scope'],'state':'active','finding_id':'F-ADOPT-001','audit_ref':result,'permitted_operations':['TRIAL-004','AR-ADOPT-002'],'release_condition':'独立再監査がAuth 500/429等の一時障害と真の認証拒否を区別し、cookie/前回表示保持と認証切れ消去の証拠を確認する。','correction_scope':'Supabase応答分類・対応するUIエラー表示・回帰検証。意味定義/評価/配備範囲は変更しない。'})
    s['display'].update(audit='重大指摘1件',adoption='採用保留',cycle='指摘修正中',next='F-ADOPT-001のAuthエラー分類を修正しTRIAL-004と独立再監査へ進む。')
update_state(receive)
meta,body=read_md('operations/OP-ADOPT-001.md')
write_md('operations/OP-ADOPT-001.md',dict(meta,revision=2,state='rejected',result='require-review',result_ref=result),body+'\n\n独立監査のF-ADOPT-001を受理。採用せず修正待ち。失敗対象と結果を保持する。')
print('Recorded require-review; current=null; correction limited to F-ADOPT-001.')
