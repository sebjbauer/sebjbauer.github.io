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
  ['iss', 'Space station', `spotted the ISS over ${SITE.places[SITE.workBase].city}`, 'a steady light that moves fast on clear nights'],
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
  ['peek', 'Peekaboo', 'caught the penguin under the footer', 'go all the way down'],
  ['owl', 'Night owl', 'startled the owl', 'two eyes in the forest, after dark'],
  ['glow', 'Sea sparkle', 'made the lake glow', 'touch the water on a dark night'],
  ['moo', 'Cowbell', 'got the cows\' attention', 'say hello to the herd'],
  ['hockey', 'Face-off', 'joined the hockey game', 'someone plays on the frozen lake'],
  ['sauna', 'Löyly', 'threw water on the sauna stones', 'the sauna by the jetty, when it\'s warm inside'],
  ['catch', 'Night catch', 'helped the angler land a fish', 'a lantern on the lake at night'],
  ['flow', 'Optimal transport', 'flowed noise into a name', 'from a Gaussian to two letters, the cheapest way'],
  ['balloon', 'Up and away', 'fired the burner of the hot-air balloon', 'calm mornings and evenings, high above the valley'],
  ['cake', 'Birthday wishes', 'blew out the candles', 'one day in November, on the veranda'],
  ['equation', 'Chalk talk', 'asked for the equation of the day', 'a new one every day, in LaTeX'],
  ['psf', 'Airy disk', 'drew a point spread function', 'a command for microscopists'],
  ['errands', 'Errand runner', 'sent the penguin on five different jobs', 'tap things around the cottage'],
  ['beaver', 'Busy beaver', 'sent the beaver for a swim', 'its home is on the far shore'],
  ['time', 'Time traveller', 'watched a whole day go by', 'a command that speeds things up'],
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
northernLights = function () { earnBadge('riddle'); setTimeout(() => selfieOuting(true), 2500); return originalNorthernLights(); };

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
      const p = pointAt(path, at), q = pointAt(path, Math.min(len, at + 1));
      onStep ? onStep(p, q, t) : el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
      if (k < 1) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
}

// the penguin: every 5th click on the cottage it walks out, does a loop and goes back in
let cottageClicks = 0, penguinOut = false;
/* ---------------- the penguin on a layer of its own ---------------- */
// On phones, anything that moves inside the big landscape drawing makes the browser redraw all of it on
// every frame. So the penguin lives in a small SVG of its own that is slid across the scene with a CSS
// transform (the graphics chip does that for free); only its waddle is redrawn, in that small SVG.
// placePenguin(x, y) takes the same landscape coordinates as before.
const penguinEl = $('#penguin'), fxSvg = $('#landscapeFx'), SPRITE = 1.45; // drawn at the largest size it gets, then scaled down
const pgSprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
pgSprite.setAttribute('class', 'sprite'); pgSprite.setAttribute('aria-hidden', 'true');
pgSprite.setAttribute('viewBox', '-20 -24 40 32'); pgSprite.setAttribute('preserveAspectRatio', 'none');
pgSprite.append($('#pgClip').parentNode, penguinEl); // its clip paths come along
fxSvg.after(pgSprite);
let spriteM = null;
function spriteMatrix() { // landscape units → pixels in the hero (the phone view stretches x and y differently)
  if (spriteM) return spriteM;
  const m = landMatrix(fxSvg), hero = fxSvg.parentNode.getBoundingClientRect();
  if (!m || !(m.a > 0) || !(m.d > 0)) return { a: 1, d: 1, e: -9999, f: -9999 }; // not laid out yet: measure again next time
  spriteM = { a: m.a, d: m.d, e: m.e - hero.left, f: m.f - hero.top };
  const k = SPRITE;
  Object.assign(pgSprite.style, { width: `${40 * m.a * k}px`, height: `${32 * m.d * k}px`, left: `${-20 * m.a * k}px`, top: `${-24 * m.d * k}px`, transformOrigin: `${20 * m.a * k}px ${24 * m.d * k}px` });
  return spriteM;
}
addEventListener('resize', () => { spriteM = null; });
panHooks.push(() => { spriteM = null; }); // the scene was swiped, zoomed or laid out again: measure afresh on the next step
// the front door opens while the penguin stands in the doorway, going out or coming home
const stugaDoor = $('#stugaDoor');
let doorTimer = 0;
let pgX = 1195; // where the penguin is (landscape x), for the phone camera
function placePenguin(x, y, scale = 1, dy = 0) {
  if (y > 420) pgX = x;
  const m = spriteMatrix();
  pgSprite.style.transform = `translate3d(${(m.a * x + m.e).toFixed(1)}px, ${(m.d * (y + dy) + m.f).toFixed(1)}px, 0) scale(${(scale / SPRITE).toFixed(3)})`;
  if (Math.hypot(x - 1195, y - 447) < 2.2) { clearTimeout(doorTimer); doorTimer = 0; stugaDoor.classList.add('open'); }
  else if (stugaDoor.classList.contains('open') && !doorTimer) doorTimer = setTimeout(() => { stugaDoor.classList.remove('open'); doorTimer = 0; }, 450);
}
// back inside: close the door behind it
new MutationObserver(() => { if (!penguinEl.classList.contains('out')) placePenguin(1195, 400); }).observe(penguinEl, { attributes: true, attributeFilter: ['class'] });

const penguinLoop = document.createElementNS('http://www.w3.org/2000/svg', 'path');
penguinLoop.setAttribute('d', 'M1195 447 C1212 447 1236 448 1238 452 C1240 457 1218 461 1195 461 C1170 461 1150 457 1152 452 C1154 448 1178 447 1195 447');
penguinLoop.setAttribute('fill', 'none');
$('#landscapeFx').appendChild(penguinLoop); // paths must be in the page to be measured
$('#stugaHit').addEventListener('click', () => {
  if (document.documentElement.dataset.cottage === 'on') earnBadge('cottage');
  cottageClicks += 1;
  if (cottageClicks % 5 === 0) penguinOuting('walk', 'ask');
});
// every third time the penguin comes out, it goes to the barbecue instead
let penguinTrips = 0;
function penguinOuting(kind, source = 'auto') {
  return goOut(`outing-${kind}`, () => outingRun(kind), { source });
}
async function outingRun(kind) {
  penguinTrips += 1;
  if (kind === 'walk' && lastSky.d > 0.75) await penguinNight(); // at night: nightcap and lantern
  else if (penguinTrips % 3 === 0) await penguinGrill();
  else await ({ slide: penguinSlide, fish: penguinFish, swim: penguinSwim, angel: penguinAngel }[kind] || penguinWalk)();
}
const hotDay = () => !live.frozen && !live.particle && lastSky.d < 0.4 && (weatherNow?.temp ?? 0) >= 25;

