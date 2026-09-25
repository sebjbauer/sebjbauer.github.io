/* =====================================================================
   GADGETS: more life in the landscape and more to discover.
   Microscope stars, penguin, cyclist, skier, birds, ducks, ice skater,
   and trail badges. Builds on script.js and extras.js (loaded first).
   ===================================================================== */

const heroVisible = () => !$('.hero').classList.contains('off') && !document.hidden;
const every = (minS, maxS, fn) => { const tick = () => setTimeout(() => { fn(); tick(); }, (minS + Math.random() * (maxS - minS)) * 1000); tick(); };

/* ---------------- trail badges ---------------- */
const BADGES = [
  ['terminal', 'Explorer', 'opened the GPS terminal', 'there is more to this page than meets the eye'],
  ['star', 'Wish maker', 'caught a shooting star', 'look up on a clear night'],
  ['riddle', 'Norrsken', 'solved the riddle', 'type riddle'],
  ['smlm', 'Super-resolved', 'imaged the stars with a microscope', 'a command for clear nights'],
  ['cottage', 'Stoker', 'lit the stove in the cottage', 'the red cottage by the lake'],
  ['penguin', 'Penguin friend', 'met the penguin who lives in the cottage', 'knock on the cottage door, again and again'],
  ['deer', 'Quiet steps', 'startled the deer', 'dusk and dawn, at the forest edge'],
  ['cyclist', 'Aero tuck', 'made the cyclist tuck', 'someone rides through the valley'],
  ['skater', 'Thin ice', 'watched the skater spin', 'when the lake freezes'],
  ['iss', 'Space station', 'spotted the ISS over Vienna', 'a steady light that moves fast on clear nights'],
  ['plane', 'Wanderlust', 'caught the plane to a new country', 'something flies over now and then'],
  ['triathlon', 'Swim, bike, run', 'cheered on the triathlete', 'summer days by the lake'],
  ['xc', 'Diagonal stride', 'waved at the cross-country skier', 'long skis in winter, tiny wheels the rest of the year'],
  ['bbq', 'Grill master', 'caught the penguin at the barbecue', 'the penguin has a hobby too'],
  ['ripple', 'Interference', 'made two ripples meet on the lake', 'tap the water, then tap it again'],
  ['life', 'Conway', 'brought the stars to life', 'a game with no players, on a clear night'],
  ['descend', 'Momentum', 'helped the hiker find the lowest point', 'the hiker knows some optimisation'],
  ['fractal', 'Self-similar', 'saw the forest grow as fractals', 'trees made of smaller trees'],
  ['moose', 'Älgvarning', 'met the moose on the road', 'a rare visitor on the Swedish side'],
  ['snowman', 'Snow day', "knocked the snowman's hat off", 'cold winter days by the lake'],
  ['camp', 'Allemansrätten', 'poked the campfire', 'summer evenings in the Swedish forest'],
  ['ufo', 'Close encounter', 'clicked the UFO', 'keep an eye on the cows after dark'],
];
let earned = (() => { try { return JSON.parse(store.get('badges') || '[]'); } catch { return []; } })();
function earnBadge(id) {
  if (earned.includes(id)) return;
  earned.push(id);
  store.set('badges', JSON.stringify(earned));
}
COMMANDS.badges = () => `Trail badges: ${earned.length} of ${BADGES.length}\n` + BADGES.map(([id, name, done, hint]) =>
  earned.includes(id) ? `  <span class="ok">✓</span> ${name.padEnd(15)} ${done}` : `  ·  ${'???'.padEnd(15)} <span class="cmd">hint: ${hint}</span>`).join('\n');

// badges for things that live in the other scripts
new MutationObserver(() => { if (!gps.hidden) earnBadge('terminal'); }).observe(gps, { attributes: true, attributeFilter: ['hidden'] });
$('.hero').addEventListener('click', (e) => { if (e.target.closest('.shooting-star')) earnBadge('star'); });
$('#deer').addEventListener('click', () => earnBadge('deer'));
const originalNorthernLights = northernLights;
northernLights = function () { earnBadge('riddle'); return originalNorthernLights(); };

/* ---------------- the microscope sky (SMLM) ---------------- */
// In single-molecule localization microscopy, molecules blink one at a time; each blink is
// localized, and the image builds up dot by dot. Here the stars do the same, and form initials.
let smlmRunning = false;
function smlmShow() {
  smlmRunning = true;
  const hero = $('.hero'), cv = $('#smlm'), ctx = cv.getContext('2d');
  const r = Math.min(devicePixelRatio || 1, 1.5), W = cv.clientWidth, H = cv.clientHeight;
  cv.width = Math.round(W * r); cv.height = Math.round(H * r); ctx.setTransform(r, 0, 0, r, 0, 0);
  // open sky to the right of the text (desktop), or between the text and the mountains (phone)
  const narrow = innerWidth < 760, size = narrow ? 110 : Math.min(170, W * 0.14);
  const cx = narrow ? W * 0.5 : W * 0.78, cy = narrow ? H * 0.55 : H * 0.42;

  // sample the shape of the initials
  const off = document.createElement('canvas'); off.width = size * 2; off.height = size;
  const o = off.getContext('2d');
  o.font = `600 ${Math.round(size * 0.9)}px ${getComputedStyle(document.body).fontFamily}`;
  o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('SB', size, size * 0.55);
  const px = o.getImageData(0, 0, off.width, off.height).data;
  // the sample: molecules sit in small nanoclusters along the letters, as many membrane proteins do
  const k = size / 170, gap = 10 * k, mols = [];
  for (let y = gap / 2; y < off.height; y += gap) {
    for (let x = gap / 2; x < off.width; x += gap) {
      const jx = x + (Math.random() - 0.5) * 3 * k, jy = y + (Math.random() - 0.5) * 3 * k;
      if (px[(Math.round(jy) * off.width + Math.round(jx)) * 4 + 3] <= 128) continue;
      for (let m = 3 + Math.floor(Math.random() * 4); m > 0; m--) {
        const r = 1.8 * k * Math.sqrt(Math.random()), a = Math.random() * 6.283;
        mols.push([cx - size + jx + r * Math.cos(a), cy - size / 2 + jy + r * Math.sin(a)]);
      }
    }
  }
  const locs = []; // every localization, for the cluster analysis at the end
  const sigma = 0.75 * k;

  // localizations accumulate on a second canvas
  const acc = document.createElement('canvas'); acc.width = cv.width; acc.height = cv.height;
  const a = acc.getContext('2d'); a.setTransform(r, 0, 0, r, 0, 0); a.fillStyle = 'rgba(159, 242, 200, 0.5)';
  const gauss = () => Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(2 * Math.PI * Math.random());
  const ACQUIRE = 9000, HOLD = 5500, FADE = 2500, blinks = [];
  let t0 = 0, last = 0, clustered = null;
  hero.classList.add('smlm-on');

  function frame(t) {
    if (!t0) t0 = last = t;
    const el = t - t0, dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (el < ACQUIRE) for (let n = Math.round(dt * 380); n > 0; n--) blinks.push({ p: mols[Math.floor(Math.random() * mols.length)], life: 0.05 + Math.random() * 0.1 });
    // once the acquisition is done, a cluster analysis (DBSCAN) colours each nanocluster
    if (el >= ACQUIRE && !clustered) clustered = clusterImage(locs, 2.3 * k, 7, cv.width, cv.height, r);
    ctx.clearRect(0, 0, W, H);
    const fade = el > ACQUIRE + HOLD ? Math.max(0, 1 - (el - ACQUIRE - HOLD) / FADE) : 1;
    const mixIn = clustered ? Math.min(1, (el - ACQUIRE) / 900) : 0;
    ctx.globalAlpha = fade * (1 - mixIn);
    ctx.drawImage(acc, 0, 0, W, H);
    if (clustered) { ctx.globalAlpha = fade * mixIn; ctx.drawImage(clustered, 0, 0, W, H); }
    ctx.globalAlpha = 1;
    // blinking molecules: a soft glow and a bright core; every frame adds a localization
    const glow = new Path2D(), core = new Path2D();
    for (let i = blinks.length - 1; i >= 0; i--) {
      const b = blinks[i], [x, y] = b.p;
      glow.moveTo(x + 3.4, y); glow.arc(x, y, 3.4, 0, 6.29);
      core.moveTo(x + 1.2, y); core.arc(x, y, 1.2, 0, 6.29);
      if (el < ACQUIRE) {
        const lx = x + gauss() * sigma, ly = y + gauss() * sigma;
        a.fillRect(lx, ly, 1.1, 1.1); locs.push(lx, ly);
      }
      if ((b.life -= dt) <= 0) blinks.splice(i, 1);
    }
    ctx.fillStyle = 'rgba(200, 255, 225, 0.22)'; ctx.fill(glow);
    ctx.fillStyle = 'rgba(245, 255, 250, 0.95)'; ctx.fill(core);
    if (el < ACQUIRE + HOLD + FADE) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, W, H); hero.classList.remove('smlm-on'); smlmRunning = false; }
  }
  requestAnimationFrame(frame);
}

