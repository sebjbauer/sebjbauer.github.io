/* =====================================================================
   CONTENT: edit everything about you here. The page and the GPS
   terminal both read from this object, so you only change it once.
   ===================================================================== */
const SITE = {
  name: 'Sebastian Bauer',
  // The lines under your name at the top. [Text](link) becomes a link.
  headline: [
    'PhD Student in Bioinformatics @[Stockholm University](https://www.su.se) and @[SciLifeLab](https://www.scilifelab.se)',
    'Guest Researcher @[AITHYRA](https://aithyra.at)',
  ],
  location: 'Vienna, Austria',
  role: 'PhD student in Bioinformatics, guest researcher at AITHYRA',
  // One line about what you're doing right now, and when you last updated it (YYYY-MM).
  now: { text: "Placeholder: what you're working on, reading or training for right now.", updated: '2026-09' },
  email: 'sebastian.bauer@scilifelab.se',
  linkedin: 'https://www.linkedin.com/in/sebjbauer/',
  github: 'https://github.com/sebjbauer',
  bluesky: 'https://bsky.app/profile/sebjbauer.bsky.social',
  x: 'https://x.com/sebjbauer',
  cvPdf: 'cv.pdf',
  // Where you live and work right now ('at' or 'se'). The clock, weather, moon,
  // sunrise/sunset and light/dark mode all follow this place.
  workBase: 'at',
  places: {
    at: { country: 'Austria', city: 'Vienna', lat: 48.21, lon: 16.37 },
    se: { country: 'Sweden', city: 'Stockholm', lat: 59.33, lon: 18.07 },
  },
  // Google Scholar profile, linked from Publications, Contact and the terminal
  scholar: 'https://scholar.google.com/citations?user=Dqq0FUYAAAAJ&hl=en',

  // CAREER: jobs and research positions. Oldest first; each entry is a waypoint on the career trail.
  cv: [
    { from: '2016', to: '2017', title: 'Civilian service: teaching assistant', org: 'School for children with special needs', place: 'Austria',
      text: 'Assisted in the classroom at a school for children with special needs.' },
    { from: '2021', to: '2023', title: 'Research assistant', org: 'Brismar Lab, KTH and SciLifeLab', place: 'Stockholm, SE',
      text: 'Developed microscopy methods for imaging the Na⁺,K⁺-ATPase and contributed to the resulting publications.',
      links: [['Brismar Lab', 'https://www.scilifelab.se/researchers/hjalmar-brismar/'], ['Publications', '#publications']] },
    { from: '2023', to: 'now', title: 'PhD researcher', org: 'Griffié Lab, Stockholm University and SciLifeLab', place: 'Stockholm, SE',
      text: 'Doctoral research on generative models for super-resolution microscopy (see Education). First-author preprint: SMLMFlow (2026).',
      links: [['Griffié Lab', 'https://www.scilifelab.se/researchers/juliette-griffie/'], ['SMLMFlow preprint', 'https://doi.org/10.64898/2026.06.11.731424']] },
    { from: '2026', to: 'now', title: 'Guest researcher', org: 'Tong Group, AITHYRA', place: 'Vienna, AT',
      text: 'Further improving generative models for single-molecule localization microscopy.',
      links: [['Tong Group', 'https://tonggroup.org']] },
  ],

  // EDUCATION: schools and degrees. Oldest first.
  education: [
    { from: '2008', to: '2016', title: 'High school diploma (Matura)', org: 'Kollegium Kalksburg', place: 'Vienna, AT',
      text: 'Final thesis on aerodynamics in road cycling.', award: 'Award for the best physics thesis in Vienna' },
    { from: '2017', to: '2020', title: 'BSc Technical Physics', org: 'TU Wien', place: 'Vienna, AT',
      text: "Bachelor's thesis in quantum optics, in the lab of Philipp Haslinger.",
      links: [['Haslinger Lab', 'https://www.haslingerlab.com']] },
    { from: '2020', to: '2021', title: 'Erasmus exchange year', org: 'KTH Royal Institute of Technology', place: 'Stockholm, SE',
      text: '' },
    { from: '2021', to: '2023', title: 'MSc Engineering Physics, specialisation in Biomedical Physics', org: 'KTH Royal Institute of Technology', place: 'Stockholm, SE',
      text: "Master's thesis on the co-evolution of the Na⁺,K⁺-ATPase's β-subunit dimerization, in the lab of Lucie Delemotte (KTH and SciLifeLab).",
      links: [['Thesis', 'https://kth.diva-portal.org/smash/record.jsf?pid=diva2:1768469'], ['Delemotte Lab', 'https://www.scilifelab.se/researchers/lucie-delemotte/']] },
    { from: '2023', to: 'now', title: 'PhD in Bioinformatics', org: 'Stockholm University and SciLifeLab', place: 'Stockholm, SE',
      text: 'Generative models for single-molecule localization microscopy (SMLM), in the lab of Juliette Griffié.',
      links: [['Griffié Lab', 'https://www.scilifelab.se/researchers/juliette-griffie/']] },
  ],

  // PUBLICATIONS: newest year first. Put your own name exactly as in `me` so it is shown in bold.
  me: 'S. Bauer',
  publications: [
    { year: 2026, type: 'Preprint', title: 'SMLMFlow: Improving Structural Resolution in Single Molecule Localization Microscopy with Flow Matching',
      authors: 'S. Bauer, L. Panconi, I. Cunha, E. Latron, D. Sage, R. Peters, J. Griffié', venue: 'bioRxiv', url: 'https://doi.org/10.64898/2026.06.11.731424' },
    { year: 2026, type: 'Journal article', title: 'Dual-Color Expansion Microscopy of Membrane Proteins Using Bioorthogonal Labeling',
      authors: 'S. Edwards, B. Meineke, S. Bauer, H. Blom, S. Elsässer, H. Brismar', venue: 'Nano Letters 26(4), 1321–1326', url: 'https://pubs.acs.org/doi/10.1021/acs.nanolett.5c05301' },
    { year: 2025, type: 'Preprint', title: 'AI4CellFate: Interpretable Early Cell Fate Prediction with Generative AI',
      authors: 'I. Cunha, L. Panconi, S. Bauer, M. Gestin, E. Latron, E. Sahai, A. Le Marois, J. Griffié', venue: 'bioRxiv', url: 'https://www.biorxiv.org/content/10.1101/2025.05.12.653464v1' },
    { year: 2025, type: 'Preprint', title: '6S RNA facilitates bacterial virulence and adaptation at the epithelial barrier',
      authors: 'O. Sarigöz, V. D. Valeriano, U. Avican, H. Wang, K. Nilsson, N. Hasanzade, F. Mahmood, A. Fahlgren, S. Bauer, J. Griffié, M. Fällman, K. Avican', venue: 'bioRxiv', url: 'https://www.biorxiv.org/content/10.1101/2025.10.07.681022v1' },
    { year: 2024, type: 'Review', title: 'Machine learning in microscopy – insights, opportunities and challenges',
      authors: 'I. Cunha, E. Latron, S. Bauer, D. Sage, J. Griffié', venue: 'Journal of Cell Science 137(20), jcs262095', url: 'https://doi.org/10.1242/jcs.262095' },
    { year: 2023, type: 'Conference abstract', title: 'Expansion microscopy and bioorthogonal labeling with non-canonical amino acids enables cluster analysis of Na,K-ATPase in the plasma membrane',
      authors: 'S. Edwards, S. Bauer, P. Graef, B. Meineke, S. Elsässer, H. Brismar', venue: 'Physiology 38(S1), 5732753', url: 'https://journals.physiology.org/doi/abs/10.1152/physiol.2023.38.S1.5732753' },
    { year: 2023, type: 'Conference abstract', title: 'Click chemistry, FRET-FCS, and expansion microscopy reveal that Na,K-ATPase forms complexes in the plasma membrane',
      authors: 'H. Brismar, S. Edwards, S. Bauer, B. Meineke, S. Elsässer, S. Wennmalm', venue: 'Physiology 38(S1), 5732603', url: 'https://journals.physiology.org/doi/abs/10.1152/physiol.2023.38.S1.5732603' },
    { year: 2023, type: "Master's thesis", title: "Co-evolutional analysis of the Na⁺,K⁺-ATPase's β-subunit dimerization",
      authors: 'S. Bauer', venue: 'KTH Royal Institute of Technology', url: 'https://kth.diva-portal.org/smash/record.jsf?pid=diva2:1768469' },
  ],

  skills: {
    'Professional': ['Skill one', 'Skill two', 'Skill three', 'Skill four'],
    'Tools': ['Tool one', 'Tool two', 'Tool three'],
    'Off the trail': ['Hiking', 'Skiing', 'Coffee', 'Hobby'],
  },
  projects: [
    { name: 'Project one', text: 'A one-line description of the project.', url: '#', where: 'Vienna' },
    { name: 'Project two', text: 'A one-line description of the project.', url: '#', where: 'Vienna' },
  ],
};

