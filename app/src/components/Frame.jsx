import { motion } from 'framer-motion'
import { tokens, dur } from '../theme'
import { drawIn, spinIn } from '../motion'

const W = 1200
const H = 800

function Diamond({ x, y, delay, color }) {
  return (
    <motion.rect
      x={x - 13}
      y={y - 13}
      width={26}
      height={26}
      fill={color}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      {...spinIn({ delay })}
    />
  )
}

export default function Frame({ delay = 0, color = tokens.border }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <motion.rect x={70} y={70} width={1060} height={660} fill="none" stroke={color} strokeWidth={6} {...drawIn({ delay })} />
      <motion.rect x={90} y={90} width={1020} height={620} fill="none" stroke={color} strokeWidth={2} {...drawIn({ delay })} />
      <Diamond x={87} y={87} delay={delay + dur.draw * 0.7} color={color} />
      <Diamond x={1113} y={87} delay={delay + dur.draw * 0.75} color={color} />
      <Diamond x={87} y={713} delay={delay + dur.draw * 0.8} color={color} />
      <Diamond x={1113} y={713} delay={delay + dur.draw * 0.85} color={color} />
    </svg>
  )
}
