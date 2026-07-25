import { useEffect, useRef, useState } from 'react'
import { Shell, T, mono, sans } from './Shell'

// The whole film is one continuous Claude Code session inside VS Code. Each scene
// is the same Shell with different interior state — chat streaming, a file/diff
// open, or the terminal running codemods. All figures are real (hei/asgard/gc).

function CountUp({ to, dur = 1000, delay = 300, suffix = '', style }) {
  const [v, setV] = useState(0)
  const raf = useRef(0)
  useEffect(() => {
    let start
    const t = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts
        const p = Math.min(1, (ts - start) / dur)
        setV(Math.round((1 - (1 - p) ** 3) * to))
        if (p < 1) raf.current = requestAnimationFrame(step)
      }
      raf.current = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(raf.current) }
  }, [to, dur, delay])
  return <span style={style}>{v}{suffix}</span>
}

// ── chat primitives ────────────────────────────────────────────────────────
const chatBase = { fontFamily: mono, fontSize: 27, lineHeight: 1.6 }
function User({ children, i = 0 }) {
  return <div className="rise" style={{ '--i': i, ...chatBase, color: T.mauve, marginBottom: 26 }}>{'>'} {children}</div>
}
function Bullet({ children, i, c = T.green }) {
  return (
    <div className="rise" style={{ '--i': i, ...chatBase, color: T.green, marginBottom: 20, display: 'flex', gap: 12 }}>
      <span style={{ color: c }}>●</span><span>{children}</span>
    </div>
  )
}
const B = ({ children }) => <b style={{ color: T.bold }}>{children}</b>
const Code = ({ children }) => <code style={{ background: T.border, color: T.text, borderRadius: 4, padding: '1px 9px', fontFamily: mono }}>{children}</code>
function Meta({ children, i }) {
  return <div className="rise" style={{ '--i': i, ...chatBase, fontSize: 22, color: T.faint, margin: '4px 0 22px' }}>{children}</div>
}

// ── editor interiors ───────────────────────────────────────────────────────
function Welcome() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ fontFamily: sans, fontSize: 60, fontWeight: 700, color: T.faint, letterSpacing: '-0.02em' }}>heisenberg</div>
      <div style={{ fontFamily: mono, fontSize: 24, color: T.faint }}>CRM · CashApps · GrowComponents</div>
    </div>
  )
}

function Markdown({ title, lines }) {
  return (
    <div style={{ padding: '40px 60px', fontFamily: mono, fontSize: 26, lineHeight: 1.7 }}>
      <div className="rise" style={{ '--i': 0, fontSize: 40, fontWeight: 700, color: T.mauve, marginBottom: 28 }}># {title}</div>
      {lines.map((l, idx) => (
        <div key={l.t} className="rise" style={{ '--i': idx + 1, color: l.c ?? T.muted, marginBottom: 14, paddingLeft: l.pad ? 40 : 0 }}>{l.t}</div>
      ))}
    </div>
  )
}

function DiffEditor() {
  const row = (n, txt, kind) => (
    <div style={{ display: 'flex', background: kind === 'del' ? 'rgba(243,139,168,.12)' : kind === 'add' ? 'rgba(166,227,161,.12)' : 'transparent' }}>
      <span style={{ width: 60, textAlign: 'right', paddingRight: 20, color: T.faint }}>{n}</span>
      <span style={{ width: 30, color: kind === 'del' ? T.red : kind === 'add' ? T.green : T.faint }}>{kind === 'del' ? '−' : kind === 'add' ? '+' : ''}</span>
      <span style={{ color: kind === 'del' ? T.red : kind === 'add' ? T.green : T.muted }}>{txt}</span>
    </div>
  )
  return (
    <div className="rise" style={{ '--i': 0, padding: '34px 20px', fontFamily: mono, fontSize: 27, lineHeight: 1.85 }}>
      {row(41, '<div className="tw-flex tw:items-center', 'del')}
      {row(42, '  tw:gap-8 tw:flex-col">', 'del')}
      {row(43, '  <FontAwesomeIcon icon={faUser} />', 'del')}
      {row(44, '</div>', 'del')}
      {row(41, '<GrowFlex align="center" gap="8" vertical>', 'add')}
      {row(42, '  <GrowIcon iconProps={{ icon: faUser }} />', 'add')}
      {row(43, '</GrowFlex>', 'add')}
    </div>
  )
}