/* ===================================================================== */

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TZ = 'Europe/Vienna'; // same rules as Stockholm, including summer time
const base = () => SITE.places[SITE.workBase];
const fmtCoord = (p) => `${p.lat.toFixed(2)}°N ${p.lon.toFixed(2)}°E`;

/* ---------------- live sky ---------------- */
const PHASES = {
  night: { skyTop: '#04060A', skyBot: '#121A22', far: '#1B232A', mid: '#12171B', snow: '#B8C2CA', lake: '#141C23', sun: '#E9EDEF', stars: 1, aurora: 1, window: 1 },
  dawn:  { skyTop: '#2E3A66', skyBot: '#F2A38A', far: '#6B6283', mid: '#34474A', snow: '#F7D3C4', lake: '#9C8190', sun: '#FFD7A8', stars: .25, aurora: .1, window: .6 },
  day:   { skyTop: '#4E9ACB', skyBot: '#CDE6EE', far: '#8BA7B0', mid: '#3B6457', snow: '#FFFFFF', lake: '#6FA8BF', sun: '#FFF1C4', stars: 0, aurora: 0, window: 0 },
  dusk:  { skyTop: '#26295A', skyBot: '#EE8657', far: '#584A6B', mid: '#2C3B40', snow: '#F4BFA0', lake: '#7D5263', sun: '#FFB36B', stars: .35, aurora: .2, window: .8 },
};
let forcedHour = null;
// Live conditions, filled in by extras.js from real weather data
const live = { overcast: 0, particle: null, fog: 0, frozen: false };
const skyHooks = [];
// Only touch the page when a value really changes: on phones every change restyles the whole landscape.
const varCache = {};
function setVar(k, v) { v = String(v); if (varCache[k] !== v) { varCache[k] = v; document.documentElement.style.setProperty(k, v); } }
function setData(k, v) { if (document.documentElement.dataset[k] !== v) document.documentElement.dataset[k] = v; }   // extras.js hooks in here: fn({ h, d, isDay, sunT })

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => (typeof a === 'number' ? a + (b - a) * t : rgb2hex(hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * t)));
const lum = (h) => { const [r, g, b] = hex2rgb(h).map((v) => v / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const fmtHour = (h) => { const m = Math.round((((h % 24) + 24) % 24) * 60); return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };

function localHour() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t) => +parts.find((p) => p.type === t).value;
  return get('hour') + get('minute') / 60;
}

// Sunrise and sunset (local hours) for a place, using the NOAA approximation.
function sunTimes(place, date = new Date()) {
  const rad = Math.PI / 180;
  const day = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 864e5);
  const g = 2 * Math.PI / 365 * (day - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const cosH = (Math.cos(90.833 * rad) - Math.sin(place.lat * rad) * Math.sin(decl)) / (Math.cos(place.lat * rad) * Math.cos(decl));
  const ha = Math.acos(Math.min(1, Math.max(-1, cosH))) / rad;
  const utcNow = date.getUTCHours() + date.getUTCMinutes() / 60;
  const offset = Math.round(((localHour() - utcNow + 36) % 24 - 12) * 4) / 4; // time-zone offset in hours
  return { rise: (720 - 4 * (place.lon + ha) - eqt) / 60 + offset, set: (720 - 4 * (place.lon - ha) - eqt) / 60 + offset };
}

// The sky's colour stops, anchored to today's real sunrise and sunset.
function keyframes({ rise, set }) {
  return [[0, 'night'], [rise - 1.2, 'night'], [rise + 0.3, 'dawn'], [rise + 2, 'day'], [set - 1.5, 'day'], [set, 'dusk'], [set + 1.3, 'night'], [24, 'night']];
}

function skyPreset(name) {
  const { rise, set } = sunTimes(base());
  return { dawn: rise + 0.3, day: (rise + set) / 2, dusk: set, night: 23.5 }[name];
}

