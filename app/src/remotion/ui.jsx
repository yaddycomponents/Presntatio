import { useCurrentFrame, interpolate, interpolateColors, spring } from 'remotion'
import { t } from '../AI Reply/tokens.js'
import { FPS, sec, popS, riseS, fadeS, countText, Sparkle, Grad } from './anim.jsx'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

export function Bar({ w = '100%', h = 10, r = 7, delay = 0, lite = false, shimmer = true }) {
  const f = useCurrentFrame()
  const op = interpolate(f, [sec(delay), sec(delay + 0.5)], [0, 1], clamp)
  const period = sec(1.9)
  const x = shimmer && f >= sec(delay) ? interpolate((f - sec(delay)) % period, [0, period], [-100, 200]) : -200
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: r, background: lite ? t.skeletonLite : t.skeleton, overflow: 'hidden', opacity: op, flexShrink: 0 }}>
      {shimmer && <div style={{ position: 'absolute', top: 0, bottom: 0, width: '60%', transform: `translateX(${x}%)`, background: `linear-gradient(90deg, transparent, ${t.shimmer} 50%, transparent)` }} />}
    </div>
  )
}

export function Avatar({ initials, color = t.primary, size = 34, delay = 0 }) {
  const f = useCurrentFrame()
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.font, fontSize: size * 0.36, fontWeight: 600, flexShrink: 0, ...popS(f, delay) }}>
      {initials}
    </div>
  )
}

export function AiBadge({ label = 'AI Replied', delay = 0, size = 12 }) {
  const f = useCurrentFrame()
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: t.aiSoft, border: '1px solid rgba(235,47,150,0.18)', ...popS(f, delay) }}>
      <Sparkle size={size + 2} delay={delay} />
      <Grad style={{ fontFamily: t.font, fontSize: size, fontWeight: 600, letterSpacing: '0.01em' }}>{label}</Grad>
    </span>
  )
}

export function Toggle({ on = true, delay = 0, w = 38, h = 22 }) {
  const f = useCurrentFrame()
  const knob = h - 8
  const s = on ? spring({ frame: f - sec(delay), fps: FPS, config: { stiffness: 420, damping: 26 } }) : 0
  const bg = interpolateColors(s, [0, 1], ['#d5d8df', t.primary])
  return (
    <div style={{ width: w, height: h, borderRadius: 999, padding: 4, display: 'flex', flexShrink: 0, backgroundColor: bg }}>
      <div style={{ width: knob, height: knob, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transform: `translateX(${s * (w - h)}px)` }} />
    </div>
  )
}

export function Count({ to, from = 0, decimals = 0, prefix = '', suffix = '', delay = 0, d = 1.5, style }) {
  const f = useCurrentFrame()
  return <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{countText(f, from, to, delay, d, { prefix, suffix, decimals })}</span>
}

export function Chip({ children, delay = 0, tone = 'muted' }) {
  const f = useCurrentFrame()
  const tones = {
    muted: { c: t.muted, bg: '#f1f2f5', b: t.border },
    primary: { c: t.primary, bg: t.primarySoft, b: t.primaryLine },
    good: { c: t.good, bg: t.goodSoft, b: 'transparent' },
    danger: { c: t.danger, bg: t.dangerSoft, b: 'transparent' },
    warn: { c: t.warn, bg: t.warnSoft, b: 'transparent' },
  }[tone]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, fontFamily: t.font, fontSize: 13, fontWeight: 600, color: tones.c, background: tones.bg, border: `1px solid ${tones.b}`, ...popS(f, delay) }}>
      {children}
    </span>
  )
}

export function Eyebrow({ children, delay = 0 }) {
  const f = useCurrentFrame()
  return (
    <div style={{ fontFamily: t.mono, fontSize: 'clamp(10px,0.95vw,13px)', letterSpacing: '0.32em', textTransform: 'uppercase', color: t.muted, display: 'flex', alignItems: 'center', gap: 10, ...riseS(f, delay, 10) }}>
      {children}
    </div>
  )
}

export function IconChip({ children, delay = 0, tone = 'ai', size = 40 }) {
  const f = useCurrentFrame()
  const bg = tone === 'ai' ? t.aiSoft : tone === 'primary' ? t.primarySoft : '#f1f2f5'
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...popS(f, delay) }}>
      {children}
    </div>
  )
}

export function Panel({ children, delay = 0, w, accent = false, style, y = 24 }) {
  const f = useCurrentFrame()
  return (
    <div style={{ position: 'relative', width: w, height: '100%', background: t.panel, borderRadius: t.radius, border: `1px solid ${t.border}`, boxShadow: t.shadow, overflow: 'hidden', ...riseS(f, delay, y), ...style }}>
      {accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.ai }} />}
      {children}
    </div>
  )
}
