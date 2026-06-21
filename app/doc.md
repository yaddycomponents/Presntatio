# New Bundle — Release Presentation

> The modernization of **heisenberg**: a performance overhaul, a unified filter system,
> dependency upgrades, and a move to zero-runtime CSS — shipped on the `new-bundle` branch.

**Scale:** `new-bundle` is **229 commits / 1,768 files** ahead of `dev-master`
(+52.7k / −63.1k lines — we deleted more than we wrote).

**Status legend:** ✅ done · 🚧 in progress · 📋 planned

---

## 0. The headline (one slide)

| Outcome | Before | After | Change |
| --- | --- | --- | --- |
| Dashboard **Load** | 2.19 s | **0.755 s** | **−65%** |
| Dashboard **total transferred** | 13.0 MB | **2.45 MB** | **−81%** |
| `vendor` chunk | ~10 MB | **1.75 MB** | **−82%** |
| **LCP** | 6.07 s | **2.92 s** | **−52%** |
| Boot API calls | ~30 | **~14** | **−53%** |
| Filter-layer code | ~18.8k LOC | **6.5k LOC shared** | **−12.2k LOC** |

**One line:** the app now loads **~2.6× faster and ~5× lighter**, the team maintains
**one** filter system instead of fifteen, and styling moved out of JavaScript into static,
cacheable CSS — all while **deleting more code than we added**.

---

# PART A — IMPACT *(present this first)*

## A1. Customer impact — what the user feels

| What changed | Why the user cares |
| --- | --- |
| **Pages load 2.6× faster** (Load 2.19 s → 0.755 s) | The app is usable in under a second instead of waiting on a 13 MB download. |
| **5× lighter download** (13 MB → 2.45 MB) | Faster on slow networks and mobile; far less data used per session. |
| **LCP 6.07 s → 2.92 s** | The main content paints less than half as late — the #1 "feels slow" metric. |
| **Infinite feeds no longer freeze** | The activity feed stayed smooth past ~1000 cards (used to lock up the tab). |
| **One consistent filter everywhere** | Same pills, +Filters menu, saved views, and AI SmartFilter across 15 pages. |
| **New: AI Auto-Reply + Report Builder** | New product surfaces for automation and custom reporting. |
| **Cross-tab + realtime are reliable** | Fixed memory/socket leaks → sign-out propagates across tabs, no stale channels. |

**Talking point:** every headline number is something a customer *experiences* — speed,
weight, smoothness, consistency — not just an internal metric.

## A2. Developer impact — what the team gains

| What changed | Why the team cares |
| --- | --- |
| **One filter toolkit** (−12.2k LOC) | 6 invoice filter copies → 1 module; fix a filter bug **once**, fixed everywhere. |
| **Modern foundation** (antd v6, Vite 8, redux v8) | Off deprecated APIs; React-18-safe; faster builds (Rolldown). |
| **Zero-runtime CSS** (CSS Modules + `@layer`) | Styles are static files, not JS injected per render — smaller, cacheable, predictable. |
| **Lazy-by-default bundle** | 18 big files → 55 small chunks; heavy libs (charts, pdf, tiptap) load only when used. |
| **React 18 Strict-Mode safe** | Audited & fixed double-effects, missing cleanup, store tearing — a whole bug class gone. |
| **Less code to own** | +52.7k / −63.1k — the codebase got *smaller* while doing *more*. |
| **Documented playbooks** | CSS override rules, sync architecture, migration plans — onboarding & regressions are cheaper. |

**Talking point:** the customer wins came *with* a maintenance win — we shipped speed and
features while removing ~10k net lines and standardizing the patterns.

---

# PART B — BUNDLE OPTIMIZATION *(primary deep-dive)*

This is the centerpiece of the customer-facing speed win.

## B1. LCP progress

| Stage | LCP | Notes |
| --- | --- | --- |
| Before | 6.07 s | Original baseline |
| After initial PR changes | 4.29 s | `manualChunks`, `modulePreload`, async CSS |
| After amcharts fix + `destroyInactiveTabPane` | **2.92 s** | Stopped amcharts loading on init |
| After tiptap + cumul.io lazy loading | TBD | Entry chunk cut ~195 KB |

## B2. What we changed

