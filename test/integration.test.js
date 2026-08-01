'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const MDTALK = path.join(__dirname, '..', 'mdtalk.js');
const MOCK = path.join(__dirname, '..', 'fixtures', 'mock-claude.js');

function mkTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'mdtalk-'));
}

function run(file, args, extraEnv) {
  const env = Object.assign({}, process.env, {
    MDTALK_CLAUDE_CMD: `node "${MOCK}"`,
  }, extraEnv || {});
  const res = spawnSync(process.execPath, [MDTALK, file, '--once', '--quiet', ...(args || [])], {
    env, encoding: 'utf8',
  });
  return res;
}

function countAnnotations(text) {
  return (text.match(/^> [❓💬➕🔀🧭] \*\*AI\*\*:/gmu) || []).length;
}

test('初回は注釈せずスナップショットのみ、2回目に追記段落へ注釈', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'design.md');
  fs.writeFileSync(file, '# 設計\n\n最初の段落。\n');

  // 1回目: 初期化のみ（注釈なし）
  let res = run(file, [], { MDTALK_MOCK_FIND: '追記した段落' });
  assert.strictEqual(res.status, 0);
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 0);

  // 人間が段落を追記
  fs.appendFileSync(file, '\n追記した段落です。\n');

  // 2回目: 追記段落へ注釈
  res = run(file, [], { MDTALK_MOCK_FIND: '追記した段落', MDTALK_MOCK_TEXT: '対象ユーザーは？' });
  assert.strictEqual(res.status, 0);
  const after = fs.readFileSync(file, 'utf8');
  assert.strictEqual(countAnnotations(after), 1);
  // 追記段落の直下に入っている
  const lines = after.split('\n');
  const idx = lines.findIndex((l) => l.startsWith('追記した段落'));
  assert.ok(lines.slice(idx, idx + 4).some((l) => l.startsWith('> ❓ **AI**:')));
});

test('共有知識の更新だけでも既存レーンを自動再点検する', () => {
  const workspace = mkTmp();
  const design = path.join(workspace, 'design');
  const lanes = path.join(design, 'lanes');
  fs.mkdirSync(lanes, { recursive: true });
  fs.mkdirSync(path.join(design, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(workspace, 'README.md'), '# 概要\n\n初期仕様。\n');
  fs.writeFileSync(path.join(design, 'master.md'), '# マスター\n');
  fs.writeFileSync(path.join(design, 'pool.md'), '<!-- aide:pool\n-->\n');
  fs.writeFileSync(path.join(design, 'pool-archive.md'), '<!-- aide:pool-archive\n-->\n');
  const file = path.join(lanes, 'existing.md');
  fs.writeFileSync(file, '# レーン: existing\n\n既存の決定。\n');

  let res = run(file, []);
  assert.strictEqual(res.status, 0, res.stderr);
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 0);

  // レーン本文は触らず、共有元だけを変更する。
  fs.writeFileSync(path.join(workspace, 'README.md'), '# 概要\n\n共有方式を更新した。\n');
  res = run(file, ['--no-minutes'], {
    MDTALK_MOCK_FIND: '既存の決定', MDTALK_MOCK_TEXT: '新しい共有方式との整合を確認してください。',
  });
  assert.strictEqual(res.status, 0, res.stderr);
  const after = fs.readFileSync(file, 'utf8');
  assert.strictEqual(countAnnotations(after), 1);
  assert.ok(after.includes('新しい共有方式との整合'));
});

test('注釈以外の行はバイト単位で不変（ヘッダ挿入後の比較）', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落X。\n');
  run(file, []); // 初期化（ヘッダ挿入）
  const before = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, before + '新しい段落Y。\n');
  const preAnnotate = fs.readFileSync(file, 'utf8');

  run(file, [], { MDTALK_MOCK_FIND: '新しい段落Y', MDTALK_MOCK_TEXT: 'なぜ？' });
  const after = fs.readFileSync(file, 'utf8');

  // 追加された行（注釈 blockquote と空行）を除けば元と一致
  const beforeLines = preAnnotate.split('\n');
  const afterNonAnno = after.split('\n').filter((l) => !l.startsWith('> '));
  // 元の各行が after に順序を保って残っていること
  let j = 0;
  for (const bl of beforeLines) {
    const found = afterNonAnno.indexOf(bl, j);
    assert.ok(found >= 0, `元の行が消えている: ${JSON.stringify(bl)}`);
    j = found + 1;
  }
});

