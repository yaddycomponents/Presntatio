import { motion } from 'framer-motion'
import Glyph from '../components/Glyph'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp } from '../motion'

const wins = [
  { icon: 'merge', title: 'One filter toolkit', why: '6 copies → 1 module · −12.2k LOC · fix a bug once' },
  { icon: 'upgrade', title: 'Modern foundation', why: 'antd v6 · Vite 8 (Rolldown) · redux v8' },
  { icon: 'layers', title: 'Zero-runtime CSS', why: 'Static .css files, not JS injected per render' },
  { icon: 'split', title: 'Lazy by default', why: '18 big files → 55 small chunks' },
  { icon: 'check', title: 'React 18 Strict-Mode safe', why: 'Double-effects, cleanup & store-tearing fixed' },
  { icon: 'minus', title: 'Less code to own', why: '+52.7k / −63.1k — smaller while doing more' },
  { icon: 'doc', title: 'Documented playbooks', why: 'Overrides, sync, migrations — cheaper onboarding' },
]

function Win({ icon, title, why, delay }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', columnGap: 22, alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Glyph name={icon} delay={delay} />
      </div>
      <motion.div {...fadeUp({ delay: delay + 0.05, y: 12 })}>
        <div style={{ fontFamily: tokens.font.body, fontWeight: 500, fontSize: tokens.type.rowLabel, color: tokens.text.primary, lineHeight: 1.15 }}>{title}</div>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 3 }}>{why}</div>
      </motion.div>
    </div>
  )
}

export default function DeveloperImpactScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part A — Impact</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>What the team gains</MaskReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: '1vw', width: 'min(660px, 88vw)' }}>
        {wins.map((w, i) => (
          <Win key={w.icon} {...w} delay={0.9 + i * 0.16} />
        ))}
      </div>
    </div>
  )
}
