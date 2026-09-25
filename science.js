/* =====================================================================
   SCIENCE: physics, maths, machine learning and biology, hidden in
   the landscape. Ripples that interfere, Voronoi ice, ducklings on a
   pursuit curve, a jumping fish, a flock of boids, Conway's Game of
   Life in the stars, a fractal forest and a hiker doing gradient descent.
   Builds on script.js, extras.js and gadgets.js (loaded first).
   ===================================================================== */

const sciHero = $('.hero'), sciLand = $('#landscape');
const SQUASH = 0.3; // the lake is seen at a low angle: distances across it look ~3× shorter than along it
const sciRand = (a, b) => a + Math.random() * (b - a);

/* ---------------- physics: ripples and interference on the lake ---------------- */
// Tap the lake and circular waves spread from that point. Two sets of waves add up: where
// crests meet crests the water rises higher, where crests meet troughs it stays flat (the
// nodal lines of an interference pattern, as in Young's double-slit experiment).
const ripples = (() => {
  const cv = $('#ripples'), ctx = cv.getContext('2d'), lake = $('.l-lake');
  const lakeShape = new Path2D(lake.getAttribute('d'));
  // parts of the scene in front of the water: the near shore and the jetty
  const inFront = [...sciLand.querySelectorAll('.l-near')].slice(1).map((el) => new Path2D(el.getAttribute('d')))
    .concat(new Path2D(sciLand.querySelector('.jetty-deck').getAttribute('d')));
  const SPEED = 30, WAVE = 7, LIFE = 7; // landscape units per second, wavelength in units, seconds
  const off = document.createElement('canvas'), octx = off.getContext('2d');
  let sources = [], raf = 0, L = null, img = null;

  function layout() {
    const m = sciLand.getScreenCTM();
    if (!m || !m.a) return false;
    const hb = sciHero.getBoundingClientRect(), bb = lake.getBBox();
    const left = m.a * bb.x + m.e - hb.left, top = m.d * bb.y + m.f - hb.top, w = m.a * bb.width, h = m.d * bb.height;
    const r = Math.min(devicePixelRatio || 1, 1.5), cell = Math.max(2, w / 320);
    Object.assign(cv.style, { left: `${left}px`, top: `${top}px`, width: `${w}px`, height: `${h}px` });
    cv.width = Math.round(w * r); cv.height = Math.round(h * r);
    off.width = Math.ceil(w / cell); off.height = Math.ceil(h / cell);
    img = octx.createImageData(off.width, off.height);
    L = { m, bb, left, top, r, ux: cell / m.a, uy: cell / m.d, hbLeft: hb.left, hbTop: hb.top };
    return true;
  }

  function frame(t) {
    const now = t / 1000;
    sources = sources.filter((s) => now - s.t0 < LIFE);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (!sources.length) { raf = 0; cv.hidden = true; return; }
    const { bb, ux, uy } = L, gw = off.width, gh = off.height, px = img.data;
    const src = sources.map((s) => ({ ...s, tau: now - s.t0 }));
    for (let j = 0; j < gh; j++) {
      const y = bb.y + (j + 0.5) * uy;
      for (let i = 0; i < gw; i++) {
        const x = bb.x + (i + 0.5) * ux;
        let v = 0;
        for (const s of src) {
          const front = SPEED * s.tau, dx = x - s.x, dy = (y - s.y) / SQUASH, d = Math.sqrt(dx * dx + dy * dy);
          const behind = front - d, train = SPEED * s.train;
          if (behind < 0 || behind > train) continue;
          // a short train of waves, fading with time and spreading out with distance
          v += s.a * Math.sin(Math.PI * behind / train) * Math.sin(2 * Math.PI * behind / WAVE) * Math.exp(-s.tau / 2.6) / Math.sqrt(1 + d / 10);
        }
        const k = (j * gw + i) * 4, a = Math.min(1, Math.abs(v));
        if (v > 0) { px[k] = 255; px[k + 1] = 255; px[k + 2] = 255; px[k + 3] = a * 150; }
        else { px[k] = 12; px[k + 1] = 28; px[k + 2] = 44; px[k + 3] = a * 90; }
      }
    }
    octx.putImageData(img, 0, 0);
    // only on the water: clip to the lake, then cut away the shore and the jetty in front of it
    const { m, r, left, top, hbLeft, hbTop } = L;
    ctx.save();
    ctx.setTransform(r * m.a, 0, 0, r * m.d, r * (m.e - hbLeft - left), r * (m.f - hbTop - top));
    ctx.clip(lakeShape);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, off.width * ux * m.a * r, off.height * uy * m.d * r);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.setTransform(r * m.a, 0, 0, r * m.d, r * (m.e - hbLeft - left), r * (m.f - hbTop - top));
    inFront.forEach((p) => ctx.fill(p));
    ctx.restore();
    raf = requestAnimationFrame(frame);
  }

  function add(x, y, a = 1, train = 1.6) {
    if (reduceMotion || live.frozen) return;
    const now = performance.now() / 1000;
    if (!raf && !layout()) return;
    // two sets of waves at once, some distance apart: that's interference
    if (a >= 1 && sources.some((s) => s.a >= 1 && now - s.t0 < 3 && Math.hypot(s.x - x, (s.y - y) / SQUASH) > 12)) earnBadge('ripple');
    sources.push({ x, y, a, train, t0: now });
    if (sources.length > 4) sources.shift();
    cv.hidden = false;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  // landscape units of a point on the screen
  const toLand = (cx, cy) => new DOMPoint(cx, cy).matrixTransform(sciLand.getScreenCTM().inverse());
  sciLand.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.l-lake, .l-shimmer')) return;
    const p = toLand(e.clientX, e.clientY);
    add(p.x, p.y);
  });
  addEventListener('resize', () => { if (raf) layout(); });
  cv.hidden = true;
  return { add, toLand };
})();

