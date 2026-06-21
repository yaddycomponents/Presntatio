import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeUp, fadeIn, growX } from '../motion'

const W = 880
const BOXW = 116
const BOXH = 48
const MIDY = BOXH / 2

function centers(n) {
  const gap = (W - BOXW) / (n - 1)
  return Array.from({ length: n }, (_, i) => i * gap + BOXW / 2)
}

function Stage({ x, label, color, dim, delay }) {
  return (
    <motion.div
      {...fadeUp({ delay, y: 8 })}
      style={{
        position: 'absolute', left: x - BOXW / 2, top: 0, width: BOXW, height: BOXH,
        border: `1.5px solid ${color}`, background: dim ? 'transparent' : `${color}14`,
        opacity: dim ? 0.55 : 1, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 4,
      }}
    >
      <span style={{ fontFamily: tokens.font.mono, fontSize: 11, color, lineHeight: 1.1 }}>{label}</span>
    </motion.div>
  )
}

function Arrow({ x1, x2, color, delay }) {
  return (
    <div style={{ position: 'absolute', left: x1, top: MIDY, width: x2 - x1, height: 2 }}>
      <motion.div {...growX({ delay, duration: 0.3 })} style={{ width: '100%', height: 2, background: color, opacity: 0.5, transformOrigin: 'left' }} />
    </div>
  )
}

function Packet({ color, path, times, delay, duration, blink }) {
  return (
    <motion.div
      initial={{ left: path[0] - 7, opacity: 0 }}
      animate={blink ? { left: path, opacity: [0, 1, 1, 0, 1, 1], } : { left: path, opacity: [0, 1, 1] }}
      transition={{
        left: { delay, duration, ease: ease.inOut, times },
        opacity: { delay, duration, times: blink ? [0, 0.04, 0.44, 0.47, 0.5, 1] : [0, 0.06, 1] },
      }}
      style={{ position: 'absolute', top: MIDY - 7, width: 14, height: 14, borderRadius: 14, background: color, boxShadow: `0 0 0 4px ${color}33` }}
    />
  )
}

const roseStages = ['render', 'run JS', 'make CSS', 'inject <style>', 'recalc', 'paint']
const sageStages = ['build', 'extract .css', 'load .css', 'paint']

export default function CssFlowScene() {
  const rc = centers(6)
  const sc = centers(4)

  const roseBase = 0.7
  const rosePacketStart = roseBase + 6 * 0.1 + 0.3
  const sageBase = 1.3
  const sagePacketStart = sageBase + 4 * 0.1 + 0.4

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part C — Where styles are computed</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Styles out of JavaScript</MaskReveal>

      <div style={{ position: 'relative', width: W }}>
        <motion.div {...fadeIn({ delay: roseBase })} style={{ position: 'absolute', top: -26, left: 0, fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.data.beforeNum }}>
          CSS-in-JS · on the main thread, every render
        </motion.div>
        <div style={{ position: 'relative', height: BOXH + 50 }}>
          {rc.slice(0, -1).map((x, i) => <Arrow key={i} x1={x + BOXW / 2} x2={rc[i + 1] - BOXW / 2} color={tokens.data.beforeNum} delay={roseBase + i * 0.1 + 0.1} />)}
          {roseStages.map((label, i) => <Stage key={label} x={rc[i]} label={label} color={tokens.data.beforeNum} delay={roseBase + i * 0.1} />)}
          <Packet color={tokens.data.beforeNum} path={[rc[0] - 7, rc[5] - 7, rc[0] - 7, rc[5] - 7]} times={[0, 0.45, 0.47, 1]} delay={rosePacketStart} duration={2.8} blink />
          <svg style={{ position: 'absolute', left: 0, top: 0, width: W, height: BOXH + 50, overflow: 'visible', pointerEvents: 'none' }}>
            <motion.path
              d={`M ${rc[5]} ${BOXH} C ${rc[5]} ${BOXH + 44}, ${rc[0]} ${BOXH + 44}, ${rc[0]} ${BOXH}`}
              fill="none" stroke={tokens.data.beforeNum} strokeWidth={1.5} strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ delay: rosePacketStart + 1.2, duration: 0.6, ease: ease.out }}
            />
          </svg>
          <motion.div {...fadeIn({ delay: rosePacketStart + 1.5 })} style={{ position: 'absolute', left: W / 2 - 60, top: BOXH + 30, width: 120, textAlign: 'center', fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.data.beforeNum }}>
            ↻ every re-render
          </motion.div>
        </div>
      </div>

      <div style={{ position: 'relative', width: W }}>
        <motion.div {...fadeIn({ delay: sageBase })} style={{ position: 'absolute', top: -26, left: 0, fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.data.afterNum }}>
          Zero-runtime · once at build, then just load
        </motion.div>
        <div style={{ position: 'relative', height: BOXH + 16 }}>
          {sc.slice(0, -1).map((x, i) => <Arrow key={i} x1={x + BOXW / 2} x2={sc[i + 1] - BOXW / 2} color={tokens.data.afterNum} delay={sageBase + i * 0.1 + 0.1} />)}
          {sageStages.map((label, i) => <Stage key={label} x={sc[i]} label={label} color={tokens.data.afterNum} dim={i < 2} delay={sageBase + i * 0.1} />)}
          <motion.div {...fadeIn({ delay: sageBase + 0.3 })} style={{ position: 'absolute', left: sc[0] - BOXW / 2, top: -2, width: (sc[1] - sc[0]) + BOXW, textAlign: 'center', fontFamily: tokens.font.mono, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: tokens.text.muted }}>
          </motion.div>
          <Packet color={tokens.data.afterNum} path={[sc[2] - 7, sc[3] - 7]} times={[0, 1]} delay={sagePacketStart} duration={1.0} />
        </div>
      </div>

      <Line delay={sagePacketStart + 1.4} size={tokens.type.label} color={tokens.text.muted}>
        Runtime CSS recomputes on the main thread, every render. Zero-runtime does it once.
      </Line>
    </div>
  )
}
