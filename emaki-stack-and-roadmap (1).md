# Emaki v2 — Stack & Roadmap

Written against the v1 repo (yaddycomponents/Presntatio) as read on 2026-07-25. Assumes the decisions from our conversation:
BYO AI subscription via MCP (not an in-app key), local render, code-as-template, marketplace later,
dev community as primary audience with non-devs served via content mode and MCP host apps,
30-second social films as the wedge.

---

## 0. The decision that reorders everything

**Do not build a hosted web app. Build a CLI that opens a local studio.**

```bash
npx emaki studio      # → http://localhost:5273
```

Reasons, in order of weight:

1. **Remotion render needs Node and real CPU.** Hosting that means a render queue, workers, storage, and per-minute cost — the exact thing BYO-key was supposed to delete.
2. **BYO key only means something if it's local.** "Your key never leaves your machine" is literally true when the AI call originates from a Node process on localhost. It's a marketing claim the moment there's a server.
3. **Your privacy problem is your users' privacy problem.** Your own Heisenberg deck can't go public because it has real chunk names in it. Everyone's does. Local-first isn't a compromise here, it's the correct architecture.
4. **Zero infra means zero distraction.** No auth, no billing, no egress, no VAT, no SOC2 questions. You ship blocks instead of a login page.

This is the Remotion Studio / Storybook / Vite pattern, and it's well-trodden. A hosted gallery comes later as a *separate* static site. Tauri is an option once you want a double-clickable app — don't start there, code signing will eat a week.

---

## 0c. AI comes in via MCP, not an in-app chat panel

**Reverses §0's AI-layer plan.** Instead of building a chat panel with a provider picker and a
pasted key, Emaki ships an **MCP server**. Devs add it to Claude Code; anyone with Claude Desktop
or claude.ai connects the same way. One server, both audiences, and the "chat UI" is whichever
app the user already has open — never yours.

```bash
emaki mcp serve      # stdio or local http, launched by the host app or manually
```

Why this beats the chat-panel plan on every axis that mattered:

1. **Schema-first stops being a discipline and becomes physically unavoidable.** MCP tools are
   defined by a JSON schema — you cannot expose a tool without one, and `zod-to-json-schema`
   generates it straight from the same Zod definitions that already validate the engine. There is
   no path to a tool call that skips validation.
2. **The ops-review model is free.** "Propose an edit, human approves, then apply" is exactly how
   tool calls already render in Claude Code and Claude Desktop. No diff UI to design or maintain.
3. **BYO-key becomes literal instead of a feature you build.** Not "paste your API key into my
   app" — "connect my tool to the AI app you already pay for." No key storage, no provider picker,
   no masked-key display, no trust copy. The whole "is my data leaving my machine" worry has no
   surface left to attach to.
4. **Positioning risk is gone.** There is no chat bubble in the product for anyone to compare to
   Gamma or Tome. Emaki is a tool other AI apps use, not an AI app itself.

**What doesn't disappear: Studio.** Nobody can scrub a timeline or drag scenes from inside Claude
Desktop, so Studio stays as the viewer/editor/render surface. What changes is *how AI reaches it*:

> **Studio never calls a model directly.** Every AI-touching action is an MCP tool that writes to
> `deck.json` or a theme file on disk. Studio watches the file and hot-reloads. "Generate scenes
> from an intent" isn't a form with an API call behind it — it's Studio saying *"ask your AI: run
> emaki's `propose_scenes` on this"*, the tool runs in whichever app the user has open, writes the
> ops or the file, and Studio updates because the file changed. Studio becomes a pure file-watcher
> with zero AI code inside it.

**Tool surface — small and composable, not one do-everything tool:**

```
validate_deck(deck)
propose_scenes(intent, grounding?)      → ops, read-only, proposes only, never writes
apply_ops(deck, ops)                    → writes deck.json
render(deck, aspect)                    → writes file, returns path
extract(source)                         → partial deck from url / stats json / git log
create_theme_from_image(image)          → theme proposal against the token contract
list_templates() / list_themes()
```

