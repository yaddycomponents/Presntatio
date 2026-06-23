import { t } from './tokens'
import TitleScene from './scenes/TitleScene'
import TodayScene from './scenes/TodayScene'
import ShiftScene from './scenes/ShiftScene'
import ThemesScene from './scenes/ThemesScene'
import TemplatesScene from './scenes/TemplatesScene'
import GuardrailScene from './scenes/GuardrailScene'
import InboxScene from './scenes/InboxScene'
import FeedScene from './scenes/FeedScene'
import DetailScene from './scenes/DetailScene'
import ImpactScene from './scenes/ImpactScene'
import CloseScene from './scenes/CloseScene'
import FinScene from './scenes/FinScene'

export const scenes = [
  { id: 'title', section: 'AI Auto-Reply', plain: true, bg: t.panel, dur: 4, Component: TitleScene },
  { id: 'today', section: 'AI Auto-Reply', plain: true, bg: t.canvas, dur: 7, Component: TodayScene },
  { id: 'shift', section: 'Inbox', plain: true, bg: t.canvas, dur: 8, Component: ShiftScene },
  { id: 'themes', section: 'Settings · AI Responses', plain: true, bg: t.canvas, dur: 7, Component: ThemesScene },
  { id: 'templates', section: 'Settings · AI Responses', bg: t.panel, dur: 7, Component: TemplatesScene },
  { id: 'guardrail', section: 'Inbox', plain: true, bg: t.canvas, dur: 7.5, Component: GuardrailScene },
  { id: 'inbox', section: 'Inbox', bg: t.panel, dur: 6, Component: InboxScene },
  { id: 'feed', section: 'AR Aging', bg: t.canvas, dur: 8, Component: FeedScene },
  { id: 'detail', section: 'Dispute', bg: t.panel, dur: 6.5, Component: DetailScene },
  { id: 'impact', section: 'AI Auto-Reply', plain: true, bg: t.canvas, dur: 7, Component: ImpactScene },
  { id: 'close', section: 'AI Auto-Reply', plain: true, bg: t.panel, dur: 6, Component: CloseScene },
  { id: 'fin', noShell: true, plain: true, bg: t.panel, dur: 6, Component: FinScene },
]
