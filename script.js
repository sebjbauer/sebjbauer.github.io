/* =====================================================================
   CONTENT: edit everything about you here. The page and the GPS
   terminal both read from this object, so you only change it once.
   ===================================================================== */
const SITE = {
  name: 'Sebastian Bauer',
  intro: 'Placeholder: one sentence on what you do. Living between Austria and Sweden.',
  role: 'placeholder job title',
  email: 'hello@example.com',
  linkedin: 'https://www.linkedin.com/in/your-profile',
  github: 'https://github.com/sebjbauer',
  cvPdf: 'cv.pdf',
  places: {
    at: { country: 'Austria', city: 'Vienna', lat: 48.21, lon: 16.37 },
    se: { country: 'Sweden', city: 'Stockholm', lat: 59.33, lon: 18.07 },
  },
  // Oldest first. Each entry becomes a waypoint on the elevation profile.
  cv: [
    { from: '2014', to: '2017', title: 'School / apprenticeship', org: 'Placeholder school', place: 'Austria',
      text: 'One or two sentences about this stage: what you learned, what you did.' },
    { from: '2017', to: '2021', title: "Bachelor's degree", org: 'Placeholder university', place: 'Vienna, AT',
      text: 'Your field of study, a highlight, maybe your thesis topic.' },
    { from: '2021', to: '2024', title: 'First job title', org: 'Placeholder company', place: 'Austria',
      text: 'What you worked on and one result you are proud of.' },
    { from: '2024', to: 'now', title: 'Current role', org: 'Placeholder company', place: 'Stockholm, SE',
      text: 'What you do today. This is the summit, for now.' },
  ],
  skills: {
    'Professional': ['Skill one', 'Skill two', 'Skill three', 'Skill four'],
    'Tools': ['Tool one', 'Tool two', 'Tool three'],
    'Off the trail': ['Hiking', 'Skiing', 'Coffee', 'Hobby'],
  },
  projects: [
    { name: 'Project one', text: 'A one-line description of the project.', url: '#', where: 'Vienna' },
    { name: 'Project two', text: 'A one-line description of the project.', url: '#', where: 'Stockholm' },
    { name: 'This website', text: 'Live sky, two countries, one hidden GPS terminal.', url: 'https://github.com/sebjbauer', where: 'Both' },
  ],
};

/* ===================================================================== */

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TZ = 'Europe/Stockholm'; // Austria and Sweden share a time zone
const fmtCoord = (p) => `${p.lat.toFixed(2)}°N ${p.lon.toFixed(2)}°E`;
const altitude = (i) => Math.round((500 + i * (1800 / Math.max(1, SITE.cv.length - 1))) / 10) * 10;

/* ---------------- live sky ---------------- */
const PHASES = {
  night: { skyTop: '#060B12', skyBot: '#15302E', far: '#1D3530', mid: '#14241F', snow: '#B9C9C2', lake: '#18302F', sun: '#E9EFE9', stars: 1, aurora: 1, window: 1 },
  dawn:  { skyTop: '#2E3A66', skyBot: '#F2A38A', far: '#6B6283', mid: '#34474A', snow: '#F7D3C4', lake: '#9C8190', sun: '#FFD7A8', stars: .25, aurora: .1, window: .6 },
  day:   { skyTop: '#4E9ACB', skyBot: '#CDE6EE', far: '#8BA7B0', mid: '#3B6457', snow: '#FFFFFF', lake: '#6FA8BF', sun: '#FFF1C4', stars: 0, aurora: 0, window: 0 },
  dusk:  { skyTop: '#26295A', skyBot: '#EE8657', far: '#584A6B', mid: '#2C3B40', snow: '#F4BFA0', lake: '#7D5263', sun: '#FFB36B', stars: .35, aurora: .2, window: .8 },
};
const KEYFRAMES = [[0, 'night'], [5, 'night'], [6.5, 'dawn'], [9, 'day'], [16.5, 'day'], [19, 'dusk'], [21, 'night'], [24, 'night']];
const SKY_PRESETS = { dawn: 7, day: 12.5, dusk: 19.2, night: 23 };
let forcedHour = null;

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => (typeof a === 'number' ? a + (b - a) * t : rgb2hex(hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * t)));
const lum = (h) => { const [r, g, b] = hex2rgb(h).map((v) => v / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

function localHour() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t) => +parts.find((p) => p.type === t).value;
  return get('hour') + get('minute') / 60;
}

