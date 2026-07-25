import { useEffect, useState } from 'react'
import { Shell, T, mono, code, sans } from './Shell'

// ONE continuous Claude Code session per context window. Every tech debt follows
// the SAME loop: Claude asks "all good — what next?", the user types the next
// problem, Claude scans all repos, writes the plan .md (typed live), then writes
// the code. The transcript accumulates and auto-scrolls like the real pane. Two
// sessions split by a real /compact → handoff → new session. All content real.

const Bold = ({ children }) => <b style={{ color: T.bold }}>{children}</b>

// ── transcript renderers ─────────────────────────────────────────────────────
// Real Claude Code density — small pane text, lots of content on screen.
const CS = 20  // chat font size
const SS = 20  // chat sub-elements (diff / meta / output)
const cbase = { fontFamily: mono, fontSize: CS, lineHeight: 1.55 }
const dot = <span style={{ color: T.green, fontSize: '0.6em', verticalAlign: 'middle', marginRight: 8 }}>●</span>

function Turn({ block, fresh }) {
  const cls = fresh ? 'rise' : ''
  // committed prompts carry NO caret — the blinking cursor lives only in the input box
  if (block.u) return <div className={cls} style={{ ...cbase, color: T.green, display: 'flex', gap: 12 }}><span>❯</span><span>{block.u}</span></div>
  if (block.compact) return fresh ? <CompactAnim cls={cls} /> : <CompactDone cls={cls} />
  if (block.model) return (
    <div className={cls} style={{ ...cbase, color: T.mauve, display: 'flex', gap: 10 }}>
      <span>◐</span><span>model → <b style={{ color: T.text }}>{block.model.name}</b> <span style={{ color: T.faint }}>· {block.model.note}</span></span>
    </div>
  )
  if (block.divider) return <div className={cls} style={{ ...cbase, color: T.faint, textAlign: 'center', fontSize: SS, letterSpacing: '0.12em' }}>────────  new session · resumed from handoff  ────────</div>
  if (block.say) return (
    <div className={cls} style={{ ...cbase }}>
      {block.say.map((l) => <div key={l} style={{ color: T.green, marginBottom: 6 }}>{dot}{l}</div>)}
      {block.done && <div style={{ color: T.green, display: 'flex', gap: 12, marginTop: 8 }}><span>✳</span><Bold>{block.done}</Bold></div>}
      {block.ask && <div style={{ color: T.peach, marginTop: 8 }}>▸ {block.ask} <span style={{ color: T.faint }}>(y/n)</span></div>}
    </div>
  )
  return (
    <div className={cls} style={{ ...cbase }}>
      <div>{dot}<span style={{ color: T.green }}>{block.tool}</span><span style={{ color: T.faint }}>(</span><span style={{ color: T.teal }}>{block.target}</span><span style={{ color: T.faint }}>)</span></div>
      {block.meta && <div style={{ color: T.faint, fontSize: SS, marginLeft: 22, marginTop: 2 }}>⎿ {block.meta}</div>}
      {block.diff && <Diff rows={block.diff} />}
      {block.out && <div style={{ marginLeft: 28, marginTop: 8 }}>{block.out.map((o) => <div key={o[0]} style={{ color: o[1] || T.muted, fontSize: SS, lineHeight: 1.45, whiteSpace: 'nowrap' }}>{o[0]}</div>)}</div>}
    </div>
  )
}
// the /compact bar animates ONCE, only while it's the newest turn
function CompactAnim({ cls }) {
  const N = 30
  const [pct, setPct] = useState(0)
  useEffect(() => {
    let raf
    let t0 = null
    const tick = (ts) => {
      if (t0 === null) t0 = ts
      const p = Math.min(100, Math.round(((ts - t0) / 1500) * 100))
      setPct(p)
      if (p < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const fill = Math.round((pct / 100) * N)
  return (
    <div className={cls} style={{ ...cbase }}>
      <div style={{ color: T.faint }}>❯ /compact</div>
      <div style={{ color: T.mauve, marginTop: 8, display: 'flex', gap: 10 }}><span className="pulse">·</span> Compacting conversation…</div>
      <div style={{ marginTop: 6, letterSpacing: '-1px' }}>
        <span style={{ color: T.peach }}>{'▰'.repeat(fill)}</span><span style={{ color: T.border }}>{'▱'.repeat(N - fill)}</span>
        <span style={{ color: T.faint, letterSpacing: 0, marginLeft: 10 }}>{pct}%</span>
      </div>
      {pct >= 100 && <div style={{ color: T.green, marginTop: 6 }}>✓ summary saved · context reclaimed</div>}
    </div>
  )
}
// once it's history, collapse to a one-line done note (no re-animation)
function CompactDone({ cls }) {
  return <div className={cls} style={{ ...cbase, color: T.green, display: 'flex', gap: 10 }}><span>✳</span> Compacted conversation · summary saved</div>
}
function Diff({ rows }) {
  return (
    <div style={{ marginLeft: 22, marginTop: 6, marginBottom: 2, borderLeft: `2px solid ${T.border}`, paddingLeft: 12, fontFamily: mono, fontSize: SS, lineHeight: 1.5 }}>
      {rows.map((r, i) => (
        <div key={`${r[0]}-${i}`} style={{ display: 'flex', background: r[1] === 'del' ? 'rgba(231,130,132,.14)' : r[1] === 'add' ? 'rgba(166,209,137,.14)' : 'transparent', whiteSpace: 'nowrap' }}>
          <span style={{ width: 26, textAlign: 'right', paddingRight: 10, color: T.faint }}>{r[2] ?? ''}</span>
          <span style={{ width: 18, color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.faint }}>{r[1] === 'del' ? '−' : r[1] === 'add' ? '+' : ''}</span>
          <span style={{ color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.muted }}>{r[0]}</span>
        </div>
      ))}
    </div>
  )
}

// ── editor interiors ─────────────────────────────────────────────────────────
function FileMd({ title, sub, lines }) {
  const rows = [{ t: `# ${title}`, big: true }, ...(sub ? [{ t: sub, c: T.faint }] : []), ...lines]
  return (
    <div style={{ padding: '40px 54px', fontFamily: code, fontSize: 26, lineHeight: 1.5 }}>
      {rows.map((r) => {
        const st = { color: r.big ? T.text : (r.c ?? T.muted), fontSize: r.big ? 34 : 26, fontWeight: r.big ? 700 : 400, marginBottom: r.big ? 18 : 11, paddingLeft: r.pad ? 32 : 0 }
        return <div key={r.t} style={st}>{r.t}</div>
      })}
    </div>
  )
}
function FileCode({ rows }) {
  return (
    <div style={{ padding: '34px 24px', fontFamily: code, fontSize: 26, lineHeight: 1.5 }}>
      {rows.map((r, i) => (
        <div key={`${r[0]}-${i}`} style={{ display: 'flex', background: r[1] === 'del' ? 'rgba(231,130,132,.12)' : r[1] === 'add' ? 'rgba(166,209,137,.12)' : 'transparent' }}>
          <span style={{ width: 48, textAlign: 'right', paddingRight: 16, color: T.faint }}>{r[2] ?? ''}</span>
          <span style={{ width: 22, color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.faint }}>{r[1] === 'del' ? '−' : r[1] === 'add' ? '+' : ''}</span>
          <span style={{ color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.muted }}>{r[0]}</span>
        </div>
      ))}
    </div>
  )
}

// ── real editor files (md renders typed or static) ──────────────────────────
const F = {
  backlog: { md: { title: 'Frontend Tech Debt', sub: '24 tracked · 16 shipped · 3 repos', lines: [
    { t: '## This batch', c: T.text }, { t: 'React 18 upgrade', pad: true }, { t: 'AntD v5 → v6', pad: true },
    { t: 'Grow RTE — extract the editor', pad: true }, { t: 'Filter revamp — 15 into 1', pad: true }, { t: 'Bundle optimization', pad: true },
  ] } },
  plan: { md: { title: 'React 18 Upgrade Plan', lines: [
    { t: '## Findings — useEffect audit', c: T.text },
    { t: '🔴 HIGH  11  memory leaks · duplicate API calls', pad: true },
    { t: 'missing cleanup · effects that run once · races', pad: true },
    { t: '## Plan', c: T.text },
    { t: 'P1  server/main.tsx: ReactDOM.render → createRoot', pad: true },
    { t: 'P2  fix the 11 HIGH effects (listeners, timers)', pad: true },
    { t: 'P3  rollout: crm → cashapps → grow-components', pad: true },
  ] } },
  main: { code: [["import ReactDOM from 'react-dom'", 'del', 1], ['ReactDOM.render(<App />, root)', 'del', 8], ["import { createRoot } from 'react-dom/client'", 'add', 1], ['createRoot(root).render(<App />)', 'add', 8]] },
  asgard: { code: [['// asgard · cashapps · package.json', '', 22], ['  "react": "17.0.2",', 'del', 24], ['  "react-dom": "17.0.2",', 'del', 25], ['  "react": "18.3.1",', 'add', 24], ['  "react-dom": "18.3.1",', 'add', 25]] },
  aging: { code: [['useEffect(() => {', '', 42], ['  const ro = new ResizeObserver(measure)', '', 43], ['  ro.observe(el)', '', 44], ['+  return () => ro.disconnect()', 'add', 45], ['}, [])', '', 46]] },
  handoff: { md: { title: 'Context Handoff', lines: [
    { t: '## Done', c: T.text }, { t: 'React 18 · 17.0.2 → 18.3.1 · createRoot', pad: true }, { t: 'AR-aging StrictMode leak fixed (ResizeObserver)', pad: true },
    { t: '## Next', c: T.text }, { t: 'AntD v5 → v6 across all 3 repos', pad: true }, { t: 'branch: new-bundle', c: T.faint },
  ] } },
  antdplan: { md: { title: 'Ant Design v6 — Deprecated Props', lines: [
    { t: '## Found in codebase', c: T.text },
    { t: 'dropdownRender  → popupRender', pad: true },
    { t: 'overlayStyle    → styles.root', pad: true },
    { t: 'bordered        → variant', pad: true },
    { t: 'ASelect: 8 matches · .ant-card-bordered CSS', pad: true },
    { t: '## Reach', c: T.text }, { t: 'crm · cashapps · grow-components', pad: true },
  ] } },
  antd: { code: [['<Select bordered={false}', 'del', 8], ['  dropdownClassName="menu" />', 'del', 9], ['<Select variant="borderless"', 'add', 8], ['  classNames={{ popup: { root: "menu" } }} />', 'add', 9]] },
  rteplan: { md: { title: 'Grow RTE — extract the editor', lines: [
    { t: '## Package: @sinecycle/growrte', c: T.text }, { t: 'Tiptap 3 + ProseMirror · 30+ extensions', pad: true }, { t: 'email + comment presets', pad: true },
    { t: '## Call sites', c: T.text }, { t: 'crm comments · asgard notes · 2 more', pad: true }, { t: 'all import one package', c: T.faint, pad: true },
  ] } },
  rte: { code: [["import { useEditor } from '@tiptap/react'", 'del', 1], ["import StarterKit from '@tiptap/starter-kit'", 'del', 2], ['import { useGrowEditor, commentPreset }', 'add', 1], ["  from '@sinecycle/growrte'", 'add', 2]] },
  vite: { code: [['manualChunks(id) {', '', 40], ["+  if (id.includes('@tiptap')) return 'rte'", 'add', 41], ["+  if (id.includes('cumul')) return 'charts'", 'add', 42], ['}', '', 43]] },
  tiptap: { md: { title: 'How the Tiptap Chain Got Into the Entry Chunk', lines: [
    { t: '## The three anti-patterns', c: T.text },
    { t: '1. utility co-located in a heavy render component', pad: true },
    { t: '2. styled-component beside heavy runtime imports', pad: true },
    { t: '3. component map importing all variants', pad: true },
    { t: '## The fix', c: T.text },
    { t: 'React.lazy() each entry · entry chunk −195 KB', pad: true },
  ] } },
  filtermap: { md: { title: 'GrowFilter Migration — Legacy Cleanup Plan', lines: [
    { t: 'exact legacy files to delete once each page passes', c: T.faint }, { t: 'dev testing. Delete in phase order.', c: T.faint },
    { t: '## Migration status', c: T.text },
    { t: 'Escalations   EscalationFilters.tsx    → delete', pad: true },
    { t: 'Tasks         TaskFilters/index.tsx    → delete', pad: true },
    { t: 'PTP           PTPFilters/index.tsx     → delete', pad: true },
    { t: 'Disputes      DisputeFilters/index.tsx → delete', pad: true },
    { t: 'All Customers  AR Aging  Invoice List  → next', pad: true },
    { t: '## 12 phases · later phases have blockers', c: T.text },
  ] } },
  filter: { code: [
    ['// packages/grow-components/GrowFilter.tsx', '', 59],
    ['- useEffect(() => onApply(contract))', 'del', 61],
    ['+ emitter.on("apply", onApply)', 'add', 61],
    ['// fires once — no StrictMode double-fetch', '', 63],
  ] },
  styled: { code: [['const Wrap = styled.div`', 'del', 1], ['  padding: 8px; display: flex;`', 'del', 2], ["import s from './Toolbar.module.css'", 'add', 1], ['<div className={s.wrap}>', 'add', 14]] },
  bundle: { md: { title: 'grow-components bundle: what new-bundle achieved', lines: [
    { t: 'styled-components in lib/:  38 → 0  (CSS Modules)', c: T.muted }, { t: 'export subpaths:  2 → 51  (per-component)', c: T.muted },
    { t: '247.9 kB raw · 114.1 kB gzip', c: T.muted }, { t: '243 tree-shakeable files · build 0 errors', c: T.faint },
  ] } },
}

// ── SESSION 1 — React 18 (+ asgard, same session) + a debugging arc ─────────
// each debt: user types the problem → scan repos → write plan .md → write code
const S1 = [
  { u: "let's clear the frontend debt. React 18 first — what breaks?", f: { file: 'backlog', focus: 'chat', dur: 2.0 } },
  { say: ["I'll scan all three apps for React 18 blockers."] },
  { tool: 'Read', target: 'docs/react-18-upgrade/REACT18_USEEFFECT_AUDIT.md', meta: 'Read 240 lines' },
  { say: ['React 17.0.2 across crm, cashapps, grow-components', 'legacy ReactDOM.render — removed in 18', 'StrictMode double-invokes effects · 83 files'], ask: 'Write the migration plan?', f: { file: 'backlog', focus: 'chat', dur: 2.5, work: 'Fissioning… (1m 13s · ↓ 3.1k tokens · achieving criticality)' } },
  { u: 'yes' },
  { tool: 'Update', target: 'docs/REACT18_UPGRADE_PLAN.md', meta: 'Added 34 lines', diff: [['## Phase 1 — createRoot', 'add', 1], ['## Phase 2 — effect cleanup audit', 'add', 2]], f: { file: 'plan', focus: 'editor', dur: 2.6 } },
  { tool: 'Update', target: 'server/main.tsx', meta: 'Added 2, removed 2', diff: [["import ReactDOM from 'react-dom'", 'del', 1], ["import { createRoot } from 'react-dom/client'", 'add', 1], ['ReactDOM.render(<App/>, root)', 'del', 8], ['createRoot(root).render(<App/>)', 'add', 8]], f: { file: 'main', focus: 'editor', dur: 2.0 } },
  { tool: 'Bash', target: 'pnpm tsc --noEmit && pnpm vitest run', out: [['✓ 0 errors', ''], ['✓ 214 passed', '']], f: { file: 'main', focus: 'terminal', dur: 2.0, work: 'Enriching… (58s · ↓ 8.4k tokens · to 90%)' } },
  { say: ['React 18 done — crm on 18.3.1.'] },
  { say: ['cashapps (asgard) is still on 17.0.2.', 'Same createRoot change applies there.'], ask: 'Migrate asgard too — paste its path?', f: { file: 'main', focus: 'chat', dur: 2.0 } },
  { u: '/Users/yathavan/Documents/GitHub/asgard/package.json', f: { file: 'asgard', focus: 'chat', dur: 2.2 } },
  { tool: 'Read', target: '/Users/…/asgard/package.json', meta: 'react 17.0.2 · react-dom 17.0.2' },
  { tool: 'Update', target: '../asgard/server/main.tsx', meta: 'Added 2, removed 2', diff: [['"react": "17.0.2",', 'del', 24], ['"react": "18.3.1",', 'add', 24]], f: { file: 'asgard', focus: 'editor', dur: 2.2, work: 'Noodling… (2m 4s · ↓ 12k tokens · medium effort)' } },
  { say: ['Both repos on 18.3.1 now — one session.'], done: 'React 18 ✓', ask: 'All good — what next?', f: { file: 'asgard', focus: 'chat', dur: 2.0 } },
  // follow-up bug — the debugging arc
  { u: 'the AR-aging table freezes on the second render', f: { file: 'aging', focus: 'chat', dur: 2.0 } },
  { say: ['StrictMode double-invoke — an effect', 'without cleanup. Let me trace it.'] },
  { tool: 'Update', target: 'node_modules/rc-virtual-list/es/List.js', meta: 'added a debug log', diff: [["+ console.log('[vlist]', { observers })", 'add', 118]], f: { file: 'aging', focus: 'chat', dur: 2.0 } },
  { tool: 'Bash', target: 'pnpm dev', out: [['[vlist] { observers: 1 }', T.muted], ['[vlist] { observers: 2 }  ← stacked', T.yellow]], f: { file: 'aging', focus: 'terminal', dur: 2.0, work: 'Colliding… (44s · ↓ 5.0k tokens · neutrons flowing)' } },
  { say: ['The ResizeObserver is never disconnected —', 'it was quietly cloning itself. Classic.'] },
  { tool: 'Update', target: 'src/aging/AgingTable.tsx', meta: 'Added 1 line', diff: [['+  return () => ro.disconnect()', 'add', 45]] },
  { tool: 'Update', target: 'node_modules/rc-virtual-list/es/List.js', meta: 'reverted debug log' },
  { say: ['Fixed — cleanup added, log reverted.'], done: 'aging leak ✓', ask: 'All good — what next?', f: { file: 'aging', focus: 'editor', dur: 2.0 } },
  // compact + handoff
  { compact: true, f: { file: 'aging', focus: 'chat', dur: 2.0 } },
  { u: 'write a handoff before we lose context', f: { file: 'handoff', focus: 'chat', dur: 2.0 } },
  { tool: 'Update', target: 'docs/CONTEXT_HANDOFF.md', meta: 'Added 12 lines', diff: [['## Done: React 18 ✓', 'add', 1], ['## Next: AntD v6 across 3 repos', 'add', 2]], f: { file: 'handoff', focus: 'editor', dur: 2.5 } },
  { say: ['Handoff written. Next session picks up AntD v6.'], f: { file: 'handoff', focus: 'chat', dur: 2.0 } },
]

// ── SESSION 2 — AntD v6, Grow RTE, tiptap-chain, Filter, bundle ─────────────
const S2 = [
  { divider: true, f: { file: 'handoff', focus: 'chat', dur: 2.0 } },
  { u: 'continue from the handoff' },
  { tool: 'Read', target: 'docs/CONTEXT_HANDOFF.md', meta: 'Read 12 lines' },
  { say: ['Picking up — AntD v5 → v6, all three repos.'], ask: 'Plan + codemod it everywhere?', f: { file: 'handoff', focus: 'chat', dur: 2.0, work: 'Resonating… (1m 31s · ↓ 2.7k tokens · thought for 41s)' } },
  { u: 'do it' },
  { tool: 'Update', target: 'docs/ANTD_V6_MIGRATION.md', meta: 'Added 20 lines', diff: [['bordered → variant', 'add', 1], ['dropdownClassName → classNames.popup', 'add', 2]], f: { file: 'antdplan', focus: 'editor', dur: 2.2 } },
  // built on Opus 4.8 — drop to a smaller model for the mechanical codemod
  { u: '/model sonnet', f: { file: 'antdplan', focus: 'chat', dur: 2.1 } },
  { model: { name: 'Claude Sonnet 4.5', note: 'cheaper for a find-and-replace codemod' }, f: { file: 'antdplan', focus: 'chat', dur: 2.0 } },
  { tool: 'Bash', target: 'pnpm -r exec antd-deprecated-props-transform.cjs', out: [['✓ heisenberg · crm', T.green], ['✓ asgard · cashapps', T.green], ['✓ grow-components', T.green]], f: { file: 'antd', focus: 'terminal', dur: 2.0, work: 'Bombarding… (1m 9s · ↓ 9.9k tokens · thinking harder)' } },
  { tool: 'Update', target: 'src/inbox/Toolbar.tsx', meta: 'Added 2, removed 2', diff: [['<Select bordered={false}', 'del', 8], ['<Select variant="borderless"', 'add', 8]], f: { file: 'antd', focus: 'editor', dur: 2.0 } },
  { say: ['AntD v6 across three codebases.'], done: 'AntD v6 ✓', ask: 'All good — what next?', f: { file: 'antd', focus: 'chat', dur: 2.0 } },
  // back to Opus for the reasoning work
  { u: '/model opus', f: { file: 'antd', focus: 'chat', dur: 2.0 } },
  { model: { name: 'Opus 4.8', note: 'the reasoning model — this next one needs it' }, f: { file: 'antd', focus: 'chat', dur: 2.0 } },
  // Grow RTE — the user's own example
  { u: 'the RTE is copy-pasted in 4 places — commonize it', f: { file: 'rte', focus: 'chat', dur: 2.2 } },
  { say: ['Scanning all three repos for editor usage.'] },
  { tool: 'Read', target: 'src/comments/CommentEditor.tsx', meta: 'Read 210 lines' },
  { tool: 'Read', target: '../asgard/src/notes/Editor.tsx', meta: 'Read 180 lines' },
  { say: ['4 near-identical Tiptap editors.', "I'll extract one package on Tiptap 3."], ask: 'Plan + build it?', f: { file: 'rte', focus: 'chat', dur: 2.2, work: 'Ruminating… (52s · ↓ 4.1k tokens)' } },
  { u: 'yes' },
  { tool: 'Update', target: 'docs/GROW_RTE_PLAN.md', meta: 'Added 18 lines', diff: [['## @sinecycle/growrte', 'add', 1], ['email + comment presets', 'add', 2]], f: { file: 'rteplan', focus: 'editor', dur: 2.5 } },
  { tool: 'Update', target: 'packages/grow-rte/lib/index.ts', meta: 'new package · 77 files' },
  { tool: 'Update', target: 'src/comments/CommentEditor.tsx', meta: 'Added 2, removed 3', diff: [["import { useEditor } from '@tiptap/react'", 'del', 1], ['import { useGrowEditor, commentPreset }', 'add', 1], ["  from '@sinecycle/growrte'", 'add', 2]], f: { file: 'rte', focus: 'editor', dur: 2.2 } },
  { say: ['@sinecycle/growrte — 30+ extensions, presets.', 'All four call sites import one package now.'], done: 'Grow RTE ✓', ask: 'All good — what next?', f: { file: 'rte', focus: 'chat', dur: 2.0 } },
  // tiptap-chain bundle regression
  { u: 'bundle jumped ~195KB after that', f: { file: 'vite', focus: 'chat', dur: 2.0 } },
  { say: ['The tiptap chain slipped into the entry chunk.'] },
  { tool: 'Bash', target: 'pnpm build', out: [['entry chunk +195 KB', T.yellow], ['@tiptap in modulepreload ← eager', T.yellow]], f: { file: 'vite', focus: 'terminal', dur: 2.0, work: 'Irradiating… (1m 22s · ↓ 7.3k tokens · high effort)' } },
  { tool: 'Update', target: 'vite.config.mts', meta: 'Added 2 lines', diff: [["+ if (id.includes('@tiptap')) return 'rte'", 'add', 41]], f: { file: 'vite', focus: 'editor', dur: 2.0 } },
  { tool: 'Update', target: 'docs/tiptap-chain-learnings.md', meta: 'Added 24 lines', diff: [['## The problem', 'add', 1], ['## The fix — lazy-load', 'add', 2]], f: { file: 'tiptap', focus: 'editor', dur: 2.5 } },
  { say: ['Entry chunk back down 195 KB. Documented.'], done: 'bundle chunk ✓', ask: 'All good — what next?', f: { file: 'tiptap', focus: 'chat', dur: 2.0 } },
  // Filter — map the legacy code, migrate module by module, verify, then remove
  { u: 'the filter logic is forked across a dozen pages — consolidate them', f: { file: 'backlog', focus: 'chat', dur: 2.2 } },
  { say: ['Legacy code — I’ll map every filter bar', 'across the repo before touching anything.'] },
  { tool: 'Grep', target: '**/Filters/**/*.tsx', meta: '12 legacy filter bars found' },
  { tool: 'Update', target: 'docs/GROWFILTER_LEGACY_CLEANUP.md', meta: 'Added 40 lines — the migration map', diff: [['| Escalations   | grow bar | migrate |', 'add', 1], ['| Tasks · PTP · Disputes | grow bar | migrate |', 'add', 2], ['| AR Aging · Invoice List | grow bar | migrate |', 'add', 3]], f: { file: 'filtermap', focus: 'editor', dur: 2.9 } },
  { say: ['12 pages on forked bars.', 'Migrating module by module onto GrowFilter.'] },
  { tool: 'Bash', target: 'node scripts/remap-filtercomponents-imports.cjs', out: [['✓ Escalations', T.green], ['✓ Tasks', T.green], ['✓ PTP', T.green], ['✓ Disputes', T.green]], f: { file: 'filtermap', focus: 'terminal', dur: 2.2, work: 'Chain-reacting… (1m 3s · ↓ 9.1k tokens · thought for 38s)' } },
  { say: ['4 modules migrated. AR Aging, All Customers', 'and Invoice List are next.'], ask: 'Verify these before I delete the legacy?', f: { file: 'filtermap', focus: 'chat', dur: 2.5 } },
  { u: 'verified — continue', f: { file: 'filter', focus: 'chat', dur: 2.0 } },
  { say: ['Deleting legacy bars in phase order.'] },
  { tool: 'Bash', target: 'git rm CollectionActivites/**/Filters/*', out: [['✓ EscalationFilters · TaskFilters · …', T.green], ['✓ all 12 phases deleted', T.green]], f: { file: 'filter', focus: 'terminal', dur: 2.2, work: 'Cascading… (47s · ↓ 6.2k tokens · half-life 12s)' } },
  { tool: 'Update', target: 'packages/grow-components/GrowFilter.tsx', meta: 'onApply → event-driven, fires once', diff: [['- useEffect(() => onApply(contract))', 'del', 61], ['+ emitter.on("apply", onApply)', 'add', 61]], f: { file: 'filter', focus: 'editor', dur: 2.0 } },
  { say: ['One GrowFilter, event-driven.', '12 legacy bars removed across the repo.'], done: '15 filter systems → 1', ask: 'All good — what next?', f: { file: 'filter', focus: 'chat', dur: 2.0 } },
  // styled-components + bundle retro
  { u: 'last one — grow-components still ships styled-components', f: { file: 'styled', focus: 'chat', dur: 2.0 } },
  { say: ['38 styled-components files in lib/.', 'Moving them to CSS Modules.'] },
  { tool: 'Bash', target: 'node scripts/styled-call-transform.cjs', out: [['✓ 38 files → CSS Modules', T.green], ['✓ tsc 0 errors (was: implicit-any)', T.green]], f: { file: 'styled', focus: 'terminal', dur: 2.0, work: 'Detonating… (49s · ↓ 4.8k tokens · high yield)' } },
  { tool: 'Read', target: 'BUNDLE_OPTIMIZATION.md', meta: 'Read 96 lines', f: { file: 'bundle', focus: 'editor', dur: 2.2 } },
  { say: ['247.9 kB raw · 114.1 kB gzip', '243 tree-shakeable files · 2 → 51 subpaths'], done: 'bundle ✓' },
  { say: ['That’s the batch — React 18, AntD v6, Grow', 'RTE, filters, and the bundle work.'], done: '16 debts · 3 repos · 159 docs · 29 codemods', f: { file: 'bundle', focus: 'chat', dur: 2.9 } },
  // the sign-off
  { u: 'thank you, claude — that was a big one 🙏', f: { file: 'backlog', focus: 'chat', dur: 3 } },
  { say: ['Anytime. Two years of debt, one branch,', 'sixteen ticks. Go hit merge. ✳'], done: 'session complete', f: { file: 'backlog', focus: 'chat', dur: 4 } },
]

// ── frames are the turns marked with `f` (cumulative reveal) ──────────────────
const TAB_NAMES = { backlog: 'TECH_DEBT.md', plan: 'REACT18_UPGRADE_PLAN.md', main: 'server/main.tsx', asgard: 'asgard/package.json', aging: 'AgingTable.tsx', handoff: 'CONTEXT_HANDOFF.md', antdplan: 'ANTD_V6_MIGRATION.md', antd: 'Toolbar.tsx', rteplan: 'GROW_RTE_PLAN.md', rte: 'CommentEditor.tsx', vite: 'vite.config.mts', tiptap: 'tiptap-chain-learnings.md', filtermap: 'GROWFILTER_LEGACY_CLEANUP.md', filter: 'GrowFilter.tsx', styled: 'Toolbar.tsx', bundle: 'BUNDLE_OPTIMIZATION.md' }

function Editor({ fileKey }) {
  const f = F[fileKey]
  if (f.md) return <FileMd {...f.md} />
  return <FileCode rows={f.code} />
}
function lastTerminal(session, to) {
  for (let i = to; i >= 0; i--) {
    const b = session[i]
    if (b.tool === 'Bash') {
      return (
        <>
          <div style={{ fontFamily: mono, fontSize: 22, color: T.termGreen, marginBottom: 8 }}><span style={{ color: T.teal }}>$</span> {b.target}<span className="caret" style={{ marginLeft: 8, verticalAlign: 'middle' }} /></div>
          {(b.out ?? []).map((o) => <div key={o[0]} style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.5, color: T.termGreen, whiteSpace: 'nowrap' }}>{o[0]}</div>)}
        </>
      )
    }
  }
  return null
}
// map an Update() target to the tree doc-key it creates
const DOC_KEY = {
  'docs/REACT18_UPGRADE_PLAN.md': 'react18', 'docs/CONTEXT_HANDOFF.md': 'handoff',
  'docs/ANTD_V6_MIGRATION.md': 'antdplan', 'docs/GROW_RTE_PLAN.md': 'rteplan',
  'docs/tiptap-chain-learnings.md': 'tiptap', 'docs/GROWFILTER_LEGACY_CLEANUP.md': 'filtermap',
}
function createdUpTo(s, to) {
  const set = new Set()
  // docs written in session 1 still exist on disk in session 2
  const seed = s === S2 ? S1 : []
  for (const b of seed) if (b.tool === 'Update' && DOC_KEY[b.target]) set.add(DOC_KEY[b.target])
  for (let i = 0; i <= to; i++) {
    const b = s[i]
    if (b.tool === 'Update' && DOC_KEY[b.target]) set.add(DOC_KEY[b.target])
  }
  return set
}

// context drains as the session grows, then JUMPS back up at /compact (reclaimed)
const S1_COMPACT = S1.findIndex((b) => b.compact)
function ctxLeft(s, to) {
  if (s === S2) return Math.max(46, Math.round(96 - (to / (S2.length - 1)) * 50))
  if (to <= S1_COMPACT) return Math.max(3, Math.round(97 - (to / S1_COMPACT) * 94)) // drain to ~3% at /compact
  // after the compact — context reclaimed, drains slowly again
  return Math.max(78, Math.round(90 - ((to - S1_COMPACT) / (S1.length - 1 - S1_COMPACT)) * 12))
}

function Frame({ s, to, file: fileKey, focus, work }) {
  const cur = s[to]
  const userTyping = !!cur.u
  const upto = userTyping ? to : to + 1
  const nm = TAB_NAMES[fileKey]
  const icon = nm.endsWith('.cjs') ? '⚙' : '≡'
  return (
    <Shell focus={focus} activeFile={fileKey} created={createdUpTo(s, to)} input={userTyping ? cur.u : null} working={work} context={ctxLeft(s, to)}
      tabs={[{ name: nm, active: true, dirty: true, icon, color: T.blue }]}
      editor={<Editor fileKey={fileKey} />}
      terminal={focus === 'terminal' ? lastTerminal(s, to) : null}
      chat={s.slice(0, upto).map((b, i) => <Turn key={`${b.u ?? b.say?.[0] ?? b.tool ?? b.target ?? b.compact ?? b.divider ?? 'x'}-${i}`} block={b} fresh={!userTyping && i === upto - 1} />)} />
  )
}

// a pointer arrow used by the intro/outro cursor animations
const Cursor = ({ cls }) => (
  <svg className={cls} width="26" height="30" viewBox="0 0 26 30" role="img" aria-label="cursor" style={{ position: 'absolute', top: 0, left: 0, zIndex: 30, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.5))' }}>
    <title>cursor</title>
    <path d="M3 2 L3 22 L8.5 17 L12 25 L15.5 23.4 L12 15.4 L19 15 Z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
)

// ── intro: open the app from the macOS dock ─────────────────────────────────
const DOCK = ['#4C8BF5', '#F0603A', '#8A63D2', '#2AB673', '#E5533C', '#F7B500', '#5B93F3', '#E24AA0', '#25C2A0']
function DockScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 120% at 50% 0%, #3a3550 0%, #232634 55%, #16151f 100%)', fontFamily: sans }}>
      {/* menu bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 34, background: 'rgba(0,0,0,.28)', display: 'flex', alignItems: 'center', gap: 26, padding: '0 22px', fontSize: 18, color: '#fff' }}>
        <span></span><b>Devin</b><span style={{ opacity: 0.85 }}>File</span><span style={{ opacity: 0.85 }}>Edit</span><span style={{ opacity: 0.85 }}>View</span>
        <div style={{ flex: 1 }} /><span style={{ opacity: 0.85 }}>Sat 14:21</span>
      </div>
      {/* dock */}
      <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'flex-end', gap: 16, padding: '12px 18px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 26, backdropFilter: 'blur(24px)' }}>
        {DOCK.map((c) => (
          <div key={c} style={{ width: 60, height: 60, borderRadius: 15, background: `linear-gradient(145deg, ${c}, ${c}bb)`, boxShadow: `0 6px 14px ${c}44` }} />
        ))}
        {/* VS Code (Devin) — the one being clicked */}
        <div style={{ position: 'relative' }}>
          <div className="iconbounce" style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 6px 14px rgba(0,120,200,.45))' }}>
            <svg width="56" height="56" viewBox="0 0 128 128" role="img" aria-label="VS Code">
              <title>VS Code</title>
              <path fillRule="evenodd" fill="#0098FF" d="M96 8 L118 19 L118 109 L96 120 L40 74 L18 92 L10 86 L34 64 L10 42 L18 36 L40 54 L96 8 Z M96 36 L58 64 L96 92 Z" />
            </svg>
          </div>
          <div style={{ position: 'absolute', bottom: 82, left: '50%', transform: 'translateX(-50%)', background: 'rgba(20,20,28,.95)', color: '#fff', fontSize: 16, padding: '5px 12px', borderRadius: 8, whiteSpace: 'nowrap' }}>Visual Studio Code</div>
          <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />
        </div>
      </div>
      <Cursor cls="dockcursor" />
    </div>
  )
}

