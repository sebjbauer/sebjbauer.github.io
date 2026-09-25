/* =====================================================================
   EXTRAS: small live details and hidden surprises.
   Moon phase, real weather, holidays, shooting stars, the cottage,
   the hiker, the deer and the northern-lights riddle.
   Everything here builds on script.js, which loads first.
   ===================================================================== */

const params = new URLSearchParams(location.search);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
let lastSky = { h: 12, d: 0, isDay: true };

/* ---------------- toast messages ---------------- */
let toastTimer = 0;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 4200);
}

/* ---------------- moon phase ---------------- */
function moonPhase(date = new Date()) {
  const synodic = 29.530588853, newMoon = Date.UTC(2000, 0, 6, 18, 14);
  const age = (((date - newMoon) / 864e5) % synodic + synodic) % synodic;
  const p = age / synodic;
  const names = [[0.034, 'New moon'], [0.216, 'Waxing crescent'], [0.284, 'First quarter'], [0.466, 'Waxing gibbous'],
    [0.534, 'Full moon'], [0.716, 'Waning gibbous'], [0.784, 'Last quarter'], [0.966, 'Waning crescent'], [1, 'New moon']];
  return { age, p, illum: (1 - Math.cos(2 * Math.PI * p)) / 2, name: names.find(([lim]) => p < lim)[1], daysToFull: ((0.5 - p + 1) % 1) * synodic };
}

// Draws the lit part of the moon as seen from the northern hemisphere.
function moonSvg({ p }) {
  const r = 18, rx = (r * Math.abs(Math.cos(2 * Math.PI * p))).toFixed(2);
  const waxing = p < 0.5, crescent = p < 0.25 || p > 0.75;
  const outer = waxing ? 1 : 0, term = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0);
  return `<svg viewBox="-20 -20 40 40" width="100%" height="100%"><circle r="${r}" class="moon-dark"/>` +
    `<path class="moon-lit" d="M0 ${-r} A${r} ${r} 0 0 ${outer} 0 ${r} A${rx} ${r} 0 0 ${term} 0 ${-r} Z"/></svg>`;
}

skyHooks.push(({ isDay }) => {
  const sun = $('#sun');
  const html = isDay ? '' : moonSvg(moonPhase());
  if (sun.innerHTML !== html) sun.innerHTML = html;
});

/* ---------------- tab icon: sun by day, tonight's moon at night ---------------- */
let faviconKey = '';
function drawFavicon(isDay) {
  const m = moonPhase(), key = isDay ? 'sun' : `moon-${Math.round(m.p * 60)}`;
  if (key === faviconKey) return;
  faviconKey = key;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  g.translate(32, 32);
  if (isDay) {
    g.strokeStyle = '#F2A15A'; g.lineWidth = 5; g.lineCap = 'round';
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; g.beginPath(); g.moveTo(Math.cos(a) * 21, Math.sin(a) * 21); g.lineTo(Math.cos(a) * 29, Math.sin(a) * 29); g.stroke(); }
    g.fillStyle = '#F7C948'; g.beginPath(); g.arc(0, 0, 15, 0, 7); g.fill();
  } else {
    g.scale(1.6, 1.6);
    g.fillStyle = '#2B3440'; g.beginPath(); g.arc(0, 0, 18, 0, 7); g.fill();
    const svg = moonSvg(m), d = svg.match(/ d="([^"]+)"/)[1];
    g.fillStyle = '#E9EDEF'; g.fill(new Path2D(d));
  }
  let link = document.querySelector('link[rel="icon"]');
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.type = 'image/png';
  link.href = c.toDataURL('image/png');
}
skyHooks.push(({ isDay }) => drawFavicon(isDay));

/* ---------------- real weather in Vienna ---------------- */
const WEATHER_NAMES = { 0: 'clear sky', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast', 45: 'fog', 48: 'freezing fog',
  51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle', 56: 'freezing drizzle', 57: 'freezing drizzle',
  61: 'light rain', 63: 'rain', 65: 'heavy rain', 66: 'freezing rain', 67: 'freezing rain',
  71: 'light snow', 73: 'snow', 75: 'heavy snow', 77: 'snow grains', 80: 'rain showers', 81: 'rain showers', 82: 'heavy showers',
  85: 'snow showers', 86: 'heavy snow showers', 95: 'thunderstorm', 96: 'thunderstorm with hail', 99: 'thunderstorm with hail' };
