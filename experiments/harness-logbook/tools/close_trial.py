"""Record an observed trial, freeze evidence, and settle its reservation."""
import argparse
from records import *

parser = argparse.ArgumentParser()
parser.add_argument('number')
parser.add_argument('--result', choices=['pass', 'needs-fix'], required=True)
parser.add_argument('--summary', required=True)
args = parser.parse_args()
number = args.number
trial = 'TRIAL-' + number
if (ROOT / f'experiments/trials/{trial}.md').exists():
    raise SystemExit('Trial already recorded; do not change history')
paths = [f'evidence/{trial}-automated.json', f'evidence/{trial}-browser.json', f'experiments/implementation-{number}.json', 'data/events.json', 'design/state.md']
if number == '001':
    paths.append('evidence/TRIAL-001-real-cli.json')
folder = freeze(paths)
subject = snapshot.read_json(ROOT / 'audits/subjects/PLAN-001.json')
implementation = snapshot.read_json(ROOT / f'experiments/implementation-{number}.json')
write_md(f'experiments/trials/{trial}.md', {'trial_id': trial, 'experiment_id': 'E-001', 'plan_revision': 1, 'plan_ref': subject['plan_ref'], 'implementation_ref': implementation, 'model_definition_refs': subject['model_definition_refs'], 'evaluation_ref': subject['evaluation_ref'], 'evidence_refs': [ref(folder, path) for path in paths], 'executed_at': now(), 'execution_id': 'EXEC-' + trial, 'budget_account_refs': ['LOCAL-01'], 'budget_usage': {'LOCAL-01/trials': {'used': 1, 'unit': 'verification-round'}, 'LOCAL-01/external_spend': {'used': 0, 'unit': 'JPY-new-external-purchases'}, 'platform_token_cost': 'unknown'}, 'budget_settlement_ref': 'design/state.md#EXEC-' + trial, 'result': args.result}, f'''# {trial}: {args.summary}

固定計画はplan_revision=1。実装の不変ファイル集合と、実行コマンド・終了コード・標準出力/エラー・ブラウザ観測をfrontmatterの不変参照に保存した。

## 観測と評価
{args.summary}

自動検証は実プロセスで実行。ブラウザの実使用はAI操作であり本人評価ではない。最初の計画・設計・計画監査のイベントは記録経路完成後の事後記録と本文に明記。実際のハーネス手順やツール結果から記録しており架空セッションではない。

## 限界と次
HUMAN-01、長期運用、全ブラウザ互換は未確認。{'修正後に同じ評価条件で新しいtrialを作り、旧試行を保存する。' if args.result == 'needs-fix' else '技術的な試験採用を独立adoption監査へ提案する。本人評価を製品全体完了へ読み替えない。'}
''')
settle('EXEC-' + trial, f'experiments/trials/{trial}.md')
update_state(lambda state: state['display'].update(trial='修正が必要' if args.result == 'needs-fix' else '実使用まで確認', cycle='修正中' if args.result == 'needs-fix' else '採用監査待ち', next=args.summary))
print(json.dumps({'trial': trial, 'result': args.result, 'evidence_snapshot': folder}, ensure_ascii=False))
