import type { ReactNode } from "react"
import { Absent } from "./primitives"

/* The record. Density lives in text, which is the one density that escapes
   the complexity penalty. Marking is done by reversing, never by colour. */
export function AgateColumns({
  rows,
  mark,
  viz,
}: {
  rows?: { label: string; a: string; b?: string }[]
  mark?: (row: { label: string; a: string; b?: string }) => boolean
  viz?: (row: { label: string; a: string; b?: string }) => ReactNode
}) {
  if (!rows || rows.length === 0) return <Absent />
  return (
    <div className="t-cols">
      {rows.map((r) => (
        <div className={"t-ar" + (mark && mark(r) ? " mk" : "")} key={r.label}>
          <span>{r.label}</span>
          {viz ? viz(r) : null}
          <b className="fig">
            {r.a}
            {r.b ? <> <i>{r.b}</i></> : null}
          </b>
        </div>
      ))}
    </div>
  )
}

export function DataTable({
  columns,
  rows,
}: {
  columns?: string[]
  rows?: (string | number)[][]
}) {
  if (!columns || !rows || rows.length === 0) return <Absent />
  return (
    <table className="t-table">
      <thead>
        <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  )
}
