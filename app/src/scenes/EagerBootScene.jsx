import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Delta } from '../components/Ticker'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease, dur } from '../theme'
import { fadeUp, fadeIn, growX } from '../motion'

const PRUNE = 3.4
const TRACKMAX = 280

const rows = [
  { name: 'config', kb: 0.5 },
  { name: 'current-user', kb: 1.7 },
  { name: 'accounts', kb: 1.0 },
  { name: 'ui-config', kb: 1.4 },
  { name: 'features', kb: 1.1 },
  { name: 'status', kb: 0.7 },
  { name: 'dashboard-snapshot', kb: 1.3 },
  { name: 'business-units', kb: 0.8 },
  { name: 'regions', kb: 0.9 },
  { name: 'email_template_folders', kb: 38.9, cut: 'never on a dashboard' },
  { name: 'subsidiaries', kb: 1.2, cut: 'feature-only' },
  { name: 'accounts', kb: 1.0, cut: 'duplicate' },
  { name: 'business-units', kb: 0.8, cut: 'duplicate' },
  { name: 'status', kb: 0.7, cut: 'duplicate' },
]
const barW = (kb) => 16 + Math.min(TRACKMAX, (kb / 40) * TRACKMAX)

function Row({ row, i }) {
  const cut = !!row.cut
  const color = cut ? tokens.data.beforeBar : tokens.data.afterBar
  const enter = 0.9 + i * 0.08
  return (
    <motion.div
      initial={{ opacity: cut ? 1 : 1 }}
      animate={{ opacity: cut ? [1, 1, 0.28] : 1 }}
      transition={cut ? { delay: PRUNE, duration: 0.6, times: [0, 0.01, 1] } : {}}
      style={{ display: 'grid', gridTemplateColumns: '210px 1fr', columnGap: 14, alignItems: 'center', height: 24 }}
    >
      <motion.div {...fadeUp({ delay: enter, y: 4 })} style={{ position: 'relative', textAlign: 'right', fontFamily: tokens.font.mono, fontSize: 11, color: tokens.text.primary, whiteSpace: 'nowrap' }}>
        {row.name}
        {cut && <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: PRUNE, duration: 0.4, ease: ease.out }} style={{ position: 'absolute', right: 0, top: '50%', width: '100%', height: 1, background: tokens.data.beforeNum, transformOrigin: 'right' }} />}
      </motion.div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <motion.div {...growX({ delay: enter, duration: dur.base })} style={{ width: barW(row.kb), height: 14, background: color, borderRadius: 3, transformOrigin: 'left' }} />
        {row.kb > 5 && <motion.span {...fadeIn({ delay: enter + 0.3 })} style={{ fontFamily: tokens.font.mono, fontSize: 10, color: tokens.data.beforeNum }}>{row.kb} kB</motion.span>}
        {cut && <motion.span {...fadeIn({ delay: PRUNE })} style={{ fontFamily: tokens.font.mono, fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase', color: tokens.data.beforeNum, border: `1px solid ${tokens.data.beforeNum}`, borderRadius: 3, padding: '1px 5px' }}>{row.cut}</motion.span>}
      </div>
    </motion.div>
  )
}

export default function EagerBootScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Data fetching</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Only what the dashboard needs</MaskReveal>

      <motion.div {...fadeIn({ delay: 0.7 })} style={{ display: 'flex', alignItems: 'baseline', gap: 12, fontFamily: tokens.font.mono, fontWeight: 700 }}>
        <span style={{ fontSize: 'clamp(24px, 3.4vw, 44px)', color: tokens.data.afterNum }}>
          <CountUp to={20} from={56} delay={PRUNE} duration={1.0} /> calls on boot
        </span>
        <Delta good delay={PRUNE + 0.6}>−64%</Delta>
      </motion.div>

      <motion.div {...fadeIn({ delay: 0.85 })} style={{ background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 8, padding: '16px 24px', width: 'min(760px, 94vw)', display: 'flex', flexDirection: 'column', gap: 6, marginTop: '0.3vw' }}>
        {rows.map((row, i) => <Row key={`${row.name}-${i}`} row={row} i={i} />)}
      </motion.div>

      <div style={{ position: 'relative', width: 'min(760px, 92vw)', height: 28, marginTop: '0.6vw' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ delay: 1.3, duration: 2.0, times: [0, 0.1, 0.85, 1] }} style={{ position: 'absolute', width: '100%', textAlign: 'center', fontFamily: tokens.font.body, fontSize: tokens.type.label, color: tokens.text.muted }}>
          Production fires it all on boot — duplicates, and a 38 kB email-template list.
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1] }} transition={{ delay: PRUNE + 0.2, duration: 2.0, times: [0, 0.12, 1] }} style={{ position: 'absolute', width: '100%', textAlign: 'center', fontFamily: tokens.font.body, fontSize: tokens.type.label, color: tokens.text.primary }}>
          Deduped & deferred to point-of-use — only calls that render a tile remain.
        </motion.div>
      </div>
    </div>
  )
}
