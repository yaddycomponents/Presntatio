# Emaki — Final Review & Full Possibilities

**What this is.** A consolidated review of Emaki (the product) measured against two things: (1) the real job — turning a product screenshot/Figma into a demo film — stress-tested by building a Growfin "AI Replied → Promise to Pay" teaser, and (2) the **v1 prototype** it grew out of: `~/Desktop/Presnetatio/app/src` — a bespoke Remotion/Framer-Motion presentation app (88 hand-authored `.jsx` scenes, ~5.7k LOC). The `AI Reply/` folder in that app is literally the deck that became Emaki's `saas-product` theme.

**The core arc of the product.** v1 = infinite fidelity, hand-coded per scene (not declarative, not AI-authorable, not reusable, no MCP). Emaki = declarative `deck.json` + reusable blocks + MCP tools + themes — **authorable by an AI, re-skinnable from 5 hex values, rendered in seconds.** The productization is real and valuable. This doc maps what was lost in that translation and what the product could become.

---

## 1. Verified state (what works today)

Confirmed by building + rendering + frame-inspecting the Growfin teaser:

- **Deck → MP4 in seconds** via Remotion. Fast iteration loop.
- **`ui-scene` block**: constrained-flex node tree with **state-gated reveals** (`states:[{id,hold}]` + `in:[state]`). Skeleton→loaded→replied→activity told entirely through content gating. This is a genuinely good model.
- **`chrome:"app"`** renders window dots, title bar, nav rail, top-bar search/bell/avatar — real product framing.
- **Theme-by-file**: `themes/<id>.theme.json` beside the deck; full re-skin from `name`+accent. `theme_import` derives surface/muted/data palette/type ramp.
- **Round-2 primitives shipped** (all verified working): `image`, `button`, `checkbox`, `chip`, `tabs`, `search`, per-node `color` on dot/badge/icon, `listRow.subText`, a **UI-scale type ramp** (`eyebrow…metric`, ~11–28px), `crossfade`+`transitionMs`, `list_icons`.
- **Guardrail**: `propose_scenes` refuses to fabricate metrics without grounding. Correct default.

### Bugs found & already fixed (regression tests worth keeping)
- **P0** `validate_deck` / `theme_import` rejected object params (`expected object, received string`) → fixed (accept stringified objects).
- **P0** unsupported glyphs (`＋ ✦ … — →`) rendered as tofu boxes silently → the "random broken text." (Lint/warn on non-covered glyphs is still the durable fix.)

---

## 2. Capability matrix — v1 vs Emaki product

What the prototype proves is achievable, and whether the product exposes it.

| Capability (in v1) | v1 | Emaki product | Note |
|---|:--:|:--:|---|
| Reveal presets: fade/rise/pop/maskReveal/drawIn/spinIn/growX·Y/flash/count | ✅ | ⚠️ engine-only | All 11 presets are ported into `@emaki/core`, but `ui-scene` derives timing from the tree — **authors can't pick a per-node preset** (e.g. slide vs fade). |
| **Animated AI Sparkle** (gradient 4-point star, spring pop) | ✅ | ❌ | Emaki's `badge` is a static pill. The signature AI mark is gone. |
| **Gradient text** (`Grad`, AI emphasis) | ✅ | ❌ | No gradient/AI text style. |
| **AI avatar** (pink→blue gradient + sparkle) | ✅ | ❌ | `dot` accepts a solid `color` only. |
| **`pulse`** loop helper (living/breathing indicator) | ✅ | ❌ | No looping/idle animation → no "AI is thinking". |
| **`flash`** attention highlight (good/bad) | ✅ | ❌ | No per-element highlight/emphasis pulse. |
| **`countText` / Ticker / Number** count-up | ✅ | ⚠️ | `count` node exists; not wired into `ui-scene` state changes. |
| Rich email **Thread/Msg** (avatars, timestamps, dividers, AI sender) | ✅ | ⚠️ | `listRow` is close but flatter (no per-message thread, no AI-avatar variant). |
| Arbitrary layout / spacing / shadows / any Lucide icon | ✅ | ❌ | Blocks only; icons are an 18-name allowlist. |
| Declarative, AI-authorable, reusable, MCP-driven, themeable | ❌ | ✅ | **This is the product's whole reason to exist.** |

**Takeaway:** the biggest fidelity losses (Sparkle, gradient text, AI avatar, pulse, flash) are **already solved in v1** — they're not research, just un-productized components. Porting them is the highest-ROI fidelity work.

