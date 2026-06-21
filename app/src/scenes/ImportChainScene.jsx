import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens } from '../theme'
import { fadeUp, fadeIn, growXFade } from '../motion'

const chain = [
  { d: 0, f: 'CRMRouter' },
  { d: 1, f: 'ApprovalsCard → Details/Content' },
  { d: 2, f: 'EventSnapShot → CustomerSnapShot' },
  { d: 3, f: 'Action/utils.ts', note: 'needs getActionType — 15 lines', tone: 'muted' },
  { d: 4, f: 'ActionTypeTitle.tsx', note: 'a heavy RENDER component', tone: 'bad', mark: '✕' },
  { d: 5, f: 'ActionList → WorkFlowForm → actionForm' },
  { d: 6, f: 'actionComponentMapType.ts', note: 'maps 13 components as runtime values', tone: 'bad' },
  { d: 7, f: 'WorkflowEmail → EmailForm → RichEmailContentEditor' },
  { d: 8, f: '@tiptap / prosemirror', note: '357 KB', tone: 'leaf' },
]

function toneColor(tone) {
  if (tone === 'bad' || tone === 'leaf') return tokens.data.beforeNum
  if (tone === 'muted') return tokens.text.muted
  return tokens.text.primary
}

function Row({ row, delay }) {
  const fileColor = row.tone === 'leaf' ? tokens.data.beforeNum : tokens.text.primary
  return (
    <motion.div
      {...fadeUp({ delay, y: 8 })}
      style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        paddingLeft: row.d * 20, paddingTop: 3, paddingBottom: 3,
        background: row.tone === 'bad' || row.tone === 'leaf' ? 'rgba(168,83,106,0.08)' : 'transparent',
        borderRadius: 4,
      }}
    >
      {row.mark && <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: tokens.data.beforeNum }}>{row.mark}</span>}
      <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.label, fontWeight: row.tone === 'leaf' ? 700 : 400, color: fileColor }}>
        {row.d > 0 && <span style={{ color: tokens.text.muted }}>└ </span>}{row.f}
      </span>
      {row.note && (
        <span style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, color: toneColor(row.tone) }}>
          {row.tone === 'leaf' ? '' : '← '}{row.note}
        </span>
      )}
    </motion.div>
  )
}

export default function ImportChainScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>Part B — The import chain</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>357 KB from one import</MaskReveal>

      <motion.div
        {...fadeIn({ delay: 0.7 })}
        style={{ position: 'relative', background: tokens.bg.code, border: `1px solid ${tokens.line}`, borderRadius: 8, padding: '20px 28px', width: 'min(860px, 92vw)' }}
      >
        {chain.map((row, i) => (
          <Row key={row.f} row={row} delay={0.9 + i * 0.13} />
        ))}
        <motion.div {...growXFade({ delay: 2.3 })} style={{ height: 1, background: tokens.line, margin: '12px 0 0', transformOrigin: 'left' }} />
        <motion.div {...fadeIn({ delay: 2.5 })} style={{ marginTop: 10, fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.data.beforeNum }}>
          preloaded → downloaded on every page load
        </motion.div>
      </motion.div>

      <Line delay={2.9} size={tokens.type.label} color={tokens.text.muted}>
        A module runs top-to-bottom — import one function from a file, carry its whole render tree.
      </Line>
    </div>
  )
}
