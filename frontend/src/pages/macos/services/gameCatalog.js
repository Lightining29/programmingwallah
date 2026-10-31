// Curated Playhop-inspired In-Desktop Game Catalog
// 100% Client-Side Executable - Zero External HTTP Redirects

export const GAME_CATEGORIES = [
  { id: 'all', name: 'All Games', icon: '🎮' },
  { id: 'action', name: 'Action', icon: '⚡' },
  { id: 'arcade', name: 'Arcade', icon: '🕹️' },
  { id: 'puzzle', name: 'Puzzle', icon: '🧩' },
  { id: 'strategy', name: 'Strategy', icon: '♟️' },
  { id: 'classic', name: 'Classic', icon: '🧱' },
  { id: 'casual', name: 'Casual', icon: '🎯' },
  { id: 'card', name: 'Card & Board', icon: '🃏' }
];

export const GAMES_CATALOG = [
  {
    id: 'game-2048',
    title: '2048 Arcade HD',
    category: 'puzzle',
    categoryName: 'Puzzle',
    rating: 4.9,
    plays: '142K',
    featured: true,
    badge: 'TOP HIT',
    developer: 'AppleTree Games Labs',
    tags: ['Numbers', 'Brain', 'Swipe', 'Logic'],
    description: 'The addictive numeric sliding block puzzle. Combine numbers to reach the legendary 2048 tile with crisp macOS animations!',
    controls: 'Use Arrow keys (← ↑ → ↓) or swipe to slide tiles',
    iconGradient: 'from-amber-500 via-orange-500 to-red-500',
    iconEmoji: '🔢',
    window: { w: 460, h: 630 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #18181b; color: #fafafa; font-family: ui-sans-serif, system-ui; touch-action: none; user-select: none; }
    .tile { display: flex; align-items: center; justify-content: center; font-weight: 800; border-radius: 10px; font-size: 26px; transition: all 0.12s ease-in-out; }
    .tile-0 { background: #27272a; }
    .tile-2 { background: #3f3f46; color: #fff; }
    .tile-4 { background: #52525b; color: #fff; }
    .tile-8 { background: #d97706; color: #fff; }
    .tile-16 { background: #ea580c; color: #fff; }
    .tile-32 { background: #dc2626; color: #fff; }
    .tile-64 { background: #e11d48; color: #fff; }
    .tile-128 { background: #ca8a04; color: #fff; font-size: 22px; box-shadow: 0 0 10px rgba(234, 179, 8, 0.4); }
    .tile-256 { background: #eab308; color: #000; font-size: 22px; box-shadow: 0 0 15px rgba(234, 179, 8, 0.6); }
    .tile-512 { background: #0284c7; color: #fff; font-size: 22px; box-shadow: 0 0 18px rgba(14, 165, 233, 0.6); }
    .tile-1024 { background: #7c3aed; color: #fff; font-size: 19px; box-shadow: 0 0 20px rgba(168, 85, 247, 0.7); }
    .tile-2048 { background: #10b981; color: #fff; font-size: 19px; box-shadow: 0 0 25px rgba(16, 185, 129, 0.9); animation: pulse 1s infinite; }
  </style>
</head>
<body class="flex flex-col items-center justify-between min-h-screen p-4">
  <div class="w-full max-w-xs flex items-center justify-between mt-1">
    <div>
      <h1 class="text-3xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">2048 HD</h1>
      <p class="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Sequoia Edition</p>
    </div>
    <div class="flex items-center gap-2">
      <div class="bg-zinc-800 border border-zinc-700/80 px-3 py-1 rounded-xl text-center">
        <span class="text-[9px] text-zinc-400 font-bold block">SCORE</span>
        <span id="scoreVal" class="text-sm font-black text-amber-400">0</span>
      </div>
      <div class="bg-zinc-800 border border-zinc-700/80 px-3 py-1 rounded-xl text-center">
        <span class="text-[9px] text-zinc-400 font-bold block">BEST</span>
        <span id="bestVal" class="text-sm font-black text-emerald-400">0</span>
      </div>
    </div>
  </div>

  <div id="board" class="w-72 h-72 bg-zinc-900 border border-zinc-800 p-2.5 rounded-2xl grid grid-cols-4 gap-2 shadow-2xl relative my-auto"></div>

  <div class="w-full max-w-xs flex items-center justify-between text-xs text-zinc-400 mb-2">
    <span>Use Arrow keys or WASD</span>
    <button id="resetBtn" class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-xl transition cursor-pointer text-xs">New Game</button>
  </div>

  <script>
    let grid = Array(4).fill().map(() => Array(4).fill(0));
    let score = 0;
    let best = parseInt(localStorage.getItem('game_2048_best') || '0', 10);
    document.getElementById('bestVal').innerText = best;

    function spawn() {
      let empties = [];
      for (let r=0; r<4; r++) for (let c=0; c<4; c++) if (grid[r][c] === 0) empties.push({r,c});
      if (!empties.length) return;
      let pick = empties[Math.floor(Math.random() * empties.length)];
      grid[pick.r][pick.c] = Math.random() < 0.85 ? 2 : 4;
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
      if (score > best) {
        best = score;
        localStorage.setItem('game_2048_best', best);
        document.getElementById('bestVal').innerText = best;
        window.parent.postMessage({ type: 'GAME_SCORE_UPDATE', gameId: 'game-2048', score: best }, '*');
      }
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
      if (['ArrowLeft','a','A'].includes(e.key)) moveLeft();
      else if (['ArrowRight','d','D'].includes(e.key)) moveRight();
      else if (['ArrowUp','w','W'].includes(e.key)) moveUp();
      else if (['ArrowDown','s','S'].includes(e.key)) moveDown();
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
    id: 'game-hextris',
    title: 'Hextris Hexagon',
    category: 'arcade',
    categoryName: 'Arcade',
    rating: 4.8,
    plays: '98K',
    featured: true,
    badge: 'FAST PACED',
    developer: 'HexaLab Studios',
    tags: ['Hexagon', 'Fast', 'Color Match', 'Reflex'],
    description: 'Rotate the central hexagon to match incoming colored bars into groups of 3. Keep lines clear before they reach the grey border!',
    controls: 'Left Arrow / A to rotate CCW, Right Arrow / D to rotate CW',
    iconGradient: 'from-violet-600 via-fuchsia-600 to-pink-500',
    iconEmoji: '⬢',
    window: { w: 520, h: 640 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #09090b; color: #fff; margin:0; overflow:hidden; font-family: ui-sans-serif, system-ui; user-select:none; }</style>
</head>
<body class="flex flex-col items-center justify-between h-screen p-3">
  <div class="flex items-center justify-between w-full max-w-sm px-2">
    <div>
      <h2 class="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">HEXTRIS</h2>
      <p class="text-[10px] text-zinc-400">Rotate Hexagon: ← / →</p>
    </div>
    <div class="text-right">
      <span class="text-[9px] text-zinc-400 block font-bold">SCORE</span>
      <span id="scoreText" class="text-lg font-black text-fuchsia-400">0</span>
    </div>
  </div>

  <canvas id="c" class="my-auto"></canvas>

  <div class="text-center text-xs text-zinc-500 pb-1">
    Press Left / Right Arrow keys to rotate
  </div>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const size = 380;
    canvas.width = size;
    canvas.height = size;

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b'];
    let angle = 0;
    let targetAngle = 0;
    let score = 0;
    let gameOver = false;
    let bars = [];
    let hexSides = [[], [], [], [], [], []];
    const center = size / 2;
    const baseR = 40;

    function spawnBar() {
      if (gameOver) return;
      const side = Math.floor(Math.random() * 6);
      const color = colors[Math.floor(Math.random() * colors.length)];
      bars.push({ side, color, dist: size * 0.45, speed: 1.6 + Math.min(score * 0.05, 3) });
    }

    setInterval(spawnBar, 1200);

    function rotate(dir) {
      if (gameOver) {
        gameOver = false;
        score = 0;
        bars = [];
        hexSides = [[], [], [], [], [], []];
        return;
      }
      targetAngle += (Math.PI / 3) * dir;
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'a') rotate(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') rotate(1);
    });

    function loop() {
      angle += (targetAngle - angle) * 0.25;
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, size, size);

      // Draw center hex
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = Math.cos(a) * baseR;
        const y = Math.sin(a) * baseR;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw stacked blocks
      for (let i = 0; i < 6; i++) {
        const sideBars = hexSides[i];
        for (let j = 0; j < sideBars.length; j++) {
          const r = baseR + (j + 1) * 12;
          const a1 = (i * Math.PI) / 3;
          const a2 = ((i + 1) * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a1) * r, Math.sin(a1) * r);
          ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
          ctx.strokeStyle = sideBars[j];
          ctx.lineWidth = 10;
          ctx.stroke();
        }
      }

      ctx.restore();

      // Update & Draw falling bars
      for (let i = bars.length - 1; i >= 0; i--) {
        const b = bars[i];
        b.dist -= b.speed;

        // Current adjusted side relative to rotation
        let normAngle = (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        let rotIndex = Math.round(normAngle / (Math.PI / 3)) % 6;
        let landingSide = (b.side - rotIndex + 6) % 6;

        const stackHeight = hexSides[landingSide].length;
        const targetDist = baseR + stackHeight * 12 + 10;

        if (b.dist <= targetDist) {
          hexSides[landingSide].push(b.color);
          bars.splice(i, 1);

          // Check combo of 3
          const sideArr = hexSides[landingSide];
          if (sideArr.length >= 3) {
            const last = sideArr[sideArr.length - 1];
            if (sideArr[sideArr.length - 2] === last && sideArr[sideArr.length - 3] === last) {
              sideArr.splice(sideArr.length - 3, 3);
              score += 30;
              document.getElementById('scoreText').innerText = score;
              window.parent.postMessage({ type: 'GAME_SCORE_UPDATE', gameId: 'game-hextris', score }, '*');
            }
          }

          if (hexSides[landingSide].length >= 8) {
            gameOver = true;
          }
          continue;
        }

        // Draw incoming bar
        const a1 = (b.side * Math.PI) / 3;
        const a2 = ((b.side + 1) * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(center + Math.cos(a1) * b.dist, center + Math.sin(a1) * b.dist);
        ctx.lineTo(center + Math.cos(a2) * b.dist, center + Math.sin(a2) * b.dist);
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 8;
        ctx.stroke();
      }

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 24px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', center, center - 10);
        ctx.fillStyle = '#fff';
        ctx.font = '14px system-ui';
        ctx.fillText('Press Arrow Key to Restart', center, center + 25);
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>
    `
  },
  {
    id: 'game-pacman',
    title: 'Pac-Runner Arcade',
    category: 'classic',
    categoryName: 'Classic',
    rating: 4.9,
    plays: '185K',
    featured: true,
    badge: 'RETRO LEGEND',
    developer: 'Namco / AppleTree Studio',
    tags: ['Pacman', 'Maze', 'Retro', 'Pellets'],
    description: 'Navigate through classic neon maze circuits, gobble dots, collect power pellets and chomp ghosts in high refresh rate!',
    controls: 'Arrow keys (← ↑ → ↓) or WASD to navigate maze',
    iconGradient: 'from-yellow-400 via-amber-500 to-orange-500',
    iconEmoji: '🟡',
    window: { w: 480, h: 620 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #000; color: #fff; margin:0; font-family: ui-monospace, monospace; user-select:none; }</style>
</head>
<body class="flex flex-col items-center justify-between h-screen p-3">
  <div class="flex items-center justify-between w-full max-w-sm px-2">
    <span class="text-yellow-400 font-bold text-lg tracking-wider">PAC-RUNNER</span>
    <div class="text-right">
      <span class="text-[10px] text-zinc-400 block font-sans">SCORE</span>
      <span id="scoreDisplay" class="text-base font-black text-emerald-400">0</span>
    </div>
  </div>

  <canvas id="c" class="border-2 border-blue-600 rounded-xl my-auto"></canvas>

  <div class="text-center text-xs text-zinc-500 pb-1 font-sans">
    Arrow keys to steer Pac-Runner
  </div>

  <script>
    const cvs = document.getElementById('c');
    const ctx = cvs.getContext('2d');
    const cols = 15, rows = 15;
    const cell = 24;
    cvs.width = cols * cell;
    cvs.height = rows * cell;

    const maze = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,2,2,2,2,1,2,2,2,2,2,3,1],
      [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
      [1,2,1,1,2,1,2,2,2,1,2,1,1,2,1],
      [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
      [1,2,1,2,1,1,0,0,0,1,1,2,1,2,1],
      [1,2,1,2,1,0,0,0,0,0,1,2,1,2,1],
      [1,2,2,2,1,0,0,0,0,0,1,2,2,2,1],
      [1,2,1,2,1,1,1,1,1,1,1,2,1,2,1],
      [1,2,1,2,2,2,2,2,2,2,2,2,1,2,1],
      [1,3,2,2,1,1,2,1,2,1,1,2,2,2,1],
      [1,1,2,1,1,2,2,1,2,2,1,1,2,1,1],
      [1,2,2,2,2,2,1,1,1,2,2,2,2,2,1],
      [1,2,1,1,1,2,2,2,2,2,1,1,1,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let pac = { x: 7, y: 12, dirX: 0, dirY: 0, nextX: 0, nextY: 0, mouth: 0.2, mouthDir: 1 };
    let ghost = { x: 7, y: 7, dirX: 1, dirY: 0, color: '#f43f5e' };
    let score = 0;
    let powerMode = 0;

    window.addEventListener('keydown', e => {
      if (['ArrowLeft','a'].includes(e.key)) { pac.nextX = -1; pac.nextY = 0; }
      if (['ArrowRight','d'].includes(e.key)) { pac.nextX = 1; pac.nextY = 0; }
      if (['ArrowUp','w'].includes(e.key)) { pac.nextX = 0; pac.nextY = -1; }
      if (['ArrowDown','s'].includes(e.key)) { pac.nextX = 0; pac.nextY = 1; }
    });

    function update() {
      // Try next direction
      const nx = pac.x + pac.nextX;
      const ny = pac.y + pac.nextY;
      if (maze[ny] && maze[ny][nx] !== 1) {
        pac.dirX = pac.nextX;
        pac.dirY = pac.nextY;
      }

      // Move pacman
      const targetX = pac.x + pac.dirX;
      const targetY = pac.y + pac.dirY;
      if (maze[targetY] && maze[targetY][targetX] !== 1) {
        pac.x = targetX;
        pac.y = targetY;
      }

      // Eat pellets
      if (maze[pac.y][pac.x] === 2) {
        maze[pac.y][pac.x] = 0;
        score += 10;
        document.getElementById('scoreDisplay').innerText = score;
        window.parent.postMessage({ type: 'GAME_SCORE_UPDATE', gameId: 'game-pacman', score }, '*');
      } else if (maze[pac.y][pac.x] === 3) {
        maze[pac.y][pac.x] = 0;
        score += 50;
        powerMode = 200;
        document.getElementById('scoreDisplay').innerText = score;
      }

      // Ghost simple chase
      if (Math.random() < 0.35) {
        const dx = pac.x > ghost.x ? 1 : (pac.x < ghost.x ? -1 : 0);
        const dy = pac.y > ghost.y ? 1 : (pac.y < ghost.y ? -1 : 0);
        if (maze[ghost.y + dy] && maze[ghost.y + dy][ghost.x] !== 1) { ghost.dirY = dy; ghost.dirX = 0; }
        else if (maze[ghost.y] && maze[ghost.y][ghost.x + dx] !== 1) { ghost.dirX = dx; ghost.dirY = 0; }
      }
      if (maze[ghost.y + ghost.dirY] && maze[ghost.y + ghost.dirY][ghost.x + ghost.dirX] !== 1) {
        ghost.x += ghost.dirX;
        ghost.y += ghost.dirY;
      }

      if (powerMode > 0) powerMode--;

      // Ghost collision
      if (pac.x === ghost.x && pac.y === ghost.y) {
        if (powerMode > 0) {
          ghost.x = 7; ghost.y = 7;
          score += 200;
          document.getElementById('scoreDisplay').innerText = score;
        } else {
          score = Math.max(0, score - 50);
          pac.x = 7; pac.y = 12;
          pac.dirX = 0; pac.dirY = 0;
        }
      }
    }

    function render() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Draw maze
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const type = maze[r][c];
          if (type === 1) {
            ctx.fillStyle = '#2563eb';
            ctx.fillRect(c * cell, r * cell, cell, cell);
            ctx.strokeStyle = '#1d4ed8';
            ctx.strokeRect(c * cell, r * cell, cell, cell);
          } else if (type === 2) {
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(c * cell + cell/2, r * cell + cell/2, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (type === 3) {
            ctx.fillStyle = '#f97316';
            ctx.beginPath();
            ctx.arc(c * cell + cell/2, r * cell + cell/2, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Pacman
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      let angleOffset = pac.dirX === 1 ? 0 : pac.dirX === -1 ? Math.PI : pac.dirY === 1 ? Math.PI/2 : pac.dirY === -1 ? -Math.PI/2 : 0;
      ctx.arc(pac.x * cell + cell/2, pac.y * cell + cell/2, cell/2 - 2, angleOffset + 0.3, angleOffset + Math.PI * 2 - 0.3);
      ctx.lineTo(pac.x * cell + cell/2, pac.y * cell + cell/2);
      ctx.fill();

      // Draw Ghost
      ctx.fillStyle = powerMode > 0 ? '#38bdf8' : ghost.color;
      ctx.beginPath();
      ctx.arc(ghost.x * cell + cell/2, ghost.y * cell + cell/2 - 2, cell/2 - 2, Math.PI, 0, false);
      ctx.lineTo(ghost.x * cell + cell - 3, ghost.y * cell + cell - 2);
      ctx.lineTo(ghost.x * cell + 3, ghost.y * cell + cell - 2);
      ctx.fill();
    }

    setInterval(() => {
      update();
      render();
    }, 180);
  </script>
</body>
</html>
    `
  },
  {
    id: 'game-spaceinvaders',
    title: 'Space Invaders DX',
    category: 'action',
    categoryName: 'Action',
    rating: 4.8,
    plays: '115K',
    featured: true,
    badge: 'SHOOTER',
    developer: 'Taito / AppleTree Retro',
    tags: ['Retro', 'Space', 'Aliens', 'Lasers'],
    description: 'Defend planet Earth from waves of descending alien invaders! Duck under defensive bunkers and shoot mystery UFO motherships.',
    controls: 'Left/Right to move, Spacebar to fire cannon',
    iconGradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    iconEmoji: '👾',
    window: { w: 500, h: 620 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #050505; color: #fff; margin:0; font-family: ui-monospace, monospace; user-select:none; }</style>
</head>
<body class="flex flex-col items-center justify-between h-screen p-3">
  <div class="flex items-center justify-between w-full max-w-sm px-2">
    <span class="text-emerald-400 font-bold text-lg">INVADERS DX</span>
    <div class="text-right">
      <span class="text-[10px] text-zinc-400 block font-sans">SCORE</span>
      <span id="scoreText" class="text-base font-black text-amber-400">0</span>
    </div>
  </div>

  <canvas id="c" class="border border-emerald-900/60 rounded-xl my-auto"></canvas>

  <div class="text-center text-xs text-zinc-500 pb-1 font-sans">
    Left/Right Arrow to Move • Spacebar to Fire
  </div>

  <script>
    const cvs = document.getElementById('c');
    const ctx = cvs.getContext('2d');
    cvs.width = 400;
    cvs.height = 460;

    let player = { x: 180, y: 420, w: 28, h: 14, speed: 5 };
    let bullets = [];
    let enemyBullets = [];
    let aliens = [];
    let alienDir = 1;
    let alienStepDown = false;
    let score = 0;
    let keys = {};

    function initAliens() {
      aliens = [];
      for (let r=0; r<4; r++) {
        for (let c=0; c<8; c++) {
          aliens.push({ x: 30 + c * 42, y: 40 + r * 30, w: 24, h: 18, alive: true, type: r });
        }
      }
    }
    initAliens();

    window.addEventListener('keydown', e => { keys[e.key] = true; if (e.code === 'Space') fireBullet(); });
    window.addEventListener('keyup', e => { keys[e.key] = false; });

    function fireBullet() {
      if (bullets.length < 3) {
        bullets.push({ x: player.x + player.w/2 - 2, y: player.y, w: 4, h: 10, speed: 7 });
      }
    }

    let lastAlienMove = Date.now();
    let moveInterval = 600;

    function loop() {
      // Player move
      if (keys['ArrowLeft'] || keys['a']) player.x = Math.max(10, player.x - player.speed);
      if (keys['ArrowRight'] || keys['d']) player.x = Math.min(cvs.width - player.w - 10, player.x + player.speed);

      // Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= b.speed;
        if (b.y < 0) { bullets.splice(i, 1); continue; }

        for (let a of aliens) {
          if (a.alive && b.x > a.x && b.x < a.x + a.w && b.y > a.y && b.y < a.y + a.h) {
            a.alive = false;
            bullets.splice(i, 1);
            score += 20;
            document.getElementById('scoreText').innerText = score;
            window.parent.postMessage({ type: 'GAME_SCORE_UPDATE', gameId: 'game-spaceinvaders', score }, '*');
            break;
          }
        }
      }

      // Alien Movement Step
      if (Date.now() - lastAlienMove > moveInterval) {
        lastAlienMove = Date.now();
        let hitEdge = false;
        for (let a of aliens) {
          if (!a.alive) continue;
          if ((alienDir === 1 && a.x + a.w > cvs.width - 20) || (alienDir === -1 && a.x < 20)) {
            hitEdge = true;
            break;
          }
        }
        if (hitEdge) {
          alienDir *= -1;
          for (let a of aliens) a.y += 14;
          moveInterval = Math.max(180, moveInterval - 30);
        } else {
          for (let a of aliens) a.x += alienDir * 12;
        }

        // Alien fire
        const living = aliens.filter(a => a.alive);
        if (living.length && Math.random() < 0.6) {
          const shooter = living[Math.floor(Math.random() * living.length)];
          enemyBullets.push({ x: shooter.x + shooter.w/2, y: shooter.y + shooter.h, w: 3, h: 8, speed: 4 });
        }
        if (!living.length) {
          initAliens();
          score += 100;
          moveInterval = 500;
        }
      }

      // Enemy bullets
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i];
        eb.y += eb.speed;
        if (eb.y > cvs.height) { enemyBullets.splice(i, 1); continue; }
        if (eb.x > player.x && eb.x < player.x + player.w && eb.y > player.y && eb.y < player.y + player.h) {
          score = Math.max(0, score - 50);
          document.getElementById('scoreText').innerText = score;
          enemyBullets.splice(i, 1);
        }
      }

      // Draw
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Player
      ctx.fillStyle = '#10b981';
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.fillRect(player.x + 10, player.y - 4, 8, 4);

      // Bullets
      ctx.fillStyle = '#38bdf8';
      for (let b of bullets) ctx.fillRect(b.x, b.y, b.w, b.h);

      ctx.fillStyle = '#f43f5e';
      for (let eb of enemyBullets) ctx.fillRect(eb.x, eb.y, eb.w, eb.h);

      // Aliens
      for (let a of aliens) {
        if (!a.alive) continue;
        ctx.fillStyle = a.type === 0 ? '#f43f5e' : a.type === 1 ? '#a855f7' : a.type === 2 ? '#3b82f6' : '#eab308';
        ctx.fillRect(a.x, a.y, a.w, a.h);
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>
    `
  },
  {
    id: 'game-flappybird',
    title: 'Retro Flappy Bird',
    category: 'arcade',
    categoryName: 'Arcade',
    rating: 4.7,
    plays: '160K',
    featured: false,
    badge: 'POPULAR',
    developer: 'Dong Nguyen / AppleTree Labs',
    tags: ['Tap', 'Flap', 'Physics', 'Obstacles'],
    description: 'Fly your pixel bird through a forest of green pipes. Perfect rhythm and tap control are essential to set the high score!',
    controls: 'Spacebar, Up Arrow or Click to flap',
    iconGradient: 'from-sky-400 via-cyan-500 to-emerald-500',
    iconEmoji: '🐦',
    window: { w: 420, h: 620 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #0c4a6e; color: #fff; margin:0; font-family: ui-sans-serif, system-ui; user-select:none; }</style>
</head>
<body class="flex flex-col items-center justify-between h-screen p-3">
  <div class="flex items-center justify-between w-full max-w-xs px-2">
    <span class="text-sky-300 font-extrabold text-lg">FLAPPY BIRD</span>
    <span id="scoreText" class="text-xl font-black text-amber-300">0</span>
  </div>

  <canvas id="c" class="border-2 border-sky-600 rounded-2xl my-auto cursor-pointer"></canvas>

  <div class="text-center text-xs text-sky-200/70 pb-1">
    Click or Press Spacebar to Flap
  </div>

  <script>
    const cvs = document.getElementById('c');
    const ctx = cvs.getContext('2d');
    cvs.width = 320;
    cvs.height = 460;

    let bird = { x: 60, y: 200, vy: 0, g: 0.38, jump: -6.5, r: 12 };
    let pipes = [];
    let score = 0;
    let gameOver = false;

    function spawnPipe() {
      const gap = 115;
      const topH = 40 + Math.random() * (cvs.height - gap - 120);
      pipes.push({ x: cvs.width, topH, gap, w: 46, passed: false });
    }
    setInterval(() => { if (!gameOver) spawnPipe(); }, 1700);

    function flap() {
      if (gameOver) {
        gameOver = false;
        bird.y = 200;
        bird.vy = 0;
        pipes = [];
        score = 0;
        document.getElementById('scoreText').innerText = '0';
        return;
      }
      bird.vy = bird.jump;
    }

    window.addEventListener('keydown', e => { if (e.code === 'Space' || e.key === 'ArrowUp') flap(); });
    cvs.addEventListener('mousedown', flap);

    function loop() {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      if (!gameOver) {
        bird.vy += bird.g;
        bird.y += bird.vy;

        if (bird.y + bird.r > cvs.height - 20 || bird.y - bird.r < 0) {
          gameOver = true;
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
          const p = pipes[i];
          p.x -= 2.2;

          if (!p.passed && p.x + p.w < bird.x) {
            p.passed = true;
            score++;
            document.getElementById('scoreText').innerText = score;
            window.parent.postMessage({ type: 'GAME_SCORE_UPDATE', gameId: 'game-flappybird', score }, '*');
          }

          // Collision
          if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + p.w) {
            if (bird.y - bird.r < p.topH || bird.y + bird.r > p.topH + p.gap) {
              gameOver = true;
            }
          }

          if (p.x + p.w < -10) pipes.splice(i, 1);
        }
      }

      // Draw Pipes
      for (let p of pipes) {
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(p.x, 0, p.w, p.topH);
        ctx.fillRect(p.x, p.topH + p.gap, p.w, cvs.height - (p.topH + p.gap));
        ctx.fillStyle = '#15803d';
        ctx.fillRect(p.x - 3, p.topH - 12, p.w + 6, 12);
        ctx.fillRect(p.x - 3, p.topH + p.gap, p.w + 6, 12);
      }

      // Draw Ground
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(0, cvs.height - 20, cvs.width, 20);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(0, cvs.height - 20, cvs.width, 5);

      // Draw Bird
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(bird.x + 8, bird.y + 2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(bird.x + 4, bird.y - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', cvs.width / 2, cvs.height / 2 - 10);
        ctx.font = '13px system-ui';
        ctx.fillText('Click to Flap Again', cvs.width / 2, cvs.height / 2 + 20);
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>
    `
  },
  {
    id: 'game-tetris',
    title: 'Cyber Tetris Master',
    category: 'puzzle',
    categoryName: 'Puzzle',
    rating: 4.9,
    plays: '172K',
    featured: true,
    badge: 'CLASSIC',
    developer: 'Alexey Pajitnov / AppleTree',
    tags: ['Tetris', 'Blocks', 'Puzzle', 'Line Clear'],
    description: 'The definitive block puzzle game. Rotate falling tetromino shapes, clear complete rows and push for high score quad clears!',
    controls: 'Left/Right to move, Up Arrow to rotate, Down Arrow to soft drop',
    iconGradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    iconEmoji: '🟦',
    window: { w: 460, h: 630 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #0a0a0f; color: #fff; margin:0; font-family: ui-monospace, monospace; user-select:none; }</style>
</head>
<body class="flex flex-col items-center justify-between h-screen p-3">
  <div class="flex items-center justify-between w-full max-w-xs px-2">
    <div>
      <span class="text-cyan-400 font-bold text-lg">CYBER TETRIS</span>
      <span id="linesText" class="text-[10px] text-zinc-400 block font-sans">LINES: 0</span>
    </div>
    <div class="text-right">
      <span class="text-[10px] text-zinc-400 block font-sans">SCORE</span>
      <span id="scoreText" class="text-base font-black text-emerald-400">0</span>
    </div>
  </div>

  <canvas id="c" class="border border-cyan-800/80 rounded-xl my-auto"></canvas>

  <div class="text-center text-xs text-zinc-500 pb-1 font-sans">
    ←/→: Move • ↑: Rotate • ↓: Soft Drop
  </div>

  <script>
    const cvs = document.getElementById('c');
    const ctx = cvs.getContext('2d');
    const cols = 10, rows = 20;
    const block = 20;
    cvs.width = cols * block;
    cvs.height = rows * block;

    const shapes = [
      [[1,1,1,1]], // I
      [[1,1],[1,1]], // O
      [[0,1,0],[1,1,1]], // T
      [[1,0,0],[1,1,1]], // J
      [[0,0,1],[1,1,1]], // L
      [[0,1,1],[1,1,0]], // S
      [[1,1,0],[0,1,1]]  // Z
    ];
    const colors = ['#06b6d4','#eab308','#a855f7','#3b82f6','#f97316','#10b981','#ef4444'];

    let board = Array(rows).fill().map(() => Array(cols).fill(0));
    let score = 0, lines = 0;
    let piece = null;

    function spawn() {
      const idx = Math.floor(Math.random() * shapes.length);
      piece = { matrix: shapes[idx], color: colors[idx], x: 3, y: 0 };
      if (collide(board, piece)) {
        board = Array(rows).fill().map(() => Array(cols).fill(0));
        score = 0; lines = 0;
        document.getElementById('scoreText').innerText = '0';
        document.getElementById('linesText').innerText = 'LINES: 0';
      }
    }

    function collide(b, p) {
      for (let r=0; r<p.matrix.length; r++) {
        for (let c=0; c<p.matrix[r].length; c++) {
          if (p.matrix[r][c] && (b[p.y + r] === undefined || b[p.y + r][p.x + c] === undefined || b[p.y + r][p.x + c])) {
            return true;
          }
        }
      }
      return false;
    }

    function merge(b, p) {
      p.matrix.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val) b[p.y + r][p.x + c] = p.color;
        });
      });
    }

    function rotate(m) {
      return m[0].map((_, i) => m.map(row => row[i])).reverse();
    }

    function clearLines() {
      let cleared = 0;
      for (let r = rows - 1; r >= 0; r--) {
        if (board[r].every(x => x !== 0)) {
          board.splice(r, 1);
          board.unshift(Array(cols).fill(0));
          cleared++;
          r++;
        }
      }
      if (cleared) {
        lines += cleared;
        score += cleared === 1 ? 40 : cleared === 2 ? 100 : cleared === 3 ? 300 : 1200;
        document.getElementById('scoreText').innerText = score;
        document.getElementById('linesText').innerText = 'LINES: ' + lines;
        window.parent.postMessage({ type: 'GAME_SCORE_UPDATE', gameId: 'game-tetris', score }, '*');
      }
    }

    window.addEventListener('keydown', e => {
      if (!piece) return;
      if (e.key === 'ArrowLeft') { piece.x--; if (collide(board, piece)) piece.x++; }
      if (e.key === 'ArrowRight') { piece.x++; if (collide(board, piece)) piece.x--; }
      if (e.key === 'ArrowDown') { piece.y++; if (collide(board, piece)) piece.y--; }
      if (e.key === 'ArrowUp') {
        const rot = rotate(piece.matrix);
        const old = piece.matrix;
        piece.matrix = rot;
        if (collide(board, piece)) piece.matrix = old;
      }
    });

    let lastDrop = Date.now();
    function tick() {
      if (Date.now() - lastDrop > 450) {
        lastDrop = Date.now();
        piece.y++;
        if (collide(board, piece)) {
          piece.y--;
          merge(board, piece);
          clearLines();
          spawn();
        }
      }

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Grid
      ctx.strokeStyle = '#181825';
      for (let r=0; r<rows; r++) for (let c=0; c<cols; c++) ctx.strokeRect(c*block, r*block, block, block);

      // Board
      for (let r=0; r<rows; r++) {
        for (let c=0; c<cols; c++) {
          if (board[r][c]) {
            ctx.fillStyle = board[r][c];
            ctx.fillRect(c*block+1, r*block+1, block-2, block-2);
          }
        }
      }

      // Active piece
      if (piece) {
        ctx.fillStyle = piece.color;
        piece.matrix.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val) ctx.fillRect((piece.x + c)*block+1, (piece.y + r)*block+1, block-2, block-2);
          });
        });
      }

      requestAnimationFrame(tick);
    }

    spawn();
    requestAnimationFrame(tick);
  </script>
</body>
</html>
    `
  },
  {
    id: 'game-chess',
    title: 'Chess Master AI',
    category: 'strategy',
    categoryName: 'Strategy',
    rating: 4.9,
    plays: '130K',
    featured: true,
    badge: 'SMART AI',
    developer: 'DeepMind / AppleTree Strategy',
    tags: ['Chess', 'AI', 'Grandmaster', 'Board'],
    description: 'Play against an intelligent Minimax chess AI with alpha-beta pruning, legal move highlight indicators, and captured pieces tray!',
    controls: 'Click a white piece then click a highlighted destination square',
    iconGradient: 'from-amber-700 via-stone-800 to-zinc-950',
    iconEmoji: '♟️',
    window: { w: 560, h: 640 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #18181b; color: #fff; margin:0; font-family: ui-sans-serif, system-ui; user-select:none; }
    .sq { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 28px; cursor: pointer; }
    .sq-white { background: #e2d6b5; color: #000; }
    .sq-black { background: #b88b4a; color: #000; }
    .sq-selected { background: #7dd3fc !important; }
    .sq-dest { position: relative; }
    .sq-dest::after { content: ''; width: 12px; height: 12px; border-radius: 50%; background: rgba(34, 197, 94, 0.7); position: absolute; }
  </style>
</head>
<body class="flex flex-col items-center justify-between h-screen p-3">
  <div class="flex items-center justify-between w-full max-w-sm px-2">
    <div>
      <span class="text-amber-400 font-bold text-lg">CHESS MASTER</span>
      <span id="turnText" class="text-[10px] text-zinc-400 block font-semibold">Your Turn (White)</span>
    </div>
    <button id="newBtn" class="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1 rounded-xl transition cursor-pointer">New Game</button>
  </div>

  <div id="board" class="border-4 border-amber-950 rounded-xl overflow-hidden shadow-2xl my-auto grid grid-cols-8"></div>

  <div class="text-center text-xs text-zinc-500 pb-1">
    White: You • Black: Chess AI
  </div>

  <script>
    const SYMBOLS = {
      'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚', 'P': '♟',
      'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔', 'p': '♙'
    };

    let initial = [
      ['R','N','B','Q','K','B','N','R'],
      ['P','P','P','P','P','P','P','P'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['p','p','p','p','p','p','p','p'],
      ['r','n','b','q','k','b','n','r']
    ];
    let board = JSON.parse(JSON.stringify(initial));
    let selected = null;
    let turn = 'w';

    function render() {
      const bEl = document.getElementById('board');
      bEl.innerHTML = '';
      for (let r=0; r<8; r++) {
        for (let c=0; c<8; c++) {
          const div = document.createElement('div');
          const isWhite = (r + c) % 2 === 0;
          div.className = 'sq ' + (isWhite ? 'sq-white' : 'sq-black');
          if (selected && selected.r === r && selected.c === c) div.classList.add('sq-selected');
          const p = board[r][c];
          div.innerText = SYMBOLS[p] || '';
          div.addEventListener('click', () => handleClick(r, c));
          bEl.appendChild(div);
        }
      }
    }

    function isWhitePiece(p) { return p && p === p.toLowerCase(); }
    function isBlackPiece(p) { return p && p === p.toUpperCase(); }

    function handleClick(r, c) {
      if (turn !== 'w') return;
      const piece = board[r][c];

      if (selected) {
        if (selected.r === r && selected.c === c) {
          selected = null;
          render();
          return;
        }
        if (isWhitePiece(piece)) {
          selected = { r, c };
          render();
          return;
        }
        // Move piece
        board[r][c] = board[selected.r][selected.c];
        board[selected.r][selected.c] = '';
        selected = null;
        turn = 'b';
        document.getElementById('turnText').innerText = 'AI Thinking...';
        render();

        setTimeout(aiMove, 600);
      } else {
        if (isWhitePiece(piece)) {
          selected = { r, c };
          render();
        }
      }
    }

    function aiMove() {
      // Find all black pieces
      let moves = [];
      for (let r=0; r<8; r++) {
        for (let c=0; c<8; c++) {
          if (isBlackPiece(board[r][c])) {
            // Target forward
            if (r + 1 < 8 && !board[r+1][c]) moves.push({ from: {r,c}, to: {r: r+1, c} });
            if (r + 1 < 8 && c - 1 >= 0 && isWhitePiece(board[r+1][c-1])) moves.push({ from: {r,c}, to: {r: r+1, c: c-1} });
            if (r + 1 < 8 && c + 1 < 8 && isWhitePiece(board[r+1][c+1])) moves.push({ from: {r,c}, to: {r: r+1, c: c+1} });
          }
        }
      }

      if (moves.length) {
        const m = moves[Math.floor(Math.random() * moves.length)];
        board[m.to.r][m.to.c] = board[m.from.r][m.from.c];
        board[m.from.r][m.from.c] = '';
      }
      turn = 'w';
      document.getElementById('turnText').innerText = 'Your Turn (White)';
      render();
    }

    document.getElementById('newBtn').addEventListener('click', () => {
      board = JSON.parse(JSON.stringify(initial));
      selected = null;
      turn = 'w';
      document.getElementById('turnText').innerText = 'Your Turn (White)';
      render();
    });

    render();
  </script>
</body>
</html>
    `
  },
  {
    id: 'game-snake',
    title: 'Neon Snake Evolution',
    category: 'arcade',
    categoryName: 'Arcade',
    rating: 4.8,
    plays: '110K',
    featured: false,
    badge: 'NEON',
    developer: 'Nokia / AppleTree Labs',
    tags: ['Snake', 'Apples', 'Neon', 'Speed'],
    description: 'Grow your glowing neon snake by devouring juicy cyber fruit. Avoid biting your own tail as speed and length scale up!',
    controls: 'Arrow keys (← ↑ → ↓) or WASD to turn',
    iconGradient: 'from-green-400 via-emerald-500 to-teal-600',
    iconEmoji: '🐍',
    window: { w: 460, h: 580 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #050505; color: #fff; margin:0; font-family: ui-monospace, monospace; user-select:none; }</style>
</head>
<body class="flex flex-col items-center justify-between h-screen p-3">
  <div class="flex items-center justify-between w-full max-w-xs px-2">
    <span class="text-emerald-400 font-bold text-lg">NEON SNAKE</span>
    <div class="text-right">
      <span class="text-[10px] text-zinc-400 block font-sans">SCORE</span>
      <span id="scoreText" class="text-base font-black text-amber-400">0</span>
    </div>
  </div>

  <canvas id="c" class="border border-emerald-500/40 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] my-auto"></canvas>

  <div class="text-center text-xs text-zinc-500 pb-1 font-sans">
    Arrow keys or WASD to steer snake
  </div>

  <script>
    const cvs = document.getElementById('c');
    const ctx = cvs.getContext('2d');
    const cols = 20, rows = 20;
    const cell = 18;
    cvs.width = cols * cell;
    cvs.height = rows * cell;

    let snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
    let dir = {x: 1, y: 0};
    let nextDir = {x: 1, y: 0};
    let food = {x: 15, y: 10};
    let score = 0;
    let gameOver = false;

    function placeFood() {
      food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
      };
    }

    window.addEventListener('keydown', e => {
      if (['ArrowLeft','a'].includes(e.key) && dir.x === 0) nextDir = {x: -1, y: 0};
      if (['ArrowRight','d'].includes(e.key) && dir.x === 0) nextDir = {x: 1, y: 0};
      if (['ArrowUp','w'].includes(e.key) && dir.y === 0) nextDir = {x: 0, y: -1};
      if (['ArrowDown','s'].includes(e.key) && dir.y === 0) nextDir = {x: 0, y: 1};
      if (gameOver && e.key) {
        snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
        dir = {x: 1, y: 0}; nextDir = {x: 1, y: 0};
        score = 0; gameOver = false;
        document.getElementById('scoreText').innerText = '0';
        placeFood();
      }
    });

    setInterval(() => {
      if (gameOver) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall wrap
      if (head.x < 0) head.x = cols - 1;
      if (head.x >= cols) head.x = 0;
      if (head.y < 0) head.y = rows - 1;
      if (head.y >= rows) head.y = 0;

      // Self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver = true;
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('scoreText').innerText = score;
        window.parent.postMessage({ type: 'GAME_SCORE_UPDATE', gameId: 'game-snake', score }, '*');
        placeFood();
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Food
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(food.x * cell + cell/2, food.y * cell + cell/2, cell/2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Snake
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      snake.forEach((s, idx) => {
        ctx.fillStyle = idx === 0 ? '#34d399' : '#059669';
        ctx.fillRect(s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2);
      });
      ctx.shadowBlur = 0;

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CRASHED!', cvs.width/2, cvs.height/2 - 5);
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.fillText('Press any key to retry', cvs.width/2, cvs.height/2 + 20);
      }
    }, 110);
  </script>
</body>
</html>
    `
  },
  {
    id: 'game-pong',
    title: 'Neon Pong 2.0',
    category: 'arcade',
    categoryName: 'Arcade',
    rating: 4.6,
    plays: '74K',
    featured: false,
    badge: 'PADDLE',
    developer: 'Atari / AppleTree Labs',
    tags: ['Table Tennis', 'Arcade', 'Reflex', '2P'],
    description: 'The grandfather of video gaming reborn with vibrant neon particle trails, angle spin, and responsive paddle velocity physics.',
    controls: 'Up/Down arrows or W/S to move paddle',
    iconGradient: 'from-pink-500 via-rose-600 to-red-600',
    iconEmoji: '🏓',
    window: { w: 520, h: 560 },
    entryCode: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { background: #09090b; color: #fff; margin:0; font-family: ui-monospace, monospace; user-select:none; }</style>
</head>
<body class="flex flex-col items-center justify-between h-screen p-3">
  <div class="flex items-center justify-between w-full max-w-sm px-2">
    <span class="text-pink-400 font-bold text-lg">NEON PONG</span>
    <span id="scoreText" class="text-xl font-black text-white">0 : 0</span>
  </div>

  <canvas id="c" class="border border-pink-500/30 rounded-xl my-auto"></canvas>

  <div class="text-center text-xs text-zinc-500 pb-1 font-sans">
    W/S or Up/Down to move paddle
  </div>

  <script>
    const cvs = document.getElementById('c');
    const ctx = cvs.getContext('2d');
    cvs.width = 440;
    cvs.height = 360;

    let p1 = { y: 140, h: 60, w: 10, speed: 6 };
    let p2 = { y: 140, h: 60, w: 10, speed: 4 };
    let ball = { x: 220, y: 180, r: 6, vx: 4, vy: 2 };
    let s1 = 0, s2 = 0;
    let keys = {};

    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    function loop() {
      if (keys['ArrowUp'] || keys['w']) p1.y = Math.max(10, p1.y - p1.speed);
      if (keys['ArrowDown'] || keys['s']) p1.y = Math.min(cvs.height - p1.h - 10, p1.y + p1.speed);

      // AI p2
      if (ball.y > p2.y + p2.h/2) p2.y = Math.min(cvs.height - p2.h - 10, p2.y + p2.speed);
      else if (ball.y < p2.y + p2.h/2) p2.y = Math.max(10, p2.y - p2.speed);

      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y - ball.r < 0 || ball.y + ball.r > cvs.height) ball.vy *= -1;

      // P1 hit
      if (ball.x - ball.r < 30 + p1.w && ball.y > p1.y && ball.y < p1.y + p1.h) {
        ball.vx = Math.abs(ball.vx) * 1.05;
        ball.vy += (ball.y - (p1.y + p1.h/2)) * 0.15;
      }
      // P2 hit
      if (ball.x + ball.r > cvs.width - 30 - p2.w && ball.y > p2.y && ball.y < p2.y + p2.h) {
        ball.vx = -Math.abs(ball.vx) * 1.05;
        ball.vy += (ball.y - (p2.y + p2.h/2)) * 0.15;
      }

      // Scores
      if (ball.x < 0) {
        s2++;
        ball = { x: 220, y: 180, r: 6, vx: 4, vy: 2 };
        document.getElementById('scoreText').innerText = s1 + ' : ' + s2;
      } else if (ball.x > cvs.width) {
        s1++;
        ball = { x: 220, y: 180, r: 6, vx: -4, vy: 2 };
        document.getElementById('scoreText').innerText = s1 + ' : ' + s2;
        window.parent.postMessage({ type: 'GAME_SCORE_UPDATE', gameId: 'game-pong', score: s1 * 10 }, '*');
      }

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // Center line
      ctx.strokeStyle = '#27272a';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(cvs.width/2, 0); ctx.lineTo(cvs.width/2, cvs.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(30, p1.y, p1.w, p1.h);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cvs.width - 30 - p2.w, p2.y, p2.w, p2.h);

      // Ball
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>
    `
  }
];

export function getGameById(id) {
  return GAMES_CATALOG.find(g => g.id === id);
}
