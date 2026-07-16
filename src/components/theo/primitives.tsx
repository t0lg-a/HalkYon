import type { ReactNode } from "react"
export function Lbl({ tone = "ink", children }: { tone?: "ink" | "mut" | "faint"; children: ReactNode }) {
  const cls = tone === "ink" ? "lbl" : tone === "mut" ? "lbl-m" : "lbl-f"
  return <span className={cls}>{children}</span>
}

export function Rule({ faint = false }: { faint?: boolean }) {
  return <div className={faint ? "rule-f" : "rule"} />
}

export function Absent({ note = "veri yok · absent is absent, not zero" }: { note?: string }) {
  return <div className="t-nodata">{note}</div>
}

export function SourceLine({ children }: { children: ReactNode }) {
  return <p className="t-src" data-slot="source">{children}</p>
}

export function HowToRead({ children }: { children: ReactNode }) {
  return (
    <p className="t-how">
      <b>nasıl okunur ·</b> {children}
    </p>
  )
}