function paintSky() {
  const h = forcedHour ?? localHour();
  let k = 0;
  while (k < KEYFRAMES.length - 2 && h >= KEYFRAMES[k + 1][0]) k++;
  const [h0, p0] = KEYFRAMES[k], [h1, p1] = KEYFRAMES[k + 1];
  const t = h1 === h0 ? 0 : (h - h0) / (h1 - h0);
  const a = PHASES[p0], b = PHASES[p1], root = document.documentElement.style;
  const v = {};
  for (const key in a) v[key] = mix(a[key], b[key], t);
  root.setProperty('--sky-top', v.skyTop); root.setProperty('--sky-bot', v.skyBot);
  root.setProperty('--far', v.far); root.setProperty('--mid', v.mid);
  root.setProperty('--snow', v.snow); root.setProperty('--lake', v.lake);
  root.setProperty('--sun', v.sun); root.setProperty('--stars', v.stars);
  root.setProperty('--aurora', v.aurora); root.setProperty('--window', v.window);
  const bright = (lum(v.skyTop) + lum(v.skyBot)) / 2 > 0.42;
  root.setProperty('--hero-ink', bright ? '#0F1A17' : '#E9EFE9');

  // sun by day (06–20), moon by night; both travel along an arc
  const sun = $('#sun'), isDay = h >= 6 && h < 20;
  const p = isDay ? (h - 6) / 14 : ((h >= 20 ? h - 20 : h + 4) / 10);
  sun.classList.toggle('moon', !isDay);
  // keep it on the right half so it never covers the headline
  const narrow = innerWidth < 760;
  sun.style.left = (narrow ? 20 : 48) + p * (narrow ? 70 : 46) + '%';
  sun.style.top = (narrow ? 58 : 62) - Math.sin(p * Math.PI) * (narrow ? 12 : 44) + '%';
}

function renderStars() {
  const svg = $('#stars');
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let out = '';
  for (let i = 0; i < 140; i++) {
    const x = rnd() * 1440, y = rnd() * 360, r = 0.4 + rnd() * 1.2;
    const tw = rnd() < 0.3 ? ` class="tw" style="animation-delay:${(rnd() * 4).toFixed(1)}s"` : '';
    out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(2)}" opacity="${(0.4 + rnd() * 0.6).toFixed(2)}"${tw}/>`;
  }
  svg.innerHTML = out;
}

function renderTrees() {
  const ground = $('#groundPath'), len = ground.getTotalLength();
  const yAt = {};
  for (let s = 0; s <= 600; s++) { const pt = ground.getPointAtLength((s / 600) * len); yAt[Math.round(pt.x)] = pt.y; }
  const groundY = (x) => { for (let d = 0; d < 20; d++) { if (yAt[x + d] !== undefined) return yAt[x + d]; if (yAt[x - d] !== undefined) return yAt[x - d]; } return 446; };
  const pine = (x, y, h) => {
    const w = h * 0.55;
    return `<path d="M${x} ${y - h} L${x - w * .3} ${y - h * .6} L${x - w * .16} ${y - h * .6} L${x - w * .42} ${y - h * .28} L${x - w * .26} ${y - h * .28} L${x - w * .5} ${y} L${x + w * .5} ${y} L${x + w * .26} ${y - h * .28} L${x + w * .42} ${y - h * .28} L${x + w * .16} ${y - h * .6} L${x + w * .3} ${y - h * .6} Z"/>`;
  };
  let seed = 3, out = '';
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // sparse spruce on the Alpine side, dense Swedish forest on the right
  for (let x = 20; x < 1440; x += 0) {
    const swedish = x > 620;
    if (x > 1150 && x < 1240) { x += 12; continue; } // clearing for the stuga
    const h = swedish ? 26 + rnd() * 30 : 18 + rnd() * 20;
    const baseY = x > 930 ? 447 : groundY(Math.round(x));
    if (swedish || rnd() < 0.35) out += pine(Math.round(x), baseY + 2, Math.round(h));
    x += swedish ? 9 + rnd() * 14 : 16 + rnd() * 30;
  }
  $('#trees').innerHTML = out;
}

