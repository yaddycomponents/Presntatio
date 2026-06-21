// One command to render the deck to a video.
//
//   npm run record            # build → preview → record → convert → heisenberg.mp4
//
// Requires (already in devDependencies): playwright, vite.
//   npx playwright install chromium    # one-time, downloads the browser
// ffmpeg is optional — if missing, you'll get a .webm and a convert hint.

import { build, preview } from 'vite'
import { chromium } from 'playwright'
import { spawnSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const PORT = 4173
const TAIL_MS = 8000

console.log('▸ building…')
await build()

console.log('▸ starting preview…')
const server = await preview({ preview: { port: PORT, strictPort: false } })
const base = server.resolvedUrls.local[0].replace(/\/$/, '')
const url = `${base}/?play`
console.log(`▸ recording ${url}`)

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: 'video', size: { width: 1920, height: 1080 } },
})
const page = await context.newPage()
await page.goto(url, { waitUntil: 'load', timeout: 60000 })

await page.waitForFunction(() => {
  const el = document.querySelector('[data-scene]')
  if (!el) return false
  return Number(el.getAttribute('data-scene')) >= Number(el.getAttribute('data-scene-count')) - 1
}, null, { timeout: 240000, polling: 500 })

console.log('▸ final scene reached, finishing…')
await page.waitForTimeout(TAIL_MS)

await context.close() // finalizes the .webm
await browser.close()
await server.httpServer.close()

// newest .webm in ./video
const webm = readdirSync('video')
  .filter((f) => f.endsWith('.webm'))
  .map((f) => ({ f: join('video', f), t: statSync(join('video', f)).mtimeMs }))
  .sort((a, b) => b.t - a.t)[0]?.f

if (!webm) { console.log('✗ no video produced'); process.exit(1) }

const ff = spawnSync('ffmpeg', ['-y', '-i', webm, '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p', 'heisenberg.mp4'], { stdio: 'inherit' })
if (ff.status === 0) {
  console.log('✓ heisenberg.mp4 ready')
} else {
  console.log(`✓ video saved: ${webm}`)
  console.log('  (ffmpeg not found — convert with: ffmpeg -i ' + webm + ' -c:v libx264 -crf 20 -pix_fmt yuv420p heisenberg.mp4)')
}
process.exit(0)
