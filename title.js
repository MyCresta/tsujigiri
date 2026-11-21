(() => {
  'use strict';

  const cover = document.querySelector('#title-screen');
  const desk = document.querySelector('#game');
  const begin = document.querySelector('#begin');
  const guide = document.querySelector('#guide');
  const sound = document.querySelector('#sound');
  const fullscreen = document.querySelector('#fullscreen');
  const status = document.querySelector('#title-status');
  let audio;
  let rain;
  let soundBusy = false;
  let toastTimer;

  function announce(message) {
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
    const on = window.ambienceOn();
    sound.setAttribute('aria-pressed', String(on));
    sound.querySelector('span').textContent = on ? 'Sound on' : 'Sound off';
    sound.title = on ? 'Mute rain ambience' : 'Play rain ambience';
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

  function refreshCover() {
    const hasSave = window.hasInvestigation?.();
    begin.querySelector('span').textContent = hasSave ? 'Resume investigation' : 'Begin investigation';
  }

  window.showTitle = () => {
    desk.hidden = true;
    cover.hidden = false;
    refreshCover();
    window.scrollTo(0, 0);
    begin.focus({ preventScroll: true });
  };

  begin.addEventListener('click', () => window.openInvestigation());
  sound.addEventListener('click', window.toggleAmbience);
  document.querySelector('#how').addEventListener('click', () => {
    guide.showModal();
    document.querySelector('#close-guide').focus({ preventScroll: true });
  });
  for (const id of ['close-guide', 'guide-return']) {
    document.getElementById(id).addEventListener('click', () => guide.close());
  }
  guide.addEventListener('click', (event) => {
    if (event.target !== guide) return;
    const bounds = guide.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) guide.close();
  });
  guide.addEventListener('close', () => document.querySelector('#how').focus());

  function refreshFullscreen() {
    const active = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    const label = active ? 'Exit fullscreen' : 'Enter fullscreen';
    fullscreen.setAttribute('aria-label', label);
    fullscreen.title = label;
    fullscreen.querySelector('use').setAttribute('href', active ? '#i-min' : '#i-full');
  }
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else {
        await (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen).call(document.documentElement);
      }
    } catch {
      announce('Fullscreen is unavailable in this browser view.');
    }
  });
  document.addEventListener('fullscreenchange', refreshFullscreen);
  document.addEventListener('webkitfullscreenchange', refreshFullscreen);
  window.addEventListener('storage', refreshCover);
  window.addEventListener('pageshow', refreshCover);
  refreshAudio();
  refreshCover();
})();
