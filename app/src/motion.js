import { tokens, ease, dur, spring } from './theme'

const exitFast = { duration: 0.2, ease: ease.soft }

export const fadeUp = ({ delay = 0, y = 16, duration = dur.base } = {}) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10, transition: exitFast },
  transition: { delay, duration, ease: ease.out },
})

export const fadeIn = ({ delay = 0, duration = dur.base } = {}) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0, transition: exitFast },
  transition: { delay, duration, ease: ease.out },
})

export const maskReveal = ({ delay = 0, duration = 0.85 } = {}) => ({
  initial: { y: '115%' },
  animate: { y: '0%' },
  exit: { y: '-115%', transition: { duration: 0.28, ease: ease.soft } },
  transition: { delay, duration, ease: ease.out },
})

export const drawIn = ({ delay = 0, duration = dur.draw } = {}) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay, duration, ease: ease.inOut }, opacity: { delay, duration: 0.25 } },
  },
})

export const popIn = ({ delay = 0, fromScale = 0.7 } = {}) => ({
  initial: { opacity: 0, scale: fromScale },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: fromScale, transition: exitFast },
  transition: { delay, ...spring.pop },
})

export const spinIn = ({ delay = 0, rotate = 45 } = {}) => ({
  initial: { scale: 0, rotate: 0, opacity: 0 },
  animate: { scale: 1, rotate, opacity: 1 },
  transition: { delay, duration: dur.fast, ease: ease.out },
})

export const growX = ({ delay = 0, duration = dur.slow } = {}) => ({
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { delay, duration, ease: ease.out },
})

export const growY = ({ delay = 0, duration = dur.slow } = {}) => ({
  initial: { scaleY: 0 },
  animate: { scaleY: 1 },
  transition: { delay, duration, ease: ease.out },
})

export const growXFade = ({ delay = 0, duration = dur.base } = {}) => ({
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  transition: { delay, duration, ease: ease.out },
})

export const flash = ({ delay = 0, good = true } = {}) => ({
  initial: { backgroundColor: tokens.flash.none },
  animate: { backgroundColor: [tokens.flash.none, good ? tokens.flash.good : tokens.flash.bad, tokens.flash.none] },
  transition: { delay, duration: 1.1, times: [0, 0.15, 1], ease: ease.out },
})

// No `exit`: under the frozen render clock, AnimatePresence exit-completion never
// fires (old scenes would freeze/pile up). Dropping exit removes the old scene
// instantly; the new scene's enter animation carries the transition.
export const sceneSwap = {
  initial: { opacity: 0, x: 60, scale: 0.99 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.55, ease: ease.out } },
}
