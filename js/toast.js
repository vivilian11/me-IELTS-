const el = document.getElementById('toast');
let timer = null;

export function showToast(msg) {
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('show'), 2200);
}