// DBSCAN (Ester et al. 1996), the standard cluster analysis for SMLM data: a point with at least
// minPts neighbours within eps starts a cluster, which grows through its neighbours' neighbours.
// Points that belong to no cluster are noise. xy = [x0, y0, x1, y1, …]. Returns a label per point (-1 = noise).
function dbscan(xy, eps, minPts) {
  const n = xy.length / 2, label = new Int32Array(n).fill(-2), grid = new Map(), e2 = eps * eps;
  const key = (gx, gy) => gx * 100003 + gy;
  for (let i = 0; i < n; i++) {
    const kk = key(Math.floor(xy[2 * i] / eps), Math.floor(xy[2 * i + 1] / eps));
    if (!grid.has(kk)) grid.set(kk, []);
    grid.get(kk).push(i);
  }
  const near = (i) => {
    const x = xy[2 * i], y = xy[2 * i + 1], gx = Math.floor(x / eps), gy = Math.floor(y / eps), out = [];
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      for (const j of grid.get(key(gx + dx, gy + dy)) || []) {
        const ddx = xy[2 * j] - x, ddy = xy[2 * j + 1] - y;
        if (ddx * ddx + ddy * ddy <= e2) out.push(j);
      }
    }
    return out;
  };
  let c = 0;
  for (let i = 0; i < n; i++) {
    if (label[i] !== -2) continue;
    const nb = near(i);
    if (nb.length < minPts) { label[i] = -1; continue; }
    label[i] = c;
    const queue = nb;
    for (let q = 0; q < queue.length; q++) {
      const j = queue[q];
      if (label[j] === -1) label[j] = c;   // noise at the edge of a cluster joins it
      if (label[j] !== -2) continue;
      label[j] = c;
      const nb2 = near(j);
      if (nb2.length >= minPts) for (const m of nb2) if (label[m] < 0) queue.push(m);
    }
    c++;
  }
  return label;
}

// the localizations again, each cluster in its own colour (hues spaced by the golden angle), noise in grey
function clusterImage(xy, eps, minPts, w, h, r) {
  const label = dbscan(xy, eps, minPts), img = document.createElement('canvas');
  img.width = w; img.height = h;
  const g = img.getContext('2d');
  g.setTransform(r, 0, 0, r, 0, 0);
  const byColour = new Map();
  for (let i = 0; i < label.length; i++) {
    const colour = label[i] < 0 ? 'rgba(150, 160, 170, .35)' : `hsla(${(label[i] * 137.5) % 360}, 85%, 68%, .85)`;
    if (!byColour.has(colour)) byColour.set(colour, new Path2D());
    byColour.get(colour).rect(xy[2 * i], xy[2 * i + 1], 1.2, 1.2);
  }
  for (const [colour, path] of byColour) { g.fillStyle = colour; g.fill(path); }
  return img;
}

COMMANDS.smlm = () => {
  if (smlmRunning) return 'The microscope is already running. Look up.';
  if (lastSky.d < 0.75) return 'The stars are only out at night. Come back after sunset.';
  if (live.overcast > 0.6) return 'Too cloudy tonight: no stars to image.';
  if (reduceMotion) return 'This one needs animations, which are turned off on your device.';
  closeGps();
  scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(smlmShow, 600);
  earnBadge('smlm');
  return 'Pointing the microscope at the sky…';
};

