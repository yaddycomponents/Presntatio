import { motion } from 'framer-motion'
import Glyph from '../components/Glyph'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp } from '../motion'

const wins = [
  { icon: 'speed', title: 'Loads 2.6× faster', why: 'Usable in under a second — not a 13 MB wait' },
  { icon: 'light', title: '5× lighter download', why: 'Easy on mobile and slow networks' },
  { icon: 'paint', title: 'Content paints twice as soon', why: 'LCP 6.07 s → 2.92 s' },
  { icon: 'feed', title: 'Feeds never freeze', why: 'Smooth past 1,000 cards' },
  { icon: 'filter', title: 'One filter, everywhere', why: 'Same pills, saved views & SmartFilter across 15 pages' },
  { icon: 'ai', title: 'New AI surfaces', why: 'Auto-Reply + Report Builder' },
  { icon: 'realtime', title: 'Realtime stays reliable', why: 'Sign-out syncs across tabs, no stale channels' },
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

export default function CustomerImpactScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Payoff · For customers</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>What customers feel now</MaskReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: '1vw', width: 'min(640px, 86vw)' }}>
        {wins.map((w, i) => (
          <Win key={w.icon} {...w} delay={0.9 + i * 0.16} />
        ))}
      </div>
    </div>
  )
}
