import { motion } from 'framer-motion'
import { tokens } from '../theme'
import { spinIn } from '../motion'

export default function Diamond({ size = 10, color = tokens.text.primary, delay = 0, filled = true }) {
  return (
    <motion.span
      {...spinIn({ delay })}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        background: filled ? color : 'transparent',
        border: filled ? 'none' : `1.5px solid ${color}`,
      }}
    />
  )
}