/* ---------------- moving figures ---------------- */
// Move an SVG group along a path in the fx layer. Returns a promise when it arrives.
function travel(el, path, ms, { from = 0, to = 1, onStep } = {}) {
  return new Promise((done) => {
    const len = path.getTotalLength();
    let t0 = 0;
    const step = (t) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / ms), at = len * (from + (to - from) * k);
      const p = path.getPointAtLength(at), q = path.getPointAtLength(Math.min(len, at + 1));
      onStep ? onStep(p, q, t) : el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      if (k < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
}

// the penguin: every 5th click on the cottage it walks out, does a loop and goes back in
let cottageClicks = 0, penguinOut = false;
const penguinLoop = document.createElementNS('http://www.w3.org/2000/svg', 'path');
penguinLoop.setAttribute('d', 'M1195 447 C1212 447 1236 448 1238 452 C1240 457 1218 461 1195 461 C1170 461 1150 457 1152 452 C1154 448 1178 447 1195 447');
penguinLoop.setAttribute('fill', 'none');
$('#landscapeFx').appendChild(penguinLoop); // paths must be in the page to be measured
$('#stugaHit').addEventListener('click', () => {
  if (document.documentElement.dataset.cottage === 'on') earnBadge('cottage');
  cottageClicks += 1;
  if (cottageClicks % 5 === 0 && !penguinOut && !reduceMotion) penguinOuting('walk');
});
// every third time the penguin comes out, it goes to the barbecue instead
let penguinTrips = 0;
async function penguinOuting(kind) {
  penguinOut = true;
  penguinTrips += 1;
  if (penguinTrips % 3 === 0) await penguinGrill();
  else await ({ slide: penguinSlide, fish: penguinFish, swim: penguinSwim }[kind] || penguinWalk)();
  penguinOut = false;
}
const hotDay = () => !live.frozen && !live.particle && lastSky.d < 0.4 && (weatherNow?.temp ?? 0) >= 25;

async function penguinGrill() {
  penguinOut = true;
  const root = document.documentElement, pg = $('#penguin'), flip = pg.querySelector('.pg-flip'), waddle = pg.querySelector('.pg-waddle');
  const spatula = pg.querySelector('.pg-spatula');
  waddle.removeAttribute('clip-path'); pg.querySelector('.pg-ripple').style.opacity = 0;
  pg.classList.add('out', 'grill');
  const walk = (from, to, ms) => new Promise((done) => {
    let t0 = 0;
    const step = (t) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / ms);
      pg.setAttribute('transform', `translate(${(from + (to - from) * k).toFixed(1)} 447)`);
      flip.setAttribute('transform', to < from ? 'scale(-1 1)' : '');
      waddle.setAttribute('transform', `rotate(${(Math.sin(t / 90) * 9).toFixed(1)})`);
      if (k < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  await walk(1195, 1222, 2600);
  // grilling: lid open, smoke, and the spatula flips something now and then
  root.classList.add('grilling');
  flip.setAttribute('transform', ''); waddle.setAttribute('transform', '');
  await new Promise((done) => {
    let t0 = 0;
    const step = (t) => {
      if (!t0) t0 = t;
      const e = t - t0, flipNow = (e % 1600) < 450;
      spatula.setAttribute('transform', flipNow ? 'rotate(-28 2.6 -6.6)' : '');
      if (e < 7000) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  spatula.setAttribute('transform', '');
  root.classList.remove('grilling');
  await walk(1222, 1195, 2600);
  pg.classList.remove('out', 'grill');
  earnBadge('penguin'); earnBadge('bbq');
  penguinOut = false;
}

async function penguinWalk() {
  penguinOut = true;
  const pg = $('#penguin'), flip = pg.querySelector('.pg-flip'), waddle = pg.querySelector('.pg-waddle'), ripple = pg.querySelector('.pg-ripple');
  const frozen = live.frozen;
  pg.classList.add('out');
  await travel(pg, penguinLoop, 11000, {
    onStep: (p, q, t) => {
      const onWater = p.y > 450.5 && !frozen, depth = 1 + (p.y - 447) * 0.014; // a little bigger when it comes towards you
      pg.setAttribute('transform', `translate(${p.x.toFixed(1)} ${(p.y + (onWater ? 2.5 : 0)).toFixed(1)}) scale(${depth.toFixed(3)})`);
      flip.setAttribute('transform', q.x < p.x ? 'scale(-1 1)' : '');
      waddle.setAttribute('transform', onWater ? '' : `rotate(${(Math.sin(t / 90) * 9).toFixed(1)})`);
      if (onWater) waddle.setAttribute('clip-path', 'url(#pgClip)'); else waddle.removeAttribute('clip-path');
      ripple.style.opacity = onWater ? 0.6 : 0;
    },
  });
  pg.classList.remove('out');
  earnBadge('penguin');
  penguinOut = false;
}

// The penguin follows a route of steps. Poses: walk (waddle), slide (belly), jump, swim, wait.
async function penguinRoute(steps) {
  const pg = $('#penguin'), flip = pg.querySelector('.pg-flip'), waddle = pg.querySelector('.pg-waddle'), ripple = pg.querySelector('.pg-ripple');
  waddle.removeAttribute('clip-path'); ripple.style.opacity = 0;
  pg.classList.add('out');
  let pos = [1195, 447], dir = 1;
  for (const s of steps) {
    const from = pos, to = s.to || pos;
    if (to[0] !== from[0]) dir = Math.sign(to[0] - from[0]);
    await new Promise((done) => {
      let t0 = 0;
      const step = (t) => {
        if (!t0) t0 = t;
        const k = Math.min(1, (t - t0) / s.ms);
        const e = s.pose === 'slide' ? 1 - (1 - k) ** 2 : k; // slides slow down
        let x = from[0] + (to[0] - from[0]) * e, y = from[1] + (to[1] - from[1]) * e, pose = '';
        if (s.pose === 'walk') pose = `rotate(${(Math.sin(t / (s.fast ? 55 : 90)) * 9).toFixed(1)})`;
        if (s.pose === 'slide') pose = 'translate(0 -1.5) rotate(78)';
        if (s.pose === 'jump') { y -= Math.sin(Math.PI * k) * 9; pose = `rotate(${(20 + 70 * k).toFixed(0)})`; }
        const swimming = s.pose === 'swim';
        pg.setAttribute('transform', `translate(${x.toFixed(1)} ${(y + (swimming ? 2.5 : 0)).toFixed(1)}) scale(${(1 + (y - 447) * 0.014).toFixed(3)})`);
        flip.setAttribute('transform', dir < 0 ? 'scale(-1 1)' : '');
        waddle.setAttribute('transform', pose);
        if (swimming) waddle.setAttribute('clip-path', 'url(#pgClip)'); else waddle.removeAttribute('clip-path');
        ripple.style.opacity = swimming ? 0.6 : 0;
        if (s.tick) s.tick(k, pg);
        if (k < 1) requestAnimationFrame(step); else done();
      };
      requestAnimationFrame(step);
    });
    pos = to;
  }
  pg.classList.remove('out', 'fishing', 'caught');
  earnBadge('penguin');
}

// frozen lake: a belly slide across the ice
const penguinSlide = () => penguinRoute([
  { to: [1203, 458], ms: 1400, pose: 'walk' },   // out of the door, onto the ice
  { to: [1335, 462], ms: 2400, pose: 'slide' },  // belly slide
  { to: [1203, 458], ms: 6500, pose: 'walk' },   // waddle back
  { to: [1195, 447], ms: 1200, pose: 'walk' },
]);

// frozen lake: ice fishing (pimpelfiske) at a hole in the ice, until a fish bites
const penguinFish = () => penguinRoute([
  { to: [1203, 458], ms: 1400, pose: 'walk' },
  { to: [1290, 461], ms: 5000, pose: 'walk' },
  { ms: 9000, pose: 'wait', tick: (k, pg) => { pg.classList.add('fishing'); pg.classList.toggle('caught', k > 0.72); } },
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.remove('fishing', 'caught') },
  { to: [1203, 458], ms: 5000, pose: 'walk' },
  { to: [1195, 447], ms: 1200, pose: 'walk' },
]);

// hot summer days: across the veranda, along the lit path, down the jetty, a jump into the lake,
// a swim to the rocky beach left of the cottage, and back in through the door
const penguinSwim = () => penguinRoute([
  { to: [1199, 449], ms: 700, pose: 'walk', fast: true },   // out onto the veranda
  { to: [1216, 449.3], ms: 1100, pose: 'walk', fast: true }, // across it
  { to: [1220, 450.2], ms: 350, pose: 'jump' },              // down the step
  { to: [1297, 449.6], ms: 3600, pose: 'walk', fast: true }, // along the path to the jetty
  { to: [1302, 471], ms: 1300, pose: 'walk', fast: true },   // down the jetty
  { to: [1307, 481], ms: 650, pose: 'jump' },                // and in!
  { to: [1190, 466], ms: 7500, pose: 'swim' },               // swim to the rocks
  { to: [1168, 455], ms: 2200, pose: 'swim' },
  { to: [1164, 450.5], ms: 700, pose: 'jump' },              // climb out onto the rocks
  { to: [1176, 449.4], ms: 900, pose: 'walk' },              // over to the veranda
  { to: [1195, 447], ms: 1100, pose: 'walk' },               // and inside
]);

// rain poncho, woolly hat and scarf, or sunglasses, from the real weather in Vienna
function cyclistGear() {
  const temp = weatherNow?.temp;
  if (live.particle === 'rain' || live.particle === 'drizzle') return 'rain';
  if (live.particle === 'snow' || (temp != null && temp < 5)) return 'cold';
  if (temp != null && temp >= 24 && live.overcast < 0.4 && lastSky.d < 0.5) return 'sun';
  return 'none';
}

// the cyclist rides through the valley now and then; click to make them tuck
const cyclist = $('#cyclist'), road = $('#road');
let riding = false;
let roadBusy = false;
// Move a figure along the valley road. The road ends at the lake, so by default a figure comes in
// from the left edge, turns around at the end of the road and leaves the way it came (out of the
// frame). reverse: start at the lake end and head left, without coming back.
function alongRoad(el, { reverse = false, back = !reverse, speed = 70, onStep } = {}) {
  const len = road.getTotalLength();
  let pos = 0, last = 0, leg = 0;
  return new Promise((done) => {
    const step = (t) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
      pos += dt * (typeof speed === 'function' ? speed() : speed);
      if (pos >= len && back && leg === 0) { leg = 1; pos -= len; } // turn around at the end of the road
      const towardsLake = reverse ? leg === 1 : leg === 0;
      const d = Math.min(len, pos), at = towardsLake ? d : len - d;
      const p = road.getPointAtLength(at), q = road.getPointAtLength(Math.min(len, at + 2));
      const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.toFixed(1)})${towardsLake ? '' : ' scale(-1 1)'}`);
      if (onStep) onStep(t);
      if (pos < len) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
}

async function ride({ reverse = false, force = false } = {}) {
  if (!force && (riding || roadBusy || !heroVisible() || reduceMotion)) return;
  riding = true;
  cyclist.dataset.gear = cyclistGear(); // dress for the real weather in Vienna
  cyclist.classList.remove('tuck');
  cyclist.classList.add('out');
  await alongRoad(cyclist, { reverse, speed: () => 70 * (cyclist.classList.contains('tuck') ? 1.5 : 1) });
  cyclist.classList.remove('out', 'tuck');
  riding = false;
}
cyclist.addEventListener('click', () => {
  if (cyclist.classList.contains('tuck')) return;
  cyclist.classList.add('tuck');
  toast('Aero tuck: about 15% less drag.');
  earnBadge('cyclist');
});

// Smooth gaits for the runner and the skier (drawn facing right, y points down).
// Each leg swings from the hip and bends at the knee; the arms swing opposite to the legs.
const deg = Math.PI / 180;
const joint = ([x, y], len, angle) => [x + len * Math.sin(angle * deg), y + len * Math.cos(angle * deg)]; // angle from straight down, + = forward
const pts = (...ps) => 'M' + ps.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L');

function runPose(fig, t) {
  const phase = (t / 1000) * 2 * Math.PI * 1.45; // about 175 steps a minute
  const hip = [0, -7.4], shoulder = [1, -11.6];
  const leg = (p) => {
    const thigh = 34 * Math.sin(p);
    const bend = 12 + 62 * Math.max(0, Math.cos(p)); // folded while swinging through, straight when pushing off
    const knee = joint(hip, 3.8, thigh);
    return pts(hip, knee, joint(knee, 3.8, thigh - bend));
  };
  const arm = (p) => {
    const upper = 32 * Math.sin(p + Math.PI);
    const elbow = joint(shoulder, 2.6, upper);
    return pts(shoulder, elbow, joint(elbow, 2.3, upper + 95)); // elbows bent, hands forward
  };
  fig.querySelector('.leg-a').setAttribute('d', leg(phase));
  fig.querySelector('.leg-b').setAttribute('d', leg(phase + Math.PI));
  fig.querySelector('.arm-a').setAttribute('d', arm(phase));
  fig.querySelector('.arm-b').setAttribute('d', arm(phase + Math.PI));
  // a light bounce: highest in the middle of each stride
  fig.querySelector('.figure').setAttribute('transform', `translate(0 ${(-0.8 * Math.abs(Math.sin(phase))).toFixed(2)})`);
}

function skiPose(fig, t) {
  const phase = (t / 1000) * 2 * Math.PI * 0.95; // a calmer, gliding rhythm
  const hip = [-0.2, -6.2], shoulder = [2, -10.2];
  const leg = (p) => {
    const thigh = 20 * Math.sin(p);
    const knee = joint(hip, 3.2, thigh);
    return pts(hip, knee, joint(knee, 3.2, thigh - (8 + 22 * Math.max(0, Math.cos(p)))));
  };
  const armAndPole = (p) => {
    const swing = 48 * Math.sin(p + Math.PI);
    const hand = joint(shoulder, 3.4, swing);
    return [pts(shoulder, hand), pts(hand, [hand[0] - 2.2 - 1.8 * Math.cos(p), 0.3])]; // pole planted behind the hand
  };
  fig.querySelector('.leg-a').setAttribute('d', leg(phase));
  fig.querySelector('.leg-b').setAttribute('d', leg(phase + Math.PI));
  const [armA, poleA] = armAndPole(phase), [armB, poleB] = armAndPole(phase + Math.PI);
  fig.querySelector('.arm-a').setAttribute('d', armA); fig.querySelector('.pole-a').setAttribute('d', poleA);
  fig.querySelector('.arm-b').setAttribute('d', armB); fig.querySelector('.pole-b').setAttribute('d', poleB);
}

/* ---------------- triathlon: swim across the lake, bike through the valley, run back ---------------- */
let tri = false;
const swimmer = $('#swimmer'), runner = $('#runner');
const triWeather = () => !live.frozen && !live.particle && lastSky.d < 0.5 &&
  (currentSeason() === 'summer' || (weatherNow?.temp ?? 0) >= 18);
const diver = $('#diver'), splash = $('#splash');
const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function dive() {
  const [sx, sy] = [1301, 474], [ex, ey] = [1283, 479]; // end of the jetty → into the water beside it
  diver.setAttribute('transform', `translate(${sx} ${sy})`);
  diver.classList.remove('up'); diver.classList.add('out');
  await wait(900);
  diver.classList.add('up');          // arms up, ready
  await wait(700);
  await new Promise((done) => {
    let t0 = 0;
    const step = (t) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / 750);
      // a parabola off the jetty, turning head first on the way down
      const x = sx + (ex - sx) * k, y = sy + (ey - sy) * k - 9 * 4 * k * (1 - k);
      diver.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-165 * k * k).toFixed(0)} 0 -7)`);
      if (k < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  diver.classList.remove('out', 'up');
  splash.setAttribute('transform', `translate(${ex} ${ey})`);
  splash.classList.remove('go'); void splash.getBoundingClientRect(); splash.classList.add('go');
  if (typeof ripples !== 'undefined') ripples.add(ex, ey, 1, 1.2);
  setTimeout(() => splash.classList.remove('go'), 700);
  await wait(350);
}
async function triathlon(force = false) {
  if (tri || riding || roadBusy || (!force && (!triWeather() || !heroVisible())) || reduceMotion) return;
  tri = true; roadBusy = true;
  // the start: arms up at the end of the jetty, then a dive into the lake
  await dive();
  swimmer.classList.add('out');
  await travel(swimmer, $('#swimLane'), 11000, { onStep: (p, q, t) => {
    swimmer.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); // drawn facing left, the way it swims
    swimmer.classList.toggle('alt', Math.sin(t / 260) > 0);
  } });
  swimmer.classList.remove('out');
  // bike (back through the valley), then run
  await ride({ reverse: true, force: true });
  runner.classList.add('out');
  await alongRoad(runner, { speed: 55, onStep: (t) => runPose(runner, t) });
  runner.classList.remove('out');
  roadBusy = false; tri = false;
}
[swimmer, runner, diver].forEach((el) => el.addEventListener('click', () => {
  toast('Triathlon: 1.5 km swim, 40 km bike, 10 km run.');
  earnBadge('triathlon');
}));
COMMANDS.triathlon = () => {
  if (tri) return 'The race is already on. Look at the lake.';
  if (live.frozen) return 'The lake is frozen. Triathlon season starts again in summer.';
  closeGps(); scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => triathlon(true), 600);
  return 'On your marks… The swim starts on the right side of the lake.';
};

/* ---------------- cross-country skier (winter) / roller skier (other seasons) ---------------- */
const xc = $('#xc');
async function xcSki(force = false) {
  if (roadBusy || riding || tri || (!force && (lastSky.d > 0.5 || !heroVisible())) || reduceMotion) return;
  roadBusy = true;
  const snow = currentSeason() === 'winter' || live.particle === 'snow' || live.frozen;
  xc.classList.toggle('snow', snow);
  xc.classList.add('out');
  await alongRoad(xc, { speed: snow ? 48 : 60, onStep: (t) => skiPose(xc, t) });
  xc.classList.remove('out');
  roadBusy = false;
}
xc.addEventListener('click', () => {
  toast(xc.classList.contains('snow') ? 'Cross-country skiing: the best way to see a winter landscape.' : 'Roller skiing: cross-country training until the snow comes back.');
  earnBadge('xc');
});

/* ---------------- a plane now and then ---------------- */
const plane = $('#plane');
function flyPlane(force = false) {
  if (plane.classList.contains('fly') || (!force && (live.overcast > 0.8 || !heroVisible())) || reduceMotion) return;
  plane.classList.toggle('night', lastSky.d > 0.6);
  plane.classList.toggle('west', Math.random() < 0.5);
  plane.style.top = (5 + Math.random() * 14).toFixed(1) + '%';
  void plane.getBoundingClientRect();
  plane.classList.add('fly');
}
plane.addEventListener('animationend', (e) => { if (e.target === plane) plane.classList.remove('fly'); });
plane.querySelector('.jet').addEventListener('click', () => {
  toast('Off to explore a new country.');
  earnBadge('plane');
});

// the skier comes down the Alps in winter, in daylight
const skier = $('#skier');
async function ski() {
  if (currentSeason() !== 'winter' || lastSky.d > 0.55 || !heroVisible() || reduceMotion) return;
  skier.classList.add('out');
  await travel(skier, $('#skiRun'), 7000, {
    onStep: (p, q) => {
      // skis follow the slope; mirror the skier when the zigzag turns left
      const left = q.x < p.x, slope = Math.atan2(q.y - p.y, Math.abs(q.x - p.x)) * 180 / Math.PI;
      skier.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})${left ? ' scale(-1 1)' : ''} rotate(${(slope * 0.6).toFixed(1)})`);
    },
  });
  skier.classList.remove('out');
}

// Migrating geese in spring and autumn, in daylight: south (towards the Alps, left) in autumn,
// north (towards Sweden, right) in spring. Leading the V is the hardest work, so now and then
// the lead goose drops back and one from the front of the other arm takes over.
const geese = [...document.querySelectorAll('#birds .goose')];
let vLead = 0, vArms = [[1, 2, 3], [4, 5, 6]], vSide = 0, vTimers = [];
function formation() {
  const at = (g, x, y) => { geese[g].style.transform = `translate(${x}px, ${y}px)`; };
  at(vLead, 6, 35);
  vArms[0].forEach((g, i) => at(g, 6 + 13 * (i + 1), 35 - 8 * (i + 1)));
  vArms[1].forEach((g, i) => at(g, 6 + 13 * (i + 1), 35 + 8 * (i + 1)));
}
function changeLead() {
  const other = 1 - vSide;
  vArms[vSide].push(vLead);        // the leader drops back to the end of one arm …
  vLead = vArms[other].shift();    // … and the first goose of the other arm moves to the front
  vSide = other;
  formation();
}
function birds(force = false) {
  const season = currentSeason();
  if (!force && (!['spring', 'autumn'].includes(season) || lastSky.d > 0.6 || !heroVisible() || reduceMotion)) return;
  const b = $('#birds');
  if (b.classList.contains('fly') && !force) return;
  vTimers.forEach(clearTimeout);
  b.classList.remove('fly', 'north');
  void b.getBoundingClientRect();
  b.style.top = 8 + Math.random() * 20 + '%';
  b.classList.add('fly');
  if (season === 'spring') b.classList.add('north');
  vTimers = [setTimeout(changeLead, 8000), setTimeout(changeLead, 17000)];
}
formation();
$('#birds').addEventListener('animationend', (e) => { if (e.target.id === 'birds') { e.target.classList.remove('fly', 'north'); vTimers.forEach(clearTimeout); } });

// the ice skater spins when clicked
$('#skater').addEventListener('click', () => {
  const s = $('#skater');
  s.classList.remove('spin'); void s.getBoundingClientRect(); s.classList.add('spin');
  earnBadge('skater');
});

/* ---------------- the International Space Station ---------------- */
// When the ISS really passes over Vienna at night (above the horizon, lit by the sun while
// Vienna is dark), a small steady light crosses the sky. Data: wheretheiss.at, free, no key.
const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const issDot = $('#iss');
let issTimer = 0;

// direction and height above the horizon of the ISS, seen from a place on the ground
function lookAngles(obs, sat) {
  const rad = Math.PI / 180, R = 6371;
  const ecef = (lat, lon, h) => [(R + h) * Math.cos(lat * rad) * Math.cos(lon * rad), (R + h) * Math.cos(lat * rad) * Math.sin(lon * rad), (R + h) * Math.sin(lat * rad)];
  const o = ecef(obs.lat, obs.lon, 0), s = ecef(sat.latitude, sat.longitude, sat.altitude);
  const d = s.map((v, i) => v - o[i]), dist = Math.hypot(...d);
  const [la, lo] = [obs.lat * rad, obs.lon * rad];
  const east = [-Math.sin(lo), Math.cos(lo), 0];
  const north = [-Math.sin(la) * Math.cos(lo), -Math.sin(la) * Math.sin(lo), Math.cos(la)];
  const up = [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return { elevation: Math.asin(dot(d, up) / dist) / rad, azimuth: (Math.atan2(dot(d, east), dot(d, north)) / rad + 360) % 360, dist };
}

// place the dot: looking south, east is on the left and west on the right
function placeIss(az, el) {
  issDot.style.left = (50 + ((az - 180) / 180) * 50).toFixed(2) + '%';
  issDot.style.top = (62 - (el / 90) * 56).toFixed(2) + '%';
}

async function checkIss() {
  clearTimeout(issTimer);
  let next = 60;
  try {
    if (lastSky.d > 0.75 && live.overcast < 0.7 && heroVisible()) {
      const sat = await (await fetch(ISS_URL)).json();
      const { elevation, azimuth } = lookAngles(base(), sat);
      const visible = elevation > 10 && sat.visibility === 'daylight';
      issDot.classList.toggle('show', visible);
      if (visible) { placeIss(azimuth, elevation); next = 5; }
    } else issDot.classList.remove('show');
  } catch { /* offline: try again later */ }
  issTimer = setTimeout(checkIss, next * 1000);
}

issDot.addEventListener('click', () => {
  toast('That is the International Space Station: about 420 km up, moving at 27,600 km/h.');
  earnBadge('iss');
});

COMMANDS.iss = async () => {
  try {
    const sat = await (await fetch(ISS_URL)).json();
    const where = await (await fetch(`https://api.wheretheiss.at/v1/coordinates/${sat.latitude.toFixed(2)},${sat.longitude.toFixed(2)}`)).json();
    const { elevation, dist } = lookAngles(base(), sat);
    const region = where.country_code && where.country_code !== '??' ? `over ${new Intl.DisplayNames(['en'], { type: 'region' }).of(where.country_code)}` : 'over the ocean';
    const sunlit = sat.visibility === 'daylight';
    const status = elevation > 10 ? (sunlit && lastSky.d > 0.75 ? '<span class="ok">Visible from Vienna right now. Look up.</span>' : 'Above Vienna, but not visible (it needs to be dark here and sunlit up there).')
      : 'Below the horizon for Vienna.';
    return `International Space Station
  now ${region}, ${sat.latitude.toFixed(1)}°, ${sat.longitude.toFixed(1)}°
  ${Math.round(sat.altitude)} km up, ${Math.round(sat.velocity).toLocaleString('en')} km/h
  ${Math.round(dist).toLocaleString('en')} km from Vienna
${status}`;
  } catch {
    return '<span class="warn">No contact with the space station.</span> Try again later.';
  }
};

/* ---------------- conference map ---------------- */
// Pins for every talk / poster / award that has a `city`. Coordinates come from Open-Meteo's
// free place search (remembered in the browser); land outlines from Natural Earth (world-atlas).
const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json';

async function geocode(city) {
  const saved = store.get(`geo:${city}`);
  if (saved) return JSON.parse(saved);
  const [name, country] = city.split(',').map((x) => x.trim());
  const r = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=5&language=en`)).json();
  const hits = r.results || [];
  const hit = (country && hits.find((h) => [h.country, h.country_code].some((c) => c && c.toLowerCase() === country.toLowerCase()))) || hits[0];
  if (!hit) return null;
  const pos = { lat: hit.latitude, lon: hit.longitude };
  store.set(`geo:${city}`, JSON.stringify(pos));
  return pos;
}

// TopoJSON → list of rings of [lon, lat]
function landRings(topo) {
  const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
  const arcs = topo.arcs.map((arc) => { let x = 0, y = 0; return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
  const arcPoints = (i) => (i >= 0 ? arcs[i] : arcs[~i].slice().reverse());
  const ring = (ids) => ids.flatMap((id, k) => (k ? arcPoints(id).slice(1) : arcPoints(id)));
  const geoms = topo.objects.land.type === 'GeometryCollection' ? topo.objects.land.geometries : [topo.objects.land];
  return geoms.flatMap((geo) => (geo.type === 'Polygon' ? geo.arcs.map(ring) : geo.arcs.flatMap((poly) => poly.map(ring))));
}

async function renderTalkMap() {
  const places = SITE.talks.filter((t) => t.city || (t.lat != null && t.lon != null));
  if (!places.length) return;
  try {
    const located = (await Promise.all(places.map(async (t) => ({ t, pos: t.lat != null ? { lat: t.lat, lon: t.lon } : await geocode(t.city) })))).filter((p) => p.pos);
    if (!located.length) return;
    // one pin per city, listing everything that happened there
    const pins = {};
    located.forEach(({ t, pos }) => { const k = t.city || `${pos.lat},${pos.lon}`; (pins[k] = pins[k] || { name: (t.city || '').split(',')[0], pos, events: [] }).events.push(t); });
    const idsOf = (p) => p.events.map((e) => SITE.talks.indexOf(e)).join(' ');
    const list = Object.values(pins);

    // an equirectangular view that fits all pins (at least roughly the size of Europe), 2.4:1
    const lat0 = list.reduce((s, p) => s + p.pos.lat, 0) / list.length, k = Math.cos(lat0 * Math.PI / 180);
    const project = ([lon, lat]) => [lon * k, -lat];
    const xs = list.map((p) => project([p.pos.lon, p.pos.lat])[0]), ys = list.map((p) => project([p.pos.lon, p.pos.lat])[1]);
    let [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    let w = Math.max((x1 - x0) * 1.5, 40 * k), h = Math.max((y1 - y0) * 1.5, 18);
    if (w / h < 2.4) w = h * 2.4; else h = w / 2.4;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    x0 = cx - w / 2; y0 = cy - h / 2;

    const topo = await (await fetch(WORLD_URL)).json();
    const land = landRings(topo).map((r) => {
      let d = '', prev = null;
      r.forEach((pt) => { const [x, y] = project(pt); d += (prev == null || Math.abs(pt[0] - prev) > 180 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2); prev = pt[0]; });
      return d + 'Z';
    }).join('');
    const r = w * 0.009, fs = w * 0.022;
    // Each label tries four spots (right, left, above, below) and takes the first one that fits
    // inside the map and hits neither another label nor any pin.
    const pinsXY = list.map((p) => ({ p, xy: project([p.pos.lon, p.pos.lat]), size: r * (1 + 0.35 * (p.events.length - 1)) }));
    const blocked = pinsXY.map(({ xy: [x, y], size }) => ({ x0: x - size * 2.2, x1: x + size * 2.2, y0: y - size * 2.2, y1: y + size * 2.2 }));
    const hits = (b) => blocked.some((q) => b.x0 < q.x1 && b.x1 > q.x0 && b.y0 < q.y1 && b.y1 > q.y0);
    const inside = (b) => b.x0 >= x0 && b.x1 <= x0 + w && b.y0 >= y0 && b.y1 <= y0 + h; // stays within the map
    const pinsSvg = pinsXY.sort((a, b) => b.p.events.length - a.p.events.length || a.xy[0] - b.xy[0]).map(({ p, xy: [x, y], size }) => {
      const title = p.events.flatMap((e) => rolesOf(e).map((r) => `${e.year} · ${r.type}: ${r.title}`)).join('\n');
      const label = p.name ? `${p.name}${p.events.length > 1 ? ` ×${p.events.length}` : ''}` : '';
      const lw = label.length * fs * 0.56, gap = size * 2.4, hh = fs * 0.62;
      const spots = [
        { x: x + gap, y: y + fs * 0.35, anchor: 'start', box: { x0: x + gap, x1: x + gap + lw, y0: y - hh, y1: y + hh } },
        { x: x - gap, y: y + fs * 0.35, anchor: 'end', box: { x0: x - gap - lw, x1: x - gap, y0: y - hh, y1: y + hh } },
        { x, y: y - gap - fs * 0.25, anchor: 'middle', box: { x0: x - lw / 2, x1: x + lw / 2, y0: y - gap - hh * 2, y1: y - gap } },
        { x, y: y + gap + fs * 0.95, anchor: 'middle', box: { x0: x - lw / 2, x1: x + lw / 2, y0: y + gap, y1: y + gap + hh * 2 } },
      ];
      const spot = label ? (spots.find((s) => inside(s.box) && !hits(s.box)) || spots.find((s) => inside(s.box)) || spots[0]) : null;
      if (spot) blocked.push(spot.box);
      return `<g class="map-pin" data-t="${idsOf(p)}" tabindex="0" role="button" aria-label="${esc(`${p.name}: ${p.events.length} ${p.events.length > 1 ? 'entries' : 'entry'}, highlight in the list`)}"><title>${esc(p.name ? `${p.name}\n` : '')}${esc(title)}</title>
        <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(size * 2.2).toFixed(2)}" class="halo"/><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size.toFixed(2)}"/>
        ${spot ? `<text x="${spot.x.toFixed(2)}" y="${spot.y.toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="${spot.anchor}">${esc(label)}</text>` : ''}</g>`;
    }).join('');
    const svg = $('#talkMapSvg');
    svg.setAttribute('viewBox', `${x0.toFixed(2)} ${y0.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
    svg.innerHTML = `<path class="land" d="${land}"/>${pinsSvg}`;
    $('#talkMap').hidden = false;
    svg.querySelectorAll('.map-pin').forEach((pin) => {
      pin.addEventListener('click', () => selectPlace(pin.dataset.t));
      pin.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPlace(pin.dataset.t); } });
    });
  } catch { /* offline: no map, the list below still works */ }
}

