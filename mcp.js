'use strict';

/*
 * mcp — AIDE のローカル MCP サーバー（stdio + JSON-RPC 2.0・読み取り専用）
 *
 * aide.js / mdtalk.js と同じく外部依存ゼロ（node: 標準モジュールのみ）。
 *
 * 目的: 実装中の AI エージェント（Codex / Claude Code 等）が、コードを書く前に
 * 「この作業は設計のどこに対応するか」を AIDE へ問い合わせられるようにする。
 * 現行の callBackend()（AIDE が AI を呼ぶ）とは向きが逆になる。
 *
 * 絶対制約（docs/design/aide-orchestration.md の所有権モデル）:
 *   - 一切書き込まない。master / pool / lanes を読むだけ
 *   - observe / accept / integrate はツールとして公開しない（人間のボタン）
 *   - 返す設計内容には必ず authority を付け、未承認の下書き（draft_lane）を
 *     承認済み仕様と混同させない
 *
 * 判定の設計方針:
 *   「承認済み設計を見つけられたか（coverage）」と「ワークフロー上の注意点
 *   （signals）」を分ける。レーンは承認後も残り続けるため、下書きの存在だけで
 *   停止させると警告が常態化し、エージェントがゲート全体を無視するようになる。
 *   停止させるのは、実装の根拠が無い／弱いときだけにする。
 *
 * stdio の約束:
 *   - stdout は JSON-RPC 専用。ログは必ず stderr（aide.js の log は console.log
 *     ＝stdout なので、このファイルでは使わない）
 *   - LSP の Content-Length 形式ではなく 1行1メッセージ
 */

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const { sha256, splitLines } = require('./mdtalk.js');
const { isConversationLaneName } = require('./knowledge.js');

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

const SERVER_NAME = 'aide';
const SERVER_VERSION = '0.2.0';

// 対応する MCP プロトコル版（新しい順）。JSON-RPC の "2.0" とは別物。
const SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const LATEST_PROTOCOL_VERSION = SUPPORTED_PROTOCOL_VERSIONS[0];

const MAX_TASK_CHARS = 4000;
const MAX_SECTION_CHARS = 20000;
const MAX_SECTIONS = 8;
const MAX_LINE_BYTES = 1024 * 1024;

// 一致の強さ。弱い一致で「実装してよい」と言わないための閾値。
const STRONG_SCORE = 3;
const DISTINCTIVE_TERM_LEN = 6;

// 索引内で希少な語だけを「決定的な一致」とみなすための上限。
// server / storage のような一般語は6文字以上でも識別力がない。
const RARE_TERM_MAX_DOCS = 2;

// 見出しに頻出して識別力のない語。採点から除外する。
const STOP_TERMS = new Set([
  '目的', '背景', '概要', '実装', '機能', '設計', '対象', '前提', '方針', '構成',
  '定義', '仕様', '内容', '範囲', '手順', '注意', 'テスト', 'テスト方針', 'スコープ外',
  '受け入れ条件', '変更履歴', '未決事項', 'エッジケース', '実装順序', '文書化',
  'goal', 'scope', 'design', 'overview', 'notes', 'test', 'tests', 'todo',
  'server', 'client', 'system', 'config', 'storage', 'service', 'module',
  'manager', 'handler', 'request', 'response', 'update', 'create', 'delete',
]);

// JSON-RPC エラーコード
const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const INTERNAL_ERROR = -32603;

/** stdout は JSON-RPC 専用。診断は必ず stderr へ。 */
const mlog = {
  warn: (...a) => process.stderr.write(`[aide:mcp][warn] ${a.join(' ')}\n`),
  error: (...a) => process.stderr.write(`[aide:mcp][error] ${a.join(' ')}\n`),
};

class McpInvalidParams extends Error {}

// ---------------------------------------------------------------------------
// root 解決とパス境界
// ---------------------------------------------------------------------------

/**
 * MCP 公開用の root を解決する。
 * aide.js の laneRootOf() は「親ディレクトリ名が lanes か」しか見ないため、
 * 外部エージェントが引数を組み立てる MCP ではファイル境界として不十分。
 * ここでは realpath まで解決した design root を単一の基準点にする。
 */
function resolveMcpRoot(rootArg) {
  if (!rootArg) {
    throw new Error('aide mcp には --root <design ディレクトリの絶対パス> が必要です');
  }
  if (!path.isAbsolute(rootArg)) {
    throw new Error(`--root は絶対パスで指定してください: ${rootArg}`);
  }
  if (!fs.existsSync(rootArg)) {
    throw new Error(`--root が存在しません: ${rootArg}`);
  }
  const real = fs.realpathSync(rootArg);
  if (!fs.statSync(real).isDirectory()) {
    throw new Error(`--root がディレクトリではありません: ${rootArg}`);
  }
  return real;
}

