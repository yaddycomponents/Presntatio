# Handoff: Emaki Studio

## Overview

Emaki is a **local-first developer tool** that turns build output (bundle stats, Lighthouse runs, git logs) into short motion-graphic films. The deck is a JSON file on disk (`deck.json`); rendering is local via Remotion; the UI is a window onto a CLI (`emaki studio` serves it on localhost).

**AI arrives exclusively through MCP.** Emaki never calls a model, never stores a key, and has no chat panel. An MCP client (Claude Code / Claude Desktop) writes to `deck.json`; Studio is a **file-watcher** that reacts visibly. Any screen that looks like a chatbot is a design failure.

This bundle covers 14 screens across 7 stages of the product flow, plus a component inventory and the full token set.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behaviour, **not production code to copy**. `Emaki Studio.dc.html` uses a streaming component format (`<x-dc>`, `{{ }}` template holes, `<sc-if>`, and a `support.js` runtime) that exists only in the design tool. Do not port that runtime.

**Your task is to recreate these designs in the target stack**, which is fixed by the brief:

- **React + CSS Modules + CSS custom properties**
- **Radix primitives** for behaviour only (dialog, dropdown, tabs, tooltip, context menu) — fully unstyled, design them from scratch
- **react-resizable-panels** for the three-pane split
- **Monaco** for the JSON editor — design *around* it, pick an editor theme that sits inside the chrome, do not restyle its internals

**No Tailwind and no shadcn/ui.** Not available, by deliberate choice. Do not reach for shadcn's default component look.

## Fidelity

**High-fidelity.** Final colours, typography, spacing, and density. Recreate pixel-accurately. Every measurement below is literal — the designs are authored at 1440×900 with inline styles, so any value you see in the HTML is the intended value.

Two deliberate exceptions:
- **Film canvas contents are placeholders.** Scene composition, block layouts, and deck themes are a separate design system and are out of scope. The warm cream/sage/rose and dark/teal frames in the canvas exist only to prove the chrome doesn't fight content. Do not treat them as a spec.
- Icons are typographic stand-ins (`▶`, `❚❚`, `⏮`). Swap for a real icon set (Lucide or similar), 14–16px, 1.5px stroke, `currentColor`.

---

## Design Tokens

Expose all of these as CSS custom properties on a theme root so they can derive from the same token contract the render engine uses. **Dark is the default;** light is the alternate, applied via `[data-theme="light"]`.

### Colour — dark (default)

```css
--bg:         #15181e;  /* app canvas behind panels */
--panel:      #1c2027;  /* panel surface */
--panel-2:    #232830;  /* recessed: top bar, transport, group headers */
--raised:     #2b303a;  /* inputs, buttons, scrubber track */
--line:       #383e49;  /* structural hairline */
--line-soft:  #272c34;  /* internal divider */
--void:       #0c0e12;  /* canvas letterbox — the film sits on this */

--text:       #eef1f6;
--text-2:     #a5adba;
--text-3:     #818a97;  /* monospace derived data, muted labels */

--accent:      #8f9ad6;
--accent-ink:  #131725;  /* text/icon on accent fill */
--accent-soft: rgba(143,154,214,.14);
--accent-line: rgba(143,154,214,.38);

--ok:   #4fae8c;
--warn: #d3a457;
--err:  #dd7568;

--add-bg:   rgba(79,174,140,.13);  --add-line: #46a07f;
--del-bg:   rgba(221,117,104,.12); --del-line: #cd6f63;

--shadow: 0 18px 44px rgba(4,4,6,.62);
```

### Colour — light

```css
--bg:         #eef1f7;  /* blue-grey; never pure white */
--panel:      #f9fafc;
--panel-2:    #e9edf4;
--raised:     #fdfdff;
--line:       #d6dce7;
--line-soft:  #e5e9f1;
--void:       #333a45;  /* stays dark in light mode — the film must frame */

--text:       #171b22;
--text-2:     #4f5763;
--text-3:     #6a7380;

--accent:      #4b57a3;
--accent-ink:  #ffffff;
--accent-soft: rgba(75,87,163,.08);
--accent-line: rgba(75,87,163,.28);

--ok:   #1f7358;
--warn: #8a6013;
--err:  #bd3b30;

--add-bg:   rgba(31,115,88,.08);  --add-line: #2f8768;
--del-bg:   rgba(189,59,48,.07);  --del-line: #c4564a;

--shadow: 0 10px 28px rgba(23,27,34,.09);
```