// pre-session — the real editor, no Claude panel yet; cursor clicks the ✳ star
const BOOT = { md: { title: 'Why the antd v6 upgrade broke us silently', lines: [
  { t: 'Research note — evidence-backed. Every claim below', c: T.faint },
  { t: 'is verifiable against antd@6 in node_modules.', c: T.faint },
  { t: '## The short version', c: T.text },
  { t: 'antd caused ONE of the bugs this cycle.', pad: true },
  { t: 'our own legacy overrides — 59 files reaching into', pad: true },
  { t: "antd's private DOM, 20 hardcoding heights — the rest.", pad: true },
  { t: 'v6 did not break that code. v6 stopped hiding it.', c: T.faint, pad: true },
] } }
const BootTerm = () => (
  <div style={{ fontFamily: mono, fontSize: 20, lineHeight: 1.55 }}>
    <div style={{ color: T.green }}>Found '/Users/yathavan/Growfin/heisenberg/.nvmrc' with version &lt;v24&gt;</div>
    <div style={{ color: T.green }}>Now using node v24.12.0 (npm v11.6.2)</div>
    <div style={{ color: T.muted }}>(base)</div>
    <div><span style={{ color: T.teal }}>heisenberg</span> on <span style={{ color: T.mauve }}>⑂ new-bundle</span> <span style={{ color: T.yellow }}>[$!]</span> is <span style={{ color: T.peach }}>v0.1.10-beta</span> via <span style={{ color: T.green }}>v24.12.0</span></div>
    <div style={{ color: T.termGreen, marginTop: 4 }}>❯ <span className="caret" style={{ verticalAlign: 'middle' }} /></div>
  </div>
)
const BootScene = () => (
  <div className="winopen" style={{ position: 'absolute', inset: 0 }}>
    <Shell noPanel focus="editor" activeFile="silent" created={new Set()}
      tabs={[{ name: 'antd-v6-silent-breakages.md', active: true, icon: '≡', color: T.blue }]}
      editor={<FileMd {...BOOT.md} />} terminal={<BootTerm />} />
    <Cursor cls="starcursor" />
  </div>
)

