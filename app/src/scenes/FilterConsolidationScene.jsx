import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn } from '../motion'

const CW = 660
const CH = 250
const BW = 150
const BH = 54
const CX = CW / 2
const CY = CH / 2
const UW = 230
const UH = 92

const copies = [
  { x: 8, y: 14, label: 'InvoiceFilter' },
  { x: CX - BW / 2, y: 4, label: 'DisputeFilter' },
  { x: CW - BW - 8, y: 14, label: 'InboxFilter' },
  { x: 8, y: CH - BH - 14, label: 'PaymentFilter' },
  { x: CX - BW / 2, y: CH - BH - 4, label: 'ReportFilter' },
  { x: CW - BW - 8, y: CH - BH - 14, label: 'CustomerFilter' },
]

export default function FilterConsolidationScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Architecture</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>One source of truth</MaskReveal>

      <Line delay={0.7} size={tokens.type.label} color={tokens.text.muted}>
        Fifteen pages had each grown their own filter — a bug meant fifteen fixes.
      </Line>

      <div style={{ position: 'relative', width: CW, height: CH, marginTop: '0.4vw' }}>
        {copies.map((p, i) => {
          const dx = CX - (p.x + BW / 2)
          const dy = CY - (p.y + BH / 2)
          return (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.4], x: [0, 0, 0, dx], y: [0, 0, 0, dy] }}
              transition={{ delay: 1.0 + i * 0.07, duration: 2.8, times: [0, 0.1, 0.45, 1], ease: ease.inOut }}
              style={{ position: 'absolute', left: p.x, top: p.y, width: BW, height: BH, border: `1.5px solid ${tokens.data.beforeNum}`, background: 'rgba(168,83,106,0.08)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: tokens.data.beforeNum }}>{p.label}</span>
            </motion.div>
          )
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.6, duration: 0.8, ease: ease.out }}
          style={{ position: 'absolute', left: CX - UW / 2, top: CY - UH / 2, width: UW, height: UH, border: `2px solid ${tokens.data.afterNum}`, background: 'rgba(91,125,119,0.12)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <span style={{ fontFamily: tokens.font.body, fontWeight: 600, fontSize: tokens.type.rowLabel, color: tokens.data.afterNum }}>GrowFilter</span>
          <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted }}>one config-driven module</span>
        </motion.div>
      </div>

      <motion.div {...fadeIn({ delay: 3.4 })} style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: tokens.font.mono, fontWeight: 700 }}>
        <span style={{ fontSize: tokens.type.metric, color: tokens.data.afterNum }}>
          −<CountUp to={12.2} decimals={1} suffix="k LOC" delay={3.4} duration={1.2} />
        </span>
        <span style={{ fontSize: tokens.type.label, color: tokens.text.muted }}>≈ 65% of the filter layer</span>
      </motion.div>

      <Line delay={4.0} size={tokens.type.label} color={tokens.text.primary}>
        Now a bug is fixed once — and it's fixed on all fifteen.
      </Line>
    </div>
  )
}
