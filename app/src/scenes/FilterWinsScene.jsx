import { motion } from 'framer-motion'
import Glyph from '../components/Glyph'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp } from '../motion'

const wins = [
  { icon: 'check', title: 'Killed the double-fetch', why: 'onApply fires on commit, not on hydrate — StrictMode-safe' },
  { icon: 'minus', title: 'Inbox filter simplified', why: '2 refs + 2 effects → 0 refs + 1 effect' },
  { icon: 'doc', title: 'Report Builder', why: 'Measure · Dimension · Filter · Viz · Sort — Fast Context (pub/sub)' },
  { icon: 'merge', title: 'grow-components reuse', why: 'embedded mode + GrowMultiSelect · 667-line MultiSelect → focused hooks' },
]

function Win({ icon, title, why, delay }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', columnGap: 22, alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Glyph name={icon} delay={delay} />
      </div>
      <motion.div {...fadeUp({ delay: delay + 0.05, y: 12 })}>
        <div style={{ fontFamily: tokens.font.body, fontWeight: 500, fontSize: tokens.type.rowLabel, color: tokens.text.primary, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 3 }}>{why}</div>
      </motion.div>
    </div>
  )
}

export default function FilterWinsScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part D — Architecture wins</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>More than fewer lines</MaskReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: '1vw', width: 'min(680px, 90vw)' }}>
        {wins.map((w, i) => (
          <Win key={w.icon} {...w} delay={0.9 + i * 0.2} />
        ))}
      </div>
    </div>
  )
}
