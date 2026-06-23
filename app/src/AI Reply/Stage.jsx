import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { t, ease } from './tokens'
import { Backdrop } from './fx'
import { AppShell } from './app'
import './ai-fonts.css'

const swap = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } },
}

export default function Stage({ scenes }) {
  const params = new URLSearchParams(window.location.search)
  const [i, setI] = useState(0)
  // motion-graphic mode: plays by default unless ?still
  const [playing, setPlaying] = useState(!params.has('still'))
  const count = scenes.length
  const hold = Number(params.get('hold') ?? 1.2)

  const go = useCallback((d) => setI((p) => Math.min(count - 1, Math.max(0, p + d))), [count])

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
    if (!playing || i >= count - 1) { if (i >= count - 1) setPlaying(false); return }
    const ms = ((scenes[i].dur ?? 6) + hold) * 1000
    const tm = setTimeout(() => setI((p) => p + 1), ms)
    return () => clearTimeout(tm)
  }, [playing, i, count, scenes, hold])

  const scene = scenes[i]
  const Scene = scene.Component
  const bg = scene.bg ?? t.canvas
  const progress = (i + 1) / count

  return (
    <div
      data-scene={i}
      data-scene-count={count}
      data-playing={playing ? '1' : '0'}
      onClick={(e) => { setPlaying(false); go(e.shiftKey ? -1 : 1) }}
      style={{ position: 'fixed', inset: 0, cursor: playing ? 'none' : 'pointer', userSelect: 'none', overflow: 'hidden', fontFamily: t.font }}>

      {scene.noShell ? (
        <motion.div animate={{ backgroundColor: bg }} transition={{ duration: 0.5, ease: ease.soft }}
          style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {scene.plain && <Backdrop />}
          <motion.div key={i} {...swap} style={{ position: 'absolute', inset: 0 }}>
            <Scene />
          </motion.div>
        </motion.div>
      ) : (
        <AppShell section={scene.section} bg={bg}>
          {scene.plain && <Backdrop />}
          <motion.div key={i} {...swap} style={{ position: 'absolute', inset: 0 }}>
            <Scene />
          </motion.div>
        </AppShell>
      )}

      {/* gradient progress bar — film aesthetic */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(24,20,45,0.06)', zIndex: 10 }}>
        <motion.div
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: ease.out }}
          style={{ height: '100%', background: t.ai }} />
      </div>
    </div>
  )
}
