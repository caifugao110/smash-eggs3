/* ============================================================
   游戏主流程：关卡 / 砸蛋 / 汉字卡 / 超级金蛋 / 复习挑战
   ============================================================ */
'use strict';

const state = {
  level: null,
  review: false,
  round: 0,
  mistakes: 0,
  locked: false,
  target: null,
  roundType: 'glyph',
  currentPromptSpeech: '',
  correctEl: null,
  hintTimer: null
};

const ROUND_TYPES = ['glyph', 'picture', 'glyph', 'picture'];
const WRONG_EMOJIS = ['🐣', '🐥', '🌟', '🍀', '🦋', '🌈', '🎈', '🐛'];
const WRONG_MSGS = [
  '哎呀，这里是小鸡！再找一找～',
  '不是这个哦，换一个金蛋试试～',
  '哈哈，小鸡跑出来啦！',
  '再听一听，找找看～',
  '差一点点，继续加油！'
];

/* ---------------- 开始一关 ---------------- */
function startLevel(level, review) {
  clearTimeout(state.hintTimer);
  closeModal();
  state.level = level;
  state.review = !!review;
  state.round = 0;
  state.mistakes = 0;
  state.locked = false;
  state.target = null;
  state.correctEl = null;
  state.currentPromptSpeech = '';
  $('#level-pill').textContent = review
    ? '🏆 复习挑战'
    : '第 ' + level.id + ' 关 · ' + level.name;
  showScreen('game');
  updateSoundUI();
  startRound();
}

/* ---------------- 复习挑战 ---------------- */
function startReview() {
  const learned = [];
  LEVELS.forEach(function (lv) {
    lv.chars.forEach(function (c) {
      if (save.learned.indexOf(c.c) !== -1) learned.push(c);
    });
  });
  if (learned.length < 4) {
    toast('先学几个汉字，再来复习挑战吧～');
    return;
  }
  const count = getSettings().reviewCount;
  const chars = shuffle(learned).slice(0, Math.min(count, learned.length));
  startLevel({
    id: 0,
    name: '复习挑战',
    emoji: '🏆',
    sticker: '🏆',
    color: '#FFB703',
    chars: chars
  }, true);
}

/* ---------------- 一轮 ---------------- */
function startRound() {
  clearTimeout(state.hintTimer);
  state.locked = false;
  state.correctEl = null;

  const level = state.level;
  if (!level) return;

  if (state.round >= level.chars.length) {
    startBonus();
    return;
  }

  const cfg = getSettings();
  const c = level.chars[state.round];
  state.target = c;
  state.roundType = cfg.promptMode === 'mixed'
    ? (state.review ? pick(['glyph', 'picture']) : ROUND_TYPES[state.round % ROUND_TYPES.length])
    : cfg.promptMode;

  renderPrompt(c);
  renderDots(false);
  buildEggs(c);

  const speech = state.roundType === 'glyph'
    ? c.c + '。敲开写着' + c.c + '字的金蛋吧！'
    : '找一找，' + c.c + '在哪里？' + c.c + '，' + c.word + '的' + c.c + '。';
  state.currentPromptSpeech = speech;
  if (cfg.autoSpeak) say(speech);

  if (cfg.hintSeconds > 0) {
    state.hintTimer = setTimeout(function () {
      if (!state.locked && state.correctEl) {
        state.correctEl.classList.add('hint');
        toast('💡 发光的金蛋在提示你哦', 1600);
      }
    }, cfg.hintSeconds * 1000);
  }
}

/* ---------------- 提示区 ---------------- */
function renderPrompt(c) {
  const isGlyph = state.roundType === 'glyph';
  $('#prompt-visual').innerHTML = isGlyph
    ? '<span class="pv-char kai">' + c.c + '</span>'
    : '<span class="pv-emoji">' + c.emoji + '</span>';
  $('#prompt-title').innerHTML = isGlyph
    ? '敲开写着 <span class="hl">' + c.c + '</span> 字的金蛋'
    : '哪个金蛋里藏着「' + c.word + '」？';
  const showPinyin = getSettings().showPinyin;
  $('#prompt-sub').textContent = isGlyph
    ? (showPinyin ? c.p + ' · ' : '') + c.word
    : '听一听，找一找' + (showPinyin ? ' · ' + c.p : '');
}

