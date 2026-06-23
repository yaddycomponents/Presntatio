import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Handshake, ArrowRight } from 'lucide-react'
import { t } from '../../AI Reply/tokens.js'
import { Sparkle, Grad, fadeS, riseS, popS } from '../anim.jsx'
import { Bar, AiBadge } from '../ui.jsx'
import { Dot, Caption } from '../Shell.jsx'

function Row({ active, ai, delay }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', gap: 12, padding: '15px 20px', borderBottom: `1px solid ${t.border}`, background: active ? t.aiSoft : 'transparent', ...fadeS(f, delay) }}>
      <Dot size={36} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
        <Bar w={active ? '52%' : '46%'} h={9} delay={delay} />
        <Bar w="80%" h={7} lite delay={delay} />
        {ai && <AiBadge label="AI Replied" delay={delay + 0.15} size={10} />}
      </div>
    </div>
  )
}

function ActivityLink({ delay }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.panel, boxShadow: t.shadowSoft, ...popS(f, delay) }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkle size={16} delay={delay + 0.05} />
        <span style={{ fontSize: 14, fontWeight: 600, color: t.aiPink }}>Activity created</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 24, height: 24, borderRadius: 7, background: t.goodSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Handshake size={14} color={t.good} strokeWidth={2} />
        </span>
        <span style={{ fontSize: 14, color: t.ink }}>PTP</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: t.primary }}>PTP001</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.primary, fontSize: 14, fontWeight: 600 }}>View <ArrowRight size={15} /></div>
    </div>
  )
}

function Msg({ ai, delay, children }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', gap: 14, padding: '18px 0', borderTop: `1px solid ${t.border}`, ...riseS(f, delay, 12) }}>
      <Dot size={40} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bar w={130} h={9} delay={delay} />
          {ai && <AiBadge label="AI Replied" delay={delay + 0.1} size={10} />}
        </div>
        <Bar w="92%" h={8} lite delay={delay} />
        <Bar w="76%" h={8} lite delay={delay} />
        {children}
      </div>
    </div>
  )
}

export const InboxR = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: 380, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <Bar w="42%" h={9} delay={0.5} /><Bar w="24%" h={7} lite delay={0.55} />
        </div>
        <Row delay={0.65} /><Row ai active delay={0.8} /><Row delay={0.95} /><Row ai delay={1.1} /><Row delay={1.25} /><Row delay={1.4} />
      </div>
      <div style={{ flex: 1, padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
        <Bar w="52%" h={14} delay={0.7} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 18px', borderRadius: 12, background: t.aiSoft, ...fadeS(f, 0.95) }}>
          <Sparkle size={16} delay={1.0} />
          <Grad style={{ fontSize: 14.5, fontWeight: 600 }}>Summary</Grad>
          <div style={{ flex: 1 }}><Bar w="72%" h={7} lite delay={1.05} /></div>
        </div>
        <Msg delay={1.2} />
        <Msg ai delay={1.6}><div style={{ marginTop: 6 }}><ActivityLink delay={2.2} /></div></Msg>
      </div>
      <Caption delay={2.7}>One reply, sent &amp; logged — even a <Grad style={{ fontWeight: 600 }}>Promise-to-Pay</Grad> created</Caption>
    </AbsoluteFill>
  )
}
