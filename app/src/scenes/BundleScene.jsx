import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Delta } from '../components/Ticker'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp, growY, growXFade } from '../motion'

const CHART_H = 300
const MAX = 6.07
const COLW = 150
const GAP = 'clamp(30px, 6vw, 86px)'

const bars = [
  { v: 6.07, cause: 'before', label: 'Baseline', color: tokens.data.beforeBar, numColor: tokens.data.beforeNum },
  { v: 4.29, cause: 'async CSS', label: 'manualChunks · modulePreload', color: tokens.data.peach, numColor: tokens.text.muted },
  { v: 2.92, cause: 'lazy charts', label: 'Highcharts migration', color: tokens.data.afterBar, numColor: tokens.data.afterNum, delta: '−52%' },
]

function Bar({ bar, delay }) {
  const h = (bar.v / MAX) * CHART_H
  return (
    <div style={{ width: COLW, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ height: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
        <span style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.metric, color: bar.numColor, whiteSpace: 'nowrap' }}>
          <CountUp to={bar.v} decimals={2} suffix=" s" delay={delay + 0.3} duration={1.1} />
        </span>
        {bar.delta && <Delta good delay={delay + 0.9}>{bar.delta}</Delta>}
      </div>
      <motion.div {...growY({ delay })} style={{ width: 96, height: h, background: bar.color, borderRadius: '4px 4px 0 0', transformOrigin: 'bottom' }} />
    </div>
  )
}

function Caption({ bar, delay }) {
  return (
    <motion.div {...fadeUp({ delay, y: 8 })} style={{ width: COLW, textAlign: 'center' }}>
      <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: bar.numColor }}>{bar.cause}</div>
      <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 4, lineHeight: 1.35 }}>{bar.label}</div>
    </motion.div>
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

      <div style={{ marginTop: '1vw' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: GAP }}>
          {bars.map((bar, i) => <Bar key={bar.v} bar={bar} delay={0.9 + i * 0.35} />)}
        </div>

        <motion.div {...growXFade({ delay: 0.8 })} style={{ height: 2, background: tokens.line, transformOrigin: 'center', marginTop: 2 }} />

        <div style={{ display: 'flex', gap: GAP, marginTop: 14 }}>
          {bars.map((bar, i) => <Caption key={bar.v} bar={bar} delay={1.2 + i * 0.35} />)}
        </div>
      </div>
    </div>
  )
}
