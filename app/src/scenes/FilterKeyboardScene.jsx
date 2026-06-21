import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeIn, fadeUp, popIn } from '../motion'

const ROW = 46
const options = ['Open', 'Pending', 'Closed', 'Archived']
const SELECTED = 2

function Key({ children, pulseDelay }) {
  return (
    <motion.span
      animate={pulseDelay ? { scale: [1, 1, 0.88, 1] } : {}}
      transition={pulseDelay ? { delay: pulseDelay, duration: 0.45, times: [0, 0.3, 0.6, 1], ease: ease.out } : {}}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 26, height: 26, padding: '0 8px', border: `1.5px solid ${tokens.text.muted}`, borderRadius: 5, fontFamily: tokens.font.mono, fontSize: 12, color: tokens.text.primary }}
    >
      {children}
    </motion.span>
  )
}

export default function FilterKeyboardScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · Experience</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Keyboard-first</MaskReveal>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 44, marginTop: '0.6vw' }}>
        <motion.div {...fadeIn({ delay: 0.7 })} style={{ width: 320, background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 10, padding: 14 }}>
          <motion.div {...popIn({ delay: 3.3 })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1.5px solid ${tokens.data.afterNum}`, background: 'rgba(91,125,119,0.12)', borderRadius: 999, padding: '5px 12px', fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.data.afterNum, marginBottom: 12 }}>
            Status: Closed ✓
          </motion.div>

          <div style={{ position: 'relative', height: options.length * ROW }}>
            <motion.div
              initial={{ top: 0, opacity: 0 }}
              animate={{ top: [0, 0, ROW, SELECTED * ROW], opacity: [0, 1, 1, 1] }}
              transition={{ delay: 1.5, duration: 1.4, times: [0, 0.12, 0.5, 1], ease: ease.inOut }}
              style={{ position: 'absolute', left: 0, width: '100%', height: ROW - 6, borderRadius: 7, background: 'rgba(91,125,119,0.16)', border: `1.5px solid ${tokens.data.afterNum}` }}
            />
            {options.map((o, i) => (
              <motion.div
                key={o}
                {...fadeIn({ delay: 0.85 + i * 0.12 })}
                style={{ position: 'absolute', top: i * ROW, left: 0, width: '100%', height: ROW - 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}
              >
                <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.text.primary }}>{o}</span>
                {i === SELECTED && (
                  <motion.span {...fadeIn({ delay: 3.1 })} style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, color: tokens.data.afterNum }}>✓</motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp({ delay: 1.6, y: 10 })} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', marginTop: 70 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Key>↑</Key><Key>↓</Key>
            <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted }}>move</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Key pulseDelay={3.0}>↵ Enter</Key>
            <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.text.muted }}>apply</span>
          </div>
        </motion.div>
      </div>

      <Line delay={3.7} size={tokens.type.label} color={tokens.text.muted}>
        Arrow keys to move, Enter to apply — no mouse needed.
      </Line>
    </div>
  )
}