// Fake conditions for previewing: ?weather=rain or the terminal's "weather rain"
const WEATHER_PRESETS = {
  clear: { code: 0, cloud: 0, temp: 14 }, cloudy: { code: 3, cloud: 90, temp: 11 }, rain: { code: 63, cloud: 100, temp: 9 },
  drizzle: { code: 53, cloud: 95, temp: 10 }, snow: { code: 73, cloud: 100, temp: -3 }, storm: { code: 95, cloud: 100, temp: 18 },
  fog: { code: 45, cloud: 60, temp: 4 }, frost: { code: 0, cloud: 10, temp: -6 },
  rainbow: { code: 1, cloud: 35, temp: 16, recentRain: true },
};
let weatherNow = null, simulated = null, stormTimer = 0;

function applyWeather(w) {
  const c = w.code;
  live.overcast = Math.min(1, w.cloud / 100);
  live.fog = c === 45 || c === 48 ? 1 : 0;
  live.frozen = typeof w.temp === 'number' && w.temp < 0;
  // a rainbow when it rained in the last hours and the sun is out again (shown by day only, see CSS)
  const raining = (c >= 51 && c <= 67) || (c >= 80 && c <= 82) || c >= 95;
  document.documentElement.dataset.rainbow = w.recentRain && !raining && w.cloud < 75 ? 'yes' : 'no';
  live.particle = (c >= 71 && c <= 77) || c === 85 || c === 86 ? 'snow'
    : (c >= 61 && c <= 67) || (c >= 80 && c <= 82) || c >= 95 ? 'rain'
    : c >= 51 && c <= 57 ? 'drizzle' : null;
  document.documentElement.style.setProperty('--clouds-o', Math.max(0, (live.overcast - 0.15) / 0.85).toFixed(2));
  document.documentElement.dataset.heavy = live.overcast > 0.7 ? 'yes' : 'no';
  document.documentElement.dataset.cloudy = live.overcast > 0.15 ? 'yes' : 'no';
  clearTimeout(stormTimer);
  if (c >= 95) lightning();
  paintSky();
}

function lightning() {
  if (reduceMotion) return;
  stormTimer = setTimeout(() => {
    const f = $('#flash');
    f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
    lightning();
  }, 6000 + Math.random() * 12000);
}