/* ---------------- maths: Voronoi cracks in the ice ---------------- */
// Each crack is the set of points equally far from two "seeds" in the ice: a Voronoi diagram,
// the same geometry as dried mud, giraffe spots and cells in a tissue. New cracks every day.
(function iceCracks() {
  let seed = Math.floor(Date.now() / 864e5) % 2147483646 + 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // work on the lake as seen from above (y stretched), then squash the result back
  const X0 = 920, X1 = 1450, Y0 = 440 / SQUASH, Y1 = 498 / SQUASH, sites = [];
  for (let tries = 0; sites.length < 14 && tries < 500; tries++) {
    const p = [X0 + 20 + rnd() * (X1 - X0 - 40), Y0 + 10 + rnd() * (Y1 - Y0 - 20)];
    if (sites.every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) > 58)) sites.push(p);
  }
  // cell of site i: the box, cut by the perpendicular bisector with every other site
  const clip = (poly, [ax, ay], [bx, by]) => {
    const mx = (ax + bx) / 2, my = (ay + by) / 2, nx = bx - ax, ny = by - ay, out = [];
    const side = ([x, y]) => (x - mx) * nx + (y - my) * ny; // ≤ 0: closer to a than to b
    poly.forEach((p, k) => {
      const q = poly[(k + 1) % poly.length], sp = side(p), sq = side(q);
      if (sp <= 0) out.push(p);
      if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) { const t = sp / (sp - sq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
    });
    return out;
  };
  const onBox = ([x, y]) => Math.abs(x - X0) < 0.01 || Math.abs(x - X1) < 0.01 || Math.abs(y - Y0) < 0.01 || Math.abs(y - Y1) < 0.01;
  const seen = new Set();
  let d = '';
  sites.forEach((s, i) => {
    let cell = [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1]];
    sites.forEach((o, j) => { if (j !== i && cell.length) cell = clip(cell, s, o); });
    cell.forEach((p, k) => {
      const q = cell[(k + 1) % cell.length];
      if (onBox(p) && onBox(q)) return; // the edge of the box is not a crack
      const key = `${Math.round(p[0] + q[0])},${Math.round(p[1] + q[1])}`;
      if (seen.has(key)) return;       // each crack borders two cells: draw it once
      seen.add(key);
      // real cracks are a little jagged
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]), nx = -(q[1] - p[1]) / len, ny = (q[0] - p[0]) / len;
      const pts = [p, ...[1 / 3, 2 / 3].map((t) => { const w = (rnd() - 0.5) * Math.min(6, len * 0.12); return [p[0] + t * (q[0] - p[0]) + nx * w, p[1] + t * (q[1] - p[1]) + ny * w]; }), q];
      d += 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${(y * SQUASH).toFixed(1)}`).join(' L');
    });
  });
  $('#iceCracks').setAttribute('d', d);
})();

/* ---------------- maths: ducklings on a pursuit curve ---------------- */
// The mother duck paddles around the lake; each duckling always swims straight towards the
// one in front. The paths they trace are pursuit curves (Bouguer, 1732).
(function ducks() {
  const group = $('#ducks'), birds = [...group.querySelectorAll('.duck')], flips = birds.map((b) => b.querySelector('.dk-flip'));
  const AREA = { x0: 968, x1: 1268, y0: 460, y1: 482 };
  const P = [[1100, 470 / SQUASH], [1087, 471 / SQUASH], [1076, 471 / SQUASH]]; // lake seen from above
  const facing = [1, 1, 1], SPEED = 5, GAP = 11;
  let heading = 0, target = null, raf = 0, last = 0, drawn = 0;
  const newTarget = () => { target = [sciRand(AREA.x0, AREA.x1), sciRand(AREA.y0, AREA.y1) / SQUASH]; };
  newTarget();

  function step(t) {
    const dt = Math.min(0.1, (t - (last || t)) / 1000); last = t;
    // the mother turns gently towards where she wants to go
    const m = P[0], want = Math.atan2(target[1] - m[1], target[0] - m[0]);
    let turn = ((want - heading + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    turn = Math.max(-0.7 * dt, Math.min(0.7 * dt, turn));
    heading += turn;
    const moves = [[Math.cos(heading) * SPEED * dt, Math.sin(heading) * SPEED * dt]];
    if (Math.hypot(target[0] - m[0], target[1] - m[1]) < 8) newTarget();
    // each duckling heads straight for the one in front, faster when it has fallen behind
    for (let i = 1; i < P.length; i++) {
      const [lx, ly] = P[i - 1], [x, y] = P[i], dist = Math.hypot(lx - x, ly - y) || 1;
      const v = SPEED * Math.max(0, Math.min(1.8, 1 + 3 * (dist - GAP) / GAP));
      moves.push([(lx - x) / dist * v * dt, (ly - y) / dist * v * dt]);
    }
    moves.forEach(([dx, dy], i) => {
      P[i][0] += dx; P[i][1] += dy;
      if (Math.abs(dx) > 0.3 * SPEED * dt) facing[i] = Math.sign(dx);
    });
    if (t - drawn > 33) { // 30 frames a second is plenty for ducks
      drawn = t;
      birds.forEach((b, i) => {
        b.setAttribute('transform', `translate(${P[i][0].toFixed(1)} ${(P[i][1] * SQUASH).toFixed(1)})`);
        flips[i].setAttribute('transform', facing[i] < 0 ? 'scale(-1 1)' : '');
      });
    }
    raf = requestAnimationFrame(step);
  }
  // swim only while the ducks are out (summer days) and the landscape is on screen
  const check = () => {
    const on = !reduceMotion && heroVisible() && getComputedStyle(group).display !== 'none';
    if (on && !raf) { last = 0; raf = requestAnimationFrame(step); }
    if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  setInterval(check, 1000);
  check();
})();

/* ---------------- biology: a fish jumps on summer evenings ---------------- */
let fishing = false;
function fishJump(force = false) {
  const twilight = lastSky.d > 0.12 && lastSky.d < 0.9;
  if (fishing || reduceMotion || !heroVisible() || live.frozen) return;
  if (!force && (currentSeason() !== 'summer' || !twilight || live.particle)) return;
  fishing = true;
  const fish = $('#fish'), x = sciRand(985, 1255), y = sciRand(463, 480), dir = Math.random() < 0.5 ? -1 : 1;
  const dx = dir * sciRand(9, 14), up = sciRand(8, 13), DUR = 850;
  ripples.add(x, y, 0.55, 0.7);
  fish.classList.add('show');
  let t0 = 0;
  const step = (t) => {
    if (!t0) t0 = t;
    const k = Math.min(1, (t - t0) / DUR);
    // a parabola, nose along the direction of flight
    const px = x + dx * k, py = y - 4 * up * k * (1 - k), vy = -4 * up * (1 - 2 * k);
    const angle = Math.atan2(vy, Math.abs(dx)) * 180 / Math.PI;
    fish.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${dir} 1) rotate(${angle.toFixed(0)})`);
    if (k < 1) requestAnimationFrame(step);
    else { fish.classList.remove('show'); ripples.add(x + dx, y, 0.8, 0.8); fishing = false; }
  };
  requestAnimationFrame(step);
}

