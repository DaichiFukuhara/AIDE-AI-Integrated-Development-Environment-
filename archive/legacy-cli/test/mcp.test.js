'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const mcp = require('../mcp.js');
const AIDE = path.join(__dirname, '..', 'aide.js');
const MOCK_OBSERVER = path.join(__dirname, '..', 'fixtures', 'mock-observer.js');
const MOCK_MASTER = path.join(__dirname, '..', 'fixtures', 'mock-master.js');

function tmpdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'aide-mcp-test-'));
}

function run(cwd, args) {
  return spawnSync(process.execPath, [AIDE, ...args], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      AIDE_OBSERVER_CMD: `node "${MOCK_OBSERVER}"`,
      AIDE_MASTER_CMD: `node "${MOCK_MASTER}"`,
    },
  });
}

/** `aide mcp` を子プロセスで起動し、行区切りJSONを流して応答を集める。 */
function rpc(designRoot, messages) {
  const r = spawnSync(process.execPath, [AIDE, 'mcp', '--root', designRoot], {
    input: `${messages.map((m) => JSON.stringify(m)).join('\n')}\n`,
    encoding: 'utf8',
    env: { ...process.env },
  });
  const lines = r.stdout.split('\n').filter((l) => l.trim());
  return { raw: r, stdout: r.stdout, stderr: r.stderr, lines };
}

/** プロセスを起こさず、handleMessage を直接叩く（判定ロジック用）。 */
function call(designRoot, name, args = {}) {
  const res = mcp.handleMessage({ designRoot: fs.realpathSync(designRoot) }, {
    jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args },
  });
  return res;
}

function callOk(designRoot, name, args = {}) {
  const res = call(designRoot, name, args);
  assert.ok(!res.error, `JSON-RPCエラー: ${JSON.stringify(res.error)}`);
  assert.ok(!res.result.isError, `ツールエラー: ${JSON.stringify(res.result.content)}`);
  return res.result.structuredContent;
}

const LANE_CONTENT = [
  '# レーン: auth',
  '<!-- aide:lane',
  'テスト用',
  '-->',
  '',
  '## セッション失効時のデータ保持',
  '',
  '再認証後に編集中データを復元する。',
  '',
  '## ストレージ選定',
  '',
  'セッションは Redis に置く。',
  '',
].join('\n');

/** design/ を初期化し、レーンを1本置く。 */
function setup(laneContent = LANE_CONTENT) {
  const d = tmpdir();
  const r = run(d, ['init']);
  assert.strictEqual(r.status, 0, r.stderr);
  fs.writeFileSync(path.join(d, 'design', 'lanes', 'auth.md'), laneContent);
  return { cwd: d, designRoot: path.join(d, 'design') };
}

/** observe → accept まで通してプールに承認済みエントリを作る。 */
function setupAccepted() {
  const s = setup();
  let r = run(s.cwd, ['observe', path.join('design', 'lanes', 'auth.md')]);
  assert.strictEqual(r.status, 0, r.stderr);
  r = run(s.cwd, ['accept', path.join('design', 'lanes', 'auth.md'),
    '--section', 'セッション失効時のデータ保持']);
  assert.strictEqual(r.status, 0, r.stderr);
  return s;
}

/** 保護対象ファイルのハッシュ表（所有権制約の回帰用）。 */
function protectedHashes(designRoot) {
  const { sha256 } = require('../mdtalk.js');
  const out = {};
  for (const rel of ['master.md', 'pool.md', 'pool-archive.md']) {
    const abs = path.join(designRoot, rel);
    if (fs.existsSync(abs)) out[rel] = sha256(fs.readFileSync(abs, 'utf8'));
  }
  const lanesDir = path.join(designRoot, 'lanes');
  for (const f of fs.readdirSync(lanesDir)) {
    out[`lanes/${f}`] = sha256(fs.readFileSync(path.join(lanesDir, f), 'utf8'));
  }
  return out;
}

// ---------------------------------------------------------------------------
// プロトコル
// ---------------------------------------------------------------------------