// Click a pin: highlight everything that happened there in the list (and the other way round)
function selectPlace(ids) {
  const set = new Set(String(ids).split(' '));
  document.querySelectorAll('#talkList li').forEach((li) => li.classList.toggle('active', set.has(li.dataset.t)));
  document.querySelectorAll('.map-pin').forEach((pin) => pin.classList.toggle('active', pin.dataset.t.split(' ').some((id) => set.has(id))));
  const first = document.querySelector('#talkList li.active');
  if (first && (first.getBoundingClientRect().top > innerHeight - 80 || first.getBoundingClientRect().top < 0)) first.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
}
$('#talkList').addEventListener('click', (e) => {
  const li = e.target.closest('li[data-t]');
  if (li && !e.target.closest('a')) selectPlace(li.dataset.t);
});
// only load the map data when the Talks section comes near the screen
new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { obs.disconnect(); renderTalkMap(); } }, { rootMargin: '400px' }).observe($('#talks'));

/* ---------------- time-lapse ---------------- */
// `timelapse`: a whole day in 20 seconds. `timelapse year`: the four seasons in 20 seconds.
let lapsing = false;
function timelapse(mode) {
  lapsing = true;
  const saved = { hour: forcedHour, season: forcedSeason, particle: live.particle };
  const root = document.documentElement, seasons = ['winter', 'spring', 'summer', 'autumn'];
  const DURATION = 20000;
  if (mode === 'year') live.particle = null; // show each season's own snow, petals or leaves
  clockPaused = true;
  root.classList.add('timelapse');
  // A plain timer (not animation frames), so it always ends after 20 s, even in a background tab.
  // About 15 pictures a second is plenty, and kind to phones.
  const t0 = performance.now();
  const step = () => {
    const k = Math.min(1, (performance.now() - t0) / DURATION);
    if (mode === 'year') {
      forcedSeason = seasons[Math.min(3, Math.floor(k * 4))];
      forcedHour = skyPreset('day');
      $('#clock').textContent = forcedSeason;
    } else {
      forcedHour = (k * 24) % 24;
      $('#clock').textContent = fmtHour(forcedHour);
      $('#greet').textContent = greeting(forcedHour);
    }
    paintSky();
    if (k < 1) return setTimeout(step, 66);
    forcedHour = saved.hour; forcedSeason = saved.season; live.particle = saved.particle;
    clockPaused = false;
    root.classList.remove('timelapse');
    paintSky(); tickClock();
    lapsing = false;
  };
  step();
}

