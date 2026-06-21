import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp, fadeIn } from '../motion'

const calls = ['invoice-statuses', 'collection-statuses', 'invoice-dispute-types', 'invoice-followup-statuses', 'invoice-followup-activities', 'aging-data', 'high-risk-customers']

function Panel({ tag, count, color, children, base }) {
  return (
    <motion.div {...fadeUp({ delay: base, y: 14 })} style={{ flex: 1, background: `${color}14`, border: `1.5px solid ${color}`, borderRadius: 10, padding: '20px 24px', minHeight: 280 }}>
      <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>{tag}</div>
      <div style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 'clamp(28px, 4vw, 52px)', color, marginTop: 4 }}>
        <CountUp to={count} delay={base + 0.2} duration={1.2} /> calls
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </motion.div>
  )
}

export default function EagerBootScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.8vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Data fetching</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Eager Boot → Point-of-Use</MaskReveal>

      <div style={{ display: 'flex', gap: 28, width: 'min(940px, 94vw)', alignItems: 'stretch', marginTop: '0.4vw' }}>
        <Panel tag="Production · boot waterfall" count={48} color={tokens.data.beforeNum} base={0.8}>
          {calls.map((c, i) => (
            <motion.div key={c} {...fadeIn({ delay: 1.2 + i * 0.08 })} style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.data.beforeNum, lineHeight: 1.7 }}>{c}</motion.div>
          ))}
        </Panel>

        <Panel tag="New Bundle · deferred" count={21} color={tokens.data.afterNum} base={1.4}>
          <div style={{ fontFamily: tokens.font.body, fontSize: tokens.type.label, color: tokens.text.primary, lineHeight: 1.5 }}>
            Reference data is fetched <strong>when the feature that needs it opens</strong> — the inbox, a filter, an activity form — not on the dashboard shell.
          </div>
          <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.data.afterNum, marginTop: 14 }}>React Query · deduped by canonical key</div>
        </Panel>
      </div>

      <Line delay={2.8} size={tokens.type.label} color={tokens.text.muted}>
        None of the deferred calls render a single dashboard tile.
      </Line>
    </div>
  )
}
