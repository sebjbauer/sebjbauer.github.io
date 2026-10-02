# Hidden features and live details

A private cheat sheet for everything on the website that isn't obvious at first glance.
This file is not part of the website (see `_config.yml`), it only lives in the repository.

**Quick preview:** add settings to the address to see any combination, for example
`https://sebjbauer.github.io/?sky=night&season=winter&holiday=christmas&weather=snow&star`

| Setting | Values |
|---|---|
| `sky` | `dawn`, `day`, `dusk`, `night` |
| `season` | `winter`, `spring`, `summer`, `autumn` |
| `holiday` | `christmas`, `easter`, `midsommar`, `none` |
| `weather` | `clear`, `cloudy`, `rain`, `drizzle`, `snow`, `storm`, `fog`, `frost` (clear and below 0 °C: frozen lake), `rainbow` (sun after rain), `icing` (a few cold days: ice creeping out from the shore), `windy` (strong westerly: smoke streams sideways) |
| `star` | no value; shows a shooting star right after loading |
| `smlm` | no value; runs the microscope stars right away (needs `sky=night`) |
| `ride`, `penguin`, `birds` | no value; sends out the cyclist, the penguin or the birds right away |
| `triathlon`, `xc`, `plane`, `bbq`, `fishing`, `swim` | no value; starts the triathlon, the cross-country / roller skier, a plane, the penguin's barbecue, ice fishing (use with `weather=frost`) or the jetty swim right away |
| `iss` | no value; shows a pretend ISS pass across the sky (needs `sky=night`) |
| `card` | no value; the clean 1200 × 630 scene used for the link-preview image |
| `timelapse` | `day` or `year`; plays the time-lapse right after loading |
| `fika` | no value; the hiker takes a coffee break whatever the time |

These only change what *you* see in that browser tab. Normal visitors always get the live version.

### Ready-made preview links

| Scene | Link |
|---|---|
| Clear night with a shooting star | https://sebjbauer.github.io/?sky=night&weather=clear&star |
| The deer at dusk | https://sebjbauer.github.io/?sky=dusk&weather=clear |
| Sunrise | https://sebjbauer.github.io/?sky=dawn&weather=clear |
| Winter snowfall by day | https://sebjbauer.github.io/?sky=day&season=winter&weather=clear |
| Spring flowers | https://sebjbauer.github.io/?sky=day&season=spring&weather=clear |
| Summer sun | https://sebjbauer.github.io/?sky=day&season=summer&weather=clear |
| Summer night with fireflies | https://sebjbauer.github.io/?sky=night&season=summer&weather=clear |
| Autumn leaves | https://sebjbauer.github.io/?sky=day&season=autumn&weather=clear |
| Christmas | https://sebjbauer.github.io/?sky=night&season=winter&holiday=christmas&weather=snow |
| Easter | https://sebjbauer.github.io/?sky=day&season=spring&holiday=easter&weather=clear |
| Midsommar | https://sebjbauer.github.io/?sky=day&season=summer&holiday=midsommar&weather=clear |
| Rain | https://sebjbauer.github.io/?sky=day&weather=rain |
| Thunderstorm at night | https://sebjbauer.github.io/?sky=night&weather=storm |
| Fog in the morning | https://sebjbauer.github.io/?sky=dawn&weather=fog |
| Microscope stars | https://sebjbauer.github.io/?sky=night&weather=clear&smlm |
| Frozen lake with ice skater | https://sebjbauer.github.io/?sky=day&season=winter&weather=frost |
| Penguin walk | https://sebjbauer.github.io/?sky=day&weather=clear&penguin |
| Cyclist | https://sebjbauer.github.io/?sky=day&weather=clear&ride |
| Ducks in summer | https://sebjbauer.github.io/?sky=day&season=summer&weather=clear |
| Migrating birds | https://sebjbauer.github.io/?sky=day&season=autumn&weather=clear&birds |
| Triathlon | https://sebjbauer.github.io/?sky=day&season=summer&weather=clear&triathlon |
| Cross-country skier | https://sebjbauer.github.io/?sky=day&season=winter&weather=frost&xc |
| Roller skier | https://sebjbauer.github.io/?sky=day&season=autumn&weather=clear&xc |
| Plane by day / at night | https://sebjbauer.github.io/?sky=day&weather=clear&plane · https://sebjbauer.github.io/?sky=night&weather=clear&plane |
| Penguin at the barbecue | https://sebjbauer.github.io/?sky=day&weather=clear&bbq |
| Rainbow | https://sebjbauer.github.io/?sky=day&season=summer&weather=rainbow |
| ISS pass (pretend) | https://sebjbauer.github.io/?sky=night&weather=clear&iss |
| Link-preview scene | https://sebjbauer.github.io/?card&sky=dusk&weather=clear&season=summer |
| A day in 20 seconds | https://sebjbauer.github.io/?weather=clear&timelapse=day |
| A year in 20 seconds | https://sebjbauer.github.io/?weather=clear&timelapse=year |

If a link still shows an older version, press **Cmd + Option + R** in Safari (or open a private window) to skip the browser's saved copy.

---

## The live sky

Everything at the top of the page follows the real conditions in **Vienna** (set by `workBase` in `script.js`).

**Moving back to Stockholm:** in `script.js` change `workBase: 'at'` to `workBase: 'se'`. That one word moves everything: the time zone and clock, the live weather (and with it snow, rain, frost, ice, wind and smoke), the sun, twilight and light summer nights, the moon, the stars and their positions, light/dark mode, the location under your name, and the texts that name the city (terminal, ISS, badges). Two things in `index.html` are written out by hand and should be updated too: the page description / link-preview text ("guest researcher at AITHYRA in Vienna") and `addressLocality` in the Google data block. `contact.vcf` has the city in its address and note, too.

- **Time of day:** the sky follows the real height of the sun above (or below) the horizon for the place and day, calculated, not fixed. Full daylight above 12°, dawn and dusk colours around the horizon, and full night only once the sun is 12° below it. So twilight is short in winter and long in summer, and where the sun never sinks that far (Stockholm around midsummer, -7°) the night stays light: a deep blue sky with a glow in the north and only a few stars. Vienna gets properly dark even in June. Backstage: *light summer night* shows a Stockholm midsummer night.
- **Sun and moon:** the sun travels across the sky during the day, the moon at night. Behind clouds they fade: fully visible up to half cloud cover, gone when it's overcast, raining, snowing or foggy. The sun climbs as high as it really does where you are: all the way up only at midsummer noon, low all day in winter (in Vienna about 65° in June, 18° in December; in Stockholm 54° and 7°).
- **Shadows:** the cottage, the sauna and the snowman cast soft shadows from the real sun: long in the morning and evening and all winter day, short at summer noon; to the right when the sun is low on the left in the morning, towards you around noon, to the left in the evening. Faint on the water and bluish on snow. The sun has to be out: full shadows up to about a quarter cloud cover, fading to none at 85% cloud, and none in rain, snow or fog. Preview: `?sky=dawn` / `?sky=dusk` on a clear day.
- **Moon phase:** the moon shows its real shape for that night (crescent, half, gibbous, full).
- **Moon position:** the moon rises and sets at its real times where you are and climbs as high as it really does (low-precision lunar theory, as in the SunCalc library). When it's up during the day it shows as a pale day moon (e.g. a waning moon in the morning, opposite the rising sun). Clouds hide it; the moonlight path on the lake only appears while it's up. Terminal `moon` also tells today's moonrise, moonset and its height right now.
- **Stars:** they appear after sunset and some twinkle.
- **Northern lights:** faint green light over the Swedish side of the landscape, at night only.
- **Clock:** "It's 21:05:19 in Vienna." ticks every second and handles summer and winter time automatically.
- **Greeting:** changes with the time of day, in English, German and Swedish ("Good morning · Guten Morgen · God morgon.").

