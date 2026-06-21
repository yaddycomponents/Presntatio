import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn, popIn } from '../motion'

const COLS = 7
const ROWS = 8
const CELL = 20
const GAP = 4
const SIZE = COLS * CELL + (COLS - 1) * GAP // ~ 188
const chunkColors = [tokens.data.afterBar, tokens.data.peach, tokens.data.mint, tokens.data.sageDeep || tokens.data.afterNum]

function Side({ children, label, value, valueColor, caption, captionColor, delay }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: SIZE + 40 }}>
      {children}
      <motion.div {...fadeIn({ delay })} style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>{label}</div>
        <div style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.metric, color: valueColor, marginTop: 2 }}>{value}</div>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: captionColor, marginTop: 8 }}>{caption}</div>
      </motion.div>
    </div>
  )
}

export default function MonolithScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.8vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Architecture</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Monolith → Code-Split</MaskReveal>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(20px, 4vw, 60px)', marginTop: '0.6vw' }}>
        <Side label="Production · 18 files" value="13 MB" valueColor={tokens.data.beforeNum} caption="everything, eager" captionColor={tokens.text.muted} delay={1.0}>
          <motion.div {...popIn({ delay: 0.7 })} style={{ width: SIZE, height: SIZE, background: 'rgba(168,83,106,0.16)', border: `2px solid ${tokens.data.beforeNum}`, borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: tokens.data.beforeNum }}>vendor-*.js</span>
            <span style={{ fontFamily: tokens.font.mono, fontSize: 12, color: tokens.data.beforeNum }}>index-*.js</span>
          </motion.div>
        </Side>

        <motion.div {...fadeIn({ delay: 1.2 })} style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.metric, color: tokens.text.muted }}>→</motion.div>

        <Side label="New Bundle · 55 chunks" value="2.6 MB" valueColor={tokens.data.afterNum} caption="loaded on demand" captionColor={tokens.data.afterNum} delay={2.6}>
          <div style={{ width: SIZE, height: SIZE, display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gridAutoRows: `${CELL}px`, gap: GAP, alignContent: 'start' }}>
            {Array.from({ length: COLS * ROWS }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.018, duration: 0.3, ease: ease.out }}
                style={{ width: CELL, height: CELL, borderRadius: 3, background: chunkColors[i % chunkColors.length] }}
              />
            ))}
          </div>
        </Side>
      </div>

      <Line delay={3.2} size={tokens.type.label} color={tokens.text.muted}>
        Split by route & feature — heavy libraries isolated into cache-stable chunks.
      </Line>
    </div>
  )
}