**Accent discipline:** one accent, used only for selection and primary action. Semantic colour (`--ok`/`--err`/`--add-*`/`--del-*`) carries meaning only — valid/invalid, added/removed. Never decorate with either.

### Typography

```css
--font-ui:   'Public Sans', system-ui, sans-serif;   /* neutral, tight, workmanlike */
--font-mono: 'JetBrains Mono', monospace;            /* Space Mono is the engine's face;
                                                        JetBrains reads better at 9–11px */
```

Sizes in use: **9, 10, 11, 12, 13, 14, 17, 22, 30, 42, 74px**. Weights: 400 / 500 / 600 / 700 only.

**The monospace rule is load-bearing.** Every durée, frame count, file path, dimension, timecode, CLI command, token key, and ID is monospace. Every sentence of prose is the UI sans. This is the one place the tool's identity shows through — do not blur the line.

Uppercase micro-labels: 9–10px mono, `letter-spacing:.1em–.12em`, `--text-3`.

### Spacing, radii, elevation

```css
--s-1: 2px;  --s-2: 4px;  --s-3: 6px;  --s-4: 10px;
--s-5: 12px; --s-6: 16px; --s-7: 24px;

--r-sm: 4px; --r-md: 6px; --r-lg: 8px; --r-xl: 10px;

--focus: 0 0 0 3px var(--accent-soft);
```

### Fixed chrome heights

```css
--h-topbar:    44px;
--h-row:       44px;   /* scene-list row */
--h-group:     22px;   /* section/chapter header in scene list */
--h-tabs:      30px;
--h-transport: 52px;
--h-cmdbar:    26px;
```

Pane widths at 1440: left **238px** (252px in the live-update screen), right **328px** (300px in 9:16 mode), centre flexes.

### Motion

The tool is about motion, so **the chrome is nearly still**. Transitions: 120–160ms, `ease-out`, on `background-color`, `border-color`, `opacity`, `box-shadow` only. Never transform or animate chrome while the canvas is playing. No entrance animations, no skeleton shimmer in the developer surface.

---

## Screens

Fourteen frames, grouped into seven flow stages. IDs match the badges in the HTML.

### Stage 1 — Open something

#### `1e` First run / empty state

**Purpose:** no deck open; create, open, or extract. Per brief §4.2 there is **no AI setup step here** — nothing to configure.

**Layout:** 1440×900. Top bar 44px (logo, "no deck open" in `--text-3`, right-aligned mono build string `emaki v0.6.2 · localhost:5175 · node 22.4`). Body splits: left column flexes with 72px horizontal padding and vertically centred content; right rail fixed **420px**, `border-left: 1px solid var(--line)`.

**Left column** (34px gap between groups):
- Eyebrow: 11px mono, `.16em` tracking, uppercase, `--text-3` — "EMAKI STUDIO"
- H1: 30px/1.2, weight 600, `-.02em`, max-width 18em — "Turn build output into a film you'd actually post."
- Sub: 13px, `--text-2`, 1.6 line-height, max-width 44em
- Action grid: 2 columns, 12px gap, max-width 760px
  - **Start from a template** — accent card (`--accent-soft` fill, `--accent-line` border, radius 8px, padding 16px). Title 14px/600, body 12px `--text-2`, footer 10px mono `--accent`: `emaki new --template release-notes`
  - **Open a deck.json** — same shape, neutral (`--panel` on `--line`). Footer `emaki studio ./deck.json`
  - **Extract from build output** — spans both columns. Header row: title 14px/600 + "3 sources detected in this repo" 10px mono `--text-3`. Three equal source tiles (`--panel-2` on `--line-soft`, radius 6px, padding 10px): `rollup stats` / `dist/stats.json · 2m ago` in `--ok`; `lighthouse` / `.lh/report.json · 4d ago`; `git log` / `v1.3.0..HEAD · 41 commits`. Footer command `emaki extract rollup dist/stats.json -o deck.json`
- MCP footer strip, separated by `border-top: 1px solid var(--line-soft)`, 18px padding-top: "Want AI? Connect Emaki to the AI app you already use." + mono `claude mcp add emaki -- emaki mcp serve`, with a `copy` link and a "How MCP works" secondary button.

