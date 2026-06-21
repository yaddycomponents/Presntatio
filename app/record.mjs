// Records the deck (in autoplay) to a 1080p video.
//
// Setup (once):
//   npm i -D playwright && npx playwright install chromium
// Run:
//   npm run build && npm run preview      # serves on http://localhost:4173
//   node record.mjs                       # writes ./video/*.webm
//   ffmpeg -i video/*.webm -c:v libx264 -crf 20 -pix_fmt yuv420p heisenberg.mp4
//
// Override the URL if your preview port differs:  URL=http://localhost:5173 node record.mjs

import { chromium } from 'playwright'

const URL = process.env.URL || 'http://localhost:4173/?play'
const TAIL_MS = 8000 // let the final scene finish animating after it appears

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: 'video', size: { width: 1920, height: 1080 } },
})
const page = await context.newPage()
await page.goto(URL, { waitUntil: 'load' })

// wait until autoplay reaches the last scene
await page.waitForFunction(() => {
  const el = document.querySelector('[data-scene]')
  if (!el) return false
  return Number(el.getAttribute('data-scene')) >= Number(el.getAttribute('data-scene-count')) - 1
}, { timeout: 240000 })

await page.waitForTimeout(TAIL_MS)

await context.close() // finalizes the video file
await browser.close()
console.log('✓ video saved to ./video — convert with ffmpeg to mp4 (see header).')