test('AI の書き込みによる変更では claude が呼ばれない（再注釈なし）', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落Z。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n新段落。\n');
  run(file, [], { MDTALK_MOCK_FIND: '新段落', MDTALK_MOCK_TEXT: 't' });
  const oneNote = fs.readFileSync(file, 'utf8');
  assert.strictEqual(countAnnotations(oneNote), 1);

  // AI が書いた直後の状態でもう一度（人間編集なし）
  const res = run(file, [], { MDTALK_MOCK_FIND: '新段落', MDTALK_MOCK_TEXT: 't' });
  assert.strictEqual(res.status, 0);
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 1, '再注釈されない');
});

test('同一段落に2回目の注釈が付かない（フィンガープリント抑制）', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落A。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n段落A追記。\n'); // 変更で claude 起動
  run(file, [], { MDTALK_MOCK_FIND: '段落A追記', MDTALK_MOCK_TEXT: 'q' });
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 1);

  // 別の段落を追記して再度起動するが、mock は既注釈の「段落A追記」を返す
  fs.appendFileSync(file, '\n無関係な段落B。\n');
  run(file, [], { MDTALK_MOCK_FIND: '段落A追記', MDTALK_MOCK_TEXT: 'q' });
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 1, '同一段落は抑制');
});

test('@ai: 行が処理後 <!-- done --> に変換される', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n本文。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n@ai: この節を整理して\n');
  const res = run(file, [], { /* insertions empty by default */ });
  assert.strictEqual(res.status, 0);
  const after = fs.readFileSync(file, 'utf8');
  assert.ok(after.includes('<!-- done: この節を整理して -->'), 'done 化される');
  assert.ok(!/^@ai:/m.test(after), '@ai: 行が残らない');
});

test('空ファイル + --init で 8 節スケルトンが挿入される', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'new.md');
  fs.writeFileSync(file, '');
  const res = run(file, ['--init'], { MDTALK_MOCK_SKELETON: '1' });
  assert.strictEqual(res.status, 0);
  const after = fs.readFileSync(file, 'utf8');
  const sections = ['目的', '対象ファイル', 'インターフェース', '振る舞い',
    '受け入れ条件', 'エッジケース', 'テスト方針', 'スコープ外'];
  for (const s of sections) {
    assert.ok(after.includes(s), `節が無い: ${s}`);
  }
  assert.ok(after.includes('<!-- mdtalk'), 'プロトコルヘッダも入る');
});

test('--once は exit code 0 で終了する', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  const res = run(file, []);
  assert.strictEqual(res.status, 0);
});

test('claude 不在時はインストール案内付きで exit code 1', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init（有効な mock で）
  fs.appendFileSync(file, '\n新段落。\n');
  // claude を存在しないコマンドに差し替え
  const env = Object.assign({}, process.env, {
    MDTALK_CLAUDE_CMD: 'mdtalk-nonexistent-binary-xyz',
  });
  const res = spawnSync(process.execPath, [MDTALK, file, '--once'], { env, encoding: 'utf8' });
  assert.strictEqual(res.status, 1);
  assert.ok(/claude/i.test(res.stderr) && /install/i.test(res.stderr), '案内が出る');
});

test('不正 JSON は1回だけ再試行し、成功すれば注釈される', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n再試行対象。\n');
  const res = run(file, [], {
    MDTALK_MOCK_BADFIRST: '1',
    MDTALK_MOCK_FIND: '再試行対象',
    MDTALK_MOCK_TEXT: 'ok',
  });
  assert.strictEqual(res.status, 0);
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 1);
});

test('再試行しても不正なら注釈せずスキップ（クラッシュしない）', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\nずっと不正。\n');
  const res = run(file, [], { MDTALK_MOCK_BAD: 'always' });
  assert.strictEqual(res.status, 0);
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 0);
});

test('envelope 形式の応答も解釈できる', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\nエンベロープ対象。\n');
  const res = run(file, [], {
    MDTALK_MOCK_ENVELOPE: '1',
    MDTALK_MOCK_FIND: 'エンベロープ対象',
    MDTALK_MOCK_TEXT: 'x',
  });
  assert.strictEqual(res.status, 0);
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 1);
});

