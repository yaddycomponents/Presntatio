import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp } from '../motion'

const upgrades = [
  { name: 'antd', from: 'v5', to: 'v6', done: true },
  { name: 'Vite', from: '6', to: '8 · Rolldown', done: true },
  { name: 'react-redux', from: '7', to: '8', done: true },
  { name: 'Node', from: '20', to: '24', done: true },
  { name: 'React Query', from: 'v4', to: 'v5', done: false },
  { name: 'package manager', from: 'npm', to: 'pnpm', done: false },
]

function Card({ name, from, to, done, delay }) {
  const statusColor = done ? tokens.data.afterNum : tokens.data.peach
  return (
    <motion.div {...fadeUp({ delay, y: 12 })} style={{ background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 8, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: tokens.font.body, fontWeight: 600, fontSize: tokens.type.rowLabel, color: tokens.text.primary }}>{name}</span>
        <span style={{ fontFamily: tokens.font.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: statusColor, border: `1px solid ${statusColor}`, borderRadius: 999, padding: '1px 8px' }}>{done ? 'shipped' : 'planned'}</span>
      </div>
      <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label }}>
        <span style={{ color: tokens.data.beforeNum }}>{from}</span>
        <span style={{ color: tokens.text.muted }}> → </span>
        <span style={{ color: tokens.data.afterNum }}>{to}</span>
      </div>
    </motion.div>
  )
}

export default function UpgradesScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.8vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Foundation</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>A modern foundation</MaskReveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, width: 'min(900px, 94vw)', marginTop: '1vw' }}>
        {upgrades.map((u, i) => (
          <Card key={u.name} {...u} delay={0.9 + i * 0.12} />
        ))}
      </div>
    </div>
  )
}
