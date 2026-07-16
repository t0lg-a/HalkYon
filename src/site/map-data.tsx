import { IL_TILES, unitByPlate, PARTIES } from "@/data/sample"
import type { Tile } from "@/site/tile-map"

/* Tiles from the fixture: the leader's ink per il, the overprint where the
   race is closer than 2,5 points. Pass an href factory to make units act. */

const rankIl = (shares: number[]) =>
  PARTIES.map((p, i) => ({ ink: p.ink, share: shares[i] })).sort((a, b) => b.share - a.share)

export function ilTiles(href?: (id: string) => string): Tile[] {
  return IL_TILES.map(([plate, name, col, row]) => {
    const u = unitByPlate(plate)
    const r = rankIl(u.shares)
    const contested = r[0].share - r[1].share < 2.5
    return {
      id: u.id,
      plate,
      name,
      col,
      row,
      ink: contested ? ("overprint" as const) : r[0].ink,
      href: href ? href(u.id) : undefined,
    }
  })
}

export const MAP_COUNTS = (() => {
  const lead = PARTIES.map(() => 0)
  let contested = 0
  for (const [plate] of IL_TILES) {
    const u = unitByPlate(plate)
    const r = rankIl(u.shares)
    lead[PARTIES.findIndex((p) => p.ink === r[0].ink)]++
    if (r[0].share - r[1].share < 2.5) contested++
  }
  const top = lead.indexOf(Math.max(...lead))
  return { lead, contested, top }
})()
