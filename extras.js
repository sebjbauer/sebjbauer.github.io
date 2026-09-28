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

/* ---------------- tab icon: the landscape in miniature, by day or by night ---------------- */
// Same drawing as favicon.svg (the static icon for Google and home screens): by day a blue sky and the
// sun, at night a dark sky with tonight's moon phase and a lit cottage window.
let faviconKey = '';
function drawFavicon(isDay) {
  const m = moonPhase(), key = isDay ? 'day' : `night-${Math.round(m.p * 60)}`;
  if (key === faviconKey) return;
  faviconKey = key;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const pal = isDay
    ? { top: '#4E9ACB', bot: '#CDE6EE', far: '#8BA7B0', snow: '#FFFFFF', mid: '#3B6457', lake: '#6FA8BF', window: '#F4F4F2' }
    : { top: '#070B12', bot: '#1B2733', far: '#39434F', snow: '#C3CCD3', mid: '#18231F', lake: '#1A252E', window: '#FFD27A' };
  g.beginPath(); g.roundRect(0, 0, 64, 64, 14); g.clip();
  const sky = g.createLinearGradient(0, 0, 0, 64); sky.addColorStop(0, pal.top); sky.addColorStop(1, pal.bot);
  g.fillStyle = sky; g.fillRect(0, 0, 64, 64);
  if (isDay) { g.fillStyle = '#FFD27A'; g.beginPath(); g.arc(46, 17, 6.5, 0, 7); g.fill(); }
  else {
    g.fillStyle = '#E9EDEF';
    [[10, 9], [22, 14], [15, 22], [56, 30], [34, 7]].forEach(([x, y]) => g.fillRect(x, y, 1.2, 1.2));
    g.save(); g.translate(46, 17); g.scale(0.4, 0.4); // the moon path is drawn for a radius of about 18
    g.fillStyle = '#2B3440'; g.beginPath(); g.arc(0, 0, 18, 0, 7); g.fill();
    g.fillStyle = '#E9EDEF'; g.fill(new Path2D(moonSvg(m).match(/ d="([^"]+)"/)[1]));
    g.restore();
  }
  const poly = (fill, pts) => { g.fillStyle = fill; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.fill(); };
  poly(pal.far, [[0, 44], [13, 29], [21, 36], [31, 19], [42, 33], [50, 29], [64, 38], [64, 64], [0, 64]]);
  poly(pal.snow, [[31, 19], [26.4, 26.4], [29, 25.4], [31, 28], [33.2, 25.6], [35.6, 26.6]]);
  g.fillStyle = pal.mid; g.beginPath(); g.moveTo(0, 49); g.bezierCurveTo(12, 43, 24, 47, 36, 44.5); g.bezierCurveTo(47, 42.5, 56, 45.5, 64, 43.5); g.lineTo(64, 64); g.lineTo(0, 64); g.fill();
  g.fillStyle = pal.lake; g.fillRect(0, 54, 64, 10);
  g.fillStyle = '#B23A2E'; g.fillRect(41, 47.5, 8, 6.5);
  poly('#2B1B17', [[39.8, 47.8], [45, 43.6], [50.2, 47.8]]);
  g.fillStyle = pal.window; g.fillRect(43.9, 50.2, 2.2, 3.8);
  // replace the static icons in the page head with this one (they stay in the HTML for Google and home screens)
  let link = document.querySelector('link#liveIcon');
  if (!link) {
    document.querySelectorAll('link[rel="icon"]').forEach((l) => l.remove());
    link = document.createElement('link'); link.rel = 'icon'; link.id = 'liveIcon'; link.type = 'image/png';
    document.head.appendChild(link);
  }
  link.href = c.toDataURL('image/png');
}
skyHooks.push(({ isDay }) => drawFavicon(isDay));

/* ---------------- real weather where I am (workBase) ---------------- */
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
  forecast: { code: 3, cloud: 80, temp: 12, rainSoon: true }, // dry now, rain expected soon
  icing: { code: 0, cloud: 20, temp: -4, ice: 0.45 },          // a few cold days: ice creeping out from the shore
  windy: { code: 2, cloud: 40, temp: 6, wind: 28, windDir: 250 }, // strong westerly: smoke streams to the right
};
let weatherNow = null, simulated = null, stormTimer = 0;

