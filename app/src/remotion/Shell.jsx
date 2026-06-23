import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { ChevronRight, Search } from 'lucide-react'
import { t } from '../AI Reply/tokens.js'
import { riseS, Sparkle } from './anim.jsx'
import { Bar } from './ui.jsx'

const RAIL = 60
const HEADER = 58
const CUSTOMER = 'Pro Cycle International India'

export function Shell({ section, bg, children }) {
  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'row', background: t.canvas, fontFamily: t.font }}>
      {/* rail */}
      <div style={{ width: RAIL, background: t.rail, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 15, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: t.ai }} />
        <div style={{ height: 6 }} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ width: 24, height: 24, borderRadius: 7, background: i === 1 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)' }} />
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* header */}
        <div style={{ height: HEADER, borderBottom: `1px solid ${t.border}`, background: t.panel, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14, flexShrink: 0, zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            {section && (
              <>
                <span style={{ fontSize: 14, color: t.muted, whiteSpace: 'nowrap' }}>{section}</span>
                <ChevronRight size={15} color={t.faint} />
              </>
            )}
            <span style={{ fontSize: 16, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap' }}>{CUSTOMER}</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 230, height: 32, borderRadius: 9, background: t.panelAlt, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
            <Search size={15} color={t.faint} />
            <Bar w="55%" h={6} lite shimmer={false} />
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.skeleton }} />
        </div>

        {/* content */}
        <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', background: bg ?? t.canvas }}>
          {children}
        </div>
      </div>
    </AbsoluteFill>
  )
}

export function Tab({ active, w = 64, delay = 0 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <Bar w={w} h={9} lite={!active} delay={delay} shimmer={false} />
      {active && <div style={{ width: '100%', height: 2, background: t.primary, borderRadius: 2 }} />}
    </div>
  )
}

export function Dot({ size = 30, color }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: color || t.skeleton, flexShrink: 0 }} />
}

export function Caption({ children, delay = 0 }) {
  const f = useCurrentFrame()
  return (
    <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', borderRadius: 999, background: t.panel, border: `1px solid ${t.border}`, boxShadow: t.shadow, fontSize: 14.5, color: t.muted, whiteSpace: 'nowrap', zIndex: 5, ...riseS(f, delay, 12) }}>
      <Sparkle size={15} delay={delay + 0.1} />
      {children}
    </div>
  )
}
