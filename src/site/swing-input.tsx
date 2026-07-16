import { tr } from "@/lib/format"

/* The swing control. Chrome, so strictly monochrome: hairline track, paper
   thumb in a two-unit ink contour (the kap), an ink rule at zero. The party
   identity here is text only; colour waits for the figures below. */

export function SwingRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="t-swing">
      <span className="lbl">{label}</span>
      <span className="tw">
        <span className="zero" aria-hidden="true" />
        <input
          type="range"
          className="t-range"
          min={-15}
          max={15}
          step={0.5}
          value={value}
          aria-label={`${label} salınımı, puan`}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </span>
      <span className="lbl fig" style={{ textAlign: "right" }}>
        {value > 0 ? "+" : ""}{tr(value, 1)} puan
      </span>
    </div>
  )
}
