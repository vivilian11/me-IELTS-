import { showToast } from './toast.js';

let _data, _save;
let queue = [];
let current = 0;
let sessionCorrect = 0;
let sessionTotal = 0;
let revealed = false;

export function initReview(data, save) {
  _data = data;
  _save = save;
}

export function startReview(mode) {
  let pool;
  if (mode === 'weak') {
    pool = _data.words.filter(w => w.status === 'new' || w.status === 'shaky');
  } else if (mode === 'all') {
    pool = [..._data.words];
  } else {
    pool = _data.words.filter(w => w.status === 'mastered');
  }

  if (pool.length === 0) {
    showToast(mode === 'weak' ? '没有需要复习的单词，继续加油！' : '词库是空的，先去添加单词吧');
    return;
  }

  queue = shuffle(pool).slice(0, Math.min(10, pool.length));
  current = 0;
  sessionCorrect = 0;
  sessionTotal = queue.length;
  revealed = false;

  document.getElementById('review-setup').style.display = 'none';
  document.getElementById('review-session').style.display = 'block';
  document.getElementById('review-result').style.display = 'none';
  renderCard();
}

function renderCard() {
  if (current >= queue.length) {
    showResult();
    return;
  }

  const w = queue[current];
  revealed = false;

  document.getElementById('review-progress-text').textContent =
    `${current + 1} / ${queue.length}`;
  document.getElementById('review-progress-fill').style.width =
    `${Math.round(current / queue.length * 100)}%`;

  document.getElementById('review-word').textContent = w.word;
  document.getElementById('review-phonetic').textContent = w.phonetic || '';
  document.getElementById('review-answer').style.display = 'none';
  document.getElementById('review-btns').style.display = 'none';
  document.getElementById('btn-reveal').style.display = 'block';
}

export function revealAnswer() {
  const w = queue[current];
  document.getElementById('review-meaning').textContent = w.meaning;
  document.getElementById('review-sentence').textContent = w.sentence ? `"${w.sentence}"` : '';
  document.getElementById('review-memory-tip').textContent = w.memory ? `💡 ${w.memory}` : '';
  document.getElementById('review-answer').style.display = 'block';
  document.getElementById('review-btns').style.display = 'flex';
  document.getElementById('btn-reveal').style.display = 'none';
  revealed = true;
}

export function markAnswer(correct) {
  if (!revealed) return;
  const w = queue[current];
  if (correct) {
    sessionCorrect++;
    if (w.status === 'new') { w.status = 'shaky'; _save(); }
    else if (w.status === 'shaky') { w.status = 'mastered'; _save(); }
  } else {
    if (w.status === 'mastered') { w.status = 'shaky'; _save(); }
    else if (w.status === 'shaky') { w.status = 'new'; _save(); }
  }
  current++;
  renderCard();
}

function showResult() {
  document.getElementById('review-session').style.display = 'none';
  document.getElementById('review-result').style.display = 'block';

  const pct = Math.round(sessionCorrect / sessionTotal * 100);
  document.getElementById('result-score').textContent = `${sessionCorrect} / ${sessionTotal}`;
  document.getElementById('result-pct').textContent = `${pct}%`;

  let msg, emoji;
  if (pct === 100)     { msg = '完美！你太厉害了！';        emoji = '🏆'; }
  else if (pct >= 80)  { msg = '很棒！继续保持这个状态！';  emoji = '🌟'; }
  else if (pct >= 60)  { msg = '不错哦，还有进步空间～';    emoji = '💪'; }
  else                 { msg = '没关系，再多复习几次！';     emoji = '📚'; }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-msg').textContent   = msg;
}

export function exitReview() {
  document.getElementById('review-setup').style.display = 'block';
  document.getElementById('review-session').style.display = 'none';
  document.getElementById('review-result').style.display = 'none';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
