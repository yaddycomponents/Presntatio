import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn, fadeUp } from '../motion'

const ROW = 56
const BARH = 46
const BARW = 440
const BAND = 110
const layers = ['base', 'antd', 'growcomponents', 'overrides']
const topFor = (i) => BAND + (layers.length - 1 - i) * ROW
const STACK_BOTTOM = topFor(0) + BARH
const OVER_TOP = topFor(3)
const ANTD_TOP = topFor(1)
const CARD_TOP = 14
const H = STACK_BOTTOM

function CaptionBeat({ children, color, delay, dur }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 0] }}
      transition={{ delay, duration: dur, times: [0, 0.12, 0.84, 1], ease: ease.out }}
      style={{ position: 'absolute', width: '100%', textAlign: 'center', fontFamily: tokens.font.body, fontSize: tokens.type.rowLabel, color }}
    >
      {children}
    </motion.div>
  )
}

export default function LayerScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Styling</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Cascade layers decide</MaskReveal>

      <div style={{ position: 'relative', width: BARW + 200, height: H }}>
        {/* @layer bracket — the ordered system */}
        <motion.div {...fadeIn({ delay: 0.8 })} style={{ position: 'absolute', left: -32, top: OVER_TOP, width: 14, height: STACK_BOTTOM - OVER_TOP, borderLeft: `2px solid ${tokens.line}`, borderTop: `2px solid ${tokens.line}`, borderBottom: `2px solid ${tokens.line}` }} />
        <motion.div {...fadeIn({ delay: 0.8 })} style={{ position: 'absolute', left: -64, top: (OVER_TOP + STACK_BOTTOM) / 2 - 40, width: 80, textAlign: 'center', fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: tokens.text.muted, transform: 'rotate(-90deg)' }}>@layer · later wins ↑</motion.div>

        {/* layer rows */}
        {layers.map((name, i) => (
          <motion.div
            key={name}
            {...fadeUp({ delay: 0.9 + i * 0.14, y: 10 })}
            style={{ position: 'absolute', top: topFor(i), left: 0, width: BARW, height: BARH, border: `1.5px solid ${tokens.text.primary}`, background: tokens.bg.code, borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 18, gap: 12 }}
          >
            <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: tokens.text.muted }}>{i}</span>
            <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.text.primary }}>{name}</span>
          </motion.div>
        ))}

        {/* the unlayered antd card — appears OUTSIDE the bracket, then drops into the antd row */}
        <motion.div
          initial={{ top: CARD_TOP - 14, opacity: 0, left: 0 }}
          animate={{
            top: [CARD_TOP - 14, CARD_TOP, CARD_TOP, ANTD_TOP, ANTD_TOP],
            opacity: [0, 1, 1, 1, 1],
            backgroundColor: ['#e7c9cd', '#e7c9cd', '#e7c9cd', '#cdd8cb', '#cdd8cb'],
            borderColor: [tokens.data.beforeNum, tokens.data.beforeNum, tokens.data.beforeNum, tokens.data.afterNum, tokens.data.afterNum],
          }}
          transition={{ delay: 2.9, duration: 2.6, times: [0, 0.1, 0.62, 0.86, 1], ease: ease.inOut }}
          style={{ position: 'absolute', zIndex: 2, width: BARW, height: BARH, border: '1.5px solid', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}
        >
          <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.text.primary }}>antd v6 runtime CSS</span>
          <motion.span animate={{ opacity: [0, 1, 1, 0, 0] }} transition={{ delay: 2.9, duration: 2.6, times: [0, 0.1, 0.6, 0.72, 1] }} style={{ fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.data.beforeNum }}>unlayered ✕</motion.span>
          <motion.span animate={{ opacity: [0, 0, 0, 1, 1] }} transition={{ delay: 2.9, duration: 2.6, times: [0, 0.6, 0.78, 0.9, 1] }} style={{ position: 'absolute', right: 16, fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.data.afterNum }}>in antd layer ✓</motion.span>
        </motion.div>

        {/* the single WINS ring — moves to whoever currently wins */}
        <motion.div
          initial={{ top: OVER_TOP - 5, opacity: 0 }}
          animate={{ top: [OVER_TOP - 5, OVER_TOP - 5, CARD_TOP - 5, CARD_TOP - 5, OVER_TOP - 5, OVER_TOP - 5], opacity: [0, 1, 1, 1, 1, 1] }}
          transition={{ delay: 1.7, duration: 5.6, times: [0, 0.20, 0.26, 0.58, 0.64, 1], ease: ease.inOut }}
          style={{ position: 'absolute', left: -5, width: BARW + 10, height: BARH + 10, border: `2.5px solid ${tokens.data.afterNum}`, borderRadius: 9, pointerEvents: 'none' }}
        >
          <span style={{ position: 'absolute', right: -78, top: '50%', transform: 'translateY(-50%)', fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.data.afterNum }}>← wins</span>
        </motion.div>
      </div>

      <div style={{ position: 'relative', width: 'min(760px, 92vw)', height: 30, marginTop: '1.4vw' }}>
        <CaptionBeat color={tokens.text.primary} delay={1.7} dur={1.3}>Our layers are ordered — the last one always wins.</CaptionBeat>
        <CaptionBeat color={tokens.data.beforeNum} delay={3.0} dur={1.8}>But antd v6 injects unlayered CSS — outside every layer, it beats them all.</CaptionBeat>
        <CaptionBeat color={tokens.data.afterNum} delay={5.0} dur={2.4}>Force it into a layer (StyleProvider) — and our overrides win again.</CaptionBeat>
      </div>
    </div>
  )
}
