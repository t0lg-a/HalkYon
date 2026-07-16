import { Figure, Ladder, Band, Spine, AgateColumns } from "@/components/theo"
import { Button } from "@/components/ui/button"
import { tr, trn } from "@/lib/format"
import { href, go } from "@/lib/route"
import { PageHead, SectionHead } from "@/site/shell"
import {
  PARTIES, CANDIDATES, SEAT_PROJ, MAJORITY, SEATS_TOTAL, TREND, BASELINE,
  geoChildren, ARTICLES, CB, KAYNAK,
} from "@/data/sample"

/* The front page: a little of everything, every number invented. */

const ILLER = geoChildren()
const gapOf = (shares: number[]) => {
  const s = [...shares.slice(0, 6)].sort((a, b) => b - a)
  return s[0] - s[1]
}
const NEAR = ILLER.filter((u) => gapOf(u.shares) < 2.5).length

export default function Anasayfa() {
  const trendA = TREND[0][TREND[0].length - 1].value - BASELINE[0]
  return (
    <>
      <PageHead
        kicker="türkiye'nin seçim masası · bütün veriler sentetik"
        title={`${CANDIDATES[0].name} çizginin ${tr(CB.a - 50)} puan üstünde; yarış hâlâ açık.`}
      >
        Projeksiyon, anket toplayıcısı, sonuç tarayıcısı ve simülatör tek masada.{" "}
        <b style={{ fontWeight: 600, color: "var(--ink)" }}>
          Bu sayfa bir şablondur; her rakam temsilidir ve hiçbir seçimin kaydı değildir.
        </b>
      </PageHead>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-x-7 gap-y-5 border-t border-t-ink pt-4">
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

      <div className="mt-10 grid gap-x-10 md:grid-cols-2">
        <div>
          <Figure
            finding={`Medyan senaryoda en büyük parti çoğunluğun ${trn(MAJORITY - SEAT_PROJ[0].md)} koltuk altında.`}
            dek={`${trn(SEATS_TOTAL)} koltuk; çoğunluk için ${trn(MAJORITY)}. Temsili model.`}
            howToRead="her satır bir partinin medyan koltuğu; dik çizgi 301 çoğunluk çizgisidir."
            source={KAYNAK}
          >
            <Ladder
              rows={PARTIES.map((p, i) => ({ label: p.name, value: SEAT_PROJ[i].md, ink: p.ink }))}
              threshold={MAJORITY}
              max={SEATS_TOTAL}
              display={(v) => trn(v)}
            />
          </Figure>
          <a href={href("projeksiyon")} className="lbl underline underline-offset-2">projeksiyonun tamamı ›</a>
        </div>
        <div>
          <Figure
            finding={`${PARTIES[0].name} temmuz ortalamasında tabanının ${tr(Math.abs(trendA))} puan ${trendA >= 0 ? "üstünde" : "altında"}.`}
            dek="Yedi aylık anket ortalaması, temsili seri."
            howToRead="çentikler taban çizgisinden sapar; çizgi birleştirilmez."
            source={KAYNAK}
          >
            <Spine points={TREND[0]} baseline={BASELINE[0]} />
          </Figure>
          <a href={href("anketler")} className="lbl underline underline-offset-2">anket toplayıcısına git ›</a>
        </div>
      </div>

      <section className="mt-12">
        <SectionHead
          title={`Fark ${trn(NEAR)} ilde 2,5 puanın altında.`}
          aside="ters satır · fark 2,5 içinde"
        />
        <div className="pt-2.5">
          <AgateColumns
            rows={ILLER.slice(0, 8).map((u) => {
              const s = [...u.shares.slice(0, 6)].sort((a, b) => b - a)
              return { label: u.name, a: tr(s[0]), b: tr(s[1]) }
            })}
            mark={(r) => parseFloat(r.a.replace(",", ".")) - parseFloat((r.b ?? "0").replace(",", ".")) < 2.5}
          />
        </div>
        <p className="t-src">
          Temsili örnek birimler. Gerçek il adları yalnızca yapıdır; paylar sentetiktir.{" "}
          <a href={href("secimler")} className="underline underline-offset-2">sonuç tarayıcısına git ›</a>
        </p>
      </section>

      <section className="mt-12">
        <SectionHead title="Salınımı sen ayarla: 600 koltuk yeniden hesaplanır." />
        <p className="ser mt-3 max-w-[56ch]" style={{ fontSize: "1.0625rem", lineHeight: 1.62, color: "var(--ink2)" }}>
          Simülatör, sentetik bir taban üzerinde tekdüze ulusal salınımı bölge bölge
          D'Hondt ile koltuğa çevirir.
        </p>
        <div className="mt-4">
          <Button className="btn-lg" onClick={() => go("simulator")}>simülatörü aç</Button>
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
