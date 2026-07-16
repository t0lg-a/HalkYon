import type { District } from "@/lib/dhondt"

/* ==========================================================================
   The single swap point. Every display name and every number the site shows
   lives in this module, and every number is synthetic: a seeded generator
   invents it, nothing here is a record of any election. Party and candidate
   names are placeholders by design; geography names and election years are
   structure only.
   ========================================================================== */

export type Ink = "d1" | "d2" | "d3" | "d4" | "d5" | "d6"

/* deterministic PRNG, same helpers the workbench used */
const seeded = (s: number) => () => {
  s |= 0
  s = (s + 0x6d2b79f5) | 0
  let t = Math.imul(s ^ (s >>> 15), 1 | s)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const gauss = (r: () => number) => {
  let u = 0,
    v = 0
  while (!u) u = r()
  while (!v) v = r()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

/* ---- parties and candidates · multi-series takes the palette in order ---- */

export type Party = { id: string; name: string; short: string; ink: Ink }

export const PARTIES: Party[] = [
  { id: "pa", name: "Parti A", short: "A", ink: "d1" },
  { id: "pb", name: "Parti B", short: "B", ink: "d2" },
  { id: "pc", name: "Parti C", short: "C", ink: "d3" },
  { id: "pd", name: "Parti D", short: "D", ink: "d4" },
  { id: "pe", name: "Parti E", short: "E", ink: "d5" },
  { id: "pf", name: "Parti F", short: "F", ink: "d6" },
]

/* two-way contests wear 1 and 5 */
export const CANDIDATES = [
  { id: "ca", name: "Aday A", ink: "d1" as Ink },
  { id: "cb", name: "Aday B", ink: "d5" as Ink },
]

export const SEATS_TOTAL = 600
export const MAJORITY = 301
export const THRESHOLD = 7

/* national baseline shares; the trailing remainder is "diğer" */
export const BASELINE = [32.4, 27.8, 12.6, 9.3, 7.4, 5.1]
export const OTHERS = 5.4

/* ---- projection fixtures ------------------------------------------------- */

export type Range = { lo: number; md: number; hi: number }

export const SEAT_PROJ: Range[] = [
  { lo: 214, md: 246, hi: 278 },
  { lo: 172, md: 198, hi: 226 },
  { lo: 58, md: 74, hi: 90 },
  { lo: 36, md: 48, hi: 62 },
  { lo: 24, md: 34, hi: 46 },
  { lo: 0, md: 0, hi: 41 },
]

export const VOTE_PROJ: Range[] = BASELINE.map((v, i) => ({
  lo: Math.max(0, v - 2.6 + i * 0.1),
  md: v,
  hi: v + 2.4 - i * 0.1,
}))

/* 500 model draws of the largest party's seats, for the comb */
const rDraw = seeded(107)
export const DRAWS = Array.from({ length: 500 }, () =>
  Math.round(Math.max(205, Math.min(355, 285 + gauss(rDraw) * 19))),
)
export const DRAWS_OVER = DRAWS.filter((d) => d >= MAJORITY).length

/* presidential two-way and its draws */
export const CB = { a: 50.6, b: 49.4 }
const rCb = seeded(43)
export const CB_DRAWS = Array.from({ length: 500 }, () =>
  Math.max(45, Math.min(55.8, 50.6 + gauss(rCb) * 1.7)),
)
export const CB_UNDER = CB_DRAWS.filter((d) => d < 50).length

/* ---- poll aggregator fixtures -------------------------------------------- */

export type Poll = { pollster: string; date: string; n: number; shares: number[] }

const rPoll = seeded(71)
const POLLSTERS = ["Araştırma A", "Araştırma B", "Araştırma C", "Araştırma D", "Araştırma E",
  "Araştırma F", "Araştırma G", "Araştırma H", "Araştırma J", "Araştırma K"]
export const POLLS: Poll[] = Array.from({ length: 12 }, (_, i) => ({
  pollster: POLLSTERS[Math.floor(rPoll() * POLLSTERS.length)],
  date: `${String(12 - i).padStart(2, "0")}.07.2026`,
  n: 1500 + Math.round(rPoll() * 17) * 100,
  shares: BASELINE.map((v) => Math.max(1, v + gauss(rPoll) * 1.2)),
}))

/* seven monthly aggregate points per party, oca to tem */
const AYLAR = ["oca", "şub", "mar", "nis", "may", "haz", "tem"]
const rTrend = seeded(59)
export const TREND: { label: string; value: number }[][] = BASELINE.map((base) => {
  let v = base + gauss(rTrend) * 1.4
  return AYLAR.map((label) => {
    v = v + gauss(rTrend) * 0.7 + (base - v) * 0.35
    return { label, value: Math.max(1, v) }
  })
})

/* ---- the archive · real years as structure, synthetic records ------------ */

export const ARSIV: { id: string; label: string }[] = [
  { id: "1950", label: "1950" }, { id: "1954", label: "1954" },
  { id: "1957", label: "1957" }, { id: "1961", label: "1961" },
  { id: "1965", label: "1965" }, { id: "1969", label: "1969" },
  { id: "1973", label: "1973" }, { id: "1977", label: "1977" },
  { id: "1983", label: "1983" }, { id: "1987", label: "1987" },
  { id: "1991", label: "1991" }, { id: "1995", label: "1995" },
  { id: "1999", label: "1999" }, { id: "2002", label: "2002" },
  { id: "2007", label: "2007" }, { id: "2011", label: "2011" },
  { id: "2015h", label: "haz 2015" }, { id: "2015k", label: "kas 2015" },
  { id: "2018", label: "2018" }, { id: "2023", label: "2023" },
]

export const ARSIV_SPECIMEN = {
  id: "2023",
  turnout: 87.2,
  rows: PARTIES.map((p, i) => ({
    party: p,
    share: [35.6, 25.3, 10.1, 8.9, 7.7, 6.2][i],
    seats: [268, 169, 71, 50, 42, 0][i],
  })),
}

/* ---- results browser · geography is structure, figures are invented ------ */

export type Unit = {
  id: string
  name: string
  level: "il" | "ilce" | "mah"
  parent?: string
  valid: number
  /* six party shares + diğer, sums to 100 */
  shares: number[]
}

const rGeo = seeded(19)
const jitter = (from: number[], sd: number): number[] => {
  const base = from.slice(0, 6).map((v) => Math.max(0.5, v + gauss(rGeo) * sd))
  const sum = base.reduce((a, b) => a + b, 0)
  return [...base.map((v) => (v / sum) * (100 - OTHERS)), OTHERS]
}

/* The 81 il as a tile grid: plate, name, and an approximate cell on a
   17 by 6 board. The board is the map (kutu harita): adjacency is kept
   roughly, shape is surrendered, every unit gets equal area. */
export const IL_TILES: [number, string, number, number][] = [
  [39, "Kırklareli", 0, 0], [34, "İstanbul", 2, 0], [67, "Zonguldak", 4, 0],
  [74, "Bartın", 5, 0], [37, "Kastamonu", 6, 0], [57, "Sinop", 7, 0],
  [55, "Samsun", 8, 0], [52, "Ordu", 9, 0], [28, "Giresun", 10, 0],
  [61, "Trabzon", 11, 0], [53, "Rize", 12, 0], [8, "Artvin", 13, 0], [75, "Ardahan", 14, 0],
  [22, "Edirne", 0, 1], [59, "Tekirdağ", 1, 1], [77, "Yalova", 2, 1],
  [41, "Kocaeli", 3, 1], [54, "Sakarya", 4, 1], [81, "Düzce", 5, 1],
  [14, "Bolu", 6, 1], [78, "Karabük", 7, 1], [18, "Çankırı", 8, 1],
  [19, "Çorum", 9, 1], [5, "Amasya", 10, 1], [60, "Tokat", 11, 1],
  [29, "Gümüşhane", 12, 1], [69, "Bayburt", 13, 1], [25, "Erzurum", 14, 1],
  [36, "Kars", 15, 1], [76, "Iğdır", 16, 1],
  [17, "Çanakkale", 0, 2], [10, "Balıkesir", 1, 2], [16, "Bursa", 2, 2],
  [11, "Bilecik", 3, 2], [26, "Eskişehir", 4, 2], [6, "Ankara", 6, 2],
  [71, "Kırıkkale", 7, 2], [66, "Yozgat", 8, 2], [58, "Sivas", 10, 2],
  [24, "Erzincan", 12, 2], [62, "Tunceli", 13, 2], [12, "Bingöl", 14, 2], [4, "Ağrı", 15, 2],
  [35, "İzmir", 0, 3], [45, "Manisa", 1, 3], [43, "Kütahya", 2, 3],
  [64, "Uşak", 3, 3], [3, "Afyonkarahisar", 4, 3], [40, "Kırşehir", 7, 3],
  [50, "Nevşehir", 8, 3], [38, "Kayseri", 9, 3], [44, "Malatya", 11, 3],
  [23, "Elazığ", 12, 3], [49, "Muş", 14, 3], [13, "Bitlis", 15, 3], [65, "Van", 16, 3],
  [9, "Aydın", 0, 4], [20, "Denizli", 2, 4], [15, "Burdur", 3, 4],
  [32, "Isparta", 4, 4], [42, "Konya", 6, 4], [68, "Aksaray", 7, 4],
  [51, "Niğde", 8, 4], [46, "Kahramanmaraş", 10, 4], [2, "Adıyaman", 11, 4],
  [21, "Diyarbakır", 12, 4], [72, "Batman", 13, 4], [56, "Siirt", 14, 4], [30, "Hakkari", 16, 4],
  [48, "Muğla", 1, 5], [7, "Antalya", 3, 5], [70, "Karaman", 6, 5],
  [33, "Mersin", 7, 5], [1, "Adana", 8, 5], [80, "Osmaniye", 9, 5],
  [31, "Hatay", 10, 5], [27, "Gaziantep", 11, 5], [79, "Kilis", 12, 5],
  [63, "Şanlıurfa", 13, 5], [47, "Mardin", 14, 5], [73, "Şırnak", 15, 5],
]

/* invented valid-vote weights; the twelve big desks keep their old figures */
const VALID_OVERRIDE: Record<number, number> = {
  34: 10842117, 6: 4185029, 35: 3214972, 16: 2276419, 42: 1567234, 1: 1621008,
  27: 1330547, 61: 622310, 21: 1101876, 38: 1012443, 55: 1004189, 31: 1152736,
}

export const ilId = (plate: number) => (plate === 34 ? "ist" : `p${plate}`)

const ILLER: Unit[] = [...IL_TILES]
  .sort((a, b) => a[0] - b[0])
  .map(([plate, name]) => ({
    id: ilId(plate),
    name,
    level: "il" as const,
    valid: VALID_OVERRIDE[plate] ?? Math.round(90000 + rGeo() * 820000),
    shares: jitter([...BASELINE], 8),
  }))

export const unitByPlate = (plate: number): Unit => ILLER.find((u) => u.id === ilId(plate))!

const ILCE_NAMES: [string, string, number][] = [
  ["kad", "Kadıköy", 391204], ["usk", "Üsküdar", 384117], ["bes", "Beşiktaş", 142530], ["fat", "Fatih", 296482],
]
const IST = ILLER.find((u) => u.id === "ist")!
const ILCELER: Unit[] = ILCE_NAMES.map(([id, name, valid]) => ({
  id, name, level: "ilce" as const, parent: "ist", valid, shares: jitter(IST.shares.slice(0, 6), 4),
}))

const MAH_NAMES: [string, string, number][] = [
  ["caf", "Caferağa Mah.", 18342], ["fnb", "Fenerbahçe Mah.", 24219], ["goz", "Göztepe Mah.", 31174], ["kos", "Koşuyolu Mah.", 12408],
]
const KAD = ILCELER[0]
const MAHALLELER: Unit[] = MAH_NAMES.map(([id, name, valid]) => ({
  id, name, level: "mah" as const, parent: "kad", valid, shares: jitter(KAD.shares.slice(0, 6), 3),
}))

export const GEO: Unit[] = [...ILLER, ...ILCELER, ...MAHALLELER]
export const geoChildren = (parent?: string): Unit[] =>
  parent === undefined ? ILLER : GEO.filter((u) => u.parent === parent)
export const geoById = (id: string): Unit | undefined => GEO.find((u) => u.id === id)

export const SECIM_LIST = [
  { id: "g2023", label: "genel seçim 2023 · temsili" },
  { id: "g2018", label: "genel seçim 2018 · temsili" },
]

/* ---- simulator baseline · forty invented districts ------------------------ */

const rDist = seeded(83)
const rawSeats = Array.from({ length: 40 }, () => 6 + rDist() * 22)
const rawSum = rawSeats.reduce((a, b) => a + b, 0)
const seatDraws = rawSeats.map((v) => Math.max(4, Math.round((v / rawSum) * SEATS_TOTAL)))
{
  /* walk the rounding drift out one seat at a time; the sum lands on 600 */
  let drift = SEATS_TOTAL - seatDraws.reduce((a, b) => a + b, 0)
  for (let i = 0; drift !== 0; i = (i + 1) % seatDraws.length) {
    const step = drift > 0 ? 1 : -1
    if (seatDraws[i] + step >= 4) {
      seatDraws[i] += step
      drift -= step
    }
  }
}
export const DISTRICTS: District[] = seatDraws.map((seats, i) => ({
  id: `b${String(i + 1).padStart(2, "0")}`,
  name: `Bölge ${String(i + 1).padStart(2, "0")}`,
  seats,
  shares: (() => {
    const base = BASELINE.map((v) => Math.max(0.5, v + gauss(rDist) * 6))
    const sum = base.reduce((a, b) => a + b, 0)
    return [...base.map((v) => (v / sum) * (100 - OTHERS)), OTHERS]
  })(),
}))

/* ---- the poll scatter · sample size against the measured gap -------------- */

/* small samples exaggerate the gap: noise scales with one over root n */
const rSc = seeded(131)
export const SCATTER: { n: number; gap: number }[] = Array.from({ length: 48 }, () => {
  const n = Math.round((800 + rSc() * 2600) / 50) * 50
  const gap = Math.max(0.2, BASELINE[0] - BASELINE[1] + gauss(rSc) * (92 / Math.sqrt(n)))
  return { n, gap }
})
export const SCATTER_MEAN =
  SCATTER.reduce((a, p) => a + p.gap, 0) / SCATTER.length

/* ---- the writings · placeholder texts, never published analysis ---------- */

export type Article = {
  slug: string
  kicker: string
  title: string
  dek: string
  date: string
  author: string
  body: string[]
}

const GOVDE = [
  "Bu paragraf bir yer tutucudur. Yayınlanacak analiz metni bu alana gelecek; şablon, yazının ölçüsünü ve sesini prova eder. Gövde yazısı Author ile dizilir, satır genişliği altmış dört karakteri geçmez.",
  "İkinci paragraf yazının orta yükünü temsil eder. Gerçek metin burada bir bulguyu açar, bir sayıyı bağlama oturtur ve okuru bir sonraki şekle taşır. Bu sürümde her cümle yalnızca yer tutar.",
  "Şekil aralarında kalan metin kısa tutulur; şekil kendi bulgusunu başlığında taşıdığı için gövde tekrar etmez. Bu paragraf da temsilidir ve hiçbir yayımlanmış yazıdan alınmamıştır.",
  "Kapanış paragrafı yazının vardığı yeri bir cümlede bırakır ve kaynağa işaret eder. Şablonun kapanışı da aynı işi prova eder: bu metin yer tutucudur, bir analiz değildir.",
]

export const ARTICLES: Article[] = [
  {
    slug: "baraj-kimi-eliyor",
    kicker: "yöntem · temsili yazı",
    title: "Baraj yüzde 7'de kalırsa iki parti dışarıda kalıyor.",
    dek: "Yer tutucu dek: eşiğin koltuk hesabına etkisi, temsili sayılarla.",
    date: "12.07.2026",
    author: "Yazar A",
    body: GOVDE,
  },
  {
    slug: "kirk-bolgenin-on-ikisi",
    kicker: "simülasyon · temsili yazı",
    title: "40 bölgenin 12'si tek salınımla el değiştiriyor.",
    dek: "Yer tutucu dek: tekdüze salınımın bölge haritasına etkisi.",
    date: "05.07.2026",
    author: "Yazar B",
    body: GOVDE,
  },
  {
    slug: "orneklem-ve-fark",
    kicker: "anketler · temsili yazı",
    title: "Örneklem 2.000'in altındaki anketler farkı abartıyor.",
    dek: "Yer tutucu dek: örneklem büyüklüğü ile ölçülen fark arasındaki ilişki.",
    date: "28.06.2026",
    author: "Yazar C",
    body: GOVDE,
  },
  {
    slug: "kararsizlar-tabloyu-oynatiyor",
    kicker: "yöntem · temsili yazı",
    title: "Kararsızlar dağıtılınca tablo 4 puan oynuyor.",
    dek: "Yer tutucu dek: kararsız dağıtım kurallarının uçları.",
    date: "19.06.2026",
    author: "Yazar A",
    body: GOVDE,
  },
  {
    slug: "ikinci-tur-matematigi",
    kicker: "projeksiyon · temsili yazı",
    title: "İkinci tur matematiği ilk turdan farklı işliyor.",
    dek: "Yer tutucu dek: iki adaylı yarışta pay ve fark ilişkisi.",
    date: "11.06.2026",
    author: "Yazar B",
    body: GOVDE,
  },
]

export const articleBySlug = (slug: string): Article | undefined =>
  ARTICLES.find((a) => a.slug === slug)

/* the standing source line every synthetic figure carries */
export const KAYNAK = "Sentetik örnek. Hiçbir seçimin kaydı değildir."
