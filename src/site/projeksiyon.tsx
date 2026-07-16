import { Figure, Ladder, Comb, Band, DataTable } from "@/components/theo"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { tr, trn } from "@/lib/format"
import { PageHead } from "@/site/shell"
import {
  PARTIES, CANDIDATES, SEAT_PROJ, VOTE_PROJ, DRAWS, DRAWS_OVER,
  CB, CB_DRAWS, CB_UNDER, MAJORITY, SEATS_TOTAL, THRESHOLD, BASELINE, KAYNAK,
} from "@/data/sample"

/* The forecast template: parliament and presidency in two panels. Every
   draw comes from a seeded generator; the model is a stand-in. */

export default function Projeksiyon() {
  return (
    <>
      <PageHead
        kicker="projeksiyon · sıradaki genel ve cumhurbaşkanlığı seçimi · temsili model"
        title="Hiçbir parti 301'i tek başına garantilemiyor."
      >
        {trn(SEATS_TOTAL)} koltuk, çoğunluk için {trn(MAJORITY)}, ulusal baraj yüzde {trn(THRESHOLD)}.{" "}
        <b style={{ fontWeight: 600, color: "var(--ink)" }}>
          Model sentetiktir; aralıklar bir şablonun provasıdır, tahmin değildir.
        </b>
      </PageHead>

      <div className="mt-8">
        <Tabs defaultValue="meclis">
          <TabsList>
            <TabsTrigger value="meclis">meclis</TabsTrigger>
            <TabsTrigger value="cb">cumhurbaşkanlığı</TabsTrigger>
          </TabsList>

          <TabsContent value="meclis" forceMount className="data-[state=inactive]:hidden">
            <div className="mt-2 grid gap-x-10 md:grid-cols-2">
              <Figure
                finding={`En yüksek medyan ${trn(SEAT_PROJ[0].md)} koltuk, çoğunluğun ${trn(MAJORITY - SEAT_PROJ[0].md)} altında.`}
                dek="Partilerin medyan koltuk senaryosu. Temsili model."
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
              <Figure
                finding={`Tek parti çoğunluğu 500 çekilişte ${trn(DRAWS_OVER)} kez çıkıyor.`}
                dek="En büyük partinin koltuğu, çekiliş başına bir çizgi. Temsili model."
                howToRead="her çizgi bir çekiliş; kalın çizgi ortalama, 301 çoğunluk sınırıdır."
                source={KAYNAK}
              >
                <Comb values={DRAWS} min={200} max={360} display={(v) => trn(Math.round(v))} />
              </Figure>
            </div>
            <div className="grid gap-x-10 md:grid-cols-2">
              <Figure
                finding={`${PARTIES[5].name} yüzde ${trn(THRESHOLD)} barajının ${tr(THRESHOLD - BASELINE[5])} puan altında.`}
                dek="Medyan oy payları ve ulusal baraj. Temsili model."
                howToRead="her satır medyan oy payı; dik çizgi yüzde 7 barajıdır."
                source={KAYNAK}
              >
                <Ladder
                  rows={PARTIES.map((p, i) => ({ label: p.name, value: VOTE_PROJ[i].md, ink: p.ink }))}
                  threshold={THRESHOLD}
                  max={40}
                />
              </Figure>
              <Figure
                finding="Aralıklar kesin sonuç değil; bir parti baraj riski taşıyor."
                dek="Oy ve koltuk aralıkları, alt ve üst uçlarıyla. Temsili model."
                source={KAYNAK}
              >
                <div className="overflow-x-auto">
                  <DataTable
                    columns={["parti", "oy alt", "oy orta", "oy üst", "koltuk alt", "koltuk orta", "koltuk üst"]}
                    rows={PARTIES.map((p, i) => [
                      p.name,
                      tr(VOTE_PROJ[i].lo), tr(VOTE_PROJ[i].md), tr(VOTE_PROJ[i].hi),
                      trn(SEAT_PROJ[i].lo), trn(SEAT_PROJ[i].md), trn(SEAT_PROJ[i].hi),
                    ])}
                  />
                </div>
              </Figure>
            </div>
          </TabsContent>

          <TabsContent value="cb" forceMount className="data-[state=inactive]:hidden">
            <div className="mt-2 grid gap-x-10 md:grid-cols-2">
              <Figure
                finding={`${CANDIDATES[0].name} çizginin ${tr(CB.a - 50)} puan üstünde; aralık çizgiyi iki yönden kesiyor.`}
                dek="İki adayın temsili payı; halka 50'yi işaretler."
                howToRead="tek kap iki dolgu; dikiş payların sınırı, halka 50 eşiğidir."
                source={KAYNAK}
              >
                <Band
                  segments={[
                    { value: CB.a, ink: CANDIDATES[0].ink, label: CANDIDATES[0].name },
                    { value: CB.b, ink: CANDIDATES[1].ink, label: CANDIDATES[1].name },
                  ]}
                  threshold={{ at: 50, label: "50,0" }}
                />
              </Figure>
              <Figure
                finding={`Çekilişlerin ${trn(CB_UNDER)} tanesi ${CANDIDATES[0].name} payını 50'nin altında görüyor.`}
                dek={`${CANDIDATES[0].name} payı, çekiliş başına bir çizgi. Temsili model.`}
                howToRead="her çizgi bir çekiliş; kalın çizgi ortalamadır."
                source={KAYNAK}
              >
                <Comb values={CB_DRAWS} min={45} max={56} />
              </Figure>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
