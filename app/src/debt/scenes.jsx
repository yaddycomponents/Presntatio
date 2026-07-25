import { Shell, T, mono, sans } from './Shell'

// One continuous Claude Code session — the story is HOW it was built. The chat
// accumulates; only the newest block animates each beat, so it reads as a live
// conversation: steer → analyze → ask to plan → write md → ask to execute →
// change files → context hits 2% → compact → handoff → new session → next debt.
// React 18 → AntD v6 (3 repos) → Grow RTE → tiptap-chain → Filter → bundle-opt.
// Theme = scene G: green voice, peach ✳/status, mauve for branch/labels only.

const Bold = ({ children }) => <b style={{ color: T.bold }}>{children}</b>
const Code = ({ children }) => <code style={{ background: T.border, color: T.text, borderRadius: 4, padding: '2px 8px', fontFamily: mono }}>{children}</code>

// ── chat blocks (28px / 1.65, one line at this pane width) ───────────────────
const cbase = { fontFamily: mono, fontSize: 28, lineHeight: 1.65 }
const Chat = ({ children }) => <>{children}</>
function UserMsg({ children, fresh, caret }) {
  return (
    <div className={fresh ? 'rise' : ''} style={{ ...cbase, color: T.green, display: 'flex', gap: 12 }}>
      <span>❯</span><span>{children}{caret && <span className="caret" style={{ marginLeft: 6, verticalAlign: 'middle' }} />}</span>
    </div>
  )
}
function Claude({ lines, ask, done, fresh }) {
  return (
    <div className={fresh ? 'rise' : ''} style={{ ...cbase }}>
      {lines?.map((l) => (
        <div key={l} style={{ color: T.green, display: 'flex', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: '0.6em', lineHeight: '2.5em' }}>●</span><span>{l}</span>
        </div>
      ))}
      {done && <div style={{ color: T.green, display: 'flex', gap: 12, marginTop: 4 }}><span>✳</span><Bold>{done}</Bold></div>}
      {ask && <div style={{ color: T.peach, marginTop: 8 }}>▸ {ask} <span style={{ color: T.faint }}>(y/n)</span></div>}
    </div>
  )
}
function Compact({ fresh }) {
  return (
    <div className={fresh ? 'rise' : ''} style={{ ...cbase, background: 'rgba(249,226,175,0.06)', border: `1px solid ${T.border}`, borderRadius: 10, padding: '18px 22px' }}>
      <div style={{ color: T.yellow, fontSize: 23, marginBottom: 12 }}>⚠ context nearly full — 2% left</div>
      <div style={{ height: 8, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: '98%', height: '100%', background: `linear-gradient(90deg, ${T.peach}, ${T.red})` }} />
      </div>
      <div style={{ color: T.faint, fontSize: 23, marginTop: 12 }}>Compacting… ✓ summary saved</div>
    </div>
  )
}
function Divider({ fresh }) {
  return (
    <div className={fresh ? 'rise' : ''} style={{ ...cbase, color: T.faint, textAlign: 'center', fontSize: 23, letterSpacing: '0.1em' }}>
      ──────  new session  ──────
    </div>
  )
}

// ── editor interiors — plain, real markdown ─────────────────────────────────
function Markdown({ title, sub, lines }) {
  return (
    <div style={{ padding: '40px 56px', fontFamily: mono, fontSize: 26, lineHeight: 1.7 }}>
      <div className="rise" style={{ '--i': 0, fontSize: 36, fontWeight: 700, color: T.text, marginBottom: sub ? 8 : 24 }}># {title}</div>
      {sub && <div className="rise" style={{ '--i': 1, fontSize: 24, color: T.faint, marginBottom: 26 }}>{sub}</div>}
      {lines.map((l, idx) => (
        <div key={l.t} className="rise" style={{ '--i': idx + 2, color: l.c ?? T.muted, marginBottom: 12, paddingLeft: l.pad ? 34 : 0 }}>{l.t}</div>
      ))}
    </div>
  )
}
function Diff({ file, rows }) {
  return (
    <div className="rise" style={{ '--i': 0, padding: '30px 18px', fontFamily: mono, fontSize: 25, lineHeight: 1.85 }}>
      {rows.map((r, i) => (
        <div key={`${r[0]}-${i}`} style={{ display: 'flex', background: r[1] === 'del' ? 'rgba(243,139,168,.12)' : r[1] === 'add' ? 'rgba(166,227,161,.12)' : 'transparent' }}>
          <span style={{ width: 46, textAlign: 'right', paddingRight: 14, color: T.faint }}>{r[2] ?? ''}</span>
          <span style={{ width: 24, color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.faint }}>{r[1] === 'del' ? '−' : r[1] === 'add' ? '+' : ''}</span>
          <span style={{ color: r[1] === 'del' ? T.red : r[1] === 'add' ? T.green : T.muted }}>{r[0]}</span>
        </div>
      ))}
    </div>
  )
}