1. **`vite.config.mts` build config**
   - **asyncCssPlugin** — CSS made non-render-blocking (`media="print" onload="this.media='all'"`), scoped to `/assets/` only.
   - **modulePreload `polyfill: false`** — drops Vite's `__vitePreload` polyfill.
   - **manualChunks (hybrid)** — `return undefined` for truly lazy libs (`@amcharts`, `@ant-design/plots`, `@antv`, `d3-`, `@growfin/asgard`, `pdfmake`, `@cumul.io`) so Rollup gives them their own chunks; a named `lib-tiptap` chunk for `@tiptap` + `prosemirror`; everything else → `vendor`.
2. **`destroyInactiveTabPane` on antd Tabs** — antd renders *all* tab children on mount (hidden), which triggers `React.lazy()` for inactive tabs and pulled amcharts in on the Snapshot tab.
3. **Removed a re-export from a lazy boundary** (`DashboardTab`) — a re-export creates a static import chain that defeats splitting; updated 5 importers to import from `../../types`.
4. **Lazy-loaded `ActivitiesModal` + `ActivitiesFormEdit`** (user-triggered modals) — entry chunk **1,637 KB → 1,442 KB** (~195 KB).
5. **Lazy-loaded `AdvancedReports`** — heavy `@cumul.io` only loads on that page.
6. **Import-path fix** — `ActionableEntity` imported from the lightweight `config/email-page-config` instead of the `./Email` barrel (which transitively pulls `@tiptap`).

## B3. Chunk strategy

| Chunk | Size (gzip) | Strategy | Loaded |
| --- | --- | --- | --- |
| `vendor` | ~2,054 KB | Named chunk | Initial |
| `index` (entry) | ~384 KB | Entry module | Initial |
| `lib-tiptap` | ~107 KB | Named chunk | **Lazy** (email editor only — see B5) |
| `routes` | ~3,335 KB | Auto shared | Lazy |
| `use-chart-indicator` (amcharts) | ~212 KB | `return undefined` | Lazy (Dashboard Analysis tab) |
| `pdfmake` | ~549 KB | `return undefined` | Lazy |
| `xlsx` | ~161 KB | Auto | Lazy |
| `vfs_fonts` | ~424 KB | Auto (pdfmake fonts) | Lazy |

## B4. Deployed results (verified)

Measured on a real deploy (webhooks-test) vs current prod (cash-king), dashboard route:

| Metric | Prod (before) | new-bundle | Change |
| --- | --- | --- | --- |
| **Total transferred** | 13.01 MB | **2.45 MB** | **−81%** |
| **`vendor` transferred** | ~10 MB *(uncompressed)* | **1.75 MB** | **−82%** |
| **Initial eager JS** (`app`+`vendor`+`growcomponents`) | ~12 MB | **~1.9 MB** | ~−84% |
| **Load** | 2.19 s | **0.755 s** | **−65%** |
| **DOMContentLoaded** | ~1.0 s | **682 ms** | faster |

Eager graph ≈ `app` (~98 KB) + `vendor` (~1.75 MB) + `lib-growcomponents` (~45 KB).
Everything else loads lazily or from memory cache.

> **Honest notes (say these before someone asks):**
> - cash-king vs webhooks-test are different accounts/data, so *total transferred* isn't a
>   controlled A/B — but `app`/`vendor` are pure app code, and `vendor` 10 MB → 1.75 MB is solid.
> - Prod served `vendor` **uncompressed**; the new CDN gzip/brotli does part of the work. Split
>   the credit ≈ **⅔ code reduction, ⅓ compression** — don't claim the full 10 MB → 1.75 MB as bundling.

## B5. The import-chain trap — *fixed* (full case study)

**Fixed ✅: the editor (`@tiptap`, 357 KB / 107 KB gzip) was downloading on *every* page load**
— even for users who never open a workflow email form. It was in `<link rel="modulepreload">`
in `index.html`, which means the browser eagerly fetched it before it even knew what page to
render.

### Why `modulepreload` = "in the entry chunk"
Vite emits one `<link rel="modulepreload">` per chunk **statically imported** by the entry —
the critical path for *every* page load. A feature chunk (`lib-tiptap`, `pdfmake`, `xlsx`)
showing up there means a static import chain is pulling it in. (A chunk inside
`__vite__mapDeps([...])` is fine — that's dynamic-import preloading, only when its lazy route
is visited.)

### The chain (357 KB pulled in by a 15-line helper)
A *snapshot* component needed one small helper, and that one import chained all the way to the
email editor:

