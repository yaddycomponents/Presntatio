# Mocha Terminal — video theme spec

Visual contract for the "big refactor / 10 tech debts / version upgrade" video.
Derived from my actual setup: **Catppuccin Mocha** (VS Code) + **Fira Code** + the Claude Code chat pane.

Import `theme.css` and use its variables and classes. Do not introduce colors or fonts outside this file.

## Hard rules

- Stage is exactly **1920×1080, 30fps**. Every scene fills `.stage`, nothing bleeds past it.
- Two typefaces only: **IBM Plex Sans** (titles, narration) and **Fira Code** (all code, terminal, filenames, numbers, labels — ligatures ON).
- Minimum readable size is **28px**. Captions may go to 22px; nothing narrated goes below 28px.
- **One dominant accent per scene.** Never more than two accents competing in a frame.
- Background is `--bg` (#11111B) or `--surface` (#1E1E2E). No gradients except a single soft radial glow (max 16% alpha) used as an anchor.
- Animate **translate, opacity, scale** only. No blur, rotation, skew, or 3D.
- One easing curve for the whole video: `--ease` = `cubic-bezier(.22,1,.36,1)`. Base beat 480ms, stagger 90ms.
- Every scene holds **2.5–4s** after motion settles so it's readable at speed.

## Color semantics

| Token | Hex | Means |
|---|---|---|
| `--green` | #A6E3A1 | additions, passing, wins, **agent body voice** |
| `--red` | #F38BA8 | removals, tech debt, the before-state |
| `--mauve` | #CBA6F7 | primary accent, git branch, section labels |
| `--teal` | #94E2D5 | filenames, metrics, shell prompt |
| `--peach` | #FAB387 | transitions, arrows, agent status line |
| `--yellow` | #F9E2AF | dirty git state, warnings |
| `--bold` | #F2F4FF | bold emphasis inside agent copy |
| `--chip` | #313244 (`--border`) | inline-code chip background |

Green is not only "success" — in the agent-chat scene it is the body text color. Use `--bold` for emphasis inside it, not a different hue.

## Scenes (use in this order)

**A · Title card** — Left-aligned on `--bg`, one mauve radial glow at 18%/30%. Mono eyebrow (repo + branch), 96px title, then status pills (`v0.1.10-beta`, `node 24`). Title words rise 24px staggered 80ms; pills fade in last.

**B · Diff split** — Window chrome bar (three dots + filename) over a 50/50 grid. Left = before, red rows on `rgba(243,139,168,.1)`. Right = after, green rows on `rgba(166,227,161,.1)`. Red side types in and wipes left→right first; green side slides in from x+40 after 400ms. Never animate both sides at once.

**C · Checklist burndown** — Title + `10 / 10 closed` counter. Rows are sunken cards with a 2px green left border: index, mono title, ✓. Rows land bottom-up 120ms apart; each ✓ pops to 1.25× then settles; counter ticks with each row.

**D · Version + metrics** — Mauve eyebrow `VERSION UPGRADE`. Old version desaturates to `--faint` and strikes through, peach `→`, new version large in green. Three stat cards below (files touched / enums mapped / regressions). New version counts up digit-by-digit; stat numbers roll, never crossfade.

**E · Terminal beat** — VS Code panel tab strip (Terminal active, mauve underline) over mono output on `--bg`. Real prompt shape: `heisenberg on  branch [$!↑] is  v0.1.10-beta`. Lines type at ~28 chars/sec, then hold 600ms. Blinking `.caret`. Use as a breather between heavy scenes.

**F · Outro** — Centered, teal radial glow from the bottom (50%/120%). "Shipped." + two mono summary lines + one pill. Everything scales in from 0.96 together as a single beat, hold 2s, cut to black.

**G · Agent chat** — Claude Code pane: `--surface` header bar with peach ✳ and "Claude Code", body on `--bg`. Use `.agent` classes: green body copy, `<b>` in `--bold`, `<code>` chips on `--border`, `●` bullet dots, faint "Ran 1 shell command" lines, thin `--border` divider, then the peach `▸▸ auto mode on` status line. Reveal one bullet block at a time, 480ms apart.

## Content facts to use

- Repo `heisenberg`, branch `feat/i18n-wire-heisenberg`, version `v0.1.10-beta`
- Node 18 → **v24.12.0** (npm v11.6.2)
- 167-key i18n delta wired · 204 enum maps consolidated · frozen status configs removed · column headers → `tCol()`
- 24 files changed, eslint 15 warnings / 0 errors / no unused-vars
