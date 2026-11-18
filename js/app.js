/* ============================================================
   存档 / 页面导航 / 首页 / 地图 / 收藏 / 设置 / 弹窗 / 特效
   ============================================================ */
'use strict';

const SAVE_KEY = 'smash-egg-hanzi-v1';

const DEFAULT_SETTINGS = {
  // 声音
  sfxEnabled: true,
  bgmEnabled: true,
  voiceEnabled: true,
  sfxVolume: 0.85,
  bgmVolume: 0.35,
  voiceRate: 0.85,
  voicePitch: 1.12,
  autoSpeak: true,
  // 玩法
  eggCount: 6,
  hintSeconds: 7,
  wrongHint: 2,
  promptMode: 'mixed',
  reviewCount: 5,
  autoNext: false,
  // 无障碍 / 触屏
  vibrate: true,
  bigButtons: false,
  highContrast: false,
  reduceMotion: false,
  showPinyin: true
};

let save = loadSave();
let currentAlbumTab = 'hanzi';
let toastTimer = null;

/* ---------------- 小工具 ---------------- */
function $(sel, root) {
  return (root || document).querySelector(sel);
}
function $$(sel, root) {
  return Array.prototype.slice.call((root || document).querySelectorAll(sel));
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(n, min, max) {
  n = Number(n);
  if (!isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

/* ---------------- 设置 ---------------- */
function normalizeSettings(raw) {
  const s = Object.assign({}, DEFAULT_SETTINGS, raw && typeof raw === 'object' ? raw : {});
  ['sfxEnabled', 'bgmEnabled', 'voiceEnabled', 'autoSpeak', 'autoNext',
   'vibrate', 'bigButtons', 'highContrast', 'reduceMotion', 'showPinyin'].forEach(function (k) {
    s[k] = !!s[k];
  });
  s.sfxVolume = clamp(s.sfxVolume, 0, 1);
  s.bgmVolume = clamp(s.bgmVolume, 0, 1);
  s.voiceRate = clamp(s.voiceRate, 0.5, 1.3);
  s.voicePitch = clamp(s.voicePitch, 0.7, 1.5);
  if ([4, 6, 8].indexOf(s.eggCount) === -1) s.eggCount = 6;
  if ([0, 5, 7, 9, 12].indexOf(s.hintSeconds) === -1) s.hintSeconds = 7;
  if ([0, 1, 2, 3].indexOf(s.wrongHint) === -1) s.wrongHint = 2;
  if (['mixed', 'glyph', 'picture'].indexOf(s.promptMode) === -1) s.promptMode = 'mixed';
  if ([4, 5, 8, 10].indexOf(s.reviewCount) === -1) s.reviewCount = 5;
  return s;
}
function getSettings() {
  return normalizeSettings(save.settings);
}
function saveSettings(s) {
  save.settings = normalizeSettings(s);
  persist();
  applySettings();
}
function applySettings() {
  const s = getSettings();
  setSoundOptions({
    sfxEnabled: s.sfxEnabled,
    bgmEnabled: s.bgmEnabled,
    voiceEnabled: s.voiceEnabled,
    sfxVolume: s.sfxVolume,
    bgmVolume: s.bgmVolume,
    voiceRate: s.voiceRate,
    voicePitch: s.voicePitch
  });
  document.body.classList.toggle('big-buttons', s.bigButtons);
  document.body.classList.toggle('high-contrast', s.highContrast);
  document.body.classList.toggle('reduce-motion', s.reduceMotion);
}
function vibrate(pattern) {
  const s = getSettings();
  if (!s.vibrate || !navigator.vibrate) return;
  try { navigator.vibrate(pattern); } catch (e) { /* 不支持则忽略 */ }
}

/* ---------------- 存档 ---------------- */
function defaultSave() {
  return {
    stars: {},
    unlocked: 1,
    stickers: [],
    learned: [],
    muted: false,
    settings: Object.assign({}, DEFAULT_SETTINGS)
  };
}
function loadSave() {
  const base = defaultSave();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return base;
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return base;
    return {
      stars: s.stars && typeof s.stars === 'object' ? s.stars : {},
      unlocked: clamp(s.unlocked, 1, LEVELS.length),
      stickers: Array.isArray(s.stickers) ? s.stickers.filter(function (x) { return typeof x === 'number'; }) : [],
      learned: Array.isArray(s.learned) ? s.learned.filter(function (x) { return !!CHAR_MAP[x]; }) : [],
      muted: !!s.muted,
      settings: normalizeSettings(s.settings)
    };
  } catch (e) {
    return base;
  }
}
function persist() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (e) { /* 隐私模式下忽略 */ }
}
function totalStars() {
  let n = 0;
  Object.keys(save.stars).forEach(function (k) { n += save.stars[k] || 0; });
  return n;
}
function rankOf(n) {
  if (n >= TOTAL_CHARS) return '👑 汉字大师';
  if (n >= 120) return '🌟 汉字小达人';
  if (n >= 60) return '🌳 汉字小树';
  if (n >= 20) return '🌿 汉字小苗';
  return '🌱 汉字小芽';
}

/* ---------------- 声音开关 ---------------- */
function updateSoundUI() {
  $$('.sound-btn').forEach(function (b) {
    b.textContent = save.muted ? '🔇' : '🔊';
    b.setAttribute('aria-label', save.muted ? '开启声音' : '关闭声音');
  });
  applySettings();
  setAudioMuted(save.muted);
}
function toggleSound() {
  save.muted = !save.muted;
  persist();
  updateSoundUI();
  if (!save.muted) {
    startAudio();
    Sfx.pop();
    say('声音打开啦');
  }
}

/* ---------------- 页面切换 ---------------- */
function showScreen(name) {
  $$('.screen').forEach(function (s) {
    s.classList.toggle('active', s.id === 'screen-' + name);
  });
  stopSpeaking();
  if (name === 'home') renderHome();
  if (name === 'map') renderMap();
  if (name === 'album') renderAlbum();
  const sc = $('#screen-' + name);
  if (sc) sc.scrollTop = 0;
}

/* ---------------- 首页 ---------------- */
function renderHome() {
  const learned = save.learned.length;
  $('#home-stars').textContent = totalStars();
  $('#home-learned').textContent = learned;
  $('#home-rank').textContent = rankOf(learned);
  $('#home-total').textContent = TOTAL_CHARS;
  const btn = $('#btn-start');
  const nextLevel = Math.min(save.unlocked, LEVELS.length);
  btn.textContent = save.unlocked > 1
    ? '继续游戏 · 第' + nextLevel + '关'
    : '开始游戏';
  updateSoundUI();
}

/* ---------------- 关卡地图 ---------------- */
function renderMap() {
  const grid = $('#level-grid');
  grid.innerHTML = '';
  const unlocked = Math.min(save.unlocked, LEVELS.length);
  $('#map-sub').textContent = '已解锁 ' + unlocked + ' / ' + LEVELS.length + ' · 已学 ' + save.learned.length + ' 字';
  $('#map-stars').textContent = totalStars();

  LEVELS.forEach(function (lv) {
    const isUnlocked = lv.id <= save.unlocked;
    const stars = save.stars[lv.id] || 0;
    const done = save.stickers.indexOf(lv.id) !== -1;
    const card = document.createElement('button');
    card.className = 'level-card' + (isUnlocked ? '' : ' locked');
    card.style.setProperty('--accent', lv.color);

    let starHtml = '';
    for (let i = 1; i <= 3; i++) {
      starHtml += i <= stars ? '⭐' : '<span class="lc-star-off">☆</span>';
    }

    card.innerHTML =
      '<span class="lc-emoji">' + (isUnlocked ? lv.emoji : '🔒') + '</span>' +
      '<span class="lc-num">第 ' + lv.id + ' 关</span>' +
      '<span class="lc-name">' + lv.name + '</span>' +
      '<span class="lc-stars">' + starHtml + '</span>' +
      (done ? '<span class="lc-done" title="已获得奖章">' + lv.sticker + '</span>' : '');

    card.addEventListener('click', function () {
      startAudio();
      Sfx.click();
      vibrate(12);
      if (isUnlocked) {
        startLevel(lv, false);
      } else {
        toast('先完成第 ' + save.unlocked + ' 关吧～');
      }
    });
    grid.appendChild(card);
  });

  const review = $('#btn-review');
  const canReview = save.learned.length >= 4;
  review.classList.toggle('empty', !canReview);
  review.onclick = function () {
    startAudio();
    Sfx.click();
    vibrate(12);
    if (canReview) startReview();
    else toast('先学几个汉字，再来挑战吧～');
  };
}

/* ---------------- 我的收藏 ---------------- */
function renderAlbum() {
  $('#album-stars').textContent = totalStars();
  $('#album-sub').textContent = '已学 ' + save.learned.length + ' / ' + TOTAL_CHARS + ' 字 · 奖章 ' + save.stickers.length + ' 枚';

  $$('.tab').forEach(function (t) {
    t.classList.toggle('active', t.dataset.tab === currentAlbumTab);
  });

  const body = $('#album-body');
  if (currentAlbumTab === 'hanzi') {
    renderHanziAlbum(body);
  } else if (currentAlbumTab === 'sticker') {
    renderStickerAlbum(body);
  } else if (currentAlbumTab === 'library') {
    renderLibrary(body);
  } else if (currentAlbumTab === 'report') {
    renderReport(body);
  }
}

function renderHanziAlbum(body) {
  const ordered = [];
  LEVELS.forEach(function (lv) {
    lv.chars.forEach(function (c) {
      if (save.learned.indexOf(c.c) !== -1) ordered.push(c);
    });
  });

  if (!ordered.length) {
    body.innerHTML = emptyBox('🥚', '还没有学过的汉字', '去砸开金蛋，认识第一个汉字吧！');
    return;
  }

  body.innerHTML = '<div class="hanzi-grid">' + ordered.map(function (c) {
    return '<button class="hanzi-card" data-char="' + c.c + '">' +
      '<span class="hc-emoji">' + c.emoji + '</span>' +
      '<span class="hc-char kai">' + c.c + '</span>' +
      '<span class="hc-pinyin">' + c.p + '</span>' +
      '</button>';
  }).join('') + '</div><p class="album-note">点一点汉字，听听它怎么读～</p>';

  bindSpeakCards(body, '.hanzi-card');
}

function renderStickerAlbum(body) {
  if (!save.stickers.length) {
    body.innerHTML = emptyBox('🏅', '还没有奖章', '每通过一关，就能敲开超级金蛋获得奖章！');
    return;
  }

  body.innerHTML = '<div class="sticker-grid">' + LEVELS.map(function (lv) {
    const got = save.stickers.indexOf(lv.id) !== -1;
    return got
      ? '<div class="sticker-card"><span class="sc-emoji">' + lv.sticker + '</span><span class="sc-name">' + lv.name + '</span></div>'
      : '<div class="sticker-card locked"><span class="sc-lock">🔒</span><span class="sc-name">未获得</span></div>';
  }).join('') + '</div><p class="album-note">共 ' + LEVELS.length + ' 枚奖章，加油全部收集吧！</p>';
}

function renderLibrary(body) {
  const s = getSettings();
  const groups = LEVELS.map(function (lv) {
    const chars = lv.chars.map(function (c) {
      const got = save.learned.indexOf(c.c) !== -1;
      return '<button class="lib-char' + (got ? '' : ' locked') + '" data-char="' + c.c + '" title="' + c.word + '">' +
        '<span class="lc-emoji">' + c.emoji + '</span>' +
        '<span class="lib-glyph kai">' + c.c + '</span>' +
        (s.showPinyin ? '<span class="lib-pinyin">' + c.p + '</span>' : '') +
        '</button>';
    }).join('');
    return '<section class="lib-group">' +
      '<h4>第 ' + lv.id + ' 关 · ' + lv.name + '</h4>' +
      '<div class="library-grid">' + chars + '</div></section>';
  }).join('');

  body.innerHTML = '<div class="library">' + groups + '</div>' +
    '<p class="album-note">灰色字还没学过 · 点一点任意汉字都能听读音</p>';
  bindSpeakCards(body, '.lib-char');
}

function renderReport(body) {
  const learned = save.learned.length;
  const stars = totalStars();
  const maxStars = LEVELS.length * 3;
  const pct = Math.round(learned / TOTAL_CHARS * 100);
  const starPct = Math.round(stars / maxStars * 100);

  body.innerHTML =
    '<div class="report-card">' +
      '<div class="report-rank">' + rankOf(learned) + '</div>' +
      '<div class="report-line"><b>识字进度</b><span>' + learned + ' / ' + TOTAL_CHARS + ' 字</span></div>' +
      '<div class="progress"><i style="width:' + pct + '%"></i></div>' +
      '<div class="report-line"><b>星星收集</b><span>⭐ ' + stars + ' / ' + maxStars + '</span></div>' +
      '<div class="progress stars"><i style="width:' + starPct + '%"></i></div>' +
      '<div class="report-grid">' +
        '<div><b>' + save.unlocked + '</b><small>解锁关卡</small></div>' +
        '<div><b>' + save.stickers.length + '</b><small>获得奖章</small></div>' +
        '<div><b>' + (TOTAL_CHARS - learned) + '</b><small>待学汉字</small></div>' +
      '</div>' +
      '<div class="tip-box parent-tip"><b>给家长的话</b><br>' +
        '每天 10 分钟、每次 1–2 关效果最好。可以指着家里的物品，和孩子一起说出「日、月、水、火」这样的字，把游戏里的字搬到生活中。' +
      '</div>' +
    '</div>';
}

function bindSpeakCards(body, selector) {
  $$(selector, body).forEach(function (card) {
    card.addEventListener('click', function () {
      startAudio();
      const c = CHAR_MAP[card.dataset.char];
      if (!c) return;
      Sfx.pop();
      vibrate(15);
      card.classList.remove('pop');
      void card.offsetWidth;
      card.classList.add('pop');
      say(c.c + '，' + c.word + '的' + c.c);
    });
  });
}

function emptyBox(emoji, title, desc) {
  return '<div class="empty-box"><span class="eb-emoji">' + emoji + '</span><b>' + title + '</b><p>' + desc + '</p></div>';
}

/* ---------------- 提示 ---------------- */
function toast(msg, ms) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    t.classList.remove('show');
  }, ms || 1800);
}