Small tools matter specifically because a host client's approve/deny UX works per call — one
giant tool collapses that into a single opaque yes/no, which is the same "black box" failure mode
the chat-panel plan was trying to avoid in the first place.

**`propose_scenes` without a template or grounding data** is bounded by the block library, not by
the model. It can sequence and parameterise existing blocks (`title`, `statement`, `stat`,
`compare-bars`, `chapter`, `list`) in effectively unlimited combination, but it cannot invent a
visual pattern no block expresses — that needs a `custom` scene, which needs a developer. Two
guardrails belong in the tool's contract from the start:

- **Return a "no matching block" signal** rather than silently forcing content into the wrong
  shape — "I can express this as a stat + list, or I can't yet do X" beats a bad-fit render.
- **Refuse to fabricate specific metrics when no grounding was passed.** A template or an
  extractor supplies real numbers; a blank-slate call has no such backstop, and an AI generating
  plausible-sounding stats from nothing is the one place "AI-generated" becomes actively
  misleading rather than merely templated.

**What this deletes from §0's original plan:** the provider-config screen, the key-paste UI, the
in-app chat panel, and `assistant-ui` as a dependency. All four are replaced by "connect an MCP
client," which every relevant host app already provides.

---

Everything must work headless. The studio is the visual layer, never the only path.

```bash
emaki init [--template <name>]      # scaffold deck.json
emaki validate <deck.json>          # schema errors, exit code 1 on fail
emaki dev <deck.json>               # player only, HMR, no studio chrome
emaki studio [deck.json]            # full UI
emaki render <deck.json> --aspect 9:16 --out film.mp4
emaki extract rollup <stats.json>   # → partial deck
emaki mcp serve                     # exposes propose_scenes/apply_ops/render/extract as MCP tools
```

Three rules that fall out of this:

