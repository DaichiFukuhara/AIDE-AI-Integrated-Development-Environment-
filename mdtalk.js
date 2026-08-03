#!/usr/bin/env node
'use strict';

/*
 * mdtalk — MDファイル内対話ツール
 *
 * 単一ファイル・外部依存ゼロ（node: 標準モジュールのみ）。
 * 設計書 docs/mdtalk-design.md の忠実な実装。
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const util = require('node:util');
const { syncKnowledgeRoomForLane } = require('./knowledge.js');

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

const STATE_VERSION = 1;
const DEFAULT_MODEL = 'opus';
const DEFAULT_MODEL_MINUTES = 'haiku';
const DEFAULT_MODEL_SUMMARY = 'sonnet';
const VALID_ROLES = new Set(['dialogue', 'minutes', 'summary']);
const DEFAULT_INTERVAL = 1500;
const DEFAULT_MAX_NOTES = 3;
const DEFAULT_TIMEOUT_MS = 120000;
const POLL_INTERVAL_MS = 2000;
const LARGE_FILE_BYTES = 100 * 1024;
const CONTEXT_LINES = 120;
const RETRY_MARKER = 'RETRY-SCHEMA-STRICT';

const MARKERS = {
  question: '❓',
  comment: '💬',
  expand: '➕',
  counter: '🔀',
  structure: '🧭',
};
const VALID_TYPES = new Set(Object.keys(MARKERS));

// ---------------------------------------------------------------------------
// 汎用ユーティリティ
// ---------------------------------------------------------------------------

function sha256(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

/** MDTALK_CLAUDE_CMD を引数分割する（ダブルクオート対応の簡易トークナイザ）。 */
function tokenizeCmd(str) {
  const tokens = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    tokens.push(m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3]);
  }
  return tokens;
}

/** 改行コードを検出する。CRLF が1つでもあれば '\r\n'。 */
function detectEOL(text) {
  return /\r\n/.test(text) ? '\r\n' : '\n';
}

/** 改行を EOL 非依存で行配列へ分解する（EOL は含めない）。 */
function splitLines(text) {
  return text.split(/\r\n|\n|\r/);
}

function joinLines(lines, eol) {
  return lines.join(eol);
}

function formatDate(d) {
  const p = (n) => String(n).padStart(2, '0');
  return (
    d.getFullYear() +
    '-' + p(d.getMonth() + 1) +
    '-' + p(d.getDate()) +
    ' ' + p(d.getHours()) +
    ':' + p(d.getMinutes())
  );
}

// ---------------------------------------------------------------------------
// 注釈ブロックの検出・段落・アンカー
// ---------------------------------------------------------------------------

const AI_ANNOTATION_FIRST_RE = /^>\s*[❓💬➕🔀🧭]\s*\*\*AI\*\*:/u;

/** 各行が AI 注釈 blockquote に属するかの boolean 配列を返す。 */
function markAiAnnotationLines(lines) {
  const flag = new Array(lines.length).fill(false);
  let i = 0;
  while (i < lines.length) {
    if (/^>/.test(lines[i])) {
      let j = i;
      while (j < lines.length && /^>/.test(lines[j])) j++;
      if (AI_ANNOTATION_FIRST_RE.test(lines[i])) {
        for (let k = i; k < j; k++) flag[k] = true;
      }
      i = j;
    } else {
      i++;
    }
  }
  return flag;
}

