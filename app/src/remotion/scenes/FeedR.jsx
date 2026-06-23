import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { MessageSquareWarning, CircleCheck } from 'lucide-react'
import { t } from '../../AI Reply/tokens.js'
import { Sparkle, Grad, fadeS, riseS, sec, EASE_INOUT } from '../anim.jsx'
import { Bar } from '../ui.jsx'
import { Tab, Dot, Caption } from '../Shell.jsx'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

function Chip({ kind, delay }) {
  const cfg = kind === 'dispute'
    ? { Icon: MessageSquareWarning, c: t.danger, bg: t.dangerSoft }
    : { Icon: CircleCheck, c: t.primary, bg: t.primarySoft }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 8, background: cfg.bg }}>
      <cfg.Icon size={15} color={cfg.c} strokeWidth={2} />
      <Bar w={kind === 'dispute' ? 46 : 32} h={7} delay={delay} shimmer={false} />
    </div>
  )
}

function Card({ kind, ai, delay }) {
  const f = useCurrentFrame()
  return (
    <div style={{ position: 'relative', background: ai ? undefined : t.panel, borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 13, boxShadow: t.shadowSoft, border: `1px solid ${ai ? 'transparent' : t.border}`, ...riseS(f, delay, 14) }}>
      {ai && <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: t.aiSoft, border: '1px solid rgba(235,47,150,0.22)' }} />}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Chip kind={kind} delay={delay + 0.05} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 52, height: 22, borderRadius: 6, background: kind === 'dispute' ? t.dangerSoft : t.primarySoft }} />
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <Bar w="40%" h={10} delay={delay + 0.1} />
        <Bar w="26%" h={7} lite delay={delay + 0.15} />
      </div>
      <div style={{ position: 'relative', height: 1, background: ai ? 'rgba(235,47,150,0.15)' : t.border }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 9 }}>
        {ai ? (
          <>
            <Sparkle size={16} delay={delay + 0.2} />
            <Grad style={{ fontSize: 13.5, fontWeight: 600 }}>Growfin AI</Grad>
            <span style={{ fontSize: 13, color: t.faint }}>created this activity</span>
          </>
        ) : (
          <><Dot size={22} /><Bar w={160} h={7} lite delay={delay + 0.2} /></>
        )}
        <div style={{ flex: 1 }} />
        <Bar w={50} h={7} lite delay={delay + 0.2} shimmer={false} />
      </div>
    </div>
  )
}

function GroupLabel({ children, delay }) {
  const f = useCurrentFrame()
  return <div style={{ alignSelf: 'center', fontSize: 12, fontFamily: t.mono, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.faint, padding: '4px 0', ...fadeS(f, delay) }}>{children}</div>
}

export const FeedR = () => {
  const f = useCurrentFrame()
  const y = interpolate(f, [sec(0), sec(1.0), sec(3.4), sec(5)], [0, 0, -300, -300], { ...clamp, easing: EASE_INOUT })
  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 50, borderBottom: `1px solid ${t.border}`, background: t.panel, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 26, flexShrink: 0, zIndex: 2 }}>
        <Tab active w={36} delay={0.5} /><Tab w={48} delay={0.54} /><Tab w={42} delay={0.58} /><Tab w={56} delay={0.62} /><Tab w={62} delay={0.66} /><Tab w={70} delay={0.7} />
      </div>
      <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '26px 36px', display: 'flex', flexDirection: 'column', gap: 16, transform: `translateY(${y}px)` }}>
          <GroupLabel delay={0.8}>Today</GroupLabel>
          <Card kind="dispute" delay={0.95} />
          <Card kind="task" delay={1.1} />
          <Card kind="dispute" delay={1.25} />
          <GroupLabel delay={1.4}>Yesterday</GroupLabel>
          <Card kind="dispute" ai delay={1.55} />
          <Card kind="task" delay={1.7} />
          <Card kind="dispute" delay={1.85} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: `linear-gradient(transparent, ${t.canvas})`, pointerEvents: 'none' }} />
      </div>
      <Caption delay={3.5}>AI-created disputes &amp; tasks appear in the <Grad style={{ fontWeight: 600 }}>activity feed</Grad></Caption>
    </AbsoluteFill>
  )
}