**Right rail:** 30px "RECENT" header, then three rows (12px name / 10px mono meta) — `bundle-diff`, `v1.3.0 release`, and `lcp-story` shown as `missing · moved or deleted` in `--err`. Pinned to the bottom: a session log on `--void`, 10px mono, 1.8 line-height:
```
$ emaki studio
ready on http://localhost:5175
watching ./decks/*.deck.json
remotion 4.0 · 12 workers
mcp server idle · no client attached   ← --ok
```
Then `⌘K palette · ⌘O open · ⌘N new`.

---

### Stage 2 — Pick a template · point your AI app at the project

#### `1j` MCP connection panel (brief §4.3)

**Purpose:** answers "how do I use AI with this?" It is **not a wizard**. Two states, both 452px wide, designed as a popover anchored to the top-bar indicator (Radix Popover).

> **Hard constraint: this screen has no text input.** If a key field, provider picker, or model dropdown appears, the implementation is wrong.

**Connected state:**
- Header 13px padding: `--ok` dot (7px) + "claude-code attached" 13px/600 + right-aligned `since 14:02 · 3 calls` 10px mono
- Body: explanatory 12px `--text-2` sentence establishing Emaki never calls a model
- "ADD THE SERVER" label → command block on `--void`, radius 6px, 11px mono `#d8dbe2`, with a `copy` affordance: `claude mcp add emaki -- emaki mcp serve`
- "TOOLS EXPOSED" label → five rows. **Name column is `width:168px; flex:none`** (11px mono `--accent`) — this must fit `create_theme_from_image`; description follows in 11px UI sans `--text-3`:

  | tool | description |
  |---|---|
  | `propose_scenes` | returns ops for you to approve |
  | `apply_ops` | writes approved ops to disk |
  | `extract` | rollup · lighthouse · git log |
  | `create_theme_from_image` | brand → theme file |
  | `render` | local render, same as the CLI |

- Status block, 10px mono `--text-3`, 1.7 line-height: `project ~/src/site`, `watching ./decks/*.deck.json`, `last apply_ops · 4s ago · 3 ops`
- Footer on `--panel-2`: `emaki mcp status` (copyable) and a `docs` link

**Disconnected state:** `--text-3` dot, "No MCP client attached", reassurance that everything works without one, the same command block, and `then restart your client · Studio picks it up automatically`.

#### `1h` Template gallery (brief §4.6)

1440×900. Top bar: "Templates" + `./templates · 6 local` mono, right-aligned aspect filter segmented control (all / 16:9 / 9:16), a 200px filter input, and "Add from path".

Body: 4-column grid, 14px gap, 18px padding, `align-content: start`. Card = `--panel` on `--line`, radius 8px. Thumbnail is 16:9, full-bleed, rendering a representative frame in that template's theme; the selected card carries `--accent-line` border plus a 1px accent ring. A `▶ looping` chip sits top-right of the hovered/selected thumbnail. Meta strip below, separated by `--line-soft`: name 12px/600, then 10px mono `author · N scenes · aspects`.

Six templates: `release-notes`, `bundle-diff`, `lighthouse-story`, `changelog-scroll`, `quote-card`, `before-after` — the last two authored by `community`, which is how third-party templates will read when this becomes the marketplace surface. **No purchase UI.** A dashed "Add a template folder" tile closes the grid.

Footer 52px on `--panel-2`: selected template name + `templates/release-notes · 8 scenes · needs git log or a manual list`, the equivalent command, then Preview and Use template.

---

### Stage 3 — Work in the studio (brief §4.1)

#### `1a` Studio shell — 16:9 · the primary screen

**Top bar (44px, `--panel-2`):** 16px accent-filled app mark; deck name 13px/600; file path 11px mono `--text-3`; `unsaved ⌘S` chip in `--warn`. Right side: aspect segmented control (16:9 / 1:1 / 9:16, active = `--accent-soft` fill + `--accent-line` border + `--accent` text); theme selector with a swatch; `schema ok · 6 scenes` with an `--ok` dot; a vertical rule; **the MCP indicator** (`--ok` dot + `mcp · claude-code`, tooltip "claude-code attached · writing to this file"); Render button (`--accent` fill, 27px, with a `⌘R` hint at 60% opacity).

