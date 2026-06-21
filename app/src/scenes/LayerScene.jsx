import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn, fadeUp } from '../motion'

const ROW = 54
const BARH = 44
const BARW = 440
const BAND = 96
const layers = ['base', 'antd', 'growcomponents', 'overrides']
const topFor = (i) => BAND + (layers.length - 1 - i) * ROW
const OVERRIDES_C = topFor(3) + BARH / 2
const ANTD_TOP = topFor(1)
const CHIP_TOP = 16
const CHIP_C = CHIP_TOP + BARH / 2
const CHIPW = 300
const H = BAND + layers.length * ROW

function CaptionBeat({ children, color, delay, dur }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 0] }}
      transition={{ delay, duration: dur, times: [0, 0.14, 0.82, 1], ease: ease.out }}
      style={{ position: 'absolute', width: '100%', textAlign: 'center', fontFamily: tokens.font.body, fontSize: tokens.type.rowLabel, color }}
    >
      {children}
    </motion.div>
  )
}

export default function LayerScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.8vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part C — Who wins</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Cascade layers decide</MaskReveal>

      <motion.div {...fadeIn({ delay: 0.6 })} style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.text.primary }}>
        @layer base, antd, growcomponents, overrides;
        <span style={{ color: tokens.text.muted }}>  /* later wins → */</span>
      </motion.div>

      <div style={{ position: 'relative', width: BARW, height: H }}>
        {layers.map((name, i) => (
          <motion.div
            key={name}
            {...fadeUp({ delay: 0.9 + i * 0.14, y: 10 })}
            style={{
              position: 'absolute', top: topFor(i), left: 0, width: BARW, height: BARH,
              border: `1.5px solid ${tokens.text.primary}`, background: tokens.bg.code, borderRadius: 6,
              display: 'flex', alignItems: 'center', paddingLeft: 18, gap: 12,
            }}
          >
            <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: tokens.text.muted }}>{i}</span>
            <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.text.primary }}>{name}</span>
          </motion.div>
        ))}

        <motion.div
          initial={{ top: CHIP_TOP - 24, opacity: 0, left: (BARW - CHIPW) / 2 }}
          animate={{
            top: [CHIP_TOP - 24, CHIP_TOP, CHIP_TOP, ANTD_TOP, ANTD_TOP],
            opacity: [0, 1, 1, 1, 1],
            backgroundColor: ['rgba(168,83,106,0.16)', 'rgba(168,83,106,0.16)', 'rgba(168,83,106,0.16)', 'rgba(91,125,119,0.16)', 'rgba(91,125,119,0.16)'],
            borderColor: [tokens.data.beforeNum, tokens.data.beforeNum, tokens.data.beforeNum, tokens.data.afterNum, tokens.data.afterNum],
          }}
          transition={{ delay: 2.9, duration: 2.4, times: [0, 0.12, 0.62, 0.86, 1], ease: ease.inOut }}
          style={{ position: 'absolute', width: CHIPW, height: BARH, border: '1.5px solid', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color: tokens.text.primary }}>antd v6 runtime CSS</span>
          <motion.span animate={{ opacity: [0, 1, 1, 0, 0] }} transition={{ delay: 2.9, duration: 2.4, times: [0, 0.12, 0.6, 0.72, 1] }} style={{ fontFamily: tokens.font.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.data.beforeNum, border: `1px solid ${tokens.data.beforeNum}`, borderRadius: 3, padding: '1px 5px' }}>unlayered ✕</motion.span>
          <motion.span animate={{ opacity: [0, 0, 0, 1, 1] }} transition={{ delay: 2.9, duration: 2.4, times: [0, 0.6, 0.78, 0.9, 1] }} style={{ fontFamily: tokens.font.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.data.afterNum, border: `1px solid ${tokens.data.afterNum}`, borderRadius: 3, padding: '1px 5px' }}>in its layer ✓</motion.span>
        </motion.div>

        <motion.div
          initial={{ top: OVERRIDES_C - 13, opacity: 0 }}
          animate={{ top: [OVERRIDES_C - 13, OVERRIDES_C - 13, CHIP_C - 13, CHIP_C - 13, OVERRIDES_C - 13], opacity: [0, 1, 1, 1, 1] }}
          transition={{ delay: 1.7, duration: 4.0, times: [0, 0.30, 0.38, 0.74, 0.82], ease: ease.inOut }}
          style={{ position: 'absolute', left: BARW + 20, width: 84, height: 26, borderRadius: 999, background: tokens.data.afterNum, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: tokens.bg.primary }}>✓ wins</span>
        </motion.div>

        <motion.div
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: 3.1, duration: 1.5, times: [0, 0.18, 0.78, 1] }}
          style={{ position: 'absolute', top: H + 10, left: 0, width: BARW, display: 'flex', justifyContent: 'center', gap: 10 }}
        >
          {['clear-icon', 'skeleton overflow', 'washed-out tags'].map((s) => (
            <span key={s} style={{ fontFamily: tokens.font.mono, fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase', color: tokens.data.beforeNum, border: `1px solid ${tokens.data.beforeNum}`, borderRadius: 3, padding: '2px 6px' }}>{s}</span>
          ))}
        </motion.div>
      </div>

      <div style={{ position: 'relative', width: 'min(720px, 92vw)', height: 30, marginTop: '2vw' }}>
        <CaptionBeat color={tokens.text.primary} delay={1.7} dur={1.2}>Later layer wins — no specificity wars.</CaptionBeat>
        <CaptionBeat color={tokens.data.beforeNum} delay={2.9} dur={1.6}>But antd v6 injects unlayered CSS — it beats every layer.</CaptionBeat>
        <CaptionBeat color={tokens.data.afterNum} delay={4.7} dur={2.2}>Wrap antd in StyleProvider layer → overrides win again.</CaptionBeat>
      </div>
    </div>
  )
}
