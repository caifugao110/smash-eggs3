/* ============================================================
   声音引擎：Web Audio 合成音效 + 轻柔背景音乐 + 中文语音朗读
   支持音效/音乐/语音分别设置音量与开关
   ============================================================ */
'use strict';

let audioMuted = false;
let audioReady = false;

let sfxEnabled = true;
let bgmEnabled = true;
let voiceEnabled = true;
let sfxVolume = 0.85;
let bgmVolume = 0.35;
let voiceRate = 0.85;
let voicePitch = 1.12;

/* ---------------- 基础音效 ---------------- */
const Sfx = {
  ctx: null,
  master: null,

  init: function () {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = audioMuted ? 0.0001 : 0.85;
        this.master.connect(this.ctx.destination);
      } catch (e) {
        return false;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(function () {});
    }
    audioReady = true;
    return true;
  },

  tone: function (freq, dur, opt) {
    if (!this.ctx || audioMuted) return;
    opt = opt || {};
    const isMusic = !!opt.music;
    if (isMusic ? !bgmEnabled : !sfxEnabled) return;

    const baseVol = opt.vol === undefined ? 0.16 : opt.vol;
    const vol = baseVol * (isMusic ? bgmVolume : sfxVolume);
    if (vol <= 0.0001) return;

    const type = opt.type || 'sine';
    const delay = opt.delay || 0;
    const slideTo = opt.slideTo || null;
    const attack = opt.attack || 0.012;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) {
      o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  },

  noise: function (dur, opt) {
    if (!this.ctx || audioMuted || !sfxEnabled) return;
    opt = opt || {};
    const vol = (opt.vol === undefined ? 0.2 : opt.vol) * sfxVolume;
    if (vol <= 0.0001) return;

    const delay = opt.delay || 0;
    const freq = opt.freq || 1600;
    const type = opt.type || 'highpass';
    const t = this.ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.value = vol;
    src.connect(f);
    f.connect(g);
    g.connect(this.master);
    src.start(t);
  },

  click: function () {
    this.tone(720, 0.055, { type: 'square', vol: 0.05 });
  },

  pop: function () {
    this.tone(520, 0.1, { type: 'sine', vol: 0.12, slideTo: 960 });
  },

  hit: function () {
    this.noise(0.11, { vol: 0.22, freq: 420, type: 'lowpass' });
    this.tone(170, 0.16, { type: 'sine', vol: 0.26, slideTo: 48 });
  },

  crack: function () {
    this.noise(0.3, { vol: 0.26, freq: 1100, type: 'highpass' });
    this.tone(95, 0.22, { type: 'square', vol: 0.1, slideTo: 45 });
    this.tone(640, 0.05, { type: 'square', vol: 0.05, delay: 0.04 });
    this.tone(520, 0.05, { type: 'square', vol: 0.05, delay: 0.11 });
    this.tone(760, 0.05, { type: 'square', vol: 0.05, delay: 0.17 });
  },

  win: function () {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    for (let i = 0; i < notes.length; i++) {
      this.tone(notes[i], 0.26, { type: 'triangle', vol: 0.15, delay: i * 0.085 });
    }
    this.tone(1568, 0.45, { type: 'sine', vol: 0.07, delay: 0.36 });
    this.tone(1046.5, 0.5, { type: 'sine', vol: 0.05, delay: 0.42 });
  },

  wrong: function () {
    this.tone(392, 0.12, { type: 'triangle', vol: 0.16 });
    this.tone(294, 0.22, { type: 'triangle', vol: 0.16, delay: 0.12, slideTo: 196 });
  },

  star: function () {
    this.tone(1046.5, 0.16, { type: 'sine', vol: 0.08 });
    this.tone(1318.5, 0.16, { type: 'sine', vol: 0.08, delay: 0.06 });
    this.tone(1568, 0.22, { type: 'sine', vol: 0.08, delay: 0.12 });
  },

  whoosh: function () {
    this.noise(0.16, { vol: 0.1, freq: 900, type: 'bandpass' });
  }
};