1. **Parity.** Every studio action maps to a CLI command. No feature is studio-only. If it can't be expressed as a command against a file, it's probably the wrong feature.
2. **`--dry-run` and `--json` everywhere** — on `validate`, `extract`, and `render`. These are the commands that still run headless in the CLI (§0c moved AI generation itself into MCP, so it's driven by whichever AI host the user is in, not by a CLI flag). `--json` on these is still what makes the tool scriptable and CI-able.
3. **The studio surfaces the command it just ran.** When someone clicks Render, show `emaki render deck.json --aspect 9:16`. Devs learn the CLI by using the GUI, and the GUI stops being a black box. This is a design requirement, not a nice-to-have — it's in the design spec.

**CI, honestly, in two tiers now that generation lives in MCP:**

- **Keyless and scriptable today:** a GitHub Action running `extract` → `render` on tag push — a template's scenes get repopulated with fresh build stats and re-rendered, no AI involved, attach the film to the release. This works exactly as originally envisioned because neither command ever depended on `generate`.
- **AI-authored content in CI is a different, harder problem post-MCP.** `propose_scenes`/`apply_ops` are designed to be approved by a human inside an AI host (Claude Code, Desktop) — there's no unattended actor in that loop by default. Doing this in CI would mean scripting an MCP client server-side to call the tools programmatically with no human approval step, which is a real but separate feature to design deliberately (and reintroduces a server-side API key, which §0c specifically avoided). Don't assume this exists until it's actually built.

---

## 1. Stack

### Foundation

| Concern | Choice | Why this and not the obvious alternative |
| --- | --- | --- |
| Monorepo | **pnpm workspaces + Turborepo** | You'll have 6–8 packages with a real build graph. Turbo's caching matters because Remotion renders are slow. |
| Language | **TypeScript, strict** | Non-negotiable now. The schema *is* the product, and Zod→types is what makes it enforceable. |
| Versioning | **Changesets** | You'll publish `@emaki/*` separately. Manual version bumps across 8 packages fails fast. |
| CI | **GitHub Actions** | lint + typecheck + vitest + frame-diff (see §4). |

### The engine

Keep what works — the 588 lines of `theme.js` + `motion.js` + primitives port almost as-is.

| Concern | Choice | Notes |
| --- | --- | --- |
| Schema | **Zod** | Single source of truth. `z.infer` for types, `.parse()` at load, `zod-to-json-schema` for the model. One definition, three consumers. |
| Preview runtime | **React 19 + Framer Motion 12** | Unchanged. Authoring/HMR only. |
| Render runtime | **Remotion 4** | Output of record. Deterministic frames, `--concurrency`, no compositor-timeline fragility. |
| Bridge | **your own `timeline` descriptor** | The 11-preset mapping from our last conversation. This is the load-bearing abstraction. |
| Keep | **`record.mjs`** | Fallback for custom Framer-only scenes. Do not delete the CDP comment. |

### The studio UI

| Concern | Choice | Why |
| --- | --- | --- |
| App | **Vite + React + TS**, served by the CLI | Same toolchain as the engine. No SSR needed — it's localhost. |
| Chrome styling | **CSS Modules + CSS custom properties** | No Tailwind, no shadcn. Vite-native, zero config, scoped by default. Studio chrome vars derive from the same token contract the engine uses, so there's one design system instead of two. |
| Component behaviour | **Radix primitives** (dialog, dropdown, tabs, tooltip) | Unstyled behaviour + accessibility only. This is the part shadcn was actually earning; take it directly. |
| Pane layout | **`react-resizable-panels`** | Unstyled, handles the 3-pane split and persistence. |
| JSON editor | **Monaco** | The reason is specific: point Monaco at your JSON Schema and you get autocomplete on block types, inline validation, and hover docs for free. That's most of your "UI" solved by one integration. Ships its own CSS, no Tailwind dependency. CodeMirror is lighter but you'd hand-build all of that. |
| State | **Zustand** | One store: deck, selected scene, playhead. Redux is overkill; context will re-render your player. |
| Layout | 3 panes: tree · player · inspector | Remotion Studio's layout. It's correct and users already know it. |

> **Consequence worth noting:** with Tailwind absent from the repo entirely, the old "Tailwind must
> never enter a block" rule and its ESLint enforcement become unnecessary. Blocks stay inline-style +
> token-driven because that's the only option present. One less way a third-party template can
> become unrenderable, and one less rule a contributor can break.

### Content mode — the non-dev surface, defined

Referenced at the top of this doc but not specified until now. This is the same Studio, same
schema, same engine — one flag, not a second product:

```bash
emaki studio --content deck.json
```

What it hides: the scene tree's block-level detail, the Monaco/JSON tab, raw aspect/theme config.
What it keeps: the player, and an inspector reduced to plain-language text fields (headline,
number, caption) plus narration text. A non-technical person edits words and numbers; a developer
or template author owns structure. Gated in the roadmap (§5, "Later, in order") on a real request
from a non-technical user — don't build it speculatively.

### The AI layer — now an MCP server, not a chat panel

See §0c for the full rationale. What used to be an in-app chat panel is now `packages/mcp`,
consumed by whatever AI client the user already runs.

| Concern | Choice | Why |
| --- | --- | --- |
| Protocol | **MCP (`@modelcontextprotocol/sdk`)** | Devs already have Claude Code; non-devs already have Claude Desktop / claude.ai. One server serves both — no chat UI to build. |
| Tool schemas | **Same Zod definitions as the engine**, via `zod-to-json-schema` | One schema, three consumers: engine validation, Studio's Monaco autocomplete, MCP tool definitions. No second source of truth to drift. |
| Ops model | **`propose_scenes` proposes, `apply_ops` writes** | Never one tool that both decides and writes — keeps the host app's own approve/deny UX meaningful per call. |
| Where it runs | **Local process, spawned by the host app or `emaki mcp serve`** | No key ever touches Emaki's code. The host app manages its own provider and credentials entirely. |
| Studio's role | **File-watcher only** | Studio never calls a model. It watches `deck.json` / theme files and hot-reloads when an MCP tool writes to them. |

**Deleted from the plan:** `assistant-ui`, the provider-config screen, the key-paste UI, `generateObject`
called from Studio's own server, and `emaki generate` as a CLI command that talks to a model directly
(the CLI keeps `validate` / `render` / `extract`, which need no AI at all).

---

## 2. Repo layout

```
emaki/                        ← @emaki scope; binary name `emaki`
├─ packages/
│  ├─ schema/          zod defs, JSON Schema export, dur calculator      ← build first
│  ├─ core/            tokens contract, motion presets, primitives, Stage
│  ├─ blocks/          the ~9 block types + per-aspect layouts + timelines
│  ├─ themes/          warm-editorial, saas-product (ported from your two decks)
│  ├─ render/          remotion host + record.mjs fallback
│  ├─ extract/         rollup stats · lighthouse · git log → partial decks
│  ├─ mcp/             MCP server: propose_scenes, apply_ops, render, extract, themes — see §0c
│  ├─ studio/          the local UI (Vite + CSS Modules + Radix + Monaco); pure file-watcher, no AI calls
│  └─ cli/             emaki studio | render | init | validate
├─ templates/          your own first-party packs (this is the "marketplace" for now)
├─ fixtures/           heisenberg.deck.json, ai-autoreply.deck.json  ← regression suite
└─ .github/workflows/
```

`fixtures/` matters more than it looks. Your two throwaway decks become the proof that the theme
contract holds across two unrelated visual languages, and the input to frame-diff testing. Port
them to JSON, then delete the JSX.

---

## 3. Aspect ratios — get this in before templates exist

From last time: your type scale already adapts via `clamp()`, but layout doesn't. `ChunkBarsScene`
is side-by-side columns at `min(940px, 94vw)` — that composition dies at 9:16, and 9:16 is the wedge.

Put it in the schema from day one:

```ts
const Aspect = z.enum(['16:9', '1:1', '9:16'])

// each block declares its own layouts; the deck only picks an aspect
export const compareBars = defineBlock({
  type: 'compare-bars',
  props: z.object({ /* … */ }),
  layouts: {
    '16:9': ColumnsLayout,     // current design
    '1:1':  ColumnsLayout,
    '9:16': StackedLayout,     // before above, after below, shared axis preserved
  },
  timeline,                     // one timeline, all layouts
})
```

Retrofitting this after third parties ship templates is a breaking change to every template.

---

## 4. Testing: how you protect the taste

The real risk you named — "does the aesthetic survive parameterisation" — is testable.

- **Vitest** on pure functions: schema parse/reject, `dur` computation, timeline generation, bar-max derivation. Fast, high value.
- **Frame diff** as the taste suite: for every block × aspect, render frames at ~25%/50%/90% of its duration to PNG via Remotion, commit as goldens, diff with `pixelmatch` in CI. A layout regression in a shared primitive shows up as a failing image instead of a Slack message six weeks later.
- **Playwright** smoke on the studio: load fixture, scrub, apply a canned AI patch, render 30 frames.

Skip unit tests on scene JSX. It's presentational and the frame diffs cover it.

---

## 5. Roadmap

Six weeks to something you can post. Gates are real — don't pass one on optimism.

### Week 1 — schema first, no UI
- `packages/schema`: Zod deck definition, block registry types, `dur` computed from `wordsPerSecond: 2.2` + animation end time. JSON Schema export.
- `packages/core`: port the 588 lines to TS. Theme contract with required-key validation. One `Stage` that takes theme via context — delete the forked `AI Reply/Stage.jsx`.
- `emaki validate deck.json` works from the terminal.

**Gate: can you hand-write a 3-scene `deck.json` and have it fail with a useful error when wrong?**

### Week 2 — blocks and both render paths
- Four blocks: `title`, `statement`, `stat`, `compare-bars` — each with 16:9 and 9:16 layouts.
- The `timeline` descriptor + Framer adapter + Remotion adapter. 11 presets mapped once.
- `emaki render deck.json --aspect 9:16 --out film.mp4`.

**Gate: the same `deck.json` renders through Framer (preview) and Remotion (MP4) and they match.**
This is the whole thesis. If it fails, stop and fix it before anything else.

### Week 3 — port the fixtures, kill the JSX
- Both old decks → `fixtures/*.deck.json`. Target: ≤2 `custom` escapes each.
- Add `chapter`, `list`, `ui-mock` blocks as the port demands them.
- Frame-diff goldens committed. CI green.

**Gate: `warm-editorial` and `saas-product` both render correctly from one engine.** Now delete
`scenes/`, `AI Reply/`, `remotion/scenes/` — ~5,400 lines gone. That deletion is the milestone.

### Week 4 — the studio
- Vite app, 3-pane layout (`react-resizable-panels`), CSS Modules, Radix primitives.
- Monaco wired to the JSON Schema, live player on `deck.json` HMR, aspect switcher.
- Every action shows its CLI equivalent (§0b rule 3).
- No AI yet. Editing JSON by hand with autocomplete should already feel good. If it doesn't, the schema is wrong and AI won't rescue it.

**Gate: you build a new 30-second film by editing JSON only, in under 20 minutes.**

### Week 5 — MCP server + extractors
- `packages/mcp`: wrap `propose_scenes`, `apply_ops`, `render`, `extract`, `list_themes`/`list_templates` as MCP tools using the same Zod schemas as the engine, via `zod-to-json-schema`.
- `emaki mcp serve` — connect it to Claude Code and Claude Desktop, confirm both work against the same server.
- Studio: no chat panel, no provider config. Add a file-watcher so Studio hot-reloads when an MCP tool writes to `deck.json` or a theme file.
- `packages/extract`: rollup stats JSON first (it's how Heisenberg was made), then git log between tags.
- Rewrite `SKILL.md` as the MCP tool descriptions / block catalogue the model sees.
- Build `propose_scenes`'s two guardrails (§0c): a "no matching block" response shape, and refusal to fabricate specific metrics with no grounding passed in.

**Gate: from Claude Code, ask it to build a 30-second film from a real Growfin build output, and get a watchable render — with zero UI of yours involved until Studio opens the result.**

### Week 6 — ship something public
- 3 first-party templates in `templates/`, each in all three aspects.
- README with an actual embedded film. Docs site can wait; a good README cannot.
- OFL-only font allowlist, validated in CI (see below).
- Publish `@emaki/*` v0.1 via changesets. Post the film, not the repo.

**Gate: one person who is not you renders a film without asking you a question.**

### Later, in order
Content mode (`--content` flag, see §1) once a real non-technical user asks for it → gallery site
(Next.js static, separate repo) → template submissions as PRs → paid packs via merchant-of-record
(Polar/Lemon Squeezy, not raw Stripe) → hosted MCP + hosted render only if people beg (§ hosting
note: same cost profile as hosted SaaS — real CPU for render, real inference cost, real auth —
don't build it speculatively either).

---

## 6. Two landmines to defuse early

**Fonts.** Yeseva One, Josefin Sans, Space Mono — embedding a typeface into rendered video is a
different license grant than serving it on a web page. Once third parties ship templates, you are
the distributor. Ship an allowlist of OFL-clean families, resolve them through
`@remotion/google-fonts`, and fail `emaki validate` on anything else. Cheap now, expensive later.

**Content scrubbing.** The v1 repo has internal chunk names, unreleased-feature framing, and real
customer-impact numbers. When you port the fixtures, sanitise the data — keep the *shape* (it's
what makes them good tests), replace the specifics. Get clearance before the repo is public.

---

## 7. What I'd cut if six weeks becomes three

Keep: schema, 4 blocks, both adapters, CLI render, 9:16.
Cut: the studio UI, the MCP server, Monaco, extractors.

A CLI + a JSON file + a great 30-second render is a shippable product for developers, and it tests
the wedge. The studio makes it accessible to non-developers, which is a real goal but a later one.
The MCP server is the most seductive thing on this list and the least urgent — it is worth nothing
until the schema is stable, and it is nearly free once it is (§0c: the tool schemas are generated
from the same Zod definitions, not written by hand).
