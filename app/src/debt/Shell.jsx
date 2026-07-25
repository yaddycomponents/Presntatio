import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Typewriter — reveals `text` char by char on mount (real rAF clock). Used for
// the input prompt and for md files as Claude writes them.
export function Type({ text, cps = 42, start = 0, caret = true, style }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf
    let t0 = null
    const tick = (ts) => {
      if (t0 === null) t0 = ts
      const el = (ts - t0) / 1000 - start
      const c = el <= 0 ? 0 : Math.floor(el * cps)
      setN(Math.min(text.length, c))
      if (c < text.length) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, cps, start])
  return <span style={style}>{text.slice(0, n)}{caret && n > 0 && n < text.length && <span className="caret" style={{ verticalAlign: 'middle', marginLeft: 1 }} />}</span>
}

// Persistent VS Code frame. Every beat of the film happens inside this — the
// story is a live Claude Code session: explorer + editor + CC chat panel +
// terminal + status bar, always on screen. `focus` brightens one region and
// dims the rest so it stays legible at video scale.

// Catppuccin Frappé — verified against the real settings.json. Do not substitute
// Mocha hexes. --term-green (#00FD61) is the real terminal.foreground override:
// terminal panel output + cursor ONLY, never chat or UI.
export const T = {
  bg: '#232634', surface: '#303446', sunken: '#292C3C', panel: '#292C3C',
  border: '#414559', borderHi: '#51576D',
  text: '#C6D0F5', muted: '#A5ADCE', faint: '#838BA7', bold: '#EEF2FF',
  green: '#A6D189', red: '#E78284', mauve: '#CA9EE6', teal: '#81C8BE',
  peach: '#EF9F76', yellow: '#E5C890', blue: '#8CAAEE', termGreen: '#00FD61',
}
// editor/diff = Monaspace Neon; terminal + chat + UI = FiraCode Nerd Font Mono
export const code = "'Monaspace Neon', 'Fira Code', ui-monospace, monospace"
export const mono = "'FiraCode Nerd Font Mono', 'Fira Code', ui-monospace, monospace"
export const sans = "'IBM Plex Sans', system-ui, sans-serif"

const RAIL = 60
const SIDEBAR = 380
const TOP = 46

function ActivityRail() {
  return (
    <div style={{ width: RAIL, background: T.sunken, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 26, flexShrink: 0 }}>
      <div style={{ width: 4, height: 30, background: T.mauve, borderRadius: 3, position: 'absolute', left: 0, marginTop: 2 }} />
      <span style={{ fontFamily: mono, color: T.text, fontSize: 26 }}>▤</span>
      <span style={{ fontFamily: mono, color: T.faint, fontSize: 24 }}>⌕</span>
      <span style={{ fontFamily: mono, color: T.faint, fontSize: 24, position: 'relative' }}>⑂
        <span style={{ position: 'absolute', top: -8, right: -14, background: T.mauve, color: T.bg, fontFamily: mono, fontSize: 12, borderRadius: 9, padding: '1px 6px', fontWeight: 700 }}>1.7k</span>
      </span>
      <span style={{ color: T.peach, fontSize: 24 }}>✳</span>
      <div style={{ flex: 1 }} />
      <span style={{ fontFamily: mono, color: T.faint, fontSize: 24, marginBottom: 18 }}>⚙</span>
    </div>
  )
}

function Row({ depth = 0, icon, color = T.muted, children, active, badge, dim }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 0', paddingLeft: 14 + depth * 22, background: active ? 'rgba(203,166,247,0.12)' : 'transparent', borderRadius: 6, opacity: dim ? 0.4 : 1 }}>
      {icon && <span style={{ color, fontFamily: mono, fontSize: 18, width: 18, textAlign: 'center' }}>{icon}</span>}
      <span style={{ fontFamily: mono, fontSize: 20, color: active ? T.text : T.muted }}>{children}</span>
      {badge && <span style={{ marginLeft: 'auto', marginRight: 14, color: T.green, fontFamily: mono, fontSize: 16 }}>{badge}</span>}
    </div>
  )
}