/* ---------------- 轻柔背景音乐 ---------------- */
const Music = {
  timer: null,
  step: 0,
  // 五声音阶小旋律（相对于 C5 的半音）
  melody: [0, 2, 4, 7, 4, 2, 0, -3, 0, 2, 4, 9, 7, 4, 2, 0],

  start: function () {
    if (this.timer || !Sfx.ctx || !bgmEnabled) return;
    const self = this;
    this.playOnce();
    this.timer = setInterval(function () {
      self.playOnce();
    }, 4800);
  },

  playOnce: function () {
    if (!Sfx.ctx || audioMuted || !bgmEnabled) return;
    const base = 523.25;
    for (let i = 0; i < this.melody.length; i++) {
      const f = base * Math.pow(2, this.melody[i] / 12);
      Sfx.tone(f, 0.26, { type: 'triangle', vol: 0.032, delay: i * 0.3, attack: 0.03, music: true });
    }
    // 柔和低音
    const bass = [130.81, 164.81, 196.0, 164.81];
    for (let i = 0; i < bass.length; i++) {
      Sfx.tone(bass[i], 1.1, { type: 'sine', vol: 0.03, delay: i * 1.2, attack: 0.08, music: true });
    }
  },

  stop: function () {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
};

/* ---------------- 中文朗读 ---------------- */
let zhVoices = [];
let speechTimer = null;

function refreshVoices() {
  if (!('speechSynthesis' in window)) return;
  try {
    const all = window.speechSynthesis.getVoices() || [];
    zhVoices = all.filter(function (v) {
      const s = (v.lang || '') + ' ' + (v.name || '');
      return /zh|Chinese|中文|普通话|國語|国语/i.test(s);
    });
  } catch (e) {
    zhVoices = [];
  }
}

if ('speechSynthesis' in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function say(text, rate) {
  if (audioMuted || !voiceEnabled || !('speechSynthesis' in window)) return;
  if (speechTimer) clearTimeout(speechTimer);
  speechTimer = setTimeout(function () {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = rate || voiceRate;
      u.pitch = voicePitch;
      u.volume = 1;
      if (zhVoices.length) u.voice = zhVoices[0];
      window.speechSynthesis.speak(u);
    } catch (e) { /* 忽略不支持的环境 */ }
  }, 70);
}

function stopSpeaking() {
  try {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } catch (e) { /* ignore */ }
  if (speechTimer) {
    clearTimeout(speechTimer);
    speechTimer = null;
  }
}

function setAudioMuted(muted) {
  audioMuted = !!muted;
  if (audioMuted) {
    stopSpeaking();
    if (Sfx.master && Sfx.ctx) {
      Sfx.master.gain.setTargetAtTime(0.0001, Sfx.ctx.currentTime, 0.03);
    }
  } else if (Sfx.ctx && Sfx.master) {
    Sfx.master.gain.setTargetAtTime(0.85, Sfx.ctx.currentTime, 0.03);
  }
}

function setSoundOptions(opts) {
  if (!opts) return;
  if (typeof opts.sfxEnabled === 'boolean') sfxEnabled = opts.sfxEnabled;
  if (typeof opts.bgmEnabled === 'boolean') {
    bgmEnabled = opts.bgmEnabled;
    if (!bgmEnabled) Music.stop();
    else if (audioReady) Music.start();
  }
  if (typeof opts.voiceEnabled === 'boolean') {
    voiceEnabled = opts.voiceEnabled;
    if (!voiceEnabled) stopSpeaking();
  }
  if (typeof opts.sfxVolume === 'number') sfxVolume = Math.max(0, Math.min(1, opts.sfxVolume));
  if (typeof opts.bgmVolume === 'number') bgmVolume = Math.max(0, Math.min(1, opts.bgmVolume));
  if (typeof opts.voiceRate === 'number') voiceRate = Math.max(0.5, Math.min(1.3, opts.voiceRate));
  if (typeof opts.voicePitch === 'number') voicePitch = Math.max(0.7, Math.min(1.5, opts.voicePitch));
}

function startAudio() {
  if (!Sfx.init()) return;
  if (bgmEnabled) Music.start();
}

/* 首次触摸/点击时启动音频（浏览器自动播放策略） */
document.addEventListener('pointerdown', function () {
  startAudio();
}, { once: true, capture: true });
