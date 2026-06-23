import { motion } from 'framer-motion'
import { Clock, Check, MousePointer2, Pencil } from 'lucide-react'
import { t, type, ease } from '../tokens'
import { Sparkle, Count, Eyebrow, Mask, rise, fade } from '../fx'
import { Thread, Msg } from '../mail'

function DraftChip({ delay }) {
  return (
    <motion.span {...fade({ delay })}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 11px', borderRadius: 999, background: t.warnSoft, color: t.warn, fontSize: 12.5, fontWeight: 600 }}>
      <Pencil size={12} strokeWidth={2.2} /> Draft · suggested
    </motion.span>
  )
}

export default function TodayScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.1vh' }}>
        <Eyebrow delay={0.2}><Sparkle size={14} delay={0.25} /> The bottleneck</Eyebrow>
        <div style={{ fontSize: type.h3, fontWeight: 700, color: t.ink, letterSpacing: '-0.01em' }}>
          <Mask delay={0.35}>Today, AI drafts — then waits for you</Mask>
        </div>
      </div>

      <Thread subject="Re: Copy of invoice INV-3221" w={840} delay={0.5}>
        <Msg initials="WH" color="#e0484d" name="William Hayes · ProCycle" time="10:11 AM" delay={0.8} divider={false}>
          Hi — could you send a copy of <b style={{ color: t.ink }}>INV-3221</b> for our records? Thanks.
        </Msg>

        <Msg ai name="Growfin AI" delay={1.4} badge={<DraftChip delay={1.7} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>Hi William, please find <b style={{ color: t.ink }}>INV-3221</b> attached. Let us know if you need anything else.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* the gate: a button that just waits */}
              <div style={{ position: 'relative' }}>
                <motion.div {...fade({ delay: 2.1 })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 10, background: t.primary, color: '#fff', fontSize: 14, fontWeight: 600 }}>
                  <Check size={16} strokeWidth={2.4} /> Approve &amp; Send
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.12], opacity: [0.5, 0] }}
                  transition={{ delay: 2.3, duration: 1.5, repeat: Infinity, ease: ease.out }}
                  style={{ position: 'absolute', inset: 0, borderRadius: 10, border: `2px solid ${t.primary}` }} />
                {/* hovering cursor that never clicks */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, -5, 0], x: [0, 3, 0] }}
                  transition={{ opacity: { delay: 2.5, duration: 0.4 }, y: { delay: 2.5, duration: 2, repeat: Infinity, ease: 'easeInOut' }, x: { delay: 2.5, duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
                  style={{ position: 'absolute', right: -16, bottom: -14 }}>
                  <MousePointer2 size={22} color={t.ink} fill={t.ink} />
                </motion.div>
              </div>
              <motion.span {...fade({ delay: 2.3 })} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: t.warn, fontWeight: 600 }}>
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ width: 7, height: 7, borderRadius: '50%', background: t.warn }} />
                awaiting your review
              </motion.span>
            </div>
          </div>
        </Msg>
      </Thread>

      {/* the cost — clock climbing */}
      <motion.div {...rise({ delay: 2.7, y: 12 })}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 24px', borderRadius: 999, background: t.panel, border: `1px solid ${t.border}`, boxShadow: t.shadowSoft }}>
        <Clock size={18} color={t.danger} strokeWidth={2} />
        <span style={{ fontSize: type.label, color: t.muted }}>Time to first reply</span>
        <span style={{ width: 1, height: 20, background: t.border }} />
        <span style={{ fontFamily: t.mono, fontSize: 'clamp(20px,2.2vw,30px)', fontWeight: 700, color: t.danger }}>
          <Count to={9} from={2} delay={2.9} d={1.8} suffix=" hrs" />
        </span>
      </motion.div>
    </div>
  )
}
