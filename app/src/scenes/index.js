import { tokens } from '../theme'
import TitleScene from './TitleScene'
import ScaleScene from './ScaleScene'
import HeadlineScene from './HeadlineScene'
import CompressionScene from './CompressionScene'
import OneLineScene from './OneLineScene'
import CustomerImpactScene from './CustomerImpactScene'
import DeveloperImpactScene from './DeveloperImpactScene'
import { ChapterB, ChapterC, ChapterD } from './chapters'
import BundleScene from './BundleScene'
import PreloadScene from './PreloadScene'
import ImportChainScene from './ImportChainScene'
import ImportFixScene from './ImportFixScene'
import RulesScene from './RulesScene'
import CssFlowScene from './CssFlowScene'
import LayerScene from './LayerScene'
import FilterConsolidationScene from './FilterConsolidationScene'
import FilterUXScene from './FilterUXScene'
import FilterWinsScene from './FilterWinsScene'
import ClosingScene from './ClosingScene'

export const scenes = [
  { id: 'title', bg: tokens.bg.title, dur: 5, Component: TitleScene },
  { id: 'scale', bg: tokens.bg.primary, dur: 5.5, Component: ScaleScene },
  { id: 'headline', bg: tokens.bg.primary, dur: 6.5, Component: HeadlineScene },
  { id: 'compression', bg: tokens.bg.primary, dur: 7, Component: CompressionScene },
  { id: 'oneline', bg: tokens.bg.alt, dur: 5, Component: OneLineScene },
  { id: 'customer', bg: tokens.bg.primary, dur: 5.5, Component: CustomerImpactScene },
  { id: 'developer', bg: tokens.bg.primary, dur: 5.5, Component: DeveloperImpactScene },
  { id: 'chapter-b', bg: tokens.bg.title, dur: 4, Component: ChapterB },
  { id: 'bundle', bg: tokens.bg.primary, dur: 5.5, Component: BundleScene },
  { id: 'preload', bg: tokens.bg.primary, dur: 6.5, Component: PreloadScene },
  { id: 'import-chain', bg: tokens.bg.primary, dur: 6, Component: ImportChainScene },
  { id: 'import-fix', bg: tokens.bg.primary, dur: 6, Component: ImportFixScene },
  { id: 'rules', bg: tokens.bg.primary, dur: 5.5, Component: RulesScene },
  { id: 'chapter-c', bg: tokens.bg.title, dur: 4, Component: ChapterC },
  { id: 'css-flow', bg: tokens.bg.primary, dur: 8, Component: CssFlowScene },
  { id: 'layer', bg: tokens.bg.primary, dur: 8.5, Component: LayerScene },
  { id: 'chapter-d', bg: tokens.bg.title, dur: 4, Component: ChapterD },
  { id: 'consolidation', bg: tokens.bg.primary, dur: 6, Component: FilterConsolidationScene },
  { id: 'filter-ux', bg: tokens.bg.primary, dur: 6, Component: FilterUXScene },
  { id: 'filter-wins', bg: tokens.bg.primary, dur: 5.5, Component: FilterWinsScene },
  { id: 'closing', bg: tokens.bg.title, dur: 6, Component: ClosingScene },
]
