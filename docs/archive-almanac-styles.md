# Almanac Design System — Visual Style Guide for LLMs

Use this document as the authoritative reference when generating any visual output in the Almanac style: HTML components, dashboards, SVGs, charts, diagrams, tables, maps, or static reference pieces. Do not invent colors, fonts, radii, or spacing. Everything maps to the tokens and rules below. The implementation lives in `almanac.css`; this file is the reasoning behind it.

The system has two output modes and both obey the same tokens:

1. **Reference pieces** (static): county/district cards, data-journalism charts, printable tables, map figures.
2. **Interactive surfaces**: forecast dashboards, decision-desk UIs, live trackers, model explorers.

---

## Status of values in this draft

Two kinds of values appear below.

**Established (canonical, unchanged):** paper `#f1e7cf`, ink `#1d1810`; hairline rules, zero border-radius, no shadowed cards, tabular figures, light-mode default; `d3.geoIdentity().reflectY(true).fitExtent(...)` for map rendering; the prohibition on fake newspaper chrome; no developer/build notes in rendered output; no em dashes in copy.

**Resolved this pass (typography):** the type system has been moved off the open-source serif-plus-monospace defaults onto a single Scotch/newspaper serif superfamily (§3). The specific face is yours to lock; the recommended default is Miller, exposed as one CSS variable.

**Enhanced this pass (reference craft):** the system now follows real statistical-reference conventions rather than the generic version of the look: oldstyle figures in prose vs lining tabular in tables (§3.4), value-and-pattern encoding with color as a restrained accent (§2.7), a rule-weight hierarchy and dotted leaders (§5), statistical-table conventions and the entry primitive (§6), and book structure such as running heads and colophons (§4). `almanac-sample.html` is a rendered specimen of all of it.

**Direction (dense reference register):** the palette is a tight press-ink set with tints and overprint (§2.4); encoding is by solid fill (§2.7), appearing only in small data marks. The register is the dense, austere reference page of a statistical yearbook, not a design showcase; §16 lists the machine-made tropes to avoid. `almanac-reference.html` is a rendered reference-page specimen.

**Proposed (new values, pending your redline):** every secondary and muted ink hex, all surface/panel/field hexes, the rule hexes, the press inks, tints, and solid family fills, the sequential and diverging map ramps, the status hexes, the type scale numbers, the spacing scale, and all component dimensions. None of these are "official" yet. Treat them as a coherent first proposal to mark up.

---

## 1. Thesis

The Almanac is a **statistical and electoral reference aesthetic**: the visual language of an almanac, a statistical atlas, a data yearbook. It is precise, dense, quiet, and built to be read closely. Authority comes from accuracy and typographic discipline, not from ornament.

It is defined as much by what it is **not**:

- **Not a product/app look.** No rounded cards, soft shadows, pill buttons, brand-color washes, or generous app whitespace. Depth is expressed by rules and whitespace, never by elevation.
- **Not a newspaper pastiche.** No masthead or nameplate, no "Vol. / No.," no Roman-numeral dates, no fleurons or printer's ornaments, no "Filed at X PM" framing, no decorative column rules. This is a data-book, not a broadsheet costume.
- **Not the generic cream-serif default.** The warmth is restrained (the accent is brown ink, not terracotta). The typography is one serif family from the data-printing tradition, not an open-source serif bolted to an open-source monospace. The rules and tabular figures are *functional*: they align data and structure reference material, not set a mood. The palette is three press inks with overprint, party identity is a solid fill from a limited press-ink palette, and a map is an atlas plate, not a styled chart.

Three words to hold while generating: **precise, ruled, legible.**

The hero of any page is the data itself, in its most characteristic form: a table, a choropleth, a margin chart, a forecast band. Lead with the content, set it impeccably, and let restraint do the rest.

**The register.** The genuine reference look is dense and austere, closer to a statistical yearbook than to a dashboard: tight justified columns, small type, real tables, footnotes, oldstyle figures, and almost no visible "design." Solid fills appear only in small data marks (table bars, map fills), not as panels. Avoid the design-showcase tropes that read as machine-made (§16). See `almanac-reference.html`.

---

## 2. Color System

### 2.1 Foundation (established)

