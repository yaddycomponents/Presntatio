import { motion } from 'framer-motion'
import { t, type, ease } from '../tokens'
import { Sparkle, Grad, Mask, Chip, rise, fade } from '../fx'

export default function CloseScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3vh' }}>
      <motion.div {...rise({ delay: 0.2, y: 10 })} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: t.mono, fontSize: 'clamp(11px,1vw,14px)', letterSpacing: '0.34em', textTransform: 'uppercase', color: t.muted }}>
        <Sparkle size={16} delay={0.3} /> Growfin · AR Automation
      </motion.div>

      <div style={{ textAlign: 'center', lineHeight: 1.12, fontSize: type.h1, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>
        <div><Mask delay={0.45}>AI handles the routine.</Mask></div>
        <div><Mask delay={0.7}><Grad>Your team handles the rest.</Grad></Mask></div>
      </div>

      <motion.div {...fade({ delay: 1.3 })}
        style={{ width: 'min(420px, 60vw)', height: 2, background: t.ai }}
        initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 1.3, duration: 0.8, ease: ease.out }} />

      <div style={{ display: 'flex', gap: 14, marginTop: '0.5vh' }}>
        <Chip delay={1.6} tone="primary">Opt-in per admin</Chip>
        <Chip delay={1.75} tone="primary">Six scoped themes</Chip>
        <Chip delay={1.9} tone="primary">Everything else stays human</Chip>
      </div>
    </div>
  )
}
