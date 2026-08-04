'use strict';

// AIDE の外側にある確定情報を lanes/ 内へ投影する共有知識ルーム。
// 内容は常に元ファイルから再生成し、ここだけの編集で新しい事実を作らない。

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { parseProposalBlocks } = require('./proposals.js');

const KNOWLEDGE_FILE = '_knowledge.md';

function isConversationLaneName(name) {
  return /\.md$/i.test(name)
    && name !== KNOWLEDGE_FILE
    && !/\.(?:minutes|summary)\.md$/i.test(name)
    && !name.startsWith('.');
}

function readOr(file, fallback) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : fallback;
}

function headings(text) {
  return String(text).split(/\r\n|\n|\r/).filter((line) => /^#{1,6}\s+/.test(line));
}

function reportMeta(text) {
  const m = String(text).match(/<!--\s*aide:report\s*\r?\n([\s\S]*?)\r?\n-->/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function latestReport(reportsDir, topic) {
  if (!fs.existsSync(reportsDir)) return null;
  let best = null;
  const pattern = new RegExp(`^${escapeRegExp(topic)}-(\\d+)\\.md$`);
  for (const name of fs.readdirSync(reportsDir)) {
    const m = name.match(pattern);
    if (!m) continue;
    const n = Number(m[1]);
    if (!best || n > best.n) best = { n, name, file: path.join(reportsDir, name) };
  }
  if (!best) return null;
  const text = fs.readFileSync(best.file, 'utf8').trim();
  return { ...best, text, meta: reportMeta(text) };
}

function renderKnowledgeRoom(root) {
  const workspaceRoot = path.dirname(path.resolve(root));
  const lanesDir = path.join(root, 'lanes');
  const reportsDir = path.join(root, 'reports');
  const laneNames = fs.existsSync(lanesDir)
    ? fs.readdirSync(lanesDir).filter(isConversationLaneName).sort()
    : [];

  const laneIndex = laneNames.length ? laneNames.map((name) => {
    const text = fs.readFileSync(path.join(lanesDir, name), 'utf8');
    const hs = headings(text).filter((line) => !/^#\s+レーン:/.test(line));
    const proposals = parseProposalBlocks(text);
    const proposalLines = proposals.map((proposal) =>
      `- 分割提案: ${proposal.title} [${proposal.status}] (${proposal.topic})`);
    return [
      `### ${name}`,
      hs.length ? hs.map((line) => `- ${line}`).join('\n') : '- （見出しなし）',
      ...proposalLines,
    ].join('\n');
  }).join('\n\n') : '（レーンなし）';

  const reports = [];
  for (const name of laneNames) {
    const topic = name.replace(/\.md$/i, '');
    const report = latestReport(reportsDir, topic);
    if (!report) continue;
    const laneText = fs.readFileSync(path.join(lanesDir, name), 'utf8');
    const stale = report.meta.laneHash && report.meta.laneHash !== sha256(laneText);
    reports.push([
      `### ${name} — ${report.meta.verdict || 'unknown'}/${report.meta.observeLevel || 'strict'}${stale ? '（観察後に変更あり）' : ''}`,
      `元レポート: reports/${report.name}`,
      '',
      report.text,
    ].join('\n'));
  }

  return [
    '# 共有知識ルーム',
    '<!-- aide:knowledge generated',
    'このファイルは AIDE が自動生成する読み取り専用の共有コンテキストです。',
    '直接編集しても次回同期で上書きされます。元の master / pool / lane / report を更新してください。',
    '-->',
    '',
    '> レーンAIはこの内容を参照します。確定事項はマスター、統合待ちはプール、未確定の詳細は各レーンを正とします。',
    '',
    '## 人間が明示した共有コンテキスト（.aide-context.md）',
    '',
    readOr(path.join(workspaceRoot, '.aide-context.md'), '（追加の共有コンテキストなし）'),
    '',
    '## プロジェクト概要（README.md）',
    '',
    readOr(path.join(workspaceRoot, 'README.md'), '（READMEなし）'),
    '',
    '## 確定済みの共通知識（master.md）',
    '',
    readOr(path.join(root, 'master.md'), '（マスターなし）'),
    '',
    '## 人間が承認済み・統合待ちの知識（pool.md）',
    '',
    readOr(path.join(root, 'pool.md'), '（統合待ちなし）'),
    '',
    '## レーン索引',
    '',
    laneIndex,
    '',
    '## 最新の観察結果',
    '',
    reports.length ? reports.join('\n\n') : '（観察レポートなし）',
    '',
  ].join('\n');
}

function syncKnowledgeRoom(root) {
  const lanesDir = path.join(root, 'lanes');
  if (!fs.existsSync(lanesDir)) return null;
  const file = path.join(lanesDir, KNOWLEDGE_FILE);
  const text = renderKnowledgeRoom(root);
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (previous !== text) fs.writeFileSync(file, text);
  return { file, text, changed: previous !== text };
}

function designRootForLane(targetFile) {
  const abs = path.resolve(targetFile);
  const dir = path.dirname(abs);
  if (path.basename(dir) !== 'lanes' || !isConversationLaneName(path.basename(abs))) return null;
  const root = path.dirname(dir);
  if (!fs.existsSync(path.join(root, 'master.md'))) return null;
  return root;
}

function syncKnowledgeRoomForLane(targetFile) {
  const root = designRootForLane(targetFile);
  return root ? syncKnowledgeRoom(root) : null;
}

module.exports = {
  KNOWLEDGE_FILE,
  isConversationLaneName,
  renderKnowledgeRoom,
  syncKnowledgeRoom,
  designRootForLane,
  syncKnowledgeRoomForLane,
};
