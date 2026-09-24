/* =====================================================================
   NOTES: short posts written as Markdown files in the notes/ folder.
   Used by the home page (list of notes) and note.html (one note).

   To publish a note:
   1. Create notes/my-note.md starting with:
        ---
        title: The title
        date: 2026-10-01
        summary: One sentence shown in the list.
        ---
        Your text in Markdown…
   2. Add "my-note.md" to notes/notes.json.
   ===================================================================== */

const escNote = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Split "--- key: value --- body" into { meta, body }
function parseNote(text) {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  m[1].split('\n').forEach((line) => { const i = line.indexOf(':'); if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim(); });
  return { meta, body: m[2] };
}

// All notes listed in notes/notes.json, newest first
async function loadNotes() {
  const files = await (await fetch('notes/notes.json', { cache: 'no-cache' })).json();
  const notes = await Promise.all(files.map(async (file) => {
    const { meta, body } = parseNote(await (await fetch(`notes/${file}`, { cache: 'no-cache' })).text());
    return { slug: file.replace(/\.md$/, ''), file, title: meta.title || file, date: meta.date || '', summary: meta.summary || '', body };
  }));
  return notes.sort((a, b) => b.date.localeCompare(a.date));
}

const noteDate = (d) => d ? new Date(`${d}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

// A small Markdown renderer: headings, paragraphs, lists, quotes, code, links, images, bold, italic
function renderMarkdown(md) {
  const inline = (t) => escNote(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => `<a href="${url}"${/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  let para = [], list = null, quote = [];
  const flush = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
    if (list) { out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`); list = null; }
    if (quote.length) { out.push(`<blockquote>${inline(quote.join(' '))}</blockquote>`); quote = []; }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      flush();
      const code = [];
      while (++i < lines.length && !lines[i].startsWith('```')) code.push(lines[i]);
      out.push(`<pre><code>${escNote(code.join('\n'))}</code></pre>`);
    } else if (/^#{1,3}\s/.test(line)) {
      flush();
      const level = line.match(/^#+/)[0].length + 1; // # → h2 (the note title is the h1)
      out.push(`<h${level}>${inline(line.replace(/^#+\s*/, ''))}</h${level}>`);
    } else if (/^(-{3,}|\*{3,})\s*$/.test(line)) { flush(); out.push('<hr>'); }
    else if (/^\s*[-*]\s+/.test(line)) { if (para.length || quote.length || (list && list.tag !== 'ul')) flush(); list = list || { tag: 'ul', items: [] }; list.items.push(line.replace(/^\s*[-*]\s+/, '')); }
    else if (/^\s*\d+\.\s+/.test(line)) { if (para.length || quote.length || (list && list.tag !== 'ol')) flush(); list = list || { tag: 'ol', items: [] }; list.items.push(line.replace(/^\s*\d+\.\s+/, '')); }
    else if (/^>\s?/.test(line)) { if (para.length || list) flush(); quote.push(line.replace(/^>\s?/, '')); }
    else if (!line.trim()) flush();
    else { if (list || quote.length) flush(); para.push(line.trim()); }
  }
  flush();
  return out.join('\n');
}