/** LCS で b の各行のうち a と一致（保持）される index の Set を返す。 */
function lcsMatchedNewIndices(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = [];
  for (let i = 0; i <= n; i++) dp.push(new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const matched = new Set();
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      matched.add(j);
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return matched;
}

/**
 * 前回スナップショット(oldText)と現在(newText)を比較し、
 * 人間が新しく書いた/変えた行番号（1始まり, newText 基準）を返す。
 * AI 注釈 blockquote 内の変更は除外する。
 */
function humanChangedLineNumbers(oldLines, newLines) {
  const matched = lcsMatchedNewIndices(oldLines, newLines);
  const aiFlag = markAiAnnotationLines(newLines);
  const header = protocolHeaderRange(newLines);
  const out = [];
  for (let idx = 0; idx < newLines.length; idx++) {
    if (matched.has(idx)) continue;
    if (aiFlag[idx]) continue;
    if (header && idx >= header.start && idx <= header.end) continue; // ヘッダ内は対象外
    if (newLines[idx].trim() === '') continue; // 空行の追加は無視
    out.push(idx + 1);
  }
  return out;
}

function normalizeParagraph(text) {
  return text
    .replace(/\r\n|\r/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .trim()
    .replace(/\s+/g, ' ');
}

function paragraphFingerprint(text) {
  return sha256(normalizeParagraph(text));
}

function isParagraphContentLine(line) {
  const trimmed = line.trim();
  return trimmed !== '' && !/^@ai(?::|\()/.test(trimmed) && !/^<!--\s*done:/.test(trimmed);
}

/** idx の行が属する段落（連続する非空行）の境界を返す。 */
function paragraphBounds(lines, idx) {
  if (idx < 0 || idx >= lines.length) return { start: idx, end: idx };
  let start = idx;
  let end = idx;
  if (!isParagraphContentLine(lines[idx])) return { start: idx, end: idx };
  while (start > 0 && isParagraphContentLine(lines[start - 1])) start--;
  while (end < lines.length - 1 && isParagraphContentLine(lines[end + 1])) end++;
  return { start, end };
}

/**
 * anchorLine(1始まり) と anchorText で現在の行配列内の index を解決する。
 * ズレていれば ±5 行から anchorText 前方一致で探す。見つからなければ -1。
 */
function matchAnchor(lines, anchorLine, anchorText) {
  const target = anchorLine - 1;
  const at = anchorText || '';
  const hit = (i) => i >= 0 && i < lines.length &&
    (at === '' ? lines[i].trim() === '' : lines[i].startsWith(at));
  if (hit(target)) return target;
  for (let d = 1; d <= 5; d++) {
    if (hit(target - d)) return target - d;
    if (hit(target + d)) return target + d;
  }
  return -1;
}

// ---------------------------------------------------------------------------
// 注釈整形
// ---------------------------------------------------------------------------

function markerFor(type) {
  return MARKERS[type] || '💬';
}

/** insertion を blockquote 行配列に整形する（EOL は含めない）。 */
function formatAnnotationLines(insertion, dateStr) {
  const marker = markerFor(insertion.type);
  const textLines = String(insertion.text == null ? '' : insertion.text).split(/\r\n|\n|\r/);
  const first = textLines[0] || '';
  const out = [`> ${marker} **AI**: ${first}（${dateStr}）`];
  for (let i = 1; i < textLines.length; i++) {
    out.push(`> ${textLines[i]}`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// ディレクティブ（@ai:）
// ---------------------------------------------------------------------------

/**
 * `@ai:` / `@ai(...)` ディレクティブ行を抽出する。
 * - `@ai: 指示` → dialogue（役割・モデル指定なし）
 * - `@ai(summary): 指示` → summary タスク（kind='summary'）
 * - `@ai(<モデル名>): 指示` → その1回だけ dialogue 呼び出しのモデルを差し替える
 * done 変換テキスト(doneText)はカッコ含め元の指定を残す。
 */
function findDirectives(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^@ai(?:\(([^)]*)\))?:\s?(.*)$/);
    if (!m) continue;
    const paren = m[1];
    const instruction = m[2].trim();
    let kind = 'dialogue';
    let modelOverride = null;
    let doneText = instruction;
    if (paren !== undefined) {
      const p = paren.trim();
      if (p === 'summary') {
        kind = 'summary';
      } else {
        // summary 以外はモデル名として dialogue 呼び出しに1回だけ適用。
        modelOverride = p;
      }
      doneText = `(${paren}): ${instruction}`;
    }
    out.push({ index: i, instruction, raw: lines[i], kind, modelOverride, doneText });
  }
  return out;
}

// ---------------------------------------------------------------------------
// 書き込み適用（注釈挿入 ＋ ディレクティブ消費）
// ---------------------------------------------------------------------------

/**
 * text へ insertions と directives を適用した新テキストを返す。
 * - 注釈は該当段落の直後へ空行を挟んで挿入（下→上の順で適用）。
 * - directive 行は `<!-- done: 指示 -->` に置換。
 * - 既に注釈済みの段落フィンガープリントは抑制。
 */
function applyWrite(text, opts) {
  const { insertions = [], directives = [], references = [], eol, dateStr } = opts;
  const lines = splitLines(text);
  const fpSet = new Set(opts.annotatedFingerprints || []);
  const edits = [];
  const applied = [];
  const dropped = [];
  const suppressed = [];
  const newFingerprints = [];

  for (const d of directives) {
    const doneText = d.doneText != null ? d.doneText : d.instruction;
    edits.push({ at: d.index, kind: 'replace', line: `<!-- done: ${doneText} -->` });
  }

  for (const ins of insertions) {
    const idx = matchAnchor(lines, ins.anchorLine, ins.anchorText);
    if (idx < 0) { dropped.push(ins); continue; }
    const bounds = paragraphBounds(lines, idx);
    const paraText = lines.slice(bounds.start, bounds.end + 1).join('\n');
    const fp = paragraphFingerprint(paraText);
    if (fpSet.has(fp)) { suppressed.push(ins); continue; }
    fpSet.add(fp);
    newFingerprints.push(fp);
    const block = formatAnnotationLines(ins, dateStr);
    edits.push({ at: bounds.end + 1, kind: 'insert', lines: ['', ...block] });
    applied.push({ type: ins.type, text: ins.text });
  }

  // summary の参照 blockquote（章末尾）。フィンガープリント抑制は行わない。
  for (const ref of references) {
    const idx = matchAnchor(lines, ref.anchorLine, ref.anchorText);
    if (idx < 0) continue;
    const bounds = paragraphBounds(lines, idx);
    const block = formatAnnotationLines({ type: 'structure', text: ref.text }, dateStr);
    edits.push({ at: bounds.end + 1, kind: 'insert', lines: ['', ...block] });
  }

  // 下→上に適用。同一 at は replace を先に。
  edits.sort((a, b) => (b.at - a.at) || ((a.kind === 'replace' ? 0 : 1) - (b.kind === 'replace' ? 0 : 1)));
  for (const e of edits) {
    if (e.kind === 'replace') lines.splice(e.at, 1, e.line);
    else lines.splice(e.at, 0, ...e.lines);
  }

  return {
    text: joinLines(lines, eol),
    applied,
    dropped,
    suppressed,
    newFingerprints,
  };
}

// ---------------------------------------------------------------------------
// プロトコルヘッダ
// ---------------------------------------------------------------------------

function hasProtocolHeader(text) {
  return /^\s*<!--\s*mdtalk\b/.test(text);
}

/** 先頭のプロトコルヘッダ（HTMLコメント）の行範囲 {start, end}（両端含む）。無ければ null。 */
function protocolHeaderRange(lines) {
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*<!--\s*mdtalk\b/.test(lines[i])) { start = i; break; }
    if (lines[i].trim() !== '') break; // ヘッダは先頭（空行のみ許容）
  }
  if (start < 0) return null;
  for (let j = start; j < lines.length; j++) {
    if (/-->/.test(lines[j])) return { start, end: j };
  }
  return null;
}

function protocolHeaderLines(models) {
  const md = models || {
    dialogue: DEFAULT_MODEL,
    minutes: DEFAULT_MODEL_MINUTES,
    summary: DEFAULT_MODEL_SUMMARY,
  };
  return [
    '<!-- mdtalk protocol',
    'マーカー: ❓=質問 / 💬=コメント / ➕=展開 / 🔀=別視点 / 🧭=整理',
    '人間→AI: 行頭 `@ai:` で指示（例: `@ai: この節を整理して`）。処理後 `<!-- done: ... -->` になる。',
    '役割別モデル: `@ai(summary): まとめて` で章を清書、`@ai(opus): 指示` で1回だけモデル差し替え。',
    '約束: AIは注釈blockquoteの挿入のみ行い、人間が書いた文は不変のまま。',
    'このファイルを編集するAIは注釈blockquoteの追加のみ行うこと。',
    `mdtalk-models: dialogue=${md.dialogue} minutes=${md.minutes} summary=${md.summary}`,
    'observe-level: strict',
    '-->',
  ];
}

/** `mdtalk-models: dialogue=.. minutes=.. summary=..` の値部分をパースする。 */
function parseModelsSpec(spec) {
  const models = {};
  const warnings = [];
  const tokens = String(spec).trim().split(/\s+/).filter(Boolean);
  for (const tok of tokens) {
    const eq = tok.indexOf('=');
    if (eq < 0) { warnings.push(tok); continue; }
    const role = tok.slice(0, eq).trim();
    const model = tok.slice(eq + 1).trim();
    if (!VALID_ROLES.has(role) || model === '') { warnings.push(tok); continue; }
    models[role] = model;
  }
  return { models, warnings };
}

/** プロトコルヘッダ内の `mdtalk-models:` 行から役割別モデル指定を取り出す。 */
function parseModelsHeader(text, log) {
  const lines = splitLines(text);
  const range = protocolHeaderRange(lines);
  if (!range) return {};
  for (let i = range.start; i <= range.end; i++) {
    const m = lines[i].match(/^\s*mdtalk-models:\s*(.*)$/);
    if (!m) continue;
    const { models, warnings } = parseModelsSpec(m[1]);
    if (warnings.length && log) {
      log.warn(`mdtalk-models: 不正なトークンを無視します: ${warnings.join(' ')}`);
    }
    return models;
  }
  return {};
}

/** ファイル内指定 > CLI > 既定値 の優先順で役割別モデルを解決する。 */
function resolveModels(cli, header) {
  const h = header || {};
  const c = cli || {};
  return {
    dialogue: h.dialogue || c.model || DEFAULT_MODEL,
    minutes: h.minutes || c.modelMinutes || DEFAULT_MODEL_MINUTES,
    summary: h.summary || c.modelSummary || DEFAULT_MODEL_SUMMARY,
  };
}

// ---------------------------------------------------------------------------
// プロンプト組み立て
// ---------------------------------------------------------------------------

const NORMS = [
  'あなたは1つのMarkdown設計書を人間と共に育てる注釈AIです。',
  '規範:',
  '- 挿入のみ。人間の行の変更・削除・並べ替えは絶対に指示しない（structureでも「こう並べ替えては？」という提案文を書くだけ）。',
  '- 新しく書かれた/変更された部分にだけ反応する。全文への総評はしない。',
  '- 最も価値のある指摘に絞る。',
  '- 曖昧な要求→❓で具体化を迫る、暗黙の前提→💬で言語化、抜けている観点（エラー時・境界・非機能）→🔀/❓、書きかけの節→➕でたたき台を提案。',
  '- 言うことがなければ insertions を空配列で返す（無理に注釈しない）。',
  '- 日本語で、断定でなく対話の口調で書く。',
];

const SCHEMA_TEXT = [
  '応答は次のJSONのみ（前後に文章やコードフェンスを付けない）:',
  '{"insertions":[{"anchorLine":<1始まり行番号>,"anchorText":"その行の先頭20文字","type":"question|comment|expand|counter|structure","text":"注釈本文"}]}',
];

function buildSnapshotWithNumbers(lines) {
  return lines.map((l, i) => `${i + 1}: ${l}`).join('\n');
}

function headingList(lines) {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) out.push(`${i + 1}: ${lines[i]}`);
  }
  return out.join('\n');
}