test('initialize → tools/list → tools/call の往復が成立する', () => {
  const s = setup();
  const { lines } = rpc(s.designRoot, [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
    { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'aide_status', arguments: {} } },
  ]);
  assert.strictEqual(lines.length, 3);

  const init = JSON.parse(lines[0]);
  assert.strictEqual(init.result.protocolVersion, '2025-06-18');
  assert.strictEqual(init.result.serverInfo.name, 'aide');

  const list = JSON.parse(lines[1]);
  assert.deepStrictEqual(list.result.tools.map((t) => t.name),
    ['aide_check_design', 'aide_get_section', 'aide_status']);

  const called = JSON.parse(lines[2]);
  assert.strictEqual(called.result.structuredContent.schemaVersion, 1);
});

test('stdout には JSON-RPC 以外が一切出ない（ログ混入の回帰）', () => {
  const s = setup();
  const { lines } = rpc(s.designRoot, [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
    { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'aide_status', arguments: {} } },
  ]);
  for (const line of lines) {
    const parsed = JSON.parse(line); // 非JSONが混ざれば throw する
    assert.strictEqual(parsed.jsonrpc, '2.0');
  }
});

test('通知には応答せず、id:0 は通知扱いしない', () => {
  const s = setup();
  const { lines } = rpc(s.designRoot, [
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    { jsonrpc: '2.0', method: 'notifications/cancelled', params: { requestId: 9 } },
    { jsonrpc: '2.0', id: 0, method: 'ping' },
  ]);
  assert.strictEqual(lines.length, 1, '通知に応答している');
  assert.strictEqual(JSON.parse(lines[0]).id, 0);
});

test('壊れたJSONは -32700、未知メソッドは -32601', () => {
  const s = setup();
  const r = spawnSync(process.execPath, [AIDE, 'mcp', '--root', s.designRoot], {
    input: 'not json\n{"jsonrpc":"2.0","id":1,"method":"nope/xyz"}\n',
    encoding: 'utf8',
  });
  const lines = r.stdout.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
  assert.strictEqual(lines[0].error.code, -32700);
  assert.strictEqual(lines[1].error.code, -32601);
});

test('未対応のprotocolVersionにはサーバーの最新版を返す', () => {
  assert.strictEqual(mcp.negotiateProtocol('2024-11-05'), '2024-11-05');
  assert.strictEqual(mcp.negotiateProtocol('1999-01-01'), mcp.LATEST_PROTOCOL_VERSION);
  assert.strictEqual(mcp.negotiateProtocol(undefined), mcp.LATEST_PROTOCOL_VERSION);
});

// ---------------------------------------------------------------------------
// authority と outcome
// ---------------------------------------------------------------------------

test('下書きレーンしか無いとき draft_only で停止する', () => {
  const s = setup();
  const out = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持をどうするか実装したい' });
  assert.strictEqual(out.outcome, 'draft_only');
  assert.strictEqual(out.stopRequired, true);
  assert.strictEqual(out.approvedSections.length, 0);
  assert.ok(out.relatedDrafts.some((d) => d.authority === 'draft_lane'));
});

test('承認済みがあれば covered、下書き併存はブロックしない', () => {
  const s = setupAccepted();
  const out = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持を実装したい' });
  assert.strictEqual(out.outcome, 'covered');
  assert.strictEqual(out.stopRequired, false);
  assert.ok(out.approvedSections.every((x) => x.authority === 'accepted_pool' || x.authority === 'master'));
  // レーンは承認後も残る。これで停止させると警告が常態化する。
  assert.ok(out.relatedDrafts.length > 0, '下書きが relatedDrafts に出ていない');
  const sig = out.signals.find((x) => x.code === 'RELATED_DRAFT_EXISTS');
  assert.ok(sig && sig.blocking === false, '下書きの併存がブロッキングになっている');
});

test('弱い一致では covered にせず unknown で止める', () => {
  const s = setupAccepted();
  // 'ストレージ' だけがかすった状態。実装許可を出してはいけない。
  const out = callOk(s.designRoot, 'aide_check_design', { task: 'ストレージ' });
  assert.notStrictEqual(out.outcome, 'covered');
  assert.strictEqual(out.stopRequired, true);
  assert.strictEqual(out.matchConfidence, 'weak');
});