| Role | Hex | Use for |
|---|---|---|
| **Paper** | `#f1e7cf` | The page. The base of nearly everything, including chart and map backgrounds. |
| **Ink** | `#1d1810` | Primary text, strong rules, primary fills, boundary strokes. The single accent. |
| On-ink | `#f1e7cf` | "White" text/marks on an ink fill. Always paper cream, never pure white, to hold warmth. |

There is no `#000000` and no `#ffffff` anywhere in the system.

### 2.2 Text ramp (proposed)

| Role | Hex | Use for |
|---|---|---|
| Primary | `#1d1810` | Body copy, headings, table figures, anything load-bearing. |
| Secondary | `#574a35` | Subtitles, supporting copy, secondary table columns. |
| Muted | `#7a6a49` | Captions, axis labels, footnotes, source lines, column meta. |
| Faint | `#a99878` | Disabled-adjacent labels, de-emphasized scaffolding. Never for content that must be read. |

### 2.3 Surfaces and rules (proposed)

The default is **rules over fills**. Group and separate with hairlines and whitespace first; reach for a surface tint only when a region genuinely needs to recede.

| Role | Hex | Use for |
|---|---|---|
| Paper (base) | `#f1e7cf` | Default ground. |
| Panel | `#ece0c2` | A grouped/recessed region, used sparingly. |
| Inset | `#e6d8b6` | A deeper recess, e.g. a table header band when one is warranted. |
| Field | `#f7efda` | Input/control backgrounds (a slight lift off paper). |
| No-data | `#e0d2b0` | Neutral fill for absent data (see §2.7 and the integrity rule in §7). |

| Rule | Hex | Weight | Use for |
|---|---|---|---|
| Rule (strong) | `#1d1810` | 1px | Table top/bottom, header underline, section dividers, keylines. |
| Rule (soft) | `#cdbb98` | 1px | Faint inner separation in long tables; minimal chart gridlines. |

"Hairline" means thin, not pale. A strong rule is the ink color at 1px; its subtlety comes from weight, not lightness.

### 2.4 Palette: three press inks, not a hue series

The palette is deliberately tiny: the cream paper, the brown-black ink, two spot inks, plus a solid tint and a deep tone of the spot inks. Categorical identity is **not** carried by a series of hues (a default-design habit, and the one to avoid). It is carried by a solid fill drawn from this set.

| Ink | Hex | Role |
|---|---|---|
| Paper | `#f1e7cf` | the sheet |
| Ink | `#1d1810` | line, type, the darkest fill |
| Slate | `#33505c` | spot ink |
| Oxide | `#8f3f2c` | spot ink |
| Slate tint | `#889490` | solid tint of slate |
| Oxide tint | `#bb8b75` | solid tint of oxide |
| Slate deep | `#283f48` | deep tone of slate |
| No-data | `#e0d2b0` | neutral, for absent data |

**Overprint.** Where two inks overlap they multiply into a darker third, exactly as on press. This is meaning, not decoration: an overprinted unit is a shared or contested one. Implement with `mix-blend-mode: multiply` (`.alm-overprint`).

Range comes from tints and overprint, not from new hues. A few inks, their tints, and a split fill separate more categories, more legibly in print, than a twelve-color ramp could.

### 2.5 Sequential and diverging ramps (proposed)

For continuous map and chart encodings.

**Sequential (intensity)** — turnout, density, single-variable magnitude. A warm ink ramp, pale to deep:

`#efe4c8` → `#d9c49a` → `#c0a06f` → `#9c7846` → `#6e4f28` → `#3d2a14`

**Per-party sequential** — "share of vote for party X." Generate a tint-to-shade ramp from that party's categorical hue rather than the ink ramp, so the variable reads as belonging to the party.

**Diverging (margin)** — party A vs party B. Seven steps from oxide through neutral to slate; the neutral midpoint sits near paper so even-margin areas recede into the page:

`#8a3c2c` · `#b06a52` · `#d4ac93` · `#ece1c6` · `#9fb1bb` · `#5f8198` · `#345670`

### 2.6 Status and forecast colors (proposed, with a caveat)

Status colors are muted and palette-native.