async function fetchWeather() {
  if (simulated) return;
  const p = base();
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,weather_code,cloud_cover,wind_speed_10m&hourly=precipitation&past_hours=3&forecast_hours=1&timezone=auto`;
    const { current, hourly } = await (await fetch(url)).json();
    const pastRain = (hourly?.precipitation || []).slice(0, -1).reduce((sum, mm) => sum + (mm || 0), 0);
    weatherNow = { code: current.weather_code, cloud: current.cloud_cover, temp: current.temperature_2m, wind: current.wind_speed_10m, recentRain: pastRain >= 0.2 };
    applyWeather(weatherNow);
  } catch { /* offline: keep the clear default */ }
}

COMMANDS.weather = async (arg) => {
  if (arg && arg !== 'live') {
    if (!(arg in WEATHER_PRESETS)) return `Usage: weather | weather ${Object.keys(WEATHER_PRESETS).join(' | ')} | weather live`;
    simulated = WEATHER_PRESETS[arg]; applyWeather(simulated);
    return `Simulating ${arg}. Scroll up to see it. Type <b class="warn">weather live</b> to go back.`;
  }
  simulated = null;
  await fetchWeather();
  if (!weatherNow) return '<span class="warn">No satellite connection.</span> Try again later.';
  const w = weatherNow;
  return `Live weather in ${esc(base().city)}:
  ${Math.round(w.temp)}°C, ${WEATHER_NAMES[w.code] || 'unknown'}
  clouds ${w.cloud}%, wind ${Math.round(w.wind)} km/h
The sky on this page shows the same.`;
};

/* ---------------- holidays: Christmas, Easter Sunday, Midsommar ---------------- */
function easterSunday(y) { // anonymous Gregorian algorithm
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return [Math.floor((h + l - 7 * m + 114) / 31), ((h + l - 7 * m + 114) % 31) + 1];
}
let forcedHoliday = params.get('holiday');

function holidayToday() {
  if (forcedHoliday) return forcedHoliday === 'none' ? null : forcedHoliday;
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()).split('-').map(Number);
  if (m === 12 && d >= 24 && d <= 26) return 'christmas';
  const [em, ed] = easterSunday(y);
  if (m === em && d === ed) return 'easter';
  // Midsommarafton is the Friday between 19 and 25 June; Midsommardagen is the Saturday after
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  if (m === 6 && ((weekday === 5 && d >= 19 && d <= 25) || (weekday === 6 && d >= 20 && d <= 26))) return 'midsommar';
  return null;
}

const HOLIDAY_GREETING = { christmas: 'Merry Christmas · Frohe Weihnachten · God jul.', easter: 'Happy Easter · Frohe Ostern · Glad påsk.', midsommar: 'Happy Midsummer · Glad midsommar!' };
specialGreeting = () => HOLIDAY_GREETING[holidayToday()] || null;

// Flag by the cottage: Swedish National Day (6 June), Austrian National Day (26 October), pennant
// otherwise. National flags are only up between sunrise and sunset, as is Swedish custom.
function flagToday(isDay) {
  if (params.get('flag')) return params.get('flag'); // preview: ?flag=se, ?flag=at or ?flag=vimpel
  const [, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()).split('-').map(Number);
  const national = m === 6 && d === 6 ? 'se' : m === 10 && d === 26 ? 'at' : null;
  return national && isDay ? national : 'vimpel';
}
skyHooks.push(({ isDay }) => { const f = $('#flagpole'); const flag = flagToday(isDay); if (f.dataset.flag !== flag) f.dataset.flag = flag; });

function applyHoliday() {
  document.documentElement.dataset.holiday = holidayToday() || 'none';
  tickClock();
  paintSky(); // Christmas turns the accent red
}

COMMANDS.holiday = (arg) => {
  if (!arg || arg === 'live') { forcedHoliday = null; applyHoliday(); return holidayToday() ? `Today is ${holidayToday()}.` : 'No holiday today. Back to normal.'; }
  if (!(arg in HOLIDAY_GREETING)) return 'Usage: holiday christmas | easter | midsommar | live';
  forcedHoliday = arg; applyHoliday();
  return `${HOLIDAY_GREETING[arg]} Scroll up and look ${arg === 'easter' ? 'in the meadow' : 'next to the cottage'}.`;
};

// Christmas lights along the cottage roof, and Easter eggs plus a bunny in the meadow
function buildDecorations() {
  let lights = '';
  const colors = ['#E5484D', '#F2C94C', '#46A758', '#3E8EDE'];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, x = 1175 + t * 40, y = t <= 0.5 ? 431 - t * 28 : 417 + (t - 0.5) * 28;
    lights += `<circle cx="${x.toFixed(1)}" cy="${(y + 1.5).toFixed(1)}" r="1.3" fill="${colors[i % 4]}" style="animation-delay:${(i % 4) * 0.35}s"/>`;
  }
  $('#xmasLights').innerHTML = lights;

  const eggColors = ['#F4B6C2', '#A7D3F2', '#F6E27F', '#B9E3A8', '#D5B8F0'];
  let eggs = '';
  [[120, 470], [205, 488], [300, 462], [390, 497], [470, 475], [560, 490], [640, 470], [740, 500], [820, 478]].forEach(([x, y], i) => {
    eggs += `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="4.2" fill="${eggColors[i % eggColors.length]}"/>` +
      `<path d="M${x - 3} ${y} q3 -1.5 6 0" stroke="#FFFFFF" stroke-width=".9" fill="none" opacity=".8"/>`;
  });
  eggs += `<g class="bunny" transform="translate(520 478)"><ellipse cx="0" cy="-5" rx="7" ry="5"/><circle cx="-6" cy="-10" r="3.6"/>` +
    `<ellipse cx="-7" cy="-17" rx="1.3" ry="4.5" transform="rotate(-12 -7 -17)"/><ellipse cx="-4.5" cy="-17" rx="1.3" ry="4.5" transform="rotate(8 -4.5 -17)"/>` +
    `<circle cx="7" cy="-6" r="2" class="tail"/></g>`;
  $('#easter').innerHTML = eggs;
}

/* ---------------- shooting stars ---------------- */
let starsCaught = +(store.get('starsCaught') || 0);

function shootingStar() {
  const hero = $('.hero');
  const btn = document.createElement('button');
  btn.className = 'shooting-star';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Catch the shooting star');
  btn.style.left = 30 + Math.random() * 60 + '%';
  btn.style.top = 4 + Math.random() * 22 + '%';
  btn.addEventListener('click', () => {
    starsCaught += 1;
    store.set('starsCaught', starsCaught);
    btn.classList.add('caught');
    toast(starsCaught === 1 ? 'You caught a shooting star. Make a wish.' : `Shooting star caught. That's ${starsCaught} so far. Make a wish.`);
  });
  btn.addEventListener('animationend', (e) => { if (e.animationName === 'shoot' || e.animationName === 'caught') btn.remove(); });
  hero.appendChild(btn);
}

