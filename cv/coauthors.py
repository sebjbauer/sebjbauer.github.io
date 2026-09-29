"""Where my co-authors are: builds coauthors.json for the map in the Publications section.

Only the papers in cv.tex count (OpenAlex mixes up people called Sebastian Bauer, so searching by
name or ORCID would pull in other people's papers). For every paper with a DOI, OpenAlex lists the
authors and the institutions they were at when the paper came out; each institution has
coordinates. Co-authors are grouped by city: institutions less than 25 km apart share one pin
(Solna counts as Stockholm). Co-authors in Stockholm belong to my own pin.

Run after tex2web.py (it reads cv-data.js). The GitHub Action runs it on every push and once a
week, so new papers show up by themselves. If OpenAlex can't be reached, the old file is kept and
the build goes on.

    python3 cv/coauthors.py
"""
import json
import math
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ME = 'Sebastian Bauer'
MY_ORCID = '0009-0009-7265-1527'
HOME = {'name': 'Stockholm', 'country': 'SE', 'lat': 59.3629, 'lon': 18.0582}  # Stockholm University / SciLifeLab
MERGE_KM = 25       # institutions closer than this share a pin
MAX_AUTHORS = 40    # leave out papers by huge consortia, they would flood the map
API = 'https://api.openalex.org'


def get(url, tries=3):
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'sebjbauer.github.io co-author map'})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if k == tries - 1:
                raise
        except Exception:
            if k == tries - 1:
                raise
        time.sleep(2 * (k + 1))


def km(a, b):
    p1, p2 = math.radians(a['lat']), math.radians(b['lat'])
    dp, dl = p2 - p1, math.radians(b['lon'] - a['lon'])
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 6371 * 2 * math.asin(math.sqrt(h))


def main():
    src = (ROOT / 'cv-data.js').read_text(encoding='utf-8')
    data = json.loads(re.search(r'=\s*(\{.*\})\s*;?\s*$', src, re.S).group(1))
    papers = [(i, p['doi']) for i, p in enumerate(data['publications']) if p.get('doi')]

    places = [{**HOME, 'home': True, 'institutions': {}, 'people': {}}]
    geo_cache = {}

    def place_for(inst_id):
        if inst_id not in geo_cache:
            inst = get(f"{API}/institutions/{inst_id.rsplit('/', 1)[-1]}?select=display_name,geo") or {}
            g = inst.get('geo') or {}
            geo_cache[inst_id] = (inst.get('display_name'), g) if g.get('latitude') is not None else (None, None)
        name, g = geo_cache[inst_id]
        if not name:
            return None, None
        pos = {'lat': g['latitude'], 'lon': g['longitude']}
        for pl in places:
            if km(pl, pos) < MERGE_KM:
                return pl, name
        pl = {'name': g.get('city') or name, 'country': g.get('country_code') or '', **pos, 'institutions': {}, 'people': {}}
        places.append(pl)
        return pl, name

    for index, doi in papers:
        work = get(f"{API}/works/doi:{urllib.parse.quote(doi)}?select=authorships")
        if not work or len(work['authorships']) > MAX_AUTHORS:
            continue
        for a in work['authorships']:
            person = a.get('author') or {}
            name = person.get('display_name') or ''
            if name == ME or (person.get('orcid') or '').endswith(MY_ORCID):
                continue
            seen = set()
            for inst in a.get('institutions') or []:
                pl, inst_name = place_for(inst['id'])
                if not pl:
                    continue
                pl['institutions'][inst_name] = pl['institutions'].get(inst_name, 0) + 1
                if id(pl) in seen:  # two institutions in the same city: count the person once
                    continue
                seen.add(id(pl))
                entry = pl['people'].setdefault(name, [])
                if index not in entry:
                    entry.append(index)

    out = {
        'updated': time.strftime('%Y-%m-%d'),
        'places': [{
            'name': pl['name'], 'country': pl['country'], 'lat': round(pl['lat'], 4), 'lon': round(pl['lon'], 4),
            **({'home': True} if pl.get('home') else {}),
            # the institutions there, most co-authors first
            'institutions': [n for n, _ in sorted(pl['institutions'].items(), key=lambda kv: -kv[1])],
            # each co-author with the papers (index into the publication list) we wrote together
            'people': [{'name': n, 'papers': sorted(p)} for n, p in sorted(pl['people'].items(), key=lambda kv: (-len(kv[1]), kv[0].split()[-1]))],
        } for pl in places if pl['people'] or pl.get('home')],
    }
    (ROOT / 'coauthors.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    total = len({p['name'] for pl in out['places'] for p in pl['people']})
    print(f"coauthors.json: {total} co-authors in {len(out['places'])} places")


if __name__ == '__main__':
    try:
        main()
    except Exception as e:  # no network or OpenAlex down: keep the old file, don't break the build
        print(f'coauthors.py: skipped ({e})', file=sys.stderr)
