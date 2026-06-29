import { WORD_PACKS } from './wordpacks.js';
import { showToast } from './toast.js';

let _data, _save;

export function initPacks(data, save) {
  _data = data;
  _save = save;
}

export function renderPacks() {
  const container = document.getElementById('packs-list');
  container.innerHTML = WORD_PACKS.map(pack => {
    const imported = pack.words.filter(pw =>
      _data.words.some(w => w.word === pw.word)
    ).length;
    const total = pack.words.length;
    const allDone = imported === total;

    return `
      <div class="pack-card">
        <div class="pack-header">
          <div>
            <div class="pack-name">${pack.name}</div>
            <div class="pack-meta">${total} 个单词 · 已导入 ${imported}</div>
          </div>
          <button class="btn-import ${allDone ? 'done' : ''}"
            onclick="importPack('${pack.id}')" ${allDone ? 'disabled' : ''}>
            ${allDone ? '✅ 已全部导入' : '导入词包'}
          </button>
        </div>
        <div class="pack-progress-bar">
          <div class="pack-progress-fill" style="width:${Math.round(imported/total*100)}%"></div>
        </div>
        <div class="pack-preview">
          ${pack.words.slice(0, 4).map(w => `
            <span class="preview-word ${_data.words.some(x => x.word === w.word) ? 'imported' : ''}">
              ${w.word}
            </span>
          `).join('')}
          ${total > 4 ? `<span class="preview-more">+${total - 4} 个</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

export function importPack(packId) {
  const pack = WORD_PACKS.find(p => p.id === packId);
  if (!pack) return;

  let added = 0;
  pack.words.forEach(pw => {
    if (!_data.words.some(w => w.word === pw.word)) {
      _data.words.unshift({ ...pw, id: Date.now() + Math.random(), status: 'new' });
      added++;
    }
  });

  if (added === 0) {
    showToast('这个词包已经全部导入了 ✅');
  } else {
    _save();
    showToast(`成功导入 ${added} 个单词！去词汇页看看吧 📚`);
  }
  renderPacks();
}
