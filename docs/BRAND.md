# Brand guidelines

Two properties, one system. theoelections is the publication; HalkYön is
its Turkish live results desk. Both run on the locked canon (README.md),
so brand work never introduces tokens, faces or effects of its own.

## 1. The HalkYön mark

Anatomy: a vertical axis, the name split around it (halk left and high,
yön right and low), and two bar clusters, one extending right of the
axis, one extending left. Read it as the system's comb around a
threshold: two blocs sorted around a line, which is what the desk does
all night. The axis and the name are fixed; the bars are the living part.

Files and sanctioned variants:

- `public/halkyon-avatar.png` · static, light. For social profiles, OG
  fallbacks, and any context that cannot run the component.
- `src/components/halkyon/logo.tsx` · the interactive mark. Exactly three
  usages exist:
  - `<HalkYonLogo />` · ink marks on transparent, for paper surfaces.
    This is the masthead usage (84px phone, 116px desktop).
  - `<HalkYonLogo tone="paper" background="#16171A" round />` · the dark
    disc avatar.
  - `<HalkYonLogo tone="ink" background="#E9E8E0" round />` · the light
    disc avatar.
  No fourth variant exists. `round` is legal only on the disc avatars;
  it is the single sanctioned exception to radius zero, and it never
  appears inside a page.

Motion: the bars collapse to the axis and redraw on hover, 640ms, 45ms
stagger, reduced motion respected. Hover only. The mark never autoplays,
never loops, and nothing else in the system moves.

Colour: the name and the axis use canon neutrals by tone (ink on light
grounds, paper on ink). The bars carry the system's data palette,
owner-set, one colour per bar, both groups the same, top to bottom:
#D62828, #FFC300, #17BEBB, #7B2CBF, #1E6FD9, #2E9E44 (combination #19).
One palette, two homes: data figures and the mark, nowhere else, never
in chrome. Two-way contests wear 1 and 5 (red, blue); multi-series
takes the palette in order, ink after the sixth; yellow, turquoise and
green never carry text, blue only at large sizes. On hover the bars
collapse to the axis and return; nothing else moves. Grounds are paper
or ink, nothing else.

Clear space and size: the shipped canvas padding is the clear space;
never crop it. When composing with the transparent component, keep at
least 0,12 of the size clear on the sides and 0,2 above and below.
Recommended container 96px and up; minimum 80px in page contexts. The
disc avatars may render at platform sizes.

The name: in product chrome the name is always the mark, never set in
type. In running prose, HalkYön (capital H, capital Y) is correct; in
labels and footers, lowercase halkyön follows the label voice.

Never: recolour, stretch, rotate, add shadow, outline, or gradient, crop
the padding, place on photography or pattern, attach a tagline, replace
the mark with typed text, or autoplay the animation.

## 2. The theoelections mark

There is no drawn logo. The masthead is the word theoelections in
Switzer 700 lowercase at label size, and the identity is carried by the
system itself: the slab, the hairlines, the n-slug (n = count of the
governing dataset, formatted tr-TR) on the right of the masthead, and
the reversed slug block on broadcast cards. Do not invent a symbol.

## 3. Relationship and co-branding

The footer line pattern is: halkyön · bir theoelections masası. HalkYön
is described in public copy on its own terms (Türkiye canlı sonuç
masası); do not position it by comparison to other outlets or products
in anything user-facing. Party and candidate colour never enters either
brand's chrome; slate and oxide appear only inside figures.

## 4. Broadcast cards

`BroadcastCard` takes a `slug` prop (default theoelections; pass
halkyön for desk cards). The card is the one mass-audience surface and
follows its own relaxations (README, law 7 of the guide); the mark is
not required on it, the slug is.

## 5. Open brand items, owner's call

- A reduced favicon cut for sizes under the minimum (the full lockup
  does not survive 32px).
- The wordmark face inside the SVG is Switzer by design here; if the
  original mark was drawn in another face, supply it and the component
  text gets replaced with outlined paths.

## 6. Boxes: containing information at three sizes

Principle: a box is a claim about a boundary, and boundaries are drawn,
not decorated. No fills to group, no tints, no shadows, radius zero,
always. The default container is no container: paper and whitespace do
most of the work, and the strongest statement in the system is refusing
the box.

### Enclosure grades, by loudness of the claim

- Grade 0 · none. The default. Content sits on paper, separated by
  spacing. Ghost buttons (underline only) live here.
