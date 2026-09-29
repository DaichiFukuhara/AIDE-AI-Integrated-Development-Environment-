"""Create the first plan's records, before product implementation begins."""
from records import *

if (ROOT / 'design/state.md').exists():
    raise SystemExit('Already initialized; do not overwrite history')

scope = sorted(['FIT-01', 'SIT-01', 'SYS-LOG', 'CTX-LOG'])
write_md('operations/delegation.md', {'id': 'DELEGATION-01', 'revision': 1, 'semantic_revision': 1, 'recorded_at': now()}, '''
# 許可と解釈

利用者の指示: 「新しいハーネスの実験としてAIがログをとるための画面を作りたい。HTML/CSSとJSでログ画面を作って。内容もどういう風にするか考えて」。続く訂正: 「ハーネス自体の実験として作ってほしいね というわけでやり直し」。

この指示を、harness-v3 の intake → design → record/precheck → 独立audit → experiment → adoption → cycle_closed の実使用として実行する。独立担当の使用は利用者が指定したハーネスの roles/audit.md「正式な初回・境界変更・周期監査は起草者と別の担当が既定」による。実装・記録はroot、監査は別エージェントとし、監査者に実装やstateの編集を委任しない。

対象は experiments/harness-logbook 内のローカル実装と記録。既存 experiments/log-console は比較用に保存。外部公開・有料サービス契約・課金API・既存ファイルの破壊は対象外。言語内部選択・ローカルサーバー・テスト・可逆な修正は委任内。

HTML/CSS/JS画面を、標準ライブラリだけのPythonローカルサーバーで配信する。AIはローカルCLIからイベントを追記し、ブラウザが読み取る。ハーネスの意味判断をコードが自動代行するエンジンは作らない。

本人の操作評価・理解は未確認。前回試作は手順を適用しなかった比較対象であり、今回の試行・監査証拠へ昇格させない。
''')
limits = {
    'external_spend': {'unit': 'JPY-new-external-purchases', 'limit': 0, 'activities': ['trial', 'audit', 'record']},
    'trials': {'unit': 'verification-round', 'limit': 6, 'activities': ['trial']},
    'audits': {'unit': 'independent-review-execution', 'limit': 6, 'activities': ['audit']},
    'record_batches': {'unit': 'administrative-batch', 'limit': 80, 'activities': ['record']},
}
write_md('experiments/budget-definition.md', {'id': 'BUDGET-01', 'revision': 1, 'semantic_revision': 1, 'owner': 'learning', 'limits': limits, 'scope': scope, 'delegation_ref': 'operations/delegation.md'}, '''
# 今回の実行枠

利用者が許可したローカルの作り直しを完結するため、担当が内部の実行枠として試行6回、独立監査6回、記録80バッチ以内に絞る。ユーザーが指定した金銭・時間の上限ではなく、勝手に広げない実行上の停止条件。追加の外部購入は0円。新規API・クラウド・パッケージの課金を使わないことを毎回照合する。

既存のCodexセッションのトークン数・契約上の費用は実測不能（unknown）。0円消費や無制限予算とは主張しない。ここで0とするのは新たな外部購入額のみ。上限は試行ラウンド・監査の物理実行・記録バッチをそれぞれ数え、同じ証拠の保存・照会を二重計上しない。試行は同一の固定実装に対するUT/SIT/FITの一組を一回とする。コード修正後の再実行は新試行。記録バッチは次の一工程の意味入力/結果を保存するまとまり。

数値枠に到達したら追加実行せず、証拠と未確認事項を保存して停止する。既存の許可で足りる間は再承認を求めない。
''')

