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
    const glow = src.some((s) => s.glow); // at night: bioluminescent plankton lights up where the water moves
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
        if (glow) {
          if (v > 0) { px[k] = 90; px[k + 1] = 225; px[k + 2] = 255; px[k + 3] = Math.min(255, a * 260); }
          else { px[k] = 20; px[k + 1] = 110; px[k + 2] = 160; px[k + 3] = a * 70; }
        } else if (v > 0) { px[k] = 255; px[k + 1] = 255; px[k + 2] = 255; px[k + 3] = a * 150; }
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
    sources.push({ x, y, a, train, t0: now, glow: lastSky.d > 0.75 });
    if (sources.length > 4) sources.shift();
    cv.hidden = false;
    if (!raf) raf = requestAnimationFrame(frame);
  }

  // landscape units of a point on the screen
  const toLand = (cx, cy) => new DOMPoint(cx, cy).matrixTransform(sciLand.getScreenCTM().inverse());
  sciLand.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.l-lake')) return;
    const p = toLand(e.clientX, e.clientY);
    add(p.x, p.y);
    if (lastSky.d > 0.75 && !live.frozen && !reduceMotion) earnBadge('glow');
  });
  addEventListener('resize', () => { if (raf) layout(); });
  cv.hidden = true;
  return { add, toLand };
})();

