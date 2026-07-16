/**
 * strip.mjs · enforce the three signatures on copied shadcn source.
 *
 *   §5   radius 0 and elevation none are absolute.
 *   §10  focus is a ruled outline, never a coloured halo.
 *   §13  120-160ms ease on state change. No bounce, spring, or depth motion.
 *
 * Operates on class *tokens* inside string literals, never on raw text, so it
 * cannot corrupt import statements or arbitrary-value brackets.
 * Idempotent. Re-run after every `shadcn add`.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/components/ui";
const RULED_FOCUS = [
  "focus-visible:outline-1",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-foreground",
];

/** Strip Tailwind variant prefixes to expose the base utility. */
const base = (tok) => {
  let t = tok;
  const prefix = /^(?:[a-z0-9@_-]+(?:\[[^\]]*\])?(?:\/[a-z0-9_-]+)?|\[[^\]]*\]):/;
  while (prefix.test(t)) t = t.replace(prefix, "");
  return t;
};

const counts = {};
const bump = (file, id) => {
  counts[file] ??= {};
  counts[file][id] = (counts[file][id] ?? 0) + 1;
};

/** null = drop the token. string = replace it. undefined = keep. */
function verdict(tok, file) {
  const b = base(tok);

  // §5 · zero radius, absolutely.
  if (/^rounded(-|$)/.test(b)) { bump(file, "radius"); return null; }

  // §5 · no elevation.
  if (/^(drop-)?shadow(-|$)/.test(b)) { bump(file, "shadow"); return null; }

  // §10 · the coloured halo.
  if (/^ring(-|$)/.test(b)) { bump(file, "halo"); return null; }
  if (/^border-ring(\/|$)/.test(b)) { bump(file, "halo"); return null; }
  if (b === "outline-hidden") return "outline-none";

  // §13 · there is no z-axis here, so nothing zooms or slides.
  if (/^(zoom|slide)-(in|out)(-|$)/.test(b)) { bump(file, "motion"); return null; }

  // §2.1 · light-mode default. No dark palette exists in the canon, so a
  // `dark:` utility points at a token that was never defined.
  if (/(^|:)dark:/.test(tok)) { bump(file, "dark:"); return null; }

  // §13 · colour only, 150ms. `transition-all` animates layout; there is no
  // box-shadow left to transition.
  if (b === "transition-all" || b === "transition-shadow" || /^transition-\[/.test(b) || b === "transition") {
    bump(file, "motion");
    return "transition-colors duration-150 ease-out";
  }
  return undefined;
}

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".tsx"))) {
  const path = join(DIR, file);
  const before = readFileSync(path, "utf8");

  let src = before.replace(/"((?:[^"\\\n]|\\.)*)"/g, (whole, inner) => {
    if (!inner.includes(" ")) return whole; // not a class list
    const out = [];
    for (const tok of inner.split(/\s+/)) {
      if (!tok) continue;
      const v = verdict(tok, file);
      if (v === null) continue;
      out.push(v === undefined ? tok : v);
    }
    return '"' + [...new Set(out)].join(" ") + '"';
  });

  // A stripped ring with nothing in its place is invisible keyboard focus,
  // which is a worse failure than the halo. Restore a ruled indicator.
  if (counts[file]?.halo && !src.includes("focus-visible:outline-foreground")) {
    src = src.replace(/"([^"\n]*\boutline-none\b[^"\n]*)"/, (_m, inner) =>
      '"' + inner + " " + RULED_FOCUS.join(" ") + '"'
    );
    bump(file, "focus restored");
  }

  if (src !== before) writeFileSync(path, src);
}

const cols = ["radius", "shadow", "halo", "motion", "dark:", "focus restored"];
const w = (s, n) => String(s).padEnd(n);
console.log(w("file", 20) + cols.map((c) => String(c).padStart(14)).join(""));
console.log("-".repeat(20 + cols.length * 14));
for (const f of Object.keys(counts).sort()) {
  console.log(w(f, 20) + cols.map((c) => String(counts[f][c] ?? "").padStart(14)).join(""));
}
console.log("-".repeat(20 + cols.length * 14));
console.log(
  w("total", 20) +
    cols.map((c) => String(Object.values(counts).reduce((a, r) => a + (r[c] ?? 0), 0)).padStart(14)).join("")
);