nodes = [
    ('design/master.md', 'design/rationale.md', 'G-LOG', 'root_goal', None, 'AIの作業を記録から再開できる', '利用者が、実際に何が起き、どこまで確認でき、次に何をするかを画面と根拠から把握する。', 'SG-TRACE', 'FIT-01', '実ログをCLIで追記→画面で確認→根拠を開く→再読後も保持。人の使いやすさ評価は未確認と表示する。'),
    ('design/goals/trace/design.md', 'design/goals/trace/rationale.md', 'SG-TRACE', 'subgoal', 'G-LOG', '観測と保証状態を混同せずたどれる', 'イベントの事実・判断理由・根拠を読み、計画合格/実装検証/採用の違いを確認できる。', 'AP-FILE', 'SIT-01', 'CLI→JSON保存→HTTP読取→画面という境界と、stateが示す保証状態を照合する。'),
    ('design/goals/trace/approaches/file/design.md', 'design/goals/trace/approaches/file/rationale.md', 'AP-FILE', 'approach', 'SG-TRACE', 'ファイルを正本にした記録と閲覧', 'ブラウザ保存に依存せず、AIが追記したファイルをHTML/CSS/JSで読む。観測ログから監査や採用を推測しない。', 'SYS-LOG', 'AP-01', '読取専用ローカルHTTPと単一書込CLIを選ぶ。外部DB・双方向編集は不要。'),
    ('design/domains/log/systems/console/design.md', 'design/domains/log/systems/console/rationale.md', 'SYS-LOG', 'system', 'AP-FILE', '記録ファイルとログ画面を接続する', '記録contextの一つのsystemとしてCLI、保存、読取、画面を実装する。役割や配信プロセスでcontextを増やさない。', None, 'UT-01', '入力検証・再送同一性・中断時の保存・不正参照拒否・表示エスケープを検証する。'),
]
spec_paths = []
for path, rationale, identifier, kind, parent, title, meaning, child, criterion, acceptance in nodes:
    meta = {'id': identifier, 'kind': kind, 'revision': 1, 'semantic_revision': 1, 'status': 'ready', 'primary_parent': parent, 'parent_semantic_revision': 1 if parent else None, 'domain_id': 'D-LOG', 'context_id': 'CTX-LOG', 'source_refs': ['DELEGATION-01'], 'children': [] if not child else [{'id': child, 'relation': 'all_of', 'group': None, 'selected': True, 'responsibility': criterion, 'expected_outcome': meaning, 'acceptance': acceptance, 'constraints': 'ローカルのみ; 人の評価未確認'}], 'uses_systems': [], 'model_definition_refs': ['DEF-LOG-01'], 'owned_seams': [], 'seam_refs': [], 'dependencies': [], 'unit_test_id': 'UT-01' if kind == 'system' else None, 'subgoal_integration_id': 'SIT-01' if kind == 'subgoal' else None, 'final_integration_id': 'FIT-01' if kind == 'root_goal' else None}
    write_md(path, meta, f'''# {title}

## 意味と理由
{meaning}

## 操作と結果
正常例: AIが実行結果をID付きで保存すると画面のタイムラインに現れ、既存の証拠ファイルを開ける。
例外: 同ID・同内容の再送は既存記録を返す。同ID・異内容、壊れた保存物、範囲外/存在しない証拠は拒否し、既存ログを維持する。通信失敗時は前回データと「更新できない」を併記し、空や成功へ置換しない。

## 守ること・できないこと
ハーネスのstateだけがcurrent/監査/サイクル状態の正本。イベントは観測記録で、イベントの成功や監査風の文言から採用状態を変更しない。UIはログ・stateとも読取専用。単一ローカル書込担当を前提とする。多人同時編集、認証、公開、AI推論や正式監査の自動実行は対象外。

## 決定済みと未決
検索、工程絞り込み、詳細（理由・根拠・次の操作）、再読、JSON/Markdownのコピーを実装する。色・余白・ファイル名など内部選択は実装担当へ委任。長期運用/ブラウザ互換/本人の使いやすさ評価は未確認。

## 親条件と子への割当
{criterion}: {acceptance}
{'子 ' + child + ' がこの条件の必要な実装を担当する。親が境界を跨ぐ確認を所有する。' if child else '子なし。UT-01を所有し、SIT-01とFIT-01へ入出力の証拠を渡す。'}

## 受入条件と検証
| 条件 | 成立状態 | 確認 |
| --- | --- | --- |
| {criterion} | {acceptance} | experiments/E-001-plan.md の固定条件 |

利用者の理解: 未確認。今回の自動確認とAIによる実使用を、本人評価へ読み替えない。
''')
    write_md(rationale, {k: meta[k] for k in ['id', 'revision', 'semantic_revision', 'primary_parent', 'parent_semantic_revision']}, f'''# {title}の根拠

前回は架空セッションをブラウザに保存する画面を作ったが、利用者が求めたハーネス実使用を行っていなかった（DELEGATION-01）。今回は手順を先に回し、実際に生成した記録を入力にする。

ファイル保存を選ぶ理由はAIがシェルから追記でき、監査入力や証拠と同じ作業場所で追跡できるため。ブラウザlocalStorageだけの案は外部AIの記録との接続が弱い。DB/API書込みサービスの案は最初の仮説に不要な運用を増やすため採用しない。

単一のローカル記録者を仮定する。並行書込みや外部利用が必要になった時点で契約を再検討する。初期の設計根拠であり、試行結果はまだ存在しない。
''')
    spec_paths += [path, rationale]

