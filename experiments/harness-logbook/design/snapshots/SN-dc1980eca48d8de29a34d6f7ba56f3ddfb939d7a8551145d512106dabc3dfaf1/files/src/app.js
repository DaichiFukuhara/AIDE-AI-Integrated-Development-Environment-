import { phases, kinds, outcomes, evidenceURL, validatePair, visibleEvents } from './view.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let records = null;
let options = { query: '', phase: 'all', kind: 'all', order: 'newest' };
let updating = false;
const date = value => new Date(value).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
const time = value => new Date(value).toLocaleTimeString('ja-JP', { hour12: false });

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function evidenceLink(path) {
  const a = element('a', 'evidence-link', '↗ ' + path);
  a.href = evidenceURL(path);
  a.target = '_blank';
  a.rel = 'noopener';
  return a;
}

function eventMeta(event) {
  const meta = element('div', 'event-meta');
  const stamp = element('time', '', time(event.time));
  stamp.dateTime = event.time;
  stamp.title = date(event.time) + ' · 記録時刻';
  meta.append(element('span', 'phase-tag', phases[event.phase]), element('span', '', event.actor), stamp);
  return meta;
}

function showDetails(event) {
  $('#detail-title').textContent = event.title;
  $('#detail-body').textContent = event.body;
  $('#detail-meta').replaceChildren(eventMeta(event));
  $('#detail-reason').textContent = event.reason;
  $('#reason-section').hidden = !event.reason;
  $('#detail-next').textContent = event.next;
  $('#next-section').hidden = !event.next;
  $('#detail-evidence').replaceChildren(...event.evidence.map(evidenceLink));
  if (!event.evidence.length) $('#detail-evidence').textContent = '参照は記録されていません。';
  $('#detail-id').textContent = `${event.id} · ${date(event.time)} ${time(event.time)} · ${outcomes[event.outcome]}`;
  $('#detail-dialog').showModal();
}

function renderTimeline() {
  if (!records) return;
  const visible = visibleEvents(records.events, options);
  $('#result-count').textContent = `${visible.length} records`;
  const fragment = document.createDocumentFragment();
  let previousDate = '';
  for (const event of visible) {
    const day = date(event.time);
    if (day !== previousDate) {
      fragment.append(element('div', 'date-heading', `${day} · 記録時刻`));
      previousDate = day;
    }
    const article = element('article', 'event');
    const symbol = element('span', `event-symbol ${event.kind}`, { action: '↗', decision: '⑂', check: '✓', issue: '!' }[event.kind]);
    symbol.setAttribute('aria-label', kinds[event.kind]);
    const content = element('div');
    const title = element('button', 'event-title', event.title);
    title.addEventListener('click', () => showDetails(event));
    content.append(eventMeta(event), title, element('p', 'event-body', event.body));
    if (event.reason) {
      const reason = element('div', 'event-reason');
      reason.append(element('strong', '', '判断の理由'), element('p', '', event.reason));
      content.append(reason);
    }
    const footer = element('div', 'event-footer');
    if (event.evidence[0]) footer.append(evidenceLink(event.evidence[0]));
    footer.append(element('span', `event-outcome ${event.outcome}`, outcomes[event.outcome]));
    const details = element('button', 'more-button', '詳細を見る ↗');
    details.setAttribute('aria-label', `${event.title}の詳細を見る`);
    details.addEventListener('click', () => showDetails(event));
    footer.append(details);
    content.append(footer);
    article.append(symbol, content);
    fragment.append(article);
  }
  if (!visible.length) {
    const empty = element('div', 'empty-state');
    empty.append(element('strong', '', records.events.length ? '条件に合う記録がありません' : 'まだ記録がありません'), element('span', '', records.events.length ? '検索や工程の条件を変えてみてください。' : 'AIがCLIから追記すると、ここに表示されます。'));
    fragment.append(empty);
  }
  $('#timeline').replaceChildren(fragment);
  $$('[data-phase]').forEach(button => {
    button.classList.toggle('active', button.dataset.phase === options.phase);
    button.setAttribute('aria-pressed', String(button.dataset.phase === options.phase));
  });
  $$('[data-kind]').forEach(button => {
    button.classList.toggle('active', button.dataset.kind === options.kind);
    button.setAttribute('aria-pressed', String(button.dataset.kind === options.kind));
  });
  $('#timeline-title').textContent = { all: '実行タイムライン', decision: '判断の記録', issue: '課題の記録' }[options.kind];
}

