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
const { parseArgs, TextDecoder } = require('node:util');
const {
  sha256, tokenizeCmd, formatDate, splitLines, parseClaudeResponse,
} = require('./mdtalk.js');
const {
  KNOWLEDGE_FILE, isConversationLaneName, syncKnowledgeRoom,
} = require('./knowledge.js');

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

const DEFAULT_ROOT = 'design';
// 拡張子なしにして、Windowsでも .exe と npm の .cmd shim の両方を許容する。
// .cmd は非シェルspawnで起動できないため、callBackendが必要な場合だけshellへフォールバックする。
const DEFAULT_OBSERVER_CMD = 'codex exec --skip-git-repo-check --ephemeral --color never -';
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
    knowledge: path.join(root, 'lanes', KNOWLEDGE_FILE),
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

/** UTF-8を優先し、Windowsコマンド由来のShift-JIS出力だけをフォールバック復号する。 */
function decodeBackendOutput(chunks) {
  const bytes = Buffer.concat((chunks || []).map((chunk) => (
    Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
  )));
  if (bytes.length === 0) return '';
  const utf8 = bytes.toString('utf8');
  if (!utf8.includes('\uFFFD')) return utf8;
  try {
    return new TextDecoder('shift_jis').decode(bytes);
  } catch (_) {
    return utf8;
  }
}

function callBackend({ cmdStr, promptText, timeoutMs, label, envVar }) {
  const attempt = (useShell) => new Promise((resolve, reject) => {
    let child;
    try {
      if (useShell) {
        // Windows: npm 製 CLI の実体は .cmd で、非シェル spawn では起動できない。
        // その場合のみユーザー指定の文字列をそのままシェルに渡す
        child = spawn(cmdStr, { shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
      } else {
        const [cmd, ...args] = tokenizeCmd(cmdStr);
        child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });
      }
    } catch (e) {
      reject(e);
      return;
    }
    const outChunks = [];
    const errChunks = [];
    let done = false;
    const finish = (fn, val) => { if (!done) { done = true; clearTimeout(timer); fn(val); } };
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch (_) {}
      finish(reject, new Error(`${label}がタイムアウトしました (${timeoutMs}ms)`));
    }, timeoutMs);
    child.on('error', (e) => finish(reject, e));
    child.stdout.on('data', (d) => { outChunks.push(d); });
    child.stderr.on('data', (d) => { errChunks.push(d); });
    child.on('close', (code) => finish(resolve, {
      code,
      out: decodeBackendOutput(outChunks),
      err: decodeBackendOutput(errChunks),
    }));
    child.stdin.on('error', () => {}); // EPIPE 無視
    child.stdin.write(promptText);
    child.stdin.end();
  });
  const retriable = (e) => e && (e.code === 'ENOENT' || e.code === 'EINVAL' || e.code === 'EPERM');
  const requireSuccess = (result) => {
    if (result.code === 0) return result;
    const detail = String(result.err || result.out || '').trim();
    const suffix = detail ? `\n--- stderr/stdout ---\n${detail.slice(-2000)}` : '';
    const error = new Error(`${label}コマンドが異常終了しました (exit ${result.code})${suffix}`);
    error.code = 'EBACKEND';
    throw error;
  };
  return attempt(false)
    .catch((e) => {
      if (process.platform === 'win32' && retriable(e)) return attempt(true);
      throw e;
    })
    .catch((e) => {
      if (retriable(e)) {
        throw new Error(
          `${label}コマンドが見つかりません: ${tokenizeCmd(cmdStr)[0]}\n` +
          `  環境変数 ${envVar} で差し替えできます（現在: ${cmdStr}）`);
      }
      throw e;
    })
    .then(requireSuccess);
}

/**
 * ログやバナーが混ざった出力から、最後に現れる完全な JSON オブジェクトを
 * 取り出す（codex exec は最終メッセージの前に進行ログを stdout に出す）。
 */
