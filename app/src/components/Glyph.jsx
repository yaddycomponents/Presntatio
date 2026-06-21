import { motion } from 'framer-motion'
import { tokens } from '../theme'
import { popIn } from '../motion'

const shapes = {
  speed: <polyline points="23,4 9,22 18,22 14,36" />,
  light: <>
    <line x1="20" y1="5" x2="20" y2="27" />
    <polyline points="11,20 20,30 29,20" />
  </>,
  paint: <>
    <circle cx="20" cy="20" r="14" />
    <path d="M20 6 A14 14 0 0 1 20 34 Z" fill="currentColor" stroke="none" />
  </>,
  feed: <>
    <line x1="8" y1="13" x2="32" y2="13" />
    <line x1="8" y1="20" x2="32" y2="20" />
    <line x1="8" y1="27" x2="24" y2="27" />
  </>,
  filter: <polygon points="7,9 33,9 23,21 23,32 17,32 17,21" />,
  ai: <path d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z" />,
  realtime: <>
    <path d="M32 20 A12 12 0 1 1 27 10" />
    <polyline points="26,4 28,11 21,12" />
  </>,
  merge: <>
    <line x1="6" y1="9" x2="20" y2="20" />
    <line x1="6" y1="31" x2="20" y2="20" />
    <line x1="20" y1="20" x2="34" y2="20" />
  </>,
  upgrade: <>
    <line x1="20" y1="34" x2="20" y2="8" />
    <polyline points="11,17 20,8 29,17" />
  </>,
  layers: <>
    <path d="M20 6 L33 13 L20 20 L7 13 Z" />
    <polyline points="7,20 20,27 33,20" />
    <polyline points="7,27 20,34 33,27" />
  </>,
  split: <>
    <line x1="6" y1="20" x2="16" y2="20" />
    <line x1="16" y1="8" x2="16" y2="32" />
    <line x1="16" y1="8" x2="27" y2="8" />
    <line x1="16" y1="20" x2="27" y2="20" />
    <line x1="16" y1="32" x2="27" y2="32" />
  </>,
  check: <>
    <circle cx="20" cy="20" r="14" />
    <polyline points="13,20 18,26 28,14" />
  </>,
  minus: <>
    <circle cx="20" cy="20" r="14" />
    <line x1="12" y1="20" x2="28" y2="20" />
  </>,
  cut: <>
    <circle cx="11" cy="28" r="4" />
    <circle cx="11" cy="12" r="4" />
    <line x1="14" y1="26" x2="35" y2="9" />
    <line x1="14" y1="14" x2="35" y2="31" />
  </>,
  doc: <>
    <path d="M11 6 H25 L29 10 V34 H11 Z" />
    <polyline points="25,6 25,10 29,10" />
    <line x1="15" y1="17" x2="25" y2="17" />
    <line x1="15" y1="22" x2="25" y2="22" />
    <line x1="15" y1="27" x2="22" y2="27" />
  </>,
}

export default function Glyph({ name, size = 40, color = tokens.data.afterNum, delay = 0 }) {
  return (
    <motion.svg
      {...popIn({ delay })}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color, overflow: 'visible' }}
    >
      {shapes[name]}
    </motion.svg>
  )
}
