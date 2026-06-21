import { motion } from 'framer-motion'
import Skeleton from '../components/Skeleton'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn } from '../motion'

const D0 = 0.8
const DUR = 6.8
// keyframe times (fractions of DUR) for the flow:
// table(p4) → click row → customer detail → Back → table(p4)
const tTable = [0, 0.05, 0.34, 0.40, 0.68, 0.73, 1]
const vTable = [0, 1, 1, 0, 0, 1, 1]
const tDetail = [0, 0.34, 0.40, 0.45, 0.68, 0.73, 1]
const vDetail = [0, 0, 0, 1, 1, 0, 0]

function kf(values, times) {
  return { initial: { opacity: values[0] }, animate: { opacity: values }, transition: { delay: D0, duration: DUR, times, ease: ease.inOut } }
}

function PageRow({ active }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((p) => (
        <div key={p} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, fontFamily: tokens.font.mono, fontSize: 13, color: p === active ? tokens.bg.primary : tokens.text.primary, background: p === active ? tokens.data.afterNum : 'transparent' }}>{p}</div>
      ))}
    </div>
  )
}

export default function UrlStateScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Experience</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Your place is in the URL</MaskReveal>

      {/* browser chrome */}
      <motion.div {...fadeIn({ delay: 0.6 })} style={{ display: 'flex', alignItems: 'center', gap: 12, width: 'min(680px, 94vw)', marginTop: '0.4vw' }}>
        <motion.span
          animate={{ scale: [1, 1, 0.8, 1], color: [tokens.text.muted, tokens.text.muted, tokens.data.afterNum, tokens.data.afterNum] }}
          transition={{ delay: D0 + 0.66 * DUR, duration: 0.6, times: [0, 0.1, 0.5, 1], ease: ease.out }}
          style={{ fontFamily: tokens.font.mono, fontSize: 20, color: tokens.text.muted }}
        >←</motion.span>
        <span style={{ fontFamily: tokens.font.mono, fontSize: 20, color: 'rgba(94,59,70,0.3)' }}>→</span>
        <div style={{ position: 'relative', flex: 1, height: 42, background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 999, display: 'flex', alignItems: 'center', paddingLeft: 18 }}>
          <motion.span {...kf(vTable, tTable)} style={{ position: 'absolute', left: 18, fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.text.primary }}>
            app.growfin.ai/aging<span style={{ color: tokens.data.afterNum }}>?page=4</span>
          </motion.span>
          <motion.span {...kf(vDetail, tDetail)} style={{ position: 'absolute', left: 18, fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.text.primary }}>
            app.growfin.ai/customers<span style={{ color: tokens.data.afterNum }}>/acme-corp</span>
          </motion.span>
        </div>
      </motion.div>

      {/* content frame */}
      <div style={{ position: 'relative', width: 'min(680px, 94vw)', height: 250, marginTop: '0.4vw' }}>
        {/* table (page 4) */}
        <motion.div {...kf(vTable, tTable)} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>Aging table</div>
          {[0, 1, 2].map((r) => (
            <motion.div
              key={r}
              animate={r === 1 ? { backgroundColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(91,125,119,0.16)', 'rgba(0,0,0,0)'] } : {}}
              transition={r === 1 ? { delay: D0, duration: DUR, times: [0, 0.27, 0.33, 0.42] } : {}}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 10px', borderRadius: 6 }}
            >
              <Skeleton circle w={28} h={28} />
              <Skeleton w="42%" h={11} />
              <div style={{ flex: 1 }} />
              <Skeleton w={70} h={20} radius={999} />
            </motion.div>
          ))}
          <div style={{ marginTop: 6 }}><PageRow active={4} /></div>
        </motion.div>

        {/* customer detail */}
        <motion.div {...kf(vDetail, tDetail)} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>Customer · Acme Corp</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Skeleton circle w={52} h={52} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              <Skeleton w="40%" h={14} />
              <Skeleton w="60%" h={10} />
            </div>
          </div>
          <Skeleton w="100%" h={60} />
          <Skeleton w="80%" h={12} />
        </motion.div>
      </div>

      <Line delay={D0 + DUR + 0.2} size={tokens.type.label} color={tokens.text.primary}>
        Open a customer from page 4, hit Back — you're still on page 4, not page 1.
      </Line>
    </div>
  )
}