function MetricsDoc() {
  const stat = (i, from, to, label, c) => (
    <div className="rise" style={{ '--i': i, flex: 1, padding: '26px 28px', background: T.sunken, borderRadius: 12, border: `1px solid ${T.border}` }}>
      <div style={{ fontFamily: mono, fontSize: 22, color: T.faint }}><span style={{ textDecoration: 'line-through' }}>{from}</span> → <span style={{ color: c, fontWeight: 700 }}>{to}</span></div>
      <div style={{ fontFamily: mono, fontSize: 20, color: T.muted, marginTop: 10 }}>{label}</div>
    </div>
  )
  return (
    <div style={{ padding: '40px 56px', fontFamily: mono }}>
      <div className="rise" style={{ '--i': 0, fontSize: 38, fontWeight: 700, color: T.mauve, marginBottom: 14 }}># New Bundle — Release</div>
      <div className="rise" style={{ '--i': 1, fontSize: 26, color: T.muted, marginBottom: 34 }}>229 commits · <span style={{ color: T.text }}>1,768 files</span> · <span style={{ color: T.green }}>+52.7k</span> / <span style={{ color: T.red }}>−63.1k</span> lines</div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 22 }}>
        {stat(2, '2.19s', '0.755s', 'dashboard load', T.green)}
        {stat(3, '13.0 MB', '2.45 MB', 'transferred', T.teal)}
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        {stat(4, '6.07s', '2.92s', 'largest paint', T.green)}
        {stat(5, 'react 17', '18.3.1', 'framework', T.mauve)}
      </div>
    </div>
  )
}

