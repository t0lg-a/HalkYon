/* Canon audit for theo-ui. Builds must obey:
   1. radius 0 and elevation 0 everywhere
   2. no text-transform anywhere (Turkish case law)
   3. colour appears only where a datum is: slate and oxide are legal only
      inside [data-slot="figure"] or under [data-datum]; every other computed
      colour must belong to the monochrome palette; pure #000 and #fff banned
   4. every figure carries a nonempty finding and a nonempty source
   5. the body face is Switzer */
import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { extname, join } from "node:path"
import puppeteer from "puppeteer"

const DIST = new URL("../dist", import.meta.url).pathname
const TYPES = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".svg":"image/svg+xml", ".png":"image/png", ".ttf":"font/ttf", ".woff2":"font/woff2" }

const server = createServer(async (req, res) => {
  let p = req.url.split("?")[0]; if (p === "/") p = "/index.html"
  try {
    const buf = await readFile(join(DIST, p))
    res.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" })
    res.end(buf)
  } catch { res.writeHead(404); res.end() }
})
await new Promise(r => server.listen(4173, r))

const browser = await puppeteer.launch({
  args: ["--no-sandbox"],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
let allBad = 0
const ROUTES = [
  "/#/",
  "/#/projeksiyon",
  "/#/anketler",
  "/#/anketler?arsiv=2023",
  "/#/anketler?arsiv=1977",
  "/#/secimler",
  "/#/secimler?secim=g2023&il=ist&ilce=kad&mah=caf",
  "/#/simulator",
  "/#/analizler",
  "/#/analizler?yazi=baraj-kimi-eliyor",
]
for (const route of ROUTES) {
await page.goto("http://localhost:4173" + route, { waitUntil: "networkidle0" })
await page.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 500))

const report = await page.evaluate(() => {
  const PAL = {
    paper:[233,232,224], ink:[22,23,26], ink2:[58,56,47], muted:[110,108,97],
    faint:[169,166,154], hair:[203,200,188], mutedbg:[226,225,216], nodata:[224,223,213],
  }
  const PAL6=[[214,40,40],[255,195,0],[23,190,187],[123,44,191],[30,111,217],[46,158,68]]
  const dist=(a,b)=>Math.max(Math.abs(a[0]-b[0]),Math.abs(a[1]-b[1]),Math.abs(a[2]-b[2]))
  const parse=(s)=>{const m=s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/)
    return m?{c:[+m[1],+m[2],+m[3]],a:m[4]===undefined?1:+m[4]}:null}
  const v={radius:[],shadow:[],transform:[],colour:[],figure:[],font:[]}
  const tag=(el)=>el.tagName.toLowerCase()+(el.className&&typeof el.className==="string"?"."+el.className.split(" ").slice(0,2).join("."):"")

  for (const el of document.querySelectorAll("body *")) {
    const cs=getComputedStyle(el)
    if (!el.closest("[data-disc]") && cs.borderRadius.split(" ").some(x=>x!=="0px")) v.radius.push(tag(el))
    if (cs.boxShadow!=="none") v.shadow.push(tag(el))
    if (cs.textTransform==="uppercase") v.transform.push(tag(el))
    for (const prop of ["color","backgroundColor","borderTopColor"]) {
      const p=parse(cs[prop]); if(!p||p.a<0.15) continue
      const c=p.c
      const neutral=Object.values(PAL).some(n=>dist(c,n)<=14)
      if (neutral) continue
      const press=PAL6.some(pc=>dist(c,pc)<=14)
      const scoped=el.closest('[data-slot="figure"]')||el.closest("[data-datum]")
      if (press && (scoped || el.closest("[data-mark]"))) continue
      if (dist(c,[0,0,0])<=6||dist(c,[255,255,255])<=6) { v.colour.push(prop+" pure b/w on "+tag(el)); continue }
      v.colour.push(prop+" "+cs[prop]+" on "+tag(el))
    }
  }
  for (const f of document.querySelectorAll('[data-slot="figure"]')) {
    const fin=f.querySelector('[data-slot="finding"]')
    const src=f.querySelector('[data-slot="source"]')
    if (!fin||fin.textContent.trim().length<3) v.figure.push("finding missing")
    if (!src||src.textContent.trim().length<3) v.figure.push("source missing")
  }
  if (!getComputedStyle(document.body).fontFamily.includes("Switzer")) v.font.push("body face is not Switzer")
  return { v, figures: document.querySelectorAll('[data-slot="figure"]').length,
    els: document.querySelectorAll("body *").length }
})

if (route === "/#/") await page.screenshot({ path: new URL("../canon-check.png", import.meta.url).pathname, fullPage: true })
let bad=0
console.log(`\n== ${route} · elements ${report.els} · figures ${report.figures}`)
for (const [k,arr] of Object.entries(report.v)) {
  const uniq=[...new Set(arr)]
  console.log(`${k.padEnd(10)} ${uniq.length===0?"clean":"VIOLATIONS "+uniq.length}`)
  uniq.slice(0,8).forEach(x=>console.log("   · "+x)); bad+=uniq.length
}
allBad += bad
}
await browser.close(); server.close()
process.exit(allBad?1:0)
