"""Log already-observed preparation facts through the real product CLI."""
import subprocess
import sys
from records import *

events = [
    {'id': 'REAL-001', 'actor': 'Codex / intake', 'phase': 'intake', 'kind': 'decision', 'title': 'ハーネスを実際に使う実験としてやり直す', 'body': '利用者の訂正を受け、前回の独立した試作を保存し、別プロジェクトで実験を開始しました。これは記録経路の完成後に追記した事後記録です。', 'reason': '見た目の試作だけでは、計画・試行・監査・採用の手順を使ったことにならなかったため。', 'evidence': ['operations/delegation.md'], 'next': '今回の仮説と必要な枝を固定する。'},
    {'id': 'REAL-002', 'actor': 'Codex / design', 'phase': 'design', 'kind': 'decision', 'title': 'ログの成功と、監査・採用の状態を分ける', 'body': '4階層の目的と記録の定義を用意し、ファイルを正本にする方針を固定しました。計画時に決めた内容の事後記録です。', 'reason': 'ログに「成功」と書くだけで、未監査の実装が採用済みに見える誤解を避けるため。', 'evidence': ['design/domains/log/design.md', 'design/master.md'], 'next': '記録ファイルの追記と、台帳の読み取りを別の経路にする。'},
    {'id': 'REAL-003', 'actor': 'Codex / record', 'phase': 'plan', 'kind': 'issue', 'title': 'Windowsの権限でスナップショット保存が中断', 'body': '最初の保存は一時フォルダ内のPermissionErrorで失敗しました。権限付き再実行で保存・ハッシュ検証まで進められました。失敗した事実を残す事後記録です。', 'reason': 'ハーネスの実使用で見つかった環境依存の制約を、製品テスト成功で隠さないため。', 'evidence': ['evidence/intake-observations.md', 'evidence/precheck-plan-001.json'], 'outcome': 'fail', 'next': '今後のsnapshot操作にも同じ環境制約を考慮する。'},
    {'id': 'REAL-004', 'actor': 'Codex / record', 'phase': 'audit', 'kind': 'check', 'title': '別担当の初回計画監査を受理', 'body': 'harness_auditorが固定計画を独立に監査し、重大指摘0件のaudit-passを返しました。記録役が対象hashを照合し、計画をcheckedへ進めました。実装開始前に完了した処理の事後記録です。', 'evidence': ['audits/AUD-PLAN-001.md', 'operations/OP-PLAN-001.md'], 'outcome': 'pass', 'next': '計画合格と実装採用を分けたまま、実装と検証を進める。'},
    {'id': 'REAL-005', 'actor': 'Codex / experiment', 'phase': 'implementation', 'kind': 'action', 'title': 'AIの記録経路とログ画面を実装', 'body': 'Python CLIの追記・読取専用HTTP・HTML/CSS/JSの画面を作成し、実装版を固定して最初の検証を開始しました。自動採用や架空の初期ログは実装していません。', 'evidence': ['experiments/implementation-001.json', 'src/logbook.py', 'src/app.js'], 'next': 'この記録自体を画面で読み、検索・根拠・更新失敗を確認する。'},
]
results = []
for event in events:
    command = [sys.executable, '-B', 'src/logbook.py']
    for key, value in event.items():
        if key == 'evidence':
            for path in value:
                command += ['--evidence', path]
        else:
            command += ['--' + key, value]
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, encoding='utf-8', env=dict(os.environ, PYTHONIOENCODING='utf-8'))
    results.append({'command': command, 'exit_code': result.returncode, 'stdout': result.stdout, 'stderr': result.stderr})
    if result.returncode:
        raise RuntimeError(result.stderr)
write_json('evidence/TRIAL-001-real-cli.json', {'recorded_at': now(), 'results': results, 'basis': 'Actual root tool actions and independent reviewer result. Preparation events explicitly identified as retrospective.'})
print('Recorded 5 real events through the CLI')
