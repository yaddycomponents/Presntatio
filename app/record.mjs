// Render the deck to a CRISP mp4 — lossless frame capture, no VP8.
//
//   npm run record
//
// How it stays sharp: it drives the deck with a fake clock and captures
// pixel-perfect PNG frames at 2x (4K), piping them straight into ffmpeg
// (no lossy intermediate video), then downscales to a clean 1080p mp4.
//
// Requires ffmpeg:  brew install ffmpeg
// And the browser:  npx playwright install chromium
//
// Tunables:  FPS=30  SCALE=2  OUT=heisenberg.mp4  node record.mjs
//   SCALE=1 → capture at 1080p (faster, smaller, still lossless)

import { build, preview } from 'vite'
import { chromium } from 'playwright'
import { spawn, spawnSync } from 'node:child_process'

const FPS = Number(process.env.FPS || 30)
const SCALE = Number(process.env.SCALE || 2)
const OUT = process.env.OUT || 'heisenberg.mp4'
const TAIL_S = 8
const frameMs = 1000 / FPS
const maxFrames = 260 * FPS

if (spawnSync('ffmpeg', ['-version']).status !== 0) {
  console.error('✗ ffmpeg not found. Install it (brew install ffmpeg) — it is required for the crisp render.')
  process.exit(1)
}

console.log('▸ building…')
await build()

console.log('▸ starting preview…')
const server = await preview({ preview: { port: 4173, strictPort: false } })
const base = server.resolvedUrls.local[0].replace(/\/$/, '')
const url = `${base}/?play`

const browser = await chromium.launch({ args: [`--force-device-scale-factor=${SCALE}`] })
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: SCALE })
const page = await context.newPage()
await page.clock.install({ time: 0 })
await page.goto(url, { waitUntil: 'load', timeout: 60000 })
await page.waitForSelector('[data-scene]')

console.log(`▸ rendering ${url}  (${FPS}fps · ${SCALE}x capture → 1080p)`)

const ff = spawn('ffmpeg', [
  '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-vf', 'scale=1920:1080:flags=lanczos',
  '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p', OUT,
], { stdio: ['pipe', 'inherit', 'inherit'] })

const writeFrame = (buf) => new Promise((res) => {
  if (ff.stdin.write(buf)) res()
  else ff.stdin.once('drain', res)
})

const lastIndex = Number(await page.getAttribute('[data-scene]', 'data-scene-count')) - 1
let frames = 0
let tail = 0
const tailFrames = TAIL_S * FPS

while (frames < maxFrames) {
  await page.clock.runFor(frameMs)
  await writeFrame(await page.screenshot({ type: 'png' }))
  frames++
  const cur = Number(await page.getAttribute('[data-scene]', 'data-scene'))
  if (cur >= lastIndex) { if (++tail >= tailFrames) break }
  if (frames % FPS === 0) process.stdout.write(`\r  ${(frames / FPS).toFixed(0)}s captured…`)
}

ff.stdin.end()
await new Promise((res) => ff.on('close', res))
await context.close()
await browser.close()
await server.httpServer.close()
console.log(`\n✓ ${OUT} ready — crisp 1080p (${frames} frames @ ${FPS}fps)`)
process.exit(0)
