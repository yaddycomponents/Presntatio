import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { tokens, ease, dur } from '../theme'
import { sceneSwap } from '../motion'

export default function Stage({ scenes }) {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(() => new URLSearchParams(window.location.search).has('play'))
  const count = scenes.length

  const go = useCallback((d) => {
    setI((prev) => Math.min(count - 1, Math.max(0, prev + d)))
  }, [count])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); setPlaying(false); go(1) }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setPlaying(false); go(-1) }
      if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p) }
      if (e.key === 'Home') { setPlaying(false); setI(0) }
      if (e.key === 'End') { setPlaying(false); setI(count - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, count])

  useEffect(() => {
    if (!playing) return
    if (i >= count - 1) { setPlaying(false); return }
    const ms = (scenes[i].dur ?? 6) * 1000
    const t = setTimeout(() => setI((p) => p + 1), ms)
    return () => clearTimeout(t)
  }, [playing, i, count, scenes])

  const scene = scenes[i]
  const Scene = scene.Component
  const bg = scene.bg ?? tokens.bg.primary
  const onDark = scene.bg === tokens.bg.title || scene.bg === tokens.bg.alt
  const dotColor = onDark ? tokens.text.onDark : tokens.border

  return (
    <motion.div
      data-scene={i}
      data-scene-count={count}
      data-playing={playing ? '1' : '0'}
      onClick={(e) => { setPlaying(false); go(e.shiftKey ? -1 : 1) }}
      animate={{ backgroundColor: bg }}
      transition={{ duration: dur.fast, ease: ease.soft }}
      style={{ position: 'fixed', inset: 0, cursor: 'pointer', userSelect: 'none' }}
    >
      <motion.div key={i} {...sceneSwap} style={{ position: 'absolute', inset: 0 }}>
        <Scene />
      </motion.div>

      <div style={{ position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, alignItems: 'center' }}>
        {scenes.map((s, idx) => (
          <div
            key={s.id}
            style={{
              width: idx === i ? 26 : 7,
              height: 7,
              borderRadius: 7,
              background: dotColor,
              opacity: idx === i ? 1 : 0.35,
              transition: 'width 0.4s ease, opacity 0.4s ease, background 0.4s ease',
            }}
          />
        ))}
      </div>

      {playing && (
        <div style={{ position: 'fixed', bottom: 24, right: 28, fontFamily: tokens.font.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: dotColor, opacity: 0.7 }}>
          ▶ auto
        </div>
      )}
    </motion.div>
  )
}