async function penguinGrill() {
  const root = document.documentElement, pg = $('#penguin'), flip = pg.querySelector('.pg-flip'), waddle = pg.querySelector('.pg-waddle');
  const spatula = pg.querySelector('.pg-spatula');
  waddle.removeAttribute('clip-path'); pg.querySelector('.pg-ripple').style.opacity = 0;
  spriteM = null; pg.classList.add('out', 'grill');
  const walk = (from, to, ms) => new Promise((done) => {
    let t0 = 0;
    const step = (t) => {
      if (!t0) t0 = t;
      const k = Math.min(1, (t - t0) / ms);
      placePenguin(from + (to - from) * k, 447);
      flip.setAttribute('transform', to < from ? 'scale(-1 1)' : '');
      waddle.setAttribute('transform', `rotate(${(Math.sin(t / 90) * 9).toFixed(1)})`);
      if (k < 1 && !routeAbort) requestAnimationFrame(step); else done();
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
      if (e < 7000 && !routeAbort) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  spatula.setAttribute('transform', '');
  root.classList.remove('grilling');
  await walk(1222, 1195, 2600);
  pg.classList.remove('out', 'grill');
  earnBadge('penguin'); earnBadge('bbq');
}

async function penguinWalk() {
  const pg = $('#penguin'), flip = pg.querySelector('.pg-flip'), waddle = pg.querySelector('.pg-waddle'), ripple = pg.querySelector('.pg-ripple');
  const frozen = live.frozen;
  spriteM = null; pg.classList.add('out');
  await travel(pg, penguinLoop, 11000, {
    onStep: (p, q, t) => {
      const onWater = p.y > 450.5 && !frozen, depth = 1 + (p.y - 447) * 0.014; // a little bigger when it comes towards you
      placePenguin(p.x, p.y, depth, onWater ? 2.5 : 0);
      flip.setAttribute('transform', q.x < p.x ? 'scale(-1 1)' : '');
      waddle.setAttribute('transform', onWater ? '' : `rotate(${(Math.sin(t / 90) * 9).toFixed(1)})`);
      if (onWater) waddle.setAttribute('clip-path', 'url(#pgClip)'); else waddle.removeAttribute('clip-path');
      ripple.style.opacity = onWater ? 0.6 : 0;
    },
  });
  pg.classList.remove('out');
  earnBadge('penguin');
}

// write an attribute only when it changes (every write makes the browser restyle; null removes it)
const setAttr = (el, name, v) => { if (el.getAttribute(name) !== v) { if (v === null) el.removeAttribute(name); else el.setAttribute(name, v); } };
let pgDrawn = 0;
// The penguin follows a route of steps. Poses: walk (waddle), slide (belly), jump, hop, bend, swim, paddle (kayak), wait.
async function penguinRoute(steps) {
  const pg = $('#penguin'), flip = pg.querySelector('.pg-flip'), waddle = pg.querySelector('.pg-waddle'), ripple = pg.querySelector('.pg-ripple');
  waddle.removeAttribute('clip-path'); ripple.style.opacity = 0;
  spriteM = null; pg.classList.add('out');
  let pos = [1195, 447], dir = 1;
  for (const s of steps) {
    if (routeAbort) break; // the outing was ended (an error, or it ran far too long)
    const from = pos, to = s.to || pos;
    if (to[0] !== from[0]) dir = Math.sign(to[0] - from[0]);
    await new Promise((done) => {
      let t0 = 0;
      const step = (t) => { try { frameOf(t); } catch (err) { console.warn('penguin:', err); routeAbort = true; done(); } };
      const frameOf = (t) => {
        if (routeAbort) { done(); return; }
        if (!t0) t0 = t;
        const k = Math.min(1, (t - t0) / s.ms);
        if (k < 1 && t - pgDrawn < 15) { requestAnimationFrame(step); return; } // at most 60 frames a second (phones run at 120)
        pgDrawn = t;
        const e = s.pose === 'slide' ? 1 - (1 - k) ** 2 : k; // slides slow down
        let x = from[0] + (to[0] - from[0]) * e, y = from[1] + (to[1] - from[1]) * e, pose = '';
        if (s.pose === 'walk') pose = `rotate(${(Math.sin(t / (s.fast ? 55 : 90)) * 9).toFixed(1)})`;
        if (s.pose === 'slide') pose = 'translate(0 -1.5) rotate(78)';
        if (s.pose === 'jump') { y -= Math.sin(Math.PI * k) * 9; pose = `rotate(${(20 + 70 * k).toFixed(0)})`; }
        if (s.pose === 'cannonball') { // into the water: tucked up into a ball, a high arc, and a big splash
          y -= Math.sin(Math.PI * k) * 11;
          pose = `translate(0 -5) rotate(${(-30 * k).toFixed(0)}) scale(.86 .72) translate(0 5)`;
          if (k >= 1) bigSplash(x, y);
        }
        if (s.pose === 'hop') y -= Math.sin(Math.PI * k) * 4;
        if (s.pose === 'read') pose = 'translate(0 1.3) rotate(-5)'; // sitting on the veranda chair
        if (s.pose === 'chop') pose = `rotate(${(k < 0.6 ? -6 * k / 0.6 : k < 0.72 ? -6 + 16 * (k - 0.6) / 0.12 : 10 - 10 * Math.min(1, (k - 0.72) / 0.28)).toFixed(1)})`; // lean back, then into the swing
        if (s.pose === 'bend') pose = `rotate(${(Math.sin(Math.PI * k) * 42).toFixed(0)})`; // down to pick something up, and back
        const swimming = s.pose === 'swim', paddling = s.pose === 'paddle';
        if (paddling) { pose = `translate(0 2.9) rotate(${(Math.sin(t / 420) * 3).toFixed(1)})`; /* sitting in the cockpit */ pg.querySelector('.pg-paddle').setAttribute('transform', `rotate(${(Math.sin(t / 280) * 26).toFixed(0)} 0 -6)`); }
        pg.classList.toggle('kayak', paddling);
        placePenguin(x, y, 1 + (y - 447) * 0.014, swimming ? 2.5 : 0);
        if (s.pose === 'walk') stepPrint(x, y, pg); else if (s.pose !== 'wait') lastPrint = null;
        setAttr(flip, 'transform', dir < 0 ? 'scale(-1 1)' : '');
        setAttr(waddle, 'transform', pose);
        setAttr(waddle, 'clip-path', swimming || paddling ? `url(#${paddling ? 'pgClipKayak' : 'pgClip'})` : null);
        const rip = swimming ? '0.6' : '0';
        if (ripple.style.opacity !== rip) ripple.style.opacity = rip;
        if (s.tick) s.tick(k, pg);
        if (k < 1) requestAnimationFrame(step); else done();
      };
      requestAnimationFrame(step);
    });
    pos = to;
  }
  pg.classList.remove('out', 'fishing', 'caught', 'selfie', 'snap', 'stargaze', 'inside', 'steamy', 'kayak', 'basket', 'p1', 'p2', 'p3', 'pail', 'b1', 'b2', 'b3', 'axe', 'carrylogs', 'nightcap', 'carrytrophy', 'carrycake', 'shovel', 'rake', 'watering', 'pouring', 'reading', 'pageturn');
  earnBadge('penguin');
}

// the skater steps off the ice while the penguin is out on it (they'd cross each other)
const offIce = (route) => { const sk = $('#skater'); sk.classList.add('away'); return route.finally(() => { if (!hockeyOn) sk.classList.remove('away'); }); };
// frozen lake: a belly slide across the ice
const penguinSlide = () => offIce(penguinRoute([
  { to: [1203, 458], ms: 1400, pose: 'walk' },   // out of the door, onto the ice
  { to: [1110, 463], ms: 2400, pose: 'slide' },  // belly slide (away from the jetty)
  { to: [1203, 458], ms: 6500, pose: 'walk' },   // waddle back
  { to: [1195, 447], ms: 1200, pose: 'walk' },
]));

// frozen lake: ice fishing (pimpelfiske) at a hole in the ice, until a fish bites
const penguinFish = () => offIce(penguinRoute([
  { to: [1203, 458], ms: 1400, pose: 'walk' },
  { to: [1165, 463], ms: 3000, pose: 'walk' },   // the hole is well clear of the jetty
  { ms: 9000, pose: 'wait', tick: (k, pg) => { pg.classList.add('fishing'); pg.classList.toggle('caught', k > 0.72); } },
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.remove('fishing', 'caught') },
  { to: [1203, 458], ms: 5000, pose: 'walk' },
  { to: [1195, 447], ms: 1200, pose: 'walk' },
]));

// hot summer days: across the veranda, along the lit path, down the jetty, a jump into the lake,
// a swim to the rocky beach left of the cottage, and back in through the door
const penguinSwim = () => penguinRoute([
  { to: [1199, 449], ms: 700, pose: 'walk', fast: true },   // out onto the veranda
  { to: [1216, 449.3], ms: 1100, pose: 'walk', fast: true }, // across it
  { to: [1220, 450.2], ms: 350, pose: 'hop' },               // down the step
  { to: [1297, 449.6], ms: 3600, pose: 'walk', fast: true }, // along the path to the jetty
  { to: [1302, 471], ms: 1300, pose: 'walk', fast: true },   // down the jetty
  { to: [1307, 481], ms: 750, pose: 'cannonball' },          // and in!
  { to: [1190, 466], ms: 7500, pose: 'swim' },               // swim to the rocks
  { to: [1168, 455], ms: 2200, pose: 'swim' },
  { to: [1164, 450.5], ms: 700, pose: 'hop' },               // climb out onto the rocks
  { to: [1176, 449.4], ms: 900, pose: 'walk' },              // over to the veranda
  { to: [1195, 447], ms: 1100, pose: 'walk' },               // and inside
]);

// under the northern lights: out to the end of the jetty for a selfie (two flashes), and back
const selfieFlash = (pg) => { pg.classList.remove('snap'); void pg.getBoundingClientRect(); pg.classList.add('snap'); };
const penguinSelfie = () => { let flashes = 0; return penguinRoute([
  { to: [1199, 449], ms: 800, pose: 'walk' },
  { to: [1216, 449.3], ms: 1200, pose: 'walk' },
  { to: [1220, 450.2], ms: 350, pose: 'hop' },
  { to: [1297, 449.6], ms: 4200, pose: 'walk' },
  { to: [1302, 471], ms: 1800, pose: 'walk' },
  { ms: 5200, pose: 'wait', tick: (k, pg) => { // phone up, snap, snap
    pg.classList.add('selfie');
    if ((k > 0.35 && flashes === 0) || (k > 0.72 && flashes === 1)) { flashes += 1; selfieFlash(pg); }
  } },
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.remove('selfie', 'snap') },
  { to: [1297, 449.6], ms: 1800, pose: 'walk' },
  { to: [1220, 450.2], ms: 4200, pose: 'walk' },
  { to: [1216, 449.3], ms: 350, pose: 'hop' },
  { to: [1199, 449], ms: 1200, pose: 'walk' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
]); };
// frozen lake: a snow angel on the ice, then a moment to admire it
const snowAngel = $('#snowAngel');
const penguinAngel = () => offIce(penguinRoute([
  { to: [1203, 458], ms: 1400, pose: 'walk' },
  { to: [1216, 462], ms: 1500, pose: 'walk' },
  { to: [1216, 462], ms: 2600, pose: 'slide', tick: (k) => { if (k > 0.3) snowAngel.classList.add('show'); } },
  { to: [1225, 462.5], ms: 900, pose: 'walk' },
  { ms: 1500, pose: 'wait' },
  { to: [1203, 458], ms: 2000, pose: 'walk' },
  { to: [1195, 447], ms: 1200, pose: 'walk' },
])).then(() => setTimeout(() => snowAngel.classList.remove('show'), 60000));

// clear nights: a telescope on the veranda, pointed at the space station when it's passing
let scopeAimed = 0;
function aimScope(pg) {
  const now = performance.now();
  if (now - scopeAimed < 400) return;
  scopeAimed = now;
  let angle = 55;
  if (issDot.classList.contains('show')) {
    const a = pg.getBoundingClientRect(), b = issDot.getBoundingClientRect();
    angle = Math.max(15, Math.min(165, Math.atan2(a.top - (b.top + b.height / 2), (b.left + b.width / 2) - (a.left + a.width / 2)) * 180 / Math.PI));
  }
  pg.querySelector('.pg-tube').setAttribute('transform', `rotate(${(-angle).toFixed(0)} 7.6 -5)`);
}
const penguinStargaze = () => penguinRoute([
  { to: [1199, 449], ms: 800, pose: 'walk' },
  { to: [1205, 449.2], ms: 700, pose: 'walk' },
  { ms: 22000, pose: 'wait', tick: (k, pg) => { pg.classList.add('stargaze'); aimScope(pg); } },
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.remove('stargaze') },
  { to: [1199, 449], ms: 700, pose: 'walk' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
]);

// a cannonball's splash: the spray, three times bigger, and a ring of waves on open water
function bigSplash(x, y) {
  splash.setAttribute('transform', `translate(${x.toFixed(1)} ${(y - 0.6).toFixed(1)}) scale(2.4)`);
  splash.classList.remove('go'); void splash.getBoundingClientRect(); splash.classList.add('go');
  if (!live.frozen && typeof ripples !== 'undefined') ripples.add(x, y, 1.1, 1.4);
}
// warm rain: out to the puddle on the path for some jumping
const splashAt = (x) => (k) => {
  if (k < 1) return;
  splash.setAttribute('transform', `translate(${x} 451)`);
  splash.classList.remove('go'); void splash.getBoundingClientRect(); splash.classList.add('go');
};
const penguinRainDance = () => penguinRoute([
  { to: [1199, 449], ms: 700, pose: 'walk', fast: true },
  { to: [1216, 449.3], ms: 900, pose: 'walk', fast: true },
  { to: [1220, 450.2], ms: 300, pose: 'hop' },
  { to: [1241, 450.6], ms: 1200, pose: 'walk', fast: true },
  ...Array.from({ length: 8 }, (_, i) => ({ to: [i % 2 ? 1241 : 1245, 450.6], ms: 430, pose: 'hop', tick: splashAt(i % 2 ? 1241 : 1245) })),
  { to: [1220, 450.2], ms: 1300, pose: 'walk', fast: true },
  { to: [1216, 449.3], ms: 300, pose: 'hop' },
  { to: [1199, 449], ms: 900, pose: 'walk', fast: true },
  { to: [1195, 447], ms: 500, pose: 'walk' },
]);
const rainy = () => live.particle === 'rain' || live.particle === 'drizzle';

// cold winter evenings: along the path to the sauna by the jetty, a good sweat, a plunge into the
// hole in the ice (vak), back into the heat, and home again, steaming
const sauna = $('#sauna'), saunaSmoke = $('.sauna-smoke');
let saunaSession = false;
const saunaState = () => {
  const cold = currentSeason() === 'winter' || live.frozen || ((simulated || weatherNow)?.temp ?? 10) < 3;
  const on = saunaSession || (cold && lastSky.d > 0.4);
  sauna.classList.toggle('on', on); saunaSmoke.classList.toggle('on', on);
};
skyHooks.push(saunaState);
saunaState();
const hide = (on) => (k, pg) => pg.classList.toggle('inside', on);
$('.sauna-hit').addEventListener('click', (e) => {
  e.stopPropagation(); tapRing($('.sauna-hit'));
  if (!saunaSession) { errand('sauna', penguinSauna); return; } // tap: the penguin goes for a sauna (after its current outing)
  if (!sauna.classList.contains('on')) return;
  saunaSmoke.classList.add('burst');
  setTimeout(() => saunaSmoke.classList.remove('burst'), 2400);
  earnBadge('sauna');
});
// the cold plunge between two rounds in the sauna: through the hole in the ice when the lake is
// frozen; otherwise off the end of the jetty, a swim round the moored kayak and out onto the shore
// by the sauna (or straight from the shore while a triathlon has the jetty)
const saunaPlunge = () => {
  if (live.ice >= 0.5) return [
    { to: [1345, 461.2], ms: 1100, pose: 'walk', fast: true }, // out and straight to the hole in the ice
    { to: [1345, 463.4], ms: 600, pose: 'cannonball' },
    { ms: 1300, pose: 'wait', tick: hide(true) },             // under the ice for a moment
    { ms: 1, pose: 'wait', tick: hide(false) },
    { to: [1341, 460], ms: 500, pose: 'hop' },                // brrr, out
    { to: [1335, 449.1], ms: 1100, pose: 'walk', fast: true }, // back into the heat
  ];
  if (tri) return [
    { to: [1333, 451], ms: 500, pose: 'walk', fast: true },
    { to: [1331, 457], ms: 600, pose: 'cannonball' },
    { ms: 1600, pose: 'swim' },
    { to: [1331, 450.4], ms: 600, pose: 'hop' },
    { to: [1335, 449.1], ms: 700, pose: 'walk', fast: true },
  ];
  return [
    { to: [1297, 449.6], ms: 1500, pose: 'walk', fast: true },  // along the shore to the jetty
    { to: [1302, 471], ms: 1300, pose: 'walk', fast: true },    // down the jetty
    { to: [1307, 481], ms: 750, pose: 'cannonball' }, // and in!
    { to: [1318, 487], ms: 1800, pose: 'swim' },                 // round the kayak …
    { to: [1335, 479], ms: 2200, pose: 'swim' },
    { to: [1334, 462], ms: 2600, pose: 'swim' },
    { to: [1331, 455.5], ms: 1200, pose: 'swim' },
    { to: [1331, 450.4], ms: 600, pose: 'hop' },                 // … and out by the sauna
    { to: [1335, 449.1], ms: 800, pose: 'walk', fast: true },  // back into the heat
  ];
};
const penguinSauna = () => {
  saunaSession = true; saunaState();
  return penguinRoute([
    { to: [1199, 449], ms: 700, pose: 'walk' },
    { to: [1216, 449.3], ms: 900, pose: 'walk' },
    { to: [1220, 450.2], ms: 350, pose: 'hop' },
    { to: [1297, 449.6], ms: 3800, pose: 'walk' },
    { to: [1335, 449.1], ms: 1800, pose: 'walk' },           // to the sauna door
    { ms: 400, pose: 'wait', tick: hide(true) },              // in
    { ms: 7000, pose: 'wait' },
    { ms: 400, pose: 'wait', tick: (k, pg) => { pg.classList.remove('inside'); pg.classList.add('steamy'); } },
    ...saunaPlunge(),
    { ms: 400, pose: 'wait', tick: hide(true) },
    { ms: 5000, pose: 'wait' },
    { ms: 400, pose: 'wait', tick: hide(false) },
    { to: [1297, 449.6], ms: 1800, pose: 'walk' },            // and home, steaming
    { to: [1220, 450.2], ms: 3800, pose: 'walk' },
    { to: [1216, 449.3], ms: 350, pose: 'hop' },
    { to: [1199, 449], ms: 900, pose: 'walk' },
    { to: [1195, 447], ms: 600, pose: 'walk' },
  ]).then(() => { saunaSession = false; saunaState(); });
};
// autumn days: chanterelles at the forest edge behind the path, into a basket, and home
const chanterelles = [...document.querySelectorAll('#chanterelles .cht')];
const pick = (n) => (k, pg) => { if (k >= 1) { chanterelles[n - 1].classList.add('picked'); pg.classList.remove('p1', 'p2'); pg.classList.add(`p${n}`); } };
const penguinChanterelles = () => penguinRoute([
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.add('basket') },
  { to: [1199, 449], ms: 800, pose: 'walk' },
  { to: [1216, 449.3], ms: 1200, pose: 'walk' },
  { to: [1220, 450.2], ms: 350, pose: 'hop' },
  { to: [1262, 449.8], ms: 2800, pose: 'walk' },
  { to: [1265, 447.4], ms: 900, pose: 'walk' },                  // off the path, to the edge of the forest
  { to: [1265, 447.4], ms: 1600, pose: 'bend', tick: pick(1) },  // bend down …
  { to: [1269.5, 447.8], ms: 900, pose: 'walk' },
  { to: [1269.5, 447.8], ms: 1600, pose: 'bend', tick: pick(2) },
  { to: [1274, 447.2], ms: 900, pose: 'walk' },
  { to: [1274, 447.2], ms: 1600, pose: 'bend', tick: pick(3) },
  { ms: 900, pose: 'wait' },
  { to: [1262, 449.8], ms: 1300, pose: 'walk' },
  { to: [1220, 450.2], ms: 2900, pose: 'walk' },
  { to: [1216, 449.3], ms: 350, pose: 'hop' },
  { to: [1199, 449], ms: 1200, pose: 'walk' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
]).then(() => setTimeout(() => chanterelles.forEach((c) => c.classList.remove('picked')), 10 * 60000)); // they grow back

// after the berry picking: a blueberry pie cools on the window sill. It steams for 10 minutes,
// after half an hour a slice is gone, and after an hour the rest.
const pie = $('#pie');
let pieTimers = [];
function bakePie(delay = 20000) {
  pieTimers.forEach(clearTimeout);
  pie.classList.remove('show', 'hot', 'bitten');
  pieTimers = [
    setTimeout(() => pie.classList.add('show', 'hot'), delay),
    setTimeout(() => pie.classList.remove('hot'), delay + 10 * 60000),
    setTimeout(() => pie.classList.add('bitten'), delay + 30 * 60000),
    setTimeout(() => pie.classList.remove('show', 'bitten'), delay + 60 * 60000),
  ];
}

// Firewood against the cottage wall. It goes down through the heating season (October to April),
// stays low in summer, and is restocked in September. In autumn the penguin chops some more.
const woodLogs = [...document.querySelectorAll('#woodpile .log')];
let choppedLogs = 0, woodPreview = null;
function woodLevel() {
  if (woodPreview !== null) return woodPreview;
  if (forcedSeason) return { winter: 0.55, spring: 0.3, summer: 0.2, autumn: 0.85 }[forcedSeason];
  const [y, m, d] = shownDate(12).toLocaleDateString('en-CA', { timeZone: TZ }).split('-').map(Number);
  if (m === 9) return 0.2 + 0.8 * (d - 1) / 29;                         // restocking
  if (m >= 5 && m <= 8) return 0.2;                                      // summer: only a little left
  const since = (Date.UTC(y, m - 1, d) - Date.UTC(m >= 10 ? y : y - 1, 9, 1)) / 864e5;
  return 1 - 0.8 * since / 212;                                          // 1 October to 30 April
}
function updateWoodpile() {
  const shown = Math.min(woodLogs.length, Math.round(woodLevel() * woodLogs.length) + choppedLogs);
  woodLogs.forEach((l, i) => l.classList.toggle('gone', i >= shown));
}
skyHooks.push(updateWoodpile); updateWoodpile();
const blockAxe = $('#blockAxe'), splitLog = $('#splitLog'), halves = splitLog.querySelectorAll('.half');
const chopSwing = (k, pg) => { // raise the axe, bring it down, and the log splits in two
  const a = k < 0.6 ? -125 * Math.sin(k / 0.6 * Math.PI / 2) : k < 0.72 ? -125 + 143 * (k - 0.6) / 0.12 : 18;
  pg.querySelector('.pg-axe').setAttribute('transform', `rotate(${a.toFixed(0)} 1.2 -6.8)`);
  const f = k < 0.72 ? 0 : Math.min(1, (k - 0.72) / 0.12);
  halves[0].setAttribute('transform', f ? `rotate(${(-80 * f).toFixed(0)} -.6 0)` : '');
  halves[1].setAttribute('transform', f ? `rotate(${(80 * f).toFixed(0)} .6 0)` : '');
};
const chopOne = () => [
  { ms: 500, pose: 'wait', tick: (k, pg) => { if (k >= 1) { halves.forEach((h) => h.removeAttribute('transform')); splitLog.classList.add('show'); } } },
  { ms: 1500, pose: 'chop', tick: chopSwing },
  { ms: 700, pose: 'wait', tick: (k) => { if (k >= 1) splitLog.classList.remove('show'); } },
];
const penguinChop = () => penguinRoute([
  { to: [1199, 449], ms: 800, pose: 'walk' },
  { to: [1216, 449.3], ms: 1200, pose: 'walk' },
  { to: [1220, 450.2], ms: 350, pose: 'hop' },
  { to: [1223.4, 449.7], ms: 700, pose: 'walk' },
  { to: [1223.4, 449.7], ms: 900, pose: 'bend', tick: (k, pg) => { if (k > 0.5) { blockAxe.classList.add('taken'); pg.classList.add('axe'); } } }, // pull the axe out of the block
  { to: [1218.3, 449.9], ms: 1000, pose: 'walk' },
  { to: [1218.4, 449.9], ms: 150, pose: 'walk' },                          // turn to face the block
  ...chopOne(), ...chopOne(), ...chopOne(),
  { to: [1223.4, 449.7], ms: 900, pose: 'walk', tick: (k, pg) => { if (k >= 1) { pg.querySelector('.pg-axe').removeAttribute('transform'); pg.classList.remove('axe'); blockAxe.classList.remove('taken'); } } },
  { to: [1223.4, 449.7], ms: 1200, pose: 'bend', tick: (k, pg) => { if (k > 0.5) pg.classList.add('carrylogs'); } }, // gather the split wood
  { to: [1219.6, 449.5], ms: 900, pose: 'walk' },
  { to: [1219.6, 449.5], ms: 1400, pose: 'bend', tick: (k, pg) => { if (k > 0.5 && pg.classList.contains('carrylogs')) { pg.classList.remove('carrylogs'); choppedLogs += 3; updateWoodpile(); } } }, // onto the pile
  { to: [1220, 450.2], ms: 300, pose: 'walk' },
  { to: [1216, 449.3], ms: 350, pose: 'hop' },
  { to: [1199, 449], ms: 1200, pose: 'walk' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
]);

// July and August: blueberries at the forest edge, picked into a pail (the berries grow back)
const blueberryBushes = [...document.querySelectorAll('#blueberries .bb-bush')];
let berryPreview = false;
const berryTime = () => berryPreview || (currentSeason() === 'summer' && (forcedSeason === 'summer' || [7, 8].includes(+new Intl.DateTimeFormat('en-GB', { timeZone: TZ, month: 'numeric' }).format(shownDate(12)))));
const berryState = () => { document.documentElement.dataset.berries = berryTime() ? 'yes' : 'no'; };
skyHooks.push(berryState); berryState();
const pickBerries = (n) => (k, pg) => { if (k >= 1) { blueberryBushes[n - 1].classList.add('picked'); pg.classList.remove('b1', 'b2'); pg.classList.add(`b${n}`); } };
const penguinBlueberries = () => penguinRoute([
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.add('pail') },
  { to: [1199, 449], ms: 800, pose: 'walk' },
  { to: [1216, 449.3], ms: 1200, pose: 'walk' },
  { to: [1220, 450.2], ms: 350, pose: 'hop' },
  { to: [1243, 450], ms: 1700, pose: 'walk' },
  { to: [1245.6, 447.9], ms: 800, pose: 'walk' },                  // off the path, to the bushes
  { to: [1245.6, 447.9], ms: 2000, pose: 'bend', tick: pickBerries(1) },
  { to: [1249.8, 448.2], ms: 800, pose: 'walk' },
  { to: [1249.8, 448.2], ms: 2000, pose: 'bend', tick: pickBerries(2) },
  { to: [1253.9, 447.8], ms: 800, pose: 'walk' },
  { to: [1253.9, 447.8], ms: 2000, pose: 'bend', tick: pickBerries(3) },
  { ms: 900, pose: 'wait' },
  { to: [1252, 450], ms: 900, pose: 'walk' },
  { to: [1220, 450.2], ms: 2300, pose: 'walk' },
  { to: [1216, 449.3], ms: 350, pose: 'hop' },
  { to: [1199, 449], ms: 1200, pose: 'walk' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
]).then(() => { bakePie(); setTimeout(() => blueberryBushes.forEach((b) => b.classList.remove('picked')), 10 * 60000); });

// calm summer days, once in a while: down the jetty, into the kayak, a paddle round the bay, and back
const kayakMoored = $('#kayakMoored');
const moored = (on) => (k) => { if (k >= 1) kayakMoored.classList.toggle('away', !on); };
const penguinKayak = () => penguinRoute([
  { to: [1199, 449], ms: 800, pose: 'walk' },
  { to: [1216, 449.3], ms: 1200, pose: 'walk' },
  { to: [1220, 450.2], ms: 350, pose: 'hop' },
  { to: [1297, 449.6], ms: 4200, pose: 'walk' },
  { to: [1302, 471], ms: 1800, pose: 'walk' },
  { to: [1311, 474.5], ms: 500, pose: 'hop', tick: moored(false) }, // in
  { to: [1350, 479], ms: 5000, pose: 'paddle' },
  { to: [1410, 475], ms: 6500, pose: 'paddle' },
  { to: [1425, 469], ms: 2500, pose: 'paddle' },
  { to: [1370, 466], ms: 5500, pose: 'paddle' },
  { to: [1318, 470], ms: 5000, pose: 'paddle' },
  { to: [1311, 474.5], ms: 1800, pose: 'paddle' },
  { to: [1302, 471], ms: 500, pose: 'hop', tick: (k) => { if (k > 0) kayakMoored.classList.remove('away'); } }, // out
  { to: [1297, 449.6], ms: 1800, pose: 'walk' },
  { to: [1220, 450.2], ms: 4200, pose: 'walk' },
  { to: [1216, 449.3], ms: 350, pose: 'hop' },
  { to: [1199, 449], ms: 1200, pose: 'walk' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
]);
const calm = () => ((simulated || weatherNow)?.wind ?? 0) < 15;


const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()); // 2026-11-16
const outDoor = [ // out of the door, along the veranda and down the step
  { to: [1199, 449], ms: 800, pose: 'walk' },
  { to: [1216, 449.3], ms: 1200, pose: 'walk' },
  { to: [1220, 450.2], ms: 350, pose: 'hop' },
];
const homeAgain = [
  { to: [1216, 449.3], ms: 350, pose: 'hop' },
  { to: [1199, 449], ms: 1200, pose: 'walk' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
];

// After real snowfall (at least 1 cm in the last 24 hours), the path is snowed over until the penguin
// shovels it clear, from the step down to the jetty.
const pathSnow = $('#pathSnow');
let pathSnowPreview = false;
const pathLen = pathSnow.getTotalLength();
const snowyPath = () => pathSnowPreview || (((simulated || weatherNow)?.snow24 ?? 0) >= 1 && store.get('shoveled') !== today()
  && (currentSeason() === 'winter' || live.particle === 'snow' || ((simulated || weatherNow)?.temp ?? 5) <= 2));
const cleared = (x) => { pathSnow.style.strokeDasharray = `0 ${(Math.min(1, Math.max(0, (x - 1216) / 81)) * pathLen).toFixed(1)} ${pathLen.toFixed(1)}`; };
const shovelTo = (x0, x1) => (k) => cleared(x0 + (x1 - x0) * k);
skyHooks.push(() => { setData('pathsnow', snowyPath() ? 'yes' : 'no'); });
const penguinShovel = () => penguinRoute([
  { ms: 1, pose: 'wait', tick: (k, pg) => { pg.classList.add('shovel'); cleared(1216); } },
  ...outDoor,
  { to: [1240, 450.3], ms: 3200, pose: 'walk', tick: shovelTo(1216, 1240) },
  { to: [1266, 450.3], ms: 3400, pose: 'walk', tick: shovelTo(1240, 1266) },
  { to: [1297, 449.6], ms: 3800, pose: 'walk', tick: shovelTo(1266, 1297) },
  { ms: 1200, pose: 'wait' },
  { to: [1220, 450.2], ms: 4200, pose: 'walk' },
  ...homeAgain,
]).then(() => { store.set('shoveled', today()); pathSnowPreview = false; setData('pathsnow', 'no'); pathSnow.style.strokeDasharray = ''; [...document.querySelectorAll('.prints ellipse')].forEach((e) => { if (onPath(+e.getAttribute('cx'), +e.getAttribute('cy'))) e.remove(); }); });

/* ---------------- footprints in the snow ---------------- */
// In winter the ground is snow, and the penguin leaves a trail of footprints wherever it walks on
// it (not on the veranda, the ice, or a path that has been shovelled). They slowly fade: within a
// few minutes while it's snowing, in about 40 minutes otherwise. After a fresh snowfall, the
// tracks of a hare or a fox cross the path from the forest to the lake (a different one each day).
const SVGNS = 'http://www.w3.org/2000/svg';
const printsG = document.createElementNS(SVGNS, 'g'), tracksG = document.createElementNS(SVGNS, 'g');
printsG.setAttribute('class', 'prints'); tracksG.setAttribute('class', 'prints animal-tracks');
pathSnow.after(tracksG, printsG);
const snowGround = () => currentSeason() === 'winter';
const onPath = (x, y) => x >= 1216 && x <= 1297 && y >= 448.9;
const snowAt = (x, y) => snowGround() && y <= 451.6 && !(x > 1171 && x < 1217.5 && y < 449.8) && (!onPath(x, y) || snowyPath());
let lastPrint = null, printFoot = 0, trackPreview = false;
const dot = (g, x, y, rx, ry) => { const e = document.createElementNS(SVGNS, 'ellipse'); e.setAttribute('cx', x.toFixed(2)); e.setAttribute('cy', y.toFixed(2)); e.setAttribute('rx', rx); e.setAttribute('ry', ry); g.appendChild(e); return e; };
function stepPrint(x, y, pg) {
  if (pg.classList.contains('shovel') || !snowAt(x, y)) { lastPrint = null; return; }
  if (!lastPrint) { lastPrint = [x, y]; return; }
  if (Math.hypot(x - lastPrint[0], y - lastPrint[1]) < 1.1) return;
  lastPrint = [x, y];
  printFoot ^= 1; // left, right, left …
  const e = dot(printsG, x + (printFoot ? 0.3 : -0.3), y + (printFoot ? -0.2 : 0.2), 0.42, 0.16);
  e.dataset.t = Date.now();
  if (printsG.childElementCount > 240) printsG.firstChild.remove();
}
// fade the footprints (a slow timer, and only while there are any)
setInterval(() => {
  if (!printsG.firstChild) return;
  const life = (live.particle === 'snow' ? 4 : 40) * 60000, now = Date.now();
  [...printsG.children].forEach((e) => {
    const left = 1 - (now - e.dataset.t) / life;
    if (left <= 0 || !snowAt(+e.getAttribute('cx'), +e.getAttribute('cy'))) e.remove(); else e.style.opacity = (0.45 * left).toFixed(2);
  });
}, 15000);
function drawTracks() {
  tracksG.replaceChildren();
  if (!snowGround()) printsG.replaceChildren(); // the snow is gone, and the footprints with it
  if (!snowGround() || !(trackPreview || ((simulated || weatherNow)?.snow24 ?? 0) >= 1)) return;
  const day = Math.floor(Date.now() / 864e5), hare = day % 2 === 0;
  const x0 = 1244 + (day * 37) % 36, [dx, dy] = [8, 5.4], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  const at = (s) => [x0 + ux * s, 446 + uy * s];
  const put = (x, y, rx, ry) => { if (snowAt(x, y)) dot(tracksG, x, y, rx, ry); };
  if (hare) { // hind feet land side by side in front of the front feet, which land one after the other
    for (let s = 0.5; s < len; s += 2.2) {
      const [hx, hy] = at(s + 0.9), [f1x, f1y] = at(s), [f2x, f2y] = at(s - 0.5);
      put(hx - 0.25, hy - 0.22, 0.46, 0.14); put(hx + 0.25, hy + 0.22, 0.46, 0.14);
      put(f1x, f1y, 0.22, 0.12); put(f2x, f2y, 0.22, 0.12);
    }
  } else { // a fox walks in a neat straight line, hind paws stepping into the front paws' prints
    for (let s = 0.3; s < len; s += 0.95) { const [x, y] = at(s); put(x, y, 0.28, 0.13); }
  }
}
skyHooks.push(drawTracks); drawTracks();
// a short walk: off the path to the forest edge and down to the shore (in winter, through the snow)
const penguinStroll = () => penguinRoute([
  ...outDoor,
  { to: [1246, 450.3], ms: 2600, pose: 'walk' },
  { to: [1252, 447.4], ms: 1500, pose: 'walk' },
  { to: [1268, 446.9], ms: 3200, pose: 'walk' },
  { ms: 1500, pose: 'wait' },
  { to: [1276, 450.9], ms: 1800, pose: 'walk' },
  { ms: 1200, pose: 'wait' },
  { to: [1220, 450.2], ms: 5200, pose: 'walk' },
  ...homeAgain,
]);

/* ---------------- tap the landscape ---------------- */
// Tapping a thing sends the penguin to do the job that goes with it (if it isn't busy already):
// the sauna, the woodpile or chopping block, the blueberries, the chanterelles, the autumn leaves,
// the window boxes, the moored kayak, the grill, a snowy path. The beaver lodge sends the beaver
// out, the pie loses a slice, and a visiting penguin hops. Five different jobs: badge "Errand runner".
// If the penguin is out already (or the jetty is taken by a triathlon), the job waits and starts as
// soon as it can, for up to 90 seconds. On phones the drawing is squeezed sideways, so the things
// are only a few pixels wide: a tap that misses one by a little (up to 24 px) still counts.
function errand(name, route, can = () => true) { // a tap: the job waits its turn (see goOut)
  return goOut(route.name || name, () => {
    const done = new Set(JSON.parse(store.get('errands') || '[]')); done.add(name);
    store.set('errands', JSON.stringify([...done]));
    if (done.size >= 5) earnBadge('errands');
    return route();
  }, { source: 'ask', can });
}
const TAPS = [];
// a tap always shows that it arrived: a small ring spreads from the thing you tapped
function tapRing(el) {
  const x = landXOf(el), r = el.getBoundingClientRect();
  if (x == null) return;
  const y = screenToLand($('#landscape'), 0, r.top + r.height / 2).y;
  const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  c.setAttribute('class', 'tap-ring'); c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', '2');
  fxSvg.appendChild(c);
  setTimeout(() => c.remove(), 700);
}
const onTap = (el, fn) => { if (!el) return; const go = () => { tapRing(el); fn(); }; TAPS.push({ el, fn: go }); el.addEventListener('click', (e) => { e.stopPropagation(); go(); }); };
const shown = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 || r.height > 0; };
onTap($('#woodHit'), () => errand('wood', penguinChop));
onTap($('#blockHit'), () => errand('wood', penguinChop));
onTap($('#blueberries .hit'), () => errand('berries', penguinBlueberries, () => shown($('#blueberries .hit'))));
onTap($('#chanterelles .hit'), () => errand('mushrooms', penguinChanterelles, () => shown($('#chanterelles .hit'))));
onTap($('#leavesHit'), () => errand('leaves', penguinRake, () => shown($('#leavesHit'))));
onTap($('#winboxHit'), () => errand('flowers', penguinWater));
onTap($('#kayakMoored .hit'), () => errand('kayak', penguinKayak, () => !tri && !live.frozen && shown($('#kayakMoored .hit'))));
onTap($('#jettyHit'), () => { // summer: a swim off the jetty; frozen lake: a belly slide
  if (live.frozen) errand('slide', penguinSlide);
  else if (currentSeason() === 'summer' || ((simulated || weatherNow)?.temp ?? 0) >= 20) errand('swim', penguinSwim, () => !tri && !live.frozen);
});
onTap($('#grillHit'), () => errand('grill', penguinGrill));
onTap($('#pathSnowHit'), () => errand('shovel', penguinShovel, snowyPath));
onTap($('#pie .hit'), () => pie.classList.add('bitten'));
onTap($('#beaverLodge .hit'), () => { if (!live.ice) { beaverSwim(true); earnBadge('beaver'); } });
TAPS.push({ el: $('.sauna-hit'), fn: () => $('.sauna-hit').dispatchEvent(new MouseEvent('click')) });
// the frozen lake: out onto the ice, taking turns between a belly slide, ice fishing and a snow angel
let iceTurn = 0;
$('#landscape').addEventListener('click', (e) => {
  if (!live.frozen || !e.target.closest('.l-lake')) return;
  e.stopPropagation();
  const [name, route] = [['slide', penguinSlide], ['icefish', penguinFish], ['angel', penguinAngel]][iceTurn++ % 3];
  errand(name, route, () => live.frozen);
});
// a tap next to a small thing: the nearest one within 24 px
$('.hero').addEventListener('click', (e) => {
  if (e.target.closest('a, button, .hero-text, .gps') || getComputedStyle(e.target).cursor === 'pointer') return;
  let best = null, bestD = 24;
  TAPS.forEach((t) => {
    const r = t.el.getBoundingClientRect();
    if (!r.width && !r.height) return; // not there right now (out of season)
    const d = Math.hypot(Math.max(r.left - e.clientX, 0, e.clientX - r.right), Math.max(r.top - e.clientY, 0, e.clientY - r.bottom));
    if (d < bestD) { bestD = d; best = t; }
  });
  if (best) best.fn();
});

/* ---------------- phones: the camera follows the penguin ---------------- */
// When the penguin heads out, the phone view glides along so that it stays in sight (kayak round,
// sauna, swim, …). Swipe yourself and it lets you look wherever you like until the next outing.
let wasOut = false;
new MutationObserver(() => {
  const out = penguinEl.classList.contains('out');
  if (out && !wasOut) camFollow(() => (penguinEl.classList.contains('out') ? pgX : null), { ms: 600000, margin: 0.28 });
  wasOut = out;
}).observe(penguinEl, { attributes: true, attributeFilter: ['class'] });

/* ---------------- night stroll ---------------- */
// Tap the cottage at night (the same taps that bring the penguin out by day): out it comes in a
// nightcap with a lantern, a slow stroll to the shore, a look at the sky, and back to bed.
const penguinNight = () => penguinRoute([
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.add('nightcap') },
  ...outDoor,
  { to: [1250, 450.4], ms: 4200, pose: 'walk' },
  { to: [1262, 451.2], ms: 1600, pose: 'walk' },
  { ms: 3500, pose: 'wait' },
  { to: [1262.2, 451.2], ms: 200, pose: 'walk' },
  { to: [1220, 450.2], ms: 5000, pose: 'walk' },
  ...homeAgain,
]);

/* ---------------- every badge found: a trophy ---------------- */
// The moment a visitor has found every badge, the penguin carries a small trophy out onto the
// veranda. It stays there for that visitor.
const trophy = $('#trophy');
const penguinTrophy = () => penguinRoute([
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.add('carrytrophy') },
  { to: [1190, 447.8], ms: 800, pose: 'walk' },
  { to: [1181.5, 448.4], ms: 1400, pose: 'walk' },
  { to: [1181.5, 448.4], ms: 1500, pose: 'bend', tick: (k, pg) => { if (k > 0.5) { pg.classList.remove('carrytrophy'); trophy.classList.add('show'); } } },
  { ms: 900, pose: 'hop' },
  { to: [1195, 447], ms: 1300, pose: 'walk' },
]);
let trophyPreview = false;
const trophyState = () => trophy.classList.toggle('show', trophyPreview || store.get('trophy') === '1');
trophyState();
const earnBadgeBefore = earnBadge;
earnBadge = function (id) {
  earnBadgeBefore(id);
  if (earned.length >= BADGES.length && store.get('trophy') !== '1') { store.set('trophy', '1'); errand('trophy', penguinTrophy); }
};

/* ---------------- World Penguin Day (25 April) ---------------- */
// The colony from the 404 page comes to visit for the day: eight penguins stand about on the grass,
// the path and the jetty, one hops now and then, and the cottage penguin comes out to greet them.
let penguinDayPreview = false;
const penguinDay = () => penguinDayPreview || params.has('penguinday') || new Intl.DateTimeFormat('en-GB', { timeZone: TZ, month: 'numeric', day: 'numeric' }).format(new Date()) === '25/04';
const visitorsG = $('#visitors');
[[1244.5, 449.4, 1], [1249, 448.3, -1], [1253.2, 450.1, 1], [1261.5, 448.4, -1], [1266, 450.2, 1], [1279.5, 448.7, 1], [1284.6, 450.3, -1], [1302.6, 454, -1]].forEach(([x, y, dir]) => {
  const s = 0.86 * (1 + (y - 447) * 0.014);
  visitorsG.insertAdjacentHTML('beforeend', `<g transform="translate(${x} ${y}) scale(${(dir * s).toFixed(3)} ${s.toFixed(3)})"><g class="pgv"><use href="#pgMini"/></g></g>`);
});
const visitorBodies = [...visitorsG.querySelectorAll('.pgv')];
visitorBodies.forEach((b) => b.addEventListener('click', () => b.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-3px)' }, { transform: 'translateY(0)' }], { duration: 420, easing: 'ease-out' })));
const penguinDayState = () => setData('penguinday', penguinDay() ? 'yes' : 'no');
skyHooks.push(penguinDayState); penguinDayState(); tickClock();
every(2, 5, () => { // a little hop, one at a time
  if (!penguinDay() || !heroVisible() || reduceMotion) return;
  visitorBodies[Math.floor(Math.random() * visitorBodies.length)].animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-2.2px)' }, { transform: 'translateY(0)' }], { duration: 380, easing: 'ease-out' });
});
const penguinGreet = () => penguinRoute([
  ...outDoor,
  { to: [1240.5, 450.3], ms: 1500, pose: 'walk' },
  { ms: 500, pose: 'hop' },
  { to: [1257.5, 450.5], ms: 2400, pose: 'walk' },
  { ms: 900, pose: 'wait' },
  { ms: 450, pose: 'hop' },
  { to: [1272.5, 449.9], ms: 2000, pose: 'walk' },
  { ms: 1400, pose: 'wait' },
  { ms: 450, pose: 'hop' },
  { to: [1220, 450.2], ms: 5200, pose: 'walk' },
  ...homeAgain,
]);
const greetBefore = specialGreeting;
specialGreeting = () => (penguinDay() ? 'Happy World Penguin Day!' : greetBefore());

// Autumn: the leaves on the grass are raked into a pile, and then, of course, jumped into.
const leafEls = [...document.querySelectorAll('#leaves .lf')], leafPile = $('#leafPile');
leafEls.forEach((el) => { // keep each leaf's tilt in the style, so it can move and stay tilted
  const r = /rotate\((-?[\d.]+)/.exec(el.getAttribute('transform'))[1];
  el.removeAttribute('transform'); el.dataset.r = r;
  el.style.transformBox = 'fill-box'; el.style.transformOrigin = 'center';
  el.style.transform = `rotate(${r}deg)`;
});
const leafTo = (el, x, y) => { el.style.transform = `translate(${(x - el.dataset.x).toFixed(1)}px, ${(y - el.dataset.y).toFixed(1)}px) rotate(${el.dataset.r}deg)`; };
let raked = 0;
const rakeUpTo = (x0, x1, fromLeft) => (k) => {
  const x = x0 + (x1 - x0) * k;
  leafEls.forEach((el) => {
    if (el.dataset.piled || (fromLeft ? +el.dataset.x > x : +el.dataset.x < x)) return;
    el.dataset.piled = '1'; raked++;
    leafTo(el, 1261 + (Math.random() - 0.5) * 5, 447.6 + (Math.random() - 0.5) * 1.2);
    leafPile.setAttribute('transform', `translate(1261 448.6) scale(${(raked / leafEls.length).toFixed(2)})`);
  });
};
const leafBurst = () => {
  const leaves = $('#leaves');
  leaves.classList.add('burst');
  leafPile.setAttribute('transform', 'translate(1261 448.6) scale(0)');
  leafEls.forEach((el) => { delete el.dataset.piled; leafTo(el, 1236 + Math.random() * 50, 446.6 + Math.random() * 2.6); });
  raked = 0;
  setTimeout(() => leaves.classList.remove('burst'), 800);
};
const penguinRake = () => penguinRoute([
  ...outDoor,
  { to: [1224, 448.4], ms: 700, pose: 'walk', tick: (k, pg) => pg.classList.add('rake') },
  { to: [1253, 448.2], ms: 5200, pose: 'walk', tick: rakeUpTo(1224, 1253, true) },   // sweeping from the left …
  { to: [1291, 448.2], ms: 2600, pose: 'walk' },
  { to: [1268, 448.2], ms: 4200, pose: 'walk', tick: rakeUpTo(1291, 1268, false) },  // … and from the right
  { to: [1250, 448.5], ms: 1800, pose: 'walk', tick: (k, pg) => { if (k >= 1) pg.classList.remove('rake'); } },
  { ms: 900, pose: 'wait' },
  { to: [1261, 448], ms: 650, pose: 'jump', tick: (k) => { if (k >= 1) leafBurst(); } },   // wheee
  { ms: 1300, pose: 'wait' },
  { to: [1220, 450.2], ms: 3000, pose: 'walk' },
  ...homeAgain,
]);

// Spring and summer: after three or more dry, hot days (from the real weather), the flowers in the
// window boxes droop; the penguin comes out with a watering can and they perk up again.
const boxFlowers = [...document.querySelectorAll('#winboxes .wb-flowers')];
let thirstyPreview = false;
const thirsty = () => thirstyPreview || (['spring', 'summer'].includes(currentSeason()) && ((simulated || weatherNow)?.dryHot ?? 0) >= 3 && store.get('watered') !== today());
skyHooks.push(() => { if (!penguinOut) boxFlowers.forEach((g) => g.classList.toggle('thirsty', thirsty())); });
const pour = (box) => (k, pg) => { pg.classList.toggle('pouring', k < 1); if (k > 0.5) boxFlowers[box].classList.remove('thirsty'); };
const penguinWater = () => penguinRoute([
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.add('watering') },
  { to: [1191.5, 447], ms: 900, pose: 'walk' },          // under the left window, facing the box
  { ms: 3500, pose: 'wait', tick: pour(0) },
  { to: [1198, 447], ms: 1300, pose: 'walk' },           // and the right one
  { ms: 3500, pose: 'wait', tick: pour(1) },
  { ms: 800, pose: 'wait' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
]).then(() => { store.set('watered', today()); thirstyPreview = false; });

// Warm summer evenings: a chair on the veranda, a book, and the lamp by the door.
const porchLamp = $('.porch-lamp');
let pageTimer = 0;
const penguinRead = () => penguinRoute([
  { to: [1206, 447.4], ms: 1600, pose: 'walk' },
  { ms: 45000, pose: 'read', tick: (k, pg) => {
    pg.classList.add('reading'); porchLamp.classList.add('on');
    if (!pageTimer) pageTimer = setTimeout(() => { pg.classList.remove('pageturn'); void pg.getBoundingClientRect(); pg.classList.add('pageturn'); pageTimer = 0; }, 7000 + Math.random() * 5000);
  } },
  { ms: 1, pose: 'wait', tick: (k, pg) => { pg.classList.remove('reading'); porchLamp.classList.remove('on'); clearTimeout(pageTimer); pageTimer = 0; } },
  { to: [1195, 447], ms: 1500, pose: 'walk' },
]);
const summerEvening = () => {
  const { h, sunT } = lastSky, w = simulated || weatherNow;
  return currentSeason() === 'summer' && sunT && h > sunT.set - 2.5 && h < sunT.set + 1 && (w?.temp ?? 0) >= 18 && !live.particle;
};

// 16 November (my birthday): the penguin carries a cake out onto the veranda and leaves it there for
// the day. Click it to blow out the candles.
const cake = $('#cake');
const birthdayToday = () => params.has('birthday') || new Intl.DateTimeFormat('en-GB', { timeZone: TZ, month: 'numeric', day: 'numeric' }).format(new Date()) === '16/11';
const penguinCake = () => penguinRoute([
  { ms: 1, pose: 'wait', tick: (k, pg) => pg.classList.add('carrycake') },
  { to: [1199, 449], ms: 900, pose: 'walk' },
  { to: [1206.5, 449.2], ms: 1300, pose: 'walk' },
  { to: [1206.5, 449.2], ms: 1500, pose: 'bend', tick: (k, pg) => { if (k > 0.5) { pg.classList.remove('carrycake'); cake.classList.add('show'); } } },
  { ms: 1200, pose: 'wait' },
  { to: [1199, 449], ms: 1100, pose: 'walk' },
  { to: [1195, 447], ms: 700, pose: 'walk' },
]);
cake.querySelector('.hit').addEventListener('click', () => { cake.classList.add('out'); earnBadge('cake'); });
function birthdayCheck() {
  if (!birthdayToday()) { cake.classList.remove('show', 'out'); return; }
  if (cake.classList.contains('show')) return;
  goOut('penguinCake', penguinCake, { source: 'ask' }); // waits its turn if the penguin is out
}
setTimeout(birthdayCheck, 4000);
setInterval(birthdayCheck, 10 * 60000); // also when the page stays open past midnight

/* ---------------- the penguin's outings: one at a time, by clear rules ---------------- */
// Everything that sends the penguin out goes through goOut(name, run, { source, can }):
//  1. Only one outing at a time.
//  2. Outings the page starts by itself (source 'auto') are skipped while the penguin is out or
//     while something you asked for is waiting.
//  3. Outings you ask for (a tap, backstage: source 'ask') wait their turn. If the penguin is out,
//     your newest request waits (a newer one replaces it) and starts a moment after the penguin is
//     home, for up to 2 minutes. Asking for the outing that's running or already waiting does nothing.
//     If it can't happen yet (can() is false, e.g. the triathlon has the jetty), it waits as well.
//  4. Every outing ends cleanly, even after an error: props away, penguin inside, door shut, kayak
//     and axe back in place. An outing that runs longer than 3 minutes is ended.
let penguinJob = null, waitingJob = null, routeAbort = false, waitTimer = 0;
function goOut(name, run, { source = 'auto', can = () => true } = {}) {
  if (reduceMotion) return Promise.resolve();
  if (source === 'auto') {
    if (penguinOut || waitingJob || !heroVisible() || !can()) return Promise.resolve();
    return runOuting(name, run);
  }
  if (penguinJob === name || waitingJob?.name === name) return Promise.resolve();
  if (penguinOut || !can()) {
    waitingJob = { name, run, can, until: Date.now() + 120000 };
    if (!penguinOut) scheduleNext(1000);
    return Promise.resolve();
  }
  return runOuting(name, run);
}
async function runOuting(name, run) {
  penguinOut = true; penguinJob = name; routeAbort = false;
  const watchdog = setTimeout(() => { routeAbort = true; }, 180000);
  try { await run(); } catch (err) { console.warn('penguin outing', name, err); }
  finally {
    clearTimeout(watchdog);
    penguinCleanUp();
    routeAbort = false; penguinOut = false; penguinJob = null;
    scheduleNext(900); // a short pause at home before the next job
  }
}
function scheduleNext(ms) { clearTimeout(waitTimer); waitTimer = setTimeout(nextJob, ms); }
function nextJob() {
  const job = waitingJob;
  if (penguinOut || !job) return;
  if (Date.now() > job.until) { waitingJob = null; return; }
  if (!job.can()) { scheduleNext(1000); return; }
  waitingJob = null;
  runOuting(job.name, job.run);
}
// back to normal after any outing: nothing left in its flippers, nothing left half-done
const PG_TEMP = ['out', 'axe', 'basket', 'carrycake', 'carrylogs', 'carrytrophy', 'caught', 'fishing', 'grill', 'inside', 'kayak', 'nightcap',
  'pageturn', 'pail', 'pouring', 'rake', 'reading', 'rolling', 'selfie', 'shovel', 'snap', 'stargaze', 'steamy', 'watering', 'p1', 'p2', 'p3', 'b1', 'b2', 'b3'];
function penguinCleanUp() {
  const pg = penguinEl;
  pg.classList.remove(...PG_TEMP);
  pg.querySelector('.pg-waddle').removeAttribute('transform'); pg.querySelector('.pg-waddle').removeAttribute('clip-path');
  pg.querySelector('.pg-flip').removeAttribute('transform'); pg.querySelector('.pg-ripple').style.opacity = 0;
  pg.querySelectorAll('.pg-axe, .pg-paddle, .pg-spatula').forEach((el) => el.removeAttribute('transform'));
  document.documentElement.classList.remove('grilling');
  kayakMoored.classList.remove('away'); blockAxe.classList.remove('taken'); splitLog.classList.remove('show'); porchLamp.classList.remove('on');
  if (saunaSession) { saunaSession = false; saunaState(); }
  placePenguin(1195, 400); // inside
}
// the older names, kept for the rest of the code: force = you asked for it
const penguinSolo = (route, force = false) => goOut(route.name || 'outing', route, { source: force ? 'ask' : 'auto' });

const auroraVisible = () => document.documentElement.classList.contains('aurora-storm') || (lastSky.d > 0.8 && live.overcast < 0.5 && !live.particle);
const selfieOuting = (force = false) => goOut('penguinSelfie', penguinSelfie, { source: force ? 'ask' : 'auto', can: () => !tri && (force || auroraVisible()) });

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
const snowyRoad = () => currentSeason() === 'winter' || live.particle === 'snow' || live.frozen;
let tracksFade = 0;
function alongRoad(el, { reverse = false, back = !reverse, speed = 70, onStep, tracks = false } = {}) {
  const len = road.getTotalLength();
  let pos = 0, last = 0, leg = 0, reached = 0, drawnAt = 0;
  const tr = tracks && !reverse && snowyRoad() ? $('#tracks') : null; // tyre or ski tracks, drawn as the figure goes
  if (tr) { clearTimeout(tracksFade); tr.style.strokeDasharray = `${len} ${len}`; tr.style.strokeDashoffset = len; tr.classList.add('on'); }
  return new Promise((done) => {
    const step = (t) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
      pos += dt * (typeof speed === 'function' ? speed() : speed);
      if (pos >= len && back && leg === 0) { leg = 1; pos -= len; } // turn around at the end of the road
      const towardsLake = reverse ? leg === 1 : leg === 0;
      const d = Math.min(len, pos), at = towardsLake ? d : len - d;
      if (tr && at > reached) { reached = at; tr.style.strokeDashoffset = len - reached; }
      const p = pointAt(road, at), q = pointAt(road, Math.min(len, at + 2));
      if (t - drawnAt >= 15 || pos >= len) { // at most 60 frames a second (phones run at 120)
        drawnAt = t;
        const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
        el.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.toFixed(1)})${towardsLake ? '' : ' scale(-1 1)'}`);
        if (onStep) onStep(t, p);
      }
      if (pos < len) requestAnimationFrame(step);
      else { if (tr) { tr.classList.remove('on'); tracksFade = setTimeout(() => { tr.style.strokeDasharray = ''; }, 21000); } done(); }
    };
    requestAnimationFrame(step);
  });
}

async function ride({ reverse = false, force = false } = {}) {
  if (!force && (riding || roadBusy || !heroVisible() || reduceMotion)) return;
  riding = true;
  cyclist.dataset.gear = cyclistGear(); // dress for the real weather where I am
  cyclist.classList.remove('tuck');
  cyclist.classList.add('out');
  let at = null, prevX = null, waitingSince = 0;
  const blocked = () => { // a cow standing on the road just ahead?
    const cow = typeof herd !== 'undefined' && herd.find((c) => c.road === 'on' || (c.road && c.y > roadAt(c.x) - 4)); // on it, or stepping on or off
    if (!cow || !at || prevX === null) return false;
    const ahead = (at.x - prevX >= 0 ? 1 : -1) * (cow.x - at.x);
    return ahead > 5 && ahead < 24;
  };
  await alongRoad(cyclist, {
    reverse,
    speed: () => {
      if (blocked()) { // stop, ring the bell, and after a moment the cow ambles off
        if (!waitingSince) { waitingSince = performance.now(); cyclist.classList.add('ring'); }
        if (performance.now() - waitingSince > 1600) herd.forEach((c) => { if (c.road === 'on') c.leave = true; });
        return 0;
      }
      if (waitingSince) { waitingSince = 0; cyclist.classList.remove('ring'); }
      return 70 * (cyclist.classList.contains('tuck') ? 1.5 : 1);
    },
    onStep: (t, p) => { prevX = at ? at.x : p.x; at = p; },
    tracks: true,
  });
  cyclist.classList.remove('out', 'tuck', 'ring');
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
  if (tri || riding || roadBusy || penguinOut || cowOnTheRoad() || (!force && (!triWeather() || !heroVisible())) || reduceMotion) return; // penguinOut: it may be on the jetty
  tri = true; roadBusy = true;
  // the start: arms up at the end of the jetty, then a dive into the lake
  await dive();
  swimmer.classList.add('out');
  await travel(swimmer, $('#swimLane'), 11000, { onStep: (p, q, t) => {
    swimmer.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`); // drawn facing left, the way it swims
    swimmer.classList.toggle('alt', Math.sin(t / 260) > 0);
  } });
  swimmer.classList.remove('out');
  // up the ladder of the small jetty and along it to the road (transition)
  runner.classList.add('out');
  await animate(1500, (k) => runner.setAttribute('transform', `translate(958.3 ${(468.8 - 8.4 * k).toFixed(1)})`));
  await animate(2000, (k, t) => { runner.setAttribute('transform', `translate(${(958 - 27 * k).toFixed(1)} ${(460.4 + 0.5 * k).toFixed(1)}) scale(-1 1)`); runPose(runner, t); });
  await animate(900, (k, t) => { runner.setAttribute('transform', `translate(${(931 - 5 * k).toFixed(1)} ${(460.9 + 10 * k).toFixed(1)}) scale(-1 1)`); runPose(runner, t); });
  runner.classList.remove('out');
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
  if (roadBusy || riding || tri || cowOnTheRoad() || (!force && (lastSky.d > 0.5 || !heroVisible())) || reduceMotion) return;
  roadBusy = true;
  const snow = currentSeason() === 'winter' || live.particle === 'snow' || live.frozen;
  xc.classList.toggle('snow', snow);
  xc.classList.add('out');
  await alongRoad(xc, { speed: snow ? 48 : 60, onStep: (t) => skiPose(xc, t), tracks: true });
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

