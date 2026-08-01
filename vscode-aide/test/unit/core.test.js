'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const os = require('node:os');
const path = require('node:path');

const core = require('../../dist/core.js');
const { runProcess } = require('../../dist/process.js');

function sampleStatus() {
  return {
    schemaVersion: 1,
    initialized: true,
    root: path.join(os.tmpdir(), 'aide-design'),
    master: { path: 'master.md', exists: true, bytes: 123 },
    lanes: [],
    pool: { path: 'pool.md', count: 0, entries: [] },
    archive: { path: 'pool-archive.md', count: 0, integrated: 0, bounced: 0 },
  };
}

test('resolveDesignRoot はワークスペース外と絶対パスを拒否する', () => {
  const root = path.resolve(os.tmpdir(), 'workspace');
  assert.equal(core.resolveDesignRoot(root, 'design'), path.join(root, 'design'));
  assert.throws(() => core.resolveDesignRoot(root, '..'), /ワークスペース内/);
  assert.throws(() => core.resolveDesignRoot(root, path.resolve(os.tmpdir(), 'outside')), /相対パス/);
});

test('parseStatusJson は schemaVersion と必須構造を検証する', () => {
  const status = sampleStatus();
  assert.deepEqual(core.parseStatusJson(JSON.stringify(status)), status);
  assert.throws(() => core.parseStatusJson('{bad'), /JSON/);
  assert.throws(() => core.parseStatusJson(JSON.stringify({ ...status, schemaVersion: 2 })), /schema/);
  assert.throws(() => core.parseStatusJson(JSON.stringify({ schemaVersion: 1 })), /必須/);
});

test('laneVisual は watching/stale/verdict の優先順で表示を決める', () => {
  const lane = { topic: 'auth', path: 'lanes/auth.md', headings: [], report: null, stale: false };
  assert.equal(core.laneVisual(lane, false).kind, 'unobserved');
  lane.report = { path: 'reports/auth-1.md', verdict: 'pass', date: null };
  assert.equal(core.laneVisual(lane, false).kind, 'pass');
  lane.stale = true;
  assert.equal(core.laneVisual(lane, false).kind, 'stale');
  assert.equal(core.laneVisual(lane, true).kind, 'watching');
});

test('Debouncer は連続要求を1回にまとめる', async () => {
  let calls = 0;
  const debouncer = new core.Debouncer(20, () => { calls++; });
  debouncer.schedule();
  debouncer.schedule();
  debouncer.schedule();
  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.equal(calls, 1);
  debouncer.dispose();
});

test('runProcess は非ゼロ終了とstderrを返す', async () => {
  const result = await runProcess({
    command: process.execPath,
    args: ['-e', 'process.stderr.write("failure"); process.exit(7)'],
  });
  assert.equal(result.code, 7);
  assert.equal(result.stderr, 'failure');
  assert.equal(result.cancelled, false);
});

test('runProcess はキャンセル時に子プロセスを停止する', async () => {
  const result = await runProcess({
    command: process.execPath,
    args: ['-e', 'setInterval(() => {}, 1000)'],
    registerCancellation: (cancel) => setTimeout(cancel, 30),
  });
  assert.equal(result.cancelled, true);
});