write_md('design/domains/log/design.md', {'id': 'DEF-LOG-01', 'revision': 1, 'semantic_revision': 1, 'primary_parent': None, 'parent_semantic_revision': None, 'domain_id': 'D-LOG', 'context_id': 'CTX-LOG', 'canonical_owner': 'SYS-LOG', 'dependencies': [], 'consumers': ['G-LOG', 'SG-TRACE', 'AP-FILE', 'SYS-LOG', 'E-001']}, '''
# 記録を読むための共通の意味

この製品のdomainは作業記録、contextはログの記録と閲覧。SYS-LOGがイベント保存と表示の整合を所有する。ハーネスの学習・記録・監査contextは開発手順であり、この製品の別サービスとはしない。製品内のcontext間seamはないためcontract_refs=[]はN/A。CLI・HTTP・UIは同context内の境界として以下を全てSYS-LOGが所有する。

イベント = {id, time, actor, phase, kind, title, body, reason, evidence:[project-relative path], next, outcome}。phaseはintake/design/plan/implementation/verification/audit/adoption/closure。kindはaction/decision/check/issue。outcomeはrecorded/pass/fail/unverified。時刻はUTCオフセット付きISO8601。表示はローカル時刻と日付。理由は説明用の短い根拠であり内部思考全文を記録しない。

記録者がIDを指定。同IDの再送は、time未指定なら保存済みtimeを使い、それ以外の全意味入力を比べる。完全同一ならunchanged、異なるならconflict。編集/削除/解決の上書きは提供せず、訂正や解決は新IDで元IDを本文から参照する。意味入力や証拠の改変を検出する監査snapshotとは別の観測記録であり、ログだけで監査を保証しない。

CLIは入力と既存ファイル全体を検証してから、同じフォルダの一時ファイルをatomic replaceする。排他ロックがある場合は拒否。クラッシュで残ったロックを勝手に解除しない。中断時は旧版または完全な新版が残る。正本はdata/events.json、最大5000イベント・1イベントの本文4000文字・全体5MB。

evidenceは既存のプロジェクト相対ファイル。絶対パス、..、URL、リンク/リパースポイント経由の逸脱、存在しない参照は拒否。保存時の正当性だけを保証し、後の根拠ファイル更新と不変監査証拠を混同しない。

HTTPはlocalhostへbindする読取専用。GET /api/events はversionとevents、GET /api/context はdesign/state.mdの公開要約（plan状態、trial状態、監査結果、current_bundle、cycle状態、人評価、next）を返す。部分的な取得失敗時は新旧を混ぜず直前の完全な組を残し更新不能を表示する。入力の形式が不正ならエラー、UIは「記録なし」と同一扱いにしない。HTMLはtextContentで表示し、証拠リンクは相対パスを検査して構成する。

実行ログのpass ≠ 独立監査pass ≠ 採用 ≠ 人評価。表示は正本に記録されたラベルを読み取る。stateの更新をUIやログ追記から行わない。取消は新規ログで事実を残すだけで、ハーネスの取消台帳はrecord担当が別途更新する。
''')
write_md('design/domains/log/rationale.md', {'id': 'DEF-LOG-01', 'revision': 1, 'semantic_revision': 1, 'primary_parent': None, 'parent_semantic_revision': None}, '''# 定義の根拠
一つの観測記録を複数の保証に読み替えないため、ログの結果とハーネスの採用状態を分ける。永続化はAIが実際に書けるファイルで行い、取消・訂正も追記として残す。snapshotはハーネスが保証対象を固定する手段であり、一般ログの保存とは責任が異なる。
''')