/**
 * MCP が読んでよいファイルの許可リスト。
 * これを設けないと、偽造 sectionId で pool-archive.md や reports/*.md を
 * draft_lane と偽って読ませることができる。
 */
function isReadableDesignFile(relFile) {
  if (relFile === 'master.md' || relFile === 'pool.md') return true;
  const m = /^lanes\/([^/]+)$/.exec(relFile);
  return Boolean(m && isConversationLaneName(m[1]));
}

/**
 * relFile に対応する authority。許可リストと一対一に保つため、
 * 許可外は既定値を返さず失敗させる（将来の経路追加に対する回帰防止）。
 */
function authorityOf(relFile) {
  if (relFile === 'master.md') return 'master';
  if (relFile === 'pool.md') return 'accepted_pool';
  if (isReadableDesignFile(relFile)) return 'draft_lane';
  throw new McpInvalidParams(`authority を決められないファイルです: ${relFile}`);
}

/**
 * designRoot 配下であることだけを保証する（許可リストは見ない）。
 * realpath まで解決して `..` と symlink escape の両方を拒否する。
 * buildStatus() が触る pool-archive / reports の検証にも使う。
 */
function assertInsideRoot(designRoot, relPath) {
  const rel = String(relPath || '').replace(/\\/g, '/');
  if (!rel || path.isAbsolute(rel) || rel.split('/').includes('..')) {
    throw new McpInvalidParams(`root 外のパスは参照できません: ${relPath}`);
  }
  const rootReal = fs.realpathSync(designRoot);
  let real;
  try {
    real = fs.realpathSync(path.resolve(rootReal, rel));
  } catch {
    throw new McpInvalidParams(`ファイルがありません: ${rel}`);
  }
  const inside = path.relative(rootReal, real);
  if (inside === '' || inside === '..' || inside.startsWith(`..${path.sep}`) || path.isAbsolute(inside)) {
    throw new McpInvalidParams(`root 外のパスは参照できません: ${relPath}`);
  }
  return real;
}

/** designRoot 配下の「MCP が読んでよいファイル」だけを解決する。 */
function resolveInsideRoot(designRoot, relPath) {
  const rel = String(relPath || '').replace(/\\/g, '/');
  if (!isReadableDesignFile(rel)) {
    throw new McpInvalidParams(`このファイルは MCP からは参照できません: ${relPath}`);
  }
  return assertInsideRoot(designRoot, rel);
}

