import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn, popIn } from '../motion'

const CW = 600
const CH = 260
const BW = 120
const BH = 58
const CX = (CW - BW) / 2
const CY = (CH - BH) / 2

const positions = [
  { x: 20, y: 18 }, { x: 240, y: 8 }, { x: 460, y: 18 },
  { x: 20, y: 184 }, { x: 240, y: 194 }, { x: 460, y: 184 },
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
        {positions.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.3], x: [0, 0, 0, CX - p.x], y: [0, 0, 0, CY - p.y] }}
            transition={{ delay: 0.7 + i * 0.08, duration: 2.4, times: [0, 0.18, 0.6, 1], ease: ease.inOut }}
            style={{ position: 'absolute', left: p.x, top: p.y, width: BW, height: BH, border: `1.5px solid ${tokens.data.beforeNum}`, background: 'rgba(168,83,106,0.08)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span style={{ fontFamily: tokens.font.mono, fontSize: 10, color: tokens.data.beforeNum }}>filter copy</span>
          </motion.div>
        ))}

        <motion.div
          {...popIn({ delay: 2.6 })}
          style={{ position: 'absolute', left: CX - 10, top: CY - 10, width: BW + 20, height: BH + 20, border: `2px solid ${tokens.data.afterNum}`, background: 'rgba(91,125,119,0.12)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
        >
          <span style={{ fontFamily: tokens.font.body, fontWeight: 600, fontSize: tokens.type.label, color: tokens.data.afterNum }}>GrowFilter</span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: 10, color: tokens.text.muted }}>one module · variant prop</span>
        </motion.div>
      </div>

      <motion.div {...fadeIn({ delay: 3.0 })} style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: tokens.font.mono, fontWeight: 700 }}>
        <span style={{ fontSize: tokens.type.metric, color: tokens.data.afterNum }}>
          −<CountUp to={12.2} decimals={1} suffix="k LOC" delay={3.0} duration={1.2} />
        </span>
        <span style={{ fontSize: tokens.type.label, color: tokens.text.muted }}>≈ 65% of the filter layer</span>
      </motion.div>

      <Line delay={3.6} size={tokens.type.label} color={tokens.text.muted}>
        Fix a filter bug once — fixed across all fifteen pages.
      </Line>
    </div>
  )
}
