import { Figure, Ladder, Spine, Pair, DataTable, Absent } from "@/components/theo"
import { tr, trn } from "@/lib/format"
import { href } from "@/lib/route"
import { PageHead, SectionHead } from "@/site/shell"
import { Scatter } from "@/site/scatter"
import {
  PARTIES, POLLS, TREND, BASELINE, THRESHOLD, ARSIV, ARSIV_SPECIMEN,
  SCATTER, SCATTER_MEAN, KAYNAK,
} from "@/data/sample"

/* The aggregator template: the running table, the trend, and the archive
   shelf back to 1950. Years are real calendar; records are invented. */

const gaps = POLLS.map((p) => p.shares[0] - p.shares[1])
const GAP_MIN = Math.min(...gaps)
const GAP_MAX = Math.max(...gaps)
const latest = POLLS[0]
const oldest = POLLS[POLLS.length - 1]
const RISING = PARTIES.filter((_, i) => latest.shares[i] > oldest.shares[i]).length

function ArsivKaydi({ id }: { id: string }) {
  const entry = ARSIV.find((a) => a.id === id)
  const filled = id === ARSIV_SPECIMEN.id
  const top2 = ARSIV_SPECIMEN.rows[0].share + ARSIV_SPECIMEN.rows[1].share
  return (
    <>
      <PageHead
        kicker={`anketler · arşiv · genel seçim ${entry ? entry.label : "?"} · temsili kayıt`}
        title={
          filled
            ? `Katılım yüzde ${tr(ARSIV_SPECIMEN.turnout)}; ilk iki parti birlikte ${tr(top2)} pay alıyor.`
            : "Bu yılın şablon kaydı henüz doldurulmadı."
        }
      >
        Arşiv kayıtları bu şablonda temsilidir; yıl gerçek takvimden gelir, sayılar üretilmiştir.
      </PageHead>

      {filled ? (
        <div className="mt-6 grid gap-x-10 md:grid-cols-2">
          <Figure
            finding={`En büyük pay ${tr(ARSIV_SPECIMEN.rows[0].share)}; bir parti barajın altında kalıyor.`}
            dek="Oy payları ve temsili baraj."
            howToRead="her satır oy payı; dik çizgi barajı gösterir."
            source={KAYNAK}
          >
            <Ladder
              rows={ARSIV_SPECIMEN.rows.map((r) => ({ label: r.party.name, value: r.share, ink: r.party.ink }))}
              threshold={THRESHOLD}
              max={40}
            />
          </Figure>
          <Figure
            finding={`600 koltuğun ${trn(ARSIV_SPECIMEN.rows[0].seats)} tanesi tek partide.`}
            dek="Oy payı ve koltuk, parti parti."
            source={KAYNAK}
          >
            <DataTable
              columns={["parti", "oy %", "koltuk"]}
              rows={ARSIV_SPECIMEN.rows.map((r) => [r.party.name, tr(r.share), trn(r.seats)])}
            />
          </Figure>
        </div>
      ) : (
        <div className="mt-6 max-w-[640px]">
          <Figure
            finding="Bu adres için örnek kayıt yok."
            dek="Şablon arşivi yalnızca bir yılı temsili olarak doldurur."
            source="Şablon dizini. Gerçek arşiv verisi kapsam dışıdır."
          >
            <Absent note="arşiv kaydı hazırlanıyor · absent is absent, not zero" />
          </Figure>
        </div>
      )}

      <p className="mt-8">
        <a href={href("anketler")} className="lbl underline underline-offset-2">arşiv dizinine dön</a>
      </p>
    </>
  )
}

export default function Anketler({ params }: { params: URLSearchParams }) {
  const arsiv = params.get("arsiv")
  if (arsiv) return <ArsivKaydi id={arsiv} />

  return (
    <>
      <PageHead
        kicker="anketler · sıradaki genel seçim · temsili toplayıcı"
        title={`İlk iki parti arasındaki fark son ankette ${tr(latest.shares[0] - latest.shares[1])} puan.`}
      >
        Kuruluş adları ve bütün paylar üretilmiştir.{" "}
        <b style={{ fontWeight: 600, color: "var(--ink)" }}>
          Bu tablo bir şablondur; hiçbir yayımlanmış anketi aktarmaz.
        </b>
      </PageHead>

      <div className="mt-8">
        <Figure
          finding={`Son on iki ankette fark ${tr(GAP_MIN)} ile ${tr(GAP_MAX)} puan arasında.`}
          dek="Kuruluş, tarih, örneklem ve parti payları. Temsili kayıtlar."
          source={KAYNAK}
        >
          <div className="overflow-x-auto">
            <DataTable
              columns={["kuruluş", "tarih", "n", ...PARTIES.map((p) => p.short)]}
              rows={POLLS.map((p) => [
                p.pollster, p.date, trn(p.n), ...p.shares.map((s) => tr(s)),
              ])}
            />
          </div>
        </Figure>
      </div>

      <div className="mt-4">
        <Figure
          finding="Örneklem küçüldükçe ölçülen fark açılıyor."
          dek={`${trn(SCATTER.length)} temsili anket: örneklem büyüklüğüne karşı ilk iki parti arasındaki fark, puan.`}
          howToRead="her nokta bir anket; sağa doğru örneklem büyür, yatay çizgi bütün noktaların ortalamasıdır."
          source={KAYNAK}
        >
          <Scatter points={SCATTER} mean={SCATTER_MEAN} />
        </Figure>
      </div>

      <div className="mt-4 grid gap-x-10 md:grid-cols-2">
        {[0, 1].map((i) => {
          const d = TREND[i][TREND[i].length - 1].value - BASELINE[i]
          return (
            <Figure
              key={PARTIES[i].id}
              finding={`${PARTIES[i].name} temmuzda tabanının ${tr(Math.abs(d))} puan ${d >= 0 ? "üstünde" : "altında"}.`}
              dek="Yedi aylık ortalama, temsili seri."
              howToRead="çentikler taban çizgisinden sapar; çizgi birleştirilmez."
              source={KAYNAK}
            >
              <Spine points={TREND[i]} baseline={BASELINE[i]} />
            </Figure>
          )
        })}
      </div>

      <div className="mt-4">
        <Figure
          finding={`Ay içinde ${trn(RISING)} parti yükseldi, ${trn(PARTIES.length - RISING)} parti geriledi.`}
          dek="Ayın ilk ve son anketi, parti parti. Temsili kayıtlar."
          howToRead="içi boş işaret ayın ilk anketi, dolu işaret son anket; dik çizgi yüzde 7 barajıdır."
          source={KAYNAK}
        >
          <Pair
            rows={PARTIES.map((p, i) => ({
              label: p.name,
              a: oldest.shares[i],
              b: latest.shares[i],
              ink: p.ink,
            }))}
            domain={[0, 40]}
            threshold={THRESHOLD}
            display={(v) => tr(v)}
          />
        </Figure>
      </div>

      <section className="mt-12">
        <SectionHead
          title="Arşiv: 1950'den bu yana her genel seçim."
          aside="yıllar gerçek · kayıtlar temsili"
        />
        <div className="flex flex-wrap gap-x-5 gap-y-2.5 pt-4">
          {ARSIV.map((a) => (
            <a
              key={a.id}
              href={href("anketler", { arsiv: a.id })}
              className="lbl fig underline underline-offset-2"
            >
              {a.label}
            </a>
          ))}
        </div>
        <p className="t-src">
          Yıllar gerçek takvimdir; arşiv kayıtları bu şablonda temsilidir ve tek örnek yıl doldurulmuştur.
        </p>
      </section>
    </>
  )
}
