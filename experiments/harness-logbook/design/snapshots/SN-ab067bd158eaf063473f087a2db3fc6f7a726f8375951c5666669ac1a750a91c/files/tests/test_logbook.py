from pathlib import Path
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request, urlopen

PROJECT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT / 'src'))
import logbook
import server


class StorageTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='aide-logbook-test-')
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / 'proof.md').write_text('Observed proof', encoding='utf-8')
        self.event = {'id': 'test-01', 'actor': 'Tester', 'phase': 'verification', 'kind': 'check', 'title': 'Test result', 'body': '<script> is plain text', 'evidence': ['proof.md'], 'outcome': 'pass'}

    def test_persistent_append_and_idempotent_retry_without_time(self):
        first = logbook.append_event(self.event, self.root)
        second = logbook.append_event(self.event, self.root)
        self.assertEqual(first['result'], 'appended')
        self.assertEqual(second['result'], 'unchanged')
        self.assertEqual(len(logbook.read_events(self.root)['events']), 1)
        self.assertEqual(first['event']['time'], second['event']['time'])

    def test_conflicting_id_keeps_original_bytes(self):
        logbook.append_event(self.event, self.root)
        path = self.root / 'data/events.json'
        original = path.read_bytes()
        with self.assertRaisesRegex(logbook.RecordError, '異なる内容'):
            logbook.append_event(dict(self.event, title='Different'), self.root)
        self.assertEqual(path.read_bytes(), original)

    def test_evidence_escape_missing_url_absolute_and_backslash_rejected(self):
        for path in ['../outside', '/absolute', 'C:/outside', 'https://example.test', 'missing.md', 'a\\b', 'a//b']:
            with self.subTest(path=path), self.assertRaises(logbook.RecordError):
                logbook.append_event(dict(self.event, evidence=[path]), self.root)
        self.assertFalse((self.root / 'data/events.json').exists())

    def test_symlink_evidence_rejected(self):
        if os.name == 'nt':
            # Directory junctions are available without symlink privileges.
            outside = self.root / 'outside'
            outside.mkdir()
            (outside / 'proof.md').write_text('outside', encoding='utf-8')
            junction = self.root / 'linked'
            result = subprocess.run(['cmd', '/c', 'mklink', '/J', str(junction), str(outside)], capture_output=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.addCleanup(os.rmdir, junction)
            path = 'linked/proof.md'
        else:
            (self.root / 'linked.md').symlink_to(self.root / 'proof.md')
            path = 'linked.md'
        with self.assertRaisesRegex(logbook.RecordError, 'リンク'):
            logbook.append_event(dict(self.event, evidence=[path]), self.root)

    def test_corruption_and_duplicate_json_keys_are_not_overwritten(self):
        folder = self.root / 'data'
        folder.mkdir()
        target = folder / 'events.json'
        for corrupt in ['{broken', '{"version":1,"version":1,"events":[]}', '{"version":2,"events":[]}']:
            target.write_text(corrupt, encoding='utf-8')
            with self.assertRaises(ValueError):
                logbook.append_event(self.event, self.root)
            self.assertEqual(target.read_text(encoding='utf-8'), corrupt)

    def test_invalid_fields_rejected(self):
        for change in [{'phase': 'unknown'}, {'outcome': 'unknown'}, {'title': ' '}, {'body': 'x' * 4001}, {'id': '../bad'}, {'time': '2026-09-27T12:00:00'}, {'actor': []}, {'extra': True}]:
            with self.subTest(change=change), self.assertRaises(logbook.RecordError):
                logbook.append_event(dict(self.event, **change), self.root)

    def test_lock_collision_does_not_overwrite_or_remove_other_lock(self):
        folder = self.root / 'data'
        folder.mkdir()
        lock = folder / '.writer.lock'
        lock.write_text('another writer', encoding='utf-8')
        with self.assertRaisesRegex(logbook.RecordError, 'ロック'):
            logbook.append_event(self.event, self.root)
        self.assertEqual(lock.read_text(encoding='utf-8'), 'another writer')

    def test_atomic_replace_failure_preserves_old_and_releases_own_lock(self):
        logbook.append_event(self.event, self.root)
        target = self.root / 'data/events.json'
        original = target.read_bytes()
        with patch.object(logbook.os, 'replace', side_effect=OSError('simulated interrupted replace')):
            with self.assertRaises(OSError):
                logbook.append_event(dict(self.event, id='test-02'), self.root)
        self.assertEqual(target.read_bytes(), original)
        self.assertFalse((self.root / 'data/.writer.lock').exists())
        self.assertEqual(list((self.root / 'data').glob('*.tmp')), [])

    def test_historical_event_survives_later_missing_evidence(self):
        logbook.append_event(self.event, self.root)
        (self.root / 'proof.md').unlink()
        self.assertEqual(len(logbook.read_events(self.root)['events']), 1)
        with self.assertRaises(logbook.RecordError):
            logbook.safe_file(self.root, 'proof.md')
        logbook.append_event(dict(self.event, id='later-01', evidence=[]), self.root)
        self.assertEqual(len(logbook.read_events(self.root)['events']), 2)

    def test_corrupt_stored_evidence_rejects_read_and_append_without_changing_bytes(self):
        logbook.append_event(self.event, self.root)
        path = self.root / 'data/events.json'
        stored = json.loads(path.read_text(encoding='utf-8'))
        for evidence in ['../outside', '/absolute', 'C:/outside', 'https://example.test', 'a\\b', 'a//b', './proof.md', '', 'a\x00b']:
            with self.subTest(evidence=evidence):
                stored['events'][0]['evidence'] = [evidence]
                original = json.dumps(stored).encode('utf-8')
                path.write_bytes(original)
                with self.assertRaises(logbook.RecordError):
                    logbook.read_events(self.root)
                with self.assertRaises(logbook.RecordError):
                    logbook.append_event(dict(self.event, id='next-01', evidence=[]), self.root)
                self.assertEqual(path.read_bytes(), original)
                self.assertFalse((self.root / 'data/.writer.lock').exists())


class HTTPTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='aide-logbook-http-')
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / 'design').mkdir()
        (self.root / 'proof.md').write_text('ACTUAL EVIDENCE', encoding='utf-8')
        self.state = {'project_id': 'TEST', 'revision': 7, 'current_bundle': None, 'observed_at': '2026-09-27T00:00:00Z', 'display': {key: '未確認' for key in ['plan', 'trial', 'audit', 'adoption', 'cycle', 'human_evaluation', 'next']}, 'operations': {'OP-PLAN-001': {'subject_hash': 'fixed-plan'}}}
        self.state['display']['plan'] = '計画だけ合格'
        self.state_path = self.root / 'design/state.md'
        self.state_path.write_text('---\n' + json.dumps(self.state) + '\n---\n# State\n', encoding='utf-8')
        self.http = server.create_server(self.root, port=0)
        self.thread = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()
        self.addCleanup(self.shutdown)
        self.url = f'http://127.0.0.1:{self.http.server_port}'

    def shutdown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join(timeout=2)

    def get(self, route):
        return urlopen(self.url + route, timeout=5)

    def test_real_cli_to_http_and_export(self):
        result = subprocess.run([sys.executable, '-B', str(PROJECT / 'src/logbook.py'), '--root', str(self.root), '--id', 'cli-01', '--actor', 'AI', '--phase', 'verification', '--kind', 'check', '--title', 'CLI proof', '--body', '<script>alert(1)</script>', '--evidence', 'proof.md', '--outcome', 'pass'], capture_output=True, text=True, encoding='utf-8', env=dict(os.environ, PYTHONIOENCODING='utf-8'))
        self.assertEqual(result.returncode, 0, result.stderr)
        with self.get('/api/events') as response:
            events = json.load(response)
        self.assertEqual(events['events'][0]['id'], 'cli-01')
        with self.get('/export/events.json') as response:
            self.assertIn('attachment', response.headers['Content-Disposition'])
            self.assertEqual(json.load(response), events)
        with self.get('/export/events.md') as response:
            text = response.read().decode('utf-8')
            self.assertIn('CLI proof', text)
            self.assertIn('proof.md', text)
            self.assertNotIn('<script>', text)
        with self.get('/api/context') as response:
            context = json.load(response)
        self.assertIsNone(context['current_bundle'])
        self.assertEqual(context['display']['plan'], '計画だけ合格')
        self.assertEqual(context['display']['audit'], '未確認')
        self.assertEqual(context['revision'], 7)
        self.assertEqual(self.state_path.read_text(encoding='utf-8'), '---\n' + json.dumps(self.state) + '\n---\n# State\n')

    def test_evidence_is_readable_text_and_traversal_is_rejected(self):
        with self.get('/evidence/proof.md') as response:
            self.assertIn('text/plain', response.headers['Content-Type'])
            self.assertEqual(response.read(), b'ACTUAL EVIDENCE')
        for path in ['/evidence/../README.md', '/evidence/%2e%2e/README.md', '/evidence/C:/Windows/win.ini', '/evidence/missing.md']:
            with self.subTest(path=path), self.assertRaises(HTTPError) as error:
                self.get(path)
            self.assertEqual(error.exception.code, 404)

    def test_post_does_not_mutate(self):
        with self.assertRaises(HTTPError) as error:
            urlopen(Request(self.url + '/api/events', data=b'{}', method='POST'), timeout=5)
        self.assertEqual(error.exception.code, 405)
        self.assertFalse((self.root / 'data').exists())

    def test_corrupt_context_is_failure_not_success(self):
        self.state_path.write_text('broken', encoding='utf-8')
        with self.assertRaises(HTTPError) as error:
            self.get('/api/context')
        self.assertEqual(error.exception.code, 500)

    def test_corrupt_stored_evidence_is_http_error_for_events_and_exports(self):
        event = {'id': 'stored-01', 'actor': 'AI', 'phase': 'verification', 'kind': 'check', 'title': 'Proof', 'body': 'Observed', 'evidence': ['proof.md']}
        logbook.append_event(event, self.root)
        path = self.root / 'data/events.json'
        stored = json.loads(path.read_text(encoding='utf-8'))
        stored['events'][0]['evidence'] = ['../outside']
        original = json.dumps(stored).encode('utf-8')
        path.write_bytes(original)
        for route in ['/api/events', '/export/events.json', '/export/events.md']:
            with self.subTest(route=route), self.assertRaises(HTTPError) as error:
                self.get(route)
            self.assertEqual(error.exception.code, 500)
        self.assertEqual(path.read_bytes(), original)


if __name__ == '__main__':
    unittest.main()
