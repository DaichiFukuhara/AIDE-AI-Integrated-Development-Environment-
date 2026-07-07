'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const MDTALK = path.join(__dirname, '..', 'mdtalk.js');
const MOCK = path.join(__dirname, 'mock-claude.js');

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
