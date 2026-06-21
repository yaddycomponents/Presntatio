import { motion } from 'framer-motion'
import { tokens } from '../theme'
import { fadeUp, maskReveal } from '../motion'

export function Kicker({ children, delay = 0, color = tokens.text.eyebrow }) {
  return (
    <motion.div
      {...fadeUp({ delay, y: 12 })}
      style={{
        color,
        fontFamily: tokens.font.mono,
        letterSpacing: tokens.track.eyebrow,
        textTransform: 'uppercase',
        fontSize: tokens.type.eyebrow,
        textIndent: tokens.track.eyebrow,
      }}
    >
      {children}
    </motion.div>
  )
}

export function MaskReveal({ children, delay = 0, size = tokens.type.display, color = tokens.text.primary }) {
  return (
    <span style={{ display: 'block', overflow: 'hidden', padding: '0.08em 0.02em' }}>
      <motion.span
        {...maskReveal({ delay })}
        style={{ display: 'block', fontFamily: tokens.font.display, fontWeight: 400, lineHeight: 1.02, fontSize: size, color }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Line({ children, delay = 0, size = tokens.type.body, color = tokens.text.primary, weight = 400 }) {
  return (
    <motion.div
      {...fadeUp({ delay })}
      style={{ fontFamily: tokens.font.body, fontWeight: weight, fontSize: size, color, lineHeight: 1.4 }}
    >
      {children}
    </motion.div>
  )
}
