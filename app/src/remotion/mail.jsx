import { useCurrentFrame } from 'remotion'
import { FileText } from 'lucide-react'
import { t } from '../AI Reply/tokens.js'
import { sec, riseS, fadeS, popS, pulse, Sparkle } from './anim.jsx'
import { Avatar } from './ui.jsx'

function AiAvatar({ size = 42, delay = 0 }) {
  const f = useCurrentFrame()
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(90.14deg, #FFF0F6 0%, #E6F4FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(235,47,150,0.14)', ...popS(f, delay) }}>
      <Sparkle size={size * 0.46} delay={delay} />
    </div>
  )
}

export function Thread({ subject, children, w = 820, delay = 0, style }) {
  const f = useCurrentFrame()
  return (
    <div style={{ width: w, background: t.panel, borderRadius: t.radius, border: `1px solid ${t.border}`, boxShadow: t.shadow, overflow: 'hidden', ...riseS(f, delay, 26), ...style }}>
      <div style={{ padding: '20px 28px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{subject}</span>
      </div>
      <div style={{ padding: '6px 28px 22px' }}>{children}</div>
    </div>
  )
}

export function Msg({ initials, color, name, time, badge, children, delay = 0, divider = true, ai = false }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', gap: 16, padding: '20px 0', borderTop: divider ? `1px solid ${t.border}` : 'none', ...riseS(f, delay, 16) }}>
      {ai ? <AiAvatar size={42} delay={delay} /> : <Avatar initials={initials} color={color} size={42} delay={delay} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: t.ink }}>{name}</span>
          {badge}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: t.faint, whiteSpace: 'nowrap' }}>{time}</span>
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 1.62, color: '#33384a' }}>{children}</div>
      </div>
    </div>
  )
}

export function Attach({ name, delay = 0 }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.panelAlt, ...popS(f, delay) }}>
      <FileText size={17} color={t.muted} strokeWidth={1.7} />
      <span style={{ fontSize: 14, fontWeight: 500, color: t.ink }}>{name}</span>
    </div>
  )
}

export function Composing({ delay = 0 }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, ...fadeS(f, delay) }}>
      {[0, 1, 2].map((i) => {
        const p = pulse(f, delay + i * 0.15, 0.9)
        return <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: t.aiPink, opacity: 0.25 + 0.75 * p, transform: `translateY(${-3 * p}px)` }} />
      })}
    </div>
  )
}

export function Sent({ label = 'Sent automatically', delay = 0 }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: t.good, ...popS(f, delay) }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={t.good} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 L9 17 L4 12" /></svg>
      {label}
    </div>
  )
}
