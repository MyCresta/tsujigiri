// The voice tracks are bundled with the game and only fetched when a line plays.
(() => {
  'use strict';

  const preferenceKey = 'tsujigiri.voice.v1';
  const cues = new Set();
  const file = window.CASEFILE;
  file.intro.forEach((_, i) => cues.add('prologue-' + (i + 1)));
  file.ending.paragraphs.forEach((_, i) => cues.add('epilogue-' + (i + 1)));
  file.acts.forEach((act, i) => {
    cues.add('objective-' + (i + 1));
    cues.add('finding-' + (i + 1));
    act.items.filter(item => item.kind === 'witness').forEach(item => {
      item.body.forEach((_, j) => cues.add(item.id + '-' + (j + 1)));
    });
  });

  let automatic = false;
  let active = null;
  try { automatic = localStorage.getItem(preferenceKey) === 'on'; }
  catch { /* Sound also works without browser storage. */ }

  function changed() {
    window.dispatchEvent(new Event('gamevoicechange'));
  }

  function stop() {
    if (!active) return;
    const previous = active;
    active = null;
    previous.audio.pause();
    previous.audio.removeAttribute('src');
    previous.audio.load();
    changed();
  }

  function setEnabled(value) {
    automatic = Boolean(value);
    try { localStorage.setItem(preferenceKey, automatic ? 'on' : 'off'); }
    catch { /* Use the setting for this session. */ }
    if (!automatic && active) stop();
    else changed();
  }

  async function play(id) {
    if (!cues.has(id)) return false;
    stop();
    const audio = new Audio('./assets/voice/' + id + '.mp3');
    const line = { id, audio };
    active = line;
    function finished() {
      if (active !== line) return;
      active = null;
      changed();
    }
    function failed() {
      if (active !== line) return;
      finished();
      window.dispatchEvent(new Event('gamevoiceerror'));
    }
    audio.addEventListener('ended', finished, { once: true });
    audio.addEventListener('error', failed, { once: true });
    changed();
    try {
      await audio.play();
      return active === line;
    } catch (error) {
      // A restored tab may need a gesture. The current line can always be replayed.
      if (error?.name === 'NotAllowedError' || error?.name === 'AbortError') finished();
      else failed();
      return false;
    }
  }

  window.gameVoice = {
    enabled: () => automatic,
    current: () => active?.id || null,
    setEnabled, play, stop
  };
  window.addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
})();