// A hot-air balloon on calm, dry mornings and evenings from spring to autumn (balloons need little
// wind). It drifts slowly the way the wind blows; a click fires the burner and it climbs.
const balloon = $('#balloon');
function flyBalloon(force = false) {
  const w = simulated || weatherNow, { h, sunT } = lastSky;
  const goodHour = sunT && ((h > sunT.rise && h < sunT.rise + 3) || (h > sunT.set - 3 && h < sunT.set - 0.3));
  const goodWeather = (w?.wind ?? 0) < 12 && live.overcast < 0.7 && !live.particle && live.fog < 0.3;
  if (balloon.classList.contains('fly') || reduceMotion || (!force && (currentSeason() === 'winter' || !goodHour || !goodWeather || !heroVisible()))) return;
  // it can only go where the wind takes it: to the right in a westerly, to the left in an easterly,
  // and the faster the wind, the quicker it crosses (in near calm, either way, slowly)
  const wx = live.windX, kmh = Math.abs(wx);
  balloon.classList.toggle('west', kmh > 1 ? wx < 0 : Math.random() < 0.5);
  balloon.style.animationDuration = `${Math.round(Math.max(90, 230 - kmh * 12))}s`;
  balloon.style.top = ((innerWidth < 760 ? 46 : 22) + Math.random() * 8).toFixed(1) + '%'; // below the text on phones
  void balloon.getBoundingClientRect();
  balloon.classList.add('fly');
}
balloon.addEventListener('animationend', (e) => { if (e.target === balloon) balloon.classList.remove('fly', 'burn'); });
balloon.querySelector('.hit').addEventListener('click', () => {
  balloon.classList.add('burn');
  setTimeout(() => balloon.classList.remove('burn'), 2500);
  earnBadge('balloon');
});