```
CRMRouter → ApprovalsCard → Details/Content → EventSnapShot → CustomerSnapShot
   → Action/utils.ts                ← needed ONE 15-line helper (getActionType)
      → ActionTypeTitle.tsx         ← but imported it from a heavy RENDER component
         → ActionList → WorkFlowForm → Action → actionForm → actionTypesRenderer
            → actionComponentMapType.ts   ← maps 13 components as runtime values
               → WorkflowEmail → EmailForm → RichEmailContentEditor → @tiptap / prosemirror
```

**Plain terms:** a JS module runs top-to-bottom on import, so the bundler can't safely drop the
rest of a file you import *from*. Ask for one function from a file that also holds components,
and you carry the whole render tree — here, all the way to a 357 KB editor the dashboard never
shows.

### The 3 anti-patterns that built the chain

**1 — A util co-located inside a heavy render component**
```ts
// ❌ imports the entire render tree to get one pure function
import { getActionType } from "./ActionConfigurations/ActionTypeTitle";
// ✅ imports only what it needs
import { getActionType } from "./ActionConfigurations/getActionType";
```
*Rule:* never import a utility from a file that also contains React components.

**2 — A CSS constant exported from a component-importing file**
```ts
// ❌ WorkFlowForm.tsx exports CSS but ALSO statically imports the full action tree
import { CardStyles } from "../../WorkFlowForm/WorkFlowForm";
// ✅ styles live in their own file
import { CardStyles } from "../../WorkFlowForm/styles";
```
*Rule:* CSS-in-JS constants / style tokens live in a dedicated `styles.ts`, never beside components.

**3 — A component-map with runtime imports of every variant**
```ts
// ❌ each is a runtime value → a static dependency of any importer
import WorkflowEmailForm from "../ActionRenderComponents/createActivity/WorkflowEmail";
// …11 more…  →  EMAIL: { component: WorkflowEmailForm }   // can't be type-erased → drags @tiptap
```
*Rule:* string→component maps must use `React.lazy()` per entry, or live entirely inside a lazy chunk.

### The fix applied
Created `getActionType.ts` — a standalone file with **zero component imports** (only `ts-pattern`
+ an enum) — and repointed the 3 importers (`Action/utils.ts`, `ActionTypeTitle.tsx`,
`ActionList.tsx`) at it. **Result:** `lib-tiptap` removed from `modulepreload`; **357 KB no
longer downloads on every page load** — tiptap loads only when the email editor renders.

### How to catch this before it ships
```bash
grep "modulepreload" build/index.html      # should show ONLY vendor + index
```
| Check | Rule |
| --- | --- |
| New utility function | Lives in a `.ts` file with **zero** component imports? |
| New CSS constant | In a dedicated `styles.ts`, not inside a component file? |
| New component map | Each entry `React.lazy()`, or the whole map in a lazy chunk? |
| Cross-domain import | Is the imported file a pure util (no component imports)? |
| After every build | `grep modulepreload build/index.html` shows only vendor + index? |

### Still open
- **`vendor` ~1.75 MB** — the biggest single chunk; split charts / antd / date-libs further.
- **Boot Redux store** still drags two small utils (`datetime-formatter`, `regex`) eager via
  `combineReducers`; fully removing them needs async reducer injection (a project, ~2 KB —
  not worth it on its own yet).

## B6. Key learnings (reusable)

1. **Barrel files defeat lazy loading** — importing *anything* from a barrel pulls in everything it imports.
2. **antd Tabs renders all children** by default — use `destroyInactiveTabPane`.
3. **`manualChunks` naming can break splitting** — Rollup may put `__vitePreload` in a named chunk, forcing the main bundle to import it.
4. **`modulePreload: { polyfill: false }`** disables the browser polyfill but keeps `__vitePreload` (it also handles CSS injection for dynamic imports).
5. **Re-exports from lazy boundaries defeat splitting** — `export { Foo } from './lazy'` is a static chain.
6. **Shared modules get hoisted** to the entry chunk to avoid duplication across lazy routes.

---

# PART C — ZERO-RUNTIME CSS *(why it helps)*

We moved styling **out of JavaScript** — from runtime CSS-in-JS (`@stitches/react`, much
`styled-components`) to **CSS Modules + cascade layers (`@layer`)**, where styles are static
`.css` files extracted at build time.

## C1. Runtime CSS-in-JS vs zero-runtime CSS