function paintSky() {
  const h = forcedHour ?? localHour();
  const sunT = sunTimes(base());
  const frames = keyframes(sunT);
  let k = 0;
  while (k < frames.length - 2 && h >= frames[k + 1][0]) k++;
  const [h0, p0] = frames[k], [h1, p1] = frames[k + 1];
  const t = h1 === h0 ? 0 : Math.min(1, Math.max(0, (h - h0) / (h1 - h0)));
  const a = PHASES[p0], b = PHASES[p1], root = document.documentElement.style;
  const v = {};
  for (const key in a) v[key] = mix(a[key], b[key], t);
  const d = darkness(h, sunT);
  // the lake freezes when it's below 0 °C in Vienna
  if (live.frozen) v.lake = mix(v.lake, d > 0.5 ? '#3B4652' : '#E3EDF2', 0.8);
  setData('frozen', live.frozen ? 'yes' : 'no');
  setData('daylight', d < 0.55 ? 'yes' : 'no');
  // clouds grey out the sky; heavy overcast hides stars and northern lights
  if (live.overcast > 0) {
    const grey = mix('#A7B0B8', '#101316', d);
    v.skyTop = mix(v.skyTop, grey, live.overcast * 0.6);
    v.skyBot = mix(v.skyBot, grey, live.overcast * 0.5);
    v.stars *= 1 - live.overcast; v.aurora *= 1 - live.overcast;
  }
  setVar('--cloud', mix(mix('#F7F8FA', '#9AA3AB', live.overcast), '#23272B', d));
  setVar('--fog', mix('#E6E9EC', '#1C1F22', d));
  setVar('--fog-o', live.fog);
  setVar('--sky-top', v.skyTop); setVar('--sky-bot', v.skyBot);
  setVar('--far', v.far); setVar('--mid', v.mid);
  setVar('--snow', v.snow); setVar('--lake', v.lake);
  setVar('--sun', v.sun); setVar('--stars', v.stars);
  setVar('--aurora', v.aurora); setVar('--window', v.window);
  setData('night', v.stars > 0.04 || v.aurora > 0.02 ? 'yes' : 'no');
  const bright = (lum(v.skyTop) + lum(v.skyBot)) / 2 > 0.42;
  setVar('--hero-ink', bright ? '#111111' : '#EDEDED');
  setVar('--hero-soft', bright ? '#3D3D3B' : '#C9C9C6');

  // page colours fade from white to black through twilight where you work
  const isDay = h >= sunT.rise && h < sunT.set;
  applyTheme(d);

  // sun by day, moon by night; both travel along an arc on the right half
  const sun = $('#sun');
  const nightLen = 24 - (sunT.set - sunT.rise);
  const p = isDay ? (h - sunT.rise) / (sunT.set - sunT.rise) : (((h - sunT.set) + 24) % 24) / nightLen;
  if (sun.classList.contains('moon') === isDay) sun.classList.toggle('moon', !isDay);
  const narrow = innerWidth < 760;
  const left = ((narrow ? 20 : 48) + p * (narrow ? 70 : 46)).toFixed(2) + '%', top = ((narrow ? 63 : 62) - Math.sin(p * Math.PI) * (narrow ? 6 : 44)).toFixed(2) + '%';
  if (sun.style.left !== left) sun.style.left = left;
  if (sun.style.top !== top) sun.style.top = top;
  skyHooks.forEach((fn) => fn({ h, d, isDay, sunT }));
}

/* ---------------- day/night page colours ---------------- */
// The accent colour follows the season (and Christmas): [on the white page, on the black page].
// Every pair is readable as text: at least 4.9:1 contrast.
const ACCENTS = {
  spring: ['#B23A6A', '#F29AC0'],     // blossom pink
  summer: ['#8A6100', '#F2C14E'],     // sun yellow
  autumn: ['#B8520F', '#F2A15A'],     // leaf orange
  winter: ['#2B6CA3', '#8CC4EE'],     // icy blue
  christmas: ['#B42318', '#F07A6E'],  // Christmas red
};
function accentPair() {
  const holiday = typeof holidayToday === 'function' ? holidayToday() : null; // holidays live in extras.js
  return ACCENTS[holiday === 'christmas' ? 'christmas' : currentSeason()];
}
const LIGHT = { bg: '#FFFFFF', text: '#111111', edu: '#2C7A68', tree: '#1F3A31' };
const DARK = { bg: '#0A0A0A', text: '#EDEDED', edu: '#7CC4AE', tree: '#0A0A0A' };

// 0 = full daylight, 1 = full night. Fades over roughly an hour of twilight.
function darkness(h, { rise, set }) {
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  return h < (rise + set) / 2 ? 1 - smooth(rise - 0.7, rise + 0.3, h) : smooth(set - 0.3, set + 0.7, h);
}

// Colour mode chosen with the switch in the menu: 'auto' follows daylight, or fixed 'light' / 'dark'
let themeMode = (() => { try { return localStorage.getItem('themeMode') || 'auto'; } catch { return 'auto'; } })();

function applyTheme(d) {
  const root = document.documentElement, st = root.style;
  const pageD = themeMode === 'light' ? 0 : themeMode === 'dark' ? 1 : d;
  const bg = mix(LIGHT.bg, DARK.bg, pageD);
  // the background fades smoothly; text flips where both inks have the same contrast
  const lightInk = lum(bg) < 0.46;
  const ink = lightInk ? DARK : LIGHT;
  setVar('--bg', bg);
  setVar('--text', ink.text);
  const [accentLight, accentDark] = accentPair();
  setVar('--accent', lightInk ? accentDark : accentLight);
  setVar('--accent-night', accentDark); // the terminal is always dark
  setVar('--edu', ink.edu);
  setVar('--muted', mix(ink.text, bg, 0.4));
  setVar('--raised', mix(bg, ink.text, 0.04));
  setVar('--line', mix(bg, ink.text, 0.1));
  setVar('--line-strong', mix(bg, ink.text, 0.2));
  setVar('--tree', mix(LIGHT.tree, DARK.tree, d));
  setData('theme', lightInk ? 'dark' : 'light');
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta.content !== bg) meta.content = bg;
  applySeason(d, bg);
}

/* ---------------- seasons ---------------- */
// ground: [day, night] colour of the foreground; null = same as the page (snow).
const SEASONS = {
  winter: { ground: null, leaves: [] },
  spring: { ground: ['#A9CB86', '#0F150F'], leaves: ['#B5D98F', '#8FC06F', '#D3EBB4'] },
  summer: { ground: ['#86B061', '#0E140C'], leaves: ['#4F8A3A', '#6FA24E', '#3E7432'] },
  autumn: { ground: ['#CDAA70', '#15110C'], leaves: ['#D9642B', '#E8A33D', '#B8412A'] },
};
let forcedSeason = null;