// the skier comes down the Alps in winter, in daylight
const skier = $('#skier');
async function ski() {
  if (currentSeason() !== 'winter' || lastSky.d > 0.55 || !heroVisible() || reduceMotion) return;
  skier.classList.add('out');
  // up the chairlift first
  await animate(9000, (k) => { const [x, y] = liftAt(LIFT.up, k); skier.setAttribute('transform', `translate(${x.toFixed(1)} ${(y + 3.4).toFixed(1)})`); });
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
  b.classList.toggle('cranes', season === 'spring'); // cranes fly north in spring, geese south in autumn
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
      const wasVisible = issDot.classList.contains('show');
      issDot.classList.toggle('show', visible);
      if (visible && !wasVisible) setTimeout(() => penguinSolo(penguinStargaze), 1500); // quick, the telescope!
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
    const status = elevation > 10 ? (sunlit && lastSky.d > 0.75 ? `<span class="ok">Visible from ${base().city} right now. Look up.</span>` : `Above ${base().city}, but not visible (it needs to be dark here and sunlit up there).`)
      : `Below the horizon for ${base().city}.`;
    return `International Space Station
  now ${region}, ${sat.latitude.toFixed(1)}°, ${sat.longitude.toFixed(1)}°
  ${Math.round(sat.altitude)} km up, ${Math.round(sat.velocity).toLocaleString('en')} km/h
  ${Math.round(dist).toLocaleString('en')} km from ${base().city}
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

// the world outline, fetched once for both maps
let worldTopo = null;
const loadWorld = () => (worldTopo ||= fetch(WORLD_URL).then((r) => r.json()));
// an equirectangular view that fits all points (at least roughly the size of Europe), 2.4:1
function mapView(points) {
  const lat0 = points.reduce((s, p) => s + p.lat, 0) / points.length, k = Math.cos(lat0 * Math.PI / 180);
  const project = ([lon, lat]) => [lon * k, -lat];
  const xs = points.map((p) => project([p.lon, p.lat])[0]), ys = points.map((p) => project([p.lon, p.lat])[1]);
  let [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let w = Math.max((x1 - x0) * 1.5, 40 * k), h = Math.max((y1 - y0) * 1.5, 18);
  if (w / h < 2.4) w = h * 2.4; else h = w / 2.4;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return { project, x0: cx - w / 2, y0: cy - h / 2, w, h };
}
const landPath = (topo, project) => landRings(topo).map((r) => {
  let d = '', prev = null;
  r.forEach((pt) => { const [x, y] = project(pt); d += (prev == null || Math.abs(pt[0] - prev) > 180 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2); prev = pt[0]; });
  return d + 'Z';
}).join('');
// Labels: each tries four spots (right, left, above, below) and takes the first one that fits
// inside the map and hits neither another label nor any pin.
function labelPlacer({ x0, y0, w, h }, pins, fs) {
  const blocked = pins.map(({ x, y, size }) => ({ x0: x - size * 2.2, x1: x + size * 2.2, y0: y - size * 2.2, y1: y + size * 2.2 }));
  const hits = (b) => blocked.some((q) => b.x0 < q.x1 && b.x1 > q.x0 && b.y0 < q.y1 && b.y1 > q.y0);
  const inside = (b) => b.x0 >= x0 && b.x1 <= x0 + w && b.y0 >= y0 && b.y1 <= y0 + h;
  return (label, x, y, size) => {
    const lw = label.length * fs * 0.56, hh = fs * 0.62;
    // right, left, above, below; if all are taken (two pins very close), the same a bit further out
    const spots = [1, 1.8, 2.8].flatMap((far) => {
      const gap = size * 2.4 * far;
      return [
        { x: x + gap, y: y + fs * 0.35, anchor: 'start', box: { x0: x + gap, x1: x + gap + lw, y0: y - hh, y1: y + hh } },
        { x: x - gap, y: y + fs * 0.35, anchor: 'end', box: { x0: x - gap - lw, x1: x - gap, y0: y - hh, y1: y + hh } },
        { x, y: y - gap - fs * 0.25, anchor: 'middle', box: { x0: x - lw / 2, x1: x + lw / 2, y0: y - gap - hh * 2, y1: y - gap } },
        { x, y: y + gap + fs * 0.95, anchor: 'middle', box: { x0: x - lw / 2, x1: x + lw / 2, y0: y + gap, y1: y + gap + hh * 2 } },
      ];
    });
    const spot = spots.find((sp) => inside(sp.box) && !hits(sp.box)) || spots.find((sp) => inside(sp.box)) || spots[0];
    blocked.push(spot.box);
    return `<text x="${spot.x.toFixed(2)}" y="${spot.y.toFixed(2)}" font-size="${fs.toFixed(2)}" text-anchor="${spot.anchor}">${esc(label)}</text>`;
  };
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

    const { project, x0, y0, w, h } = mapView(list.map((p) => p.pos));
    const land = landPath(await loadWorld(), project);
    const r = w * 0.009, fs = w * 0.022;
    const pinsXY = list.map((p) => ({ p, xy: project([p.pos.lon, p.pos.lat]), size: r * (1 + 0.35 * (p.events.length - 1)) }));
    const place = labelPlacer({ x0, y0, w, h }, pinsXY.map(({ xy: [x, y], size }) => ({ x, y, size })), fs);
    const pinsSvg = pinsXY.sort((a, b) => b.p.events.length - a.p.events.length || a.xy[0] - b.xy[0]).map(({ p, xy: [x, y], size }) => {
      const title = p.events.flatMap((e) => rolesOf(e).map((r) => `${e.year} · ${r.type}: ${r.title}`)).join('\n');
      const label = p.name ? `${p.name}${p.events.length > 1 ? ` ×${p.events.length}` : ''}` : '';
      return `<g class="map-pin" data-t="${idsOf(p)}" tabindex="0" role="button" aria-label="${esc(`${p.name}: ${p.events.length} ${p.events.length > 1 ? 'entries' : 'entry'}, highlight in the list`)}"><title>${esc(p.name ? `${p.name}\n` : '')}${esc(title)}</title>
        <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(size * 2.2).toFixed(2)}" class="halo"/><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size.toFixed(2)}"/>
        ${label ? place(label, x, y, size) : ''}</g>`;
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

/* ---------------- co-author map (Publications) ---------------- */
// My pin in Stockholm, and a pin for every place where at least one co-author was when we wrote a
// paper together, joined to mine by a faint arc. The data (coauthors.json) is made from the papers
// in cv.tex and OpenAlex by cv/coauthors.py, on every push and once a week. Tap a pin: the caption
// names the institutions and people there, and the papers we share light up in the list.
async function renderCoauthorMap() {
  try {
    const data = await (await fetch('coauthors.json', { cache: 'no-cache' })).json();
    const places = data.places.filter((p) => p.home || p.people.length);
    const home = places.find((p) => p.home);
    if (!home || places.length < 2) return;
    const { project, x0, y0, w, h } = mapView(places);
    const land = landPath(await loadWorld(), project);
    const r = w * 0.009, fs = w * 0.022;
    const pins = places.map((p) => {
      const [x, y] = project([p.lon, p.lat]);
      return { p, x, y, size: p.home ? r * 0.95 : r * (0.5 + 0.17 * Math.sqrt(p.people.length)) };
    });
    const [hx, hy] = [pins.find((q) => q.p.home).x, pins.find((q) => q.p.home).y];
    // arcs from my pin to every other one, all bending the same way
    const arcs = pins.filter((q) => !q.p.home).map(({ p, x, y }) => {
      const mx = (hx + x) / 2, my = (hy + y) / 2, dx = x - hx, dy = y - hy;
      return `<path class="co-line" data-i="${data.places.indexOf(p)}" pathLength="1" d="M${hx.toFixed(2)} ${hy.toFixed(2)} Q${(mx - dy * 0.2).toFixed(2)} ${(my + dx * 0.2).toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}"/>`;
    }).join('');
    const place = labelPlacer({ x0, y0, w, h }, pins, fs);
    const people = (p) => p.people.map((q) => q.name);
    // labels are placed biggest first; the pins are then drawn biggest first too, so a small pin
    // right next to a big one (Uppsala by Stockholm) sits on top and stays visible
    const pinsSvg = pins.sort((a, b) => (b.p.home ? 1 : 0) - (a.p.home ? 1 : 0) || b.p.people.length - a.p.people.length).map(({ p, x, y, size }, i) => {
      const n = p.people.length;
      const title = `${p.name}${p.home ? ' (my base)' : ''}\n${p.institutions.join(', ')}\n${n} co-author${n > 1 ? 's' : ''}: ${people(p).join(', ')}`;
      return `<g class="co-pin${p.home ? ' home' : ''}" data-i="${data.places.indexOf(p)}" tabindex="0" role="button" aria-label="${esc(`${p.name}: ${n} co-author${n > 1 ? 's' : ''}`)}"><title>${esc(title)}</title>
        <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(size * 1.9).toFixed(2)}" class="halo"/><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size.toFixed(2)}" class="dot"/>
        ${place(p.name, x, y, size)}</g>`;
    }).join('');
    const svg = $('#coMapSvg'), cap = $('#coCap');
    svg.setAttribute('viewBox', `${x0.toFixed(2)} ${y0.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
    svg.innerHTML = `<path class="land" d="${land}"/>${arcs}${pinsSvg}`;
    const everyone = new Set(places.flatMap(people)), institutions = new Set(places.flatMap((p) => p.institutions));
    const countries = new Set(places.map((p) => p.country).filter(Boolean));
    const summary = `${everyone.size} co-authors · ${institutions.size} institutions · ${countries.size} ${countries.size > 1 ? 'countries' : 'country'}`;
    cap.textContent = summary;
    $('#coMap').hidden = false;
    let chosen = null;
    const choose = (i) => {
      stopPlay();
      chosen = chosen === i ? null : i;
      const p = data.places[chosen];
      svg.querySelectorAll('.co-pin').forEach((pin) => pin.classList.toggle('active', +pin.dataset.i === chosen));
      const shared = new Set(p ? p.people.flatMap((q) => q.papers) : []);
      document.querySelectorAll('#pubList li[data-p]').forEach((li) => li.classList.toggle('co-active', shared.has(+li.dataset.p)));
      if (!p) { cap.textContent = summary; return; }
      const names = p.people.map((q) => `${esc(q.name)}${q.papers.length > 1 ? ` <span class="co-n">×${q.papers.length}</span>` : ''}`).join(', ');
      cap.innerHTML = `<b>${esc(p.name)}</b>${p.home ? ' · my base' : ''} · ${esc(p.institutions.join(', '))}<br>${names} · ${shared.size} paper${shared.size > 1 ? 's' : ''} together, highlighted below`;
    };
    // ▶ the network over time: my pin first, then year by year each place's arc is drawn and its
    // pin appears, in the year of the first paper with someone there. Only when asked for; it
    // changes nothing outside the map, and a tap anywhere on the map stops it.
    const yearOf = (papers) => Math.min(...papers.map((i) => +SITE.publications[i]?.year || Infinity));
    const firstYear = new Map(data.places.map((p, i) => [i, Math.min(...p.people.map((q) => yearOf(q.papers)))]));
    const personYear = new Map();
    places.forEach((p) => p.people.forEach((q) => personYear.set(q.name, Math.min(personYear.get(q.name) ?? Infinity, yearOf(q.papers)))));
    const years = [...new Set([...personYear.values()].filter(Number.isFinite))].sort();
    const play = $('#coPlay'), playLabel = play.textContent;
    let timers = [];
    function stopPlay() {
      if (!timers.length) return;
      timers.forEach(clearTimeout); timers = [];
      svg.querySelectorAll('.hid').forEach((el) => el.classList.remove('hid'));
      play.textContent = playLabel; play.classList.remove('on'); cap.textContent = summary;
    }
    function startPlay() {
      if (chosen !== null) choose(chosen); // clear a selection first
      svg.classList.add('instant');
      svg.querySelectorAll('.co-line, .co-pin:not(.home)').forEach((el) => el.classList.add('hid'));
      svg.getBoundingClientRect(); // apply the hidden state before the transitions start
      svg.classList.remove('instant');
      play.classList.add('on');
      const papersBy = (y) => new Set(SITE.publications.map((p, i) => (+p.year <= y && places.some((pl) => pl.people.some((q) => q.papers.includes(i))) ? i : -1)).filter((i) => i >= 0)).size;
      years.forEach((y, k) => timers.push(setTimeout(() => {
        svg.querySelectorAll('.hid').forEach((el) => { if (firstYear.get(+el.dataset.i) <= y) el.classList.remove('hid'); });
        const people = [...personYear.values()].filter((v) => v <= y).length;
        play.textContent = `■ ${y}`;
        cap.textContent = `${y} · ${people} co-author${people > 1 ? 's' : ''} · ${papersBy(y)} paper${papersBy(y) > 1 ? 's' : ''}`;
      }, 400 + k * 1400)));
      timers.push(setTimeout(() => { timers = [1]; stopPlay(); }, 400 + years.length * 1400 + 1800));
    }
    play.hidden = years.length < 2;
    play.addEventListener('click', (e) => { e.stopPropagation(); if (timers.length) stopPlay(); else startPlay(); });
    svg.addEventListener('click', () => stopPlay(), true);
    svg.querySelectorAll('.co-pin').forEach((pin) => {
      pin.addEventListener('click', () => choose(+pin.dataset.i));
      pin.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(+pin.dataset.i); } });
    });
  } catch { /* offline or no data yet: no map, the list works as before */ }
}
new IntersectionObserver(([e], obs) => { if (e.isIntersecting) { obs.disconnect(); renderCoauthorMap(); } }, { rootMargin: '400px' }).observe($('#publications'));

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
  earnBadge('time');
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
// now and then a cow swishes its tail
every(3, 8, () => { if (!heroVisible() || reduceMotion) return; const c = herd[Math.floor(Math.random() * herd.length)].el; c.classList.add('swish'); setTimeout(() => c.classList.remove('swish'), 1000); });
function drawCow(c, t = 0) {
  const s = 0.95 + (c.y - 440) * 0.012; // a little bigger closer to us
  c.el.setAttribute('transform', `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) scale(${(s * c.dir).toFixed(3)} ${s.toFixed(3)})`);
  const swing = c.walking ? Math.sin(t / 160) * 14 : 0;
  c.back.setAttribute('transform', swing ? `rotate(${swing.toFixed(1)} -3.1 -2.6)` : '');
  c.front.setAttribute('transform', swing ? `rotate(${(-swing).toFixed(1)} 3 -2.6)` : '');
  const looking = performance.now() < (c.lookUntil || 0);
  c.head.setAttribute('transform', looking ? 'rotate(-14 4.2 -6.8)' : c.walking || c.busy ? '' : 'rotate(38 4.2 -6.8)'); // grazing: head down
}
herd.forEach((c) => drawCow(c));
let cowRaf = 0, cowLast = 0, cowDrawn = 0;
function cowStep(t) {
  const dt = Math.min(0.1, (t - (cowLast || t)) / 1000); cowLast = t;
  const asleep = lastSky.d > 0.82;
  herd.forEach((c) => {
    c.el.classList.toggle('sleep', asleep && !c.busy);
    if (c.busy || asleep || t < (c.lookUntil || 0)) return; // (moo: everyone stops and looks up)
    if (c.road === 'on' && (c.leave || t - c.roadSince > 30000)) { // back to the meadow
      c.tx = Math.max(350, Math.min(610, c.x + (Math.random() - 0.5) * 40));
      const [top, bottom] = cowBand(c.tx);
      c.ty = top + Math.random() * Math.max(0, bottom - top - 4);
      c.road = 'leaving'; c.leave = false; c.walking = true; c.dir = c.tx >= c.x ? 1 : -1;
    }
    if (!c.walking && t > c.until && !c.road) { // time to find fresh grass nearby
      c.tx = Math.max(350, Math.min(610, c.x + (Math.random() - 0.5) * 90));
      const [top, bottom] = cowBand(c.tx);
      c.ty = top + Math.random() * Math.max(0, bottom - top);
      c.walking = true; c.dir = c.tx >= c.x ? 1 : -1;
    }
    if (c.walking) {
      const dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy), v = 2.6 * dt;
      if (d <= v) {
        c.x = c.tx; c.y = c.ty; c.walking = false; c.until = t + 5000 + Math.random() * 9000;
        if (c.road === 'going') { c.road = 'on'; c.roadSince = t; setTimeout(() => ride(), 1500); } // here comes a cyclist…
        else if (c.road === 'leaving') c.road = null;
      }
      else { c.x += (dx / d) * v; c.y += (dy / d) * v; }
    }
  });
  if (t - cowDrawn > 50) { // 20 frames a second is plenty for cows
    cowDrawn = t;
    herd.forEach((c) => { if (!c.busy) drawCow(c, t); });
    // the cow closest to us is drawn in front
    herd.slice().sort((a, b) => a.y - b.y).forEach((c) => cowsEl.appendChild(c.el));
  }
  // every frame while someone moves; while they all just graze, a look twice a second is enough
  const moving = herd.some((c) => c.walking || c.busy);
  if (moving) cowRaf = requestAnimationFrame(cowStep);
  else cowRaf = setTimeout(() => { cowLast = 0; if (cowRaf) cowRaf = requestAnimationFrame(cowStep); }, 500);
}
const stopCows = () => { cancelAnimationFrame(cowRaf); clearTimeout(cowRaf); cowRaf = 0; };
setInterval(() => {
  const on = heroVisible() && !reduceMotion;
  if (on && !cowRaf) { cowLast = 0; cowRaf = requestAnimationFrame(cowStep); }
  if (!on && cowRaf) stopCows();
}, 1000);
const cowWeather = () => cowsEl.classList.toggle('cold', currentSeason() === 'winter' || live.frozen || ((simulated || weatherNow)?.temp ?? 10) < 3);
skyHooks.push(cowWeather);
cowWeather();

