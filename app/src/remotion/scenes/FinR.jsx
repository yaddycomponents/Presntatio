import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion'
import { t } from '../../AI Reply/tokens.js'
import { sec, EASE_INOUT, EASE_OUT } from '../anim.jsx'

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
const grad = { background: t.ai, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }

export const FinR = () => {
  const f = useCurrentFrame()
  // phase 1 — Grow drops, fin stays, then remnant clears
  const growOp = interpolate(f, [0, sec(0.34), sec(1.2), sec(1.73)], [0, 1, 1, 0], { ...clamp, easing: EASE_INOUT })
  const growY = interpolate(f, [0, sec(0.34), sec(1.2), sec(1.73)], [16, 0, 0, 64], { ...clamp, easing: EASE_INOUT })
  const finOp = interpolate(f, [0, sec(0.34), sec(1.87), sec(2.28)], [0, 1, 1, 0], { ...clamp, easing: EASE_INOUT })
  // phase 2 — lone fin
  const loneOp = interpolate(f, [sec(2.8), sec(3.57), sec(5.04), sec(6.0)], [0, 1, 1, 0], { ...clamp, easing: EASE_OUT })
  const loneSc = interpolate(f, [sec(2.8), sec(3.57)], [0.96, 1], { ...clamp, easing: EASE_OUT })
  const ulSc = interpolate(f, [sec(3.2), sec(3.85), sec(5.02), sec(5.8)], [0, 1, 1, 0], { ...clamp, easing: EASE_INOUT })
  const ulOp = interpolate(f, [sec(3.2), sec(3.85), sec(5.02), sec(5.8)], [0, 1, 1, 0], { ...clamp, easing: EASE_INOUT })

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: t.font }}>
      <div style={{ position: 'absolute', display: 'flex', alignItems: 'baseline', fontWeight: 700, fontSize: 'clamp(48px,7vw,116px)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
        <span style={{ color: t.ink, display: 'inline-block', opacity: growOp, transform: `translateY(${growY}px)` }}>Grow</span>
        <span style={{ display: 'inline-block', opacity: finOp, ...grad }}>fin</span>
      </div>

      <div style={{ position: 'absolute', fontWeight: 700, fontSize: 'clamp(60px,9vw,150px)', letterSpacing: '0.02em', opacity: loneOp, transform: `scale(${loneSc})`, ...grad }}>
        fin
      </div>

      <div style={{ position: 'absolute', top: 'calc(50% + 110px)', width: 'min(190px, 28vw)', height: 2, background: t.ai, transform: `scaleX(${ulSc})`, opacity: ulOp, transformOrigin: 'center' }} />
    </AbsoluteFill>
  )
}