function currentSeason() {
  if (forcedSeason) return forcedSeason;
  const m = +new Intl.DateTimeFormat('en-GB', { timeZone: TZ, month: 'numeric' }).format(new Date());
  return m === 12 || m <= 2 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'autumn';
}

function applySeason(d, bg) {
  const name = currentSeason(), season = SEASONS[name], root = document.documentElement, st = root.style;
  setData('season', name);
  setVar('--ground', season.ground ? mix(season.ground[0], season.ground[1], d) : bg);
  season.leaves.forEach((c, i) => setVar(`--leaf-${i + 1}`, mix(c, '#0C0C0C', d * 0.85)));
  setVar('--flower-o', (1 - d * 0.75).toFixed(2));
  // real rain or snow wins over the seasonal decoration
  weather.set(live.particle || { winter: 'snow', autumn: 'leaves', spring: 'petals', summer: d > 0.6 ? 'fireflies' : null }[name], season.leaves, d);
}

/* ---------------- weather particles (rain, snow, leaves, petals, fireflies) ---------------- */
// Speeds are in pixels per second, so it looks the same on 60 Hz and 120 Hz screens.
const weather = (() => {
  const cv = $('#weather'), ctx = cv.getContext('2d');
  let kind = null, parts = [], splashes = [], palette = [], visible = true, raf = 0, last = 0, W = 0, H = 0, night = 1;
  const COUNTS = { snow: 110, leaves: 26, petals: 16, fireflies: 34, rain: 180, drizzle: 90 };

  function resize(force) {
    const w = cv.clientWidth, h = cv.clientHeight;
    // phones resize the page when the address bar slides; ignore small height changes
    if (!force && Math.abs(w - W) < 2 && Math.abs(h - H) < 120) return;
    const r = Math.min(devicePixelRatio || 1, 1.5);
    W = w; H = h;
    cv.width = Math.round(w * r); cv.height = Math.round(h * r);
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }

  function spawn(p, anywhere) {
    p.x = Math.random() * (W + 100); p.y = anywhere ? Math.random() * H : -30 - Math.random() * 60;
    p.phase = Math.random() * 6.28;
    if (kind === 'rain' || kind === 'drizzle') {
      const heavy = kind === 'rain';
      p.z = Math.random() < 0.5 ? 0 : Math.random() < 0.6 ? 1 : 2;          // far, middle, near
      p.vy = (heavy ? 620 : 260) * (0.7 + p.z * 0.35) * (0.9 + Math.random() * 0.2);
      p.len = (heavy ? 9 : 5) + p.z * (heavy ? 7 : 3);
      p.ground = H * (0.84 + Math.random() * 0.15);                         // where near drops splash
    } else if (kind === 'snow') {
      p.r = 0.8 + Math.random() * 2.2; p.vy = 16 + p.r * 16;
    } else if (kind === 'leaves' || kind === 'petals') {
      p.s = kind === 'leaves' ? 4 + Math.random() * 4 : 2.5 + Math.random() * 2;
      p.vy = 28 + Math.random() * 40; p.rot = Math.random() * 6; p.vr = (Math.random() - 0.5) * 3;
      p.c = kind === 'leaves' ? palette[Math.floor(Math.random() * palette.length)] : ['#F6C7D6', '#FFFFFF', '#F3B6CA'][Math.floor(Math.random() * 3)];
    } else if (kind === 'fireflies') {
      p.y = H * (0.62 + Math.random() * 0.36); p.vx = (Math.random() - 0.5) * 18; p.vy = (Math.random() - 0.5) * 12;
    }
    return p;
  }

  // light rain on a dark sky, darker blue-grey rain on a bright daytime sky
  const rainColor = (a) => `rgba(${Math.round(mix(78, 205, night))}, ${Math.round(mix(96, 214, night))}, ${Math.round(mix(118, 228, night))}, ${a})`;

  function drawRain(dt, t) {
    const wind = -0.16;
    for (let z = 0; z < 3; z++) {
      ctx.beginPath();
      for (const p of parts) {
        if (p.z !== z) continue;
        p.y += p.vy * dt; p.x += p.vy * wind * dt;
        const landed = z === 2 ? p.y > p.ground : p.y > H + 20;
        if (landed) {
          if (z === 2 && splashes.length < 40) splashes.push({ x: p.x, y: p.ground, age: 0 });
          spawn(p, false);
        }
        ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.len * wind, p.y - p.len);
      }
      ctx.strokeStyle = rainColor([0.22, 0.38, 0.55][z]);
      ctx.lineWidth = [0.8, 1, 1.4][z];
      ctx.stroke();
    }
    // tiny splashes where the near drops hit the ground
    ctx.beginPath();
    splashes = splashes.filter((s) => (s.age += dt) < 0.3);
    for (const s of splashes) {
      const k = s.age / 0.3, rx = 2 + k * 6;
      ctx.moveTo(s.x + rx, s.y); ctx.ellipse(s.x, s.y, rx, rx * 0.3, 0, Math.PI, 0);
    }
    ctx.strokeStyle = rainColor(0.35); ctx.lineWidth = 0.8; ctx.stroke();
  }

  function frame(t) {
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    ctx.clearRect(0, 0, W, H);
    if (kind === 'rain' || kind === 'drizzle') drawRain(dt, t);
    else if (kind === 'snow') {
      ctx.beginPath();
      for (const p of parts) {
        p.y += p.vy * dt; p.x += Math.sin(t / 1400 + p.phase) * 20 * dt;
        if (p.y > H + 10) spawn(p, false);
        ctx.moveTo(p.x + p.r, p.y); ctx.arc(p.x, p.y, p.r, 0, 6.29);
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; ctx.fill();
    } else if (kind === 'fireflies') {
      for (const p of parts) {
        p.x += (p.vx + Math.sin(t / 900 + p.phase) * 12) * dt; p.y += (p.vy + Math.cos(t / 1100 + p.phase) * 9) * dt;
        if (p.x < 0 || p.x > W || p.y < H * 0.55 || p.y > H) spawn(p, true);
        ctx.globalAlpha = Math.max(0, Math.sin(t / 600 + p.phase)) ** 3;
        ctx.fillStyle = '#F4E27A'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 6.29); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      for (const p of parts) {
        p.y += p.vy * dt; p.x += Math.sin(t / 1400 + p.phase) * 50 * dt; p.rot += p.vr * dt;
        if (p.y > H + 12) spawn(p, false);
        const a = p.rot + Math.sin(t / 700 + p.phase) * 0.6;
        ctx.setTransform(Math.cos(a) * cvScale, Math.sin(a) * cvScale, -Math.sin(a) * cvScale, Math.cos(a) * cvScale, p.x * cvScale, p.y * cvScale);
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.5, 0, 0, 6.29); ctx.fill();
      }
      ctx.setTransform(cvScale, 0, 0, cvScale, 0, 0);
    }
    raf = requestAnimationFrame(frame);
  }
  let cvScale = 1;
  function restart() {
    cancelAnimationFrame(raf); raf = 0; last = 0;
    cvScale = cv.width / Math.max(1, W);
    ctx.clearRect(0, 0, W, H);
    if (!kind || !visible || reduceMotion) return;
    raf = requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); }).observe(cv);
  addEventListener('resize', () => { const before = W; resize(false); if (W !== before) { parts.forEach((p) => spawn(p, true)); restart(); } });
  resize(true);
  return {
    set(next, colors = [], darkness = 1) {
      night = darkness;
      if (next === kind && colors.join() === palette.join()) return;
      kind = next; palette = colors;
      const n = kind ? Math.round(COUNTS[kind] * (innerWidth < 760 ? 0.6 : 1)) : 0;
      parts = Array.from({ length: n }, () => spawn({}, true));
      splashes = [];
      restart();
    },
  };
})();