// docs Claude WRITES during the session — they appear (green · "U" untracked)
// only once created, so the tree grows as the story does.
const CREATED_DOCS = [
  ['react18', 'REACT18_UPGRADE_PLAN.md'],
  ['antdplan', 'ANTD_V6_MIGRATION.md'],
  ['tiptap', 'tiptap-chain-learnings.md'],
  ['filtermap', 'GROWFILTER_LEGACY_CLEANUP.md'],
  ['rteplan', 'GROW_RTE_PLAN.md'],
  ['handoff', 'CONTEXT_HANDOFF.md'],
]

function Explorer({ activeFile, created }) {
  const c = created ?? new Set()
  return (
    <div style={{ width: SIDEBAR, background: T.sunken, borderRight: `1px solid ${T.border}`, flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px', fontFamily: sans, fontSize: 16, letterSpacing: '0.14em', color: T.faint, textTransform: 'uppercase' }}>Growfin · 3 repos</div>
      <div style={{ padding: '0 8px', fontFamily: mono }}>
        <Row icon="▾" color={T.mauve}><b style={{ color: T.text }}>heisenberg</b> · crm</Row>
        <Row depth={1} icon="▾" color={T.teal}>docs / react-18-upgrade</Row>
        {/* pre-existing docs Claude reads */}
        <Row depth={2} icon="≡" color={T.blue}>REACT18_USEEFFECT_AUDIT.md</Row>
        <Row depth={2} icon="≡" color={T.blue} active={activeFile === 'antd'}>ANTD_V6_DEPRECATED_PROPS.md</Row>
        <Row depth={2} icon="≡" color={T.blue} active={activeFile === 'filter'}>GROWFILTER_SYNC_ARCH.md</Row>
        {/* docs written this session — appear as new once created */}
        {CREATED_DOCS.filter(([k]) => c.has(k)).map(([k, label]) => (
          <Row key={k} depth={2} icon="≡" color={T.green} active={activeFile === k} badge="U">{label}</Row>
        ))}
        <Row depth={2} icon="≡" color={T.faint}>+ 50 more</Row>
        <Row depth={1} icon="▾" color={T.peach}>scripts / codemods</Row>
        <Row depth={2} icon="⚙" color={T.peach} active={activeFile === 'antd'}>antd-deprecated-props.cjs</Row>
        <Row depth={2} icon="⚙" color={T.peach} active={activeFile === 'styled'}>styled-call-transform.cjs</Row>
        <Row depth={2} icon="⚙" color={T.faint}>+ 27 more</Row>
        <Row icon="▾" color={T.mauve} active={activeFile === 'asgard'}><b style={{ color: T.text }}>asgard</b> · cashapps</Row>
        <Row depth={1} icon="≡" color={T.yellow}>package.json</Row>
        <Row icon="▾" color={T.mauve}><b style={{ color: T.text }}>grow-components</b></Row>
        <Row depth={1} icon="⬡" color={T.green} active={activeFile === 'rte' || activeFile === 'bundle'}>packages / grow-rte</Row>
        <Row depth={1} icon="⬡" color={T.faint}>packages / grow-icons</Row>
      </div>
    </div>
  )
}

function Tab({ children, active, dirty, icon, color = T.blue }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', height: '100%', background: active ? T.surface : 'transparent', borderRight: `1px solid ${T.border}`, borderTop: active ? `2px solid ${T.mauve}` : '2px solid transparent' }}>
      <span style={{ color, fontFamily: mono, fontSize: 18 }}>{icon}</span>
      <span style={{ fontFamily: mono, fontSize: 20, color: active ? T.text : T.faint }}>{children}</span>
      {dirty ? <span style={{ width: 10, height: 10, borderRadius: '50%', background: T.text }} /> : <span style={{ color: T.faint, fontSize: 20 }}>×</span>}
    </div>
  )
}

const CHAT_W = 900

function ScrollTranscript({ children }) {
  const outer = useRef(null)
  const inner = useRef(null)
  const [y, setY] = useState(0)
  useLayoutEffect(() => {
    const sh = inner.current?.scrollHeight ?? 0
    const ch = outer.current?.clientHeight ?? 0
    setY(Math.max(0, sh - ch)) // keep the newest turn pinned to the bottom
  })
  return (
    <div ref={outer} style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative', fontFamily: mono }}>
      <div ref={inner} style={{ position: 'absolute', left: 0, right: 0, top: 0, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 14, transform: `translateY(${-y}px)` }}>
        {children}
      </div>
    </div>
  )
}

function Banner() {
  return (
    <div className="rise" style={{ flex: 1, minHeight: 0, padding: '34px 32px', display: 'flex', flexDirection: 'column', fontFamily: mono }}>
      <div style={{ display: 'flex', gap: 22 }}>
        <pre style={{ margin: 0, color: T.peach, fontSize: 22, lineHeight: 1.15, fontFamily: mono }}>{` ▐▛███▜▌\n▝▜█████▛▘\n  ▘▘ ▝▝`}</pre>
        <div style={{ fontSize: 20, lineHeight: 1.5, alignSelf: 'center' }}>
          <div style={{ color: T.text }}>Claude Code <span style={{ color: T.faint }}>v2.1.220</span></div>
          <div style={{ color: T.muted }}>Opus 4.8 <span style={{ color: T.faint }}>(1M context)</span></div>
          <div style={{ color: T.muted }}>Claude Max</div>
          <div style={{ color: T.faint }}>~/Growfin/heisenberg</div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ color: T.faint, fontSize: 18 }}>◐ medium · <span style={{ color: T.mauve }}>/effort</span></div>
      <div style={{ height: 1, background: T.border, margin: '14px 0' }} />
    </div>
  )
}

