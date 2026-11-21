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
    stop: '<rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none"/>',
    narrate: '<path d="M3 9h4l5-4v14l-5-4H3zM16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    speechOn: '<path d="M4 3.5h16a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-9L5 21v-3.5H4A1.5 1.5 0 0 1 2.5 16V5A1.5 1.5 0 0 1 4 3.5z"/><path d="M7 9v3m3.3-5v7m3.4-6v4.5M17 9.5v2"/>',
    speechOff: '<path d="M9 3.5h11A1.5 1.5 0 0 1 21.5 5v10M3 5v11a1.5 1.5 0 0 0 1.5 1.5H5V21l6-3.5h4.5M7 10v2m3.3.5V14M17 9.5v2M2.5 2.5l19 19" />',
    mute: '<path d="M3 9h4l5-5v16l-5-5H3zM16 9l5 6m0-6-5 6"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="1"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
    close: '<path d="m5 5 14 14M19 5 5 19"/>',
    check: '<path d="m4 12 5 5 11-11"/>',
    left: '<path d="m15 5-7 7 7 7"/>',
    right: '<path d="m9 5 7 7-7 7"/>',
    pin: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    pen: '<path d="m4 16 12-12 4 4L8 20l-5 1zM14 6l4 4"/>',
    book: '<path d="M12 6Q7 3 2 5v14q5-2 10 1 5-3 10-1V5q-5-2-10 1v14"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="2.5"/>',
    gate: '<path d="M2 5q10 3 20 0M3 10h18M7 7 6 21m11-14 1 14M12 7v3"/>'
  };
  const kindNames = { document: 'Document', map: 'Map', object: 'Object', witness: 'Testimony' };
  const esc = (value = '') => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const icon = name => '<svg viewBox="0 0 24 24" class="g-icon" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">' + (icons[name] || '') + '</svg>';
  const paragraphs = lines => (Array.isArray(lines) ? lines : [lines]).filter(Boolean).map(line => '<p>' + esc(line) + '</p>').join('');
  const getCase = () => window.CASEFILE;
  const getGame = () => document.getElementById('game');
  const defaultState = () => ({
    started: false, view: 'desk', chapter: 0, solved: 0, notes: '',
    seen: [], compare: [], hints: {}, drafts: {}, briefed: [], witnessPages: {}
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
      if (saved.view === 'intro') state.chapter = 0;
      if (saved.view === 'ending' && state.solved === count) state.chapter = count - 1;
      state.notes = typeof saved.notes === 'string' ? saved.notes : '';
      state.seen = Array.isArray(saved.seen) ? [...new Set(saved.seen.filter(k => getItem(k)))] : [];
      state.compare = Array.isArray(saved.compare) ? [...new Set(saved.compare.filter(k => getItem(k)))].slice(0, 2) : [];
      for (const k of ['drafts', 'hints']) {
        if (saved[k] && typeof saved[k] === 'object' && !Array.isArray(saved[k])) state[k] = saved[k];
      }
      for (const [key, page] of Object.entries(saved.witnessPages || {})) {
        const item = getItem(key);
        if (item?.kind === 'witness' && !state.seen.includes(key) && Number.isInteger(page) && page >= 0 && page < item.body.length - 1) {
          state.witnessPages[key] = page;
        }
      }
      if (Array.isArray(saved.briefed)) {
        state.briefed = [...new Set(saved.briefed.filter(i => Number.isInteger(i) && i >= 0 && i < count && i <= state.solved))];
      } else {
        // The previous edition created a save on arrival, before a player took any action.
        const hasPicks = Object.values(state.drafts).some(fields => fields && Object.values(fields).some(v => typeof v === 'string' && v.trim()));
        const hasProgress = state.chapter > 0 || state.solved > 0 || state.seen.length || state.compare.length || state.notes.trim() ||
          Object.values(state.hints).some(n => Number(n) > 0) || hasPicks;
        if (hasProgress) state.briefed = getCase().acts.map((_, i) => i).filter(i => i <= state.solved);
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
    if (typeof key !== 'string' || !/^\d+\.\d+$/.test(key)) return null;
    const [a, i] = key.split('.').map(Number);
    if (!Number.isInteger(a) || a > state.solved || a < 0 || !Number.isInteger(i) || i < 0) return null;
    return getCase()?.acts?.[a]?.items?.[i];
  }

  const chapterNumber = n => roman[n] || n + 1;
  const act = () => getCase().acts[state.chapter];
  const chapterLabel = n => 'Chapter ' + chapterNumber(n);
  let bookChapter = 0;
  let resizeObserver;
  let frameRequest;
  let sceneGeneration = 0;

  function smallButton(action, label, name, extra = '') {
    return '<button type="button" class="scene-icon" data-ga="' + action + '" title="' + esc(label) + '" aria-label="' + esc(label) + '" ' + extra + '>' + icon(name) + '</button>';
  }

  function soundInfo() {
    const on = Boolean(window.ambienceOn?.());
    return { label: on ? 'Mute rain' : 'Play rain', name: on ? 'volume' : 'mute', on };
  }

  function voiceHud() {
    const enabled = Boolean(window.gameVoice?.enabled());
    const title = enabled ? 'Mute spoken narration' : 'Enable spoken narration';
    return smallButton('voice-toggle', title, enabled ? 'speechOn' : 'speechOff', 'aria-pressed="' + enabled + '"');
  }

  function syncSound() {
    const s = soundInfo();
    for (const button of document.querySelectorAll('[data-ga="audio"]')) {
      button.title = s.label;
      button.setAttribute('aria-label', s.label);
      button.setAttribute('aria-pressed', String(s.on));
      button.innerHTML = icon(s.name) + (button.closest('.menu-actions') ? '<span>' + s.label + '</span>' : '');
    }
  }

  let voiceContext = null;
  let panelActive = false;
  let pendingClip = null;
  let voiceRequest = 0;

  function voiceButton(id, subject, objective = false) {
    const title = 'Listen to ' + subject;
    return '<button type="button" class="voice-play' + (objective ? ' voice-objective' : '') + '" data-ga="voice-play" data-voice="' + esc(id) +
      '" data-subject="' + esc(subject) + '" title="' + esc(title) + '" aria-label="' + esc(title) + '" aria-pressed="false">' +
      icon('narrate') + (objective ? '' : '<span>Listen</span>') + '</button>';
  }

  function syncVoice() {
    const voice = window.gameVoice;
    const playing = pendingClip || voice?.current() || null;
    for (const button of document.querySelectorAll('[data-ga="voice-play"]')) {
      const on = button.dataset.voice === playing;
      const title = (on ? 'Stop reading ' : 'Listen to ') + button.dataset.subject;
      button.title = title;
      button.setAttribute('aria-label', title);
      button.setAttribute('aria-pressed', String(on));
      button.classList.toggle('is-speaking', on);
      button.innerHTML = icon(on ? 'stop' : 'narrate') + (button.classList.contains('voice-objective') ? '' : '<span>' + (on ? 'Stop' : 'Listen') + '</span>');
    }
    const on = Boolean(voice?.enabled());
    const hud = getGame()?.querySelector('.scene-actions [data-ga="voice-toggle"]');
    if (hud) {
      const label = on ? 'Mute spoken narration' : 'Enable spoken narration';
      hud.title = label;
      hud.setAttribute('aria-label', label);
      hud.setAttribute('aria-pressed', String(on));
      hud.innerHTML = icon(on ? 'speechOn' : 'speechOff');
    }
    const setting = dialog?.querySelector('[data-ga="voice-toggle"]');
    if (setting) {
      setting.setAttribute('aria-pressed', String(on));
      setting.querySelector('.voice-setting').textContent = on ? 'On' : 'Off';
    }
  }

  function stopVoice() {
    voiceRequest++;
    pendingClip = null;
    window.gameVoice?.stop();
    syncVoice();
  }

  async function playVoice(manual) {
    const id = voiceContext;
    if (!id) return;
    const request = ++voiceRequest;
    pendingClip = id;
    syncVoice();
    let started = false;
    try {
      started = await window.gameVoice?.play(id);
    } catch { /* An unavailable recording leaves the caption on screen. */ }
    if (request !== voiceRequest) return;
    pendingClip = null;
    syncVoice();
    if (!started && manual) notify('The recording could not play. Select Listen to try again.');
  }

  function setVoiceContext(id, automatic = true) {
    if (id === voiceContext) { syncVoice(); return; }
    stopVoice();
    voiceContext = id;
    if (id && automatic && window.gameVoice?.enabled()) playVoice(false);
  }

  function objectiveId() { return 'objective-' + (state.chapter + 1); }

  function syncFullscreen() {
    const active = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    const label = active ? 'Leave full screen' : 'Enter full screen';
    for (const button of document.querySelectorAll('[data-ga="fullscreen"]')) {
      button.title = label;
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(active));
      if (button.closest('.menu-actions')) button.querySelector('span').textContent = label;
    }
  }

  async function fullscreen() {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        const root = document.documentElement;
        await (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
      }
    } catch { notify('Full screen is unavailable in this browser view.'); }
  }

  function leavePanel() {
    if (!panelActive) return;
    panelActive = false;
    stopVoice();
    voiceContext = objectiveId();
  }

  function initDialog() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'g-dialog';
    dialog.setAttribute('aria-labelledby', 'g-modal-title');
    document.body.append(dialog);
    dialog.addEventListener('close', () => {
      if (dialog.open) return;
      leavePanel();
      document.body.classList.remove('g-modal-open');
      if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
    });
    dialog.addEventListener('cancel', leavePanel);
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog();
    });
  }

  function openPanel(type, label, title, content, voiceId = null, automatic = true) {
    initDialog();
    panelActive = true;
    if (!dialog.open) lastFocus = document.activeElement;
    dialog.className = 'g-dialog ' + type;
    dialog.innerHTML = '<div class="g-modal-shell"><header class="g-modal-head"><div><p class="g-label">' + esc(label) +
      '</p><h2 id="g-modal-title" tabindex="-1">' + esc(title) + '</h2></div><button type="button" class="g-icon-button g-close" data-ga="close" aria-label="Close panel">' +
      icon('close') + '</button></header>' + content + '<p role="status" class="g-notice" hidden></p></div>';
    if (!dialog.open) { dialog.showModal(); document.body.classList.add('g-modal-open'); }
    dialog.scrollTop = 0;
    dialog.querySelector('#g-modal-title').focus({ preventScroll: true });
    setVoiceContext(voiceId, automatic);
  }

  function closeDialog() {
    if (dialog?.open) {
      leavePanel();
      dialog.close();
    }
  }

  function notify(message) {
    const el = (dialog?.open ? dialog : getGame()).querySelector('.g-notice');
    if (!el) return;
    clearTimeout(noticeTimer);
    el.hidden = false;
    el.textContent = message;
    noticeTimer = setTimeout(() => { el.hidden = true; }, 3800);
  }

  function adjustScene(center = false) {
    const pan = getGame().querySelector('.scene-pan');
    const world = pan?.firstElementChild;
    if (!world || !pan.clientWidth || !world.clientWidth) return;
    const travel = Math.max(0, pan.scrollWidth - pan.clientWidth);
    if (center) {
      pan.scrollLeft = travel / 2;
      pan.scrollTop = Math.max(0, (pan.scrollHeight - pan.clientHeight) / 2);
    }
    const canPan = travel > 60;
    const stage = pan.parentElement;
    stage.classList.toggle('can-pan', canPan);
    const prev = stage.querySelector('.pan-left'), next = stage.querySelector('.pan-right');
    prev.hidden = next.hidden = !canPan;
    prev.disabled = pan.scrollLeft < 2;
    next.disabled = travel - pan.scrollLeft < 2;
    const frame = pan.getBoundingClientRect();
    const plane = world.getBoundingClientRect();
    const clamp = (n, low, high) => Math.min(high, Math.max(low, n));
    for (const point of world.querySelectorAll('.hotspot')) {
      const y = Number(point.dataset.y);
      // Keep distant table edges reachable when a wide screen crops the top and bottom.
      const lowerMargin = Math.min(76, frame.height * .14);
      const top = clamp(y, 100 * (frame.top - plane.top + 26) / plane.height, 100 * (frame.bottom - plane.top - lowerMargin) / plane.height);
      point.style.top = top + '%';
    }
  }

  function scheduleFit() {
    cancelAnimationFrame(frameRequest);
    frameRequest = requestAnimationFrame(() => adjustScene(true));
  }

  function renderScene() {
    const scene = window.SCENES[state.chapter];
    const chapter = act();
    const ratio = Number(scene.width) / Number(scene.height);
    const seenCount = chapter.items.filter((_, i) => state.seen.includes(state.chapter + '.' + i)).length;
    const buttons = scene.spots.map(spot => {
      const i = chapter.items.findIndex(item => item.id === spot.id);
      if (i < 0) return '';
      const item = chapter.items[i], key = state.chapter + '.' + i;
      const seen = state.seen.includes(key), partial = key in state.witnessPages;
      return '<button type="button" class="hotspot' + (seen ? ' is-seen' : partial ? ' is-partial' : '') + (spot.x > 73 ? ' is-right' : '') +
        '" data-ga="reader" data-key="' + key + '" data-x="' + spot.x + '" data-y="' + spot.y + '" style="left:' + spot.x + '%;top:' + spot.y + '%" aria-label="' +
        esc(spot.label || item.title) + ', ' + esc(kindNames[item.kind]) + (seen ? ', examined' : partial ? ', in progress' : '') + '"><span class="hotspot-dot">' + icon(item.kind) +
        '</span><span class="hotspot-label">' + esc(spot.label || item.title) + '</span></button>';
    }).join('');
    const marks = chapter.items.map((_, i) => '<i' + (state.seen.includes(state.chapter + '.' + i) ? ' class="is-seen"' : (state.chapter + '.' + i) in state.witnessPages ? ' class="is-partial"' : '') + '></i>').join('');
    const t = (a, name, label, extra = '') => '<button type="button" class="dock-button ' + extra + '" data-ga="' + a + '">' + icon(name) + '<span>' + esc(label) + '</span></button>';
    const done = state.chapter < state.solved;
    const last = done && state.chapter === getCase().acts.length - 1;
    getGame().innerHTML = '<section class="scene-stage" aria-labelledby="scene-title"><div class="scene-pan"><div class="scene-world" style="--art-ratio:' +
      scene.width + '/' + scene.height + ';--image-ratio:' + ratio + ';aspect-ratio:' + scene.width + '/' + scene.height + '"><img class="scene-art" src="' +
      esc(scene.image) + '" width="' + scene.width + '" height="' + scene.height + '" alt="' + esc(scene.place) + '" draggable="false" fetchpriority="high">' + buttons +
      '</div></div><div class="scene-shade" aria-hidden="true"></div>' +
      '<button type="button" class="pan-control pan-left" data-ga="pan-left" aria-label="Look left" hidden>' + icon('left') + '</button>' +
      '<button type="button" class="pan-control pan-right" data-ga="pan-right" aria-label="Look right" hidden>' + icon('right') + '</button>' +
      '<header class="scene-top"><div class="scene-heading"><p class="scene-chapter">Tsujigiri <span aria-hidden="true">／</span> ' +
      chapterLabel(state.chapter) + '</p><h1 id="scene-title" class="scene-place" tabindex="-1">' + esc(scene.place) + '</h1><div class="scene-objective"><p class="scene-lead">' + esc(scene.lead) +
      '</p>' + voiceButton(objectiveId(), 'the scene objective', true) + '</div></div><div class="scene-actions"><button type="button" class="scene-guide" data-ga="guide">' + icon('book') + '<span>Field guide</span></button>' + voiceHud() + smallButton('fullscreen', 'Enter full screen', 'expand') + smallButton('menu', 'Pause menu', 'pause') +
      '</div></header><footer class="scene-bottom"><div class="scene-progress"><span class="progress-marks" aria-hidden="true">' + marks + '</span>' +
      '<span class="progress-count" role="status">' + seenCount + ' / ' + chapter.items.length + ' examined</span><span class="scene-tip"' + (seenCount || chapter.items.some((_, i) => (state.chapter + '.' + i) in state.witnessPages) ? ' hidden' : '') +
      '><span class="tip-point">Select a marker to examine it.</span><span class="tip-pan">Swipe to explore.</span></span></div><div class="scene-dock">' + t('casebook','book','Casebook') +
      t('notebook','notebook','Notebook') + t(last ? 'ending' : 'finding','pen',last ? 'Closing entry' : done ? 'Read finding' : 'Make finding','dock-primary') +
      '</div></footer><p class="g-notice" role="status" hidden></p></section>';
    syncFullscreen();
    const pan = getGame().querySelector('.scene-pan');
    pan.addEventListener('scroll', () => adjustScene(), {passive: true});
    if (window.ResizeObserver) {
      resizeObserver?.disconnect();
      resizeObserver = new ResizeObserver(scheduleFit);
      resizeObserver.observe(pan);
    }
    const generation = ++sceneGeneration;
    getGame().querySelector('.scene-art').addEventListener('load', () => { if (generation === sceneGeneration) adjustScene(true); }, { once: true });
    scheduleFit();
  }

  function enterScene(i, automatic = true) {
    if (!Number.isInteger(i) || i < 0 || i > state.solved || i >= getCase().acts.length) return;
    closeDialog();
    setVoiceContext(null, false);
    lastFocus = null;
    state.chapter = i;
    state.started = true;
    state.view = 'desk';
    bookChapter = i;
    const firstVisit = !state.briefed.includes(i);
    if (firstVisit) state.briefed.push(i);
    save();
    renderScene();
    getGame().querySelector('#scene-title').focus({ preventScroll:true });
    if (firstVisit) briefing(i, automatic);
    else setVoiceContext(objectiveId(), automatic);
    if (!persistent) notify('Device storage is unavailable. This case lasts for this session.');
  }

  function openInvestigation() {
    load();
    document.body.classList.add('g-playing');
    getGame().hidden = false;
    enterScene(state.chapter, false);
  }

  function pinButton(key) {
    const on = state.compare.includes(key);
    return '<button type="button" class="g-pin" data-ga="pin" data-key="' + key + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Unpin ' : 'Pin ') +
      esc(getItem(key).title) + '">' + icon('pin') + '<span>' + (on ? 'Pinned' : 'Pin') + '</span></button>';
  }

  function compareButton() {
    return '<button type="button" class="g-secondary g-compare-btn" data-ga="compare">' + icon('compare') + '<span>Compare' +
      (state.compare.length ? ' (' + state.compare.length + '/2)' : ' exhibits') + '</span></button>';
  }

  function showBook(index = state.chapter) {
    if (!Number.isInteger(index) || index < 0 || index > state.solved || index >= getCase().acts.length) return;
    bookChapter = index;
    const cur = getCase().acts[index];
    const tabs = getCase().acts.map((_, i) => '<button type="button" data-ga="book-tab" data-index="' + i + '" ' + (i === index ? 'aria-current="page" ' : '') +
      (i > state.solved ? 'disabled aria-label="' + chapterLabel(i) + ', sealed"' : '') + '>' + (i > state.solved ? icon('lock') : '') + chapterLabel(i) + '</button>').join('');
    const rows = cur.items.map((item, i) => {
      const key = index + '.' + i;
      return '<div class="book-row"><button class="book-item" type="button" data-ga="reader" data-key="' + key + '">' + icon(item.kind) +
        '<span><strong>' + esc(item.title) + '</strong><small>' + esc(kindNames[item.kind]) + ' · ' + (state.seen.includes(key) ? 'Examined' : key in state.witnessPages ? 'In progress' : 'Unexamined') +
        '</small></span></button>' + pinButton(key) + '</div>';
    }).join('');
    openPanel('g-casebook-dialog','Kageura archive','Casebook','<nav class="book-tabs" aria-label="Chapter register">' + tabs + '</nav><section class="book-page"><h3>' +
      esc(cur.title) + '</h3><p>' + esc(cur.brief) + '</p><div class="book-list">' + rows + '</div>' +
      '<details class="book-record"><summary>Case record</summary><div class="g-prose">' + (index === 0 ? paragraphs(getCase().intro) : '') + paragraphs(cur.event) +
      (index < state.solved ? paragraphs(cur.puzzle.success) + '<button type="button" class="g-secondary" data-ga="finding-record" data-index="' + index + '">Read the recorded finding</button>' : '') + '</div></details></section><footer class="book-footer">' + assignmentLink(index) + compareButton() +
      (index !== state.chapter ? '<button class="g-primary" type="button" data-ga="chapter" data-index="' + index + '">Visit this scene</button>' :
        '<button class="g-secondary" type="button" data-ga="close">Return to scene</button>') + '</footer>');
  }

  function recordExamination(key, page = 0) {
    if (state.seen.includes(key)) return;
    const item = getItem(key);
    const partial = item.kind === 'witness' && page < item.body.length - 1;
    if (partial) state.witnessPages[key] = Math.max(state.witnessPages[key] || 0, page);
    else {
      state.seen.push(key);
      delete state.witnessPages[key];
    }
    save();
    const [a, i] = key.split('.').map(Number);
    if (a !== state.chapter) return;
    const game = getGame();
    const point = game.querySelector('.hotspot[data-key="' + key + '"]');
    const mark = game.querySelectorAll('.progress-marks i')[i];
    for (const el of [point, mark]) {
      el?.classList.toggle('is-partial', partial);
      el?.classList.toggle('is-seen', !partial);
    }
    if (point) point.setAttribute('aria-label', point.querySelector('.hotspot-label').textContent + ', ' + kindNames[item.kind] + (partial ? ', in progress' : ', examined'));
    const n = act().items.filter((_, j) => state.seen.includes(a + '.' + j)).length;
    game.querySelector('.progress-count').textContent = n + ' / ' + act().items.length + ' examined';
    game.querySelector('.scene-tip').hidden = true;
  }

  function examNote(item) {
    return '<dl class="exam-note"><div><dt>Why it matters</dt><dd>' + esc(item.exam.purpose) +
      '</dd></div><div><dt>What to look for</dt><dd>' + esc(item.exam.action) + '</dd></div></dl>';
  }

  function table(item) {
    if (!item.table) return '';
    return '<div class="g-table-region" role="region" aria-label="' + esc(item.title) + ' table" tabindex="0"><table><thead><tr>' +
      item.table.head.map(h => '<th scope="col">' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' + item.table.rows.map(row => '<tr>' +
        row.map((cell, i) => i === 0 ? '<th scope="row">' + esc(cell) + '</th>' : '<td>' + esc(cell) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  }

  function readBody(item, tools = false) {
    const route = tools && item.id === 'town-plan' && window.mountRouteTool;
    const paper = tools && (item.id === 'wrapper' || item.id === 'counterfoils') && window.mountPaperTool;
    let figure = '';
    if (item.asset) {
      figure = '<figure class="g-reader-figure' + (item.kind === 'map' ? ' g-map-figure' : '') + '">' + (route ? '<div class="g-route-mount"></div>' :
        '<img src="' + esc(item.asset) + '" alt="' + (item.kind === 'map' ? esc(item.caption) : '') + '">') + (item.caption ? '<figcaption>' + esc(item.caption) + '</figcaption>' : '') + '</figure>';
    }
    const caption = !item.asset && item.caption ? '<p class="g-source-line">' + esc(item.caption) + '</p>' : '';
    return examNote(item) + caption + figure + '<div class="g-prose g-evidence-prose">' + paragraphs(item.body) + '</div>' + table(item) + (paper ? '<div class="g-paper-mount"></div>' : '');
  }

  function mountExhibitTools() {
    for (const slot of dialog.querySelectorAll('.g-route-mount')) window.mountRouteTool(slot, state);
    for (const slot of dialog.querySelectorAll('.g-paper-mount')) window.mountPaperTool(slot);
  }

  function pager(action, page, length, key = '') {
    const nav = (j, label) => '<button type="button" class="g-secondary" data-ga="' + action + '" data-page="' + j + '" data-key="' + key + '">' + label + '</button>';
    return '<div class="g-pager"><span>' + (page + 1) + ' / ' + length + '</span>' + (page ? nav(page-1, 'Previous') : '') +
      (page < length-1 ? nav(page+1,'Continue') : '<button type="button" class="g-primary" data-ga="close">Return to scene</button>') + '</div>';
  }

  function showReader(key, page) {
    const item = getItem(key);
    if (!item) return;
    const j = Math.max(0, Math.min(item.body.length - 1, page ?? state.witnessPages[key] ?? 0));
    recordExamination(key, j);
    const index = Number(key.split('.')[0]);
    const tail = '<footer class="g-reader-tail">' + pinButton(key) +
      '<button type="button" class="g-secondary" data-ga="book-tab" data-index="' + index + '">' + icon('book') + ' Casebook</button></footer>';
    if (item.kind === 'witness') {
      const voiceId = item.id + '-' + (j + 1);
      openPanel('g-witness-dialog', chapterLabel(index) + ' · Witness', item.title,
        examNote(item) + '<div class="witness-scene">' + (item.asset ? '<img class="witness-portrait" src="' + esc(item.asset) + '" alt="">' : '') +
        '<div class="witness-speech"><p class="g-label">' + esc(item.subtitle) + '</p><blockquote class="witness-line" aria-live="polite">' + esc(item.body[j]) + '</blockquote>' +
        voiceButton(voiceId,'this witness statement') + pager('speech',j,item.body.length,key) + '</div></div>' + tail, voiceId);
    } else {
      openPanel('g-reader-dialog g-kind-' + item.kind,chapterLabel(index) + ' · ' + (kindNames[item.kind] || 'Exhibit'),item.title,
        '<p class="g-reader-subtitle">' + esc(item.subtitle) + '</p><div class="g-reader-content">' + readBody(item,true) + '</div>' + tail);
      mountExhibitTools();
    }
  }

  function showComparison() {
    // Both related paper records use the same physical tray when pinned together.
    const trayKey = state.compare.find(key => getItem(key).id === 'wrapper') || state.compare.find(key => getItem(key).id === 'counterfoils');
    const exhibits = state.compare.map(key => {
      const item = getItem(key);
      return '<article class="g-compare-exhibit"><p class="g-label">' + esc(kindNames[item.kind]) + '</p><h3>' + esc(item.title) + '</h3>' + readBody(item, key === trayKey || item.id === 'town-plan') + pinButton(key) + '</article>';
    }).join('');
    openPanel('g-wide-dialog', 'Casebook', 'Compare exhibits', (state.compare.length < 2 ? '<p class="g-comparison-help">Pin two records in your casebook to compare them here.</p>' : '') +
      '<div class="g-compare-columns">' + exhibits + '</div><footer class="book-footer"><button type="button" class="g-secondary" data-ga="book-tab" data-index="' +
      bookChapter + '">Return to casebook</button></footer>');
    mountExhibitTools();
  }

  function togglePin(key) {
    if (!getItem(key)) return;
    if (state.compare.includes(key)) state.compare = state.compare.filter(k => k !== key);
    else if (state.compare.length < 2) state.compare.push(key);
    else { notify('Two records are pinned. Unpin one to make room.'); return; }
    save();
    if (dialog.classList.contains('g-wide-dialog')) { showComparison(); return; }
    const old = dialog.querySelector('[data-ga="pin"][data-key="' + key + '"]');
    const restore = old === document.activeElement;
    if (old) old.outerHTML = pinButton(key);
    if (restore) dialog.querySelector('[data-ga="pin"][data-key="' + key + '"]').focus({ preventScroll: true });
    const compare = dialog.querySelector('.g-compare-btn');
    if (compare) compare.outerHTML = compareButton();
  }

  function notebook() {
    load();
    openPanel('g-notebook-dialog','Shared notes','Team notebook','<div class="g-notes"><label for="g-notes-input">Observations &amp; theories</label><textarea id="g-notes-input" placeholder="What did you notice, and which exhibit supports it?">' +
      esc(state.notes) + '</textarea><p id="g-note-status" role="status">' + (persistent ? 'Saved as you write on this device.' : 'Storage unavailable. Notes last for this session.') + '</p></div>');
  }

  function recordedFinding(i) {
    if (!Number.isInteger(i) || i < 0 || i >= state.solved) return;
    const p = getCase().acts[i].puzzle;
    const last = i === getCase().acts.length-1;
    const voiceId = 'finding-' + (i + 1);
    openPanel('g-finding-dialog',chapterLabel(i) + ' · Finding entered',p.title,'<section class="g-finding"><div class="g-prose">' + paragraphs(p.success) +
      '</div>' + voiceButton(voiceId,'this finding') + '<button type="button" class="g-primary" data-ga="' + (last ? 'ending' : 'chapter') + '" data-index="' + (i+1) + '">' +
      (last ? 'Read closing entry' : 'Enter ' + chapterLabel(i+1)) + '</button></section>', voiceId);
  }

  function showFinding() {
    const p = act().puzzle, i = state.chapter;
    if (i < state.solved) { recordedFinding(i); return; }
    const shown = Math.max(0, Math.min(p.hints.length, Number(state.hints[i]) || 0));
    const hints = '<div class="g-hints">' + (shown ? '<ol>' + p.hints.slice(0,shown).map(h => '<li>' + esc(h) + '</li>').join('') + '</ol>' : '') +
      (shown < p.hints.length ? '<button class="g-text-button" type="button" data-ga="hint">' + (shown ? 'Reveal next hint' : 'Reveal a hint') + '</button>' : '') + '</div>';
    openPanel('g-finding-dialog',chapterLabel(i) + ' · Joint finding',p.title,'<p class="g-finding-prompt">' + esc(act().assignment.question) + '</p>' +
      assignmentBlock(act().assignment, false) + assignmentLink(i) + '<form id="g-answer-form" class="g-fields" novalidate>' +
      p.fields.map((f,j) => '<div><label for="g-answer-' + j + '">' + esc(f.label) + '</label><select id="g-answer-' + j + '" data-field="' + esc(f.id) + '" required><option value="">Choose a finding</option>' +
        f.options.map(o => '<option value="' + esc(o) + '">' + esc(o) + '</option>').join('') + '</select></div>').join('') +
      '<p id="g-feedback" class="g-feedback" role="status"></p><button type="button" class="g-secondary review-evidence" data-ga="book-tab" data-index="' + i + '" hidden>Review the evidence</button>' +
      '<button class="g-primary" type="submit">Enter finding</button></form>' + hints);
    for (const field of dialog.querySelectorAll('select[data-field]')) field.value = state.drafts[i]?.[field.dataset.field] || '';
  }

  function submitFinding(event) {
    const form = event.target;
    if (form.id !== 'g-answer-form') return;
    event.preventDefault();
    if (state.chapter !== state.solved) return;
    const inputs = [...form.querySelectorAll('select[data-field]')];
    const empty = inputs.find(input => !input.value);
    const message = form.querySelector('.g-feedback');
    if (empty) {
      message.textContent = 'Choose a response for each part of the finding.';
      empty.focus(); return;
    }
    const values = Object.fromEntries(inputs.map(f => [f.dataset.field, f.value]));
    state.drafts[state.chapter] = values;
    if (!act().puzzle.fields.every(f => values[f.id] === f.answer)) {
      save();
      message.textContent = 'The evidence does not support that account. Your choices are saved while you check the exhibits.';
      form.querySelector('.review-evidence').hidden = false;
      return;
    }
    state.solved++;
    save();
    // Keep the illustrated scene and its scroll position behind the finding.
    const dock = getGame().querySelector('.dock-primary');
    const last = state.chapter === getCase().acts.length-1;
    dock.dataset.ga = last ? 'ending' : 'finding';
    dock.querySelector('span').textContent = last ? 'Closing entry' : 'Read finding';
    showFinding();
  }

  function showEnding(page = 0) {
    if (state.solved !== getCase().acts.length) return;
    const end = getCase().ending;
    const j = Math.min(end.paragraphs.length - 1, Math.max(0,page));
    const voiceId = 'epilogue-' + (j + 1);
    state.view = 'ending'; save();
    openPanel('g-ending-dialog','The closing entry',end.title,'<div class="g-ending"><div class="g-prose">' + paragraphs(end.paragraphs[j]) + '</div>' +
      voiceButton(voiceId,'this closing entry') + pager('ending',j,end.paragraphs.length) + (j === end.paragraphs.length - 1 ? '<div class="g-end-actions"><button type="button" class="g-secondary" data-ga="history">Historical notes</button>' +
        '<button type="button" class="g-secondary" data-ga="reset">Start fresh</button></div>' : '') + '</div>', voiceId);
  }

  function prologue(page = 0) {
    const lines = getCase().intro;
    const j = Math.max(0, Math.min(page, lines.length - 1));
    const voiceId = 'prologue-' + (j + 1);
    const startSilentLine = voiceContext === voiceId && window.gameVoice?.enabled() && !pendingClip && !window.gameVoice.current();
    openPanel('g-ending-dialog g-prologue-dialog','The Kageura Crossing','Opening story','<div class="g-ending"><div class="g-prose">' +
      paragraphs(lines[j]) + '</div>' + voiceButton(voiceId,'this opening passage') + pager('prologue',j,lines.length) + '</div>', voiceId);
    if (startSilentLine) playVoice(false);
  }

  function history() {
    const h = getCase().history;
    openPanel('g-history-dialog','Kageura archive','Historical notes','<div class="g-prose">' + paragraphs(h.notes) + '</div><ul class="g-sources">' +
      h.sources.filter(s => /^https?:\/\//.test(s.url)).map(s => '<li><a target="_blank" rel="noopener noreferrer" href="' + esc(s.url) + '">' + esc(s.title) + '</a></li>').join('') + '</ul>' +
      '<p class="voice-credit">Spoken narration was generated with Kokoro-82M. <a href="https://huggingface.co/hexgrad/Kokoro-82M#creative-commons-attribution" target="_blank" rel="noopener noreferrer">Model training credits</a></p>');
  }

  function menu() {
    const s = soundInfo();
    openPanel('g-menu-dialog','Tsujigiri','Pause menu','<div class="menu-actions"><button class="g-primary" type="button" data-ga="close">Return to scene</button>' +
      '<button type="button" class="menu-voice g-secondary" data-ga="voice-toggle" aria-pressed="false">' + icon('narrate') +
      '<span>Spoken narration</span><strong class="voice-setting">Off</strong></button>' +
      '<button type="button" class="g-secondary" data-ga="prologue">' + icon('book') + ' Opening story</button>' +
      '<button type="button" class="g-secondary" data-ga="guide">' + icon('book') + ' How to play</button>' +
      '<button type="button" class="g-secondary" data-ga="audio">' + icon(s.name) + '<span>' + s.label + '</span></button>' +
      '<button type="button" class="g-secondary" data-ga="fullscreen">' + icon('expand') + '<span>Enter full screen</span></button>' +
      '<label class="menu-theme" for="game-theme">Appearance<select id="game-theme"><option value="system">Device setting</option><option value="light">Lantern light</option><option value="dark">Night ink</option></select></label>' +
      '<button class="g-secondary" type="button" data-ga="history">Historical notes</button><button class="g-secondary" type="button" data-ga="reset">Start fresh</button></div>');
    dialog.querySelector('#game-theme').value = window.sceneTheme?.() || 'system';
    syncSound(); syncFullscreen(); syncVoice();
  }

  function assignmentLink(index) {
    return '<button type="button" class="g-secondary assignment-link" data-ga="assignment" data-index="' + index + '">' + icon('book') + ' Chapter assignment</button>';
  }

  function assignmentBlock(task, withQuestion = true) {
    return '<section class="assignment-block" aria-label="Chapter assignment">' +
      (withQuestion ? '<p class="assignment-question">' + esc(task.question) + '</p>' : '') +
      '<p class="assignment-method"><strong>How to check</strong> <span>' + esc(task.approach) + '</span></p>' +
      '<p class="assignment-first"><strong>First lead</strong> <span>' + esc(task.firstLook) + '</span></p></section>';
  }

  function briefing(index = state.chapter, automatic = true) {
    if (!Number.isInteger(index) || index < 0 || index > state.solved || index >= getCase().acts.length) return;
    if (!state.briefed.includes(index)) {
      state.briefed.push(index);
      save();
    }
    const cur = getCase().acts[index];
    const opening = index === 0;
    const file = getCase();
    const voice = opening ? 'prologue-1' : 'objective-' + (index + 1);
    const body = '<article class="brief-note"><p class="brief-setting">' + esc(opening ? file.setting : window.SCENES[index].place) +
      '</p><div class="brief-lore g-prose">' + paragraphs(opening ? file.intro[0] : window.SCENES[index].lead) +
      (opening ? voiceButton(voice,'the opening passage') + '<p>Six weeks ago, another traveler survived an attack on this road. At dawn, a rider will take your account to the district office.</p>' : '') + '</div>' +
      assignmentBlock(cur.assignment) + '</article><footer class="brief-actions">' +
      (index === state.chapter ? '<button type="button" class="g-primary" data-ga="close">' + (opening ? 'Start investigating' : 'Explore the scene') + '</button>' :
        '<button type="button" class="g-primary" data-ga="chapter" data-index="' + index + '">Visit this scene</button>') +
      '<button type="button" class="g-secondary" data-ga="guide" data-page="play">How to play</button>' +
      (opening ? '<button type="button" class="g-secondary" data-ga="prologue">Opening story</button>' :
        voiceButton(voice, 'the scene objective')) + '</footer>';
    openPanel('g-briefing-dialog',chapterLabel(index) + ' · The headman’s request',opening ? 'A death at the crossing' : cur.title,body,voice,automatic);
  }

  function guide(page = 'case') {
    if (!['case','play','lead'].includes(page)) page = 'case';
    const file = getCase();
    const tabs = [['case','The case'],['play','How to play'],['lead','Current lead']].map(([id,label]) =>
      '<button type="button" data-ga="guide" data-page="' + id + '"' + (page === id ? ' aria-current="page"' : '') + '>' + label + '</button>').join('');
    let body;
    if (page === 'case') {
      body = '<h3>' + esc(file.subtitle) + '</h3><p class="brief-setting">' + esc(file.setting) + '</p><div class="g-prose">' + paragraphs(file.intro) +
        '</div><button type="button" class="g-secondary" data-ga="prologue">' + icon('narrate') + ' Opening story</button>';
    } else if (page === 'lead') {
      body = '<h3>' + esc(act().title) + '</h3>' + assignmentBlock(act().assignment);
    } else {
      body = '<h3>Work the scene together</h3><ol class="guide-steps">' +
        '<li><strong>Examine a person or object.</strong> Select a marker in the room. Continue through a witness’s last line. Swipe or use the side controls to look around.</li>' +
        '<li><strong>Compare accounts.</strong> Open the casebook and pin two records. Use Compare to trace a route or set two pieces of evidence side by side. Record your theory in the notebook.</li>' +
        '<li><strong>Agree on a finding.</strong> Select Make finding and enter what the exhibits support. You can revise an answer or reveal a hint. A supported finding opens the next chapter.</li></ol>' +
        '<details class="book-record"><summary>Roles for two to four players</summary><dl>' + file.roles.map(r => '<div><dt>' + esc(r.name) + '</dt><dd>' + esc(r.task) + '</dd></div>').join('') +
        '</dl><p>With two players, take two roles each. Trade at the next chapter.</p></details>';
    }
    openPanel('g-guide-dialog','Kageura archive','Field guide','<nav class="guide-tabs" aria-label="Field guide sections">' + tabs + '</nav><section class="guide-page">' + body +
      '</section><footer class="guide-actions">' + assignmentLink(state.chapter) + '<button type="button" class="g-primary" data-ga="close">Back to scene</button></footer>');
  }

  function clearSaved() {
    state = defaultState();
    enterScene(0);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-ga]');
    if (!button || button.disabled) return;
    const {ga,index,key,page} = button.dataset;
    switch (ga) {
      case 'close': closeDialog(); break;
      case 'voice-play':
        if (button.dataset.voice !== voiceContext) break;
        if (pendingClip === voiceContext || window.gameVoice?.current() === voiceContext) stopVoice();
        else playVoice(true);
        break;
      case 'voice-toggle': {
        const voice = window.gameVoice;
        if (!voice) { notify('Spoken narration is unavailable in this browser.'); break; }
        const next = !voice.enabled();
        if (!next) stopVoice();
        voice.setEnabled(next);
        syncVoice();
        if (next && !dialog?.open && voiceContext === objectiveId()) playVoice(true);
        notify(next ? 'Spoken narration on. Voices will play as you investigate.' : 'Spoken narration off.');
        break;
      }
      case 'prologue': prologue(Number(page) || 0); break;
      case 'audio': window.toggleAmbience?.(); break;
      case 'fullscreen': fullscreen(); break;
      case 'pan-left':
      case 'pan-right': {
        const pan = getGame().querySelector('.scene-pan');
        const dir = ga === 'pan-left' ? -1 : 1;
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        pan.scrollBy({left: dir * pan.clientWidth * .7, behavior: smooth ? 'smooth' : 'instant'});
        break;
      }
      case 'menu': menu(); break;
      case 'guide': guide(page); break;
      case 'assignment': briefing(Number(index)); break;
      case 'history': history(); break;
      case 'reader': showReader(key); break;
      case 'speech': showReader(key,Number(page)); break;
      case 'casebook': showBook(); break;
      case 'book-tab': showBook(Number(index)); break;
      case 'chapter': enterScene(Number(index)); break;
      case 'notebook': notebook(); break;
      case 'compare': showComparison(); break;
      case 'pin': togglePin(key); break;
      case 'finding-record': recordedFinding(Number(index)); break;
      case 'finding': showFinding(); break;
      case 'ending': showEnding(Number(page) || 0); break;
      case 'hint':
        if (state.solved === state.chapter) {
          state.hints[state.chapter] = Math.min(act().puzzle.hints.length,(Number(state.hints[state.chapter]) || 0) + 1);
          save(); showFinding();
          const hint = dialog.querySelector('.g-hints li:last-child'); hint.tabIndex = -1; hint.focus();
        }
        break;
      case 'reset':
        openPanel('g-reset-dialog','Replay','Start a fresh case?','<div class="g-reset"><p>This clears the team’s notes, findings, hints and pins on this device.</p><div>' +
          '<button class="g-secondary" type="button" data-ga="close">Keep this case</button><button class="g-primary" type="button" data-ga="confirm-reset">Start fresh</button></div></div>');
        break;
      case 'confirm-reset': clearSaved(); break;
    }
  });
  document.addEventListener('change', e => {
    const f = e.target;
    if (f.id === 'game-theme') { window.setSceneTheme?.(f.value); return; }
    if (!f.matches('#g-answer-form select[data-field]')) return;
    state.drafts[state.chapter] ||= {};
    state.drafts[state.chapter][f.dataset.field] = f.value; save();
    dialog.querySelector('.g-feedback').textContent = '';
  });
  document.addEventListener('input', e => {
    if (e.target.id !== 'g-notes-input') return;
    state.notes = e.target.value; save();
    dialog.querySelector('#g-note-status').textContent = persistent ? 'Saved on this device.' : 'Device storage unavailable. Notes last for this session.';
  });
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !state?.started || dialog?.open ||
      e.target.closest?.('input,textarea,select,[contenteditable="true"]')) return;
    switch (e.key.toLowerCase()) {
      case 'n': notebook(); break;
      case 'f': fullscreen(); break;
      case 'b': showBook(); break;
      case 'escape': menu(); break;
      default: return;
    }
    e.preventDefault();
  });
  document.addEventListener('submit',submitFinding);
  document.addEventListener('fullscreenchange',syncFullscreen);
  document.addEventListener('webkitfullscreenchange',syncFullscreen);
  window.addEventListener('resize',() => { if (state?.started) scheduleFit(); });
  window.addEventListener('ambiencechange',syncSound);
  window.addEventListener('gamevoicechange',syncVoice);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopVoice(); });
  window.addEventListener('pagehide',stopVoice);
  window.openInvestigation = openInvestigation;
  window.openNotebook = notebook;
  window.clearSavedInvestigation = clearSaved;
  window.hasInvestigation = () => { load(); return state.started; };
})();
