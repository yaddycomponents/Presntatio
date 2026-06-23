import { interpolate, spring, Easing, useCurrentFrame } from 'remotion'
import { t } from '../AI Reply/tokens.js'

export const FPS = 30
export const sec = (s) => Math.round(s * FPS)

export const EASE_OUT = Easing.bezier(0.22, 1, 0.36, 1)
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1)
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

// All delays/durations below are in SECONDS (converted to frames internally),
// so ported scene code keeps the same timing literals as the Framer version.

export const fadeS = (f, delay = 0, dur = 0.5) => ({
  opacity: interpolate(f, [sec(delay), sec(delay + dur)], [0, 1], { ...clamp, easing: EASE_OUT }),
})

export const riseS = (f, delay = 0, y = 18, dur = 0.7) => {
  const p = interpolate(f, [sec(delay), sec(delay + dur)], [0, 1], { ...clamp, easing: EASE_OUT })
  return { opacity: p, transform: `translateY(${(1 - p) * y}px)` }
}

export const popS = (f, delay = 0) => {
  const s = spring({ frame: f - sec(delay), fps: FPS, config: { stiffness: 300, damping: 22 } })
  const o = interpolate(f, [sec(delay), sec(delay) + 5], [0, 1], clamp)
  return { opacity: o, transform: `scale(${0.9 + 0.1 * s})` }
}

export const growXS = (f, delay = 0, dur = 0.75) => ({
  opacity: interpolate(f, [sec(delay), sec(delay + 0.25)], [0, 1], clamp),
  transform: `scaleX(${interpolate(f, [sec(delay), sec(delay + dur)], [0, 1], { ...clamp, easing: EASE_OUT })})`,
  transformOrigin: 'center',
})

// pulsing loop helper (period in seconds) → 0..1..0
export const pulse = (f, delay = 0, period = 1.6) => {
  const x = ((f - sec(delay)) % sec(period)) / sec(period)
  return f < sec(delay) ? 0 : Math.sin(x * Math.PI)
}

export const countText = (f, from, to, delay = 0, dur = 1.5, { prefix = '', suffix = '', decimals = 0 } = {}) => {
  const v = interpolate(f, [sec(delay), sec(delay + dur)], [from, to], { ...clamp, easing: EASE_OUT })
  return `${prefix}${v.toFixed(decimals)}${suffix}`
}

// ── components ───────────────────────────────────────────────────
let sparkN = 0
export function Sparkle({ size = 18, color, delay = 0 }) {
  const f = useCurrentFrame()
  const id = `rspk${sparkN++}`
  const fill = color || `url(#${id})`
  const s = spring({ frame: f - sec(delay), fps: FPS, config: { stiffness: 300, damping: 22 } })
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0, transform: `scale(${Math.max(0, s)})` }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.aiPink} />
          <stop offset="100%" stopColor={t.aiBlue} />
        </linearGradient>
      </defs>
      <path d="M12 1.5 L14 9 L21.5 11 L14 13 L12 20.5 L10 13 L2.5 11 L10 9 Z" fill={fill} />
      <path d="M19 3 L19.8 5.6 L22.5 6.5 L19.8 7.4 L19 10 L18.2 7.4 L15.5 6.5 L18.2 5.6 Z" fill={fill} opacity={0.85} />
    </svg>
  )
}

export function Grad({ children, style }) {
  return (
    <span style={{ background: t.ai, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', ...style }}>{children}</span>
  )
}

export function Mask({ delay = 0, dur = 0.85, style, children }) {
  const f = useCurrentFrame()
  const p = interpolate(f, [sec(delay), sec(delay + dur)], [0, 1], { ...clamp, easing: EASE_OUT })
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.12em', margin: '-0.12em 0' }}>
      <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 115}%)`, ...style }}>{children}</span>
    </span>
  )
}

export function Backdrop({ dark = false }) {
  const f = useCurrentFrame()
  const dot = dark ? 'rgba(255,255,255,0.06)' : 'rgba(24,20,45,0.05)'
  const ax = Math.sin(f / 90) * 40, ay = Math.cos(f / 110) * 26
  const bx = Math.sin(f / 120 + 2) * -46, by = Math.cos(f / 100 + 1) * 28
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`, backgroundSize: '26px 26px', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at center, black 35%, transparent 80%)', maskImage: 'radial-gradient(ellipse 70% 60% at center, black 35%, transparent 80%)' }} />
      <div style={{ position: 'absolute', top: '-14%', left: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(235,47,150,0.12), transparent 62%)', filter: 'blur(18px)', transform: `translate(${ax}px, ${ay}px)` }} />
      <div style={{ position: 'absolute', bottom: '-16%', right: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,57,196,0.12), transparent 62%)', filter: 'blur(18px)', transform: `translate(${bx}px, ${by}px)` }} />
    </div>
  )
}
