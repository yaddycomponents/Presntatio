# Narration Script — "A Platform Modernization Story"

Written for text-to-speech. Wes Anderson register: a chronicler reading from a ledger,
formal, unhurried, faintly amused, never excited.

## Voice direction

- **Pace:** measured — roughly 2.2 words per second. Do not rush the numbers.
- **Tone:** deadpan and precise. The humor is in the flatness, never in emphasis.
- **Numbers:** read as written, evenly, as though reciting an inventory.
- **Never:** rising "commercial" inflection, enthusiasm, or vocal fry on the last word.
- **Reference voices:** Alec Baldwin in *The Royal Tenenbaums*, Bob Balaban in *Moonrise Kingdom*.
- **Suggested TTS settings:** stability high, style/exaggeration low, speed ~0.92×.

## Pause markers

Pauses are written as SSML: `<break time="500ms"/>`.

- **Azure / Google / Amazon Polly:** wrap each scene in `<speak>…</speak>` and use as-is.
- **ElevenLabs:** `<break time="..."/>` is supported directly. If output sounds clipped,
  replace with an em-dash followed by a newline.
- **Anything else:** replace each tag with a single ellipsis `…`.

**Timing:** each scene shows for `dur + 1.4s` (the reader-hold). The budget column is that
total. Lines are written a little under budget so the pauses have room to breathe.

---

## Act 0 — Open

**1 · `intro`** — *budget 4.9s*
> A platform modernization. <break time="400ms"/> In four acts.

**2 · `title`** — *budget 6.4s*
> Faster. Lighter. Built to scale. <break time="600ms"/> Those were the instructions. <break time="400ms"/> What follows is what happened.

---

## Act I — The Weight of Growth

**3 · `chapter-problem`** — *budget 5.9s*
> Act One. The Weight of Growth. <break time="600ms"/> Every success arrived carrying luggage.

**4 · `problem`** — *budget 7.4s*
> Thirteen megabytes, on every visit. <break time="400ms"/> Six seconds before anything appeared. <break time="400ms"/> And fifteen filter systems — each of them slightly different.

---

## Act II — The Rebuild

**5 · `chapter-rebuild`** — *budget 5.9s*
> Act Two. The Rebuild. <break time="600ms"/> They began, as one does, by deleting things.

**6 · `scale`** — *budget 6.9s*
> Two hundred twenty-nine commits. One thousand seven hundred sixty-eight files. <break time="500ms"/> They deleted more than they wrote. <break time="300ms"/> On purpose.

**7 · `monolith`** — *budget 7.9s*
> The application had been shipped as one enormous parcel. <break time="500ms"/> It was opened, sorted, and repacked. <break time="300ms"/> Two hundred forty-nine smaller ones.

**8 · `chunk-bars`** — *budget 7.9s*
> This is where the weight had been living. <break time="600ms"/> Four bundles, comfortable, undisturbed, <break time="300ms"/> and downloaded by every single visitor.

**9 · `eager-boot`** — *budget 7.9s*
> Previously, the dashboard asked for everything. <break time="500ms"/> Now it asks for what the dashboard needs. <break time="400ms"/> A modest idea, arrived at late.

**10 · `preload`** — *budget 7.9s*
> Without preload, the browser discovers its files one after another. <break time="500ms"/> With it, it collects the important ones at once. <break time="300ms"/> The page begins sooner.

**11 · `prefetch`** — *budget 10.9s*
> Consider the sidebar. <break time="500ms"/> The pointer merely rests on Inbox — it does not click — <break time="400ms"/> and the page's bundles begin arriving quietly in the background. <break time="500ms"/> Assets only. <break time="300ms"/> Zero requests to the server. <break time="400ms"/> Nobody has decided anything yet.

**12 · `import-chain`** — *budget 7.4s*
> One function. <break time="400ms"/> Three hundred fifty-seven kilobytes. <break time="500ms"/> Delivered faithfully, on every page load, <break time="300ms"/> to people who never once used it.

**13 · `import-fix`** — *budget 7.4s*
> The remedy was a single line. <break time="600ms"/> Three hundred fifty-seven kilobytes became zero. <break time="400ms"/> These are the most satisfying repairs, and the least visible.

**14 · `bundle`** — *budget 6.9s*
> Time to paint: halved. <break time="500ms"/> The screen now arrives before the user has finished deciding to wait for it.

**15 · `safety-nets`** — *budget 12.4s*
> For years the build required twelve gigabytes of heap <break time="300ms"/> and a ten-gigabyte swap file, <break time="400ms"/> to keep it from collapsing. <break time="600ms"/> Rolldown bundles in Rust — off the Node heap entirely. <break time="500ms"/> So the swap file was deleted. The heap fell to four. <break time="500ms"/> The scaffolding came down, <break time="300ms"/> because the building no longer falls down.

**16 · `rules`** — *budget 6.9s*
> Certain lessons were written down, <break time="400ms"/> so that they would not have to be learned a second time.

**17 · `css-flow`** — *budget 9.4s*
> The styles had been living inside the JavaScript, <break time="400ms"/> recomputed in the browser on every render. <break time="600ms"/> They were moved into ordinary files. <break time="400ms"/> They are now computed once — by the build.

**18 · `layer`** — *budget 9.9s*
> Cascade layers decide who wins. <break time="500ms"/> Ours are ordered; the last one always does. <break time="600ms"/> Then version six arrived with unlayered styles — <break time="400ms"/> outside every layer, and therefore above them all. <break time="300ms"/> This was handled.

