'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const aide = require('../aide.js');
const proposals = require('../proposals.js');
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

function laneWithObserveLevel(level) {
  return [
    '<!-- mdtalk protocol',
    `observe-level: ${level}`,
    '-->',
    '',
    LANE_CONTENT,
  ].join('\n');
}

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

test('parseBackendResponse はログ混じりの codex 風出力から JSON を抽出する', () => {
  // codex exec はバナー・進行ログのあとに最終メッセージを stdout へ出す
  const noisy = [
    'OpenAI Codex v0.142.5',
    'workdir: C:\\tmp\\x',
    'model: gpt-x',
    'thinking {深さ: 3} ...',
    '{"verdict":"pass","conflicts":[],"separability":{"ok":true,"detail":"依存は {口} で明示"},"report":"# ok"}',
    'tokens used: 1234',
  ].join('\n');
  const obj = aide.parseBackendResponse(noisy);
  assert.strictEqual(obj.verdict, 'pass');
  assert.ok(obj.separability.ok);
  // 純粋な JSON / claude envelope は従来どおり
  assert.deepStrictEqual(aide.parseBackendResponse('{"verdict":"fail"}'), { verdict: 'fail' });
  assert.deepStrictEqual(
    aide.parseBackendResponse(JSON.stringify({ type: 'result', result: '{"verdict":"pass"}' })),
    { verdict: 'pass' });
  // JSON が無ければ throw
  assert.throws(() => aide.parseBackendResponse('ただの文章'));
});

test('decodeBackendOutput はUTF-8とWindowsのShift-JIS出力を復号する', () => {
  assert.strictEqual(
    aide.decodeBackendOutput([Buffer.from('日本語エラー', 'utf8')]),
    '日本語エラー');
  // Shift-JISの「テスト」: 83 65 / 83 58 / 83 67
  assert.strictEqual(
    aide.decodeBackendOutput([Buffer.from([0x83, 0x65, 0x83, 0x58, 0x83, 0x67])]),
    'テスト');
});

test('resolveObserveLevel は未宣言を strict、ヘッダ宣言を light として解決する', () => {
  assert.deepStrictEqual(
    aide.resolveObserveLevel(LANE_CONTENT),
    { level: 'strict', source: 'default', line: null });
  assert.deepStrictEqual(
    aide.resolveObserveLevel(laneWithObserveLevel('light')),
    { level: 'light', source: 'declared', line: 2 });
  assert.strictEqual(
    aide.resolveObserveLevel(LANE_CONTENT + '\nobserve-level: light\n').level,
    'strict',
    '本文中の文字列は宣言として扱わない');
});

test('resolveObserveLevel は未知値・空値・重複宣言を拒否する', () => {
  assert.throws(() => aide.resolveObserveLevel(laneWithObserveLevel('draft')), /draft.*light, strict/);
  assert.throws(() => aide.resolveObserveLevel(laneWithObserveLevel('')), /\(空\)/);
  const duplicate = [
    '<!-- mdtalk protocol',
    'observe-level: light',
    'observe-level: light',
    '-->',
  ].join('\n');
  assert.throws(() => aide.resolveObserveLevel(duplicate), /複数宣言/);
});

test('buildObserverPrompt は light で実装時判断を許容し分割可能性を合否から外す', () => {
  const base = { masterText: '', laneRel: 'lanes/x.md', laneText: '設計', others: [] };
  const light = aide.buildObserverPrompt({
    ...base,
    observeLevel: { level: 'light', source: 'declared', line: 2 },
  });
  assert.ok(light.includes('実装時に安全に決められる詳細'));
  assert.ok(light.includes('分割可能性は合否条件から除外'));
  assert.ok(light.includes('"checked":false'));
  assert.ok(!light.includes('このセクション単独で実装単位として成立'));

  const strict = aide.buildObserverPrompt({
    ...base,
    observeLevel: { level: 'strict', source: 'default', line: null },
  });
  assert.ok(strict.includes('このセクション単独で実装単位として成立'));
  assert.ok(strict.includes('"checked":true'));
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
  const knowledge = path.join(d, 'design', 'lanes', '_knowledge.md');
  assert.ok(fs.existsSync(knowledge));
  assert.ok(fs.readFileSync(knowledge, 'utf8').includes('確定済みの共通知識'));
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
  const knowledge = fs.readFileSync(path.join(d, 'design', 'lanes', '_knowledge.md'), 'utf8');
  assert.ok(knowledge.includes('### auth.md'));
  // 二重作成は拒否
  assert.strictEqual(run(d, ['lane', 'auth']).status, 1);
});