const term = (lines) => (
  <>
    {lines.map((l, i) => (
      <div key={l[1]} className="rise" style={{ '--i': i, fontFamily: mono, fontSize: 22, lineHeight: 1.5, marginBottom: 4, whiteSpace: 'nowrap' }}>
        {l[0] && <span style={{ color: T.teal }}>{l[0]} </span>}<span style={{ color: l[2] }}>{l[1]}</span>
      </div>
    ))}
  </>
)

// ── real content ─────────────────────────────────────────────────────────────
const BACKLOG = { title: 'Frontend Tech Debt', sub: '24 tracked · 16 shipped · 3 repos', lines: [
  { t: '## The plan', c: T.text },
  { t: 'React 18 upgrade', c: T.muted, pad: true },
  { t: 'AntD v5 → v6', c: T.muted, pad: true },
  { t: 'Grow RTE — extract the editor', c: T.muted, pad: true },
  { t: 'Filter revamp — 15 into 1', c: T.muted, pad: true },
  { t: 'Bundle optimization', c: T.muted, pad: true },
] }
const REACT18_PLAN = { title: 'React 18 Upgrade Plan', lines: [
  { t: '1. ReactDOM.render → createRoot', c: T.muted },
  { t: '2. StrictMode double-invoke audit', c: T.muted },
  { t: '3. useEffect cleanup — 83 files', c: T.muted },
  { t: 'phased, one app at a time', c: T.faint },
] }
const HANDOFF = { title: 'Context Handoff', lines: [
  { t: '## Done', c: T.text },
  { t: 'React 18 · 17.0.2 → 18.3.1', c: T.muted, pad: true },
  { t: '## Next', c: T.text },
  { t: 'AntD v5 → v6 across 3 repos', c: T.muted, pad: true },
  { t: 'branch: new-bundle', c: T.faint },
] }
const ANTD_DOC = { title: 'AntD v6 — Deprecated Props', lines: [
  { t: 'bordered           → variant', c: T.muted },
  { t: 'dropdownClassName  → classNames.popup', c: T.muted },
  { t: 'overlayClassName   → classNames.root', c: T.muted },
  { t: 'lands in all 3 repos', c: T.faint },
] }
const TIPTAP_DOC = { title: 'Tiptap Chain → Entry Chunk', lines: [
  { t: 'modulepreload = critical path', c: T.muted },
  { t: 'a static import dragged the editor in', c: T.muted },
  { t: 'fix: keep chained commands lazy', c: T.muted },
  { t: 'entry chunk −195 KB', c: T.faint },
] }
const FILTER_DOC = { title: 'GrowFilter — Event-Driven onApply', lines: [
  { t: 'onApply fired from a React effect', c: T.muted },
  { t: 'broke under React 18 StrictMode', c: T.muted },
  { t: 'now event-driven — fires once', c: T.muted },
  { t: '15 filter systems → 1', c: T.faint },
] }
const BUNDLE_DOC = { title: 'Bundle Optimization', lines: [
  { t: 'lazy-load tiptap + cumul.io', c: T.muted },
  { t: 'Vite 8 manual chunking', c: T.muted },
  { t: '…and a dozen more, all in docs/', c: T.faint },
] }
const REACT_DIFF = [
  ["import ReactDOM from 'react-dom'", 'del', 1],
  ['ReactDOM.render(<App />, el)', 'del', 2],
  ["import { createRoot } from 'react-dom/client'", 'add', 1],
  ['createRoot(el).render(<App />)', 'add', 2],
]
const ANTD_DIFF = [
  ['<Select bordered={false}', 'del', 8],
  ['  dropdownClassName="menu" />', 'del', 9],
  ['<Select variant="borderless"', 'add', 8],
  ['  classNames={{ popup: { root: "menu" } }} />', 'add', 9],
]
const RTE_DIFF = [
  ["import { useEditor } from '@tiptap/react'", 'del', 1],
  ["import StarterKit from '@tiptap/starter-kit'", 'del', 2],
  ['import { useGrowEditor, commentPreset }', 'add', 1],
  ["  from '@sinecycle/growrte'", 'add', 2],
]

