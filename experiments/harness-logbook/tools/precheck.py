"""Check input identity and structural references; not a semantic audit."""
import argparse
from records import *


def check(subject_path):
    subject = snapshot.read_json(ROOT / subject_path)
    checked = []
    def visit(value):
        if isinstance(value, dict):
            if 'immutable_ref' in value:
                path = ROOT / value['immutable_ref']
                if not path.resolve().is_relative_to(ROOT) or not path.is_file():
                    raise ValueError('Missing or out-of-root reference: ' + str(path))
                if hashlib.sha256(path.read_bytes()).hexdigest() != value['sha256']:
                    raise ValueError('Reference hash mismatch: ' + str(path))
                checked.append(value['immutable_ref'])
            for item in value.values():
                visit(item)
        elif isinstance(value, list):
            for item in value:
                visit(item)
    visit(subject)
    if subject['scope'] != sorted(set(subject['scope'])):
        raise ValueError('Scope is not normalized')
    specs = [read_md(item['immutable_ref'])[0] for item in subject['spec_refs']]
    chain = {item['id']: item for item in specs if 'kind' in item}
    if [chain[key]['kind'] for key in ['G-LOG', 'SG-TRACE', 'AP-FILE', 'SYS-LOG']] != ['root_goal', 'subgoal', 'approach', 'system']:
        raise ValueError('Four-level chain missing')
    for key, parent in [('G-LOG', None), ('SG-TRACE', 'G-LOG'), ('AP-FILE', 'SG-TRACE'), ('SYS-LOG', 'AP-FILE')]:
        if chain[key]['primary_parent'] != parent:
            raise ValueError('Wrong primary parent')
        paired = [item for item in specs if item['id'] == key]
        if len(paired) != 2 or any(paired[0][field] != paired[1][field] for field in ['revision', 'semantic_revision', 'primary_parent', 'parent_semantic_revision']):
            raise ValueError('Spec/rationale pair mismatch')
    folders = {str(Path(item).parents[len(Path(item).parts) - 4]) for item in []}
    verified = set()
    for path in checked:
        parts = Path(path).parts
        if 'snapshots' in parts:
            index = parts.index('snapshots')
            folder = ROOT.joinpath(*parts[:index + 2])
            if str(folder) not in verified:
                snapshot.verify(folder)
                verified.add(str(folder))
    if subject['phase'] == 'implementation' and (not subject['implementation_ref'] or not subject['trial_refs'] or not subject['evidence_refs']):
        raise ValueError('Implementation evidence is missing')
    return {'result': 'structural-pass', 'subject_hash': digest(subject), 'scope': subject['scope'], 'phase': subject['phase'], 'checked_at': now(), 'verified_reference_count': len(checked), 'verified_snapshot_count': len(verified), 'pair_and_chain_check': 'pass', 'limit': 'Identity and structure only. Acceptance sufficiency remains independent reviewer responsibility.'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('subject')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    if (ROOT / args.output).exists():
        raise SystemExit('Refusing to replace existing evidence')
    result = check(args.subject)
    write_json(args.output, result)
    print(json.dumps(result, ensure_ascii=False))
