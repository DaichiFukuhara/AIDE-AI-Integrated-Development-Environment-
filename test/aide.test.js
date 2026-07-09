'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const aide = require('../aide.js');
const AIDE = path.join(__dirname, '..', 'aide.js');
const MOCK_OBSERVER = path.join(__dirname, '..', 'fixtures', 'mock-observer.js');
const MOCK_MASTER = path.join(__dirname, '..', 'fixtures', 'mock-master.js');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'aide-test-'));
}

function run(cwd, args, env = {}) {
  return spawnSync(process.execPath, [AIDE, ...args], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      AIDE_OBSERVER_CMD: `node "${MOCK_OBSERVER}"`,
      AIDE_MASTER_CMD: `node "${MOCK_MASTER}"`,
      ...env,
    },
  });
}

const LANE = path.join('design', 'lanes', 'auth.md');

/** design/ を初期化し、auth レーンに内容を書く。 */
function setup(content) {
  const d = tmpdir();
  const r = run(d, ['init']);
  assert.strictEqual(r.status, 0, r.stderr);
  fs.writeFileSync(path.join(d, LANE), content);
  return d;
}

const LANE_CONTENT = [
  '# レーン: auth',
  '<!-- aide:lane',
  'テスト用',
  '-->',
  '',
  '## 認証フロー',
  '',
  'トークンは JWT を使う。有効期限は 15 分。',
  '',
  '> ❓ **AI**: リフレッシュは？（D）',
  '',
  '## ストレージ',
  '',
  'セッションは Redis に置く。',
  '',
].join('\n');

// ---------------------------------------------------------------------------
// ユニット
// ---------------------------------------------------------------------------

test('extractSection は見出し〜次の同レベル見出しの手前を返す', () => {
  const lines = LANE_CONTENT.split('\n');
  const sec = aide.extractSection(lines, '認証フロー');
  assert.ok(sec.startsWith('## 認証フロー'));
  assert.ok(sec.includes('JWT'));
  assert.ok(!sec.includes('Redis'));
  assert.strictEqual(aide.extractSection(lines, '存在しない'), null);
});

test('stripLaneScaffold は先頭の aide/mdtalk コメントだけ剥がす', () => {
  const text = [
    '<!-- mdtalk protocol', '約束', '-->',
    '<!-- aide:lane', 'x', '-->',
    '', '# レーン: auth', '', '本文 <!-- done: 指示 -->',
  ].join('\n');
  const out = aide.stripLaneScaffold(text);
  assert.ok(out.startsWith('# レーン: auth'));
  assert.ok(out.includes('<!-- done: 指示 -->'), '本文中のコメントは残る');
});

test('formatEntry / parsePoolEntries / rebuildPool の往復', () => {
  const e1 = aide.formatEntry(
    { id: 'aaaaaaaa', lane: 'lanes/a.md', section: '(全体)', accepted: 'D', report: 'reports/a-1.md' },
    '内容A');
  const e2 = aide.formatEntry(
    { id: 'bbbbbbbb', lane: 'lanes/b.md', section: 'S', accepted: 'D', report: 'reports/b-1.md' },
    '内容B\n複数行');
  const pool = '<!-- aide:pool\n前書き\n-->\n\n' + e1 + '\n\n' + e2 + '\n';
  const entries = aide.parsePoolEntries(pool);
  assert.strictEqual(entries.length, 2);
  assert.strictEqual(entries[0].meta.id, 'aaaaaaaa');
  assert.strictEqual(entries[1].content, '内容B\n複数行');
  // 1件目だけ残して再構成
  const rebuilt = aide.rebuildPool(pool, [entries[1]]);
  const after = aide.parsePoolEntries(rebuilt);
  assert.strictEqual(after.length, 1);
  assert.strictEqual(after[0].meta.id, 'bbbbbbbb');
  assert.ok(rebuilt.includes('前書き'), 'プールの前書きコメントは保持');
});

// ---------------------------------------------------------------------------
// 結合（CLI + モック）
// ---------------------------------------------------------------------------