| | CSS-in-JS (stitches / styled-components) | Zero-runtime (CSS Modules) |
| --- | --- | --- |
| When styles are generated | **At runtime**, in the browser, often per render | **At build time**, once |
| Where they live | **Inside the JS bundle** (style strings) | **Separate `.css` assets** |
| Main-thread cost on load | Serialize + inject `<style>` tags while rendering | None — browser parses static CSS in parallel |
| Caching | Tied to the JS chunk (JS change busts styles) | **Independent** — unchanged styles stay cached |
| Loading | After JS executes | **Parallel** with JS |

## C2. What it bought us

- **Dropped `@stitches/react` entirely** — every `Style(...)` wrapper became a thin component
  + a static `.module.css`; the stitches style-generation engine is gone from the JS bundle.
- **Smaller JS** — style payloads moved out of JS chunks into CSS assets.
- **Cacheable + parallel-loaded** — CSS is fetched alongside JS and cached independently.
- **Less main-thread work** — no per-render client-side style serialization/injection.

Extracted CSS in the new build (transferred, gzip): `vendor.css` ~86 KB,
`lib-growcomponents.css` ~6 KB, `index.css` ~6 KB — small, static, cacheable, vs. that weight
previously living in (and re-running inside) JS.

> Note: `styled-components@5.3.7` remains for components not yet migrated, so the CSS-in-JS
> runtime isn't fully removed. Finishing the migration removes more JS weight and runtime cost.

## C3. The override model — cascade layers (`@layer`)

Zero-runtime CSS needs a deterministic way to decide **who wins** when antd, grow-components,
and the app all style the same element. We use cascade layers, declared once:

```css
@layer base, antd, growcomponents, overrides;   /* later layer wins */
```

- A rule in a **later** layer beats an earlier one **regardless of selector specificity** —
  so `overrides` cleanly beats `growcomponents` beats `antd`. No more specificity wars.
- **The gotcha we hit repeatedly:** antd **v6 ships CSS-in-JS injected at runtime, *unlayered***
  — and an unlayered rule beats *every* layer for normal declarations. That's why our layered
  component styles kept losing to antd (the clear-icon ellipse, the skeleton overflow, the
  washed-out label tags were all this one root cause).
- **Today's fix:** style our *own* class, or use inline / `!important` to escape the layer.
- **Root cure (planned):** wrap antd in `StyleProvider layer` so its runtime CSS lands *inside*
  the `antd` layer the app already ordered — then `growcomponents` naturally wins and the
  per-component `!important`s disappear. 📋

**Talking point:** zero-runtime CSS is both a **performance** win (less JS, less main-thread
work, better caching) and a **maintainability** win (deterministic overrides via `@layer`).

---

# PART D — FILTER REVAMP *(the big feature/architecture win)*

### D1. One system, 15 pages
- Replaced bespoke `FilterStrip` / `FilterBlocks` / per-page reducers with the shared,
  config-driven `@sinecycle/growcomponents/filter`.
- **~12.2k LOC net removed** (~65% of the filter layer). 6 invoice filter copies → **1 module
  with a `variant` prop**. 3 tag fetches → **1 shared query**. ✅ migrations + 12 legacy
  deletion phases done.

### D2. Sync architecture — killed the double-fetch
- `onApply` moved from *effect-watching-the-contract* (fired on hydrate **and** edit) to
  *event-fired-from-commit* (**user mutations only**), ending React-18 StrictMode replay
  firing with an empty contract. Consumer guards 3 → 2. ✅

### D3. Inbox filter fixes
- 3 init bugs fixed; label sync simplified **2 refs + 2 effects → 0 refs + 1 effect**. ✅

### D4. Report Builder
- New editor with Measure/Dimension/Filter/Visualization/Sort sections; Fast Context (pub/sub)
  instead of Redux. 🚧 core done; chart preview / save pending.

### D5. grow-components element reuse *(this cycle)*
- Added an `embedded` mode + `GrowMultiSelectInput` so GrowFilter elements work **outside** the
  popover — the Report Builder's bespoke multiselect now reuses the **same** searchable,
  paginated, lookup element. ✅
- Refactored the 667-line `MultiSelect` into focused hooks + a **per-row toggle** (replacing
  antd `Checkbox.Group`), fixing a double-emit and selected-label-loss bug. ✅

---

# PART E — THE REST

## E1. Version & dependency upgrades *(small)*

