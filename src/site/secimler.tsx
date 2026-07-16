import { Figure, Ladder, DataTable, AgateColumns, Absent } from "@/components/theo"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { tr, trn } from "@/lib/format"
import { href, go } from "@/lib/route"
import { PageHead, SectionHead } from "@/site/shell"
import { PARTIES, SECIM_LIST, geoChildren, geoById, type Unit } from "@/data/sample"

/* The results browser template: pick an election, walk Türkiye to il to
   ilçe to mahalle. Place names are structure; every figure is invented. */

const ILLER = geoChildren()
const TOPLAM_VALID = ILLER.reduce((a, u) => a + u.valid, 0)
const NATIONAL: number[] = (() => {
  const acc = ILLER[0].shares.map(() => 0)
  for (const u of ILLER) for (let i = 0; i < u.shares.length; i++) acc[i] += u.shares[i] * u.valid
  return acc.map((v) => v / TOPLAM_VALID)
})()

const KAYNAK_SECIM = "Temsili örnek birimler. Gerçek yer adları yalnızca yapıdır; sayılar sentetiktir."

const rank = (shares: number[]) =>
  PARTIES.map((p, i) => ({ party: p, share: shares[i] })).sort((a, b) => b.share - a.share)

export default function Secimler({ params }: { params: URLSearchParams }) {
  const secim = SECIM_LIST.some((s) => s.id === params.get("secim"))
    ? (params.get("secim") as string)
    : SECIM_LIST[0].id
  const il = geoById(params.get("il") ?? "")
  const ilce = il ? geoChildren(il.id).find((u) => u.id === params.get("ilce")) : undefined
  const mah = ilce ? geoChildren(ilce.id).find((u) => u.id === params.get("mah")) : undefined

  const unit: Unit | undefined = mah ?? ilce ?? il
  const name = unit ? unit.name : "Türkiye"
  const shares = unit ? unit.shares : NATIONAL
  const valid = unit ? unit.valid : TOPLAM_VALID
  const ranked = rank(shares)
  const gap = ranked[0].share - ranked[1].share

  const children = geoChildren(unit?.id)
  const nearN = children.filter((u) => {
    const r = rank(u.shares)
    return r[0].share - r[1].share < 2.5
  }).length

  const drill = (level: "il" | "ilce" | "mah", v: string) => {
    if (level === "il") go("secimler", v === "all" ? { secim } : { secim, il: v })
    else if (level === "ilce")
      go("secimler", v === "all" ? { secim, il: il!.id } : { secim, il: il!.id, ilce: v })
    else
      go("secimler", v === "all"
        ? { secim, il: il!.id, ilce: ilce!.id }
        : { secim, il: il!.id, ilce: ilce!.id, mah: v })
  }

  const secimLabel = SECIM_LIST.find((s) => s.id === secim)!.label

  return (
    <>
      <PageHead
        kicker={`seçimler · sonuç tarayıcısı · ${secimLabel}`}
        title={`${name}: ${ranked[0].party.name} önde, fark ${tr(gap)} puan.`}
      >
        Sandık düzeyine inen sonuç tarayıcısının şablonu.{" "}
        <b style={{ fontWeight: 600, color: "var(--ink)" }}>
          Her birimdeki sayılar üretilmiştir; hiçbir seçimin kaydı değildir.
        </b>
      </PageHead>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Select value={secim} onValueChange={(v) => go("secimler", { secim: v })}>
          <SelectTrigger className="w-64" aria-label="seçim">
            <SelectValue placeholder="seçim" />
          </SelectTrigger>
          <SelectContent>
            {SECIM_LIST.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={il?.id ?? "all"} onValueChange={(v) => drill("il", v)}>
          <SelectTrigger className="w-44" aria-label="il">
            <SelectValue placeholder="il" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Türkiye · tüm iller</SelectItem>
            {ILLER.map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {il && geoChildren(il.id).length > 0 ? (
          <Select value={ilce?.id ?? "all"} onValueChange={(v) => drill("ilce", v)}>
            <SelectTrigger className="w-44" aria-label="ilçe">
              <SelectValue placeholder="ilçe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">il geneli</SelectItem>
              {geoChildren(il.id).map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        {ilce && geoChildren(ilce.id).length > 0 ? (
          <Select value={mah?.id ?? "all"} onValueChange={(v) => drill("mah", v)}>
            <SelectTrigger className="w-48" aria-label="mahalle">
              <SelectValue placeholder="mahalle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ilçe geneli</SelectItem>
              {geoChildren(ilce.id).map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>

      <p className="lbl-m mt-4">
        {unit ? (
          <a href={href("secimler", { secim })} className="underline underline-offset-2">Türkiye</a>
        ) : (
          <span className="lbl">Türkiye</span>
        )}
        {il ? (
          <>
            {" › "}
            {ilce ? (
              <a href={href("secimler", { secim, il: il.id })} className="underline underline-offset-2">{il.name}</a>
            ) : (
              <span className="lbl">{il.name}</span>
            )}
          </>
        ) : null}
        {ilce ? (
          <>
            {" › "}
            {mah ? (
              <a href={href("secimler", { secim, il: il!.id, ilce: ilce.id })} className="underline underline-offset-2">{ilce.name}</a>
            ) : (
              <span className="lbl">{ilce.name}</span>
            )}
          </>
        ) : null}
        {mah ? <>{" › "}<span className="lbl">{mah.name}</span></> : null}
      </p>

      <div className="mt-6 grid gap-x-10 md:grid-cols-2">
        <Figure
          finding={`${name}: ${ranked[0].party.name} ${tr(ranked[0].share)} pay ile önde.`}
          dek="Bu birimdeki oy payları. Temsili kayıt."
          howToRead="her satır bir partinin bu birimdeki payıdır."
          source={KAYNAK_SECIM}
        >
          <Ladder
            rows={PARTIES.map((p, i) => ({ label: p.name, value: shares[i], ink: p.ink }))}
            threshold={0}
            max={50}
          />
        </Figure>
        <Figure
          finding={`Geçerli oy ${trn(valid)}; dağılım tabloda.`}
          dek="Oy ve pay, parti parti. Temsili kayıt."
          source={KAYNAK_SECIM}
        >
          <DataTable
            columns={["parti", "oy", "pay %"]}
            rows={PARTIES.map((p, i) => [
              p.name,
              trn(Math.round((shares[i] / 100) * valid)),
              tr(shares[i]),
            ])}
          />
        </Figure>
      </div>

      <section className="mt-12">
        {children.length > 0 ? (
          <>
            <SectionHead
              title={`Alt birimler: fark ${trn(nearN)} birimde 2,5 puanın altında.`}
              aside="ters satır · fark 2,5 içinde"
            />
            <div className="pt-2.5">
              <AltBirimler units={children} />
            </div>
            <p className="t-src">
              {KAYNAK_SECIM} Alt birime inmek için yukarıdaki seçicileri kullanın.
            </p>
          </>
        ) : (
          <div className="max-w-[640px]">
            <Figure
              finding="Bu birimin altında örnek kayıt yok."
              dek="Şablon, İstanbul üzerinden mahalleye kadar iner; öteki birimler tek düzeydir."
              source={KAYNAK_SECIM}
            >
              <Absent note="alt birim kaydı yok · absent is absent, not zero" />
            </Figure>
          </div>
        )}
      </section>
    </>
  )
}

function AltBirimler({ units }: { units: Unit[] }) {
  return (
    <AgateColumns
      rows={units.map((u) => {
        const r = rank(u.shares)
        return { label: u.name, a: tr(r[0].share), b: tr(r[1].share) }
      })}
      mark={(row) =>
        parseFloat(row.a.replace(",", ".")) - parseFloat((row.b ?? "0").replace(",", ".")) < 2.5
      }
      viz={(row) => {
        const u = units.find((x) => x.name === row.label)!
        const r = rank(u.shares)
        return (
          <span className="t-mini" data-datum>
            <i style={{ left: 1, width: `${r[0].share}%`, background: `var(--${r[0].party.ink})` }} />
            <em className="sm" />
          </span>
        )
      }}
    />
  )
}
