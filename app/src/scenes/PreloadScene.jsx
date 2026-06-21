import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp, fadeIn, growX } from '../motion'

const LABEL = 168
const GAP = 22
const TRACK = 470
const TRACK_X = LABEL + GAP
const T = 1.7
const BAR_H = 16
const ROW = 26

const without = {
  title: 'Without preload',
  color: tokens.data.beforeBar,
  ink: tokens.data.beforeNum,
  bars: [
    { start: 0, dur: 0.22 },
    { start: 0.22, dur: 0.22 },
    { start: 0.44, dur: 0.26 },
  ],
  ready: 0.7,
}

const withp = {
  title: 'With preload',
  color: tokens.data.afterBar,
  ink: tokens.data.afterNum,
  bars: [
    { start: 0, dur: 0.22 },
    { start: 0, dur: 0.22 },
    { start: 0, dur: 0.26 },
  ],
  ready: 0.26,
}

function Flow({ data, base }) {
  const H = data.bars.length * ROW
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${LABEL}px ${TRACK}px`, columnGap: GAP, alignItems: 'center' }}>
      <motion.div {...fadeUp({ delay: base, y: 8 })} style={{ textAlign: 'right', fontFamily: tokens.font.mono, fontSize: tokens.type.label, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: data.ink }}>
        {data.title}
      </motion.div>

      <div style={{ position: 'relative', height: H }}>
        {data.bars.map((b, i) => (
          <motion.div
            key={i}
            {...growX({ delay: base + b.start * T, duration: Math.max(0.3, b.dur * T) })}
            style={{ position: 'absolute', top: i * ROW, left: b.start * TRACK, width: b.dur * TRACK, height: BAR_H, background: data.color, borderRadius: 3, transformOrigin: 'left' }}
          />
        ))}

        <motion.div
          {...fadeIn({ delay: base + data.ready * T })}
          style={{ position: 'absolute', left: data.ready * TRACK, top: -6, height: H + 12, width: 0, borderLeft: `2px dashed ${data.ink}` }}
        >
          <span style={{ position: 'absolute', top: -16, left: 7, whiteSpace: 'nowrap', fontFamily: tokens.font.mono, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: data.ink }}>page ready</span>
        </motion.div>
      </div>
    </div>
  )
}

export default function PreloadScene() {
  const baseA = 0.8
  const baseB = baseA + without.ready * T + 0.4
  const savedDelay = baseB + withp.ready * T + 0.4
  const x0 = TRACK_X + withp.ready * TRACK
  const x1 = TRACK_X + without.ready * TRACK

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Smarter loading</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>What preload does</MaskReveal>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <Flow data={without} base={baseA} />
        <Flow data={withp} base={baseB} />

        <motion.div {...fadeIn({ delay: savedDelay })} style={{ position: 'absolute', left: x0, top: '100%', marginTop: 14, width: x1 - x0 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 1, height: 10, background: tokens.data.afterNum }} />
            <motion.div {...growX({ delay: savedDelay })} style={{ flex: 1, height: 2, background: tokens.data.afterNum, transformOrigin: 'left' }} />
            <div style={{ width: 1, height: 10, background: tokens.data.afterNum }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 6, fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.data.afterNum }}>
            ready sooner
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: '3vw' }}>
        <Line delay={savedDelay + 0.3} size={tokens.type.rowLabel} color={tokens.text.primary}>
          Without it, the browser finds files one after another.
        </Line>
        <Line delay={savedDelay + 0.6} size={tokens.type.rowLabel} color={tokens.text.primary}>
          Preload grabs the important ones <em>at once</em> — so the page starts sooner.
        </Line>
      </div>
    </div>
  )
}
