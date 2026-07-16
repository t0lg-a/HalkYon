import type { Ink } from "@/data/sample"

/* The kutu harita. Geography is a figure and obeys the colour law: every
   unit is an equal square filled with the leader's palette colour, the
   contested unit wears the overprint, labels are the plate numbers, no
   basemap, no relief. Adjacency is approximate by design. */

export type Tile = {
  id: string
  plate: number
  name: string
  col: number
  row: number
  ink: Ink | "overprint"
  href?: string
}

/* yellow and turquoise are light grounds; everything else takes paper type */
const LIGHT: Record<string, boolean> = { d2: true, d3: true }

const STEP = 47
const S = 44

export function TileMap({ tiles, ariaLabel }: { tiles: Tile[]; ariaLabel: string }) {
  const cols = Math.max(...tiles.map((t) => t.col)) + 1
  const rows = Math.max(...tiles.map((t) => t.row)) + 1
  return (
    <div data-datum>
      <svg
        viewBox={`0 0 ${cols * STEP - (STEP - S)} ${rows * STEP - (STEP - S)}`}
        width="100%"
        role="img"
        aria-label={ariaLabel}
        style={{ display: "block" }}
      >
        {tiles.map((t) => {
          const x = t.col * STEP
          const y = t.row * STEP
          const body = (
            <>
              <title>{`${String(t.plate).padStart(2, "0")} ${t.name}`}</title>
              <rect x={x} y={y} width={S} height={S} fill={`var(--${t.ink})`} />
              <text
                x={x + S / 2}
                y={y + S / 2 + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="15"
                fontWeight="700"
                style={{ fontVariantNumeric: "tabular-nums" }}
                fill={LIGHT[t.ink] ? "var(--ink)" : "var(--paper)"}
              >
                {String(t.plate).padStart(2, "0")}
              </text>
            </>
          )
          return t.href ? (
            <a key={t.id} href={t.href} aria-label={t.name}>
              {body}
            </a>
          ) : (
            <g key={t.id}>{body}</g>
          )
        })}
      </svg>
    </div>
  )
}
