import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Delta } from '../components/Ticker'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease, dur } from '../theme'
import { fadeUp, fadeIn, growX } from '../motion'

const TRACK = 400
const MAX = 48
const deferred = ['invoice-statuses', 'collection-statuses', 'invoice-dispute-types', 'invoice-followup-statuses', 'aging-data', 'high-risk-customers', '+ 21 more']

function BarRow({ tag, value, color, numColor, delay, delta }) {
  const w = (value / MAX) * TRACK
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', columnGap: 18, alignItems: 'center' }}>
      <motion.div {...fadeUp({ delay, y: 6 })} style={{ textAlign: 'right', fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>{tag}</motion.div>
      <div style={{ position: 'relative', height: 38, display: 'flex', alignItems: 'center' }}>
        <motion.div {...growX({ delay, duration: dur.slow })} style={{ width: w, height: 34, background: color, borderRadius: 5, transformOrigin: 'left' }} />
        <motion.div {...fadeIn({ delay: delay + 0.4 })} style={{ position: 'absolute', left: w + 14, display: 'flex', alignItems: 'baseline', gap: 12, whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: 'clamp(22px, 3vw, 36px)', color: numColor, whiteSpace: 'nowrap' }}>
            <CountUp to={value} delay={delay + 0.2} duration={1.2} /> calls
          </span>
          {delta && <Delta good delay={delay + 1.0}>{delta}</Delta>}
        </motion.div>
      </div>
    </div>
  )
}

export default function EagerBootScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Data fetching</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Eager Boot → Point-of-Use</MaskReveal>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 'min(880px, 94vw)', marginTop: '1vw' }}>
        <BarRow tag="Production · boot waterfall" value={48} color={tokens.data.beforeBar} numColor={tokens.data.beforeNum} delay={0.9} />
        <BarRow tag="New Bundle · point-of-use" value={21} color={tokens.data.afterBar} numColor={tokens.data.afterNum} delay={1.5} delta="−56%" />
      </div>

      <motion.div {...fadeIn({ delay: 2.4 })} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, width: 'min(800px, 92vw)', marginTop: '0.6vw' }}>
        <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted, marginRight: 4 }}>deferred:</span>
        {deferred.map((d, i) => (
          <motion.span key={d} {...fadeUp({ delay: 2.5 + i * 0.08, y: 6 })} style={{ fontFamily: tokens.font.mono, fontSize: 11, color: tokens.data.beforeNum, border: `1px solid ${tokens.data.beforeNum}`, borderRadius: 999, padding: '2px 9px' }}>{d}</motion.span>
        ))}
      </motion.div>

      <Line delay={3.4} size={tokens.type.label} color={tokens.text.muted}>
        Fetched only when the feature opens — React Query, deduped. None renders a dashboard tile.
      </Line>
    </div>
  )
}
