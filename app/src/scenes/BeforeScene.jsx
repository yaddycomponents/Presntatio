import { motion } from 'framer-motion'
import { Kicker, MaskReveal } from '../components/Text'
import { theme, ease, spring } from '../theme'

const boxes = [
  { x: -260, y: -120, r: -8 },
  { x: -120, y: 40, r: 6 },
  { x: 60, y: -80, r: 12 },
  { x: 220, y: 90, r: -10 },
  { x: -40, y: -180, r: 4 },
  { x: 180, y: -160, r: -14 },
]

export default function BeforeScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ position: 'relative', width: 600, height: 420 }}>
        {boxes.map((b, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, x: b.x, y: b.y, rotate: b.r }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ ...spring.gentle, delay: 0.3 + idx * 0.12 }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              width: 150, height: 92, marginLeft: -75, marginTop: -46,
              border: `2px solid ${theme.creamDim}`,
              background: 'rgba(192, 109, 126, 0.35)',
            }}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '14%', textAlign: 'center' }}>
        <Kicker delay={1.4}>Before</Kicker>
        <div style={{ marginTop: '0.3em' }}>
          <MaskReveal delay={1.0} size="clamp(36px, 6vw, 88px)">Tangled & Brittle</MaskReveal>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{ position: 'absolute', top: '50%', left: '50%', width: 6, height: 6, borderRadius: '50%', background: theme.cream, boxShadow: `0 0 0 1px ${theme.creamDim}` }}
      />
    </div>
  )
}
