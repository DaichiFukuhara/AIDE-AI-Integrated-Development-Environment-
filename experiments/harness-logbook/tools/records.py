"""Single-writer helpers for this manually operated harness experiment.

These helpers save records and hashes. They never decide audit or adoption results.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
import os

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
module_spec = importlib.util.spec_from_file_location('aide_snapshot', REPO / 'harness-v3/tools/snapshot.py')
snapshot = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(snapshot)


def now():
    return datetime.now(timezone.utc).isoformat()


def digest(value):
    return snapshot.digest(snapshot.canonical(value))


def write_json(path, value):
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def write_md(path, meta, body):
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    text = '---\n' + json.dumps(meta, ensure_ascii=False, indent=2) + '\n---\n\n' + body.strip() + '\n'
    target.write_text(text, encoding='utf-8')


def read_md(path):
    text = (ROOT / path).read_text(encoding='utf-8')
    _, front, body = text.split('---', 2)
    return json.loads(front), body.strip()


def update_state(change):
    path = ROOT / 'design/state.md'
    old, body = read_md('design/state.md')
    base_revision = old['revision']
    change(old)
    old['revision'] = base_revision + 1
    old['observed_at'] = now()
    text = '---\n' + json.dumps(old, ensure_ascii=False, indent=2) + '\n---\n\n' + body + '\n'
    temporary = path.with_suffix('.pending')
    temporary.write_text(text, encoding='utf-8')
    latest, _ = read_md('design/state.md')
    if latest['revision'] != base_revision:
        raise RuntimeError('State revision changed; re-read before writing')
    os.replace(temporary, path)
    return old


def freeze(paths):
    folder = snapshot.freeze(ROOT, paths)
    snapshot.verify(folder)
    return folder.relative_to(ROOT).as_posix()


def ref(folder, path, identifier=None, semantic_revision=None, **extra):
    target = ROOT / folder / 'files' / path
    value = {'id': identifier or path, 'immutable_ref': f'{folder}/files/{path}',
             'sha256': hashlib.sha256(target.read_bytes()).hexdigest()}
    if semantic_revision is not None:
        value['semantic_revision'] = semantic_revision
    return dict(value, **extra)


def reserve(execution_id, activity, operation_id, corrective_finding=None):
    def change(state):
        if execution_id in state['execution_reservations']:
            raise ValueError('Execution reservation already exists')
        active = [item for item in state['blocked_scopes'] if item['state'] == 'active']
        if any(item['finding_id'] != corrective_finding or operation_id not in item['permitted_operations'] for item in active):
            raise ValueError('Scope held; a specifically authorized corrective reservation is required')
        account = state['budget_accounts']['LOCAL-01']
        definition_path = ROOT / account['definition_ref']['immutable_ref']
        if hashlib.sha256(definition_path.read_bytes()).hexdigest() != account['definition_ref']['sha256']:
            raise ValueError('Budget definition changed')
        definition, _ = read_md(account['definition_ref']['immutable_ref'])
        if definition['limits'] != {key: {k: v for k, v in value.items() if k not in ('cumulative_used',)} for key, value in account['limits'].items()}:
            raise ValueError('Budget definition and ledger differ')
        checks = {}
        for key, limit in account['limits'].items():
            increment = 1 if activity in limit['activities'] and key != 'external_spend' else 0
            outstanding = sum(r['limits'].get(key, 0) for r in state['execution_reservations'].values() if r['state'] in ('reserved', 'in-flight'))
            used = limit['cumulative_used']
            if used + outstanding + increment > limit['limit']:
                raise ValueError(f'Budget exceeded: {key}')
            checks[key] = {'used': used, 'outstanding': outstanding, 'next': increment, 'limit': limit['limit'], 'decision': 'allow'}
        state['execution_reservations'][execution_id] = {
            'activity': activity, 'operation_id': operation_id, 'scope': state['scope'],
            'corrective_finding': corrective_finding,
            'account_refs': ['LOCAL-01'], 'definition_ref': account['definition_ref'],
            'checked_at': now(), 'state': 'reserved', 'decision_owner': 'learning' if activity == 'trial' else 'record',
            'limits': {key: value['next'] for key, value in checks.items()}, 'checks': checks,
            'basis': 'Local tools and existing session only; no paid external API or purchases. Platform token cost is unmeasured and not represented as zero.'}
    return update_state(change)


def settle(execution_id, evidence):
    def change(state):
        reservation = state['execution_reservations'][execution_id]
        if reservation['state'] == 'settled':
            raise ValueError('Execution already settled')
        for key, amount in reservation['limits'].items():
            state['budget_accounts']['LOCAL-01']['limits'][key]['cumulative_used'] += amount
        reservation.update(state='settled', settled_at=now(), evidence_ref=evidence)
    return update_state(change)
