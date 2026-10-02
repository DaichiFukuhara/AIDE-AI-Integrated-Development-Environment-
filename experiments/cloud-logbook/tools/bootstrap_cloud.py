"""Fix the cloud experiment plan before implementing the product."""
from records import *
from precheck import check

assert not (ROOT / 'design/state.md').exists(), 'Do not replace history'
scope = sorted(['CTX-LOG', 'SYS-LOG', 'SIT-01', 'FIT-01'])
write_md('operations/delegation.md', {'id':'DELEGATION-01','revision':1,'semantic_revision':1}, '''# 今回の依頼と委任
利用者はCodex/Claudeのローカルとクラウドの4環境を対象に、Vercel画面・受付APIとSupabase保存の方針を選び「この方針でやってみるか。APIの呼び出しはローカルからできるの？」と依頼した。両サービスのアカウントはあるがプロジェクトは未作成。
既存のハーネス実験の次の枝として、この別プロジェクトで設計・独立計画監査・実装・検証・採否を進める。監査の別担当はharness-v3/roles/audit.mdに従う。既存ローカル実験の固定版は編集しない。
委任はHTML/CSS/JS画面、Vercel API、Supabase SQL、共通CLI、ローカルテスト、設定・デプロイ準備。課金契約・有料プラン開始は委任外。ユーザー所有アカウントへの本番接続は設定可能な認証を確認してから行う。利用者に秘密値をチャットへ貼らせない。公開のログ閲覧は行わずログイン必須。現時点の認証なしに本番反映済みとは主張しない。
''')
limits = {'external_spend':{'unit':'JPY-new-external-purchases','limit':0,'activities':['trial','audit','record']},'trials':{'unit':'verification-round','limit':6,'activities':['trial']},'audits':{'unit':'independent-review-execution','limit':6,'activities':['audit']},'record_batches':{'unit':'administrative-batch','limit':80,'activities':['record']}}
write_md('experiments/budget-definition.md', {'id':'BUDGET-01','revision':1,'semantic_revision':1,'owner':'learning','scope':scope,'limits':limits,'delegation_ref':'operations/delegation.md'}, '''# 実行枠
内部上限は試行6、独立監査6、記録80バッチ。新たな外部購入0円。既存セッションのトークン費用はunknownで0円としない。本番リソースの課金条件が未確認なら本番実行を保留し、ローカル実装と検証を進める。予約・累計・未決分を毎回照合し、修正後は別trialへ保存する。
''')
definition = '''# 共通ログの定義と責任
domainは作業記録、contextはCTX-LOGのみ。SYS-LOGが送信・受信・保存・閲覧の整合を所有する。VercelとSupabaseは配備境界であり異なる意味のcontextではない。内部のCLI/API/DB/Auth/UI境界をSYS-LOGが所有し製品context間seamは理由付きN/A。
イベント={id,time,source,project,run,actor,phase,kind,title,body,reason,evidence:[],next,outcome}。sourceはcodex-local/claude-local/codex-cloud/claude-cloud。phaseはintake/design/plan/implementation/verification/audit/adoption/closure、kindはaction/decision/check/issue、outcomeはrecorded/pass/fail/unverified。時刻はoffset付きISO8601でUTC正規化。id/project/runは制限付き識別子。説明は短い判断理由で内部思考全文を要求しない。根拠はHTTPS URLまたはプロジェクト相対パス。パスは表示するだけでクラウドからローカルの根拠ファイルを読めるとは主張しない。
ログ成功は監査や採用の保証ではない。本製品は観測だけを保存し正式状態の書込みはしない。訂正・解決は新IDで追記。所有者+イベントIDの意味入力が同一なら再送成功・増加なし、異内容なら409。複数送信の競合はDBの一意制約と1transactionのRPCで防ぐ。received sequenceはDB側で採番し、ブラウザの継続ページ取得はこの安定した順序に基づく。
書込APIは環境変数の送信者設定に持つsha256トークンhashを照合し、owner UUIDと許可project/source/run（指定時）へ限定。閲覧者cookieとは別資格。送信者は読取APIやDB秘密鍵を持たない。DBのRLSは所有者の読取だけを許しanonの読取・Authユーザーの書込は拒否。挿入RPCはservice_roleのみ。API秘密鍵はサーバー環境変数だけに置く。閲覧ログインはSupabase Authを検証し、HttpOnly/SameSite cookieで管理。ローカル動作時のみloopback HTTPを許容し、本番cookieはSecure。ログイン等のブラウザ変更要求は同一originを検査。
CLIは常にローカルのイベントファイルへ先に保存し、HTTPSへ送信。送信に成功するまで未送信を保持。同じID/time/contentを再送し、409/401などを成功や破棄へ置換しない。トークンをログ・キュー・コマンド出力へ記録しない。ローカルキューは1ファイル/イベント＋排他ロック。通信失敗・途中終了で送信が重複してもDBで冪等化。ユーザーが指定したendpointを使い、不正URL・HTTP非loopback・redirectへの資格流出を拒否。
画面はログイン・プロジェクト/実行環境/作業の絞込・検索・詳細・ページ継続取得・取得済みJSON/Markdown書出し。エラー時に前回表示を維持し古い表示であることを明示。空・未接続・失敗を区別する。HTMLはtextContent等で挿入、URLを検査。初期デモは実ログと明確に区別し本番へ勝手に送らない。
'''
write_md('design/domains/log/design.md', {'id':'DEF-LOG-01','revision':1,'semantic_revision':1,'primary_parent':None,'parent_semantic_revision':None,'domain_id':'D-LOG','context_id':'CTX-LOG','canonical_owner':'SYS-LOG','dependencies':[],'consumers':['G-LOG','SG-TRACE','AP-FILE','SYS-LOG','E-001']},definition)
write_md('design/domains/log/rationale.md', {'id':'DEF-LOG-01','revision':1,'semantic_revision':1,'primary_parent':None,'parent_semantic_revision':None}, '# 定義の理由\n4環境から同じ意味で記録し、再送と並行保存をDBで揃える。送信者と閲覧者の権限を分け、認証もUI非表示だけに頼らない。作業の操作履歴の自動収集は今回含まない。')
nodes=[('design/master.md','design/rationale.md','G-LOG','root_goal',None,'SG-TRACE','FIT-01','4環境のログを一つの見やすい画面で読み、次の作業へ進める'),('design/goals/trace/design.md','design/goals/trace/rationale.md','SG-TRACE','subgoal','G-LOG','AP-FILE','SIT-01','ローカル保存から認証付きAPI・永続保存・閲覧まで版と結果を追う'),('design/goals/trace/approaches/file/design.md','design/goals/trace/approaches/file/rationale.md','AP-FILE','approach','SG-TRACE','SYS-LOG','AP-01','ローカル耐久キューとHTTPS APIを用い、Vercel/Supabaseへ配備する'),('design/domains/log/systems/console/design.md','design/domains/log/systems/console/rationale.md','SYS-LOG','system','AP-FILE',None,'UT-01','認証・検証・冪等挿入・読取・再送・HTML表示を整合させる')]
paths=[]
for path,rationale,id,kind,parent,child,criterion,meaning in nodes:
    meta={'id':id,'kind':kind,'revision':1,'semantic_revision':1,'status':'ready','primary_parent':parent,'parent_semantic_revision':1 if parent else None,'domain_id':'D-LOG','context_id':'CTX-LOG','source_refs':['DELEGATION-01'],'children':[] if child is None else [{'id':child,'relation':'all_of','group':None,'selected':True,'responsibility':criterion,'expected_outcome':meaning,'acceptance':'固定評価表に対応する入出力を確認','constraints':'追加購入0、本人評価・本番4環境は確認結果まで未確認'}],'uses_systems':[],'model_definition_refs':['DEF-LOG-01'],'owned_seams':[],'seam_refs':[],'dependencies':[],'unit_test_id':'UT-01' if kind=='system' else None,'subgoal_integration_id':'SIT-01' if kind=='subgoal' else None,'final_integration_id':'FIT-01' if kind=='root_goal' else None}
    write_md(path,meta,f'# {meaning}\n\n{definition}\n\n受入: {criterion}をexperiments/E-001-plan.mdの固定条件で確認する。親条件を子へ割り当て、systemの個別確認と親の結合確認を区別する。本人評価は未確認。')
    write_md(rationale,{k:meta[k] for k in ['id','revision','semantic_revision','primary_parent','parent_semantic_revision']}, '# 選択理由\n前回のローカルHTMLは見やすいとの利用者意向を受け、HTMLの表示を継承する。クラウド実行とローカル端末のファイルは共有されないためHTTPSへ送信する。再デプロイごとにログを埋め込む案は作業中更新に弱い。常時接続より節目のHTTP送信＋再送キューで初期運用を小さくする。Vercel API＋Supabase DBを利用者が選んだ。未確認の4環境到達性・本番設定は実測後にのみ成功とする。')
    paths.extend([path,rationale])
