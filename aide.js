#!/usr/bin/env node
'use strict';

/*
 * aide — レーン分割・並列設計オーケストレーション CLI
 *
 * 設計書 docs/design/aide-orchestration.md の Phase 1〜3 実装。
 * mdtalk.js と同じく単一ファイル・外部依存ゼロ（node: 標準モジュールのみ）。
 *
 * 役割分担: レーン内の対話は mdtalk が担う。aide は「ボタン」を提供する:
 *   observe   — 観察者AI（既定: Codex）が矛盾＋分割可能性をチェック
 *   accept    — 合格レポートを前提に、レーンの内容をプールへ積む（人間の判断）
 *   integrate — マスターAI（別セッション・バッチ）がプールを清書して master へ
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { parseArgs } = require('node:util');
const {
  sha256, tokenizeCmd, formatDate, splitLines, parseClaudeResponse,
} = require('./mdtalk.js');

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

const DEFAULT_ROOT = 'design';
const DEFAULT_OBSERVER_CMD = 'codex exec -';
const DEFAULT_MASTER_CMD = 'claude -p --model opus --output-format json';
const OBSERVER_TIMEOUT_MS = 180000;
const MASTER_TIMEOUT_MS = 300000;

// ---------------------------------------------------------------------------
// ログ
// ---------------------------------------------------------------------------

let QUIET = false;
const log = {
  info: (...a) => { if (!QUIET) console.log('[aide]', ...a); },
  warn: (...a) => console.warn('[aide][warn]', ...a),
  error: (...a) => console.error('[aide][error]', ...a),
};

// ---------------------------------------------------------------------------
// パス・テンプレート
// ---------------------------------------------------------------------------

function rootPaths(root) {
  return {
    root,
    master: path.join(root, 'master.md'),
    pool: path.join(root, 'pool.md'),
    archive: path.join(root, 'pool-archive.md'),
    lanesDir: path.join(root, 'lanes'),
    reportsDir: path.join(root, 'reports'),
  };
}

function masterTemplate() {
  return [
    '# マスター設計書',
    '<!-- aide:master',
    'このファイルは AIDE の「正」。アクセプト済みの内容だけが載る。',
    '更新は `aide integrate`（マスターAI）経由。人間の直接編集も可',
    '（次回統合時にマスターAIが整合を確認する）。',
    '-->',
    '',
    '## 目的 / 背景',
    '',
    '（プロダクトの目的をここに書く）',
    '',
    '## アーキテクチャ原則',
    '',
    '## 機能・コンポーネント（アクセプト済み）',
    '',
    '## 未決事項',
    '',
    '## 変更履歴',
    '',
  ].join('\n');
}

function laneTemplate(topic) {
  return [
    `# レーン: ${topic}`,
    '<!-- aide:lane',
    `考慮項目「${topic}」の対話ファイル。mdtalk で監視して対話する:`,
    `  mdtalk lanes/${topic}.md`,
    '観察:      aide observe <このファイル>',
    'アクセプト: aide accept <このファイル> [--section <見出し>]',
    '-->',
    '',
    `（ここに「${topic}」について書き始める）`,
    '',
  ].join('\n');
}

function poolTemplate() {
  return [
    '<!-- aide:pool',
    'アクセプト済み・未統合の項目（ステージング）。`aide integrate` が消化する。',
    'エントリの手編集はしない。',
    '-->',
    '',
  ].join('\n');
}

function archiveTemplate() {
  return [
    '<!-- aide:pool-archive',
    '統合済み/差し戻し済みエントリの監査証跡。消さない。',
    '-->',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// バックエンド呼び出し（コマンドは環境変数で差し替え可能）
// ---------------------------------------------------------------------------

function callBackend({ cmdStr, promptText, timeoutMs, label, envVar }) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = tokenizeCmd(cmdStr);
    const notFound = () => new Error(
      `${label}コマンドが見つかりません: ${cmd}\n` +
      `  環境変数 ${envVar} で差し替えできます（現在: ${cmdStr}）`);
    let child;
    try {
      child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      reject(e.code === 'ENOENT' ? notFound() : e);
      return;
    }
    let out = '';
    let err = '';
    let done = false;
    const finish = (fn, val) => { if (!done) { done = true; clearTimeout(timer); fn(val); } };
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch (_) {}
      finish(reject, new Error(`${label}がタイムアウトしました (${timeoutMs}ms)`));
    }, timeoutMs);
    child.on('error', (e) => finish(reject, e.code === 'ENOENT' ? notFound() : e));
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', (code) => finish(resolve, { code, out, err }));
    child.stdin.on('error', () => {}); // EPIPE 無視
    child.stdin.write(promptText);
    child.stdin.end();
  });
}

// ---------------------------------------------------------------------------
// レーン・レポートのユーティリティ
// ---------------------------------------------------------------------------

/** レーンパスから design ルートを求める（<root>/lanes/<file>.md 前提）。 */
function laneRootOf(lanePath) {
  const abs = path.resolve(lanePath);
  const lanesDir = path.dirname(abs);
  if (path.basename(lanesDir) !== 'lanes') {
    throw new Error(`レーンは <root>/lanes/ 配下に置いてください: ${lanePath}`);
  }
  return { root: path.dirname(lanesDir), laneAbs: abs, laneRel: 'lanes/' + path.basename(abs) };
}