- Grade 1 · rule. One ink rule on the top edge, open on the other three.
  Sections, figures and cards are grade 1. Interior separation is always
  hairline (#CBC8BC), never a second ink rule.
- Grade 2 · the kap. A two-unit ink contour on all four sides, the same
  contour the figures wear. Reserved for objects that act (inputs,
  secondary and destructive buttons) or that leave the
  page (the broadcast card). The Absent state is an empty two-unit contour
  vessel with its word inside; the dashed keyline is retired and nothing in
  the system is dashed. Figures speak the contour language: a two-unit ink
  vessel that always draws one hundred percent, colour only inside it,
  every value tied by a leader line with a dot on the datum, hatching for
  work in progress, a solid ink cap only on a final result.
- Grade 3 · reversed. Ink slab, paper type. The shout. Marking, primary
  buttons, the live badge, marked agate rows. One per view region, never
  nested, never adjacent to another reversed block.

Grade does not scale with size: a big box does not earn more borders.
Loudness comes from reverse, weight or rule, never from the frame.

### The three sizes

- Small · padding 8px 10px. A bold lowercase label (12px) and one
  figure. Stat chips, badges, agate cells. Grade 1 by default, grade 3
  when it marks.
- Medium · padding 15px 18px. The workhorse: figures, panels, list
  cards. Title at 18px in the finding voice, dek at 13px muted, content,
  then how-to-read and source in that order. Grade 1.
- Big · padding clamp(14px, 3vw, 30px). Hero blocks and the broadcast
  card. Display type (weight 900, tight letterspacing), one idea per
  box. Grade 1 on the page; grade 2 only when the box ships as an image.

If a box contains a figure, its title is a finding, never a label; the
Figure component enforces this. Boxes never mix grades on one object: a
reversed block needs no keyline, a keyline needs no rule.

### Buttons

One shape, three sizes, hierarchy by grade rather than colour:

- Small · 32px height, 0 12px padding, 12px label. Class `btn-sm`.
- Default · 40px height, 0 18px padding, 13px label. No class.
- Big · 48px height, 0 24px padding, 15px label. Class `btn-lg`.

All bold lowercase, radius zero, no shadow, no transition; focus is a
1px ink outline offset 2px. Primary is reversed (grade 3), one per
view. Secondary and destructive are keylines (grade 2) that reverse on
hover; destructive is never red, the word carries the meaning. Ghost is
an underline (grade 0). Disabled drops to faint ink at full opacity;
nothing in the system fades.

Never: tinted fills to group content, four-sided borders for emphasis,
nested reversed blocks, hover lifts or shadows, radius anywhere outside
the sanctioned disc avatars, autoplaying attention effects on any box.

## 7. Voice
Every graphic speaks in the finding voice: the title states what happened,
never the form. theoelections writes English-first, HalkYön Turkish-first;
deks are Author, labels bold lowercase in either language. The manifesto
voice never enters product surfaces.

## 8. Icons and glyphs
There is no icon set. The system's glyphs are typographic: the middot
separator, the › for movement, the axis bar in the mark. Arrows, emoji
and pictograms never appear on expert surfaces; data pictograms are legal
on broadcast cards only.

## 9. Photography and illustration
None in product. The surfaces are type, rules and data marks. Editorial
photography, if it ever exists, is an owner decision outside this canon.

## 10. Maps
Geography is a figure and obeys the colour law: hairline boundaries in
faint, units filled from the data palette by the datum, overprint #191122 for
contested, paper for absent units, no basemap tiles, no relief, direct
labels only. Default treatment: d3.geoIdentity().reflectY(true)
.fitExtent(), never a decorative projection.

## 11. Accessibility
Ink on paper is roughly 13,5:1; muted passes for large text only, so
muted never carries an essential value. Focus is always visible (1px ink
outline, offset 2). Every chart ships alt text that states its finding.
Reduced motion disables the only animation in the system.

## 12. Conventions
Dates dd.mm.yyyy, time in 24 hours, all numbers through Intl tr-TR where
Turkish data appears (191.007,52). The lang attribute is mandatory on
every document.

## 13. Surfaces not designed here
Email and newsletter, favicons under the minimum size, video, and any
dark product surface do not exist in the canon yet; paper-on-ink is
reserved for marking blocks and the mark's disc avatars. Adding any of
these reopens the canon and is the owner's call.
