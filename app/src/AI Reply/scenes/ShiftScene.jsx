import { motion } from 'framer-motion'
import { t, type, ease } from '../tokens'
import { Sparkle, AiBadge, Eyebrow, Mask, rise, fade } from '../fx'
import { Thread, Msg, Attach, Composing, Sent } from '../mail'

export default function ShiftScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3.2vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2vh' }}>
        <Eyebrow delay={0.2}><Sparkle size={14} delay={0.25} /> The shift</Eyebrow>
        <div style={{ fontSize: type.h3, fontWeight: 700, color: t.ink, letterSpacing: '-0.01em' }}>
          <Mask delay={0.35}>The inbox now answers itself</Mask>
        </div>
      </div>

      <Thread subject="Re: Copy of invoice INV-3221" w={840} delay={0.5}>
        <Msg initials="WH" color="#e0484d" name="William Hayes · ProCycle" time="10:11 AM" delay={0.8} divider={false}>
          Hi — could you send a copy of <b style={{ color: t.ink }}>INV-3221</b> for our records? Thanks.
        </Msg>

        <Msg ai name="Growfin AI" time="10:11 AM" delay={1.5}
          badge={<AiBadge label="AI Replied" delay={2.7} />}>
          <div style={{ position: 'relative', minHeight: 96 }}>
            {/* composing state */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ delay: 1.7, duration: 1.1, times: [0, 0.15, 0.75, 1], ease: ease.inOut }}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 12, color: t.muted, fontSize: 15 }}>
              <Composing delay={1.7} /> Generating a grounded reply…
            </motion.div>
            {/* composed reply */}
            <motion.div {...fade({ delay: 2.7 })} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                Hi William, please find <b style={{ color: t.ink }}>INV-3221</b> attached. Let us know if you need anything else.
                <br /><span style={{ color: t.muted }}>— Finance Team, TI Cycles</span>
              </div>
              <Attach name="INV-3221.pdf" delay={3.0} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 2 }}>
                <Sent label="Sent automatically" delay={3.2} />
                <span style={{ width: 1, height: 16, background: t.border }} />
                <motion.span {...fade({ delay: 3.35 })} style={{ fontFamily: t.mono, fontSize: 13, color: t.muted }}>
                  no human touch
                </motion.span>
              </div>
            </motion.div>
          </div>
        </Msg>
      </Thread>

      {/* latency collapse */}
      <motion.div {...rise({ delay: 3.5, y: 12 })} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: type.label, color: t.muted }}>First reply</span>
        <span style={{ position: 'relative', fontFamily: t.mono, fontSize: 16, color: t.faint }}>
          2–9 hours
          <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 3.8, duration: 0.4, ease: ease.out }}
            style={{ position: 'absolute', left: 0, right: 0, top: '52%', height: 2, background: t.danger, transformOrigin: 'left' }} />
        </span>
        <svg width="30" height="13" viewBox="0 0 30 13" fill="none" stroke={t.muted} strokeWidth="1.5"><path d="M0 6.5 H26 M20 1 L26 6.5 L20 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span style={{ fontFamily: t.mono, fontSize: 'clamp(18px,1.8vw,24px)', fontWeight: 700, background: t.ai, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          under 60 seconds
        </span>
      </motion.div>
    </div>
  )
}
