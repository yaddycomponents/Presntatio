# Bundle Comparison — `dev-master` vs `new-bundle`

> Both built with `npm run build` (default mode) on the same machine, 2026-06-21.
> Metric that matters: the **eager boot graph** = entry chunk + everything the
> generated `index.html` tells the browser to `modulepreload`. That is the
> first-load critical path; everything else is lazy.

## Headline

| Metric | dev-master | new-bundle | Δ |
|---|---:|---:|---:|
| **Eager boot JS (gzip)** | **7,723 KB** | **1,174 KB** | **−6,549 KB (−85%)** |
| Build tool | Vite 6 / Rollup | Vite 8 / **Rolldown** | — |
| Build time | 42.62s | **2.93s** | −93% |
| Eager preloaded chunks | 7 (entry + 6) | 9 (entry + 8) | +2 |
| Total JS chunks | 141 | 249 | +108 |

The new-bundle branch cuts the first-load JS payload by **~6.5 MB gzipped** —
roughly an **8.5× smaller** boot graph — and builds **~14× faster**.

---

## Eager boot graph — side by side

### dev-master (7,723 KB gz eager)

| Chunk | Raw | Gzip |
|---|---:|---:|
| `cashapps` (entry-adjacent) | 5,765 KB | **3,359 KB** |
| `vendor` | 10,089 KB | **3,171 KB** |
| `amcharts` | 2,452 KB | **831 KB** |
| `index` (entry) | 1,876 KB | **499 KB** |
| `editor-tiptap` | 120 KB | 35 KB |
| `analytics` | 37 KB | 10 KB |
| `antplots` | 39 KB | 4 KB |
| **TOTAL** | ~20.4 MB | **7,723 KB** |

### new-bundle (1,174 KB gz eager)

| Chunk | Raw | Gzip |
|---|---:|---:|
| `lib-antd` | 2,524 KB | **734 KB** |
| `vendor` | 835 KB | **272 KB** |
| `lib-growcomponents` | 421 KB | **131 KB** |
| `app` (entry) | 235 KB | **59 KB** |
| `ky` | 7.7 KB | 3.3 KB |
| `authentication` | 3.1 KB | 1.0 KB |
| `datetime-formatter` | 1.8 KB | 0.8 KB |
| `Notifications` | 1.6 KB | 0.7 KB |
| `rolldown-runtime` | 1.2 KB | 0.7 KB |
| **TOTAL** | ~4.0 MB | **1,174 KB** |

---

## What moved off the boot path

| Heavy dependency | dev-master | new-bundle |
|---|---|---|
| **amcharts / charts** (831 KB gz) | eager preload | lazy → `GrowChart` (highcharts) via route-level chunk |
| **tiptap / RTE** (35 KB gz here; full stack ~600 KB) | eager `editor-tiptap` | folded into lazy RTE routes (no named chunk → no react-shim duplication) |
| **Sentry / Mixpanel / LogRocket / Pusher** | bundled into eager `vendor`/`analytics` | dedicated `lib-*` chunks, **stripped from preload** via `resolveDependencies` |
| **ag-grid** (219 KB gz) | inside `vendor` | `lib-ag-grid`, lazy |
| **antd** (734 KB gz) | inside `vendor` monolith | isolated `lib-antd` (still eager, but separately cacheable) |

The `cashapps` (3.3 MB gz) + `vendor` (3.2 MB gz) monoliths on dev-master are the
core problem: nearly everything was statically reachable from the entry, so the
preload graph dragged in charts, the editor, analytics, and all vendor code
before first paint. new-bundle's `manualChunks` + `modulePreload.resolveDependencies`
(see `vite.config.mts:144-226`) break those apart and defer the heavy, route-only deps.

---

## Why the numbers shift the way they do

- **`vendor` shrank 3,171 → 272 KB gz** because the monolith was split: antd,
  ag-grid, charts, monitoring, analytics, realtime each became their own chunk;
  only genuinely-shared react-graph code remains in `vendor` (kept together on
  purpose to avoid a circular-chunk runtime TDZ — `vite.config.mts:217-222`).
- **Chunk count rose 141 → 249** — that's the *goal*, not a regression. More,
  smaller chunks = finer lazy boundaries and better cache granularity (an
  app-code edit no longer busts the ~1.7 MB vendor cache).
- **Build time 42.6s → 2.9s** is the Rollup → **Rolldown** (Rust) migration that
  Vite 8 brings.
- **`lib-antd` at 734 KB gz is the new floor** and 62% of eager JS. Per prior RCA
  (`docs/bundle/antd-eager-bundle.md`) it's genuine usage + cssinjs runtime;
  chunk-split and `sideEffects` were tried and reverted. Only CSS-trim remains.

---

## Reproduce

```bash
# on each branch:
npm run build
grep -oE 'rel="modulepreload"[^>]*href="[^"]+"' build/index.html   # eager graph
# gzip each listed chunk + the entry to sum the boot payload
```
