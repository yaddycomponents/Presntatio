import { motion } from 'framer-motion'
import Diamond from '../components/Diamond'
import { Kicker, MaskReveal, Line } from '../components/Text'
import { tokens, ease, dur } from '../theme'
import { fadeUp, growX } from '../motion'

const MAX = 3359
const TRACK = 230

const before = {
  head: 'dev-master · eager boot',
  total: '7,723 KB gz',
  color: tokens.data.beforeBar,
  ink: tokens.data.beforeNum,
  rows: [['cashapps', 3359], ['vendor', 3171], ['amcharts', 831], ['index (entry)', 499], ['editor-tiptap', 35]],
}
const after = {
  head: 'new-bundle · eager boot',
  total: '1,174 KB gz',
  color: tokens.data.afterBar,
  ink: tokens.data.afterNum,
  rows: [['lib-antd', 734], ['vendor', 272], ['lib-growcomponents', 131], ['app (entry)', 59], ['ky', 3]],
}

function Column({ data, base }) {
  return (
    <div style={{ flex: 1 }}>
      <motion.div {...fadeUp({ delay: base, y: 8 })} style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: tokens.font.mono, fontSize: tokens.type.eyebrow, letterSpacing: tokens.track.label, textTransform: 'uppercase', color: tokens.text.muted }}>{data.head}</div>
        <div style={{ fontFamily: tokens.font.mono, fontWeight: 700, fontSize: tokens.type.metric, color: data.ink, marginTop: 2 }}>{data.total}</div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {data.rows.map(([name, kb], i) => (
          <div key={name} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', columnGap: 12, alignItems: 'center' }}>
            <motion.div {...fadeUp({ delay: base + 0.2 + i * 0.1, y: 4 })} style={{ textAlign: 'right', fontFamily: tokens.font.mono, fontSize: 11, color: tokens.text.primary, whiteSpace: 'nowrap' }}>{name}</motion.div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <motion.div {...growX({ delay: base + 0.2 + i * 0.1, duration: dur.base })} style={{ width: Math.max(4, (kb / MAX) * TRACK), height: 18, background: data.color, borderRadius: 3, transformOrigin: 'left' }} />
              <motion.span {...fadeUp({ delay: base + 0.4 + i * 0.1, y: 4 })} style={{ fontFamily: tokens.font.mono, fontSize: 10, color: tokens.text.muted, whiteSpace: 'nowrap' }}>{kb.toLocaleString()} KB</motion.span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChunkBarsScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
        <Kicker delay={0.2}>The Rebuild · The eager boot graph</Kicker>
        <Diamond size={8} color={tokens.text.eyebrow} delay={0.3} />
      </div>

      <MaskReveal delay={0.4} size={tokens.type.h2}>Where the weight lived</MaskReveal>

      <div style={{ display: 'flex', gap: 'clamp(30px, 6vw, 80px)', width: 'min(940px, 94vw)', marginTop: '1vw', alignItems: 'flex-start' }}>
        <Column data={before} base={0.8} />
        <Column data={after} base={1.6} />
      </div>

      <Line delay={2.8} size={tokens.type.label} color={tokens.text.primary}>
        Same bars, same scale — the first-load critical path shrank 8.5× (−85%).
      </Line>
    </div>
  )
}
