import { motion } from 'framer-motion'
import { tokens } from '../theme'

// stroke draw-in: the line "writes itself" (motion-graphic feel)
const dr = (d) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { delay: d, duration: 0.55, ease: [0.22, 1, 0.36, 1] }, opacity: { delay: d, duration: 0.12 } },
})
const fadePop = (d) => ({ initial: { opacity: 0, scale: 0.4 }, animate: { opacity: 1, scale: 1 }, transition: { delay: d, duration: 0.4, ease: [0.22, 1, 0.36, 1] } })

const shapes = {
  speed: (d) => [<motion.polyline key="a" points="23,4 9,22 18,22 14,36" {...dr(d)} />],
  light: (d) => [
    <motion.line key="a" x1="20" y1="5" x2="20" y2="27" {...dr(d)} />,
    <motion.polyline key="b" points="11,20 20,30 29,20" {...dr(d + 0.18)} />,
  ],
  paint: (d) => [
    <motion.circle key="a" cx="20" cy="20" r="14" {...dr(d)} />,
    <motion.path key="b" d="M20 6 A14 14 0 0 1 20 34 Z" fill="currentColor" stroke="none" {...fadePop(d + 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'left center' }} />,
  ],
  feed: (d) => [
    <motion.line key="a" x1="8" y1="13" x2="32" y2="13" {...dr(d)} />,
    <motion.line key="b" x1="8" y1="20" x2="32" y2="20" {...dr(d + 0.12)} />,
    <motion.line key="c" x1="8" y1="27" x2="24" y2="27" {...dr(d + 0.24)} />,
  ],
  filter: (d) => [<motion.polygon key="a" points="7,9 33,9 23,21 23,32 17,32 17,21" {...dr(d)} />],
  ai: (d) => [<motion.path key="a" d="M20 4 L23 17 L36 20 L23 23 L20 36 L17 23 L4 20 L17 17 Z" {...dr(d)} />],
  realtime: (d) => [
    <motion.path key="a" d="M32 20 A12 12 0 1 1 27 10" {...dr(d)} />,
    <motion.polyline key="b" points="26,4 28,11 21,12" {...dr(d + 0.3)} />,
  ],
  merge: (d) => [
    <motion.line key="a" x1="6" y1="9" x2="20" y2="20" {...dr(d)} />,
    <motion.line key="b" x1="6" y1="31" x2="20" y2="20" {...dr(d + 0.12)} />,
    <motion.line key="c" x1="20" y1="20" x2="34" y2="20" {...dr(d + 0.24)} />,
  ],
  upgrade: (d) => [
    <motion.line key="a" x1="20" y1="34" x2="20" y2="8" {...dr(d)} />,
    <motion.polyline key="b" points="11,17 20,8 29,17" {...dr(d + 0.18)} />,
  ],
  layers: (d) => [
    <motion.path key="a" d="M20 6 L33 13 L20 20 L7 13 Z" {...dr(d)} />,
    <motion.polyline key="b" points="7,20 20,27 33,20" {...dr(d + 0.15)} />,
    <motion.polyline key="c" points="7,27 20,34 33,27" {...dr(d + 0.3)} />,
  ],
  split: (d) => [
    <motion.line key="a" x1="6" y1="20" x2="16" y2="20" {...dr(d)} />,
    <motion.line key="b" x1="16" y1="8" x2="16" y2="32" {...dr(d + 0.12)} />,
    <motion.line key="c" x1="16" y1="8" x2="27" y2="8" {...dr(d + 0.24)} />,
    <motion.line key="d" x1="16" y1="20" x2="27" y2="20" {...dr(d + 0.3)} />,
    <motion.line key="e" x1="16" y1="32" x2="27" y2="32" {...dr(d + 0.36)} />,
  ],
  check: (d) => [
    <motion.circle key="a" cx="20" cy="20" r="14" {...dr(d)} />,
    <motion.polyline key="b" points="13,20 18,26 28,14" {...dr(d + 0.3)} />,
  ],
  minus: (d) => [
    <motion.circle key="a" cx="20" cy="20" r="14" {...dr(d)} />,
    <motion.line key="b" x1="12" y1="20" x2="28" y2="20" {...dr(d + 0.3)} />,
  ],
  doc: (d) => [
    <motion.path key="a" d="M11 6 H25 L29 10 V34 H11 Z" {...dr(d)} />,
    <motion.polyline key="b" points="25,6 25,10 29,10" {...dr(d + 0.2)} />,
    <motion.line key="c" x1="15" y1="17" x2="25" y2="17" {...dr(d + 0.3)} />,
    <motion.line key="d" x1="15" y1="22" x2="25" y2="22" {...dr(d + 0.38)} />,
    <motion.line key="e" x1="15" y1="27" x2="22" y2="27" {...dr(d + 0.46)} />,
  ],
  cut: (d) => [
    <motion.circle key="a" cx="11" cy="28" r="4" {...dr(d)} />,
    <motion.circle key="b" cx="11" cy="12" r="4" {...dr(d + 0.1)} />,
    <motion.line key="c" x1="14" y1="26" x2="35" y2="9" {...dr(d + 0.2)} />,
    <motion.line key="d" x1="14" y1="14" x2="35" y2="31" {...dr(d + 0.3)} />,
  ],
}

export default function Glyph({ name, size = 40, color = tokens.data.afterNum, delay = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ color, overflow: 'visible' }}>
      {shapes[name](delay)}
    </svg>
  )
}
