import { useCallback, useEffect, useRef, useState } from 'react'
import './theme.css'

// 1920×1080 fixed stage, scaled to fit the viewport and letterboxed on black.
// Scenes mount one at a time, so their CSS entrance animations (.rise/.slide/.pop)
// replay every time a scene becomes active — no JS animation library needed.
export default function DebtStage({ scenes }) {
  const params = new URLSearchParams(window.location.search)
  const clean = params.has('clean')
  const [i, setI] = useState(() => {
    const s = params.get('scene')
    if (!s) return 0
    const byId = scenes.findIndex((x) => x.id === s)
    if (byId >= 0) return byId
    const n = Number(s)
    return Number.isInteger(n) ? Math.min(scenes.length - 1, Math.max(0, n)) : 0
  })
  const [playing, setPlaying] = useState(() => params.has('play'))
  const [scale, setScale] = useState(1)
  const count = scenes.length
  const wrap = useRef(null)

  const go = useCallback((d) => {
    setI((prev) => Math.min(count - 1, Math.max(0, prev + d)))
  }, [count])

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); setPlaying(false); go(1) }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); setPlaying(false); go(-1) }
      if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  useEffect(() => {
    if (!playing) return
    if (i >= count - 1) return
    const ms = (scenes[i].dur ?? 6) * 1000
    const t = setTimeout(() => setI((p) => p + 1), ms)
    return () => clearTimeout(t)
  }, [playing, i, count, scenes])

  const scene = scenes[i]
  const Scene = scene.Component

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: clean || playing ? 'none' : 'default', overflow: 'hidden' }}>
      <div ref={wrap} style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: 'center', flex: '0 0 auto' }}>
        <div className="stage" data-scene={i} key={i}>
          <Scene />
        </div>
      </div>

      {!clean && (
        <>
          <div style={{ position: 'fixed', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6, pointerEvents: 'none' }}>
            {scenes.map((s, idx) => (
              <span key={s.id} style={{ width: idx === i ? 22 : 7, height: 7, borderRadius: 4, background: idx === i ? '#CBA6F7' : '#45475A', transition: 'width .3s' }} />
            ))}
          </div>
          {!playing && (
            <div style={{ position: 'fixed', top: 18, right: 22, fontFamily: "'Fira Code', monospace", fontSize: 12, color: '#6C7086', letterSpacing: '0.1em' }}>
              {i + 1}/{count} · ← → · space ▶
            </div>
          )}
        </>
      )}
    </div>
  )
}