/* ---------------- 进度点 ---------------- */
function renderDots(bonus) {
  const dots = $('#dots');
  const total = state.level.chars.length + 1;
  const active = Math.min(state.round, total - 1);
  let html = '';
  for (let i = 0; i < total; i++) {
    let cls = 'dot';
    if (i < state.round || (bonus && i < total - 1)) cls += ' done';
    if (i === active) cls += ' now';
    html += '<span class="' + cls + '"></span>';
  }
  dots.innerHTML = html;
}

/* ---------------- 生成金蛋 ---------------- */
function buildEggs(target) {
  const grid = $('#egg-grid');
  const total = getSettings().eggCount;
  grid.className = 'egg-grid count-' + total;
  grid.innerHTML = '';

  const levelChars = state.level.chars.map(function (c) { return c.c; });
  const others = shuffle(levelChars.filter(function (ch) {
    return ch !== target.c;
  }));
  const extra = shuffle(Object.keys(CHAR_MAP).filter(function (ch) {
    return levelChars.indexOf(ch) === -1 && ch !== target.c;
  }));

  const faces = shuffle([target.c].concat(others, extra).slice(0, total));

  state.correctEl = null;

  faces.forEach(function (ch, i) {
    const slot = document.createElement('div');
    slot.className = 'egg-slot';
    slot.style.setProperty('--i', i);
    slot.dataset.char = ch;
    slot.innerHTML =
      '<button class="egg" aria-label="印着' + ch + '字的金蛋">' +
        '<span class="egg-body">' +
          '<span class="egg-glyph kai">' + ch + '</span>' +
          '<span class="egg-shine"></span>' +
          '<svg class="crack" viewBox="0 0 100 140" aria-hidden="true">' +
            '<path d="M50 8 L41 34 L56 47 L38 68 L53 83 L43 108 L50 130"/>' +
          '</svg>' +
        '</span>' +
        '<span class="reveal"><span class="badge"></span></span>' +
      '</button>';

    const eggBtn = slot.querySelector('.egg');
    if (ch === target.c) state.correctEl = slot;
    eggBtn.addEventListener('click', function () { onEgg(slot); });
    grid.appendChild(slot);
  });
}

/* ---------------- 砸蛋 ---------------- */
function onEgg(slot) {
  if (state.locked || slot.dataset.done === '1') return;
  slot.dataset.done = '1';
  $$('.egg-slot.hint').forEach(function (s) { s.classList.remove('hint'); });

  const egg = slot.querySelector('.egg');
  const char = slot.dataset.char;
  const correct = char === state.target.c;
  const badge = slot.querySelector('.badge');

  egg.disabled = true;
  slot.classList.add('smashing');
  Sfx.hit();
  vibrate(18);
  swingHammer();

  setTimeout(function () {
    Sfx.crack();
    slot.classList.add('opened');

    if (correct) {
      badge.textContent = state.target.c;
      badge.classList.add('char-badge');
      slot.classList.add('correct');
      state.locked = true;
      clearTimeout(state.hintTimer);

      const c = state.target;
      const isNew = save.learned.indexOf(c.c) === -1;
      if (isNew) {
        save.learned.push(c.c);
        persist();
      }

      setTimeout(function () {
        Sfx.win();
        Sfx.star();
        vibrate([25, 40, 25]);
        confettiAt(egg, 34);
        setTimeout(function () {
          openCharCard(c, isNew);
        }, 720);
      }, 240);
    } else {
      badge.textContent = pick(WRONG_EMOJIS);
      badge.classList.add('chick-badge');
      slot.classList.add('wrong');
      state.mistakes++;
      Sfx.wrong();
      vibrate(35);
      toast(pick(WRONG_MSGS));
      const wrongLimit = getSettings().wrongHint;
      if (wrongLimit > 0 && state.mistakes >= wrongLimit && state.correctEl) {
        setTimeout(function () {
          if (!state.locked && state.correctEl) state.correctEl.classList.add('hint');
        }, 900);
      }
      setTimeout(function () {
        slot.classList.add('done');
      }, 420);
    }
  }, 280);
}