## Light and dark mode

- **Switch in the menu** (the half-filled circle next to Terminal): automatic → always light → always dark. The browser remembers the visitor's choice. Automatic is the default.

- The whole page is **white while the sun is up in Vienna** and **black after dark**.
- It doesn't switch at once: the background fades from white through grey to black over about an hour around sunset, and back around sunrise.
- The text flips from black to white once, at the point where white becomes easier to read.
- The GPS terminal always stays dark.

## Seasonal accent colour

The accent colour (links, the career trail, highlights, the terminal prompt) follows the season, in a darker shade on the white page and a lighter one at night. All are readable as text (at least 4.9:1 contrast).

| When | Colour | On white | On black |
|---|---|---|---|
| Spring (Mar–May) | blossom pink | `#B23A6A` | `#F29AC0` |
| Summer (Jun–Aug) | sun yellow | `#8A6100` | `#F2C14E` |
| Autumn (Sep–Nov) | leaf orange | `#B8520F` | `#F2A15A` |
| Winter (Dec–Feb) | icy blue | `#2B6CA3` | `#8CC4EE` |
| Christmas (24–26 Dec) | red | `#B42318` | `#F07A6E` |

The colours are in `ACCENTS` in `script.js`. The education green stays the same all year.

## Time-lapse

Terminal `timelapse`: a whole day in 20 seconds, midnight to midnight: stars and northern lights, sunrise, the page turning white, sunset, back to night, with the clock and greeting following along. `timelapse year`: winter, spring, summer, autumn in 20 seconds, each with its own landscape, snow, petals or leaves and accent colour. Afterwards everything returns to the real time.

## Real weather

Checked every 15 minutes (free Open-Meteo service, no key needed).

| Weather in Vienna | What the site shows |
|---|---|
| Cloudy | Clouds drift across the sky, the sky turns greyer, stars and northern lights fade |
| Drizzle / rain | Light or heavy rain falls |
| Snow | Snow falls, in any season |
| Thunderstorm | Rain plus a lightning flash every 6 to 18 seconds |
| Fog | Mist rises from the valley |
| Cold days | The lake freezes gradually, from the last week of real temperatures: after frosty days ice creeps out from the shore (a white band along the edges), and only after several days of frost does it freeze over (icy colour, cracks, skater, hockey). Mild days melt it again. |
| Wind | Rain slants with the real wind (slope = wind speed over the speed the drops fall at, so drizzle slants more than rain), snow and falling leaves drift far sideways because they fall slowly, and the hot-air balloon can only go where the wind takes it (right in a westerly, left in an easterly, faster in more wind). Chimney and sauna smoke drift downwind with the real wind direction and strength (the view faces north, so a westerly blows it to the right); on calm days it rises straight up, in strong wind it streams almost sideways. |
| Rain in the last 3 hours, now dry and not too cloudy | A rainbow behind the Alps (daytime only) |

Real rain or snow replaces the seasonal leaves or petals.

## Seasons

Based on the date in Vienna.

| Season | Months | What changes |
|---|---|---|
| Winter | Dec–Feb | Snow falls, the ground is white snow, leafy trees are bare (hidden) |
| Spring | Mar–May | Light green meadow, small flowers, fresh green trees, drifting blossom petals |
| Summer | Jun–Aug | Green meadow, the sun gets slowly turning rays, fireflies at night |
| Autumn | Sep–Nov | Golden meadow, orange and red trees, falling leaves |

## Holidays

| Holiday | When | What appears |
|---|---|---|
| Christmas | 24–26 December | Decorated Christmas tree with a star next to the cottage, blinking lights on the cottage roof, greeting "Merry Christmas · Frohe Weihnachten · God jul." |
| Easter Sunday | Calculated each year (2026: 5 April, 2027: 28 March) | Coloured eggs and a bunny in the meadow, greeting "Happy Easter · Frohe Ostern · Glad påsk." |
| Midsommar | Swedish Midsummer Eve (Friday 19–25 June) and the Saturday after | Flower-covered maypole next to the cottage, greeting "Happy Midsummer · Glad midsommar!" |

## Phones: swipe and zoom the whole scene