function renderStars() {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const layers = ['', '', '', ''];
  for (let i = 0; i < 140; i++) {
    const x = rnd() * 1440, y = rnd() * 360, r = 0.4 + rnd() * 1.2, o = 0.4 + rnd() * 0.6;
    const layer = rnd() < 0.3 ? 1 + Math.floor(rnd() * 3) : 0; // 30% twinkle, split over three layers
    layers[layer] += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(2)}" opacity="${o.toFixed(2)}"/>`;
  }
  $('#starfield').innerHTML = layers.map((c, i) =>
    `<svg class="${i ? `tw tw${i}` : ''}" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMin slice">${c}</svg>`).join('');
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

  // deciduous trees: green in spring and summer, orange in autumn, hidden in winter
  let leafy = '';
  [60, 150, 205, 330, 470, 540, 690, 760, 840, 1000, 1070, 1300, 1390].forEach((x, i) => {
    const y = (x > 930 ? 447 : groundY(x)) + 2, h = 24 + rnd() * 18, r = h * 0.34;
    leafy += `<rect class="trunk" x="${x - 1.5}" y="${y - h * 0.45}" width="3" height="${h * 0.45}"/>` +
      `<circle class="l${(i % 3) + 1}" cx="${x}" cy="${y - h * 0.62}" r="${r.toFixed(1)}"/>` +
      `<circle class="l${((i + 1) % 3) + 1}" cx="${x + r * 0.55}" cy="${y - h * 0.5}" r="${(r * 0.72).toFixed(1)}"/>`;
  });
  $('#leafy').innerHTML = leafy;

  // spring flowers in the foreground meadow
  let flowers = '';
  for (let i = 0; i < 90; i++) {
    const x = Math.round(10 + rnd() * 900), gy = groundY(x), y = gy + 8 + rnd() * (512 - gy - 8), c = 1 + Math.floor(rnd() * 4), r = 1.3 + rnd() * 1.1;
    flowers += `<g class="f${c}" transform="translate(${x} ${y.toFixed(1)})">` +
      [0, 72, 144, 216, 288].map((a) => `<circle cx="${(Math.cos(a * Math.PI / 180) * r * 1.3).toFixed(2)}" cy="${(Math.sin(a * Math.PI / 180) * r * 1.3).toFixed(2)}" r="${r.toFixed(2)}"/>`).join('') +
      `<circle class="c" r="${(r * 0.8).toFixed(2)}"/></g>`;
  }
  $('#flowers').innerHTML = flowers;
}

// On phones, squeeze the view slightly so both the Alps and the Swedish lake fit
function fitLandscape() {
  const narrow = innerWidth < 760;
  document.querySelectorAll('.landscape').forEach((svg) => {
    svg.setAttribute('viewBox', narrow ? '180 60 1260 460' : '0 0 1440 520');
    svg.setAttribute('preserveAspectRatio', narrow ? 'none' : 'xMidYMax slice');
  });
}

/* ---------------- hero text ---------------- */
let specialGreeting = () => null; // extras.js sets this on Christmas, Easter and Midsommar

// Greeting in English, German and Swedish
function greeting(h) {
  if (h < 5) return 'Still up? · Noch wach? · Fortfarande vaken?';
  if (h < 11) return 'Good morning · Guten Morgen · God morgon.';
  if (h < 17) return 'Hello · Servus · Hej.';
  if (h < 22) return 'Good evening · Guten Abend · God kväll.';
  return 'Good night · Gute Nacht · God natt.';
}