// session-start — the ✳ was clicked in the boot scene; the window stays put and
// the Claude Code panel slides in from the right with the banner. No second
// window animation — just the panel opening, like the real editor.
const SplashScene = () => (
  <Shell panelIn splash focus="chat" activeFile="silent" created={new Set()} context={100}
    tabs={[{ name: 'antd-v6-silent-breakages.md', active: true, icon: '≡', color: T.blue }]}
    editor={<FileMd {...BOOT.md} />} terminal={<BootTerm />} />
)

// closing: the cursor travels to the red traffic light, clicks, the window
// closes to black — then FIN
const CloseScene = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
    <div className="winclose" style={{ position: 'absolute', inset: 0, transformOrigin: '50% 45%' }}>
      <Frame s={S2} to={S2.length - 1} file="backlog" focus="chat" />
    </div>
    <svg className="curmove" width="26" height="30" viewBox="0 0 26 30" role="img" aria-label="cursor" style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.45))' }}>
      <title>cursor</title>
      <path d="M3 2 L3 22 L8.5 17 L12 25 L15.5 23.4 L12 15.4 L19 15 Z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  </div>
)

const FinScene = () => (
  <div style={{ position: 'absolute', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="rise" style={{ fontFamily: code, fontSize: 'clamp(64px, 10vw, 150px)', fontWeight: 700, color: T.peach, letterSpacing: '0.14em', textIndent: '0.14em' }}>fin</div>
  </div>
)

const build = (sess) => sess.map((t, i) => (t.f ? { s: sess, to: i, ...t.f } : null)).filter(Boolean)
const FRAMES = [...build(S1), ...build(S2)]

// Oppenheimer tempo — the intro/outro are locked to their cursor keyframes, but
// the 56 content beats are scaled to land the whole film on ~1:50 of fast cuts.
// Each frame keeps its relative weight (dense diffs stay longer than one-liners),
// with a floor so nothing flashes past faster than it can be read.
const TEMPO = 0.80
const beat = (d) => Math.max(1.25, +(d * TEMPO).toFixed(2))

export const scenes = [
  { id: 'dock', dur: 3.8, Component: DockScene },
  { id: 'boot', dur: 4.5, Component: BootScene },
  { id: 'splash', dur: 4.2, Component: SplashScene },
  ...FRAMES.map((f, i) => ({ id: `f${i}`, dur: beat(f.dur), Component: () => <Frame {...f} /> })),
  { id: 'close', dur: 4.2, Component: CloseScene },
  { id: 'fin', dur: 3.5, Component: FinScene },
]