test('二重起動は PID ロックで拒否される', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init（state 生成、pid は --once 後に削除される）
  // 生きているプロセスの pid を state に注入
  const stateFile = path.join(dir, '.mdtalk', 'd.md.state.json');
  const st = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  st.pid = process.pid; // このテストプロセスは生存中
  fs.writeFileSync(stateFile, JSON.stringify(st));
  const res = run(file, []);
  assert.strictEqual(res.status, 1);
  assert.ok(/起動中/.test(res.stderr));
});

// ---------------------------------------------------------------------------
// マルチモデル役割分担（dialogue / minutes / summary）
// ---------------------------------------------------------------------------

function runLog(file, args, extraEnv) {
  const logFile = path.join(path.dirname(file), 'mock-calls.log');
  try { fs.rmSync(logFile, { force: true }); } catch (_) { /* ignore */ }
  const res = run(file, args, Object.assign({ MDTALK_MOCK_LOG: logFile }, extraEnv || {}));
  let calls = [];
  if (fs.existsSync(logFile)) {
    calls = fs.readFileSync(logFile, 'utf8').trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);
  }
  return { res, calls };
}

test('挿入後に minutes(haiku) が呼ばれ .minutes.md に日時見出し付きで追記', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'design.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n議事対象の段落。\n');
  const { res, calls } = runLog(file, [], {
    MDTALK_MOCK_FIND: '議事対象', MDTALK_MOCK_TEXT: '質問？',
  });
  assert.strictEqual(res.status, 0);
  // 挿入は行われた
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 1);
  // minutes が haiku で呼ばれた
  const minutes = calls.filter((c) => c.role === 'minutes');
  assert.strictEqual(minutes.length, 1);
  assert.strictEqual(minutes[0].model, 'haiku');
  // minutes ファイルに日時見出し
  const mfile = path.join(dir, 'design.minutes.md');
  assert.ok(fs.existsSync(mfile));
  assert.ok(/^## \d{4}-\d{2}-\d{2} \d{2}:\d{2}$/m.test(fs.readFileSync(mfile, 'utf8')));
});

test('空 insertions のサイクルでは minutes が呼ばれない', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n注釈対象にならない段落。\n');
  // MOCK_FIND 未指定 → insertions 空、@ai 無し
  const { res, calls } = runLog(file, []);
  assert.strictEqual(res.status, 0);
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 0);
  assert.strictEqual(calls.filter((c) => c.role === 'minutes').length, 0);
  assert.ok(!fs.existsSync(path.join(dir, 'd.minutes.md')));
});

test('--no-minutes で minutes が一切呼ばれない', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n注釈される段落。\n');
  const { res, calls } = runLog(file, ['--no-minutes'], {
    MDTALK_MOCK_FIND: '注釈される', MDTALK_MOCK_TEXT: 'q',
  });
  assert.strictEqual(res.status, 0);
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 1);
  assert.strictEqual(calls.filter((c) => c.role === 'minutes').length, 0);
  assert.ok(!fs.existsSync(path.join(dir, 'd.minutes.md')));
});

test('minutes の不正応答は dialogue の成功を妨げない', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n議事失敗テスト段落。\n');
  const { res, calls } = runLog(file, [], {
    MDTALK_MOCK_FIND: '議事失敗テスト', MDTALK_MOCK_TEXT: 'q',
    MDTALK_MOCK_MINUTES_BAD: '1',
  });
  assert.strictEqual(res.status, 0);
  // dialogue は成功して注釈される
  assert.strictEqual(countAnnotations(fs.readFileSync(file, 'utf8')), 1);
  // minutes は呼ばれたが不正応答で追記されない
  assert.strictEqual(calls.filter((c) => c.role === 'minutes').length, 1);
  assert.ok(!fs.existsSync(path.join(dir, 'd.minutes.md')));
});

