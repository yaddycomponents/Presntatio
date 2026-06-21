import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Flash, Delta } from '../components/Ticker'
import { Kicker } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp, fadeIn, growXFade } from '../motion'

const GRID = 'minmax(200px, 1fr) 160px 40px 178px 120px'

const rows = [
  { label: 'Dashboard Load', before: '2.19 s', after: { to: 0.755, decimals: 3, suffix: ' s' }, delta: '−65%' },
  { label: 'Total transferred', before: '13.0 MB', after: { to: 2.45, decimals: 2, suffix: ' MB' }, delta: '−81%' },
  { label: 'vendor chunk', before: '~10 MB', after: { to: 1.75, decimals: 2, suffix: ' MB' }, delta: '−82%' },
  { label: 'Largest Paint', before: '6.07 s', after: { to: 2.92, decimals: 2, suffix: ' s' }, delta: '−52%' },
  { label: 'Boot API calls', before: '~30', after: { to: 14, decimals: 0 }, delta: '−53%' },
  { label: 'Filter-layer code', before: '18.8k', after: { to: 6.5, decimals: 1, suffix: 'k' }, delta: '−65%' },
]

function HairLine({ delay }) {
  return (
    <motion.div
      {...growXFade({ delay })}
      style={{ gridColumn: '1 / -1', height: 1, background: tokens.line, transformOrigin: 'center' }}
    />
  )
}

function Cell({ children, color, align = 'center', mono = true, size = tokens.type.metric }) {
  return (
    <div style={{ fontFamily: mono ? tokens.font.mono : tokens.font.body, color, textAlign: align, fontSize: size, fontWeight: mono ? 700 : 400 }}>
      {children}
    </div>
  )
}

function Row({ row, delay }) {
  const countDelay = delay + 0.15
  return (
    <>
      <motion.div {...fadeUp({ delay, y: 14 })} style={{ display: 'contents' }}>
        <Cell color={tokens.text.primary} align="right" mono={false} size={tokens.type.rowLabel}>{row.label}</Cell>
        <Cell color={tokens.data.beforeNum}>{row.before}</Cell>
        <div style={{ textAlign: 'center', color: tokens.text.muted, fontFamily: tokens.font.mono, fontSize: tokens.type.metric }}>→</div>
        <div style={{ textAlign: 'center' }}>
          <Flash good delay={countDelay} style={{ color: tokens.data.afterNum, fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.metric }}>
            <CountUp to={row.after.to} decimals={row.after.decimals} suffix={row.after.suffix || ''} delay={countDelay} duration={1.2} />
          </Flash>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Delta good delay={countDelay + 0.4}>{row.delta}</Delta>
        </div>
      </motion.div>
      <HairLine delay={delay + 0.2} />
    </>
  )
}

export default function HeadlineScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Diamond size={9} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Payoff · By the numbers</Kicker>
        <Diamond size={9} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: GRID, alignItems: 'center', columnGap: 22, rowGap: 16 }}>
        <motion.div {...fadeIn({ delay: 0.5 })} style={{ display: 'contents' }}>
          <div />
          <div style={{ textAlign: 'center', fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.data.beforeNum }}>Before</div>
          <div />
          <div style={{ textAlign: 'center', fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.data.afterNum }}>After</div>
          <div />
        </motion.div>

        {rows.map((row, i) => (
          <Row key={row.label} row={row} delay={0.8 + i * 0.24} />
        ))}
      </div>
    </div>
  )
}
