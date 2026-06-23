import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { MessageSquareWarning, Image as ImageIcon } from 'lucide-react'
import { t } from '../../AI Reply/tokens.js'
import { Sparkle, Grad, fadeS, riseS, popS } from '../anim.jsx'
import { Bar, AiBadge } from '../ui.jsx'
import { Dot, Caption } from '../Shell.jsx'

function Field({ label, children, delay }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, ...fadeS(f, delay) }}>
      <span style={{ fontSize: 12, color: t.faint }}>{label}</span>
      {children}
    </div>
  )
}

export const DetailR = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1, padding: '34px 44px', display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, ...fadeS(f, 0.55) }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, background: t.dangerSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquareWarning size={16} color={t.danger} strokeWidth={2} />
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, color: t.ink }}>Dispute (DSP-2198)</span>
          <AiBadge label="Created by AI" delay={0.75} size={11} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bar w="44%" h={15} delay={0.7} />
          <Bar w="62%" h={8} lite delay={0.78} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <span style={{ fontSize: 12, color: t.faint }}>Attachments</span>
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: `1px solid ${t.border}`, background: t.panelAlt, ...popS(f, 0.95) }}>
            <ImageIcon size={17} color={t.muted} strokeWidth={1.7} />
            <Bar w={92} h={7} delay={1.0} shimmer={false} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 2 }}>
          <span style={{ fontSize: 12, color: t.faint }}>Invoices</span>
          {[0, 1].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 26, ...fadeS(f, 1.1 + i * 0.08) }}>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: t.primary }}>TIPC004{5 - i}</span>
              <Bar w={76} h={8} lite delay={1.1 + i * 0.08} shimmer={false} />
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: t.border }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, ...riseS(f, 1.35, 8) }}>
          <span style={{ fontSize: 12, color: t.faint }}>Dispute amount</span>
          <span style={{ fontFamily: t.mono, fontSize: 30, fontWeight: 700, color: t.ink }}>$4.98K</span>
        </div>
      </div>

      <div style={{ width: 320, borderLeft: `1px solid ${t.border}`, background: t.canvas, padding: '34px 30px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Field label="Status" delay={0.6}>
          <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '7px 16px', borderRadius: 8, background: t.dangerSoft, color: t.danger, fontSize: 14, fontWeight: 600 }}>Open</div>
        </Field>
        <Field label="Type" delay={0.75}><Bar w="70%" h={8} lite delay={0.75} /></Field>
        <Field label="Dispute owners" delay={0.9}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Dot size={26} /><Bar w={96} h={7} lite delay={0.95} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Dot size={26} /><Bar w={80} h={7} lite delay={1.0} /></div>
          </div>
        </Field>
        <Field label="Created by" delay={1.15}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Sparkle size={16} delay={1.25} />
            <Grad style={{ fontSize: 14, fontWeight: 600 }}>Growfin AI</Grad>
          </div>
          <span style={{ fontSize: 12.5, color: t.faint, marginTop: 5 }}>05 Oct, 3:00 pm</span>
        </Field>
      </div>

      <Caption delay={1.8}>Open any record — AI's work is <Grad style={{ fontWeight: 600 }}>fully attributed</Grad></Caption>
    </AbsoluteFill>
  )
}