| Role | Hex | Use for |
|---|---|---|
| Positive | `#3f6b4a` | Confirmed, called, success. |
| Negative | `#8f3f2c` | Error, failure, loss (shares the oxide ink, see caveat). |
| Caution | `#a8761f` | Warning, provisional, attention. |

**Caveat (important):** in any view that also carries a party choropleth or legend using muted red/green, do **not** encode status with color. The collision is real. Encode status with type weight, rules, italics, or a flag glyph instead.

**Forecast/probability:** render credible-interval and fan bands as ink at low alpha (roughly 8–12%, layered lightest-and-widest), or as a party hue at low alpha. The median/point estimate is a 2px line in ink or the party hue.

### 2.7 Encoding: solid fills

Fills are solid. Range comes from the tight ink set, its tints, and overprint, not from a hue series and not from hatch or stipple.

- **Categorical** is a solid fill per category, one of the press inks or a tint. A **split fill** (a diagonal two-tone) marks a shared or contested unit. Where two inks genuinely overprint, they multiply into a darker third (`.alm-overprint`).
- **Sequential** (a continuous variable) is a solid tint ramp in a single ink, light to full. Five classes are plenty; map them to discrete bins.
- **No-data** is the solid neutral `#e0d2b0`, always distinct from the low end of any ramp (§7), never rendered as a low value.

A working family set (solid fills; reach for a tint or a split to add categories, not a new hue):

| Family | Fill | Class |
|---|---|---|
| Secular / left | slate | `.alm-fam-left` |
| Religious / right | oxide | `.alm-fam-right` |
| Centre | slate tint | `.alm-fam-center` |
| Nationalist | ink | `.alm-fam-nat` |
| Confessional | oxide tint | `.alm-fam-rel` |
| Regional | slate deep | `.alm-fam-reg` |
| Contested | split (slate + oxide) | `.alm-fam-contested` |

The CSS ships solid sequential utilities (`.alm-seq-1` … `.alm-seq-5`), the solid `.alm-nodata`, and the categorical family set above.

---

## 3. Typography

### 3.1 The type system (one serif family, no monospace)

The Almanac is set almost entirely in a single serif superfamily from the Scotch and newspaper-data tradition: the lineage of statistical yearbooks, electoral atlases, and newspaper data tables. This is a deliberate move away from the open-source serif-plus-monospace pairing that now reads as a default. One family carries display, text, small caps, and figures, which gives the system the coherence of a printed reference instead of the assembled look of a web stack.

**Recommended face:** **Miller** (Carter & Cone): Miller Display for titles, Miller Text for body, Miller Text small caps for labels, and the family's tabular figures for all numerals. Strong alternates in the same tradition: **Chronicle** (Hoefler&Co, with purpose-built newsprint grades) or **Tiempos** (Klim, cleaner and more contemporary). The exact face is yours to lock; `almanac.css` exposes it as a single variable (`--alm-font-text` / `--alm-font-display`) so swapping is one line.

| Role | Cut | Use for |
|---|---|---|
| Display | Miller Display | Page and section titles, hero figures |
| Text | Miller Text | Running text, captions |
| Label | Miller Text, small caps, tracked | Column headers, eyebrows, control labels |
| Figures | Miller, tabular lining figures | All numbers, in tables and stats |

**No monospace by default.** A monospaced "data voice" is a software-design instinct, not an almanac one; statistical figures belong in the text serif's tabular figures. If a distinct machine voice is genuinely needed for codes (FIPS, precinct/sandık IDs), add a neutral grotesque mono as a separate, deliberate decision. Do not reach back for the familiar open-source mono.

**Fallback** (until the licensed files are dropped into `assets/Fonts/`, and for export contexts): `Georgia, "Times New Roman", serif`. Georgia is a Scotch-adjacent system serif and renders the system acceptably without the identity face.

### 3.2 Type scale (proposed)

**Display — Miller Display, weight 600, letter-spacing `-0.01em`:**

| Token | rem | px | Line-height | Use for |
|---|---|---|---|---|
| display | 2.5rem | 40 | 1.05 | Page hero, cover figure |
| h1 | 2rem | 32 | 1.1 | Page title |
| h2 | 1.5rem | 24 | 1.15 | Section title |
| h3 | 1.25rem | 20 | 1.2 | Subsection / card header |