test('@ai(summary) で summary(sonnet) が章を .summary.md に書き、done化と参照を挿入', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# タイトル\n\n## 章A\n\n本文A。\n\n## 章B\n\n本文B。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n@ai(summary): 章Bをまとめて\n');
  const { res, calls } = runLog(file, [], { MDTALK_MOCK_SUMMARY: 'まとめB本文' });
  assert.strictEqual(res.status, 0);
  // summary が sonnet で呼ばれた
  const summ = calls.filter((c) => c.role === 'summary');
  assert.strictEqual(summ.length, 1);
  assert.strictEqual(summ[0].model, 'sonnet');
  // summary ファイルに章Bのまとめ
  const sfile = path.join(dir, 'd.summary.md');
  assert.ok(fs.existsSync(sfile));
  const sbody = fs.readFileSync(sfile, 'utf8');
  assert.ok(sbody.includes('## 章B'));
  assert.ok(sbody.includes('まとめB本文'));
  // 対象MDの指示行が done 化、参照 blockquote が挿入
  const after = fs.readFileSync(file, 'utf8');
  assert.ok(after.includes('<!-- done: (summary): 章Bをまとめて -->'));
  assert.ok(/> 🧭 \*\*AI\*\*: まとめを d\.summary\.md「章B」に書きました/.test(after));
});

test('summary は同章を置換し他章を保持する', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  const HEADER =
    '<!-- mdtalk protocol\nmdtalk-models: dialogue=sonnet minutes=haiku summary=opus\n-->\n';
  const doc = (aDir, bDir) => HEADER + [
    '', '# T', '',
    '## 章A', '', '本文A。', ...(aDir ? [aDir] : []), '',
    '## 章B', '', '本文B。', ...(bDir ? [bDir] : []), '',
  ].join('\n') + '\n';
  const sfile = path.join(dir, 'd.summary.md');

  fs.writeFileSync(file, doc(null, null));
  run(file, []); // init（既存ヘッダ保持、スナップショットのみ）

  // 章A をまとめ（v1）: 指示は章A内に置く
  fs.writeFileSync(file, doc('@ai(summary): 章Aをまとめて', null));
  run(file, [], { MDTALK_MOCK_SUMMARY: '章A-v1' });
  // 章B をまとめ
  fs.writeFileSync(file, doc(null, '@ai(summary): 章Bをまとめて'));
  run(file, [], { MDTALK_MOCK_SUMMARY: '章B-v1' });
  let sbody = fs.readFileSync(sfile, 'utf8');
  assert.ok(sbody.includes('章A-v1') && sbody.includes('章B-v1'));

  // 章A を再まとめ（v2）→ 置換、章B は保持
  fs.writeFileSync(file, doc('@ai(summary): 章Aを再まとめ', null));
  run(file, [], { MDTALK_MOCK_SUMMARY: '章A-v2' });
  sbody = fs.readFileSync(sfile, 'utf8');
  assert.ok(sbody.includes('章A-v2'), '章A は置換される');
  assert.ok(!sbody.includes('章A-v1'), '旧章A本文は消える');
  assert.ok(sbody.includes('章B-v1'), '章B は保持される');
  assert.strictEqual((sbody.match(/^## 章A$/gm) || []).length, 1);
});

test('@ai(opus) はその1回の dialogue 呼び出しを opus で実行', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  fs.writeFileSync(file, '# 設計\n\n段落。\n');
  run(file, []); // init
  fs.appendFileSync(file, '\n@ai(opus): 反論だけほしい\n');
  const { res, calls } = runLog(file, []);
  assert.strictEqual(res.status, 0);
  const dlg = calls.filter((c) => c.role === 'dialogue');
  assert.strictEqual(dlg.length, 1);
  assert.strictEqual(dlg[0].model, 'opus');
});

test('ヘッダの mdtalk-models 行が CLI 指定より優先される', () => {
  const dir = mkTmp();
  const file = path.join(dir, 'd.md');
  const custom = [
    '<!-- mdtalk protocol',
    'mdtalk-models: dialogue=opus minutes=haiku summary=opus',
    '-->',
    '',
    '# 設計',
    '',
    '段落。',
    '',
  ].join('\n');
  fs.writeFileSync(file, custom);
  run(file, ['--model', 'sonnet']); // init（既存ヘッダは保持）
  fs.appendFileSync(file, '新しい段落ヘッダ優先。\n');
  const { res, calls } = runLog(file, ['--model', 'sonnet'], {
    MDTALK_MOCK_FIND: '新しい段落ヘッダ優先', MDTALK_MOCK_TEXT: 'q',
  });
  assert.strictEqual(res.status, 0);
  const dlg = calls.filter((c) => c.role === 'dialogue');
  assert.strictEqual(dlg.length, 1);
  assert.strictEqual(dlg[0].model, 'opus', 'CLI=sonnet よりヘッダ=opus が優先');
});