/* ---------------- physics: glints under the sun, a moonlight path at night ---------------- */
// Light reflected by a rippled lake reaches you only from the part of the water between you and
// the sun (or moon): a column of glints straight below it, wider close to the shore in front.
// No glints on a grey or foggy day, in rain, on ice, or under a moon less than half full.
(function glints() {
  const g = $('#glints'), sun = $('#sun');
  let key = '';
  function draw({ isDay }) {
    const moon = moonPhase(), clearSky = 1 - live.overcast, light = isDay ? sun : $('#moon');
    const strength = live.frozen || live.fog || live.particle ? 0
      : isDay ? clearSky : light.hidden ? 0 : clearSky * Math.max(0, (moon.illum - 0.45) / 0.55); // moonlight only while the moon is up
    // where the sun or moon stands, in landscape units
    const hb = sciHero.getBoundingClientRect(), m = sciLand.getScreenCTM();
    const left = parseFloat(light.style.left);
    let x = null;
    if (m && strength > 0.3 && !isNaN(left)) x = new DOMPoint(hb.left + (left / 100) * hb.width, 0).matrixTransform(m.inverse()).x;
    const onLake = x !== null && x > 945 && x < 1430;
    const next = onLake ? `${Math.round(x)}|${isDay}|${strength.toFixed(2)}` : 'none';
    if (next === key) return;
    key = next;
    if (!onLake) { g.innerHTML = ''; return; }
    const colour = isDay ? '#FFFFFF' : '#F3EFD8', rows = [453, 458, 463, 468, 474, 480, 486];
    g.innerHTML = rows.map((y, i) => {
      const k = (y - 453) / 33;                       // 0 at the far shore, 1 in front
      const half = (isDay ? 5 : 3.5) + k * (isDay ? 14 : 8), dx = Math.sin(i * 2.4) * (2 + k * 6);
      if (y < 476 && x + dx + half > 1291 && x + dx - half < 1313) return ''; // not on the jetty
      const o = (0.25 + 0.45 * strength) * (isDay ? 1 : 0.85);
      return `<path d="M${(x + dx - half).toFixed(1)} ${y} H${(x + dx + half).toFixed(1)}" stroke="${colour}" stroke-width="${(0.8 + k * 0.7).toFixed(2)}" style="--o: ${o.toFixed(2)}; animation-delay: ${(-i * 0.45).toFixed(2)}s"/>`;
    }).join('');
  }
  skyHooks.push(draw);
  addEventListener('resize', () => { key = ''; setTimeout(() => draw(lastSky), 400); });
  draw(lastSky);
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
  // not through the rowing boat, if it's out
  const boatOut = $('#rowboat').classList.contains('show');
  const x = boatOut ? (Math.random() < 0.5 ? sciRand(985, 1040) : sciRand(1222, 1258)) : sciRand(985, 1255);
  const fish = $('#fish'), y = sciRand(463, 480), dir = Math.random() < 0.5 ? -1 : 1;
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
  if (flowRunning) return 'The sky is busy right now. Try again in a minute.';
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
COMMANDS.smlm = () => (lifeRunning || flowRunning ? 'The stars are busy playing the Game of Life. Try again in a minute.' : smlmCommand());

/* ---------------- flow: from a Gaussian to my initials, by optimal transport ---------------- */
// Points are sampled from a Gaussian and matched one-to-one to points sampled from the letters "SB"
// with the assignment that minimises the total squared distance (exact optimal transport, solved with
// the Hungarian algorithm). Each point then moves along a straight line: the displacement
// interpolation between the two distributions, the same paths that OT flow matching learns.
let flowRunning = false;
// minimum-cost assignment for an n×n cost matrix (Hungarian algorithm, O(n³)); returns target of each source
function hungarian(C, n) {
  const u = new Float64Array(n + 1), v = new Float64Array(n + 1), p = new Int32Array(n + 1), way = new Int32Array(n + 1);
  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Float64Array(n + 1).fill(Infinity), used = new Uint8Array(n + 1);
    do {
      used[j0] = 1;
      const i0 = p[j0], row = (i0 - 1) * n;
      let delta = Infinity, j1 = 0;
      for (let j = 1; j <= n; j++) {
        if (used[j]) continue;
        const cur = C[row + j - 1] - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= n; j++) {
        if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta;
      }
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const to = new Int32Array(n);
  for (let j = 1; j <= n; j++) to[p[j] - 1] = j - 1;
  return to;
}
const gauss = () => { let a = 0; while (!a) a = Math.random(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * Math.random()); };
function flowShow() {
  flowRunning = true;
  sciHero.classList.add('life-on');
  const cv = $('#smlm'), ctx = cv.getContext('2d'), r = Math.min(devicePixelRatio || 1, 1.5);
  const W = cv.clientWidth, H = cv.clientHeight, narrow = innerWidth < 760;
  cv.width = Math.round(W * r); cv.height = Math.round(H * r); ctx.setTransform(r, 0, 0, r, 0, 0);
  const N = narrow ? 320 : 480, cx = narrow ? W * 0.5 : W * 0.72, cy = narrow ? H * 0.54 : H * 0.3, size = narrow ? Math.min(W * 0.5, H * 0.2) : Math.min(W * 0.2, H * 0.34);
  // the target: pixels of the letters, thinned out to N points
  const off = document.createElement('canvas'), oc = off.getContext('2d');
  const font = `800 ${Math.round(size)}px ${getComputedStyle(document.body).fontFamily}`;
  oc.font = font;
  const tw = Math.ceil(oc.measureText('SB').width) + 4, th = Math.ceil(size * 1.1);
  off.width = tw; off.height = th;
  oc.font = font; oc.textBaseline = 'middle'; oc.fillText('SB', 2, th / 2);
  const img = oc.getImageData(0, 0, tw, th).data, cand = [];
  for (let y = 0; y < th; y += 2) for (let x = 0; x < tw; x += 2) if (img[(y * tw + x) * 4 + 3] > 140) cand.push([x, y]);
  for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cand[i], cand[j]] = [cand[j], cand[i]]; }
  const target = cand.slice(0, N).map(([x, y]) => [cx - tw / 2 + x + Math.random() - 0.5, cy - th / 2 + y + Math.random() - 0.5]);
  const n = target.length;
  const source = Array.from({ length: n }, () => [cx + gauss() * size * 0.55, cy + gauss() * size * 0.55]);
  const C = new Float64Array(n * n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const dx = source[i][0] - target[j][0], dy = source[i][1] - target[j][1]; C[i * n + j] = dx * dx + dy * dy; }
  const match = hungarian(C, n);
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--hero-ink').trim() || '#111111';
  const [ir, ig, ib] = hex2rgb(ink);
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  // timeline (ms): fade in, look at the noise, flow, admire, fade out
  const T = { in: 700, hold: 1400, flow: 3600, show: 4500, out: 1200 };
  const total = T.in + T.hold + T.flow + T.show + T.out;
  let t0 = 0;
  const frame = (now) => {
    if (!t0) t0 = now;
    const e = now - t0;
    ctx.clearRect(0, 0, W, H);
    const k = ease(Math.min(1, Math.max(0, (e - T.in - T.hold) / T.flow)));
    const alpha = e < T.in ? e / T.in : e > total - T.out ? Math.max(0, (total - e) / T.out) : 1;
    if (k > 0 && k < 1) { // the straight paths, faintly
      ctx.strokeStyle = `rgba(${ir}, ${ig}, ${ib}, ${0.12 * alpha})`; ctx.lineWidth = 0.6; ctx.beginPath();
      for (let i = 0; i < n; i++) { const [sx, sy] = source[i], [tx, ty] = target[match[i]]; ctx.moveTo(sx, sy); ctx.lineTo(sx + (tx - sx) * k, sy + (ty - sy) * k); }
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(${ir}, ${ig}, ${ib}, ${0.85 * alpha})`; ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const [sx, sy] = source[i], [tx, ty] = target[match[i]], x = sx + (tx - sx) * k, y = sy + (ty - sy) * k;
      ctx.moveTo(x + 1.6, y); ctx.arc(x, y, 1.6, 0, Math.PI * 2);
    }
    ctx.fill();
    if (e < total) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, W, H); sciHero.classList.remove('life-on'); flowRunning = false; }
  };
  requestAnimationFrame(frame);
  earnBadge('flow');
}
COMMANDS.flow = () => {
  if (flowRunning) return 'Already flowing. Look up.';
  if (lifeRunning || smlmRunning) return 'The sky is busy right now. Try again in a minute.';
  if (reduceMotion) return 'This one needs animations, which are turned off on your device.';
  closeGps();
  scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(flowShow, 600);
  return `Sampling points from a Gaussian, pairing each with a point of my initials by optimal transport
(the pairing with the smallest total squared distance), and moving them along straight lines.`;
};

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

/* ---------------- the real northern sky: the Big Dipper, the Pole Star and Cassiopeia ---------------- */
// The view looks north (that's where the northern lights are). These stars are placed where they
// really are for Vienna at the shown time: the Pole Star stands as high as the latitude (48°) and the
// Big Dipper and Cassiopeia turn around it once a (sidereal) day, low in the north on autumn evenings,
// high overhead in spring. Positions: J2000 right ascension (hours), declination (°), magnitude.
const NORTH_STARS = [
  [2.530, 89.264, 2.0],                                                                  // Polaris
  [11.062, 61.751, 1.8], [11.031, 56.382, 2.4], [11.897, 53.695, 2.4], [12.257, 57.033, 3.3], // Dubhe, Merak, Phecda, Megrez
  [12.900, 55.960, 1.8], [13.399, 54.925, 2.2], [13.792, 49.313, 1.9],                   // Alioth, Mizar, Alkaid
  [0.153, 59.150, 2.3], [0.675, 56.537, 2.2], [0.945, 60.717, 2.5], [1.430, 60.235, 2.7], [1.907, 63.670, 3.4], // Cassiopeia's W
];
const northSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
northSvg.setAttribute('viewBox', '0 0 1440 600'); northSvg.setAttribute('preserveAspectRatio', 'xMidYMin slice');
northSvg.innerHTML = NORTH_STARS.map(([, , mag]) => `<circle r="${Math.max(0.7, 2.1 - 0.4 * mag).toFixed(2)}"/>`).join('');
$('#starfield').appendChild(northSvg);
const northDots = [...northSvg.children];
function placeNorthStars({ h }) {
  if (lastSky.d < 0.3 && document.documentElement.dataset.night !== 'yes') return; // only matters when stars show
  const rad = Math.PI / 180, lat = base().lat * rad;
  const when = shownDate(h); // the shown time (it may be simulated)
  const days = when.getTime() / 864e5 - 10957.5; // days since J2000
  const lst = ((18.697374558 + 24.06570982441908 * days) + base().lon / 15) % 24;
  NORTH_STARS.forEach(([ra, dec], i) => {
    const H = (lst - ra) * 15 * rad, d = dec * rad;
    const east = -Math.cos(d) * Math.sin(H), north = Math.sin(d) * Math.cos(lat) - Math.cos(d) * Math.cos(H) * Math.sin(lat);
    const alt = Math.asin(Math.sin(d) * Math.sin(lat) + Math.cos(d) * Math.cos(H) * Math.cos(lat)) / rad;
    const az = Math.atan2(east, north) / rad; // 0 = north, + = east (to the right, looking north)
    const x = 720 + az * 7 * Math.cos(alt * rad * 0.8), y = 440 - alt * 6.4; // below ~12° they are behind the mountains
    northDots[i].setAttribute('cx', x.toFixed(1)); northDots[i].setAttribute('cy', y.toFixed(1));
  });
}
skyHooks.push(placeNorthStars);
placeNorthStars(lastSky);

/* ---------------- shadows from the real sun ---------------- */
// The cottage, the sauna and the snowman cast soft shadows. Their length follows the sun's real height
// (long in the morning and evening and all winter day, short at summer noon); their direction follows
// the sun as it's drawn: low on the left in the morning throws them to the right, around noon they point
// towards you, in the evening to the left. Clouds soften them away. Each object: its footprint on the
// ground and a few points at their height above it (landscape units).
const SHADOW_SHAPES = {
  shCottage: { y: 447, pts: [[1180, 0], [1210, 0], [1175, 16], [1215, 16], [1195, 30], [1203, 31], [1207, 31]] },
  shSauna: { y: 448.6, pts: [[1331, 0], [1351, 0], [1329, 9.4], [1353, 9.4], [1341, 16], [1348, 17.2]] },
  shSnowman: { y: 448.2, pts: [[1357.8, 0], [1366.2, 0], [1357.6, 4], [1366.4, 4], [1358.8, 10.8], [1365.2, 10.8], [1359.8, 16], [1364.2, 16], [1360.6, 21.5], [1363.4, 21.5]] },
};
const hull = (pts) => { // convex hull (monotone chain) of a few points
  pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => list.reduce((h, p) => { while (h.length > 1 && cross(h[h.length - 2], h[h.length - 1], p) <= 0) h.pop(); h.push(p); return h; }, []);
  const lower = half(pts), upper = half(pts.slice().reverse());
  return lower.slice(0, -1).concat(upper.slice(0, -1));
};
function castShadows({ h, isDay, sunT }) {
  const alt = sunT.alt(h);
  // the sun has to be out: full shadows up to about a quarter cloud cover, none when overcast, raining, snowing or foggy
  const sunOut = Math.min(1, Math.max(0, (0.85 - live.overcast) / 0.6)) * (live.particle || live.fog ? 0 : 1);
  const strength = isDay ? Math.min(1, Math.max(0, (alt - 1) / 5)) * sunOut : 0;
  setVar('--shadow-o', (0.2 * strength).toFixed(3));
  document.documentElement.classList.toggle('snowman-shadow', $('#snowman').classList.contains('show'));
  if (strength <= 0) return;
  const p = Math.min(1, Math.max(0, (h - sunT.rise) / (sunT.set - sunT.rise))), sunX = 691 + 662 * p; // where the sun is drawn (landscape x)
  const k = Math.min(2.5, 1 / Math.tan(Math.max(3, alt) * Math.PI / 180)); // ground length per unit of height
  for (const [id, { y, pts }] of Object.entries(SHADOW_SHAPES)) {
    const s = Math.max(-1, Math.min(1, (pts[0][0] - sunX) / 500)); // sun to the left of it: shadow to the right, and back
    const vx = s * k, vy = (1 - Math.abs(s)) * k * 0.3; // towards you is foreshortened: the ground is seen at a low angle
    const ground = pts.map(([x, ht]) => [x + vx * ht, y + vy * ht]);
    $('#' + id).setAttribute('d', 'M' + hull(ground).map(([x, gy]) => `${x.toFixed(1)} ${gy.toFixed(2)}`).join(' L') + ' Z');
  }
}
skyHooks.push(castShadows);
if (lastSky.sunT) castShadows(lastSky);

/* ---------------- frost on the window ---------------- */
// When it's really freezing where I am (-3 °C or colder, from the live weather), ice ferns grow in from
// the corners of the "window", the way frost does on glass: straight needles that branch at 60°
// (ice is hexagonal). The colder it is, the further they reach. Drawn once, then left alone.
const frostCv = $('#frost');
let frostTemp = null;
function frostDraw(temp, animate) {
  const ctx = frostCv.getContext('2d'), r = Math.min(devicePixelRatio || 1, 1.5);
  const W = frostCv.clientWidth, H = frostCv.clientHeight;
  frostCv.width = Math.round(W * r); frostCv.height = Math.round(H * r); ctx.setTransform(r, 0, 0, r, 0, 0);
  const reach = Math.min(1, Math.max(0.45, (-temp - 2) / 10)) * Math.min(W, H) * (innerWidth < 760 ? 0.5 : 0.36);
  const segs = []; // [x0, y0, x1, y1, when, width]
  const branch = (x, y, ang, len, depth, t0) => {
    let t = t0, travelled = 0;
    while (travelled < len) {
      const step = 3 + Math.random() * 2;
      ang += (Math.random() - 0.5) * 0.12;
      const nx = x + Math.cos(ang) * step, ny = y + Math.sin(ang) * step;
      segs.push([x, y, nx, ny, t, Math.max(0.6, 1.8 - depth * 0.4)]);
      x = nx; y = ny; travelled += step; t += step;
      if (depth < 4 && Math.random() < (depth ? 0.3 : 0.45) && travelled > 5) { // side needles at 60°, often in pairs, like a fern
        const rest = (len - travelled) * (0.3 + Math.random() * 0.25);
        branch(x, y, ang + Math.PI / 3, rest, depth + 1, t);
        if (Math.random() < 0.7) branch(x, y, ang - Math.PI / 3, rest * (0.7 + Math.random() * 0.3), depth + 1, t);
      }
    }
  };
  // seeds: fans of needles from each corner, a few from the side edges
  [[0, 0, 0], [W, 0, Math.PI / 2], [0, H, -Math.PI / 2], [W, H, Math.PI]].forEach(([x, y, a0]) => {
    for (let i = 0; i < 11; i++) branch(x, y, a0 + (i + 0.5) * (Math.PI / 2) / 11, reach * (0.5 + Math.random() * 0.55), 0, Math.random() * 20);
  });
  for (let i = 0; i < 6; i++) {
    const left = i % 2 === 0, y = H * (0.15 + Math.random() * 0.7);
    branch(left ? 0 : W, y, (left ? 0 : Math.PI) + (Math.random() - 0.5) * 0.9, reach * (0.25 + Math.random() * 0.3), 1, Math.random() * 30);
  }
  segs.sort((a, b) => a[4] - b[4]);
  // frosted glass: a soft white haze in the corners
  const haze = (x, y) => { const g = ctx.createRadialGradient(x, y, 0, x, y, reach * 1.1); g.addColorStop(0, 'rgba(255,255,255,.4)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };
  [[0, 0], [W, 0], [0, H], [W, H]].forEach(([x, y]) => haze(x, y));
  ctx.strokeStyle = 'rgba(255, 255, 255, .75)'; ctx.lineCap = 'round';
  let drawn = 0;
  const drawUpTo = (t) => {
    ctx.beginPath();
    let w = -1;
    for (; drawn < segs.length && segs[drawn][4] <= t; drawn++) {
      const [x0, y0, x1, y1, , sw] = segs[drawn];
      if (sw !== w) { ctx.stroke(); ctx.beginPath(); ctx.lineWidth = w = sw; }
      ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
    }
    ctx.stroke();
  };
  if (!animate || reduceMotion) { drawUpTo(Infinity); return; }
  const end = segs.length ? segs[segs.length - 1][4] : 0, t0 = performance.now(), speed = end / 7000; // grows for about 7 seconds
  const frame = (now) => { drawUpTo((now - t0) * speed); if (drawn < segs.length && frostTemp !== null) requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
}
const frostState = () => {
  const temp = (simulated || weatherNow)?.temp;
  const on = typeof temp === 'number' && temp <= -3;
  if (on && frostTemp === null) { frostTemp = temp; frostDraw(temp, true); frostCv.classList.add('on'); }
  else if (!on && frostTemp !== null) { frostTemp = null; frostCv.classList.remove('on'); }
};
skyHooks.push(frostState);
frostState();
addEventListener('resize', () => { if (frostTemp !== null) frostDraw(frostTemp, false); });

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

/* ---------------- the beaver ---------------- */
// A lodge of sticks and mud on the far shore. It grows through the autumn (beavers build and
// plaster it before the winter), with a raft of branches beside it from October to March (the
// winter food, stuck in the mud under the ice), snow on top in winter, and on very cold days a thin
// wisp of warm air from the vent at the top. Around sunset and sunrise the beaver swims out. The
// wake behind it opens at 19.5° on each side: Kelvin's angle, the same for a duck, a beaver or a
// ship, at any speed. At the end it slaps its tail on the water and dives.
const lodge = $('#beaverLodge'), lodgeGrow = lodge.querySelector('.bl-grow');
const beaver = $('#beaver'), bvWake = beaver.querySelector('.bv-wake-g'), bvBody = beaver.querySelector('.bv-body');
function lodgeState() {
  const [, m, d] = shownDate(12).toLocaleDateString('en-CA', { timeZone: TZ }).split('-').map(Number);
  const season = currentSeason();
  let size = forcedSeason ? { winter: 1, spring: 1, summer: 0.72, autumn: 0.88 }[season]
    : m === 7 || m === 8 ? 0.72 : m >= 9 && m <= 11 ? 0.72 + 0.28 * Math.min(1, ((m - 9) * 30.5 + d) / 91) : 1;
  setAttr(lodgeGrow, 'transform', `scale(${size.toFixed(3)})`);
  const cacheTime = forcedSeason ? season === 'winter' || season === 'autumn' : m >= 10 || m <= 3;
  lodge.classList.toggle('cache', cacheTime && !live.frozen);
  setData('lodgesteam', season === 'winter' && ((simulated || weatherNow)?.temp ?? 0) <= -8 ? 'yes' : 'no');
}
skyHooks.push(lodgeState); lodgeState();
let beaverOut = false;
const beaverHour = () => { const { h, sunT } = lastSky; return !!sunT && (Math.abs(h - sunT.set - 0.5) < 1 || Math.abs(h - sunT.rise + 0.3) < 0.7); };
function beaverSwim(force = false) {
  if (beaverOut || reduceMotion || live.ice > 0) return;
  if (!force && (!beaverHour() || !heroVisible())) return;
  beaverOut = true;
  beaver.classList.toggle('branch', currentSeason() === 'autumn');
  // from the lodge out into the bay and along, on a gentle curve (clear of the rowing boat)
  const p0 = [1082, 452.8], p1 = [1030 + Math.random() * 40, 463 + Math.random() * 5], p2 = [1055 + Math.random() * 35, 468 + Math.random() * 3];
  const at = (t) => [0, 1].map((i) => (1 - t) ** 2 * p0[i] + 2 * (1 - t) * t * p1[i] + t * t * p2[i]);
  const T = 16000, t0 = performance.now();
  let drawn = 0;
  ripples.add(p0[0], p0[1], 0.3, 0.6);
  beaver.classList.add('out');
  const frame = (now) => {
    if (now - drawn < 33) { requestAnimationFrame(frame); return; } // 30 frames a second
    drawn = now;
    const t = Math.min(1, (now - t0) / T), [x, y] = at(t), [x2, y2] = at(Math.min(1, t + 0.01));
    const ground = Math.atan2((y2 - y) / 0.45, x2 - x) * 180 / Math.PI; // direction on the water (the lake is seen flattened)
    beaver.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    bvWake.setAttribute('transform', `scale(1 .45) rotate(${ground.toFixed(1)})`);
    bvBody.setAttribute('transform', x2 < x ? 'scale(-1 1)' : '');
    if (t < 1) { requestAnimationFrame(frame); return; }
    ripples.add(x, y, 0.8, 1.2); // the tail slap
    beaver.classList.remove('out');
    beaverOut = false;
  };
  requestAnimationFrame(frame);
}
every(40, 110, () => beaverSwim());
if (params.has('beaver')) setTimeout(() => beaverSwim(true), 1200);

/* ---------------- equation of the day ---------------- */
// Terminal "equation of the day": one equation a day, as LaTeX, taking turns between famous ones,
// physics, machine learning and biology. Everyone sees the same one on the same day (my date).
// Add or change rows as [name, LaTeX, one-sentence explanation].
const L = String.raw;
const EQUATIONS = {
  famous: [
    ["Euler's identity", L`e^{i\pi} + 1 = 0`, 'Five fundamental numbers (e, i, π, 1 and 0) in one short line.'],
    ['Pythagoras', L`a^2 + b^2 = c^2`, 'In a right triangle, the squares on the two short sides add up to the square on the long side.'],
    ["Bayes' theorem", L`P(A \mid B) = \frac{P(B \mid A)\, P(A)}{P(B)}`, 'How to update a belief when new evidence comes in.'],
    ['Fourier transform', L`\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x)\, e^{-2\pi i \xi x}\, dx`, 'Any signal is a sum of waves; this finds how much of each frequency it contains.'],
    ['Gaussian integral', L`\int_{-\infty}^{\infty} e^{-x^2}\, dx = \sqrt{\pi}`, 'The reason π appears in the normal distribution.'],
    ["Euler's polyhedron formula", L`V - E + F = 2`, 'Vertices minus edges plus faces is 2 for every convex polyhedron: a cube has 8 − 12 + 6.'],
    ['Golden ratio', L`\varphi = \frac{1 + \sqrt{5}}{2}`, 'The ratio a/b that equals (a + b)/a, about 1.618.'],
    ['Central limit theorem', L`\sqrt{n}\,\left(\bar{X}_n - \mu\right) \xrightarrow{d} \mathcal{N}(0, \sigma^2)`, 'Averages of many independent samples become Gaussian, whatever the original distribution.'],
  ],
  physics: [
    ['Mass–energy equivalence', L`E = mc^2`, 'A little mass is a lot of energy: one gram equals about 25 GWh.'],
    ["Newton's second law", L`\mathbf{F} = m\mathbf{a}`, 'Force is mass times acceleration.'],
    ['Schrödinger equation', L`i\hbar \frac{\partial \psi}{\partial t} = \hat{H} \psi`, 'How a quantum state changes in time.'],
    ['Heisenberg uncertainty', L`\Delta x \, \Delta p \geq \frac{\hbar}{2}`, 'Position and momentum can never both be known exactly.'],
    ['Planck–Einstein relation', L`E = h\nu`, 'The energy of one photon is set by its frequency: a 640 nm photon carries about 1.9 eV.'],
    ["Boltzmann's entropy", L`S = k_B \ln W`, 'Entropy counts the microscopic arrangements W that look the same from outside. It is carved on his gravestone.'],
    ['Maxwell–Faraday law', L`\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}`, 'A changing magnetic field creates an electric field: the principle behind every generator.'],
    ["Snell's law", L`n_1 \sin\theta_1 = n_2 \sin\theta_2`, 'Light bends when it enters another medium. Immersion oil matches the glass, so steep rays still reach the objective.'],
    ['Abbe diffraction limit', L`d = \frac{\lambda}{2\,\mathrm{NA}}`, 'The smallest distance a conventional light microscope can resolve: about 200 nm for visible light. Try psf.'],
    ['Localisation precision', L`\sigma_{\mathrm{loc}} \approx \frac{\sigma_{\mathrm{PSF}}}{\sqrt{N}}`, 'Collect N photons from one molecule and you can find its centre √N times more precisely than the blur is wide.'],
    ['Wave equation', L`\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u`, 'Sound, light and ripples on the lake all follow it.'],
    ['Ideal gas law', L`pV = nRT`, 'Pressure, volume and temperature of a gas, tied together.'],
    ['Stokes–Einstein relation', L`D = \frac{k_B T}{6 \pi \eta r}`, 'How fast a particle diffuses: small and warm is fast, big and in a viscous liquid is slow.'],
    ['Beer–Lambert law', L`A = \varepsilon\, c\, l`, 'Absorbance grows with concentration and path length: the basis of every photometer.'],
  ],
  'machine learning': [
    ['Gradient descent', L`\theta \leftarrow \theta - \eta\, \nabla_\theta \mathcal{L}(\theta)`, 'Take small steps downhill on the loss. The hiker tries it with the command descend.'],
    ['Softmax', L`\sigma(\mathbf{z})_i = \frac{e^{z_i}}{\sum_j e^{z_j}}`, 'Turns any list of scores into probabilities that add up to one.'],
    ['Cross-entropy', L`H(p, q) = -\sum_x p(x) \log q(x)`, 'The loss behind almost every classifier.'],
    ['Attention', L`\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V`, 'The heart of the transformer, from "Attention is all you need" (2017).'],
    ['Backpropagation', L`\frac{\partial \mathcal{L}}{\partial x} = \frac{\partial \mathcal{L}}{\partial y} \, \frac{\partial y}{\partial x}`, 'Training a network is the chain rule, applied layer by layer from the output back.'],
    ['Evidence lower bound', L`\log p(x) \geq \mathbb{E}_{q(z \mid x)}\big[\log p(x \mid z)\big] - D_{\mathrm{KL}}\big(q(z \mid x) \,\|\, p(z)\big)`, 'What a variational autoencoder maximises.'],
    ['Kullback–Leibler divergence', L`D_{\mathrm{KL}}(P \,\|\, Q) = \sum_x P(x) \log \frac{P(x)}{Q(x)}`, 'How much information is lost when Q is used to approximate P.'],
    ['ReLU', L`\mathrm{ReLU}(x) = \max(0, x)`, 'The simplest nonlinearity, and still one of the most used.'],
    ['Optimal transport', L`W_2^2(\mu, \nu) = \min_{T_\# \mu = \nu} \int \lVert x - T(x) \rVert^2 \, d\mu(x)`, 'The cheapest way to move one distribution onto another. See it with the command flow.'],
    ['Diffusion models', L`x_t = \sqrt{\bar{\alpha}_t}\, x_0 + \sqrt{1 - \bar{\alpha}_t}\, \varepsilon, \quad \varepsilon \sim \mathcal{N}(0, I)`, 'Noise is added step by step; the model learns to take it away again.'],
    ['Message passing', L`h_v' = \phi\Big(h_v, \sum_{u \in \mathcal{N}(v)} \psi(h_u)\Big)`, 'Each node updates itself from its neighbours: the idea behind graph neural networks.'],
    ['Least squares', L`\hat{\beta} = (X^\top X)^{-1} X^\top y`, 'The best straight line through the data, in one line.'],
  ],
  biology: [
    ['Michaelis–Menten', L`v = \frac{V_{\max} [S]}{K_m + [S]}`, 'How fast an enzyme works: it speeds up with more substrate, until it is saturated.'],
    ['Hardy–Weinberg', L`p^2 + 2pq + q^2 = 1`, 'Allele frequencies stay the same from generation to generation, unless something changes them.'],
    ['Logistic growth', L`\frac{dN}{dt} = rN\left(1 - \frac{N}{K}\right)`, 'A population grows fast at first, then levels off at the carrying capacity K.'],
    ['Lotka–Volterra', L`\frac{dx}{dt} = \alpha x - \beta x y, \quad \frac{dy}{dt} = \delta x y - \gamma y`, 'Prey grow and predators eat them, so both populations go up and down in cycles.'],
    ['Hill equation', L`\theta = \frac{[L]^n}{K_d^n + [L]^n}`, 'Cooperative binding: haemoglobin picks up oxygen with n ≈ 2.8.'],
    ['Nernst equation', L`E = \frac{RT}{zF} \ln \frac{[X]_{\mathrm{out}}}{[X]_{\mathrm{in}}}`, 'The voltage an ion gradient makes across a membrane: about −90 mV for potassium in muscle.'],
    ['Henderson–Hasselbalch', L`\mathrm{pH} = \mathrm{p}K_a + \log_{10} \frac{[\mathrm{A}^-]}{[\mathrm{HA}]}`, 'How buffers hold the pH steady.'],
    ["Fick's law", L`J = -D \frac{\partial c}{\partial x}`, 'Molecules flow from high to low concentration.'],
    ['Gibbs free energy', L`\Delta G = \Delta H - T \Delta S`, 'A reaction runs by itself when ΔG is negative; the same balance decides how a protein folds.'],
    ['FRET efficiency', L`E = \frac{1}{1 + (r / R_0)^6}`, 'A molecular ruler: energy transfer between two dyes drops steeply over a few nanometres.'],
    ['Fluorescence decay', L`I(t) = I_0\, e^{-t/\tau}`, 'Fluorophores glow for a few nanoseconds; the lifetime τ tells them apart.'],
    ['SIR model', L`\frac{dI}{dt} = \beta S I - \gamma I`, 'An epidemic grows while each case infects more than one other person.'],
  ],
};
const EQ_TOPICS = Object.keys(EQUATIONS);
// the day number where I am, so the whole world sees the same equation on the same day
const eqDay = () => { const [y, m, d] = new Date().toLocaleDateString('en-CA', { timeZone: TZ }).split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); };
function equationOfDay(day = eqDay()) {
  const topic = EQ_TOPICS[day % EQ_TOPICS.length], list = EQUATIONS[topic];
  const [name, tex, note] = list[Math.floor(day / EQ_TOPICS.length) % list.length];
  return { topic, name, tex, note };
}
COMMANDS['equation of the day'] = (arg) => {
  const random = arg === 'random', eq = equationOfDay(random ? Math.floor(Math.random() * 1e4) : eqDay());
  earnBadge('equation');
  const when = new Date().toLocaleDateString('en-GB', { timeZone: TZ, day: 'numeric', month: 'long' });
  return `${random ? 'A random equation' : `Equation of the day, ${when}`} <span class="cmd">(${esc(eq.topic)})</span>
${esc(eq.name)}

<span class="warn">\\[ ${esc(eq.tex)} \\]</span>

${esc(eq.note)}`;
};
COMMANDS.equation = (arg) => COMMANDS['equation of the day'](arg === 'random' ? 'random' : '');
COMMANDS['equation random'] = () => COMMANDS['equation of the day']('random');
HIDDEN.push('equation random');

