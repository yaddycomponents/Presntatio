import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn, popIn } from '../motion'

const COLS = 7
const ROWS = 8
const CELL = 20
const STEP = 24
const MONO = 188
const GRID_W = COLS * CELL + (COLS - 1) * (STEP - CELL)
const W = MONO + 140 + GRID_W
const H = MONO
const GRID_X = W - GRID_W
const MONO_CX = MONO / 2
const chunkColors = [tokens.data.afterBar, tokens.data.peach, tokens.data.mint, tokens.data.afterNum]

export default function MonolithScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Architecture</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Monolith → Code-Split</MaskReveal>

      <div style={{ position: 'relative', width: W, height: H, marginTop: '0.6vw' }}>
        <motion.div
          {...popIn({ delay: 0.6 })}
          animate={{ opacity: 1, scale: 1, backgroundColor: ['rgba(168,83,106,0.16)', 'rgba(168,83,106,0.16)', 'rgba(168,83,106,0.04)'] }}
          transition={{ backgroundColor: { delay: 1.4, duration: 1.0 } }}
          style={{ position: 'absolute', left: 0, top: 0, width: MONO, height: MONO, border: `2px solid ${tokens.data.beforeNum}`, borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}
        >
          <motion.span animate={{ opacity: [0, 1, 1, 0.25] }} transition={{ delay: 0.8, duration: 1.6, times: [0, 0.2, 0.6, 1] }} style={{ fontFamily: tokens.font.mono, fontSize: 12, color: tokens.data.beforeNum }}>vendor-*.js</motion.span>
          <motion.span animate={{ opacity: [0, 1, 1, 0.25] }} transition={{ delay: 0.9, duration: 1.6, times: [0, 0.2, 0.6, 1] }} style={{ fontFamily: tokens.font.mono, fontSize: 12, color: tokens.data.beforeNum }}>index-*.js</motion.span>
        </motion.div>

        <motion.div {...fadeIn({ delay: 1.2 })} style={{ position: 'absolute', left: MONO + 50, top: H / 2 - 12, fontFamily: tokens.font.mono, fontSize: tokens.type.metric, color: tokens.text.muted }}>→</motion.div>

        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const col = i % COLS
          const row = Math.floor(i / COLS)
          const tx = GRID_X + col * STEP
          const ty = row * STEP
          return (
            <motion.div
              key={i}
              initial={{ x: MONO_CX - tx, y: MONO_CX - ty, opacity: 0, scale: 0.3 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.016, duration: 0.6, ease: ease.out }}
              style={{ position: 'absolute', left: tx, top: ty, width: CELL, height: CELL, borderRadius: 3, background: chunkColors[(col + row) % chunkColors.length] }}
            />
          )
        })}
      </div>

      <div style={{ display: 'flex', width: W, marginTop: '0.4vw' }}>
        <div style={{ width: MONO, textAlign: 'center' }}>
          <motion.div {...fadeIn({ delay: 1.0 })}>
            <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>dev-master · eager boot</div>
            <div style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.metric, color: tokens.data.beforeNum, marginTop: 2 }}>7.7 MB gz</div>
          </motion.div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ width: GRID_W + 30, textAlign: 'center' }}>
          <motion.div {...fadeIn({ delay: 2.8 })}>
            <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>new-bundle · 249 chunks</div>
            <div style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.metric, color: tokens.data.afterNum, marginTop: 2 }}>1.2 MB gz</div>
          </motion.div>
        </div>
      </div>

      <Line delay={3.2} size={tokens.type.label} color={tokens.text.muted}>
        Split by route & feature — an 8.5× smaller boot graph (−85%), loaded on demand.
      </Line>
    </div>
  )
}