// ── the 16 shipped, streamed into the chat as a burndown ────────────────────
const DEBTS = [
  'React 18 Upgrade', 'Vite 8 + Rolldown', 'Filter Revamp', 'Charts Revamp',
  'Icon Unification', 'RTE → grow-rte', 'AG Grid Upgrade', 'ESLint → Biome',
  'Load time −65%', 'Comment removal', 'Luzmo removal', 'Dashboard responsive',
  'Assign CO revamp', 'Jotai (CashApps)', 'CashApps re-arch', 'Auth → secrets',
]
function Burndown() {
  return (
    <div>
      <div className="rise" style={{ '--i': 0, ...chatBase, color: T.green, display: 'flex', gap: 12, marginBottom: 22 }}>
        <span>✳</span><span>Closed <B><CountUp to={16} delay={500} /> of 16</B> tracked debts.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 26px' }}>
        {DEBTS.map((d, idx) => (
          <div key={d} className="rise" style={{ '--i': idx + 1, display: 'flex', alignItems: 'center', gap: 12, fontFamily: mono, fontSize: 22, color: T.text }}>
            <span className="pop" style={{ '--i': idx + 1, color: T.green, display: 'inline-block' }}>✓</span> {d}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── beats ──────────────────────────────────────────────────────────────────
const welcomeTabs = [{ name: 'Welcome', active: true, icon: '✳', color: T.peach }]

function Boot() {
  return <Shell focus="chat" tabs={welcomeTabs} editor={<Welcome />}
    chat={<User i={0}>audit the frontend tech debt across CRM, CashApps and the component library — then plan it</User>} />
}

function Plan() {
  return <Shell focus="chat" tabs={welcomeTabs} editor={<Welcome />} chat={
    <>
      <User i={0}>audit the frontend tech debt across all three apps — then plan it</User>
      <Bullet i={1}>Read <B>54</B> docs, mapped <B>24</B> debts across <B>3</B> apps</Bullet>
      <Bullet i={2}><B>16</B> already shipped · <B>8</B> in flight</Bullet>
      <Bullet i={3}>Drafting a phased migration plan…</Bullet>
      <Meta i={4}>Ran 3 shell commands · scanned 1,768 files</Meta>
    </>
  } />
}

function OpenPlan() {
  return <Shell focus="editor" activeFile="redux"
    tabs={[{ name: 'REDUX_MIGRATION_PLAN.md', active: true, dirty: true, icon: '≡', color: T.blue }]}
    editor={<Markdown title="Redux Migration Plan" lines={[
      { t: 'AR Aging · All Customers · Invoice List', c: T.muted },
      { t: '', c: T.muted },
      { t: 'Phase 1 — one page at a time (1 week)', c: T.green },
      { t: '  · replace connect() with Jotai hooks', c: T.muted, pad: true },
      { t: '  · codemod: redux-to-hooks-transform.cjs', c: T.peach, pad: true },
      { t: 'Phase 2 — remaining pages (4–6 weeks)', c: T.teal },
    ]} />}
    chat={
      <>
        <Bullet i={0}>Wrote <Code>REDUX_MIGRATION_PLAN.md</Code></Bullet>
        <Bullet i={1}>Phased — <B>not</B> a big-bang rewrite</Bullet>
        <Meta i={2}>docs/react-18-upgrade/</Meta>
      </>
    } />
}

function DiffBeat() {
  return <Shell focus="editor" activeFile="cm2"
    tabs={[{ name: 'tw-flex-to-growflex.cjs', active: true, dirty: true, icon: '⚙', color: T.peach }]}
    editor={<DiffEditor />}
    chat={
      <>
        <Bullet i={0}>Generated <B>25+</B> codemods</Bullet>
        <Bullet i={1} c={T.peach}><Code>tw-flex</Code> → <Code>GrowFlex</Code></Bullet>
        <Bullet i={2} c={T.peach}><Code>FontAwesome</Code> → <Code>GrowIcon</Code></Bullet>
        <Meta i={3}>one transform, run across the whole repo</Meta>
      </>
    } />
}

function CodemodRun() {
  const l = (i, prompt, txt, c) => (
    <div className="rise" style={{ '--i': i, fontFamily: mono, fontSize: 21, lineHeight: 1.4, marginBottom: 4, whiteSpace: 'nowrap' }}>
      {prompt && <span style={{ color: T.teal }}>{prompt} </span>}<span style={{ color: c }}>{txt}</span>
    </div>
  )
  return <Shell focus="terminal" activeFile="cm1"
    tabs={[{ name: 'tw-flex-to-growflex.cjs', active: true, icon: '⚙', color: T.peach }]}
    editor={<DiffEditor />}
    terminal={
      <>
        {l(0, '$', 'node scripts/transform-fontawesome-to-growicon.cjs', T.text)}
        {l(1, '', '  ✓ FontAwesomeIcon → GrowIcon', T.green)}
        {l(2, '$', 'node scripts/redux-bu-regions-to-hooks-transform.cjs', T.text)}
        {l(3, '', '  ✓ Redux connect → Jotai hooks', T.green)}
        {l(4, '$', 'node scripts/styled-call-transform.cjs', T.text)}
        {l(5, '', '  ✓ styled-components → CSS Modules', T.green)}
        <div className="rise" style={{ '--i': 6, fontFamily: mono, fontSize: 21, marginTop: 10, color: T.peach }}>
          +52.7k / −63.1k <span style={{ color: T.faint }}>· deleted more than we wrote</span>
          <span className="caret" style={{ marginLeft: 10, verticalAlign: 'middle' }} />
        </div>
      </>
    }
    chat={
      <>
        <Bullet i={0}>Running transforms across the repo</Bullet>
        <Bullet i={1}>Applied to <B>1,768</B> files</Bullet>
      </>
    } />
}

function BurndownBeat() {
  return <Shell focus="chat" activeFile="analysis"
    tabs={[{ name: 'UPGRADE_ANALYSIS.md', active: true, icon: '≡', color: T.blue }]}
    editor={<Markdown title="Upgrade Analysis" lines={[
      { t: '24 tracked debts · 16 shipped', c: T.green },
      { t: '3 apps · Oct 2024 → Jul 2026', c: T.muted },
    ]} />}
    chat={<Burndown />} />
}

function Metrics() {
  return <Shell focus="editor" activeFile="analysis"
    tabs={[{ name: 'NEW_BUNDLE_PRESENTATION.md', active: true, icon: '≡', color: T.blue }]}
    editor={<MetricsDoc />}
    chat={
      <>
        <Bullet i={0}>Bundle rebuilt on <B>Vite 8</B></Bullet>
        <Bullet i={1}>Load <B>−65%</B> · transferred <B>−81%</B></Bullet>
        <Meta i={2}>NEW_BUNDLE_PRESENTATION.md</Meta>
      </>
    } />
}

function Outro() {
  return <Shell focus="chat" tabs={welcomeTabs} editor={<Welcome />} chat={
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="rise" style={{ '--i': 0, fontFamily: sans, fontSize: 76, fontWeight: 700, color: T.green, letterSpacing: '-0.02em' }}>Shipped.</div>
      <div className="rise" style={{ '--i': 1, ...chatBase, color: T.muted, marginTop: 22 }}>16 debts · 3 apps · one loop</div>
      <div className="rise" style={{ '--i': 2, ...chatBase, color: T.muted, marginTop: 8 }}>analyzed, planned & codemodded</div>
      <div className="rise" style={{ '--i': 3, ...chatBase, color: T.peach, marginTop: 26 }}>✳ with Claude Code</div>
    </div>
  } />
}

// accelerando — measured open, tighten to the codemod climax, then hold the close
export const scenes = [
  { id: 'boot', dur: 5, Component: Boot },
  { id: 'plan', dur: 5.5, Component: Plan },
  { id: 'open-plan', dur: 5, Component: OpenPlan },
  { id: 'diff', dur: 4.5, Component: DiffBeat },
  { id: 'codemod', dur: 4, Component: CodemodRun },
  { id: 'burndown', dur: 5.5, Component: BurndownBeat },
  { id: 'metrics', dur: 4.5, Component: Metrics },
  { id: 'outro', dur: 5.5, Component: Outro },
]
