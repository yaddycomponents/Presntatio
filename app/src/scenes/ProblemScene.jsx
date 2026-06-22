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

function Pain({ icon, title, why, delay, wide }) {
  return (
    <motion.div
      {...fadeUp({ delay, y: 14 })}
      style={{
        gridColumn: wide ? '1 / -1' : 'auto',
        display: 'grid', gridTemplateColumns: '52px 1fr', columnGap: 20, alignItems: 'center',
        padding: '20px 26px', borderRadius: 14,
        border: `1.5px solid ${tokens.border}`, background: 'rgba(176,109,113,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Glyph name={icon} color={tokens.data.beforeNum} delay={delay + 0.1} />
      </div>
      <div>
        <div style={{ fontFamily: tokens.font.body, fontWeight: 500, fontSize: tokens.type.rowLabel, color: tokens.text.primary, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 5 }}>{why}</div>
      </div>
    </motion.div>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: '1vw', width: 'min(1040px, 92vw)' }}>
        {pains.map((p, i) => (
          <Pain key={p.icon} {...p} wide={i === pains.length - 1} delay={0.9 + i * 0.14} />
        ))}
      </div>
    </div>
  )
}
