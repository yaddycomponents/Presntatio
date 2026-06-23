import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Check, X } from 'lucide-react'
import { t, type } from '../../AI Reply/tokens.js'
import { Sparkle, Mask, fadeS, riseS } from '../anim.jsx'
import { Eyebrow, Avatar } from '../ui.jsx'
import { Thread, Msg } from '../mail.jsx'

function Verdict({ ok, label, note, delay }) {
  const f = useCurrentFrame()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: t.panelAlt, border: `1px solid ${t.border}`, ...riseS(f, delay, 10) }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ok ? t.goodSoft : '#f1f2f5', flexShrink: 0 }}>
        {ok ? <Check size={14} color={t.good} strokeWidth={2.6} /> : <X size={14} color={t.faint} strokeWidth={2.6} />}
      </span>
      <span style={{ fontSize: 15, fontWeight: 600, color: ok ? t.ink : t.muted }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: 13, color: t.muted, fontWeight: 500 }}>{note}</span>
    </div>
  )
}

export const GuardrailR = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '3vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2vh' }}>
        <Eyebrow delay={0.2}><Sparkle size={14} delay={0.25} /> The guardrail</Eyebrow>
        <div style={{ fontSize: type.h3, fontWeight: 700, color: t.ink, letterSpacing: '-0.01em' }}>
          <Mask delay={0.35}>When in doubt, it hands back</Mask>
        </div>
      </div>

      <Thread subject="Re: Statement & credit memo" w={840} delay={0.5}>
        <Msg initials="WH" color="#e0484d" name="William Hayes · ProCycle" time="2:04 PM" delay={0.8} divider={false}>
          Could you send our <b style={{ color: t.ink }}>statement of account</b>, and also issue a <b style={{ color: t.ink }}>credit memo</b> for the damaged units?
        </Msg>
        <Msg ai name="Growfin AI" time="2:04 PM" delay={1.4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 14, color: t.muted, marginBottom: 2 }}>Two intents detected —</span>
            <Verdict ok label="Statement of account" note="grounded" delay={1.9} />
            <Verdict ok={false} label="Credit memo" note="not a supported theme" delay={2.3} />
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: `1px solid ${t.border}`, background: t.panel, ...riseS(f, 2.8, 10) }}>
              <Avatar initials="AF" color={t.primary} size={34} delay={2.9} />
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: t.ink }}>Routed to Alan Francis · AR Specialist</div>
                <div style={{ fontSize: 13, color: t.muted }}>One part can’t be grounded → the whole email goes to a human.</div>
              </div>
            </div>
          </div>
        </Msg>
      </Thread>

      <div style={{ fontSize: type.label, color: t.muted, ...fadeS(f, 3.3) }}>
        Conservative by default — <span style={{ color: t.ink, fontWeight: 600 }}>judgment, negotiation and exceptions stay with your team.</span>
      </div>
    </AbsoluteFill>
  )
}
