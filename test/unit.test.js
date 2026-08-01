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

test('parseClaudeResponse は JSON 文字列内のコードフェンスで途中切りしない', () => {
  // skeleton 本文に ``` を含む応答（実 claude で観測されたケース）
  const skeleton = '## シグネチャ\n\n```\nfn foo()\n```\n\n本文';
  const inner = JSON.stringify({ skeleton });
  const fenced = '```json\n' + inner + '\n```';
  assert.deepStrictEqual(m.parseClaudeResponse(fenced), { skeleton });
  // envelope 経由でも同様
  assert.deepStrictEqual(
    m.parseClaudeResponse(JSON.stringify({ type: 'result', result: fenced })),
    { skeleton });
});

test('hasProtocolHeader / protocolHeaderLines', () => {
  assert.strictEqual(m.hasProtocolHeader('<!-- mdtalk protocol\n-->\n本文'), true);
  assert.strictEqual(m.hasProtocolHeader('本文'), false);
  assert.ok(m.protocolHeaderLines()[0].startsWith('<!-- mdtalk'));
});

// ---------------------------------------------------------------------------
// マルチモデル役割分担
// ---------------------------------------------------------------------------

test('protocolHeaderLines は mdtalk-models 行を含む（既定・指定）', () => {
  const def = m.protocolHeaderLines();
  assert.ok(def.some((l) => l === 'mdtalk-models: dialogue=opus minutes=haiku summary=sonnet'));
  const custom = m.protocolHeaderLines({ dialogue: 'opus', minutes: 'sonnet', summary: 'fable' });
  assert.ok(custom.some((l) => l === 'mdtalk-models: dialogue=opus minutes=sonnet summary=fable'));
});

test('parseModelsSpec は役割=モデルを解釈し不正トークンを警告に回す', () => {
  const ok = m.parseModelsSpec('dialogue=sonnet minutes=haiku summary=opus');
  assert.deepStrictEqual(ok.models, { dialogue: 'sonnet', minutes: 'haiku', summary: 'opus' });
  assert.strictEqual(ok.warnings.length, 0);
  const partial = m.parseModelsSpec('summary=fable');
  assert.deepStrictEqual(partial.models, { summary: 'fable' });
  const bad = m.parseModelsSpec('garbage badrole=x dialogue=');
  assert.deepStrictEqual(bad.models, {});
  assert.strictEqual(bad.warnings.length, 3);
});

test('parseModelsHeader はヘッダ内の mdtalk-models 行のみ拾う', () => {
  const text = [
    '<!-- mdtalk protocol',
    'mdtalk-models: dialogue=opus summary=fable',
    '-->',
    '',
    '# 本文',
    'mdtalk-models: dialogue=これは本文なので無視',
  ].join('\n');
  assert.deepStrictEqual(m.parseModelsHeader(text), { dialogue: 'opus', summary: 'fable' });
  assert.deepStrictEqual(m.parseModelsHeader('# ヘッダ無し'), {});
});

test('resolveModels は ファイル内 > CLI > 既定 の優先順', () => {
  const cli = { model: 'opus', modelMinutes: 'haiku', modelSummary: 'sonnet' };
  // 既定（ヘッダ空）
  assert.deepStrictEqual(m.resolveModels(cli, {}), {
    dialogue: 'opus', minutes: 'haiku', summary: 'sonnet',
  });
  // ファイル内がCLIより優先
  assert.deepStrictEqual(m.resolveModels(cli, { dialogue: 'opus' }), {
    dialogue: 'opus', minutes: 'haiku', summary: 'sonnet',
  });
  // CLI未指定は既定
  assert.deepStrictEqual(m.resolveModels({}, {}), {
    dialogue: 'opus', minutes: 'haiku', summary: 'sonnet',
  });
});

test('findDirectives は @ai(summary) / @ai(モデル名) / @ai: を判別', () => {
  const lines = [
    '@ai: 整理して',
    '@ai(summary): この章をまとめて',
    '@ai(opus): 反論だけほしい',
  ];
  const d = m.findDirectives(lines);
  assert.strictEqual(d.length, 3);
  // 既存 @ai: は dialogue、modelOverride なし
  assert.strictEqual(d[0].kind, 'dialogue');
  assert.strictEqual(d[0].modelOverride, null);
  assert.strictEqual(d[0].doneText, '整理して');
  // summary 役割
  assert.strictEqual(d[1].kind, 'summary');
  assert.strictEqual(d[1].doneText, '(summary): この章をまとめて');
  // モデル名指定は dialogue + modelOverride
  assert.strictEqual(d[2].kind, 'dialogue');
  assert.strictEqual(d[2].modelOverride, 'opus');
  assert.strictEqual(d[2].doneText, '(opus): 反論だけほしい');
});

test('extractChapter は ## 見出しで章境界を特定、見出し無しは(全体)', () => {
  const lines = [
    '# タイトル', '', '## 章A', '本文A1', '本文A2', '', '## 章B', '本文B',
  ];
  const chA = m.extractChapter(lines, 4); // 本文A2
  assert.strictEqual(chA.name, '章A');
  assert.strictEqual(chA.startLine, 2);
  assert.strictEqual(chA.endLine, 5); // 空行まで、## 章B の手前
  const chB = m.extractChapter(lines, 7);
  assert.strictEqual(chB.name, '章B');
  assert.strictEqual(chB.endLine, 7);
  const whole = m.extractChapter(['前文', '本文'], 1);
  assert.strictEqual(whole.name, '(全体)');
  assert.strictEqual(whole.startLine, 0);
  assert.strictEqual(whole.endLine, 1);
});

test('upsertSummarySection は同章を置換し他章を保持、新章は追記', () => {
  const first = m.upsertSummarySection(null, '章A', 'まとめA-v1', '\n');
  assert.ok(first.includes('## 章A'));
  assert.ok(first.includes('まとめA-v1'));
  // 別章を追記
  const two = m.upsertSummarySection(first, '章B', 'まとめB', '\n');
  assert.ok(two.includes('## 章A') && two.includes('## 章B'));
  // 章A を置換、章B は保持
  const replaced = m.upsertSummarySection(two, '章A', 'まとめA-v2', '\n');
  assert.ok(replaced.includes('まとめA-v2'));
  assert.ok(!replaced.includes('まとめA-v1'), '旧章A本文は消える');
  assert.ok(replaced.includes('まとめB'), '章B は保持');
  // 章A セクションは1つだけ
  assert.strictEqual((replaced.match(/^## 章A$/gm) || []).length, 1);
});

test('siblingPath は <base>.minutes.md / .summary.md を作る', () => {
  const mp = m.siblingPath('/x/y/design.md', '.minutes.md');
  const sp = m.siblingPath('/x/y/design.md', '.summary.md');
  assert.ok(mp.replace(/\\/g, '/').endsWith('/x/y/design.minutes.md'));
  assert.ok(sp.replace(/\\/g, '/').endsWith('/x/y/design.summary.md'));
});

test('validateMinutes / validateSummary は文字列のみ許可', () => {
  assert.strictEqual(m.validateMinutes({ minutes: 'x' }), 'x');
  assert.throws(() => m.validateMinutes({}));
  assert.throws(() => m.validateMinutes({ minutes: 1 }));
  assert.strictEqual(m.validateSummary({ summary: 'y' }), 'y');
  assert.throws(() => m.validateSummary({}));
});
