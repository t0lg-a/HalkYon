import { createServer } from "node:http"
import { readFile } from "node:fs/promises"
import { extname, join } from "node:path"
import puppeteer from "puppeteer"
const DIST = new URL("../dist", import.meta.url).pathname
const T = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".ttf":"font/ttf" }
const s = createServer(async (q,r)=>{let p=q.url.split("?")[0];if(p==="/")p="/index.html"
  try{const b=await readFile(join(DIST,p));r.writeHead(200,{"content-type":T[extname(p)]??"application/octet-stream"});r.end(b)}catch{r.writeHead(404);r.end()}})
await new Promise(r=>s.listen(4175,r))
const br = await puppeteer.launch({args:["--no-sandbox"],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined})
const pg = await br.newPage()
const ROUTES = ["#/", "#/projeksiyon", "#/anketler", "#/anketler?arsiv=2023",
  "#/secimler", "#/secimler?secim=g2023&il=ist&ilce=kad",
  "#/simulator", "#/analizler", "#/analizler?yazi=baraj-kimi-eliyor"]
for (const route of ROUTES) for (const w of [390, 768, 1280]) {
  await pg.setViewport({ width: w, height: 900 })
  await pg.goto("http://localhost:4175/" + route, { waitUntil: "networkidle0" })
  await pg.evaluate(() => document.fonts.ready)
  await new Promise(r=>setTimeout(r,300))
  const rep = await pg.evaluate(() => {
    const vw = innerWidth
    const out = []
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      if (r.right > vw + 1 || r.left < -1) {
        const t = el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.split(" ").slice(0,2).join(".") : "")
        out.push(`${t} L${Math.round(r.left)} R${Math.round(r.right)} txt:${(el.textContent||"").trim().slice(0,28)}`)
      }
    }
    return { scrollW: document.documentElement.scrollWidth, vw, out: [...new Set(out)].slice(0, 10) }
  })
  console.log(`\n== ${route} ${w}px  scrollWidth ${rep.scrollW} vs ${rep.vw} ${rep.scrollW > rep.vw ? "OVERFLOW" : "ok"}`)
  rep.out.forEach(x => console.log("  · " + x))
}
await br.close(); s.close()