**Body — Miller Text, weight 400 (600 for emphasis, italic for notes/estimates):**

| Token | rem | px | Line-height | Use for |
|---|---|---|---|---|
| body | 1rem | 16 | 1.55 | Primary running text |
| body-sm | 0.875rem | 14 | 1.5 | Secondary copy, dense prose |
| caption | 0.8125rem | 13 | 1.45 | Captions, footnotes |

**Figures — Miller, tabular lining figures (`font-variant-numeric: tabular-nums`), at the data sizes:**

| Token | rem | px | Line-height | Use for |
|---|---|---|---|---|
| data | 0.9375rem | 15 | 1.4 | Table figures, stat values |
| data-sm | 0.8125rem | 13 | 1.35 | Dense table figures, axis labels |
| data-xs | 0.6875rem | 11 | 1.3 | Micro labels, source lines |

Mobile: scale `display`/`h1` down by roughly 0.75× (≈30px / 26px); body and figures stay fixed for legibility.

### 3.3 The almanac label (proposed)

The system's signature label, used for column headers, section eyebrows, and control labels:

- **Miller Text small caps** (`font-variant-caps: small-caps`, or the dedicated SC cut if your package ships one)
- 0.75rem / 12px
- `letter-spacing: 0.06–0.08em`
- color: ink or secondary

Small caps in the text serif is the classic reference-book label. This is the structural voice of the system; reach for it before any decorative device. It replaces the tracked-uppercase-monospace label of the earlier draft.

### 3.4 Numerals: oldstyle in prose, lining tabular in tables

This is the single most useful typographic correction away from the default look, and it follows real reference-book practice.

- **In running prose**, numbers use **oldstyle (text) figures, proportional**: `font-variant-numeric: oldstyle-nums proportional-nums`. They have ascenders and descenders and sit in the line like lowercase, so a sentence with "1,247 settlements between 1965 and 2023" reads as text, not as a label. This is the body default.
- **In tables, stats, and any aligned column**, numbers switch to **lining figures, tabular**: `font-variant-numeric: lining-nums tabular-nums`. Uniform width and a common baseline let the eye compare magnitudes straight down a rule.
- Standalone hero stats may be set in Miller Display for weight, using lining tabular figures.
- Consistent decimal precision **within a column**. Right-align numerics. See §7 for the full number-formatting and integrity rules.

Using one figure style everywhere is a tell. The prose/table split is the fix.

### 3.5 Other typography rules

- Heading margin-bottom `0.75rem`; paragraph margin-bottom `1rem`.
- `text-rendering: optimizeLegibility`, `-webkit-font-smoothing: antialiased`.
- Do not center long blocks of body text. Tables, figures, and short labels may center as the content dictates.
- Italics carry a specific job here: notes and estimated/modeled values (§7). Do not use italics decoratively.

---

## 4. Spacing and Layout

A 4px base scale.

| Token | px |
|---|---|
| space-1 | 4 |
| space-2 | 8 |
| space-3 | 12 |
| space-4 | 16 |
| space-5 | 24 |
| space-6 | 32 |
| space-7 | 48 |
| space-8 | 64 |

- Table cells: `5px` vertical, `12px` horizontal (dense by default).
- Stack between related elements: `12px`; between subsections: `24px`; between sections: `32–48px`.
- Layout is grid-based and aligned to rules. Columns of data align to a baseline grid; figures and their labels share a left edge. Density is a feature, but every element sits on the grid.

**Book structure (not newspaper chrome).** A **running head** (a small-caps section label, with a 1px rule beneath), a **folio** (a plain page number in lining figures), and a **colophon** (a small-caps source/credit line above a closing rule) are reference-publication devices and are welcome. They are distinct from the forbidden newspaper chrome (§1, §14): no masthead or nameplate, no "Vol. / No.," no Roman-numeral dates, no fleurons. Keep them quiet and typographic.

**Small-multiple sheets.** A series (elections over time, regions side by side) is composed as a sheet of small panels under one header, with the encoding held fixed across every panel and stated once in a shared legend. Bound the sheet with major rules; give each panel a small-caps header and a 1px underline. Small multiples are the reference way to show change: the reader scans, rather than toggling. `almanac-sample-sheet.html` is a rendered sheet.

