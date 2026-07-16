import { useMemo, useState } from "react"
import { Figure, Ladder, DataTable } from "@/components/theo"
import { Button } from "@/components/ui/button"
import { tr, trn } from "@/lib/format"
import { PageHead, SectionHead } from "@/site/shell"
import { SwingRow } from "@/site/swing-input"
import { allocate } from "@/lib/dhondt"
import {
  PARTIES, DISTRICTS, MAJORITY, SEATS_TOTAL, THRESHOLD,
} from "@/data/sample"

/* The swingometer template. A uniform national swing, applied district by
   district and put through D'Hondt, live. The base is invented; the
   arithmetic is honest. */

const SIFIR = PARTIES.map(() => 0)
const TABAN = allocate(DISTRICTS, SIFIR, THRESHOLD)

const KAYNAK_SIM =
  "Sentetik taban, 40 temsili bölge, tekdüze salınım ve bölge içi D'Hondt. Bir şablondur; hiçbir seçimin kaydı değildir."

export default function Simulator() {
  const [swing, setSwing] = useState<number[]>(SIFIR)
  const sim = useMemo(() => allocate(DISTRICTS, swing, THRESHOLD), [swing])

  const lider = sim.totals.reduce((best, v, i) => (v > sim.totals[best] ? i : best), 0)
  const liderKoltuk = sim.totals[lider]
  const bulgu =
    liderKoltuk >= MAJORITY
      ? `${PARTIES[lider].name} tek başına çoğunlukta: ${trn(liderKoltuk)} koltuk.`
      : `${PARTIES[lider].name} önde: ${trn(liderKoltuk)} koltuk, çoğunluğa ${trn(MAJORITY - liderKoltuk)} eksik.`

  return (
    <>
      <PageHead kicker="simülatör · tekdüze ulusal salınım · sentetik taban" title={bulgu}>
        Sürgüler ulusal salınımı puan cinsinden ayarlar; {trn(DISTRICTS.length)} temsili
        bölgede D'Hondt yeniden hesaplanır.{" "}
        <b style={{ fontWeight: 600, color: "var(--ink)" }}>
          Taban sentetiktir; bu sayfa bir şablondur, tahmin aracı değildir.
        </b>
      </PageHead>

      <section className="mt-8">
        <SectionHead title="Salınımı ayarla; koltuklar aşağıda yeniden dağılır." aside="puan · eksi 15 ile artı 15 arası" />
        <div className="max-w-[640px] pt-3">
          {PARTIES.map((p, i) => (
            <SwingRow
              key={p.id}
              label={p.name}
              value={swing[i]}
              onChange={(v) => setSwing(swing.map((s, j) => (j === i ? v : s)))}
            />
          ))}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button variant="secondary" className="btn-sm" onClick={() => setSwing(SIFIR)}>
              sıfırla
            </Button>
            <span className="lbl-f">
              baraj yüzde {trn(THRESHOLD)} · ulusal payı barajın altında kalan parti hiçbir bölgede koltuk alamaz
            </span>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-x-10 md:grid-cols-2">
        <Figure
          finding={bulgu}
          dek={`${trn(SEATS_TOTAL)} koltuk; çoğunluk için ${trn(MAJORITY)}.`}
          howToRead="sürgüler ulusal salınımı ayarlar; her satır hesaplanan koltuk, dik çizgi 301 çoğunluk çizgisidir."
          source={KAYNAK_SIM}
        >
          <Ladder
            rows={PARTIES.map((p, i) => ({ label: p.name, value: sim.totals[i], ink: p.ink }))}
            threshold={MAJORITY}
            max={SEATS_TOTAL}
            display={(v) => trn(v)}
          />
        </Figure>
        <Figure
          finding={
            sim.eligible[5] === TABAN.eligible[5]
              ? "Fark sütunu tabana göre kaymayı gösteriyor."
              : sim.eligible[5]
                ? `${PARTIES[5].name} barajı geçti; koltuklar yeniden dağıldı.`
                : `${PARTIES[5].name} barajın altına indi; koltukları dağıldı.`
          }
          dek="Ulusal pay, hesaplanan koltuk ve tabana göre fark."
          source={KAYNAK_SIM}
        >
          <div className="overflow-x-auto">
            <DataTable
              columns={["parti", "ulusal oy %", "koltuk", "taban", "fark"]}
              rows={PARTIES.map((p, i) => {
                const fark = sim.totals[i] - TABAN.totals[i]
                return [
                  p.name,
                  tr(sim.national[i]),
                  sim.eligible[i] ? trn(sim.totals[i]) : "0 · baraj altı",
                  trn(TABAN.totals[i]),
                  `${fark > 0 ? "+" : ""}${trn(fark)}`,
                ]
              })}
            />
          </div>
        </Figure>
      </div>
    </>
  )
}