test('一致ゼロは missing と断定せず unknown を返す', () => {
  const s = setup();
  const out = callOk(s.designRoot, 'aide_check_design', { task: '決済のリファンド処理を作りたい' });
  assert.strictEqual(out.outcome, 'unknown');
  assert.strictEqual(out.stopRequired, true);
});

// ---------------------------------------------------------------------------
// sectionId
// ---------------------------------------------------------------------------

test('空ハッシュのsectionIdでstale検査を迂回できない', () => {
  const s = setup();
  const payload = Buffer.from(JSON.stringify({ f: 'master.md', h: '目的 / 背景', n: 0 }), 'utf8')
    .toString('base64url');
  for (const bad of [`${payload}.`, `${payload}.zzz`, `${payload}.ABCDEF123456`]) {
    const res = call(s.designRoot, 'aide_get_section', { sectionId: bad });
    assert.ok(res.error, `不正ハッシュが受理された: ${bad}`);
    assert.strictEqual(res.error.code, -32602);
  }
});

test('sectionId発行後に本文が変わると stale になる', () => {
  const s = setup();
  const found = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持を実装したい' });
  const id = found.relatedDrafts[0].sectionId;

  const before = callOk(s.designRoot, 'aide_get_section', { sectionId: id });
  assert.strictEqual(before.stale, false);

  const lane = path.join(s.designRoot, 'lanes', 'auth.md');
  fs.writeFileSync(lane, fs.readFileSync(lane, 'utf8').replace('復元する', '破棄する'));

  const after = callOk(s.designRoot, 'aide_get_section', { sectionId: id });
  assert.strictEqual(after.stale, true);
  assert.strictEqual(after.stopRequired, true);
});

test('pool に同名セクションが複数あっても entry id で正しく引ける', () => {
  const s = setupAccepted();
  // 同じ section 名でもう1件、内容の違うエントリを足す。
  const poolPath = path.join(s.designRoot, 'pool.md');
  const text = fs.readFileSync(poolPath, 'utf8');
  const block = /<!-- aide:entry\r?\n[\s\S]*?<!-- aide:end -->/.exec(text)[0];
  const second = block
    .replace(/id:\s*\S+/, 'id: DUP-0002')
    .replace('再認証後に編集中データを復元する。', '二件目の別内容。');
  fs.writeFileSync(poolPath, `${text}\n${second}\n`);

  const index = mcp.buildDesignIndex(fs.realpathSync(s.designRoot));
  const pooled = index.filter((e) => e.authority === 'accepted_pool');
  assert.strictEqual(pooled.length, 2, 'pool エントリが2件に増えていない');
  assert.notStrictEqual(pooled[0].sectionId, pooled[1].sectionId, 'sectionId が衝突している');

  const bodies = pooled.map((e) => callOk(s.designRoot, 'aide_get_section',
    { sectionId: e.sectionId }).content);
  assert.notStrictEqual(bodies[0], bodies[1], '2件目が1件目の本文を返している');
});

test('同名見出しが複数あっても出現番号で区別される', () => {
  const s = setup([
    '# レーン: auth',
    '',
    '## テスト方針',
    '一つ目の本文。',
    '',
    '## 個別の論点',
    '',
    '## テスト方針',
    '二つ目の本文。',
    '',
  ].join('\n'));
  const index = mcp.buildDesignIndex(fs.realpathSync(s.designRoot))
    .filter((e) => e.title === 'テスト方針');
  assert.strictEqual(index.length, 2);
  const a = callOk(s.designRoot, 'aide_get_section', { sectionId: index[0].sectionId });
  const b = callOk(s.designRoot, 'aide_get_section', { sectionId: index[1].sectionId });
  assert.match(a.content, /一つ目/);
  assert.match(b.content, /二つ目/);
});