COMMANDS.timelapse = (arg) => {
  if (lapsing) return 'A time-lapse is already running. Look up.';
  if (reduceMotion) return 'This one needs animations, which are turned off on your device.';
  if (arg && arg !== 'year') return 'Usage: timelapse | timelapse year';
  closeGps();
  scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => timelapse(arg), 600);
  return arg === 'year' ? 'Winter, spring, summer, autumn: here we go.' : 'Midnight to midnight in 20 seconds…';
};

/* ---------------- screensaver ---------------- */
// After a minute without any input, while the top of the page is on screen, the text and menu
// fade away and only the live landscape remains. Any movement brings them back.
const IDLE_MS = params.has('screensaver') ? 3000 : 60000; // preview: ?screensaver starts after 3 seconds
let idleTimer = 0;
function wake() {
  document.documentElement.classList.remove('screensaver');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    const atTop = scrollY < innerHeight * 0.3;
    if (atTop && gps.hidden && !document.hidden) document.documentElement.classList.add('screensaver');
    else wake(); // try again later
  }, IDLE_MS);
}
['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach((ev) => addEventListener(ev, wake, { passive: true }));
wake();

/* ---------------- cows on the meadow, and a UFO ---------------- */
// Three cows graze between the tree line and the valley road: they eat for a while (head
// down), then amble somewhere else. In the cold they wear scarves; at night they lie down.
// Very rarely, after dark, a UFO beams one up, has a look at it, and puts it back (facing
// the other way).
const cowSVG = `<g class="cow-flip"><g class="cow-body">
    <g class="legs back"><path d="M-3.8 -2.6 V0 M-2.5 -2.6 V0"/></g><g class="legs front"><path d="M2.4 -2.6 V0 M3.7 -2.6 V0"/></g>
    <path class="tail" d="M-5 -6.4 q-1.2 1.6 -.8 3.6"/>
    <rect class="body" x="-5.2" y="-7.2" width="9.8" height="4.9" rx="1.7"/>
    <path class="spot" d="M-3.4 -7.2 q.4 2.2 2.6 1.8 q1.7 -.5 1.1 -1.8 Z"/><path class="spot" d="M1.2 -4.6 q1.2 -1.5 2.6 -.4 q.3 1.7 -1.1 2 q-1.4 .2 -1.5 -1.6 Z"/>
    <ellipse class="udder" cx="1" cy="-2.2" rx="1" ry=".55"/>
    <g class="head"><path class="ear" d="M3.9 -8.4 l-1.1 -.2 .9 .9 Z"/><rect class="face" x="3.7" y="-9" width="2.9" height="2.7" rx=".8"/>
      <rect class="muzzle" x="5.5" y="-7.6" width="1.5" height="1.4" rx=".5"/><path class="horn" d="M4.2 -9 l-.4 -1 M5.8 -9 l.3 -1"/><circle class="eye" cx="5.4" cy="-8.2" r=".27"/></g>
    <path class="scarf" d="M3.6 -7.1 Q4.3 -5.5 5 -6.9 M4.4 -6.2 l-.4 2"/><circle class="bell" cx="4.3" cy="-5.2" r=".45"/>
  </g></g><rect class="hit" x="-6" y="-10.5" width="13.5" height="11"/>`;
const cowsEl = $('#cows'), ufo = $('#ufo'), ufoBeam = ufo.querySelector('.beam');
const roadAt = (() => { // y of the valley road at x, sampled once
  const len = road.getTotalLength(), ys = {};
  for (let s = 0; s <= 600; s++) { const p = road.getPointAtLength((s / 600) * len); ys[Math.round(p.x / 5)] = p.y; }
  return (x) => ys[Math.round(x / 5)] ?? 470;
})();
const cowBand = (x) => [groundY(x) + 9, roadAt(x) - 6]; // grass between the trees and the road
const herd = [[395, 447], [462, 455], [548, 444]].map(([x, y], i) => {
  cowsEl.insertAdjacentHTML('beforeend', `<g class="cow">${cowSVG}</g>`);
  const el = cowsEl.lastElementChild;
  return { el, flip: el.querySelector('.cow-flip'), head: el.querySelector('.head'), back: el.querySelector('.legs.back'), front: el.querySelector('.legs.front'),
    x, y, tx: x, ty: y, dir: i === 1 ? -1 : 1, walking: false, until: performance.now() + 2000 + Math.random() * 6000, busy: false };
});
function drawCow(c, t = 0) {
  const s = 0.95 + (c.y - 440) * 0.012; // a little bigger closer to us
  c.el.setAttribute('transform', `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) scale(${(s * c.dir).toFixed(3)} ${s.toFixed(3)})`);
  const swing = c.walking ? Math.sin(t / 160) * 14 : 0;
  c.back.setAttribute('transform', swing ? `rotate(${swing.toFixed(1)} -3.1 -2.6)` : '');
  c.front.setAttribute('transform', swing ? `rotate(${(-swing).toFixed(1)} 3 -2.6)` : '');
  c.head.setAttribute('transform', c.walking || c.busy ? '' : 'rotate(38 4.2 -6.8)'); // grazing: head down
}
herd.forEach((c) => drawCow(c));
let cowRaf = 0, cowLast = 0, cowDrawn = 0;
function cowStep(t) {
  const dt = Math.min(0.1, (t - (cowLast || t)) / 1000); cowLast = t;
  const asleep = lastSky.d > 0.82;
  herd.forEach((c) => {
    c.el.classList.toggle('sleep', asleep && !c.busy);
    if (c.busy || asleep) return;
    if (!c.walking && t > c.until) { // time to find fresh grass nearby
      c.tx = Math.max(350, Math.min(610, c.x + (Math.random() - 0.5) * 90));
      const [top, bottom] = cowBand(c.tx);
      c.ty = top + Math.random() * Math.max(0, bottom - top);
      c.walking = true; c.dir = c.tx >= c.x ? 1 : -1;
    }
    if (c.walking) {
      const dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy), v = 2.6 * dt;
      if (d <= v) { c.x = c.tx; c.y = c.ty; c.walking = false; c.until = t + 5000 + Math.random() * 9000; }
      else { c.x += (dx / d) * v; c.y += (dy / d) * v; }
    }
  });
  if (t - cowDrawn > 50) { // 20 frames a second is plenty for cows
    cowDrawn = t;
    herd.forEach((c) => { if (!c.busy) drawCow(c, t); });
    // the cow closest to us is drawn in front
    herd.slice().sort((a, b) => a.y - b.y).forEach((c) => cowsEl.appendChild(c.el));
  }
  cowRaf = requestAnimationFrame(cowStep);
}
setInterval(() => {
  const on = heroVisible() && !reduceMotion;
  if (on && !cowRaf) { cowLast = 0; cowRaf = requestAnimationFrame(cowStep); }
  if (!on && cowRaf) { cancelAnimationFrame(cowRaf); cowRaf = 0; }
}, 1000);
const cowWeather = () => cowsEl.classList.toggle('cold', currentSeason() === 'winter' || live.frozen || ((simulated || weatherNow)?.temp ?? 10) < 3);
skyHooks.push(cowWeather);
cowWeather();

