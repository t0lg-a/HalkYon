import type { ReactNode } from "react"
import { SourceLine, HowToRead } from "./primitives"

/* The Borkin gate, enforced at the type level: a Figure does not compile
   without a finding and a source. The finding states the takeaway, never
   the form. The decode line gates every novel form for the cold reader. */
export function Figure({
  finding,
  dek,
  howToRead,
  source,
  children,
}: {
  finding: string
  dek?: string
  howToRead?: string
  source: string
  children: ReactNode
}) {
  return (
    <figure className="t-figure" data-slot="figure">
      <h3 className="t-ft" data-slot="finding">{finding}</h3>
      {dek ? <p className="t-fd">{dek}</p> : null}
      <div style={{ marginTop: 12 }}>{children}</div>
      {howToRead ? <HowToRead>{howToRead}</HowToRead> : null}
      <SourceLine>{source}</SourceLine>
    </figure>
  )
}
