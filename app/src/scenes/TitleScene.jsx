import { motion } from 'framer-motion'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { growXFade } from '../motion'

export default function TitleScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35em' }}>
        <Kicker delay={0.9} color={tokens.text.onDarkMuted}>A Platform Modernization Story</Kicker>

        <div>
          <MaskReveal delay={0.4} size={tokens.type.hero} color={tokens.text.onDark}>Heisenberg</MaskReveal>
        </div>

        <motion.div
          {...growXFade({ delay: 1.2 })}
          style={{ width: 'min(38vw, 460px)', height: 2, background: tokens.text.onDarkMuted, transformOrigin: 'center', marginTop: '0.5em' }}
        />

        <Kicker delay={1.5} color={tokens.text.onDarkMuted}>Faster · Lighter · Built to Scale</Kicker>
      </div>
    </div>
  )
}
