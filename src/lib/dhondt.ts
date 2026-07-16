/* Pure election math for the simulator. A district carries vote shares for
   the six parties plus a trailing "diğer" share; swing is per party, in
   points. The whole module is synthetic template machinery: it is honest
   arithmetic over invented numbers, never a record of any election. */

export type District = {
  id: string
  name: string
  seats: number
  /* six party shares + others, percentages, sums to 100 */
  shares: number[]
}

export function dhondt(votes: number[], seats: number): number[] {
  const won = votes.map(() => 0)
  for (let s = 0; s < seats; s++) {
    let best = -1
    let bestQ = -1
    for (let p = 0; p < votes.length; p++) {
      if (votes[p] <= 0) continue
      const q = votes[p] / (won[p] + 1)
      if (q > bestQ) {
        bestQ = q
        best = p
      }
    }
    if (best < 0) break
    won[best]++
  }
  return won
}

/* Add swing per party, clamp at zero, renormalise the full vector
   (others included) back to 100. */
export function applySwing(shares: number[], swing: number[]): number[] {
  const out = shares.map((v, i) => Math.max(0, v + (swing[i] ?? 0)))
  const sum = out.reduce((a, b) => a + b, 0)
  return out.map((v) => (v / sum) * 100)
}

/* Seat-weighted national share after swing. */
export function nationalShares(districts: District[], swing: number[]): number[] {
  const totalSeats = districts.reduce((a, d) => a + d.seats, 0)
  const acc = districts[0].shares.map(() => 0)
  for (const d of districts) {
    const s = applySwing(d.shares, swing)
    for (let i = 0; i < s.length; i++) acc[i] += s[i] * d.seats
  }
  return acc.map((v) => v / totalSeats)
}

/* Threshold first, then D'Hondt district by district. A party under the
   national threshold takes no seat anywhere; "diğer" never takes a seat. */
export function allocate(
  districts: District[],
  swing: number[],
  threshold = 7,
): { totals: number[]; national: number[]; eligible: boolean[] } {
  const national = nationalShares(districts, swing)
  const n = swing.length
  const eligible = Array.from({ length: n }, (_, i) => national[i] >= threshold)
  const totals = Array.from({ length: n }, () => 0)
  for (const d of districts) {
    const s = applySwing(d.shares, swing)
    const votes = s.slice(0, n).map((v, i) => (eligible[i] ? v : 0))
    const won = dhondt(votes, d.seats)
    for (let i = 0; i < n; i++) totals[i] += won[i]
  }
  return { totals, national, eligible }
}
