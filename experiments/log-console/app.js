(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const STORAGE_KEY = 'aide-agent-log-v1';
  const TYPES = { decision: '判断', action: '実行', check: '検証', issue: '要確認' };
  const ICONS = { decision: 'branch', action: 'code', check: 'check', issue: 'alert' };
  const OUTCOMES = { recorded: '記録済み', passed: '検証成功', failed: '検証失敗', open: '未解決', resolved: '解決済み' };
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const uid = () => globalThis.crypto?.randomUUID?.() || `event-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const dateText = value => new Date(value).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeText = value => new Date(value).toLocaleTimeString('ja-JP', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const base = '2026-09-27T';
  const event = (id, time, type, agent, title, body, extra = {}) => ({ id, time: `${base}${time}+09:00`, type, agent, title, body, reason: '', evidence: '', next: '', outcome: type === 'issue' ? 'open' : type === 'check' ? 'passed' : 'recorded', bookmarked: false, ...extra });
  const seeds = [
    {
      id: 'EXP-024', title: 'コンテキスト圧縮の品質を検証', status: '進行中', goal: '長い対話でも、目標と判断の根拠を失わずに引き継げるか。',
      objective: '作業ログから引き継ぎ用の要約を作成し、情報量を減らしても次のエージェントが正しく作業を再開できるかを確かめる。',
      criteria: [{ text: '目標・制約・決定事項を保持する', done: true }, { text: '未解決事項と次の操作を引き継ぐ', done: true }, { text: '実際の再開作業で再現性を確認', done: false }],
      next: '圧縮したログを使って別セッションで作業を再開し、判断のずれがないか確認する。',
      events: [
        event('a1', '10:32:04', 'action', 'Planner', '実験セッションを開始', '目標・制約・検証項目を読み込み、今回の実験範囲を設定しました。', { evidence: 'experiments/EXP-024.md' }),
        event('a2', '10:32:18', 'decision', 'Planner', '全文保存と構造化サマリーを併用する', '原本を保持しながら、再開時に必要な情報だけをサマリーへ抽出します。', { reason: '要約だけでは判断の背景が失われる可能性があるため。目標・決定・未解決事項を分け、必要なときに原本へ戻れる形を選択しました。', evidence: 'design/context-policy.md', bookmarked: true }),
        event('a3', '10:33:02', 'action', 'Builder', 'ログから引き継ぎ項目を抽出', '24件のサンプル記録から、目標1件・制約3件・決定5件・未解決事項2件を抽出しました。', { evidence: 'artifacts/handoff-summary.json' }),
        event('a4', '10:33:41', 'check', 'Reviewer', '必須項目の保持を確認', '目標・制約・決定事項の9項目が、すべてサマリーに含まれることを確認しました。', { evidence: 'checks/required-fields.json' }),
        event('a5', '10:34:10', 'issue', 'Reviewer', '判断に使った根拠への参照が不足', '2件の決定に参照先がありません。別セッションで根拠を確認できるよう、元ログとの紐付けが必要です。', { evidence: 'checks/reference-coverage.json', next: '参照が不足している2件の決定に、元ログのIDを追加する。' }),
        event('a6', '10:34:36', 'decision', 'Planner', 'サマリーに元ログのIDを残す', '各決定に source_event_ids を追加し、根拠となる記録を追跡できるようにします。', { reason: '判断の根拠を再記述すると情報がずれるため、元のイベントを直接参照する方式を採用します。', evidence: 'design/context-policy.md', bookmarked: true }),
        event('a7', '10:35:12', 'action', 'Builder', '参照付きサマリーを生成', '欠けていた2件の参照を追加しました。修正版を保存し、再検証へ渡します。', { evidence: 'artifacts/handoff-summary-v2.json' }),
        event('a8', '10:35:48', 'check', 'Reviewer', '引き継ぎ項目の整合性チェックが完了', '未解決事項と次の操作を保持しています。参照先の実在と、再開時の再現性は引き続き確認します。', { evidence: 'checks/handoff-consistency.json' }),
      ],
    },
    {
      id: 'EXP-023', title: '失敗時のリカバリーを検証', status: '確認待ち', goal: '途中で操作が失敗しても、安全に再開できるか。',
      objective: '失敗した操作を記録し、再試行しても成果物が二重に生成されないことを確認する。',
      criteria: [{ text: '失敗した操作を識別できる', done: true }, { text: '再試行で二重反映が起きない', done: true }, { text: '人による結果確認を終える', done: false }], next: '再試行後の成果物を人が確認し、設計への採否を記録する。',
      events: [event('b1', '09:10:04', 'action', 'Builder', '失敗を再現する試行を開始', '保存途中で処理を停止する条件を設定しました。'), event('b2', '09:11:17', 'issue', 'Builder', '成果物の保存中に接続が切断', '操作IDを保持し、再試行候補として記録しました。', { outcome: 'resolved', evidence: 'operations/retry-003.json' }), event('b3', '09:12:30', 'decision', 'Planner', '同一の操作IDで再試行', '既存の処理結果を確認してから再実行します。', { reason: '新規IDで再実行すると二重反映を見逃すため。', bookmarked: true }), event('b4', '09:14:12', 'check', 'Reviewer', '成果物の重複なし', '再試行を3回行い、保存された成果物は1件でした。', { evidence: 'checks/retry-idempotency.json' })],
    },
    {
      id: 'EXP-022', title: '役割間の引き継ぎを確認', status: '実験終了', goal: '計画・実装・検証で、情報を正しく共有できるか。',
      objective: '役割ごとの入力と出力を明示し、次の担当が追加質問なしで小さな作業を再開できることを確認する。',
      criteria: [{ text: '役割ごとの責任を明記する', done: true }, { text: '成果物と根拠を受け渡す', done: true }, { text: '受け渡しの実行例を確認する', done: true }], next: '今回の観測結果を設計候補としてまとめ、採用判断へ渡す。',
      events: [event('c1', '08:00:00', 'decision', 'Planner', '受け渡しを共通フォーマットに統一', '目標・結果・根拠・次の操作を受け渡しの必須項目にします。', { reason: '読み手が必要な情報の位置を予測できるようにするため。', bookmarked: true }), event('c2', '08:02:00', 'action', 'Builder', '受け渡しサンプルを作成', '3つの役割の受け渡しを記録しました。', { evidence: 'artifacts/role-handoff.md' }), event('c3', '08:05:00', 'check', 'Reviewer', '再開に必要な情報を確認', '共通フォーマットの4項目が揃い、次の操作を再現できました。', { evidence: 'checks/role-handoff.json' })],
    },
  ];
  seeds.forEach(session => session.sample = true);
  let sessions = structuredClone(seeds);
  let selected = sessions[0].id;
  let view = 'logs', filter = 'all', query = '', bookmarksOnly = false, order = 'asc';
  let demoTimer = null, toastTimer = null, storageAvailable = true;
  const current = () => sessions.find(s => s.id === selected);

  function validateEvent(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('イベントの形式が正しくありません。');
    if (!Object.hasOwn(TYPES, input.type)) throw new Error('ログの種類が正しくありません。');
    for (const [key, limit] of Object.entries({ title: 100, body: 3000, agent: 100 })) {
      if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > limit) throw new Error(`${key} は必須です（最大 ${limit} 文字）。`);
    }
    if (typeof input.time !== 'string' || !Number.isFinite(Date.parse(input.time))) throw new Error('有効な日時が必要です。');
    if (!Object.hasOwn(OUTCOMES, input.outcome)) throw new Error('ログの結果が正しくありません。');
    const result = { id: typeof input.id === 'string' && input.id.length <= 150 ? input.id : uid(), type: input.type, title: input.title.trim(), body: input.body.trim(), agent: input.agent.trim(), time: new Date(input.time).toISOString(), outcome: input.outcome, bookmarked: input.bookmarked === true };
    for (const [key, limit] of Object.entries({ reason: 2000, evidence: 300, next: 500 })) {
      if (input[key] != null && (typeof input[key] !== 'string' || input[key].length > limit)) throw new Error(`${key} は最大 ${limit} 文字の文字列です。`);
      result[key] = input[key] || '';
    }
    return result;
  }

  function validateSession(input) {
    if (!input || typeof input !== 'object') throw new Error('セッション形式が正しくありません。');
    for (const key of ['id', 'title', 'goal', 'objective', 'status', 'next']) {
      if (typeof input[key] !== 'string' || input[key].length > 2000) throw new Error(`セッションの ${key} が正しくありません。`);
    }
    if (!input.id.trim() || !input.title.trim()) throw new Error('セッションのIDとタイトルは必須です。');
    if (!Array.isArray(input.events) || input.events.length > 5000) throw new Error('ログは最大5,000件です。');
    if (!Array.isArray(input.criteria) || input.criteria.length > 20 || input.criteria.some(c => !c || typeof c.text !== 'string' || c.text.length > 300 || typeof c.done !== 'boolean')) throw new Error('完了条件の形式が正しくありません。');
    const events = input.events.map(validateEvent);
    if (new Set(events.map(e => e.id)).size !== events.length) throw new Error('ログIDが重複しています。');
    return { id: input.id, title: input.title, goal: input.goal, objective: input.objective, status: input.status, next: input.next, sample: input.sample === true, criteria: input.criteria.map(c => ({ text: c.text, done: c.done })), events };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version !== 1 || !Array.isArray(parsed.sessions) || !parsed.sessions.length || parsed.sessions.length > 50) throw new Error('保存形式が異なります。');
      sessions = parsed.sessions.map(validateSession);
      if (new Set(sessions.map(s => s.id)).size !== sessions.length) throw new Error('セッションIDが重複しています。');
      selected = sessions.some(s => s.id === parsed.selected) ? parsed.selected : sessions[0].id;
    }
  } catch {
    storageAvailable = false;
    sessions = structuredClone(seeds);
    selected = sessions[0].id;
  }

  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3600);
  }
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, selected, sessions }));
      storageAvailable = true;
    } catch { storageAvailable = false; }
    renderStorage();
  }
  function renderStorage() {
    $('#storage-note').textContent = storageAvailable ? 'このブラウザに自動保存します。' : '保存できません。書き出しをご利用ください。';
    $('#save-status').textContent = storageAvailable ? 'すべてのログはこのブラウザに保存されます' : '一時保存中です。書き出して記録を残してください';
    $('.local-card strong').textContent = storageAvailable ? 'ローカルで記録中' : 'メモリに一時記録中';
  }
  function render() {
    const s = current();
    const count = type => s.events.filter(e => e.type === type).length;
    $('#session-list').innerHTML = sessions.map(session => `<button class="session-item ${session.id === selected ? 'selected' : ''}" data-session="${escape(session.id)}" aria-pressed="${session.id === selected}"><span class="dot ${session.status === '確認待ち' ? 'amber' : 'green'}"></span><span><strong>${escape(session.title)}</strong><small>${escape(session.id)} · ${escape(session.status)}</small></span></button>`).join('');
    $('.session-label span').textContent = String(sessions.length).padStart(2, '0');
    $('#mobile-session').innerHTML = sessions.map(session => `<option value="${escape(session.id)}" ${session.id === selected ? 'selected' : ''}>${escape(session.id)} · ${escape(session.title)}</option>`).join('');
    $('.sample-label').textContent = s.sample ? 'SAMPLE SESSION' : 'LOCAL SESSION';
    $('#session-id').textContent = s.id;
    $('#session-status').textContent = s.status;
    $('#session-status').classList.toggle('waiting', s.status === '確認待ち');
    $('#session-title').textContent = s.title;
    $('#session-goal').textContent = s.goal;
    const first = [...s.events].sort((a, b) => Date.parse(a.time) - Date.parse(b.time))[0];
    $('#session-date').textContent = first ? `${dateText(first.time)} ${timeText(first.time).slice(0, 5)} 開始` : '記録を待っています';
    $('#timeline-date').textContent = first ? `${dateText(first.time)} · ${Intl.DateTimeFormat().resolvedOptions().timeZone}` : '記録なし';
    $('#objective-text').textContent = s.objective;
    $('#criteria-list').innerHTML = s.criteria.map(c => `<li><span class="criterion-circle ${c.done ? 'done' : ''}" aria-label="${c.done ? '達成' : '未確認'}">${c.done ? icon('check') : ''}</span>${escape(c.text)}</li>`).join('');
    $('#next-action').textContent = s.next || '次のアクションはまだ記録されていません。';
    $('#stat-events').textContent = s.events.length;
    $('#nav-count').textContent = s.events.length;
    $('#stat-decisions').textContent = count('decision');
    $('#stat-checks').textContent = s.events.filter(e => e.type === 'check' && e.outcome === 'passed').length;
    const failed = s.events.filter(e => e.type === 'check' && e.outcome === 'failed').length;
    $('#check-foot').innerHTML = `<span class="tiny-dot ${failed ? 'amber' : 'green'}"></span>検証 ${count('check')} 件中、失敗 ${failed} 件`;
    const issues = s.events.filter(e => e.outcome === 'open' || e.outcome === 'failed').length;
    $('#stat-issues').textContent = issues;
    $('#issue-foot').innerHTML = `<span class="tiny-dot ${issues ? 'amber' : 'green'}"></span>${issues ? '確認が必要な記録があります' : '未解決の記録はありません'}`;
    const participants = [...new Set(s.events.map(e => e.agent))];
    const agentDetails = { Planner: ['planner', '計画・判断'], Builder: ['builder', '実装・実行'], Reviewer: ['reviewer', '検証・観測'] };
    $('.agent-avatars').innerHTML = participants.slice(0, 3).map(name => `<b>${escape(name[0])}</b>`).join('') + `<span>${participants.length} agents</span>`;
    const agentCard = $('.quiet-count').closest('.context-card');
    agentCard.querySelectorAll('.agent-row').forEach(el => el.remove());
    $('.quiet-count').textContent = String(participants.length).padStart(2, '0');
    participants.forEach(name => {
      const details = Object.hasOwn(agentDetails, name) ? agentDetails[name] : ['planner', 'ログの記録'];
      const row = document.createElement('div'); row.className = 'agent-row';
      row.innerHTML = `<span class="agent-avatar ${details[0]}">${escape(name[0])}</span><div><strong>${escape(name)}</strong><small>${details[1]}</small></div><span class="agent-event-count">${s.events.filter(e => e.agent === name).length} events</span>`;
      agentCard.insertBefore(row, $('.agent-note'));
    });
    $('.agent-note').textContent = s.sample ? 'サンプル内の役割です。独立監査の証明ではありません。' : 'ログの担当名をもとに集計しています。';
    const nextOwner = [...s.events].reverse().find(e => e.next === s.next)?.agent || 'Planner';
    $('.next-owner').innerHTML = `<span class="agent-avatar planner">${escape(nextOwner[0])}</span><span>${escape(nextOwner)}</span><span>引き継ぎ事項</span>`;
    const titles = { logs: ['実行ログ', 'Agent Log', 'AIの行動と判断を、一つのタイムラインに。', 'タイムライン'], decisions: ['判断の記録', 'Decisions', '何を選び、なぜ選んだか。判断の背景をたどる。', '意思決定の記録'], artifacts: ['成果物', 'Artifacts', '実行の結果と、検証の根拠をひとつに。', '成果物と参照'] };
    const texts = titles[view];
    $('#page-title').innerHTML = `${texts[0]}<span>${texts[1]}</span>`;
    $('#breadcrumb-current').textContent = texts[0];
    $('#page-description').textContent = texts[2];
    $('#timeline-title').textContent = texts[3];
    $$('[data-view]').forEach(button => { button.classList.toggle('active', button.dataset.view === view); button.setAttribute('aria-pressed', String(button.dataset.view === view)); });
    $('.filter-tabs').hidden = view !== 'logs';
    $$('.filter-tabs button').forEach(button => {
      button.classList.toggle('active', button.dataset.filter === filter);
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
      button.querySelector('span').textContent = button.dataset.filter === 'all' ? s.events.length : count(button.dataset.filter);
    });
    renderEvents();
    renderStorage();
  }

  function renderEvents() {
    let events = current().events.filter(e => (view !== 'decisions' || e.type === 'decision') && (view !== 'artifacts' || e.evidence) && (view !== 'logs' || filter === 'all' || e.type === filter) && (!bookmarksOnly || e.bookmarked));
    const needle = query.toLocaleLowerCase();
    if (needle) events = events.filter(e => [e.title, e.body, e.reason, e.agent, e.evidence, e.next, TYPES[e.type]].some(value => value.toLocaleLowerCase().includes(needle)));
    events = events.slice().sort((a, b) => (Date.parse(a.time) - Date.parse(b.time)) * (order === 'asc' ? 1 : -1));
    $('#event-count').textContent = `${events.length} ${view === 'artifacts' ? 'references' : 'events'}`;
    $('#timeline').classList.toggle('compact', $('#compact-toggle').checked);
    if (!events.length) {
      $('#timeline').innerHTML = '<div class="empty-state"><strong>該当するログがありません</strong>検索や絞り込みの条件を変えてみてください。</div>';
      return;
    }
    if (view === 'artifacts') {
      $('#timeline').innerHTML = events.map(e => `<article class="artifact-card"><strong>${icon('file')} ${escape(e.evidence)}</strong><p>${escape(e.title)}</p><div class="event-header"><span class="type-tag ${e.type}">${TYPES[e.type]}</span><span class="event-agent">${escape(e.agent)}</span><time class="event-time" datetime="${escape(e.time)}">${timeText(e.time)}</time></div><p>参照名の記録です。この画面にファイル本体は含まれません。</p></article>`).join('');
      return;
    }
    $('#timeline').innerHTML = events.map(e => `<article class="log-entry"><div class="event-icon ${e.type}">${icon(ICONS[e.type])}</div><div><div class="event-header"><span class="type-tag ${e.type}">${TYPES[e.type]}</span><span class="event-agent">${escape(e.agent)}</span><time class="event-time" datetime="${escape(e.time)}" title="${escape(dateText(e.time))}">${timeText(e.time)}</time><button class="bookmark-button" data-bookmark="${escape(e.id)}" aria-label="${escape(e.title)}を${e.bookmarked ? '重要から外す' : '重要にする'}" aria-pressed="${e.bookmarked}" title="重要なログ">${icon('bookmark')}</button></div><h3 class="event-title">${escape(e.title)}</h3><p class="event-body">${escape(e.body)}</p>${e.reason ? `<div class="reason-box"><strong>判断の理由</strong><p>${escape(e.reason)}</p></div>` : ''}<div class="event-meta">${e.evidence ? `<span class="evidence-chip" title="根拠・参照名（ファイル本体は未接続）">${icon('file')}${escape(e.evidence)}</span>` : ''}<span class="outcome-label ${e.outcome}">${OUTCOMES[e.outcome]}</span>${e.outcome === 'open' ? `<button class="resolve-button" data-resolve="${escape(e.id)}">解決を記録</button>` : ''}</div>${e.next ? `<p class="event-body">次へ：${escape(e.next)}</p>` : ''}</div></article>`).join('');
  }

  function append(input) {
    const s = current();
    if (s.events.length >= 5000) throw new Error('1セッションのログは最大5,000件です。');
    const normalized = validateEvent({ id: uid(), time: new Date().toISOString(), reason: '', evidence: '', next: '', outcome: input.type === 'issue' ? 'open' : 'recorded', ...input });
    if (s.events.some(e => e.id === normalized.id)) throw new Error('同じログIDがすでに存在します。');
    s.events.push(normalized);
    if (normalized.next) s.next = normalized.next;
    save();
    render();
    return structuredClone(normalized);
  }

  function stopDemo(notify = false) {
    if (demoTimer) clearInterval(demoTimer);
    demoTimer = null;
    $('#demo-button').innerHTML = `${icon('play')}デモを実行`;
    $('#demo-dot').classList.remove('running');
    $('#demo-status').textContent = '記録を再生できます';
    if (notify) toast('デモを停止しました。追加したログは保存されています。');
  }
  function startDemo() {
    if (demoTimer) { stopDemo(true); return; }
    let step = 0;
    const demoEvents = [
      { type: 'action', agent: 'Builder', title: '［デモ］追加検証を開始', body: '現在のセッションを入力として、模擬の検証イベントを生成します。実際のツール実行は行っていません。' },
      { type: 'check', agent: 'Reviewer', title: '［デモ］サンプルの検証結果を記録', body: 'イベントの必須項目を確認できた想定のサンプルです。実際の検証結果ではありません。', outcome: 'passed', evidence: 'demo/sample-check.json' },
      { type: 'decision', agent: 'Planner', title: '［デモ］実使用での確認へ進む', body: '模擬ログの追加が完了しました。完了条件や採用状態は変更しません。', reason: '模擬データだけでは実際のハーネスの品質を判断できないため。', next: '実際のハーネスからイベントを取り込み、同じ項目で観測結果を記録する。' },
    ];
    $('#demo-button').innerHTML = `${icon('pause')}デモを停止`;
    $('#demo-dot').classList.add('running');
    $('#demo-status').textContent = 'サンプルログを追加中';
    demoTimer = setInterval(() => {
      try { append(demoEvents[step++]); } catch (error) { stopDemo(); toast(error.message); return; }
      if (step === demoEvents.length) { stopDemo(); toast('デモが完了しました。3件のログを追加しました。'); }
    }, 1700);
  }

  function exportSession(format) {
    const s = current();
    const md = text => String(text).replace(/[\\`*_{}\[\]<>#|]/g, '\\$&');
    let data;
    if (format === 'json') data = JSON.stringify({ version: 1, session: s }, null, 2);
    else data = `# ${md(s.id)} — ${md(s.title)}\n\n> 実験用プロトタイプの記録。${s.sample ? 'このセッションの初期データはサンプルです。' : ''}\n\n- 状態: ${md(s.status)}\n- 目標: ${md(s.goal)}\n\n## 実験の目的\n\n${md(s.objective)}\n\n## 完了の条件\n\n${s.criteria.map(c => `- [${c.done ? 'x' : ' '}] ${md(c.text)}`).join('\n')}\n\n## 次のアクション\n\n${md(s.next)}\n\n## ログ\n\n${[...s.events].sort((a, b) => Date.parse(a.time) - Date.parse(b.time)).map(e => `### ${md(e.title)}\n\n- 日時: ${e.time}\n- 種類: ${TYPES[e.type]}\n- 担当: ${md(e.agent)}\n- 結果: ${OUTCOMES[e.outcome]}\n- ID: ${md(e.id)}\n- 重要: ${e.bookmarked ? 'はい' : 'いいえ'}\n\n${md(e.body)}${e.reason ? `\n\n**判断理由:** ${md(e.reason)}` : ''}${e.evidence ? `\n\n**根拠・参照:** ${md(e.evidence)}` : ''}${e.next ? `\n\n**次のアクション:** ${md(e.next)}` : ''}`).join('\n\n---\n\n')}\n`;
    const url = URL.createObjectURL(new Blob([data], { type: format === 'json' ? 'application/json;charset=utf-8' : 'text/markdown;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${s.id.replace(/[^a-zA-Z0-9_-]/g, '_')}-agent-log.${format}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    $('#export-dialog').close();
    toast(`${format.toUpperCase()}のダウンロードを開始しました。`);
  }

  function selectSession(id) {
    stopDemo();
    selected = id;
    filter = 'all'; query = ''; bookmarksOnly = false;
    $('#search').value = '';
    $('#bookmark-filter').setAttribute('aria-pressed', 'false');
    save(); render();
  }
  $('#session-list').addEventListener('click', event => {
    const button = event.target.closest('[data-session]');
    if (button) selectSession(button.dataset.session);
  });
  $('#mobile-session').addEventListener('change', event => selectSession(event.target.value));
  $$('[data-view]').forEach(button => button.addEventListener('click', () => { view = button.dataset.view; filter = 'all'; render(); }));
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; render(); }));
  $('#search').addEventListener('input', event => { query = event.target.value.trim(); renderEvents(); });
  $('#sort-order').addEventListener('change', event => { order = event.target.value; renderEvents(); });
  $('#compact-toggle').addEventListener('change', renderEvents);
  $('#bookmark-filter').addEventListener('click', () => { bookmarksOnly = !bookmarksOnly; $('#bookmark-filter').setAttribute('aria-pressed', String(bookmarksOnly)); renderEvents(); });
  $('#timeline').addEventListener('click', event => {
    const bookmark = event.target.closest('[data-bookmark]');
    if (bookmark) { const e = current().events.find(e => e.id === bookmark.dataset.bookmark); e.bookmarked = !e.bookmarked; save(); renderEvents(); }
    const resolve = event.target.closest('[data-resolve]');
    if (resolve) {
      const e = current().events.find(e => e.id === resolve.dataset.resolve);
      try {
        append({ type: 'action', agent: 'Human', title: '要確認の解決を記録', body: `「${e.title}」を画面の操作により解決済みに変更しました。自動検証の結果ではありません。`, evidence: `event:${e.id}` });
        e.outcome = 'resolved'; save(); render(); toast('解決済みに変更し、操作の履歴を残しました。');
      } catch (error) { toast(error.message); }
    }
  });
  $('#add-button').addEventListener('click', () => $('#log-dialog').showModal());
  $('#export-button').addEventListener('click', () => $('#export-dialog').showModal());
  $$('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  $('#log-form').elements.type.addEventListener('change', event => { $('#log-form').elements.outcome.value = event.target.value === 'issue' ? 'open' : 'recorded'; });
  $('#log-form').addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target));
    try { append(values); $('#log-dialog').close(); event.target.reset(); toast('ログを保存しました。'); } catch (error) { toast(error.message); }
  });
  $('#demo-button').addEventListener('click', startDemo);
  $$('[data-export]').forEach(button => button.addEventListener('click', () => exportSession(button.dataset.export)));
  $('#import-button').addEventListener('click', () => $('#import-file').click());
  $('#mobile-import').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('5MB以下のJSONファイルを選択してください。');
      const data = JSON.parse(await file.text());
      if (data.version !== 1) throw new Error('対応していないバージョンです。version: 1 を指定してください。');
      const imported = validateSession(data.session);
      if (sessions.length >= 50) throw new Error('保存できるセッションは最大50件です。');
      stopDemo();
      const originalId = imported.id;
      let suffix = 1;
      while (sessions.some(s => s.id === imported.id)) imported.id = `${originalId}-import-${suffix++}`;
      sessions.push(imported); selected = imported.id;
      view = 'logs'; filter = 'all'; query = ''; bookmarksOnly = false;
      $('#search').value = ''; $('#bookmark-filter').setAttribute('aria-pressed', 'false');
      save(); render(); toast('新しいセッションとして読み込みました。');
    } catch (error) { toast(`読み込めませんでした：${error.message}`); }
    event.target.value = '';
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !document.querySelector('dialog[open]')) { event.preventDefault(); $('#search').focus(); }
  });
  window.harnessLog = Object.freeze({ append, getSession: () => structuredClone(current()) });
  render();
})();