/* ---------------- psf: the point spread function of a microscope ---------------- */
// "psf 640 1.4" draws the Airy pattern of a point of light at that wavelength (nm) and numerical
// aperture, to scale (the picture is always 2 µm wide), in the colour of the light, with the limits.
const besselJ1 = (x) => { let s = 0; const n = 64; for (let k = 0; k < n; k++) { const t = (k + 0.5) * Math.PI / n; s += Math.cos(t - x * Math.sin(t)); } return s / n; };
const airy = (v) => (v < 1e-6 ? 1 : (2 * besselJ1(v) / v) ** 2);
// wavelength to an approximate RGB colour (after Dan Bruton), kept bright enough for the dark terminal
function waveColour(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else if (nm <= 750) r = 1;
  if (nm < 380 || nm > 750) return '#BDBDB8';
  const lift = (c) => Math.round(255 * (0.25 + 0.75 * c)); // no pure black channels: readable on #0E0E0E
  return `rgb(${lift(r)}, ${lift(g)}, ${lift(b)})`;
}
const colourName = (nm) => (nm < 380 ? 'ultraviolet' : nm < 450 ? 'violet' : nm < 495 ? 'blue' : nm < 570 ? 'green' : nm < 590 ? 'yellow' : nm < 620 ? 'orange' : nm <= 750 ? 'red' : 'infrared');
COMMANDS.psf = (arg) => {
  const [lam = 640, na = 1.4] = (arg || '').split(/[\s,]+/).filter(Boolean).map((x) => parseFloat(x.replace(/[^\d.]/g, '')));
  if (!(lam >= 200 && lam <= 1500)) return 'Usage: psf &lt;wavelength in nm&gt; &lt;NA&gt;, for example <b class="warn">psf 640 1.4</b> (wavelength 200 to 1500 nm).';
  if (!(na > 0 && na <= 1.7)) return 'The numerical aperture is NA = n · sin θ, so it can’t be larger than the refractive index of the immersion medium. The best objectives reach about 1.7.';
  const [medium, n] = na <= 0.95 ? ['air', 1] : na <= 1.33 ? ['water', 1.33] : na <= 1.52 ? ['oil', 1.518] : ['high-index oil', 1.78];
  const COLS = 33, ROWS = 17, cx = 2000 / COLS, cy = cx * 2, // a character is about half as wide as a line of the picture is high
    ramp = ' .:-=+*#%@', rows = [];
  for (let j = 0; j < ROWS; j++) {
    let line = '';
    for (let i = 0; i < COLS; i++) {
      let I = 0;
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
        const x = (i - (COLS - 1) / 2 + (a - 1) / 3) * cx, y = (j - (ROWS - 1) / 2 + (b - 1) / 3) * cy;
        I += airy(2 * Math.PI * na * Math.hypot(x, y) / lam) / 9;
      }
      const k = Math.max(0, Math.min(1, 1 + Math.log10(Math.max(I, 1e-9)) / 3)); // log scale, so the faint rings show
      line += ramp[Math.round(k * (ramp.length - 1))];
    }
    rows.push(line);
  }
  while (rows.length > 1 && !rows[0].trim() && !rows.at(-1).trim()) { rows.shift(); rows.pop(); } // drop empty rows (the scale bar is horizontal)
  earnBadge('psf');
  const nmr = (v) => `${Math.round(v)} nm`.padStart(8);
  const label = '2 µm', pad = (COLS - 2 - label.length) / 2;
  return `Point spread function
λ = ${lam} nm (${colourName(lam)}) · NA ${na} · ${medium}, n = ${n}
<span class="psf" style="color:${waveColour(lam)}">${rows.join('\n')}</span>├${'─'.repeat(Math.floor(pad))}${label}${'─'.repeat(Math.ceil(pad))}┤

  Abbe limit     λ / 2NA    ${nmr(lam / (2 * na))}
  Rayleigh       0.61 λ/NA  ${nmr(0.61 * lam / na)}  <span class="cmd">first dark ring</span>
  FWHM           0.51 λ/NA  ${nmr(0.51 * lam / na)}  <span class="cmd">width of the spot</span>
  Gaussian σ     0.21 λ/NA  ${nmr(0.21 * lam / na)}
  Axial (Abbe)   2λn / NA²  ${nmr(2 * lam * n / na ** 2)}  <span class="cmd">depth of the spot</span>
${arg ? '' : '\n<span class="cmd">Try your own: psf &lt;wavelength in nm&gt; &lt;NA&gt;, e.g.</span> <b class="warn">psf 488 0.5</b>'}`;
};