function ClaudePanel({ children, input, working, splash, accent, context }) {
  return (
    <div style={{ width: CHAT_W, background: T.bg, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, opacity: accent ? 1 : 0.82, transition: 'opacity .35s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 32px', height: 56, borderBottom: `1px solid ${T.border}`, borderTop: `2px solid ${accent ? T.mauve : 'transparent'}`, flexShrink: 0, transition: 'border-color .35s' }}>
        <span style={{ color: T.peach, fontSize: 24 }}>✳</span>
        <span style={{ fontFamily: mono, fontSize: 19, color: T.text }}>Claude Code</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: mono, fontSize: 18, color: T.faint }}>◻ ⤢ ×</span>
      </div>
      {/* one continuous transcript: top-anchored when short, auto-scrolled to the
          bottom once it overflows — like a real Claude Code session */}
      {splash ? <Banner /> : <ScrollTranscript>{children}</ScrollTranscript>}
      {working && (
        <div className="pulse" style={{ padding: '0 32px 4px', flexShrink: 0, fontFamily: mono, fontSize: 15 }}>
          <span style={{ color: T.peach }}>✳ {working.split('(')[0].trim()}</span>{' '}
          <span style={{ color: T.faint }}>{working.includes('(') ? `(${working.split('(').slice(1).join('(')}` : ''}</span>
        </div>
      )}
      {/* the real input box + context-left indicator bottom-right */}
      <div style={{ padding: '12px 24px 0', flexShrink: 0 }}>
        <div style={{ border: `1px solid ${T.borderHi}`, borderRadius: 12, padding: '14px 18px', minHeight: 26, display: 'flex', gap: 10, fontFamily: mono, fontSize: 18, color: T.green }}>
          <span>❯</span>
          {input != null ? <Type text={input} cps={38} /> : (working ? <span style={{ color: T.faint }} /> : <span className="caret" style={{ verticalAlign: 'middle' }} />)}
        </div>
        {context != null && (
          <div style={{ textAlign: 'right', fontFamily: mono, fontSize: 13, color: context <= 10 ? T.yellow : T.faint, paddingTop: 5, paddingRight: 2 }}>
            {context}% context left
          </div>
        )}
      </div>
      <div style={{ padding: '10px 32px 14px', flexShrink: 0 }}>
        <div style={{ fontFamily: mono, fontSize: 16, color: T.green }}>heisenberg <span style={{ color: T.faint }}>(git:new-bundle)</span></div>
        <div style={{ fontFamily: mono, fontSize: 16, color: T.peach, marginTop: 6 }}>▸▸ auto-accept edits on <span style={{ color: T.faint }}>(shift+tab to cycle)</span></div>
      </div>
    </div>
  )
}

