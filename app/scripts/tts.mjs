#!/usr/bin/env node
// Generate one MP3 per scene from src/narration.json.
//
//   ELEVENLABS_API_KEY=... VOICE_ID=... node scripts/tts.mjs
//
// Clips are generated in order and stitched: each request is given the previous
// three request-ids plus the neighbouring text, so the model keeps one continuous
// read across all 40 scenes instead of resetting its tone on every clip. Without
// this, a deadpan register drifts audibly over eight minutes.
//
// Pauses come from line breaks, not SSML — each sentence sits on its own line.
// Send the text with its blank lines intact; collapsing them removes the pauses.
//
// Flags:
//   --model=id  override the model (default: meta.recommendedModel)
//   --only=id   regenerate a single scene (stitching context is rebuilt first)
//   --dry       print what would be sent, call nothing

import fs from 'node:fs'
import path from 'node:path'

const API = 'https://api.elevenlabs.io/v1/text-to-speech'
const KEY = process.env.ELEVENLABS_API_KEY
const VOICE = process.env.VOICE_ID
const OUT = 'out/vo'

const args = process.argv.slice(2)
const modelArg = args.find((a) => a.startsWith('--model='))?.split('=')[1]
const dry = args.includes('--dry')
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1]

if (!dry && (!KEY || !VOICE)) {
  console.error('Set ELEVENLABS_API_KEY and VOICE_ID (or pass --dry).')
  process.exit(1)
}

const { meta, scenes } = JSON.parse(fs.readFileSync('src/narration.json', 'utf8'))
const model = modelArg ?? meta.recommendedModel


fs.mkdirSync(OUT, { recursive: true })

const ids = []
let generated = 0

for (const [i, s] of scenes.entries()) {
  const text = s.text
  const body = {
    text,
    model_id: model,
    voice_settings: meta.voiceSettings,
    previous_request_ids: ids.slice(-3),
    previous_text: i > 0 ? scenes[i - 1].text : undefined,
    next_text: i < scenes.length - 1 ? scenes[i + 1].text : undefined,
  }

  const file = path.join(OUT, `${String(s.n).padStart(2, '0')}-${s.id}.mp3`)
  const words = text.split(/\s+/).filter(Boolean).length
  const est = (words / meta.wordsPerSecond).toFixed(1)
  const over = est > s.budget ? `  ⚠ over budget (${s.budget}s)` : ''

  if (dry) {
    console.log(`${s.n}. ${s.id} — ${words}w ≈ ${est}s / ${s.budget}s${over}`)
    continue
  }

  // A skipped scene still needs its request-id in the chain, so re-request it
  // rather than reusing the cached file — otherwise stitching context is lost.
  const res = await fetch(`${API}/${VOICE}`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    console.error(`${s.id}: ${res.status} ${await res.text()}`)
    process.exit(1)
  }

  ids.push(res.headers.get('request-id'))

  if (!only || only === s.id) {
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
    generated++
    console.log(`✓ ${file}  ${words}w ≈ ${est}s${over}`)
  }
}

if (!dry) console.log(`\n${generated} clip(s) written to ${OUT}/  ·  model: ${model}`)
