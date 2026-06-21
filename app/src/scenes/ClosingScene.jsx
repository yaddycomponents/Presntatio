import { motion } from 'framer-motion'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens } from '../theme'
import { growXFade } from '../motion'

export default function ClosingScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4em' }}>
        <Kicker delay={0.8} color={tokens.text.onDarkMuted}>The platform, re-engineered</Kicker>

        <MaskReveal delay={0.4} size={tokens.type.hero} color={tokens.text.onDark}>Heisenberg</MaskReveal>

        <motion.div
          {...growXFade({ delay: 1.2 })}
          style={{ width: 'min(40vw, 480px)', height: 2, background: tokens.text.onDarkMuted, transformOrigin: 'center', marginTop: '0.5em', marginBottom: '0.3em' }}
        />

        <Line delay={1.5} size={tokens.type.rowLabel} color={tokens.text.onDark}>
          2.6× faster · 5× lighter · one filter system · less code
        </Line>
        <Line delay={1.9} size={tokens.type.label} color={tokens.text.onDarkMuted}>
          Built for what's next.
        </Line>
      </div>
    </div>
  )
}
