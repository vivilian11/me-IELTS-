import { showToast } from './toast.js';

let _data, _save;

export function initLog(data, save) {
  _data = data;
  _save = save;
}

export function renderLog() {
  const list = document.getElementById('log-list');
  if (_data.logs.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="emoji">📅</div>
        <p>还没有打卡记录，今天来第一次吧！</p>
      </div>`;
    return;
  }

  list.innerHTML = _data.logs.map(l => `
    <div class="log-card">
      <div class="log-date">📅 ${l.date}</div>
      <div class="log-content">${l.text.replace(/\n/g, '<br>')}</div>
    </div>
  `).join('');
}

export function saveLog() {
  const text = document.getElementById('log-text').value.trim();
  if (!text) { showToast('写点东西再打卡吧 😊'); return; }

  const today     = new Date().toLocaleDateString('zh-CN');
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('zh-CN');

  if (_data.lastLogDate === yesterday) {
    _data.streak += 1;
  } else if (_data.lastLogDate !== today) {
    _data.streak = 1;
  }
  _data.lastLogDate = today;
  _data.logs.unshift({ id: Date.now(), date: today, text });

  document.getElementById('log-text').value = '';
  _save();
  renderLog();
  showToast(`打卡成功！🔥 已连续 ${_data.streak} 天`);
}