test('本文が切り詰められたら実装許可を出さない', () => {
  const long = ['# レーン: auth', '', '## セッション失効時のデータ保持', '',
    'あ'.repeat(30000), '', '最後に重要な制約がある。', ''].join('\n');
  const s = setup(long);
  const found = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持を実装したい' });
  const got = callOk(s.designRoot, 'aide_get_section',
    { sectionId: found.relatedDrafts[0].sectionId });
  assert.strictEqual(got.truncated, true);
  assert.strictEqual(got.stopRequired, true, '後半を読めていないのに実装許可が出ている');
  assert.ok(got.warnings.some((w) => w.includes('先頭')));
});

test('承認済み候補が上限を超えたら停止し、総数を返す', () => {
  const s = setupAccepted();
  // master.md に一致する見出しを大量に足して上限超えを作る。
  // 語が2つ当たって score>=3 になるようにし、covered 側の分岐を通す。
  const masterPath = path.join(s.designRoot, 'master.md');
  const extra = Array.from({ length: 12 }, (_, i) =>
    `\n## セッション失効時のデータ保持 再認証 その${i}\n\n本文${i}。\n`).join('');
  fs.appendFileSync(masterPath, extra);

  const out = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持と再認証の処理を実装したい' });
  assert.strictEqual(out.matchConfidence, 'strong');
  assert.strictEqual(out.approvedSectionsTruncated, true);
  assert.ok(out.approvedMatchCount > out.approvedSections.length);
  assert.strictEqual(out.stopRequired, true, '候補を切ったのに実装許可が出ている');
  const sig = out.signals.find((x) => x.code === 'RESULTS_TRUNCATED');
  assert.ok(sig && sig.blocking === true);
});

test('候補を切ったことは weak 分岐でも報告される', () => {
  const s = setupAccepted();
  const masterPath = path.join(s.designRoot, 'master.md');
  const extra = Array.from({ length: 12 }, (_, i) =>
    `\n## セッション失効時のデータ保持 その${i}\n\n本文${i}。\n`).join('');
  fs.appendFileSync(masterPath, extra);

  // 語が1つしか当たらず、その語が索引中に広く出るので weak になる。
  const out = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持を実装したい' });
  assert.strictEqual(out.matchConfidence, 'weak');
  assert.strictEqual(out.stopRequired, true);
  assert.strictEqual(out.approvedSectionsTruncated, true, 'weak 分岐で切り捨てが隠れている');
  assert.ok(out.approvedMatchCount > out.approvedSections.length);
});

test('一般語が1つ当たっただけでは strong にしない', () => {
  const index = [
    { title: 'storage 設計', searchText: 'storage 設計' },
    { title: 'storage 移行', searchText: 'storage 移行' },
    { title: 'storage 監視', searchText: 'storage 監視' },
  ];
  const df = mcp.documentFrequency(index);
  const scored = index.map((e) => ({ entry: e, ...mcp.scoreEntry(e, 'storage を直したい') }))
    .filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  // storage は STOP_TERMS 入りなので、そもそも一致語にならない
  assert.strictEqual(mcp.confidenceOf(scored, df), 'weak');

  // STOP_TERMS 外でも、索引内に広く出る長語なら strong にしない
  const common = [
    { title: 'セッション管理 A', searchText: 'セッション管理 A' },
    { title: 'セッション管理 B', searchText: 'セッション管理 B' },
    { title: 'セッション管理 C', searchText: 'セッション管理 C' },
  ];
  const df2 = mcp.documentFrequency(common);
  const scored2 = common.map((e) => ({ entry: e, ...mcp.scoreEntry(e, 'セッション管理を直す') }))
    .filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  assert.strictEqual(mcp.confidenceOf(scored2, df2), 'weak', '広く出る語で strong になった');
});