---

## 3. Gaps that need net-new work (not in v1 either)

The "AI-Replied narrative" test video — *skeleton → inbox loads → new customer email arrives → AI detects → AI replies, focused, no text* — fails on capabilities **neither** v1 nor the product has. These define whether Emaki becomes a real product-demo tool.

| # | Missing capability | Sev | Blocks | Feature shape |
|---|---|:--:|---|---|
| 1 | **Camera / viewport** (zoom, pan, spotlight, dim-rest) | 🔴 P0 | "focus on AI Replied" | per-state `focus: {target, scale, dim?}` → eased push-in |
| 2 | **Element enter/exit + list reflow** (slide-in, push-down) | 🔴 P0 | "new email arrives" (only fades today) | per-node `enter`/`exit` presets; keyed lists animate insert/remove |
| 3 | **Live/process indicator** (spinner, typing, scan) | 🟠 P1 | "AI detecting" | `spinner`/`typing` leaf, or reuse v1 `pulse` |
| 4 | **Cursor / interaction sim** (move, click, hover) | 🟠 P1 | "open the email", click demos | `cursor` layer with keyframed path + click pulse |
| 5 | **Per-state transition choreography** (not whole-scene crossfade) | 🟠 P1 | one element changing while others hold | scope transition to changed nodes |

**The fork:** Emaki today models *"what is visible in each state."* Gaps 1–2 require modeling *"how the viewport and elements move through time"* — a timeline/camera layer. That's the decision that separates "animated mockup" from "product-demo tool."

---

## 4. Layout / fidelity gaps (found via frame inspection)

- **P0 — No `justify`/`align` on containers.** Multi-child `row`s default to `space-between`, so every `[icon,text]` / `[dot,text]` row breaks (icon left, text jammed right). Single-child rows are fine. There is **no way to left-pack a multi-child row** from the deck. Add `justify: start|center|end|between` + `align`; default should be `start`, not `between`.
- **P1 — `space-between` + a wide child = overlap** (the "Activity created" pill collided with the next text), not just wide gaps. Items aren't reserving width correctly.
- **P1 — UI type ramp still runs large by default** for dense screens; good defaults for `ui-scene` labels would help.

## 5. DX / correctness gaps

- **P2 — Validation error paths stop at the container** (`✖ Invalid input → at scenes[1].props.root.children[3]`) instead of naming the offending leaf + field + value. This turned a 1-char fix (`size:"rowLabel"`) into a hunt.
- **P2 — `describe_ui_nodes` surfaces theme-only type tokens** (`rowLabel, chapter, statement, display, hero, stat`) as if they were valid node `size`s — but they fail validation. Node `size` enum is only `eyebrow,label,body,md,lg,h2,metric`. Separate the two vocabularies in docs.
- **P2 — Icons are an 18-name allowlist** vs v1's full Lucide set. Fine as a safe default, but expose a way to opt into more (or an `image`-based custom icon).

---

## 6. Prioritized roadmap ("full possibilities")

**Now — port what v1 already proves (fidelity, low risk):**
`Sparkle` (animated AI mark) · `Grad` gradient text · AI-avatar variant on `dot`/`listRow` · `pulse` idle loop · `flash` highlight · wire `count` into state changes.

**Next — the product-demo unlock (motion layer):**
Camera/`focus` per state (gap 1) · per-node `enter`/`exit` + keyed-list reflow (gap 2). These two turn Emaki from "animated mockup" into "demo tool."

**Then — realism & interaction:**
`cursor`/click sim (gap 4) · process/typing indicator (gap 3) · scoped per-state transitions (gap 5) · `justify`/`align` on containers (§4 P0).

**Always — DX hardening:**
precise validation error paths · glyph-coverage lint · doc split of theme tokens vs node sizes.

---

## 7. Positioning

**Great today:** release-note reels, changelog scrolls, stat/quote cards, before/after, on-brand *abstract* product-motion teasers, and — after round-2 — **static product-UI mockups with skeleton→loaded reveals**.

**Not yet:** narrated product walkthroughs that need a **moving camera, arriving/animating elements, a cursor, or live indicators.** Everything in §3.

**The prize:** v1 already renders pixel-perfect AI-Reply scenes by hand. Emaki's bet is doing that *declaratively and via AI*. Close §2 (port v1 components) and §3 gaps 1–2 (camera + element motion), and Emaki can regenerate the entire v1 presentation from a `deck.json` — which is the moment the product fully replaces the prototype.
