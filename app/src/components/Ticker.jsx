import { motion } from 'framer-motion'
import { tokens } from '../theme'
import { flash, popIn } from '../motion'

export function Flash({ children, delay = 0, good = true, style }) {
  return (
    <motion.span
      {...flash({ delay, good })}
      style={{ display: 'inline-block', padding: '0.08em 0.3em', borderRadius: 4, ...style }}
    >
      {children}
    </motion.span>
  )
}

export function Delta({ children, delay = 0, good = true }) {
  const color = good ? tokens.data.afterNum : tokens.data.beforeNum
  return (
    <motion.span
      {...popIn({ delay })}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4em',
        color, border: `1.5px solid ${color}`, borderRadius: 999,
        padding: '0.32em 0.85em', fontSize: tokens.type.delta, fontWeight: 700, fontFamily: tokens.font.mono,
        fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: '0.85em' }}>{good ? '▼' : '▲'}</span>
      {children}
    </motion.span>
  )
}
