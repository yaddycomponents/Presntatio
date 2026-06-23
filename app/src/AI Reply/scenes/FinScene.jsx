import { motion } from 'framer-motion'
import { t, ease } from '../tokens'

export default function FinScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* phase 1 — "Growfin": Grow drops away, fin stays, then the remnant clears */}
      <div style={{ position: 'absolute', display: 'flex', alignItems: 'baseline', fontFamily: t.font, fontWeight: 700, fontSize: 'clamp(48px,7vw,116px)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, 64] }}
          transition={{ duration: 2.4, times: [0, 0.14, 0.5, 0.72], ease: ease.inOut }}
          style={{ color: t.ink, display: 'inline-block' }}>
          Grow
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, 0] }}
          transition={{ duration: 2.4, times: [0, 0.14, 0.78, 0.95], ease: ease.inOut }}
          style={{ display: 'inline-block', background: t.ai, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          fin
        </motion.span>
      </div>

      {/* phase 2 — lone "fin" fades in, centered, as the close */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 1] }}
        transition={{ delay: 2.8, duration: 3.2, times: [0, 0.24, 0.7, 1], ease: ease.out }}
        style={{ position: 'absolute', fontFamily: t.font, fontWeight: 700, fontSize: 'clamp(60px,9vw,150px)', letterSpacing: '0.02em', background: t.ai, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        fin
      </motion.div>

      {/* underline beneath the lone fin */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ delay: 3.2, duration: 2.6, times: [0, 0.25, 0.7, 1], ease: ease.inOut }}
        style={{ position: 'absolute', top: 'calc(50% + 110px)', width: 'min(190px, 28vw)', height: 2, background: t.ai, transformOrigin: 'center' }} />
    </div>
  )
}