write_md('experiments/E-001-plan.md', {'experiment_id':'E-001','revision':1,'plan_revision':1,'cycle_id':'C-001','previous_cycle_ref':'../harness-logbook/experiments/E-001.md','state':'planned','goal_refs':['G-LOG','SG-TRACE'],'system_refs':['SYS-LOG'],'domain_context_refs':['D-LOG','CTX-LOG'],'model_definition_refs':['DEF-LOG-01'],'baseline_bundle':None,'delegation_ref':'operations/delegation.md','budget_account_refs':['LOCAL-01'],'budget':'experiments/budget-definition.md'}, '''# クラウドとローカルで共通の記録を送れるか
最小出力はVercel用API・HTML/CSS/JS画面、Supabase SQL、Python標準CLI、設定例、4環境向けリポジトリ内の記録手順。実装と配備検証を別段階にする。新しい保存場所はexperiments/cloud-logbook、旧実験は変更しない。
| ID | 固定確認 | 必須 |
|---|---|---|
| UT-01 | 形式/URL/入力サイズ検証、トークン不一致・scope不一致拒否、閲覧セッション・所有者分離、同ID同内容再送と異内容409、CLI保存不変・lock・redirect/失敗後保持、秘密値非出力 | ローカル技術的試験採用に必須 |
| SIT-01 | 実CLI→実ローカルHTTP API→保存adapter→認証読取の対応、四source、検索・継続ページ、同時/再送、DB SQLの一意制約/RLS/RPC権限を独立確認。Supabase実接続前は境界stubで明示 | ローカル技術的試験採用に必須 |
| FIT-01 | 実ブラウザでログイン・実CLIログ表示・絞込・検索・詳細・書出し・通信失敗時旧表示・390px/desktop表示、ログアウトでログ消去 | ローカル技術的試験採用に必須 |
| DEPLOY-01 | 新規SupabaseにSQL適用・正当/不正資格とRLS/競合を実確認、Vercel配備とHTTPS送信・閲覧を実確認、秘密値なし | 本番利用に必須。資格/アカウント接続待ちなら未確認としてローカル試験採用を許容 |
| SOURCES-01 | Codex/Claudeのローカルとクラウドそれぞれから実HTTPS送信 | 4環境対応の実証に必須。source欄に4値を付けたローカル試験だけで4環境動作済みとしない |
| HUMAN-01 | 利用者の実際の見やすさ・再開評価 | 未確認を明示。本人評価まで全体完成としない |
初回計画checked前に製品実装しない。毎回固定実装・定義・委任・予算を照合し試行/audit予約。修正後は別trial。品質/定義/評価変更は新計画へ戻る。合格は独立adoption監査open major/blocker 0と同じ版の必須証拠。current切替はrecordのみ。
採否の終端・cycle_closed通知とack/理由付きperiodic判定を保存。資格待ちを完了済み配備としない。本番配備・4環境・本人評価の未確認を次の操作へ引き継ぐ。課金条件不明なら本番実行を保留する。
''')
paths += ['design/domains/log/design.md','design/domains/log/rationale.md','operations/delegation.md','experiments/budget-definition.md','experiments/E-001-plan.md']
folder=freeze(paths)
subject={'scope':scope,'phase':'plan','spec_refs':[ref(folder,p,id,1) for p,_,id,*_ in nodes]+[ref(folder,r,id+'-rationale',1) for _,r,id,*_ in nodes],'contract_refs':[],'contracts_not_applicable_reason':'Single product context CTX-LOG; CLI/API/Auth/DB/UI are internal boundaries owned by SYS-LOG.','model_definition_refs':[ref(folder,'design/domains/log/'+name+'.md',id,1,domain_id='D-LOG',context_id='CTX-LOG',canonical_owner='SYS-LOG',dependencies=[]) for name,id in [('design','DEF-LOG-01'),('rationale','DEF-LOG-01-rationale')]],'model_definitions_not_applicable_reason':None,'plan_ref':ref(folder,'experiments/E-001-plan.md','E-001',1),'plan_revision':1,'evaluation_ref':ref(folder,'experiments/E-001-plan.md','EVAL-001',1),'implementation_ref':None,'trial_refs':[],'evidence_refs':[],'delegation_ref':ref(folder,'operations/delegation.md','DELEGATION-01',1),'budget_definition_ref':ref(folder,'experiments/budget-definition.md','BUDGET-01',1),'recovery_ref':None,'unverified':['Implementation/UT/SIT/FIT not executed; plan phase','Production deployment, four real source environments and human evaluation need separate evidence']}
write_json('audits/subjects/PLAN-001.json',subject)
payload={'operation_id':'OP-PLAN-001','kind':'plan','experiment_id':'E-001','plan_revision':1,'cycle_id':'C-001','scope':scope,'base_bundle':None,'phase':'plan','criteria_version':1,'subject_ref':'audits/subjects/PLAN-001.json','subject_hash':digest(subject),'delegation_ref':subject['delegation_ref'],'change_ids':[],'review_mode':'normal','recovery_ref':None}
write_json('operations/OP-PLAN-001-payload.json',payload)
write_md('operations/OP-PLAN-001.md',dict(payload,revision=1,state='requested',payload_hash=digest(payload),audit_request_id='AR-PLAN-001',result_ref=None),'# 初回計画監査依頼\n未実装。ローカル採用と本番/四環境/本人の未確認条件を固定する。')
state={'project_id':'CLOUD-LOGBOOK','revision':1,'timezone':'Asia/Tokyo','scope':scope,'periodic_policy':{'revision':1,'cycle_closed_enabled':True,'after_days':7,'timezone':'Asia/Tokyo','source_ref':'harness-v3/protocols/messages.md'},'writer':'/root','current_bundle':None,'audit_baselines':[],'unaudited_changes':[],'operations':{'OP-PLAN-001':{'payload_hash':digest(payload),'kind':'plan','subject_hash':digest(subject),'scope':scope,'state':'requested','result':None,'bundle':None,'audit_request_id':'AR-PLAN-001'}},'tombstones':{},'outbox':[],'received_notifications':{},'pending_changes':[],'blocked_scopes':[],'budget_accounts':{'LOCAL-01':{'owner':'learning','definition_ref':subject['budget_definition_ref'],'delegation_ref':subject['delegation_ref'],'scope':scope,'activities':['trial','audit','record'],'parent_account_refs':[],'limits':{k:dict(v,cumulative_used=0) for k,v in limits.items()}}},'execution_reservations':{},'recovery_records':{},'observed_at':now(),'display':{'plan':'監査待ち','trial':'未実行','audit':'未実施','adoption':'未採用','cycle':'計画中','human_evaluation':'未確認','next':'独立計画監査を受理して実装する。'}}
write_md('design/state.md',state,'# 記録役の正本\n製品ログから監査・採用を推測しない。')
reserve('EXEC-RECORD-001','record','PLAN-001')
write_json('evidence/precheck-plan-001.json',check(payload['subject_ref']))
reserve('EXEC-AUDIT-PLAN-001','audit','AR-PLAN-001')
request={'audit_request_id':'AR-PLAN-001','origin_operation_id':'OP-PLAN-001','kind':'plan','scope':scope,'phase':'plan','criteria_version':1,'subject_ref':payload['subject_ref'],'subject_hash':digest(subject),'baseline_refs':{i:'initial' for i in scope},'cumulative_diff_ref':'initial','change_ids':[],'execution_id':'EXEC-AUDIT-PLAN-001','budget_account_refs':['LOCAL-01'],'budget_check_ref':'design/state.md#EXEC-AUDIT-PLAN-001','delegation_ref':subject['delegation_ref'],'review_mode':'normal','recovery_ref':None,'previous_audit_ref':None,'previous_subject_ref':None,'open_finding_ids':[],'observed_at':now()}
write_json('audits/AR-PLAN-001-request.json',request)
update_state(lambda s:s['outbox'].append({'message_id':'AR-PLAN-001','kind':'S-AUDIT-INPUT','payload_ref':'audits/AR-PLAN-001-request.json','target':'/root/harness_auditor','state':'in-flight','execution_id':request['execution_id'],'account_refs':['LOCAL-01']}))
print(json.dumps({'subject_hash':digest(subject),'snapshot':folder},ensure_ascii=False))
