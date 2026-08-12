/* ==========================================================================
   12-systeme/03-404-interactive — main.js
   Mini-jeu en canvas. Aucune dépendance.

   Deux partis pris :
   - Les couleurs sont lues dans les tokens CSS, jamais écrites en dur : le jeu
     suit le thème appliqué comme le reste de la page.
   - Rien ne bouge tant que le visiteur n'a pas cliqué. `prefers-reduced-motion`
     retire en plus les effets décoratifs (traînée, pulsation).
   ========================================================================== */

(() => {
  'use strict';

  const canvas = document.querySelector('[data-canvas]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const veil = document.querySelector('[data-veil]');
  const veilTitle = document.querySelector('[data-veil-title]');
  const veilText = document.querySelector('[data-veil-text]');
  const startBtn = document.querySelector('[data-start]');
  const scoreOut = document.querySelector('[data-score]');
  const timeOut = document.querySelector('[data-time]');
  const bestOut = document.querySelector('[data-best]');

  const W = canvas.width;
  const H = canvas.height;
  const ROUND = 30; // secondes

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ couleurs */

  // Relues à chaque partie : si le thème change, le jeu suit.
  let palette = {};
  const readPalette = () => {
    const cs = getComputedStyle(document.documentElement);
    const get = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
    palette = {
      bg: get('--bg-sunken', '#eee'),
      grid: get('--border', '#ddd'),
      player: get('--accent', '#333'),
      playerEdge: get('--border-strong', '#000'),
      target: get('--accent-text', '#333'),
      ghost: get('--fg-subtle', '#999'),
    };
  };

  /* --------------------------------------------------------------- état */

  let player, targets, score, best, endsAt, running, raf, trail;

  try {
    best = Number(localStorage.getItem('p404-best')) || 0;
  } catch { best = 0; }
  bestOut.textContent = best;

  const keys = new Set();
  const pointer = { x: null, y: null, active: false };

  const reset = () => {
    player = { x: W / 2, y: H / 2, r: 16, vx: 0, vy: 0 };
    targets = [];
    trail = [];
    score = 0;
    scoreOut.textContent = '0';
    timeOut.textContent = ROUND;
    for (let i = 0; i < 4; i += 1) targets.push(spawn());
  };

  const spawn = () => ({
    x: 40 + Math.random() * (W - 80),
    y: 40 + Math.random() * (H - 80),
    s: 14 + Math.random() * 10,
    born: performance.now(),
  });

  /* ------------------------------------------------------------ dessin */

  const drawGrid = () => {
    ctx.strokeStyle = palette.grid;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 50) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
    for (let y = 0; y <= H; y += 50) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  const roundRect = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  };

  const draw = (now) => {
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, W, H);
    drawGrid();

    // Traînée — purement décorative, retirée en mouvement réduit.
    if (!calm) {
      ctx.fillStyle = palette.ghost;
      trail.forEach((p, i) => {
        ctx.globalAlpha = (i / trail.length) * 0.25;
        roundRect(p.x - 8, p.y - 8, 16, 16, 4);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    // Cibles
    targets.forEach((t) => {
      const age = (now - t.born) / 1000;
      const pulse = calm ? 0 : Math.sin(age * 4) * 1.5;
      const s = t.s + pulse;
      ctx.fillStyle = palette.target;
      roundRect(t.x - s / 2, t.y - s / 2, s, s, 3);
      ctx.fill();
    });

    // Joueur
    ctx.fillStyle = palette.player;
    ctx.strokeStyle = palette.playerEdge;
    ctx.lineWidth = 3;
    roundRect(player.x - player.r, player.y - player.r, player.r * 2, player.r * 2, 6);
    ctx.fill();
    ctx.stroke();
  };

  /* ------------------------------------------------------------ logique */

  const step = (dt) => {
    // Clavier — flèches, ZQSD (AZERTY) et WASD (QWERTY).
    let ax = 0;
    let ay = 0;
    if (keys.has('ArrowLeft') || keys.has('q') || keys.has('a')) ax -= 1;
    if (keys.has('ArrowRight') || keys.has('d')) ax += 1;
    if (keys.has('ArrowUp') || keys.has('z') || keys.has('w')) ay -= 1;
    if (keys.has('ArrowDown') || keys.has('s')) ay += 1;

    if (ax || ay) {
      const len = Math.hypot(ax, ay);
      player.vx += (ax / len) * 2400 * dt;
      player.vy += (ay / len) * 2400 * dt;
    } else if (pointer.active && pointer.x !== null) {
      // Le pointeur attire le joueur plutôt que de le téléporter.
      const dx = pointer.x - player.x;
      const dy = pointer.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d > 2) {
        player.vx += (dx / d) * 2000 * dt;
        player.vy += (dy / d) * 2000 * dt;
      }
    }

    player.vx *= 0.86;
    player.vy *= 0.86;
    player.x = Math.max(player.r, Math.min(W - player.r, player.x + player.vx * dt));
    player.y = Math.max(player.r, Math.min(H - player.r, player.y + player.vy * dt));

    if (!calm) {
      trail.push({ x: player.x, y: player.y });
      if (trail.length > 14) trail.shift();
    }

    // Collecte
    for (let i = targets.length - 1; i >= 0; i -= 1) {
      const t = targets[i];
      if (Math.abs(t.x - player.x) < player.r + t.s / 2 &&
          Math.abs(t.y - player.y) < player.r + t.s / 2) {
        targets.splice(i, 1, spawn());
        score += 1;
        scoreOut.textContent = score;
      }
    }
  };

  /* -------------------------------------------------------------- boucle */

  let last = 0;

  const loop = (now) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    const left = Math.max(0, Math.ceil((endsAt - now) / 1000));
    timeOut.textContent = left;

    step(dt);
    draw(now);

    if (now >= endsAt) { stop('fin'); return; }
    raf = requestAnimationFrame(loop);
  };

  /* ------------------------------------------------------------ contrôle */

  const showVeil = (title, text, button) => {
    veilTitle.textContent = title;
    veilText.textContent = text;
    startBtn.textContent = button;
    veil.hidden = false;
    startBtn.focus();
  };

  const start = () => {
    readPalette();
    reset();
    veil.hidden = true;
    running = true;
    last = performance.now();
    endsAt = last + ROUND * 1000;
    raf = requestAnimationFrame(loop);
  };

  const stop = (reason) => {
    running = false;
    cancelAnimationFrame(raf);

    if (reason === 'pause') {
      showVeil('En pause', 'Lorem ipsum dolor sit amet.', 'Reprendre');
      return;
    }

    if (score > best) {
      best = score;
      bestOut.textContent = best;
      try { localStorage.setItem('p404-best', String(best)); } catch { /* mode privé */ }
    }
    showVeil(
      `${score} point${score > 1 ? 's' : ''}`,
      'Consectetur adipiscing elit. Vous pouvez aussi repartir — les liens sont juste en dessous.',
      'Rejouer'
    );
  };

  /* ----------------------------------------------------------- écouteurs */

  startBtn.addEventListener('click', () => {
    // Reprise après pause : on ne remet pas le score à zéro.
    if (startBtn.textContent === 'Reprendre') {
      veil.hidden = true;
      running = true;
      last = performance.now();
      endsAt = last + (Number(timeOut.textContent) * 1000);
      raf = requestAnimationFrame(loop);
    } else {
      start();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && running) { stop('pause'); return; }
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) e.preventDefault();
    keys.add(k);
  });

  window.addEventListener('keyup', (e) => {
    keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  });

  const toCanvas = (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * W;
    pointer.y = ((e.clientY - r.top) / r.height) * H;
  };

  canvas.addEventListener('pointermove', (e) => { pointer.active = true; toCanvas(e); });
  canvas.addEventListener('pointerdown', (e) => { pointer.active = true; toCanvas(e); });
  canvas.addEventListener('pointerleave', () => { pointer.active = false; });

  // On ne laisse pas tourner une partie sur un onglet quitté.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) stop('pause');
  });

  /* ---------------------------------------------------------- démarrage */

  readPalette();
  reset();
  draw(performance.now());

  if (calm) {
    veilText.textContent =
      'Attrapez les carrés. Les effets décoratifs sont désactivés, conformément à votre réglage système.';
  }

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub]').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });
})();