test('proposal create は人間の判断後だけ目的付き子レーンを作る', () => {
  const proposalBlock = proposals.formatProposalBlock({
    topic: 'session-policy',
    title: 'セッションポリシー',
    reason: '認証方式と独立して有効期限・失効を決められるため',
    goal: 'セッションの有効期限と失効条件を決める',
    scope: '有効期限、更新、強制失効',
    dependencies: ['auth'],
    createdAt: 'D',
  });
  const content = LANE_CONTENT + '\n' + proposalBlock.join('\n') + '\n';
  const d = setup(content);
  const proposal = proposals.parseProposalBlocks(content)[0];

  assert.ok(!fs.existsSync(path.join(d, 'design', 'lanes', 'session-policy.md')),
    '提案だけではファイルを作らない');
  const result = run(d, ['proposal', LANE, proposal.id, 'create']);
  assert.strictEqual(result.status, 0, result.stderr);

  const child = fs.readFileSync(path.join(d, 'design', 'lanes', 'session-policy.md'), 'utf8');
  assert.ok(child.includes('parent: lanes/auth.md'));
  assert.ok(child.includes(`proposal: ${proposal.id}`));
  assert.ok(child.includes('セッションの有効期限と失効条件を決める'));
  assert.ok(child.includes('認証方式と独立して'));
  assert.ok(child.includes('## 品質目標・制約'), '構造化された設計テンプレートを使う');

  const parent = fs.readFileSync(path.join(d, LANE), 'utf8');
  const decided = proposals.parseProposalBlocks(parent)[0];
  assert.strictEqual(decided.status, 'created');
  assert.strictEqual(decided.childLane, 'lanes/session-policy.md');

  const status = JSON.parse(run(d, ['status', '--json']).stdout);
  const auth = status.lanes.find((lane) => lane.topic === 'auth');
  assert.strictEqual(auth.proposals[0].status, 'created');
});

test('proposal は保留後に再判断でき、続行・却下は確定状態になる', () => {
  const block = proposals.formatProposalBlock({
    topic: 'audit', title: '監査', reason: '独立した関心事', goal: '監査方針を決める',
  });
  const d = setup(LANE_CONTENT + '\n' + block.join('\n') + '\n');
  const id = proposals.parseProposalBlocks(block.join('\n'))[0].id;
  assert.strictEqual(run(d, ['proposal', LANE, id, 'defer']).status, 0);
  assert.strictEqual(proposals.parseProposalBlocks(fs.readFileSync(path.join(d, LANE), 'utf8'))[0].status, 'deferred');
  assert.strictEqual(run(d, ['proposal', LANE, id, 'continue']).status, 0);
  assert.strictEqual(proposals.parseProposalBlocks(fs.readFileSync(path.join(d, LANE), 'utf8'))[0].status, 'continued');
  assert.strictEqual(run(d, ['proposal', LANE, id, 'reject']).status, 1, '確定後の再判断は拒否する');
});

test('accept は未判断または保留中のレーン分割提案を拒否する', () => {
  const block = proposals.formatProposalBlock({
    topic: 'audit', title: '監査', reason: '独立した関心事', goal: '監査方針を決める',
  });
  const d = setup(LANE_CONTENT + '\n' + block.join('\n') + '\n');
  const id = proposals.parseProposalBlocks(block.join('\n'))[0].id;
  assert.strictEqual(run(d, ['observe', LANE]).status, 0);
  let result = run(d, ['accept', LANE]);
  assert.strictEqual(result.status, 1);
  assert.ok(result.stderr.includes('未判断のレーン分割提案'));
  assert.strictEqual(run(d, ['proposal', LANE, id, 'defer']).status, 0);
  result = run(d, ['accept', LANE, '--force']);
  assert.strictEqual(result.status, 1, 'forceでも人間の分割判断は迂回しない');
});