// animate(ms, k => …): calls back with k from 0 to 1, resolves when done
const animate = (ms, fn) => new Promise((done) => {
  let t0 = 0;
  const step = (t) => { if (!t0) t0 = t; const k = Math.min(1, (t - t0) / ms); fn(k, t); if (k < 1) requestAnimationFrame(step); else done(); };
  requestAnimationFrame(step);
});
const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);
let ufoOut = false;
async function ufoVisit(force = false) {
  if (ufoOut || reduceMotion || !heroVisible()) return;
  if (!force && (lastSky.d < 0.6 || live.overcast > 0.7 || Math.random() > 0.3)) return;
  ufoOut = true;
  const cow = herd[Math.floor(Math.random() * herd.length)];
  cow.busy = true; cow.walking = false; cow.el.classList.remove('sleep'); drawCow(cow);
  const hx = cow.x, hy = cow.y - 78, from = [hx + 260, hy - 90];
  const place = (x, y, tilt = 0) => ufo.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${tilt.toFixed(1)})`);
  const beamTo = (depth) => ufoBeam.setAttribute('d', `M-4 1 L4 1 L${(4 + depth * 0.1).toFixed(1)} ${depth.toFixed(1)} L${(-4 - depth * 0.1).toFixed(1)} ${depth.toFixed(1)} Z`);
  ufo.classList.add('out');
  // swoop in and stop above the cow
  await animate(2600, (k) => { const e = ease(k); place(from[0] + (hx - from[0]) * e, from[1] + (hy - from[1]) * e, (1 - e) * -14); });
  await animate(700, (k, t) => place(hx, hy + Math.sin(t / 120) * 1.2));
  // beam it up
  beamTo(80); ufo.classList.add('beaming');
  const s0 = 0.95 + (cow.y - 440) * 0.012, y0 = cow.y;
  await animate(3600, (k, t) => {
    const e = ease(k), s = s0 * (1 - 0.55 * e);
    cow.el.setAttribute('transform', `translate(${(hx + Math.sin(t / 300) * 1.5).toFixed(1)} ${(y0 - 76 * e).toFixed(1)}) rotate(${(Math.sin(t / 250) * 12 * e).toFixed(1)}) scale(${(s * cow.dir).toFixed(3)} ${s.toFixed(3)})`);
    place(hx, hy + Math.sin(t / 120) * 1.2);
  });
  cow.el.style.opacity = 0; ufo.classList.remove('beaming');
  // a quick look at it on board
  await animate(2600, (k, t) => place(hx + Math.sin(t / 180) * 3, hy + Math.sin(t / 90) * 1.5, Math.sin(t / 200) * 5));
  // … and back it goes, facing the other way
  cow.dir *= -1; cow.el.style.opacity = 1; ufo.classList.add('beaming');
  await animate(3200, (k, t) => {
    const e = ease(k), s = s0 * (0.45 + 0.55 * e);
    cow.el.setAttribute('transform', `translate(${hx.toFixed(1)} ${(y0 - 76 * (1 - e)).toFixed(1)}) rotate(${(Math.sin(t / 250) * 12 * (1 - e)).toFixed(1)}) scale(${(s * cow.dir).toFixed(3)} ${s.toFixed(3)})`);
    place(hx, hy + Math.sin(t / 120) * 1.2);
  });
  ufo.classList.remove('beaming');
  cow.busy = false; cow.until = performance.now() + 4000; drawCow(cow);
  await animate(400, () => {});
  // and off it goes
  await animate(1300, (k) => { const e = k * k; place(hx - 420 * e, hy - 160 * e, -16 * e); });
  ufo.classList.remove('out');
  ufoOut = false;
}
ufo.querySelector('.hit').addEventListener('click', () => earnBadge('ufo'));

/* ---------------- the moose (älg) ---------------- */
// Now and then a moose steps out of the Swedish forest, stops in the middle of the road to look
// around, and walks on. A warning sign appears while it's there. Clicking it makes it hurry.
const moose = $('#moose'), mooseLegs = moose.querySelector('.ms-legs'), mooseFlip = moose.querySelector('.ms-flip');
let mooseOut = false, mooseHurry = false;
function mooseCrossing(force = false) {
  if (mooseOut || roadBusy || riding || tri || reduceMotion || !heroVisible()) return;
  if (!force && (lastSky.d > 0.85 || Math.random() > 0.35)) return;
  mooseOut = true; roadBusy = true; mooseHurry = false;
  const down = Math.random() < 0.5; // out of the forest towards the meadow, or the other way
  const A = [772, 451], B = [818, 507], [from, to] = down ? [A, B] : [B, A];
  const dir = to[0] > from[0] ? 1 : -1, len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  $('#algSign').classList.add('show');
  moose.classList.add('out');
  let pos = 0, last = 0, walked = 0, drawn = 0, paused = 0;
  const hips = [[-6.5, -9.8], [-4.8, -9.8], [5, -10.4], [6.6, -10.4]];
  return new Promise((done) => {
    const step = (t) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
      // stop for a moment in the middle of the road
      const onRoad = pos > len * 0.45 && pos < len * 0.5;
      if (onRoad && paused < 1.8 && !mooseHurry) paused += dt;
      else { const v = mooseHurry ? 16 : 5.5; pos = Math.min(len, pos + v * dt); walked += v * dt; }
      if (t - drawn > 33) {
        drawn = t;
        const k = pos / len, x = from[0] + (to[0] - from[0]) * k, y = from[1] + (to[1] - from[1]) * k;
        const scale = 0.85 + (y - 451) / 56 * 0.3; // a little bigger closer to us
        moose.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(3)})`);
        mooseFlip.setAttribute('transform', dir < 0 ? 'scale(-1 1)' : '');
        // walking legs: diagonal pairs swing together
        const phase = walked * 0.9;
        mooseLegs.setAttribute('d', hips.map(([hx, hy], i) => {
          const a = Math.sin(phase + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.3;
          return `M${hx} ${hy} L${(hx + Math.sin(a) * 9.8).toFixed(2)} ${(hy + Math.cos(a) * 9.8).toFixed(2)}`;
        }).join(' '));
      }
      if (pos < len) requestAnimationFrame(step);
      else {
        moose.classList.remove('out'); $('#algSign').classList.remove('show');
        mooseOut = false; roadBusy = false; done();
      }
    };
    requestAnimationFrame(step);
  });
}
moose.addEventListener('click', () => { mooseHurry = true; earnBadge('moose'); });

