import { motion } from 'framer-motion'
import { tokens } from '../theme'
import { popIn } from '../motion'

export default function Box({ w, h, title, sub, color = tokens.text.primary, fill = 'transparent', delay = 0, style }) {
  return (
    <motion.div
      {...popIn({ delay })}
      style={{
        width: w, height: h, border: `2px solid ${color}`, background: fill, borderRadius: 6,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 10, textAlign: 'center',
        ...style,
      }}
    >
      <div style={{ fontFamily: tokens.font.body, fontWeight: 600, fontSize: tokens.type.label, color }}>{title}</div>
      {sub && <div style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.eyebrow, color }}>{sub}</div>}
    </motion.div>
  )
}