/* ---------------- biology: a flock of boids ---------------- */
// Craig Reynolds' boids (1987): every bird follows three local rules (don't crowd your
// neighbours, fly the way they fly, stay close to them) and the flock emerges by itself.
let flocking = false;
function flock(force = false) {
  if (flocking || reduceMotion || !heroVisible()) return;
  if (!force && (lastSky.d > 0.5 || live.particle || live.overcast > 0.85 || $('#birds').classList.contains('fly'))) return;
  flocking = true;
  const cv = $('#flock'), ctx = cv.getContext('2d'), r = Math.min(devicePixelRatio || 1, 1.5);
  const W = cv.clientWidth, H = cv.clientHeight;
  cv.width = Math.round(W * r); cv.height = Math.round(H * r); ctx.setTransform(r, 0, 0, r, 0, 0);
  const narrow = innerWidth < 760, n = narrow ? 14 : 22, scale = Math.max(0.6, Math.min(1.2, W / 1440));
  const dir = Math.random() < 0.5 ? 1 : -1, cruise = 75 * scale, maxV = 105 * scale, minV = 45 * scale;
  const yMid = H * sciRand(0.3, 0.5);
  const boids = Array.from({ length: n }, () => ({
    x: dir > 0 ? -sciRand(20, 160) : W + sciRand(20, 160), y: yMid + sciRand(-40, 40),
    vx: dir * cruise * sciRand(0.8, 1.1), vy: sciRand(-15, 15), ph: Math.random() * 6.28,
  }));
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--hero-ink').trim() || '#111111';
  const [ir, ig, ib] = hex2rgb(ink);
  let last = 0, t0 = 0;
  const frame = (t) => {
    if (!t0) t0 = last = t;
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    for (const b of boids) {
      let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, k = 0;
      for (const o of boids) {
        if (o === b) continue;
        const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 > 70 * 70) continue;
        cx += o.x; cy += o.y; ax += o.vx; ay += o.vy; k++;
        if (d2 < 16 * 16) { sx -= dx / (d2 + 1) * 16; sy -= dy / (d2 + 1) * 16; }
      }
      let fx = 0, fy = 0;
      if (k) {
        fx += (cx / k - b.x) * 0.9 + (ax / k - b.vx) * 1.1;   // cohesion + alignment
        fy += (cy / k - b.y) * 0.9 + (ay / k - b.vy) * 1.1;
      }
      fx += sx * 60 + (dir * cruise - b.vx) * 0.4;              // separation + where the flock is heading
      fy += sy * 60 + Math.sin(t / 900 + b.ph) * 18;
      if (b.y < H * 0.12) fy += (H * 0.12 - b.y) * 2;            // stay in the sky
      if (b.y > H * 0.75) fy -= (b.y - H * 0.75) * 2;
      b.vx += fx * dt; b.vy += fy * dt;
      const v = Math.hypot(b.vx, b.vy), c = Math.max(minV, Math.min(maxV, v)) / (v || 1);
      b.vx *= c; b.vy *= c;
    }
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    for (const b of boids) {
      b.x += b.vx * dt; b.y += b.vy * dt;
      const wing = Math.sin(t / 55 + b.ph) * 2.2, s = narrow ? 2.4 : 3;
      ctx.moveTo(b.x - s, b.y - wing); ctx.quadraticCurveTo(b.x - s / 2, b.y - 1.5, b.x, b.y);
      ctx.quadraticCurveTo(b.x + s / 2, b.y - 1.5, b.x + s, b.y - wing);
    }
    ctx.strokeStyle = `rgba(${ir}, ${ig}, ${ib}, .6)`; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.stroke();
    const gone = boids.every((b) => (dir > 0 ? b.x > W + 30 : b.x < -30));
    if (!gone && t - t0 < 60000) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, W, H); flocking = false; }
  };
  requestAnimationFrame(frame);
}