**Left pane — scene list (238px):** 30px header ("SCENES" + an add affordance). Rows are **44px**, `border-bottom: 1px solid var(--line-soft)`, `cursor: grab`, laid out as: 14px mono index → 5px validity dot → flex column (12px truncated headline / 9px mono block type) → 10px mono duration. Selected row = `--accent-soft` background + `inset 2px 0 0 var(--accent)`; invalid row turns headline, type and dot `--err` and appends `· 1 error`. **Section grouping** is a 22px `--panel-2` band: 9px uppercase mono label, a hairline rule that flexes, and the group's summed duration. Groups shown: Cold open / The numbers / Outro. Footer 26px: `6 scenes` ⟷ `18.5s · 555f @30`.

**Centre pane — player:** `--void` fill; the film is centred with 28px padding and letterboxed to the aspect. **Nothing overlaps the canvas.** Below it, a 20px strip of 10px mono `--text-3`: `1920×1080 · 30 fps · scene 04 · frame 214/555 · title-safe shown`.

**Right pane — tabbed (328px):** tabs are **Inspector / JSON / Narration** — 30px tall, 11px, active = `--accent` + `inset 0 -2px 0 var(--accent)`. **There is no AI tab** (brief §4.1). Use Radix Tabs.

- **Inspector** — scene chip + block name + source file path. Fields are label-above-control: 9px uppercase mono `--text-3` label; control is `--raised` on `--line`, radius 5px, 6×8px padding. Text fields use UI sans; `language`, `emphasis`, `transition` use mono; selects carry a 9px `▾`. **`duration` is rendered as derived data, never an input** — bare mono `--text-3` reading `4.5s · 135f` with no box. The `source` field is a code area on `--void` with `--ok` string tokens. Pinned at the bottom: a validation callout on `--del-bg`/`--del-line` naming `scene 05 · body.headline` with a `go to field →` link, and the equivalent patch command.
- **JSON** — Monaco. The mock shows the intended surround: `--void` background, 11px mono at 1.75 line-height, gutter numbers in `--text-3`, keys `--accent`, strings `--ok`, active line `--accent-soft`, and an error line on `--del-bg` with `inset 2px 0 0 var(--del-line)`. Status strip 26px: `Ln 32, Col 18 · json` ⟷ `1 problem` in `--err`. Build a Monaco theme to these values; do not restyle Monaco internals.
- **Narration** — one row per scene: 10px mono index, script text 12px `--text-2`, and a 9px mono meta line `4.5s · 18 words · fits`. Overruns read `0.4s over` in `--warn`. Selected row uses the same accent treatment as the scene list. Footer: `emaki narrate deck.json --voice local` ⟷ `1 overrun`.

**Transport bar (52px, `--panel-2`):** 26px square buttons (⏮ ◀ ❚❚ ▶ ⏭; play/pause is 30px wide and accent-outlined when playing) → 11px mono timecode `00:07.13 / 00:18.50`, min-width 96px → **segmented scrubber**: one flex-weighted segment per scene, 14px tall, 2px gap, `--raised`; current scene is `--accent-soft` on `--accent-line` with a fill showing progress within the scene; invalid scene is `--del-bg` on `--del-line`. Scene numbers sit under their segments at 9px mono. A 1px `--accent` playhead with a 7px square head spans the track → loop toggle → **clean preview** toggle (hides all chrome) → `space · ←→ · home/end` as a discoverability hint.

**Command bar (26px, brief §3):** `--accent` `›` prompt, the command just run in `--text-2`, its result (`ok · 12ms` in `--ok`), then `copy · history (14) · ⌘K palette`. **Every meaningful action must write to this bar.** It is a trust device, not decoration.

**Keyboard:** `→`/`←` step frame, `Space` play/pause, `Home`/`End` jump, `⌘K` palette, `⌘R` render, `⌘S` save.

#### `1b` Studio shell — 1:1

Identical chrome; the canvas becomes a centred square. Theme selector shows "Product Grey" and the film placeholder switches to the grey/purple deck theme to prove the chrome is neutral against both. Inspector shows a `stat` block (`value`, `caption`, `ratio bar`, computed duration) and a note that 1:1 crops the flanks so the stat re-anchors to the square safe area.

#### `1c` Studio shell — 9:16 · **the important case**

A tall canvas centred at 1440 leaves wide dead flanks. **Fill them rather than centring in emptiness:**

