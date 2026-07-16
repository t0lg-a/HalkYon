import type { CSSProperties } from "react"
import { Absent } from "./primitives"
import { tr } from "@/lib/format"

/* The forms, in the contour language. A vessel is a two-unit ink contour and
   always draws one hundred percent; colour fills only its inside; a value is
   never loose, it hangs from a leader with a dot at the data end; work in
   progress is hatching; a final result alone earns a solid cap. Everything
   carries data-datum. Absent is an empty vessel, not a dash. */

type Ink = "ink" | "d1" | "d2" | "d3" | "d4" | "d5" | "d6" | "slate" | "oxide"
const norm = (i?: Ink): Exclude<Ink, "slate" | "oxide"> =>
  i === "slate" ? "d1" : i === "oxide" ? "d5" : (i ?? "ink")
const fillVar = (i?: Ink) => `var(--${norm(i)})`
/* yellow, turquoise and green never carry text; blue only at large sizes */
const textVar = (i?: Ink, big = false) => {
  const n = norm(i)
  if (n === "d1" || n === "d4") return `var(--${n})`
  if (n === "d5" && big) return "var(--d5)"
  return "var(--ink)"
}

/* the leader: dot on the datum, line to the number */
export function Lead() {
  return (
    <svg className="t-lead" width="20" height="8" viewBox="0 0 20 8" aria-hidden="true">
      <circle cx="3.2" cy="4" r="3.2" fill="var(--ink)" />
      <line x1="3.2" y1="4" x2="20" y2="4" stroke="var(--ink)" strokeWidth="1.5" />
    </svg>
  )
}

/* LADDER · ranked units against a threshold, each in its own vessel. */
export function Ladder({
  rows,
  threshold = 50,
  max = 100,
  display = (v: number) => tr(v),
}: {
  rows?: { label: string; value: number; ink?: Ink }[]
  threshold?: number
  max?: number
  display?: (v: number) => string
}) {
  if (!rows || rows.length === 0) return <Absent />
  return (
    <div>
      {rows.map((r) => (
        <div className="t-lr" key={r.label}>
          <span>{r.label}</span>
          <span className="t-track" data-datum>
            <i className="t-fill" style={{ width: `${(r.value / max) * 100}%`, background: fillVar(r.ink) } as CSSProperties} />
            {threshold > 0 ? <i className="t-thr" style={{ left: `${(threshold / max) * 100}%` }} /> : null}
          </span>
          <span className="t-val fig">
            <Lead />
            <b style={{ color: textVar(r.ink), fontWeight: 800 }}>{display(r.value)}</b>
          </span>
        </div>
      ))}
    </div>
  )
}

/* SAYAC · counted work. The solid fill ends, the hatch carries on. */
export function Sayac({ value, max = 100 }: { value?: number; max?: number }) {
  if (value === undefined || value === null) return <Absent />
  const w = (value / max) * 100
  return (
    <div className="t-say" data-datum>
      <i className="f" style={{ width: `calc(${w}% - 1.5px)` }} />
      <i className="r t-tar" style={{ left: `calc(${w}% + 1.5px)` }} />
    </div>
  )
}

/* COMB · every unit is one hairline off a footed baseline. */
export function Comb({
  values,
  min = 0,
  max = 100,
  markMean = true,
  display = (v: number) => tr(v),
}: {
  values?: number[]
  min?: number
  max?: number
  markMean?: boolean
  display?: (v: number) => string
}) {
  if (!values || values.length === 0) return <Absent />
  const X = (v: number) => ((v - min) / (max - min)) * 100
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  return (
    <div data-datum>
      <div className="t-comb">
        {values.map((v, i) => (
          <i key={i} style={{ left: `${X(v)}%`, height: 26 + (i % 8) * 2 }} />
        ))}
        {markMean ? (
          <>
            <span className="t-mean" style={{ left: `${X(mean)}%` }} />
            <span className="lbl t-meanl fig" style={{ left: `${X(mean)}%` }}>
              ort {display(mean)}
            </span>
          </>
        ) : null}
      </div>
      <div className="t-ax">
        <span className="lbl-f fig">{display(min)}</span>
        <span className="lbl-f fig">{display((min + max) / 2)}</span>
        <span className="lbl-f fig">{display(max)}</span>
      </div>
    </div>
  )
}

