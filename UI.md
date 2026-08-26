# `@emaki/ui` — UI scenes as data

Grounded in a re-read of v1's `AI Reply/scenes/InboxScene.jsx`, `DetailScene.jsx`, `fx.jsx`, `app.jsx`
(fetched 2026-07-26). Design doc, not final code.

---

## 1. The finding that makes this tractable

**v1's UI scenes were never full-fidelity UI recreations.** Reading `InboxScene.jsx` closely, the
actual design language is:

- **Structure is real** — split panes, list column at `width: 380`, borders, panels, shadows.
- **Chrome is real** — dividers, backgrounds, rounded cards, elevation.
- **Accents are real and literal** — `AiBadge "AI Replied"`, `PTP001`, `Dispute (DSP-2198)`,
  `$4.98K`, `Open`, icon chips, gradient "Summary" text.
- **Body copy is abstracted as shimmer bars** — `<Bar w="52%" h={9} />`, `<Bar w="80%" h={7} lite />`.

That last point is the whole unlock. You never needed arbitrary rich-text layout inside a mock. You
needed *bars with widths* plus a handful of literal labels that carry meaning. A `Bar` is trivially
expressible as data (`{ w: "52%", h: 9, lite: true }`); a freeform paragraph is not.

So the problem is **not** "recreate any UI in JSON." It's "express a constrained mock language —
panes, rows, bars, badges, a few real labels — as a node tree." That's a tractable schema.

## 2. The vocabulary, extracted from v1

Everything v1 actually used, nothing invented:

**Containers** — `row`, `col`, `split`, `panel`, `card`, `divider`
(from the flex wrappers, `Panel`, `AppShell`, and `height: 1` dividers)

**Placeholders** — `bar` (w, h, lite, shimmer), `dot` / `avatar` (size, initials)

**Literal atoms** — `text` (the real strings: IDs, amounts, statuses), `badge` (AiBadge),
`chip`, `iconChip`, `icon` (lucide name), `toggle`, `count` (the CountUp), `eyebrow`, `tab`

**Composites worth having as one node** — `field` (label + value, used repeatedly in DetailScene),
`listRow` (dot + bars + optional badge — the single most repeated pattern in InboxScene)

That's ~16 node types. Not a design system; a mock language.

## 3. Sequencing: derived, not authored

v1 hand-wrote `delay={0.65}`, `delay={0.8}`, `delay={0.95}` on every element. That is exactly the
manual work the schema exists to delete — same class of problem as hand-typed `dur` and hand-typed
bar maxima.

**Rule: reveal order comes from tree traversal, timing comes from a stagger constant.**

```ts
// depth-first order, each node's reveal = index * stagger, offset by its container's own reveal
reveal(node) = parentReveal + (siblingIndex * stagger) + (node.at ?? 0)
```

Authors get an optional `at` nudge for the rare case that needs it, and a container can set
`stagger` locally (a 6-row list wants tighter stagger than two top-level panes). Everything else
is computed. The `animationEnd` this produces is what finally fills the
`const animationEnd = 0 // Week 2: derive from the block timeline` stub in `duration.ts`.

## 4. States: skeleton → loaded, nearly free

The elegant part, and it falls out of the vocabulary rather than being bolted on:

**A `bar` with a `text` prop renders as a shimmer bar in `skeleton` state and as real text in
`loaded` state.** Same node, same position, same width — it *becomes* its content.

```jsonc
{ "kind": "bar", "w": "52%", "h": 9, "text": "Acme Corp · Invoice #4021" }
```

- `skeleton` → grey shimmer bar, 52% wide
- `loaded` → the actual string, in body type

