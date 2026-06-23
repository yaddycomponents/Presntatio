import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Mail, Clock, Zap } from 'lucide-react'
import { t, type } from '../../AI Reply/tokens.js'
import { Sparkle, Grad, Mask, fadeS, riseS, popS, sec } from '../anim.jsx'
import { Eyebrow, Count } from '../ui.jsx'

function Tile({ on, delay }) {
  const f = useCurrentFrame()
  const ringStart = sec(delay + 0.3), period = sec(1.6)
  const rp = f > ringStart ? ((f - ringStart) % period) / period : 0
  return (
    <div style={{ position: 'relative', width: 56, height: 56, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? t.ai : t.panel, border: on ? 'none' : `1px solid ${t.border}`, boxShadow: on ? '0 8px 20px rgba(83,29,171,0.22)' : t.shadowSoft, ...popS(f, delay) }}>
      <Mail size={21} color={on ? '#fff' : t.faint} strokeWidth={1.8} />
      {on && (
        <>
          <div style={{ position: 'absolute', top: -7, right: -7, width: 18, height: 18, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.shadowSoft, ...popS(f, delay + 0.2) }}>
            <Sparkle size={11} delay={delay + 0.25} />
          </div>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 13, border: `1.5px solid ${t.aiPink}`, transform: `scale(${0.96 + 0.34 * rp})`, opacity: f > ringStart ? 0.4 * (1 - rp) : 0 }} />
        </>
      )}
    </div>
  )
}

function MiniStat({ Icon, children, label, delay }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...riseS(f, delay, 10) }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: t.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={17} color={t.primary} strokeWidth={1.9} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: t.mono, fontSize: 'clamp(16px,1.5vw,22px)', fontWeight: 700, color: t.ink, lineHeight: 1.1 }}>{children}</span>
        <span style={{ fontSize: 12.5, color: t.muted }}>{label}</span>
      </div>
    </div>
  )
}

export const ImpactR = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2.8vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
        <Eyebrow delay={0.2}><Sparkle size={14} delay={0.25} /> The impact</Eyebrow>
        <div style={{ fontSize: type.h3, fontWeight: 700, color: t.ink, letterSpacing: '-0.01em' }}>
          <Mask delay={0.35}>What it gives back</Mask>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 11 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => <Tile key={i} on={i === 2} delay={0.7 + i * 0.08} />)}
        </div>
        <div style={{ fontSize: type.body, color: t.muted, textAlign: 'center', ...fadeS(f, 1.5) }}>
          <Grad style={{ fontWeight: 700 }}>≈ 1 in 6</Grad> customer emails — answered with <span style={{ color: t.ink, fontWeight: 600 }}>no human touch</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 44, alignItems: 'center' }}>
        <MiniStat Icon={Mail} label="emails / month, hands-free" delay={1.8}><Count to={300} from={250} prefix="~" delay={1.9} /></MiniStat>
        <span style={{ width: 1, height: 38, background: t.border }} />
        <MiniStat Icon={Clock} label="hours / month, per specialist" delay={1.95}><Count to={12} from={10} suffix="h" delay={2.05} /></MiniStat>
        <span style={{ width: 1, height: 38, background: t.border }} />
        <MiniStat Icon={Zap} label="first reply, from 2–9 hrs" delay={2.1}>&lt;60s</MiniStat>
      </div>
      <div style={{ fontSize: type.micro, fontFamily: t.mono, letterSpacing: '0.06em', color: t.faint, ...fadeS(f, 2.5) }}>
        MEASURED ON TWO PRODUCTION SAMPLES — FLOCK FREIGHT & MOTIVE
      </div>
    </AbsoluteFill>
  )
}