// now and then a cow wanders onto the road and stays there, until a cyclist rings the bell
const cowOnTheRoad = () => typeof herd !== 'undefined' && herd.some((c) => c.road);
function cowOnRoad(force = false) {
  if (!heroVisible() || reduceMotion || lastSky.d > 0.7 || cowOnTheRoad() || roadBusy || riding || mooseOut) return;
  if (!force && Math.random() > 0.35) return;
  const free = herd.filter((c) => !c.busy);
  const c = free[Math.floor(Math.random() * free.length)];
  if (!c) return;
  c.tx = Math.max(390, Math.min(590, c.x + (Math.random() - 0.5) * 30)); c.ty = roadAt(c.tx) + 0.8;
  c.road = 'going'; c.walking = true; c.dir = c.tx >= c.x ? 1 : -1;
}

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

// click a cow: it stops and looks at you
herd.forEach((c) => c.el.querySelector('.hit').addEventListener('click', () => {
  c.lookUntil = performance.now() + 3500; c.walking = false; c.until = c.lookUntil + 2000;
  drawCow(c); setTimeout(() => drawCow(c), 3600);
  earnBadge('moo');
}));

// the terminal's "moo": every cow stops, lifts its head and looks at you for a few seconds
COMMANDS.moo = () => {
  const until = performance.now() + 4500;
  herd.forEach((c) => { c.lookUntil = until + Math.random() * 600; c.walking = false; c.until = until + 1500 + Math.random() * 7000; drawCow(c); setTimeout(() => drawCow(c), 5200); });
  closeGps(); scrollTo({ top: 0, behavior: 'smooth' });
  earnBadge('moo');
  return 'Moo.';
};
HIDDEN.push('moo');

