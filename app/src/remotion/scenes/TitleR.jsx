import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { t, type } from '../../AI Reply/tokens.js'
import { Sparkle, Grad, Mask, riseS, growXS } from '../anim.jsx'

export const TitleR = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2.4vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: t.mono, fontSize: 'clamp(11px,1vw,14px)', letterSpacing: '0.34em', textTransform: 'uppercase', color: t.muted, ...riseS(f, 0.2, 10) }}>
        <Sparkle size={16} delay={0.3} /> Growfin · AR Automation
      </div>
      <div style={{ fontSize: type.h1, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em', lineHeight: 1.02 }}>
        <Mask delay={0.45}>AI <Grad>Auto-Reply</Grad></Mask>
      </div>
      <div style={{ width: 'min(420px, 60vw)', height: 2, background: t.ai, ...growXS(f, 0.9) }} />
      <div style={{ fontSize: type.lead, color: t.muted, fontWeight: 400, textAlign: 'center', maxWidth: '46ch', ...riseS(f, 1.15, 12) }}>
        Routine customer replies, sent in <span style={{ color: t.ink, fontWeight: 600 }}>under a minute</span> — with judgment left to the AR team.
      </div>
    </AbsoluteFill>
  )
}