/* ---------------- 弹窗 ---------------- */
function openModal(html, opts) {
  opts = opts || {};
  const layer = $('#modal-layer');
  layer.innerHTML = '<div class="modal-backdrop"><div class="modal-card" role="dialog" aria-modal="true">' + html + '</div></div>';
  layer.classList.add('show');
  const backdrop = $('.modal-backdrop', layer);
  if (opts.dismissible) {
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });
  }
}
function closeModal() {
  const layer = $('#modal-layer');
  layer.classList.remove('show');
  layer.innerHTML = '';
}

/* ---------------- 特效 ---------------- */
const CONFETTI_COLORS = ['#FFD93D', '#FF8FAB', '#7BC950', '#4ECDC4', '#A78BFA', '#FF9F68', '#FF6B6B', '#58B4FF'];
const fx = $('#fx-layer');

function confettiAt(el, n) {
  n = n || 32;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.className = 'confetti';
    const ang = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 150;
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
    p.style.setProperty('--dy', (Math.sin(ang) * dist + 70).toFixed(1) + 'px');
    p.style.setProperty('--rot', (Math.random() * 720 - 360).toFixed(0) + 'deg');
    p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    p.style.animationDelay = (Math.random() * 0.08).toFixed(2) + 's';
    fx.appendChild(p);
    setTimeout(function () { p.remove(); }, 1700);
  }
}

