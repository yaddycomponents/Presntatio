# Frappé Terminal — video theme spec

Visual contract for the "big refactor / 10 tech debts / version upgrade" video.
Derived from my real `settings.json`: **Catppuccin Frappé** + **Monaspace Neon** (editor) + **FiraCode Nerd Font Mono** (terminal).

Import `theme.css`. Use its variables and classes. Do not introduce colors or fonts outside it.

> Correction: this is **Frappé**, not Mocha. Frappé base is `#303446`, not `#1E1E2E`. If you see `#11111B`, `#1E1E2E`, `#CDD6F4`, `#A6E3A1` or `#CBA6F7` anywhere in the output, it's the wrong flavour — replace it.

## Hard rules

- Stage is exactly **1920×1080, 30fps**. Nothing renders outside `.stage` — no browser chrome, no URL bar, no bookmarks, no player overlay or dot pager.
- **Font size is one system, not per-pane guesswork:**
  - `--code: 26px / 39px` — editor, diffs, file tree content
  - `--chat: 24px / 36px` — Claude Code pane (**always ≤ editor**, never larger)
  - `--ui: 20px` — tab bar, sidebar labels, status bar
  - narration is sans: 96 / 64 / 34px
  My real editor is 16px/24 at `window.zoomLevel: 1`; those figures are that, scaled 1.6× for 1080p. Do not free-style sizes.
- Fonts: `--font-code` = Monaspace Neon (ligatures on) for editor/diff; `--font-term` = FiraCode Nerd Font Mono for terminal + chat pane; IBM Plex Sans for titles and narration only. Never sans inside a pane.
- **One dominant accent per scene.** Max two accents in a frame.
- Backgrounds are `--bg` #232634 or `--surface` #303446. No gradients except one soft radial glow ≤16% alpha as an anchor. No saturated fill wider than a pill — the status bar is `--surface`, never a bright mauve band.
- Animate **translate, opacity, scale** only. No blur, rotate, skew, 3D.
- One curve: `--ease` `cubic-bezier(.22,1,.36,1)`. Base beat 480ms, stagger 90ms. Scenes hold **2.5–4s** after motion settles.
- No pane may contain an empty region taller than ~2 lines. Content top-aligns under its header; footers use `margin-top: auto`. If a pane has nothing to show, remove the pane and let its neighbour take the width.

## Color semantics

| Token | Hex | Means |
|---|---|---|
| `--green` | #A6D189 | additions, passing, wins, **agent body voice** |
| `--red` | #E78284 | removals, tech debt, before-state |
| `--mauve` | #CA9EE6 | primary accent, git branch, section labels |
| `--teal` | #81C8BE | filenames, metrics, shell prompt |
| `--peach` | #EF9F76 | transitions, arrows, agent status + confirm lines |
| `--yellow` | #E5C890 | dirty git state, warnings |
| `--bold` | #EEF2FF | bold emphasis inside agent copy |
| `--border` | #414559 | hairlines + inline-code chip background |
| `--term-green` | #00FD61 | my `terminal.foreground` override — **real shell output and cursor only**, never chat or UI |

Green is not only "success": in the chat pane it is the body text color. Emphasise with `--bold`, not another hue.

## Scenes (use in this order)

**A · Title card** — Left-aligned on `--bg`, one mauve radial glow at 18%/30%. Mono eyebrow (repo + branch), 96px title, then status pills. Title words rise 24px staggered 80ms; pills last.

**B · Diff split** — Tab bar (filename + dirty dot) over a 50/50 grid. Left `.del` rows, right `.add` rows, both at `--code`. Red side types in and wipes left→right; green side slides from x+40 after 400ms. Never both at once.

**C · Checklist burndown** — Title + `10 / 10 closed`. Rows are `--sunken` cards with a 2px green left border. Rows land bottom-up 120ms apart; each ✓ pops to 1.25×; counter ticks per row.

**D · Version + metrics** — Mauve eyebrow. Old version desaturates to `--faint` + strike-through, peach `→`, new version large in green. Three stat cards. Version counts up digit-by-digit; stats roll, never crossfade.

**E · Terminal beat** — Panel tab strip (Terminal active, mauve underline). Output in `--font-term` using `--term-green` #00FD61 (my override) with `.caret` in the same green. Types at ~28 chars/sec, holds 600ms. A breather between heavy scenes.

**F · Outro** — Centered, teal glow from 50%/120%. "Shipped." + two mono summary lines + one pill. Scales in from 0.96 as one beat, hold 2s, cut to black.

**G · Agent chat** — Use `.chat`: `--surface` header (56px, peach ✳ + "Claude Code"), body on `--bg`, top-aligned, `gap: 20px`. Prompt `❯` **and its text both green** (not mauve). `●` bullets, `<b>` in `--bold`, `<code>` chips on `--border`, confirm lines `▸ … (y/n)` peach + faint. Footer via `.foot`: `app (git:main)` green, `▸▸ auto-accept edits on` peach, `(shift+tab to cycle)` faint. Reveal one block at a time, 480ms apart. Every line fits on one line at 1920 — if it wraps, shorten the copy, don't shrink the font.

## Content facts to use

- Repos: `heisenberg · crm`, `asgard · cashapps`, `grow-components`
- Branch `feat/i18n-wire-heisenberg`, version `v0.1.10-beta`, Node 18 → **v24.12.0** (npm v11.6.2)
- React 17.0.2 → 18 · StrictMode double-invoke · legacy `ReactDOM.render` · 83 effect files
- `@sinecycle/growrte` on Tiptap 3 — one package, 77 files; email + comment presets
- 167-key i18n delta wired · 204 enum maps consolidated · column headers → `tCol()`
- 24 files changed, eslint 15 warnings / 0 errors