/* ---------------- a tent in the forest ---------------- */
// Summer evenings: someone camps in the clearing on the Swedish side (allemansrätten, the right
// to roam, allows it there). The campfire burns from an hour before sunset until 23:30; after
// dark a headlamp lights up the tent until midnight. The tent is packed up two hours after sunrise.
const camp = $('#camp');
camp.setAttribute('transform', `translate(690 ${(groundY(690) + 1).toFixed(1)}) scale(1.3)`);
function campState({ h, d, sunT }) {
  const forced = params.has('tent');
  const evening = h >= sunT.set - 1 || h < sunT.rise + 2;
  const show = forced || (currentSeason() === 'summer' && evening && !live.frozen);
  const wet = live.particle === 'rain' || live.particle === 'drizzle';
  camp.classList.toggle('show', show);
  camp.classList.toggle('fire', show && !wet && (forced || (h >= sunT.set - 1 && h < 23.5)));
  camp.classList.toggle('lit', show && d > 0.5 && h >= 12);
}
skyHooks.push(campState);
if (lastSky.sunT) campState(lastSky);
camp.querySelector('.fire .hit').addEventListener('click', () => {
  camp.classList.remove('poke'); void camp.getBoundingClientRect(); camp.classList.add('poke');
  setTimeout(() => camp.classList.remove('poke'), 2000);
  earnBadge('camp');
});

