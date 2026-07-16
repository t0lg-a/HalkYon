# HalkYön · site şablonu

The HalkYön website template, built on theo-ui, the locked design system
(canon v1.0, 15.07.2026). New session or collaborator? Read docs/GUIDE.md
first; brand and logo rules live in docs/BRAND.md. The canon itself is
unchanged here: this repo composes surfaces on top of it and adds nothing
to its tokens, faces, forms or laws.

Everything this site renders is a synthetic specimen. Party and candidate
names are placeholders; geography names and election years are structure
only; every figure carries a source line saying so. The repo ships no
election data and no published writing.

## The six surfaces

Hash routes are ascii; display labels carry the diacritics.

| route | surface |
|---|---|
| `#/` | anasayfa · the front page, a little of everything |
| `#/projeksiyon` | forecast template, meclis and cumhurbaşkanlığı panels |
| `#/anketler` | poll aggregator plus the archive shelf back to 1950 |
| `#/secimler` | results browser, Türkiye to il to ilçe to mahalle |
| `#/simulator` | the swingometer: uniform swing through district D'Hondt |
| `#/analizler` | the writings index and one placeholder article |

All display names and every number live in `src/data/sample.ts`, the
single swap point when real adapters arrive. Election math is pure and
isolated in `src/lib/dhondt.ts`; the hash router in `src/lib/route.ts`.

## Scripts

- `npm run dev` · site at localhost:5173
- `npm run build` · type-check and bundle; a Figure without a finding or
  a source does not compile
- `node scripts/audit.mjs` · opens the built dist in headless Chrome and
  fails on any canon violation (radius, shadow, text-transform, colour
  outside the palette or outside figure scope, a figure missing finding
  or source, a body face that is not Switzer) across every site route
- `node scripts/layout.mjs` · overflow check at 390, 768 and 1280
- `node scripts/strip.mjs` · codemod for `components/ui` after any
  shadcn add

If puppeteer has no downloaded Chrome, point it at a local binary:
`PUPPETEER_EXECUTABLE_PATH=... node scripts/audit.mjs`.

## Open

1. Real data adapters behind `src/data/sample.ts`, when data returns to
   scope.
2. The archive shelf: one specimen year is filled; the other years render
   the Absent state until records exist.
3. The broadcast card exporter (finding plus data in, 1200 by 630 PNG
   out, wired to the OG tags).