That single rule gives you the skeleton→loaded transition your v1 films implied but never actually
animated, and it means one authored tree covers both states. Nodes can also declare `in: "loaded"`
to appear only after the transition (the `ActivityLink` "Activity created · PTP001" card is exactly
this — it shouldn't exist in the skeleton).

States are a list with holds, so the scene has a timeline:

```jsonc
"states": [
  { "id": "skeleton", "hold": 1.0 },
  { "id": "loaded",   "hold": 2.5 }
]
```

Later states worth adding once this works: `hover`, `selected`, `arriving` (a new row animating in).
Don't build them yet.

## 5. Schema sketch

```ts
import * as z from 'zod'

const Size = z.union([z.number(), z.string()])           // 380 | "52%" | "1fr"
const StateId = z.string()                               // "skeleton" | "loaded" | ...

const BaseNode = z.object({
  /** Optional nudge on the derived reveal time, in seconds. */
  at: z.number().optional(),
  /** Render only in these states. Omit = all states. */
  in: z.array(StateId).optional(),
})

// Leaves
const Bar = BaseNode.extend({
  kind: z.literal('bar'),
  w: Size.default('100%'),
  h: z.number().default(9),
  lite: z.boolean().default(false),
  /** If present, this bar becomes real text once the deck reaches a loaded state. */
  text: z.string().optional(),
})

const Text = BaseNode.extend({
  kind: z.literal('text'),
  value: z.string().min(1),
  tone: z.enum(['ink', 'muted', 'faint', 'primary', 'good', 'danger']).default('ink'),
  size: z.enum(['eyebrow', 'label', 'body', 'metric', 'h2']).default('body'),
  mono: z.boolean().default(false),
  weight: z.enum(['regular', 'medium', 'bold']).default('regular'),
})

const Badge = BaseNode.extend({
  kind: z.literal('badge'),
  label: z.string().min(1),          // "AI Replied", "Created by AI"
  tone: z.enum(['ai', 'good', 'danger', 'muted']).default('ai'),
})

const Dot = BaseNode.extend({
  kind: z.literal('dot'),
  size: z.number().default(34),
  initials: z.string().max(2).optional(),
})

const Icon = BaseNode.extend({
  kind: z.literal('icon'),
  name: z.string(),                  // validated against the icon allowlist, not raw lucide
  tone: z.enum(['ink', 'muted', 'primary', 'good', 'danger']).default('muted'),
})

const Toggle = BaseNode.extend({ kind: z.literal('toggle'), on: z.boolean().default(true) })

const Count = BaseNode.extend({
  kind: z.literal('count'),
  to: z.number(), prefix: z.string().optional(), suffix: z.string().optional(),
})

const Divider = BaseNode.extend({ kind: z.literal('divider') })

// Composites — the two patterns v1 repeated most
const Field = BaseNode.extend({
  kind: z.literal('field'),
  label: z.string(),
  value: z.union([z.string(), Bar]),
})

const ListRow = BaseNode.extend({
  kind: z.literal('listRow'),
  title: Size.optional(),            // bar width, or…
  titleText: z.string().optional(),  // …real text
  sub: Size.optional(),
  badge: z.string().optional(),
  active: z.boolean().default(false),
  avatar: z.boolean().default(true),
})

// Containers — recursive, so declare the union lazily
type UiNode = z.infer<typeof Leaf> | { kind: 'row' | 'col' | 'panel' | 'split'; children: UiNode[] }

const Leaf = z.discriminatedUnion('kind', [
  Bar, Text, Badge, Dot, Icon, Toggle, Count, Divider, Field, ListRow,
])

const Container: z.ZodType<UiNode> = z.lazy(() =>
  BaseNode.extend({
    kind: z.enum(['row', 'col', 'panel', 'split', 'card']),
    w: Size.optional(),
    gap: z.number().default(12),
    pad: z.number().optional(),
    /** Stagger between this container's children, in seconds. */
    stagger: z.number().default(0.08),
    children: z.array(z.union([Leaf, Container])).min(1),
  })
)

export const uiSceneProps = z.object({
  chrome: z.enum(['app', 'window', 'none']).default('app'),
  caption: z.string().optional(),           // v1's <Caption> — the line under the mock
  states: z.array(z.object({
    id: StateId,
    hold: z.number().positive().default(1.5),
  })).min(1).default([{ id: 'loaded', hold: 2.5 }]),
  root: Container,
})
```

`InboxScene` re-expressed against this is roughly 40 lines of JSON instead of 90 lines of JSX, and
critically it's *generatable* — `propose_scenes` can emit a node tree far more reliably than it can
emit correct Framer Motion JSX.

## 6. Rendering, and the rule that must not bend

`@emaki/ui` exports **node → timeline descriptor**, same as every other block. Two adapters consume
it — Framer for Studio preview, Remotion frame-interpolation for output. No `ui-scene`-specific
render path.

If UI scenes ever render through their own bespoke pipeline, you have rebuilt v1's exact problem
(the same 12 scenes authored twice) inside the new architecture.

## 7. Package boundary

`@emaki/ui` as its own package, hosted by a single `ui-scene` block in `@emaki/blocks`.

The 7 text/data blocks are stable and shipped; this vocabulary will churn for months. Keeping it
behind one block type means schema version bumps to `ui-scene` don't destabilise decks that only
use `stat` and `compare-bars`.

## 8. Honest scope

- **~16 node types + recursive containers + 2 states + derived sequencing** is a real chunk of work.
  Bigger than any existing block; smaller than weeks 1–3 combined. Call it 2–3 focused weeks to a
  version that can reproduce `InboxScene` and `DetailScene` faithfully.
- **Reproducing those two v1 scenes is the gate.** Not "can it express any UI" — can it express the
  two you already know are good. Frame-diff them against v1 renders.
- **What this does NOT become:** arbitrary UI. No grid, no absolute positioning, no responsive
  rules, no nested scroll. Constrained flex only. Every escape hatch you add here is a step toward
  reimplementing CSS in JSON, and that is the year-scale version of this project.
- **Icons go through the allowlist**, resolved by name, same gate as fonts — third-party templates
  will use this vocabulary.

## 9. Sequencing recommendation

Finish Studio's file-watcher and the MCP loop on the current 7 blocks first. That's a working narrow
product, and you're close. Then take this as its own phase with real design time — it deserves the
same schema-first discipline weeks 1–3 got, not a rushed bolt-on.