export function Shell({ activeFile, created, tabs, editor, terminal, chat, focus, input, working, splash, context }) {
  // Claude pane is the spine — it never dims below readable. Only the two context
  // regions (editor / terminal) dim when they're not the primary, and the primary
  // gets a mauve top accent so it's unambiguous which one to watch.
  const editorPrimary = focus === 'editor'
  const chatPrimary = focus === 'chat' || !focus
  const accent = (on) => (on ? T.mauve : 'transparent')
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column', background: T.bg, fontFamily: sans, color: T.text }}>
      {/* top bar */}
      <div style={{ height: TOP, background: T.sunken, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 16, flexShrink: 0 }}>
        {/* macOS traffic lights — the red one is the close target at ~(28,23) */}
        <div style={{ display: 'flex', gap: 9, marginRight: 6 }}>
          <span id="tl-close" style={{ width: 14, height: 14, borderRadius: '50%', background: '#ED6A5E' }} />
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#F4BF4F' }} />
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#61C554' }} />
        </div>
        <div style={{ display: 'flex', background: T.panel, borderRadius: 8, overflow: 'hidden', fontFamily: sans, fontSize: 17 }}>
          <span style={{ padding: '5px 16px', color: T.faint }}>Agent</span>
          <span style={{ padding: '5px 16px', background: T.border, color: T.text }}>Editor</span>
        </div>
        <div style={{ flex: 1, maxWidth: 620, margin: '0 auto', background: T.panel, borderRadius: 8, padding: '6px 16px', fontFamily: sans, fontSize: 17, color: T.faint, textAlign: 'center' }}>heisenberg — Claude Code</div>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.mauve, color: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans, fontWeight: 700, fontSize: 16 }}>YP</div>
      </div>

      {/* body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <ActivityRail />
        <Explorer activeFile={activeFile} created={created} />

        {/* editor column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, opacity: editorPrimary || chatPrimary ? 1 : 0.55, transition: 'opacity .35s' }}>
          <div style={{ height: 50, background: T.sunken, borderBottom: `1px solid ${T.border}`, borderTop: `2px solid ${accent(editorPrimary)}`, display: 'flex', flexShrink: 0, transition: 'border-color .35s' }}>
            {(tabs ?? []).map((t) => <Tab key={t.name} active={t.active} dirty={t.dirty} icon={t.icon} color={t.color}>{t.name}</Tab>)}
          </div>
          <div style={{ flex: 1, background: T.surface, overflow: 'hidden', minHeight: 0 }}>{editor}</div>
          {terminal && (
            <div style={{ height: 320, background: T.bg, borderTop: `2px solid ${accent(focus === 'terminal')}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 26, padding: '0 24px', height: 44, alignItems: 'center', borderBottom: `1px solid ${T.border}`, fontFamily: sans, fontSize: 17 }}>
                <span style={{ color: T.faint }}>PROBLEMS</span><span style={{ color: T.faint }}>OUTPUT</span>
                <span style={{ color: T.text, borderBottom: `2px solid ${T.mauve}`, paddingBottom: 11 }}>TERMINAL</span>
              </div>
              <div style={{ padding: '18px 24px' }}>{terminal}</div>
            </div>
          )}
        </div>

        <ClaudePanel focus={focus} input={input} working={working} splash={splash} accent={chatPrimary} context={context}>{chat}</ClaudePanel>
      </div>

      {/* status bar — surface, not a glowing mauve band; accent only active items */}
      <div style={{ height: 44, background: T.surface, borderTop: `1px solid ${T.border}`, color: T.muted, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 22, fontFamily: mono, fontSize: 20, flexShrink: 0 }}>
        <span style={{ color: T.mauve }}>⑂ new-bundle</span>
        <span>Jira: yathavan prabhakar</span>
        <div style={{ flex: 1 }} />
        <span>◐ 0 ⚠ 0</span>
        <span>Pro</span>
        <span style={{ color: T.teal }}>▶ Go Live</span>
      </div>
    </div>
  )
}