On phones the whole scene (sky, sun, moon, stars, aurora, clouds, birds, landscape) is shown about 40% at a time (drawn 20% narrower than its true proportions, which you hardly notice, so there's less to swipe), starting at the cottage end. Only the text stays where it is.
- **Swipe sideways** to look around (with a little momentum); up and down still scroll the page, and a swipe never counts as a tap. The first time, the view nudges a little to show that it moves.
- **Pinch** with two fingers to zoom in (up to 2×, the ground stays at the bottom) and out again. While the fingers move, the picture is only scaled (smooth); the scene is laid out at the new size once when they lift.
- **The camera follows the penguin:** when it heads out (kayak, sauna, swim, …), the view glides along to keep it in sight. Swipe yourself and it lets you look wherever you like until the next outing.
- **Backstage glides there:** on the phone, backstage scenes move the view to where they happen (the cyclist, the owl, the rowing boat, the snowman, …) and keep the moving ones in sight for a while.
- Rain, snow, fog, lightning and the window frost stay fixed to the screen (they're in front of you, not in the scene).
- Technically: everything except the text and the screen-fixed layers is in one `.world` layer, wider than the screen on phones and slid with a GPU transform (`setPan`, `setZoom`, `camFollow` in script.js). Map landscape units to the screen with `landMatrix()` / `screenToLand()` / `landXOf()`, never getScreenCTM (Safari ignores CSS transforms there).

## Things visitors can find and click

- **Shooting stars:** at night, one crosses the sky every 15 to 50 seconds. Clicking it "catches" it ("Make a wish."). The browser remembers how many each visitor has caught.
- **The cottage:** a red stuga with a green front door and two white-framed windows with window boxes. The door opens whenever the penguin goes in or out. Clicking the cottage switches its light and chimney smoke on or off (no message). On its own, the light is on in the evening, and the chimney smokes in the evening and in autumn and winter.
- **The deer:** a small roe deer (rådjur), red-brown in summer and grey-brown in winter, with a white rump patch. It appears at the forest edge only at **dusk and dawn**, and sometimes lowers its head to graze. Clicking it makes it bound off into the forest (it comes back after 90 seconds).
- **The Timeline section (mountain trail):** from 2008 to today, above the Career and Education sections. Orange circles (year above the line) mark where each job starts, green diamonds (year below) where each degree starts; a bigger diamond around a circle means both started that year. Every period is shaded faintly under the line; clicking a marker, a Career entry or an Education entry highlights that period. The line turns dashed after today.
- **Headlamp:** after dark, the hiker wears a small headlamp with a soft beam.
- **Fika:** from 15:00 to 15:15 Vienna time, the hiker sits down on the trail with a steaming cup of coffee.
- **Career and Education routes:** both are the same dotted vertical route, newest at the top (orange waypoints for jobs, green for degrees). A job that starts while another is still going (the AITHYRA guest position during the PhD) branches off the route to the side; if it ends while the other goes on, it curves back into the route. The branches are placed with the months from `cv.tex` (or `\web{months}{Sep 2016 -- Jun 2017}` for entries with only years), but the website only shows years. Clicking an entry fills its waypoint and colours its stretch of the route.
- **The hiker:** a small figure with an orange backpack walks along the trail to the latest job when the Career section comes into view. Hovering over or clicking any marker makes them walk there.

- **Tap the landscape, the penguin does the job:** tapping a thing sends the penguin (if it's not out already):
  - **Sauna:** a whole sauna session. When the lake is frozen (or mostly), the cold plunge is through the hole in the ice; otherwise it walks to the jetty, jumps off the end, swims round the moored kayak and climbs out by the sauna (straight from the shore while a triathlon has the jetty). Tapping during the session gives a big puff of steam (badge *Löyly*).
  - **Woodpile or chopping block:** chops wood. **Blueberry bushes** (July–August): picks them. **Chanterelles** (autumn): picks them. **Autumn leaves:** rakes them (and jumps in). **Window boxes:** waters them. **Moored kayak** (summer, open water, no triathlon): a paddle. **Grill:** a barbecue. **Snowy path:** shovels it.
  - **Beaver lodge:** the beaver swims out (open water only; badge *Busy beaver*). **Pie on the sill:** a slice disappears. **Visiting penguins** (World Penguin Day): the one you tap hops.
  - Every jump into the water (from the jetty, into the hole in the ice, from the shore) is a **cannonball**: tucked up into a ball, a high arc, a big splash and a ring of waves.
  - **Jetty:** a swim on summer days (or 20 °C and warmer), a belly slide when the lake is frozen. **Frozen lake:** out onto the ice, taking turns between a belly slide, ice fishing and a snow angel.
  - If the penguin is already out (or a triathlon has the jetty), the job waits and starts as soon as it can (up to 90 seconds). Things only react while they're there (blueberries in July and August, chanterelles and leaves in autumn, the kayak in summer, …).
  - On phones the drawing is squeezed sideways, so the things are only a few pixels wide: a tap that misses one by up to 24 px still counts (the nearest one is used).
  - Five different jobs: badge *Errand runner*.

## How the penguin decides what to do (the rules)

Everything that sends the penguin out (its own daily life, your taps, backstage) goes through one scheduler (`goOut` in gadgets.js):
1. **One outing at a time.**
2. **Its own outings** (sauna on cold days, chanterelles in autumn, …) are skipped while it's out, or while something you asked for is waiting.
3. **Taps and backstage wait their turn.** If the penguin is out, your newest request waits (a newer tap replaces it) and starts about a second after the penguin is home, for up to 2 minutes. Tapping the thing that's already happening (or already waiting) does nothing, so a double tap never sends it twice. If a job can't happen yet (the kayak while a triathlon has the jetty), it waits too. Backstage shows a short note when a scene has to wait; `live` drops a waiting job.
4. **Every outing ends cleanly, even after an error:** props away, penguin inside, door shut, kayak moored, axe in the block, sauna off. An outing that runs longer than 3 minutes is ended.
5. **Every tap shows that it arrived:** a small white ring spreads from the thing you tapped.

## Life in the landscape

| What | When |
|---|---|
| **Cyclist** on the valley road | Every 35 to 90 seconds, any season; with a headlight after dark. Dressed for the real weather in Vienna: yellow rain poncho in rain or drizzle, red woolly hat and scarf below 5 °C or in snow, sunglasses on sunny days from 24 °C. Click them to make them tuck ("Aero tuck: about 15% less drag."), and they speed up. A nod to the road-cycling aerodynamics thesis. |
| **Ice skater** | Only when the lake is frozen over, and by day. Steps off the ice while the penguin is out on it or the hockey game is on. Click to make them spin. |
| **Ducks** | Summer, daytime, lake not frozen |
| **Migrating birds** (V formation) | Spring (flying north) and autumn (flying south), daytime, every 45 to 110 seconds |
| **Skier** down the Alpine slope | Winter, daytime, every 20 to 50 seconds |
| **Plane** | Every 70 to 160 seconds (not in heavy cloud): silhouette with a contrail by day, blinking red, green and white navigation lights at night. Click: "Off to explore a new country." |
| **Triathlon** | On summer days (or from 18 °C in other seasons), dry and not frozen, every 3 to 6 minutes: an athlete in an orange cap stands at the end of the jetty, raises their arms and dives in, swims across the lake to the small jetty by the boat ramp, climbs out up its ladder, then the cyclist rides back through the valley, then a runner with a race bib runs along the road. Click an athlete: "Triathlon: 1.5 km swim, 40 km bike, 10 km run." Terminal: `triathlon` starts a race. |
| **Cross-country skier** | Daytime, every 60 to 140 seconds, along the valley road: on long skis across the snow in winter, on roller skis (little wheels) in the other seasons. Click for a line about cross-country skiing. |
| **Barbecue** | A kettle grill next to the cottage (hidden at Christmas, when the tree stands there). **Every third time the penguin comes out**, it walks to the grill, opens the lid and grills for a while (smoke, flipping with a spatula), then goes back in. |
| **Flagpole** by the cottage | The Swedish flag only on 6 June (Sweden's National Day), the Austrian flag only on 26 October (Austria's National Day), between sunrise and sunset (Swedish custom). Every other time the pole is empty. Hidden at Christmas (the tree stands there). Preview: `?flag=se`, `?flag=at`. |
| **Penguin on the ice** | When the lake is frozen, every 45 to 100 seconds it comes out by itself: either a belly slide across the ice, or ice fishing (*pimpelfiske*): it sits at a hole in the ice with a rod until a fish bites, then waddles home. |
| **Jetty and summer swims** | A wooden jetty (*brygga*) on the lake. On hot days (from 25 °C, sunny, not raining), every 1 to 2 minutes the penguin runs along the shore and down the jetty, jumps in and swims back to the cottage. |
| **Penguin** | Every 5th click on the cottage: it walks out, does a loop (swimming if the lake isn't frozen) and goes back in. No message, just the penguin. |

Everything pauses when the top of the page is scrolled out of view.

## The International Space Station

- When the ISS **really** passes over Vienna (more than 10° above the horizon, lit by the sun while Vienna is dark, clear sky), a small steady white light crosses the sky. It's checked every minute at night, and every 5 seconds during a pass. Data: wheretheiss.at (free, no key).
- Clicking the light: "That is the International Space Station: about 420 km up, moving at 27,600 km/h." (badge: Space station)
- Terminal `iss`: where the station is right now (country or ocean, height, speed, distance from Vienna) and whether it's visible from Vienna.

## Tab icon

The icon in the browser tab is the landscape in miniature: blue sky and sun, a snowy Alp, green hills, the red cottage by the lake. It's drawn live: at night the sky turns dark, tonight's real moon phase and a few stars appear, and the cottage window is lit. The static versions (`favicon.svg`, `favicon.ico`, `favicon-32.png`, `icon-192.png`, and `apple-touch-icon.png` for the iPhone home screen) are the day version; Google and browsers without JavaScript use those. Safari always shows the day version: it doesn't update tab icons after the page has loaded, so the live night icon is only for Chrome, Firefox and Edge.

## Publications: copy citation and BibTeX

Under every publication there are two small buttons: **Copy citation** (APA style, e.g. "Edwards, S., …, & Brismar, H. (2026). Title. Nano Letters, 26(4), 1321–1326. https://doi.org/…") and **BibTeX**. Both copy to the clipboard and show "Copied". They're built from the fields in `publications` in `script.js` (journal, volume, issue, pages, doi), so new papers get them automatically.

## Co-author map (Publications)

Above the papers: a map with my pin in Stockholm (orange) and a green pin for every city where at least one co-author was when we wrote a paper together, each joined to Stockholm by a faint arc. Bigger pins mean more co-authors there. Below the map: "26 co-authors · 9 institutions · 3 countries". Tap or click a pin: the caption lists the institutions and the co-authors there (×3 = three papers together), and those papers light up in the list below. Tap again to clear. Hovering a pin (desktop) shows the same as a tooltip.

- **▶ Over time:** a small button in the map's corner. Tap it and the network grows year by year (about 1.4 s per year): my pin first, then each place's arc is drawn and its pin appears in the year of the first paper with someone there. The button shows the year, the caption counts co-authors and papers so far. It only runs when tapped, changes nothing outside the map, and stops when tapped again or when you tap a pin.
- **Where the data comes from:** `cv/coauthors.py` takes the papers with a DOI from cv.tex (via cv-data.js), looks each up in OpenAlex (free, no key), and writes `coauthors.json`. Only papers in cv.tex count, because OpenAlex mixes other people called Sebastian Bauer into my ORCID.
- **Places:** each co-author counts at the institution(s) given on our paper (where they were then). Institutions less than 25 km apart share a pin, so SciLifeLab/KI in Solna and KTH count as Stockholm. Co-authors in Stockholm belong to my pin.
- **When it updates:** the GitHub Action runs the script on every push and every Monday morning (a scheduled run), so a new paper and its co-authors appear by themselves within a week of being in OpenAlex (usually a few days after publication). If OpenAlex can't be reached, the map is simply left out of that build. Note: GitHub pauses scheduled runs after 60 days without any push; any push starts them again.
- **Settings** at the top of `cv/coauthors.py`: my base (`HOME`, now Stockholm), the merge distance (`MERGE_KM`), and `MAX_AUTHORS` (papers with more than 40 authors are left out so a big consortium paper doesn't flood the map).
- **Locally:** `python3 cv/coauthors.py` (the preview server runs it on start). `coauthors.json` is generated, so it's in .gitignore like cv-data.js.

## The 404 page (`404.html`)

Any address on the site that doesn't exist shows this page instead of GitHub's plain error. A white ice plain under a wide sky (polar night in dark mode), mountains on the horizon, a penguin colony on the left, and one penguin that has left the colony and walks towards the mountains, alone (a nod to the lone penguin from Werner Herzog's *Encounters at the End of the World*). It slows down and shrinks with the distance, leaving footprints, and never quite arrives. Tap it and it stops, looks back at you for a moment, and carries on anyway. Text: "This trail doesn't exist", with links back to the start, Publications, Talks and the CV. On phones the whole scene fits the width.

The page is standalone (its own styles, no site scripts) and all links start with `/`, so it works at any depth. GoatCounter counts it as `404/<the missing address>`, so broken links show up in the dashboard. Preview locally: `/404.html` (the local server doesn't show it for missing pages; GitHub Pages does).

## Email

Clicking **Email** in Contact opens the visitor's mail app *and* copies the address, with a short "Address copied" note, for people without a mail app.

**Protected from spam bots:** the address never appears written out in the files the site publishes, so bots that scan pages and files for addresses don't find it. In `script.js` it's stored in two halves joined only when the page runs; the Google data block has no email; `contact.vcf` has no email, and "Add to contacts" adds it in the browser at the moment someone downloads the card; in `cv/cv.tex` (public on GitHub) it's split into `\emailuser` and `\emaildomain`. For people nothing changes: the link, copying, the contact card, the terminal and the PDF all show the full address. The PDF itself does contain it (a CV should), and so does the page once it has run in a browser. To change the address, edit both halves in `script.js` and in `cv.tex`.

## Talks, posters and awards

A section after Publications (and "Talks" in the menu), grouped by year like the publications, with a Talk / Poster / Award label. Fill it in `talks` in `script.js`:

```js
{ year: 2026, type: 'Talk', title: 'Title of the talk', where: 'Conference, City', url: 'https://…' },
```

`url` is optional (slides, poster PDF, programme). If the list is ever empty, the whole section hides itself. Terminal: `talks`.

**Map:** add `city: 'Lisbon'` to an entry (or `city: 'Cambridge, United Kingdom'` when a name exists in several countries) and a pin appears on a map above the list. Several events in the same city share one bigger pin ("Stockholm ×2"); hovering a pin lists the events. The map zooms to fit all pins and stays hidden until the first entry has a city. Coordinates come from Open-Meteo's free place search (remembered in the visitor's browser), the land outlines from Natural Earth; both only load when someone scrolls near the section. Example:

```js
{ year: 2026, type: 'Talk', title: 'SMLMFlow', where: 'Focus on Microscopy 2026', city: 'Lisbon', url: 'https://…' },
```

## Notes (short posts)

A **Notes** section (and "Notes" in the menu) appears on the home page as soon as the first note exists. Each note gets its own page, `note.html?n=<name>`, in the same style, with light/dark following daylight in Vienna and the seasonal accent colour.

**To publish a note:**

1. Create a text file in the `notes/` folder, e.g. `notes/flow-matching.md`, starting like this:

   ```
   ---
   title: What flow matching does for microscopy
   date: 2026-10-01
   summary: One sentence shown in the list on the home page.
   ---
   Your text. **Bold**, *italic*, [a link](https://example.com), `code`.

   # A heading

   - a list
   - of points

   > A quote.

   ![Figure caption](notes/figure.png)
   ```

2. Add the file name to `notes/notes.json`, which is a list: `["flow-matching.md"]`. With several notes: `["flow-matching.md", "second-note.md"]`. The order doesn't matter; the site sorts them by date, newest first.
3. `git add .`, `git commit -m "New note"`, `git push`.

Images go in the `notes/` folder too. Or just send the text to Claude and ask it to publish the note.

## Last updated

The footer shows "Last updated 24 September 2026", the date of the latest push to GitHub. The GitHub Action writes that date into the page when it builds (so visitors never have to ask GitHub's API, which allows only 60 requests an hour per network); the local preview still asks the API, and if that isn't reachable the line is simply left out.

## Visitor statistics (GoatCounter)

The site sends a cookie-free page count to GoatCounter; no personal data, no consent banner needed. Preview links like `?sky=night` are counted as the normal page.

- **Dashboard:** https://sebjbauer.goatcounter.com (visitors per day, which pages, referrers such as LinkedIn or Google, countries, browsers, screen sizes).
- **One-time setup:** create a free account at https://www.goatcounter.com/signup with the code **sebjbauer**. Until the account exists, nothing is counted.
- Visits from `localhost` (testing on your Mac) are not counted.

## Google: who this page is about

Invisible structured data in `index.html` (the `application/ld+json` block, a `ProfilePage` about a `Person`, the form Google recommends for profile pages) tells Google the name, where you work (`worksFor`), positions, affiliations (Stockholm University, SciLifeLab, AITHYRA), alumni of (KTH, TU Wien), Vienna, and the profiles (Google Scholar, LinkedIn, GitHub, Bluesky, X). Update it if positions change. You can test it at https://search.google.com/test/rich-results.

## Research keywords

In About, under "Research": Single-Molecule Localization Microscopy · Flow Matching · Graph Neural Networks. Also given to Google in the structured data. Edit them in `keywords` in `script.js`.

## Link preview

When the link is shared (LinkedIn, WhatsApp, Slack, X, iMessage…), apps show `og-image.jpg`: the landscape at dusk with name, position, "Vienna, Austria" and the web address. The text for the preview is in the `<meta property="og:…">` tags at the top of `index.html`.

- **If your position changes**, the image has to be re-made: ask Claude to "regenerate the link preview image" (it's a snapshot of the `?card` view).
- **LinkedIn remembers old previews** for about a week. To refresh it right away, paste the link into LinkedIn's Post Inspector: https://www.linkedin.com/post-inspector/

## Screensaver

After **one minute** without any mouse movement, scrolling, typing or touching, while the top of the page is on screen, the text and the menu slowly fade out (and the mouse pointer hides): only the live landscape remains. Any input brings everything back. It never starts while someone reads further down the page or while the terminal is open. Preview: `?screensaver` starts it after 3 seconds.

## The microscope stars

Terminal command `smlm` (listed in `help`). **Only on clear nights**: during the day it says the stars aren't out, and when it's cloudy it says there are no stars to image.

The page scrolls to the top, stars start blinking one at a time and each blink leaves a dot, like single-molecule localization microscopy. After about 9 seconds the dots have built up "SB" in the sky; it stays for a few seconds and fades out.

## Trail badges

Terminal command `badges`: shows which of the 38 badges the visitor has found, with hints for the rest. The browser remembers them.

| Badge | How to get it |
|---|---|
| Explorer | Open the GPS terminal |
| Wish maker | Catch a shooting star |
| Norrsken | Solve the riddle |
| Super-resolved | Run `smlm` on a clear night |
| Stoker | Light the stove in the cottage (click it) |
| Penguin friend | Meet the penguin (click the cottage 5 times) |
| Quiet steps | Click the deer |
| Aero tuck | Click the cyclist |
| Thin ice | Click the ice skater |
| Space station | Click the ISS when it passes over Vienna |
| Wanderlust | Click the plane |
| Swim, bike, run | Click the swimmer or the runner in the triathlon |
| Diagonal stride | Click the cross-country or roller skier |
| Grill master | See the penguin at the barbecue (every third outing) |
| Interference | Tap the lake twice so two sets of ripples meet |
| Conway | Run `life` on a clear night |
| Momentum | Run `descend` (the hiker's gradient descent) |
| Self-similar | See the fractal forest (`fractal`, or 3% of visits) |
| Älgvarning | Click the moose on the road |
| Snow day | Click the snowman (its hat hops) |
| Allemansrätten | Poke the campfire by the tent |
| Close encounter | Click the UFO |
| Peekaboo | Click the penguin that pops up under the footer |
| Optimal transport | Run `flow` |
| Up and away | Click the hot-air balloon |
| Birthday wishes | Blow out the candles on the birthday cake (16 November) |
| Night owl | Tap the owl's eyes in the forest at night |
| Sea sparkle | Tap the lake at night (glowing plankton) |
| Cowbell | Click a cow, or type `moo` |
| Face-off | Click a hockey player on the frozen lake |
| Löyly | Tap the sauna during a sauna session (a big puff of steam) |
| Errand runner | Send the penguin on five different jobs by tapping things (sauna, woodpile, grill, kayak, …) |
| Busy beaver | Tap the beaver lodge on the far shore (open water) |
| Orca! | Tap the orca's fin when it crosses the lake (it leaps) |
| Night catch | Click the rowing boat at night (the angler lands a fish) |
| Chalk talk | Run `equation of the day` |
| Airy disk | Run `psf` |
| Time traveller | Run `timelapse` |

## Add to contacts

The last link in Contact downloads `contact.vcf`, a contact card with name, position, email, Vienna, website, LinkedIn, Google Scholar, GitHub, Bluesky, X and a small photo. On a phone it opens straight in Contacts. The file is written by hand: if your details change, ask Claude to regenerate it (or edit it in a text editor).

## The riddle (northern lights on demand)

Found through the terminal: `riddle` (it's in `help`) or `ls` → `riddle.txt`.

> A curtain with no window, green without a leaf.
> I dance above the Swedish forest, but only in the dark.
> Type my Swedish name anywhere on this page,
> and I'll dance for you, even at noon.

- **Hint** (`hint`): "In Swedish, 'norr' means north and 'sken' means glow."
- **Answer:** `norrsken`. Type it anywhere on the page (not in a text field), or in the terminal.
- **What happens:** the sky goes dark and the northern lights dance brightly for 30 seconds, then everything returns to normal.

## The GPS terminal

Open it with the **Terminal ~** link in the menu or by pressing `~`. Close with `exit`, Esc or ×.
Like a real shell: **Tab** completes commands and their options (`sky d` → Tab Tab lists `dawn day dusk`, `goto pu` → `goto publications`); with several matches it fills in what they share, a second Tab lists them. **↑ / ↓** go through earlier commands, which the browser remembers between visits (last 50; the backstage password is never stored); `history` lists them. **Ctrl+C** cancels the line, **Ctrl+L** clears the screen.

**Listed in `help`:**

| Command | What it does |
|---|---|
| `whoami` | Name, role and where you're based |
| `whereami` | Coordinates and local time in Vienna |
| `route cv` | The career trail drawn as text |
| `live` | Back to the real time, season, weather and holiday in one go (also undoes `fractal`). While anything is simulated, an orange **live** button shows in the terminal's header; tap it to do the same. |
| `moo` | All cows stop, lift their heads and look at you (hidden command) |
| `activities` | Swimming, triathlon, tutoring (Beyond the lab) |
| `education` | Schools and degrees, newest first |
| `papers` | All publications with links, plus Google Scholar |
| `waypoint 1` … | Details of one career stage (also highlights it on the page) |
| `skills` | Skills as an "equipment check" |
| `contact` | Email, LinkedIn, GitHub, Google Scholar, ORCID, Bluesky, X |
| `weather` | Live weather in Vienna |
| `weather rain` | Simulates weather (`clear`, `cloudy`, `rain`, `drizzle`, `snow`, `storm`, `fog`, `frost`, `rainbow`); `weather live` goes back |
| `sun` | Today's sunrise and sunset, and whether the site is in light or dark mode |
| `moon` | Tonight's moon phase and days until full moon |
| `sky night` | Changes the sky (`dawn`, `day`, `dusk`, `night`); `sky live` goes back |
| `season winter` | Changes the season; `season live` goes back |
| `holiday christmas` | Shows a holiday (`easter`, `midsommar`); `holiday live` goes back |
| `riddle` | The northern-lights riddle |
| `smlm` | Microscope stars (clear nights only) |
| `badges` | Trail badges found so far |
| `iss` | Where the space station is right now |
| `teaching` | Courses taught and thesis students |
| `talks` | Talks, posters and awards |
| `timelapse` | A whole day in 20 seconds; `timelapse year` for the seasons |
| `triathlon` | Starts a race: swim, bike, run |
| `download cv` | Downloads `cv.pdf` |
| `goto contact` | Scrolls to a section (`about`, `timeline`, `cv`, `education`, `publications`, `talks`, `activities`, `skills`, `contact`) |
| `fika` | Mandatory Swedish coffee break (ASCII art) |
| `clear`, `exit` | Clear the screen, close the terminal |

**Hidden, not in `help`:**

| Command | What it does |
|---|---|
| `ls` | Lists fake files: `about.txt cv.pdf trail.gpx riddle.txt .secret` |
| `cat about.txt` | Prints the About text |
| `cat trail.gpx` | Same as `route cv` |
| `cat riddle.txt` | Same as `riddle` |
| `cat .secret` | Hints that the sky can be controlled with `sky night` |
| `hint` | Hint for the riddle |
| `norrsken` | Answer to the riddle |
| `sudo hire-me` | Fake password prompt, "Access granted", then scrolls to Contact |
| `sudo` anything else | "visitor is not in the sudoers file. Nice try. This incident will be reported to the penguin." |
| `history` | The commands typed so far (also remembered between visits) |
| `hej`, `servus` | Greetings back |
| `rm -rf /` | "Avalanche warning. Permission denied." |

## Speed

Smooth on phones (which redraw up to 120 times a second): the penguin moves on a small layer of its own that the graphics chip slides across the scene, instead of inside the big landscape drawing; the penguin and the figures on the road redraw at most 60 times a second, cows, ducks and the chairlift 16 to 30 times; points along the road and paths are looked up in a table made once instead of measured every frame; and nothing loops endlessly in the landscape when it isn't needed (cow tails swish and the owl blinks now and then, the rowboat drifts with a few updates a second, hidden candles don't flicker). The web fonts load without holding up the first paint (for a split second the text shows in a system font), and the portrait is 560 px and 37 KB (it's shown at up to about 280 px).

## Quality (checked 24 September 2026)

- **Readability:** every text colour keeps at least 4.5:1 contrast at every moment: through twilight, in every season, and over the live sky (a soft shade appears behind the name at dawn and dusk only when needed).
- **Keyboard and screen readers:** a "Skip to content" link appears when pressing Tab; all buttons have names; the photo has a description.
- **Google:** page title "Sebastian Bauer · PhD student in Bioinformatics", a canonical address, `robots.txt` and `sitemap.xml`, plus the structured data described above.
- **Size:** about 115 KB for a first visit (page, styles, scripts, fonts); the photo only loads when scrolling to About.
- **Tested:** all links and DOIs work; the HTML passes the W3C validator; no script errors in Safari's engine (iPhone size) or Chrome.

## CV: one LaTeX file for the PDF and the website

`cv/cv.tex` is the single source. On every push, GitHub compiles it into the PDF **and** reads it into the website (`cv/tex2web.py` → `cv-data.js`): Career, Education, Publications, Talks (and the map), Teaching and supervision, Beyond the lab and Skills all come from it. `script.js` only keeps the hero lines, About, Now, keywords, links and Projects.

- Which section goes where: *Education* → Education; *Research Experience* → Career; *Publications* → Publications (J = journal article, P = preprint, C = conference abstract); *Talks, Posters & Awards* and `\organised` in *Service* → Talks; *Teaching & Supervision* (`\course{2024--}{Course}`, `\thesisstudent{Year}{Student}{Level}{Title}{URL}`) → Teaching and supervision; *Extracurricular Activities* → Beyond the lab; the *Skills & Interests* table → Skills.
- A talk and an award (or organising) with the same year and the same Event text become one entry with several roles (SMLMS 2026, AnDi).
- Website-only extras go right after an entry and print nothing in the PDF: `\weblink{Label}{URL}`, `\web{city}{London, United Kingdom}`, `\web{url}{…}`, `\web{text}{…}` (a different text on the website), `\web{type}{Review}`, `\web{award}{…}`, `\web{section}{career}` (civilian service), `\web{months}{…}` (exact months for the route's branches, never shown), and `\webonly{…}` for whole entries (Matura, "PhD Researcher" in Career, the Master's thesis in Publications).
- **Local preview:** `python3 cv/tex2web.py` regenerates `cv-data.js` (the local preview server runs it on start). It prints a warning for any LaTeX command it doesn't understand.
- If `tex2web.py` fails, the build stops and the site stays at the previous version, just like a LaTeX error.

### The PDF

The CV is written in LaTeX in `cv/cv.tex` (the top of the file explains the three entry commands). **You never upload a PDF yourself:** on every push, GitHub compiles `cv/cv.tex` and publishes the result as https://sebjbauer.github.io/cv.pdf, together with the website (see `.github/workflows/pages.yml`). The "Last updated" date in the CV is the build date.

- Links: **CV** in the menu, "Download the full CV as PDF" under Career, "CV (PDF)" in Contact, and `download cv` in the terminal. All download it as `Sebastian_Bauer_CV.pdf`.
- **To preview locally before pushing:** in the `cv` folder run `latexmk -pdf cv.tex`, then open `cv/cv.pdf`.
- If the CV has a LaTeX error, the build stops and the website stays at the previous version; the red cross in the **Actions** tab shows the error message.
- A push now takes about 2 to 3 minutes to go live (the CV is compiled first).

## Where things live in the code

| What | File |
|---|---|
| Your content (links, location, hero lines; career, education, publications, talks, activities and skills come from cv/cv.tex) | `script.js`, the `SITE` block at the top |
| Sky, light/dark mode, seasons, snow/leaves/rain, main terminal commands | `script.js` |
| Moon, weather, holidays, shooting stars, cottage, hiker, deer, riddle | `extras.js` |
| Microscope stars, penguin, cyclist, skier, birds, ducks, ice skater, badges | `gadgets.js` |
| Contact card | `contact.vcf` |
| Notes: the list of published notes / the notes themselves | `notes/notes.json` / `notes/*.md` |
| Page for a single note, and the Markdown renderer | `note.html`, `notes.js` |
| Link-preview image | `og-image.jpg` |
| For search engines | `robots.txt`, `sitemap.xml` |
| CV source / build script | `cv/cv.tex` / `.github/workflows/pages.yml` |
| CV → website data | `cv/tex2web.py` → `cv-data.js` (generated, not committed) |
| Landscape drawing (mountains, trees, cottage, deer, decorations) | `index.html`, inside the hero section |
| Colours, fonts, layout, animations | `style.css` |

Visitors who turned on "reduce motion" on their device don't get the moving effects (falling particles, shooting stars, walking hiker).

## Science easter eggs (science.js)

Physics, maths, machine learning and biology hidden in the landscape. Nothing pops up; things just behave correctly.

| What | Where / when | Preview |
|---|---|---|
| **Ripples and interference** | Tap the lake: circular waves spread out. Tap a second spot while the first waves are still going and the two sets add up into an interference pattern (badge *Interference*). Not when the lake is frozen. | `?ripples` |
| **Glints and moonlight on the lake** | A column of glints on the water straight below the sun, only when the sun stands above the lake (afternoon and evening); at night a moonlight path when the moon is at least half full. None when it's cloudy, foggy, raining or frozen. | `?sky=day`, `?sky=night` (needs a bright moon) |
| **The sun and moon flatten near the horizon** | Atmospheric refraction bends light from the lower edge more, so both look slightly oval as they rise and set. | `?sky=dawn` |
| **Voronoi ice** | When the lake freezes, the cracks are a Voronoi diagram (every crack is equally far from two points in the ice). New pattern every day. | `?weather=frost` |
| **Fractal forest** | Now and then (3% of visits) every pine is drawn as a fractal: branches made of smaller copies of the tree. Terminal: `fractal` (again to undo). Badge *Self-similar*. | `?fractal` |
| **Game of Life** | Terminal `life` on a clear night: the stars become cells of Conway's Game of Life for ~40 seconds. Badge *Conway*. | `?life&sky=night` |
| **Gradient descent** | Terminal `descend`: the hiker starts at today on the career trail and walks downhill in steps proportional to the slope. It gets stuck in the dip around 2020 (a local minimum), then tries again with momentum and rolls to the lowest point. Badge *Momentum*. | `?descend` |
| **Umbrella from the forecast** | The hiker carries a packed umbrella when the real forecast says ≥60% chance of rain in the next 6 hours, and opens it while it rains. | `?weather=forecast`, `?weather=rain` |
| **SMLM cluster analysis** | The `smlm` microscope show now images molecules in small nanoclusters; after acquisition, DBSCAN (the standard SMLM cluster analysis) colours each cluster, noise stays grey. | `?smlm&sky=night` |
| **Ducklings on a pursuit curve** | Summer days: the mother duck wanders, each duckling always swims straight at the one in front. | `?season=summer&sky=day` |
| **The real northern sky** | The Big Dipper, the Pole Star and Cassiopeia's W are placed where they really are over Vienna at the shown time (sidereal time, the view faces north): the Pole Star 48° up, the Dipper low in the north on autumn evenings and high in spring, both turning around the pole once a day (fast in the time-lapse). | `?sky=night` |
| **Optimal transport flow** | Terminal `flow`: points sampled from a Gaussian are paired one-to-one with points sampled from the letters "SB", using the pairing with the smallest total squared distance (exact optimal transport, solved with the Hungarian algorithm in the browser, about 50 ms). Each point then moves along a straight line (displacement interpolation, the paths OT flow matching learns), with the paths faintly drawn. Badge *Optimal transport*. | backstage: *optimal transport flow* |
| **Frost on the window** | When it's -3 °C or colder in Vienna (live weather), small ice ferns grow in from the two top corners of the page (over the sky only, never over the landscape), like frost on glass: straight needles branching at 60° (ice is hexagonal). The colder it is, the further they reach. They melt away when it warms up. | `?weather=frost` |
| **Boids** | Now and then by day a small flock of songbirds crosses the sky, flocking by Reynolds' three rules (separation, alignment, cohesion). | `?flock` |
| **Geese take turns leading** | The spring/autumn V is now geese (south = left in autumn, north = right in spring); twice per flight the lead goose drops back and another takes over. | `?birds&season=autumn` |
| **Flowers sleep** | Spring flowers close at night and open in the morning (nyctinasty). | `?season=spring&sky=night` |
| **Jumping fish** | Summer dawn and dusk: a fish jumps now and then, with ripples where it leaves and re-enters the water. | `?fish` (every 4 s) |
| **Synchronous fireflies** | Summer nights: every flash nudges nearby fireflies' inner clocks forward (Mirollo–Strogatz), so within a minute they blink in sync. | `?season=summer&sky=night` |
| **Equation of the day** | Terminal `equation of the day` (or just `equation`): one equation a day, printed as LaTeX (`\[ … \]`, ready to copy), with its name, topic and a one-sentence explanation. The same for every visitor (Vienna date); the topics take turns: famous, physics, machine learning, biology (46 in all, in `EQUATIONS` in science.js; add or change rows there, as `[name, LaTeX, explanation]`). `equation random` gives a random one. Badge *Chalk talk*. | terminal |
| **Point spread function** | Terminal `psf 640 1.4` (wavelength in nm, NA): draws the Airy disk of a point of light, to scale (always 2 µm wide, so a low NA gives a visibly bigger blur), in the colour of that wavelength, on a log scale so the rings show. Below: Abbe limit, Rayleigh radius, FWHM, Gaussian σ and the axial size, with the immersion medium guessed from the NA (air, water, oil). The Airy pattern is computed from the Bessel function J₁ in the browser. `psf` alone uses 640 nm and NA 1.4. Badge *Airy disk*. | terminal |

## More landscape life

| What | Where / when | Preview |
|---|---|---|
| **Shovelling snow** | After real snowfall (at least 1 cm in the last 24 hours, cold enough to stay), the path is snowed over; before 15:00 the penguin shovels it clear from the step to the jetty, leaving a trodden track. Once a day. | `?shovel&season=winter` |
| **Raking leaves** | Autumn days, dry: the leaves on the grass are raked into a pile, from the left and then from the right, and then the penguin jumps into it and they scatter again. | `?rake&season=autumn&sky=day` |
| **Watering the flowers** | Spring and summer: after three or more dry, hot days in a row (real weather: no rain, 25 °C or more), the flowers in the window boxes droop; the penguin waters both boxes and they perk up. Once a day. | `?water&season=summer&sky=day` |
| **Reading on the veranda** | Warm summer evenings (from 18 °C, dry, around sunset): the penguin sits on a chair on the veranda with a book, turning the pages, under the lamp by the door. | `?read&season=summer&sky=dusk` |
| **Birthday cake** | On 16 November (Vienna date) the penguin carries a cake with candles out onto the veranda and leaves it there for the day; the candles flicker. Click it to blow them out (badge *Birthday wishes*). Backstage: *birthday cake*. | `?birthday` |
| **Rainbow** | After rain, when the sun is out again, and only while the sun is lower than 42° (a rainbow is a 42° circle around the point opposite the sun): so never at a high summer noon. The lower the sun, the higher the arc. Backstage: *rainbow* (late afternoon). | `?weather=rainbow&sky=dusk` |
| **Hot-air balloon** | Spring to autumn, on calm mornings (up to 3 h after sunrise) and evenings (the last 3 h before sunset), only when the real wind is under 12 km/h and it's dry and clear enough. It drifts slowly across the sky; click it and the burner fires and it climbs (badge *Up and away*). | `?balloon` |
| **Cranes** | In spring the migrating V is cranes flying north (long necks, legs trailing, slower wingbeats); in autumn geese fly south. | `?birds&season=spring` |
| **Penguin kayaking** | Summer days, dry and calm (wind under 15 km/h), once in a while at random: down the jetty into the orange kayak moored there, a paddle round the bay, and back. | `?kayak&season=summer&sky=day` |
| **Penguin picking chanterelles** | Autumn days, when dry: with a basket to the forest edge behind the path, bends down for three chanterelles, and home. They grow back after 10 minutes. | `?chanterelles&season=autumn&sky=day` |
| **Penguin picking blueberries** | July and August (Vienna date), on dry days: three low blueberry bushes grow at the forest edge between the path lights. Now and then the penguin takes a pail, bends down at each bush (the berries disappear from the bush and the pail fills up) and carries them home. The berries grow back after 10 minutes. | `?season=summer&sky=day&blueberries`, backstage: *blueberries* |
| **Blueberry pie** | 20 seconds after the penguin comes home with the blueberries, a pie appears on the sill of the right window. It steams for 10 minutes; after half an hour a slice is missing, after an hour it's gone. | `?pie`, backstage: *blueberry pie* |
| **Firewood** | Logs are stacked against the right wall of the cottage (18 when full). The pile follows the calendar: full on 1 October, going down through the heating season to a few logs by the end of April, low all summer, restocked through September. Next to the path is a chopping block with the axe stuck in it. | backstage: *woodpile through the winter* |
| **Penguin chopping wood** | Autumn days, when dry: the penguin pulls the axe out of the block, splits three logs (it leans back, swings, and each log falls apart in two halves), puts the axe back, gathers the wood and stacks it on the pile (+3 logs until the next visit). | `?chop`, backstage: *chopping wood* |
| **Night stroll** | At night, the cottage taps that bring the penguin out (5 taps) send it out in a blue nightcap with a pompom and a glowing lantern: a slow walk to the shore, a pause, and back to bed. | backstage: *night stroll (nightcap)* |
| **Trophy for all badges** | The moment a visitor has found every badge, the penguin carries a small golden trophy out onto the veranda and puts it down. It stays there for that visitor (remembered in the browser). | backstage: *trophy (all badges)* |
| **Footprints in the snow** | In winter (snow on the ground) the penguin leaves footprints wherever it walks: left, right, left, about one step per unit. Not on the veranda deck, not on the ice, and not on the gravel path once it's shovelled (shovelling also clears the footprints on it). They fade: in about 4 minutes while it's snowing (fresh snow fills them), in about 40 minutes otherwise. On winter days the penguin now and then takes a short walk to the forest edge and down to the shore. | backstage: *footprints in the snow* |
| **Hare or fox tracks** | After a fresh snowfall (at least 1 cm in the last 24 h), a line of animal tracks crosses from the forest edge towards the lake, a different place each day. Hare: two long hind prints side by side ahead of two small front prints, in hops. Fox: a neat single line (the hind paws step into the front paws' prints). Alternates by day. | `?season=winter&tracks`, backstage: *hare or fox tracks* |
| **World Penguin Day (25 April)** | The colony from the 404 page visits for the day: eight penguins stand on the grass, the path and the jetty, and one hops now and then. The cottage penguin comes out to greet them (hopping among them), and the greeting says "Happy World Penguin Day!". | `?penguinday`, backstage: *World Penguin Day (25 April)* |
| **Sunglasses** | When the real UV index is 6 or more ("high" on the WHO scale; Open-Meteo, live), the penguin wears sunglasses. The terminal's `weather` shows the UV index. Weather preset `weather sunny` (UV 7.5). | backstage: *sunglasses (high UV)* |
| **Beaver lodge** | A lodge of sticks and mud on the far shore of the lake. It grows through the autumn (September to November, as beavers build and plaster it before winter) and is a bit smaller in July and August. From October to March a raft of branches lies beside it (the winter food cache, stuck in the mud under the ice). Snow on top in winter, and on very cold days (−8 °C or colder) a thin wisp of warm air from the vent. | always |
| **Beaver** | Around sunset (from sunset to an hour and a half after) and just before sunrise, when the lake has no ice, the beaver swims out from the lodge on a curve, with a branch in its mouth in autumn. Its wake opens at 19.5° on each side: Kelvin's angle, the same for any duck, beaver or ship at any speed. At the end it slaps its tail (ripples) and dives. | `?beaver`, backstage: *beaver* |
| **Orca** | Not realistic, on purpose: every 4 to 9 minutes (open water only), a tall black fin glides across the lake, in front of the rowing boat and the jetty. Every few seconds it sinks and comes back up with a puff of breath. Tap the fin: the orca dives, leaps out of the water in an arc (black and white, eye patch, tail flukes), splashes back in and swims on. Badge *Orca!*. | `?orca`, backstage: *orca* |
| **Cows** | Three black-and-white cows with cowbells graze on the meadow between the tree line and the road: they eat (head down), then amble to fresh grass. In winter (or below 3 °C) they wear red scarves; at night they lie down. | `?season=winter` for scarves |
| **UFO** | Very rarely after dark (clear sky), a UFO swoops in, beams up one of the cows, looks at it on board for a moment, puts it back facing the other way, and zooms off. Click the UFO: badge *Close encounter*. | `?ufo` (works any time) |
| **Penguin's aurora selfie** | On clear nights when the northern lights are out (and right after solving the riddle), now and then the penguin walks to the end of the jetty, holds up its phone and takes two flash selfies. | `?selfie&sky=night` |
| **Night fishing** | On mild nights (not winter, no rain or fog) a rowing boat with a lantern and someone fishing drifts slowly on the lake; the lantern is reflected in the water. | `?sky=night&season=summer` |
| **Ice hockey** | On frozen days, now and then two players (red and blue) play on the lake with small nets at each end; the penguin comes out to referee. A goal makes the scorer jump and the puck goes back to the middle. | `?hockey&weather=frost&season=winter&sky=day` |
| **Penguin under the footer** | Scroll to the very bottom: a penguin pops up behind the footer and waves (at most every 30 seconds). Click it: badge *Peekaboo*. | scroll down |
| **Cow on the road** | Now and then a cow wanders onto the valley road and stands there. When the cyclist comes, they stop, ring the bell, and the cow ambles back to the meadow. | `?cowroad` |
| **Owl** | At night two yellow eyes blink in the Swedish forest. Tap them: the owl flies off (back after two minutes). | `?sky=night` |
| **Mountain hut** | A small hut below the Alpine summit; its window is lit at night, and its roof is white in winter. | always |
| **Chairlift** | In winter a chairlift runs up the Alpine slope (chairs up one cable, down the other). The skier rides it up before skiing down. | `?season=winter&sky=day` |
| **Penguin: snow angel** | On the frozen lake the penguin sometimes lies down and makes a snow angel, admires it, and goes back in; the angel fades after a minute. | `?angel&weather=frost&season=winter` |
| **Penguin: stargazing** | On clear nights the penguin sets up a telescope on the veranda; when the ISS really passes over Vienna, it points the telescope at it. | `?stargaze&sky=night` |
| **Penguin: rain dance** | On warm rainy days (from 10 °C) a puddle forms on the path and the penguin runs out to jump in it. | `?raindance&weather=rain` |
| **Sauna** | A small wood-fired sauna on the shore right of the jetty. On cold evenings it's heated (glowing window, chimney smoke). On frozen winter evenings the penguin now and then walks over, sweats in the sauna, runs out steaming, plunges into the hole in the ice (vak), goes back in, and waddles home still steaming. | `?sauna&weather=frost&season=winter&sky=dusk` |
| **Bioluminescent plankton** | At night, tapping the lake makes the ripples glow blue, like plankton lighting up where the water moves. | `?ripples&sky=night` |
| **The road** | A winding gravel track through the valley that ends at a boat ramp on the lake, next to a small jetty with a ladder and a rowing boat pulled up on the shore. Everyone on the road turns around at the ramp. Winter: ploughed, with snow banks, and skis and tyres leave tracks that fade after a while. Autumn: fallen leaves on it. Rain: a wet shine. | `?season=winter`, `?season=autumn`, `?weather=rain` |
| **Moose (älg)** | Now and then (not at night) a moose walks out of the Swedish forest, stops in the middle of the road, and walks on; a Swedish "Älgvarning" sign appears while it's there. Click it and it hurries off (badge *Älgvarning*). | `?moose` |
| **Veranda and path lights** | The cottage has a wooden veranda with a white railing, and a gravel path runs along a strip of shore to the jetty. Five small lamps line the path; after dark they glow and their light is reflected in the lake. | `?sky=night` |
| **Tent in the forest** | Summer only, in a clearing on the Swedish side (allemansrätten allows wild camping there). The tent is up from an hour before sunset until two hours after sunrise; the campfire burns until 23:30 (not in rain); after dark a headlamp lights the tent until midnight. Tap the fire for a burst of sparks (badge *Allemansrätten*). | `?tent&season=summer&sky=dusk` or `&sky=night` |
| **Snowman** | Winter days at 2 °C or colder (or while it snows): the penguin builds a snowman on the shore right of the sauna. It rolls the base, the middle and the head (each snowball grows as it rolls), lifts them on with a hop, then adds the face, and finally the hat, scarf and arms, and steps back to admire it. It stands for the rest of the day; between 2 and 8 °C it slumps and melts, warmer it's gone. Click it: the hat hops (badge *Snow day*). Backstage: *snowman*, *melting snowman*. | `?snowman`, `?snowman=melt` (add `&season=winter&weather=frost`) |

## Pictures next to publications

In `cv/cv.tex`, add `\web{image}{images/pubs/smlmflow.jpg}` right after a `\pub{…}` and put the file in `images/pubs/`. The website then shows a small picture (in its own shape, at most 170px tall, on white) to the left of that publication; the PDF is unchanged. Publications without a picture look as before. Add `\web{imagecredit}{Figure 1, Journal (CC BY 4.0)}` to name the source; it shows when hovering the picture.

Current pictures: Nano Letters (ribosome to dye, from Fig. 1A), JCS review (Fig. 3), SMLMFlow (animated GIF of the localisations sharpening), AI4CellFate (Fig. 2c), 6S RNA (tissue section from Fig. 5), master's thesis (the protein from the cover). The two conference abstracts have none.

## Printing

Printing the page (or "Save as PDF") gives a clean light one-column version: no sky, menu, terminal, timeline, map or buttons; contact links show their addresses.

## Backstage (for you only)

In the terminal, type `backstage` and then your password (the input is hidden and never kept in the command history). A panel lists every animation and scene in groups (sky and weather, seasons and holidays, road, sky, lake, penguin, animals, cottage (including the stove and its smoke), the hiker (walk, rain coming, umbrella, fika break), the page (screensaver, co-author network over time, the lost penguin 404 page in a new tab), science), 100 entries. New since: *long shadows*, *day moon*, *melting snowman*, *Swedish flag*, *Austrian flag*, *light summer night*, *Big Dipper and Pole Star*, *smoke in the wind*, *ice from the shore*, *cranes*, *hot-air balloon*, *kayak*, *chanterelles*, *shovelling snow*, *raking leaves*, *watering flowers*, *reading on the veranda*, *birthday cake*, *optimal transport flow*, *blueberries*, *blueberry pie*, *chopping wood*, *woodpile through the winter*, *footprints in the snow*, *hare or fox tracks*, *beaver*, *World Penguin Day (25 April)*, *sunglasses (high UV)*, *co-author network over time*, *lost penguin (404 page)*; tap one and it plays right away, with the sky, season or weather it needs set automatically. `show live` (or "live" at the bottom) returns to the real sky. The panel stays unlocked until the browser tab is closed. Road scenes (moose, triathlon, skiers, cow on the road) need a free road: if someone is on it, a short note says so and the scene starts as soon as it's clear (a cow on the road gets a cyclist sent to ring the bell).

Only a SHA-256 fingerprint of the password is stored in the code, not the password itself. It keeps visitors out of the panel, but it is not a real secret: on a static site anyone reading the code can run the animations too, and a short dictionary word can be guessed from its fingerprint.