/* ---------------- maths: Conway's Game of Life in the night sky ---------------- */
// Each star is a cell. A live cell with 2 or 3 live neighbours survives, a dead cell with
// exactly 3 comes alive, everything else dies. From these rules: gliders, oscillators, chaos.
let lifeRunning = false;
function lifeShow() {
  lifeRunning = true;
  const cv = $('#smlm'), ctx = cv.getContext('2d'), r = Math.min(devicePixelRatio || 1, 1.5);
  const W = cv.clientWidth, H = cv.clientHeight, hb = sciHero.getBoundingClientRect();
  cv.width = Math.round(W * r); cv.height = Math.round(H * r); ctx.setTransform(r, 0, 0, r, 0, 0);
  const CELL = innerWidth < 760 ? 5 : 6, cols = Math.floor(W / CELL), rows = Math.floor(H * 0.6 / CELL);
  let grid = new Uint8Array(cols * rows), next = new Uint8Array(cols * rows);
  const set = (c, rr) => { if (c >= 0 && c < cols && rr >= 0 && rr < rows) grid[rr * cols + c] = 1; };
  // the seed: the real stars, and a few long-lived patterns placed on some of them
  const stars = [...document.querySelectorAll('#starfield circle')].map((el) => {
    const b = el.getBoundingClientRect();
    return [Math.floor((b.left + b.width / 2 - hb.left) / CELL), Math.floor((b.top + b.height / 2 - hb.top) / CELL)];
  }).filter(([c, rr]) => c >= 0 && c < cols && rr >= 0 && rr < rows);
  stars.forEach(([c, rr]) => set(c, rr));
  const PATTERNS = [
    [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],                          // R-pentomino
    [[1, 0], [3, 1], [0, 2], [1, 2], [4, 2], [5, 2], [6, 2]],          // acorn
    [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],                          // glider
  ];
  const picks = stars.slice().sort(() => Math.random() - 0.5).slice(0, Math.max(10, Math.round(cols * rows / 650)));
  picks.forEach(([c, rr], i) => {
    if (i % 2) { // a small random "soup" around the star: chaotic, and long-lived
      for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) if (Math.random() < 0.37) set(c + dx, rr + dy);
      return;
    }
    const p = PATTERNS[(i / 2) % PATTERNS.length], fx = Math.random() < 0.5 ? 1 : -1, fy = Math.random() < 0.5 ? 1 : -1;
    p.forEach(([dx, dy]) => set(c + dx * fx, rr + dy * fy));
  });
  const step = () => {
    for (let rr = 0; rr < rows; rr++) {
      for (let c = 0; c < cols; c++) {
        let n = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const y = rr + dy;
          if (y < 0 || y >= rows) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const x = c + dx;
            if ((dx || dy) && x >= 0 && x < cols) n += grid[y * cols + x];
          }
        }
        const i = rr * cols + c;
        next[i] = n === 3 || (n === 2 && grid[i]) ? 1 : 0;
      }
    }
    [grid, next] = [next, grid];
  };
  const draw = (alpha) => {
    ctx.clearRect(0, 0, W, H);
    const dots = new Path2D(), rad = CELL * 0.26;
    for (let i = 0; i < grid.length; i++) {
      if (!grid[i]) continue;
      const x = (i % cols) * CELL + CELL / 2, y = Math.floor(i / cols) * CELL + CELL / 2;
      dots.moveTo(x + rad, y); dots.arc(x, y, rad, 0, 6.29);
    }
    ctx.fillStyle = `rgba(238, 243, 255, ${alpha})`; ctx.fill(dots);
  };
  const SEED = 1500, RUN = 40000, FADE = 2500, RATE = 110; // ms; one generation every 110 ms
  sciHero.classList.add('smlm-on', 'life-on');
  let t0 = 0, gen = 0;
  const frame = (t) => {
    if (!t0) t0 = t;
    const el = t - t0;
    if (el > SEED && el < SEED + RUN) {
      const want = Math.floor((el - SEED) / RATE);
      let changed = false;
      while (gen < want) { step(); gen++; changed = true; }
      if (changed) draw(0.9);
    } else if (el <= SEED) draw(Math.min(0.9, el / 600));
    else draw(0.9 * Math.max(0, 1 - (el - SEED - RUN) / FADE));
    if (el < SEED + RUN + FADE) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, W, H); sciHero.classList.remove('smlm-on', 'life-on'); lifeRunning = false; }
  };
  requestAnimationFrame(frame);
}
COMMANDS.life = () => {
  if (lifeRunning) return 'The game is already running. Look up.';
  if (smlmRunning) return 'The microscope is using the sky right now. Try again in a moment.';
  if (lastSky.d < 0.75) return 'The stars are only out at night. Come back after sunset.';
  if (live.overcast > 0.6) return 'Too cloudy tonight: no stars to play with.';
  if (reduceMotion) return 'This one needs animations, which are turned off on your device.';
  closeGps();
  scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(lifeShow, 600);
  earnBadge('life');
  return "Conway's Game of Life: every star is a cell. Look up.";
};
const smlmCommand = COMMANDS.smlm;
COMMANDS.smlm = () => (lifeRunning ? 'The stars are busy playing the Game of Life. Try again in a minute.' : smlmCommand());