---

## 5. Rules, Radius, and Elevation (the three signatures)

These three together are the core of the system and the clean inversion of a product look. Apply them without exception.

**Rules.** Horizontal rules do the structural work that cards and shadows do elsewhere, and they carry a **weight hierarchy** that encodes structural level rather than a single uniform hairline (uniform-everywhere is the default look). Three weights:

- **Major, 2px ink** — table top and bottom, major section breaks.
- **Standard, 1px ink** — header underlines, keylines, spanner-head rules, section heads.
- **Minor, 1px soft tan (`#cdbb98`)** — faint inner separation in long tables, and dotted leaders.

**Dotted leaders** (a row label, a run of dots, then a right-aligned figure) are the reference convention for contents lists and key-value pairs. Use the minor tan, dotted.

**Never use vertical rules in tables.**

**Radius.** `border-radius: 0` everywhere. Zero is absolute. The only curves permitted are data marks (circular points, arcs) and the natural geometry of glyphs. No rounded buttons, inputs, cards, menus, tags, or badges, ever.

**Elevation.** `box-shadow: none` everywhere. No drop shadows on any container, including floating menus and popovers (which use a 1px ink border instead). Depth is rules plus whitespace. There is no elevated surface in this system.

---

## 6. Tables

Tables are the heart of the Almanac. Treat them as the primary design object, not an afterthought.

**Structure**

- Top border: 1px ink. Bottom border: 1px ink. Header-row underline: 1px ink.
- Between data rows: nothing. In very long tables, an optional 1px soft rule may separate row groups. **No zebra striping** (warm striping muddies; whitespace and alignment carry the eye).
- No vertical rules.

**Header cells**

- The almanac label (§3.3): small caps, tracked, ink or secondary.
- Text columns: left-aligned. Numeric columns: right-aligned.

**Body cells**

- Numeric: the text serif's tabular figures, right-aligned, ink, consistent decimal precision per column.
- Text: Miller Text, left-aligned.
- Padding: `5px` vertical, `12px` horizontal.

**Totals / summary row**

- Separated by a 1px top rule. Text serif, weight 600. No fill, no heavier background.

**In-cell graphics**

- In-cell bars and sparklines are allowed: flat fill in a categorical or ramp color, square ends, no axis, no shadow. Keep them subordinate to the figure.

**Negatives and signs**

- Default to ink with a minus sign. Oxide (`#8f3f2c`) may be used for losses/declines when emphasis is warranted; if so, apply it consistently and never in a view that conflicts with a party legend (§2.6).

**Source line**

- Directly beneath the table: small caps or Miller Text, `data-xs`, muted, left-aligned. Name the source and the certification status, e.g. `Source: [authority]. Certified results.` See §14.

**Statistical conventions**

Real reference tables are dense and structured. Reach for these where the data calls for them:

- **Spanner heads.** A group head that spans several numeric columns, set in small caps and ruled underneath (e.g. a single "Turnout" head over electorate / cast / %). The stub column above the spanner is left blank and unruled.
- **Stub column.** The left label column reads as text (left-aligned, normal figures), distinct from the numeric body.
- **Units in the head.** State the unit once in the column head ("Vote share, %"), not in every cell.
- **Footnote apparatus.** Superscript markers (`a`, `b`) on cells, resolved in a note line beneath the table alongside the source line.
- **Provisional/estimated rows** are set in italic, per the integrity rule (§7), never sharing styling with certified rows.
- **Subtotals and totals** sit above a 1px rule in weight 600.

**Reference primitives**

- **Entry.** The almanac entry is a layout primitive: a bold headword, then dense inline figures (lining tabular), then an italic note. It encodes a record compactly, the way a gazetteer or almanac entry does.
- **Leaders.** Dotted leader rows (§5) for contents and key-value lists.

---

## 7. Numbers and Data Integrity (absolute)

This section is a hard constraint, not a preference. The visual system must never imply more precision or completeness than the data holds.

