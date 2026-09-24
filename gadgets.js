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
  const px = o.getImageData(0, 0, off.width, off.height).data, pts = [];
  for (let y = 0; y < off.height; y += 3) for (let x = 0; x < off.width; x += 3) if (px[(y * off.width + x) * 4 + 3] > 128) pts.push([cx - size + x, cy - size / 2 + y]);

  // localizations accumulate on a second canvas
  const acc = document.createElement('canvas'); acc.width = cv.width; acc.height = cv.height;
  const a = acc.getContext('2d'); a.setTransform(r, 0, 0, r, 0, 0); a.fillStyle = 'rgba(159, 242, 200, 0.5)';
  const gauss = () => Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(2 * Math.PI * Math.random());
  const ACQUIRE = 9000, HOLD = 3500, FADE = 2500, blinks = [];
  let t0 = 0, last = 0;
  hero.classList.add('smlm-on');

  function frame(t) {
    if (!t0) t0 = last = t;
    const el = t - t0, dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (el < ACQUIRE) for (let k = Math.round(dt * 380); k > 0; k--) blinks.push({ p: pts[Math.floor(Math.random() * pts.length)], life: 0.05 + Math.random() * 0.1 });
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = el > ACQUIRE + HOLD ? Math.max(0, 1 - (el - ACQUIRE - HOLD) / FADE) : 1;
    ctx.drawImage(acc, 0, 0, W, H);
    ctx.globalAlpha = 1;
    // blinking molecules: a soft glow and a bright core; every frame adds a localization
    const glow = new Path2D(), core = new Path2D();
    for (let i = blinks.length - 1; i >= 0; i--) {
      const b = blinks[i], [x, y] = b.p;
      glow.moveTo(x + 3.4, y); glow.arc(x, y, 3.4, 0, 6.29);
      core.moveTo(x + 1.2, y); core.arc(x, y, 1.2, 0, 6.29);
      a.fillRect(x + gauss() * 1.1, y + gauss() * 1.1, 1.1, 1.1);
      if ((b.life -= dt) <= 0) blinks.splice(i, 1);
    }
    ctx.fillStyle = 'rgba(200, 255, 225, 0.22)'; ctx.fill(glow);
    ctx.fillStyle = 'rgba(245, 255, 250, 0.95)'; ctx.fill(core);
    if (el < ACQUIRE + HOLD + FADE) requestAnimationFrame(frame);
    else { ctx.clearRect(0, 0, W, H); hero.classList.remove('smlm-on'); smlmRunning = false; }
  }
  requestAnimationFrame(frame);
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
  if (cottageClicks % 5 === 0 && !penguinOut && !reduceMotion) penguinWalk();
});
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

// the cyclist rides through the valley now and then; click to make them tuck
const cyclist = $('#cyclist'), road = $('#road');
let riding = false;
async function ride() {
  if (riding || !heroVisible() || reduceMotion) return;
  riding = true;
  cyclist.classList.remove('tuck');
  cyclist.classList.add('out');
  let speed = 1, pos = 0, last = 0;
  const len = road.getTotalLength();
  await new Promise((done) => {
    const step = (t) => {
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
      pos += dt * 70 * speed * (cyclist.classList.contains('tuck') ? 1.5 : 1);
      const p = road.getPointAtLength(Math.min(len, pos)), q = road.getPointAtLength(Math.min(len, pos + 2));
      const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      cyclist.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
      if (pos < len) requestAnimationFrame(step); else done();
    };
    requestAnimationFrame(step);
  });
  cyclist.classList.remove('out', 'tuck');
  riding = false;
}
cyclist.addEventListener('click', () => {
  if (cyclist.classList.contains('tuck')) return;
  cyclist.classList.add('tuck');
  toast('Aero tuck: about 15% less drag.');
  earnBadge('cyclist');
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

// migrating birds in spring and autumn, in daylight
function birds() {
  const season = currentSeason();
  if (!['spring', 'autumn'].includes(season) || lastSky.d > 0.6 || !heroVisible() || reduceMotion) return;
  const b = $('#birds');
  b.classList.remove('fly', 'north');
  void b.getBoundingClientRect();
  b.style.top = 8 + Math.random() * 20 + '%';
  b.classList.add('fly');
  if (season === 'spring') b.classList.add('north'); // heading north in spring, south in autumn
}
$('#birds').addEventListener('animationend', (e) => { if (e.target.id === 'birds') e.target.classList.remove('fly', 'north'); });

// the ice skater spins when clicked
$('#skater').addEventListener('click', () => {
  const s = $('#skater');
  s.classList.remove('spin'); void s.getBoundingClientRect(); s.classList.add('spin');
  earnBadge('skater');
});

/* ---------------- schedule ---------------- */
setTimeout(ride, 6000);
every(35, 90, ride);
setTimeout(ski, 4000);
every(20, 50, ski);
setTimeout(birds, 8000);
every(45, 110, birds);

// preview helpers for FEATURES.md: ?ride, ?penguin, ?smlm
if (params.has('ride')) setTimeout(ride, 800);
if (params.has('penguin')) setTimeout(penguinWalk, 800);
if (params.has('smlm')) setTimeout(() => (lastSky.d >= 0.75 ? smlmShow() : toast('The microscope only works at night.')), 900);
if (params.has('birds')) setTimeout(() => { const b = $('#birds'); b.style.top = '14%'; b.classList.add('fly'); }, 800);
