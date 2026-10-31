// Application Registry & .webapp Package Installation Engine
import vfs from './vfs.js';
import macSound from './sound.js';

// Pre-packaged Store Apps available for live 1-click installation
export const APP_STORE_CATALOG = [
  {
    id: 'com.developer.markdown',
    name: 'Markdown Studio',
    version: '1.2.0',
    category: 'Productivity',
    developer: 'AppleTree Software Labs',
    rating: 4.9,
    reviews: 1420,
    size: '1.8 MB',
    iconColor: 'from-purple-500 to-indigo-600',
    iconType: 'markdown',
    description: 'Professional markdown workspace with split-screen real-time HTML rendering, table formatting, and export to PDF/HTML.',
    screenshots: ['Split editing', 'Live MathJax', 'GitHub flavored markdown'],
    permissions: ['storage'],
    window: { w: 860, h: 540, minW: 600, minH: 400 },
    entryCode: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { background: #0f172a; color: #f8fafc; font-family: ui-sans-serif, system-ui; }
          textarea { font-family: monospace; }
        </style>
      </head>
      <body class="h-screen flex flex-col p-4">
        <header class="flex items-center justify-between pb-3 border-b border-slate-700">
          <div class="flex items-center gap-2 font-bold text-purple-400">
            <span>📝 Markdown Studio</span>
          </div>
          <button id="saveBtn" class="bg-purple-600 hover:bg-purple-500 text-xs px-3 py-1.5 rounded-lg font-bold text-white transition">Save to Documents</button>
        </header>
        <div class="flex-1 flex gap-4 pt-4 overflow-hidden">
          <textarea id="editor" class="w-1/2 h-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 outline-none resize-none focus:border-purple-500" placeholder="# Enter Markdown here..."></textarea>
          <div id="preview" class="w-1/2 h-full bg-slate-900/60 border border-slate-800 rounded-xl p-4 overflow-y-auto prose prose-invert text-sm"></div>
        </div>
        <script>
          const ed = document.getElementById('editor');
          const prev = document.getElementById('preview');
          ed.value = "# Hello from Markdown Studio!\\n\\nWelcome to your installed **.webapp** package!\\n\\n- Instant reactive rendering\\n- Real sandboxed execution\\n- Safe offline storage\\n\\n\`\`\`javascript\\nconsole.log('macOS Web OS is live!');\\n\`\`\`";
          function render() {
            let html = ed.value
              .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-purple-300 my-2">$1</h1>')
              .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-purple-400 my-2">$1</h2>')
              .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-slate-200 my-1">$1</h3>')
              .replace(/\\*\\*(.*?)\\*\\*/gim, '<strong class="text-white">$1</strong>')
              .replace(/\\*(.*?)\\*/gim, '<em class="text-purple-200">$1</em>')
              .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')
              .replace(/\\n/gim, '<br/>');
            prev.innerHTML = html;
          }
          ed.addEventListener('input', render);
          render();
          document.getElementById('saveBtn').addEventListener('click', () => {
            alert('Document saved to /Users/admin/Documents/note.md!');
          });
        </script>
      </body>
      </html>
    `
  },
  {
    id: 'com.games.2048',
    name: '2048 Arcade',
    version: '2.0.4',
    category: 'Games',
    developer: 'Gabriele Cirulli & AppleTree',
    rating: 4.8,
    reviews: 3100,
    size: '840 KB',
    iconColor: 'from-amber-500 to-orange-600',
    iconType: 'game',
    description: 'The addictive numeric sliding block puzzle game. Join the numbers to reach the 2048 tile in high definition with smooth animations!',
    permissions: [],
    window: { w: 480, h: 620, minW: 420, minH: 560 },
    entryCode: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { background: #faf8ef; color: #776e65; font-family: system-ui; touch-action: none; }
          .tile { display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 8px; font-size: 24px; transition: transform 0.1s; }
          .tile-0 { background: #cdc1b4; }
          .tile-2 { background: #eee4da; color: #776e65; }
          .tile-4 { background: #ede0c8; color: #776e65; }
          .tile-8 { background: #f2b179; color: #f9f6f2; }
          .tile-16 { background: #f59563; color: #f9f6f2; }
          .tile-32 { background: #f67c5f; color: #f9f6f2; }
          .tile-64 { background: #f65e3b; color: #f9f6f2; }
          .tile-128 { background: #edcf72; color: #f9f6f2; font-size: 20px; }
          .tile-256 { background: #edcc61; color: #f9f6f2; font-size: 20px; }
          .tile-512 { background: #edc850; color: #f9f6f2; font-size: 20px; }
          .tile-1024 { background: #edc53f; color: #f9f6f2; font-size: 18px; }
          .tile-2048 { background: #edc22e; color: #f9f6f2; font-size: 18px; }
        </style>
      </head>
      <body class="flex flex-col items-center justify-center min-h-screen p-4 select-none">
        <div class="w-full max-w-sm flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-black text-amber-700">2048</h1>
            <p class="text-xs text-stone-500">Join numbers, get to 2048!</p>
          </div>
          <div class="flex gap-2">
            <div class="bg-stone-300 px-3 py-1 rounded-lg text-center font-bold text-xs">
              SCORE<br/><span id="scoreVal" class="text-sm text-stone-800">0</span>
            </div>
            <button id="resetBtn" class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1 rounded-lg text-xs transition">New</button>
          </div>
        </div>
        <div id="board" class="w-72 h-72 bg-[#bbada0] p-2 rounded-xl grid grid-cols-4 gap-2 shadow-inner"></div>
        <div class="mt-4 text-xs text-stone-500 font-medium">Use Arrow keys (← ↑ → ↓) on your keyboard</div>
        <script>
          let grid = Array(4).fill().map(() => Array(4).fill(0));
          let score = 0;
          function spawn() {
            let empties = [];
            for (let r=0; r<4; r++) for (let c=0; c<4; c++) if (grid[r][c] === 0) empties.push({r,c});
            if (!empties.length) return;
            let pick = empties[Math.floor(Math.random() * empties.length)];
            grid[pick.r][pick.c] = Math.random() < 0.9 ? 2 : 4;
          }
          function render() {
            const b = document.getElementById('board');
            b.innerHTML = '';
            for (let r=0; r<4; r++) {
              for (let c=0; c<4; c++) {
                const val = grid[r][c];
                const d = document.createElement('div');
                d.className = 'tile tile-' + (val > 2048 ? 2048 : val);
                d.innerText = val > 0 ? val : '';
                b.appendChild(d);
              }
            }
            document.getElementById('scoreVal').innerText = score;
          }
          function slide(row) {
            let arr = row.filter(x => x !== 0);
            for (let i=0; i<arr.length-1; i++) {
              if (arr[i] === arr[i+1]) {
                arr[i] *= 2;
                score += arr[i];
                arr[i+1] = 0;
              }
            }
            arr = arr.filter(x => x !== 0);
            while (arr.length < 4) arr.push(0);
            return arr;
          }
          function moveLeft() {
            let changed = false;
            for (let r=0; r<4; r++) {
              let next = slide(grid[r]);
              if (next.join(',') !== grid[r].join(',')) changed = true;
              grid[r] = next;
            }
            if (changed) { spawn(); render(); }
          }
          function moveRight() {
            let changed = false;
            for (let r=0; r<4; r++) {
              let rev = [...grid[r]].reverse();
              let next = slide(rev).reverse();
              if (next.join(',') !== grid[r].join(',')) changed = true;
              grid[r] = next;
            }
            if (changed) { spawn(); render(); }
          }
          function moveUp() {
            let changed = false;
            for (let c=0; c<4; c++) {
              let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
              let next = slide(col);
              if (next.join(',') !== col.join(',')) changed = true;
              for (let r=0; r<4; r++) grid[r][c] = next[r];
            }
            if (changed) { spawn(); render(); }
          }
          function moveDown() {
            let changed = false;
            for (let c=0; c<4; c++) {
              let col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
              let next = slide(col);
              let unrev = next.reverse();
              if (unrev.join(',') !== [grid[0][c], grid[1][c], grid[2][c], grid[3][c]].join(',')) changed = true;
              for (let r=0; r<4; r++) grid[r][c] = unrev[r];
            }
            if (changed) { spawn(); render(); }
          }
          window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') moveLeft();
            else if (e.key === 'ArrowRight') moveRight();
            else if (e.key === 'ArrowUp') moveUp();
            else if (e.key === 'ArrowDown') moveDown();
          });
          document.getElementById('resetBtn').addEventListener('click', () => {
            grid = Array(4).fill().map(() => Array(4).fill(0));
            score = 0;
            spawn(); spawn(); render();
          });
          spawn(); spawn(); render();
        </script>
      </body>
      </html>
    `
  },
  {
    id: 'com.design.sketchpad',
    name: 'Canvas & Sketch Studio',
    version: '1.0.8',
    category: 'Design',
    developer: 'Creative Suite Pro',
    rating: 4.7,
    reviews: 950,
    size: '1.2 MB',
    iconColor: 'from-pink-500 to-rose-600',
    iconType: 'paint',
    description: 'Vector-smooth digital sketchpad and drawing canvas with RGB palette, brush sizes, layers, eraser, and instant PNG export.',
    permissions: ['storage'],
    window: { w: 760, h: 560, minW: 500, minH: 400 },
    entryCode: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>body { background: #1e1e2e; color: #fff; margin: 0; user-select: none; font-family: system-ui; }</style>
      </head>
      <body class="h-screen flex flex-col p-3">
        <div class="flex items-center justify-between pb-2 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span class="font-bold text-pink-400 text-sm">🎨 Sketch Studio</span>
            <input type="color" id="colorPicker" value="#ec4899" class="w-7 h-7 rounded border-none cursor-pointer"/>
            <input type="range" id="sizePicker" min="1" max="40" value="4" class="w-24 accent-pink-500"/>
            <button id="clearBtn" class="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-xs">Clear</button>
          </div>
          <button id="downloadBtn" class="bg-pink-600 hover:bg-pink-500 px-3 py-1 rounded-lg text-xs font-bold transition">Save PNG</button>
        </div>
        <div class="flex-1 mt-3 bg-white rounded-xl overflow-hidden shadow-2xl relative">
          <canvas id="c" class="w-full h-full block cursor-crosshair"></canvas>
        </div>
        <script>
          const cvs = document.getElementById('c');
          const ctx = cvs.getContext('2d');
          function resize() {
            cvs.width = cvs.parentElement.clientWidth;
            cvs.height = cvs.parentElement.clientHeight;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, cvs.width, cvs.height);
          }
          window.addEventListener('resize', resize);
          setTimeout(resize, 100);

          let drawing = false;
          let color = '#ec4899';
          let size = 4;

          document.getElementById('colorPicker').addEventListener('input', e => color = e.target.value);
          document.getElementById('sizePicker').addEventListener('input', e => size = e.target.value);
          document.getElementById('clearBtn').addEventListener('click', resize);
          document.getElementById('downloadBtn').addEventListener('click', () => {
            const a = document.createElement('a');
            a.download = 'sketch-' + Date.now() + '.png';
            a.href = cvs.toDataURL();
            a.click();
          });

          cvs.addEventListener('mousedown', (e) => {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
          });
          cvs.addEventListener('mousemove', (e) => {
            if (!drawing) return;
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
          });
          window.addEventListener('mouseup', () => drawing = false);
        </script>
      </body>
      </html>
    `
  },
  {
    id: 'com.productivity.pomodoro',
    name: 'Pomodoro Focus Flow',
    version: '2.1.0',
    category: 'Productivity',
    developer: 'Zenith Workflows',
    rating: 4.9,
    reviews: 2400,
    size: '950 KB',
    iconColor: 'from-emerald-500 to-teal-600',
    iconType: 'timer',
    description: 'Scientifically calibrated 25/5 interval productivity clock with ambient sound generator and session statistics.',
    permissions: ['notifications'],
    window: { w: 420, h: 500, minW: 360, minH: 450 },
    entryCode: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>body { background: #0f172a; color: white; font-family: system-ui; }</style>
      </head>
      <body class="min-h-screen flex flex-col items-center justify-center p-6 text-center select-none">
        <h2 class="text-sm font-semibold tracking-widest text-emerald-400 uppercase mb-4">Focus Timer</h2>
        <div class="relative w-56 h-56 rounded-full border-4 border-emerald-500/20 flex flex-col items-center justify-center bg-slate-900/80 shadow-2xl">
          <span id="time" class="text-5xl font-mono font-black text-white">25:00</span>
          <span id="mode" class="text-xs text-emerald-400 mt-2 font-bold uppercase">Focus Mode</span>
        </div>
        <div class="flex items-center gap-3 mt-8">
          <button id="toggleBtn" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded-xl text-sm transition shadow-lg shadow-emerald-900/40">Start</button>
          <button id="resetBtn" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-sm transition">Reset</button>
        </div>
        <script>
          let timeLeft = 25 * 60;
          let running = false;
          let interval = null;
          const timeEl = document.getElementById('time');
          const toggleBtn = document.getElementById('toggleBtn');
          const resetBtn = document.getElementById('resetBtn');

          function updateDisplay() {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            timeEl.innerText = m + ':' + s;
          }

          toggleBtn.addEventListener('click', () => {
            if (running) {
              clearInterval(interval);
              toggleBtn.innerText = 'Resume';
              running = false;
            } else {
              running = true;
              toggleBtn.innerText = 'Pause';
              interval = setInterval(() => {
                if (timeLeft > 0) {
                  timeLeft--;
                  updateDisplay();
                } else {
                  clearInterval(interval);
                  alert('Session complete! Take a well-deserved 5 minute break.');
                  timeLeft = 5 * 60;
                  updateDisplay();
                }
              }, 1000);
            }
          });

          resetBtn.addEventListener('click', () => {
            clearInterval(interval);
            running = false;
            timeLeft = 25 * 60;
            toggleBtn.innerText = 'Start';
            updateDisplay();
          });
        </script>
      </body>
      </html>
    `
  },
  {
    id: 'com.tools.jsonviewer',
    name: 'JSON Inspector & Beautifier',
    version: '1.4.1',
    category: 'Utilities',
    developer: 'DevTools Suite',
    rating: 4.8,
    reviews: 1800,
    size: '1.1 MB',
    iconColor: 'from-sky-500 to-blue-600',
    iconType: 'json',
    description: 'Instant JSON tree exploration, syntax validation, key counter, minifier, and format fixer for developers.',
    permissions: ['storage'],
    window: { w: 780, h: 540, minW: 550, minH: 400 },
    entryCode: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>body { background: #090d16; color: #e2e8f0; font-family: monospace; }</style>
      </head>
      <body class="h-screen flex flex-col p-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <span class="font-bold text-sky-400 text-sm">{ } JSON Inspector Pro</span>
          <div class="flex gap-2">
            <button id="fmtBtn" class="bg-sky-600 hover:bg-sky-500 text-xs px-3 py-1 rounded text-white font-bold">Beautify</button>
            <button id="minBtn" class="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1 rounded text-slate-300 font-bold">Minify</button>
          </div>
        </div>
        <div class="flex-1 flex gap-3 pt-3 overflow-hidden">
          <textarea id="inp" class="w-1/2 h-full bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs outline-none text-sky-300" placeholder='{"hello": "world"}'></textarea>
          <pre id="out" class="w-1/2 h-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs overflow-auto text-emerald-400"></pre>
        </div>
        <script>
          const inp = document.getElementById('inp');
          const out = document.getElementById('out');
          inp.value = JSON.stringify({ project: "macOS Sequoia", engine: "Monaco + WebOS", installedPackages: 4, isOnline: true }, null, 2);
          function update() {
            try {
              const parsed = JSON.parse(inp.value);
              out.innerText = JSON.stringify(parsed, null, 2);
              out.className = "w-1/2 h-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs overflow-auto text-emerald-400";
            } catch(e) {
              out.innerText = "❌ JSON Parse Error:\\n" + e.message;
              out.className = "w-1/2 h-full bg-slate-950 border border-rose-900/50 p-3 rounded-lg text-xs overflow-auto text-rose-400";
            }
          }
          inp.addEventListener('input', update);
          document.getElementById('fmtBtn').addEventListener('click', update);
          document.getElementById('minBtn').addEventListener('click', () => {
            try {
              out.innerText = JSON.stringify(JSON.parse(inp.value));
            } catch(e){}
          });
          update();
        </script>
      </body>
      </html>
    `
  }
];

// Built-in System Applications
export const BUILTIN_APPLICATIONS = [
  {
    id: 'mysql-studio',
    name: 'MySQL Studio',
    version: '8.4.0',
    category: 'Developer Tools',
    developer: 'Oracle / AppleTree',
    description: 'Enterprise Relational Database Management Suite (MySQL 8.4 LTS)',
    iconType: 'mysql',
    isBuiltin: true
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    version: '1.93.0',
    category: 'Developer Tools',
    developer: 'Microsoft',
    description: 'Code editing. Redefined.',
    iconType: 'code',
    isBuiltin: true
  },
  {
    id: 'javamanager',
    name: 'Java Manager',
    version: '21.0.3',
    category: 'Developer Tools',
    developer: 'OpenJDK',
    description: 'Java Development Kit & Runtime Environment Manager',
    iconType: 'java',
    isBuiltin: true
  },
  {
    id: 'terminal',
    name: 'Terminal',
    version: '3.2.0',
    category: 'Utilities',
    developer: 'Apple',
    description: 'macOS Zsh Shell Terminal',
    iconType: 'terminal',
    isBuiltin: true
  },
  {
    id: 'finder',
    name: 'Finder',
    version: '15.2.0',
    category: 'System',
    developer: 'Apple',
    description: 'macOS File Manager',
    iconType: 'finder',
    isBuiltin: true
  },
  {
    id: 'safari',
    name: 'Safari',
    version: '18.0.0',
    category: 'Internet',
    developer: 'Apple',
    description: 'Web Browser',
    iconType: 'safari',
    isBuiltin: true
  }
];

class ApplicationRegistry {
  constructor() {
    this.installedApps = new Map();
    this.listeners = new Set();
    this.init();
  }

  async init() {
    this.loadInstalledFromStorage();
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  notify(event) {
    this.listeners.forEach(cb => {
      try { cb(event); } catch (e) { console.error('AppRegistry listener error:', e); }
    });
  }

  loadInstalledFromStorage() {
    try {
      const saved = localStorage.getItem('macos_installed_apps');
      if (saved) {
        const list = JSON.parse(saved);
        list.forEach(app => this.installedApps.set(app.id, app));
      } else {
        // Install 2 default featured packages initially
        const defaultInstalls = [APP_STORE_CATALOG[0], APP_STORE_CATALOG[1]];
        defaultInstalls.forEach(app => this.installedApps.set(app.id, app));
        this.saveToStorage();
      }
    } catch {
      // LocalStorage access fallback
    }
  }

  saveToStorage() {
    try {
      const arr = Array.from(this.installedApps.values());
      localStorage.setItem('macos_installed_apps', JSON.stringify(arr));
    } catch {}
  }

  getInstalledApps() {
    return Array.from(this.installedApps.values());
  }

  isInstalled(appId) {
    return this.installedApps.has(appId);
  }

  async installApp(appPackage) {
    // 1. Verify schema
    if (!appPackage.id || !appPackage.name) {
      throw new Error('Invalid application manifest: Missing id or name.');
    }

    // 2. Persist to Virtual Filesystem in /Applications/{id}.webapp
    const vfsPath = `/Applications/${appPackage.id}.webapp`;
    await vfs.writeFile(vfsPath, JSON.stringify(appPackage, null, 2), 'application/json');

    // 3. Register in memory and localStorage
    const record = {
      ...appPackage,
      installedAt: Date.now()
    };
    this.installedApps.set(appPackage.id, record);
    this.saveToStorage();

    // 4. Play notification sound
    macSound.playPop();

    // 5. Notify observers
    this.notify({ type: 'installed', app: record });
    return record;
  }

  async uninstallApp(appId) {
    if (!this.installedApps.has(appId)) return false;

    // Remove from VFS
    const vfsPath = `/Applications/${appId}.webapp`;
    try {
      await vfs.delete(vfsPath, false);
    } catch {}

    this.installedApps.delete(appId);
    this.saveToStorage();

    macSound.playTrash();
    this.notify({ type: 'uninstalled', appId });
    return true;
  }

  getBuiltinApps() {
    return BUILTIN_APPLICATIONS;
  }

  getAllApps() {
    return [...BUILTIN_APPLICATIONS, ...Array.from(this.installedApps.values())];
  }

  getApp(appId) {
    if (appId === 'mysqlstudio' || appId === 'mysql-studio') {
      return BUILTIN_APPLICATIONS.find(a => a.id === 'mysql-studio');
    }
    const builtin = BUILTIN_APPLICATIONS.find(a => a.id === appId);
    if (builtin) return builtin;
    if (this.installedApps.has(appId)) {
      return this.installedApps.get(appId);
    }
    return APP_STORE_CATALOG.find(a => a.id === appId) || null;
  }
}

export const appRegistry = new ApplicationRegistry();
export default appRegistry;
