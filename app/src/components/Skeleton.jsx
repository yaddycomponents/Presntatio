import { motion } from 'framer-motion'
import { tokens } from '../theme'

export default function Skeleton({ w, h, radius = 5, delay = 0, circle = false }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      style={{ position: 'relative', width: w, height: h, borderRadius: circle ? '50%' : radius, background: 'rgba(94,59,70,0.12)', overflow: 'hidden' }}
    >
      <motion.div
        initial={{ x: '-120%' }}
        animate={{ x: '220%' }}
        transition={{ delay, duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent, ${tokens.bg.title}55, transparent)` }}
      />
    </motion.div>
  )
}
