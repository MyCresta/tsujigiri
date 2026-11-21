(() => {
  'use strict';

  const paletteKey = 'tsujigiri.appearance.v1';
  const devicePalette = window.matchMedia?.('(prefers-color-scheme: dark)');
  let palette = 'system';
  let audio;
  let rain;
  let soundBusy = false;
  let toastTimer;

  const validPalette = value => ['system', 'light', 'dark'].includes(value);

  function applyPalette() {
    document.documentElement.dataset.palette = palette === 'system'
      ? (devicePalette?.matches ? 'dark' : 'light') : palette;
  }

  try {
    const saved = localStorage.getItem(paletteKey);
    if (validPalette(saved)) palette = saved;
  } catch { /* Appearance is still available for this session. */ }

  window.sceneTheme = () => palette;
  window.setSceneTheme = value => {
    if (!validPalette(value)) return;
    palette = value;
    applyPalette();
    try { localStorage.setItem(paletteKey, value); } catch { /* Session only. */ }
  };
  devicePalette?.addEventListener('change', applyPalette);
  applyPalette();

  function announce(message) {
    const status = document.getElementById('stage-status');
    clearTimeout(toastTimer);
    status.textContent = message;
    status.hidden = false;
    toastTimer = setTimeout(() => { status.hidden = true; }, 4000);
  }

  // A seamless, softly filtered rainfall loop, generated entirely on this device.
  function createRain(context) {
    const length = context.sampleRate * 8;
    const buffer = context.createBuffer(2, length, context.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const samples = buffer.getChannelData(channel);
      let previous = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        previous = .968 * previous + .032 * white;
        const swell = .9 + .1 * Math.sin(2 * Math.PI * i / length);
        samples[i] = (.2 * white + previous) * swell;
      }
    }
    const loop = context.createBufferSource();
    loop.buffer = buffer;
    loop.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1600;
    filter.Q.value = .4;
    const level = context.createGain();
    level.gain.value = .18;
    loop.connect(filter).connect(level).connect(context.destination);
    loop.start();
    return loop;
  }

  window.ambienceOn = () => Boolean(rain && audio?.state === 'running');

  function refreshAudio() {
    window.dispatchEvent(new Event('ambiencechange'));
  }

  window.toggleAmbience = async () => {
    if (soundBusy) return window.ambienceOn();
    soundBusy = true;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error('Web Audio unavailable');
      if (!audio) {
        audio = new Audio();
        audio.addEventListener('statechange', refreshAudio);
      }
      if (window.ambienceOn()) {
        await audio.suspend();
      } else {
        await audio.resume();
        rain ||= createRain(audio);
      }
    } catch {
      announce('Rain ambience is unavailable in this browser.');
    } finally {
      soundBusy = false;
      refreshAudio();
    }
    return window.ambienceOn();
  };

  window.openInvestigation();
})();