// ── beats ────────────────────────────────────────────────────────────────────
const mdTab = (name) => [{ name, active: true, dirty: true, icon: '≡', color: T.blue }]
const cmTab = (name) => [{ name, active: true, dirty: true, icon: '⚙', color: T.peach }]
const codeTab = (name) => [{ name, active: true, dirty: true, icon: '⬡', color: T.green }]

// React 18
const Ask = () => (
  <Shell focus="chat" activeFile="backlog" tabs={mdTab('TECH_DEBT.md')} editor={<Markdown {...BACKLOG} />} chat={
    <Chat><UserMsg fresh caret>let's clear the frontend debt. React 18 first?</UserMsg></Chat>
  } />
)
const Analyze = () => (
  <Shell focus="chat" activeFile="backlog" tabs={mdTab('TECH_DEBT.md')} editor={<Markdown {...BACKLOG} />} chat={
    <Chat>
      <UserMsg>React 18 first — what breaks?</UserMsg>
      <Claude fresh lines={['Scanned all 3 apps — React 17.0.2', 'StrictMode, legacy ReactDOM.render,', '83 effect files to audit']} ask="Write the migration plan?" />
    </Chat>
  } />
)
const Plan = () => (
  <Shell focus="editor" activeFile="react18" tabs={mdTab('REACT18_UPGRADE_PLAN.md')} editor={<Markdown {...REACT18_PLAN} />} chat={
    <Chat>
      <Claude lines={['Scanned all 3 apps — React 17.0.2']} ask="Write the migration plan?" />
      <UserMsg fresh>yes, plan it</UserMsg>
      <Claude fresh lines={['Wrote REACT18_UPGRADE_PLAN.md']} ask="Execute the changes?" />
    </Chat>
  } />
)
const Execute = () => (
  <Shell focus="terminal" activeFile="react18" tabs={mdTab('server/main.tsx')} editor={<Diff rows={REACT_DIFF} />}
    terminal={term([['$', 'tsc --noEmit', T.text], ['', '  ✓ 0 errors', T.green], ['$', 'vitest run', T.text], ['', '  ✓ 214 passed', T.green]])}
    chat={
      <Chat>
        <UserMsg>yes, plan it</UserMsg>
        <Claude lines={['Wrote REACT18_UPGRADE_PLAN.md']} ask="Execute the changes?" />
        <UserMsg fresh>go</UserMsg>
        <Claude fresh lines={['ReactDOM.render → createRoot']} done="react 17.0.2 → 18.3.1" />
      </Chat>
    } />
)
// Compact + handoff
const CompactBeat = () => (
  <Shell focus="chat" activeFile="react18" tabs={mdTab('server/main.tsx')} editor={<Diff rows={REACT_DIFF} />} chat={
    <Chat>
      <Claude lines={['ReactDOM.render → createRoot']} done="react 17.0.2 → 18.3.1" />
      <Compact fresh />
    </Chat>
  } />
)
const Handoff = () => (
  <Shell focus="editor" activeFile="react18" tabs={mdTab('CONTEXT_HANDOFF.md')} editor={<Markdown {...HANDOFF} />} chat={
    <Chat>
      <Compact />
      <UserMsg fresh>write a handoff before we lose context</UserMsg>
      <Claude fresh lines={['Wrote CONTEXT_HANDOFF.md']} done="React 18 ✓ · next: AntD v6" />
    </Chat>
  } />
)
// New session → AntD v6 (3 repos)
const NewSession = () => (
  <Shell focus="chat" activeFile="backlog" tabs={mdTab('CONTEXT_HANDOFF.md')} editor={<Markdown {...HANDOFF} />} chat={
    <Chat>
      <Divider fresh />
      <UserMsg fresh caret>continue from the handoff</UserMsg>
    </Chat>
  } />
)
const AntdPlan = () => (
  <Shell focus="editor" activeFile="antd" tabs={mdTab('ANTD_V6_DEPRECATED_PROPS.md')} editor={<Markdown {...ANTD_DOC} />} chat={
    <Chat>
      <Divider />
      <UserMsg>continue from the handoff</UserMsg>
      <Claude fresh lines={['Read CONTEXT_HANDOFF.md', 'AntD v6 lands in all 3 repos']} ask="Codemod it everywhere?" />
    </Chat>
  } />
)
const AntdExec = () => (
  <Shell focus="terminal" activeFile="antd" tabs={cmTab('antd-deprecated-props.cjs')} editor={<Diff rows={ANTD_DIFF} />}
    terminal={term([['$', 'pnpm -r exec antd-deprecated-props-transform.cjs', T.text], ['', '  ✓ heisenberg · crm', T.green], ['', '  ✓ asgard · cashapps', T.green], ['', '  ✓ grow-components', T.green]])}
    chat={
      <Chat>
        <UserMsg>do it</UserMsg>
        <Claude fresh lines={['bordered → variant', 'dropdownClassName → classNames.popup']} done="AntD v6 · 3 repos, one pass" />
      </Chat>
    } />
)
// Grow RTE
const Rte = () => (
  <Shell focus="editor" activeFile="rte" tabs={codeTab('CommentEditor.tsx')} editor={<Diff rows={RTE_DIFF} />}
    chat={
      <Chat>
        <UserMsg>the editor is copy-pasted — extract it</UserMsg>
        <Claude fresh lines={['Built @sinecycle/growrte on Tiptap 3', 'email + comment presets']} done="one package · 77 files" />
      </Chat>
    } />
)
// tiptap-chain learning
const Tiptap = () => (
  <Shell focus="editor" activeFile="tiptap" tabs={mdTab('tiptap-chain-learnings.md')} editor={<Markdown {...TIPTAP_DOC} />} chat={
    <Chat>
      <UserMsg>why did the bundle jump after RTE?</UserMsg>
      <Claude fresh lines={['The tiptap chain slipped into the', 'entry chunk — wrote down the fix']} done="entry chunk −195 KB" />
    </Chat>
  } />
)
// Filter revamp
const Filter = () => (
  <Shell focus="editor" activeFile="filter" tabs={mdTab('GROWFILTER_SYNC_ARCH.md')} editor={<Markdown {...FILTER_DOC} />} chat={
    <Chat>
      <UserMsg>every page double-fetches on filter</UserMsg>
      <Claude fresh lines={['onApply fired from an effect →', 'broke under StrictMode. Rebuilt it']} done="15 filter systems → 1" />
    </Chat>
  } />
)
// Bundle opt
const Bundle = () => (
  <Shell focus="editor" activeFile="bundle" tabs={mdTab('BUNDLE_OPTIMIZATION.md')} editor={<Markdown {...BUNDLE_DOC} />} chat={
    <Chat>
      <Claude lines={['Lazy-loaded tiptap + cumul.io', 'Manual chunking on Vite 8']} done="…and a dozen more, in docs/" />
    </Chat>
  } />
)
const Outro = () => (
  <Shell focus="chat" activeFile="backlog" tabs={mdTab('TECH_DEBT.md')} editor={<Markdown {...BACKLOG} />} chat={
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="rise" style={{ '--i': 0, fontFamily: sans, fontSize: 72, fontWeight: 700, color: T.green, letterSpacing: '-0.02em' }}>Shipped.</div>
      <div className="rise" style={{ '--i': 1, ...cbase, color: T.muted, marginTop: 20 }}>React 18 · AntD v6 · Grow RTE</div>
      <div className="rise" style={{ '--i': 2, ...cbase, color: T.muted, marginTop: 6 }}>Filters · and a dozen more</div>
      <div className="rise" style={{ '--i': 3, ...cbase, color: T.faint, marginTop: 20 }}>debt by debt · session by session</div>
      <div className="rise" style={{ '--i': 4, ...cbase, color: T.peach, marginTop: 20 }}>✳ built with Claude Code</div>
    </div>
  } />
)

// accelerando — measured open, tighten through execution, hold the close
export const scenes = [
  { id: 'ask', dur: 4.5, Component: Ask },
  { id: 'analyze', dur: 5, Component: Analyze },
  { id: 'plan', dur: 4.5, Component: Plan },
  { id: 'execute', dur: 4, Component: Execute },
  { id: 'compact', dur: 4, Component: CompactBeat },
  { id: 'handoff', dur: 4.5, Component: Handoff },
  { id: 'new-session', dur: 3.5, Component: NewSession },
  { id: 'antd-plan', dur: 4.5, Component: AntdPlan },
  { id: 'antd-exec', dur: 4.5, Component: AntdExec },
  { id: 'rte', dur: 5, Component: Rte },
  { id: 'tiptap', dur: 5, Component: Tiptap },
  { id: 'filter', dur: 5, Component: Filter },
  { id: 'bundle', dur: 4.5, Component: Bundle },
  { id: 'outro', dur: 5.5, Component: Outro },
]