- **Left flank becomes a filmstrip (196px):** vertical list of 52×92px thumbnails with 9px mono index and `block / duration` beside each. Selected thumbnail gets an `--accent` border plus a 2px `--accent-soft` ring; the invalid scene shows a dashed `--del-line` placeholder.
- **Right flank becomes a vertical transport (150px):** three-button cluster, stacked timecode (`00:09.03` over `/ 00:18.50`), a **vertical** segmented scrubber (8px-wide column of flex-height segments with scene numbers alongside), then stacked `↻ loop` and `⌐ clean` toggles.
- Inspector narrows to 300px and gains a `layout · 9:16` control (`stacked`) — the aspect-specific prop.
- The horizontal transport bar is removed entirely in this mode; the command bar stays.

---

### Stage 4 — An MCP tool call lands on disk (brief §4.4)

#### `1k` Live update — **the most important novel screen**

**Premise:** the user asked Claude Code for a change and approved it *there*. `apply_ops` wrote to `deck.json`. Studio detected the write. **This is not a review UI and not a chat log** — it is proof that a file changed and clarity about why.

**Top bar:** identical to `1a` plus a `reloaded 4s ago` chip in `--accent` (`--accent-soft` fill, `--accent-line` border). MCP indicator is boxed and `--text-2` rather than muted, signalling activity.

**Scene list (252px)** — header right side reads `3 updated · dismiss`. Three change affordances, all reversible:
- **Patched scene (02)** — accent selection treatment plus a solid `updated` chip: 8px mono, uppercase, `.06em`, `--accent` fill with `--accent-ink` text, sitting inline with the block type
- **New scene (03)** — `--add-bg` row with `inset 2px 0 0 var(--add-line)`, `+`-style index in `--add-line`, and an outlined `new` chip
- **Removed scene** — `--del-bg` row at 70% opacity, index `−`, headline struck through, sub-line `removed · was scene 05`, and an `undo` affordance where the duration normally sits

Untouched scenes keep the exact resting style from `1a` — the contrast is the entire point.

**Provenance card** (right pane, above Monaco, on `--accent-soft`, `border-bottom: 1px solid var(--line-soft)`):
- 9px uppercase mono `--accent`: "FROM AN MCP TOOL CALL", with a `dismiss` link right-aligned
- The tool's rationale, passed through verbatim, in 12px `--text-2`: *"The caption restated the title, so I replaced it with the number the title doesn't give."*
- 10px mono provenance: `apply_ops · patch scene 02 · claude-code` / `4 seconds ago · 3 of 4 ops written`

This card is **dismissible and per-scene**. If the tool passes no rationale, omit the sentence and keep the provenance line.

**Monaco tab is active by default in this state**, showing a normal diff: removed lines on `--del-bg` with `inset 2px 0 0 var(--del-line)` and a `−` marker; added lines on `--add-bg` with `+`. Status strip reads `+3 −2 · reloaded from disk` in `--add-line`.

**Transport** re-segments to the new scene count, with the patched scene accent-tinted and the new scene `--add-bg`/`--add-line`, labelled `03 new`.

**Command bar:** `deck.json changed on disk · reloaded 6 scenes` — `ok · 31ms`.

**Behaviour to implement:** watch the deck file (chokidar or equivalent); on change, diff against the previous parse; mark touched scene IDs; hold those marks until dismissed (not on a timer); re-render player and scene list without a manual refresh; **do not steal focus or interrupt playback**. If a tool returns "no matching block" instead of ops, Studio renders nothing — that response lives in the user's AI app.

---

### Stage 5 — Render (brief §4.5)

#### `1f` Render dialog — in progress and failed

Both 472px, Radix Dialog, `--panel` on `--line`, radius 10px, `--shadow`.

**In progress:** header "Rendering" + a `9:16` accent chip + `12 workers`. Body: `387 / 555 frames` ⟷ `70%` in 11px mono over a 5px `--raised` track with an `--accent` fill; beneath it `elapsed 00:41` ⟷ `eta 00:17 · 9.4 fps`. A 2×2 mono spec grid (fps 30, scale 1× · 1080×1920, codec h264 · crf 18, audio narration.wav). Output path on `--void`. A live log block showing the command and `bundled in 1.2s · chunk 4/7`. Footer: "runs in the terminal too — safe to close" + Cancel.

