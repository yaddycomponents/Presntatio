// Render the deck to a CRISP, smooth mp4 — real-time CDP screencast (JPEG q100).
//
//   npm run record
//
// Why real-time: Framer Motion's declarative fades use the Web Animations API
// (compositor timeline), which fake/virtual clocks don't drive reliably — they
// render invisible. So we capture the page playing in real time via Chrome's
// screencast (near-lossless JPEG of the actual compositor), then assemble the
// frames into a constant-fps mp4 with ffmpeg. Correct animations + crisp text.
//
// ffmpeg is bundled (ffmpeg-static). Browser: npx playwright install chromium

import { build, preview } from 'vite'
import { chromium } from 'playwright'
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import ffmpegStatic from 'ffmpeg-static'

const OUT = process.env.OUT || 'heisenberg.mp4'
const OUTFPS = Number(process.env.FPS || 30)
const TAIL_MS = 7000
const DIR = 'frames'

const FFMPEG = (ffmpegStatic && spawnSync(ffmpegStatic, ['-version']).status === 0)
  ? ffmpegStatic
  : (spawnSync('ffmpeg', ['-version']).status === 0 ? 'ffmpeg' : null)
if (!FFMPEG) { console.error('✗ no ffmpeg (run: npm i -D ffmpeg-static)'); process.exit(1) }

console.log('▸ building…')
await build()

console.log('▸ starting preview…')
const server = await preview({ preview: { port: 4173, strictPort: false } })
const base = server.resolvedUrls.local[0].replace(/\/$/, '')
const url = `${base}/?play${process.env.HOLD ? `&hold=${process.env.HOLD}` : ''}`

rmSync(DIR, { recursive: true, force: true })
mkdirSync(DIR, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
const page = await context.newPage()
const client = await context.newCDPSession(page)

let n = 0
let firstTs = null
let lastTs = null
client.on('Page.screencastFrame', async (e) => {
  n += 1
  if (firstTs === null) firstTs = e.metadata.timestamp
  lastTs = e.metadata.timestamp
  writeFileSync(join(DIR, `f${String(n).padStart(6, '0')}.jpg`), Buffer.from(e.data, 'base64'))
  try { await client.send('Page.screencastFrameAck', { sessionId: e.sessionId }) } catch {}
})

await page.goto(url, { waitUntil: 'load', timeout: 60000 })
await page.waitForSelector('[data-scene]')
await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {})

const lastIndex = Number(await page.getAttribute('[data-scene]', 'data-scene-count')) - 1
console.log(`▸ recording ${url} (real-time, JPEG q100)…`)
await client.send('Page.startScreencast', { format: 'jpeg', quality: 100, everyNthFrame: 1 })

// wait (real time) until autoplay reaches the last scene, then a tail
for (;;) {
  await page.waitForTimeout(500)
  const cur = Number(await page.getAttribute('[data-scene]', 'data-scene'))
  if (cur >= lastIndex) break
}
await page.waitForTimeout(TAIL_MS)
await client.send('Page.stopScreencast')
await new Promise((r) => setTimeout(r, 300)) // flush trailing frames

const captured = readdirSync(DIR).filter((f) => f.endsWith('.jpg')).length
const inFps = (captured > 1 && lastTs > firstTs) ? (captured - 1) / (lastTs - firstTs) : OUTFPS
console.log(`▸ ${captured} frames @ ${inFps.toFixed(1)}fps → encoding ${OUTFPS}fps…`)

await context.close()
await browser.close()
await server.httpServer.close()

const ff = spawnSync(FFMPEG, [
  '-y', '-framerate', inFps.toFixed(4), '-i', join(DIR, 'f%06d.jpg'),
  '-vf', 'scale=1920:1080:flags=lanczos', '-r', String(OUTFPS),
  '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p', OUT,
], { stdio: 'inherit' })

rmSync(DIR, { recursive: true, force: true })
if (ff.status === 0) console.log(`✓ ${OUT} ready — crisp, real-time motion`)
else { console.error('✗ ffmpeg failed'); process.exit(1) }
process.exit(0)