- **Exact source values only.** Never aggregate, interpolate, estimate, smooth, or substitute and then present the result as observed data.
- **Granularity is literal.** "Precinct" means precinct-level only; "mahalle" means mahalle-level only. Never roll a coarser unit (ilçe/il, county/state) up or down to stand in for a missing finer level.
- **Missing is not zero.** Absent data renders as an explicit neutral: a centered `·` or `n/a` in tables, a neutral fill on maps (§9). Never render missing data as `0`, and never as the low end of a sequential ramp.
- **Estimated values are marked.** Where modeled or estimated values are shown at all, distinguish them visually (italic, brackets, or a flagged style) and label them. They never share styling with certified figures.
- **Formatting.** Tabular figures always. Consistent precision within a column. Right-align numerics. Locale-correct separators, consistent within a table (Turkish: `.` thousands / `,` decimal; US: `,` thousands / `.` decimal). No abbreviation in reference tables (full precision); abbreviation is acceptable only in space-constrained chart labels, and the exact value must remain available in the caption or on hover.

---

## 8. Charts

- **Background:** paper `#f1e7cf`. Charts sit directly on the page. No white canvas, no card, no shadow.
- **Axes:** a single 1px ink baseline at the value origin. The category axis is a thin rule or bare ticks. No full grid box.
- **Gridlines:** minimal. A few 1px soft horizontal lines, or none at all in favor of direct labeling. Never bold, never vertical-heavy.
- **Tick and axis labels:** Miller Text or small caps, `data-sm` or `data-xs`, muted.
- **Series color:** categories take a solid family fill (§2.7) from the press inks and tints; continuous variables take the solid sequential tint ramp (§2.7). A tight set, not a hue series.
- **Bars:** flat fill, square ends (zero radius), thin or no stroke.
- **Lines:** 1.5–2px, categorical colors. Points are small filled circles (the permitted curve).
- **Bands (forecast):** ink or party hue at low alpha, layered lightest-and-widest behind the median line.
- **Legends:** prefer direct/inline labeling. If a legend is needed, use small **square** swatches (never circles or rounded chips) with small-caps labels.
- **Title / subtitle / source:** title in Miller Display `h3` or the almanac label; subtitle in Miller Text `body-sm`; source line in `data-xs`, muted.
- **Forbidden:** 3D, drop shadows on marks, gloss, and gradient fills (except the sequential map ramps). Flat, ink-era printing.

---

## 9. Maps and Choropleths

- **Rendering (established):** `d3.geoIdentity().reflectY(true).fitExtent(...)`. Never use spherical projections unless winding order is explicitly fixed upstream.
- **Sea / background:** paper `#f1e7cf`. The map sits on the page.
- **Boundary strokes:** hairline ink, thin. Roughly 0.25–0.5px for dense mahalle/sandık geometry (or a soft-rule tan to avoid mush at high density), up to 1px for top-level boundaries.
- **Fills:** solid family fills (§2.7) for winner/party maps; the solid sequential tint ramp (§2.7) for continuous variables. A split fill marks a contested unit.
- **No-data:** the solid neutral no-data fill `#e0d2b0`, always unambiguously distinct from the low end of any ramp. Missing is not a low value (§7).
- **Legends:** a ruled swatch strip with square swatches and small-caps labels; state exact breakpoints. For a diverging margin scale, show that the neutral midpoint equals paper.
- **Point layers (sandık/precinct dots, Voronoi):** small square or circular marks, muted fill, low alpha for density.
- **Map labels:** Miller Text, sparing, with a paper-cream halo for legibility. No drop shadow.

**The atlas plate.** A map figure is framed as a plate: a 1px **neatline**, an index head (plate number and title in small caps), a legend, and a foot naming source and certification. These are cartographic, information-bearing devices, distinct from the forbidden newspaper chrome (§1, §14). The CSS ships `.alm-plate` and its parts.

**Hex cartogram.** The equal-unit hex cartogram is a first-class form: one cell, one unit. Encode family by a solid fill (§2.7); a split fill marks a contested cell. Because a cartogram is not geographic, give an honest **cell-key** ("1 cell = one unit", `.alm-cellkey`). Never draw a geographic scale bar or a graticule on a cartogram; that would imply coordinates the form does not carry.