**Failed:** `--err` dot + "Render failed" + `at frame 214 · 00:23`. Progress bar frozen at 38% in `--err`. **The actual error, verbatim and copyable**, on `--del-bg`/`--del-line` — a real stack frame:
```
TypeError: Cannot read properties of undefined
  (reading 'length')
  at CodeBlock (blocks/code.tsx:41:22)
  body.emphasis references line 3 of a 2-line source
```
Then Copy error / Open scene 04 / Show full log. A "RETRY WITH" block gives the resumable command `emaki render deck.json --aspect 9:16 --from-frame 214 --log verbose`. Footer: "partial output discarded" + Close / Fix and retry.

---

### Stage 6 — Theme Studio (brief §4.8)

The one surface a **non-technical designer** touches. Success means completing it without ever learning what a token, a schema, or a required key is. All three paths write the same semantic theme contract; the UI's job is to make filling it feel like design, not data entry.

> **Never show a token key** (`bg.primary`, `data.beforeBar`) and **never surface a validation error verbatim** on these screens.

#### `1l` Theme gallery

Same card grammar as the template gallery. Thumbnail = a representative film frame rendered in that theme. Meta: name, then `seed theme · edited 3d ago` or `from brand · 4h ago`. An in-use theme is accent-ringed. A draft with unfilled slots carries a small `2 slots empty` chip in `--warn` — a status, not an error.

`+ Create` opens a 288px menu (Radix DropdownMenu) with three items, each a title plus one line of plain description:
- **Choose from theme** — start from one that already exists *(default, fast path — most users stop here)*
- **Import from brand** — a site, a screenshot, or a brand PDF
- **Start blank** — pick colours and fonts yourself

#### `1m` Import from brand — extraction landed

**This is the same file-watcher pattern as `1k`.** The user asks their AI app to run `create_theme_from_image`; Emaki makes no call of its own and picks up the written theme file.

**Header (52px):** back link, theme name, `created from a screenshot · 6 minutes ago`, then a success pill on `--add-bg`/`--add-line` — `10 of 12 filled automatically` — plus Discard / Save theme.

**Left (flex):** the **live preview is load-bearing** — an actual film frame re-rendering in the extracted theme on `--void`, with a caption strip: "Previewing your real film with this theme — it updates as you fill slots." Not a swatch list. The film is the proof it worked.

**Right (398px):**
- **"Two things to pick"** — gaps presented as a **checklist, never an error**. Each gap is a `--warn`-bordered card:
  - *"We couldn't find a colour for **negative trends** — pick one."* Three 30px derived suggestions (first pre-selected with an accent ring) plus a `+` custom swatch, labelled "suggested from your palette". A sensible default is always pre-filled and acceptable as-is.
  - *"Your site's **display font** isn't we can embed. Closest matches:"* — three options rendered **in their own typeface**, the closest match accent-selected. The licence allowlist is enforced by what's offered; it is never explained as a rule.
- **"Taken from your brand"** — a 2-column swatch grid **labelled by meaning**: Background, Heading text, Body text, Highlight, Positive trend, Muted fill, Rules & lines, Card surface, plus "Body font — Inter Tight". Every one is editable via "Edit any of these".
- Footer: `Written by create_theme_from_image · Studio picked up the file`.

#### `1n` Start blank — manual builder

1440×760. Left 378px: seven meaning-labelled colour rows (26px swatch → label → hex in 10px mono `--text-3`), the focused row inset on `--accent-soft` with an `--accent-line` border. Then two font pickers labelled **Display** and **Body**, each previewing in its own face, listing only licence-cleared families, with the reassurance "Both fonts ship with your films, so viewers see them exactly as you do."

Right: the same live preview on `--void`, updating continuously as values change — `Updates as you change anything · scene 2 of 6`.

**Save** returns to the gallery with the new theme as a card.

---

### Stage 7 — Foundations

#### `1i` Component inventory

Build these as the shared primitive layer before assembling screens.

**Buttons** — Primary (`--accent` fill, `--accent-ink` text, radius 6px, 7×12px, 12px/600) · Secondary (`--panel-2` on `--line`, `--text-2`) · Ghost (no border) · Destructive (`--del-line` border, `--err` text) · Disabled (secondary at 50% opacity) · Icon (28px square).

**Inputs & selects** — resting (`--raised` on `--line`, radius 5px) · focused (`--accent` border + `--focus` ring) · select (mono value + 9px `▾`) · invalid (`--del-line` border, `--err` text) · placeholder (`--text-3`) · toggle (30×17px pill, `--accent` when on, `--accent-ink` knob).

