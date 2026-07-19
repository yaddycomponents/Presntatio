import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { tokens, ease } from '../theme'
import { fadeIn, growXFade } from '../motion'

// Silent-film iris-out, in the deck's palette: plum stands in for the black
// surround, cream for the lit frame. The surround is painted by an enormous
// box-shadow spread on a circular element, so shrinking the element closes the
// iris — smoother than animating a radial-gradient, which browsers can't
// interpolate.
// The iris is a fixed-size circle driven by `scale`, not width/height. Mixing
// vmax -> vmin -> 0 keyframes makes Framer interpolate across unit types, which
// visibly jumps the circle back open mid-close.
const DIA = 300
const OPEN = 15
const T_CLOSE = 0.4
const T_FRAMED = 2.0
const T_HOLD = 4.6
const T_OUT = 5.6

const IRIS_DUR = T_OUT - T_CLOSE

export default function FinScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ scale: OPEN }}
        animate={{ scale: [OPEN, 1, 1, 0] }}
        transition={{
          delay: T_CLOSE,
          duration: IRIS_DUR,
          times: [0, (T_FRAMED - T_CLOSE) / IRIS_DUR, (T_HOLD - T_CLOSE) / IRIS_DUR, 1],
          // one easing per segment — a single ease across 4 keyframes warps the
          // whole timeline and silently ignores `times`
          ease: [ease.inOut, ease.inOut, ease.inOut],
        }}
        style={{
          position: 'absolute',
          width: DIA,
          height: DIA,
          borderRadius: '50%',
          background: tokens.bg.primary,
          boxShadow: `0 0 0 9999px ${tokens.text.primary}`,
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        // Deliberately shares the iris's exact delay/duration/times: the card
        // arrives as the iris settles and clears as it closes, so it reads as
        // taken by the iris rather than fading behind an open circle.
        transition={{
          delay: T_CLOSE,
          duration: IRIS_DUR,
          times: [0, (T_FRAMED - T_CLOSE) / IRIS_DUR, (T_HOLD - T_CLOSE) / IRIS_DUR, 1],
          ease: [ease.out, ease.inOut, ease.inOut],
        }}
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
      >
        <span style={{ fontFamily: tokens.font.display, fontSize: 'clamp(44px, 7.5vmin, 100px)', letterSpacing: '0.16em', textIndent: '0.16em', color: tokens.text.primary, lineHeight: 1 }}>
          FIN
        </span>

        <motion.div
          {...growXFade({ delay: T_FRAMED + 0.15, duration: 0.6 })}
          style={{ width: 'min(140px, 17vmin)', height: 2, background: tokens.line, transformOrigin: 'center' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Diamond size={6} color={tokens.text.eyebrow} delay={T_FRAMED + 0.5} />
          <Diamond size={6} color={tokens.text.eyebrow} delay={T_FRAMED + 0.6} />
          <Diamond size={6} color={tokens.text.eyebrow} delay={T_FRAMED + 0.7} />
        </div>
      </motion.div>

      <motion.div
        {...fadeIn({ delay: T_OUT + 0.7, duration: 0.4 })}
        style={{ position: 'absolute', inset: 0, background: tokens.text.primary }}
      />
    </div>
  )
}