let clockPaused = false; // the time-lapse shows its own time
function tickClock() {
  if (clockPaused) return;
  const now = new Date();
  $('#clock').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
  $('#clock').dateTime = now.toISOString();
  $('#greet').textContent = specialGreeting() || greeting(localHour());
  $('#cities').textContent = base().city;
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

// Career trail: the horizontal axis is time. Each role starts at a waypoint and its
// duration is shaded under the line; the selected role is highlighted.
function yearValue(y) {
  if (y !== 'now') return +y;
  const d = new Date();
  return d.getFullYear() + (d - new Date(d.getFullYear(), 0, 1)) / 3.156e10;
}

function renderProfile() {
  const svg = $('#profile');
  const W = 1000, H = 300, low = 232, high = 78, pad = 24;
  // every career and education entry, keyed 'job-0', 'edu-2', …
  const entries = [
    ...SITE.education.map((w, i) => ({ w, k: `edu-${i}`, type: 'edu', a: yearValue(w.from), b: yearValue(w.to) })),
    ...SITE.cv.map((w, i) => ({ w, k: `job-${i}`, type: 'job', a: yearValue(w.from), b: yearValue(w.to) })),
  ];
  const y0 = Math.min(...entries.map((r) => r.a)) - 0.7, y1 = yearValue('now') + 0.6;
  const X = (y) => pad + ((y - y0) / (y1 - y0)) * (W - 2 * pad);
  const nowX = X(yearValue('now'));

  // a gently rising trail with a few natural bumps
  const pts = [];
  for (let x = 0; x <= W; x += 50) {
    const t = x / W;
    pts.push({ x, y: low - t * (low - high) + 10 * Math.sin(t * 11) + 5 * Math.sin(t * 29 + 1) });
  }
  const line = smoothPath(pts);
  const area = `${line} L${W},${H} L0,${H} Z`;

  // height of the trail at a given x, read from the drawn path
  svg.innerHTML = `<path class="trail" d="${line}"/>`;
  const trail = svg.querySelector('.trail'), total = trail.getTotalLength();
  const yAt = (x) => { let lo = 0, hi = total; for (let k = 0; k < 28; k++) { const m = (lo + hi) / 2; if (trail.getPointAtLength(m).x < x) lo = m; else hi = m; } return trail.getPointAtLength(lo).y; };

  const grad = (id, color) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="${high - 20}" x2="0" y2="${H}">
      <stop offset="0" style="stop-color: var(${color}); stop-opacity: .55"/><stop offset="1" style="stop-color: var(${color}); stop-opacity: 0"/></linearGradient>`;
  let g = `<defs>
    <clipPath id="underTrail"><path d="${area}"/></clipPath>
    <clipPath id="pastTrail"><rect x="0" y="0" width="${nowX.toFixed(1)}" height="${H}"/></clipPath>
    <clipPath id="futureTrail"><rect x="${nowX.toFixed(1)}" y="0" width="${W}" height="${H}"/></clipPath>
    ${grad('fillJob', '--accent')}${grad('fillEdu', '--edu')}
  </defs>
  <path class="area" d="${area}"/>`;

  // the time axis along the bottom
  const step = y1 - y0 > 12 ? 2 : 1, thisYear = Math.floor(yearValue('now'));
  for (let y = Math.ceil(y0 / step) * step; y <= thisYear; y += step) {
    g += `<line class="tick" x1="${X(y)}" x2="${X(y)}" y1="${H - 22}" y2="${H - 16}"/><text class="axis" x="${X(y)}" y="${H - 4}">${y}</text>`;
  }

  // durations, shaded under the line in the colour of their type
  entries.forEach((r) => {
    g += `<rect class="span ${r.type}" data-k="${r.k}" x="${X(r.a).toFixed(1)}" y="0" width="${(X(r.b) - X(r.a)).toFixed(1)}" height="${H - 24}" clip-path="url(#underTrail)" fill="url(#${r.type === 'job' ? 'fillJob' : 'fillEdu'})"/>`;
  });

  // solid up to today, dashed for the path ahead (the hiker walks the invisible full trail)
  g += `<path class="trail-ahead" d="${line}" clip-path="url(#futureTrail)"/><path class="trail-past" d="${line}" clip-path="url(#pastTrail)"/><path class="trail" d="${line}"/>`;

  // legend
  g += `<g class="legend"><circle class="lg-job" cx="8" cy="14" r="5"/><text x="20" y="18">Career</text>
    <path class="lg-edu" d="M92 9 l5 5 -5 5 -5 -5 Z"/><text x="104" y="18">Education</text></g>`;

  // start markers: career above the line (circle), education below (diamond)
  const latest = Math.max(...SITE.cv.map((w) => yearValue(w.from)));
  const jobStarts = new Set(SITE.cv.map((w) => w.from));
  entries.forEach((r) => {
    const x = X(r.a), y = yAt(x), job = r.type === 'job';
    const label = `${r.w.from} to ${r.w.to}: ${r.w.title}`;
    g += `<g class="wp ${r.type}" data-k="${r.k}" data-x="${x.toFixed(1)}" tabindex="0" role="button" aria-label="${esc(label)}">
      ${job && r.a === latest ? `<path class="summit" d="M${x} ${y - 40} l7 12 h-14 Z"/>` : ''}
      ${job ? `<circle class="ring" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7"/><circle class="core" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5"/>`
            : (() => { const d = jobStarts.has(r.w.from) ? 11 : 6; // bigger when a job starts the same year, so it frames the circle
                return `<path class="diamond" d="M${x.toFixed(1)} ${(y - d).toFixed(1)} l${d} ${d} ${-d} ${d} ${-d} ${-d} Z"/>`; })()}
      <text x="${x.toFixed(1)}" y="${(job ? y - 17 : y + 24).toFixed(1)}">${esc(r.w.from)}</text></g>`;
  });
  svg.innerHTML = g;

  svg.querySelectorAll('.wp').forEach((el) => {
    const k = el.dataset.k, span = svg.querySelector(`.span[data-k="${k}"]`);
    el.addEventListener('click', () => selectEntry(k));
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectEntry(k); } });
    el.addEventListener('mouseenter', () => span.classList.add('hover'));
    el.addEventListener('mouseleave', () => span.classList.remove('hover'));
  });
}

// small row of links under an entry: [['Label', 'url'], …]
function linkRow(links) {
  if (!links || !links.length) return '';
  return `<span class="entry-links">${links.map(([label, url]) =>
    `<a href="${esc(url)}"${url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(label)}${url.startsWith('http') ? '<svg class="i" aria-hidden="true"><use href="#i-out"/></svg>' : ''}</a>`).join('')}</span>`;
}

// Education: a vertical route, newest at the top
function renderEducation() {
  $('#eduList').innerHTML = SITE.education.map((e, i) => ({ e, i })).reverse().map(({ e, i }) => `
    <li data-k="edu-${i}">
      <span class="tl-years">${esc(e.from)}–${esc(e.to)}</span>
      <div class="tl-body">
        <h3>${esc(e.title)}</h3>
        <p class="tl-org">${esc(e.org)} <span class="tl-place">${esc(e.place)}</span></p>
        ${e.text ? `<p class="tl-text">${esc(e.text)}</p>` : ''}
        ${e.award ? `<p class="award"><svg class="i" aria-hidden="true"><use href="#i-award"/></svg>${esc(e.award)}</p>` : ''}
        ${linkRow(e.links)}
      </div>
    </li>`).join('');
  $('#eduList').querySelectorAll('li').forEach((li) => li.addEventListener('click', (ev) => { if (!ev.target.closest('a')) selectEntry(li.dataset.k); }));
}

// Publications grouped by year, your name in bold
function renderPublications() {
  const years = [...new Set(SITE.publications.map((p) => p.year))].sort((a, b) => b - a);
  const bold = (authors) => esc(authors).replace(esc(SITE.me), `<strong>${esc(SITE.me)}</strong>`);
  $('#pubList').innerHTML = years.map((y) => `
    <div class="pub-year">
      <h3>${y}</h3>
      <ol>${SITE.publications.filter((p) => p.year === y).map((p) => `
        <li>
          <a class="pub-title" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a>
          <p class="pub-authors">${bold(p.authors)}</p>
          <p class="pub-venue"><span class="pub-type">${esc(p.type)}</span> ${esc(p.venue)}</p>
        </li>`).join('')}</ol>
    </div>`).join('');
  $('#scholarLink').href = SITE.scholar;
}

// The table is the readable CV; the profile above is its map.
function renderCvTable() {
  const rows = SITE.cv.map((w, i) => ({ w, i })).reverse();
  $('#cvTable tbody').innerHTML = rows.map(({ w, i }) => `
    <tr data-k="job-${i}">
      <td class="years">${esc(w.from)}–${esc(w.to)}</td>
      <td><span class="role">${esc(w.title)}</span><span class="org">${esc(w.org)}</span><span class="note">${esc(w.text)}</span>${linkRow(w.links)}</td>
      <td class="where">${esc(w.place)}</td>
    </tr>`).join('');
  $('#cvTable tbody').querySelectorAll('tr').forEach((tr) => tr.addEventListener('click', () => selectEntry(tr.dataset.k)));
  selectWaypoint(SITE.cv.length - 1);
}

const waypointHooks = []; // extras.js: the hiker walks to the selected waypoint
// Select a career ('job-1') or education ('edu-3') entry: highlights its marker, its shaded period
// and its row in the Career table or Education list.
function selectEntry(k) {
  waypointHooks.forEach((fn) => fn(k));
  document.querySelectorAll('#profile .wp, #profile .span, #cvTable tbody tr, #eduList li')
    .forEach((el) => el.classList.toggle('active', el.dataset.k === k));
}
const selectWaypoint = (i) => selectEntry(`job-${i}`); // career stage by number (terminal: waypoint 1…)

/* ---------------- skills, projects, contact ---------------- */
const external = (url) => url.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
const iconOut = '<svg class="i" aria-hidden="true"><use href="#i-out"/></svg>';
const iconDown = '<svg class="i" aria-hidden="true"><use href="#i-down"/></svg>';

function renderContent() {
  // [Text](url) → link
  const linkify = (t) => esc(t).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);
  $('#heroLines').innerHTML = SITE.headline.map((l) => `<span>${linkify(l)}</span>`).join('');
  $('#heroPlace').textContent = SITE.location;
  $('#nowText').textContent = SITE.now.text;
  const [ny, nm] = SITE.now.updated.split('-').map(Number);
  $('#nowDate').textContent = `Updated ${new Date(ny, nm - 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' })}`;

  $('#skillList').innerHTML = Object.entries(SITE.skills).map(([group, items]) =>
    `<dt>${esc(group)}</dt><dd>${items.map(esc).join(', ')}</dd>`).join('');

  $('#projectList').innerHTML = SITE.projects.map((p) =>
    `<li><a href="${esc(p.url)}"${external(p.url)}>
      <span class="name">${esc(p.name)}${p.url.startsWith('http') ? iconOut : ''}</span>
      <span class="desc">${esc(p.text)}</span>
      <span class="where">${esc(p.where)}</span></a></li>`).join('');

  $('#contactLinks').innerHTML = [
    [`mailto:${SITE.email}`, 'Email'],
    [SITE.linkedin, 'LinkedIn'],
    [SITE.scholar, 'Google Scholar'],
    [SITE.github, 'GitHub'],
    [SITE.bluesky, 'Bluesky'],
    [SITE.x, 'X (Twitter)'],
    ['contact.vcf', 'Add to contacts'],
  ].map(([href, label]) => `<li><a href="${esc(href)}"${external(href)}${href.startsWith('mailto:') ? ` title="${esc(SITE.email)}"` : ''}>${label}${href.endsWith('.vcf') ? iconDown : iconOut}</a></li>`).join('');

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
  <b class="warn">education</b>     schools and degrees
  <b class="warn">papers</b>        publications
  <b class="warn">waypoint</b> &lt;n&gt;  details of one stage
  <b class="warn">skills</b>        equipment check
  <b class="warn">projects</b>      marked routes
  <b class="warn">contact</b>       send a signal
  <b class="warn">now</b>           what I'm up to
  <b class="warn">weather</b>       live weather in Vienna
  <b class="warn">sun</b>           sunrise and sunset
  <b class="warn">moon</b>          tonight's moon
  <b class="warn">sky</b> &lt;mode&gt;    dawn | day | dusk | night | live
  <b class="warn">season</b> &lt;name&gt;  winter | spring | summer | autumn | live
  <b class="warn">holiday</b> &lt;name&gt; christmas | easter | midsommar | live
  <b class="warn">riddle</b>        for the curious
  <b class="warn">smlm</b>          point the microscope at the stars (clear nights only)
  <b class="warn">badges</b>        what you've discovered so far
  <b class="warn">iss</b>           where the space station is right now
  <b class="warn">timelapse</b>     a whole day in 20 seconds (or: timelapse year)
  <b class="warn">download cv</b>   the official PDF
  <b class="warn">goto</b> &lt;place&gt;   about | timeline | cv | education | publications | skills | projects | contact
  <b class="warn">fika</b>          mandatory break
  <b class="warn">clear</b>, <b class="warn">exit</b>
Tip: Tab completes, ↑ repeats. Some commands are not listed.`,

  whoami: () => `${esc(SITE.name)}
Role: ${esc(SITE.role)}
Based in: ${esc(base().city)}, ${esc(base().country)}.`,

  whereami: () => `Position fix acquired:
  ${esc(base().city)}, ${esc(base().country)}   ${fmtCoord(base())}
Local time: ${$('#clock').textContent}`,

  now: () => `${esc(SITE.now.text)}\n<span class="cmd">${esc($('#nowDate').textContent)}</span>`,

  'route cv': () => {
    const rows = SITE.cv.map((w, i) => `  ${i === SITE.cv.length - 1 ? '<span class="warn">▲</span>' : '●'} ${(w.from + '–' + w.to).padEnd(10)} ${esc(w.title)}`).reverse();
    return `Career trail (summit on top):\n${rows.join('\n  │\n')}\n\nType <b class="warn">waypoint 1</b>…<b class="warn">waypoint ${SITE.cv.length}</b> for details.`;
  },

  waypoint: (arg) => {
    const i = parseInt(arg, 10) - 1, w = SITE.cv[i];
    if (!w) return `<span class="warn">Unknown waypoint.</span> Pick 1 to ${SITE.cv.length}.`;
    selectWaypoint(i);
    return `WPT ${String(i + 1).padStart(2, '0')} · ${esc(w.from)}–${esc(w.to)}
${esc(w.title)} @ ${esc(w.org)} (${esc(w.place)})
${esc(w.text)}`;
  },

  education: () => 'Education route:\n' + [...SITE.education].reverse().map((e) =>
    `  ${(e.from + '–' + e.to).padEnd(10)} ${esc(e.title)}\n  ${''.padEnd(10)} <span class="cmd">${esc(e.org)}</span>`).join('\n'),

  papers: () => `Publications (${SITE.publications.length}):\n` + SITE.publications.map((p) =>
    `  ${p.year}  <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a>\n        <span class="cmd">${esc(p.type)}, ${esc(p.venue)}</span>`).join('\n') +
    `\nAll on <a href="${esc(SITE.scholar)}" target="_blank" rel="noopener">Google Scholar</a>.`,

  skills: () => 'Equipment check:\n' + Object.entries(SITE.skills).map(([g, items]) => `  [<span class="ok">✓</span>] ${esc(g)}: ${items.map(esc).join(', ')}`).join('\n'),

  projects: () => 'Marked routes:\n' + SITE.projects.map((p, i) => `  WPT ${String(i + 1).padStart(2, '0')}  <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>  ${esc(p.text)}`).join('\n'),

  contact: () => `Sending signal…
  mail      <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
  linkedin  <a href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">${esc(SITE.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}</a>
  github    <a href="${esc(SITE.github)}" target="_blank" rel="noopener">${esc(SITE.github.replace(/^https?:\/\//, ''))}</a>
  scholar   <a href="${esc(SITE.scholar)}" target="_blank" rel="noopener">Google Scholar</a>
  bluesky   <a href="${esc(SITE.bluesky)}" target="_blank" rel="noopener">@sebjbauer.bsky.social</a>
  x         <a href="${esc(SITE.x)}" target="_blank" rel="noopener">@sebjbauer</a>`,

  sky: (arg) => {
    if (arg === 'live' || !arg) { forcedHour = null; paintSky(); return `Sky synced to the real time in ${esc(base().city)}.`; }
    if (!['dawn', 'day', 'dusk', 'night'].includes(arg)) return 'Usage: sky dawn | day | dusk | night | live';
    forcedHour = skyPreset(arg); paintSky();
    return `Sky set to ${arg}. ${arg === 'night' ? 'Look north for the northern lights.' : ''}Scroll up to see it.`;
  },

  season: (arg) => {
    if (arg === 'live' || !arg) { forcedSeason = null; paintSky(); return `Season synced to the calendar: ${currentSeason()}.`; }
    if (!(arg in SEASONS)) return 'Usage: season winter | spring | summer | autumn | live';
    forcedSeason = arg; paintSky();
    return { winter: 'Snow is falling. Scroll up.', spring: 'The first flowers are out. Scroll up.', summer: 'Long summer days. At night, look for fireflies.', autumn: 'Leaves are falling. Scroll up.' }[arg];
  },

  sun: () => {
    const place = base(), { rise, set } = sunTimes(place);
    const up = localHour() >= rise && localHour() < set;
    return `${esc(place.city)} today: sunrise ${fmtHour(rise)}, sunset ${fmtHour(set)}.
The sun is ${up ? 'up, so this site is in light mode' : 'down, so this site is in dark mode'}.`;
  },

  'download cv': () => { const a = document.createElement('a'); a.href = SITE.cvPdf; a.download = ''; a.click(); return `Downloading <a href="${esc(SITE.cvPdf)}">${esc(SITE.cvPdf)}</a>…`; },
  goto: (arg) => { if (!['about', 'timeline', 'cv', 'education', 'publications', 'skills', 'projects', 'contact'].includes(arg)) return 'Usage: goto about | timeline | cv | education | publications | skills | projects | contact'; setTimeout(() => goTo(arg), 300); return `Navigating to ${arg}…`; },

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
    print(`GPS-TRAIL v1.0 · satellites: 7 <span class="warn">▂▄▆█</span>
Position fix: ${esc(base().city)} ${fmtCoord(base())}
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
    if (hits.length === 1) input.value = hits[0] + (['waypoint', 'sky', 'goto', 'season', 'holiday'].includes(hits[0]) ? ' ' : '');
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

function tickCoords() { $('#gpsCoords').textContent = fmtCoord(base()); }

/* ---------------- colour-mode switch ---------------- */
const MODE_INFO = {
  auto: ['i-auto', 'automatic (follows daylight in Vienna)'],
  light: ['i-sun', 'always light'],
  dark: ['i-moon', 'always dark'],
};
function showThemeMode() {
  const [icon, text] = MODE_INFO[themeMode];
  const btn = $('#themeBtn');
  btn.querySelector('use').setAttribute('href', `#${icon}`);
  btn.setAttribute('aria-label', `Colour mode: ${text}`);
  btn.title = `Colour mode: ${text}`;
}
$('#themeBtn').addEventListener('click', () => {
  themeMode = { auto: 'light', light: 'dark', dark: 'auto' }[themeMode];
  try { localStorage.setItem('themeMode', themeMode); } catch { /* private mode */ }
  showThemeMode();
  paintSky();
});
showThemeMode();

/* ---------------- boot ---------------- */
// ?card renders the clean 1200 × 630 scene used for the link-preview image (og-image.png)
if (new URLSearchParams(location.search).has('card')) document.documentElement.classList.add('card');
const skyParam = new URLSearchParams(location.search).get('sky');
if (['dawn', 'day', 'dusk', 'night'].includes(skyParam)) forcedHour = skyPreset(skyParam);
const seasonParam = new URLSearchParams(location.search).get('season');
if (seasonParam in SEASONS) forcedSeason = seasonParam;

renderStars();
renderTrees();
fitLandscape();
paintSky();
tickClock();
renderProfile();
renderEducation();
renderCvTable();
renderPublications();
renderContent();
tickCoords();
// the first colours are in place: allow smooth fades from now on
setTimeout(() => document.documentElement.classList.remove('preload'), 150);
setInterval(paintSky, 30000);
// tick the clock exactly on each new second
setTimeout(() => { tickClock(); setInterval(tickClock, 1000); }, 1000 - (Date.now() % 1000));
// only react to real width changes (not the phone's address bar sliding in and out)
let lastWidth = innerWidth, resizeTimer = 0;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (innerWidth !== lastWidth) { lastWidth = innerWidth; fitLandscape(); paintSky(); } }, 150);
});
// pause every hero animation while the hero is scrolled out of view
new IntersectionObserver(([e]) => $('.hero').classList.toggle('off', !e.isIntersecting)).observe($('.hero'));
addEventListener('scroll', () => $('.nav').classList.toggle('scrolled', scrollY > innerHeight * 0.6), { passive: true });
