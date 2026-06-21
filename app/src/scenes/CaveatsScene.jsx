import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp } from '../motion'

const caveats = [
  { head: 'Order-of-magnitude, not a benchmark', body: 'Different deployments and datasets — read the direction, not the decimals' },
  { head: 'First-visit costs', body: 'Cache was disabled, so these are cold-load numbers' },
  { head: 'Ignore prod’s "Finish" time', body: 'It’s inflated by non-blocking analytics, not user-facing' },
  { head: 'Transferred, not uncompressed', body: 'Always cite bytes over the wire — gzip/brotli do real work' },
]

function Item({ head, body, delay }) {
  return (
    <motion.div {...fadeUp({ delay, y: 12 })} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', columnGap: 16, alignItems: 'start' }}>
      <div style={{ paddingTop: 7 }}><Diamond size={8} color={tokens.data.afterNum} delay={delay} /></div>
      <div>
        <div style={{ fontFamily: tokens.font.body, fontWeight: 600, fontSize: tokens.type.rowLabel, color: tokens.text.primary, lineHeight: 1.2 }}>{head}</div>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 3 }}>{body}</div>
      </div>
    </motion.div>
  )
}

export default function CaveatsScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Payoff · Stated plainly</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>The honest caveats</MaskReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: '1vw', width: 'min(680px, 90vw)' }}>
        {caveats.map((c, i) => (
          <Item key={c.head} {...c} delay={0.9 + i * 0.2} />
        ))}
      </div>
    </div>
  )
}
