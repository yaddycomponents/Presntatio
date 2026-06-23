import { motion } from 'framer-motion'
import { t, type, ease } from '../tokens'
import { Sparkle, Grad, rise, fade } from '../fx'

export default function TitleScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.4vh' }}>
      <motion.div {...rise({ delay: 0.2, y: 10 })}
        style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: t.mono, fontSize: 'clamp(11px,1vw,14px)', letterSpacing: '0.34em', textTransform: 'uppercase', color: t.muted }}>
        <Sparkle size={16} delay={0.3} /> Growfin · AR Automation
      </motion.div>

      <div style={{ textAlign: 'center', lineHeight: 1.02 }}>
        <motion.div {...rise({ delay: 0.45 })} style={{ fontSize: type.h1, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>
          AI <Grad>Auto-Reply</Grad>
        </motion.div>
      </div>

      <motion.div {...fade({ delay: 0.9 })}
        style={{ width: 'min(420px, 60vw)', height: 2, background: t.ai, transformOrigin: 'center' }}
        initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8, ease: ease.out }} />

      <motion.div {...rise({ delay: 1.15, y: 12 })}
        style={{ fontSize: type.lead, color: t.muted, fontWeight: 400, textAlign: 'center', maxWidth: '46ch' }}>
        Routine customer replies, sent in <span style={{ color: t.ink, fontWeight: 600 }}>under a minute</span> — with judgment left to the AR team.
      </motion.div>
    </div>
  )
}
