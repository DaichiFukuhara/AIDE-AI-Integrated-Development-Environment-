'use strict';

const test = require('node:test');
const assert = require('node:assert');
const m = require('../mdtalk.js');

test('detectEOL / splitLines / joinLines は改行コードを保つ', () => {
  assert.strictEqual(m.detectEOL('a\r\nb'), '\r\n');
  assert.strictEqual(m.detectEOL('a\nb'), '\n');
  assert.deepStrictEqual(m.splitLines('a\r\nb\nc'), ['a', 'b', 'c']);
  assert.strictEqual(m.joinLines(['a', 'b'], '\r\n'), 'a\r\nb');
});

test('tokenizeCmd はクオートを尊重して引数分割', () => {
  assert.deepStrictEqual(m.tokenizeCmd('node mock.js'), ['node', 'mock.js']);
  assert.deepStrictEqual(m.tokenizeCmd('node "C:/a b/mock.js"'), ['node', 'C:/a b/mock.js']);
});

test('markAiAnnotationLines は AI 注釈 blockquote のみ検出', () => {
  const lines = [
    '本文です',
    '> ❓ **AI**: 質問？（2026-07-08 10:00）',
    '> 続き',
    '普通の段落',
    '> これは人間の引用',
  ];
  const flag = m.markAiAnnotationLines(lines);
  assert.deepStrictEqual(flag, [false, true, true, false, false]);
});

test('humanChangedLineNumbers は AI 注釈内の変更を除外する', () => {
  const oldLines = ['# 見出し', '', '段落A'];
  const newLines = [
    '# 見出し', '', '段落A',
    '', '> ❓ **AI**: 質問？（d）', // AI が追記した注釈
    '', '段落B',                    // 人間が追記した段落
  ];
  const changed = m.humanChangedLineNumbers(oldLines, newLines);
  // 段落B は 7 行目、AI 注釈(5行目)は除外される
  assert.deepStrictEqual(changed, [7]);
});

test('matchAnchor は先頭一致で解決、±5でズレ吸収、無ければ -1', () => {
  const lines = ['zero', 'one two three four', 'two'];
  assert.strictEqual(m.matchAnchor(lines, 2, 'one two three four'), 1);
  // 行がずれても近傍から探す
  assert.strictEqual(m.matchAnchor(lines, 1, 'one two three four'), 1);
  assert.strictEqual(m.matchAnchor(lines, 2, 'notfound'), -1);
});

test('paragraphBounds は連続非空行のかたまりを返す', () => {
  const lines = ['a1', 'a2', '', 'b1', ''];
  assert.deepStrictEqual(m.paragraphBounds(lines, 1), { start: 0, end: 1 });
  assert.deepStrictEqual(m.paragraphBounds(lines, 3), { start: 3, end: 3 });
});

test('paragraphFingerprint は空白正規化で安定、編集で変化', () => {
  const a = m.paragraphFingerprint('段落A\n  詳細');
  const b = m.paragraphFingerprint('段落A 詳細');
  const c = m.paragraphFingerprint('段落A 変更後');
  assert.strictEqual(a, b);
  assert.notStrictEqual(a, c);
});

test('findDirectives は @ai: 行を抽出する', () => {
  const lines = ['本文', '@ai: この節を整理して', '<!-- done: 済み -->'];
  const d = m.findDirectives(lines);
  assert.strictEqual(d.length, 1);
  assert.strictEqual(d[0].index, 1);
  assert.strictEqual(d[0].instruction, 'この節を整理して');
});

test('formatAnnotationLines は複数行 blockquote を作る', () => {
  const out = m.formatAnnotationLines(
    { type: 'question', text: '一行目\n二行目' }, '2026-07-08 14:32');
  assert.deepStrictEqual(out, [
    '> ❓ **AI**: 一行目（2026-07-08 14:32）',
    '> 二行目',
  ]);
});

