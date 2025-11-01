/* BetterPuterOS – minimal window manager */
const $ = sel => document.querySelector(sel);
const desktop = $('#desktop');
const dock    = $('#dock');
const winTpl  = $('#winTpl');
const timeEl  = $('#time');

/* ===== clock ===== */
const updateTime = () => {
  timeEl.textContent = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format();
};
setInterval(updateTime, 1000);
updateTime();

/* ===== window factory ===== */
let zIndex = 10;
const makeWindow = (title = 'App', content = '<p>Hello!</p>') => {
  const node = winTpl.content.cloneNode(true);
  const win  = node.querySelector('.window');
  win.querySelector('.win-title').textContent = title;
  win.querySelector('.win-content').innerHTML = content;
  desktop.appendChild(win);
  bringToFront(win);

  /* drag */
  const bar = win.querySelector('.win-bar');
  let dragging = false, dx, dy;
  bar.onmousedown = e => {
    dragging = true;
    dx = e.clientX - win.offsetLeft;
    dy = e.clientY - win.offsetTop;
  };
  window.onmousemove = e => {
    if (!dragging) return;
    win.style.left = `${e.clientX - dx}px`;
    win.style.top  = `${e.clientY - dy}px`;
  };
  window.onmouseup = () => dragging = false;

  /* resize */
  const handle = win.querySelector('.resize-handle');
  handle.onmousedown = e => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.offsetWidth;
    const startH = win.offsetHeight;
    const onMove = ev => {
      win.style.width  = `${startW + ev.clientX - startX}px`;
      win.style.height = `${startH + ev.clientY - startY}px`;
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  /* controls */
  win.querySelector('.win-close').onclick = () => win.remove();
  win.querySelector('.win-max').onclick   = () => {
    win.style.left = win.style.top = '0';
    win.style.width = win.style.height = '100%';
  };
  win.onmousedown = () => bringToFront(win);
};

const bringToFront = win => {
  win.style.zIndex = ++zIndex;
};

/* ===== app launcher ===== */
const apps = {
  files:  { title: 'Files',  html: '<p>File manager coming soon…</p>' },
  code:   { title: 'Code',   html: '<textarea style="width:100%;height:100%;background:transparent;color:inherit;border:none;resize:none;" placeholder="// write code here"></textarea>' },
  music:  { title: 'Music',  html: '<audio controls style="width:100%;" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"></audio>' },
  about:  { title: 'About',  html: '<h3>BetterPuterOS</h3><p>A fast, free, beautiful web-desktop.</p>' }
};

dock.addEventListener('click', e => {
  if (!e.target.dataset.app) return;
  const app = apps[e.target.dataset.app];
  makeWindow(app.title, app.html);
});