function extractJsonObject(text) {
  const s = String(text);
  const scanBalanced = (from) => {
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = from; i < s.length; i++) {
      const c = s[i];
      if (inStr) {
        if (esc) esc = false;
        else if (c === '\\') esc = true;
        else if (c === '"') inStr = false;
        continue;
      }
      if (c === '"') inStr = true;
      else if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) return i; }
    }
    return -1;
  };
  // 先頭から走査し、トップレベルで parse に成功したオブジェクト列の最後を返す
  // （最終メッセージが一番後ろに出る想定。内側の {…} は読み飛ばす）
  let last = null;
  let i = 0;
  while (i < s.length) {
    if (s[i] !== '{') { i++; continue; }
    const end = scanBalanced(i);
    if (end < 0) { i++; continue; }
    try {
      last = JSON.parse(s.slice(i, end + 1));
      i = end + 1;
    } catch (_) {
      i++;
    }
  }
  if (last === null) throw new Error('出力から JSON オブジェクトを抽出できません');
  return last;
}

/** バックエンド応答のパース: claude envelope/フェンス → 生JSON抽出の順に試す。 */
function parseBackendResponse(out) {
  try {
    return parseClaudeResponse(out);
  } catch (_) {
    return extractJsonObject(out);
  }
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
    if (!isConversationLaneName(f)) continue;
    const abs = path.resolve(path.join(p.lanesDir, f));
    if (abs === excludeAbs) continue;
    const heads = splitLines(fs.readFileSync(abs, 'utf8'))
      .filter((l) => /^#{1,6}\s/.test(l));
    out.push({ lane: 'lanes/' + f, headings: heads });
  }
  return out;
}

const REPORT_META_RE = /<!-- aide:report\r?\n([\s\S]*?)-->/;
const OBSERVE_LEVELS = new Set(['light', 'strict']);

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

/**
 * 先頭の mdtalk protocol ヘッダから観察レベルを解決する。
 * 既存レーンとの互換性のため、宣言がなければ strict とする。
 */
function resolveObserveLevel(text) {
  const lines = splitLines(text);
  let start = -1;
  let end = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\uFEFF?<!--\s*mdtalk protocol\s*$/.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start < 0) return { level: 'strict', source: 'default', line: null };
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\s*-->\s*$/.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (end < 0) return { level: 'strict', source: 'default', line: null };

  const declarations = [];
  for (let i = start + 1; i < end; i++) {
    const m = lines[i].match(/^\s*observe-level:\s*(.*?)\s*$/);
    if (m) declarations.push({ value: m[1], line: i + 1 });
  }
  if (declarations.length === 0) return { level: 'strict', source: 'default', line: null };
  if (declarations.length > 1) {
    throw new Error(`observe-level が複数宣言されています（行 ${declarations.map((d) => d.line).join(', ')}）`);
  }
  const declaration = declarations[0];
  if (!OBSERVE_LEVELS.has(declaration.value)) {
    const shown = declaration.value === '' ? '(空)' : declaration.value;
    throw new Error(`不正な observe-level '${shown}' を行 ${declaration.line} で検出しました。許可値: light, strict`);
  }
  return { level: declaration.value, source: 'declared', line: declaration.line };
}

