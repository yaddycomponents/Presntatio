import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { t, ease, dur, spring } from './tokens'

// ── motion presets ───────────────────────────────────────────────
export const fade = ({ delay = 0, d = dur.base } = {}) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: d, ease: ease.out },
})

export const rise = ({ delay = 0, y = 18, d = dur.base } = {}) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: d, ease: ease.out },
})

export const pop = ({ delay = 0 } = {}) => ({
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { delay, ...spring.pop },
})

// ── AI sparkle mark (gradient four-point star) ───────────────────
let sparkN = 0
export function Sparkle({ size = 18, delay = 0, color }) {
  const id = `spk${sparkN++}`
  const fill = color || `url(#${id})`
  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" {...pop({ delay })}
      style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.aiPink} />
          <stop offset="100%" stopColor={t.aiBlue} />
        </linearGradient>
      </defs>
      <path d="M12 1.5 L14 9 L21.5 11 L14 13 L12 20.5 L10 13 L2.5 11 L10 9 Z" fill={fill} />
      <path d="M19 3 L19.8 5.6 L22.5 6.5 L19.8 7.4 L19 10 L18.2 7.4 L15.5 6.5 L18.2 5.6 Z" fill={fill} opacity={0.85} />
    </motion.svg>
  )
}

// ── gradient text (AI emphasis) ──────────────────────────────────
export function Grad({ children, style }) {
  return (
    <span style={{ background: t.ai, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent', ...style }}>
      {children}
    </span>
  )
}

// ── AI badge pill ────────────────────────────────────────────────
export function AiBadge({ label = 'AI Replied', delay = 0, size = 12 }) {
  return (
    <motion.span {...pop({ delay })}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: t.aiSoft, border: '1px solid rgba(235,47,150,0.18)' }}>
      <Sparkle size={size + 2} delay={delay} />
      <Grad style={{ fontFamily: t.font, fontSize: size, fontWeight: 600, letterSpacing: '0.01em' }}>{label}</Grad>
    </motion.span>
  )
}

// ── grey skeleton bar with shimmer ───────────────────────────────
export function Bar({ w = '100%', h = 10, r = 7, delay = 0, lite = false, shimmer = true }) {
  return (
    <motion.div {...fade({ delay, d: 0.5 })}
      style={{ position: 'relative', width: w, height: h, borderRadius: r, background: lite ? t.skeletonLite : t.skeleton, overflow: 'hidden' }}>
      {shimmer && (
        <motion.div
          initial={{ x: '-100%' }} animate={{ x: '200%' }}
          transition={{ delay, duration: 1.9, repeat: Infinity, ease: ease.inOut }}
          style={{ position: 'absolute', top: 0, bottom: 0, width: '60%', background: `linear-gradient(90deg, transparent, ${t.shimmer} 50%, transparent)` }}
        />
      )}
    </motion.div>
  )
}

// ── avatar ───────────────────────────────────────────────────────
export function Avatar({ initials, color = t.primary, size = 34, delay = 0 }) {
  return (
    <motion.div {...pop({ delay })}
      style={{ width: size, height: size, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.font, fontSize: size * 0.36, fontWeight: 600, flexShrink: 0 }}>
      {initials}
    </motion.div>
  )
}

