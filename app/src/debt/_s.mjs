import { chromium } from 'playwright'
const OUT='/private/tmp/claude-501/-Users-yathavan-Desktop-Presnetatio/d9734f25-036d-483b-a288-d13420c7453f'
const b=await chromium.launch()
const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1})
// f6 = user pasting asgard path (types in input); f7 = asgard update
for(const [id,ms] of [['f6',1500],['f7',2600]]){
  await p.goto(`http://localhost:5199/debt?scene=${id}`,{waitUntil:'networkidle'})
  await p.waitForTimeout(ms)
  await p.screenshot({path:`${OUT}/ag-${id}.png`})
  console.log('shot',id)
}
await b.close()