| Upgrade | Status |
| --- | --- |
| **antd v5 → v6** (breaking-API migration) | ✅ main done; ~35 `getPopupContainer→popupContainer` left |
| **Vite 6 → 8 (Rolldown)** + lockfile RCA (Linux-generated) + CI guard | ✅ fixed & prevented |
| **react-redux 7 → 8 + RTK 1.9.7** (Redux Phase 1) + 4 bug fixes | ✅ done |
| **React 18 hardening** (effect audits, store-tearing fixes) | ✅ audits + P0 fixes |
| **React Query v4 → v5** (codemod + remove query callbacks, ~58 files) | 📋 planned (on v4.10.3) |
| **npm → pnpm** (7 blockers scoped) | 📋 planned |
| **Node 20 → 24 / CI** (rolldown binary, build-time Sentry) | ✅ updated |

## E2. Performance beyond the bundle
- **Boot data:** 7 page-specific fetches moved app-init → point-of-use React Query; boot
  **30 → 14** calls (−53%); fixed an all-users/active-users correctness bug. ✅
- **Activity feed virtualization:** bounded & smooth past ~1000 cards (memoization + react-virtuoso). ✅
- **Memory leaks:** 4 fixed (BroadcastChannel-per-render P0, Pusher unsubscribe P1, PerformanceObserver + premature WebSocket P2). ✅

## E3. Components & architecture
- **BaseComponents migration:** 52 styled-components wrappers → GrowComponents / CSS Modules. 🚧 Buttons/Modal done.
- **Collection Activities context** reviewed (B+): right architecture, needs dedupe/split before templating to 3 more pages. 📋 (Redux Phase 2)

## E4. Features
- **AI Auto-Reply** settings (themes + content editor + FAQ CRUD, real APIs). ✅ functionally complete.
- **AI SmartFilter** (natural-language → filter contract) in the +Filters menu. ✅
- **Activity feed** virtualized with skeleton placeholders. ✅

## E5. Quality & polish *(this cycle)*
The antd-v6 unlayered-CSS issue (see Part C) surfaced as three UI bugs — clear-icon
ellipse, skeleton overflow, washed-out label tags — all fixed by styling our own class /
inline / `!important`. Plus: label add/remove API fix (`else if` → independent `if`s),
`useForm`-not-connected & forwardRef warnings (→ `useImperativeHandle` + `forwardRef`),
CC/BCC grid alignment, and non-DOM props leaking to the DOM. ✅

---

# PART F — ROADMAP

| Item | Status |
| --- | --- |
| React Query v4 → v5 | 📋 |
| npm → pnpm | 📋 |
| Redux Phase 2 (3 slices → Context) | 📋 |
| Report Builder: chart preview / save / mutations | 🚧 |
| Finish BaseComponents → drop `styled-components` runtime | 🚧 |
| antd `StyleProvider layer` (root cure for CSS layering) | 📋 |
| Split `vendor` further; resolve `lib-tiptap` entanglement | 📋 |

---

## Appendix — supporting deep-dive docs

Filters: `GROWFILTER_IMPACT.md`, `GROWFILTER_SYNC_ARCHITECTURE.md`,
`GROWFILTER_LEGACY_CLEANUP.md`, `GROWFILTER_NEXT_STEPS.md`, `INBOX_FILTER_FIXES.md`,
`REPORT_BUILDER_PLAN.md` ·
Perf: `BUNDLE_OPTIMIZATION.md`, `docs/bundle/tiptap-chain-learnings.md`,
`docs/VITE8_CHUNKING.md`, `PERFORMANCE_COMPARISON.md`, `BOOT_PERFORMANCE_IMPACT.md`,
`APP_INIT_AND_DASHBOARD_OPTIMIZATION.md`, `ACTIVITY_FEED_VIRTUALIZATION.md`,
`REALTIME_MEMORY_LEAK_FIXES.md` ·
Upgrades: `ANTD_V6_MIGRATION_CHECKLIST.md`, `REACT_QUERY_V5_MIGRATION.md`,
`VITE8_LOCKFILE_RCA.md`, `REACT18_USEEFFECT_AUDIT.md`, `REDUX_MIGRATION_PLAN.md`,
`REDUX_PHASE1_CHANGELOG.md`, `PNPM_MIGRATION_BLOCKERS.md`, `WORKFLOW_MIGRATION.md` ·
Components: `BASECOMPONENTS_MIGRATION_PLAN.md`, `CSS_OVERRIDE_PLAYBOOK.md`,
`CA_CONTEXT_PATTERN_REVIEW.md` · Features: `AI_AUTO_REPLY_FE_SUMMARY.md`,
`.skills/ai-smart-filters/`
