import { motion } from 'framer-motion'
import { ChevronRight, Search } from 'lucide-react'
import { t, ease } from './tokens'
import { Bar, Sparkle } from './fx'

const RAIL = 60
const HEADER = 58
const CUSTOMER = 'Pro Cycle International India'

// Persistent product shell — the whole film plays inside this (rail + header).
export function AppShell({ section, bg, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', background: t.canvas, fontFamily: t.font }}>
      {/* dark rail */}
      <div style={{ width: RAIL, background: t.rail, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 15, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: t.ai }} />
        <div style={{ height: 6 }} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ width: 24, height: 24, borderRadius: 7, background: i === 1 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)' }} />
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* header — customer name */}
        <div style={{ height: HEADER, borderBottom: `1px solid ${t.border}`, background: t.panel, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14, flexShrink: 0, zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
            {section && (
              <>
                <span style={{ fontSize: 14, color: t.muted, whiteSpace: 'nowrap' }}>{section}</span>
                <ChevronRight size={15} color={t.faint} />
              </>
            )}
            <span style={{ fontSize: 16, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{CUSTOMER}</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ width: 230, height: 32, borderRadius: 9, background: t.panelAlt, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
            <Search size={15} color={t.faint} />
            <Bar w="55%" h={6} lite shimmer={false} />
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.skeleton }} />
        </div>

        {/* content area — scenes render here */}
        <motion.div animate={{ backgroundColor: bg ?? t.canvas }} transition={{ duration: 0.5, ease: ease.soft }}
          style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {children}
        </motion.div>
      </div>
    </div>
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

// floating narration caption (bottom-center of content area)
export function Caption({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6, ease: ease.out }}
      style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', borderRadius: 999, background: t.panel, border: `1px solid ${t.border}`, boxShadow: t.shadow, fontSize: 14.5, color: t.muted, whiteSpace: 'nowrap', zIndex: 5 }}>
      <Sparkle size={15} delay={delay + 0.1} />
      {children}
    </motion.div>
  )
}