test('applyWrite: 段落直下に挿入、他行はバイト不変、@ai:は done化', () => {
  const src = [
    '# 設計', '', '段落A', '@ai: 反論だけほしい', '',
  ].join('\n');
  const res = m.applyWrite(src, {
    insertions: [{ anchorLine: 3, anchorText: '段落A', type: 'comment', text: 'コメント' }],
    directives: m.findDirectives(m.splitLines(src)),
    eol: '\n',
    dateStr: 'D',
    annotatedFingerprints: [],
  });
  const outLines = m.splitLines(res.text);
  // 元の行は保持
  assert.ok(outLines.includes('# 設計'));
  assert.ok(outLines.includes('段落A'));
  // 注釈が段落A直下に挿入
  const aIdx = outLines.indexOf('段落A');
  assert.strictEqual(outLines[aIdx + 1], '');
  assert.strictEqual(outLines[aIdx + 2], '> 💬 **AI**: コメント（D）');
  // @ai: が done 化
  assert.ok(res.text.includes('<!-- done: 反論だけほしい -->'));
  assert.ok(!res.text.includes('@ai:'));
});

test('applyWrite: 複数挿入は下→上で行ズレしない', () => {
  const src = ['p1', '', 'p2', '', 'p3'].join('\n');
  const res = m.applyWrite(src, {
    insertions: [
      { anchorLine: 1, anchorText: 'p1', type: 'question', text: 'q1' },
      { anchorLine: 5, anchorText: 'p3', type: 'question', text: 'q3' },
    ],
    directives: [],
    eol: '\n',
    dateStr: 'D',
    annotatedFingerprints: [],
  });
  const t = res.text;
  assert.ok(t.indexOf('q1') < t.indexOf('p2'));
  assert.ok(t.indexOf('p2') < t.indexOf('q3'));
  assert.strictEqual(res.applied.length, 2);
});

test('applyWrite: 注釈済みフィンガープリントは抑制', () => {
  const src = ['段落A'].join('\n');
  const fp = m.paragraphFingerprint('段落A');
  const res = m.applyWrite(src, {
    insertions: [{ anchorLine: 1, anchorText: '段落A', type: 'comment', text: 'x' }],
    directives: [],
    eol: '\n', dateStr: 'D',
    annotatedFingerprints: [fp],
  });
  assert.strictEqual(res.applied.length, 0);
  assert.strictEqual(res.suppressed.length, 1);
  assert.strictEqual(res.text, src);
});

test('applyWrite: anchorText 不一致は破棄、他は適用', () => {
  const src = ['段落A'].join('\n');
  const res = m.applyWrite(src, {
    insertions: [{ anchorLine: 9, anchorText: 'ない', type: 'comment', text: 'x' }],
    directives: [], eol: '\n', dateStr: 'D', annotatedFingerprints: [],
  });
  assert.strictEqual(res.applied.length, 0);
  assert.strictEqual(res.dropped.length, 1);
});

test('applyWrite: CRLF を維持する', () => {
  const src = 'p1\r\n\r\np2';
  const res = m.applyWrite(src, {
    insertions: [{ anchorLine: 1, anchorText: 'p1', type: 'comment', text: 'x' }],
    directives: [], eol: '\r\n', dateStr: 'D', annotatedFingerprints: [],
  });
  assert.ok(res.text.includes('\r\n'));
  assert.ok(!/[^\r]\n/.test(res.text), 'LF 単独が混ざらない');
});

test('validateInsertions は不正応答を弾く', () => {
  assert.throws(() => m.validateInsertions({}));
  assert.throws(() => m.validateInsertions({ insertions: [{ anchorLine: 0, anchorText: '', type: 'question', text: '' }] }));
  assert.throws(() => m.validateInsertions({ insertions: [{ anchorLine: 1, anchorText: 'x', type: 'bad', text: '' }] }));
  const ok = m.validateInsertions({ insertions: [{ anchorLine: 1, anchorText: 'x', type: 'question', text: 't' }] });
  assert.strictEqual(ok.length, 1);
});

test('parseClaudeResponse は envelope/コードフェンスから取り出す', () => {
  assert.deepStrictEqual(
    m.parseClaudeResponse('{"insertions":[]}'), { insertions: [] });
  assert.deepStrictEqual(
    m.parseClaudeResponse(JSON.stringify({ type: 'result', result: '{"insertions":[]}' })),
    { insertions: [] });
  assert.deepStrictEqual(
    m.parseClaudeResponse('```json\n{"insertions":[]}\n```'), { insertions: [] });
});

test('hasProtocolHeader / protocolHeaderLines', () => {
  assert.strictEqual(m.hasProtocolHeader('<!-- mdtalk protocol\n-->\n本文'), true);
  assert.strictEqual(m.hasProtocolHeader('本文'), false);
  assert.ok(m.protocolHeaderLines()[0].startsWith('<!-- mdtalk'));
});
