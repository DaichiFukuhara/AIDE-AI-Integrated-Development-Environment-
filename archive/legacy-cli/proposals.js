'use strict';

// レーン分割提案の共通フォーマット。
// mdtalk は提案を追記し、aide は人間の判断を反映する。

const crypto = require('node:crypto');

const START_PREFIX = '<!-- aide:lane-proposal ';
const END_MARKER = '<!-- aide:lane-proposal-end -->';
const VALID_STATUSES = new Set(['pending', 'deferred', 'created', 'continued', 'rejected']);

function safeTopic(value) {
  return String(value || '').trim().replace(/[\\/:*?"<>|\s]+/g, '-').replace(/^-+|-+$/g, '');
}

function oneLine(value) {
  return String(value == null ? '' : value)
    .replace(/\r\n|\n|\r/g, ' ')
    .replace(/-->/g, '→')
    .replace(/\s+/g, ' ')
    .trim();
}

function proposalKey(value) {
  return safeTopic(value).toLocaleLowerCase('en-US');
}

function proposalId(topic) {
  return 'proposal-' + crypto.createHash('sha256').update(proposalKey(topic), 'utf8').digest('hex').slice(0, 12);
}

function normalizeProposal(input, defaults = {}) {
  if (!input || typeof input !== 'object') throw new Error('lane proposal is not an object');
  const title = oneLine(input.title || input.topic);
  const topic = safeTopic(input.topic || title);
  const reason = oneLine(input.reason);
  const goal = oneLine(input.goal);
  if (!topic) throw new Error('lane proposal topic is empty');
  if (!title) throw new Error('lane proposal title is empty');
  if (!reason) throw new Error('lane proposal reason is empty');
  if (!goal) throw new Error('lane proposal goal is empty');
  const dependencies = Array.isArray(input.dependencies)
    ? input.dependencies.map(oneLine).filter(Boolean).slice(0, 8)
    : [];
  const status = VALID_STATUSES.has(input.status) ? input.status : (defaults.status || 'pending');
  return {
    id: oneLine(input.id) || proposalId(topic),
    topic,
    title,
    status,
    reason,
    goal,
    scope: oneLine(input.scope),
    dependencies,
    createdAt: oneLine(input.createdAt || defaults.createdAt),
    decidedAt: oneLine(input.decidedAt),
    childLane: oneLine(input.childLane),
  };
}

function statusText(proposal) {
  switch (proposal.status) {
    case 'created': return `作成済み${proposal.childLane ? ` → ${proposal.childLane}` : ''}`;
    case 'continued': return 'このレーンで継続';
    case 'deferred': return '保留';
    case 'rejected': return '却下';
    default: return '判断待ち';
  }
}

function formatProposalBlock(input) {
  const proposal = normalizeProposal(input);
  const metadata = JSON.stringify(proposal);
  const lines = [
    `${START_PREFIX}${metadata} -->`,
    `> 🧩 **レーン分割の提案: ${proposal.title}**`,
    `> 理由: ${proposal.reason}`,
    `> このレーンで決めること: ${proposal.goal}`,
  ];
  if (proposal.scope) lines.push(`> 対象範囲: ${proposal.scope}`);
  if (proposal.dependencies.length) lines.push(`> 依存関係: ${proposal.dependencies.join(', ')}`);
  lines.push(`> 状態: ${statusText(proposal)}`);
  if (proposal.status === 'pending' || proposal.status === 'deferred') {
    lines.push('> AIDEから「作成・このレーンで続ける・保留・却下」を選んでください。');
  }
  lines.push(END_MARKER);
  return lines;
}

function parseProposalBlocks(text) {
  const lines = String(text).split(/\r\n|\n|\r/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith(START_PREFIX) || !lines[i].endsWith(' -->')) continue;
    const raw = lines[i].slice(START_PREFIX.length, -4);
    let meta;
    try { meta = normalizeProposal(JSON.parse(raw)); } catch (_) { continue; }
    let end = i;
    while (end + 1 < lines.length && lines[end + 1] !== END_MARKER) end++;
    if (end + 1 >= lines.length) continue;
    end++;
    out.push({ ...meta, line: i + 1, start: i, end });
    i = end;
  }
  return out;
}

function replaceProposalBlock(text, id, update) {
  const eol = /\r\n/.test(text) ? '\r\n' : '\n';
  const lines = String(text).split(/\r\n|\n|\r/);
  const found = parseProposalBlocks(text).find((proposal) => proposal.id === id);
  if (!found) throw new Error(`レーン分割提案が見つかりません: ${id}`);
  const next = normalizeProposal({ ...found, ...update });
  lines.splice(found.start, found.end - found.start + 1, ...formatProposalBlock(next));
  return { text: lines.join(eol), proposal: next };
}

module.exports = {
  START_PREFIX,
  END_MARKER,
  VALID_STATUSES,
  safeTopic,
  proposalKey,
  proposalId,
  normalizeProposal,
  formatProposalBlock,
  parseProposalBlocks,
  replaceProposalBlock,
};