/**
 * 通常の注釈プロンプトを組み立てる。100KB 超なら切り詰める。
 * @returns {{ prompt: string, truncated: boolean }}
 */
function buildPrompt(opts) {
  const {
    lines, changedLines, directives, maxNotes, sharedKnowledge = '', knowledgeChanged = false,
  } = opts;
  const fullText = lines.join('\n');
  const large = Buffer.byteLength(fullText, 'utf8') > LARGE_FILE_BYTES;

  let snapshotSection;
  let truncated = false;
  if (large) {
    truncated = true;
    const keep = new Set();
    for (const ln of changedLines) {
      for (let k = ln - 1 - CONTEXT_LINES; k <= ln - 1 + CONTEXT_LINES; k++) {
        if (k >= 0 && k < lines.length) keep.add(k);
      }
    }
    const kept = [...keep].sort((a, b) => a - b).map((i) => `${i + 1}: ${lines[i]}`).join('\n');
    snapshotSection =
      '（ファイルが大きいため変更行の前後のみ抜粋。行番号は原本基準）\n' +
      '## 見出し一覧\n' + headingList(lines) + '\n\n## 抜粋\n' + kept;
  } else {
    snapshotSection = buildSnapshotWithNumbers(lines);
  }

  const directiveSection = directives.length
    ? directives.map((d) => `- (行${d.index + 1}) ${d.instruction}`).join('\n')
    : '（なし）';

  const changedSection = changedLines.length
    ? changedLines.join(', ')
    : '（差分なし）';

  const prompt = [
    NORMS.join('\n'),
    '',
    `## 未消費の @ai: 指示（最優先で解釈）`,
    directiveSection,
    '',
    `## 人間が新しく書いた/変えた行番号`,
    changedSection,
    '',
    '## 共有知識の更新',
    knowledgeChanged
      ? '前回の処理後に共有知識が更新された。対象レーンとの矛盾・不足・反映漏れを再点検すること。'
      : '（更新なし）',
    '',
    `## 制約`,
    `- 挿入する注釈は最大 ${maxNotes} 件。`,
    '- 共有知識ルームは参照専用。注釈の anchorLine / anchorText は対象ファイル本文からだけ選ぶ。',
    '',
    '## 共有知識ルーム（自動同期・参照専用）',
    sharedKnowledge || '（AIDE共有知識なし）',
    '',
    `## ファイル本文（行番号付きスナップショット）`,
    snapshotSection,
    '',
    '## 応答スキーマ',
    SCHEMA_TEXT.join('\n'),
  ].join('\n');

  return { prompt, truncated };
}

function buildInitPrompt() {
  return [
    'あなたは設計書の骨組みを提案するAIです。',
    '次の8節から成る空の設計書スケルトンを Markdown で提案してください。各節は見出し(##)と、',
    '空欄のたたき台＋❓で問う短い質問を1つ含めてください。8節: ',
    '1. 目的 / 背景',
    '2. 対象ファイル',
    '3. インターフェース / シグネチャ',
    '4. 振る舞い / データフロー',
    '5. 受け入れ条件',
    '6. エッジケース / エラー処理',
    '7. テスト方針',
    '8. スコープ外',
    '',
    '応答は次のJSONのみ: {"skeleton":"<Markdown文字列>"}',
  ].join('\n');
}

const MINUTES_SCHEMA = '応答は次のJSONのみ（前後に文章やコードフェンスを付けない）: {"minutes":"<Markdownエントリ本文>"}';
const SUMMARY_SCHEMA = '応答は次のJSONのみ（前後に文章やコードフェンスを付けない）: {"summary":"<Markdown章本文>"}';

/** 議事録プロンプトを組み立てる。 */
function buildMinutesPrompt(opts) {
  const { humanLines = [], insertedNotes = [], recentEntries = [] } = opts;
  return [
    'あなたは設計対話の議事録を書くAIです。今回のサイクルの変更点を簡潔な議事メモにまとめてください。',
    '規範: 箇条書き中心。決定事項・未解決の問い・次の論点を拾う。全文の要約や長文は書かない。',
    '',
    '## 今回、人間が書いた/変えた行',
    humanLines.length ? humanLines.map((l) => `- ${l}`).join('\n') : '（なし）',
    '',
    '## 今回、AIが挿入した注釈',
    insertedNotes.length
      ? insertedNotes.map((n) => `- ${markerFor(n.type)} ${n.text || ''}`).join('\n')
      : '（なし）',
    '',
    '## 直近の議事録（継続性の参考）',
    recentEntries.length ? recentEntries.join('\n\n') : '（なし）',
    '',
    '## 応答スキーマ',
    MINUTES_SCHEMA,
  ].join('\n');
}

/** 章まとめプロンプトを組み立てる。 */
function buildSummaryPrompt(opts) {
  const { instruction, chapterName, chapterText, headings, sharedKnowledge = '' } = opts;
  return [
    'あなたは設計書の1つの章を清書するAIです。人間の文とAIとの対話（注釈blockquote）を材料に、',
    '章を読みやすい設計文書としてまとめてください。',
    '規範: 章本文のMarkdownのみを出力する（章見出し ## は付けない）。人間の意図を保ちつつ整理する。',
    '',
    '## まとめ指示',
    instruction || '（指示なし。この章をまとめて）',
    '',
    `## 対象の章: ${chapterName}`,
    chapterText,
    '',
    '## ファイル全体の見出し一覧（文脈用）',
    headings || '（なし）',
    '',
    '## 共有知識ルーム（整合性確認用・参照専用）',
    sharedKnowledge || '（AIDE共有知識なし）',
    '',
    '## 応答スキーマ',
    SUMMARY_SCHEMA,
  ].join('\n');
}

