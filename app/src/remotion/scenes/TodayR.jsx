import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { Clock, Check, MousePointer2, Pencil } from 'lucide-react'
import { t, type } from '../../AI Reply/tokens.js'
import { Sparkle, Mask, fadeS, riseS, sec } from '../anim.jsx'
import { Eyebrow, Count } from '../ui.jsx'
import { Thread, Msg } from '../mail.jsx'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

function DraftChip({ delay }) {
  const f = useCurrentFrame()
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 11px', borderRadius: 999, background: t.warnSoft, color: t.warn, fontSize: 12.5, fontWeight: 600, ...fadeS(f, delay) }}>
      <Pencil size={12} strokeWidth={2.2} /> Draft · suggested
    </span>
  )
}

export const TodayR = () => {
  const f = useCurrentFrame()
  const ringStart = sec(2.3), period = sec(1.5)
  const rp = f > ringStart ? ((f - ringStart) % period) / period : 0
  const cf = f - sec(2.5)
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '3vh' }}>
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
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 10, background: t.primary, color: '#fff', fontSize: 14, fontWeight: 600, ...fadeS(f, 2.1) }}>
                  <Check size={16} strokeWidth={2.4} /> Approve &amp; Send
                </div>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 10, border: `2px solid ${t.primary}`, transform: `scale(${1 + 0.12 * rp})`, opacity: f > ringStart ? 0.5 * (1 - rp) : 0 }} />
                <div style={{ position: 'absolute', right: -16, bottom: -14, opacity: interpolate(f, [sec(2.5), sec(2.5) + 12], [0, 1], clamp), transform: `translate(${Math.sin(cf / 16) * 3}px, ${Math.sin(cf / 16) * -5}px)` }}>
                  <MousePointer2 size={22} color={t.ink} fill={t.ink} />
                </div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, color: t.warn, fontWeight: 600, ...fadeS(f, 2.3) }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.warn, opacity: 0.4 + 0.6 * Math.abs(Math.sin((f - sec(2.3)) / 14)) }} />
                awaiting your review
              </span>
            </div>
          </div>
        </Msg>
      </Thread>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 24px', borderRadius: 999, background: t.panel, border: `1px solid ${t.border}`, boxShadow: t.shadowSoft, ...riseS(f, 2.7, 12) }}>
        <Clock size={18} color={t.danger} strokeWidth={2} />
        <span style={{ fontSize: type.label, color: t.muted }}>Time to first reply</span>
        <span style={{ width: 1, height: 20, background: t.border }} />
        <span style={{ fontFamily: t.mono, fontSize: 'clamp(20px,2.2vw,30px)', fontWeight: 700, color: t.danger }}>
          <Count to={9} from={2} delay={2.9} d={1.8} suffix=" hrs" />
        </span>
      </div>
    </AbsoluteFill>
  )
}