function laneTopic(lanePath) {
  return path.basename(lanePath).replace(/\.md$/i, '');
}

function headingOf(line) {
  const m = line.match(/^(#{1,6})\s+(.*)$/);
  return m ? { level: m[1].length, text: m[2].trim() } : null;
}

/** 指定見出しのセクション（見出し行〜次の同レベル以上の見出しの手前）を返す。 */
function extractSection(lines, heading) {
  const target = String(heading).trim();
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    const h = headingOf(lines[i]);
    if (h && h.text === target) { start = i; level = h.level; break; }
  }
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const h = headingOf(lines[i]);
    if (h && h.level <= level) { end = i; break; }
  }
  return lines.slice(start, end).join('\n').trim();
}

/** mdtalk プロトコルヘッダ / aide:lane コメントのブロックを剥がす。 */
function stripLaneScaffold(text) {
  const lines = splitLines(text);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (/^<!--\s*(mdtalk protocol|aide:lane)/.test(lines[i])) {
      while (i < lines.length && !/-->\s*$/.test(lines[i])) i++;
      i++; // '-->' 行自体
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  return out.join('\n').trim();
}

/** 他レーンの見出し一覧（観察者のトークン節約用コンテキスト）。 */
function otherLaneHeadings(p, excludeAbs) {
  const out = [];
  if (!fs.existsSync(p.lanesDir)) return out;
  for (const f of fs.readdirSync(p.lanesDir).sort()) {
    if (!f.endsWith('.md')) continue;
    const abs = path.resolve(path.join(p.lanesDir, f));
    if (abs === excludeAbs) continue;
    const heads = splitLines(fs.readFileSync(abs, 'utf8'))
      .filter((l) => /^#{1,6}\s/.test(l));
    out.push({ lane: 'lanes/' + f, headings: heads });
  }
  return out;
}

const REPORT_META_RE = /<!-- aide:report\r?\n([\s\S]*?)-->/;

function parseMetaLines(block) {
  const meta = {};
  for (const line of splitLines(block)) {
    const m = line.match(/^([A-Za-z][\w-]*):\s?(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  return meta;
}

function parseReportMeta(text) {
  const m = text.match(REPORT_META_RE);
  return m ? parseMetaLines(m[1]) : null;
}

/** そのレーンの最新の観察レポートを返す（なければ null）。 */
function latestReportFor(p, topic) {
  if (!fs.existsSync(p.reportsDir)) return null;
  const esc = topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^${esc}-(\\d+)\\.md$`);
  let best = null;
  for (const f of fs.readdirSync(p.reportsDir)) {
    const m = f.match(re);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!best || n > best.n) best = { n, file: f };
    }
  }
  if (!best) return null;
  const full = path.join(p.reportsDir, best.file);
  const meta = parseReportMeta(fs.readFileSync(full, 'utf8'));
  return { n: best.n, file: best.file, rel: 'reports/' + best.file, meta };
}

// ---------------------------------------------------------------------------
// プール
// ---------------------------------------------------------------------------

const POOL_ENTRY_RE = /<!-- aide:entry\r?\n([\s\S]*?)-->\r?\n([\s\S]*?)\r?\n<!-- aide:end -->/g;

/** pool/archive のエントリを列挙する。 */
function parsePoolEntries(text) {
  const out = [];
  let m;
  POOL_ENTRY_RE.lastIndex = 0;
  while ((m = POOL_ENTRY_RE.exec(text)) !== null) {
    out.push({ meta: parseMetaLines(m[1]), content: m[2].trim(), raw: m[0] });
  }
  return out;
}

const ENTRY_META_ORDER = [
  'id', 'lane', 'section', 'accepted', 'report', 'status', 'reason', 'integratedAt',
];

function formatEntry(meta, content) {
  const lines = ['<!-- aide:entry'];
  for (const k of ENTRY_META_ORDER) {
    if (meta[k] !== undefined && meta[k] !== '') lines.push(`${k}: ${meta[k]}`);
  }
  lines.push('-->', content, '<!-- aide:end -->');
  return lines.join('\n');
}

/** pool テキスト = 前書き + エントリ群、として再構成する。 */
function rebuildPool(text, entries) {
  const idx = text.search(/<!-- aide:entry\r?\n/);
  const preamble = (idx >= 0 ? text.slice(0, idx) : text).replace(/\s+$/, '');
  const blocks = entries.map((e) => formatEntry(e.meta, e.content));
  return [preamble, '', ...blocks.flatMap((b) => [b, ''])].join('\n').replace(/\n{3,}/g, '\n\n');
}

// ---------------------------------------------------------------------------
// プロンプト
// ---------------------------------------------------------------------------

function buildObserverPrompt({ masterText, laneRel, laneText, others }) {
  const othersText = others.length === 0
    ? '（他のレーンはまだない）'
    : others.map((o) => `### ${o.lane}\n${o.headings.join('\n') || '（見出しなし）'}`).join('\n\n');
  return [
    'あなたは設計レビューの「観察者」です。対話には参加しておらず、外部の目として',
    '対象レーンの設計内容を検査します。検査項目は2つ:',
    '1. 矛盾: マスター設計書・他レーンとの用語/インターフェース/前提の衝突',
    '2. 分割可能性: この設計が疎結合か。他への依存がインターフェースとして明示され、',
    '   このセクション単独で実装単位として成立するか',
    '両方に問題がなければ verdict は "pass"、どちらかに問題があれば "fail"。',
    '',
    '## マスター設計書（正）',
    masterText,
    '',
    '## 他レーンの見出し一覧',
    othersText,
    '',
    `## 検査対象レーン: ${laneRel}`,
    laneText,
    '',
    '## 応答形式（このJSONのみを出力すること）',
    '{"verdict":"pass"|"fail",',
    ' "conflicts":[{"with":"<ファイルや節>","detail":"<内容>"}],',
    ' "separability":{"ok":true|false,"detail":"<判定理由>"},',
    ' "report":"<Markdown形式の詳細レポート（日本語）>"}',
  ].join('\n');
}

function buildMasterPrompt({ masterText, entries }) {
  const entryText = entries.map((e) => [
    '--- エントリ ---',
    `id: ${e.meta.id}`,
    `lane: ${e.meta.lane}`,
    `section: ${e.meta.section}`,
    `accepted: ${e.meta.accepted}`,
    '本文:',
    e.content,
  ].join('\n')).join('\n\n');
  return [
    'あなたはマスター設計書を管理する「マスターAI」です。人間がアクセプトした',
    'プール項目を清書してマスター設計書に統合します。規範:',
    '- 人間がアクセプトした意味内容を変えない。対話の注釈（`> ❓ **AI**:` 等の',
    '  blockquote）や `<!-- done: ... -->` は剥がし、決定内容だけを設計書の文体で書く',
    '- マスターの既存構造（見出し）を尊重し、適切な節へ統合する',
    '- エントリ同士、またはマスターと矛盾するエントリは統合せず bounced に理由付きで返す',
    '- 「変更履歴」節があれば統合内容を1行追記する',
    '',
    '## 現在のマスター設計書',
    masterText,
    '',
    '## プール（統合待ちエントリ）',
    entryText,
    '',
    '## 応答形式（このJSONのみを出力すること）',
    '{"master":"<master.md の新しい全文>",',
    ' "consumed":["<統合したエントリのid>", ...],',
    ' "bounced":[{"id":"<差し戻すid>","reason":"<理由>"}]}',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// コマンド
// ---------------------------------------------------------------------------

function cmdInit(root) {
  const p = rootPaths(root);
  fs.mkdirSync(p.lanesDir, { recursive: true });
  fs.mkdirSync(p.reportsDir, { recursive: true });
  const created = [];
  const writeIfMissing = (file, content) => {
    if (!fs.existsSync(file)) { fs.writeFileSync(file, content); created.push(file); }
  };
  writeIfMissing(p.master, masterTemplate());
  writeIfMissing(p.pool, poolTemplate());
  writeIfMissing(p.archive, archiveTemplate());
  log.info(`初期化しました: ${root}/`
    + (created.length ? `（新規: ${created.map((f) => path.basename(f)).join(', ')}）` : '（既存を維持）'));
  return 0;
}

function cmdLane(root, topic) {
  if (!topic) throw new Error('レーン名を指定してください: aide lane <topic> [root]');
  const p = rootPaths(root);
  if (!fs.existsSync(p.lanesDir)) throw new Error(`${root}/ がありません。先に aide init を実行してください`);
  const safe = topic.replace(/[\\/:*?"<>|\s]+/g, '-');
  const file = path.join(p.lanesDir, `${safe}.md`);
  if (fs.existsSync(file)) throw new Error(`レーンは既に存在します: ${file}`);
  fs.writeFileSync(file, laneTemplate(safe));
  log.info(`レーンを作成しました: ${file}`);
  log.info(`対話を始める: mdtalk ${path.join(root, 'lanes', safe + '.md')}`);
  return 0;
}

async function cmdObserve(lanePath) {
  const { root, laneAbs, laneRel } = laneRootOf(lanePath);
  const p = rootPaths(root);
  if (!fs.existsSync(laneAbs)) throw new Error(`レーンがありません: ${lanePath}`);
  if (!fs.existsSync(p.master)) throw new Error(`master.md がありません。aide init を実行してください`);
  const laneText = fs.readFileSync(laneAbs, 'utf8');
  const laneHash = sha256(laneText);
  const masterText = fs.readFileSync(p.master, 'utf8');
  const others = otherLaneHeadings(p, laneAbs);

  const cmdStr = process.env.AIDE_OBSERVER_CMD || DEFAULT_OBSERVER_CMD;
  log.info(`観察者を起動: ${cmdStr.split(' ')[0]} → ${laneRel}`);
  const res = await callBackend({
    cmdStr,
    promptText: buildObserverPrompt({ masterText, laneRel, laneText, others }),
    timeoutMs: OBSERVER_TIMEOUT_MS,
    label: '観察者',
    envVar: 'AIDE_OBSERVER_CMD',
  });
  let obj;
  try {
    obj = parseClaudeResponse(res.out);
  } catch (e) {
    throw new Error(`観察者の応答をJSONとして解釈できません: ${e.message}\n--- 応答先頭 ---\n${String(res.out).slice(0, 400)}`);
  }
  if (obj.verdict !== 'pass' && obj.verdict !== 'fail') {
    throw new Error(`観察者の応答に verdict がありません（pass|fail）`);
  }

  const topic = laneTopic(laneAbs);
  const prev = latestReportFor(p, topic);
  const n = prev ? prev.n + 1 : 1;
  const reportFile = path.join(p.reportsDir, `${topic}-${n}.md`);
  const conflicts = Array.isArray(obj.conflicts) ? obj.conflicts : [];
  const sep = obj.separability || {};
  const body = [
    '<!-- aide:report',
    `lane: ${laneRel}`,
    `laneHash: ${laneHash}`,
    `verdict: ${obj.verdict}`,
    `date: ${formatDate(new Date())}`,
    '-->',
    '',
    `# 観察レポート: ${laneRel} (#${n})`,
    '',
    `- verdict: **${obj.verdict}**`,
    `- 分割可能性: ${sep.ok ? 'OK' : 'NG'} — ${sep.detail || '(詳細なし)'}`,
    `- 矛盾: ${conflicts.length === 0 ? 'なし'
      : conflicts.map((c) => `${c.with}: ${c.detail}`).join(' / ')}`,
    '',
    typeof obj.report === 'string' ? obj.report : '',
    '',
  ].join('\n');
  fs.writeFileSync(reportFile, body);
  log.info(`verdict: ${obj.verdict} → ${reportFile}`);
  if (obj.verdict === 'pass') {
    log.info(`アクセプト可能です: aide accept ${lanePath}`);
  } else {
    log.info('不合格。レポートを見てレーンの対話を続けてください。');
  }
  return 0;
}

function cmdAccept(lanePath, { section, force }) {
  const { root, laneAbs, laneRel } = laneRootOf(lanePath);
  const p = rootPaths(root);
  if (!fs.existsSync(laneAbs)) throw new Error(`レーンがありません: ${lanePath}`);
  if (!fs.existsSync(p.pool)) throw new Error(`pool.md がありません。aide init を実行してください`);
  const laneText = fs.readFileSync(laneAbs, 'utf8');
  const topic = laneTopic(laneAbs);

  const report = latestReportFor(p, topic);
  if (!report || !report.meta) {
    throw new Error(`観察レポートがありません。先に aide observe ${lanePath} を実行してください`);
  }
  if (report.meta.verdict !== 'pass') {
    throw new Error(`最新の観察が不合格です（${report.rel}）。レーンの対話で解消してから再観察してください`);
  }
  if (report.meta.laneHash !== sha256(laneText) && !force) {
    throw new Error('観察後にレーンが編集されています。aide observe をやり直してください（--force で強行可）');
  }

  let content;
  if (section) {
    content = extractSection(splitLines(laneText), section);
    if (content === null) throw new Error(`見出しが見つかりません: ${section}`);
  } else {
    content = stripLaneScaffold(laneText);
  }
  if (!content) throw new Error('アクセプトする内容が空です');

  const id = sha256(content + '|' + Date.now()).slice(0, 8);
  const meta = {
    id,
    lane: laneRel,
    section: section || '(全体)',
    accepted: formatDate(new Date()),
    report: report.rel,
  };
  const poolText = fs.readFileSync(p.pool, 'utf8');
  fs.writeFileSync(p.pool, poolText.replace(/\s+$/, '') + '\n\n' + formatEntry(meta, content) + '\n');
  log.info(`アクセプト → pool に追加 (id=${id}, section=${meta.section})`);
  log.info('統合する: aide integrate' + (root === DEFAULT_ROOT ? '' : ` ${root}`));
  return 0;
}

async function cmdIntegrate(root) {
  const p = rootPaths(root);
  if (!fs.existsSync(p.master) || !fs.existsSync(p.pool)) {
    throw new Error(`${root}/ が初期化されていません。aide init を実行してください`);
  }
  const masterText = fs.readFileSync(p.master, 'utf8');
  const poolText = fs.readFileSync(p.pool, 'utf8');
  const entries = parsePoolEntries(poolText);
  if (entries.length === 0) {
    log.info('プールは空です。統合するものがありません。');
    return 0;
  }

  const cmdStr = process.env.AIDE_MASTER_CMD || DEFAULT_MASTER_CMD;
  log.info(`マスターAIを起動: ${cmdStr.split(' ')[0]}（エントリ ${entries.length}件）`);
  const res = await callBackend({
    cmdStr,
    promptText: buildMasterPrompt({ masterText, entries }),
    timeoutMs: MASTER_TIMEOUT_MS,
    label: 'マスターAI',
    envVar: 'AIDE_MASTER_CMD',
  });
  let obj;
  try {
    obj = parseClaudeResponse(res.out);
  } catch (e) {
    throw new Error(`マスターAIの応答をJSONとして解釈できません（master/pool は変更していません）: ${e.message}`);
  }
  if (!obj || typeof obj.master !== 'string' || obj.master.trim() === '') {
    throw new Error('マスターAIの応答に master がありません（master/pool は変更していません）');
  }
  const consumed = (Array.isArray(obj.consumed) ? obj.consumed : []).filter((s) => typeof s === 'string');
  const bounced = (Array.isArray(obj.bounced) ? obj.bounced : [])
    .filter((b) => b && typeof b.id === 'string')
    .map((b) => ({ id: b.id, reason: typeof b.reason === 'string' ? b.reason : '' }));

  const byId = new Map(entries.map((e) => [e.meta.id, e]));
  const now = formatDate(new Date());
  const archiveBlocks = [];
  const handled = new Set();
  for (const id of consumed) {
    const e = byId.get(id);
    if (!e) { log.warn(`consumed に不明な id: ${id}（無視）`); continue; }
    archiveBlocks.push(formatEntry({ ...e.meta, status: 'integrated', integratedAt: now }, e.content));
    handled.add(id);
  }
  for (const b of bounced) {
    const e = byId.get(b.id);
    if (!e) { log.warn(`bounced に不明な id: ${b.id}（無視）`); continue; }
    if (handled.has(b.id)) { log.warn(`id が consumed と bounced の両方にあります: ${b.id}（consumed を優先）`); continue; }
    archiveBlocks.push(formatEntry(
      { ...e.meta, status: 'bounced', reason: b.reason || '(理由なし)', integratedAt: now }, e.content));
    handled.add(b.id);
  }
  const remaining = entries.filter((e) => !handled.has(e.meta.id));

  // 書き込み（master → archive → pool の順。lanes には一切触れない）
  fs.writeFileSync(p.master, obj.master.replace(/\s*$/, '\n'));
  if (archiveBlocks.length) {
    const archText = fs.readFileSync(p.archive, 'utf8');
    fs.writeFileSync(p.archive,
      archText.replace(/\s+$/, '') + '\n\n' + archiveBlocks.join('\n\n') + '\n');
  }
  fs.writeFileSync(p.pool, rebuildPool(poolText, remaining));

  const nCons = consumed.filter((id) => byId.has(id)).length;
  log.info(`統合: ${nCons}件 / 差し戻し: ${bounced.length}件 / プール残: ${remaining.length}件`);
  for (const b of bounced) {
    if (byId.has(b.id)) log.info(`  差し戻し ${b.id} (${byId.get(b.id).meta.lane}): ${b.reason}`);
  }
  return 0;
}

function cmdStatus(root) {
  const p = rootPaths(root);
  if (!fs.existsSync(p.root)) throw new Error(`${root}/ がありません。aide init を実行してください`);
  console.log(`design root: ${p.root}`);
  console.log(`master: ${fs.existsSync(p.master) ? fs.statSync(p.master).size + ' bytes' : 'なし'}`);
  const lanes = fs.existsSync(p.lanesDir)
    ? fs.readdirSync(p.lanesDir).filter((f) => f.endsWith('.md')).sort() : [];
  console.log(`lanes: ${lanes.length}件`);
  for (const f of lanes) {
    const abs = path.join(p.lanesDir, f);
    const topic = laneTopic(f);
    const rep = latestReportFor(p, topic);
    let s = '観察なし';
    if (rep && rep.meta) {
      const stale = rep.meta.laneHash !== sha256(fs.readFileSync(abs, 'utf8'));
      s = `${rep.meta.verdict} (${rep.rel})${stale ? ' [観察後に編集あり]' : ''}`;
    }
    console.log(`  lanes/${f}: ${s}`);
  }
  const poolEntries = fs.existsSync(p.pool) ? parsePoolEntries(fs.readFileSync(p.pool, 'utf8')) : [];
  console.log(`pool: ${poolEntries.length}件 ${poolEntries.map((e) => e.meta.id).join(', ')}`);
  const archEntries = fs.existsSync(p.archive) ? parsePoolEntries(fs.readFileSync(p.archive, 'utf8')) : [];
  console.log(`archive: ${archEntries.length}件`);
  return 0;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

const USAGE = `aide <command> [args]

commands:
  init [root]                        design ディレクトリを初期化（既定: design）
  lane <topic> [root]                レーンファイルを作成
  observe <root>/lanes/<topic>.md    観察者AIで矛盾＋分割可能性をチェック
  accept  <root>/lanes/<topic>.md [--section <見出し>] [--force]
                                     合格レポートを前提にプールへ追加
  integrate [root]                   マスターAIでプールを master.md に統合
  status [root]                      全体状況を表示

env:
  AIDE_OBSERVER_CMD  観察者コマンド（既定: ${DEFAULT_OBSERVER_CMD}）
  AIDE_MASTER_CMD    マスターAIコマンド（既定: ${DEFAULT_MASTER_CMD}）
`;

async function main(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    options: {
      section: { type: 'string' },
      force: { type: 'boolean', default: false },
      quiet: { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });
  QUIET = values.quiet;
  const [cmd, arg1, arg2] = positionals;
  try {
    switch (cmd) {
      case 'init': return cmdInit(arg1 || DEFAULT_ROOT);
      case 'lane': return cmdLane(arg2 || DEFAULT_ROOT, arg1);
      case 'observe': {
        if (!arg1) throw new Error('レーンを指定してください: aide observe <root>/lanes/<topic>.md');
        return await cmdObserve(arg1);
      }
      case 'accept': {
        if (!arg1) throw new Error('レーンを指定してください: aide accept <root>/lanes/<topic>.md');
        return cmdAccept(arg1, { section: values.section, force: values.force });
      }
      case 'integrate': return await cmdIntegrate(arg1 || DEFAULT_ROOT);
      case 'status': return cmdStatus(arg1 || DEFAULT_ROOT);
      default:
        process.stdout.write(USAGE);
        return cmd ? 1 : 0;
    }
  } catch (e) {
    log.error(e.message);
    return 1;
  }
}

module.exports = {
  extractSection,
  stripLaneScaffold,
  parsePoolEntries,
  parseReportMeta,
  rebuildPool,
  formatEntry,
  buildObserverPrompt,
  buildMasterPrompt,
  laneRootOf,
  main,
};

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; });
}
