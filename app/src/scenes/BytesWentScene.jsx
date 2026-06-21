import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp, growY } from '../motion'

const CHART_H = 240
const BARW = 54

const groups = [
  { label: 'Bytes transferred', unit: ' MB', dec: 1, before: 13.2, after: 2.6 },
  { label: 'JavaScript shipped', unit: ' MB', dec: 1, before: 19.9, after: 9.0 },
  { label: 'Requests on load', unit: '', dec: 0, before: 48, after: 21 },
]

function Bar({ v, max, unit, dec, color, delay }) {
  const h = (v / max) * CHART_H
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: BARW + 18 }}>
      <div style={{ height: 38, display: 'flex', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.label, color, whiteSpace: 'nowrap' }}>
          <CountUp to={v} decimals={dec} suffix={unit} delay={delay + 0.3} duration={1.1} />
        </span>
      </div>
      <motion.div {...growY({ delay })} style={{ width: BARW, height: h, background: color, borderRadius: '4px 4px 0 0', transformOrigin: 'bottom' }} />
    </div>
  )
}

function Group({ g, delay }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <Bar v={g.before} max={g.before} unit={g.unit} dec={g.dec} color={tokens.data.beforeBar} delay={delay} />
        <Bar v={g.after} max={g.before} unit={g.unit} dec={g.dec} color={tokens.data.afterBar} delay={delay + 0.25} />
      </div>
      <div style={{ height: 2, width: 2 * BARW + 30, background: tokens.line, marginTop: 2 }} />
      <motion.div {...fadeUp({ delay: delay + 0.5, y: 6 })} style={{ marginTop: 12, fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted, textAlign: 'center' }}>
        {g.label}
      </motion.div>
    </div>
  )
}

export default function BytesWentScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Payoff · Where it went</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Every line moves one way</MaskReveal>

      <div style={{ display: 'flex', gap: 'clamp(40px, 7vw, 100px)', marginTop: '1vw' }}>
        {groups.map((g, i) => (
          <Group key={g.label} g={g} delay={0.9 + i * 0.3} />
        ))}
      </div>
    </div>
  )
}