/* ---------------- maths: a fractal forest ---------------- */
// Every pine regrows as a fractal: a trunk whose branches are smaller copies of the trunk,
// whose branches are smaller copies again. Rarely by itself, or with the terminal.
let fractalOn = false, plainTrees = '';
function fractalForest(on) {
  const g = $('#trees');
  if (on === fractalOn) return;
  fractalOn = on;
  if (!on) { g.innerHTML = plainTrees; g.classList.remove('fractal'); return; }
  plainTrees = g.innerHTML;
  const f = (v) => v.toFixed(1);
  let out = '';
  treeSpots.forEach(([x, y, h]) => {
    let d = '';
    const branch = (x0, y0, ang, len, depth) => {
      const x1 = x0 + len * Math.sin(ang), y1 = y0 - len * Math.cos(ang);
      d += `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
      if (!depth) return;
      const n = len > 18 ? 5 : 3;
      for (let i = 0; i < n; i++) {
        const t = 0.2 + (0.72 * i) / n, bx = x0 + (x1 - x0) * t, by = y0 + (y1 - y0) * t, l = len * 0.42 * (1 - t);
        branch(bx, by, ang - 1.05, l, depth - 1);
        branch(bx, by, ang + 1.05, l, depth - 1);
      }
    };
    branch(x, y, 0, h, h > 30 ? 2 : 1);
    out += `<path d="${d}"/>`;
  });
  g.innerHTML = out;
  g.classList.add('fractal');
  earnBadge('fractal');
}
COMMANDS.fractal = () => {
  fractalForest(!fractalOn);
  if (!fractalOn) return 'The forest is back to normal.';
  closeGps();
  scrollTo({ top: 0, behavior: 'smooth' });
  return 'Every pine is now made of smaller pines. Type <b class="warn">fractal</b> again to undo.';
};

/* ---------------- machine learning: gradient descent on the career trail ---------------- */
// The hiker looks for the lowest point of the trail the way a neural network looks for the
// lowest loss: take a step downhill, proportional to the slope, and repeat. Plain gradient
// descent gets stuck in the first dip; with momentum (a heavy ball rolling) it gets further.
async function descend() {
  if (hiker.busy || !hiker.trail) return;
  hiker.busy = true;
  const svg = $('#profile'), trail = hiker.trail, total = hiker.total;
  // the height of the trail along x (svg y points down, so height = −y)
  const N = 500, xs = [], ys = [], ls = [];
  for (let i = 0; i <= N; i++) { const p = trail.getPointAtLength((total * i) / N); xs.push(p.x); ys.push(p.y); ls.push((total * i) / N); }
  const lerp = (arr, x) => {
    let lo = 0, hi = N;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] < x) lo = mid; else hi = mid; }
    const t = Math.max(0, Math.min(1, (x - xs[lo]) / ((xs[hi] - xs[lo]) || 1)));
    return arr[lo] + t * (arr[hi] - arr[lo]);
  };
  const xMin = xs[0] + 1, xMax = xs[N] - 1;
  const height = (x) => -lerp(ys, x), slope = (x) => (height(x + 3) - height(x - 3)) / 6;
  const clampX = (x) => Math.max(xMin, Math.min(xMax, x));

  const dots = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  dots.setAttribute('class', 'gd');
  dots.innerHTML = '<text class="gd-status" x="8" y="44"></text>';
  svg.appendChild(dots);
  const status = dots.querySelector('text');
  const say = (text) => { status.textContent = text; };
  const mark = (x, cls) => dots.insertAdjacentHTML('beforeend', `<circle class="${cls}" cx="${x.toFixed(1)}" cy="${lerp(ys, x).toFixed(1)}" r="3"/>`);
  const walk = (x) => hiker.walkTo(lerp(ls, x), 0.35);
  const pause = (ms) => new Promise((ok) => setTimeout(ok, ms));

  // start from today: the newest career waypoint
  const nowMark = svg.querySelector(`.wp[data-k="job-${SITE.cv.length - 1}"]`);
  const start = clampX(nowMark ? +nowMark.dataset.x : trail.getPointAtLength(hiker.where()).x), LR = 90;
  say('starting from today');
  await walk(start);
  await pause(500);
  // 1. plain gradient descent: x ← x − lr · slope
  let x = start;
  mark(x, 'gd-plain');
  for (let n = 1; n <= 60; n++) {
    const next = clampX(x - LR * slope(x));
    say(`gradient descent · step ${n}`);
    await walk(next); mark(next, 'gd-plain'); await pause(90);
    const moved = Math.abs(next - x);
    x = next;
    if (moved < 0.8 || x === xMin) break;
  }
  const stuck = x;
  say(x <= xMin + 1 ? 'reached the bottom of the trail' : 'stuck in a local minimum');
  await pause(1800);
  // 2. the same start, with momentum: v ← β·v − lr · slope, x ← x + v
  say('once more, with momentum (β = 0.9)');
  await walk(start);
  await pause(600);
  let v = 0;
  x = start;
  for (let n = 1; n <= 90; n++) {
    v = 0.9 * v - LR * slope(x);
    const next = clampX(x + v);
    if (next === xMin || next === xMax) v = 0;
    say(`momentum · step ${n}`);
    await walk(next); mark(next, 'gd-momentum'); await pause(60);
    x = next;
    if (x === xMin || (Math.abs(v) < 0.8 && Math.abs(slope(x)) < 0.01)) break;
  }
  const better = height(x) < height(stuck) - 1;
  say(better ? (x <= xMin + 1 ? 'momentum rolled past the dip: lowest point reached' : 'momentum rolled past the dip: lower than before') : 'momentum found the same valley');
  earnBadge('descend');
  await pause(4000);
  dots.classList.add('gone');
  await pause(900);
  dots.remove();
  hiker.busy = false;
  hiker.home();
}
COMMANDS.descend = () => {
  if (hiker.busy) return 'The hiker is already on the way down.';
  setTimeout(() => goTo('timeline'), 300);
  setTimeout(descend, 1400);
  return 'Minimising altitude by gradient descent…';
};

/* ---------------- schedule and previews ---------------- */
every(20, 60, () => fishJump());
setTimeout(() => flock(), 25000);
every(100, 240, () => flock());
if (Math.random() < 0.03 || params.has('fractal')) fractalForest(true); // now and then, the forest is fractal
// preview helpers for FEATURES.md: ?fish, ?flock, ?life, ?descend, ?ripples
if (params.has('fish')) { setTimeout(() => fishJump(true), 800); setInterval(() => fishJump(true), 4000); }
if (params.has('flock')) setTimeout(() => flock(true), 800);
if (params.has('life')) setTimeout(() => (lastSky.d >= 0.75 ? lifeShow() : toast('The Game of Life needs the night sky.')), 900);
if (params.has('descend')) setTimeout(() => { $('#timeline').scrollIntoView(); setTimeout(descend, 800); }, 900);
if (params.has('ripples')) setTimeout(() => { ripples.add(1060, 468); setTimeout(() => ripples.add(1170, 472), 700); }, 1000);