test('親セクションが一致したら子セクションは畳む', () => {
  const s = setup([
    '# レーン: auth',
    '',
    '## セッション失効時のデータ保持',
    '概要。',
    '',
    '### レベル定義',
    '子1。',
    '',
    '### 解決ロジック',
    '子2。',
    '',
    '## 無関係な論点',
    '別件。',
    '',
  ].join('\n'));
  const out = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持を実装したい' });
  const titles = out.relatedDrafts.map((d) => d.title);
  assert.ok(titles.includes('セッション失効時のデータ保持'), '親が返っていない');
  assert.ok(!titles.includes('レベル定義'), '子が親と重複して返っている');
  assert.ok(!titles.includes('解決ロジック'), '子が親と重複して返っている');
});

test('子固有の語で当たった子は畳まない', () => {
  const s = setup([
    '# レーン: auth',
    '',
    '## セッション失効時のデータ保持',
    '概要。',
    '',
    '### リフレッシュトークン再発行',
    '子固有の内容。',
    '',
  ].join('\n'));
  const out = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持のリフレッシュトークン再発行を実装したい' });
  const titles = out.relatedDrafts.map((d) => d.title);
  assert.ok(titles.includes('リフレッシュトークン再発行'),
    '子固有の語で当たった子が畳まれている');
});

test('別の枝の同名見出しでは子を畳まない（キーは出現位置を含む）', () => {
  const s = setup([
    '# レーン: auth',
    '',
    '## 共通',
    '### セッション失効時のデータ保持',
    '一つ目。',
    '',
    '## 別の枝',
    '### 共通',
    '#### 内側',
    '二つ目。',
    '',
  ].join('\n'));
  const index = mcp.buildDesignIndex(fs.realpathSync(s.designRoot));
  const inner = index.find((e) => e.title === '内側');
  const first = index.find((e) => e.title === '共通');
  // 「内側」の祖先は2つ目の「共通」であって、1つ目ではない。
  assert.ok(!inner.ancestorIds.includes(first.key),
    '同名見出しが同一の祖先として扱われている');
});

test('poolのentry idが消えたら同名エントリへ滑らせない', () => {
  const s = setupAccepted();
  const index = mcp.buildDesignIndex(fs.realpathSync(s.designRoot));
  const pooled = index.find((e) => e.authority === 'accepted_pool');
  assert.ok(pooled, 'pool エントリがない');

  // 同じ section 名・別 id のエントリだけを残す。
  const poolPath = path.join(s.designRoot, 'pool.md');
  const text = fs.readFileSync(poolPath, 'utf8');
  fs.writeFileSync(poolPath, text.replace(/id:\s*\S+/, 'id: RENAMED-9999'));

  const got = callOk(s.designRoot, 'aide_get_section', { sectionId: pooled.sectionId });
  assert.strictEqual(got.found, false, '別idの同名エントリを返してしまった');
  assert.strictEqual(got.stopRequired, true);
});

// ---------------------------------------------------------------------------
// パス境界
// ---------------------------------------------------------------------------

test('偽造sectionIdで reports/ や pool-archive.md を読めない', () => {
  const s = setup();
  for (const rel of ['pool-archive.md', 'reports/auth-1.md', '../package.json', 'lanes/../master.md']) {
    const payload = Buffer.from(JSON.stringify({ f: rel, h: '任意', n: 0 }), 'utf8').toString('base64url');
    const res = call(s.designRoot, 'aide_get_section', { sectionId: `${payload}.000000000000` });
    assert.ok(res.error, `境界外が読めてしまった: ${rel}`);
    assert.strictEqual(res.error.code, -32602);
  }
});

test('許可リストは master / pool / 会話レーンだけを通す', () => {
  assert.ok(mcp.isReadableDesignFile('master.md'));
  assert.ok(mcp.isReadableDesignFile('pool.md'));
  assert.ok(mcp.isReadableDesignFile('lanes/auth.md'));
  assert.ok(!mcp.isReadableDesignFile('lanes/_knowledge.md'));
  assert.ok(!mcp.isReadableDesignFile('lanes/auth.minutes.md'));
  assert.ok(!mcp.isReadableDesignFile('pool-archive.md'));
  assert.ok(!mcp.isReadableDesignFile('reports/auth-1.md'));
  assert.ok(!mcp.isReadableDesignFile('lanes/sub/deep.md'));
});

