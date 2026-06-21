const palette = {
  cream: '#f4e7d6',
  rose: '#d98c9a',
  sage: '#8aa9a6',
  paper: '#f6ead9',

  plum: '#5e3b46',
  plumDeep: '#6b4a55',
  mauve: '#8a6470',
  mauveSoft: '#a86e7c',

  roseBar: '#c97a8a',
  roseHot: '#a8536a',
  sageBar: '#8aa9a6',
  sageDeep: '#5b7d77',
  peach: '#e8b9a0',
  mint: '#cdd8c4',
  rule: '#d8b9ab',

  transparent: 'rgba(0,0,0,0)',
  flashAfter: 'rgba(91, 125, 119, 0.42)',
  flashBefore: 'rgba(168, 83, 106, 0.38)',
}

const font = {
  display: "'Yeseva One', Georgia, serif",
  body: "'Josefin Sans', system-ui, sans-serif",
  mono: "'Space Mono', ui-monospace, monospace",
}

export const tokens = {
  bg: {
    primary: palette.cream,
    title: palette.rose,
    alt: palette.sage,
    code: 'rgba(94, 59, 70, 0.06)',
  },
  text: {
    primary: palette.plum,
    muted: palette.mauve,
    eyebrow: palette.mauveSoft,
    onDark: palette.paper,
    onDarkMuted: 'rgba(246, 234, 217, 0.62)',
  },
  border: palette.plumDeep,
  line: palette.rule,

  data: {
    beforeBar: palette.roseBar,
    beforeNum: palette.roseHot,
    afterBar: palette.sageBar,
    afterNum: palette.sageDeep,
    peach: palette.peach,
    mint: palette.mint,
  },

  flash: {
    good: palette.flashAfter,
    bad: palette.flashBefore,
    none: palette.transparent,
  },

  font,

  type: {
    eyebrow: 'clamp(11px, 1.1vw, 15px)',
    body: 'clamp(16px, 2.1vw, 28px)',
    label: 'clamp(11px, 1.2vw, 16px)',
    rowLabel: 'clamp(15px, 1.6vw, 21px)',
    metric: 'clamp(17px, 2.1vw, 28px)',
    delta: 'clamp(12px, 1.3vw, 16px)',
    h2: 'clamp(26px, 4vw, 58px)',
    statement: 'clamp(38px, 7vw, 92px)',
    display: 'clamp(40px, 8vw, 120px)',
    hero: 'clamp(64px, 13vw, 200px)',
    stat: 'clamp(40px, 6.5vw, 96px)',
  },

  track: {
    eyebrow: '0.32em',
    label: '0.18em',
  },
}

export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  soft: [0.4, 0, 0.2, 1],
}

export const dur = {
  fast: 0.5,
  base: 0.8,
  slow: 1.2,
  draw: 1.1,
  count: 1.6,
}

export const spring = {
  gentle: { type: 'spring', stiffness: 90, damping: 18, mass: 1 },
  pop: { type: 'spring', stiffness: 260, damping: 20 },
}
