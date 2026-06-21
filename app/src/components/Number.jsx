import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { ease, dur, tokens } from '../theme'

export default function CountUp({
  to,
  from = 0,
  duration = dur.count,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(from)

  useEffect(() => {
    if (!inView) return
    const controls = animate(from, to, {
      duration,
      delay,
      ease: ease.out,
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [to, from, duration, delay, inView])

  return (
    <span ref={ref} style={{ fontFamily: tokens.font.mono, fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}
