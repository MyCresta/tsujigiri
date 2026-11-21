(() => {
  'use strict';

  const storageKey = 'tsujigiri.case.v1';
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const icons = {
    document: '<path d="M6 3h9l3 3v15H6zM14 3v5h4M9 12h6m-6 4h6"/>',
    witness: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/>',
    object: '<path d="m3 9 9-5 9 5-9 5zM3 9v8l9 5 9-5V9M12 14v8"/>',
    map: '<path d="m2 6 7-3 6 3 7-3v15l-7 3-6-3-7 3zM9 3v15m6-12v15"/>',
    notebook: '<path d="M4 3h14a2 2 0 0 1 2 2v15H6a2 2 0 0 1-2-2zM8 3v17m4-12h5m-5 4h5"/>',
    compare: '<rect x="2" y="5" width="8" height="14" rx=".5"/><rect x="14" y="5" width="8" height="14" rx=".5"/>',
    expand: '<path d="M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6"/>',
    volume: '<path d="M3 9h4l5-5v16l-5-5H3zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    mute: '<path d="M3 9h4l5-5v16l-5-5H3zM16 9l5 6m0-6-5 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
    close: '<path d="m5 5 14 14M19 5 5 19"/>',
    check: '<path d="m4 12 5 5 11-11"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    pin: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    pen: '<path d="m4 16 12-12 4 4L8 20l-5 1zM14 6l4 4"/>',
    gate: '<path d="M2 5q10 3 20 0M3 10h18M7 7 6 21m11-14 1 14M12 7v3"/>'
  };
  const kindNames = { document: 'Document', map: 'Map', object: 'Object', witness: 'Testimony' };
  const esc = (value = '') => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const icon = name => '<svg viewBox="0 0 24 24" class="g-icon" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">' + (icons[name] || '') + '</svg>';
  const paragraphs = lines => (Array.isArray(lines) ? lines : [lines]).filter(Boolean).map(line => '<p>' + esc(line) + '</p>').join('');
  const getCase = () => window.CASEFILE;
  const getGame = () => document.getElementById('game');
  const defaultState = () => ({
    started: false, view: 'intro', chapter: 0, solved: 0, notes: '',
    seen: [], compare: [], hints: {}, drafts: {}
  });
  let state;
  let dialog;
  let lastFocus;
  let persistent = true;
  let noticeTimer;

  function load() {
    if (state) return;
    state = defaultState();
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (!saved || typeof saved !== 'object') return;
      const count = getCase()?.acts?.length || 4;
      state.started = saved.started === true;
      state.solved = Math.min(count, Math.max(0, Number.parseInt(saved.solved, 10) || 0));
      state.chapter = Math.max(0, Math.min(Number.parseInt(saved.chapter, 10) || 0, count - 1, state.solved));
      state.view = saved.view === 'ending' && state.solved === count ? 'ending' : saved.view === 'desk' ? 'desk' : 'intro';
      state.notes = typeof saved.notes === 'string' ? saved.notes : '';
      state.seen = Array.isArray(saved.seen) ? saved.seen.filter(k => typeof k === 'string') : [];
      state.compare = Array.isArray(saved.compare) ? saved.compare.filter(k => typeof k === 'string' && getItem(k)).slice(0, 2) : [];
      for (const k of ['drafts', 'hints']) {
        if (saved[k] && typeof saved[k] === 'object' && !Array.isArray(saved[k])) state[k] = saved[k];
      }
    } catch { persistent = false; }
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      persistent = true;
    } catch {
      persistent = false;
    }
  }

  function getItem(key) {
    const [a, i] = String(key).split('.').map(Number);
    if (!Number.isInteger(a) || a > state.solved || a < 0 || !Number.isInteger(i) || i < 0) return null;
    return getCase()?.acts?.[a]?.items?.[i];
  }

  function focusHeading(id = 'g-heading', scroll = true) {
    const el = document.getElementById(id);
    if (el) {
      el.focus({ preventScroll: true });
      if (scroll) el.scrollIntoView({ block: 'start' });
    }
  }

  function addDialog() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'g-dialog';
    dialog.setAttribute('aria-labelledby', 'g-modal-title');
    document.body.appendChild(dialog);
    dialog.addEventListener('close', () => {
      document.body.classList.remove('g-modal-open');
      if (lastFocus?.isConnected && !lastFocus.closest('[hidden]')) lastFocus.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
    });
  }

  function openDialog(content, className = '') {
    addDialog();
    const alreadyOpen = dialog.open;
    if (!alreadyOpen) lastFocus = document.activeElement;
    dialog.className = 'g-dialog ' + className;
    dialog.innerHTML = '<div class="g-modal-shell">' + content + '</div>';
    if (!alreadyOpen) {
      dialog.showModal();
      document.body.classList.add('g-modal-open');
    }
    dialog.scrollTop = 0;
    const heading = dialog.querySelector('#g-modal-title');
    if (heading) heading.focus({ preventScroll: true });
  }

  function closeDialog() {
    if (dialog?.open) dialog.close();
  }

  function returnToTitle() {
    closeDialog();
    getGame().hidden = true;
    document.body.classList.remove('g-playing');
    window.showTitle?.();
    if (!window.showTitle) document.getElementById('title-screen').hidden = false;
  }

  const closeButton = () => '<button class="g-icon-button g-close" data-ga="close" aria-label="Close">' + icon('close') + '</button>';
  const modalHead = (label, title) => '<header class="g-modal-head"><div><p class="g-label">' + esc(label) + '</p><h2 id="g-modal-title" tabindex="-1">' + esc(title) + '</h2></div>' + closeButton() + '</header>';

  function showNotice(message) {
    const el = (dialog?.open ? dialog.querySelector('.g-notice') : null) || getGame()?.querySelector('.g-notice');
    if (!el) return;
    clearTimeout(noticeTimer);
    el.textContent = message;
    el.hidden = false;
    noticeTimer = setTimeout(() => { el.hidden = true; el.textContent = ''; }, 4200);
  }

  function chapterNav() {
    const file = getCase();
    return '<nav class="g-chapters" aria-label="Case chapters"><button data-ga="intro" ' + (state.view === 'intro' ? 'aria-current="page"' : '') +
      '>Opening file</button>' + file.acts.map((act, i) => {
        const sealed = i > state.solved || (!state.started && i === 0);
        const current = state.view === 'desk' && state.chapter === i;
        return '<button data-ga="chapter" data-index="' + i + '" ' + (sealed ? 'disabled title="Sealed chapter" ' : '') + (current ? 'aria-current="page"' : '') + '>' +
          (sealed ? icon('lock') : i < state.solved ? icon('check') : '') + 'Chapter ' + (roman[i] || i + 1) + '</button>';
      }).join('') + (state.solved === file.acts.length ? '<button data-ga="ending" ' + (state.view === 'ending' ? 'aria-current="page"' : '') + '>Closing entry</button>' : '') + '</nav>';
  }

  function render() {
    const game = getGame();
    const sound = typeof window.toggleAmbience === 'function' ? soundButton() : '';
    game.innerHTML = '<div class="g-app"><header class="g-mast"><button class="g-wordmark" data-ga="title" title="Return to title screen"><span class="g-mon">' +
      '<img src="./assets/mark.svg" alt="" width="34" height="34">' + '</span><span>Tsujigiri</span></button><span class="g-mast-caption">The investigation desk</span><div class="g-tools"><button class="g-tool" data-ga="notebook">' +
      icon('notebook') + '<span>Notebook</span></button>' + sound +
      (document.fullscreenEnabled ? '<button class="g-icon-button" data-ga="fullscreen" aria-label="Toggle full screen" title="Toggle full screen">' + icon('expand') + '</button>' : '') +
      '<button class="g-tool g-title-link" data-ga="title">Title screen</button></div></header><div class="g-frame">' + chapterNav() + (state.view === 'intro' ? intro() : state.view === 'ending' ? ending() : desk()) +
      '<footer class="g-foot"><span>Kageura Crossing</span><span>' + (persistent ? 'Progress saved on this device' : 'Storage unavailable · Progress lasts for this session') +
      '</span></footer></div><div class="g-notice" role="status" hidden></div></div>';
    for (const field of game.querySelectorAll('#g-answer-form select[data-field]')) {
      field.value = state.drafts[state.chapter]?.[field.dataset.field] || '';
    }
  }

  function soundButton() {
    const on = !!window.ambienceOn?.();
    return '<button class="g-icon-button" data-ga="audio" aria-label="' + (on ? 'Mute ambience' : 'Enable ambience') + '" title="' +
      (on ? 'Mute ambience' : 'Enable ambience') + '" aria-pressed="' + on + '">' + icon(on ? 'volume' : 'mute') + '</button>';
  }

  function intro() {
    const file = getCase();
    return '<section class="g-opening"><div class="g-opening-art" role="img" aria-label="A lantern lights a writing table inside a room looking out on a rainy garden"></div>' +
      '<article class="g-opening-paper"><p class="g-label g-red">The opening file</p><h1 id="g-heading" tabindex="-1">' + esc(file.subtitle || 'The Kageura Crossing') +
      '</h1>' + (file.setting ? '<p class="g-dateline">' + esc(file.setting) + '</p>' : '') + '<div class="g-prose">' + paragraphs(file.intro) +
      '</div><button class="g-primary" data-ga="chapter" data-index="' + Math.min(state.solved, file.acts.length - 1) + '">' + (state.solved ? 'Return to investigation' : 'Examine the first exhibits') +
      '</button></article></section><section class="g-roles"><div><p class="g-label">Around one screen</p><h2>Divide the work</h2><p>With two investigators, take two roles each. Trade roles when a new chapter opens.</p></div><dl>' +
      (file.roles || []).map(role => '<div><dt>' + esc(role.name) + '</dt><dd>' + esc(role.task) + '</dd></div>').join('') + '</dl></section>';
  }

  function visual(item, detailed = false) {
    if (item.asset && item.kind !== 'map') return '<img src="' + esc(item.asset) + '" alt="" ' + (detailed ? '' : 'loading="lazy" ') + '>';
    if (item.asset) return '<img src="' + esc(item.asset) + '" alt="' + (detailed ? esc(item.caption || item.title) : '') + '" ' + (detailed ? '' : 'loading="lazy" ') + '>';
    const excerpt = (item.body?.[0] || '').slice(0, 180);
    return '<div class="g-manuscript" aria-hidden="true"><div class="g-manuscript-type">' + icon(item.kind) + '</div><span>' + esc(item.title) + '</span><i>' + esc(excerpt) + '</i></div>';
  }

  function card(item, i) {
    const key = state.chapter + '.' + i;
    return '<article class="g-card"><button class="g-card-open" data-ga="reader" data-key="' + key + '"><span class="g-card-image ' + (item.asset ? 'g-has-image' : '') + '">' + visual(item) +
      '</span><span class="g-card-copy"><span class="g-card-meta">' + icon(item.kind) + esc(kindNames[item.kind] || 'Exhibit') +
      '</span><span class="g-card-title">' + esc(item.title) + '</span>' + (item.subtitle ? '<span class="g-card-detail">' + esc(item.subtitle) + '</span>' : '') +
      '</span></button><div class="g-card-bottom"><span data-gseen="' + key + '">' + (state.seen.includes(key) ? 'Examined' : 'Unexamined') + '</span>' + pinButton(key) + '</div></article>';
  }

  function pinButton(key) {
    const pinned = state.compare.includes(key);
    return '<button class="g-pin" data-ga="pin" data-key="' + key + '" aria-pressed="' + pinned + '" title="Keep this exhibit for side-by-side comparison">' +
      icon('pin') + '<span>' + (pinned ? 'Pinned' : 'Pin exhibit') + '</span></button>';
  }

  function compareButton() {
    const n = state.compare.length;
    return '<button class="g-secondary g-compare-btn" data-ga="compare">' + icon('compare') + '<span>Compare exhibits' + (n ? ' (' + n + '/2)' : '') + '</span></button>';
  }

  function desk() {
    const act = getCase().acts[state.chapter];
    return '<section class="g-section-head"><div><p class="g-label g-red">Chapter ' + (roman[state.chapter] || state.chapter + 1) +
      (act.kicker ? ' <b>／</b> ' + esc(act.kicker) : '') + '</p><h1 id="g-heading" tabindex="-1">' + esc(act.title) + '</h1><div class="g-brief">' + paragraphs(act.brief) +
      '</div></div><button class="g-primary" data-ga="to-deduction">' + (state.chapter < state.solved ? 'Read finding' : 'Make a deduction') + '</button></section>' +
      (act.event ? '<aside class="g-event"><span class="g-event-icon">' + icon('gate') + '</span><div><p class="g-label g-red">Entry in the case record</p>' + paragraphs(act.event) + '</div></aside>' : '') +
      '<div class="g-shelf-head"><h2>Evidence register</h2>' + compareButton() + '</div><div class="g-grid">' + act.items.map(card).join('') +
      '</div>' + deduction(act);
  }

  function deduction(act) {
    const i = state.chapter;
    const puzzle = act.puzzle;
    if (i < state.solved) {
      const last = i === getCase().acts.length - 1;
      return '<section class="g-finding" id="g-deduction"><span class="g-finding-icon">' + icon('check') + '</span><div><p class="g-label">Finding entered</p><h2 id="g-deduction-heading" tabindex="-1">' + esc(puzzle.title) + '</h2><div class="g-prose">' + paragraphs(puzzle.success) +
        '</div><button class="g-primary" data-ga="' + (last ? 'ending' : 'chapter') + '" data-index="' + (i + 1) + '">' + (last ? 'Read the closing entry' : 'Open chapter ' + (roman[i + 1] || i + 2)) + '</button></div></section>';
    }
    const shown = Math.min(puzzle.hints?.length || 0, Math.max(0, Number(state.hints[i]) || 0));
    return '<section class="g-deduction" id="g-deduction"><div class="g-deduction-intro"><p class="g-label g-red">Joint deduction</p><h2 id="g-deduction-heading" tabindex="-1">' + esc(puzzle.title) + '</h2><div class="g-prose">' + paragraphs(puzzle.prompt) + '</div>' +
      (puzzle.hints?.length ? '<div class="g-hints"><h3>Field hints</h3><ol>' + puzzle.hints.slice(0, shown).map(h => '<li>' + esc(h) + '</li>').join('') + '</ol>' +
        (shown < puzzle.hints.length ? '<button class="g-text-button" data-ga="hint">' + (shown ? 'Reveal the next hint' : 'Reveal a first hint') + '</button>' : '<span class="g-hint-end">All hints opened</span>') + '</div>' : '') +
      '</div><form class="g-fields" id="g-answer-form">' + puzzle.fields.map((f, j) => '<div><label for="g-answer-' + j + '">' + esc(f.label) + '</label><select required data-field="' + esc(f.id) + '" id="g-answer-' + j + '"><option value="">Select a finding</option>' +
        f.options.map(o => '<option value="' + esc(o) + '">' + esc(o) + '</option>').join('') + '</select></div>').join('') +
      '<p class="g-feedback" role="status" id="g-feedback"></p><button class="g-primary" type="submit">Enter this deduction</button></form></section>';
  }

  function readItemBody(item, withTools = false) {
    const route = withTools && item.id === 'town-plan' && typeof window.mountRouteTool === 'function';
    const paper = withTools && item.id === 'wrapper' && typeof window.mountPaperTool === 'function';
    return (item.asset ? '<figure class="g-reader-figure' + (item.kind === 'map' ? ' g-map-figure' : '') + '">' + (route ? '<div class="g-route-mount"></div>' : visual(item, true)) +
      (item.caption ? '<figcaption>' + esc(item.caption) + '</figcaption>' : '') + '</figure>' : item.caption ? '<p class="g-source-line">' + esc(item.caption) + '</p>' : '') +
      '<div class="g-prose g-evidence-prose">' + paragraphs(item.body) + '</div>' + (paper ? '<div class="g-paper-mount"></div>' : '') + (item.table ? '<div class="g-table-region" role="region" aria-label="' + esc(item.title) + ' table" tabindex="0"><table><thead><tr>' +
        item.table.head.map(h => '<th scope="col">' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
        item.table.rows.map(row => '<tr>' + row.map((cell, k) => k === 0 ? '<th scope="row">' + esc(cell) + '</th>' : '<td>' + esc(cell) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' : '');
  }

  function showReader(key) {
    const item = getItem(key);
    if (!item) return;
    const [a, i] = key.split('.').map(Number);
    if (!state.seen.includes(key)) { state.seen.push(key); save(); }
    const marker = getGame().querySelector('[data-gseen="' + key + '"]');
    if (marker) marker.textContent = 'Examined';
    const items = getCase().acts[a].items;
    openDialog(modalHead('Chapter ' + (roman[a] || a + 1) + '  /  ' + (kindNames[item.kind] || 'Exhibit'), item.title) +
      (item.subtitle ? '<p class="g-reader-subtitle">' + esc(item.subtitle) + '</p>' : '') + '<div class="g-reader-content">' + readItemBody(item, true) +
      '</div><footer class="g-reader-tail">' + pinButton(key) + '<div>' + (i ? '<button class="g-secondary" data-ga="reader" data-key="' + a + '.' + (i - 1) + '">Previous exhibit</button>' : '') +
      (i < items.length - 1 ? '<button class="g-secondary" data-ga="reader" data-key="' + a + '.' + (i + 1) + '">Next exhibit</button>' : '') +
      '</div></footer><div class="g-notice" role="status" hidden></div>', 'g-reader-dialog');
    const routeSlot = dialog.querySelector('.g-route-mount');
    if (routeSlot) window.mountRouteTool(routeSlot, state);
    const paperSlot = dialog.querySelector('.g-paper-mount');
    if (paperSlot) window.mountPaperTool(paperSlot);
  }

  function showComparison() {
    const selected = state.compare.map(key => ({ key, item: getItem(key) })).filter(x => x.item);
    const content = selected.map(({ key, item }) => '<article class="g-compare-exhibit"><p class="g-label g-red">' + esc(kindNames[item.kind]) + '</p><h3>' + esc(item.title) +
      '</h3>' + (item.subtitle ? '<p class="g-reader-subtitle">' + esc(item.subtitle) + '</p>' : '') + readItemBody(item) + '<div class="g-compare-pin">' + pinButton(key) + '</div></article>').join('');
    openDialog(modalHead('The investigation desk', 'Compare exhibits') + (selected.length < 2 ? '<p class="g-comparison-help">Pin two exhibits in the evidence register to read them side by side. Pins carry across chapters.</p>' : '') +
      '<div class="g-compare-columns">' + content + '</div>', 'g-wide-dialog');
  }

  function togglePin(key) {
    if (!getItem(key)) return;
    if (state.compare.includes(key)) state.compare = state.compare.filter(k => k !== key);
    else if (state.compare.length < 2) state.compare.push(key);
    else { showNotice('Two exhibits are pinned. Unpin either one to make room.'); return; }
    save();
    for (const btn of document.querySelectorAll('[data-ga="pin"]')) {
      const on = state.compare.includes(btn.dataset.key);
      btn.setAttribute('aria-pressed', String(on));
      btn.querySelector('span').textContent = on ? 'Pinned' : 'Pin exhibit';
    }
    if (dialog?.open && dialog.classList.contains('g-wide-dialog')) showComparison();
    const button = getGame().querySelector('.g-compare-btn span');
    if (button) button.textContent = 'Compare exhibits' + (state.compare.length ? ' (' + state.compare.length + '/2)' : '');
  }

  function notebook() {
    load();
    openDialog(modalHead('Private to this device', 'Team notebook') + '<div class="g-notes"><label for="g-notes-input">Observations &amp; theories</label>' +
      '<textarea id="g-notes-input" spellcheck="true" placeholder="Set down names, contradictions and questions for your team…">' + esc(state.notes) +
      '</textarea><p id="g-note-status" role="status">' + (persistent ? 'Your notes save as you write.' : 'Device storage is unavailable. Notes last for this session.') + '</p></div>');
  }

  function ending() {
    const file = getCase();
    return '<article class="g-ending"><p class="g-label g-red">The closing entry</p><h1 id="g-heading" tabindex="-1">' + esc(file.ending.title) + '</h1><div class="g-prose">' + paragraphs(file.ending.paragraphs) +
      '</div><div class="g-end-actions"><button class="g-primary" data-ga="notebook">' + icon('notebook') + ' Team notebook</button><button class="g-secondary" data-ga="reset">Start a fresh case</button></div></article>' +
      (file.history ? '<details class="g-history"><summary>Historical notes &amp; sources</summary><div class="g-prose">' + paragraphs(file.history.notes) + '</div><ul>' +
        (file.history.sources || []).filter(s => /^https?:\/\//.test(s.url)).map(s => '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + '</a></li>').join('') + '</ul></details>' : '');
  }

  function navigate(view, i) {
    if (view === 'desk') {
      if (!Number.isInteger(i) || i < 0 || i >= getCase().acts.length || i > state.solved) return;
      state.chapter = i;
    }
    if (view === 'ending' && state.solved !== getCase().acts.length) return;
    state.view = view;
    save();
    render();
    getGame().scrollTop = 0;
    window.scrollTo(0, 0);
    focusHeading('g-heading', false);
  }

  function openInvestigation() {
    load();
    state.started = true;
    save();
    document.getElementById('title-screen').hidden = true;
    document.body.classList.add('g-playing');
    const game = getGame();
    game.hidden = false;
    navigate(state.view, state.chapter);
  }

  function submitDeduction(event) {
    if (event.target.id !== 'g-answer-form') return;
    event.preventDefault();
    const puzzle = getCase().acts[state.chapter].puzzle;
    const answers = state.drafts[state.chapter] || {};
    if (!puzzle.fields.every(f => answers[f.id] === f.answer)) {
      document.getElementById('g-feedback').textContent = 'The exhibits do not support this account. Recheck the links between your findings and try again.';
      return;
    }
    if (state.chapter === state.solved) state.solved++;
    save();
    render();
    focusHeading('g-deduction-heading');
  }

  document.addEventListener('click', event => {
    const btn = event.target.closest?.('[data-ga]');
    if (!btn || btn.disabled) return;
    const { ga, index, key } = btn.dataset;
    switch (ga) {
      case 'close': closeDialog(); break;
      case 'title': returnToTitle(); break;
      case 'intro': navigate('intro'); break;
      case 'ending': navigate('ending'); break;
      case 'chapter': navigate('desk', Number(index)); break;
      case 'reader': showReader(key); break;
      case 'pin': togglePin(key); break;
      case 'compare': showComparison(); break;
      case 'notebook': notebook(); break;
      case 'to-deduction': focusHeading('g-deduction-heading'); break;
      case 'fullscreen':
        (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => showNotice('Full screen is unavailable in this browser view.'));
        break;
      case 'audio':
        Promise.resolve(window.toggleAmbience?.()).then(() => { btn.outerHTML = soundButton(); getGame().querySelector('[data-ga="audio"]')?.focus({ preventScroll: true }); });
        break;
      case 'hint': {
        const i = state.chapter;
        state.hints[i] = Math.min((Number(state.hints[i]) || 0) + 1, getCase().acts[i].puzzle.hints.length);
        save(); render();
        const hint = getGame().querySelector('.g-hints li:last-child');
        if (hint) { hint.tabIndex = -1; hint.focus(); }
        break;
      }
      case 'reset':
        openDialog(modalHead('Replay', 'Open a fresh case?') + '<div class="g-reset"><p>This clears the team notebook, findings, hints and pins on this device.</p><div><button class="g-secondary" data-ga="close">Keep this case</button><button class="g-primary" data-ga="confirm-reset">Start again</button></div></div>');
        break;
      case 'confirm-reset':
        closeDialog(); state = defaultState(); state.started = true; navigate('intro'); break;
    }
  });

  document.addEventListener('change', event => {
    if (!event.target.matches('#g-answer-form select[data-field]')) return;
    state.drafts[state.chapter] ||= {};
    state.drafts[state.chapter][event.target.dataset.field] = event.target.value;
    save();
    document.getElementById('g-feedback').textContent = '';
  });

  document.addEventListener('input', event => {
    if (event.target.id !== 'g-notes-input') return;
    state.notes = event.target.value; save();
    document.getElementById('g-note-status').textContent = persistent ? 'Saved on this device.' : 'Device storage is unavailable. Notes last for this session.';
  });

  document.addEventListener('submit', submitDeduction);
  window.openInvestigation = openInvestigation;
  window.openNotebook = notebook;
  window.clearSavedInvestigation = () => { state = defaultState(); save(); returnToTitle(); };
  window.hasInvestigation = () => { load(); return state.started; };
})();
