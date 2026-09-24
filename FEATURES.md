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
| `weather` | `clear`, `cloudy`, `rain`, `drizzle`, `snow`, `storm`, `fog` |
| `star` | no value; shows a shooting star right after loading |

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
- **Greeting:** changes with the time of day, in German and Swedish ("Guten Morgen, god morgon.").

## Light and dark mode

- The whole page is **white while the sun is up in Vienna** and **black after dark**.
- It doesn't switch at once: the background fades from white through grey to black over about an hour around sunset, and back around sunrise.
- The text flips from black to white once, at the point where white becomes easier to read.
- The GPS terminal always stays dark.

## Real weather

Checked every 15 minutes (free Open-Meteo service, no key needed).

| Weather in Vienna | What the site shows |
|---|---|
| Cloudy | Clouds drift across the sky, the sky turns greyer, stars and northern lights fade |
| Drizzle / rain | Light or heavy rain falls |
| Snow | Snow falls, in any season |
| Thunderstorm | Rain plus a lightning flash every 6 to 18 seconds |
| Fog | Mist rises from the valley |

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
| Christmas | 24–26 December | Decorated Christmas tree with a star next to the cottage, blinking lights on the cottage roof, greeting "Frohe Weihnachten, god jul." |
| Easter Sunday | Calculated each year (2026: 5 April, 2027: 28 March) | Coloured eggs and a bunny in the meadow, greeting "Frohe Ostern, glad påsk." |
| Midsommar | Swedish Midsummer Eve (Friday 19–25 June) and the Saturday after | Flower-covered maypole next to the cottage, greeting "Glad midsommar!" |

## Things visitors can find and click

- **Shooting stars:** at night, one crosses the sky every 15 to 50 seconds. Clicking it "catches" it ("Make a wish."). The browser remembers how many each visitor has caught.
- **The cottage:** clicking the red cottage switches its light and chimney smoke on or off (no message). On its own, the light is on in the evening, and the chimney smokes in the evening and in autumn and winter.
- **The deer:** appears at the forest edge only at **dusk and dawn**, and sometimes lowers its head to graze. Clicking it makes it run into the forest (it comes back after 90 seconds).
- **The hiker:** a small figure with an orange backpack walks up the career trail to the summit when the Career section comes into view. Hovering over or clicking a waypoint makes them walk there.

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
| `waypoint 1` … | Details of one career stage (also highlights it on the page) |
| `skills` | Skills as an "equipment check" |
| `projects` | Projects as "marked routes" |
| `contact` | Email, LinkedIn, GitHub |
| `now` | The "Now" line |
| `weather` | Live weather in Vienna |
| `weather rain` | Simulates weather (`clear`, `cloudy`, `rain`, `drizzle`, `snow`, `storm`, `fog`); `weather live` goes back |
| `sun` | Today's sunrise and sunset, and whether the site is in light or dark mode |
| `moon` | Tonight's moon phase and days until full moon |
| `sky night` | Changes the sky (`dawn`, `day`, `dusk`, `night`); `sky live` goes back |
| `season winter` | Changes the season; `season live` goes back |
| `holiday christmas` | Shows a holiday (`easter`, `midsommar`); `holiday live` goes back |
| `riddle` | The northern-lights riddle |
| `download cv` | Downloads `cv.pdf` |
| `goto contact` | Scrolls to a section (`about`, `cv`, `skills`, `projects`, `contact`) |
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

## Where things live in the code

| What | File |
|---|---|
| Your content (CV, skills, projects, links, Now line, location) | `script.js`, the `SITE` block at the top |
| Sky, light/dark mode, seasons, snow/leaves/rain, main terminal commands | `script.js` |
| Moon, weather, holidays, shooting stars, cottage, hiker, deer, riddle | `extras.js` |
| Landscape drawing (mountains, trees, cottage, deer, decorations) | `index.html`, inside the hero section |
| Colours, fonts, layout, animations | `style.css` |

Visitors who turned on "reduce motion" on their device don't get the moving effects (falling particles, shooting stars, walking hiker).
