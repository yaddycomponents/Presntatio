import { motion } from 'framer-motion'
import CountUp from '../components/Number'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease } from '../theme'
import { fadeUp, fadeIn, popIn } from '../motion'

const CARD_W = 780
const T_CARD = 0.9
const T_VERDICT = 1.5
const T_QUIP = 2.3
const T_FIND = 3.2
const T_COST = 4.6

const findings = [
  { sev: 'MAJOR', text: 'unbounded git fetch in bot allowlist', color: tokens.data.beforeNum },
  { sev: 'NIT', text: 'prerelease pin on a release branch', color: tokens.data.peach },
]

function Stat({ label, children, delay }) {
  return (
    <motion.div {...fadeUp({ delay, y: 8, duration: 0.5 })} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.onDarkMuted }}>{label}</span>
      <span style={{ fontFamily: tokens.font.mono, fontSize: 22, fontWeight: 700, color: tokens.data.mint }}>{children}</span>
    </motion.div>
  )
}

export default function NeoScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.3vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Agents · The reviewer</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Neo reads every pull request</MaskReveal>

      <motion.div
        {...fadeIn({ delay: T_CARD })}
        style={{ width: CARD_W, marginTop: '0.6vw', borderRadius: 14, background: tokens.text.primary, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 15, boxShadow: '0 18px 44px rgba(94,59,70,0.22)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div
            {...popIn({ delay: T_VERDICT, fromScale: 0.8 })}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 13px', borderRadius: 7, background: 'rgba(168,83,106,0.3)', border: `1.5px solid ${tokens.data.beforeNum}` }}
          >
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: tokens.data.beforeNum }} />
            <span style={{ fontFamily: tokens.font.mono, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.08em', color: tokens.bg.primary }}>REQUEST CHANGES</span>
          </motion.div>
          <div style={{ flex: 1 }} />
          <motion.span {...fadeIn({ delay: T_VERDICT + 0.2 })} style={{ fontFamily: tokens.font.mono, fontSize: 12, color: tokens.text.onDarkMuted }}>
            PR #3775 · ci hardening
          </motion.span>
        </div>

        <motion.div
          {...fadeUp({ delay: T_QUIP, y: 8 })}
          style={{ fontFamily: tokens.font.body, fontStyle: 'italic', fontSize: 17, lineHeight: 1.45, color: tokens.bg.primary, borderLeft: `2px solid ${tokens.data.mint}`, paddingLeft: 14 }}
        >
          The gate built to catch attacker-controlled content just handed it a skeleton key.
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {findings.map((f, i) => (
            <motion.div
              key={f.sev}
              {...fadeUp({ delay: T_FIND + i * 0.25, y: 8, duration: 0.45 })}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span style={{ fontFamily: tokens.font.mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: f.color, width: 52 }}>{f.sev}</span>
              <span style={{ fontFamily: tokens.font.mono, fontSize: 13.5, color: tokens.text.onDark }}>{f.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeIn({ delay: T_COST - 0.2 })} style={{ height: 1, background: 'rgba(246,234,217,0.18)' }} />

        <div style={{ display: 'flex', gap: 52 }}>
          <Stat label="cost" delay={T_COST}>
            <CountUp to={1.76} decimals={2} prefix="$" delay={T_COST} duration={1.2} />
          </Stat>
          <Stat label="tokens read" delay={T_COST + 0.15}>
            <CountUp to={3.26} decimals={2} suffix="M" delay={T_COST + 0.15} duration={1.2} />
          </Stat>
          <Stat label="time" delay={T_COST + 0.3}>
            <CountUp to={7.6} decimals={1} suffix=" min" delay={T_COST + 0.3} duration={1.2} />
          </Stat>
        </div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: '0.8vw' }}>
        <Line delay={T_COST + 1.5} size={tokens.type.rowLabel} color={tokens.text.primary}>
          It caught a command-injection hole — in the workflow meant to <em>harden</em> CI.
        </Line>
        <Line delay={T_COST + 1.8} size={tokens.type.label} color={tokens.text.muted}>
          Under two dollars, before a human opened the diff.
        </Line>
      </div>
    </div>
  )
}
