import test from 'node:test';
import assert from 'node:assert/strict';
import { evidenceURL, validatePair, visibleEvents } from '../src/view.mjs';

const make = (id, phase, time, extra = {}) => ({ id, phase, time, actor: 'Codex', kind: 'action', title: '保存した観測', body: '実行結果', reason: '判断理由', next: '次の確認', evidence: ['evidence/proof.md'], outcome: 'recorded', ...extra });
const context = { revision: 1, current_bundle: null, display: Object.fromEntries(['plan', 'trial', 'audit', 'adoption', 'cycle', 'human_evaluation', 'next'].map(k => [k, '未確認'])) };
test('search includes reasons and evidence and combines with phase', () => {
  const records = [make('a', 'design', '2026-09-27T00:00:00Z'), make('b', 'verification', '2026-09-27T01:00:00Z')];
  assert.deepEqual(visibleEvents(records, { phase: 'design', query: '判断理由' }).map(e => e.id), ['a']);
  assert.equal(visibleEvents(records, { query: 'proof.md' }).length, 2);
  assert.equal(visibleEvents(records, { query: 'no match' }).length, 0);
});
test('sort uses real instant and does not mutate source', () => {
  const records = [make('a', 'design', '2026-09-27T09:00:00+09:00'), make('b', 'design', '2026-09-27T00:30:00Z')];
  assert.deepEqual(visibleEvents(records).map(e => e.id), ['b', 'a']);
  assert.deepEqual(records.map(e => e.id), ['a', 'b']);
});
test('malformed and partial pairs rejected, never become an empty success', () => {
  assert.throws(() => validatePair({ version: 1, events: [] }, { revision: 1 }));
  const a = make('a', 'design', '2026-09-27T00:00:00Z');
  assert.throws(() => validatePair({ version: 1, events: [a, a] }, context));
  assert.throws(() => validatePair({ version: 1, events: [make('a', 'wrong', 'bad')] }, context));
  assert.equal(validatePair({ version: 1, events: [a] }, context).context.current_bundle, null);
});
test('proof URL is project-relative, encoded, and cannot execute a scheme', () => {
  assert.equal(evidenceURL('evidence/結果 #1.md'), '/evidence/evidence/%E7%B5%90%E6%9E%9C%20%231.md');
  for (const path of ['javascript:alert(1)', 'https://example.com', '../secret', '/root', 'a\\b', 'a//b']) assert.throws(() => evidenceURL(path));
});
