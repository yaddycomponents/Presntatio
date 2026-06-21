import { motion } from 'framer-motion'
import Skeleton from '../components/Skeleton'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn, fadeUp, popIn } from '../motion'

const chips = [
  { label: 'Status: Open', accent: false },
  { label: 'Owner: Me', accent: false },
  { label: 'Due ≤ 7d', accent: false },
  { label: '✦ SmartFilter', accent: true },
]

function Chip({ label, accent, delay }) {
  const color = accent ? tokens.data.afterNum : tokens.text.primary
  return (
    <motion.div
      {...popIn({ delay })}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${color}`, background: accent ? 'rgba(91,125,119,0.12)' : 'transparent', borderRadius: 999, padding: '6px 12px', fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color }}
    >
      {label}
      {!accent && <span style={{ opacity: 0.6 }}>×</span>}
    </motion.div>
  )
}

function Row({ delay }) {
  return (
    <motion.div {...fadeUp({ delay, y: 10 })} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Skeleton circle w={40} h={40} delay={delay} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        <Skeleton w="52%" h={12} delay={delay} />
        <Skeleton w="34%" h={10} delay={delay} />
      </div>
      <Skeleton w={72} h={24} radius={999} delay={delay} />
    </motion.div>
  )
}

export default function FilterUXScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part D — How it feels</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>One filter, everywhere</MaskReveal>

      <motion.div
        {...fadeIn({ delay: 0.7 })}
        style={{ width: 'min(720px, 92vw)', background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 12, padding: 24 }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, paddingBottom: 18, borderBottom: `1px solid ${tokens.line}` }}>
          <motion.div
            {...popIn({ delay: 0.9 })}
            animate={{ opacity: 1, scale: [1, 1, 0.92, 1] }}
            transition={{ scale: { delay: 1.25, duration: 0.45, times: [0, 0.3, 0.6, 1], ease: ease.out } }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${tokens.text.primary}`, borderRadius: 999, padding: '7px 14px', fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.primary, fontWeight: 700 }}
          >
            + Filters
          </motion.div>
          {chips.map((c, i) => (
            <Chip key={c.label} {...c} delay={1.6 + i * 0.22} />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 20 }}>
          {[0, 1, 2, 3].map((i) => (
            <Row key={i} delay={2.5 + i * 0.18} />
          ))}
        </div>
      </motion.div>

      <Line delay={3.6} size={tokens.type.label} color={tokens.text.muted}>
        Same pills, +Filters menu, saved views & SmartFilter — across all fifteen pages.
      </Line>
    </div>
  )
}
