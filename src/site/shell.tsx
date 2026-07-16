import type { ReactNode } from "react"
import { Lbl, Rule } from "@/components/theo"
import HalkYonLogo from "@/components/halkyon/logo"
import { href } from "@/lib/route"

/* The shared skeleton: slab, masthead with the mark, six lowercase links,
   the standing synthetic slug, and the footer line. The mark is the name;
   the name is never set in type in chrome. */

export type PageKey =
  | "anasayfa"
  | "projeksiyon"
  | "anketler"
  | "secimler"
  | "simulator"
  | "analizler"

const NAV: { key: PageKey; label: string }[] = [
  { key: "anasayfa", label: "anasayfa" },
  { key: "projeksiyon", label: "projeksiyon" },
  { key: "anketler", label: "anketler" },
  { key: "secimler", label: "seçimler" },
  { key: "simulator", label: "simülatör" },
  { key: "analizler", label: "analizler" },
]

/* The prototypical page opening: kicker, display headline, dek. The
   strangeness lives inside the slots, never in their placement. */
export function PageHead({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children?: ReactNode
}) {
  return (
    <>
      <p className="lbl-m mt-7">{kicker}</p>
      <h1
        className="mt-2 max-w-[24ch] font-black"
        style={{ fontSize: "clamp(1.9rem,4.8vw,3.3rem)", lineHeight: 1.02, letterSpacing: "-.038em" }}
      >
        {title}
      </h1>
      {children ? (
        <p className="ser mt-3 max-w-[64ch]" style={{ fontSize: "1.0625rem", lineHeight: 1.62, color: "var(--ink2)" }}>
          {children}
        </p>
      ) : null}
    </>
  )
}

/* Grade 1 section head: one ink rule, the title states a finding. */
export function SectionHead({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-b-ink pb-1.5">
      <span className="t-ft" style={{ fontSize: "1.0625rem" }}>{title}</span>
      {aside ? <span className="lbl-f hidden sm:block">{aside}</span> : null}
    </div>
  )
}

export function Shell({ active, children }: { active: PageKey; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[1040px] px-5 pb-24">
      <div className="slab -mx-5" />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
        <a href={href("anasayfa")} aria-label="halkyön anasayfa">
          <span className="sm:hidden"><HalkYonLogo size={84} /></span>
          <span className="hidden sm:block"><HalkYonLogo size={116} /></span>
        </a>
        <nav className="flex flex-wrap items-baseline gap-x-4 gap-y-1" aria-label="site">
          {NAV.map((n) => (
            <a
              key={n.key}
              href={href(n.key)}
              className={n.key === active ? "lbl" : "lbl-m"}
              aria-current={n.key === active ? "page" : undefined}
              style={n.key === active ? { borderBottom: "2px solid var(--ink)", paddingBottom: 2 } : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <span className="lbl-f">temsili şablon · sentetik veri</span>
      </div>
      <Rule />
      {children}
      <div className="mt-14"><Rule /></div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
        <Lbl tone="faint">halkyön · bir theoelections masası</Lbl>
        <span className="lbl-f">bu site bir şablondur · bütün rakamlar temsilidir</span>
      </div>
    </main>
  )
}
