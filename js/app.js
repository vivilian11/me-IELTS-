import { loadData, saveData } from './data.js';
import { initVocab, renderVocab, addWord, filterVocab } from './vocab.js';
import { initGrammar, renderGrammar, addGrammar } from './grammar.js';
import { initLog, renderLog, saveLog } from './log.js';

const data = loadData();
const save = () => saveData(data);

initVocab(data, save);
initGrammar(data, save);
initLog(data, save);

// ---- Header date ----
function initDate() {
  const now  = new Date();
  const days = ['日','一','二','三','四','五','六'];
  document.getElementById('header-date').textContent =
    `${now.getMonth() + 1}月${now.getDate()}日 星期${days[now.getDay()]}`;
}

// ---- Page switching ----
function switchPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  document.getElementById(`nav-${name}`).classList.add('active');
  if (name === 'vocab')   renderVocab();
  if (name === 'grammar') renderGrammar();
  if (name === 'log')     renderLog();
}

// ---- Expose handlers to HTML ----
window.switchPage  = switchPage;
window.addWord     = addWord;
window.filterVocab = filterVocab;
window.addGrammar  = addGrammar;
window.saveLog     = saveLog;

// ---- Boot ----
initDate();
renderVocab();
