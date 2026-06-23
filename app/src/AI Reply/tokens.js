// Self-contained SaaS theme for the AI Auto-Reply motion-graphic film.
// Deliberately separate from the deck's warm palette — a real product UI in
// grey/white, the app's purple primary, and the AI pink→blue gradient.

export const t = {
  canvas: '#f3f4f7',
  panel: '#ffffff',
  panelAlt: '#fafbfc',
  rail: '#190b30',
  border: '#e9ebf0',
  borderStrong: '#dde0e7',
  skeleton: 'rgba(24,20,45,0.07)',
  skeletonLite: 'rgba(24,20,45,0.045)',

  ink: '#1d2130',
  muted: '#7f8593',
  faint: '#aab0bd',

  primary: 'rgb(83,29,171)',
  primarySoft: 'rgba(83,29,171,0.08)',
  primaryLine: 'rgba(83,29,171,0.20)',

  ai: 'linear-gradient(64.05deg, #EB2F96 32.12%, #1D39C4 67.27%)',
  aiSoft: 'linear-gradient(90deg, rgba(235,47,150,0.08), rgba(29,57,196,0.08))',
  aiPink: '#EB2F96',
  aiBlue: '#1D39C4',

  good: '#17935f',
  goodSoft: 'rgba(23,147,95,0.10)',
  warn: '#e0852f',
  warnSoft: 'rgba(224,133,47,0.12)',
  danger: '#e0484d',
  dangerSoft: 'rgba(224,72,77,0.10)',

  shadow: '0 1px 2px rgba(24,20,45,0.05), 0 10px 30px rgba(24,20,45,0.07)',
  shadowSoft: '0 1px 2px rgba(24,20,45,0.04), 0 4px 14px rgba(24,20,45,0.05)',
  radius: 16,

  font: "'Space Grotesk', -apple-system, 'Segoe UI', Roboto, sans-serif",
  mono: "'Space Mono', ui-monospace, 'SFMono-Regular', monospace",
}

export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  soft: [0.4, 0, 0.2, 1],
}

export const dur = {
  fast: 0.45,
  base: 0.7,
  slow: 1.1,
}

export const spring = {
  gentle: { type: 'spring', stiffness: 90, damping: 18, mass: 1 },
  pop: { type: 'spring', stiffness: 300, damping: 22 },
  snappy: { type: 'spring', stiffness: 420, damping: 26 },
}

// shared type scale (px, viewport-aware)
export const type = {
  micro: 'clamp(10px, 0.85vw, 13px)',
  label: 'clamp(12px, 1.0vw, 16px)',
  body: 'clamp(14px, 1.25vw, 20px)',
  lead: 'clamp(18px, 1.7vw, 28px)',
  h3: 'clamp(20px, 2.0vw, 32px)',
  h2: 'clamp(30px, 3.8vw, 60px)',
  h1: 'clamp(40px, 5.6vw, 92px)',
  stat: 'clamp(40px, 6vw, 104px)',
}
