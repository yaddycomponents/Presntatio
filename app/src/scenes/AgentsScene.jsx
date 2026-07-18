import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeUp, fadeIn, growXFade, popIn } from '../motion'

const COL_REQ = 250
const COL_HUB = 260
const HUB_R = 26
const RUN = COL_HUB / 2 - HUB_R
const COL_SPEC = 330
const ROW_H = 58
const GAP = 12

const specialists = [
  { name: 'Lucius', role: 'component catalog' },
  { name: 'Morpheus', role: 'architecture' },
  { name: 'Tyler', role: 'house rules' },
  { name: 'R2-D2', role: 'data tables' },
  { name: 'Ariadne', role: 'page layout' },
  { name: 'Neo', role: 'pull-request review' },
]

const routes = [
  { req: '"which component?"', to: 0, mode: 'read', at: 1.6 },
  { req: '"first FE change"', to: 1, mode: 'send', at: 2.9 },
  { req: '"audit my diff"', to: 2, mode: 'send', at: 4.2 },
]

const TOTAL_H = specialists.length * ROW_H + (specialists.length - 1) * GAP

function Spec({ s, i, hit }) {
  return (
    <motion.div
      {...fadeUp({ delay: 0.9 + i * 0.08, y: 10, duration: 0.5 })}
      style={{ position: 'absolute', top: i * (ROW_H + GAP), left: 0, width: COL_SPEC, height: ROW_H, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderRadius: 10, border: `1.5px solid ${tokens.line}`, background: 'rgba(94,59,70,0.03)' }}
    >
      {hit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0.35] }}
          transition={{ delay: hit.at + 0.55, duration: 1.5, times: [0, 0.15, 0.7, 1], ease: ease.out }}
          style={{ position: 'absolute', inset: -2, borderRadius: 11, border: `2px solid ${tokens.data.afterNum}`, background: 'rgba(91,125,119,0.07)' }}
        />
      )}
      <div style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: tokens.data.afterBar, flexShrink: 0 }} />
      <span style={{ position: 'relative', fontFamily: tokens.font.mono, fontSize: 14, fontWeight: 700, color: tokens.text.primary }}>{s.name}</span>
      <span style={{ position: 'relative', fontFamily: tokens.font.body, fontSize: 13, color: tokens.text.muted }}>{s.role}</span>
    </motion.div>
  )
}

function Route({ r }) {
  const y = r.to * (ROW_H + GAP) + ROW_H / 2
  const heavy = r.mode === 'send'
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, 0] }}
        transition={{ delay: r.at, duration: 2.0, times: [0, 0.12, 0.85, 1], ease: ease.out }}
        style={{ position: 'absolute', left: 0, top: TOTAL_H / 2 - 20, width: COL_REQ, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
      >
        <span style={{ padding: '9px 15px', borderRadius: 9, background: tokens.bg.primary, border: `1.5px solid ${tokens.text.primary}`, fontFamily: tokens.font.mono, fontSize: 13.5, color: tokens.text.primary, whiteSpace: 'nowrap' }}>
          {r.req}
        </span>
      </motion.div>

      <motion.div
        {...growXFade({ delay: r.at + 0.3, duration: 0.35 })}
        style={{ position: 'absolute', left: COL_REQ, top: TOTAL_H / 2 - 1, width: RUN, height: 2, background: tokens.text.muted, transformOrigin: 'left' }}
      />

      <motion.svg
        style={{ position: 'absolute', left: COL_REQ + COL_HUB / 2 + HUB_R, top: 0, overflow: 'visible' }}
        width={RUN} height={TOTAL_H}
      >
        <motion.path
          d={`M0 ${TOTAL_H / 2} C ${RUN * 0.55} ${TOTAL_H / 2}, ${RUN * 0.45} ${y}, ${RUN} ${y}`}
          fill="none"
          stroke={heavy ? tokens.data.afterNum : tokens.text.muted}
          strokeWidth={heavy ? 2.5 : 1.5}
          strokeDasharray={heavy ? undefined : '4 4'}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ delay: r.at + 0.5, duration: 1.4, times: [0, 0.2, 0.7, 1], ease: ease.inOut }}
        />
      </motion.svg>
    </>
  )
}

export default function AgentsScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.4vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Agents · Who you get sent to</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>A concierge, and six specialists</MaskReveal>

      <div style={{ position: 'relative', width: COL_REQ + COL_HUB + COL_SPEC, height: TOTAL_H, marginTop: '1vw' }}>
        <motion.div
          {...fadeIn({ delay: 1.3 })}
          style={{ position: 'absolute', left: 0, top: TOTAL_H / 2 - 54, width: COL_REQ, textAlign: 'right', paddingRight: 2, fontFamily: tokens.font.mono, fontSize: 11, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.eyebrow }}
        >
          a developer asks
        </motion.div>

        {routes.map((r) => <Route key={r.req} r={r} />)}

        <motion.div
          {...popIn({ delay: 0.8, fromScale: 0.85 })}
          style={{ position: 'absolute', left: COL_REQ + COL_HUB / 2 - HUB_R, top: TOTAL_H / 2 - HUB_R, width: HUB_R * 2, height: HUB_R * 2, borderRadius: '50%', background: tokens.text.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
        >
          <span style={{ fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.08em', color: tokens.text.onDark }}>ALFRED</span>
        </motion.div>

        <div style={{ position: 'absolute', left: COL_REQ + COL_HUB, top: 0, width: COL_SPEC, height: TOTAL_H }}>
          {specialists.map((s, i) => (
            <Spec key={s.name} s={s} i={i} hit={routes.find((r) => r.to === i)} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: '1.2vw' }}>
        <Line delay={6.0} size={tokens.type.rowLabel} color={tokens.text.primary}>
          Alfred doesn't write the code — he routes you to whoever owns it.
        </Line>
        <Line delay={6.3} size={tokens.type.label} color={tokens.text.muted}>
          A quick lookup you read. A real job gets delegated, and reports back.
        </Line>
      </div>
    </div>
  )
}
