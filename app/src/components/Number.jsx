import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'
import { ease, dur, tokens } from '../theme'

export default function CountUp({
  to,
  from = 0,
  duration = dur.count,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  formatter,
}) {
  const [val, setVal] = useState(from)

  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      delay,
      ease: ease.out,
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [to, from, duration, delay])

  return (
    <span style={{ fontFamily: tokens.font.mono, fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {formatter
        ? formatter(val)
        : val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}