**Tabs / segmented / tooltip** — underline tabs (`inset 0 -2px 0 var(--accent)`) · segmented control (2px padding, `--panel-2` trough, active pill) · tooltip (`--raised` on `--line`, 10px mono, `--shadow`).

**Scene-list row** — the four states: default, selected, dragging (`--panel-2` with a `⠿` handle replacing the index), invalid.

**"Updated" indicators** — the three MCP change chips: `updated` (accent fill) with a `dismiss` action, `new` (outlined `--add-line`) with `dismiss`, `removed` (outlined `--del-line`, struck-through label) with `undo`.

**Validation message** — error variant on `--del-bg`/`--del-line` with a `!` glyph, a bolded `scene · field` reference and a `go to field →` link; success variant on `--add-bg`/`--ok`.

**Progress** — 5px `--raised` track, `--accent` fill, 10px mono caption underneath.

**Command chip** — `--void` on `--line`, radius 5px, `--accent` `›`, command in `--text-2`, `copy` at the end.

---

## Interactions & Behaviour

**Navigation:** selecting a scene updates player position, Inspector, and Narration highlight together. Aspect switching re-letterboxes the canvas and, at 9:16, **re-lays out the flanks** into filmstrip + vertical transport. Drag-to-reorder in the scene list writes to `deck.json` and re-segments the scrubber.

**Playback:** `Space` play/pause, `→`/`←` step one frame, `Home`/`End` jump to start/end, click or drag the scrubber to scrub. "Clean preview" hides all chrome around the canvas. Loop is a persistent toggle.

**File watching (the core behaviour):** watch the deck file; on external change, re-parse, diff against the last known state, mark touched scene IDs as `updated` / `new` / `removed`, refresh scene list, player, and Monaco. Marks persist until explicitly dismissed. Never steal focus, never interrupt playback, never show a modal for an external change.

**Validation:** revalidate on every change. Errors are navigable from three places — scene list row, Inspector callout, Monaco gutter — and clicking any of them focuses the offending field. Never render a wall of text.

**Every action writes its CLI equivalent to the command bar**, with the result and elapsed time.

## State

```
deck            parsed deck.json + file path + dirty flag
selectedSceneId
playback        { playing, frame, loop, cleanPreview }
aspect          '16:9' | '1:1' | '9:16'
theme           active deck theme id
validation      Array<{ sceneId, fieldPath, message }>
mcp             { connected, clientName, lastCall: { tool, at, opCount } }
changes         Map<sceneId, { kind: 'updated'|'new'|'removed', rationale?, at }>
render          { status: 'idle'|'running'|'done'|'failed', frame, total, elapsed, eta, error? }
commandLog      Array<{ command, result, ms }>
themes          Array<Theme> + draft state for the builder
```

Deck state is **derived from the file**, never the source of truth in memory — Studio is a view onto disk. Writes go through the CLI/engine layer, not direct JSON mutation from components.

## Assets

None to transfer. Fonts are Google Fonts (**Public Sans**, **JetBrains Mono**) — self-host them for a local-first tool. Icons are typographic placeholders; substitute a real icon set. All film frames in the canvas are placeholder compositions and are out of scope.

## Files

| File | What it is |
|---|---|
| `Emaki Studio.dc.html` | All 14 frames on one canvas, arranged in the 7 flow stages. The reference. |
| `Emaki Studio (standalone).html` | Self-contained offline copy — open it directly in a browser, no server needed. |
| `README.md` | This document. |

Open the standalone file to read measurements off the real thing; use the browser inspector on any element — every value is an inline style, so what you see is the spec.

## Build Order

1. Tokens + the two themes as CSS custom properties, then the component inventory (`1i`)
2. Studio shell at 16:9 (`1a`) — panes, transport, command bar
3. Live update from MCP (`1k`) — the file-watcher and the change affordances
4. First run (`1e`), then 1:1 and 9:16 (`1b`, `1c`)
5. Render dialog (`1f`), MCP panel (`1j`), template gallery (`1h`)
6. Theme Studio (`1l`, `1m`, `1n`)

## The Test

A frontend developer opens a screenshot of this on X. In four seconds they should think *"that's a real tool"* — not *"another AI wrapper."* When a decision is ambiguous, choose the one a Remotion Studio or Linear user would expect. Everything else is downstream of that.