**Geographic plate.** For a true geographic map, render with the canonical `geoIdentity().reflectY(true).fitExtent(...)`, dissolve a **coastline cut heavier (≈1px) than the internal borders (≈0.4px)**, and draw a faint **graticule** (e.g. 2°) with a few labeled meridians and parallels just inside the neatline. The graticule is the spatial reference: because the identity projection is planar and not metric, prefer a labeled graticule over a metric scale bar, and state the projection in the plate foot. Boundary detail can be dense; the line carries it.

---

## 10. Components (interactive surfaces)

The dashboard layer, inverted to the Almanac. Every control is square, ruled, and unshadowed.

### 10.1 Buttons

Zero radius, 1px border, no shadow, no glow. Heights: XS 28px, SM 34px, MD 40px (tighter than a product scale). Horizontal padding `14–16px`. Label in Miller Text weight 600, or the almanac label (small caps, tracked) for toolbar/utility controls.

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| Primary | ink `#1d1810` | paper `#f1e7cf` | ink | bg `#0f0b07` |
| Secondary | transparent | ink | 1px ink | bg panel `#ece0c2` |
| Destructive | transparent | oxide `#8f3f2c` | 1px oxide | bg oxide, text paper |
| Ghost | transparent | ink | none | underline |
| Disabled | none | faint `#a99878` | soft `#cdbb98` | (none) |

**Focus:** `outline: 1px solid #1d1810; outline-offset: 2px`. A ruled focus indicator, never a colored halo. Keyboard focus must always be visible.

### 10.2 Inputs

- Zero radius, 1px border in secondary ink `#574a35`, background field `#f7efda`.
- **Focus:** border-color ink plus `outline: 1px solid #1d1810; outline-offset: 1px`. No colored glow.
- Text: Miller Text for text inputs; the tabular figures for numeric inputs. Placeholder muted.
- Label: the almanac label. Hint: caption, muted.

### 10.3 Selects, menus, dropdowns

- Trigger: a ruled box (zero radius, 1px border).
- Menu: paper background, **1px ink border, no shadow**, zero radius. (This is the deliberate inversion of a shadowed popover.)
- Items: zero radius; hover fills with panel tint, or inverts to ink-fill + paper-text. Divider: 1px soft rule.

### 10.4 Tabs and segmented controls

- **Tabs:** underline style. Inactive label muted; active label ink with a 2px ink underline. No pill tabs.
- **Segmented control:** adjacent ruled cells sharing 1px ink borders (collapsed), the active cell filled ink with paper text. Zero radius.

### 10.5 Tags, keylines, badges

- **No rounded pills. This is a hard rule.** A "tag" is a 1px ink keyline rectangle (zero radius) with a small-caps or Miller Text label, or simply a bare tracked small-caps label with no background.
- **Badge / count:** a small ruled square or a superscript tabular numeral. Never a rounded blob.

### 10.6 Cards and panels

- No shadow, no radius. A "card" is content delimited by rules and whitespace: either a full 1px ink keyline box, or (preferred) a 1px top rule plus an almanac-label header plus content. An optional faint panel tint may group a region.
- **Stat callout:** a large figure (tabular, or Miller Display for a standalone hero) with an almanac label above or below and an optional caption/source. No card chrome around it.

---

## 11. Iconography

- Minimal by default. The Almanac favors typographic and ruled affordances over icons. If a text label does the job, use the label.
- Where an icon is needed: thin 1px ink stroke (1.25px at larger sizes), geometric, outline only. An active/selected state may use a filled ink form.
- No filled, playful, or illustrative icons. No icon-only primary navigation when a label would serve.

---

## 12. Ornament and Illustration

The system is anti-decorative. The data is the graphic.

- **Allowed:** hairline rules, ruled boxes, tick marks, dotted leader lines (e.g. in a contents list), and solid neutral fills for no-data.
- **Forbidden:** gradients (except the sequential map ramps), drop shadows, gloss, rounded decorative shapes, soft organic blobs, mascots, and spot illustration.

---

## 13. Motion

Restrained, in keeping with a print-reference aesthetic that happens to be interactive.

