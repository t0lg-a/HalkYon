import { Figure, Band } from "@/components/theo"
import { Button } from "@/components/ui/button"
import { tr, trn } from "@/lib/format"
import { href, go } from "@/lib/route"
import { SectionHead } from "@/site/shell"
import { TileMap } from "@/site/tile-map"
import { ilTiles, MAP_COUNTS } from "@/site/map-data"
import {
  PARTIES, CANDIDATES, POLLS, SEATS_TOTAL, IL_TILES, DRAWS, ARSIV,
  ARTICLES, CB, KAYNAK,
} from "@/data/sample"

/* The front door. One claim, one band, the board of numbers, the map,
   and four doors into the desk. Everything on it is invented. */

const GAP = POLLS[0].shares[0] - POLLS[0].shares[1]

const STATS: [string, string][] = [
  [trn(SEATS_TOTAL), "koltuk, çoğunluk 301"],
  [trn(IL_TILES.length), "il kutu haritada"],
  [trn(DRAWS.length), "model çekilişi"],
  [trn(ARSIV.length), "arşiv seçimi, 1950'den beri"],
]

const DOORS: { key: string; kicker: string; title: string; dek: string }[] = [
  {
    key: "projeksiyon",
    kicker: "projeksiyon",
    title: "Hiçbir parti 301'i tek başına garantilemiyor.",
    dek: "Meclis ve cumhurbaşkanlığı için temsili aralıklar.",
  },
  {
    key: "anketler",
    kicker: "anketler",
    title: `Fark son ankette ${tr(GAP)} puan.`,
    dek: "Toplayıcı, eğilim ve 1950'den beri arşiv rafı.",
  },
  {
    key: "secimler",
    kicker: "seçimler",
    title: "Kayıt mahalleye kadar iniyor.",
    dek: "81 il, ilçe ve mahalle düzeyinde temsili sonuç.",
  },
  {
    key: "simulator",
    kicker: "simülatör",
    title: "Salınımı sen ayarla; 600 koltuk yeniden dağılır.",
    dek: "Tekdüze salınım, bölge içi D'Hondt, canlı hesap.",
  },
]

export default function Anasayfa() {
  return (
    <>
      <p className="lbl-m mt-9">halkyön · türkiye'nin seçim masası · temsili şablon</p>
      <h1
        className="mt-3 font-black"
        style={{ fontSize: "clamp(2.5rem,7.4vw,4.9rem)", lineHeight: 0.96, letterSpacing: "-.045em", maxWidth: "17ch" }}
      >
        Sayım, tahmin ve arşiv. Tek masa.
      </h1>
      <p className="ser mt-4 max-w-[58ch]" style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "var(--ink2)" }}>
        Projeksiyon, anket toplayıcısı, il il sonuç tarayıcısı ve koltuk simülatörü.{" "}
        <b style={{ fontWeight: 600, color: "var(--ink)" }}>
          Bu sürüm bir şablondur; her rakam temsilidir ve hiçbir seçimin kaydı değildir.
        </b>
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button className="btn-lg" onClick={() => go("simulator")}>simülatörü aç</Button>
        <a href={href("projeksiyon")} className="lbl underline underline-offset-2">projeksiyonu gör ›</a>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-x-7 gap-y-5 border-t border-t-ink pt-4">
        <div>
          <span className="lbl-m">temsili pay, geçerli oy</span>
          <div className="fig font-black" style={{ fontSize: "clamp(3.4rem,10vw,7.5rem)", lineHeight: 0.82, letterSpacing: "-.055em" }}>
            {tr(CB.a)}
          </div>
        </div>
        <div className="min-w-[270px] flex-1" data-slot="figure">
          <span className="sr-only" data-slot="finding">
            {CANDIDATES[0].name} çizginin {tr(CB.a - 50)} puan üstünde; yarış hâlâ açık.
          </span>
          <Band
            segments={[
              { value: CB.a, ink: CANDIDATES[0].ink, label: CANDIDATES[0].name },
              { value: CB.b, ink: CANDIDATES[1].ink, label: CANDIDATES[1].name },
            ]}
            threshold={{ at: 50, label: "50,0" }}
          />
          <span className="t-src block" data-slot="source">{KAYNAK}</span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-7 gap-y-6 md:grid-cols-4">
        {STATS.map(([n, label]) => (
          <div key={label} className="border-t border-t-ink pt-2">
            <div className="fig font-black" style={{ fontSize: "clamp(1.9rem,3.6vw,2.5rem)", lineHeight: 0.95, letterSpacing: "-.04em" }}>
              {n}
            </div>
            <span className="lbl-m mt-1 block">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Figure
          finding={`${PARTIES[MAP_COUNTS.top].name} ${trn(MAP_COUNTS.lead[MAP_COUNTS.top])} ilde önde; yarış ${trn(MAP_COUNTS.contested)} ilde 2,5 puandan yakın.`}
          dek="Kutu harita: her kutu bir il, alan eşit, komşuluk yaklaşık. Kutuya tıklayınca il açılır."
          howToRead="her kutu bir il, rakam plakadır; renk önde olan partinin rengidir, koyu kutu 2,5 puandan yakın yarıştır."
          source={KAYNAK}
        >
          <TileMap
            tiles={ilTiles((id) => href("secimler", { secim: "g2023", il: id }))}
            ariaLabel="il il önde olan parti, kutu harita"
          />
        </Figure>
      </div>

      <section className="mt-12">
        <SectionHead title="Masanın dört aracı." aside="hepsi temsili veriyle" />
        <div className="grid gap-x-10 md:grid-cols-2">
          {DOORS.map((d) => (
            <a key={d.key} href={href(d.key)} className="block border-b border-b-hair py-5">
              <p className="lbl-m">{d.kicker}</p>
              <span
                className="mt-1 block font-black"
                style={{ fontSize: "1.375rem", letterSpacing: "-.022em", lineHeight: 1.2 }}
              >
                {d.title}
              </span>
              <p className="ser mt-1.5" style={{ fontSize: "1rem", lineHeight: 1.5, color: "var(--ink2)" }}>
                {d.dek}
              </p>
              <span className="lbl mt-2.5 inline-block underline underline-offset-2">gir ›</span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHead title="Son analizler, hepsi yer tutucu." aside="yazılar · analizler" />
        <div>
          {ARTICLES.slice(0, 3).map((a) => (
            <div key={a.slug} className="border-b border-b-hair py-4">
              <p className="lbl-m">{a.kicker}</p>
              <a
                href={href("analizler", { yazi: a.slug })}
                className="mt-1 inline-block underline underline-offset-2"
                style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-.018em", lineHeight: 1.25 }}
              >
                {a.title}
              </a>
              <p className="lbl-f fig mt-1.5">{a.date} · {a.author}</p>
            </div>
          ))}
        </div>
        <p className="t-src">
          Başlıklar ve metinler yer tutucudur.{" "}
          <a href={href("analizler")} className="underline underline-offset-2">bütün yazılar ›</a>
        </p>
      </section>
    </>
  )
}
