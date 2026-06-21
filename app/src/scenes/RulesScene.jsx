import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp } from '../motion'

const rules = [
  { rule: 'Barrels defeat lazy-loading', detail: 'Import one thing, get everything the barrel re-exports' },
  { rule: 'antd Tabs render all children', detail: 'Use destroyInactiveTabPane' },
  { rule: 'Re-exports break splitting', detail: "export { X } from './lazy' is a static chain" },
  { rule: 'manualChunks naming can backfire', detail: 'Rollup may hoist __vitePreload into a named chunk' },
  { rule: 'polyfill:false ≠ no __vitePreload', detail: 'It drops the browser polyfill, not the helper' },
  { rule: 'Shared modules hoist to entry', detail: 'To avoid duplication across lazy routes' },
]

function RuleCard({ n, rule, detail, delay }) {
  return (
    <motion.div
      {...fadeUp({ delay, y: 12 })}
      style={{ background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 8, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      <span style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.eyebrow, color: tokens.data.afterNum }}>{n}</span>
      <span style={{ fontFamily: tokens.font.body, fontWeight: 600, fontSize: tokens.type.rowLabel, color: tokens.text.primary, lineHeight: 1.15 }}>{rule}</span>
      <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, lineHeight: 1.3 }}>{detail}</span>
    </motion.div>
  )
}

export default function RulesScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Principles</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Principles we'll keep</MaskReveal>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, width: 'min(880px, 92vw)', marginTop: '1vw' }}>
        {rules.map((r, i) => (
          <RuleCard key={r.rule} n={String(i + 1).padStart(2, '0')} {...r} delay={0.9 + i * 0.12} />
        ))}
      </div>
    </div>
  )
}