write_md('experiments/E-001-plan.md', {'experiment_id': 'E-001', 'revision': 1, 'plan_revision': 1, 'cycle_id': 'C-001', 'previous_cycle_ref': None, 'state': 'planned', 'goal_refs': ['G-LOG', 'SG-TRACE'], 'system_refs': ['SYS-LOG'], 'domain_context_refs': ['D-LOG', 'CTX-LOG'], 'model_definition_refs': ['DEF-LOG-01'], 'baseline_bundle': None, 'delegation_ref': 'operations/delegation.md', 'budget_account_refs': ['LOCAL-01'], 'budget': 'experiments/budget-definition.md'}, '''
# 実際のハーネス記録から作業を追えるか

## 仮説と最小出力
実際の計画・実装・検証・監査で得た観測をAIがCLIで追記し、画面がファイルから読むことで、架空デモを眺める場合より作業の再開に必要な情報が残る。最小出力はHTML/CSS/JS画面、標準Pythonの記録CLI/読取サーバー、実記録、検証結果、採否とハーネス使用所感。

## 範囲と上限
src と tests を新規作成する。旧試作は変更しない。3つ以上の本作業の実イベントで実使用を確認する。過去の出来事を記録する場合は「事後記録」と原本参照を明示し、イベント記録時刻と出来事の時刻を混同しない。架空の成功を初期値に入れない。役割はrootが順に担当し、初回計画と採用監査のみ別の監査者が担当する。

予算はBUDGET-01の数値枠。各trial/audit/record前にstateの最新revision・定義ref・未決予約・blocked_scopesを照合し予約する。固定実装でのUT/SIT/FIT一組を1trial、コード変更後の実行は新trial。合格または枠到達時に停止。条件・境界変更は計画版を上げて再監査。

## 固定した評価条件
| ID | 条件と確認手段 | 必須性 |
| --- | --- | --- |
| UT-01 | CLIで追記後に再読できる。同ID同内容は増えず、異内容と不正/範囲外/欠落証拠は拒否。壊れた保存物を上書きしない。ロック競合・atomic replaceの失敗時も旧データ保持。自動テストで確認 | 必須 |
| SIT-01 | 実CLI→実HTTP→取得JSONの対応、JSON/Markdownの書き出し内容、POST拒否、contextがstateと一致。自動テストで確認 | 必須 |
| FIT-01 | 本作業の3件以上の実ログを画面で読み、検索・工程絞り込み・詳細・根拠表示・再読保持を操作。ネットワーク失敗を更新失敗と表示する。390px/デスクトップで横はみ出しなし。ブラウザ実使用で確認 | 必須 |
| HARNESS-01 | checked以前に製品実装をしない。subjectのhashとsnapshotを検証し、独立監査を別担当に依頼。current反映/終端/周期判定まで台帳で追える | 必須 |
| HUMAN-01 | 本人にとって使いやすいか、実際の業務再開に十分か | 今回は未確認を明示し次の実験へ。技術的な試験採用を妨げないが製品全体完成とはしない |

確率的AI精度の計測ではなく、決定的な保存/閲覧とハーネス運用の1事例。速度改善や一般的な品質改善を主張しない。旧試作との比較は「手順記録なし」と「実記録と版対応あり」という有無の比較に限定する。

## 採否と反映
必須条件に証拠が揃い、独立adoption監査のopen major/blocker=0なら本実験の試験採用を提案。実際の反映はrecordが固定subjectと最新stateを照合して行う。計画合格は実装採用を意味しない。

## 中断・終了・再開
完了時はplan/adoption確定結果とcycle_closedを保存し、implementation未監査差分がなければ理由付き周期skip、あれば監査へ。未確認本人評価と次の作業を残す。予算待ちや監査修正待ちは完了と記載しない。
''')

