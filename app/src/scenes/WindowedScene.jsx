import { motion } from 'framer-motion'
import Skeleton from '../components/Skeleton'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'

const COLS = 2
const ROWS = 4
const TW = 252
const TH = 138
const GAP = 22
const PITCH = TH + GAP
const GRID_W = COLS * TW + (COLS - 1) * GAP
const GRID_H = ROWS * TH + (ROWS - 1) * GAP
const BAND_H = 2 * PITCH - GAP

// each tile activates (fetches) when the viewport band reaches its row
const activateAt = [0.9, 0.9, 1.2, 1.2, 2.5, 2.5, 3.2, 3.2]

function Tile({ i }) {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  const at = activateAt[i]
  return (
    <div style={{ position: 'absolute', left: col * (TW + GAP), top: row * PITCH, width: TW, height: TH }}>
      <motion.div
        initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: at, duration: 0.3 }}
        style={{ position: 'absolute', inset: 0, border: `1.5px dashed ${tokens.line}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: tokens.font.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.text.muted }}
      >
        not fetched
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: at, duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, border: `1.5px solid ${tokens.data.afterNum}`, background: 'rgba(91,125,119,0.06)', borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 11 }}
      >
        <Skeleton w="45%" h={12} delay={at} />
        <Skeleton w="100%" h={38} delay={at} />
        <Skeleton w="65%" h={11} delay={at} />
      </motion.div>
    </div>
  )
}

export default function WindowedScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Experience</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Tiles fetch as you scroll</MaskReveal>

      <div style={{ position: 'relative', width: GRID_W, height: GRID_H, marginTop: '0.6vw' }}>
        {Array.from({ length: COLS * ROWS }).map((_, i) => <Tile key={i} i={i} />)}

        <motion.div
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: [0, 0, 2 * PITCH, 2 * PITCH], opacity: [0, 1, 1, 1] }}
          transition={{ delay: 0.6, duration: 3.0, times: [0, 0.25, 0.85, 1], ease: ease.inOut }}
          style={{ position: 'absolute', left: -10, width: GRID_W + 20, height: BAND_H, border: `2px solid ${tokens.text.primary}`, borderRadius: 12, pointerEvents: 'none' }}
        >
          <span style={{ position: 'absolute', top: -10, right: 10, background: tokens.bg.primary, padding: '0 7px', fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.text.primary }}>viewport</span>
        </motion.div>
      </div>

      <Line delay={3.6} size={tokens.type.label} color={tokens.text.muted}>
        Old: every tile's API fired on load. New: a tile fetches only when it enters view.
      </Line>
    </div>
  )
}
