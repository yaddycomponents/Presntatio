import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeIn, growX } from '../motion'

function Stat({ value, label, delay }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.stat, color: tokens.text.primary, lineHeight: 1 }}>
        <CountUp to={value} delay={delay} duration={1.8} />
      </div>
      <motion.div
        {...fadeIn({ delay: delay + 0.4 })}
        style={{ marginTop: '0.6em', color: tokens.text.eyebrow, fontFamily: tokens.font.mono, letterSpacing: tokens.track.label, textTransform: 'uppercase', fontSize: tokens.type.label }}
      >
        {label}
      </motion.div>
    </div>
  )
}

function CodeBar({ sign, value, barColor, numColor, dir, width, delay }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexDirection: dir === 1 ? 'row' : 'row-reverse' }}>
      <div style={{ width: 150, textAlign: dir === 1 ? 'right' : 'left', color: numColor, fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 'clamp(18px, 2.4vw, 32px)' }}>
        {sign}<CountUp to={value} delay={delay} decimals={1} suffix="k" />
      </div>
      <motion.div
        {...growX({ delay })}
        style={{ height: 28, width, background: barColor, transformOrigin: dir === 1 ? 'left' : 'right', borderRadius: 3 }}
      />
    </div>
  )
}

export default function ScaleScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.4vw' }}>
      <Kicker delay={0.2}>The scope of the change</Kicker>

      <div style={{ display: 'flex', gap: 'clamp(40px, 8vw, 130px)' }}>
        <Stat value={229} label="commits" delay={0.4} />
        <Stat value={1768} label="files changed" delay={0.6} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: '1vw' }}>
        <CodeBar sign="+" value={52.7} barColor={tokens.data.beforeBar} numColor={tokens.text.muted} dir={1} width="clamp(180px, 26vw, 340px)" delay={1.0} />
        <CodeBar sign="−" value={63.1} barColor={tokens.data.afterBar} numColor={tokens.data.afterNum} dir={-1} width="clamp(216px, 31vw, 407px)" delay={1.3} />
      </div>

      <div style={{ marginTop: '0.6vw' }}>
        <MaskReveal delay={1.9} size={tokens.type.h2}>We deleted more than we wrote.</MaskReveal>
      </div>
    </div>
  )
}
