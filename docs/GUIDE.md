# Briefing for future sessions

Read this before touching anything. It is the reasoning behind the canon;
the canon itself is README.md and the code.

## What this repo is

theo-ui is the locked design system (v1.0, 15.07.2026) for two properties:

- theoelections, election data journalism, Turkish and US, English-first.
  Reference composition at `#page`.
- HalkYön, a Turkish live results and decision desk, Turkish-first, a new
  IP from theoelections. Reference composition at `#halkyon`. Its logo is
  canon-identical to the pixel (#E9E8E0, #16171A, #3A382F) and exists as a
  static PNG (`public/halkyon-avatar.png`, for social) and an interactive
  component (`src/components/halkyon/logo.tsx`, authored by Tolga, bars
  redraw toward the axis on hover, reduced motion respected).

## Decisions and their reasons, short form

1. No accent colour. Two "modern accent" systems were built and rejected as
   AI-default (acid yellow, then rubric red). The law that replaced them:
   colour appears only where a datum is. Slate #38505E and oxide #8B4A35
   are press inks, legal only inside figures. Skulmowski 2016 (saturation
   lowers trust) and Reinecke and Gajos 2014 (educated audiences prefer
   restraint) support this independently.
   Amendment 15.07.2026, owner's call: the HalkYön mark's bars now cycle
   a five-colour palette (D62828, FFC300, 7B2CBF, 1E6FD9, 2E9E44),
   mark-only. The UI and data colour law is unchanged; the audit enforces
   the palette as legal only inside [data-mark].
   Amendment 2, 15.07.2026, owner's call: the pale press inks (slate,
   oxide, their night tints) are retired. The mark's five colours ARE the
   data palette now, shared by figures and the mark alone: two-way = 1
   and 4, multi-series in order, ink after five, yellow fills only.
   Amendment 3, 15.07.2026, owner's call: figures are redrawn to the
   contour language (chosen from the SCMP school of drawn information
   design). The vessel is a two-unit ink contour showing the whole; colour
   fills only its inside; values hang from leader lines with a dot at the
   datum; counting in progress is 45-degree hatching; absence is an empty
   vessel (the dashed keyline is retired); a solid cap marks only a final
   result. The threshold at fifty wears a drawn ring.
   Amendment 4, 15.07.2026, owner's call: boxes, buttons and states join
   the contour language. Grade 2 is the kap (two-unit contour); a working
   button fills with hatching and never spins; focus is a double contour;
   disabled is a faint contour at full opacity; buttons never wear the
   palette. The states of the count are drawn and worded: waiting is an
   empty vessel, counting is hatching, leading is fill and seam, a call is
   solid with an ink cap, final is the double-ring stamp beside the number.
   Amendment 5, 15.07.2026, owner's call, permanent ("the bible"): mark
   v4 lands. Six bar colours in fixed order, one per bar, both groups the
   same: red #D62828, yellow #FFC300, turquoise #17BEBB, purple #7B2CBF,
   blue #1E6FD9, green #2E9E44 (combination #19). Tokens become d1-d6 in
   that order; two-way contests wear 1 and 5; ink after the sixth;
   yellow, turquoise and green never carry text, blue only large. Hover
   collapses the bars to the axis and returns them (640ms, 45ms stagger,
   reduced motion respected); overprint stays #191122 (1 x 5).
2. Marking without colour: reverse it, weight it, or rule it. Thresholds
   and means are always ink rules.
3. Faces are Switzer (data) and Author (prose), chosen by fontTools
   measurement across 41 candidates, not by taste. The three tests any
   replacement must pass: all ten digits share one advance, the period
   matches the comma (Turkish writes 191.007,52), and the Turkish line box
   (top of accented capitals to bottom of ş and ç) stays at or under 1,13.
   Seventeen of twenty-one contemporary faces failed the digits alone.
4. Labels are bold lowercase. Never uppercase, never small caps, never
   text-transform: Turkish casing is locale-dependent (i to İ, I to ı) and
   no free face ships true small caps. Documents set lang="tr".
5. Every figure is titled with its finding, never its form, and carries a
   source. Borkin et al. 2016: titles drive what readers take away. The
   Figure component enforces both at the type level.
6. Every novel form carries a one-line decode gate (nasıl okunur). The
   shipping protocol: five target readers decode it cold; one misread
   means annotate or kill.
7. The page skeleton is prototypical (masthead, kicker, headline, hero in
   expected slots); the strangeness lives inside the slots. Tuch 2012
   (17ms prototypicality) and Hekkert 2003 (MAYA; expertise unlocks
   novelty) are the basis.
8. Absent is absent, not zero. Forms render the Absent state when empty;
   on the desk it is load-bearing (uncalled races).
9. Density lives in text (the agate record), which escapes the perceived
   complexity penalty (Reinecke 2013). Numbers format via Intl tr-TR.
10. The broadcast card is a separate mass-audience product where Bateman
    2010, Borkin 2013 and Haroz 2015 apply. It never leaks into the
    expert surfaces.

## Standing working rules from the owner

- No em dashes anywhere, chat text or file contents.
- No developer or build notes in rendered UI.
- Exact figures only in real outputs; specimens must be labelled as such.
  Data accuracy is currently out of scope; visual work is the focus.
- The system is locked. Do not propose comparisons, alternative palettes,
  faces or forms. Changing tokens, faces, forms or laws means reopening
  the canon, which only the owner does.
- Keep VoteHub (US) work fully separate from Turkish work.

## How to verify any change

`npm run build`, then `node scripts/audit.mjs` (canon: radius, shadow,
text-transform, colour law, figure law, faces, across both compositions)
and `node scripts/layout.mjs` (overflow at 390, 768, 1280). A change that
fails either does not ship.

Brand and logo usage rules are in docs/BRAND.md and are part of the canon.
The full visual canon renders at the #kilavuz route inside the app.

## Open threads

Remaining surfaces: article page, archive index. Broadcast card exporter
(finding plus data in, 1200 by 630 out, wired to OG tags). Real data
adapters when data returns to scope. HalkYön call criteria are editorial,
not visual, and are not designed here.
