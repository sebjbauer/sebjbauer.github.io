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
| `weather` | `clear`, `cloudy`, `rain`, `drizzle`, `snow`, `storm`, `fog`, `frost` (clear and below 0 °C: frozen lake), `rainbow` (sun after rain) |
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

- **Time of day:** the sky goes through dawn, day, dusk and night, anchored to the real sunrise and sunset for each day. Sunrise and sunset are calculated, not fixed, so they move with the seasons and summer time.
- **Sun and moon:** the sun travels across the sky during the day, the moon at night.
- **Moon phase:** the moon shows its real shape for that night (crescent, half, gibbous, full).
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
| Below 0 °C | The lake freezes (icy colour, cracks) and an ice skater glides across it |
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

## Things visitors can find and click

- **Shooting stars:** at night, one crosses the sky every 15 to 50 seconds. Clicking it "catches" it ("Make a wish."). The browser remembers how many each visitor has caught.
- **The cottage:** clicking the red cottage switches its light and chimney smoke on or off (no message). On its own, the light is on in the evening, and the chimney smokes in the evening and in autumn and winter.
- **The deer:** appears at the forest edge only at **dusk and dawn**, and sometimes lowers its head to graze. Clicking it makes it run into the forest (it comes back after 90 seconds).
- **The Timeline section (mountain trail):** from 2008 to today, above the Career and Education sections. Orange circles (year above the line) mark where each job starts, green diamonds (year below) where each degree starts; a bigger diamond around a circle means both started that year. Every period is shaded faintly under the line; clicking a marker, a Career table row or an Education entry highlights that period. The line turns dashed after today.
- **Headlamp:** after dark, the hiker wears a small headlamp with a soft beam.
- **Fika:** from 15:00 to 15:15 Vienna time, the hiker sits down on the trail with a steaming cup of coffee.
- **The hiker:** a small figure with an orange backpack walks along the trail to the latest job when the Career section comes into view. Hovering over or clicking any marker makes them walk there.

## Life in the landscape

| What | When |
|---|---|
| **Cyclist** on the valley road | Every 35 to 90 seconds, any season; with a headlight after dark. Dressed for the real weather in Vienna: yellow rain poncho in rain or drizzle, red woolly hat and scarf below 5 °C or in snow, sunglasses on sunny days from 24 °C. Click them to make them tuck ("Aero tuck: about 15% less drag."), and they speed up. A nod to the road-cycling aerodynamics thesis. |
| **Ice skater** | Only when the lake is frozen. Click to make them spin. |
| **Ducks** | Summer, daytime, lake not frozen |
| **Migrating birds** (V formation) | Spring (flying north) and autumn (flying south), daytime, every 45 to 110 seconds |
| **Skier** down the Alpine slope | Winter, daytime, every 20 to 50 seconds |
| **Plane** | Every 70 to 160 seconds (not in heavy cloud): silhouette with a contrail by day, blinking red, green and white navigation lights at night. Click: "Off to explore a new country." |
| **Triathlon** | On summer days (or from 18 °C in other seasons), dry and not frozen, every 3 to 6 minutes: a swimmer in an orange cap crosses the lake, then the cyclist rides back through the valley, then a runner with a race bib runs along the road. Click an athlete: "Triathlon: 1.5 km swim, 40 km bike, 10 km run." Terminal: `triathlon` starts a race. |
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

The small icon in the browser tab is a **sun during the day** and **tonight's moon phase at night**, drawn live.

## Publications: copy citation and BibTeX

Under every publication there are two small buttons: **Copy citation** (APA style, e.g. "Edwards, S., …, & Brismar, H. (2026). Title. Nano Letters, 26(4), 1321–1326. https://doi.org/…") and **BibTeX**. Both copy to the clipboard and show "Copied". They're built from the fields in `publications` in `script.js` (journal, volume, issue, pages, doi), so new papers get them automatically.

## Email

Clicking **Email** in Contact opens the visitor's mail app *and* copies the address, with a short "Address copied" note, for people without a mail app.

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

