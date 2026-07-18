import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import Skeleton from '../components/Skeleton'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeUp, fadeIn, popIn } from '../motion'

const FRAME_W = 880
const FRAME_H = 460
const RAIL = 62
const ICON = 26
const ICON_X = RAIL / 2
const ICON_TOP = 60
const ICON_PITCH = 46
const HOVER_I = 3
const HOVER_Y = ICON_TOP + HOVER_I * ICON_PITCH

const ZOOM = 1.5
const T_ZOOM = 1.5
const T_HOVER = 3.1
const T_PANEL = 3.5
const T_ROW = 3.75
const ROW_STEP = 0.17
const ROW_FILL = 0.75

const bundles = ['collection-activities', 'inbox', 'Form', 'useUpdateRead', 'Antd', 'shared-utils']
const navItems = ['dashboard', 'customers', 'invoices', 'inbox', 'aging', 'reports', 'settings']

const railEdge = ICON_X + (RAIL - ICON_X) * ZOOM
const PANEL_X = railEdge + 26
const PANEL_Y = HOVER_Y - 96

function NavIcon({ i }) {
  const active = i === HOVER_I
  return (
    <div style={{ position: 'absolute', left: ICON_X - ICON / 2, top: ICON_TOP + i * ICON_PITCH - ICON / 2, width: ICON, height: ICON }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 7, background: 'rgba(246,234,217,0.28)' }} />
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: T_HOVER, duration: 0.3 }}
          style={{ position: 'absolute', inset: -5, borderRadius: 9, background: tokens.data.mint, boxShadow: `0 0 0 2px ${tokens.data.afterNum}` }}
        />
      )}
    </div>
  )
}

function BundleRow({ name, i }) {
  const at = T_ROW + i * ROW_STEP
  return (
    <motion.div
      {...fadeUp({ delay: at, y: 6, duration: 0.4 })}
      style={{ display: 'grid', gridTemplateColumns: '150px 96px 14px', alignItems: 'center', columnGap: 12 }}
    >
      <span style={{ fontFamily: tokens.font.mono, fontSize: 11.5, color: tokens.text.primary, whiteSpace: 'nowrap' }}>{name}</span>

      <div style={{ position: 'relative', height: 6, borderRadius: 3, background: 'rgba(94,59,70,0.12)', overflow: 'hidden' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: at + 0.1, duration: ROW_FILL, ease: ease.inOut }}
          style={{ position: 'absolute', inset: 0, background: tokens.data.afterBar, borderRadius: 3, transformOrigin: 'left' }}
        />
      </div>

      <motion.svg
        {...fadeIn({ delay: at + 0.1 + ROW_FILL, duration: 0.25 })}
        width="14" height="14" viewBox="0 0 14 14" fill="none" role="img"
      >
        <title>cached</title>
        <path d="M2.5 7.5 L5.6 10.5 L11.5 3.8" stroke={tokens.data.afterNum} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  )
}

function Cursor() {
  return (
    <motion.svg
      width="20" height="24" viewBox="0 0 20 24" fill="none"
      initial={{ x: 300, y: 330, opacity: 0 }}
      animate={{ x: [300, 300, ICON_X + 5, ICON_X + 5], y: [330, 330, HOVER_Y + 6, HOVER_Y + 6], opacity: [0, 1, 1, 1] }}
      transition={{ delay: 2.2, duration: 1.1, times: [0, 0.12, 0.85, 1], ease: ease.inOut }}
      style={{ position: 'absolute', left: 0, top: 0, zIndex: 6, filter: 'drop-shadow(0 2px 3px rgba(94,59,70,0.35))' }}
      role="img"
    >
      <title>pointer</title>
      <path d="M2 1 L2 17.5 L6.4 13.6 L9.3 20.4 L12.2 19.1 L9.3 12.6 L15 12.4 Z" fill={tokens.bg.primary} stroke={tokens.text.primary} strokeWidth="1.6" strokeLinejoin="round" />
    </motion.svg>
  )
}

export default function PrefetchScene() {
  const done = T_ROW + (bundles.length - 1) * ROW_STEP + 0.1 + ROW_FILL

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Navigation</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Hover now, load nothing later</MaskReveal>

      <motion.div
        {...fadeIn({ delay: 0.7 })}
        style={{ position: 'relative', width: FRAME_W, height: FRAME_H, marginTop: '0.5vw', borderRadius: 14, border: `1.5px solid ${tokens.line}`, background: tokens.bg.primary, overflow: 'hidden', boxShadow: '0 18px 44px rgba(94,59,70,0.14)' }}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1, ZOOM, ZOOM] }}
          transition={{ delay: T_ZOOM, duration: 1.4, times: [0, 0.08, 0.72, 1], ease: ease.inOut }}
          style={{ position: 'absolute', inset: 0, transformOrigin: `${ICON_X}px ${HOVER_Y}px` }}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: RAIL, background: tokens.text.primary }}>
            <div style={{ position: 'absolute', left: ICON_X - 9, top: 22, width: 18, height: 18, borderRadius: 5, background: tokens.bg.title }} />
            {navItems.map((n, i) => <NavIcon key={n} i={i} />)}
          </div>

          <div style={{ position: 'absolute', left: RAIL, right: 0, top: 0, bottom: 0, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Skeleton w={190} h={16} delay={0.9} />
              <div style={{ flex: 1 }} />
              <Skeleton w={72} h={22} delay={0.95} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ border: `1.5px solid ${tokens.line}`, borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <Skeleton w="55%" h={9} delay={1 + i * 0.05} />
                  <Skeleton w="80%" h={22} delay={1.05 + i * 0.05} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1, border: `1.5px solid ${tokens.line}`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} w={`${88 - i * 7}%`} h={12} delay={1.15 + i * 0.05} />)}
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeIn({ delay: T_ZOOM + 0.5, duration: 0.5 })}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(244,231,214,0) 22%, rgba(244,231,214,0.82) 62%)', pointerEvents: 'none' }}
        />

        <Cursor />

        <motion.div
          {...popIn({ delay: T_PANEL, fromScale: 0.94 })}
          style={{ position: 'absolute', left: PANEL_X, top: PANEL_Y, zIndex: 5, background: tokens.bg.primary, border: `1.5px solid ${tokens.text.primary}`, borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 11, boxShadow: '0 14px 34px rgba(94,59,70,0.2)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 2 }}>
            <Diamond size={7} color={tokens.data.afterNum} delay={T_PANEL + 0.1} />
            <span style={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.data.afterNum }}>
              prefetching · inbox
            </span>
          </div>

          {bundles.map((b, i) => <BundleRow key={b} name={b} i={i} />)}

          <motion.div
            {...fadeUp({ delay: done + 0.2, y: 6, duration: 0.4 })}
            style={{ marginTop: 3, paddingTop: 10, borderTop: `1px solid ${tokens.line}`, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span style={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>
              api calls fired
            </span>
            <span style={{ fontFamily: tokens.font.mono, fontSize: 15, color: tokens.data.afterNum }}>0</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: '0.6vw' }}>
        <Line delay={done + 0.5} size={tokens.type.rowLabel} color={tokens.text.primary}>
          Hovering a nav item downloads that page's bundles in the background.
        </Line>
        <Line delay={done + 0.8} size={tokens.type.label} color={tokens.text.muted}>
          Assets only — business APIs still wait until you actually open the page.
        </Line>
      </div>
    </div>
  )
}
