import { Shell, T, Type, mono, code, sans } from './Shell'

// ONE continuous Claude Code session per context window — the transcript
// accumulates and auto-scrolls, exactly like the real pane. Each frame reveals
// a few more turns (cumulative slice); the newest turn animates in. Two sessions,
// split by a real /compact → handoff → new session. Rich, real texture: file
// reads, Update() diffs, Bash output, and a debugging arc where Claude drops a
// console.log into node_modules, finds the bug, reverts the log, fixes the root.

// ── transcript block renderers (match the real CC pane) ─────────────────────
// chat = --chat 24/36, always ≤ editor (--code 26)
const cbase = { fontFamily: mono, fontSize: 24, lineHeight: 1.5 }
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
      {block.done && <div style={{ color: T.green, display: 'flex', gap: 12, marginTop: 8 }}><span>✳</span><b style={{ color: T.bold }}>{block.done}</b></div>}
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
// When `typing`, the file is written top-down as Claude creates it: each line
// types after the previous finishes, caret following the write head.
function FileMd({ title, sub, lines, typing }) {
  const rows = [{ t: `# ${title}`, big: true }, ...(sub ? [{ t: sub, c: T.faint }] : []), ...lines]
  let acc = 0.2
  const starts = rows.map((r) => { const s = acc; acc += r.t.length / 48 + 0.12; return s })
  return (
    <div style={{ padding: '40px 54px', fontFamily: code, fontSize: 26, lineHeight: 1.5 }}>
      {rows.map((r, i) => {
        const st = { color: r.big ? T.text : (r.c ?? T.muted), fontSize: r.big ? 34 : 26, fontWeight: r.big ? 700 : 400, marginBottom: r.big ? 18 : 11, paddingLeft: r.pad ? 32 : 0 }
        return <div key={r.t} style={st}>{typing ? <Type text={r.t} start={starts[i]} cps={48} /> : r.t}</div>
      })}
    </div>
  )
}
function FileCode({ rows }) {
  return (
    <div style={{ padding: '34px 24px', fontFamily: code, fontSize: 26, lineHeight: 1.5 }}>
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

// ── real editor files (data form; md files can render typed or static) ───────
const F = {
  backlog: { md: { title: 'Frontend Tech Debt', sub: '24 tracked · 16 shipped · 3 repos', lines: [
    { t: '## This batch', c: T.text },
    { t: 'React 18 upgrade', pad: true }, { t: 'AntD v5 → v6', pad: true },
    { t: 'Grow RTE — extract the editor', pad: true }, { t: 'Filter revamp — 15 into 1', pad: true },
    { t: 'Bundle optimization', pad: true },
  ] } },
  plan: { md: { title: 'React 18 Upgrade Plan', lines: [
    { t: '## Phase 1 — createRoot', c: T.text },
    { t: 'server/main.tsx: ReactDOM.render → createRoot', pad: true },
    { t: 'drop the react-dom legacy entry', pad: true },
    { t: '## Phase 2 — StrictMode audit', c: T.text },
    { t: '83 files use useEffect — audit cleanup', pad: true },
    { t: 'ResizeObservers / listeners must disconnect', pad: true },
    { t: '## Rollout', c: T.text },
    { t: 'crm → cashapps → grow-components', pad: true },
  ] } },
  main: { code: [
    ["import ReactDOM from 'react-dom'", 'del', 1],
    ['ReactDOM.render(<App />, root)', 'del', 8],
    ["import { createRoot } from 'react-dom/client'", 'add', 1],
    ['createRoot(root).render(<App />)', 'add', 8],
  ] },
  aging: { code: [
    ['useEffect(() => {', '', 42],
    ['  const ro = new ResizeObserver(measure)', '', 43],
    ['  ro.observe(el)', '', 44],
    ['+  return () => ro.disconnect()', 'add', 45],
    ['}, [])', '', 46],
  ] },
  handoff: { md: { title: 'Context Handoff', lines: [
    { t: '## Done', c: T.text },
    { t: 'React 18 · 17.0.2 → 18.3.1 · createRoot', pad: true },
    { t: 'AR-aging StrictMode leak fixed (ResizeObserver)', pad: true },
    { t: '## Next', c: T.text },
    { t: 'AntD v5 → v6 across all 3 repos', pad: true },
    { t: 'bordered → variant · dropdownClassName → classNames', pad: true },
    { t: 'branch: new-bundle', c: T.faint },
  ] } },
  antd: { code: [
    ['<Select bordered={false}', 'del', 8],
    ['  dropdownClassName="menu" />', 'del', 9],
    ['<Select variant="borderless"', 'add', 8],
    ['  classNames={{ popup: { root: "menu" } }} />', 'add', 9],
  ] },
  rte: { code: [
    ["import { useEditor } from '@tiptap/react'", 'del', 1],
    ["import StarterKit from '@tiptap/starter-kit'", 'del', 2],
    ['import { useGrowEditor, commentPreset }', 'add', 1],
    ["  from '@sinecycle/growrte'", 'add', 2],
  ] },
  vite: { code: [
    ['manualChunks(id) {', '', 40],
    ["+  if (id.includes('@tiptap')) return 'rte'", 'add', 41],
    ["+  if (id.includes('cumul')) return 'charts'", 'add', 42],
    ['}', '', 43],
  ] },
  tiptap: { md: { title: 'How the Tiptap Chain Got Into the Entry Chunk', lines: [
    { t: '## The problem', c: T.text },
    { t: 'modulepreload = eager, on every page', pad: true },
    { t: 'a static import pulled @tiptap into the entry', pad: true },
    { t: '## The fix', c: T.text },
    { t: 'lazy-load the editor chunk', pad: true },
    { t: 'entry chunk −195 KB', c: T.faint, pad: true },
  ] } },
  filter: { md: { title: 'GrowFilter — Event-Driven onApply', lines: [
    { t: '## Before', c: T.text },
    { t: 'onApply fired from a React effect', pad: true },
    { t: 're-ran under React 18 StrictMode → double-fetch', pad: true },
    { t: '## After', c: T.text },
    { t: 'event-driven (growcomponents 4.0.0-beta.59)', pad: true },
    { t: 'fires once · 15 filter systems → 1', c: T.faint, pad: true },
  ] } },
  styled: { code: [
    ['const Wrap = styled.div`', 'del', 1],
    ['  padding: 8px; display: flex;`', 'del', 2],
    ["import s from './Toolbar.module.css'", 'add', 1],
    ['<div className={s.wrap}>', 'add', 14],
  ] },
  bundle: { md: { title: 'grow-components bundle: what new-bundle achieved', lines: [
    { t: 'styled-components in lib/:  38 → 0  (CSS Modules)', c: T.muted },
    { t: 'export subpaths:  2 → 51  (per-component)', c: T.muted },
    { t: '247.9 kB raw · 114.1 kB gzip', c: T.muted },
    { t: '243 tree-shakeable files · build 0 errors', c: T.faint },
  ] } },
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
  // bundle — real grow-components retrospective
  { u: 'last one — grow-components still ships styled-components' },
  { say: ['38 styled-components files in lib/.', 'Moving them to CSS Modules.'] },
  { tool: 'Bash', target: 'node scripts/styled-call-transform.cjs', out: [['✓ 38 files → CSS Modules', T.green], ['✓ tsc 0 errors (was: implicit-any)', T.green]] },
  { tool: 'Read', target: 'BUNDLE_OPTIMIZATION.md', meta: 'Read 96 lines' },
  { say: ['247.9 kB raw · 114.1 kB gzip', '243 tree-shakeable files · 2 → 51 subpaths'] },
  // close on the real meta-stat
  { say: ['That’s the batch — React 18, AntD v6, Grow', 'RTE, filters, and the bundle work.'], done: '16 debts · 3 repos · 159 docs · 29 codemods' },
]

// ── frames: cumulative reveal + which file the editor shows ──────────────────
// { s, to, key, focus, dur, work?, type? } — `work` shows the ✳ Working… line
// with a token count; `type` types the md out as Claude writes it.
const FRAMES = [
  { s: S1, to: 0, file: 'backlog', focus: 'chat', dur: 4.5 },   // prompt types in the input box
  { s: S1, to: 3, file: 'backlog', focus: 'chat', dur: 5.5, work: '3.1k' },
  { s: S1, to: 5, file: 'plan', focus: 'editor', dur: 6, type: true }, // writes the plan
  { s: S1, to: 8, file: 'main', focus: 'editor', dur: 4.5 },
  { s: S1, to: 11, file: 'main', focus: 'terminal', dur: 4, work: '8.4k' },
  { s: S1, to: 12, file: 'main', focus: 'chat', dur: 4 },       // bug report types in
  { s: S1, to: 15, file: 'aging', focus: 'chat', dur: 4.5 },    // console.log into node_modules
  { s: S1, to: 16, file: 'aging', focus: 'terminal', dur: 4.5, work: '12k' }, // log fires 2×
  { s: S1, to: 19, file: 'aging', focus: 'editor', dur: 4.5 }, // cleanup + revert log
  { s: S1, to: 20, file: 'aging', focus: 'chat', dur: 3.5 },
  { s: S1, to: 21, file: 'aging', focus: 'chat', dur: 4 },      // compact
  { s: S1, to: 22, file: 'handoff', focus: 'editor', dur: 5.5, type: true }, // writes handoff
  { s: S2, to: 1, file: 'handoff', focus: 'chat', dur: 4 },     // new session
  { s: S2, to: 3, file: 'antd', focus: 'chat', dur: 5, work: '2.7k' },
  { s: S2, to: 6, file: 'antd', focus: 'terminal', dur: 4.5, work: '9.9k' }, // 3-repo codemod
  { s: S2, to: 7, file: 'antd', focus: 'editor', dur: 4 },
  { s: S2, to: 10, file: 'rte', focus: 'editor', dur: 5 },
  { s: S2, to: 12, file: 'rte', focus: 'chat', dur: 4 },
  { s: S2, to: 15, file: 'vite', focus: 'terminal', dur: 4.5, work: '6.2k' }, // bundle regressed
  { s: S2, to: 16, file: 'tiptap', focus: 'editor', dur: 5.5, type: true }, // writes learnings
  { s: S2, to: 17, file: 'vite', focus: 'editor', dur: 4 },    // lazy chunk fix
  { s: S2, to: 20, file: 'filter', focus: 'editor', dur: 5, type: true }, // writes filter doc
  { s: S2, to: 22, file: 'filter', focus: 'chat', dur: 4 },
  { s: S2, to: 24, file: 'styled', focus: 'chat', dur: 4.5 },   // styled → CSS Modules
  { s: S2, to: 25, file: 'styled', focus: 'terminal', dur: 4, work: '4.8k' }, // codemod: 38 files
  { s: S2, to: 27, file: 'bundle', focus: 'editor', dur: 5 },   // real bundle retrospective
  { s: S2, to: 28, file: 'bundle', focus: 'chat', dur: 6.5 },   // closing meta-stat
]

const TAB_NAMES = { backlog: 'TECH_DEBT.md', plan: 'REACT18_UPGRADE_PLAN.md', main: 'server/main.tsx', aging: 'AgingTable.tsx', handoff: 'CONTEXT_HANDOFF.md', antd: 'Toolbar.tsx', rte: 'CommentEditor.tsx', vite: 'vite.config.mts', tiptap: 'tiptap-chain-learnings.md', filter: 'GrowFilter.tsx', styled: 'Toolbar.tsx', bundle: 'BUNDLE_OPTIMIZATION.md' }

function Editor({ fileKey, type }) {
  const f = F[fileKey]
  if (f.md) return <FileMd {...f.md} typing={type} />
  return <FileCode rows={f.code} />
}

function Frame({ s, to, file: fileKey, focus, work, type }) {
  const cur = s[to]
  const userTyping = !!cur.u // the newest turn is a prompt → type it in the input box
  const upto = userTyping ? to : to + 1
  const icon = TAB_NAMES[fileKey].endsWith('.md') ? '≡' : TAB_NAMES[fileKey].endsWith('.cjs') ? '⚙' : '≡'
  return (
    <Shell focus={focus} activeFile={fileKey} input={userTyping ? cur.u : null} working={work}
      tabs={[{ name: TAB_NAMES[fileKey], active: true, dirty: true, icon, color: T.blue }]}
      editor={<Editor fileKey={fileKey} type={type} />}
      terminal={focus === 'terminal' ? lastTerminal(s, to) : null}
      chat={s.slice(0, upto).map((b, i) => <Turn key={`${b.u ?? b.say?.[0] ?? b.tool ?? b.target ?? 'x'}-${i}`} block={b} fresh={i === upto - 1} />)} />
  )
}
function lastTerminal(session, to) {
  // render the most recent Bash block's output in the terminal panel
  for (let i = to; i >= 0; i--) {
    const b = session[i]
    if (b.tool === 'Bash') {
      // real terminal panel — output + cursor use the #00FD61 override
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

export const scenes = FRAMES.map((f, i) => ({
  id: `f${i}`,
  dur: f.dur,
  Component: () => <Frame {...f} />,
}))
