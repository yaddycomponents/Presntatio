import { tokens } from '../theme'
import IntroScene from './IntroScene'
import TitleScene from './TitleScene'
import ProblemScene from './ProblemScene'
import ScaleScene from './ScaleScene'
import HeadlineScene from './HeadlineScene'
import CompressionScene from './CompressionScene'
import OneLineScene from './OneLineScene'
import CustomerImpactScene from './CustomerImpactScene'
import DeveloperImpactScene from './DeveloperImpactScene'
import { ChapterProblem, ChapterRebuild, ChapterAgents, ChapterPayoff } from './chapters'
import AgentsScene from './AgentsScene'
import NeoScene from './NeoScene'
import BundleScene from './BundleScene'
import MonolithScene from './MonolithScene'
import ChunkBarsScene from './ChunkBarsScene'
import EagerBootScene from './EagerBootScene'
import BytesWentScene from './BytesWentScene'
import CaveatsScene from './CaveatsScene'
import PreloadScene from './PreloadScene'
import PrefetchScene from './PrefetchScene'
import ImportChainScene from './ImportChainScene'
import ImportFixScene from './ImportFixScene'
import RulesScene from './RulesScene'
import CssFlowScene from './CssFlowScene'
import LayerScene from './LayerScene'
import FilterConsolidationScene from './FilterConsolidationScene'
import FilterUXScene from './FilterUXScene'
import FilterKeyboardScene from './FilterKeyboardScene'
import FilterWinsScene from './FilterWinsScene'
import WindowedScene from './WindowedScene'
import VirtualListScene from './VirtualListScene'
import UrlStateScene from './UrlStateScene'
import UpgradesScene from './UpgradesScene'
import HardeningScene from './HardeningScene'
import ClosingScene from './ClosingScene'
import SafetyNetsScene from './SafetyNetsScene'
import BuildTimeScene from './BuildTimeScene'

export const scenes = [
  // — Open —
  { id: 'intro', bg: tokens.bg.title, dur: 6.3, Component: IntroScene },
  { id: 'title', bg: tokens.bg.title, dur: 8.3, Component: TitleScene },

  // — Act I: The Problem —
  { id: 'chapter-problem', bg: tokens.bg.title, dur: 10.4, Component: ChapterProblem },
  { id: 'problem', bg: tokens.bg.primary, dur: 10.9, Component: ProblemScene },

  // — Act II: The Rebuild —
  { id: 'chapter-rebuild', bg: tokens.bg.title, dur: 6.8, Component: ChapterRebuild },
  { id: 'scale', bg: tokens.bg.primary, dur: 11.9, Component: ScaleScene },
  { id: 'monolith', bg: tokens.bg.primary, dur: 14.5, Component: MonolithScene },
  { id: 'chunk-bars', bg: tokens.bg.primary, dur: 11.9, Component: ChunkBarsScene },
  { id: 'eager-boot', bg: tokens.bg.primary, dur: 17, Component: EagerBootScene },
  { id: 'preload', bg: tokens.bg.primary, dur: 15, Component: PreloadScene },
  { id: 'prefetch', bg: tokens.bg.primary, dur: 19.6, Component: PrefetchScene },
  { id: 'import-chain', bg: tokens.bg.primary, dur: 13.4, Component: ImportChainScene },
  { id: 'import-fix', bg: tokens.bg.primary, dur: 13.4, Component: ImportFixScene },
  { id: 'bundle', bg: tokens.bg.primary, dur: 9.9, Component: BundleScene },
  { id: 'safety-nets', bg: tokens.bg.primary, dur: 19, Component: SafetyNetsScene },
  { id: 'rules', bg: tokens.bg.primary, dur: 10.9, Component: RulesScene },
  { id: 'css-flow', bg: tokens.bg.primary, dur: 17.5, Component: CssFlowScene },
  { id: 'layer', bg: tokens.bg.primary, dur: 18.5, Component: LayerScene },
  { id: 'consolidation', bg: tokens.bg.primary, dur: 11.9, Component: FilterConsolidationScene },
  { id: 'filter-ux', bg: tokens.bg.primary, dur: 10.4, Component: FilterUXScene },
  { id: 'filter-keyboard', bg: tokens.bg.primary, dur: 12.9, Component: FilterKeyboardScene },
  { id: 'filter-wins', bg: tokens.bg.primary, dur: 9.9, Component: FilterWinsScene },
  { id: 'windowed', bg: tokens.bg.primary, dur: 15, Component: WindowedScene },
  { id: 'virtual-list', bg: tokens.bg.primary, dur: 11.4, Component: VirtualListScene },
  { id: 'url-state', bg: tokens.bg.primary, dur: 18.5, Component: UrlStateScene },
  { id: 'upgrades', bg: tokens.bg.primary, dur: 11.4, Component: UpgradesScene },
  { id: 'hardening', bg: tokens.bg.primary, dur: 11.9, Component: HardeningScene },

  // — Act III: The Payoff —
  { id: 'chapter-payoff', bg: tokens.bg.title, dur: 4.8, Component: ChapterPayoff },
  { id: 'headline', bg: tokens.bg.primary, dur: 11.4, Component: HeadlineScene },
  { id: 'bytes-went', bg: tokens.bg.primary, dur: 9.9, Component: BytesWentScene },
  { id: 'compression', bg: tokens.bg.primary, dur: 15, Component: CompressionScene },
  { id: 'build-time', bg: tokens.bg.primary, dur: 15.5, Component: BuildTimeScene },
  { id: 'caveats', bg: tokens.bg.primary, dur: 10.4, Component: CaveatsScene },
  { id: 'oneline', bg: tokens.bg.alt, dur: 10.9, Component: OneLineScene },
  { id: 'customer', bg: tokens.bg.primary, dur: 13.9, Component: CustomerImpactScene },
  { id: 'developer', bg: tokens.bg.primary, dur: 11.4, Component: DeveloperImpactScene },

  // — Act IV: The Agents —
  { id: 'chapter-agents', bg: tokens.bg.title, dur: 7.8, Component: ChapterAgents },
  { id: 'agents', bg: tokens.bg.primary, dur: 17.5, Component: AgentsScene },
  { id: 'neo', bg: tokens.bg.primary, dur: 19.6, Component: NeoScene },

  { id: 'closing', bg: tokens.bg.title, dur: 8.3, Component: ClosingScene },
]