/* ---------------- the chairlift (winter) ---------------- */
// Chairs go up one cable and down the other; the skier rides up before skiing down.
const LIFT = { up: [[500, 228], [440, 134]], down: [[442.4, 133.4], [502.4, 227.4]] };
const liftAt = ([[x0, y0], [x1, y1]], k) => [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
const liftChairs = [];
Object.values(LIFT).forEach((line) => {
  for (let i = 0; i < 6; i++) {
    $('#liftChairs').insertAdjacentHTML('beforeend', '<path class="lift-chair" d="M0 0 V3.2 M-1.3 3.2 H1.3 M1.3 3.2 V1.9"/>');
    liftChairs.push({ el: $('#liftChairs').lastElementChild, line, k: i / 6 });
  }
});
let liftRaf = 0, liftLast = 0, liftDrawn = 0;
function liftStep(t) {
  const dt = Math.min(0.1, (t - (liftLast || t)) / 1000); liftLast = t;
  liftChairs.forEach((c) => { c.k = (c.k + dt / 24) % 1; });
  if (t - liftDrawn > 60) {
    liftDrawn = t;
    liftChairs.forEach((c) => { const [x, y] = liftAt(c.line, c.k); c.el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); });
  }
  liftRaf = requestAnimationFrame(liftStep);
}
liftDrawn = -1e9; liftStep(0); cancelAnimationFrame(liftRaf); liftRaf = 0; liftLast = 0;
setInterval(() => {
  const on = currentSeason() === 'winter' && heroVisible() && !reduceMotion;
  if (on && !liftRaf) { liftLast = 0; liftRaf = requestAnimationFrame(liftStep); }
  if (!on && liftRaf) { cancelAnimationFrame(liftRaf); liftRaf = 0; }
}, 1000);

