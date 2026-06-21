import Frame from './Frame'
import Diamond from './Diamond'
import { Kicker, MaskReveal, Line } from './Text'
import { tokens } from '../theme'

export default function Chapter({ part, title, subtitle }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Frame delay={0.05} color={tokens.text.onDark} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.55em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Diamond size={9} color={tokens.text.onDarkMuted} delay={0.5} />
          <Kicker delay={0.5} color={tokens.text.onDarkMuted}>{part}</Kicker>
          <Diamond size={9} color={tokens.text.onDarkMuted} delay={0.5} />
        </div>

        <MaskReveal delay={0.4} size={tokens.type.chapter} color={tokens.text.onDark}>{title}</MaskReveal>

        {subtitle && <Line delay={0.9} size={tokens.type.rowLabel} color={tokens.text.onDarkMuted}>{subtitle}</Line>}
      </div>
    </div>
  )
}
