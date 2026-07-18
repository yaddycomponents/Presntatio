import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeUp, fadeIn, growXFade } from '../motion'

const SPAN = 700
const BAR_H = 54
const PER_GB = SPAN / 22
const HEAP_OLD = 12
const SWAP_OLD = 10
const HEAP_NEW = 4

const T_BARS = 1.0
const T_SWAP_GONE = 3.4
const T_SHRINK = 4.2
const T_LIST = 5.4

const removed = [
  'Set Swap Space · swap-size-gb: 10',
  '--max_old_space_size=12288',
  'getsentry/action-release job',
  'deploy-prod · staging · ps0 · zc-prod',
]

function Bar({ x, color, label, ...rest }) {
  return (
    <motion.div
      {...rest}
      style={{ position: 'absolute', left: x, top: 0, height: BAR_H, background: color, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      <span style={{ fontFamily: tokens.font.mono, fontSize: 13, fontWeight: 700, color: tokens.text.onDark, whiteSpace: 'nowrap' }}>{label}</span>
    </motion.div>
  )
}

function Struck({ text, delay }) {
  return (
    <motion.div
      {...fadeUp({ delay, y: 8, duration: 0.45 })}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start', padding: '5px 2px' }}
    >
      <span style={{ fontFamily: tokens.font.mono, fontSize: 14, color: tokens.text.muted }}>{text}</span>
      <motion.div
        {...growXFade({ delay: delay + 0.3, duration: 0.4 })}
        style={{ position: 'absolute', left: 0, right: 0, top: '52%', height: 2, background: tokens.data.beforeNum, transformOrigin: 'left' }}
      />
    </motion.div>
  )
}

export default function SafetyNetsScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Taking the scaffolding down</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>22 GB of safety net, removed</MaskReveal>

      <div style={{ position: 'relative', width: SPAN, height: BAR_H + 34, marginTop: '0.8vw' }}>
        <Bar
          x={0}
          color={tokens.data.beforeBar}
          label="node heap"
          initial={{ opacity: 0, width: HEAP_OLD * PER_GB }}
          animate={{ opacity: 1, width: [HEAP_OLD * PER_GB, HEAP_OLD * PER_GB, HEAP_NEW * PER_GB], backgroundColor: [tokens.data.beforeBar, tokens.data.beforeBar, tokens.data.afterBar] }}
          transition={{ delay: T_BARS, duration: T_SHRINK - T_BARS + 0.9, times: [0, (T_SHRINK - T_BARS) / (T_SHRINK - T_BARS + 0.9), 1], ease: ease.inOut }}
        />
        <Bar
          x={HEAP_OLD * PER_GB + 6}
          color={tokens.data.beforeNum}
          label="swap file · 10 GB — deleted"
          initial={{ opacity: 0, width: SWAP_OLD * PER_GB - 6 }}
          animate={{ opacity: [0, 1, 1, 0], x: [0, 0, 0, 40] }}
          transition={{ delay: T_BARS, duration: T_SWAP_GONE - T_BARS + 0.6, times: [0, 0.18, 0.72, 1], ease: ease.inOut }}
        />

        <motion.div
          {...fadeIn({ delay: T_BARS + 0.2 })}
          style={{ position: 'absolute', left: 0, top: BAR_H + 12, fontFamily: tokens.font.mono, fontSize: 13, fontWeight: 700, color: tokens.data.afterNum }}
        >
          <CountUp to={HEAP_NEW} from={HEAP_OLD} delay={T_SHRINK} duration={0.9} suffix=" GB" />
        </motion.div>
      </div>

      <motion.div
        {...fadeUp({ delay: T_SHRINK + 1.2, y: 10 })}
        style={{ width: SPAN, fontFamily: tokens.font.body, fontSize: tokens.type.rowLabel, color: tokens.text.primary, marginTop: '0.2vw' }}
      >
        Rolldown bundles in <strong>Rust</strong> — off the Node heap entirely.
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '0.6vw', width: SPAN }}>
        <motion.div
          {...fadeIn({ delay: T_LIST - 0.2 })}
          style={{ fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.eyebrow, marginBottom: 6 }}
        >
          deleted from CI
        </motion.div>
        {removed.map((r, i) => <Struck key={r} text={r} delay={T_LIST + i * 0.28} />)}
      </div>

      <div style={{ width: SPAN, marginTop: '0.5vw' }}>
        <Line delay={T_LIST + removed.length * 0.28 + 0.5} size={tokens.type.label} color={tokens.text.muted}>
          These were OOM safety nets for a bottleneck that no longer exists.
        </Line>
      </div>
    </div>
  )
}