/* ---------------- 汉字学习卡 ---------------- */
function openCharCard(c, isNew) {
  openModal(
    (isNew ? '<div class="new-badge">✨ 新汉字</div>' : '') +
    '<div class="card-emoji">' + c.emoji + '</div>' +
    '<div class="card-char kai">' + c.c + '</div>' +
    (getSettings().showPinyin ? '<div class="card-pinyin">' + c.p + '</div>' : '') +
    '<div class="card-word">' + c.emoji + ' ' + c.word + '</div>' +
    '<div class="card-btns">' +
      '<button class="btn ghost small" id="card-hear">🔊 再听一次</button>' +
      '<button class="btn primary" id="card-next">继续 →</button>' +
    '</div>'
  );

  const line = c.c + '，' + c.word + '的' + c.c;
  if (getSettings().autoSpeak) say(line);

  $('#card-hear').addEventListener('click', function () {
    startAudio();
    Sfx.pop();
    vibrate(15);
    say(line);
  });

  $('#card-next').addEventListener('click', function () {
    Sfx.click();
    closeModal();
    state.round++;
    startRound();
  });
}

/* ---------------- 超级金蛋 ---------------- */
function startBonus() {
  clearTimeout(state.hintTimer);
  state.locked = false;
  state.correctEl = null;
  renderDots(true);

  const sticker = state.level.sticker || '🌟';
  $('#prompt-visual').innerHTML = '<span class="pv-emoji">🎁</span>';
  $('#prompt-title').textContent = '超级金蛋时间！';
  $('#prompt-sub').textContent = '敲开它，会有惊喜哦';
  state.currentPromptSpeech = '超级金蛋时间！敲开它看看！';

  const grid = $('#egg-grid');
  grid.className = 'egg-grid bonus-mode';
  grid.innerHTML =
    '<div class="bonus-stage">' +
      '<div class="bonus-label">🎉 超级金蛋 🎉</div>' +
      '<button class="giant-egg" id="giant-egg" aria-label="超级金蛋">' +
        '<span class="egg-body">' +
          '<span class="egg-glyph kai">?</span>' +
          '<span class="egg-shine"></span>' +
          '<svg class="crack" viewBox="0 0 100 140" aria-hidden="true">' +
            '<path d="M50 8 L41 34 L56 47 L38 68 L53 83 L43 108 L50 130"/>' +
          '</svg>' +
        '</span>' +
      '</button>' +
      '<div class="bonus-reveal" id="bonus-reveal">' +
        '<div class="big-sticker">' + sticker + '</div>' +
        '<div class="bonus-caption">' + (state.review ? '复习小达人！' : (save.stickers.indexOf(state.level.id) === -1 ? '新奖章！' : '奖章闪亮亮！')) + '</div>' +
      '</div>' +
      '<div class="bonus-hint">点一点超级金蛋</div>' +
    '</div>';

  if (getSettings().autoSpeak) say(state.currentPromptSpeech);

  const giant = $('#giant-egg');
  giant.addEventListener('click', function () {
    if (giant.classList.contains('smashing')) return;
    giant.classList.add('smashing');
    Sfx.hit();
    vibrate(25);
    swingHammer();

    setTimeout(function () {
      Sfx.crack();
      giant.classList.add('opened');
      setTimeout(function () {
        Sfx.win();
        Sfx.star();
        vibrate([30, 50, 30, 50, 60]);
        confettiAt(giant, 50);
        rainConfetti(46);
        $('#bonus-reveal').classList.add('show');
        if (getSettings().autoSpeak) {
          say(state.review ? '太棒了，复习完成！' : '太棒了！你获得了一枚新奖章！');
        }
        setTimeout(finishLevel, 1850);
      }, 300);
    }, 280);
  });
}

