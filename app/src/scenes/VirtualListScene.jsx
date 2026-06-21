import { motion } from 'framer-motion'
import Skeleton from '../components/Skeleton'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens } from '../theme'
import { fadeIn } from '../motion'

const FW = 560
const FH = 300
const PITCH = 58
const N = 8

function SkRow() {
  return (
    <div style={{ height: PITCH, display: 'flex', alignItems: 'center', gap: 14 }}>
      <Skeleton circle w={36} h={36} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <Skeleton w="48%" h={11} />
        <Skeleton w="30%" h={9} />
      </div>
      <Skeleton w={64} h={22} radius={999} />
    </div>
  )
}

export default function VirtualListScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Experience</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Render only what's in view</MaskReveal>

      <motion.div {...fadeIn({ delay: 0.7 })} style={{ position: 'relative', width: FW, height: FH, background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 12, overflow: 'hidden', marginTop: '0.4vw' }}>
        <div style={{ position: 'absolute', inset: 0, padding: '8px 22px 8px 16px' }}>
          <motion.div
            animate={{ y: [0, -PITCH] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: N }).map((_, i) => <SkRow key={i} />)}
          </motion.div>
        </div>

        {/* scrollbar — tiny thumb signals a huge list */}
        <div style={{ position: 'absolute', top: 8, right: 6, bottom: 8, width: 5, borderRadius: 5, background: 'rgba(94,59,70,0.08)' }}>
          <motion.div
            animate={{ top: ['4%', '12%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', left: 0, width: 5, height: '14%', borderRadius: 5, background: tokens.data.afterNum }}
          />
        </div>

        <motion.div {...fadeIn({ delay: 1.0 })} style={{ position: 'absolute', top: 10, left: 16, fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.text.muted, background: tokens.bg.code, padding: '2px 6px', borderRadius: 4 }}>
          ~1,000 cards · ~10 in the DOM
        </motion.div>
      </motion.div>

      <Line delay={1.2} size={tokens.type.label} color={tokens.text.muted}>
        Activity feed and filter-option lists are virtualized — smooth past thousands, with steady memory.
      </Line>
    </div>
  )
}