test('root外へのsymlinkレーンは索引にも本文にも出ない', { skip: process.platform === 'win32' && !process.env.CI }, () => {
  const s = setup();
  const outside = path.join(tmpdir(), 'secret.md');
  fs.writeFileSync(outside, '# 秘密\n\n## 秘密の設計\n\n外に置いた内容。\n');
  try {
    fs.symlinkSync(outside, path.join(s.designRoot, 'lanes', 'leak.md'));
  } catch {
    return; // symlink 権限がなければスキップ
  }
  const index = mcp.buildDesignIndex(fs.realpathSync(s.designRoot));
  assert.ok(!index.some((e) => e.title === '秘密の設計'), 'root外の内容が索引に入った');
});

test('aide_status は pool-archive / reports の境界も検証する', () => {
  const s = setupAccepted();
  // 正常時は通る
  assert.doesNotThrow(() => mcp.assertStatusBoundary(fs.realpathSync(s.designRoot)));

  // reports 配下に root 外への symlink があれば拒否する
  const outside = path.join(tmpdir(), 'outside-report.md');
  fs.writeFileSync(outside, '# 外部\n');
  const link = path.join(s.designRoot, 'reports', 'leak.md');
  try {
    fs.symlinkSync(outside, link);
  } catch {
    return; // symlink 権限がなければスキップ
  }
  assert.throws(() => mcp.assertStatusBoundary(fs.realpathSync(s.designRoot)), /root 外/);
});

test('authorityOf は許可リスト外で失敗する（既定値に落ちない）', () => {
  assert.strictEqual(mcp.authorityOf('master.md'), 'master');
  assert.strictEqual(mcp.authorityOf('pool.md'), 'accepted_pool');
  assert.strictEqual(mcp.authorityOf('lanes/auth.md'), 'draft_lane');
  assert.throws(() => mcp.authorityOf('reports/auth-1.md'), /authority/);
  assert.throws(() => mcp.authorityOf('pool-archive.md'), /authority/);
});

test('--root は絶対パス必須', () => {
  assert.throws(() => mcp.resolveMcpRoot('design'), /絶対パス/);
  assert.throws(() => mcp.resolveMcpRoot(''), /--root/);
});

// ---------------------------------------------------------------------------
// 引数検証
// ---------------------------------------------------------------------------

test('引数の型と未知キーを拒否する', () => {
  const s = setup();
  assert.strictEqual(call(s.designRoot, 'aide_check_design', { task: 123 }).error.code, -32602);
  assert.strictEqual(call(s.designRoot, 'aide_check_design', {}).error.code, -32602);
  assert.strictEqual(call(s.designRoot, 'aide_check_design',
    { task: 'x', extra: 1 }).error.code, -32602);
  assert.strictEqual(call(s.designRoot, 'aide_check_design',
    { task: 'あ'.repeat(4001) }).error.code, -32602);
  assert.strictEqual(call(s.designRoot, 'nonexistent_tool', {}).error.code, -32602);
});

// ---------------------------------------------------------------------------
// 所有権制約
// ---------------------------------------------------------------------------

test('全ツール呼び出しの前後で保護対象ファイルが不変', () => {
  const s = setupAccepted();
  const before = protectedHashes(s.designRoot);

  const checked = callOk(s.designRoot, 'aide_check_design',
    { task: 'セッション失効時のデータ保持を実装したい' });
  for (const sec of [...checked.approvedSections, ...checked.relatedDrafts]) {
    callOk(s.designRoot, 'aide_get_section', { sectionId: sec.sectionId });
  }
  callOk(s.designRoot, 'aide_status');

  assert.deepStrictEqual(protectedHashes(s.designRoot), before,
    'MCPが master / pool / lanes を書き換えた');
});

test('observe / accept / integrate はツールとして公開されない', () => {
  const names = mcp.TOOLS.map((t) => t.name);
  for (const forbidden of ['observe', 'accept', 'integrate']) {
    assert.ok(!names.some((n) => n.includes(forbidden)),
      `人間のボタンが公開されている: ${forbidden}`);
  }
});