/* ---------------- backstage: every animation on demand (password protected) ---------------- */
// Type "backstage" in the terminal, then the password. A panel lists every animation and scene;
// tap one to see it right away (the sky, season or weather it needs is set first).
// Note: this is a static website, so the gate keeps visitors out of the panel, but it isn't a
// real secret: anyone reading the code can still call the functions.
const setScene = ({ sky, season, weather } = {}) => {
  if (season) COMMANDS.season(season);
  if (weather) COMMANDS.weather(weather);
  if (sky) COMMANDS.sky(sky);
};
const show = (sceneOpts, fn, delay = 900) => () => {
  setScene(sceneOpts);
  closeGps();
  scrollTo({ top: 0, behavior: 'smooth' });
  if (fn) setTimeout(fn, delay);
};
// Road scenes only start on a free road. From backstage, wait until it is (a cow standing on the road
// only leaves when a cyclist rings the bell, so send one), for up to 45 seconds.
const roadTaken = () => roadBusy || riding || tri || mooseOut || cowOnTheRoad() || !heroVisible();
const whenRoadFree = (fn, tries = 45, alsoWait = () => false) => {
  if (!roadTaken() && !alsoWait()) return fn();
  if (tries === 45 && heroVisible()) toast('Someone is on the way. Waiting until it’s clear…');
  if (cowOnTheRoad() && !riding && !roadBusy) ride({ force: true });
  if (tries > 0) setTimeout(() => whenRoadFree(fn, tries - 1, alsoWait), 1000);
};
const twoRipples = () => { ripples.add(1060, 468); setTimeout(() => ripples.add(1170, 472), 700); };
const BACKSTAGE = [
  ['Sky and weather', [
    ['dawn', show({ sky: 'dawn' })], ['day', show({ sky: 'day' })], ['dusk', show({ sky: 'dusk' })], ['night', show({ sky: 'night' })],
    ['clear', show({ weather: 'clear' })], ['rain', show({ weather: 'rain' })], ['snow', show({ weather: 'snow' })], ['storm', show({ weather: 'storm' })],
    ['fog', show({ weather: 'fog' })], ['frost', show({ weather: 'frost' })], ['rainbow', () => { const t = sunTimes(base()); show({ weather: 'rainbow' }, () => { forcedHour = t.set - 2; paintSky(); }, 0)(); }], // late afternoon: the sun has to be lower than 42°
    ['northern lights', show({ weather: 'clear' }, () => { originalNorthernLights(); setTimeout(() => selfieOuting(true), 2500); })],
    ['light summer night', () => { // Stockholm at midsummer: the sun only dips to -7°, so it never gets fully dark
      skyPlace = SITE.places.se; skyDate = new Date(new Date().getFullYear(), 5, 21, 12);
      show({ season: 'summer', weather: 'clear' }, () => { forcedHour = skyPreset('night'); paintSky(); }, 0)();
    }],
    ['Big Dipper and Pole Star', show({ sky: 'night', weather: 'clear' })],
    ['smoke in the wind', show({ sky: 'dusk', season: 'winter', weather: 'windy' })],
    ['ice from the shore', show({ sky: 'day', season: 'winter', weather: 'icing' })],
    ['long shadows', () => { const t = sunTimes(base()); show({ weather: 'clear', season: 'summer' }, () => { forcedHour = t.rise + 1.5; paintSky(); }, 0)(); }],
    ['day moon', () => { // find the next time the moon is well up in daylight, and show that moment
      const place = base();
      for (let k = 1; k < 24 * 30; k++) {
        const when = new Date(Date.now() + k * 3600e3), t = sunTimes(place, when);
        const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', hourCycle: 'h23' }).formatToParts(when);
        const h = +parts.find((x) => x.type === 'hour').value; // that hour, where I am
        if (t.alt(h) > 15 && moonAlt(when, place) > 15 && moonPhase(when).illum > 0.3) {
          skyDate = when; show({ weather: 'clear' }, () => { forcedHour = h; paintSky(); }, 0)();
          return;
        }
      }
    }],
    ['shooting star', show({ sky: 'night', weather: 'clear' }, shootingStar, 1500)],
    ['ISS pass', show({ sky: 'night', weather: 'clear' }, issDemo)],
    ['timelapse', show({}, () => timelapse(''))], ['timelapse year', show({}, () => timelapse('year'))],
  ]],
  ['Seasons and holidays', [
    ['winter', show({ season: 'winter' })], ['spring', show({ season: 'spring' })], ['summer', show({ season: 'summer' })], ['autumn', show({ season: 'autumn' })],
    ['christmas', show({}, () => COMMANDS.holiday('christmas'), 0)], ['easter', show({}, () => COMMANDS.holiday('easter'), 0)], ['midsommar', show({}, () => COMMANDS.holiday('midsommar'), 0)],
  ]],
  ['On the road', [
    ['cyclist', show({ sky: 'day' }, () => ride({ force: true }))],
    ['triathlon', show({ sky: 'day', season: 'summer', weather: 'clear' }, () => whenRoadFree(() => triathlon(true), 45, () => penguinOut))], // the penguin may be on the jetty
    ['roller skier', show({ sky: 'day', season: 'summer' }, () => whenRoadFree(() => xcSki(true)))],
    ['cross-country skier', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => whenRoadFree(() => xcSki(true)))],
    ['moose', show({ sky: 'day' }, () => whenRoadFree(() => mooseCrossing(true)))],
    ['cow on the road', show({ sky: 'day', weather: 'clear' }, () => whenRoadFree(() => cowOnRoad(true)))],
  ]],
  ['In the sky', [
    ['plane', show({ sky: 'day' }, () => flyPlane(true))],
    ['geese', show({ sky: 'day', season: 'autumn' }, () => birds(true))],
    ['cranes', show({ sky: 'day', season: 'spring' }, () => birds(true))],
    ['hot-air balloon', show({ sky: 'dawn', season: 'summer', weather: 'clear' }, () => flyBalloon(true))],
    ['songbird flock', show({ sky: 'day', weather: 'clear' }, () => flock(true))],
    ['UFO', show({ sky: 'night', weather: 'clear' }, () => ufoVisit(true), 1500)],
    ['chairlift and skier', show({ sky: 'day', season: 'winter', weather: 'frost' }, ski)],
  ]],
  ['On the lake', [
    ['ripples', show({ sky: 'day', season: 'summer', weather: 'clear' }, twoRipples)],
    ['glowing plankton', show({ sky: 'night', season: 'summer', weather: 'clear' }, twoRipples)],
    ['jumping fish', show({ sky: 'dusk', season: 'summer', weather: 'clear' }, () => fishJump(true))],
    ['ducks', show({ sky: 'day', season: 'summer', weather: 'clear' })],
    ['night fishing', show({ sky: 'night', season: 'summer', weather: 'clear' })],
    ['ice skater', show({ sky: 'day', season: 'winter', weather: 'frost' })],
    ['ice hockey', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => iceHockey(true))],
  ]],
  ['The penguin', [
    ['walk', show({}, () => penguinSolo(penguinWalk, true))],
    ['swim', show({ sky: 'day', season: 'summer', weather: 'clear' }, () => penguinSolo(penguinSwim, true))],
    ['barbecue', show({ sky: 'day' }, () => penguinSolo(penguinGrill, true))],
    ['belly slide', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => penguinSolo(penguinSlide, true))],
    ['ice fishing', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => penguinSolo(penguinFish, true))],
    ['snow angel', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => penguinSolo(penguinAngel, true))],
    ['sauna', show({ sky: 'dusk', season: 'winter', weather: 'frost' }, () => penguinSolo(penguinSauna, true))],
    ['aurora selfie', show({ sky: 'night', weather: 'clear' }, () => selfieOuting(true))],
    ['stargazing', show({ sky: 'night', weather: 'clear' }, () => penguinSolo(penguinStargaze, true))],
    ['kayak', show({ sky: 'day', season: 'summer', weather: 'clear' }, () => penguinSolo(penguinKayak, true))],
    ['blueberries', show({ sky: 'day', season: 'summer', weather: 'clear' }, () => { berryPreview = true; paintSky(); penguinSolo(penguinBlueberries, true); })],
    ['footprints in the snow', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => penguinSolo(penguinStroll, true))],
    ['hare or fox tracks', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => { trackPreview = true; drawTracks(); }, 300)],
    ['beaver', show({ sky: 'dusk', season: 'autumn', weather: 'clear' }, () => beaverSwim(true), 1200)],
    ['World Penguin Day (25 April)', show({ sky: 'day', season: 'spring', weather: 'clear' }, () => { penguinDayPreview = true; paintSky(); tickClock(); penguinSolo(penguinGreet, true); }, 600)],
    ['sunglasses (high UV)', show({ sky: 'day', season: 'summer', weather: 'sunny' }, () => penguinSolo(penguinStroll, true))],
    ['blueberry pie', show({ sky: 'day', season: 'summer' }, () => bakePie(0), 900)],
    ['chopping wood', show({ sky: 'day', season: 'autumn', weather: 'clear' }, () => { choppedLogs = 0; woodPreview = 0.5; updateWoodpile(); penguinSolo(penguinChop, true); })],
    ['woodpile through the winter', () => { const levels = [1, 0.8, 0.6, 0.4, 0.2]; let i = 0; show({ sky: 'day', season: 'winter' }, () => { const tick = () => { woodPreview = levels[i++]; choppedLogs = 0; updateWoodpile(); if (i < levels.length) setTimeout(tick, 1500); }; tick(); }, 600)(); }],
    ['chanterelles', show({ sky: 'day', season: 'autumn', weather: 'clear' }, () => penguinSolo(penguinChanterelles, true))],
    ['shovelling snow', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => { pathSnowPreview = true; setData('pathsnow', 'yes'); penguinSolo(penguinShovel, true); })],
    ['raking leaves', show({ sky: 'day', season: 'autumn', weather: 'clear' }, () => penguinSolo(penguinRake, true))],
    ['watering flowers', show({ sky: 'day', season: 'summer', weather: 'clear' }, () => { thirstyPreview = true; boxFlowers.forEach((g) => g.classList.add('thirsty')); setTimeout(() => penguinSolo(penguinWater, true), 2500); }, 0)],
    ['reading on the veranda', show({ sky: 'dusk', season: 'summer', weather: 'clear' }, () => penguinSolo(penguinRead, true))],
    ['birthday cake', show({ sky: 'day' }, () => { cake.classList.remove('show', 'out'); penguinSolo(penguinCake, true); })],
    ['rain dance', show({ sky: 'day', season: 'summer', weather: 'rain' }, () => penguinSolo(penguinRainDance, true))],
    ['under the footer', () => { // the page can still grow while scrolling (images load), so land exactly at the bottom, then pop up
      closeGps(); peekNext = performance.now() + 30000;
      scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      setTimeout(() => { scrollTo({ top: document.documentElement.scrollHeight }); setTimeout(peekOut, 400); }, 1600);
    }],
  ]],
  ['Animals', [
    ['moo', () => COMMANDS.moo()],
    ['deer', show({ sky: 'dusk' })],
    ['owl', show({ sky: 'night' })],
    ['fireflies', show({ sky: 'night', season: 'summer', weather: 'clear' })],
  ]],
  ['Around the cottage', [
    ['tent and campfire', show({ sky: 'dusk', season: 'summer', weather: 'clear' })],
    ['snowman', show({ sky: 'day', season: 'winter', weather: 'frost' }, () => snowmanDemo(false), 300)],
    ['melting snowman', show({ sky: 'day', season: 'winter' }, () => snowmanDemo(true), 300)],
    ['path lights', show({ sky: 'night' })],
    ['Swedish flag (6 June)', show({ sky: 'day', season: 'summer' }, () => { flagPreview = 'se'; paintSky(); }, 0)],
    ['Austrian flag (26 October)', show({ sky: 'day', season: 'autumn' }, () => { flagPreview = 'at'; paintSky(); }, 0)],
    ['stove and smoke', show({ sky: 'dusk', season: 'winter' }, () => { document.documentElement.dataset.cottage = 'on'; }, 0)],
  ]],
  ['The hiker', [
    ['walk the trail', () => { goTo('timeline'); setTimeout(() => selectEntry('job-0'), 900); setTimeout(() => selectEntry(`job-${SITE.cv.length - 1}`), 6000); }],
    ['rain coming', () => { setScene({ weather: 'forecast' }); goTo('timeline'); }],
    ['umbrella', () => { setScene({ weather: 'rain' }); goTo('timeline'); }],
    ['fika break', () => { fikaUntil = Date.now() + 90000; goTo('timeline'); const k = $('#cvList li.active')?.dataset.k === 'job-3' ? 'job-2' : 'job-3'; setTimeout(() => selectEntry(k), 900); }], // it sits down when it arrives
  ]],
  ['The page', [
    ['screensaver', () => { closeGps(); scrollTo({ top: 0 }); setTimeout(() => document.documentElement.classList.add('screensaver'), 1500); }],
  ]],
  ['Science', [
    ['microscope', show({ sky: 'night', weather: 'clear' }, () => { if (!smlmRunning && !lifeRunning) smlmShow(); })],
    ['game of life', show({ sky: 'night', weather: 'clear' }, () => { if (!smlmRunning && !lifeRunning) lifeShow(); })],
    ['gradient descent', () => COMMANDS.descend()],
    ['optimal transport flow', () => { if (!flowRunning && !lifeRunning && !smlmRunning) show({}, flowShow, 700)(); }],
    ['fractal forest', show({}, () => fractalForest(!fractalOn), 0)],
  ]],
  ['Back to normal', [
    ['live', () => COMMANDS.live()],
  ]],
];
const BACKSTAGE_ACTIONS = new Map(BACKSTAGE.flatMap(([, rows]) => rows.map(([name, fn]) => [name.toLowerCase(), fn])));
function backstagePanel() {
  return '<span class="ok">Backstage.</span> Tap anything to see it now.' + BACKSTAGE.map(([title, rows]) => `<div class="h-group"><div class="h-title">${esc(title)}</div><div class="h-opts">${
    rows.map(([name]) => `<button type="button" class="h-cmd" data-run="show ${esc(name)}">${esc(name)}</button>`).join('')}</div></div>`).join('')
    + '<div class="h-tip">Type <b class="warn">backstage</b> to open this again, <b class="warn">show live</b> to go back to the real sky.</div>';
}
COMMANDS.backstage = () => {
  if (backstageOpen()) return backstagePanel();
  askingPassword = true; input.type = 'password'; input.value = '';
  return 'Password:';
};
COMMANDS.show = (arg) => {
  if (!backstageOpen()) return `Command not found: show. Type <b class="warn">help</b>.`;
  const fn = BACKSTAGE_ACTIONS.get(arg);
  if (!fn) return `Nothing called "${esc(arg)}". Type <b class="warn">backstage</b> for the list.`;
  fn();
  return `▶ ${esc(arg)}`;
};
HIDDEN.push('backstage', 'show');

