export const phases = { intake: '目的の整理', design: '設計', plan: '計画確認', implementation: '実装', verification: '検証', audit: '独立監査', adoption: '採用', closure: '終了・引き継ぎ' };
export const kinds = { action: '実行', decision: '判断', check: '確認', issue: '課題' };
export const outcomes = { recorded: '記録済み', pass: '成功', fail: '失敗', unverified: '未確認' };

export function evidenceURL(path) {
  if (typeof path !== 'string' || !path || /[\\:]/.test(path) || path.split('/').some(part => ['', '.', '..'].includes(part))) throw new Error('参照パスが不正です');
  return '/evidence/' + path.split('/').map(encodeURIComponent).join('/');
}

export function validatePair(events, context) {
  if (events?.version !== 1 || !Array.isArray(events.events) || !Number.isInteger(context?.revision) || !context?.display || !Object.hasOwn(context, 'current_bundle')) throw new Error('取得した記録の形式が不正です');
  for (const field of ['plan', 'trial', 'audit', 'adoption', 'cycle', 'human_evaluation', 'next']) if (typeof context.display[field] !== 'string') throw new Error('台帳の状態が不足しています');
  const ids = new Set();
  for (const event of events.events) {
    if (!event || ['id', 'actor', 'title', 'body', 'reason', 'next', 'time'].some(key => typeof event[key] !== 'string') || !Object.hasOwn(phases, event.phase) || !Object.hasOwn(kinds, event.kind) || !Object.hasOwn(outcomes, event.outcome) || !Number.isFinite(Date.parse(event.time)) || !Array.isArray(event.evidence) || ids.has(event.id)) throw new Error('イベントの形式が不正です');
    event.evidence.forEach(evidenceURL);
    ids.add(event.id);
  }
  return { events: events.events, context };
}

export function visibleEvents(events, { query = '', phase = 'all', kind = 'all', order = 'newest' } = {}) {
  const needle = query.trim().toLocaleLowerCase();
  return events.filter(event => (phase === 'all' || phase === event.phase) && (kind === 'all' || kind === event.kind) && [event.title, event.body, event.actor, event.reason, event.next, ...event.evidence].some(value => value.toLocaleLowerCase().includes(needle))).sort((a, b) => (Date.parse(a.time) - Date.parse(b.time)) * (order === 'newest' ? -1 : 1));
}
