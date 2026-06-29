import { showToast } from './toast.js';

let _data, _save;

export function initGrammar(data, save) {
  _data = data;
  _save = save;
}

export function renderGrammar() {
  const list = document.getElementById('grammar-list');
  if (_data.grammar.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🎉</div>
        <p>暂时没有语法错误记录，继续保持！</p>
      </div>`;
    return;
  }

  list.innerHTML = _data.grammar.map(g => `
    <div class="grammar-card">
      <div class="grammar-title">⚠️ ${g.title}</div>
      <div class="wrong-right">
        <div class="wrong-box"><div class="box-label">❌ 错误</div>${g.wrong}</div>
        <div class="right-box"><div class="box-label">✅ 正确</div>${g.right}</div>
      </div>
      ${g.note ? `<div class="grammar-note">📌 ${g.note}</div>` : ''}
      ${g.rule ? `<div class="grammar-rule">📖 规则：${g.rule}</div>` : ''}
    </div>
  `).join('');
}

export function addGrammar() {
  const title = document.getElementById('g-title').value.trim();
  const wrong = document.getElementById('g-wrong').value.trim();
  const right = document.getElementById('g-right').value.trim();
  if (!title || !wrong || !right) { showToast('类型、错误句和正确句都要填哦'); return; }

  _data.grammar.unshift({
    id: Date.now(), title, wrong, right,
    note: document.getElementById('g-note').value.trim(),
    rule: document.getElementById('g-rule').value.trim(),
  });

  ['g-title','g-wrong','g-right','g-note','g-rule']
    .forEach(id => { document.getElementById(id).value = ''; });

  _save();
  renderGrammar();
  showToast('语法错误已记录！下次不会再犯 💪');
}
