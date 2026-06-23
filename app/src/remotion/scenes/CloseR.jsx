import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { t, type } from '../../AI Reply/tokens.js'
import { Sparkle, Grad, Mask, riseS, growXS } from '../anim.jsx'
import { Chip } from '../ui.jsx'

export const CloseR = () => {
  const f = useCurrentFrame()
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '3vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: t.mono, fontSize: 'clamp(11px,1vw,14px)', letterSpacing: '0.34em', textTransform: 'uppercase', color: t.muted, ...riseS(f, 0.2, 10) }}>
        <Sparkle size={16} delay={0.3} /> Growfin · AR Automation
      </div>
      <div style={{ textAlign: 'center', lineHeight: 1.12, fontSize: type.h1, fontWeight: 700, color: t.ink, letterSpacing: '-0.02em' }}>
        <div><Mask delay={0.45}>AI handles the routine.</Mask></div>
        <div><Mask delay={0.7}><Grad>Your team handles the rest.</Grad></Mask></div>
      </div>
      <div style={{ width: 'min(420px, 60vw)', height: 2, background: t.ai, ...growXS(f, 1.3) }} />
      <div style={{ display: 'flex', gap: 14, marginTop: '0.5vh' }}>
        <Chip delay={1.6} tone="primary">Opt-in per admin</Chip>
        <Chip delay={1.75} tone="primary">Six scoped themes</Chip>
        <Chip delay={1.9} tone="primary">Everything else stays human</Chip>
      </div>
    </AbsoluteFill>
  )
}
