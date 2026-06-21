import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn } from '../motion'

const CW = 620
const CH = 270
const BW = 120
const BH = 56
const CX = CW / 2
const CY = CH / 2
const UW = 220
const UH = 96

const positions = [
  { x: 24, y: 16 }, { x: CX - BW / 2, y: 6 }, { x: CW - BW - 24, y: 16 },
  { x: 24, y: CH - BH - 16 }, { x: CX - BW / 2, y: CH - BH - 6 }, { x: CW - BW - 24, y: CH - BH - 16 },
]

export default function FilterConsolidationScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part D — One system, fifteen pages</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Six copies become one</MaskReveal>

      <div style={{ position: 'relative', width: CW, height: CH, marginTop: '0.5vw' }}>
        {positions.map((p, i) => {
          const dx = CX - (p.x + BW / 2)
          const dy = CY - (p.y + BH / 2)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.45], x: [0, 0, 0, dx], y: [0, 0, 0, dy] }}
              transition={{ delay: 0.6 + i * 0.07, duration: 2.6, times: [0, 0.1, 0.42, 1], ease: ease.inOut }}
              style={{ position: 'absolute', left: p.x, top: p.y, width: BW, height: BH, border: `1.5px solid ${tokens.data.beforeNum}`, background: 'rgba(168,83,106,0.08)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontFamily: tokens.font.mono, fontSize: 10, color: tokens.data.beforeNum }}>filter copy</span>
            </motion.div>
          )
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.3, duration: 0.8, ease: ease.out }}
          style={{ position: 'absolute', left: CX - UW / 2, top: CY - UH / 2, width: UW, height: UH, border: `2px solid ${tokens.data.afterNum}`, background: 'rgba(91,125,119,0.12)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <span style={{ fontFamily: tokens.font.body, fontWeight: 600, fontSize: tokens.type.rowLabel, color: tokens.data.afterNum }}>GrowFilter</span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted }}>one shared module</span>
        </motion.div>
      </div>

      <motion.div {...fadeIn({ delay: 3.2 })} style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: tokens.font.mono, fontWeight: 700 }}>
        <span style={{ fontSize: tokens.type.metric, color: tokens.data.afterNum }}>
          −<CountUp to={12.2} decimals={1} suffix="k LOC" delay={3.2} duration={1.2} />
        </span>
        <span style={{ fontSize: tokens.type.label, color: tokens.text.muted }}>≈ 65% of the filter layer</span>
      </motion.div>

      <Line delay={3.8} size={tokens.type.label} color={tokens.text.muted}>
        Fix a filter bug once — fixed across all fifteen pages.
      </Line>
    </div>
  )
}
