import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn, fadeUp } from '../motion'

// the real chain — each hop reveals in sequence, building toward the leaf
const hops = [
  { d: 0, f: 'getActionType()', note: 'the one helper it wanted · 15 lines', tone: 'need' },
  { d: 1, f: 'imported from ActionTypeTitle.tsx', note: '✕ but that file is a heavy render component', tone: 'bad' },
  { d: 2, f: 'ActionList → WorkFlowForm → actionForm', tone: 'plain' },
  { d: 3, f: 'actionComponentMapType.ts', note: '✕ maps 13 components as runtime values', tone: 'bad' },
  { d: 4, f: 'WorkflowEmail → EmailForm → RichEmailContentEditor', tone: 'plain' },
  { d: 5, f: '@tiptap / prosemirror', tone: 'leaf' },
]

function color(tone) {
  if (tone === 'need') return tokens.text.primary
  if (tone === 'bad' || tone === 'leaf') return tokens.data.beforeNum
  return tokens.text.muted
}

function Hop({ hop, delay }) {
  const leaf = hop.tone === 'leaf'
  return (
    <motion.div
      {...fadeUp({ delay, y: 8 })}
      style={{
        display: 'flex', alignItems: 'baseline', gap: 10, paddingLeft: hop.d * 22, paddingTop: 4, paddingBottom: 4,
        background: hop.tone === 'bad' ? 'rgba(168,83,106,0.07)' : 'transparent', borderRadius: 4,
      }}
    >
      <span style={{ fontFamily: tokens.font.mono, fontSize: leaf ? tokens.type.label : tokens.type.eyebrow, fontWeight: leaf ? 700 : 400, color: leaf ? tokens.data.beforeNum : tokens.text.primary }}>
        {hop.d > 0 && <span style={{ color: tokens.text.muted }}>└ </span>}{hop.f}
      </span>
      {hop.note && <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: color(hop.tone) }}>{hop.note}</span>}
    </motion.div>
  )
}

const LAST = 0.9 + (hops.length - 1) * 0.45

export default function ImportChainScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Bundle forensics</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>One function. 357 KB.</MaskReveal>

      <Line delay={0.7} size={tokens.type.label} color={tokens.text.muted}>
        A dashboard snapshot asked for a single helper. Watch what came with it.
      </Line>

      <motion.div
        {...fadeIn({ delay: 0.85 })}
        style={{ position: 'relative', background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 8, padding: '18px 26px', width: 'min(840px, 92vw)', marginTop: '0.4vw' }}
      >
        {hops.map((hop, i) => (
          <Hop key={hop.f} hop={hop} delay={0.9 + i * 0.45} />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: LAST + 0.35, duration: 0.5, ease: ease.out }}
        style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: tokens.font.mono, fontWeight: 700, marginTop: '0.4vw' }}
      >
        <span style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: tokens.data.beforeNum }}>
          <CountUp to={357} suffix=" KB" delay={LAST + 0.35} duration={1.0} />
        </span>
        <span style={{ fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.data.beforeNum }}>on every page load</span>
      </motion.div>

      <Line delay={LAST + 1.4} size={tokens.type.label} color={tokens.text.muted}>
        …on a dashboard that never opens an editor. A module runs top-to-bottom — ask for one function, carry the whole file.
      </Line>
    </div>
  )
}
