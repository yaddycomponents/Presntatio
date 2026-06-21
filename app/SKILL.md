# Heisenberg Release Deck — Contributor Guide

A motion-graphic presentation (React + Vite + Framer Motion) about the `new-bundle`
modernization. It plays like a video: minimal text, simple shapes, smooth animation.
This guide is for teammates who want to **add their own scene / points**.

---

## Run it

```bash
cd app
npm install
npm run dev          # opens http://localhost:5173
```

### Controls
| Key / action | Does |
| --- | --- |
| `→` / click / `PageDown` | next scene |
| `←` / Shift-click / `PageUp` | previous scene |
| `Space` | play / pause **autoplay** |
| `Home` / `End` | jump to first / last |
| open with `?play` | starts in autoplay (e.g. `localhost:5173/?play`) |

---

## How it's built (3 layers — never break these)

1. **`src/theme.js`** — design tokens. Colors, fonts, type scale, motion timing.
   **Never hardcode a hex or font** in a scene; pull from `tokens`.
2. **`src/motion.js`** — reusable animation presets (`fadeUp`, `maskReveal`, `popIn`,
   `growX`, `growY`, `flash`, …). **Don't write inline `initial/animate`** — spread a preset.
3. **`src/scenes/*` + `src/components/*`** — scenes compose tokens + presets + components.

### The palette means something (semantic)
- **rose** = before / old / the problem
- **sage** = after / new / the fix
- **cream** = normal slide bg · **rose bg** = title/chapter/close · **sage bg** = payoff
- Fonts: **Yeseva One** (display headlines) · **Josefin Sans** (body) · **Space Mono** (all data/labels)

---

## Add your own scene (5 minutes)

**1. Create `src/scenes/MyScene.jsx`** using the shared building blocks:

```jsx
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens } from '../theme'

export default function MyScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part X — Your topic</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Your headline</MaskReveal>

      <Line delay={0.9} size={tokens.type.rowLabel} color={tokens.text.primary}>
        Your point, in one short line.
      </Line>
    </div>
  )
}
```

**2. Register it in `src/scenes/index.js`** — import it and add an entry where you want it:

```js
import MyScene from './MyScene'
// ...
{ id: 'my-scene', bg: tokens.bg.primary, dur: 6, Component: MyScene },
```
- `bg`: `tokens.bg.primary` (cream), `tokens.bg.title` (rose), or `tokens.bg.alt` (sage)
- `dur`: seconds the scene stays on screen during **autoplay** (make it ≥ your last animation's end + ~1.5s)

That's it — HMR shows it instantly.

### Building blocks you can reuse
| Component | Use for |
| --- | --- |
| `<Kicker>` `<MaskReveal>` `<Line>` | eyebrow / big serif headline / body line |
| `<CountUp to={357} suffix=" KB" />` | animated numbers (Space Mono, tabular) |
| `<Box>` | a labeled box (title + sub) that pops in |
| `<Skeleton w h circle />` | shimmering loading placeholder |
| `<Glyph name="check" />` | line-icon (speed, light, check, merge, split, doc, cut, …) |
| `<Diamond />` | symmetric ornament |
| `<Flash>` `<Delta>` | stock-ticker flash / `−65%` chip |
| `<Chapter part title letter />` | full chapter divider card |

### Motion presets (spread onto any `motion.*`)
`fadeUp` · `fadeIn` · `maskReveal` · `drawIn` · `popIn` · `spinIn` · `growX` · `growY` ·
`growXFade` · `flash` · `sceneSwap`. Each takes `{ delay, ... }` and returns
`initial/animate/exit/transition`.

```jsx
import { motion } from 'framer-motion'
import { fadeUp } from '../motion'
<motion.div {...fadeUp({ delay: 0.5 })} style={{ ...tokens-based styles }} />
```

### Conventions (please keep)
- No raw hex / font strings in scenes — use `tokens.*`.
- No inline `initial/animate` — use a preset (add a new one to `motion.js` if needed).
- rose = before/problem, sage = after/fix. Keep it consistent.
- Keep text minimal. Let shapes + motion carry the point.
- Slow, expressive **entrances**; fast **exits** (already baked into presets).

---

## Export as a video

### Easiest — one command
```bash
cd app
npx playwright install chromium   # one-time (downloads the browser)
brew install ffmpeg               # one-time (converter + the step that sharpens text)
npm run record                    # build → preview → record 4K → downscale → heisenberg.mp4
```
`npm run record` runs `record.mjs`. It does **not** use lossy video recording (that's what made
text blurry). Instead it drives the deck with a fake clock and captures **pixel-perfect PNG frames
at 2× (4K)**, piping them straight into ffmpeg, then downscales to a **crisp 1080p `heisenberg.mp4`**.
No manual timing — it stops at the last scene automatically.

Tunables: `FPS=30 SCALE=2 OUT=heisenberg.mp4 npm run record`
(`SCALE=1` captures at 1080p — faster/smaller, still lossless). ffmpeg is **required**.

---

### Manual alternatives

### A. Screen recording (no tooling)
1. `npm run build && npm run preview` (or just `npm run dev`).
2. Open the deck with autoplay + go fullscreen:
   `http://localhost:4173/?play` then **Cmd-Ctrl-F** (Chrome fullscreen) — hides browser chrome.
3. macOS: **Cmd-Shift-5** → choose *Record Entire Screen* (or a selection) → **Record**.
4. Press **Space** if you need to start/stop autoplay; let it run to the last scene.
5. Stop recording (menu-bar stop icon). You get a `.mov`.
6. (optional) trim in QuickTime, or convert/compress:
   ```bash
   ffmpeg -i screen.mov -vf "scale=1920:-2" -c:v libx264 -crf 20 -pix_fmt yuv420p heisenberg.mp4
   ```
**Tips:** set browser zoom to 100%, use a 1920×1080 display for clean 1080p, move the mouse
off-screen (autoplay needs no cursor).

### B. Headless capture (cleanest, repeatable)
Records exactly the viewport, no desktop, no cursor:
```bash
npm i -D playwright
npx playwright install chromium
```
```js
// record.mjs  →  node record.mjs   (run `npm run preview` first)
import { chromium } from 'playwright'
const TOTAL_MS = 130000 // ~ sum of all scene durations + buffer
const b = await chromium.launch()
const ctx = await b.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: 'video', size: { width: 1920, height: 1080 } },
})
const p = await ctx.newPage()
await p.goto('http://localhost:4173/?play')
await p.waitForTimeout(TOTAL_MS)
await ctx.close(); await b.close()  // .webm lands in ./video
```
Convert if you need mp4: `ffmpeg -i video/*.webm -c:v libx264 -crf 20 -pix_fmt yuv420p heisenberg.mp4`

> Total runtime ≈ sum of every scene's `dur` in `scenes/index.js` (currently ~2 minutes).
> Bump `TOTAL_MS` if you add scenes.

---

## Scene order (current)
Title → Scale → Headline → Transferred(gzip) → One Line → **A** Customer / Developer →
**B** Bundle: LCP / Preload / Import-chain / Fix / Rules → **C** CSS flow / @layer →
**D** Consolidation / Filter-UX / Wins → Closing.

Add your scene wherever it fits the story. Keep the chapter cards as section breaks.
