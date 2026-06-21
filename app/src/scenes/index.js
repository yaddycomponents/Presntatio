import { tokens } from '../theme'
import TitleScene from './TitleScene'
import ProblemScene from './ProblemScene'
import ScaleScene from './ScaleScene'
import HeadlineScene from './HeadlineScene'
import CompressionScene from './CompressionScene'
import OneLineScene from './OneLineScene'
import CustomerImpactScene from './CustomerImpactScene'
import DeveloperImpactScene from './DeveloperImpactScene'
import { ChapterProblem, ChapterRebuild, ChapterPayoff } from './chapters'
import BundleScene from './BundleScene'
import MonolithScene from './MonolithScene'
import PreloadScene from './PreloadScene'
import ImportChainScene from './ImportChainScene'
import ImportFixScene from './ImportFixScene'
import RulesScene from './RulesScene'
import CssFlowScene from './CssFlowScene'
import LayerScene from './LayerScene'
import FilterConsolidationScene from './FilterConsolidationScene'
import FilterUXScene from './FilterUXScene'
import FilterKeyboardScene from './FilterKeyboardScene'
import FilterWinsScene from './FilterWinsScene'
import ClosingScene from './ClosingScene'

export const scenes = [
  // — Open —
  { id: 'title', bg: tokens.bg.title, dur: 5, Component: TitleScene },

  // — Act I: The Problem —
  { id: 'chapter-problem', bg: tokens.bg.title, dur: 4.5, Component: ChapterProblem },
  { id: 'problem', bg: tokens.bg.primary, dur: 6, Component: ProblemScene },

  // — Act II: The Rebuild —
  { id: 'chapter-rebuild', bg: tokens.bg.title, dur: 4.5, Component: ChapterRebuild },
  { id: 'scale', bg: tokens.bg.primary, dur: 5.5, Component: ScaleScene },
  { id: 'monolith', bg: tokens.bg.primary, dur: 6.5, Component: MonolithScene },
  { id: 'preload', bg: tokens.bg.primary, dur: 6.5, Component: PreloadScene },
  { id: 'import-chain', bg: tokens.bg.primary, dur: 6, Component: ImportChainScene },
  { id: 'import-fix', bg: tokens.bg.primary, dur: 6, Component: ImportFixScene },
  { id: 'bundle', bg: tokens.bg.primary, dur: 5.5, Component: BundleScene },
  { id: 'rules', bg: tokens.bg.primary, dur: 5.5, Component: RulesScene },
  { id: 'css-flow', bg: tokens.bg.primary, dur: 8, Component: CssFlowScene },
  { id: 'layer', bg: tokens.bg.primary, dur: 8.5, Component: LayerScene },
  { id: 'consolidation', bg: tokens.bg.primary, dur: 6, Component: FilterConsolidationScene },
  { id: 'filter-ux', bg: tokens.bg.primary, dur: 6, Component: FilterUXScene },
  { id: 'filter-keyboard', bg: tokens.bg.primary, dur: 6, Component: FilterKeyboardScene },
  { id: 'filter-wins', bg: tokens.bg.primary, dur: 5.5, Component: FilterWinsScene },

  // — Act III: The Payoff —
  { id: 'chapter-payoff', bg: tokens.bg.title, dur: 4.5, Component: ChapterPayoff },
  { id: 'headline', bg: tokens.bg.primary, dur: 6.5, Component: HeadlineScene },
  { id: 'compression', bg: tokens.bg.primary, dur: 7, Component: CompressionScene },
  { id: 'oneline', bg: tokens.bg.alt, dur: 5.5, Component: OneLineScene },
  { id: 'customer', bg: tokens.bg.primary, dur: 5.5, Component: CustomerImpactScene },
  { id: 'developer', bg: tokens.bg.primary, dur: 5.5, Component: DeveloperImpactScene },
  { id: 'closing', bg: tokens.bg.title, dur: 6, Component: ClosingScene },
]
