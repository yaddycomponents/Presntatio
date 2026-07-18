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
  { id: 'intro', bg: tokens.bg.title, dur: 3.5, Component: IntroScene },
  { id: 'title', bg: tokens.bg.title, dur: 5, Component: TitleScene },

  // — Act I: The Problem —
  { id: 'chapter-problem', bg: tokens.bg.title, dur: 4.5, Component: ChapterProblem },
  { id: 'problem', bg: tokens.bg.primary, dur: 6, Component: ProblemScene },

  // — Act II: The Rebuild —
  { id: 'chapter-rebuild', bg: tokens.bg.title, dur: 4.5, Component: ChapterRebuild },
  { id: 'scale', bg: tokens.bg.primary, dur: 5.5, Component: ScaleScene },
  { id: 'monolith', bg: tokens.bg.primary, dur: 6.5, Component: MonolithScene },
  { id: 'chunk-bars', bg: tokens.bg.primary, dur: 6.5, Component: ChunkBarsScene },
  { id: 'eager-boot', bg: tokens.bg.primary, dur: 6.5, Component: EagerBootScene },
  { id: 'preload', bg: tokens.bg.primary, dur: 6.5, Component: PreloadScene },
  { id: 'import-chain', bg: tokens.bg.primary, dur: 6, Component: ImportChainScene },
  { id: 'import-fix', bg: tokens.bg.primary, dur: 6, Component: ImportFixScene },
  { id: 'bundle', bg: tokens.bg.primary, dur: 5.5, Component: BundleScene },
  { id: 'safety-nets', bg: tokens.bg.primary, dur: 11, Component: SafetyNetsScene },
  { id: 'rules', bg: tokens.bg.primary, dur: 5.5, Component: RulesScene },
  { id: 'css-flow', bg: tokens.bg.primary, dur: 8, Component: CssFlowScene },
  { id: 'layer', bg: tokens.bg.primary, dur: 8.5, Component: LayerScene },
  { id: 'consolidation', bg: tokens.bg.primary, dur: 8, Component: FilterConsolidationScene },
  { id: 'filter-ux', bg: tokens.bg.primary, dur: 6, Component: FilterUXScene },
  { id: 'filter-keyboard', bg: tokens.bg.primary, dur: 6, Component: FilterKeyboardScene },
  { id: 'filter-wins', bg: tokens.bg.primary, dur: 5.5, Component: FilterWinsScene },
  { id: 'windowed', bg: tokens.bg.primary, dur: 6.5, Component: WindowedScene },
  { id: 'virtual-list', bg: tokens.bg.primary, dur: 6, Component: VirtualListScene },
  { id: 'prefetch', bg: tokens.bg.primary, dur: 9.5, Component: PrefetchScene },
  { id: 'url-state', bg: tokens.bg.primary, dur: 9, Component: UrlStateScene },
  { id: 'upgrades', bg: tokens.bg.primary, dur: 6, Component: UpgradesScene },
  { id: 'hardening', bg: tokens.bg.primary, dur: 6, Component: HardeningScene },

  // — Act III: The Payoff —
  { id: 'chapter-payoff', bg: tokens.bg.title, dur: 4.5, Component: ChapterPayoff },
  { id: 'headline', bg: tokens.bg.primary, dur: 6.5, Component: HeadlineScene },
  { id: 'bytes-went', bg: tokens.bg.primary, dur: 6, Component: BytesWentScene },
  { id: 'compression', bg: tokens.bg.primary, dur: 7, Component: CompressionScene },
  { id: 'build-time', bg: tokens.bg.primary, dur: 8, Component: BuildTimeScene },
  { id: 'caveats', bg: tokens.bg.primary, dur: 6.5, Component: CaveatsScene },
  { id: 'oneline', bg: tokens.bg.alt, dur: 5.5, Component: OneLineScene },
  { id: 'customer', bg: tokens.bg.primary, dur: 5.5, Component: CustomerImpactScene },
  { id: 'developer', bg: tokens.bg.primary, dur: 5.5, Component: DeveloperImpactScene },

  // — Act IV: The Agents —
  { id: 'chapter-agents', bg: tokens.bg.title, dur: 4.5, Component: ChapterAgents },
  { id: 'agents', bg: tokens.bg.primary, dur: 9, Component: AgentsScene },
  { id: 'neo', bg: tokens.bg.primary, dur: 9, Component: NeoScene },

  { id: 'closing', bg: tokens.bg.title, dur: 6, Component: ClosingScene },
]
