import { motion } from 'framer-motion'
import Glyph from '../components/Glyph'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp } from '../motion'

const pains = [
  { icon: 'light', title: 'A 13 MB download on every visit', why: 'The app shipped its whole world up front' },
  { icon: 'paint', title: 'Six seconds to first meaningful paint', why: 'Users waited, and felt every second' },
  { icon: 'feed', title: 'Activity feeds that locked up the tab', why: 'Scale broke the experience' },
  { icon: 'merge', title: 'Fifteen divergent filter systems', why: 'One fix had to be made fifteen times' },
  { icon: 'layers', title: 'Styling trapped inside JavaScript', why: 'Recomputed in the browser, every render' },
]

function Pain({ icon, title, why, delay }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', columnGap: 22, alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Glyph name={icon} color={tokens.data.beforeNum} delay={delay} />
      </div>
      <motion.div {...fadeUp({ delay: delay + 0.05, y: 12 })}>
        <div style={{ fontFamily: tokens.font.body, fontWeight: 500, fontSize: tokens.type.rowLabel, color: tokens.text.primary, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 3 }}>{why}</div>
      </motion.div>
    </div>
  )
}

export default function ProblemScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The cost of momentum</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Success had a weight problem</MaskReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: '1vw', width: 'min(660px, 88vw)' }}>
        {pains.map((p, i) => (
          <Pain key={p.icon} {...p} delay={0.9 + i * 0.16} />
        ))}
      </div>
    </div>
  )
}