/** 境界検証を通してから読む。索引構築も get_section も必ずここを通す。 */
function readInsideRoot(designRoot, relFile) {
  let abs;
  try {
    abs = resolveInsideRoot(designRoot, relFile);
  } catch {
    return null; // 境界外・不存在は「無い」として扱う（索引構築用）
  }
  try {
    return fs.readFileSync(abs, 'utf8');
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// sectionId（不透明な識別子）
// ---------------------------------------------------------------------------

/**
 * 生の見出しではなく、ファイル・ロケータ・内容ハッシュを含む不透明な ID を使う。
 * ロケータは同名見出し／同名 pool エントリを区別するために必要:
 *   master / lane — 見出しテキスト + 同一ファイル内の出現番号
 *   pool          — <!-- aide:entry --> の id（見出し名は重複しうる）
 */
function encodeSectionId({ relFile, heading, occurrence = 0, entryId = null }, sectionText) {
  const payload = { f: relFile, h: heading, n: occurrence };
  if (entryId) payload.e = entryId;
  return `${Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')}`
    + `.${sha256(sectionText).slice(0, 12)}`;
}

function decodeSectionId(sectionId) {
  const raw = String(sectionId || '');
  const dot = raw.lastIndexOf('.');
  if (dot <= 0) throw new McpInvalidParams(`sectionId の書式が不正です: ${sectionId}`);
  const hash = raw.slice(dot + 1);
  // 空文字を許すと current.startsWith(hash) が常に true になり stale 検査を迂回できる。
  if (!/^[0-9a-f]{12}$/.test(hash)) {
    throw new McpInvalidParams(`sectionId のハッシュが不正です: ${sectionId}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(raw.slice(0, dot), 'base64url').toString('utf8'));
  } catch {
    throw new McpInvalidParams(`sectionId を解釈できません: ${sectionId}`);
  }
  if (!parsed || typeof parsed.f !== 'string' || typeof parsed.h !== 'string') {
    throw new McpInvalidParams(`sectionId の内容が不正です: ${sectionId}`);
  }
  return {
    relFile: parsed.f,
    heading: parsed.h,
    occurrence: Number.isInteger(parsed.n) ? parsed.n : 0,
    entryId: typeof parsed.e === 'string' ? parsed.e : null,
    hash,
  };
}

// ---------------------------------------------------------------------------
// 設計インデックス（authority 付き）
// ---------------------------------------------------------------------------

function headingOf(line) {
  const m = line.match(/^(#{1,6})\s+(.*)$/);
  return m ? { level: m[1].length, text: m[2].trim() } : null;
}

/** 見出しの occurrence 番目の出現のセクション本文を返す（aide.js の extractSection と同規則）。 */
function sectionTextAt(lines, heading, occurrence = 0) {
  const target = String(heading).trim();
  let seen = -1;
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    const h = headingOf(lines[i]);
    if (h && h.text === target) {
      seen += 1;
      if (seen === occurrence) { start = i; level = h.level; break; }
    }
  }
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const h = headingOf(lines[i]);
    if (h && h.level <= level) { end = i; break; }
  }
  return lines.slice(start, end).join('\n').trim();
}

/**
 * master / pool / lanes を横断して見出し単位の候補を集める。
 * 長寿命プロセスなので毎回読み直す（設計内容はキャッシュしない）。
 * 本文（text）は索引に保持しない。親セクションが子を丸ごと含むため、
 * 保持すると見出しの多い文書で重複がふくらむ。
 */
function buildDesignIndex(designRoot) {
  const entries = [];

  const pushHeadings = (relFile, text, extra = {}) => {
    if (text == null) return;
    const lines = splitLines(text);
    const seen = new Map();
    const ancestors = [];
    for (const line of lines) {
      const h = headingOf(line);
      if (!h) continue;
      const occurrence = seen.get(h.text) || 0;
      seen.set(h.text, occurrence + 1);
      // 見出しテキストではなく出現位置まで含む安定キー。同名見出しが別の枝に
      // あるときに、無関係な祖先で子が畳まれるのを防ぐ。
      const key = `${relFile}::${h.text}::${occurrence}`;
      while (ancestors.length && ancestors[ancestors.length - 1].level >= h.level) ancestors.pop();
      if (h.level >= 2) { // H1 はファイルタイトルなので索引しない
        const body = sectionTextAt(lines, h.text, occurrence);
        if (body) {
          entries.push({
            key,
            sectionId: encodeSectionId({ relFile, heading: h.text, occurrence }, body),
            title: h.text,
            authority: authorityOf(relFile),
            file: relFile,
            hash: sha256(body),
            // 検索は祖先見出し・レーン名まで含める（recall重視）。
            searchText: [...ancestors.map((a) => a.text), h.text, extra.lane || ''].join(' '),
            // 希少性の判定は自分の見出しだけで数える（祖先の語が子の数だけ
            // 出現扱いになり、親の希少語が不当にcommonになるのを防ぐ）。
            directText: [h.text, extra.lane || ''].join(' '),
            ancestorIds: ancestors.map((a) => a.key),
            ...extra,
          });
        }
      }
      ancestors.push({ ...h, key });
    }
  };

  pushHeadings('master.md', readInsideRoot(designRoot, 'master.md'));

  // pool は <!-- aide:entry --> ブロック。承認済みだが未統合。
  const poolText = readInsideRoot(designRoot, 'pool.md');
  if (poolText != null) {
    const { parsePoolEntries } = require('./aide.js');
    for (const e of parsePoolEntries(poolText)) {
      const title = e.meta.section || e.meta.id || '(無題)';
      const body = String(e.content || '').trim();
      if (!body) continue;
      // section が '(全体)' 等のとき本文中の見出しが拾えないので、
      // 本文の見出しとレーン名も検索対象に含める。
      const innerHeadings = splitLines(body)
        .map(headingOf).filter(Boolean).map((h) => h.text);
      entries.push({
        key: `pool.md::${e.meta.id || title}::0`,
        sectionId: encodeSectionId(
          { relFile: 'pool.md', heading: title, entryId: e.meta.id || null }, body,
        ),
        title,
        authority: 'accepted_pool',
        file: 'pool.md',
        hash: sha256(body),
        ancestorIds: [],
        searchText: [title, ...innerHeadings, e.meta.lane || '', e.meta.id || ''].join(' '),
        directText: [title, e.meta.lane || ''].join(' '),
        lane: e.meta.lane || null,
        entryId: e.meta.id || null,
        observeLevel: e.meta.observeLevel || 'strict',
      });
    }
  }

  const lanesDir = path.join(designRoot, 'lanes');
  if (fs.existsSync(lanesDir)) {
    for (const f of fs.readdirSync(lanesDir).filter(isConversationLaneName).sort()) {
      const rel = `lanes/${f}`;
      pushHeadings(rel, readInsideRoot(designRoot, rel), { lane: f.replace(/\.md$/i, '') });
    }
  }

  return entries;
}

// ---------------------------------------------------------------------------
// 素朴なマッチング
// ---------------------------------------------------------------------------

const normalize = (s) => String(s || '').normalize('NFKC').toLowerCase();

/**
 * 検索語を切り出す。日本語は語境界が取れないので、記号で割った断片と
 * 英数字トークンを使う。意味検索ではないので、弱い一致は covered にしない。
 */
function termsOf(text) {
  const out = new Set();
  const raw = normalize(text);
  for (const piece of raw.split(/[\s:：・（）()「」【】,、。/\\|>―—_-]+/)) {
    const t = piece.trim();
    if (t.length >= 3 && !STOP_TERMS.has(t)) out.add(t);
  }
  for (const m of raw.matchAll(/[a-z][a-z0-9_-]{2,}/g)) {
    if (!STOP_TERMS.has(m[0])) out.add(m[0]);
  }
  return [...out];
}

/**
 * task 文に索引側の語がいくつ含まれるかで採点し、一致語も返す。
 * 候補の順位付け（recall重視）と実装許可（precision重視）で同じ数値を
 * 使わないよう、confidence は別途 strong/weak で判定する。
 */
function scoreEntry(entry, task) {
  const hay = normalize(task);
  const matched = [];
  let score = 0;
  for (const term of termsOf(entry.searchText || entry.title)) {
    if (hay.includes(term)) {
      matched.push(term);
      score += term.length >= DISTINCTIVE_TERM_LEN ? 2 : 1;
    }
  }
  return { score, matched };
}

/**
 * 索引全体での語の出現エントリ数。希少語の判定に使う。
 * 祖先から継承した語（searchText）ではなく自分の見出し（directText）で数える。
 * さもないと親の希少語が子の数だけ出現した扱いになり、不当にcommonになる。
 */
function documentFrequency(index) {
  const df = new Map();
  for (const entry of index) {
    for (const term of new Set(termsOf(entry.directText || entry.title))) {
      df.set(term, (df.get(term) || 0) + 1);
    }
  }
  return df;
}

/**
 * 長い語が1つ当たっただけで strong にすると、server / storage のような
 * 一般語で実装許可が出てしまう。長さに加えて索引内の希少性を要求する。
 */
function confidenceOf(scored, df = new Map()) {
  if (scored.length === 0) return 'weak';
  const top = scored[0];
  if (top.score >= STRONG_SCORE) return 'strong';
  const decisive = top.matched.some((t) => t.length >= DISTINCTIVE_TERM_LEN
    && (df.get(t) || 0) <= RARE_TERM_MAX_DOCS);
  return decisive ? 'strong' : 'weak';
}

// ---------------------------------------------------------------------------
// ツール実装
// ---------------------------------------------------------------------------

const APPROVED = new Set(['master', 'accepted_pool']);

/**
 * 祖先見出しを検索対象に含めた副作用で、親が一致すると子も全部同点で並ぶ。
 * 親の本文は子を丸ごと含むので、その場合は子を畳む。こうしないと候補が
 * 上限に当たり、意味のない切り捨て停止が頻発する。
 *
 * ただし畳むのは「一致が親から継承されただけ」の子に限る。子固有の語で
 * 当たっている子は、親を返しても読みたいものが埋もれるので残す。
 */
function collapseDescendants(scored) {
  const byKey = new Map(scored.map((s) => [s.entry.key, s]));
  return scored.filter((s) => {
    for (const ancestorId of s.entry.ancestorIds || []) {
      const parent = byKey.get(ancestorId);
      if (!parent) continue;
      const parentTerms = new Set(parent.matched);
      const inheritedOnly = s.matched.every((t) => parentTerms.has(t));
      if (inheritedOnly && s.score <= parent.score) return false;
    }
    return true;
  });
}

/**
 * 実装前の入口。ここ1回で完結させる（status→check→get と3回呼ばせない）。
 * 「設計が無い / 未承認 / 弱い一致」は JSON-RPC エラーではなく正常な業務結果として
 * outcome + stopRequired で返す。
 */
function toolCheckDesign(ctx, args) {
  const rawTask = (args && args.task);
  if (typeof rawTask !== 'string' || !rawTask.trim()) {
    throw new McpInvalidParams('task は必須の文字列です（ユーザーの依頼文をそのまま渡してください）');
  }
  if (rawTask.length > MAX_TASK_CHARS) {
    // 黙って切ると検索結果が変わるので、超過は明示的に拒否する。
    throw new McpInvalidParams(`task が長すぎます（${rawTask.length}字 / 上限 ${MAX_TASK_CHARS}字）`);
  }
  const task = rawTask.trim();

  const base = {
    projectRoot: path.dirname(ctx.designRoot),
    designRoot: ctx.designRoot,
    approvedSections: [],
    relatedDrafts: [],
    signals: [],
  };

  const index = buildDesignIndex(ctx.designRoot);
  if (index.length === 0) {
    return {
      ...base,
      outcome: 'unknown',
      stopRequired: true,
      matchConfidence: 'weak',
      reason: 'この AIDE プロジェクトにはまだ設計がありません（master.md も pool も lanes も空）。'
        + '実装してよいかを人間に確認してください。',
    };
  }

  const scored = collapseDescendants(index
    .map((e) => ({ entry: e, ...scoreEntry(e, task) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score));

  const toSection = (s) => ({
    sectionId: s.entry.sectionId,
    title: s.entry.title,
    authority: s.entry.authority,
    file: s.entry.file,
    hash: s.entry.hash,
    score: s.score,
    matchedTerms: s.matched,
    ...(s.entry.lane ? { lane: s.entry.lane } : {}),
  });

  if (scored.length === 0) {
    // 素朴なキーワード検索では「設計が存在しない」ことは証明できない。
    // missing と断定せず unknown で返す。
    return {
      ...base,
      outcome: 'unknown',
      stopRequired: true,
      matchConfidence: 'weak',
      reason: 'この作業に対応する設計を見つけられませんでした（検索は見出しの語による'
        + '素朴な一致なので、存在しないと断定はできません）。推測で実装せず、'
        + '対応する設計があるかを人間に確認してください。',
    };
  }

  const approved = scored.filter((s) => APPROVED.has(s.entry.authority));
  const drafts = scored.filter((s) => s.entry.authority === 'draft_lane');
  const confidence = confidenceOf(approved, documentFrequency(index));
  const signals = [];

  // レーンは承認後も残り続けるため、下書きの存在はブロッキングにしない。
  if (drafts.length > 0) {
    signals.push({
      code: 'RELATED_DRAFT_EXISTS', severity: 'warning', blocking: false,
      detail: '同じ話題の未承認レーンが進行中です。仕様が変更途中の可能性があります。',
    });
  }
  // pool に一致がある時点で未統合。master との併存有無に関わらず出す。
  if (approved.some((s) => s.entry.authority === 'accepted_pool')) {
    signals.push({
      code: 'PENDING_INTEGRATION', severity: 'warning', blocking: false,
      detail: '承認済みだが未統合（aide integrate 前）の pool エントリが一致しています。',
    });
  }
  // 候補を黙って切ると、返した8件が全候補だと誤解される。
  const approvedTruncated = approved.length > MAX_SECTIONS;
  if (approvedTruncated) {
    signals.push({
      code: 'RESULTS_TRUNCATED', severity: 'warning', blocking: true,
      detail: `承認済みの候補が ${approved.length} 件あり、上位 ${MAX_SECTIONS} 件だけ返しました。`,
    });
  }

  if (approved.length === 0) {
    // 下書きしか無い = まだ人間が承認していない。これは仕様ではない。
    return {
      ...base,
      outcome: 'draft_only',
      stopRequired: true,
      matchConfidence: 'weak',
      relatedDrafts: drafts.slice(0, MAX_SECTIONS).map(toSection),
      signals,
      reason: '一致したのは未承認のレーン下書き（draft_lane）だけです。'
        + 'draft_lane は検討中の対話であって承認済み仕様ではありません。'
        + 'これを根拠に実装しないでください。人間の承認（aide accept / integrate）が必要です。',
    };
  }

  // 切り捨ての事実は分岐に関わらず必ず返す。返した件数が全件だと誤解させない。
  const counted = {
    approvedMatchCount: approved.length,
    approvedSectionsTruncated: approvedTruncated,
  };

  if (confidence === 'weak') {
    // 見出しの語が1つかすった程度で「実装してよい」と言わない。
    return {
      ...base,
      ...counted,
      outcome: 'unknown',
      stopRequired: true,
      matchConfidence: 'weak',
      approvedSections: approved.slice(0, MAX_SECTIONS).map(toSection),
      relatedDrafts: drafts.slice(0, MAX_SECTIONS).map(toSection),
      signals,
      reason: '一致が弱く、この作業に対応する設計だと確信できません（一致した語を'
        + 'matchedTerms で確認してください）。正しければ人間に確認してから実装し、'
        + '違えば対応する設計があるかを尋ねてください。',
    };
  }

  return {
    ...base,
    ...counted,
    outcome: 'covered',
    stopRequired: approvedTruncated,
    matchConfidence: 'strong',
    approvedSections: approved.slice(0, MAX_SECTIONS).map(toSection),
    // 下書きは参考情報。実装の根拠ではないので approvedSections には混ぜない。
    relatedDrafts: drafts.slice(0, MAX_SECTIONS).map(toSection),
    signals,
    reason: '承認済み設計への強い一致が見つかりました。aide_get_section で本文を読んでください。'
      + 'covered は「字面が強く一致した」という意味であり、依頼された振る舞いがすべて'
      + '仕様化されている証明ではありません。本文を読んでも決まっていない製品判断が'
      + '残る場合は、実装せず人間に確認してください。'
      + (signals.length ? ' 注意点は signals を参照してください。' : ''),
  };
}

/** check_design が返した sectionId の本文を読む。発行後に編集されていれば stale。 */
function toolGetSection(ctx, args) {
  const sectionId = (args && args.sectionId);
  if (typeof sectionId !== 'string' || !sectionId) {
    throw new McpInvalidParams('sectionId は必須の文字列です（aide_check_design の戻り値を使ってください）');
  }

  const { relFile, heading, occurrence, entryId, hash } = decodeSectionId(sectionId);
  // 許可リスト＋realpath 境界。ここを通らないファイルは読まない。
  const abs = resolveInsideRoot(ctx.designRoot, relFile);
  const text = fs.readFileSync(abs, 'utf8');
  const authority = authorityOf(relFile);

  let body = null;
  if (relFile === 'pool.md') {
    const { parsePoolEntries } = require('./aide.js');
    const all = parsePoolEntries(text);
    // entry id を持つ sectionId は、その id が消えたら found:false にする。
    // 同名見出しの別エントリへ滑らせると locator の意味が崩れる。
    const hit = entryId
      ? all.find((e) => e.meta.id === entryId)
      : all.find((e) => (e.meta.section || e.meta.id || '(無題)') === heading);
    body = hit ? String(hit.content || '').trim() : null;
  } else {
    body = sectionTextAt(splitLines(text), heading, occurrence);
  }

  if (!body) {
    return {
      sectionId,
      found: false,
      stale: true,
      stopRequired: true,
      reason: `セクション「${heading}」は ${relFile} に見つかりませんでした。`
        + '設計が変更された可能性があります。aide_check_design をやり直してください。',
    };
  }

  const current = sha256(body);
  const stale = current.slice(0, 12) !== hash;
  const truncated = body.length > MAX_SECTION_CHARS;
  const warnings = [];
  if (authority === 'draft_lane') {
    warnings.push('これは未承認のレーン下書きです。承認済み仕様として実装に使わないでください。');
  }
  if (stale) {
    warnings.push('この sectionId の発行後に設計が編集されています。aide_check_design をやり直してください。');
  }
  if (truncated) {
    // 後半に制約が書かれていても読めていない。前半だけで実装させない。
    warnings.push(`本文が長いため先頭 ${MAX_SECTION_CHARS} 字だけを返しました。`
      + '読めていない部分に制約がある可能性があるため、このまま実装しないでください。');
  }

  return {
    sectionId,
    found: true,
    file: relFile,
    title: heading,
    authority,
    hash: current,
    stale,
    stopRequired: stale || authority === 'draft_lane' || truncated,
    ...(warnings.length ? { warnings } : {}),
    truncated,
    content: truncated ? `${body.slice(0, MAX_SECTION_CHARS)}\n\n…(省略)` : body,
  };
}

/**
 * 診断用。cmdStatus() は stdout へ書くので buildStatus() を直接使う。
 * buildStatus() は master / pool / pool-archive / lanes / reports を境界検査なしで
 * 直接読むため、呼ぶ前にそのすべてが root 配下に解決することを確認する。
 */
function assertStatusBoundary(designRoot) {
  for (const rel of ['master.md', 'pool.md', 'pool-archive.md']) {
    if (fs.existsSync(path.join(designRoot, rel))) assertInsideRoot(designRoot, rel);
  }
  for (const dir of ['lanes', 'reports']) {
    const abs = path.join(designRoot, dir);
    if (!fs.existsSync(abs)) continue;
    // ディレクトリ自体が root 外への symlink だと、readdir の時点で境界を越える。
    assertInsideRoot(designRoot, dir);
    for (const f of fs.readdirSync(abs)) assertInsideRoot(designRoot, `${dir}/${f}`);
  }
}

function toolStatus(ctx) {
  assertStatusBoundary(ctx.designRoot);
  const { buildStatus } = require('./aide.js');
  return buildStatus(ctx.designRoot);
}

// ---------------------------------------------------------------------------
// ツール定義
// ---------------------------------------------------------------------------

/** inputSchema は宣言するだけでは効かないので、最低限の検証を自前で行う。 */
function validateArgs(tool, args) {
  const props = tool.inputSchema.properties || {};
  for (const key of Object.keys(args)) {
    if (!Object.prototype.hasOwnProperty.call(props, key)) {
      throw new McpInvalidParams(`未知の引数: ${key}`);
    }
  }
  for (const key of tool.inputSchema.required || []) {
    if (!Object.prototype.hasOwnProperty.call(args, key)) {
      throw new McpInvalidParams(`引数 ${key} は必須です`);
    }
  }
  for (const [key, value] of Object.entries(args)) {
    if (props[key].type === 'string' && typeof value !== 'string') {
      throw new McpInvalidParams(`引数 ${key} は文字列である必要があります`);
    }
  }
}

const TOOLS = [
  {
    name: 'aide_check_design',
    description:
      'Use this before modifying code for any feature, behavior-changing bug fix, '
      + 'security change, or refactor in an AIDE-managed repository. Given the user\'s '
      + 'task, return the authoritative human-approved design sections, their '
      + 'provenance, and any missing, conflicting, stale, or unapproved decisions. '
      + 'If stopRequired is true, do not guess or edit code; report the blocker to the '
      + 'user. Only approvedSections may justify implementation; relatedDrafts are '
      + 'unapproved context. Note that outcome "covered" means a strong lexical match '
      + 'to approved design was found; it does not prove that every requested behavior '
      + 'is specified. After reading the sections, stop if the task still requires a '
      + 'product decision not stated there. This tool never modifies design files.',
    inputSchema: {
      type: 'object',
      properties: {
        task: {
          type: 'string',
          description: "The user's requested task, in their own words.",
        },
      },
      required: ['task'],
      additionalProperties: false,
    },
    handler: toolCheckDesign,
  },
  {
    name: 'aide_get_section',
    description:
      'Read the exact text and provenance of a design section returned by '
      + 'aide_check_design. Use it before implementing that section. Returns the '
      + "section's authority level (master = approved and integrated, accepted_pool = "
      + 'approved but not yet integrated, draft_lane = NOT approved) and a content hash '
      + 'so stale or draft material is not mistaken for approved design. '
      + 'This tool never modifies files.',
    inputSchema: {
      type: 'object',
      properties: {
        sectionId: {
          type: 'string',
          description: 'A sectionId from aide_check_design.approvedSections or relatedDrafts.',
        },
      },
      required: ['sectionId'],
      additionalProperties: false,
    },
    handler: toolGetSection,
  },
  {
    name: 'aide_status',
    description:
      'Inspect the current AIDE project root and design state, including master, '
      + 'accepted-but-unintegrated pool entries, draft lanes, observation verdicts, '
      + 'and stale reports. Use for status or diagnostics; for implementation '
      + 'readiness, use aide_check_design instead. This tool never modifies files.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    handler: toolStatus,
  },
];

// ---------------------------------------------------------------------------
// JSON-RPC 2.0（stdio・1行1メッセージ）
// ---------------------------------------------------------------------------

function ok(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function err(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function negotiateProtocol(requested) {
  // クライアントの提示版に対応していればそれを返す。非対応ならサーバーの最新版を
  // 返し、継続するかはクライアントに判断させる。
  return SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : LATEST_PROTOCOL_VERSION;
}

/**
 * 1メッセージを処理して、返すべきレスポンス（なければ null）を返す。
 * 通知（id フィールドを持たないメッセージ）には決して応答しない。
 */
function handleMessage(ctx, msg) {
  if (msg === null || typeof msg !== 'object' || Array.isArray(msg)) {
    return err(null, INVALID_REQUEST, 'リクエストがオブジェクトではありません');
  }
  // JSON-RPC 2.0 の通知は「id メンバーを持たないリクエスト」。
  // id: 0 や '' は有効な id なので truthy 判定で通知扱いしない。
  const isNotification = !Object.prototype.hasOwnProperty.call(msg, 'id');
  const id = isNotification ? null : msg.id;

  if (typeof msg.method !== 'string') {
    return isNotification ? null : err(id, INVALID_REQUEST, 'method がありません');
  }
  // 通知はすべて黙って捨てる（notifications/initialized、未知の通知を含む）。
  if (isNotification) return null;
  if (id !== null && typeof id !== 'string' && typeof id !== 'number') {
    return err(null, INVALID_REQUEST, 'id は文字列または数値である必要があります');
  }

  switch (msg.method) {
    case 'initialize': {
      const requested = msg.params && msg.params.protocolVersion;
      return ok(id, {
        protocolVersion: negotiateProtocol(requested),
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions:
          'AIDE holds the human-approved design for this repository. Call '
          + 'aide_check_design before writing code. Never treat draft_lane content as '
          + 'approved specification. This server is read-only and never modifies design files.',
      });
    }

    case 'ping':
      return ok(id, {});

    case 'tools/list':
      return ok(id, {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
      });

    case 'tools/call': {
      const params = msg.params || {};
      const tool = TOOLS.find((t) => t.name === params.name);
      if (!tool) return err(id, INVALID_PARAMS, `未知のツール: ${params.name}`);
      const args = params.arguments || {};
      if (typeof args !== 'object' || Array.isArray(args)) {
        return err(id, INVALID_PARAMS, 'arguments はオブジェクトである必要があります');
      }
      try {
        validateArgs(tool, args);
        const result = tool.handler(ctx, args);
        return ok(id, {
          // 対応クライアント向けに structuredContent も返すが、互換のため
          // text 側にも同じ JSON を入れる。
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
          isError: false,
        });
      } catch (e) {
        if (e instanceof McpInvalidParams) return err(id, INVALID_PARAMS, e.message);
        // 業務結果ではなく本当の失敗（I/O 等）だけをツールエラーにする。
        mlog.error(`${params.name}: ${e.message}`);
        return ok(id, {
          content: [{ type: 'text', text: `AIDE error: ${e.message}` }],
          isError: true,
        });
      }
    }

    default:
      return err(id, METHOD_NOT_FOUND, `未対応のメソッド: ${msg.method}`);
  }
}

/** stdio でサーバーを回す。stdin が閉じたら解決する。 */
function serve(ctx, input = process.stdin, output = process.stdout) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, crlfDelay: Infinity });
    const send = (m) => { if (m) output.write(`${JSON.stringify(m)}\n`); };

    rl.on('line', (line) => {
      const text = line.trim();
      if (!text) return;
      if (Buffer.byteLength(text, 'utf8') > MAX_LINE_BYTES) {
        send(err(null, INVALID_REQUEST, 'リクエストが大きすぎます'));
        return;
      }
      let msg;
      try {
        msg = JSON.parse(text);
      } catch {
        send(err(null, PARSE_ERROR, 'JSON を解釈できません'));
        return;
      }
      try {
        send(handleMessage(ctx, msg));
      } catch (e) {
        mlog.error(e.message);
        const id = msg && Object.prototype.hasOwnProperty.call(msg, 'id') ? msg.id : null;
        send(err(id, INTERNAL_ERROR, e.message));
      }
    });

    rl.on('close', () => resolve(0));
  });
}

/** aide.js の `case 'mcp'` から呼ばれる入口。 */
async function cmdMcp({ root }) {
  const designRoot = resolveMcpRoot(root);
  return serve({ designRoot });
}

module.exports = {
  cmdMcp,
  serve,
  handleMessage,
  buildDesignIndex,
  resolveMcpRoot,
  resolveInsideRoot,
  assertInsideRoot,
  assertStatusBoundary,
  isReadableDesignFile,
  authorityOf,
  documentFrequency,
  encodeSectionId,
  decodeSectionId,
  sectionTextAt,
  scoreEntry,
  termsOf,
  confidenceOf,
  negotiateProtocol,
  toolCheckDesign,
  toolGetSection,
  toolStatus,
  validateArgs,
  TOOLS,
  SUPPORTED_PROTOCOL_VERSIONS,
  LATEST_PROTOCOL_VERSION,
};