**19 · `consolidation`** — *budget 9.4s*
> There had been fifteen filter systems. <break time="500ms"/> One fix required fifteen fixes. <break time="600ms"/> They became a single configuration-driven module — <break time="400ms"/> roughly sixty-five percent of the filter layer, simply gone.

**20 · `filter-ux`** — *budget 7.4s*
> One filter now. <break time="400ms"/> The same pills, the same saved views, <break time="300ms"/> across fifteen pages that had never once agreed.

**21 · `filter-keyboard`** — *budget 7.4s*
> It can be operated entirely by keyboard. <break time="600ms"/> The people who work here all day <break time="300ms"/> tend to notice this first.

**22 · `filter-wins`** — *budget 6.9s*
> Architecture that compounds. <break time="500ms"/> Each thing built on it is cheaper than the thing before it.

**23 · `windowed`** — *budget 7.9s*
> Formerly, every tile fetched at once, whether or not you looked at it. <break time="600ms"/> Now a tile fetches when it enters view. <break time="300ms"/> Not before.

**24 · `virtual-list`** — *budget 7.4s*
> The list renders only what is on screen. <break time="500ms"/> A thousand rows, or ten. <break time="400ms"/> The browser cannot tell the difference.

**25 · `url-state`** — *budget 10.4s*
> Your place is kept in the address bar. <break time="500ms"/> The filters, the page, the customer — all of it. <break time="600ms"/> You may now send a colleague a link <break time="400ms"/> and be entirely confident about what they will see.

**26 · `upgrades`** — *budget 7.4s*
> React eighteen. Vite eight. React Query. <break time="500ms"/> The foundation was replaced while the building remained open.

**27 · `hardening`** — *budget 7.4s*
> Four leaks were found in the startup path. <break time="500ms"/> Objects created on every render, and never once closed. <break time="300ms"/> They are closed now.

---

## Act III — The Payoff

**28 · `chapter-payoff`** — *budget 5.9s*
> Act Three. The Payoff. <break time="600ms"/> What all of it actually bought.

**29 · `headline`** — *budget 7.9s*
> The dashboard loads in seven hundred fifty-five milliseconds. <break time="400ms"/> Two and a half megabytes. <break time="400ms"/> Fourteen startup calls, where there had been forty-three.

**30 · `bytes-went`** — *budget 7.4s*
> Every line moves in the same direction. <break time="600ms"/> This is rarer than it sounds, <break time="300ms"/> and was not guaranteed.

**31 · `compression`** — *budget 8.4s*
> Two thirds less code was written. <break time="400ms"/> Compression did the remaining third. <break time="600ms"/> We cite the bytes that crossed the network — <break time="300ms"/> those are the ones the user waits for.

**32 · `build-time`** — *budget 9.4s*
> The build once took one minute and forty-four seconds. <break time="600ms"/> It now takes fifteen. <break time="500ms"/> Ninety seconds returned, on every push, <break time="300ms"/> to every engineer, forever.

**33 · `caveats`** — *budget 7.9s*
> Some honesty, briefly. <break time="500ms"/> Different deployments. Different datasets. Cold loads. <break time="400ms"/> Read the direction — <break time="300ms"/> and not the decimals.

**34 · `oneline`** — *budget 6.9s*
> One filter system. <break time="400ms"/> Not fifteen. <break time="600ms"/> If you remember a single line, we would prefer it were that one.

**35 · `customer`** — *budget 6.9s*
> It loads two and a half times faster. <break time="400ms"/> The feeds no longer freeze. <break time="400ms"/> Customers did not need to be told any of this.

**36 · `developer`** — *budget 6.9s*
> One toolkit. Less code to own. <break time="500ms"/> The team now spends its time on things that did not exist last year.

---

## Act IV — The Agents

**37 · `chapter-agents`** — *budget 5.9s*
> Act Four. The Agents. <break time="600ms"/> A fast build introduced a new kind of mistake.

**38 · `agents`** — *budget 10.4s*
> The component library now ships its own expertise. <break time="500ms"/> Alfred keeps the house. He does not write code. <break time="400ms"/> He determines who should. <break time="600ms"/> A quick question, you look up yourself. <break time="400ms"/> A real job is sent away — and reports back.

**39 · `neo`** — *budget 10.4s*
> Neo reads every pull request before anyone else does. <break time="600ms"/> On this one, it found a command-injection hole — <break time="400ms"/> in the workflow written to harden the pipeline. <break time="600ms"/> One dollar and seventy-six cents. <break time="400ms"/> Seven and a half minutes. <break time="300ms"/> No human had opened the file.

**40 · `closing`** — *budget 7.4s*
> The platform, re-engineered. <break time="700ms"/> Faster, lighter, and considerably harder to break. <break time="500ms"/> Thank you for your attention.

---

## Notes

- **Scene 15** (`safety-nets`) is the longest at 12.4s and carries the most narration.
  If the read runs long, cut *"The scaffolding came down, because the building no longer
  falls down"* — the visual already makes that point.
- **Scene 29** (`headline`) deliberately names only three of the six on-screen figures.
  Reading all six sounds like a spreadsheet; three sounds like a verdict.
- **Scenes 3, 5, 28, 37** are chapter cards. Leave extra silence after each — they are
  the breathing points of the film.
- The last line of scene 39 (*"No human had opened the file"*) should land completely flat.
  It is the driest moment in the script and the one most likely to be over-performed.