/* ---------------- 通关结算 ---------------- */
function finishLevel() {
  clearTimeout(state.hintTimer);
  const level = state.level;
  const stars = state.mistakes === 0 ? 3 : (state.mistakes <= 2 ? 2 : 1);
  let nextLevel = null;
  let newSticker = false;

  if (!state.review) {
    const id = level.id;
    save.stars[id] = Math.max(save.stars[id] || 0, stars);
    if (save.stickers.indexOf(id) === -1) {
      save.stickers.push(id);
      newSticker = true;
    }
    save.unlocked = Math.max(save.unlocked, Math.min(id + 1, LEVELS.length));
    persist();
    if (id < LEVELS.length) nextLevel = LEVELS[id];
  }

  let starHtml = '';
  for (let i = 1; i <= 3; i++) {
    starHtml += '<span class="star' + (i <= stars ? ' on' : '') + '" style="--d:' + i + '">⭐</span>';
  }

  const learnedHtml = level.chars.map(function (c) {
    return '<span class="mini-char kai">' + c.c + '</span>';
  }).join('');

  openModal(
    '<div class="complete-title">' + (state.review ? '复习完成！' : '第 ' + level.id + ' 关完成！') + '</div>' +
    '<div class="big-stars">' + starHtml + '</div>' +
    '<div class="complete-sub">' + (state.review ? '你真是复习小达人' : (newSticker ? '获得一枚新奖章' : '又完成一次，真棒')) + '</div>' +
    '<div class="complete-sticker">' + (level.sticker || '🏆') + '</div>' +
    '<div class="complete-learned">学会了：' + learnedHtml + '</div>' +
    '<div class="modal-btns">' +
      (nextLevel ? '<button class="btn primary" id="m-next">下一关 →</button>' : '') +
      '<button class="btn ghost" id="m-replay">' + (state.review ? '再复习一次' : '再玩一次') + '</button>' +
      '<button class="btn ghost" id="m-map">回地图</button>' +
    '</div>'
  );

  rainConfetti(70);
  const names = level.chars.map(function (c) { return c.c; }).join('、');
  if (getSettings().autoSpeak) {
    say(state.review ? '复习完成，你真棒！' : '太棒了！你学会了' + names + '！');
  }

  $('#m-replay').addEventListener('click', function () {
    Sfx.click();
    closeModal();
    if (state.review) startReview();
    else startLevel(level, false);
  });

  $('#m-map').addEventListener('click', function () {
    Sfx.click();
    closeModal();
    showScreen('map');
  });

  if (nextLevel) {
    const goNext = function () {
      Sfx.click();
      closeModal();
      startLevel(nextLevel, false);
    };
    $('#m-next').addEventListener('click', goNext);
    if (getSettings().autoNext) {
      setTimeout(function () {
        if ($('#m-next')) goNext();
      }, 3600);
    }
  }
}

/* ---------------- 离开确认 ---------------- */
function requestExit() {
  clearTimeout(state.hintTimer);
  openModal(
    '<div class="confirm-emoji">🐣</div>' +
    '<h3>要离开这一关吗？</h3>' +
    '<p class="modal-desc">已经敲开的金蛋和星星不会保存哦</p>' +
    '<div class="modal-btns">' +
      '<button class="btn primary" id="stay-btn">继续玩</button>' +
      '<button class="btn ghost" id="leave-btn">回地图</button>' +
    '</div>',
    { dismissible: true }
  );
  $('#stay-btn').addEventListener('click', function () {
    Sfx.click();
    closeModal();
  });
  $('#leave-btn').addEventListener('click', function () {
    Sfx.click();
    closeModal();
    stopSpeaking();
    showScreen('map');
  });
}

/* ---------------- 小锤子 ---------------- */
const hammer = $('#hammer');
const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

if (finePointer) {
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    hammer.style.opacity = '1';
    hammer.style.left = e.clientX + 'px';
    hammer.style.top = e.clientY + 'px';
  });
  document.addEventListener('pointerleave', function () {
    hammer.style.opacity = '0';
  });
}

function swingHammer() {
  if (!finePointer) return;
  hammer.classList.remove('swing');
  void hammer.offsetWidth;
  hammer.classList.add('swing');
  setTimeout(function () {
    hammer.classList.remove('swing');
  }, 280);
}

/* ---------------- 初始化 ---------------- */
function initGame() {
  initNavigation();
  updateSoundUI();

  $('#btn-exit').addEventListener('click', function () {
    Sfx.click();
    requestExit();
  });

  $('#btn-repeat').addEventListener('click', function () {
    startAudio();
    Sfx.pop();
    say(state.currentPromptSpeech || '再听一遍');
    const btn = $('#btn-repeat');
    btn.classList.add('playing');
    setTimeout(function () { btn.classList.remove('playing'); }, 1200);
  });

  // 方便的直达链接：index.html?level=5 （家长/测试用）
  const params = new URLSearchParams(window.location.search);
  const lvParam = parseInt(params.get('level'), 10);
  if (lvParam >= 1 && lvParam <= LEVELS.length) {
    startLevel(LEVELS[lvParam - 1], false);
    return;
  }

  renderHome();
  showScreen('home');
}

initGame();
