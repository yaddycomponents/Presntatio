import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { ReceiptText, FileText, FileSpreadsheet, Landmark, Files, MessagesSquare, Bold, Italic, Underline, List, Link2, Table, X } from 'lucide-react'
import { t } from '../../AI Reply/tokens.js'
import { Grad, fadeS, riseS, popS } from '../anim.jsx'
import { Bar, Toggle } from '../ui.jsx'
import { Caption } from '../Shell.jsx'

const themes = [
  { Icon: ReceiptText, on: true }, { Icon: FileText, on: true }, { Icon: FileSpreadsheet, on: true },
  { Icon: Landmark, on: true, active: true }, { Icon: Files, on: true }, { Icon: MessagesSquare, on: true },
]
const toolbarIcons = [Bold, Italic, Underline, List, Link2, Table]

function ThemeRow({ Icon, on, active, delay }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 12, border: `1px solid ${active ? t.primaryLine : t.border}`, background: active ? t.primarySoft : t.panel, ...fadeS(f, delay) }}>
      <span style={{ width: 32, height: 32, borderRadius: 9, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} color={t.primary} strokeWidth={1.8} />
      </span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Bar w="62%" h={8} delay={delay} shimmer={false} />
        <Bar w="86%" h={6} lite delay={delay} shimmer={false} />
      </div>
      <Toggle on={on} delay={delay} w={32} h={18} />
    </div>
  )
}

function Token({ children, delay }) {
  const f = useCurrentFrame()
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 7, background: 'rgba(29,57,196,0.09)', color: t.aiBlue, fontSize: 14.5, fontWeight: 500, verticalAlign: 'middle', ...popS(f, delay) }}>
      {children}<X size={12} strokeWidth={2.2} />
    </span>
  )
}

function HL({ children }) {
  return <span style={{ background: 'rgba(29,57,196,0.10)', borderRadius: 5, padding: '1px 5px', color: t.aiBlue, fontWeight: 600 }}>{children}</span>
}

export const TemplatesR = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: 300, borderRight: `1px solid ${t.border}`, padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {themes.map((th, i) => <ThemeRow key={i} {...th} delay={0.5 + i * 0.07} />)}
      </div>

      <div style={{ flex: 1, padding: '26px 34px', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
        <span style={{ fontSize: 19, fontWeight: 600, color: t.ink }}>Content of the Template</span>
        <span style={{ fontSize: 13, color: t.muted }}>Body</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '12px 16px', border: `1px solid ${t.border}`, borderRadius: 10, background: t.panelAlt, ...fadeS(f, 0.7) }}>
          {toolbarIcons.map((Ic, i) => <Ic key={i} size={16} color={t.muted} strokeWidth={2} />)}
        </div>
        <div style={{ flex: 1, border: `1px solid ${t.border}`, borderRadius: 12, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18, fontSize: 15.5, color: '#33384a', lineHeight: 1.7, ...riseS(f, 0.9, 12) }}>
          <div>Hello <Token delay={1.2}>Primary Contact Name</Token></div>
          <div>Please find attached the <Token delay={1.5}>document type</Token>.</div>
          <div>Let us know if you need anything else.</div>
          <div><Token delay={1.9}>Org signature</Token></div>
        </div>
      </div>

      <div style={{ width: 360, borderLeft: `1px solid ${t.border}`, background: t.canvas, padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: t.ink }}>Preview</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...fadeS(f, 2.3) }}>
          <span style={{ fontSize: 12, color: t.faint }}>Subject</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: t.ink }}>Requested invoice — INV-12345</span>
        </div>
        <div style={{ fontSize: 14.5, color: '#33384a', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: 14, ...fadeS(f, 2.5) }}>
          <div>Hi <HL>William</HL>,</div>
          <div>Please find attached the requested invoice: <HL>INV-12345</HL>. Let us know if you need anything else.</div>
          <div style={{ color: t.muted, fontSize: 13.5 }}>Finance Team<br />TI Cycles</div>
        </div>
      </div>

      <Caption delay={3.0}>Each theme is a <Grad style={{ fontWeight: 600 }}>template you control</Grad> — placeholders fill themselves</Caption>
    </AbsoluteFill>
  )
}
