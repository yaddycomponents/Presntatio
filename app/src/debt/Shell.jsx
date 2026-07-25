// Persistent VS Code frame. Every beat of the film happens inside this — the
// story is a live Claude Code session: explorer + editor + CC chat panel +
// terminal + status bar, always on screen. `focus` brightens one region and
// dims the rest so it stays legible at video scale.

export const T = {
  bg: '#11111B', surface: '#1E1E2E', sunken: '#181825', panel: '#1B1B29',
  border: '#313244', borderHi: '#45475A',
  text: '#CDD6F4', muted: '#A6ADC8', faint: '#6C7086', bold: '#F2F4FF',
  green: '#A6E3A1', red: '#F38BA8', mauve: '#CBA6F7', teal: '#94E2D5',
  peach: '#FAB387', yellow: '#F9E2AF', blue: '#89B4FA',
}
export const mono = "'Fira Code', ui-monospace, monospace"
export const sans = "'IBM Plex Sans', system-ui, sans-serif"

const RAIL = 60
const SIDEBAR = 380
const STATUS = 34
const TOP = 46

function ActivityRail() {
  const icons = ['', '', '', '', '']
  return (
    <div style={{ width: RAIL, background: T.sunken, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 26, flexShrink: 0 }}>
      <div style={{ width: 4, height: 30, background: T.mauve, borderRadius: 3, position: 'absolute', left: 0, marginTop: 2 }} />
      <span style={{ fontFamily: mono, color: T.text, fontSize: 26 }}>▤</span>
      <span style={{ fontFamily: mono, color: T.faint, fontSize: 24 }}>⌕</span>
      <span style={{ fontFamily: mono, color: T.faint, fontSize: 24, position: 'relative' }}>⑂
        <span style={{ position: 'absolute', top: -8, right: -12, background: T.mauve, color: T.bg, fontFamily: mono, fontSize: 13, borderRadius: 9, padding: '1px 6px', fontWeight: 700 }}>10</span>
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
      <span style={{ fontFamily: mono, fontSize: 21, color: active ? T.text : T.muted }}>{children}</span>
      {badge && <span style={{ marginLeft: 'auto', marginRight: 14, color: T.green, fontFamily: mono, fontSize: 16 }}>{badge}</span>}
    </div>
  )
}