test('observe はレポートを生成する（verdict/laneHash 付き）', () => {
  const d = setup(LANE_CONTENT);
  const logFile = path.join(d, 'mock.log');
  const r = run(d, ['observe', LANE], { MOCK_LOG: logFile });
  assert.strictEqual(r.status, 0, r.stderr);
  const report = fs.readFileSync(path.join(d, 'design', 'reports', 'auth-1.md'), 'utf8');
  assert.ok(report.includes('verdict: pass'));
  assert.ok(/laneHash: [0-9a-f]{64}/.test(report));
  assert.ok(report.includes('observeLevel: strict'));
  // 観察者が呼ばれたことをログで確認
  const calls = fs.readFileSync(logFile, 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(calls.length, 1);
  assert.strictEqual(calls[0].role, 'observer');
  const knowledge = fs.readFileSync(path.join(d, 'design', 'lanes', '_knowledge.md'), 'utf8');
  assert.ok(knowledge.includes('auth.md — pass'));
  // 2回目は連番
  run(d, ['observe', LANE]);
  assert.ok(fs.existsSync(path.join(d, 'design', 'reports', 'auth-2.md')));
});

test('observe-level light は実装時判断の詳細を合否から外し、レベルを伝播する', () => {
  const d = setup(laneWithObserveLevel('light'));
  const logFile = path.join(d, 'mock.log');
  const r = run(d, ['observe', LANE], {
    MOCK_LOG: logFile,
    MOCK_OBSERVER_SEPARABILITY: 'fail',
  });
  assert.strictEqual(r.status, 0, r.stderr);
  const report = fs.readFileSync(path.join(d, 'design', 'reports', 'auth-1.md'), 'utf8');
  assert.ok(report.includes('verdict: pass'));
  assert.ok(report.includes('observeLevel: light'));
  assert.ok(report.includes('分割可能性: スキップ'));

  const call = JSON.parse(fs.readFileSync(logFile, 'utf8').trim());
  assert.ok(call.prompt.includes('実装時に安全に決められる詳細'));
  assert.ok(!call.prompt.includes('このセクション単独で実装単位として成立'));

  let status = JSON.parse(run(d, ['status', '--json']).stdout);
  assert.strictEqual(status.lanes[0].observeLevel, 'light');
  assert.strictEqual(status.lanes[0].observeLevelSource, 'declared');
  assert.strictEqual(status.lanes[0].report.observeLevel, 'light');

  const accepted = run(d, ['accept', LANE]);
  assert.strictEqual(accepted.status, 0, accepted.stderr);
  const entries = aide.parsePoolEntries(fs.readFileSync(path.join(d, 'design', 'pool.md'), 'utf8'));
  assert.strictEqual(entries[0].meta.observeLevel, 'light');
  status = JSON.parse(run(d, ['status', '--json']).stdout);
  assert.strictEqual(status.pool.entries[0].observeLevel, 'light');
});

test('observe-level strict は分割可能性NGをfailにする', () => {
  const d = setup(LANE_CONTENT);
  const r = run(d, ['observe', LANE], { MOCK_OBSERVER_SEPARABILITY: 'fail' });
  assert.strictEqual(r.status, 0, r.stderr);
  const report = fs.readFileSync(path.join(d, 'design', 'reports', 'auth-1.md'), 'utf8');
  assert.ok(report.includes('verdict: fail'));
  assert.ok(report.includes('分割可能性: NG'));
});

test('observe-level light でも矛盾があればfailにする', () => {
  const d = setup(laneWithObserveLevel('light'));
  const r = run(d, ['observe', LANE], { MOCK_OBSERVER_VERDICT: 'fail' });
  assert.strictEqual(r.status, 0, r.stderr);
  const report = fs.readFileSync(path.join(d, 'design', 'reports', 'auth-1.md'), 'utf8');
  assert.ok(report.includes('verdict: fail'));
  assert.ok(report.includes('分割可能性: スキップ'));
  assert.ok(report.includes('lanes/other.md'));
  const accepted = run(d, ['accept', LANE]);
  assert.strictEqual(accepted.status, 1);
  assert.ok(accepted.stderr.includes('不合格'));
});

test('不正な observe-level は観察者を起動せずエラーにする', () => {
  const d = setup(laneWithObserveLevel('draft'));
  const logFile = path.join(d, 'mock.log');
  const r = run(d, ['observe', LANE], { MOCK_LOG: logFile });
  assert.strictEqual(r.status, 1);
  assert.ok(r.stderr.includes("draft"));
  assert.ok(r.stderr.includes('light, strict'));
  assert.ok(!fs.existsSync(logFile));
  assert.ok(!fs.existsSync(path.join(d, 'design', 'reports', 'auth-1.md')));
});

test('旧レポートは observeLevel 未記録でも strict としてstatusに返す', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE]);
  const reportFile = path.join(d, 'design', 'reports', 'auth-1.md');
  const legacy = fs.readFileSync(reportFile, 'utf8')
    .replace(/^observeLevel:.*\n/m, '')
    .replace(/^observeLevelSource:.*\n/m, '');
  fs.writeFileSync(reportFile, legacy);
  const status = JSON.parse(run(d, ['status', '--json']).stdout);
  assert.strictEqual(status.lanes[0].report.observeLevel, 'strict');
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
  const knowledge = fs.readFileSync(path.join(d, 'design', 'lanes', '_knowledge.md'), 'utf8');
  assert.ok(knowledge.includes('JWT'), '承認済み・統合待ちの内容が共有知識へ反映される');
});

