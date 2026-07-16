import { useState } from "react"

/*
  halkyön mark, v4 · the bible. Owner-authored; logic is his, verbatim.
  On hover the bars collapse to the axis and return, staggered into a sweep.
  The axis and the name stay put. Six colours, one per bar, both groups the
  same, top to bottom: red, yellow, turquoise, purple, blue, green
  (combination #19). This palette IS the site's data palette (d1–d6).

    <HalkYonLogo />                                          // ink name, paper site
    <HalkYonLogo tone="paper" background="#16171A" round />  // dark disc avatar
    <HalkYonLogo tone="ink" background="#E9E8E0" round />    // light disc avatar
*/

const PAPER = "#E9E8E0"
const INK = "#16171A"
const HAIR = "#CBC8BC"
const INK2 = "#3A382F"

const RED = "#D62828", YELLOW = "#FFC300", PURPLE = "#7B2CBF", GREEN = "#2E9E44"
const BLUE = "#1E6FD9", TURQUOISE = "#17BEBB"
const BAR_COLORS = [RED, YELLOW, TURQUOISE, PURPLE, BLUE, GREEN] // top -> bottom, both groups the same
const barFill = (i: number) => BAR_COLORS[i]

const CX = 500, CY = 500, GAP = 26
const YT = 372, YB = 628, BAND = 250, AXH = 326, MAXW = 404
const N = 6, ROW = BAND / N, TH = ROW * 0.6
const gauss = (x: number, mu: number, s: number) => Math.exp(-((x - mu) ** 2) / (2 * s * s))

function makeBars(top: boolean) {
  const y0 = (top ? YT : YB) - BAND / 2
  return Array.from({ length: N }, (_, i) => {
    const t = (i + 0.5) / N
    const L = (0.34 + 0.62 * gauss(t, 0.5, 0.34)) * (MAXW - 14)
    const y = y0 + i * ROW + (ROW - TH) / 2
    return { L, y, i }
  })
}
const TOP = makeBars(true)     // extend right
const BOTTOM = makeBars(false) // extend left

const TONES = {
  ink:   { mark: INK,   axis: INK,   up: INK,   down: INK2 },
  paper: { mark: PAPER, axis: PAPER, up: PAPER, down: HAIR },
} as const

export default function HalkYonLogo({
  size = 320,
  tone = "ink",
  background = "transparent",
  round = false,
}: {
  size?: number
  tone?: keyof typeof TONES
  background?: string
  round?: boolean
}) {
  const c = TONES[tone] ?? TONES.ink
  const solid = background !== undefined && background !== "transparent"
  const [runId, setRunId] = useState(0)
  const font = "Switzer, system-ui, sans-serif"

  return (
    <div
      data-mark=""
      {...(round ? { "data-disc": "" } : {})}
      onMouseEnter={() => setRunId((r) => r + 1)}
      style={{
        width: size,
        height: size,
        background,
        cursor: "pointer",
        lineHeight: 0,
        borderRadius: round ? "50%" : 0,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes hyRedraw {
          0%   { transform: scaleX(1); }
          32%  { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .hy-bar { transform-box: fill-box; will-change: transform; }
        .hy-r { transform-origin: left center; }
        .hy-l { transform-origin: right center; }
        .hy-run .hy-bar { animation: hyRedraw 640ms cubic-bezier(.62,0,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .hy-run .hy-bar { animation: none; } }
      `}</style>

      <svg viewBox="0 0 1000 1000" width={size} height={size} role="img" aria-label="halkyön">
        {solid && <rect width="1000" height="1000" fill={background} />}
        <g transform={`translate(${CX},${CY}) scale(0.89) translate(${-CX},${-CY})`}>
          <rect x={CX - 3} y={CY - AXH} width="6" height={2 * AXH} fill={c.axis} />
          <text
            x={CX - GAP} y={YT} textAnchor="end" dominantBaseline="central"
            textLength={MAXW} lengthAdjust="spacingAndGlyphs"
            fontFamily={font} fontWeight="800" fontSize="198" fill={c.mark}
          >halk</text>
          <text
            x={CX + GAP} y={YB} textAnchor="start" dominantBaseline="central"
            textLength={MAXW} lengthAdjust="spacingAndGlyphs"
            fontFamily={font} fontWeight="800" fontSize="231" fill={c.mark}
          >yön</text>

          <g key={runId} className={runId ? "hy-run" : ""}>
            {TOP.map(({ L, y, i }) => (
              <rect
                key={`t${i}`} className="hy-bar hy-r"
                x={CX + GAP} y={y} width={L} height={TH} fill={barFill(i)}
                style={{ animationDelay: `${i * 45}ms` }}
              />
            ))}
            {BOTTOM.map(({ L, y, i }) => (
              <rect
                key={`b${i}`} className="hy-bar hy-l"
                x={CX - GAP - L} y={y} width={L} height={TH} fill={barFill(i)}
                style={{ animationDelay: `${i * 45}ms` }}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
