"""Draft and freeze a corrective plan request; stop before audit dispatch."""
import copy
import difflib
from plan_review_003 import *


def replace_once(text, old, new):
    if text.count(old) != 1:
        raise ValueError('Expected exactly one draft match: ' + old[:70])
    return text.replace(old, new, 1)


def draft():
    s, _ = read_md('design/state.md')
    if s['revision'] != 47 or (ROOT / 'design/candidates/OP-PLAN-003').exists():
        raise ValueError('Draft already exists or state changed')
    path = ROOT / 'experiments/E-002-plan.md'
    text = path.read_text(encoding='utf-8')
    replacements = [
        ('event/tool/path/command/result/duration_ms/counts/truncated', 'event/tool/path/command/result/duration_ms/counts/truncated/seq'),
        ('1回最大20件・総処理5秒・1HTTP timeout 1秒', '1回最大20件・総処理5秒を必須上限とする（起動・資格読取・排他・HTTP・ack処理を含む単調時計の締切、async 時も自前で打ち切る）。1HTTP timeout は1秒か残締切の短い方'),
        ('複数セッションと両立する資格を環境変数で用意するまで送信保留。', '複数セッションと両立する資格を実験内の資格ファイルで用意するまで送信保留。'),
        ('repo root の .claude/settings.json へ影響を広げず、既存のproject hooksも事前に確認して破壊的に上書きしない。', 'repo root の .claude/settings.json / settings.local.json と実験側設定のマージ結果を UC-01 と FIT-AUTO-01 で確認する。root 側を変更せず、重複発火・干渉・適用cwdの範囲を照合し、既存のproject hooksを破壊的に上書きしない。'),
        ('public/app.js（表示分類）', 'public/app.js（表示分類・限界・欠落の可能性）'),
        ('LOGBOOK_URL/LOGBOOK_TOKEN/LOGBOOK_QUEUE と固定 project を環境変数で渡す。URLは今回の検証ではloopbackのみ、トークンは使い捨てfixture専用値で、本番資格を使用しない。', 'LOGBOOK_URL/LOGBOOK_QUEUE と固定 project は非秘密の環境変数で渡す。送信資格はモデル/Claude Code の環境に置かず、hook/worker が gitignore 済みの experiments/cloud-logbook/.local/claude-hook-token から直接読む。既存 .gitignore の .local/ 除外を実装前に再照合し、資格を子プロセス環境・引数・設定・キュー・state・ログへ複写しない。モデルの Bash で env を実行しても fixture トークンの値が出ないことを FIT-AUTO-01 で確認し、証拠には非出力の判定のみを保存する。モデルはこのファイル自体を読めるため、隔離や秘密保持を保証する方式ではない。URLは今回の検証ではloopbackのみ、トークンは使い捨てfixture専用値で、本番資格を使用しない。'),
        ('新hook設定の async/matcher/timeout 書式・scopeの継承', '新hook設定の async/matcher/明示timeout=1秒の書式・root/実験設定マージ・scopeの継承'),
        ('前景20回以上の時間・終了コード・欠落数を記録しp95≤200ms/各≤1秒。async/host timeout後の続行と再開後flushを確認', '前景20回以上の時間・終了コード・欠落数を記録しp95≤200ms/各≤1秒。全 command hook の明示timeout=1秒（5秒以下）とhost timeout後の続行、async worker自前の総処理≤5秒（遅いHTTP/資格読取/排他も含む）、再開後flushを確認'),
        ('今回の終了は precheck structural-pass と AR-PLAN-002 の予約済み・未送信保存。', '今回の終了は plan_revision 2 の precheck structural-pass と AR-PLAN-003 の予約済み・未送信保存。AUD-PLAN-002 の3指摘は独立再監査で受理できる結果が返るまで open/保留とする。'),
        ('今回は記録1とplan監査1だけ。', '初回計画保存の記録1・plan監査1を保持し、今回の受理・改訂・precheck・予約保存は追加記録1バッチ、再plan監査1を予約する。子口座の監査2枠は初回1消費＋再監査1予約で全枠となり、将来のadoption監査は既存配分では予約不能。UC-03で利用者による追加配分/予算変更と新しい定義の固定・台帳同期を確認するまで held-budget とし、親の余裕だけで実行しない。'),
        ('project識別子と相対pathの基準もここに限定してよいか', 'repo root の .claude/settings.json / settings.local.json とのマージ結果（重複・干渉・cwd範囲）を確認したうえで、project識別子と相対pathの基準もここに限定してよいか'),
        ('現行総予算の残試行1ラウンドで進め、不足時は再計画としてよいか', '現行総予算の残試行1ラウンドで進め、不足時は再計画としてよいか。再plan監査でLOCAL-E002の監査2枠を使い切るため、将来のadoption監査の追加配分/予算変更は未確認'),
    ]
    for old, new in replacements:
        text = replace_once(text, old, new)
    missing = '''## 欠落の検出と表示

自動送信候補ごとに body.seq を run 内で1から単調増加する整数として割り当て、counter と id/time/content をローカル state の同じ短い排他で確定する。再配送・再送では同じ seq を再利用する。個別送信しない callback は seq を消費せず counts へ集計する。200件枠を超えて意図的に省略する tool は seq を消費せず omitted 件数へ含める。保存失敗で消費した seq は再利用せず、state が保持できた範囲で次の成功イベントに欠けが残る。state 自体の喪失時の連続性は保証しない。

summary.counts には callback別件数のほか scheduled_event_count（start/end/tool/overflow/summary自身を含むseq割当数）、scheduled_tool_count、omitted_tool_count、storage_failed_count を固定数値として入れる。意図的省略は scheduled_event_count に含めない。sealed summary の seq は最終割当値とし scheduled_event_count と一致させる。画面は取得済みの同runの distinct event id/seq 数と scheduled_event_count、tool数と scheduled_tool_count を照合する。callback数は一意tool数とは区別し、summaryと観測イベント数の比較で網羅性を推測しない。

画面の自動記録表示に (1) seq の欠け、(2) start があるのに end がない、(3) summary の予定件数と取得済み件数の不一致をそれぞれ「欠落の可能性」として理由付きで出す。startのみは進行中/終了未観測の可能性、summary未到達は比較未確認、ページ途中・絞込・未送信・手動更新前の一覧は取得範囲内の暫定判定と表示する。順不同・duplicateを整列/重複排除し、対象runの全ページを手動取得したかも表示する。欠けなしを完全記録・改ざんなしと表示しない。既存データのseqなしは検出対象外/未確認とし、手動イベントを数えない。NEXT-04の自動取得は加えない。

'''
    text = replace_once(text, '## 設定場所と将来の変更候補\n', missing + '## 設定場所と将来の変更候補\n')
    rows = {
        '| UT-AUTO-01 / SYS-LOG |': 'SessionEndのclear/resume/logout/prompt_input_exit/otherと未知otherの変換。',
        '| UT-AUTO-02 / SYS-LOG |': 'run内seq単調増加/再送同seq、seq欠け・startのみ・summary件数不一致の3条件、順不同/duplicate/意図的省略/seqなし旧データ/手動除外/途中取得の暫定判定。',
        '| SIT-AUTO-01 / SG-TRACE |': 'seqの欠け・startのみ・summary件数不一致をproducer/queue/API/表示まで照合し、全件取得後も理由が残ることと復旧flush後の再判定を確認。',
        '| FIT-AUTO-01 / G-LOG |': 'SessionEnd reasonの実値と許可分類、repo root .claude/settings.json / settings.local.jsonと実験側設定のマージ結果（重複発火・干渉・cwd範囲）、モデルBashのenvに資格値が出ないことを実確認。資格ファイルがモデルから読める限界は残す。',
        '| FIT-UI-02 / G-LOG |': 'READMEと自動記録表示の協調的観測/停止・削除・偽装/資格ファイル読取の限界を確認。実ブラウザでseqの欠け・startのみ・summary件数不一致の3例と、途中取得/進行中/未送信の暫定表示を「欠落の可能性」として確認。',
    }
    lines = text.splitlines(keepends=True)
    for prefix, addition in rows.items():
        indexes = [i for i, line in enumerate(lines) if line.startswith(prefix)]
        if len(indexes) != 1:
            raise ValueError('Evaluation row missing')
        index = indexes[0]
        lines[index] = lines[index].rstrip('\n').removesuffix(' |') + '。' + addition + ' |\n'
    text = ''.join(lines)
    text = replace_once(text, '\nNEXT-01/02/04/05 は次計画の候補', '\n| UC-04（回答済み） | 2026-10-03: 改ざん・停止への耐性は今回は不要。協調的な見える化の限界を明記して欠落検出だけを追加。本格的改ざん耐性は NEXT-06 の別計画候補 | 再確認不要。停止・削除・偽装防止を今回の保証に含めない |\n\nNEXT-01/02/04/05 は次計画の候補')
    path.write_text(text, encoding='utf-8')
    old = snapshot.read_json(ROOT / 'audits/subjects/PLAN-002.json')
    for item in old['spec_refs'] + old['model_definition_refs']:
        meta, body = read_md(item['immutable_ref'])
        name = Path(item['immutable_ref']).name
        meta.update(revision=3, semantic_revision=3)
        if meta.get('primary_parent'):
            meta['parent_semantic_revision'] = 3
        if 'candidate_operation_id' in meta:
            meta['candidate_operation_id'] = 'OP-PLAN-003'
        if 'model_definition_versions' in meta:
            meta['model_definition_versions']['DEF-LOG-01'] = 3
        body = body.replace('DEF-LOG-01意味版2', 'DEF-LOG-01意味版3').replace('意味版を2にする', '意味版を3にする')
        if name == 'DEF-LOG-01.md':
            body = replace_once(body, 'トークンは環境変数だけ。', '自動hook/workerのトークンはモデルの環境から外し、gitignore済み実験内.local資格ファイルから直接読む。モデルがファイルを読める限界を明記する。')
            body = replace_once(body, '画面の自動/手動分類だけを追加候補とする。', '画面の自動/手動分類、協調的観測の限界、seqの欠け・start後endなし・summary件数不一致の「欠落の可能性」を追加候補とする。')
        additions = {
            'G-LOG.md': 'UC-04回答により協調的な見える化とする。停止・削除・偽装や資格ファイル読取を防がない限界をREADME/画面で示し、seq欠け・未終了・summary件数不一致の3条件をFIT-UI-02で確認する。',
            'SG-TRACE.md': 'seqとsummary件数の照合、start後endなしをSIT-AUTO-01で画面まで検証する。意図的省略・手動記録・未取得範囲を区別し、欠落の可能性の表示は完全性証明ではない。',
            'AP-FILE.md': 'hook設定は明示timeout=1秒（5秒以下）、async workerは資格読取からackまで総処理5秒必須。資格はモデル環境へ渡さず実験内.localファイルから読む。root設定マージをUC-01/FITで確認する。',
            'SYS-LOG.md': '改訂境界: body.seqとsummary.countsで欠落の可能性3条件を表示する。SessionEnd reasonはclear/resume/logout/prompt_input_exit/other（未知other）。hook timeout=1秒、async worker総処理5秒必須、資格ファイル方式/env非出力、root設定マージをUT/SIT/FITへ対応付ける。AIの停止・削除・偽装・資格ファイル読取を防がない。詳細はplan_revision 2を正本とする。',
            'DEF-LOG-01.md': 'body.seqはrun内送信候補の単調増加連番、再送では不変。summaryの予定件数/省略件数/保存失敗数とcallback観測数を区別する。欠落3条件の表示は取得範囲の暫定観測であり真正性/完全性の証明ではない。AI自身の停止・削除・偽装を防がない協調的観測とする。',
        }
        extra = additions.get(name, 'AUD-PLAN-002の解消条件とUC-04の2026-10-03回答を取り込む。今回の脅威モデルは協調的観測で、改ざん耐性はNEXT-06の別計画候補。plan_revision 2の追加検証と限界に依拠する。')
        write_md('design/candidates/OP-PLAN-003/' + name, meta, body + '\n\n' + extra)
    write_md('operations/delegation-003.md', {
        'id': 'DELEGATION-03', 'revision': 1, 'semantic_revision': 1, 'experiment_id': 'E-002', 'cycle_id': 'C-002',
        'previous_delegation_ref': old['delegation_ref'], 'source': '利用者の2026-10-03 AUD-PLAN-002受理・改訂・再監査予約依頼とUC-04回答',
        'current_authority': 'accept require-review; revise plan; reserve re-audit; stop before dispatch',
        'budget_definition_ref': old['budget_definition_ref'],
    }, '''# 計画改訂の追加委任

DELEGATION-02を引き継ぎ、Codex一人がrecord/design/experiment/precheckの役割を切り替える。AUD-PLAN-002のidentity照合・snapshot固定・親子監査予約の精算・計画保留、新plan_revision 2とAR-PLAN-003の固定・予約までを許可する。再監査はClaude Opus 5.5が外部で担当する。Codexは監査実行・送信・実装・hook・設定作成を行わない。

UC-04は回答済み: 今回は協調的な見える化の限界を明記し欠落検出だけを追加、改ざん・停止耐性は不要。本格的改ざん耐性はNEXT-06へ分離する。自動hook/workerの資格方式はDELEGATION-02の環境変数限定案を置き換え、gitignore済み実験内.localファイルから読む将来案とする。モデルがそのファイルを読める限界も明記する。今回は資格ファイルを作らず読まない。

予算定義・全上限は変更しない。受理・改訂・precheck・要求保存をEXEC-RECORD-007の1バッチにまとめ、親子双方へ1回計上する。再監査はEXEC-AUDIT-PLAN-003を親子双方に予約するだけ。子の監査2枠が埋まるため将来のadoption監査は追加配分/予算変更の定義固定と同期までheld-budget。UC-01〜03は未確認。

読み書きはC:/Users/daich/claude-works配下だけ。TMP/TEMP/TMPDIRはexperiments/cloud-logbook/.local/tmp、pythonはPYTHONUTF8=1、UTF-8で保存する。ホーム、%TEMP%、%APPDATA%、~/.claude、~/.codex、外部ネットワーク、本番資格、課金、git操作、global npm/pip、レジストリ、ACL変更は禁止。旧snapshot・監査・試行は編集しない。製品/hook/設定は次段階の依頼まで作らない。
''')
    meta, body = read_md('evidence/C-001-next-plan-candidates.md')
    meta.update(id='C-002-NEXT-PLAN-CANDIDATES', revision=1, cycle_id='C-002', recorded_at=now(), previous_candidates_ref=s['next_plan_candidates_ref'])
    meta['candidate_ids'].append('NEXT-06')
    body = body.replace('# C-001から次計画への候補（未着手）', '# C-002改訂時点の次計画候補').replace('次の5件', '次の6件')
    body = replace_once(body, '\n## 採用後も未確認・保留の確認', '\n| NEXT-06 本格的な改ざん・停止耐性 | AUD-PLAN-002 / F-CLOUD-PLAN-002-01 / UC-04回答（2026-10-03） | 監視対象から書けない保存先、別アカウントでの送信、署名と鍵の隔離、停止/削除/偽装検知の保証を別計画で決める。今回は不要と決定し、E-002では実装しない。 |\n\nNEXT-03はE-002で計画中・独立再監査待ち。旧候補とC-001履歴は不変参照で保持する。\n\n## 採用後も未確認・保留の確認')
    write_md('evidence/C-002-next-plan-candidates.md', meta, body)
    print('Drafted plan_revision 2, candidate definition revision 3, delegation supplement, NEXT-06. No implementation.')


