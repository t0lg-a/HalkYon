import { tr, trn } from "@/lib/format"

/* The scatter: one dot per poll, sample size across, measured gap up.
   Ink dots on a footed baseline; the aggregate mean is an ink rule,
   because a mean is always a rule, never a colour. */

const W = 660
const H = 210
const PB = 26
const PT = 14
const PL = 30
const PR = 10

export function Scatter({
  points,
  mean,
}: {
  points: { n: number; gap: number }[]
  mean: number
}) {
  const nMin = 600
  const nMax = 3600
  const gMax = Math.max(8, ...points.map((p) => p.gap)) + 0.5
  const X = (n: number) => PL + ((n - nMin) / (nMax - nMin)) * (W - PL - PR)
  const Y = (g: number) => H - PB - (g / gMax) * (H - PB - PT)
  return (
    <div data-datum>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label="örneklem büyüklüğü ile ölçülen fark" style={{ display: "block" }}>
        {/* footed baseline, the comb's axis language */}
        <rect x={PL} y={H - PB} width={W - PL - PR} height="2" fill="var(--ink)" />
        <rect x={PL} y={H - PB - 5} width="2" height="7" fill="var(--ink)" />
        <rect x={W - PR - 2} y={H - PB - 5} width="2" height="7" fill="var(--ink)" />
        {/* the mean is an ink rule */}
        <rect x={PL} y={Y(mean)} width={W - PL - PR} height="1.5" fill="var(--ink)" />
        <text x={W - PR} y={Y(mean) - 5} textAnchor="end" fontSize="11" fontWeight="700" fill="var(--ink)">
          ortalama {tr(mean)}
        </text>
        {/* gap guides, faint */}
        {[2, 4, 6, 8].map((g) => (
          <text key={g} x={PL - 6} y={Y(g)} textAnchor="end" dominantBaseline="central"
            fontSize="11" fontWeight="500" fill="var(--faint)">
            {trn(g)}
          </text>
        ))}
        {points.map((p, i) => (
          <circle key={i} cx={X(p.n)} cy={Y(p.gap)} r="3.4" fill="var(--ink)" opacity="0.55" />
        ))}
        <text x={PL} y={H - 8} fontSize="11" fontWeight="500" fill="var(--faint)">
          n = {trn(nMin)}
        </text>
        <text x={W - PR} y={H - 8} textAnchor="end" fontSize="11" fontWeight="500" fill="var(--faint)">
          n = {trn(nMax)}
        </text>
      </svg>
    </div>
  )
}