function reportObserveLevel(meta) {
  return meta && OBSERVE_LEVELS.has(meta.observeLevel) ? meta.observeLevel : 'strict';
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
  'id', 'lane', 'section', 'accepted', 'report', 'observeLevel', 'status', 'reason', 'integratedAt',
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

function buildObserverPrompt({ masterText, laneRel, laneText, others, observeLevel }) {
  const othersText = others.length === 0
    ? '（他のレーンはまだない）'
    : others.map((o) => `### ${o.lane}\n${o.headings.join('\n') || '（見出しなし）'}`).join('\n\n');
  const level = observeLevel && observeLevel.level === 'light' ? 'light' : 'strict';
  const reviewRules = level === 'light' ? [
    '観察レベルは light です。検査項目は矛盾のみです。',
    'マスター設計書・他レーンとの用語/インターフェース/前提の衝突を検査してください。',
    '分割可能性は合否条件から除外します。内部関数名、ファイル配置、データ構造の細部、',
    '既存コードへの接続方法など、実装時に安全に決められる詳細が未確定でも問題にしません。',
    '矛盾がなければ verdict は "pass"、矛盾があれば "fail" です。',
  ] : [
    '観察レベルは strict です。検査項目は2つ:',
    '1. 矛盾: マスター設計書・他レーンとの用語/インターフェース/前提の衝突',
    '2. 分割可能性: この設計が疎結合か。他への依存がインターフェースとして明示され、',
    '   このセクション単独で実装単位として成立するか',
    '両方に問題がなければ verdict は "pass"、どちらかに問題があれば "fail"。',
  ];
  return [
    'あなたは設計レビューの「観察者」です。対話には参加しておらず、外部の目として',
    '対象レーンの設計内容を検査します。',
    ...reviewRules,
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
    level === 'light'
      ? ' "separability":{"checked":false,"ok":null,"detail":"observe-level: light のためスキップ"},'
      : ' "separability":{"checked":true,"ok":true|false,"detail":"<判定理由>"},',
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
  syncKnowledgeRoom(root);
  log.info(`初期化しました: ${root}/`
    + (created.length ? `（新規: ${created.map((f) => path.basename(f)).join(', ')}）` : '（既存を維持）'));
  return 0;
}

function cmdLane(root, topic) {
  if (!topic) throw new Error('レーン名を指定してください: aide lane <topic> [root]');
  const p = rootPaths(root);
  if (!fs.existsSync(p.lanesDir)) throw new Error(`${root}/ がありません。先に aide init を実行してください`);
  const safe = topic.replace(/[\\/:*?"<>|\s]+/g, '-');
  if (!safe || safe.startsWith('_') || /\.(?:minutes|summary)$/i.test(safe)) {
    throw new Error('そのレーン名は AIDE の生成ファイル用に予約されています');
  }
  const file = path.join(p.lanesDir, `${safe}.md`);
  if (fs.existsSync(file)) throw new Error(`レーンは既に存在します: ${file}`);
  fs.writeFileSync(file, laneTemplate(safe));
  syncKnowledgeRoom(root);
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
  const observeLevel = resolveObserveLevel(laneText);
  const laneHash = sha256(laneText);
  const masterText = fs.readFileSync(p.master, 'utf8');
  const others = otherLaneHeadings(p, laneAbs);

  const cmdStr = process.env.AIDE_OBSERVER_CMD || DEFAULT_OBSERVER_CMD;
  const sourceText = observeLevel.source === 'declared' ? `declared, 行${observeLevel.line}` : 'default';
  log.info(`観察者を起動: ${cmdStr.split(' ')[0]} → ${laneRel} (observe-level: ${observeLevel.level}, ${sourceText})`);
  const res = await callBackend({
    cmdStr,
    promptText: buildObserverPrompt({ masterText, laneRel, laneText, others, observeLevel }),
    timeoutMs: OBSERVER_TIMEOUT_MS,
    label: '観察者',
    envVar: 'AIDE_OBSERVER_CMD',
  });
  let obj;
  try {
    obj = parseBackendResponse(res.out);
  } catch (e) {
    throw new Error(`観察者の応答をJSONとして解釈できません: ${e.message}\n--- 応答先頭 ---\n${String(res.out).slice(0, 400)}`);
  }
  if (obj.verdict !== 'pass' && obj.verdict !== 'fail') {
    throw new Error(`観察者の応答に verdict がありません（pass|fail）`);
  }
  if (!Array.isArray(obj.conflicts)) {
    throw new Error('観察者の応答に conflicts 配列がありません');
  }

  const conflicts = obj.conflicts;
  const rawSep = obj.separability || {};
  let verdict = obj.verdict;
  let sep;
  if (observeLevel.level === 'light') {
    verdict = conflicts.length === 0 ? 'pass' : 'fail';
    sep = {
      checked: false,
      ok: null,
      detail: 'observe-level: light のためスキップ（実装時に決められる詳細は合否対象外）',
    };
  } else {
    if (typeof rawSep.ok !== 'boolean') {
      throw new Error('strict 観察の応答に separability.ok (boolean) がありません');
    }
    if (conflicts.length > 0 || rawSep.ok === false) verdict = 'fail';
    sep = { checked: true, ok: rawSep.ok, detail: rawSep.detail || '(詳細なし)' };
  }

  const topic = laneTopic(laneAbs);
  const prev = latestReportFor(p, topic);
  const n = prev ? prev.n + 1 : 1;
  const reportFile = path.join(p.reportsDir, `${topic}-${n}.md`);
  const body = [
    '<!-- aide:report',
    `lane: ${laneRel}`,
    `laneHash: ${laneHash}`,
    `verdict: ${verdict}`,
    `observeLevel: ${observeLevel.level}`,
    `observeLevelSource: ${observeLevel.source}`,
    `date: ${formatDate(new Date())}`,
    '-->',
    '',
    `# 観察レポート: ${laneRel} (#${n})`,
    '',
    `- verdict: **${verdict}**`,
    `- 観察レベル: **${observeLevel.level}** (${observeLevel.source})`,
    `- 分割可能性: ${sep.checked ? (sep.ok ? 'OK' : 'NG') : 'スキップ'} — ${sep.detail}`,
    `- 矛盾: ${conflicts.length === 0 ? 'なし'
      : conflicts.map((c) => `${c.with}: ${c.detail}`).join(' / ')}`,
    '',
    typeof obj.report === 'string' ? obj.report : '',
    '',
  ].join('\n');
  fs.writeFileSync(reportFile, body);
  syncKnowledgeRoom(root);
  log.info(`verdict: ${verdict} → ${reportFile}`);
  if (verdict === 'pass') {
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
  resolveObserveLevel(laneText); // 不正な宣言は --force 時も拒否する
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
    observeLevel: reportObserveLevel(report.meta),
  };
  const poolText = fs.readFileSync(p.pool, 'utf8');
  fs.writeFileSync(p.pool, poolText.replace(/\s+$/, '') + '\n\n' + formatEntry(meta, content) + '\n');
  syncKnowledgeRoom(root);
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
    obj = parseBackendResponse(res.out);
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
  syncKnowledgeRoom(root);

  const nCons = consumed.filter((id) => byId.has(id)).length;
  log.info(`統合: ${nCons}件 / 差し戻し: ${bounced.length}件 / プール残: ${remaining.length}件`);
  for (const b of bounced) {
    if (byId.has(b.id)) log.info(`  差し戻し ${b.id} (${byId.get(b.id).meta.lane}): ${b.reason}`);
  }
  return 0;
}

function headingEntries(text) {
  const out = [];
  for (const [index, line] of splitLines(text).entries()) {
    const m = line.match(/^(#{2,6})\s+(.+?)\s*$/);
    if (m) out.push({ level: m[1].length, title: m[2], line: index + 1 });
  }
  return out;
}

/** VS Code 拡張などのクライアント向け、安定した機械可読ステータス。 */
function buildStatus(root) {
  const p = rootPaths(root);
  const initialized = fs.existsSync(p.root);
  const masterExists = initialized && fs.existsSync(p.master);
  const poolExists = initialized && fs.existsSync(p.pool);
  const archiveExists = initialized && fs.existsSync(p.archive);
  const laneFiles = initialized && fs.existsSync(p.lanesDir)
    ? fs.readdirSync(p.lanesDir).filter(isConversationLaneName).sort() : [];

  const lanes = laneFiles.map((f) => {
    const abs = path.join(p.lanesDir, f);
    const text = fs.readFileSync(abs, 'utf8');
    const observeLevel = resolveObserveLevel(text);
    const topic = laneTopic(f);
    const rep = latestReportFor(p, topic);
    const report = rep && rep.meta ? {
      path: rep.rel.replace(/\\/g, '/'),
      verdict: rep.meta.verdict || null,
      date: rep.meta.date || null,
      observeLevel: reportObserveLevel(rep.meta),
    } : null;
    return {
      topic,
      path: `lanes/${f}`,
      observeLevel: observeLevel.level,
      observeLevelSource: observeLevel.source,
      headings: headingEntries(text),
      report,
      stale: Boolean(rep && rep.meta && rep.meta.laneHash !== sha256(text)),
    };
  });

  const poolEntries = poolExists ? parsePoolEntries(fs.readFileSync(p.pool, 'utf8')) : [];
  const archiveEntries = archiveExists ? parsePoolEntries(fs.readFileSync(p.archive, 'utf8')) : [];
  return {
    schemaVersion: 1,
    initialized,
    root: path.resolve(root),
    master: {
      path: 'master.md',
      exists: masterExists,
      bytes: masterExists ? fs.statSync(p.master).size : 0,
    },
    lanes,
    pool: {
      path: 'pool.md',
      count: poolEntries.length,
      entries: poolEntries.map((e) => ({
        id: e.meta.id || '',
        lane: e.meta.lane || '',
        section: e.meta.section || '',
        accepted: e.meta.accepted || '',
        report: e.meta.report || '',
        observeLevel: e.meta.observeLevel || 'strict',
      })),
    },
    archive: {
      path: 'pool-archive.md',
      count: archiveEntries.length,
      integrated: archiveEntries.filter((e) => e.meta.status === 'integrated').length,
      bounced: archiveEntries.filter((e) => e.meta.status === 'bounced').length,
    },
  };
}

function cmdStatus(root, { json = false } = {}) {
  const p = rootPaths(root);
  if (json) {
    process.stdout.write(JSON.stringify(buildStatus(root)) + '\n');
    return 0;
  }
  if (!fs.existsSync(p.root)) throw new Error(`${root}/ がありません。aide init を実行してください`);
  console.log(`design root: ${p.root}`);
  console.log(`master: ${fs.existsSync(p.master) ? fs.statSync(p.master).size + ' bytes' : 'なし'}`);
  const lanes = fs.existsSync(p.lanesDir)
    ? fs.readdirSync(p.lanesDir).filter(isConversationLaneName).sort() : [];
  console.log(`lanes: ${lanes.length}件`);
  for (const f of lanes) {
    const abs = path.join(p.lanesDir, f);
    const laneText = fs.readFileSync(abs, 'utf8');
    const observeLevel = resolveObserveLevel(laneText);
    const topic = laneTopic(f);
    const rep = latestReportFor(p, topic);
    let s = '観察なし';
    if (rep && rep.meta) {
      const stale = rep.meta.laneHash !== sha256(laneText);
      s = `${rep.meta.verdict}/${reportObserveLevel(rep.meta)} (${rep.rel})${stale ? ' [観察後に編集あり]' : ''}`;
    }
    console.log(`  lanes/${f}: ${s} [現在 ${observeLevel.level}/${observeLevel.source}]`);
  }
  const poolEntries = fs.existsSync(p.pool) ? parsePoolEntries(fs.readFileSync(p.pool, 'utf8')) : [];
  console.log(`pool: ${poolEntries.length}件 ${poolEntries.map((e) => e.meta.id).join(', ')}`);
  const archEntries = fs.existsSync(p.archive) ? parsePoolEntries(fs.readFileSync(p.archive, 'utf8')) : [];
  console.log(`archive: ${archEntries.length}件`);
  return 0;
}

function cmdKnowledge(root) {
  const p = rootPaths(root);
  if (!fs.existsSync(p.lanesDir)) throw new Error(`${root}/ がありません。aide init を実行してください`);
  const result = syncKnowledgeRoom(root);
  log.info(`共有知識を同期しました: ${result.file}` + (result.changed ? '' : '（変更なし）'));
  return 0;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

const USAGE = `aide <command> [args]

commands:
  init [root]                        design ディレクトリを初期化（既定: design）
  lane <topic> [root]                レーンファイルを作成
  observe <root>/lanes/<topic>.md    observe-level に従って矛盾・分割可能性をチェック
  accept  <root>/lanes/<topic>.md [--section <見出し>] [--force]
                                     合格レポートを前提にプールへ追加
  integrate [root]                   マスターAIでプールを master.md に統合
  knowledge [root]                   lanes/_knowledge.md を再生成
  status [root] [--json]             全体状況を表示（--json は機械可読形式）

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
      json: { type: 'boolean', default: false },
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
      case 'knowledge': return cmdKnowledge(arg1 || DEFAULT_ROOT);
      case 'status': return cmdStatus(arg1 || DEFAULT_ROOT, { json: values.json });
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
  extractJsonObject,
  parseBackendResponse,
  decodeBackendOutput,
  extractSection,
  stripLaneScaffold,
  parsePoolEntries,
  parseReportMeta,
  resolveObserveLevel,
  rebuildPool,
  formatEntry,
  buildObserverPrompt,
  buildMasterPrompt,
  buildStatus,
  cmdKnowledge,
  laneRootOf,
  main,
};

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; });
}
