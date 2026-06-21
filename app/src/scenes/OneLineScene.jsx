import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens } from '../theme'
import { growXFade } from '../motion'

function Statement({ children, delay }) {
  return <MaskReveal delay={delay} size={tokens.type.statement} color={tokens.text.onDark}>{children}</MaskReveal>
}

function Muted({ children }) {
  return <span style={{ color: tokens.text.onDarkMuted }}>{children}</span>
}

export default function OneLineScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: '2vw' }}>
        <Diamond size={9} color={tokens.text.onDarkMuted} delay={0.3} />
        <Kicker delay={0.2} color={tokens.text.onDarkMuted}>In one line</Kicker>
        <Diamond size={9} color={tokens.text.onDarkMuted} delay={0.3} />
      </div>

      <Statement delay={0.5}>2.6× <Muted>faster</Muted></Statement>
      <Statement delay={0.9}>5× <Muted>lighter</Muted></Statement>
      <Statement delay={1.3}>one <Muted>filter system, not fifteen</Muted></Statement>

      <motion.div
        {...growXFade({ delay: 1.9 })}
        style={{ width: 'min(34vw, 420px)', height: 2, background: tokens.text.onDarkMuted, transformOrigin: 'center', marginTop: '2vw', marginBottom: '1.4vw' }}
      />

      <Line delay={2.1} size={tokens.type.rowLabel} color={tokens.text.onDarkMuted}>
        — and less code than we started with.
      </Line>
    </div>
  )
}