def fragment_pair(before, after, locator):
    def extract(reference):
        content = (ROOT / reference['immutable_ref']).read_text(encoding='utf-8')
        if locator.startswith('## '):
            start = content.index(locator + '\n')
            end = content.find('\n## ', start + len(locator))
            return content[start:end if end >= 0 else len(content)].rstrip() + '\n'
        units = content.splitlines() if locator.startswith('| ') else content.split('\n\n')
        matches = [p for p in units if p.startswith(locator)]
        if len(matches) != 1:
            raise ValueError('Fragment locator is not unique: ' + locator)
        return matches[0].rstrip() + '\n'
    a, b = extract(before), extract(after)
    if a != b:
        raise ValueError('Reused fragment changed: ' + locator)
    return {'locator': locator, 'previous_ref': before, 'current_ref': after,
            'previous_sha256': hashlib.sha256(a.encode('utf-8')).hexdigest(),
            'current_sha256': hashlib.sha256(b.encode('utf-8')).hexdigest(),
            'normalization': 'UTF-8 text; paragraph/section ending one LF; no internal changes'}


def prepare():
    s, _ = read_md('design/state.md')
    if s['revision'] != 47 or (ROOT / 'audits/AR-PLAN-003-request.json').exists():
        raise ValueError('Request already exists or state changed')
    previous_request = snapshot.read_json(ROOT / 'audits/AR-PLAN-002-request.json')
    previous_subject = previous_request['subject_ref']
    verify_ref(previous_subject)
    old = snapshot.read_json(ROOT / previous_subject['immutable_ref'])
    previous_audit = s['operations']['OP-PLAN-002']['result_ref']
    verify_ref(previous_audit)
    if s['operations']['OP-PLAN-002']['result'] != 'require-review':
        raise ValueError('Previous failure not accepted')
    for finding in FINDINGS:
        if not any(h['finding_id'] == finding and h['state'] == 'active' for h in s['blocked_scopes']):
            raise ValueError('Expected open hold missing')
    confirmation = {'id': 'UC-04', 'state': 'answered', 'answered_on': '2026-10-03',
                    'source': '利用者の本依頼に記載されたUC-04回答',
                    'decision': '改ざん・停止耐性は今回は不要。協調的観測の限界と欠落検出のみ。改ざん耐性はNEXT-06へ分離。'}
    write_md('evidence/E-002-plan-revision-002-handoff.md', {
        'id': 'E-002-PLAN-REVISION-002-HANDOFF', 'revision': 1, 'recorded_at': now(),
        'previous_audit_ref': previous_audit, 'previous_subject_ref': previous_subject,
        'plan_revision': 2, 'open_finding_ids': FINDINGS, 'user_confirmation': confirmation,
    }, '''# 再監査担当への引き継ぎ

AUD-PLAN-002はidentity一致で受理・snapshot固定済み。EXEC-AUDIT-PLAN-002をLOCAL-01/LOCAL-E002で1回精算。OP-PLAN-002はrejected/require-review、major 1・minor 2はopen、plan scopeの保留はactive。Codexは解消済みやcheckedを自己判定していない。

F-CLOUD-PLAN-002-01: E-002-plan.mdの脅威モデル、既存互換性、欠落の検出と表示、設定、UT-AUTO-02/SIT-AUTO-01/FIT-AUTO-01/FIT-UI-02、UC-04。README/画面への限界は次段階の必須検証で、今回は製品ファイルを変更しない。NEXT-06はC-002-next-plan-candidates.md。
F-CLOUD-PLAN-002-02: SessionEnd行、UT-AUTO-01、FIT-AUTO-01。
F-CLOUD-PLAN-002-03: 失敗時の明示hook timeout=1秒、async worker総処理5秒必須、設定/UC-01/FIT-AUTO-01のroot設定マージ、FIT-AUTO-02の締切実確認。

AR-PLAN-003はplan_revision 2を全文固定して予約し未送信で停止する。Claude Opus 5.5はharness-v3/roles/audit.mdの再監査手順でopen指摘、差分/波及先、前回未確認を確認し、同一hashの影響外部分だけを引き継ぐ。reused_checksは起草側の提案で新しい合格判定ではない。全体を初回扱いへ戻さない。

実装/試行/実セッション/画面確認は未実施。UC-01〜03は未確認、UC-04は回答済み。子口座は監査1消費＋再監査1予約で2枠が埋まる。adoption監査は追加配分/予算変更の定義固定・台帳同期までheld-budget。親の監査余力で子の上限を回避しない。

current BUNDLE-001/IMPL-005、C-001完了、旧監査/subject/snapshot/trial、NEXT-01/02/04/05と既存minor F-CLOUD-ADOPT-002を保持する。外部ネットワーク・本番資格・課金・git操作なし。製品/hook/設定/資格ファイルは作成しない。
''')
    draft_paths = ['experiments/E-002-plan.md', 'operations/delegation-003.md', 'evidence/C-002-next-plan-candidates.md',
                   'evidence/E-002-plan-revision-002-handoff.md', 'evidence/AUD-PLAN-002-record-verification.json']
    draft_paths += sorted(p.relative_to(ROOT).as_posix() for p in (ROOT / 'design/candidates/OP-PLAN-003').glob('*.md'))
    folder = freeze(draft_paths)
    subject = copy.deepcopy(old)
    for field in ['spec_refs', 'model_definition_refs']:
        for item in subject[field]:
            candidate_path = 'design/candidates/OP-PLAN-003/' + Path(item['immutable_ref']).name
            item.update(ref(folder, candidate_path, item['id'], 3))
    subject['plan_ref'] = ref(folder, 'experiments/E-002-plan.md', 'E-002', 2)
    subject['plan_revision'] = 2
    subject['evaluation_ref'] = ref(folder, 'experiments/E-002-plan.md', 'EVAL-002', 2)
    subject['delegation_ref'] = ref(folder, 'operations/delegation-003.md', 'DELEGATION-03', 1)
    subject['evidence_refs'] = old['evidence_refs'] + [ref(folder, path) for path in draft_paths[2:5]]
    subject['unverified'] = [item for item in old['unverified'] if not item.startswith('Plan audit not executed;')]
    subject['unverified'] += [
        'PLAN-002 require-review accepted; three findings remain open pending independent PLAN-003 review; no implementation authority.',
        'UC-01/02/03 unresolved; UC-04 answered 2026-10-03 (cooperative visibility only; no tamper/stop resistance).',
        'Credential env non-output, real SessionEnd reasons, root settings merge, explicit timeout and async deadline, missing-event UI and README limits: future FIT, not executed.',
        'LOCAL-E002 audits: one consumed, one reserved for re-plan. Future adoption audit needs authorized allocation/budget definition synchronization.',
    ]
    write_json('audits/subjects/PLAN-003.json', subject)
    checked = check('audits/subjects/PLAN-003.json')
    if checked['subject_hash'] == previous_request['subject_hash']:
        raise ValueError('Revised subject did not change')
    write_json('evidence/precheck-plan-003.json', checked)
    write_md('evidence/precheck-plan-003.md', {
        'id': 'PRECHECK-PLAN-003-NOTE', 'revision': 1, 'subject_hash': digest(subject), 'plan_revision': 2,
        'result': 'structural-pass', 'semantic_audit': 'not-executed', 'checked_at': now(),
    }, '''# 計画構造の確認

固定subjectの全参照hashとsnapshot、G-LOG→SG-TRACE→AP-FILE→SYS-LOGの主親・設計/根拠対（意味版3）をprecheck.pyで確認。DEF-LOG-01意味版3のconsumerを4階層とE-002へ閉じ、外部hookと内部queue/API/UIのownerはSYS-LOG、製品context間seamは理由付き非該当。

systemのUT-AUTO-01/02、subgoalのSIT-AUTO-01/SIT-REG-01、rootのFIT-AUTO-01/02/FIT-UI-02/HUMAN-AUTO-02を対応付けた。今回の追加条件は脅威モデル/README/画面、欠落3条件、env非出力、reason許可値、明示timeout/async締切、root設定マージ。合成入力は実機FITの代替にしない。全項目未実行。

計画に対象外・既存予算・追加委任・候補実装場所・停止点・UC-04回答とUC-01〜03未確認がある。.gitignoreの.local/除外を読取確認。SQL/14フィールド/手動CLIは無変更。確認はidentity/構造と対応関係に限定し、指摘の解消・独立合格は判定しない。
''')
    fixed_folder = freeze(['audits/subjects/PLAN-003.json', 'evidence/precheck-plan-003.json', 'evidence/precheck-plan-003.md'])
    fixed_subject = ref(fixed_folder, 'audits/subjects/PLAN-003.json', 'PLAN-003')
    before_def, after_def = old['model_definition_refs'][0], subject['model_definition_refs'][0]
    fragments = [
        ('DDD-01', '既存14フィールド/enum/auto分類の基礎', fragment_pair(before_def, after_def, 'イベントの14フィールド'), 'SessionEnd reasonとseq/countsは再確認'),
        ('DDD-02', '送らない情報/許可キー/パス/固定分類/マスク/サイズ規則', fragment_pair(old['plan_ref'], subject['plan_ref'], '## 送らない情報と変換規則'), '脅威モデル/資格取得経路/README・画面の限界は再確認'),
        ('DDD-03', 'ack/通信障害時の不変内容再送とbackoff', fragment_pair(old['plan_ref'], subject['plan_ref'], '通信断・接続拒否'), 'seq/summary照合/明示timeout/async締切は再確認'),
        ('DDD-03', '保存不能と送信不能の区別', fragment_pair(old['plan_ref'], subject['plan_ref'], 'queue のローカル保存不能'), '追加欠落表示は再確認'),
        ('DDD-04', '単一contextとSYS-LOGの内部境界所有', fragment_pair(before_def, after_def, 'domain=D-LOG'), '修正した内部変換のseq/資格/時間制約は再確認'),
        ('DDD-05', '実機未発火/合成入力代替不可の評価原則', fragment_pair(old['plan_ref'], subject['plan_ref'], 'FIT-AUTO-01/02 は synthetic'), '追加UT/SIT/FIT項目と評価ref新版は再確認'),
        ('DDD-05', '本人評価条件', fragment_pair(old['plan_ref'], subject['plan_ref'], '| HUMAN-AUTO-02'), 'README/欠落表示の利用者理解は追加条件として再確認'),
        ('AIDE-03', '既存current/履歴の固定', None, '新subject/precheck/台帳/予約/保留は再確認'),
    ]
    reused = []
    for criterion, part, fragment, excluded in fragments:
        value = {'criterion': criterion, 'part': part, 'status': 'reuse-proposed', 'criteria_version': 2,
                 'previous_audit_ref': previous_audit, 'previous_subject_ref': previous_subject,
                 'excluded': excluded, 'reason': '前回確認済み部分の入力と依拠する該当部分のhashが同一。変更された定義・計画・委任全体の合格は引き継がない。'}
        if fragment:
            value['input_fragments'] = [fragment]
            value['dependency_fragments'] = [fragment]
        else:
            value['input_refs'] = [s['current_bundle'], previous_subject, previous_audit]
            value['current_input_refs'] = [s['current_bundle'], previous_subject, previous_audit]
        reused.append(value)
    changed_inputs, patch = [], []
    pairs = [(old['plan_ref'], subject['plan_ref']), (old['delegation_ref'], subject['delegation_ref'])]
    pairs += list(zip(old['spec_refs'] + old['model_definition_refs'], subject['spec_refs'] + subject['model_definition_refs']))
    for before, after in pairs:
        a = (ROOT / before['immutable_ref']).read_text(encoding='utf-8').splitlines(keepends=True)
        b = (ROOT / after['immutable_ref']).read_text(encoding='utf-8').splitlines(keepends=True)
        patch += list(difflib.unified_diff(a, b, fromfile=before['immutable_ref'], tofile=after['immutable_ref']))
        changed_inputs.append({'id': before['id'], 'previous_ref': before, 'current_ref': after})
    patch_path = 'audits/deltas/AR-PLAN-003.patch'
    (ROOT / patch_path).parent.mkdir(parents=True, exist_ok=True)
    (ROOT / patch_path).write_text(''.join(patch), encoding='utf-8')
    delta = {'id': 'PLAN-REVIEW-DELTA-003', 'revision': 1, 'semantic_revision': 1, 'phase': 'plan',
             'previous_audit_ref': previous_audit, 'previous_subject_ref': previous_subject, 'current_subject_ref': fixed_subject,
             'previous_subject_hash': digest(old), 'current_subject_hash': digest(subject),
             'changed_inputs': changed_inputs, 'subject_changed_fields': [k for k in subject if subject[k] != old.get(k)],
             'subject_unchanged_fields': [k for k in subject if subject[k] == old.get(k)],
             'impact_scope': s['scope'], 'impact_paths': ['DEF-LOG-01 -> G-LOG/SG-TRACE/AP-FILE/SYS-LOG -> E-002/EVAL-002', 'hook -> seq/state/queue -> API -> UI missing-event display', 'credential file -> hook/worker; Bash env FIT; README/UI limits', 'hook settings timeout/root merge -> foreground/async deadline -> UC-01/FIT'],
             'open_finding_ids': FINDINGS + ['F-CLOUD-ADOPT-002'], 'unchanged_fragments': [x['input_fragments'][0] for x in reused if 'input_fragments' in x],
             'unmodified_inputs': {'implementation_ref': old['implementation_ref'], 'budget_definition_ref': old['budget_definition_ref'], 'budget_parent_definition_refs': old.get('budget_parent_definition_refs', [])},
             'comparison_only_cumulative_diff_ref': previous_request['cumulative_diff_ref'],
             'no_product_change': True, 'user_confirmation': confirmation,
             'finding_disposition': 'PLAN-002の3指摘は改訂済み・再監査待ちでopen/active。F-CLOUD-ADOPT-002は対象外のopen minor。',
             'reuse_limit': 'Fragment reuse only; changed entire plan/definition/delegation refs cannot inherit a blanket pass.'}
    write_json('audits/deltas/AR-PLAN-003.json', delta)
    delta_folder = freeze(['audits/deltas/AR-PLAN-003.json', patch_path])
    review_delta = ref(delta_folder, 'audits/deltas/AR-PLAN-003.json', 'PLAN-REVIEW-DELTA-003', 1, patch_ref=ref(delta_folder, patch_path))
    change = {'id': 'PLAN-DELTA-003', 'revision': 1, 'semantic_revision': 1, 'operation_id': 'OP-PLAN-003',
              'phase': 'plan', 'base_bundle': s['current_bundle'], 'previous_operation_id': 'OP-PLAN-002',
              'previous_subject_ref': previous_subject, 'new_subject_ref': fixed_subject, 'review_delta_ref': review_delta,
              'affected_scope': s['scope'], 'implementation_changed': False, 'reason': 'AUD-PLAN-002解消条件とUC-04回答に従うplan_revision 2。currentは変更しない。'}
    write_json('design/candidates/OP-PLAN-003/change.json', change)
    change_folder = freeze(['design/candidates/OP-PLAN-003/change.json'])
    change_ref = ref(change_folder, 'design/candidates/OP-PLAN-003/change.json', 'PLAN-DELTA-003', 1)
    payload = {'operation_id': 'OP-PLAN-003', 'kind': 'plan', 'experiment_id': 'E-002', 'plan_revision': 2, 'cycle_id': 'C-002',
               'scope': s['scope'], 'phase': 'plan', 'criteria_version': 2, 'base_bundle': s['current_bundle'],
               'base_revision': s['revision'], 'subject_ref': fixed_subject, 'subject_hash': digest(subject),
               'delegation_ref': subject['delegation_ref'], 'budget_account_refs': ACCOUNTS, 'change_ids': [], 'change_refs': [change_ref],
               'review_mode': 'normal', 'recovery_ref': None, 'previous_operation_id': 'OP-PLAN-002',
               'previous_audit_ref': previous_audit, 'previous_subject_ref': previous_subject, 'review_delta_ref': review_delta}
    write_json('operations/OP-PLAN-003-payload.json', payload)
    write_md('operations/OP-PLAN-003.md', dict(payload, revision=1, state='requested', payload_hash=digest(payload), audit_request_id='AR-PLAN-003', result_ref=None),
             '# E-002 plan_revision 2の再監査要求\n独立再監査予約・未送信で停止。前回require-reviewと3指摘のopen/保留を保持。UC-04回答済み、UC-01〜03未確認。構造確認は独立合格ではない。')
    def sync_and_reserve(value):
        account = value['budget_accounts']['LOCAL-E002']
        account.setdefault('delegation_history', []).append({'previous_ref': account['delegation_ref'], 'new_ref': subject['delegation_ref'], 'received_at': now(), 'basis': '利用者の2026-10-03追加委任。予算上限とdefinition_refは変更なし。'})
        account['delegation_ref'] = subject['delegation_ref']
        reserve_both(value, 'EXEC-AUDIT-PLAN-003', 'audit', 'AR-PLAN-003', corrective=True)
    update_state(sync_and_reserve)
    request = copy.deepcopy(previous_request)
    request.update(audit_request_id='AR-PLAN-003', origin_operation_id='OP-PLAN-003', plan_revision=2,
                   subject_ref=fixed_subject, subject_hash=digest(subject),
                   precheck_ref=ref(fixed_folder, 'evidence/precheck-plan-003.json', 'PRECHECK-PLAN-003'),
                   precheck_note_ref=ref(fixed_folder, 'evidence/precheck-plan-003.md', 'PRECHECK-PLAN-003-NOTE'),
                   cumulative_diff_ref={'from': s['current_bundle'], 'via': previous_request['cumulative_diff_ref'], 'correction_delta_ref': review_delta, 'to_subject_ref': fixed_subject},
                   review_delta_ref=review_delta, previous_audit_ref=previous_audit, previous_subject_ref=previous_subject,
                   open_finding_ids=FINDINGS + ['F-CLOUD-ADOPT-002'], impact_scope=s['scope'], impact_paths=delta['impact_paths'], reused_checks=reused,
                   finding_disposition='PLAN-002のmajor 1/minor 2は改訂して再確認、openを保持。F-CLOUD-ADOPT-002はNEXT-01として対象外で継続。',
                   execution_id='EXEC-AUDIT-PLAN-003', budget_check_ref='design/state.md#EXEC-AUDIT-PLAN-003',
                   delegation_ref=subject['delegation_ref'], reviewer='Claude Opus 5.5 (external independent re-audit)',
                   independence='independent-required', user_confirmations=[confirmation],
                   review_focus=['AUD-PLAN-002の3解消条件', 'PLAN-002 -> PLAN-003の入力差分と依拠先の波及', '前回未確認と新UT/SIT/FIT/UCの対応', '同一hashで影響外の確認部分の引継ぎ（全面再監査へ戻さない）', '親子予算/追加委任/将来adoption監査枠不足'],
                   review_coverage={'DDD-01': '14-field fragment reuse; reason/seq/counts review', 'DDD-02': 'privacy fragment reuse; threat/credential/env review', 'DDD-03': 'ack/failure fragment reuse; seq/deadlines review', 'DDD-04': 'context ownership fragment reuse; changed internal boundary review', 'DDD-05': 'device/HUMAN principles reuse; new UT/SIT/FIT mapping review', 'AIDE-01': 'scope/UC-01/03/04/delegation/budget review', 'AIDE-02': 'cooperative guarantee/README/UI/missing-event meaning review', 'AIDE-03': 'historical immutable inputs reuse; new identity/state/precheck/holds review'},
                   unverified=subject['unverified'], requested_at=now(), observed_at=now(), delivery='saved-pending; do not dispatch or execute in this turn',
                   execution_started=False, instruction='Codexは再監査未実行。Claude Opus 5.5が固定入力に対して独立再監査し、結果を新規AUD-PLAN-003として返す。')
    write_json('audits/AR-PLAN-003-request.json', request)
    final_paths = ['audits/AR-PLAN-003-request.json', 'operations/OP-PLAN-003.md', 'operations/OP-PLAN-003-payload.json', 'tools/plan_review_003.py', 'tools/request_plan_003.py']
    request_folder = freeze(final_paths)
    fixed_request = ref(request_folder, final_paths[0], 'AR-PLAN-003')
    candidate_ref = ref(folder, 'evidence/C-002-next-plan-candidates.md', 'C-002-NEXT-PLAN-CANDIDATES')
    def enqueue(value):
        value['operations']['OP-PLAN-003'] = dict(kind='plan', phase='plan', criteria_version=2, scope=s['scope'], state='requested', result=None, bundle=None,
                                                payload_hash=digest(payload), payload_ref=ref(request_folder, final_paths[2], 'OP-PLAN-003-PAYLOAD'),
                                                subject_hash=digest(subject), subject_ref=fixed_subject, precheck_ref=request['precheck_ref'], audit_request_id='AR-PLAN-003', previous_operation_id='OP-PLAN-002')
        value['pending_changes'].append(change)
        value['next_plan_candidates_ref'] = candidate_ref
        for m in value['outbox']:
            if m['message_id'] == 'AR-PLAN-002':
                m.update(correction_state='re-audit-pending', successor_request_id='AR-PLAN-003')
        for hold in value['blocked_scopes']:
            if hold['state'] == 'active' and hold['finding_id'] in FINDINGS:
                hold.update(successor_request_id='AR-PLAN-003', corrective_operation_id='OP-PLAN-003')
        for finding in value['open_findings']:
            if finding['finding_id'] in FINDINGS:
                finding.update(correction_status='revised-awaiting-independent-review', successor_request_id='AR-PLAN-003')
        value['outbox'].append({'message_id': 'AR-PLAN-003', 'kind': 'S-AUDIT-INPUT', 'payload_ref': fixed_request, 'target': 'Claude Opus 5.5 (external independent re-audit)',
                                'state': 'pending', 'delivery_status': 'not-dispatched', 'execution_id': 'EXEC-AUDIT-PLAN-003', 'account_refs': ACCOUNTS,
                                'execution_started': False, 'hold_reason': 'User-requested stop after reservation'})
        value['active_cycle_status'].update(state='plan-re-audit-pending', operation_id='OP-PLAN-003', audit_request_id='AR-PLAN-003', plan_revision=2,
                                            plan_checked=False, implementation_started=False, user_confirmations=[confirmation], required_user_confirmations=['UC-01', 'UC-02', 'UC-03'],
                                            future_adoption_audit_budget='held-budget; child allocation exhausted by consumed+reserved plan reviews')
        value['display'].update(plan='E-002 plan_revision 2構造確認済み・計画保留/独立再監査待ち', audit='AUD-PLAN-002受理 major 1/minor 2 open / AR-PLAN-003予約済み・未送信・未実施',
                                cycle='C-001完了を保持 / C-002独立再監査待ち・未完了', next='Claude Opus 5.5のAR-PLAN-003独立再監査待ち。UC-01〜03未確認、UC-04回答済み。製品/hook/設定は作らない。将来adoption監査は予算再配分確認。')
        settle_both(value, 'EXEC-RECORD-007', fixed_request)
    update_state(enqueue)
    meta, body = read_md('experiments/E-002.md')
    meta.update(revision=2, plan_revision=2, state='planned', cycle_state='plan-re-audit-pending', plan_ref=subject['plan_ref'], plan_subject_ref=fixed_subject,
                related_operations=[{'operation_id': 'OP-PLAN-002', 'state': 'rejected', 'result': 'require-review', 'result_ref': previous_audit}, {'operation_id': 'OP-PLAN-003', 'state': 'requested', 'result': None}],
                budget_check={'record_execution_id': 'EXEC-RECORD-007', 'audit_execution_id': 'EXEC-AUDIT-PLAN-003', 'ledger_ref': 'design/state.md', 'trial_started': False},
                user_confirmations=[confirmation], unverified=subject['unverified'], open_finding_ids=FINDINGS)
    write_md('experiments/E-002.md', meta, '# E-002の改訂停止点\n\nAUD-PLAN-002 require-reviewを受理しplan_revision 2へ改訂。plan precheckは構造確認のみ合格。AR-PLAN-003を予約して未送信で停止する。3指摘はopen、保留active、独立再監査はClaude Opus 5.5が行う。製品/hook/設定/試行は未作成・未実行。\n\nUC-04回答済み、UC-01〜03未確認。子監査2枠は1消費＋1予約で全枠、将来adoption監査は予算再確認。C-001/current/既存minorと未確認を保持。NEXT-06を別計画候補に追加。')
    print(json.dumps({'request': 'audits/AR-PLAN-003-request.json', 'fixed_request': fixed_request, 'subject_hash': digest(subject), 'precheck': checked, 'state_revision': read_md('design/state.md')[0]['revision'], 'reused_checks': len(reused), 'audit_executed': False}, ensure_ascii=False))


if __name__ == '__main__':
    import sys
    if sys.argv[1:] == ['--prepare']:
        prepare()
    else:
        draft()