function scheduleShootingStars() {
  setTimeout(() => {
    const starsVisible = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stars')) > 0.5;
    if (starsVisible && !reduceMotion && scrollY < innerHeight * 0.8 && !document.hidden) shootingStar();
    scheduleShootingStars();
  }, 15000 + Math.random() * 35000);
}

/* ---------------- the cottage ---------------- */
function setupCottage() {
  const root = document.documentElement;
  // a click switches the light and the chimney smoke on or off
  $('#stugaHit').addEventListener('click', () => {
    // is the window glowing right now? (either set by a click, or by the time of day)
    const lit = root.dataset.cottage ? root.dataset.cottage === 'on' : parseFloat(root.style.getPropertyValue('--window')) > 0.5;
    root.dataset.cottage = lit ? 'off' : 'on';
  });
}
// smoke rises from the chimney when the stove is lit (evenings, and colder seasons)
skyHooks.push(({ d }) => {
  const cold = ['winter', 'autumn'].includes(currentSeason()) || live.particle === 'snow';
  setData('smoke', d > 0.5 || (cold && d > 0.2) ? 'on' : 'off');
});

/* ---------------- the hiker on the career trail ---------------- */
// Fika: from 15:00 to 15:15 Vienna time the hiker sits down with a coffee (preview: ?fika)
const fikaTime = () => params.has('fika') || (localHour() >= 15 && localHour() < 15.25);
function setupHiker() {
  const svg = $('#profile'), trail = svg.querySelector('.trail');
  const total = trail.getTotalLength();
  // length along the trail at each marker, by key ('job-1', 'edu-3', …)
  const lengthAtX = (x) => { let lo = 0, hi = total; for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (trail.getPointAtLength(mid).x < x) lo = mid; else hi = mid; } return lo; };
  const stops = {};
  svg.querySelectorAll('.wp').forEach((el) => { stops[el.dataset.k] = lengthAtX(+el.dataset.x); });
  const start = svg.querySelector('.wp.active') || svg.querySelector('.wp');

  svg.insertAdjacentHTML('beforeend', `<g class="hiker" aria-hidden="true"><g class="hk">
    <g class="hk-upper">
      <rect class="pack" x="-5.5" y="-17" width="4" height="7" rx="1.2"/>
      <circle cx="0" cy="-20" r="3"/>
      <line x1="0" y1="-17" x2="0" y2="-9"/>
      <g class="cup"><rect x="2.4" y="-14" width="2.6" height="3" rx=".6"/><path class="steam" d="M3.2 -15.5 q-1 -1.5 0 -3 M4.4 -15.5 q1 -1.5 0 -3"/><line x1="0" y1="-14" x2="2.6" y2="-12.6"/></g>
    </g>
    <g class="walk-legs"><line class="leg a" x1="0" y1="-9" x2="-2" y2="0"/><line class="leg b" x1="0" y1="-9" x2="2" y2="0"/><line class="pole" x1="1" y1="-14" x2="5" y2="0"/></g>
    <path class="sit-legs" d="M0 -5 L4 -7.5 L6 0"/>
  </g></g>`);
  const g = svg.querySelector('.hiker'), hk = g.querySelector('.hk'), legA = g.querySelector('.leg.a'), legB = g.querySelector('.leg.b');

  let pos = 0, target = stops[start.dataset.k], visible = false, raf = 0, last = 0;
  const place = (t) => {
    const pt = trail.getPointAtLength(pos);
    g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    const walking = Math.abs(target - pos) > 0.5;
    g.classList.toggle('sitting', !walking && fikaTime());
    const swing = walking ? Math.sin(t / 110) * 3 : 0;
    legA.setAttribute('x2', (-swing).toFixed(2)); legB.setAttribute('x2', swing.toFixed(2));
    hk.setAttribute('transform', target < pos ? 'scale(-1 1)' : '');
  };
  const step = (t) => {
    const dt = Math.min(50, t - (last || t)); last = t;
    const dir = Math.sign(target - pos);
    pos = dir > 0 ? Math.min(target, pos + dt * 0.09) : Math.max(target, pos - dt * 0.09);
    place(t);
    raf = pos !== target && visible ? requestAnimationFrame(step) : 0;
    if (!raf) { last = 0; place(0); }
  };
  const go = () => { if (!raf && visible && !reduceMotion) raf = requestAnimationFrame(step); if (reduceMotion) { pos = target; place(0); } };

  waypointHooks.push((k) => { target = stops[k]; go(); });
  svg.querySelectorAll('.wp').forEach((el) => el.addEventListener('mouseenter', () => { target = stops[el.dataset.k]; go(); }));
  svg.addEventListener('mouseleave', () => { const a = svg.querySelector('.wp.active'); if (a) { target = stops[a.dataset.k]; go(); } });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; go(); }, { threshold: 0.4 }).observe(svg);
  place(0);
  setInterval(() => { if (!raf) place(0); }, 30000); // sit down for fika at 15:00, get up at 15:15
}