paths = spec_paths + ['design/domains/log/design.md', 'design/domains/log/rationale.md', 'experiments/E-001-plan.md', 'experiments/budget-definition.md', 'operations/delegation.md']
folder = freeze(paths)
subject = {'scope': scope, 'phase': 'plan', 'spec_refs': [ref(folder, path, identifier, 1) for path, _, identifier, *_ in nodes] + [ref(folder, rationale, identifier + '-rationale', 1) for _, rationale, identifier, *_ in nodes], 'contract_refs': [], 'contracts_not_applicable_reason': '製品内contextは1つ。CLI/HTTPは同context内のSYS-LOG所有境界。開発ハーネスの4seamは製品seamではない。', 'model_definition_refs': [ref(folder, 'design/domains/log/design.md', 'DEF-LOG-01', 1, domain_id='D-LOG', context_id='CTX-LOG', canonical_owner='SYS-LOG', dependencies=[]), ref(folder, 'design/domains/log/rationale.md', 'DEF-LOG-01-rationale', 1, domain_id='D-LOG', context_id='CTX-LOG', canonical_owner='SYS-LOG', dependencies=[])], 'model_definitions_not_applicable_reason': None, 'plan_ref': ref(folder, 'experiments/E-001-plan.md', 'E-001', 1), 'plan_revision': 1, 'evaluation_ref': ref(folder, 'experiments/E-001-plan.md', 'EVAL-001', 1), 'implementation_ref': None, 'trial_refs': [], 'evidence_refs': [], 'delegation_ref': ref(folder, 'operations/delegation.md', 'DELEGATION-01', 1), 'budget_definition_ref': ref(folder, 'experiments/budget-definition.md', 'BUDGET-01', 1), 'recovery_ref': None, 'unverified': ['製品実装・UT/SIT/FITは未実施。plan段階として許容。', 'HUMAN-01は明示的に今回の技術的試験採用の必須条件から除外。次の実験で本人確認。']}
write_json('audits/subjects/PLAN-001.json', subject)
subject_hash = digest(subject)
payload = {'operation_id': 'OP-PLAN-001', 'kind': 'plan', 'experiment_id': 'E-001', 'plan_revision': 1, 'cycle_id': 'C-001', 'scope': scope, 'base_bundle': None, 'phase': 'plan', 'criteria_version': 1, 'subject_ref': 'audits/subjects/PLAN-001.json', 'subject_hash': subject_hash, 'delegation_ref': subject['delegation_ref'], 'change_ids': [], 'review_mode': 'normal', 'recovery_ref': None}
write_json('operations/OP-PLAN-001-payload.json', payload)
write_md('operations/OP-PLAN-001.md', dict(payload, revision=1, state='requested', payload_hash=digest(payload), audit_request_id='AR-PLAN-001', result_ref=None), '# 計画の初回監査を依頼\n\n未採用。計画段階の入力と確認条件だけを監査し、製品実装の成功は要求しない。')
budget_ref = subject['budget_definition_ref']
state = {'project_id': 'HARNESS-LOGBOOK', 'revision': 1, 'timezone': 'Asia/Tokyo', 'scope': scope, 'periodic_policy': {'revision': 1, 'cycle_closed_enabled': True, 'after_days': 7, 'timezone': 'Asia/Tokyo', 'source_ref': 'harness-v3/protocols/messages.md#サイクル終了と周期要求'}, 'writer': '/root (record role)', 'current_bundle': None, 'audit_baselines': [], 'unaudited_changes': [], 'operations': {'OP-PLAN-001': {'payload_hash': digest(payload), 'kind': 'plan', 'subject_hash': subject_hash, 'scope': scope, 'state': 'requested', 'result': None, 'bundle': None, 'audit_request_id': 'AR-PLAN-001'}}, 'tombstones': {}, 'outbox': [], 'received_notifications': {}, 'pending_changes': [], 'blocked_scopes': [], 'budget_accounts': {'LOCAL-01': {'owner': 'learning', 'definition_ref': budget_ref, 'delegation_ref': subject['delegation_ref'], 'scope': scope, 'activities': ['trial', 'audit', 'record'], 'parent_account_refs': [], 'limits': {key: dict(value, cumulative_used=0) for key, value in limits.items()}}}, 'execution_reservations': {}, 'recovery_records': {}, 'observed_at': now(), 'display': {'plan': '監査待ち', 'trial': '未実行', 'audit': '未実施', 'adoption': '未採用', 'cycle': '計画中', 'human_evaluation': '未確認', 'next': '独立した初回計画監査を受け、checked後に製品を実装する。'}}
write_md('design/state.md', state, '# 現在の状態\n\nfrontmatterが記録役の正本です。current_bundleだけが採用済みの版集合を指します。ログの文言から採用や監査を推測しません。本人評価は未確認です。')
reserve('EXEC-AUDIT-PLAN-001', 'audit', 'AR-PLAN-001')
request = {'audit_request_id': 'AR-PLAN-001', 'origin_operation_id': 'OP-PLAN-001', 'kind': 'plan', 'scope': scope, 'phase': 'plan', 'criteria_version': 1, 'subject_ref': 'audits/subjects/PLAN-001.json', 'subject_hash': subject_hash, 'baseline_refs': {item: 'initial' for item in scope}, 'cumulative_diff_ref': 'initial', 'change_ids': [], 'execution_id': 'EXEC-AUDIT-PLAN-001', 'budget_account_refs': ['LOCAL-01'], 'budget_check_ref': 'design/state.md#EXEC-AUDIT-PLAN-001', 'delegation_ref': subject['delegation_ref'], 'review_mode': 'normal', 'recovery_ref': None, 'previous_audit_ref': None, 'previous_subject_ref': None, 'open_finding_ids': [], 'observed_at': now()}
write_json('audits/AR-PLAN-001-request.json', request)
update_state(lambda state: state['outbox'].append({'message_id': 'AR-PLAN-001', 'kind': 'S-AUDIT-INPUT', 'payload_ref': 'audits/AR-PLAN-001-request.json', 'target': 'independent-auditor', 'state': 'in-flight', 'execution_id': 'EXEC-AUDIT-PLAN-001', 'account_refs': ['LOCAL-01']}))
print(json.dumps({'snapshot': folder, 'subject_hash': subject_hash, 'request': 'audits/AR-PLAN-001-request.json'}, ensure_ascii=False))
