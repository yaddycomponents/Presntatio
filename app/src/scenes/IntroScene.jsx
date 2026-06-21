import { motion } from 'framer-motion'
import { Kicker } from '../components/Text'
import { tokens, ease, spring } from '../theme'
import { growXFade, fadeIn } from '../motion'

function Dia({ from, delay, size = 26 }) {
  return (
    <motion.div
      initial={{ x: from.x, y: from.y, opacity: 0, scale: 0, rotate: 0 }}
      animate={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 45 }}
      transition={{ delay, ...spring.gentle }}
      style={{ position: 'absolute', width: size, height: size, border: `2px solid ${tokens.text.onDark}` }}
    />
  )
}

export default function IntroScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vw' }}>
      <motion.div {...fadeIn({ delay: 0.2 })} style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: '0.5em', textTransform: 'uppercase', color: tokens.text.onDarkMuted, textIndent: '0.5em' }}>
        Growfin · Engineering
      </motion.div>

      {/* brand motif — four diamonds converge into one */}
      <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1vw 0' }}>
        <Dia from={{ x: -120, y: 0 }} delay={0.5} />
        <Dia from={{ x: 120, y: 0 }} delay={0.6} />
        <Dia from={{ x: 0, y: -120 }} delay={0.7} />
        <Dia from={{ x: 0, y: 120 }} delay={0.8} />
        <motion.div
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ scale: 1, rotate: 45, opacity: 1 }}
          transition={{ delay: 1.3, ...spring.pop }}
          style={{ position: 'absolute', width: 14, height: 14, background: tokens.text.onDark }}
        />
      </div>

      <motion.div
        {...growXFade({ delay: 1.6 })}
        style={{ width: 'min(30vw, 360px)', height: 2, background: tokens.text.onDarkMuted, transformOrigin: 'center' }}
      />

      <Kicker delay={1.9} color={tokens.text.onDarkMuted}>A Platform Modernization Story</Kicker>
    </div>
  )
}
