import type { ReactNode } from "react"

/* The separate product. Mass-audience rules apply inside this frame only:
   the unusual form is the hook and the title is the takeaway. Nothing here
   leaks back into the expert surfaces. */
export function BroadcastCard({
  finding,
  n,
  slug = "theoelections",
  children,
}: {
  finding: string
  n?: string
  slug?: string
  children?: ReactNode
}) {
  return (
    <div className="t-card" data-slot="figure">
      <span className="t-slug lbl">{slug}</span>
      <div className="t-claim" data-slot="finding">{finding}</div>
      {children ? <div style={{ marginTop: "clamp(10px,2vw,22px)" }}>{children}</div> : null}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "clamp(8px,1.6vw,16px)" }}>
        <span className="lbl-m" data-slot="source">kaynak kartın altında · source travels with the card</span>
        {n ? <span className="lbl fig">{n}</span> : null}
      </div>
    </div>
  )
}