/* ---------------- the owl ---------------- */
// At night two eyes blink in the Swedish forest. Tap them and the owl flies off (back in 2 minutes).
const owl = $('#owl');
// the owl blinks every few seconds (only when it's out)
every(4, 8, () => { if (getComputedStyle(owl).display === 'none' || !heroVisible()) return; owl.classList.add('blink'); setTimeout(() => owl.classList.remove('blink'), 160); });
owl.querySelector('.hit').addEventListener('click', async () => {
  if (owl.classList.contains('flying') || owl.classList.contains('gone') || reduceMotion) return;
  owl.classList.add('flying');
  earnBadge('owl');
  const bird = owl.querySelector('.owl-bird'), wings = owl.querySelectorAll('.owl-wing');
  await animate(2400, (k, t) => {
    bird.setAttribute('transform', `translate(${(-130 * k).toFixed(1)} ${(-50 * k - Math.sin(k * Math.PI) * 12).toFixed(1)}) scale(${(1 - 0.3 * k).toFixed(2)})`);
    const flap = Math.sin(t / 70) > 0 ? 1 : -0.5;
    wings.forEach((w) => w.setAttribute('transform', `translate(0 1.5) scale(1 ${flap}) translate(0 -1.5)`));
  });
  owl.classList.remove('flying'); owl.classList.add('gone');
  bird.removeAttribute('transform');
  setTimeout(() => owl.classList.remove('gone'), 120000);
});

