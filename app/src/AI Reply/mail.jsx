import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { t } from './tokens'
import { Avatar, Sparkle, rise, fade, pop } from './fx'

function AiAvatar({ size = 42, delay = 0 }) {
  return (
    <motion.div {...pop({ delay })}
      style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(90.14deg, #FFF0F6 0%, #E6F4FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(235,47,150,0.14)' }}>
      <Sparkle size={size * 0.46} delay={delay} />
    </motion.div>
  )
}

// A realistic email-thread panel.
export function Thread({ subject, children, w = 820, delay = 0, style }) {
  return (
    <motion.div {...rise({ delay, y: 26 })}
      style={{ width: w, background: t.panel, borderRadius: t.radius, border: `1px solid ${t.border}`, boxShadow: t.shadow, overflow: 'hidden', ...style }}>
      <div style={{ padding: '20px 28px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: t.ink, letterSpacing: '-0.01em' }}>{subject}</span>
      </div>
      <div style={{ padding: '6px 28px 22px' }}>{children}</div>
    </motion.div>
  )
}

export function Msg({ initials, color, name, time, badge, children, delay = 0, divider = true, ai = false }) {
  return (
    <motion.div {...rise({ delay, y: 16 })}
      style={{ display: 'flex', gap: 16, padding: '20px 0', borderTop: divider ? `1px solid ${t.border}` : 'none' }}>
      {ai ? <AiAvatar size={42} delay={delay} /> : <Avatar initials={initials} color={color} size={42} delay={delay} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: t.ink }}>{name}</span>
          {badge}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: t.faint, whiteSpace: 'nowrap' }}>{time}</span>
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 1.62, color: '#33384a' }}>{children}</div>
      </div>
    </motion.div>
  )
}

// PDF / file attachment chip
export function Attach({ name, delay = 0 }) {
  return (
    <motion.div {...pop({ delay })}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.panelAlt }}>
      <FileText size={17} color={t.muted} strokeWidth={1.7} />
      <span style={{ fontSize: 14, fontWeight: 500, color: t.ink }}>{name}</span>
    </motion.div>
  )
}

// "AI is composing" indicator (animated dots)
export function Composing({ delay = 0 }) {
  return (
    <motion.div {...fade({ delay })} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{ delay: delay + i * 0.15, duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 8, height: 8, borderRadius: '50%', background: t.aiPink }} />
      ))}
    </motion.div>
  )
}

export function Sent({ label = 'Sent automatically', delay = 0 }) {
  return (
    <motion.div {...pop({ delay })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: t.good }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={t.good} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 L9 17 L4 12" /></svg>
      {label}
    </motion.div>
  )
}
