"""Learning proposal; record reserves an independent adoption review."""
from records import *
from precheck import check
state,_=read_md('design/state.md')
if state['current_bundle'] is not None or state['blocked_scopes'] or state['operations']['OP-PLAN-001']['state']!='checked': raise SystemExit('Precondition changed')
plan=snapshot.read_json(ROOT/'audits/subjects/PLAN-001.json')
implementation=snapshot.read_json(ROOT/'experiments/implementation-003.json')
for item in implementation['files']:
    if hashlib.sha256((ROOT/item['id']).read_bytes()).hexdigest()!=item['sha256']: raise SystemExit('Source changed')
trial,_=read_md('experiments/trials/TRIAL-003.md')
if trial['result']!='pass': raise SystemExit('Trial not passed')
write_md('evidence/harness-observations.md',{'id':'OBS-HARNESS-001','revision':1,'recorded_at':now()},'''# クラウド化の試行で観測したこと
初回計画を固定し独立監査合格後に実装した。TRIAL-001でNode子プロセスのsandbox制約を観測し、同じ固定実装で権限付き再実行し自動8件に合格。実画面でcodex-localのoption開始タグ欠落を発見したため試行はneeds-fix。
TRIAL-002で選択肢と検索は成功したが、ブラウザのダウンロード通知が取得できず出力内容も見えなかった。成功を推定せず未確認で保存し、プレビューとコピー可能な出力を追加。
TRIAL-003で自動8件、ブラウザ12項目を確認した。JSON/Markdown生成とキーボードのJSONコピーを実証。ネイティブファイル保存通知は未確認のまま。スマホ/desktopはwindow.innerWidthとclientWidthを区別して横スクロールを確認し、実測のscrollbar幅は15pxだった。
通信断を作るためこのタスクの検証サーバーだけを停止した。旧表示とエラー、logout消去を確認。再起動でメモリstubの保存とセッションが消えたため、画面から出力した実ログ4件をID/time/contentを変えずCLI送信経路で復元した。これはクラウドDBの永続化実験ではない。
sourceの4値はローカルの境界stub試験で確認。実際の4環境からの送信ではない。ユーザーはVercel/Supabaseのアカウントあり・プロジェクトなし。CLIは未ログイン。本番配備を作ったとは主張しない。購入0、プラットフォーム費用unknown。
初回監査・実装初期のログはCLI完成後の事後記録である。正式状態をログのoutcomeから更新しない。本人評価、実DB/HTTPS配備、4環境からの通信の課題を次へ引き継ぐ。
''')
paths=[f'experiments/trials/TRIAL-{n}.md' for n in ['001','002','003']]+['evidence/harness-observations.md','audits/AUD-PLAN-001.md','operations/OP-PLAN-001.md']
folder=freeze(paths)
subject=dict(plan,phase='implementation',implementation_ref=implementation,trial_refs=[ref(folder,p,'TRIAL-'+n) for p,n in zip(paths,['001','002','003'])],evidence_refs=trial['evidence_refs']+[ref(folder,p) for p in paths[3:]],unverified=['DEPLOY-01: Supabase実DB/RLS/RPCとVercel HTTPS配備はアカウント接続待ち。','SOURCES-01: 4実環境送信は未確認。4source値のローカル試験と区別する。','HUMAN-01: 本人評価は未確認。','ネイティブdownload完了はアプリ内ブラウザで未確認。生成JSON/MarkdownとJSONコピーを実確認。','長期運用・他ブラウザ・クラウドキューの永続化は未確認。'])
write_json('audits/subjects/ADOPT-001.json',subject)
precheck=check('audits/subjects/ADOPT-001.json')
write_json('evidence/precheck-adoption-001.json',precheck)
change={'change_id':'CHANGE-001','affected_scope':state['scope'],'phase':'implementation','baseline_refs':{i:'initial' for i in state['scope']},'first_changed_at':now(),'operation_id':'OP-ADOPT-001','old_version':None,'new_version':implementation,'joint_condition':'CLI→API→保存adapter→所有者認証読取→画面を同じsubjectで確認。SQLの安全性は独立レビュー、実DBは未確認。','reason':'固定計画のローカル技術的試験採用。配備採用ではない。'}
write_json('design/candidates/OP-ADOPT-001/change.json',change)
payload={'operation_id':'OP-ADOPT-001','kind':'adoption','experiment_id':'E-001','plan_revision':1,'cycle_id':'C-001','scope':state['scope'],'base_bundle':None,'phase':'implementation','criteria_version':1,'subject_ref':'audits/subjects/ADOPT-001.json','subject_hash':digest(subject),'delegation_ref':plan['delegation_ref'],'change_ids':['CHANGE-001'],'baseline_refs':change['baseline_refs'],'review_mode':'normal','recovery_ref':None}
write_json('operations/OP-ADOPT-001-payload.json',payload)
write_md('operations/OP-ADOPT-001.md',dict(payload,revision=1,state='requested',payload_hash=digest(payload),base_revision=state['revision'],result_ref=None),'# ローカル技術的試験採用の提案\nTRIAL-001/002の失敗・未確認を残し、TRIAL-003の観測で提案。currentは独立監査受理までnull。本番配備と4実環境、本人評価は未確認。')
update_state(lambda s:(s['operations'].update({'OP-ADOPT-001':{'payload_hash':digest(payload),'kind':'adoption','subject_hash':digest(subject),'scope':state['scope'],'state':'requested','result':None,'bundle':None,'audit_request_id':'AR-ADOPT-001'}}),s['pending_changes'].append(change),s['display'].update(audit='実装の独立監査待ち',adoption='ローカル試験採用候補',next='固定実装・試行・SQL境界を独立監査する。本番は未確認。')))
settle('EXEC-RECORD-002','audits/subjects/ADOPT-001.json')
reserve('EXEC-RECORD-003','record','ADOPTION-CLOSURE-001')
reserve('EXEC-AUDIT-ADOPT-001','audit','AR-ADOPT-001')
request={'audit_request_id':'AR-ADOPT-001','origin_operation_id':'OP-ADOPT-001','kind':'adoption','scope':state['scope'],'phase':'implementation','criteria_version':1,'subject_ref':payload['subject_ref'],'subject_hash':digest(subject),'baseline_refs':change['baseline_refs'],'cumulative_diff_ref':{'from':'initial','to':implementation,'change_ids':['CHANGE-001']},'change_ids':['CHANGE-001'],'execution_id':'EXEC-AUDIT-ADOPT-001','budget_account_refs':['LOCAL-01'],'budget_check_ref':'design/state.md#EXEC-AUDIT-ADOPT-001','delegation_ref':plan['delegation_ref'],'review_mode':'normal','recovery_ref':None,'previous_audit_ref':None,'previous_subject_ref':None,'open_finding_ids':[],'observed_at':now()}
write_json('audits/AR-ADOPT-001-request.json',request)
update_state(lambda s:s['outbox'].append({'message_id':'AR-ADOPT-001','kind':'S-AUDIT-INPUT','payload_ref':'audits/AR-ADOPT-001-request.json','target':'/root/harness_auditor','state':'in-flight','execution_id':request['execution_id'],'account_refs':['LOCAL-01']}))
print(json.dumps({'subject_hash':digest(subject),'precheck':precheck},ensure_ascii=False))