function Explorer({ activeFile }) {
  return (
    <div style={{ width: SIDEBAR, background: T.sunken, borderRight: `1px solid ${T.border}`, flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px', fontFamily: sans, fontSize: 16, letterSpacing: '0.14em', color: T.faint, textTransform: 'uppercase' }}>Growfin · 3 repos</div>
      <div style={{ padding: '0 8px', fontFamily: mono }}>
        <Row icon="▾" color={T.mauve} active={activeFile === 'react18' || activeFile === 'antd' || activeFile === 'filter' || activeFile === 'tiptap' || activeFile === 'bundle'}><b style={{ color: T.text }}>heisenberg</b> · crm</Row>
        <Row depth={1} icon="▾" color={T.teal}>docs</Row>
        <Row depth={2} icon="≡" color={T.blue} active={activeFile === 'react18'}>REACT18_UPGRADE_PLAN.md</Row>
        <Row depth={2} icon="≡" color={T.blue} active={activeFile === 'antd'}>ANTD_V6_DEPRECATED_PROPS.md</Row>
        <Row depth={2} icon="≡" color={T.blue} active={activeFile === 'filter'}>GROWFILTER_SYNC_ARCH.md</Row>
        <Row depth={2} icon="≡" color={T.blue} active={activeFile === 'tiptap'}>tiptap-chain-learnings.md</Row>
        <Row depth={2} icon="≡" color={T.blue} active={activeFile === 'bundle'}>BUNDLE_OPTIMIZATION.md</Row>
        <Row depth={1} icon="▸" color={T.peach}>scripts / codemods</Row>
        <Row icon="▾" color={T.mauve} active={activeFile === 'asgard'}><b style={{ color: T.text }}>asgard</b> · cashapps</Row>
        <Row depth={1} icon="≡" color={T.yellow} active={activeFile === 'asgard'}>package.json</Row>
        <Row icon="▾" color={T.mauve} active={activeFile === 'rte'}><b style={{ color: T.text }}>grow-components</b></Row>
        <Row depth={1} icon="▾" color={T.teal}>packages</Row>
        <Row depth={2} icon="⬡" color={T.green} active={activeFile === 'rte'}>grow-rte</Row>
        <Row depth={2} icon="⬡" color={T.faint}>grow-icons</Row>
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

function ClaudePanel({ children, focus }) {
  return (
    <div style={{ width: 820, background: T.bg, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, opacity: focus === 'chat' || !focus ? 1 : 0.42, transition: 'opacity .4s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', height: 56, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <span style={{ color: T.peach, fontSize: 24 }}>✳</span>
        <span style={{ fontFamily: mono, fontSize: 21, color: T.text }}>Claude Code</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: mono, fontSize: 18, color: T.faint }}>◻ ⤢ ×</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '26px 30px' }}>{children}</div>
      <div style={{ borderTop: `1px solid ${T.border}`, padding: '14px 24px', flexShrink: 0 }}>
        <div style={{ fontFamily: mono, fontSize: 18, color: T.faint }}>app <span style={{ color: T.faint }}>(git:main)</span></div>
        <div style={{ fontFamily: mono, fontSize: 18, color: T.peach, marginTop: 6 }}>▸▸ auto-accept edits on <span style={{ color: T.faint }}>(shift+tab to cycle)</span></div>
      </div>
    </div>
  )
}

export function Shell({ activeFile, tabs, editor, terminal, chat, focus }) {
  const dim = (region) => (focus && focus !== region ? 0.3 : 1)
  return (
    <div className="stage" style={{ display: 'flex', flexDirection: 'column', background: T.bg, fontFamily: sans, color: T.text }}>
      {/* top bar */}
      <div style={{ height: TOP, background: T.sunken, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 16, flexShrink: 0 }}>
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
        <div style={{ opacity: dim('explorer'), transition: 'opacity .4s' }}><Explorer activeFile={activeFile} /></div>

        {/* editor column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, opacity: dim('editor'), transition: 'opacity .4s' }}>
          <div style={{ height: 50, background: T.sunken, borderBottom: `1px solid ${T.border}`, display: 'flex', flexShrink: 0 }}>
            {(tabs ?? []).map((t) => <Tab key={t.name} active={t.active} dirty={t.dirty} icon={t.icon} color={t.color}>{t.name}</Tab>)}
          </div>
          <div style={{ flex: 1, background: T.surface, overflow: 'hidden', minHeight: 0 }}>{editor}</div>
          {terminal && (
            <div style={{ height: 320, background: T.bg, borderTop: `1px solid ${T.border}`, flexShrink: 0, opacity: dim('terminal'), transition: 'opacity .4s' }}>
              <div style={{ display: 'flex', gap: 26, padding: '0 24px', height: 44, alignItems: 'center', borderBottom: `1px solid ${T.border}`, fontFamily: sans, fontSize: 17 }}>
                <span style={{ color: T.faint }}>PROBLEMS</span><span style={{ color: T.faint }}>OUTPUT</span>
                <span style={{ color: T.text, borderBottom: `2px solid ${T.mauve}`, paddingBottom: 11 }}>TERMINAL</span>
              </div>
              <div style={{ padding: '18px 24px' }}>{terminal}</div>
            </div>
          )}
        </div>

        <ClaudePanel focus={focus}>{chat}</ClaudePanel>
      </div>

      {/* status bar */}
      <div style={{ height: STATUS, background: T.mauve, color: T.bg, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 20, fontFamily: mono, fontSize: 16, flexShrink: 0 }}>
        <span>⑂ main*</span>
        <span>Jira: yathavan prabhakar</span>
        <div style={{ flex: 1 }} />
        <span>◐ 0 ⚠ 0</span>
        <span>Pro</span>
        <span>Quokka</span>
        <span>▶ Go Live</span>
      </div>
    </div>
  )
}