// ── animated toggle ──────────────────────────────────────────────
export function Toggle({ on = true, delay = 0, w = 38, h = 22 }) {
  const knob = h - 8
  return (
    <motion.div
      initial={{ backgroundColor: '#d5d8df' }}
      animate={{ backgroundColor: on ? t.primary : '#d5d8df' }}
      transition={{ delay, duration: 0.3 }}
      style={{ width: w, height: h, borderRadius: 999, padding: 4, display: 'flex', flexShrink: 0 }}>
      <motion.div
        initial={{ x: 0 }} animate={{ x: on ? w - h : 0 }}
        transition={{ delay, ...spring.snappy }}
        style={{ width: knob, height: knob, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
    </motion.div>
  )
}

// ── count-up (animates on mount) ─────────────────────────────────
export function Count({ to, from = 0, decimals = 0, prefix = '', suffix = '', delay = 0, d = 1.5, style }) {
  const mv = useMotionValue(from)
  const text = useTransform(mv, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`)
  useEffect(() => {
    const c = animate(mv, to, { delay, duration: d, ease: ease.out })
    return c.stop
  }, [to, delay, d, mv])
  return <motion.span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{text}</motion.span>
}

// ── pill / chip ──────────────────────────────────────────────────
export function Chip({ children, delay = 0, tone = 'muted' }) {
  const tones = {
    muted: { c: t.muted, bg: '#f1f2f5', b: t.border },
    primary: { c: t.primary, bg: t.primarySoft, b: t.primaryLine },
    good: { c: t.good, bg: t.goodSoft, b: 'transparent' },
    danger: { c: t.danger, bg: t.dangerSoft, b: 'transparent' },
    warn: { c: t.warn, bg: t.warnSoft, b: 'transparent' },
  }[tone]
  return (
    <motion.span {...pop({ delay })}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, fontFamily: t.font, fontSize: 13, fontWeight: 600, color: tones.c, background: tones.bg, border: `1px solid ${tones.b}` }}>
      {children}
    </motion.span>
  )
}

// ── mask reveal (text rises from behind a clip) ──────────────────
export function Mask({ children, delay = 0, d = 0.85, style }) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.12em', margin: '-0.12em 0' }}>
      <motion.span style={{ display: 'inline-block', ...style }}
        initial={{ y: '115%' }} animate={{ y: '0%' }} transition={{ delay, duration: d, ease: ease.out }}>
        {children}
      </motion.span>
    </span>
  )
}

// ── ambient backdrop (dot grid + drifting gradient orbs) ─────────
export function Backdrop({ dark = false }) {
  const dot = dark ? 'rgba(255,255,255,0.06)' : 'rgba(24,20,45,0.05)'
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`, backgroundSize: '26px 26px', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at center, black 35%, transparent 80%)', maskImage: 'radial-gradient(ellipse 70% 60% at center, black 35%, transparent 80%)' }} />
      <motion.div animate={{ x: [0, 44, 0], y: [0, -28, 0] }} transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-14%', left: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(235,47,150,0.12), transparent 62%)', filter: 'blur(18px)' }} />
      <motion.div animate={{ x: [0, -52, 0], y: [0, 30, 0] }} transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: '-16%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,57,196,0.12), transparent 62%)', filter: 'blur(18px)' }} />
    </div>
  )
}

// ── premium card: gradient hairline option, layered depth ────────
export function Panel({ children, delay = 0, w, accent = false, gradientBorder = false, style, y = 24 }) {
  const inner = (
    <motion.div {...rise({ delay, y })}
      style={{ position: 'relative', width: gradientBorder ? '100%' : w, height: '100%', background: t.panel, borderRadius: t.radius - (gradientBorder ? 1 : 0), border: gradientBorder ? 'none' : `1px solid ${t.border}`, boxShadow: t.shadow, overflow: 'hidden', ...style }}>
      {accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.ai }} />}
      {children}
    </motion.div>
  )
  if (!gradientBorder) return inner
  return (
    <motion.div {...rise({ delay, y })}
      style={{ width: w, borderRadius: t.radius + 1, padding: 1.5, background: t.ai, boxShadow: t.shadow }}>
      <div style={{ position: 'relative', background: t.panel, borderRadius: t.radius, overflow: 'hidden', ...style }}>
        {accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: t.ai }} />}
        {children}
      </div>
    </motion.div>
  )
}

// ── soft icon chip (rounded square w/ tinted bg) ─────────────────
export function IconChip({ children, delay = 0, tone = 'ai', size = 40 }) {
  const bg = tone === 'ai' ? t.aiSoft : tone === 'primary' ? t.primarySoft : '#f1f2f5'
  return (
    <motion.div {...pop({ delay })}
      style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {children}
    </motion.div>
  )
}

// ── eyebrow label ────────────────────────────────────────────────
export function Eyebrow({ children, delay = 0 }) {
  return (
    <motion.div {...rise({ delay, y: 10 })}
      style={{ fontFamily: t.mono, fontSize: 'clamp(10px,0.95vw,13px)', letterSpacing: '0.32em', textTransform: 'uppercase', color: t.muted, display: 'flex', alignItems: 'center', gap: 10 }}>
      {children}
    </motion.div>
  )
}
