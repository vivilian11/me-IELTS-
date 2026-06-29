import { showToast } from './toast.js';

let _data, _save;
let currentFilter = 'all';

export function initVocab(data, save) {
  _data = data;
  _save = save;
}

export function renderVocab() {
  updateStats();
  const words = currentFilter === 'all'
    ? _data.words
    : _data.words.filter(w => w.status === currentFilter);

  const list = document.getElementById('vocab-list');
  if (words.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🌱</div>
        <p>${currentFilter === 'all' ? '还没有单词，快去添加第一个！' : '这个分类还没有单词哦'}</p>
      </div>`;
    return;
  }

  list.innerHTML = words.map(w => `
    <div class="vocab-card" id="vc-${w.id}">
      <div class="vocab-card-inner">
        <div class="vocab-front">
          <div>
            <div class="vocab-word">${w.word}</div>
            ${w.phonetic ? `<div class="vocab-phonetic">${w.phonetic}</div>` : ''}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end">
            <span class="status-badge ${badgeClass(w.status)}">${badgeLabel(w.status)}</span>
            <span class="vocab-hint">点击翻面 →</span>
          </div>
        </div>
        <div class="vocab-back">
          <div>
            <div class="vocab-meaning">${w.meaning}</div>
            ${w.sentence ? `<div class="vocab-sentence">"${w.sentence}"</div>` : ''}
            ${w.memory  ? `<div class="vocab-memory">💡 ${w.memory}</div>` : ''}
          </div>
          <div class="status-row">
            <button class="status-btn btn-new ${w.status==='new'?'active':''}"
              data-id="${w.id}" data-status="new">🆕 新</button>
            <button class="status-btn btn-shaky ${w.status==='shaky'?'active':''}"
              data-id="${w.id}" data-status="shaky">😅 模糊</button>
            <button class="status-btn btn-mastered ${w.status==='mastered'?'active':''}"
              data-id="${w.id}" data-status="mastered">✅ 掌握</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.vocab-card').forEach(card => {
    card.addEventListener('click', e => {
      if (!e.target.closest('.status-row')) card.classList.toggle('flipped');
    });
  });

  list.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      setStatus(Number(btn.dataset.id), btn.dataset.status);
    });
  });
}

function setStatus(id, status) {
  const w = _data.words.find(x => x.id === id);
  if (!w) return;
  w.status = status;
  _save();
  renderVocab();
  const msgs = { mastered: '太棒了！又掌握一个单词 ✅', shaky: '继续加油，快要掌握了 💪', new: '加入新单词啦 🆕' };
  showToast(msgs[status]);
}

export function addWord() {
  const word    = document.getElementById('new-word').value.trim();
  const meaning = document.getElementById('new-meaning').value.trim();
  if (!word || !meaning) { showToast('单词和意思不能为空哦 😊'); return; }

  _data.words.unshift({
    id: Date.now(), word, meaning,
    phonetic: document.getElementById('new-phonetic').value.trim(),
    sentence: document.getElementById('new-sentence').value.trim(),
    memory:   document.getElementById('new-memory').value.trim(),
    status: 'new',
  });

  ['new-word','new-phonetic','new-meaning','new-sentence','new-memory']
    .forEach(id => { document.getElementById(id).value = ''; });

  _save();
  renderVocab();
  showToast(`"${word}" 已加入词库！🎉`);
}

export function filterVocab(filter, el) {
  currentFilter = filter;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderVocab();
}

function updateStats() {
  const mastered = _data.words.filter(w => w.status === 'mastered').length;
  const shaky    = _data.words.filter(w => w.status === 'shaky').length;
  const newW     = _data.words.filter(w => w.status === 'new').length;
  const total    = _data.words.length;

  document.getElementById('stat-mastered').textContent = mastered;
  document.getElementById('stat-shaky').textContent    = shaky;
  document.getElementById('stat-new').textContent      = newW;
  document.getElementById('streak-count').textContent  = _data.streak;
  document.getElementById('progress-text').textContent = `${mastered} / ${total}`;
  document.getElementById('progress-fill').style.width = total
    ? `${Math.round(mastered / total * 100)}%` : '0%';
}

function badgeClass(status) {
  return { new: 'badge-new', shaky: 'badge-shaky', mastered: 'badge-mastered' }[status];
}
function badgeLabel(status) {
  return { new: '🆕 新', shaky: '😅 模糊', mastered: '✅ 掌握' }[status];
}
