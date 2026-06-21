import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp, fadeIn } from '../motion'

function CodeLine({ mark, markColor, code, comment, delay }) {
  return (
    <motion.div {...fadeUp({ delay, y: 8 })} style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '6px 0' }}>
      <span style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.label, color: markColor, width: 16 }}>{mark}</span>
      <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.text.primary }}>
        {code}
      </span>
      {comment && <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: markColor }}>{comment}</span>}
    </motion.div>
  )
}

const notes = [
  'Extracted getActionType.ts — ts-pattern + an enum, zero component imports',
  'Repointed 3 importers: Action/utils.ts · ActionTypeTitle.tsx · ActionList.tsx',
  'Moved into the shared grow package for reuse',
]

export default function ImportFixScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part B — The fix</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Import from a pure file</MaskReveal>

      <motion.div
        {...fadeIn({ delay: 0.7 })}
        style={{ background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 8, padding: '16px 26px', width: 'min(880px, 94vw)' }}
      >
        <CodeLine mark="✕" markColor={tokens.data.beforeNum} code={'import { getActionType } from "./ActionConfigurations/ActionTypeTitle"'} comment="← drags the render tree" delay={0.9} />
        <CodeLine mark="✓" markColor={tokens.data.afterNum} code={'import { getActionType } from "./ActionConfigurations/getActionType"'} comment="← pure util" delay={1.3} />
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 'min(880px, 94vw)', marginTop: '0.4vw' }}>
        {notes.map((n, i) => (
          <motion.div key={n} {...fadeUp({ delay: 1.7 + i * 0.18, y: 6 })} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ color: tokens.data.afterNum, fontFamily: tokens.font.mono, fontSize: tokens.type.label }}>•</span>
            <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.primary }}>{n}</span>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeIn({ delay: 2.4 })} style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: '0.8vw', fontFamily: tokens.font.mono, fontSize: tokens.type.label, fontWeight: 700 }}>
        <span style={{ color: tokens.data.afterNum }}>lib-tiptap removed from modulepreload</span>
        <span style={{ color: tokens.text.muted }}>→</span>
        <span style={{ color: tokens.data.beforeNum, textDecoration: 'line-through' }}>357 KB</span>
        <span style={{ color: tokens.data.afterNum }}>0 KB on load</span>
      </motion.div>

      <Line delay={2.8} size={tokens.type.label} color={tokens.text.muted}>
        tiptap now loads only when the email editor actually renders.
      </Line>
    </div>
  )
}
