import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeUp, fadeIn, popIn } from '../motion'

const PANEL_W = 860
const ROW_H = 66
const OLD_S = 104
const NEW_S = 15
const RACE = 2.6
const T_START = 1.1
const NEW_RACE = RACE * (NEW_S / OLD_S)
const T_DONE = T_START + RACE

const fmt = (s) => {
  const m = Math.floor(s / 60)
  const r = Math.round(s % 60)
  return m > 0 ? `${m}m ${r}s` : `${r}s`
}

function Row({ label, seconds, race, color, delay, dim }) {
  return (
    <motion.div
      {...fadeUp({ delay: delay - 0.3, y: 10, duration: 0.5 })}
      style={{ position: 'relative', height: ROW_H, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14, background: dim ? 'rgba(246,234,217,0.05)' : 'rgba(246,234,217,0.1)', borderRadius: 10, overflow: 'hidden' }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration: race, ease: 'linear' }}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: color, opacity: 0.22, transformOrigin: 'left' }}
      />

      <motion.svg
        {...popIn({ delay: delay + race })}
        width="18" height="18" viewBox="0 0 18 18" fill="none" role="img"
      >
        <title>done</title>
        <circle cx="9" cy="9" r="8" fill={color} />
        <path d="M5 9.2 L7.8 12 L13 6.4" stroke={tokens.text.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>

      <span style={{ position: 'relative', fontFamily: tokens.font.mono, fontSize: 15, color: tokens.text.onDark }}>
        Build React App
      </span>

      <span style={{ position: 'relative', fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.onDarkMuted }}>
        {label}
      </span>

      <div style={{ flex: 1 }} />

      <motion.span
        {...fadeIn({ delay: delay - 0.1, duration: 0.3 })}
        style={{ position: 'relative', fontFamily: tokens.font.mono, fontSize: 20, fontWeight: 700, color }}
      >
        <CountUp to={seconds} duration={race} delay={delay} formatter={fmt} />
      </motion.span>
    </motion.div>
  )
}

export default function BuildTimeScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Payoff · Shipping speed</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Every build, seven times sooner</MaskReveal>

      <motion.div
        {...fadeIn({ delay: 0.7 })}
        style={{ width: PANEL_W, marginTop: '0.6vw', padding: 20, borderRadius: 14, background: tokens.text.primary, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 18px 44px rgba(94,59,70,0.22)' }}
      >
        <Row label="before" seconds={OLD_S} race={RACE} color={tokens.data.beforeBar} delay={T_START} dim />
        <Row label="after" seconds={NEW_S} race={NEW_RACE} color={tokens.data.afterBar} delay={T_START} />
      </motion.div>

      <motion.div
        {...popIn({ delay: T_DONE + 0.3, fromScale: 0.9 })}
        style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: '0.4vw' }}
      >
        <span style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.stat, color: tokens.data.afterNum }}>
          <CountUp to={7} delay={T_DONE + 0.3} duration={0.9} suffix="×" />
        </span>
        <span style={{ fontFamily: tokens.font.body, fontSize: tokens.type.rowLabel, color: tokens.text.primary }}>
          faster CI builds
        </span>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <Line delay={T_DONE + 0.8} size={tokens.type.rowLabel} color={tokens.text.primary}>
          1m 44s → 15s. Ninety seconds back on every single push.
        </Line>
        <Line delay={T_DONE + 1.1} size={tokens.type.label} color={tokens.text.muted}>
          Faster CI means tighter review loops, quicker hotfixes, and less waiting to ship.
        </Line>
      </div>
    </div>
  )
}
