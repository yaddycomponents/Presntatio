import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Delta } from '../components/Ticker'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp, growY, growXFade } from '../motion'

const CHART_H = 320
const MAX = 6.07

const bars = [
  { v: 6.07, label: 'Baseline', cause: 'before', color: tokens.data.beforeBar, numColor: tokens.data.beforeNum },
  { v: 4.29, label: 'manualChunks · modulePreload', cause: 'async CSS', color: tokens.data.peach, numColor: tokens.text.muted },
  { v: 2.92, label: 'Highcharts migration · destroyInactiveTabPane', cause: 'lazy charts', color: tokens.data.afterBar, numColor: tokens.data.afterNum, delta: '−52%' },
]

function Bar({ bar, delay }) {
  const h = (bar.v / MAX) * CHART_H
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 150 }}>
      <motion.div {...fadeUp({ delay: delay + 0.3, y: 10 })} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, minHeight: 30 }}>
        <span style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.metric, color: bar.numColor }}>
          <CountUp to={bar.v} decimals={2} suffix=" s" delay={delay + 0.3} duration={1.1} />
        </span>
        {bar.delta && <Delta good delay={delay + 0.9}>{bar.delta}</Delta>}
      </motion.div>

      <motion.div {...growY({ delay })} style={{ width: 96, height: h, background: bar.color, borderRadius: '4px 4px 0 0', transformOrigin: 'bottom' }} />

      <motion.div {...fadeUp({ delay: delay + 0.4, y: 8 })} style={{ marginTop: 14, textAlign: 'center' }}>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: bar.numColor }}>{bar.cause}</div>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 4, maxWidth: 150, lineHeight: 1.35 }}>{bar.label}</div>
      </motion.div>
    </div>
  )
}

export default function BundleScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part B — Largest Contentful Paint</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Time-to-paint, halved</MaskReveal>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 'clamp(30px, 6vw, 90px)', marginTop: '1vw' }}>
        {bars.map((bar, i) => (
          <Bar key={bar.v} bar={bar} delay={0.9 + i * 0.35} />
        ))}
        <motion.div {...growXFade({ delay: 0.8 })} style={{ position: 'absolute', bottom: -2, left: -30, right: -30, height: 2, background: tokens.line, transformOrigin: 'center' }} />
      </div>
    </div>
  )
}
