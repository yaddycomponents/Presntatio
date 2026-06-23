import { AbsoluteFill } from 'remotion'
import { TransitionSeries, linearTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { t } from '../AI Reply/tokens.js'
import { Backdrop, sec } from './anim.jsx'
import { Shell } from './Shell.jsx'
import { TitleR } from './scenes/TitleR.jsx'
import { TodayR } from './scenes/TodayR.jsx'
import { ShiftR } from './scenes/ShiftR.jsx'
import { ThemesR } from './scenes/ThemesR.jsx'
import { TemplatesR } from './scenes/TemplatesR.jsx'
import { GuardrailR } from './scenes/GuardrailR.jsx'
import { InboxR } from './scenes/InboxR.jsx'
import { FeedR } from './scenes/FeedR.jsx'
import { DetailR } from './scenes/DetailR.jsx'
import { ImpactR } from './scenes/ImpactR.jsx'
import { CloseR } from './scenes/CloseR.jsx'
import { FinR } from './scenes/FinR.jsx'

const HOLD = 1.2
const TRANS = 0.4

export const SCENES = [
  { id: 'title', section: 'AI Auto-Reply', plain: true, bg: t.panel, dur: 4, C: TitleR },
  { id: 'today', section: 'AI Auto-Reply', plain: true, bg: t.canvas, dur: 7, C: TodayR },
  { id: 'shift', section: 'Inbox', plain: true, bg: t.canvas, dur: 8, C: ShiftR },
  { id: 'themes', section: 'Settings · AI Responses', plain: true, bg: t.canvas, dur: 7, C: ThemesR },
  { id: 'templates', section: 'Settings · AI Responses', bg: t.panel, dur: 7, C: TemplatesR },
  { id: 'guardrail', section: 'Inbox', plain: true, bg: t.canvas, dur: 7.5, C: GuardrailR },
  { id: 'inbox', section: 'Inbox', bg: t.panel, dur: 6, C: InboxR },
  { id: 'feed', section: 'AR Aging', bg: t.canvas, dur: 8, C: FeedR },
  { id: 'detail', section: 'Dispute', bg: t.panel, dur: 6.5, C: DetailR },
  { id: 'impact', section: 'AI Auto-Reply', plain: true, bg: t.canvas, dur: 7, C: ImpactR },
  { id: 'close', section: 'AI Auto-Reply', plain: true, bg: t.panel, dur: 6, C: CloseR },
  { id: 'fin', noShell: true, plain: true, bg: t.panel, dur: 6, C: FinR },
]

export const totalFrames =
  SCENES.reduce((a, s) => a + sec(s.dur + HOLD), 0) - (SCENES.length - 1) * sec(TRANS)

function Wrap({ s }) {
  const C = s.C
  const inner = (<>{s.plain && <Backdrop />}<C /></>)
  return s.noShell
    ? <AbsoluteFill style={{ background: s.bg }}>{inner}</AbsoluteFill>
    : <Shell section={s.section} bg={s.bg}>{inner}</Shell>
}

export const Film = () => (
  <TransitionSeries>
    {SCENES.flatMap((s, i) => {
      const seq = (
        <TransitionSeries.Sequence key={s.id} durationInFrames={sec(s.dur + HOLD)}>
          <Wrap s={s} />
        </TransitionSeries.Sequence>
      )
      if (i === SCENES.length - 1) return [seq]
      return [seq, (
        <TransitionSeries.Transition key={`${s.id}-t`} presentation={fade()} timing={linearTiming({ durationInFrames: sec(TRANS) })} />
      )]
    })}
  </TransitionSeries>
)
