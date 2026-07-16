import { Figure, Rule, Spine, Absent } from "@/components/theo"
import { tr } from "@/lib/format"
import { href } from "@/lib/route"
import { PageHead, SectionHead } from "@/site/shell"
import { ARTICLES, articleBySlug, TREND, BASELINE, PARTIES, KAYNAK } from "@/data/sample"

/* The writings: an index and one article surface, both placeholder. The
   prose face is Author; the body never repeats what a figure already says. */

const SER = { fontSize: "1.0625rem", lineHeight: 1.62, color: "var(--ink2)" } as const

function Yazi({ slug }: { slug: string }) {
  const a = articleBySlug(slug)
  if (!a) {
    return (
      <>
        <PageHead kicker="analizler · yazı" title="Bu adreste yazı yok.">
          Aradığınız kayıt şablon dizininde bulunmuyor.
        </PageHead>
        <div className="mt-6 max-w-[640px]">
          <Figure
            finding="Dizinde böyle bir kayıt yok."
            source="Şablon dizini yalnızca örnek kayıtları listeler."
          >
            <Absent note="yazı bulunamadı · absent is absent, not zero" />
          </Figure>
        </div>
        <p className="mt-8">
          <a href={href("analizler")} className="lbl underline underline-offset-2">analiz dizinine dön</a>
        </p>
      </>
    )
  }
  const d = TREND[0][TREND[0].length - 1].value - BASELINE[0]
  return (
    <>
      <PageHead kicker={a.kicker} title={a.title}>{a.dek}</PageHead>
      <p className="lbl-m fig mt-4">{a.author} · {a.date}</p>
      <div className="mt-3"><Rule /></div>
      <article lang="tr" className="mt-6">
        {a.body.slice(0, 2).map((p, i) => (
          <p key={i} className="ser mt-4 max-w-[64ch]" style={SER}>{p}</p>
        ))}
        <div className="my-6 max-w-[640px]">
          <Figure
            finding={`${PARTIES[0].name} temmuzda tabanının ${tr(Math.abs(d))} puan ${d >= 0 ? "üstünde" : "altında"}.`}
            dek="Yazıya gömülü örnek şekil; seri temsilidir."
            howToRead="çentikler taban çizgisinden sapar; çizgi birleştirilmez."
            source={KAYNAK}
          >
            <Spine points={TREND[0]} baseline={BASELINE[0]} />
          </Figure>
        </div>
        {a.body.slice(2).map((p, i) => (
          <p key={i} className="ser mt-4 max-w-[64ch]" style={SER}>{p}</p>
        ))}
      </article>
      <p className="t-src max-w-[64ch]">Yer tutucu metin. Yayınlanmış bir analiz değildir.</p>
      <p className="mt-8">
        <a href={href("analizler")} className="lbl underline underline-offset-2">analiz dizinine dön</a>
      </p>
    </>
  )
}

export default function Analizler({ params }: { params: URLSearchParams }) {
  const yazi = params.get("yazi")
  if (yazi) return <Yazi slug={yazi} />

  return (
    <>
      <PageHead
        kicker="analizler · yazı dizini · yer tutucu"
        title="Her yazı bulgusunu başlığında söyler."
      >
        Dizindeki başlıklar, dekler ve gövdeler yer tutucudur.{" "}
        <b style={{ fontWeight: 600, color: "var(--ink)" }}>
          Hiçbiri yayınlanmış bir analiz değildir.
        </b>
      </PageHead>

      <section className="mt-8">
        <SectionHead title={`Dizin: ${ARTICLES.length} temsili yazı.`} aside="en yeni üstte" />
        <div>
          {ARTICLES.map((a) => (
            <div key={a.slug} className="border-b border-b-hair py-5">
              <p className="lbl-m">{a.kicker}</p>
              <a
                href={href("analizler", { yazi: a.slug })}
                className="mt-1 inline-block underline underline-offset-2"
                style={{ fontWeight: 800, fontSize: "1.375rem", letterSpacing: "-.018em", lineHeight: 1.25 }}
              >
                {a.title}
              </a>
              <p className="ser mt-1.5 max-w-[56ch]" style={{ fontSize: "1rem", lineHeight: 1.55, color: "var(--ink2)" }}>
                {a.dek}
              </p>
              <p className="lbl-f fig mt-2">{a.date} · {a.author}</p>
            </div>
          ))}
        </div>
        <p className="t-src">Başlıklar ve metinler yer tutucudur; tarih ve yazar adları temsilidir.</p>
      </section>
    </>
  )
}