The footer shows "Last updated 24 September 2026", the date of the latest push to GitHub (read from the GitHub API; if that isn't reachable, the line is simply left out).

## Visitor statistics (GoatCounter)

The site sends a cookie-free page count to GoatCounter; no personal data, no consent banner needed. Preview links like `?sky=night` are counted as the normal page.

- **Dashboard:** https://sebjbauer.goatcounter.com (visitors per day, which pages, referrers such as LinkedIn or Google, countries, browsers, screen sizes).
- **One-time setup:** create a free account at https://www.goatcounter.com/signup with the code **sebjbauer**. Until the account exists, nothing is counted.
- Visits from `localhost` (testing on your Mac) are not counted.

## Google: who this page is about

Invisible structured data in `index.html` (the `application/ld+json` block) tells Google the name, positions, affiliations (Stockholm University, SciLifeLab, AITHYRA), alumni of (KTH, TU Wien), Vienna, and the profiles (Google Scholar, LinkedIn, GitHub, Bluesky, X). Update it if positions change. You can test it at https://search.google.com/test/rich-results.

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

Terminal command `badges`: shows which of the 14 badges the visitor has found, with hints for the rest. The browser remembers them.

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
Tab completes commands, ↑ repeats the last one.

**Listed in `help`:**

| Command | What it does |
|---|---|
| `whoami` | Name, role and where you're based |
| `whereami` | Coordinates and local time in Vienna |
| `route cv` | The career trail drawn as text |
| `education` | Schools and degrees, newest first |
| `papers` | All publications with links, plus Google Scholar |
| `waypoint 1` … | Details of one career stage (also highlights it on the page) |
| `skills` | Skills as an "equipment check" |
| `projects` | Projects as "marked routes" |
| `contact` | Email, LinkedIn, GitHub, Google Scholar, ORCID, Bluesky, X |
| `now` | The "Now" line |
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
| `talks` | Talks, posters and awards |
| `timelapse` | A whole day in 20 seconds; `timelapse year` for the seasons |
| `triathlon` | Starts a race: swim, bike, run |
| `download cv` | Downloads `cv.pdf` |
| `goto contact` | Scrolls to a section (`about`, `timeline`, `cv`, `education`, `publications`, `skills`, `projects`, `contact`) |
| `fika` | Mandatory Swedish coffee break (ASCII art) |
| `clear`, `exit` | Clear the screen, close the terminal |

**Hidden, not in `help`:**

| Command | What it does |
|---|---|
| `ls` | Lists fake files: `about.txt cv.pdf projects/ trail.gpx riddle.txt .secret` |
| `cat about.txt` | Prints the About text |
| `cat trail.gpx` | Same as `route cv` |
| `cat riddle.txt` | Same as `riddle` |
| `cat .secret` | Hints that the sky can be controlled with `sky night` |
| `hint` | Hint for the riddle |
| `norrsken` | Answer to the riddle |
| `sudo hire-me` | Fake password prompt, "Access granted", then scrolls to Contact |
| `hej`, `servus` | Greetings back |
| `rm -rf /` | "Avalanche warning. Permission denied." |

## Quality (checked 24 September 2026)

- **Readability:** every text colour keeps at least 4.5:1 contrast at every moment: through twilight, in every season, and over the live sky (a soft shade appears behind the name at dawn and dusk only when needed).
- **Keyboard and screen readers:** a "Skip to content" link appears when pressing Tab; all buttons have names; the photo has a description.
- **Google:** page title "Sebastian Bauer · PhD student in Bioinformatics", a canonical address, `robots.txt` and `sitemap.xml`, plus the structured data described above.
- **Size:** about 115 KB for a first visit (page, styles, scripts, fonts); the photo only loads when scrolling to About.
- **Tested:** all links and DOIs work; the HTML passes the W3C validator; no script errors in Safari's engine (iPhone size) or Chrome.

## Where things live in the code

| What | File |
|---|---|
| Your content (career, education, publications, skills, projects, links, Now line, location) | `script.js`, the `SITE` block at the top |
| Sky, light/dark mode, seasons, snow/leaves/rain, main terminal commands | `script.js` |
| Moon, weather, holidays, shooting stars, cottage, hiker, deer, riddle | `extras.js` |
| Microscope stars, penguin, cyclist, skier, birds, ducks, ice skater, badges | `gadgets.js` |
| Contact card | `contact.vcf` |
| Notes: the list of published notes / the notes themselves | `notes/notes.json` / `notes/*.md` |
| Page for a single note, and the Markdown renderer | `note.html`, `notes.js` |
| Link-preview image | `og-image.jpg` |
| For search engines | `robots.txt`, `sitemap.xml` |
| Landscape drawing (mountains, trees, cottage, deer, decorations) | `index.html`, inside the hero section |
| Colours, fonts, layout, animations | `style.css` |

Visitors who turned on "reduce motion" on their device don't get the moving effects (falling particles, shooting stars, walking hiker).
