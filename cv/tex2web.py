#!/usr/bin/env python3
"""Turn cv/cv.tex into cv-data.js for the website.

The CV is the single source: career, education, publications, talks, service,
extracurricular activities and skills are all read from cv.tex. Website-only
details (links, cities for the map, a different text) are added in cv.tex with
\\web{field}{value}, \\weblink{Label}{URL} and \\webonly{...}, which print nothing
in the PDF.

Run from the repository root:  python3 cv/tex2web.py
(The GitHub Action runs it on every push; the output file is not committed.)
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'cv' / 'cv.tex', ROOT / 'cv-data.js'
ME = 'S. Bauer'
COUNTRY = {'Sweden': 'SE', 'Austria': 'AT', 'Germany': 'DE', 'United Kingdom': 'UK'}
PUB_TYPE = {'J': 'Journal article', 'P': 'Preprint', 'C': 'Conference abstract'}
warnings = []


# ---------------------------------------------------------------- reading LaTeX
def strip_comments(s):
    return re.sub(r'(?<!\\)%.*', '', s)


def group(s, i):
    """Return (content, end) of the {...} group starting at s[i] (after optional whitespace)."""
    while s[i].isspace():
        i += 1
    if s[i] != '{':
        raise ValueError(f'expected {{ at: {s[i:i + 40]!r}')
    depth, j = 0, i
    while True:
        if s[j] == '\\':
            j += 2
            continue
        depth += {'{': 1, '}': -1}.get(s[j], 0)
        if depth == 0:
            return s[i + 1:j], j + 1
        j += 1


def args(s, i, n):
    out = []
    for _ in range(n):
        a, i = group(s, i)
        out.append(a)
    return out, i


def unwrap_webonly(s):
    """\\webonly{X} → X, so website-only entries are read like any other."""
    while (m := re.search(r'\\webonly(?![a-zA-Z])', s)):
        inner, end = group(s, m.end())
        s = s[:m.start()] + inner + s[end:]
    return s


# ---------------------------------------------------------------- LaTeX → text
ACCENT = {"'": '\u0301', '"': '\u0308', '`': '\u0300', '^': '\u0302', '~': '\u0303', 'c': '\u0327'}
MATH = {r'^+': '⁺', r'^-': '⁻', r'\beta': 'β', r'\alpha': 'α', r'\gamma': 'γ', r'\mu': 'μ', r'\cdot': '·', r'\times': '×'}


def plain(s):
    s = s.replace(r'\me', ME)
    s = re.sub(r'\$([^$]*)\$', lambda m: ''.join(MATH.get(t, t) for t in re.findall(r'\\[a-zA-Z]+|\^.|.', m.group(1))), s)
    while (m := re.search(r'\\href(?![a-zA-Z])', s)):  # \href{url}{text} → text
        (_, text), end = args(s, m.end(), 2)
        s = s[:m.start()] + text + s[end:]
    while (m := re.search(r'\\emph(?![a-zA-Z])', s)):  # \emph{title} → “title”
        text, end = group(s, m.end())
        s = s[:m.start()] + '“' + text + '”' + s[end:]
    s = re.sub(r'\\(textbf|textit|textsc|mbox|text|nolinkurl|url)(?![a-zA-Z])', '', s)
    s = re.sub(r'\\([\'"`^~]|c )\{?([a-zA-Z])\}?', lambda m: m.group(2) + ACCENT[m.group(1).strip()], s)
    for a, b in [('\\&', '&'), ('\\%', '%'), ('\\_', '_'), ('\\#', '#'), ('\\ ', ' '), ('\\,', '\u2009'), ('\\\\', ' '),
                 ('---', '—'), ('--', '–'), ('``', '“'), ("''", '”'), ('~', ' ')]:
        s = s.replace(a, b)
    s = re.sub(r'\\(small|footnotesize|normalfont|scshape|bfseries|itshape|hfill|quad|enspace)(?![a-zA-Z])', '', s)
    for cmd in re.findall(r'\\[a-zA-Z]+', s):
        warnings.append(f'unknown command {cmd} dropped in: {s.strip()[:60]}')
    s = re.sub(r'\\[a-zA-Z]+', '', s).replace('{', '').replace('}', '')
    return unicodedata.normalize('NFC', re.sub(r'\s+', ' ', s).strip())


def place(loc):
    """'Stockholm, Sweden' → 'Stockholm, SE'"""
    parts = [p.strip() for p in loc.split(',')]
    if len(parts) > 1 and parts[-1] in COUNTRY:
        parts[-1] = COUNTRY[parts[-1]]
    return ', '.join(parts)


def years(dates):
    """'Nov 2023 -- present (exp. Mar 2028)' → ('2023', 'now'); '2021--23' → ('2021', '2023')"""
    d = plain(dates)
    ys = re.findall(r'\b(\d{4}|\d{2})\b', d.split('(')[0])
    if not ys or len(ys[0]) != 4:
        return None, None
    a = ys[0]
    b = 'now' if re.search(r'present|now', d) else ys[1] if len(ys) > 1 else a
    if len(b) == 2:
        b = a[:2] + b
    return a, b


def cap(s):
    return s[:1].upper() + s[1:]


# ---------------------------------------------------------------- parsing
def parse(tex):
    body = unwrap_webonly(strip_comments(tex).split(r'\begin{document}', 1)[1])
    data = {'education': [], 'cv': [], 'publications': [], 'talks': [], 'extracurricular': [], 'skills': {}}
    section, pubtype, last = '', 'Journal article', None
    token = re.compile(r'\\(section|entry|details|weblink|web|pub|talk|award|organised|activity|begin\{publist\}|begin\{tabularx\})(?![a-zA-Z])')
    i = 0
    while (m := token.search(body, i)):
        cmd, i = m.group(1), m.end()
        if cmd == 'section':
            (name,), i = args(body, i, 1)
            section, last = plain(name), None
        elif cmd == 'begin{publist}':
            t = re.match(r'\[label=\{\[([A-Z])', body[i:])
            pubtype = PUB_TYPE.get(t.group(1), 'Publication') if t else 'Publication'
        elif cmd == 'entry':
            (title, dates, org, loc), i = args(body, i, 4)
            a, b = years(dates)
            last = {'from': a, 'to': b, 'title': plain(title), 'org': plain(org), 'place': place(plain(loc)), 'text': ''}
            data['education' if section == 'Education' else 'cv'].append(last)
        elif cmd == 'details':
            (text,), i = args(body, i, 1)
            if last is not None:
                last['text'] = plain(text)
        elif cmd == 'pub':
            (authors, title, venue, doi), i = args(body, i, 4)
            v = plain(venue)
            last = {'year': 0, 'type': pubtype, 'title': plain(title), 'authors': plain(authors)}
            if (j := re.match(r'^(.*?)\s+(\d+)\(([^)]+)\),\s*([^,]+),\s*(\d{4})$', v)):
                last.update(journal=j[1], volume=j[2], issue=j[3], pages=j[4], year=int(j[5]))
            elif (j := re.match(r'^(.*?),\s*(\d{4})$', v)):
                last.update(journal=j[1], year=int(j[2]))
            else:
                warnings.append(f'could not read the venue "{v}"')
            if doi.strip():
                last['doi'] = doi.strip()
            data['publications'].append(last)
        elif cmd == 'talk':
            (year, kind, title, event, city), i = args(body, i, 5)
            last = talk(data, year, kind, title, event, city)
        elif cmd == 'award':
            (year, title, event, city), i = args(body, i, 4)
            last = talk(data, year, 'Award', title, event, city)
        elif cmd == 'organised':
            (year, role, event, city), i = args(body, i, 4)
            last = talk(data, year, 'Organisation', role, event, city)
        elif cmd == 'activity':
            (dates, role, org, city, text), i = args(body, i, 5)
            a, b = years(dates)
            last = {'years': plain(dates), 'from': a, 'to': b, 'title': plain(role), 'org': plain(org),
                    'place': plain(city), 'text': plain(text)}
            data['extracurricular'].append(last)
        elif cmd == 'weblink':
            (label, url), i = args(body, i, 2)
            last.setdefault('links', []).append([plain(label), url.strip()])
        elif cmd == 'web':
            (field, value), i = args(body, i, 2)
            field, value = field.strip(), plain(value)
            if field == 'section':  # move the entry above to another part of the website
                for lst in data.values():
                    if isinstance(lst, list) and last in lst:
                        lst.remove(last)
                data[{'career': 'cv'}.get(value, value)].append(last)
            else:
                last[field] = int(value) if field == 'year' else value
        elif cmd == 'begin{tabularx}' and section.startswith('Skills'):
            table = body[i:body.index(r'\end{tabularx}', i)]
            for g, items in re.findall(r'\\textbf\{([^}]*)\}\s*&(.*?)(?:\\\\|$)', table, re.S):
                data['skills'][plain(g)] = [x.strip() for x in split_top(plain(items)) if x.strip()]

    # merge several roles at the same event (a talk and an award, say) into one entry
    talks = []
    for t in data['talks']:
        same = next((u for u in talks if u['year'] == t['year'] and u['where'] == t['where']), None)
        if same:
            same.setdefault('roles', [{'type': same.pop('type'), 'title': same.pop('title')}])
            same['roles'].append({'type': t['type'], 'title': t['title']})
            for k in ('url', 'city'):
                if t.get(k) and not same.get(k):
                    same[k] = t[k]
        else:
            talks.append(t)
    data['talks'] = talks

    # the website lists careers and degrees oldest first, publications newest first
    order = lambda w: (int(w['from'] or 0), 9999 if w['to'] == 'now' else int(w['to'] or 0))
    for k in ('cv', 'education'):
        for w in data[k]:
            w.pop('years', None)
        data[k].sort(key=order)
    # activities newest first (by when they ended), like in the PDF
    data['extracurricular'].sort(key=lambda w: order({'from': w['to'], 'to': w['from']}), reverse=True)
    for w in data['extracurricular']:
        w.pop('from', None)
        w.pop('to', None)
    data['publications'].sort(key=lambda p: -p['year'])
    for k in ('cv', 'education', 'extracurricular'):
        for w in data[k]:
            w.setdefault('text', '')
    return data


def talk(data, year, kind, title, event, city):
    t = {'year': int(plain(year)[:4]), 'type': kind, 'title': plain(title), 'where': cap(plain(event))}
    if city.strip():
        t['city'] = plain(city)
    data['talks'].append(t)
    return t


def split_top(s):
    """split at commas and semicolons that are not inside brackets"""
    out, depth, cur = [], 0, ''
    for ch in s:
        depth += {'(': 1, ')': -1}.get(ch, 0)
        if ch in ',;' and depth == 0:
            out.append(cur)
            cur = ''
        else:
            cur += ch
    return out + [cur]


def main():
    data = parse(SRC.read_text(encoding='utf-8'))
    OUT.write_text('// Generated from cv/cv.tex by cv/tex2web.py. Do not edit this file: edit cv.tex instead.\n'
                   f'window.CV_DATA = {json.dumps(data, ensure_ascii=False, indent=1)};\n', encoding='utf-8')
    for w in warnings:
        print('warning:', w, file=sys.stderr)
    n = {k: len(v) for k, v in data.items()}
    print(f'cv-data.js: {n}')


if __name__ == '__main__':
    main()