function render() {
  const { events, context } = records;
  $('#nav-count').textContent = events.length;
  $('#event-total').textContent = events.length;
  $('#decision-total').textContent = events.filter(e => e.kind === 'decision').length;
  $('#issue-total').textContent = events.filter(e => ['fail', 'unverified'].includes(e.outcome)).length;
  for (const key of ['plan', 'trial', 'audit', 'adoption']) $(`#${key}-state`).textContent = context.display[key];
  $('#cycle-status').textContent = context.display.cycle;
  $('#human-status').textContent = '本人評価：' + context.display.human_evaluation;
  $('#next-action').textContent = context.display.next;
  $('#current-bundle').textContent = context.current_bundle?.id || (context.current_bundle ? '台帳の原本を参照' : 'まだ採用されていません');
  renderTimeline();
}

async function refresh() {
  if (updating) return;
  updating = true;
  $('#refresh-button').disabled = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const [eventsResponse, contextResponse] = await Promise.all(['/api/events', '/api/context'].map(url => fetch(url, { cache: 'no-store', signal: controller.signal })));
    if (!eventsResponse.ok || !contextResponse.ok) throw new Error('記録ファイルを取得できません');
    const [events, context] = await Promise.all([eventsResponse.json(), contextResponse.json()]);
    const next = validatePair(events, context);
    const changed = JSON.stringify(records) !== JSON.stringify(next);
    records = next;
    if (changed) render();
    $('.connection-bar').classList.remove('error');
    $('#connection-text').textContent = `記録ファイルに接続済み · 台帳 rev.${context.revision}`;
    $('#updated-at').textContent = `最終取得 ${time(new Date())}`;
  } catch {
    $('.connection-bar').classList.add('error');
    $('#connection-text').textContent = records ? '更新できません · 前回取得した記録を表示しています' : '記録を取得できません · ローカルサーバーと保存ファイルを確認してください';
    if (!records) $('#timeline').replaceChildren(element('div', 'empty-state', '接続を確認して「最新の記録を読む」を押してください。'));
  } finally {
    clearTimeout(timeout);
    updating = false;
    $('#refresh-button').disabled = false;
  }
}

$('#refresh-button').addEventListener('click', refresh);
$('#search').addEventListener('input', event => { options.query = event.target.value; renderTimeline(); });
$('#sort').addEventListener('change', event => { options.order = event.target.value; renderTimeline(); });
$('#phase-select').addEventListener('change', event => { options.phase = event.target.value; renderTimeline(); });
$$('[data-phase]').forEach(button => button.addEventListener('click', () => { options.phase = button.dataset.phase; $('#phase-select').value = options.phase; renderTimeline(); }));
$$('[data-kind]').forEach(button => button.addEventListener('click', () => { options.kind = button.dataset.kind; renderTimeline(); }));
$$('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
$('#export-button').addEventListener('click', () => $('#export-dialog').showModal());
$('#how-button').addEventListener('click', () => $('#how-dialog').showModal());
$('#copy-button').addEventListener('click', async () => {
  if (!records) { $('#copy-status').textContent = '記録の取得後にコピーできます。'; return; }
  const text = JSON.stringify({ version: 1, events: visibleEvents(records.events, options) }, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    $('#copy-status').textContent = '表示中の記録をコピーしました。';
    $('#copy-fallback').hidden = true;
  } catch {
    $('#copy-fallback').hidden = false;
    $('#copy-fallback').value = text;
    $('#copy-fallback').focus();
    $('#copy-fallback').select();
    $('#copy-status').textContent = '自動コピーが使えません。選択されたJSONをコピーしてください。';
  }
});
document.addEventListener('keydown', event => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !$('dialog[open]')) { event.preventDefault(); $('#search').focus(); }
});
refresh();
setInterval(() => { if (!document.hidden) refresh(); }, 5000);