/* ---------------- live: back to the real sky ---------------- */
// "live" resets everything that can be simulated (time of day, season, weather, holiday, the
// fractal forest). While anything is simulated, a "live" button shows in the terminal's header.
const simulating = () => forcedHour !== null || !!skyPlace || !!flagPreview || forcedSeason !== null || !!simulated || !!forcedHoliday || fractalOn || !!snowPreview || berryPreview || woodPreview !== null || trackPreview || penguinDayPreview;
COMMANDS.live = () => {
  const was = simulating();
  COMMANDS.season('live'); COMMANDS.holiday('live'); COMMANDS.sky('live');
  fractalForest(false); snowPreview = null; berryPreview = false; woodPreview = null; trackPreview = false; penguinDayPreview = false; skyPlace = skyDate = null; flagPreview = null;
  COMMANDS.weather('live'); // fetches the real weather (async)
  paintSky(); updateLiveButton();
  return was ? `Back to live: the real time, season and weather in ${esc(base().city)}.` : `Already live: this is the real sky over ${esc(base().city)}.`;
};
const liveButton = $('#gpsLive');
const updateLiveButton = () => { liveButton.hidden = !simulating(); };
liveButton.addEventListener('click', () => run('live'));
skyHooks.push(updateLiveButton);
updateLiveButton();
