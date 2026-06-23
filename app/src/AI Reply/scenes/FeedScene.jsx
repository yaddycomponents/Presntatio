import { motion } from 'framer-motion'
import { MessageSquareWarning, CircleCheck } from 'lucide-react'
import { t, ease } from '../tokens'
import { Sparkle, Grad, Bar, fade, rise } from '../fx'
import { Tab, Dot, Caption } from '../app'

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
  return (
    <motion.div {...rise({ delay, y: 14 })}
      style={{ position: 'relative', background: ai ? undefined : t.panel, borderRadius: 16, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 13, boxShadow: t.shadowSoft, border: `1px solid ${ai ? 'transparent' : t.border}` }}>
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
    </motion.div>
  )
}

function GroupLabel({ children, delay }) {
  return <motion.div {...fade({ delay })} style={{ alignSelf: 'center', fontSize: 12, fontFamily: t.mono, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.faint, padding: '4px 0' }}>{children}</motion.div>
}

export default function FeedScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      {/* sub-filter tabs */}
      <div style={{ height: 50, borderBottom: `1px solid ${t.border}`, background: t.panel, display: 'flex', alignItems: 'center', padding: '0 32px', gap: 26, flexShrink: 0, zIndex: 2 }}>
        <Tab active w={36} delay={0.5} /><Tab w={48} delay={0.54} /><Tab w={42} delay={0.58} /><Tab w={56} delay={0.62} /><Tab w={62} delay={0.66} /><Tab w={70} delay={0.7} />
      </div>

      {/* scroll viewport */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <motion.div
          initial={{ y: 0 }} animate={{ y: [0, 0, -300, -300] }}
          transition={{ duration: 6.5, times: [0, 0.32, 0.72, 1], ease: ease.inOut }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '26px 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <GroupLabel delay={0.8}>Today</GroupLabel>
          <Card kind="dispute" delay={0.95} />
          <Card kind="task" delay={1.1} />
          <Card kind="dispute" delay={1.25} />
          <GroupLabel delay={1.4}>Yesterday</GroupLabel>
          <Card kind="dispute" ai delay={1.55} />
          <Card kind="task" delay={1.7} />
          <Card kind="dispute" delay={1.85} />
        </motion.div>

        {/* soft fade at bottom edge */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, background: `linear-gradient(transparent, ${t.canvas})`, pointerEvents: 'none' }} />
      </div>

      <Caption delay={4.6}>AI-created disputes &amp; tasks appear in the <Grad style={{ fontWeight: 600 }}>activity feed</Grad></Caption>
    </div>
  )
}