test('init はディレクトリ構成とテンプレートを作る', () => {
  const d = tmpdir();
  const r = run(d, ['init']);
  assert.strictEqual(r.status, 0, r.stderr);
  for (const f of ['master.md', 'pool.md', 'pool-archive.md']) {
    assert.ok(fs.existsSync(path.join(d, 'design', f)), f);
  }
  assert.ok(fs.existsSync(path.join(d, 'design', 'lanes')));
  assert.ok(fs.existsSync(path.join(d, 'design', 'reports')));
  // 再実行しても既存を壊さない
  fs.writeFileSync(path.join(d, 'design', 'master.md'), 'カスタム');
  assert.strictEqual(run(d, ['init']).status, 0);
  assert.strictEqual(fs.readFileSync(path.join(d, 'design', 'master.md'), 'utf8'), 'カスタム');
});

test('lane はレーンファイルを作成する', () => {
  const d = tmpdir();
  run(d, ['init']);
  const r = run(d, ['lane', 'auth']);
  assert.strictEqual(r.status, 0, r.stderr);
  const text = fs.readFileSync(path.join(d, LANE), 'utf8');
  assert.ok(text.includes('# レーン: auth'));
  // 二重作成は拒否
  assert.strictEqual(run(d, ['lane', 'auth']).status, 1);
});

test('observe はレポートを生成する（verdict/laneHash 付き）', () => {
  const d = setup(LANE_CONTENT);
  const logFile = path.join(d, 'mock.log');
  const r = run(d, ['observe', LANE], { MOCK_LOG: logFile });
  assert.strictEqual(r.status, 0, r.stderr);
  const report = fs.readFileSync(path.join(d, 'design', 'reports', 'auth-1.md'), 'utf8');
  assert.ok(report.includes('verdict: pass'));
  assert.ok(/laneHash: [0-9a-f]{64}/.test(report));
  // 観察者が呼ばれたことをログで確認
  const calls = fs.readFileSync(logFile, 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(calls.length, 1);
  assert.strictEqual(calls[0].role, 'observer');
  // 2回目は連番
  run(d, ['observe', LANE]);
  assert.ok(fs.existsSync(path.join(d, 'design', 'reports', 'auth-2.md')));
});

test('accept は観察レポートなしでは拒否される', () => {
  const d = setup(LANE_CONTENT);
  const r = run(d, ['accept', LANE]);
  assert.strictEqual(r.status, 1);
  assert.ok(r.stderr.includes('observe'));
});

test('accept は不合格レポートでは拒否される', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE], { MOCK_OBSERVER_VERDICT: 'fail' });
  const r = run(d, ['accept', LANE]);
  assert.strictEqual(r.status, 1);
  assert.ok(r.stderr.includes('不合格'));
});

test('accept は合格後にプールへ追加する（メタデータ付き）', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE]);
  const r = run(d, ['accept', LANE]);
  assert.strictEqual(r.status, 0, r.stderr);
  const entries = aide.parsePoolEntries(fs.readFileSync(path.join(d, 'design', 'pool.md'), 'utf8'));
  assert.strictEqual(entries.length, 1);
  assert.match(entries[0].meta.id, /^[0-9a-f]{8}$/);
  assert.strictEqual(entries[0].meta.lane, 'lanes/auth.md');
  assert.strictEqual(entries[0].meta.section, '(全体)');
  assert.strictEqual(entries[0].meta.report, 'reports/auth-1.md');
  assert.ok(entries[0].content.includes('JWT'));
  assert.ok(!entries[0].content.includes('aide:lane'), 'スキャフォールドは剥がす');
});

test('accept --section はそのセクションだけ積む', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE]);
  const r = run(d, ['accept', LANE, '--section', '認証フロー']);
  assert.strictEqual(r.status, 0, r.stderr);
  const entries = aide.parsePoolEntries(fs.readFileSync(path.join(d, 'design', 'pool.md'), 'utf8'));
  assert.strictEqual(entries[0].meta.section, '認証フロー');
  assert.ok(entries[0].content.includes('JWT'));
  assert.ok(!entries[0].content.includes('Redis'));
});

test('観察後にレーンを編集すると accept は拒否、--force で強行できる', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE]);
  fs.appendFileSync(path.join(d, LANE), '\n追記した行\n');
  const r1 = run(d, ['accept', LANE]);
  assert.strictEqual(r1.status, 1);
  assert.ok(r1.stderr.includes('編集'));
  const r2 = run(d, ['accept', LANE, '--force']);
  assert.strictEqual(r2.status, 0, r2.stderr);
});