test('knowledge は master の手編集を共有知識へ同期する', () => {
  const d = tmpdir();
  fs.writeFileSync(path.join(d, 'README.md'), '# 製品概要\n\n共有機能を持つ。\n');
  fs.writeFileSync(path.join(d, '.aide-context.md'), '# チーム規約\n\nAPIは後方互換にする。\n');
  run(d, ['init']);
  fs.appendFileSync(path.join(d, 'design', 'master.md'), '\n共通APIは v2。\n');
  const r = run(d, ['knowledge']);
  assert.strictEqual(r.status, 0, r.stderr);
  const text = fs.readFileSync(path.join(d, 'design', 'lanes', '_knowledge.md'), 'utf8');
  assert.ok(text.includes('共通APIは v2。'));
  assert.ok(text.includes('共有機能を持つ。'), 'プロジェクトREADMEも共有される');
  assert.ok(text.includes('APIは後方互換にする。'), '明示コンテキストも共有される');
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
  const knowledge = fs.readFileSync(path.join(d, 'design', 'lanes', '_knowledge.md'), 'utf8');
  assert.ok(knowledge.includes('マスター設計書（統合済み）'));
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

test('観察者の非ゼロ終了はstderrとexit codeを表示する', () => {
  const d = setup(LANE_CONTENT);
  const r = run(d, ['observe', LANE], { MOCK_OBSERVER_VERDICT: 'exit' });
  assert.strictEqual(r.status, 1);
  assert.ok(r.stderr.includes('exit 7'));
  assert.ok(r.stderr.includes('mock observer could not start'));
  assert.ok(!r.stderr.includes('JSONとして解釈'));
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

test('status --json は未初期化状態も機械可読で返す', () => {
  const d = tmpdir();
  const r = run(d, ['status', '--json']);
  assert.strictEqual(r.status, 0, r.stderr);
  const s = JSON.parse(r.stdout);
  assert.strictEqual(s.schemaVersion, 1);
  assert.strictEqual(s.initialized, false);
  assert.strictEqual(s.master.exists, false);
  assert.deepStrictEqual(s.lanes, []);
  assert.strictEqual(s.pool.count, 0);
  assert.strictEqual(s.archive.count, 0);
});

test('status --json は lane/report/stale/pool/archive を返す', () => {
  const d = setup(LANE_CONTENT);
  run(d, ['observe', LANE]);
  run(d, ['accept', LANE, '--section', '認証フロー']);

  let r = run(d, ['status', '--json']);
  assert.strictEqual(r.status, 0, r.stderr);
  let s = JSON.parse(r.stdout);
  assert.strictEqual(s.initialized, true);
  assert.strictEqual(s.master.path, 'master.md');
  assert.strictEqual(s.lanes.length, 1);
  assert.strictEqual(s.lanes[0].topic, 'auth');
  assert.strictEqual(s.lanes[0].report.verdict, 'pass');
  assert.strictEqual(s.lanes[0].stale, false);
  assert.deepStrictEqual(
    s.lanes[0].headings.map((h) => h.title),
    ['認証フロー', 'ストレージ']);
  assert.strictEqual(s.pool.count, 1);
  assert.strictEqual(s.pool.entries[0].section, '認証フロー');

  fs.appendFileSync(path.join(d, LANE), '\n観察後の変更\n');
  r = run(d, ['status', '--json']);
  s = JSON.parse(r.stdout);
  assert.strictEqual(s.lanes[0].stale, true);

  run(d, ['integrate']);
  r = run(d, ['status', '--json']);
  s = JSON.parse(r.stdout);
  assert.strictEqual(s.pool.count, 0);
  assert.strictEqual(s.archive.count, 1);
  assert.strictEqual(s.archive.integrated, 1);
});