/* ---------------- the snowman ---------------- */
// On cold winter days a snowman gets built bit by bit after sunrise: base, middle, head, face,
// then hat, scarf and arms. Above 2 °C it starts to melt; above 8 °C it's gone.
const snowman = $('#snowman'), snowParts = [...snowman.querySelectorAll('[data-stage]')];
let snowPreview = null;
function snowmanStage({ h, sunT }) {
  const temp = (simulated || weatherNow)?.temp ?? 0;
  let stage = h < sunT.rise ? 5 : Math.min(5, 1 + Math.floor((h - sunT.rise) / 1.2));
  let melting = temp > 2;
  if (snowPreview) ({ stage, melting } = snowPreview);
  const show = snowPreview || (currentSeason() === 'winter' && temp <= 8);
  snowman.classList.toggle('show', !!show);
  snowman.classList.toggle('melting', !!melting);
  snowParts.forEach((el) => { el.style.display = +el.dataset.stage <= stage ? '' : 'none'; });
}
skyHooks.push(snowmanStage);
if (lastSky.sunT) snowmanStage(lastSky);
snowman.addEventListener('click', () => {
  snowman.classList.remove('hop'); void snowman.getBoundingClientRect(); snowman.classList.add('hop');
  earnBadge('snowman');
});

/* ---------------- schedule ---------------- */
setTimeout(() => ride(), 6000);
every(35, 90, () => ride());
setTimeout(() => triathlon(), 20000);
every(180, 360, () => triathlon());
every(60, 140, () => xcSki());
setTimeout(() => flyPlane(), 12000);
every(70, 160, () => flyPlane());
setTimeout(ski, 4000);
every(20, 50, ski);
setTimeout(birds, 8000);
every(45, 110, birds);
every(90, 240, () => mooseCrossing());
every(240, 600, () => ufoVisit());
setTimeout(checkIss, 3000);
every(45, 100, () => { if (live.frozen && !penguinOut && heroVisible() && !reduceMotion) penguinOuting(Math.random() < 0.5 ? 'slide' : 'fish'); });
every(60, 130, () => { if (hotDay() && !penguinOut && heroVisible() && !reduceMotion) penguinOuting('swim'); });

// preview helpers for FEATURES.md: ?ride, ?penguin, ?smlm
if (params.has('ride')) setTimeout(() => ride({ force: true }), 800);
if (params.has('triathlon')) setTimeout(() => triathlon(true), 800);
if (params.has('xc')) setTimeout(() => xcSki(true), 800);
if (params.has('plane')) setTimeout(() => flyPlane(true), 800);
if (params.has('bbq')) setTimeout(penguinGrill, 800);
if (params.has('penguin')) setTimeout(() => (live.frozen ? penguinSlide() : penguinWalk()), 800);
if (params.has('fishing')) setTimeout(penguinFish, 800);
if (params.has('swim')) setTimeout(penguinSwim, 800);
if (params.has('smlm')) setTimeout(() => (lastSky.d >= 0.75 ? smlmShow() : toast('The microscope only works at night.')), 900);
if (params.has('timelapse')) setTimeout(() => timelapse(params.get('timelapse') === 'year' ? 'year' : ''), 900);
if (params.has('iss')) { // preview: a pass from west-south-west to east over 40 seconds
  clearTimeout(issTimer);
  issDot.classList.add('show', 'demo');
  let k = 0; placeIss(240, 12);
  const demo = setInterval(() => { k += 1; placeIss(240 - k * 12, 12 + Math.sin((k / 12) * Math.PI) * 45); if (k >= 12) { clearInterval(demo); setTimeout(() => issDot.classList.remove('show', 'demo'), 4000); } }, 3300);
}
if (params.has('birds')) setTimeout(() => birds(true), 800);
if (params.has('moose')) setTimeout(() => mooseCrossing(true), 800);
if (params.has('ufo')) setTimeout(() => ufoVisit(true), 1500);
if (params.has('snowman')) { // preview: builds up stage by stage, then melts (?snowman) or starts melted (?snowman=melt)
  let k = 0;
  const tick = () => { k++; snowPreview = { stage: Math.min(5, k), melting: params.get('snowman') === 'melt' || k > 7 }; paintSky(); if (k < 9) setTimeout(tick, 1500); };
  tick();
}