- State changes (hover, focus, open/close): 120–160ms `ease`.
- Chart entrance: a brief, simple fade or draw, ≤300ms, or none.
- Data updates: instant, or a quick crossfade.
- No bounce, spring, or elastic easing. No ambient or decorative animation.
- Respect `prefers-reduced-motion`: disable all non-essential motion.

The page should feel like a printed reference you can query, not an animated app.

---

## 14. Copy and Labeling

Words are design material here, set with the same discipline as the type.

- **No em dashes anywhere.** Use a colon, period, parentheses, an en dash for ranges, or restructure the sentence.
- **No "just let me know"** in correspondence, and avoid filler generally.
- **Active, literal labels.** A control says what it does: "Show precincts," not "Submit." Keep action vocabulary consistent through a flow (a button that says "Publish" yields a state that says "Published"). UI labels and actions in sentence case; column headers and eyebrows in the tracked small-caps almanac label.
- **Sourcing line.** Beneath tables, charts, and maps: name the source and the certification status (e.g. `Source: [authority]. Certified results.`). Mark any estimated/modeled value explicitly and never present it as certified (§7). Do not cite Quantus Insights as a polling source.
- **Rendered-output hygiene.** Never show build or developer notes in rendered output: no "preview only," "placeholder," "mock," "stub," "not wired up," or TODO text on any page. Code comments only. Never surface implementation or methodology framing in user-facing copy.
- **No newspaper chrome in copy or structure** (restated): no masthead or nameplate, no "Vol. / No.," no Roman-numeral dates, no fleurons, no "Filed at X PM."

---

## 15. Do's and Don'ts

**DO**

- Lead with the data in its most characteristic form (table, choropleth, margin chart, forecast band).
- Separate and group with hairline rules and whitespace.
- Set numbers in oldstyle proportional figures in prose, and lining tabular figures in tables and aligned columns; right-align numerics; hold precision constant within a column.
- Encode areal data with solid fills: categories by ink or tint, values by a single-ink tint ramp, no-data by the neutral.
- Carry structural level in a rule-weight hierarchy (major / standard / minor), not one uniform hairline.
- Carry party identity in a solid fill from the press inks and tints; consolidate with a tint or a split, not a new hue.
- Render missing data as an explicit neutral, distinct from zero and from any ramp's low end.
- Keep paper (`#f1e7cf`) as the background for charts and maps so they sit on the page.
- Use the tracked small-caps label as the default structural device.

**DON'T**

- Don't use `#000000` or `#ffffff`; use ink and paper.
- Don't use any border-radius (zero is absolute) or any box-shadow.
- Don't pair a default open-source serif with a monospace; use one serif family with tabular figures and small caps.
- Don't use one figure style everywhere; oldstyle belongs in prose, lining tabular in columns.
- Don't render no-data as a low value; give it the distinct neutral fill.
- Don't use vertical rules in tables, or zebra striping.
- Don't use rounded pills or blob badges; use ruled keylines.
- Don't reach for a hue series for categories; the channel is solid fills from a tight press-ink set with tints.
- Don't use gradients outside the sequential map ramps, or drop shadows on any mark.
- Don't aggregate, interpolate, or estimate and present it as observed; don't roll units up or down to fill a finer level.
- Don't build a newspaper pastiche (masthead, Vol./No., Roman numerals, fleurons, "Filed at X PM").
- Don't show build/preview/placeholder notes in rendered output.
- Don't use em dashes in copy.

---

## 16. Anti-patterns (what reads as machine-made)

Some patterns mark a page as generated rather than designed. Avoid them; reach for the dense reference register (§1) instead.

- **Metric / KPI cards.** A row of large numbers with small labels on tinted cards is the clearest tell. Put figures in a table, an aggregates list with leaders, or running prose; reserve a large figure for a single genuine headline, set in type, not on a card.
- **Color-block heroes and reversed mastheads as decoration.** Big solid panels with reversed type, used to look bold, read as templated. A running head and a restrained title do the work.
- **Swatch walls and component galleries.** Displaying the palette as a row of chips, or the components as a showcase grid, is a design-demo artifact, not a use of the system. Show the system by setting real reference content with it.
- **Bento grids, gradient fills, oversized everything.** None belong here. Density and typographic discipline carry the page.

The test: would this appear in a statistical yearbook? If it would only appear in a design portfolio, cut it.