/* ---------------- night fishing ---------------- */
// On mild nights (not in winter, not in rain or fog) a rowing boat with a lantern drifts on the lake.
const rowboat = $('#rowboat');
// the boat drifts slowly and rocks on the water: a few updates a second are plenty for movements this slow
const rbDrift = rowboat.querySelector('.rb-drift'), rbRock = rowboat.querySelector('.rb-rock');
setInterval(() => {
  if (!rowboat.classList.contains('show') || !heroVisible() || reduceMotion) return;
  const t = performance.now() / 1000, u = (1 - Math.cos((t / 110) * Math.PI)) / 2; // 0 → 1 → 0 over 220 s, eased like before
  const x = u < 0.5 ? -40 + 60 * (u * 2) : 20 + 70 * ((u - 0.5) * 2), y = u < 0.5 ? 1.5 * u * 2 : 1.5 - 2.5 * ((u - 0.5) * 2);
  rbDrift.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(2)})`);
  rbRock.style.transform = `rotate(${(Math.sin((t / 5) * Math.PI) * 1.6).toFixed(2)}deg)`;
}, 200);
const boatState = () => rowboat.classList.toggle('show', params.has('boat') ||
  (lastSky.d > 0.7 && currentSeason() !== 'winter' && !live.frozen && !live.particle && !live.fog));
skyHooks.push(boatState);
rowboat.querySelector('.hit').addEventListener('click', () => {
  if (rowboat.classList.contains('catch')) return;
  rowboat.classList.add('catch');
  setTimeout(() => rowboat.classList.remove('catch'), 3000);
  earnBadge('catch');
});
// gravel colour: sandy in daylight, dark at night
skyHooks.push(({ d }) => setVar('--gravel-sky', mix('#C9C2B2', '#34302A', Math.min(1, d * 1.1))));
if (lastSky.sunT) setVar('--gravel-sky', mix('#C9C2B2', '#34302A', Math.min(1, lastSky.d * 1.1)));
const puddle = $('.puddle');
const puddleState = () => { puddle.classList.toggle('wet', rainy() && !live.frozen); setData('wet', rainy() && !live.frozen ? 'yes' : 'no'); };
skyHooks.push(puddleState);
puddleState();
boatState();

/* ---------------- ice hockey on the frozen lake ---------------- */
// Now and then on a frozen day, two players (red and blue) play on the lake, each trying to get
// the puck into the other's net, and the penguin comes out to referee.
const hockey = $('#hockey'), hockeyPlayers = [...hockey.querySelectorAll('.player')], puckEl = hockey.querySelector('.puck');
let hockeyOn = false;
hockeyPlayers.forEach((pl) => pl.querySelector('.hit').addEventListener('click', () => earnBadge('hockey')));
function iceHockey(force = false) {
  if (hockeyOn || reduceMotion) return;
  if (!force && (!live.frozen || lastSky.d > 0.5)) return;
  return goOut('hockey', hockeyGame, { source: force ? 'ask' : 'auto' });
}
async function hockeyGame() {
  hockeyOn = true;
  try {
  $('#skater').classList.add('away');
  hockey.classList.add('on');
  const R = { x0: 1008, x1: 1264, y0: 464, y1: 482 }, mouth = [465.5, 474];
  const P = [{ x: 1085, y: 471, aim: 1264, speed: 24 }, { x: 1188, y: 474, aim: 1008, speed: 22 }].map((p) => ({ ...p, cool: 0, dir: Math.sign(p.aim - 1136), hop: 0 }));
  const puck = { x: 1136, y: 472, vx: 0, vy: 0 };
  // the referee skates (well, waddles) out to the far side of the rink
  const referee = penguinRoute([
    { to: [1203, 458], ms: 1400, pose: 'walk' }, { to: [1138, 463], ms: 3500, pose: 'walk' },
    { ms: 34000, pose: 'wait' },
    { to: [1203, 458], ms: 3500, pose: 'walk' }, { to: [1195, 447], ms: 1200, pose: 'walk' },
  ]);
  await new Promise((done) => {
    let t0 = 0, last = 0;
    const step = (t) => {
      if (!t0) t0 = last = t;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      // the puck slides and slows down, and bounces off the edges of the rink
      puck.x += puck.vx * dt; puck.y += puck.vy * dt;
      const f = Math.exp(-0.8 * dt); puck.vx *= f; puck.vy *= f;
      if (puck.y < R.y0 || puck.y > R.y1) { puck.vy *= -1; puck.y = Math.max(R.y0, Math.min(R.y1, puck.y)); }
      if (puck.x < R.x0 || puck.x > R.x1) {
        const inNet = puck.y > mouth[0] && puck.y < mouth[1];
        if (inNet) { // goal! the scorer jumps, the puck goes back to the middle
          const scorer = P.find((p) => Math.abs(p.aim - puck.x) < 30);
          if (scorer) scorer.hop = t;
          Object.assign(puck, { x: 1136, y: 472, vx: 0, vy: 0 });
          P.forEach((p) => { p.cool = 1.2; });
        } else { puck.vx *= -1; puck.x = Math.max(R.x0, Math.min(R.x1, puck.x)); }
      }
      // each player gets behind the puck and shoots it towards the other net
      P.forEach((p) => {
        p.cool -= dt;
        const tx = puck.x - Math.sign(p.aim - 1136) * 3, ty = puck.y + Math.sin(t / 700 + p.speed) * 1.5;
        const dx = tx - p.x, dy = (ty - p.y) * 2.5, d = Math.hypot(dx, dy) || 1, v = Math.min(d, p.speed * dt);
        p.x += (dx / d) * v; p.y += (dy / d) * v / 2.5;
        if (Math.abs(dx) > 0.5) p.dir = Math.sign(dx);
        if (p.cool <= 0 && Math.hypot(puck.x - p.x - 4 * p.dir, (puck.y - p.y) * 2) < 4) {
          const gx = p.aim, gy = 468 + Math.random() * 8, gd = Math.hypot(gx - puck.x, (gy - puck.y) * 2);
          puck.vx = (gx - puck.x) / gd * 90; puck.vy = (gy - puck.y) / gd * 45;
          p.cool = 0.8;
        }
      });
      P.forEach((p, i) => {
        const jump = p.hop && t - p.hop < 500 ? Math.sin((t - p.hop) / 500 * Math.PI) * 3 : 0;
        hockeyPlayers[i].setAttribute('transform', `translate(${p.x.toFixed(1)} ${(p.y - jump).toFixed(1)}) scale(${p.dir} 1)`);
      });
      puckEl.setAttribute('transform', `translate(${puck.x.toFixed(1)} ${puck.y.toFixed(1)})`);
      if (t - t0 < 38000 && !routeAbort) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  await referee;
  } finally {
    hockey.classList.remove('on');
    $('#skater').classList.remove('away');
    hockeyOn = false;
  }
}

/* ---------------- the penguin under the footer ---------------- */
// When you reach the very bottom of the page, a penguin pops up behind the footer and waves.
const peek = $('#footerPeek');
let peekNext = 0;
new IntersectionObserver(([e]) => {
  if (!e.isIntersecting || reduceMotion || performance.now() < peekNext) return;
  peekNext = performance.now() + 30000;
  setTimeout(peekOut, 600);
}, { threshold: 0.98 }).observe($('.footer'));
function peekOut() { peek.classList.add('peek'); setTimeout(() => peek.classList.remove('peek'), 3400); }
peek.addEventListener('click', () => { earnBadge('peek'); peek.classList.remove('peek'); });

/* ---------------- the moose (älg) ---------------- */
// Now and then a moose steps out of the Swedish forest, stops in the middle of the road to look
// around, and walks on. A warning sign appears while it's there. Clicking it makes it hurry.
const moose = $('#moose'), mooseLegs = moose.querySelector('.ms-legs'), mooseFlip = moose.querySelector('.ms-flip');
let mooseOut = false, mooseHurry = false;
function mooseCrossing(force = false) {
  if (mooseOut || roadBusy || riding || tri || cowOnTheRoad() || reduceMotion || !heroVisible()) return;
  if (!force && (lastSky.d > 0.85 || Math.random() > 0.35)) return;
  mooseOut = true; roadBusy = true; mooseHurry = false;
  const down = Math.random() < 0.5; // out of the forest towards the meadow, or the other way
  const A = [772, 451], B = [818, 507], [from, to] = down ? [A, B] : [B, A];
  const dir = to[0] > from[0] ? 1 : -1, len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  let onRoadAt = 0.5, best = Infinity; // how far along its path the moose stands on the road
  for (let k = 0; k <= 1; k += 0.01) {
    const x = from[0] + (to[0] - from[0]) * k, y = from[1] + (to[1] - from[1]) * k, miss = Math.abs(y - roadAt(x));
    if (miss < best) { best = miss; onRoadAt = k; }
  }
  $('#algSign').classList.add('show');
  moose.classList.add('out');
  let pos = 0, last = 0, walked = 0, drawn = 0, paused = 0;
  const hips = [[-6.5, -9.8], [-4.8, -9.8], [5, -10.4], [6.6, -10.4]];
  return new Promise((done) => {
    const step = (t) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
      // stop for a moment in the middle of the road
      const onRoad = pos > len * (onRoadAt - 0.03) && pos < len * (onRoadAt + 0.02);
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
// On cold winter days (2 °C or colder) the penguin builds a snowman on the shore by the sauna: it rolls
// the base, the middle and the head (they grow as they roll), lifts them on, then adds the face, and the
// hat, scarf and arms. It stands for the rest of the day. Above 2 °C it starts to melt; above 8 °C it's gone.
const snowman = $('#snowman'), snowParts = [...snowman.querySelectorAll('[data-stage]')];
let snowPreview = null, snowBuilt = store.get('snowman') === today() ? 5 : 0; // how far today's snowman has got
function snowmanStage() {
  const temp = (simulated || weatherNow)?.temp ?? 0;
  let stage = snowBuilt, melting = temp > 2;
  if (snowPreview) ({ stage, melting } = snowPreview);
  const show = snowPreview || (currentSeason() === 'winter' && temp <= 8 && stage > 0);
  snowman.classList.toggle('show', !!show);
  snowman.classList.toggle('melting', !!melting);
  snowParts.forEach((el) => { el.style.display = +el.dataset.stage <= stage ? '' : 'none'; });
}
skyHooks.push(snowmanStage);
snowmanStage();
const snowWeather = () => currentSeason() === 'winter' && ((simulated || weatherNow)?.temp ?? 5) <= 2 && !live.particle || live.particle === 'snow';
const built = (n) => (k, pg) => { if (k >= 1) { snowBuilt = n; pg.classList.remove('rolling'); snowmanStage(); } };
const rollBall = (r0, r1) => (k, pg) => { // the snowball grows as it rolls, just in front of the penguin
  const r = r0 + (r1 - r0) * k, ball = pg.querySelector('.pg-snowball');
  pg.classList.add('rolling');
  ball.setAttribute('r', r.toFixed(2)); ball.setAttribute('cx', (3.4 + r).toFixed(2)); ball.setAttribute('cy', (-r).toFixed(2));
};
const penguinSnowman = () => penguinRoute([
  ...outDoor,
  { to: [1297, 449.6], ms: 4200, pose: 'walk' },
  { to: [1328, 449.4], ms: 1700, pose: 'walk' },
  { to: [1354.2, 448.6], ms: 5200, pose: 'walk', tick: rollBall(0.8, 4.4) },       // the base …
  { ms: 1, pose: 'wait', tick: built(1) },
  { to: [1333, 449.3], ms: 1500, pose: 'walk' },
  { to: [1352, 448.7], ms: 4000, pose: 'walk', tick: rollBall(0.7, 3.3) },           // … the middle …
  { to: [1356.6, 448.5], ms: 600, pose: 'hop', tick: (k, pg) => { rollBall(3.3, 3.3)(1, pg); built(2)(k, pg); } },
  { to: [1339, 449.1], ms: 1300, pose: 'walk' },
  { to: [1353.5, 448.6], ms: 2800, pose: 'walk', tick: rollBall(0.6, 2.4) },         // … and the head
  { to: [1357.4, 448.4], ms: 700, pose: 'hop', tick: (k, pg) => { rollBall(2.4, 2.4)(1, pg); built(3)(k, pg); } },
  { ms: 500, pose: 'wait' },
  { to: [1357.4, 448.4], ms: 700, pose: 'hop', tick: built(4) },                      // eyes, carrot, buttons
  { ms: 500, pose: 'wait' },
  { to: [1357.4, 448.4], ms: 700, pose: 'hop', tick: built(5) },                      // hat, scarf and arms
  { to: [1346, 449], ms: 1200, pose: 'walk' },
  { ms: 1800, pose: 'wait' },                                                         // admiring it
  { to: [1297, 449.6], ms: 2600, pose: 'walk' },
  { to: [1220, 450.2], ms: 4200, pose: 'walk' },
  ...homeAgain,
]).then(() => { if (snowBuilt === 5) store.set('snowman', today()); });
every(60, 150, () => { if (!snowBuilt && snowWeather() && lastSky.d < 0.4 && Math.random() < 0.6) penguinSolo(penguinSnowman); });
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
every(200, 480, () => flyBalloon());
every(100, 240, () => { if (currentSeason() === 'autumn' && lastSky.d < 0.45 && !live.particle && Math.random() < 0.4) penguinSolo(penguinChanterelles); });
every(100, 240, () => { if (berryTime() && lastSky.d < 0.45 && !live.particle && Math.random() < 0.4) penguinSolo(penguinBlueberries); });
every(120, 300, () => { if (currentSeason() === 'autumn' && lastSky.d < 0.45 && !live.particle && Math.random() < 0.35) penguinSolo(penguinChop); });
every(45, 120, () => { if (penguinDay() && lastSky.d < 0.5 && !live.particle && Math.random() < 0.6) penguinSolo(penguinGreet); });
every(150, 320, () => { if (snowGround() && lastSky.d < 0.45 && live.particle !== 'rain' && Math.random() < 0.3) penguinSolo(penguinStroll); });
every(60, 150, () => { if (snowyPath() && lastSky.d < 0.45 && localHour() < 15) penguinSolo(penguinShovel); });
every(120, 300, () => { if (currentSeason() === 'autumn' && lastSky.d < 0.45 && !live.particle && Math.random() < 0.35) penguinSolo(penguinRake); });
every(90, 200, () => { if (thirsty() && lastSky.d < 0.45 && !live.particle && Math.random() < 0.5) penguinSolo(penguinWater); });
every(120, 260, () => { if (summerEvening() && Math.random() < 0.4) penguinSolo(penguinRead); });
every(150, 320, () => { if (currentSeason() === 'summer' && lastSky.d < 0.4 && !live.particle && !live.frozen && calm() && !tri && Math.random() < 0.25) penguinSolo(penguinKayak); });
setTimeout(ski, 4000);
every(20, 50, ski);
setTimeout(birds, 8000);
every(45, 110, birds);
every(90, 240, () => mooseCrossing());
every(240, 600, () => ufoVisit());
every(80, 200, () => cowOnRoad());
every(90, 220, () => { if (live.frozen && lastSky.d > 0.45 && Math.random() < 0.5) penguinSolo(penguinSauna); });
every(120, 300, () => { if (lastSky.d > 0.8 && live.overcast < 0.5 && !live.particle && Math.random() < 0.45) penguinSolo(penguinStargaze); });
every(60, 150, () => { if (rainy() && !live.frozen && lastSky.d < 0.6 && ((simulated || weatherNow)?.temp ?? 10) >= 10 && Math.random() < 0.5) penguinSolo(penguinRainDance); });
every(100, 260, () => { if (Math.random() < 0.5 && !live.frozen) selfieOuting(); });
every(120, 300, () => iceHockey());
setTimeout(checkIss, 3000);
every(45, 100, () => { if (live.frozen && !penguinOut && heroVisible() && !reduceMotion) penguinOuting(['slide', 'fish', 'angel'][Math.floor(Math.random() * 3)]); });
every(60, 130, () => { if (hotDay() && !penguinOut && !tri && heroVisible() && !reduceMotion) penguinOuting('swim'); }); // not while the triathlete uses the jetty

// preview helpers for FEATURES.md: ?ride, ?penguin, ?smlm
if (params.has('ride')) setTimeout(() => ride({ force: true }), 800);
if (params.has('triathlon')) setTimeout(() => triathlon(true), 800);
if (params.has('xc')) setTimeout(() => xcSki(true), 800);
if (params.has('plane')) setTimeout(() => flyPlane(true), 800);
if (params.has('bbq')) setTimeout(() => penguinSolo(penguinGrill, true), 800);
if (params.has('penguin')) setTimeout(() => penguinSolo(live.frozen ? penguinSlide : penguinWalk, true), 800);
if (params.has('fishing')) setTimeout(() => penguinSolo(penguinFish, true), 800);
if (params.has('swim')) setTimeout(() => penguinSolo(penguinSwim, true), 800);
if (params.has('smlm')) setTimeout(() => (lastSky.d >= 0.75 ? smlmShow() : toast('The microscope only works at night.')), 900);
if (params.has('timelapse')) setTimeout(() => timelapse(params.get('timelapse') === 'year' ? 'year' : ''), 900);
// a pretend ISS pass from west-south-west to east over 40 seconds (preview and backstage)
function issDemo() {
  clearTimeout(issTimer);
  issDot.classList.add('show', 'demo');
  let k = 0; placeIss(240, 12);
  const demo = setInterval(() => { k += 1; placeIss(240 - k * 12, 12 + Math.sin((k / 12) * Math.PI) * 45); if (k >= 12) { clearInterval(demo); setTimeout(() => { issDot.classList.remove('show', 'demo'); checkIss(); }, 4000); } }, 3300);
}
if (params.has('iss')) issDemo();
if (params.has('birds')) setTimeout(() => birds(true), 800);
if (params.has('moose')) setTimeout(() => mooseCrossing(true), 800);
if (params.has('ufo')) setTimeout(() => ufoVisit(true), 1500);
if (params.has('cowroad')) setTimeout(() => cowOnRoad(true), 1500);
if (params.has('stargaze')) setTimeout(() => penguinSolo(penguinStargaze, true), 1200);
if (params.has('raindance')) setTimeout(() => penguinSolo(penguinRainDance, true), 1200);
if (params.has('angel')) setTimeout(() => penguinSolo(penguinAngel, true), 1200);
if (params.has('sauna')) setTimeout(() => penguinSolo(penguinSauna, true), 1200);
if (params.has('kayak')) setTimeout(() => penguinSolo(penguinKayak, true), 1200);
if (params.has('blueberries')) { berryPreview = true; paintSky(); setTimeout(() => penguinSolo(penguinBlueberries, true), 1200); }
if (params.has('chop')) setTimeout(() => penguinSolo(penguinChop, true), 1200);
if (params.has('pie')) bakePie(800);
if (params.has('penguinday')) setTimeout(() => penguinSolo(penguinGreet, true), 1500);
if (params.has('tracks')) { trackPreview = true; drawTracks(); }
if (params.has('chanterelles')) setTimeout(() => penguinSolo(penguinChanterelles, true), 1200);
if (params.has('balloon')) setTimeout(() => flyBalloon(true), 1000);
if (params.has('shovel')) { pathSnowPreview = true; setData('pathsnow', 'yes'); setTimeout(() => penguinSolo(penguinShovel, true), 1500); }
if (params.has('rake')) setTimeout(() => penguinSolo(penguinRake, true), 1200);
if (params.has('water')) { thirstyPreview = true; boxFlowers.forEach((g) => g.classList.add('thirsty')); setTimeout(() => penguinSolo(penguinWater, true), 2500); }
if (params.has('read')) setTimeout(() => penguinSolo(penguinRead, true), 1200);
if (params.has('selfie')) setTimeout(() => selfieOuting(true), 1200);
if (params.has('hockey')) setTimeout(() => iceHockey(true), 1200);
// previews and backstage: the penguin builds one now, or a finished snowman melts
function snowmanDemo(melted = false) {
  if (!melted) { snowBuilt = 0; snowPreview = null; snowmanStage(); return penguinSolo(penguinSnowman, true); }
  snowPreview = { stage: 5, melting: false }; paintSky();
  setTimeout(() => { snowPreview = { stage: 5, melting: true }; paintSky(); }, 1500);
  setTimeout(() => { snowPreview = null; paintSky(); }, 12000);
}
if (params.has('snowman')) setTimeout(() => snowmanDemo(params.get('snowman') === 'melt'), 1200);