// On phones, squeeze the view slightly so both the Alps and the Swedish lake fit
function fitLandscape() {
  const svg = $('#landscape'), narrow = innerWidth < 760;
  svg.setAttribute('viewBox', narrow ? '180 60 1260 460' : '0 0 1440 520');
  svg.setAttribute('preserveAspectRatio', narrow ? 'none' : 'xMidYMax slice');
}

/* ---------------- hero text ---------------- */
function greeting(h) {
  if (h < 5) return 'God natt, or rather, still up?';
  if (h < 11) return 'Guten Morgen, god morgon.';
  if (h < 17) return 'Servus, hej.';
  if (h < 22) return 'Guten Abend, god kväll.';
  return 'Gute Nacht, god natt.';
}

function tickClock() {
  $('#clock').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date());
  $('#greet').textContent = greeting(localHour());
  $('#cities').textContent = `${SITE.places.at.city} and ${SITE.places.se.city}`;
}

/* ---------------- CV elevation profile ---------------- */
function smoothPath(p) {
  let d = `M${p[0].x},${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
    const c1 = [p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6];
    const c2 = [p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function renderProfile() {
  const svg = $('#profile');
  const W = 1000, H = 300, left = 110, right = 70, low = 240, high = 70;
  const n = SITE.cv.length;
  const pts = SITE.cv.map((_, i) => ({ x: left + i * (W - left - right) / Math.max(1, n - 1), y: low - (i / Math.max(1, n - 1)) * (low - high) }));

  // terrain: waypoints plus a few bumps in between, so it looks like a real trail
  const terrain = [{ x: 0, y: low + 28 }, { x: left * 0.5, y: low + 8 }];
  pts.forEach((p, i) => {
    terrain.push(p);
    const q = pts[i + 1];
    if (q) terrain.push({ x: p.x + (q.x - p.x) * .3, y: p.y - 16 }, { x: p.x + (q.x - p.x) * .55, y: (p.y + q.y) / 2 + 24 }, { x: p.x + (q.x - p.x) * .8, y: q.y + 12 });
  });
  terrain.push({ x: W, y: pts[n - 1].y + 26 });
  const line = smoothPath(terrain);

  let g = '';
  for (let i = 0; i <= 3; i++) {
    const y = low - i * (low - high) / 3;
    g += `<line class="grid" x1="0" x2="${W}" y1="${y}" y2="${y}"/><text class="alt" x="0" y="${y - 7}">${(500 + i * 600).toLocaleString('en')} m</text>`;
  }
  g += `<path class="area" d="${line} L${W},${H} L0,${H} Z"/><path class="trail" d="${line}"/>`;
  pts.forEach((p, i) => {
    const w = SITE.cv[i], last = i === n - 1;
    g += `<line class="drop" x1="${p.x}" x2="${p.x}" y1="${p.y + 10}" y2="${H}"/>`;
    g += `<g class="wp" data-i="${i}" tabindex="0" role="button" aria-label="${esc(w.from + ' to ' + w.to + ': ' + w.title)}">
      ${last ? `<path class="summit" d="M${p.x} ${p.y - 42} l7 12 h-14 Z"/>` : ''}
      <circle class="ring" cx="${p.x}" cy="${p.y}" r="7"/><circle class="core" cx="${p.x}" cy="${p.y}" r="3.5"/>
      <text x="${p.x}" y="${p.y - 18}">${esc(w.from)}</text>
      <text class="sub" x="${p.x}" y="${p.y + 30}">${altitude(i).toLocaleString('en')} m</text></g>`;
  });
  svg.innerHTML = g;

  svg.querySelectorAll('.wp').forEach((el) => {
    const pick = () => selectWaypoint(+el.dataset.i);
    el.addEventListener('click', pick);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });
}

// The table is the readable CV; the profile above is its map.
function renderCvTable() {
  const rows = SITE.cv.map((w, i) => ({ w, i })).reverse();
  $('#cvTable tbody').innerHTML = rows.map(({ w, i }) => `
    <tr data-i="${i}">
      <td class="years">${esc(w.from)}–${esc(w.to)}</td>
      <td><span class="role">${esc(w.title)}</span><span class="org">${esc(w.org)}</span><span class="note">${esc(w.text)}</span></td>
      <td class="where">${esc(w.place)}</td>
    </tr>`).join('');
  $('#cvTable tbody').querySelectorAll('tr').forEach((tr) => tr.addEventListener('click', () => selectWaypoint(+tr.dataset.i)));
  selectWaypoint(SITE.cv.length - 1);
}

function selectWaypoint(i) {
  document.querySelectorAll('#profile .wp').forEach((el) => el.classList.toggle('active', +el.dataset.i === i));
  document.querySelectorAll('#cvTable tbody tr').forEach((tr) => tr.classList.toggle('active', +tr.dataset.i === i));
}

/* ---------------- skills, projects, contact ---------------- */
const external = (url) => url.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
const iconOut = '<svg class="i" aria-hidden="true"><use href="#i-out"/></svg>';

function renderContent() {
  $('#heroLine').textContent = SITE.intro;

  $('#skillList').innerHTML = Object.entries(SITE.skills).map(([group, items]) =>
    `<dt>${esc(group)}</dt><dd>${items.map(esc).join(', ')}</dd>`).join('');

  $('#projectList').innerHTML = SITE.projects.map((p) =>
    `<li><a href="${esc(p.url)}"${external(p.url)}>
      <span class="name">${esc(p.name)}${p.url.startsWith('http') ? iconOut : ''}</span>
      <span class="desc">${esc(p.text)}</span>
      <span class="where">${esc(p.where)}</span></a></li>`).join('');

  $('#mailLink').href = `mailto:${SITE.email}`;
  $('#mailLink').textContent = SITE.email;
  $('#contactLinks').innerHTML = [
    [SITE.linkedin, 'LinkedIn'],
    [SITE.github, 'GitHub'],
  ].map(([href, label]) => `<li><a href="${esc(href)}"${external(href)}>${label}${iconOut}</a></li>`).join('');

  $('#cvDownload').href = SITE.cvPdf;
  $('#year').textContent = new Date().getFullYear();
}

/* ---------------- GPS terminal ---------------- */
const gps = $('#gps'), out = $('#gpsOut'), input = $('#gpsCmd');
const history = [];
let histIdx = 0, booted = false;

function print(html, cls = '') {
  const div = document.createElement('div');
  div.className = cls;
  div.innerHTML = html;
  out.appendChild(div);
  out.scrollTop = out.scrollHeight;
}

function goTo(id) { closeGps(); document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }

const WEATHER = { 0: 'clear', 1: 'mostly clear', 2: 'partly cloudy', 3: 'cloudy', 45: 'fog', 48: 'fog', 51: 'drizzle', 53: 'drizzle', 55: 'drizzle', 61: 'rain', 63: 'rain', 65: 'heavy rain', 71: 'snow', 73: 'snow', 75: 'heavy snow', 77: 'snow grains', 80: 'showers', 81: 'showers', 82: 'heavy showers', 85: 'snow showers', 86: 'snow showers', 95: 'thunderstorm' };

const COMMANDS = {
  help: () => `Available commands:
  <b class="warn">whoami</b>        who is this?
  <b class="warn">whereami</b>      current position
  <b class="warn">route cv</b>      the career trail
  <b class="warn">waypoint</b> &lt;n&gt;  details of one stage
  <b class="warn">skills</b>        equipment check
  <b class="warn">projects</b>      marked routes
  <b class="warn">contact</b>       send a signal
  <b class="warn">weather</b>       live weather, AT and SE
  <b class="warn">sky</b> &lt;mode&gt;    dawn | day | dusk | night | live
  <b class="warn">download cv</b>   the official PDF
  <b class="warn">goto</b> &lt;place&gt;   about | cv | skills | projects | contact
  <b class="warn">fika</b>          mandatory break
  <b class="warn">clear</b>, <b class="warn">exit</b>
Tip: Tab completes, ↑ repeats. Some commands are not listed.`,

  whoami: () => `${esc(SITE.name)}
Role: ${esc(SITE.role)}
Home base: split between ${SITE.places.at.country} and ${SITE.places.se.country}.`,

  whereami: () => {
    const { at, se } = SITE.places;
    return `Position fix acquired:
  ◤ ${esc(at.city)}, ${esc(at.country)}    ${fmtCoord(at)}
  ◢ ${esc(se.city)}, ${esc(se.country)}   ${fmtCoord(se)}
Distance between bases: ~${Math.round(haversine(at, se)).toLocaleString('en')} km.
Current heading: <span class="ok">it depends on the season.</span>`;
  },

  'route cv': () => {
    const rows = SITE.cv.map((w, i) => `  ${i === SITE.cv.length - 1 ? '<span class="warn">▲</span>' : '●'} ${(w.from + '–' + w.to).padEnd(10)} ${esc(w.title).padEnd(26)} ${altitude(i).toLocaleString('en').padStart(5)} m`).reverse();
    return `Career trail (summit on top):\n${rows.join('\n  │\n')}\n\nType <b class="warn">waypoint 1</b>…<b class="warn">waypoint ${SITE.cv.length}</b> for details.`;
  },

  waypoint: (arg) => {
    const i = parseInt(arg, 10) - 1, w = SITE.cv[i];
    if (!w) return `<span class="warn">Unknown waypoint.</span> Pick 1 to ${SITE.cv.length}.`;
    selectWaypoint(i);
    return `WPT ${String(i + 1).padStart(2, '0')} · ${esc(w.from)}–${esc(w.to)} · ▲ ${altitude(i).toLocaleString('en')} m
${esc(w.title)} @ ${esc(w.org)} (${esc(w.place)})
${esc(w.text)}`;
  },

  skills: () => 'Equipment check:\n' + Object.entries(SITE.skills).map(([g, items]) => `  [<span class="ok">✓</span>] ${esc(g)}: ${items.map(esc).join(', ')}`).join('\n'),

  projects: () => 'Marked routes:\n' + SITE.projects.map((p, i) => `  WPT ${String(i + 1).padStart(2, '0')}  <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>  ${esc(p.text)}`).join('\n'),

  contact: () => `Sending signal…
  mail      <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
  linkedin  <a href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">${esc(SITE.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}</a>
  github    <a href="${esc(SITE.github)}" target="_blank" rel="noopener">${esc(SITE.github.replace(/^https?:\/\//, ''))}</a>`,

  weather: async () => {
    const { at, se } = SITE.places;
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${at.lat},${se.lat}&longitude=${at.lon},${se.lon}&current=temperature_2m,weather_code`;
      const [a, s] = await (await fetch(url)).json();
      const line = (p, d) => `  ${esc(p.city).padEnd(10)} ${String(Math.round(d.current.temperature_2m)).padStart(3)}°C  ${WEATHER[d.current.weather_code] || 'weather'}`;
      const diff = Math.round(a.current.temperature_2m - s.current.temperature_2m);
      return `Live weather:\n${line(at, a)}\n${line(se, s)}\n${diff > 0 ? `Austria is ${diff}° warmer. Sweden says: "lagom".` : diff < 0 ? `Sweden is ${-diff}° warmer. Rare, enjoy it.` : 'Same temperature. Suspicious.'}`;
    } catch {
      return '<span class="warn">No satellite connection.</span> Try again later.';
    }
  },

  sky: (arg) => {
    if (arg === 'live' || !arg) { forcedHour = null; paintSky(); return 'Sky synced to the real time in Austria and Sweden.'; }
    if (!(arg in SKY_PRESETS)) return 'Usage: sky dawn | day | dusk | night | live';
    forcedHour = SKY_PRESETS[arg]; paintSky();
    return `Sky set to ${arg}. ${arg === 'night' ? 'Look north for the northern lights.' : ''}Scroll up to see it.`;
  },

  'download cv': () => { const a = document.createElement('a'); a.href = SITE.cvPdf; a.download = ''; a.click(); return `Downloading <a href="${esc(SITE.cvPdf)}">${esc(SITE.cvPdf)}</a>…`; },
  goto: (arg) => { if (!['about', 'cv', 'skills', 'projects', 'contact'].includes(arg)) return 'Usage: goto about | cv | skills | projects | contact'; setTimeout(() => goTo(arg), 300); return `Navigating to ${arg}…`; },

  fika: () => `Starting mandatory fika…
      ( (
       ) )
    ........      @@@
    |      |]    (___)  kanelbulle
    \\      /
     \`----'
Break complete. Productivity +20%.`,

  ls: () => 'about.txt  cv.pdf  projects/  trail.gpx  .secret',
  'cat .secret': () => 'The sky obeys you. Try: <b class="warn">sky night</b>, then look north.',
  'cat about.txt': () => document.querySelector('#about .lead').textContent,
  'cat trail.gpx': () => COMMANDS['route cv'](),
  'sudo hire-me': () => { setTimeout(() => goTo('contact'), 1200); return '[sudo] password for recruiter: ********\n<span class="ok">Access granted.</span> Plotting route to contact…'; },
  hej: () => 'Hej hej!',
  servus: () => 'Servus! Griaß di.',
  'rm -rf /': () => '<span class="warn">Avalanche warning.</span> Permission denied.',
  clear: () => { out.innerHTML = ''; return null; },
  exit: () => { closeGps(); return null; },
};
const HIDDEN = ['ls', 'cat .secret', 'cat about.txt', 'cat trail.gpx', 'sudo hire-me', 'hej', 'servus', 'rm -rf /'];

function haversine(a, b) {
  const R = 6371, rad = (d) => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

async function run(raw) {
  const cmd = raw.trim().replace(/\s+/g, ' ');
  if (!cmd) return;
  history.push(cmd); histIdx = history.length;
  print(`<b>$</b> ${esc(cmd)}`, 'cmd');
  const lower = cmd.toLowerCase();
  let fn = COMMANDS[lower], arg = '';
  if (!fn) { const [head, ...rest] = lower.split(' '); if (COMMANDS[head]) { fn = COMMANDS[head]; arg = rest.join(' '); } }
  if (!fn) return print(`Command not found: ${esc(cmd)}. Type <b class="warn">help</b>.`);
  const res = await fn(arg);
  if (res != null) print(res);
}

function openGps() {
  gps.hidden = false;
  input.focus();
  if (!booted) {
    booted = true;
    const { at, se } = SITE.places;
    print(`GPS-TRAIL v1.0 · satellites: 7 <span class="warn">▂▄▆█</span>
Position fix: ${fmtCoord(at)} (AT) · ${fmtCoord(se)} (SE)
<span class="ok">Ready.</span> Type <b class="warn">help</b> to see what you can do.`);
  }
}
function closeGps() { gps.hidden = true; }

$('#gpsForm').addEventListener('submit', (e) => { e.preventDefault(); const v = input.value; input.value = ''; run(v); });
input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && histIdx > 0) { input.value = history[--histIdx]; e.preventDefault(); }
  else if (e.key === 'ArrowDown') { histIdx = Math.min(history.length, histIdx + 1); input.value = history[histIdx] || ''; e.preventDefault(); }
  else if (e.key === 'Tab') {
    e.preventDefault();
    const v = input.value.toLowerCase();
    const hits = Object.keys(COMMANDS).filter((c) => c.startsWith(v) && !HIDDEN.includes(c));
    if (hits.length === 1) input.value = hits[0] + (['waypoint', 'sky', 'goto'].includes(hits[0]) ? ' ' : '');
    else if (hits.length > 1) print(hits.join('  '), 'cmd');
  }
  else if (e.key === 'Escape') closeGps();
});
$('#termOpen').addEventListener('click', openGps);
$('#termClose').addEventListener('click', closeGps);
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (['~', '`', '§', '^'].includes(e.key) || e.code === 'Backquote') { e.preventDefault(); gps.hidden ? openGps() : closeGps(); }
});

// header coordinates alternate between both bases
let coordFlip = false;
function tickCoords() {
  const p = coordFlip ? SITE.places.se : SITE.places.at;
  $('#gpsCoords').textContent = `${coordFlip ? 'SE' : 'AT'} ${fmtCoord(p)}`;
  coordFlip = !coordFlip;
}

/* ---------------- boot ---------------- */
const skyParam = new URLSearchParams(location.search).get('sky');
if (skyParam in SKY_PRESETS) forcedHour = SKY_PRESETS[skyParam];

renderStars();
renderTrees();
fitLandscape();
paintSky();
tickClock();
renderProfile();
renderCvTable();
renderContent();
tickCoords();
setInterval(() => { paintSky(); tickClock(); }, 60000);
setInterval(tickCoords, 4000);
addEventListener('resize', () => { fitLandscape(); paintSky(); });
addEventListener('scroll', () => $('.nav').classList.toggle('scrolled', scrollY > innerHeight * 0.6), { passive: true });