function applyWeather(w) {
  const c = w.code;
  live.overcast = Math.min(1, w.cloud / 100);
  live.fog = c === 45 || c === 48 ? 1 : 0;
  // The lake freezes over gradually, from the last week of temperatures (ice 0…1, see pastDays).
  // Presets without that history freeze at once below 0 °C, like before.
  live.ice = w.ice ?? (typeof w.temp === 'number' && w.temp < 0 ? 1 : 0);
  live.frozen = live.ice >= 1;
  document.documentElement.style.setProperty('--ice-band', live.ice > 0 && live.ice < 1 ? (live.ice * 26).toFixed(1) : '0');
  // chimney and sauna smoke drift downwind (we look north: wind from the west blows the smoke right)
  const kmh = w.wind ?? 5, dir = w.windDir ?? 250, push = Math.min(1, kmh / 30);
  const dx = kmh < 2 ? 0 : Math.sin((dir + 180) * Math.PI / 180) * (4 + 30 * push);
  document.documentElement.style.setProperty('--smoke-dx', dx.toFixed(1) + 'px');
  document.documentElement.style.setProperty('--smoke-dy', (-26 * (1 - 0.6 * push)).toFixed(1) + 'px');
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

// From the last week of daily temperatures and rain: how far the lake has frozen (ice 0…1: ice grows on
// frosty days, about a quarter of the lake per day at a mean of -3 °C, and melts on mild ones), and how
// many dry, hot days in a row there have been (for the window boxes).
function pastDays(daily, tempNow) {
  const max = daily?.temperature_2m_max, min = daily?.temperature_2m_min, rain = daily?.precipitation_sum;
  if (!max || !min) return { ice: tempNow < 0 ? 1 : 0, dryHot: 0 };
  let ice = 0;
  for (let i = 0; i < max.length; i++) {
    const mean = ((max[i] ?? 0) + (min[i] ?? 0)) / 2;
    ice = Math.min(1, Math.max(0, ice + (mean < 0 ? -mean / 12 : -mean / 6)));
  }
  let dryHot = 0;
  for (let i = max.length - 2; i >= 0 && (rain?.[i] ?? 1) < 0.5 && max[i] >= 25; i--) dryHot++; // counting back from yesterday
  return { ice: ice > 0.97 ? 1 : ice, dryHot };
}

async function fetchWeather() {
  if (simulated) return;
  const p = base();
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=precipitation,precipitation_probability,snowfall&past_hours=24&forecast_hours=6&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=7&forecast_days=1&timezone=auto`;
    const { current, hourly, daily } = await (await fetch(url)).json();
    // the hourly lists hold the 24 past hours, then the next 6
    const hours = (key) => (hourly?.[key] || []).map((v) => v || 0);
    const pastRain = hours('precipitation').slice(21, 24).reduce((a, b) => a + b, 0);
    const chance = Math.max(0, ...hours('precipitation_probability').slice(24));
    const snow24 = hours('snowfall').slice(0, 24).reduce((a, b) => a + b, 0); // cm of fresh snow in the last day
    weatherNow = { code: current.weather_code, cloud: current.cloud_cover, temp: current.temperature_2m, wind: current.wind_speed_10m, windDir: current.wind_direction_10m,
      recentRain: pastRain >= 0.2, rainSoon: chance >= 60, snow24, ...pastDays(daily, current.temperature_2m) };
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
  clouds ${w.cloud}%, wind ${Math.round(w.wind)} km/h${w.rainSoon ? '\n  rain likely in the next hours' : ''}
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

// Flag by the cottage: only on Swedish National Day (6 June) and Austrian National Day (26 October),
// between sunrise and sunset (Swedish custom). The rest of the time the pole is empty.
let flagPreview = null; // backstage: 'se' or 'at'
function flagToday(isDay) {
  if (flagPreview) return flagPreview;
  if (params.get('flag')) return params.get('flag'); // preview: ?flag=se or ?flag=at
  const [, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()).split('-').map(Number);
  const national = m === 6 && d === 6 ? 'se' : m === 10 && d === 26 ? 'at' : null;
  return national && isDay ? national : 'none';
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
let fikaUntil = 0; // backstage: a fika break right now
const fikaTime = () => params.has('fika') || Date.now() < fikaUntil || (localHour() >= 15 && localHour() < 15.25);
const hiker = { busy: false }; // filled in by setupHiker()
function setupHiker() {
  const svg = $('#profile'), trail = svg.querySelector('.trail');
  const total = trail.getTotalLength();
  // length along the trail at each marker, by key ('job-1', 'edu-3', …)
  const lengthAtX = (x) => { let lo = 0, hi = total; for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (trail.getPointAtLength(mid).x < x) lo = mid; else hi = mid; } return lo; };
  const stops = {};
  svg.querySelectorAll('.wp').forEach((el) => { stops[el.dataset.k] = lengthAtX(+el.dataset.x); });
  const start = svg.querySelector('.wp.active') || svg.querySelector('.wp');
  if (!start) return; // no career data (cv-data.js missing): no hiker

  svg.insertAdjacentHTML('beforeend', `<g class="hiker" aria-hidden="true"><g class="hk">
    <g class="hk-upper">
      <rect class="pack" x="-5.5" y="-17" width="4" height="7" rx="1.2"/>
      <circle cx="0" cy="-20" r="3"/>
      <path class="beam" d="M3 -20.6 L16 -25 L16 -15 Z"/><circle class="lamp" cx="2.7" cy="-20.6" r=".9"/>
      <line x1="0" y1="-17" x2="0" y2="-9"/>
      <g class="cup"><rect x="2.4" y="-14" width="2.6" height="3" rx=".6"/><path class="steam" d="M3.2 -15.5 q-1 -1.5 0 -3 M4.4 -15.5 q1 -1.5 0 -3"/><line x1="0" y1="-14" x2="2.6" y2="-12.6"/></g>
      <g class="umbrella-packed"><line x1="-6.5" y1="-8" x2="-1.5" y2="-21"/><path d="M-1.5 -21 q1 -1.2 2 -.4"/></g>
      <g class="umbrella-open"><line x1="0" y1="-15" x2="1.5" y2="-29"/><path class="canopy" d="M-7 -26.5 Q1.5 -35.5 10 -28.5 Q7.5 -27.8 5.5 -28 Q3.5 -28.6 1.5 -27.8 Q-0.5 -27.2 -2.5 -27.3 Q-4.8 -27.2 -7 -26.5 Z"/></g>
    </g>
    <g class="walk-legs"><line class="leg a" x1="0" y1="-9" x2="-2" y2="0"/><line class="leg b" x1="0" y1="-9" x2="2" y2="0"/><line class="pole" x1="1" y1="-14" x2="5" y2="0"/></g>
    <path class="sit-legs" d="M0 -5 L4 -7.5 L6 0"/>
  </g></g>`);
  const g = svg.querySelector('.hiker'), hk = g.querySelector('.hk'), legA = g.querySelector('.leg.a'), legB = g.querySelector('.leg.b');
  // an umbrella: open while it rains, packed on the rucksack when the forecast says rain is coming
  skyHooks.push(() => {
    const raining = live.particle === 'rain' || live.particle === 'drizzle';
    g.classList.toggle('rain', raining);
    g.classList.toggle('rain-soon', !raining && !!(simulated || weatherNow)?.rainSoon);
  });

  let pos = 0, target = stops[start.dataset.k], visible = false, raf = 0, last = 0, walkSpeed = 0.09;
  const place = (t) => {
    const pt = pointAt(trail, pos);
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
    pos = dir > 0 ? Math.min(target, pos + dt * walkSpeed) : Math.max(target, pos - dt * walkSpeed);
    place(t);
    raf = pos !== target && visible ? requestAnimationFrame(step) : 0;
    if (!raf) { last = 0; place(0); }
  };
  const go = () => { if (!raf && visible && !reduceMotion) raf = requestAnimationFrame(step); if (reduceMotion) { pos = target; place(0); } };

  // hiker.busy: science.js is steering (gradient descent), so ignore the waypoints meanwhile
  const home = () => { const a = svg.querySelector('.wp.active'); if (a) { target = stops[a.dataset.k]; go(); } };
  waypointHooks.push((k) => { if (!hiker.busy) { target = stops[k]; go(); } });
  svg.querySelectorAll('.wp').forEach((el) => el.addEventListener('mouseenter', () => { if (!hiker.busy) { target = stops[el.dataset.k]; go(); } }));
  svg.addEventListener('mouseleave', () => { if (!hiker.busy) home(); });
  Object.assign(hiker, {
    trail, total,
    where: () => pos, // current distance along the trail
    walkTo(len, speed = 0.09) { // resolves when the hiker arrives
      return new Promise((done) => {
        target = Math.max(0, Math.min(total, len)); walkSpeed = speed;
        if (!visible || reduceMotion) { pos = target; place(0); done(); return; }
        const wait = () => (pos === target || !visible ? done() : setTimeout(wait, 40));
        go(); wait();
      });
    },
    home() { walkSpeed = 0.09; home(); },
  });
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
COMMANDS.ls = () => 'about.txt  cv.pdf  trail.gpx  riddle.txt  .secret';
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