/* PAIR · before and after. Hollow contour is a, solid colour is b. */
export function Pair({
  rows,
  domain,
  threshold,
  display = (v: number) => tr(v, 2),
}: {
  rows?: { label: string; a: number; b: number; ink?: Ink }[]
  domain: [number, number]
  threshold?: number
  display?: (v: number) => string
}) {
  if (!rows || rows.length === 0) return <Absent />
  const X = (v: number) => ((v - domain[0]) / (domain[1] - domain[0])) * 100
  return (
    <div>
      {rows.map((r) => {
        const lo = Math.min(r.a, r.b)
        const hi = Math.max(r.a, r.b)
        return (
          <div className="t-pr" key={r.label}>
            <span>{r.label}</span>
            <span className="t-ptrack">
              {threshold !== undefined ? <i className="t-thr" style={{ left: `${X(threshold)}%` }} /> : null}
              <i className="t-pline" style={{ left: `${X(lo)}%`, width: `${X(hi) - X(lo)}%` }} />
              <i className="t-pa" style={{ left: `${X(r.a)}%` }} />
              <i className="t-pb" data-datum style={{ left: `${X(r.b)}%`, background: fillVar(r.ink) }} />
            </span>
            <span className="t-pn fig">
              {display(r.a)} <span style={{ color: "var(--muted)" }}>›</span> {display(r.b)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* SPINE · a run of moments off one footed baseline. */
export function Spine({
  points,
  baseline,
  display = (v: number) => tr(v),
}: {
  points?: { label: string; value: number }[]
  baseline: number
  display?: (v: number) => string
}) {
  if (!points || points.length === 0) return <Absent />
  const dev = points.map((p) => p.value - baseline)
  const amp = Math.max(1, ...dev.map(Math.abs))
  return (
    <div data-datum>
      <div className="t-sp">
        <span className="t-spb" />
        {points.map((p, i) => {
          const d = dev[i]
          const h = (Math.abs(d) / amp) * 34
          return (
            <span className="t-spc" key={p.label}>
              <i
                className="t-spt"
                style={d >= 0 ? { bottom: "50%", height: h } : { top: "50%", height: h }}
              />
              <span className="lbl-f t-spl fig">{p.label}</span>
            </span>
          )
        })}
      </div>
      <p className="lbl-m fig" style={{ marginTop: 4 }}>
        taban {display(baseline)} · sapmalar tabana göre
      </p>
    </div>
  )
}

/* BAND · one vessel, two fills, the seam in ink, the fifty in a drawn ring.
   Names ride above, the numbers anchor below their own ends. */
export function Band({
  segments,
  threshold,
  display = (v: number) => tr(v),
}: {
  segments?: { value: number; ink: Ink; label?: string }[]
  threshold?: { at: number; label?: string }
  display?: (v: number) => string
}) {
  if (!segments || segments.length === 0) return <Absent />
  const a = segments[0]
  const b = segments[segments.length - 1]
  return (
    <div data-datum>
      <div className="t-bnames">
        <span>{a.label ?? ""}</span>
        <span>{b.label ?? ""}</span>
      </div>
      <div className="t-band">
        <div className="t-bin">
          {segments.map((s, i) => (
            <div key={i} data-datum style={{ width: `${s.value}%`, background: fillVar(s.ink) }} />
          ))}
        </div>
        {segments.length === 2 ? <span className="t-seam" style={{ left: `${a.value}%` }} /> : null}
        {threshold ? (
          <>
            <span className="t-thstem" style={{ left: `${threshold.at}%` }} />
            <span className="t-th50" data-disc style={{ left: `${threshold.at}%` }}>
              <span className="fig">{tr(threshold.at, 0)}</span>
            </span>
          </>
        ) : null}
      </div>
      <div className="t-bnums fig">
        <span className="t-bnum" style={{ color: textVar(a.ink, true) }}>{display(a.value)}</span>
        <span className="t-bnum" style={{ color: textVar(b.ink, true) }}>{display(b.value)}</span>
      </div>
    </div>
  )
}
