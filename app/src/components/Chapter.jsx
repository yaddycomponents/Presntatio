import { motion } from 'framer-motion'
import Frame from './Frame'
import { Kicker, MaskReveal, Line } from './Text'
import { tokens } from '../theme'
import { fadeIn } from '../motion'

export default function Chapter({ part, title, subtitle, letter }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Frame delay={0.05} color={tokens.text.onDark} />

      {letter && (
        <motion.div
          {...fadeIn({ delay: 0.4, duration: 1 })}
          style={{
            position: 'absolute', fontFamily: tokens.font.display, color: tokens.text.onDark,
            opacity: 0.12, fontSize: 'clamp(280px, 46vw, 620px)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
          }}
        >
          {letter}
        </motion.div>
      )}

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5em' }}>
        <Kicker delay={0.8} color={tokens.text.onDarkMuted}>{part}</Kicker>
        <MaskReveal delay={0.4} size={tokens.type.display} color={tokens.text.onDark}>{title}</MaskReveal>
        {subtitle && <Line delay={1.1} size={tokens.type.rowLabel} color={tokens.text.onDarkMuted}>{subtitle}</Line>}
      </div>
    </div>
  )
}