function rainConfetti(n) {
  n = n || 60;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.className = 'confetti rain';
    p.style.left = (Math.random() * 100).toFixed(1) + 'vw';
    p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    p.style.animationDelay = (Math.random() * 0.9).toFixed(2) + 's';
    p.style.animationDuration = (2 + Math.random() * 1.6).toFixed(2) + 's';
    p.style.width = (6 + Math.random() * 6).toFixed(0) + 'px';
    p.style.height = (9 + Math.random() * 8).toFixed(0) + 'px';
    fx.appendChild(p);
    setTimeout(function () { p.remove(); }, 4200);
  }
}

/* ---------------- 设置面板 ---------------- */
function switchHtml(id, on) {
  return '<button class="switch' + (on ? '' : ' off') + '" id="' + id + '">' + (on ? '已开启' : '已关闭') + '</button>';
}
function toggleRow(label, id, on, desc) {
  return '<div class="set-row"><span>' + label + (desc ? '<small>' + desc + '</small>' : '') + '</span>' + switchHtml(id, on) + '</div>';
}
function selectRow(label, id, value, options) {
  return '<label class="set-row"><span>' + label + '</span><select id="' + id + '">' +
    options.map(function (o) {
      return '<option value="' + o[0] + '"' + (String(value) === String(o[0]) ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('') + '</select></label>';
}
function rangeRow(label, id, val, min, max, unit) {
  return '<label class="set-row range-row"><span>' + label + '</span>' +
    '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + val + '">' +
    '<b id="' + id + '-val">' + val + unit + '</b></label>';
}

function openSettings(opts) {
  opts = opts || {};
  if (!opts.rerender) {
    startAudio();
    Sfx.click();
  }

  const s = getSettings();
  const html =
    '<div class="confirm-emoji">⚙️</div>' +
    '<h3>自定义设置</h3>' +
    '<p class="modal-desc">所有设置只保存在这台设备上</p>' +
    '<div class="settings-wrap">' +

      '<section class="settings-section">' +
        '<h4>🔊 声音与朗读</h4>' +
        toggleRow('总声音', 'set-master', !save.muted) +
        toggleRow('游戏音效', 'set-sfx', s.sfxEnabled) +
        toggleRow('背景音乐', 'set-bgm', s.bgmEnabled) +
        toggleRow('朗读语音', 'set-voice', s.voiceEnabled, '汉字和鼓励语') +
        toggleRow('自动读题', 'set-auto-speak', s.autoSpeak, '进入回合时自动朗读') +
        rangeRow('音效音量', 'set-sfx-vol', Math.round(s.sfxVolume * 100), 0, 100, '%') +
        rangeRow('音乐音量', 'set-bgm-vol', Math.round(s.bgmVolume * 100), 0, 100, '%') +
        rangeRow('朗读语速', 'set-voice-rate', Math.round(s.voiceRate * 100), 50, 130, '%') +
        rangeRow('声音音调', 'set-voice-pitch', Math.round(s.voicePitch * 100), 70, 150, '%') +
      '</section>' +

      '<section class="settings-section">' +
        '<h4>🎮 玩法设置</h4>' +
        selectRow('每关金蛋数', 'set-egg-count', s.eggCount, [[4, '4 个 · 简单'], [6, '6 个 · 标准'], [8, '8 个 · 挑战']]) +
        selectRow('提示方式', 'set-prompt-mode', s.promptMode, [['mixed', '看字 + 看图交替'], ['glyph', '只看汉字'], ['picture', '只看图片']]) +
        selectRow('自动提示时间', 'set-hint-time', s.hintSeconds, [[0, '不自动提示'], [5, '5 秒'], [7, '7 秒'], [9, '9 秒'], [12, '12 秒']]) +
        selectRow('敲错提示', 'set-wrong-hint', s.wrongHint, [[0, '不提示'], [1, '错 1 次后'], [2, '错 2 次后'], [3, '错 3 次后']]) +
        selectRow('复习题量', 'set-review-count', s.reviewCount, [[4, '4 个字'], [5, '5 个字'], [8, '8 个字'], [10, '10 个字']]) +
        toggleRow('通关后自动下一关', 'set-auto-next', s.autoNext) +
      '</section>' +

      '<section class="settings-section">' +
        '<h4>👆 触屏与无障碍</h4>' +
        toggleRow('轻触震动反馈', 'set-vibrate', s.vibrate, '支持的手机才会震动') +
        toggleRow('超大按钮', 'set-big-buttons', s.bigButtons) +
        toggleRow('高对比度', 'set-high-contrast', s.highContrast) +
        toggleRow('减少动画', 'set-reduce-motion', s.reduceMotion) +
        toggleRow('显示拼音', 'set-show-pinyin', s.showPinyin, '字库和汉字卡') +
      '</section>' +

      '<div class="tip-box"><b>家长小贴士</b><br>· 每次玩 10 分钟左右，保护小眼睛<br>· 和孩子一起跟读汉字，记得多鼓励<br>· 敲错金蛋不会扣星星，大胆尝试就好</div>' +
      '<button class="btn ghost small reset-btn" id="set-reset">清空学习记录</button>' +
    '</div>' +
    '<div class="modal-btns"><button class="btn primary" id="set-close">完成设置</button></div>';

  openModal(html, { dismissible: true });

  const rerender = function () { openSettings({ rerender: true }); };
  const current = function () { return getSettings(); };

  function bindSwitch(id, key) {
    const el = $('#' + id);
    if (!el) return;
    el.addEventListener('click', function () {
      Sfx.click();
      const cfg = current();
      cfg[key] = !cfg[key];
      saveSettings(cfg);
      rerender();
    });
  }

  function bindSelect(id, key, parse) {
    const el = $('#' + id);
    if (!el) return;
    el.addEventListener('change', function () {
      Sfx.pop();
      const cfg = current();
      cfg[key] = parse ? parse(el.value) : el.value;
      saveSettings(cfg);
      rerender();
    });
  }

  function bindRange(id, key, scale, suffix) {
    const el = $('#' + id);
    const label = $('#' + id + '-val');
    if (!el) return;
    el.addEventListener('input', function () {
      if (label) label.textContent = el.value + (suffix || '');
    });
    el.addEventListener('change', function () {
      Sfx.pop();
      const cfg = current();
      cfg[key] = Number(el.value) / scale;
      saveSettings(cfg);
      rerender();
    });
  }

  const master = $('#set-master');
  if (master) master.addEventListener('click', function () {
    save.muted = !save.muted;
    persist();
    updateSoundUI();
    Sfx.click();
    rerender();
  });

  bindSwitch('set-sfx', 'sfxEnabled');
  bindSwitch('set-bgm', 'bgmEnabled');
  bindSwitch('set-voice', 'voiceEnabled');
  bindSwitch('set-auto-speak', 'autoSpeak');
  bindSwitch('set-auto-next', 'autoNext');
  bindSwitch('set-vibrate', 'vibrate');
  bindSwitch('set-big-buttons', 'bigButtons');
  bindSwitch('set-high-contrast', 'highContrast');
  bindSwitch('set-reduce-motion', 'reduceMotion');
  bindSwitch('set-show-pinyin', 'showPinyin');

  bindSelect('set-egg-count', 'eggCount', Number);
  bindSelect('set-prompt-mode', 'promptMode');
  bindSelect('set-hint-time', 'hintSeconds', Number);
  bindSelect('set-wrong-hint', 'wrongHint', Number);
  bindSelect('set-review-count', 'reviewCount', Number);

  bindRange('set-sfx-vol', 'sfxVolume', 100, '%');
  bindRange('set-bgm-vol', 'bgmVolume', 100, '%');
  bindRange('set-voice-rate', 'voiceRate', 100, '%');
  bindRange('set-voice-pitch', 'voicePitch', 100, '%');

  let armed = false;
  $('#set-close').onclick = function () {
    Sfx.click();
    closeModal();
  };
  $('#set-reset').onclick = function () {
    const b = $('#set-reset');
    if (!armed) {
      armed = true;
      b.textContent = '再点一次，确认清空';
      b.classList.add('danger');
      return;
    }
    const keepMuted = save.muted;
    save = defaultSave();
    save.muted = keepMuted;
    persist();
    updateSoundUI();
    closeModal();
    renderHome();
    toast('学习记录已清空，设置已恢复默认');
  };
}

/* ---------------- 导航绑定（由 game.js 调用） ---------------- */
function initNavigation() {
  $('#btn-start').addEventListener('click', function () {
    startAudio();
    Sfx.click();
    vibrate(12);
    const next = Math.min(save.unlocked, LEVELS.length);
    startLevel(LEVELS[next - 1], false);
  });
  $('#btn-map').addEventListener('click', function () {
    startAudio();
    Sfx.click();
    showScreen('map');
  });
  $('#btn-album').addEventListener('click', function () {
    startAudio();
    Sfx.click();
    showScreen('album');
  });
  $('#btn-settings').addEventListener('click', openSettings);

  $('#map-back').addEventListener('click', function () {
    Sfx.click();
    showScreen('home');
  });
  $('#album-back').addEventListener('click', function () {
    Sfx.click();
    showScreen('home');
  });

  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      Sfx.click();
      currentAlbumTab = tab.dataset.tab;
      renderAlbum();
    });
  });

  const soundBtns = $$('.sound-btn');
  soundBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      toggleSound();
      Sfx.click();
    });
  });

  // 触屏设备标记，便于 CSS 去掉 hover 效果
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    document.body.classList.add('touch-mode');
  }
}
