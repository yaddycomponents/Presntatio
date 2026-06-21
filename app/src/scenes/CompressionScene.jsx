import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, Line } from '../components/Text'
import { tokens, ease, dur } from '../theme'
import { fadeUp, fadeIn, growXFade } from '../motion'

const BIG = 190
const SMALL = 82
const SPAN = 720
const START_X = 0
const END_X = SPAN - SMALL
const START_Y = 0
const END_Y = (BIG - SMALL) / 2

const byteGrid = `repeating-linear-gradient(0deg, rgba(94,59,70,0.16) 0 1px, transparent 1px 13px),
  repeating-linear-gradient(90deg, rgba(94,59,70,0.16) 0 1px, transparent 1px 13px)`

function Ghost({ x, y, size, color, delay }) {
  return (
    <motion.div
      {...fadeIn({ delay })}
      style={{ position: 'absolute', left: x, top: y, width: size, height: size, border: `2px dashed ${color}`, borderRadius: 4, opacity: 0.5 }}
    />
  )
}

function Caption({ x, y, w, color, label, value, decimals, delay }) {
  return (
    <motion.div
      {...fadeUp({ delay, y: 10 })}
      style={{ position: 'absolute', left: x, top: y, width: w, textAlign: 'center' }}
    >
      <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color }}>{label}</div>
      <div style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.metric, color }}>
        <CountUp to={value} decimals={decimals} suffix=" MB" delay={delay} duration={1.1} />
      </div>
    </motion.div>
  )
}

export default function CompressionScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Diamond size={9} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Payoff · Reading the numbers honestly</Kicker>
        <Diamond size={9} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <div style={{ position: 'relative', width: SPAN, height: BIG + 70 }}>
        <Ghost x={START_X} y={START_Y} size={BIG} color={tokens.data.beforeBar} delay={0.5} />
        <Ghost x={END_X} y={END_Y} size={SMALL} color={tokens.data.afterBar} delay={1.0} />

        <motion.div
          initial={{ x: START_X, y: START_Y, width: BIG, height: BIG, backgroundColor: tokens.data.beforeBar }}
          animate={{
            x: [START_X, END_X], y: [START_Y, END_Y],
            width: [BIG, SMALL], height: [BIG, SMALL],
            backgroundColor: [tokens.data.beforeBar, tokens.data.afterBar],
          }}
          transition={{ delay: 1.4, duration: 1.5, ease: ease.inOut }}
          style={{ position: 'absolute', borderRadius: 4, backgroundImage: byteGrid, backgroundBlendMode: 'overlay' }}
        />

        <motion.div
          {...fadeIn({ delay: 1.0 })}
          style={{ position: 'absolute', left: BIG + 30, top: BIG / 2 - 26, width: END_X - BIG - 20, textAlign: 'center' }}
        >
          <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>gzip + brotli</div>
          <motion.div {...growXFade({ delay: 1.6 })} style={{ height: 2, background: tokens.line, marginTop: 10, transformOrigin: 'left' }} />
          <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginTop: 6 }}>across the network →</div>
        </motion.div>

        <Caption x={START_X - 20} y={BIG + 14} w={BIG + 40} color={tokens.data.beforeNum} label="Raw" value={13.0} decimals={1} delay={0.7} />
        <Caption x={END_X - 50} y={BIG + 14} w={SMALL + 100} color={tokens.data.afterNum} label="Over the wire" value={2.45} decimals={2} delay={2.6} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Line delay={3.0} size={tokens.type.rowLabel} color={tokens.text.muted}>
          Transferred = the bytes that actually reach the browser.
        </Line>

        <div style={{ width: 'min(46vw, 520px)' }}>
          <div style={{ display: 'flex', height: 22, borderRadius: 4, overflow: 'hidden' }}>
            <motion.div {...growXFade({ delay: 3.3 })} style={{ flex: 2, background: tokens.data.afterBar, transformOrigin: 'left' }} />
            <motion.div {...growXFade({ delay: 3.5 })} style={{ flex: 1, background: tokens.data.peach, transformOrigin: 'left' }} />
          </div>
          <motion.div {...fadeIn({ delay: 3.6 })} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase' }}>
            <span style={{ color: tokens.data.afterNum }}>≈ ⅔ less code</span>
            <span style={{ color: tokens.text.muted }}>⅓ compression</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