/* ---------------- the deer (dusk and dawn only) ---------------- */
function setupDeer() {
  const deer = $('#deer');
  skyHooks.push(({ d }) => {
    const twilight = d > 0.15 && d < 0.92;
    deer.classList.toggle('show', twilight && !deer.classList.contains('fled'));
  });
  deer.addEventListener('click', () => {
    deer.classList.add('flee');
    toast('The deer slipped back into the forest.');
    setTimeout(() => { deer.classList.remove('show'); deer.classList.add('fled'); }, 1200);
    setTimeout(() => { deer.classList.remove('flee', 'fled'); paintSky(); }, 90000);
  });
}

/* ---------------- the riddle: northern lights on demand ---------------- */
const RIDDLE = `A curtain with no window, green without a leaf.
I dance above the Swedish forest, but only in the dark.
Type my Swedish name anywhere on this page,
and I'll dance for you, even at noon.`;
let auroraTimer = 0, typed = '';

function northernLights() {
  const root = document.documentElement;
  const before = forcedHour;
  clearTimeout(auroraTimer);
  root.classList.add('aurora-storm');
  if (lastSky.d < 0.9) { forcedHour = skyPreset('night'); paintSky(); }
  toast(store.get('riddleSolved') ? 'Norrsken, once more.' : 'Norrsken! You solved the riddle.');
  store.set('riddleSolved', '1');
  auroraTimer = setTimeout(() => {
    root.classList.remove('aurora-storm');
    forcedHour = before; paintSky();
  }, 30000);
}

COMMANDS.riddle = () => `${RIDDLE}\n\n<span class="cmd">Stuck? Type</span> <b class="warn">hint</b>`;
COMMANDS.hint = () => "In Swedish, 'norr' means north and 'sken' means glow.";
COMMANDS['cat riddle.txt'] = COMMANDS.riddle;
COMMANDS.norrsken = () => { setTimeout(northernLights, 400); return '<span class="ok">Correct.</span> Look up.'; };
COMMANDS.moon = () => {
  const m = moonPhase();
  return `${m.name}, ${Math.round(m.illum * 100)}% lit.
${m.name === 'Full moon' ? 'Full moon tonight.' : `Next full moon in ${Math.round(m.daysToFull)} days.`}`;
};
COMMANDS.ls = () => 'about.txt  cv.pdf  projects/  trail.gpx  riddle.txt  .secret';
HIDDEN.push('hint', 'cat riddle.txt', 'norrsken');

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) || e.key.length !== 1) return;
  typed = (typed + e.key.toLowerCase()).slice(-8);
  if (typed === 'norrsken') { typed = ''; northernLights(); }
});

/* ---------------- boot ---------------- */
skyHooks.push((s) => { lastSky = s; });
buildDecorations();
setupCottage();
setupHiker();
setupDeer();
applyHoliday();
if (params.get('weather') in WEATHER_PRESETS) { simulated = WEATHER_PRESETS[params.get('weather')]; applyWeather(simulated); }
else fetchWeather();
paintSky();
scheduleShootingStars();
setInterval(fetchWeather, 15 * 60 * 1000);
setInterval(applyHoliday, 60 * 1000);
if (params.has('star')) setTimeout(shootingStar, 800); // preview: ?star