test('integrate は全件統合し、pool を空にし、archive に証跡を残す', () => {
  const d = setup(LANE_CONTENT);
  const logFile = path.join(d, 'mock.log');
  run(d, ['observe', LANE]);
  run(d, ['accept', LANE, '--section', '認証フロー']);
  run(d, ['accept', LANE, '--section', 'ストレージ']);
  const laneBefore = fs.readFileSync(path.join(d, LANE), 'utf8');

  const r = run(d, ['integrate'], { MOCK_LOG: logFile });
  assert.strictEqual(r.status, 0, r.stderr);
  // master が更新される
  const master = fs.readFileSync(path.join(d, 'design', 'master.md'), 'utf8');
  assert.ok(master.includes('マスター設計書（統合済み）'));
  // pool は空になる
  assert.strictEqual(
    aide.parsePoolEntries(fs.readFileSync(path.join(d, 'design', 'pool.md'), 'utf8')).length, 0);
  // archive に integrated の証跡
  const arch = aide.parsePoolEntries(fs.readFileSync(path.join(d, 'design', 'pool-archive.md'), 'utf8'));
  assert.strictEqual(arch.length, 2);
  assert.ok(arch.every((e) => e.meta.status === 'integrated'));
  // マスターAIが呼ばれた
  const calls = fs.readFileSync(logFile, 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(calls.filter((c) => c.role === 'master').length, 1);
  // レーンには一切触れない
  assert.strictEqual(fs.readFileSync(path.join(d, LANE), 'utf8'), laneBefore);
});

test('integrate は差し戻しを archive に理由付きで記録する', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE]);
  run(d, ['accept', LANE, '--section', '認証フロー']);
  run(d, ['accept', LANE, '--section', 'ストレージ']);
  const r = run(d, ['integrate'], { MOCK_MASTER_MODE: 'bounce-first' });
  assert.strictEqual(r.status, 0, r.stderr);
  const arch = aide.parsePoolEntries(fs.readFileSync(path.join(d, 'design', 'pool-archive.md'), 'utf8'));
  const bounced = arch.filter((e) => e.meta.status === 'bounced');
  const integrated = arch.filter((e) => e.meta.status === 'integrated');
  assert.strictEqual(bounced.length, 1);
  assert.strictEqual(integrated.length, 1);
  assert.ok(bounced[0].meta.reason.includes('矛盾'));
  assert.ok(r.stdout.includes('差し戻し'));
});

test('integrate は空プールでは何もせず正常終了する', () => {
  const d = setup(LANE_CONTENT);
  const r = run(d, ['integrate']);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(r.stdout.includes('空'));
});

test('マスターAIの不正応答では master/pool を変更しない', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE]);
  run(d, ['accept', LANE]);
  const masterBefore = fs.readFileSync(path.join(d, 'design', 'master.md'), 'utf8');
  const poolBefore = fs.readFileSync(path.join(d, 'design', 'pool.md'), 'utf8');
  const r = run(d, ['integrate'], { MOCK_MASTER_MODE: 'bad' });
  assert.strictEqual(r.status, 1);
  assert.strictEqual(fs.readFileSync(path.join(d, 'design', 'master.md'), 'utf8'), masterBefore);
  assert.strictEqual(fs.readFileSync(path.join(d, 'design', 'pool.md'), 'utf8'), poolBefore);
});

test('観察者の不正応答はエラーになり、レポートを残さない', () => {
  const d = setup(LANE_CONTENT);
  const r = run(d, ['observe', LANE], { MOCK_OBSERVER_VERDICT: 'bad' });
  assert.strictEqual(r.status, 1);
  assert.ok(!fs.existsSync(path.join(d, 'design', 'reports', 'auth-1.md')));
});

test('status は全体状況を表示する', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE]);
  run(d, ['accept', LANE]);
  const r = run(d, ['status']);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(r.stdout.includes('lanes/auth.md: pass'));
  assert.ok(r.stdout.includes('pool: 1件'));
});
