import { motion } from 'framer-motion'
import Glyph from '../components/Glyph'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens, ease } from '../theme'

const items = [
  { icon: 'check', title: 'React 18 Strict-Mode safe', why: 'Double-effects, missing cleanup & store-tearing — audited and fixed' },
  { icon: 'realtime', title: '4 memory leaks sealed', why: 'BroadcastChannel-per-render · Pusher · PerformanceObserver · premature WebSocket' },
  { icon: 'layers', title: '52 wrappers → GrowComponents', why: 'BaseComponents migrated onto CSS Modules' },
  { icon: 'doc', title: 'Documented playbooks', why: 'CSS overrides, sync architecture, migration plans' },
]

function Row({ icon, title, why, delay }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', columnGap: 22, alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Glyph name={icon} delay={delay} />
      </div>
      <div>
        <motion.div initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + 0.15, duration: 0.6, ease: ease.out }} style={{ fontFamily: tokens.font.body, fontWeight: 500, fontSize: tokens.type.rowLabel, color: tokens.text.primary, lineHeight: 1.15 }}>{title}</motion.div>
        <motion.div initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + 0.28, duration: 0.6, ease: ease.out }} style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 3 }}>{why}</motion.div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: delay + 0.1, duration: 0.7, ease: ease.out }} style={{ height: 1, background: tokens.line, marginTop: 12, transformOrigin: 'left' }} />
      </div>
    </div>
  )
}

export default function HardeningScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Hardening</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>A quieter, leak-free runtime</MaskReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: '1vw', width: 'min(700px, 90vw)' }}>
        {items.map((it, i) => (
          <Row key={it.icon} {...it} delay={0.9 + i * 0.2} />
        ))}
      </div>
    </div>
  )
}