/**
 * dirIndex の行が属する章（直前の `##` 見出しから次の `##` 見出しの手前まで）。
 * 見出しが無ければファイル全体（name='(全体)'）。行番号は 0 始まり両端含む。
 */
function extractChapter(lines, dirIndex) {
  let start = -1;
  for (let i = dirIndex; i >= 0; i--) {
    if (/^##\s/.test(lines[i])) { start = i; break; }
  }
  if (start < 0) {
    return { name: '(全体)', startLine: 0, endLine: lines.length - 1, wholeFile: true };
  }
  let end = lines.length - 1;
  for (let j = start + 1; j < lines.length; j++) {
    if (/^##\s/.test(lines[j])) { end = j - 1; break; }
  }
  const name = lines[start].replace(/^##\s+/, '').trim();
  return { name, startLine: start, endLine: end, wholeFile: false };
}

/** 範囲内の最後の非空行を参照アンカーとして返す。 */
function lastContentAnchor(lines, start, end) {
  for (let i = end; i >= start; i--) {
    if (lines[i].trim() !== '') return { line: i + 1, text: lines[i].slice(0, 20) };
  }
  return null;
}

/**
 * summary ファイルに章セクションを追加/置換する（章単位で冪等）。
 * 同じ `## <章名>` があれば次の `##` 見出し手前まで置換、なければ末尾へ追記。
 */
function upsertSummarySection(existingText, name, body, eol) {
  const bodyLines = splitLines(String(body).replace(/\r\n|\r/g, '\n'));
  const section = ['## ' + name, '', ...bodyLines];
  while (section.length && section[section.length - 1].trim() === '') section.pop();

  if (!existingText || existingText.trim() === '') {
    return joinLines(section, eol) + eol;
  }

  const lines = splitLines(existingText);
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s/.test(lines[i]) && lines[i].replace(/^##\s+/, '').trim() === name) {
      start = i;
      break;
    }
  }

  if (start < 0) {
    const base = splitLines(existingText.replace(/(\r\n|\r|\n)+$/, ''));
    return joinLines([...base, '', ...section], eol) + eol;
  }

  let end = lines.length;
  for (let j = start + 1; j < lines.length; j++) {
    if (/^##\s/.test(lines[j])) { end = j; break; }
  }
  const before = lines.slice(0, start);
  const after = lines.slice(end);
  while (before.length && before[before.length - 1].trim() === '') before.pop();
  while (after.length && after[0].trim() === '') after.shift();
  const merged = [];
  if (before.length) merged.push(...before, '');
  merged.push(...section);
  if (after.length) merged.push('', ...after);
  return joinLines(merged, eol) + eol;
}

/** 議事録ファイルへ日時見出し付きエントリを追記する（追記のみ）。 */
function appendMinutes(file, body, dateStr) {
  let eol = '\n';
  let prefix = '';
  if (fs.existsSync(file)) {
    const existing = fs.readFileSync(file, 'utf8');
    eol = detectEOL(existing);
    prefix = existing.replace(/(\r\n|\r|\n)+$/, '');
    if (prefix !== '') prefix += eol + eol;
  }
  const bodyNorm = String(body).replace(/\r\n|\r|\n/g, eol);
  const entry = `## ${dateStr}${eol}${eol}${bodyNorm}${eol}`;
  fs.writeFileSync(file, prefix + entry);
}

/** 議事録ファイル末尾から直近 n エントリを返す。 */
function readRecentMinutes(file, n) {
  try {
    if (!fs.existsSync(file)) return [];
    const lines = splitLines(fs.readFileSync(file, 'utf8'));
    const idxs = [];
    for (let i = 0; i < lines.length; i++) if (/^##\s/.test(lines[i])) idxs.push(i);
    const entries = [];
    for (let k = 0; k < idxs.length; k++) {
      const s = idxs[k];
      const e = k + 1 < idxs.length ? idxs[k + 1] : lines.length;
      entries.push(lines.slice(s, e).join('\n').trim());
    }
    return entries.slice(-n);
  } catch (_) {
    return [];
  }
}

/** 対象ファイルと同ディレクトリの `<base><suffix>` パスを返す。 */
function siblingPath(targetFile, suffix) {
  const dir = path.dirname(path.resolve(targetFile));
  const base = path.basename(targetFile);
  const ext = path.extname(base);
  const stem = ext ? base.slice(0, -ext.length) : base;
  return path.join(dir, stem + suffix);
}

function validateMinutes(obj) {
  if (!obj || typeof obj !== 'object' || typeof obj.minutes !== 'string') {
    throw new Error('minutes is not a string');
  }
  return obj.minutes;
}

function validateSummary(obj) {
  if (!obj || typeof obj !== 'object' || typeof obj.summary !== 'string') {
    throw new Error('summary is not a string');
  }
  return obj.summary;
}

// ---------------------------------------------------------------------------
// claude 呼び出し
// ---------------------------------------------------------------------------

class ClaudeNotFoundError extends Error {}

function resolveClaudeArgv(model) {
  const override = process.env.MDTALK_CLAUDE_CMD;
  const base = override ? tokenizeCmd(override) : ['claude'];
  const [cmd, ...pre] = base;
  const args = [...pre, '-p', '--model', model, '--output-format', 'json'];
  return { cmd, args };
}

function callClaudeRaw({ promptText, model, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const { cmd, args } = resolveClaudeArgv(model);
    let child;
    try {
      child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      reject(e.code === 'ENOENT' ? new ClaudeNotFoundError(String(e.message)) : e);
      return;
    }
    let out = '';
    let err = '';
    let done = false;
    const finish = (fn, val) => { if (!done) { done = true; clearTimeout(timer); fn(val); } };
    const timer = setTimeout(() => {
      if (done) return;
      try { child.kill('SIGKILL'); } catch (_) {}
      const e = new Error('claude timeout');
      e.code = 'ETIMEDOUT';
      finish(reject, e);
    }, timeoutMs);
    child.on('error', (e) => {
      finish(reject, e.code === 'ENOENT' ? new ClaudeNotFoundError(String(e.message)) : e);
    });
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', (code) => finish(resolve, { code, out, err }));
    child.stdin.on('error', () => {}); // EPIPE 無視
    child.stdin.write(promptText);
    child.stdin.end();
  });
}

/** claude の出力から我々のスキーマ JSON を取り出す（envelope/コードフェンス対応）。 */
function parseClaudeResponse(out) {
  const trimmed = String(out).trim();
  let obj = null;
  try { obj = JSON.parse(trimmed); } catch (_) { obj = null; }
  if (obj && typeof obj === 'object') {
    if ('insertions' in obj || 'skeleton' in obj) return obj;
    if (typeof obj.result === 'string') return parseInner(obj.result);
  }
  return parseInner(trimmed);
}

function parseInner(s) {
  const t = String(s).trim();
  // まず全体を JSON として試す（フェンスなし応答）。
  try { return JSON.parse(t); } catch (_) {}
  // フェンス付き応答: 貪欲マッチで「最後の ```」を閉じとみなす
  // （JSON 文字列内にコードフェンスが含まれるケースで途中切りしない）。
  const fence = t.match(/```(?:json)?\s*([\s\S]*)```/);
  if (fence) return JSON.parse(fence[1].trim());
  return JSON.parse(t); // 元のエラーを投げ直す
}

/** insertions 応答の検証。妥当なら正規化した配列を返し、不正なら throw。 */
function validateInsertions(obj) {
  if (!obj || typeof obj !== 'object' || !Array.isArray(obj.insertions)) {
    throw new Error('insertions is not an array');
  }
  const out = [];
  for (const ins of obj.insertions) {
    if (!ins || typeof ins !== 'object') throw new Error('insertion is not an object');
    if (!Number.isInteger(ins.anchorLine) || ins.anchorLine < 1) throw new Error('bad anchorLine');
    if (typeof ins.anchorText !== 'string') throw new Error('bad anchorText');
    if (!VALID_TYPES.has(ins.type)) throw new Error('bad type');
    if (typeof ins.text !== 'string') throw new Error('bad text');
    out.push({
      anchorLine: ins.anchorLine,
      anchorText: ins.anchorText,
      type: ins.type,
      text: ins.text,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// 状態ファイル
// ---------------------------------------------------------------------------

function statePaths(targetFile) {
  const dir = path.dirname(path.resolve(targetFile));
  const base = path.basename(targetFile);
  const stateDir = path.join(dir, '.mdtalk');
  return { stateDir, stateFile: path.join(stateDir, base + '.state.json') };
}

function loadState(stateFile) {
  try {
    const raw = fs.readFileSync(stateFile, 'utf8');
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return null;
    return s;
  } catch (_) {
    return null;
  }
}

function saveState(stateDir, stateFile, state) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

function isProcessAlive(pid) {
  if (!pid || pid === process.pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === 'EPERM';
  }
}

// ---------------------------------------------------------------------------
// ファイル入出力（UTF-8 検証・EOL 維持）
// ---------------------------------------------------------------------------

function readTargetText(targetFile) {
  const buf = fs.readFileSync(targetFile);
  try {
    return new util.TextDecoder('utf-8', { fatal: true }).decode(buf);
  } catch (_) {
    const e = new Error('対象ファイルが UTF-8 ではありません（対象外）: ' + targetFile);
    e.code = 'ENOTUTF8';
    throw e;
  }
}

// ---------------------------------------------------------------------------
// CLI 引数
// ---------------------------------------------------------------------------

function parseCliArgs(argv) {
  const { values, positionals } = util.parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      model: { type: 'string', default: DEFAULT_MODEL },
      'model-minutes': { type: 'string', default: DEFAULT_MODEL_MINUTES },
      'model-summary': { type: 'string', default: DEFAULT_MODEL_SUMMARY },
      'no-minutes': { type: 'boolean', default: false },
      once: { type: 'boolean', default: false },
      interval: { type: 'string', default: String(DEFAULT_INTERVAL) },
      'max-notes': { type: 'string', default: String(DEFAULT_MAX_NOTES) },
      quiet: { type: 'boolean', default: false },
      init: { type: 'boolean', default: false },
    },
  });
  return {
    file: positionals[0],
    model: values.model,
    modelMinutes: values['model-minutes'],
    modelSummary: values['model-summary'],
    noMinutes: values['no-minutes'],
    once: values.once,
    interval: parseInt(values.interval, 10) || DEFAULT_INTERVAL,
    maxNotes: parseInt(values['max-notes'], 10) || DEFAULT_MAX_NOTES,
    quiet: values.quiet,
    init: values.init,
  };
}

// ---------------------------------------------------------------------------
// ロガー
// ---------------------------------------------------------------------------

function makeLogger(quiet) {
  return {
    info: (...a) => { if (!quiet) console.error('[mdtalk]', ...a); },
    warn: (...a) => console.error('[mdtalk][warn]', ...a),
    error: (...a) => console.error('[mdtalk][error]', ...a),
  };
}

// ---------------------------------------------------------------------------
// コアの1サイクル処理
// ---------------------------------------------------------------------------

/**
 * claude を呼び、不正 JSON なら1回だけ「スキーマ厳守」で再試行する。
 * @returns {{ ok: true, insertions } | { ok: false, reason }}
 * ClaudeNotFoundError / timeout は上位へ伝播しないよう扱う（timeout は skip）。
 */
async function requestInsertions(ctx, promptText, model) {
  const call = (p) => callClaudeRaw({ promptText: p, model: model || ctx.model, timeoutMs: ctx.timeoutMs });
  let firstOut;
  try {
    const r = await call(promptText);
    firstOut = r.out;
    return { ok: true, insertions: validateInsertions(parseClaudeResponse(firstOut)) };
  } catch (e) {
    if (e instanceof ClaudeNotFoundError) throw e;
    if (e && e.code === 'ETIMEDOUT') return { ok: false, reason: 'timeout' };
    // parse/validate 失敗 → 再試行
  }
  ctx.log.warn('claude 応答がスキーマ違反。スキーマ厳守で再試行します。');
  const retryPrompt = promptText + '\n\n' + RETRY_MARKER +
    ': 直前の応答はスキーマ違反でした。指定したJSONのみを返してください。';
  try {
    const r2 = await call(retryPrompt);
    return { ok: true, insertions: validateInsertions(parseClaudeResponse(r2.out)) };
  } catch (e) {
    if (e instanceof ClaudeNotFoundError) throw e;
    if (e && e.code === 'ETIMEDOUT') return { ok: false, reason: 'timeout' };
    return { ok: false, reason: 'badjson' };
  }
}

/**
 * 通常サイクル: 差分→claude→適用→state 更新。
 * @returns {{ status, ... }}
 */
async function processAnnotations(ctx, state, currentText) {
  const lines = splitLines(currentText);
  const oldLines = splitLines(state.snapshot || '');
  const changedLines = humanChangedLineNumbers(oldLines, lines);
  const allDirectives = findDirectives(lines);

  // 役割別モデル解決（ファイル内 > CLI > 既定）。
  const headerModels = parseModelsHeader(currentText, ctx.log);
  const models = resolveModels(ctx.cli, headerModels);

  const summaryDirectives = allDirectives.filter((d) => d.kind === 'summary');
  const dialogueDirectives = allDirectives.filter((d) => d.kind !== 'summary');
  const summaryLineSet = new Set(summaryDirectives.map((d) => d.index + 1));
  // summary 指示行は dialogue の変更行（プロンプト）から除外する。
  const dialogueChangedLines = changedLines.filter((n) => !summaryLineSet.has(n));

  const hasSummaryWork = summaryDirectives.length > 0;
  let sharedKnowledge = '';
  try {
    const knowledge = syncKnowledgeRoomForLane(ctx.targetFile);
    if (knowledge) sharedKnowledge = knowledge.text;
  } catch (e) {
    ctx.log.warn(`共有知識の同期に失敗: ${e.message}`);
  }
  const sharedKnowledgeHash = sharedKnowledge ? sha256(sharedKnowledge) : null;
  const knowledgeChanged = Boolean(sharedKnowledgeHash && sharedKnowledgeHash !== state.sharedKnowledgeHash);
  const hasDialogueWork = dialogueChangedLines.length > 0 || dialogueDirectives.length > 0 || knowledgeChanged;
  if (!hasDialogueWork && !hasSummaryWork) {
    return { status: 'nochange' };
  }

  const eol = detectEOL(currentText);
  const started = Date.now();

  // --- dialogue（注釈ループ） ---
  let insertions = [];
  let dialogueModel = models.dialogue;
  if (hasDialogueWork) {
    const { prompt, truncated } = buildPrompt({
      lines, changedLines: dialogueChangedLines, directives: dialogueDirectives, maxNotes: ctx.maxNotes,
      sharedKnowledge, knowledgeChanged,
    });
    if (truncated && !state.warnedLargeFile) {
      ctx.log.warn('ファイルが100KBを超えるため切り詰めて送信します。');
      state.warnedLargeFile = true;
    }
    const override = (dialogueDirectives.find((d) => d.modelOverride) || {}).modelOverride;
    dialogueModel = override || models.dialogue;
    const res = await requestInsertions(ctx, prompt, dialogueModel);
    if (!res.ok) {
      ctx.log.warn(`サイクルをスキップ（${res.reason}）。`);
      return { status: 'skipped', reason: res.reason };
    }
    insertions = res.insertions.slice(0, ctx.maxNotes);
  }

  // --- summary（章まとめ・dialogue とは独立。失敗しても消費しない） ---
  let summaryOut = { consumed: [], references: [] };
  if (hasSummaryWork) {
    summaryOut = await processSummaries(ctx, models, lines, summaryDirectives, sharedKnowledge);
  }

  // 適用直前に再読込しレースを検出
  const fresh = readTargetText(ctx.targetFile);
  if (sha256(fresh) !== sha256(currentText)) {
    ctx.log.info('適用前に再編集を検出。このサイクルは破棄します。');
    return { status: 'raced' };
  }

  const consumedDirectives = dialogueDirectives.concat(summaryOut.consumed);
  const result = applyWrite(currentText, {
    insertions,
    directives: consumedDirectives,
    references: summaryOut.references,
    eol,
    dateStr: formatDate(new Date()),
    annotatedFingerprints: state.annotatedFingerprints || [],
  });

  for (const ins of result.dropped) {
    ctx.log.warn(`anchorText 不一致で破棄: anchorLine=${ins.anchorLine} "${ins.anchorText}"`);
  }

  const changedFile = result.text !== currentText;
  if (changedFile) {
    fs.writeFileSync(ctx.targetFile, result.text);
    const newHash = sha256(result.text);
    state.lastWrittenHash = newHash;
    state.snapshot = result.text;
    state.lastProcessedHash = newHash;
    const fps = new Set(state.annotatedFingerprints || []);
    for (const fp of result.newFingerprints) fps.add(fp);
    state.annotatedFingerprints = [...fps];
  } else {
    state.snapshot = currentText;
    state.lastProcessedHash = sha256(currentText);
  }
  if (sharedKnowledgeHash) state.sharedKnowledgeHash = sharedKnowledgeHash;

  if (hasDialogueWork) {
    const counts = {};
    for (const a of result.applied) counts[a.type] = (counts[a.type] || 0) + 1;
    const countStr = Object.entries(counts)
      .map(([t, n]) => `${markerFor(t)}×${n}`).join(' ');
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    ctx.log.info(
      `+${result.applied.length} notes${countStr ? ' (' + countStr + ')' : ''} model=${dialogueModel} ${secs}s`
    );
  }

  // --- minutes（挿入を適用した or @ai を消費したときのみ。失敗は警告のみ） ---
  const minutesTrigger = !ctx.cli.noMinutes && changedFile &&
    (result.applied.length > 0 || dialogueDirectives.length > 0);
  if (minutesTrigger) {
    try {
      await generateMinutes(ctx, models, {
        humanLines: dialogueChangedLines.map((n) => lines[n - 1]).filter((l) => l != null),
        insertedNotes: result.applied,
        dateStr: formatDate(new Date()),
      });
    } catch (e) {
      ctx.log.warn(`minutes 失敗（${e.code || e.message}）。議事録は今回スキップします。`);
    }
  }

  return { status: 'ok', applied: result.applied.length, text: result.text };
}

/**
 * summary 指示を逐次処理する。成功した指示は done 消費対象＋章末尾の参照 blockquote を返す。
 * 失敗（応答不正・書き込み失敗など）は警告ログのみで消費しない（次サイクルで再試行）。
 */
async function processSummaries(ctx, models, lines, summaryDirectives, sharedKnowledge = '') {
  const consumed = [];
  const references = [];
  const headings = headingList(lines);
  for (const d of summaryDirectives) {
    const ch = extractChapter(lines, d.index);
    const chapterText = lines.slice(ch.startLine, ch.endLine + 1).join('\n');
    const prompt = buildSummaryPrompt({
      instruction: d.instruction, chapterName: ch.name, chapterText, headings, sharedKnowledge,
    });
    let body;
    try {
      const r = await callClaudeRaw({ promptText: prompt, model: models.summary, timeoutMs: ctx.timeoutMs });
      body = validateSummary(parseClaudeResponse(r.out));
    } catch (e) {
      ctx.log.warn(`summary 失敗（${e.code || e.message}）。指示は消費せず次サイクルで再試行します。`);
      continue;
    }
    let existing = null;
    try {
      if (fs.existsSync(ctx.summaryFile)) existing = fs.readFileSync(ctx.summaryFile, 'utf8');
    } catch (_) { existing = null; }
    const seol = existing ? detectEOL(existing) : '\n';
    try {
      fs.writeFileSync(ctx.summaryFile, upsertSummarySection(existing, ch.name, body, seol));
    } catch (e) {
      ctx.log.warn(`summary ファイル書き込み失敗: ${e.message}`);
      continue;
    }
    ctx.log.info(`summary model=${models.summary} → ${path.basename(ctx.summaryFile)}「${ch.name}」`);
    consumed.push(d);
    const anchor = lastContentAnchor(lines, ch.startLine, ch.endLine);
    if (anchor) {
      references.push({
        anchorLine: anchor.line,
        anchorText: anchor.text,
        text: `まとめを ${path.basename(ctx.summaryFile)}「${ch.name}」に書きました`,
      });
    }
  }
  return { consumed, references };
}

/** 議事録を1回生成して minutes ファイルへ追記する。失敗は呼び出し側で捕捉。 */
async function generateMinutes(ctx, models, opts) {
  const recentEntries = readRecentMinutes(ctx.minutesFile, 2);
  const prompt = buildMinutesPrompt({
    humanLines: opts.humanLines,
    insertedNotes: opts.insertedNotes,
    recentEntries,
  });
  const r = await callClaudeRaw({ promptText: prompt, model: models.minutes, timeoutMs: ctx.timeoutMs });
  const body = validateMinutes(parseClaudeResponse(r.out));
  appendMinutes(ctx.minutesFile, body, opts.dateStr);
  ctx.log.info(`minutes model=${models.minutes} → ${path.basename(ctx.minutesFile)}`);
}

/** --init / 空ファイル: スケルトン提案を1回挿入。 */
async function processInit(ctx, state, currentText) {
  const eol = detectEOL(currentText || '\n');
  const res = await callClaudeRaw({
    promptText: buildInitPrompt(), model: ctx.model, timeoutMs: ctx.timeoutMs,
  });
  let obj;
  try {
    obj = parseClaudeResponse(res.out);
  } catch (_) {
    ctx.log.warn('スケルトン応答が不正。初期化のみ行います。');
    obj = null;
  }
  const skeleton = obj && typeof obj.skeleton === 'string' ? obj.skeleton : null;

  const headerLines = protocolHeaderLines(ctx.startupModels);
  let outLines = [...headerLines, ''];
  if (skeleton) {
    outLines = outLines.concat(splitLines(skeleton.replace(/\r\n|\r/g, '\n')));
  }
  // 既存本文（空でなければ）を末尾へ残す
  const existing = currentText.trim() === '' ? '' : currentText;
  if (existing) {
    outLines.push('');
    outLines = outLines.concat(splitLines(existing));
  }
  const text = joinLines(outLines, eol);
  fs.writeFileSync(ctx.targetFile, text);
  const h = sha256(text);
  state.snapshot = text;
  state.lastWrittenHash = h;
  state.lastProcessedHash = h;
  try {
    const knowledge = syncKnowledgeRoomForLane(ctx.targetFile);
    if (knowledge) state.sharedKnowledgeHash = sha256(knowledge.text);
  } catch (_) { /* 初期化は共有知識の失敗で止めない */ }
  state.initialized = true;
  if (skeleton) {
    ctx.log.info('設計書スケルトンを挿入しました。');
  } else {
    ctx.log.info('プロトコルヘッダのみ挿入しました。');
  }
  return { status: 'init', text };
}

/** 起動時: state 初期化・プロトコルヘッダ挿入。 */
function ensureInitialized(ctx, state) {
  let currentText = readTargetText(ctx.targetFile);
  const eol = detectEOL(currentText || '\n');
  if (!hasProtocolHeader(currentText)) {
    const headerLines = protocolHeaderLines(ctx.startupModels);
    const body = currentText === '' ? [] : splitLines(currentText);
    const outLines = body.length ? [...headerLines, '', ...body] : [...headerLines, ''];
    currentText = joinLines(outLines, eol);
    fs.writeFileSync(ctx.targetFile, currentText);
    state.lastWrittenHash = sha256(currentText);
    ctx.log.info('プロトコルヘッダを挿入しました。');
  }
  state.snapshot = currentText;
  state.lastProcessedHash = sha256(currentText);
  try {
    const knowledge = syncKnowledgeRoomForLane(ctx.targetFile);
    if (knowledge) state.sharedKnowledgeHash = sha256(knowledge.text);
  } catch (_) { /* 初期化は共有知識の失敗で止めない */ }
  state.initialized = true;
  return currentText;
}

// ---------------------------------------------------------------------------
// 実行コンテキストの用意（ロック取得込み）
// ---------------------------------------------------------------------------

function prepareContext(opts, log) {
  const targetFile = path.resolve(opts.file);
  const { stateDir, stateFile } = statePaths(opts.file);

  // ファイルが無ければ空で作成
  if (!fs.existsSync(targetFile)) {
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, '');
  }

  let state = loadState(stateFile) || {
    version: STATE_VERSION,
    snapshot: null,
    lastWrittenHash: null,
    lastProcessedHash: null,
    annotatedFingerprints: [],
    initialized: false,
    warnedLargeFile: false,
  };

  // PID ロック
  if (isProcessAlive(state.pid)) {
    const e = new Error(`同じファイルで mdtalk が既に起動中です (pid=${state.pid})`);
    e.code = 'ELOCKED';
    throw e;
  }
  state.pid = process.pid;

  const cli = {
    model: opts.model,
    modelMinutes: opts.modelMinutes,
    modelSummary: opts.modelSummary,
    noMinutes: opts.noMinutes,
  };
  const ctx = {
    targetFile, stateDir, stateFile,
    model: opts.model,
    cli,
    minutesFile: siblingPath(targetFile, '.minutes.md'),
    summaryFile: siblingPath(targetFile, '.summary.md'),
    startupModels: resolveModels(cli, {}),
    maxNotes: opts.maxNotes,
    interval: opts.interval,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    log,
  };
  return { ctx, state };
}

// ---------------------------------------------------------------------------
// 監視ループ
// ---------------------------------------------------------------------------

function runWatch(ctx, state) {
  ctx.log.info(`監視開始: ${ctx.targetFile} (model=${ctx.model}, interval=${ctx.interval}ms)`);
  let busy = false;
  let pending = false;
  let debounceTimer = null;
  let watcher = null;
  let knowledgeWatcher = null;

  const knowledgeState = () => {
    try {
      const knowledge = syncKnowledgeRoomForLane(ctx.targetFile);
      if (!knowledge) return { file: null, changed: false };
      return {
        file: knowledge.file,
        changed: sha256(knowledge.text) !== state.sharedKnowledgeHash,
      };
    } catch (e) {
      ctx.log.warn(`共有知識の確認に失敗: ${e.message}`);
      return { file: null, changed: false };
    }
  };

  const cycle = async () => {
    if (busy) { pending = true; return; }
    busy = true;
    try {
      const currentText = readTargetText(ctx.targetFile);
      const h = sha256(currentText);
      const shared = knowledgeState();
      if (h === state.lastWrittenHash && !shared.changed) {
        ctx.log.info('自分の書き込みによる変更のためスキップ。');
      } else if (h === state.lastProcessedHash && !shared.changed) {
        // 実質変更なし
      } else {
        await processAnnotations(ctx, state, currentText);
      }
    } catch (e) {
      if (e instanceof ClaudeNotFoundError) {
        printClaudeNotFound(ctx.log);
        shutdown(0);
        return;
      }
      ctx.log.warn('サイクルエラー:', e.message);
    } finally {
      saveState(ctx.stateDir, ctx.stateFile, state);
      busy = false;
      if (pending) { pending = false; schedule(); }
    }
  };

  const schedule = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(cycle, ctx.interval);
  };

  const attach = () => {
    try {
      watcher = fs.watch(ctx.targetFile, () => schedule());
      watcher.on('error', () => { try { watcher.close(); } catch (_) {} watcher = null; });
    } catch (_) {
      watcher = null;
    }
  };
  attach();

  const attachKnowledge = () => {
    const shared = knowledgeState();
    if (!shared.file || !fs.existsSync(shared.file)) return;
    try {
      knowledgeWatcher = fs.watch(shared.file, () => schedule());
      knowledgeWatcher.on('error', () => {
        try { knowledgeWatcher.close(); } catch (_) {}
        knowledgeWatcher = null;
      });
    } catch (_) {
      knowledgeWatcher = null;
    }
  };
  attachKnowledge();

  // ポーリングフォールバック（mtime+size）
  let lastStat = safeStatKey(ctx.targetFile);
  let lastKnowledgeStat = safeStatKey((knowledgeState().file || ''));
  const poll = setInterval(() => {
    if (!fs.existsSync(ctx.targetFile)) return; // 消えたら次で再アタッチ
    if (!watcher) attach();
    const key = safeStatKey(ctx.targetFile);
    if (key && key !== lastStat) {
      lastStat = key;
      schedule();
    }
    const shared = knowledgeState();
    if (!knowledgeWatcher && shared.file) attachKnowledge();
    const knowledgeKey = shared.file ? safeStatKey(shared.file) : null;
    if (knowledgeKey && knowledgeKey !== lastKnowledgeStat) {
      lastKnowledgeStat = knowledgeKey;
      schedule();
    }
  }, POLL_INTERVAL_MS);

  // 旧バージョンの state には共有知識ハッシュがないため、起動直後に一度再点検する。
  if (!state.sharedKnowledgeHash && knowledgeState().file) schedule();

  let shuttingDown = false;
  function shutdown(code) {
    if (shuttingDown) return;
    shuttingDown = true;
    if (debounceTimer) clearTimeout(debounceTimer);
    clearInterval(poll);
    if (watcher) { try { watcher.close(); } catch (_) {} }
    if (knowledgeWatcher) { try { knowledgeWatcher.close(); } catch (_) {} }
    delete state.pid;
    try { saveState(ctx.stateDir, ctx.stateFile, state); } catch (_) {}
    ctx.log.info('終了します。');
    process.exit(code);
  }

  process.on('SIGINT', () => shutdown(0));
  process.on('SIGTERM', () => shutdown(0));
}

function safeStatKey(file) {
  try {
    const st = fs.statSync(file);
    return `${st.mtimeMs}:${st.size}`;
  } catch (_) {
    return null;
  }
}

function printClaudeNotFound(log) {
  log.error(
    'claude コマンドが見つかりません。\n' +
    '  インストール: npm install -g @anthropic-ai/claude-code\n' +
    '  もしくは環境変数 MDTALK_CLAUDE_CMD で claude の代替コマンドを指定してください。'
  );
}

// ---------------------------------------------------------------------------
// エントリポイント
// ---------------------------------------------------------------------------

async function main(argv) {
  let opts;
  try {
    opts = parseCliArgs(argv);
  } catch (e) {
    console.error('引数エラー:', e.message);
    return 2;
  }
  if (!opts.file) {
    console.error('使い方: mdtalk <file.md> [options]');
    return 2;
  }
  const log = makeLogger(opts.quiet);

  let ctx, state;
  try {
    ({ ctx, state } = prepareContext(opts, log));
  } catch (e) {
    if (e.code === 'ELOCKED') { log.error(e.message); return 1; }
    if (e.code === 'ENOTUTF8') { log.error(e.message); return 1; }
    log.error(e.message);
    return 1;
  }

  try {
    const firstTime = !state.initialized;
    let currentText = readTargetText(ctx.targetFile);
    const isEmpty = currentText.trim() === '';

    if (opts.init || (firstTime && isEmpty)) {
      // スケルトン提案モード
      try {
        await processInit(ctx, state, currentText);
      } catch (e) {
        if (e instanceof ClaudeNotFoundError) { printClaudeNotFound(log); return 1; }
        throw e;
      }
      if (opts.once) { saveEndState(ctx, state); return 0; }
      runWatch(ctx, state);
      return 0;
    }

    if (firstTime) {
      // 既存文書を初回に開いた: ヘッダ挿入＋スナップショットのみ、注釈しない
      ensureInitialized(ctx, state);
      log.info('初回起動: スナップショットを保存（初回は注釈しません）。');
      if (opts.once) { saveEndState(ctx, state); return 0; }
      runWatch(ctx, state);
      return 0;
    }

    // 2回目以降。ヘッダが無ければ補う。
    if (!hasProtocolHeader(currentText)) {
      ensureInitialized(ctx, state);
      currentText = readTargetText(ctx.targetFile);
    }

    if (opts.once) {
      const h = sha256(currentText);
      let knowledgeChanged = false;
      try {
        const knowledge = syncKnowledgeRoomForLane(ctx.targetFile);
        knowledgeChanged = Boolean(knowledge && sha256(knowledge.text) !== state.sharedKnowledgeHash);
      } catch (e) {
        log.warn(`共有知識の確認に失敗: ${e.message}`);
      }
      if (h === state.lastWrittenHash && !knowledgeChanged) {
        log.info('自分の書き込みによる変更のためスキップ。');
      } else if (h === state.lastProcessedHash && !knowledgeChanged) {
        log.info('変更なし。');
      } else {
        try {
          await processAnnotations(ctx, state, currentText);
        } catch (e) {
          if (e instanceof ClaudeNotFoundError) { printClaudeNotFound(log); saveEndState(ctx, state); return 1; }
          throw e;
        }
      }
      saveEndState(ctx, state);
      return 0;
    }

    runWatch(ctx, state);
    return 0;
  } catch (e) {
    log.error('致命的エラー:', e.stack || e.message);
    try { saveEndState(ctx, state); } catch (_) {}
    return 1;
  }
}

function saveEndState(ctx, state) {
  delete state.pid; // --once はロックを残さない
  saveState(ctx.stateDir, ctx.stateFile, state);
}

// ---------------------------------------------------------------------------
// exports（テスト用）
// ---------------------------------------------------------------------------

module.exports = {
  sha256,
  tokenizeCmd,
  detectEOL,
  splitLines,
  joinLines,
  formatDate,
  markAiAnnotationLines,
  lcsMatchedNewIndices,
  humanChangedLineNumbers,
  normalizeParagraph,
  paragraphFingerprint,
  paragraphBounds,
  matchAnchor,
  markerFor,
  formatAnnotationLines,
  findDirectives,
  applyWrite,
  hasProtocolHeader,
  protocolHeaderRange,
  protocolHeaderLines,
  parseModelsSpec,
  parseModelsHeader,
  resolveModels,
  buildPrompt,
  buildInitPrompt,
  buildMinutesPrompt,
  buildSummaryPrompt,
  extractChapter,
  lastContentAnchor,
  upsertSummarySection,
  siblingPath,
  parseClaudeResponse,
  validateInsertions,
  validateMinutes,
  validateSummary,
  statePaths,
  main,
  MARKERS,
};

if (require.main === module) {
  // watch モードでは main は 0 を返すが process は timers/watcher で生き続ける。
  // --once / init / エラー時のみ exitCode が意味を持つ。
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  }).catch((e) => {
    console.error('[mdtalk][error]', e.stack || e.message);
    process.exit(1);
  });
}
