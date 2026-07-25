import { Shell, T, mono, sans } from './Shell'

// ONE continuous Claude Code session per context window — the transcript
// accumulates and auto-scrolls, exactly like the real pane. Each frame reveals
// a few more turns (cumulative slice); the newest turn animates in. Two sessions,
// split by a real /compact → handoff → new session. Rich, real texture: file
// reads, Update() diffs, Bash output, and a debugging arc where Claude drops a
// console.log into node_modules, finds the bug, reverts the log, fixes the root.

// ── transcript block renderers (match the real CC pane) ─────────────────────
const cbase = { fontFamily: mono, fontSize: 27, lineHeight: 1.6 }
const dot = <span style={{ color: T.green, fontSize: '0.55em', verticalAlign: 'middle', marginRight: 12 }}>●</span>

function Turn({ block, fresh }) {
  const cls = fresh ? 'rise' : ''
  if (block.u) return <div className={cls} style={{ ...cbase, color: T.green, display: 'flex', gap: 12 }}><span>❯</span><span>{block.u}{block.caret && <span className="caret" style={{ marginLeft: 6, verticalAlign: 'middle' }} />}</span></div>
  if (block.compact) return <Compact cls={cls} />
  if (block.divider) return <div className={cls} style={{ ...cbase, color: T.faint, textAlign: 'center', fontSize: 22, letterSpacing: '0.12em' }}>────────  new session · resumed from handoff  ────────</div>
  if (block.say) return (
    <div className={cls} style={{ ...cbase }}>
      {block.say.map((l) => <div key={l} style={{ color: T.green, marginBottom: 6 }}>{dot}{l}</div>)}
      {block.ask && <div style={{ color: T.peach, marginTop: 6 }}>▸ {block.ask} <span style={{ color: T.faint }}>(y/n)</span></div>}
    </div>
  )
  // tool call: ● Verb(target)  ⎿ meta  [+ diff / output]
  return (
    <div className={cls} style={{ ...cbase }}>
      <div>{dot}<span style={{ color: T.green }}>{block.tool}</span><span style={{ color: T.faint }}>(</span><span style={{ color: T.teal }}>{block.target}</span><span style={{ color: T.faint }}>)</span></div>
      {block.meta && <div style={{ color: T.faint, fontSize: 22, marginLeft: 28, marginTop: 2 }}>⎿ {block.meta}</div>}
      {block.diff && <Diff rows={block.diff} />}
      {block.out && (
        <div style={{ marginLeft: 28, marginTop: 8 }}>
          {block.out.map((o) => <div key={o[0]} style={{ color: o[1] ?? T.muted, fontSize: 22, lineHeight: 1.45, whiteSpace: 'nowrap' }}>{o[0]}</div>)}
        </div>
      )}
    </div>
  )
}
function Compact({ cls }) {
  return (
    <div className={cls} style={{ ...cbase, background: 'rgba(249,226,175,0.06)', border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 20px' }}>
      <div style={{ color: T.yellow, fontSize: 22, marginBottom: 10 }}>⚠ context left: 2% — /compact</div>
      <div style={{ height: 7, background: T.border, borderRadius: 4, overflow: 'hidden' }}><div style={{ width: '98%', height: '100%', background: `linear-gradient(90deg, ${T.peach}, ${T.red})` }} /></div>
      <div style={{ color: T.faint, fontSize: 22, marginTop: 10 }}>Compacting conversation… ✓ summary saved</div>
    </div>
  )
}
function Diff({ rows }) {
  return (
    <div style={{ marginLeft: 28, marginTop: 8, marginBottom: 2, borderLeft: `2px solid ${T.border}`, paddingLeft: 14, fontFamily: mono, fontSize: 22, lineHeight: 1.5 }}>
      {rows.map((r, i) => (
        <div key={`${r[0]}-${i}`} style={{ display: 'flex', background: r[1] === 'del' ? 'rgba(243,139,168,.12)' : r[1] === 'add' ? 'rgba(166,227,161,.12)' : 'transparent', whiteSpace: 'nowrap' }}>
          <span style={{ width: 34, textAlign: 'right', paddingRight: 12, color: T.faint }}>{r[2] ?? ''}</span>
          <span style={{ width: 18, color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.faint }}>{r[1] === 'del' ? '−' : r[1] === 'add' ? '+' : ''}</span>
          <span style={{ color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.muted }}>{r[0]}</span>
        </div>
      ))}
    </div>
  )
}

// ── editor interiors ────────────────────────────────────────────────────────
function FileMd({ title, sub, lines }) {
  return (
    <div style={{ padding: '40px 54px', fontFamily: mono, fontSize: 25, lineHeight: 1.7 }}>
      <div style={{ fontSize: 34, fontWeight: 700, color: T.text, marginBottom: sub ? 6 : 22 }}># {title}</div>
      {sub && <div style={{ fontSize: 23, color: T.faint, marginBottom: 24 }}>{sub}</div>}
      {lines.map((l) => <div key={l.t} style={{ color: l.c ?? T.muted, marginBottom: 11, paddingLeft: l.pad ? 32 : 0 }}>{l.t}</div>)}
    </div>
  )
}
function FileCode({ rows }) {
  return (
    <div style={{ padding: '34px 24px', fontFamily: mono, fontSize: 25, lineHeight: 1.85 }}>
      {rows.map((r, i) => (
        <div key={`${r[0]}-${i}`} style={{ display: 'flex', background: r[1] === 'del' ? 'rgba(243,139,168,.1)' : r[1] === 'add' ? 'rgba(166,227,161,.1)' : 'transparent' }}>
          <span style={{ width: 48, textAlign: 'right', paddingRight: 16, color: T.faint }}>{r[2] ?? ''}</span>
          <span style={{ width: 22, color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.faint }}>{r[1] === 'del' ? '−' : r[1] === 'add' ? '+' : ''}</span>
          <span style={{ color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.muted }}>{r[0]}</span>
        </div>
      ))}
    </div>
  )
}

// ── real editor files ────────────────────────────────────────────────────────
const F = {
  backlog: <FileMd title="Frontend Tech Debt" sub="24 tracked · 16 shipped · 3 repos" lines={[
    { t: '## This batch', c: T.text },
    { t: 'React 18 upgrade', pad: true }, { t: 'AntD v5 → v6', pad: true },
    { t: 'Grow RTE — extract the editor', pad: true }, { t: 'Filter revamp — 15 into 1', pad: true },
    { t: 'Bundle optimization', pad: true },
  ]} />,
  plan: <FileMd title="React 18 Upgrade Plan" lines={[
    { t: '## Phase 1', c: T.text },
    { t: 'ReactDOM.render → createRoot', pad: true },
    { t: 'audit StrictMode double-invoke', pad: true },
    { t: 'useEffect cleanup — 83 files', pad: true },
  ]} />,
  main: <FileCode rows={[
    ["import ReactDOM from 'react-dom'", 'del', 1],
    ['ReactDOM.render(<App />, root)', 'del', 8],
    ["import { createRoot } from 'react-dom/client'", 'add', 1],
    ['createRoot(root).render(<App />)', 'add', 8],
  ]} />,
  aging: <FileCode rows={[
    ['useEffect(() => {', '', 42],
    ['  const ro = new ResizeObserver(measure)', '', 43],
    ['  ro.observe(el)', '', 44],
    ['+  return () => ro.disconnect()', 'add', 45],
    ['}, [])', '', 46],
  ]} />,
  handoff: <FileMd title="Context Handoff" lines={[
    { t: '## Done', c: T.text },
    { t: 'React 18 · 17.0.2 → 18.3.1 · createRoot', pad: true },
    { t: 'aging table StrictMode leak fixed', pad: true },
    { t: '## Next', c: T.text },
    { t: 'AntD v5 → v6 across all 3 repos', pad: true },
  ]} />,
  antd: <FileCode rows={[
    ['<Select bordered={false}', 'del', 8],
    ['  dropdownClassName="menu" />', 'del', 9],
    ['<Select variant="borderless"', 'add', 8],
    ['  classNames={{ popup: { root: "menu" } }} />', 'add', 9],
  ]} />,
  rte: <FileCode rows={[
    ["import { useEditor } from '@tiptap/react'", 'del', 1],
    ["import StarterKit from '@tiptap/starter-kit'", 'del', 2],
    ['import { useGrowEditor, commentPreset }', 'add', 1],
    ["  from '@sinecycle/growrte'", 'add', 2],
  ]} />,
  vite: <FileCode rows={[
    ["manualChunks(id) {", '', 40],
    ["+  if (id.includes('@tiptap')) return 'rte'", 'add', 41],
    ["+  if (id.includes('cumul')) return 'charts'", 'add', 42],
    ['}', '', 43],
  ]} />,
  tiptap: <FileMd title="How the Tiptap Chain Got Into the Entry Chunk" lines={[
    { t: 'modulepreload = every page’s critical path', c: T.muted },
    { t: 'a static import dragged the editor in', c: T.muted },
    { t: 'fix: keep chained commands lazy', c: T.muted },
    { t: 'entry chunk −195 KB', c: T.faint },
  ]} />,
  filter: <FileMd title="GrowFilter — Event-Driven onApply" lines={[
    { t: 'onApply fired from a React effect', c: T.muted },
    { t: 'broke under React 18 StrictMode', c: T.muted },
    { t: 'now event-driven — fires once', c: T.muted },
    { t: '15 filter systems → 1', c: T.faint },
  ]} />,
}

// ── SESSION 1 — React 18 + a real debugging arc ─────────────────────────────
const S1 = [
  { u: "let's clear the frontend debt. React 18 first — what breaks?", caret: true },
  { say: ["I'll scan all three apps for React 18 blockers."] },
  { tool: 'Read', target: 'docs/react-18-upgrade/REACT18_USEEFFECT_AUDIT.md', meta: 'Read 240 lines' },
  { say: ['React 17.0.2 across crm, cashapps, grow-components', 'legacy ReactDOM.render — removed in 18', 'StrictMode double-invokes effects · 83 files'], ask: 'Write the migration plan?' },
  { u: 'yes' },
  { tool: 'Update', target: 'docs/REACT18_UPGRADE_PLAN.md', meta: 'Added 34 lines', diff: [['## Phase 1 — createRoot', 'add', 1], ['## Phase 2 — effect cleanup audit', 'add', 2]] },
  { say: ['Plan written.'], ask: 'Execute the createRoot migration?' },
  { u: 'go' },
  { tool: 'Update', target: 'server/main.tsx', meta: 'Added 2, removed 2', diff: [["import ReactDOM from 'react-dom'", 'del', 1], ["import { createRoot } from 'react-dom/client'", 'add', 1], ['ReactDOM.render(<App/>, root)', 'del', 8], ['createRoot(root).render(<App/>)', 'add', 8]] },
  { tool: 'Bash', target: 'pnpm tsc --noEmit', out: [['✓ 0 errors', T.green]] },
  { tool: 'Bash', target: 'pnpm vitest run', out: [['✓ 214 passed', T.green]] },
  { say: ['React 18 done — 17.0.2 → 18.3.1.'] },
  // debugging arc
  { u: 'the AR-aging table freezes on the second render now' },
  { say: ['Smells like a StrictMode double-invoke —', 'an effect without cleanup. Let me trace it.'] },
  { tool: 'Update', target: 'node_modules/rc-virtual-list/es/List.js', meta: 'added a debug log', diff: [["+ console.log('[vlist]', { scrollTop, observers })", 'add', 118]] },
  { tool: 'Bash', target: 'pnpm dev', out: [['[vlist] { observers: 1 }', T.muted], ['[vlist] { observers: 2 }  ← stacked', T.yellow]] },
  { say: ['Found it — the ResizeObserver is never', 'disconnected, so StrictMode stacks two.'] },
  { tool: 'Update', target: 'src/aging/AgingTable.tsx', meta: 'Added 1 line', diff: [['+  return () => ro.disconnect()', 'add', 45]] },
  { tool: 'Update', target: 'node_modules/rc-virtual-list/es/List.js', meta: 'reverted debug log' },
  { say: ['Fixed — cleanup added, debug log reverted.', 'Table is stable under StrictMode.'] },
  { compact: true },
  { u: 'write a handoff before we lose context' },
  { tool: 'Update', target: 'docs/CONTEXT_HANDOFF.md', meta: 'Added 12 lines', diff: [['## Done: React 18 ✓', 'add', 1], ['## Next: AntD v6 across 3 repos', 'add', 2]] },
  { say: ['Handoff written. Next session picks up AntD v6.'] },
]

// ── SESSION 2 — AntD v6, Grow RTE, tiptap-chain, filters ────────────────────
const S2 = [
  { divider: true },
  { u: 'continue from the handoff' },
  { tool: 'Read', target: 'docs/CONTEXT_HANDOFF.md', meta: 'Read 12 lines' },
  { say: ['Picking up — AntD v5 → v6, all three repos.', 'bordered → variant · dropdownClassName → classNames'], ask: 'Codemod it everywhere?' },
  { u: 'do it' },
  { tool: 'Bash', target: 'pnpm -r exec antd-deprecated-props-transform.cjs', out: [['✓ heisenberg · crm', T.green], ['✓ asgard · cashapps', T.green], ['✓ grow-components', T.green]] },
  { tool: 'Update', target: 'src/inbox/Toolbar.tsx', meta: 'Added 2, removed 2', diff: [['<Select bordered={false}', 'del', 8], ['<Select variant="borderless"', 'add', 8], ['  dropdownClassName="menu" />', 'del', 9], ['  classNames={{ popup: { root: "menu" } }} />', 'add', 9]] },
  { say: ['AntD v6 migrated across 3 codebases.'] },
  { u: 'the comment editor is copy-pasted in 4 places — extract it' },
  { say: ["I'll pull it into its own package on Tiptap 3."] },
  { tool: 'Update', target: 'packages/grow-rte/lib/index.ts', meta: 'new package · 77 files' },
  { tool: 'Update', target: 'src/comments/CommentEditor.tsx', meta: 'Added 2, removed 3', diff: [["import { useEditor } from '@tiptap/react'", 'del', 1], ["import { useGrowEditor, commentPreset }", 'add', 1], ["  from '@sinecycle/growrte'", 'add', 2]] },
  { say: ['@sinecycle/growrte — 30+ extensions,', 'email + comment presets. One import now.'] },
  { u: 'bundle jumped ~195KB after that' },
  { say: ['The tiptap chain got statically imported', 'into the entry chunk. Confirming.'] },
  { tool: 'Bash', target: 'pnpm build', out: [['entry chunk +195 KB', T.yellow], ['@tiptap in modulepreload ← eager', T.yellow]] },
  { tool: 'Update', target: 'vite.config.mts', meta: 'Added 2 lines', diff: [["+ if (id.includes('@tiptap')) return 'rte'", 'add', 41]] },
  { tool: 'Update', target: 'docs/tiptap-chain-learnings.md', meta: 'wrote down the gotcha' },
  { say: ['Entry chunk back down 195 KB. Documented', 'so it can’t regress.'] },
  { u: 'every page double-fetches on filter apply' },
  { say: ['onApply fires from an effect watching the', 'contract — re-runs under StrictMode.'] },
  { tool: 'Update', target: 'packages/grow-components/GrowFilter.tsx', meta: 'onApply → event-driven', diff: [['- useEffect(() => onApply(contract))', 'del', 61], ['+ emitter.on("apply", onApply)', 'add', 61]] },
  { say: ['Fires once now. 15 filter systems → 1.'] },
  { say: ['That’s the batch — React 18, AntD v6,', 'Grow RTE, filters, bundle, and a dozen more.'] },
]

// ── frames: cumulative reveal + which file the editor shows ──────────────────
// [session, revealToIndex, editorKey, focus, dur]
const FRAMES = [
  [S1, 0, 'backlog', 'chat', 4],
  [S1, 3, 'backlog', 'chat', 5.5],
  [S1, 5, 'plan', 'editor', 4.5],
  [S1, 8, 'main', 'editor', 4.5],
  [S1, 11, 'main', 'terminal', 4],
  [S1, 12, 'main', 'chat', 3.5],
  [S1, 13, 'aging', 'chat', 4],
  [S1, 15, 'aging', 'chat', 4.5],   // console.log into node_modules
  [S1, 16, 'aging', 'terminal', 4], // the log fires 2×
  [S1, 19, 'aging', 'editor', 4.5], // cleanup + revert log
  [S1, 20, 'aging', 'chat', 3.5],
  [S1, 21, 'aging', 'chat', 4],     // compact
  [S1, 23, 'handoff', 'editor', 4.5],
  [S2, 1, 'handoff', 'chat', 4],    // new session
  [S2, 3, 'antd', 'chat', 5],
  [S2, 6, 'antd', 'terminal', 4.5], // 3-repo codemod
  [S2, 7, 'antd', 'editor', 4],
  [S2, 10, 'rte', 'editor', 5],
  [S2, 12, 'rte', 'chat', 4],
  [S2, 15, 'vite', 'terminal', 4.5],// bundle regressed
  [S2, 17, 'vite', 'editor', 4.5],  // lazy chunk fix
  [S2, 20, 'filter', 'editor', 5],
  [S2, 22, 'filter', 'chat', 5],
]

function Frame({ session, to, editorKey, focus }) {
  const term = session[to]?.tool === 'Bash' || session.slice(0, to + 1).some((b) => b.out)
  return (
    <Shell focus={focus} activeFile={editorKey} tabs={[{ name: editorFile(session, to, editorKey), active: true, dirty: true, icon: '≡', color: T.blue }]}
      editor={F[editorKey]}
      terminal={focus === 'terminal' ? lastTerminal(session, to) : null}
      chat={session.slice(0, to + 1).map((b, i) => <Turn key={`${b.u ?? b.say?.[0] ?? b.tool ?? b.target ?? 'x'}-${i}`} block={b} fresh={i === to} />)} />
  )
}
function editorFile(session, to, key) {
  const names = { backlog: 'TECH_DEBT.md', plan: 'REACT18_UPGRADE_PLAN.md', main: 'server/main.tsx', aging: 'AgingTable.tsx', handoff: 'CONTEXT_HANDOFF.md', antd: 'Toolbar.tsx', rte: 'CommentEditor.tsx', vite: 'vite.config.mts', tiptap: 'tiptap-chain-learnings.md', filter: 'GrowFilter.tsx' }
  return names[key] ?? 'file'
}
function lastTerminal(session, to) {
  // render the most recent Bash block's output in the terminal panel
  for (let i = to; i >= 0; i--) {
    const b = session[i]
    if (b.tool === 'Bash') {
      return (
        <>
          <div style={{ fontFamily: mono, fontSize: 22, color: T.text, marginBottom: 8 }}><span style={{ color: T.teal }}>$</span> {b.target}</div>
          {(b.out ?? []).map((o) => <div key={o[0]} style={{ fontFamily: mono, fontSize: 22, lineHeight: 1.5, color: o[1] ?? T.muted, whiteSpace: 'nowrap' }}>{o[0]}</div>)}
        </>
      )
    }
  }
  return null
}

export const scenes = FRAMES.map(([session, to, editorKey, focus, dur], i) => ({
  id: `f${i}`,
  dur,
  Component: () => <Frame session={session} to={to} editorKey={editorKey} focus={focus} />,
}))
