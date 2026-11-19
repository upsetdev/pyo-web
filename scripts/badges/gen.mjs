// Draws the "Deploy with Pyo" badges in public/badge: dark and light, each in
// a large and a small size. The text is drawn as paths, so the badges look the
// same wherever a README shows them, with no font to load.
//
//   bun run badges
//
// It downloads Inter SemiBold (static, Latin) from the @fontsource/inter npm
// package on jsDelivr and checks its SHA-256, so the badges come out the same
// each time. Inter is by The Inter Project Authors (https://github.com/rsms/inter)
// and licensed under the SIL Open Font License 1.1 (https://openfontlicense.org).
// The font is only read here: it isn't kept in this repo or served by the site.
// FONT_FILE uses a local copy of the same file instead.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as fontkit from "fontkit";

const FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.3.0/files/inter-latin-600-normal.woff";
const FONT_SHA256 = "6a9cb3a509b4eeaf12b7dda6c4aacac3e85d07f4201bf4dd716e332e692b87bd";
const OUT = fileURLToPath(new URL("../../public/badge/", import.meta.url));

const TEXT = "Deploy with Pyo";
/** The Pyo duck, on a 24×24 grid (src/components/Logo.tsx). */
const DUCK =
  "M4.15 6.02C5.14 2.95 7.63 1 10.8 1C14.65 1 17.36 3.85 17.64 7.7C17.68 9.96 18.72 10.73 20.08 11.59C21.57 12.5 22.57 13.36 22.52 14.58C22.48 16.3 20.31 17.48 17.82 17.43C14.87 17.43 12.61 15.85 11.93 13.22C11.89 13.04 11.75 12.91 11.75 13.13C11.48 15.53 13.92 18.65 17.36 18.65C18.72 18.7 19.94 18.34 20.94 17.66C19.85 20.6 16.23 22.95 11.93 22.95C6.73 22.95 2.52 19.47 2.52 14.94C2.52 12.68 3.92 11.32 3.87 9.74C2.65 9.42 1.43 8.83 1.43 7.79C1.43 6.79 2.88 6.34 4.15 6.02ZM7.31 6.98C7.31 7.35 7.01 7.65 6.64 7.65C6.26 7.65 5.96 7.35 5.96 6.98C5.96 6.6 6.26 6.3 6.64 6.3C7.01 6.3 7.31 6.6 7.31 6.98ZM10.48 6.98C10.48 7.35 10.18 7.65 9.8 7.65C9.43 7.65 9.13 7.35 9.13 6.98C9.13 6.6 9.43 6.3 9.8 6.3C10.18 6.3 10.48 6.6 10.48 6.98Z";

/** Height, text size, duck size, side padding and the gap after the duck. */
const SIZES = {
  large: { h: 40, font: 15, duck: 20, pad: 16, gap: 8 },
  small: { h: 28, font: 12, duck: 15, pad: 11, gap: 6 },
};
const THEMES = {
  dark: { bg: "#121212", border: "#2e2e2e", fg: "#fafafa" },
  light: { bg: "#ffffff", border: "#d9d9d9", fg: "#121212" },
};

async function loadFont() {
  const bytes = process.env.FONT_FILE
    ? readFileSync(process.env.FONT_FILE)
    : Buffer.from(
        await fetch(FONT_URL).then((r) => {
          if (!r.ok) throw new Error(`Couldn't download Inter: ${r.status}`);
          return r.arrayBuffer();
        }),
      );
  const sum = createHash("sha256").update(bytes).digest("hex");
  if (sum !== FONT_SHA256)
    throw new Error(`Inter doesn't match its SHA-256 (${sum}). Check FONT_URL.`);
  return fontkit.create(bytes);
}

const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(+(+n).toFixed(2)));

/** The text as one path, starting at x, on the baseline. */
function textPath(font, size, x0, baseline) {
  const s = size / font.unitsPerEm;
  const run = font.layout(TEXT);
  let x = x0;
  const parts = run.glyphs.map((g, i) => {
    const p = run.positions[i];
    const path = g.path
      .scale(s, -s)
      .translate(x + p.xOffset * s, baseline - p.yOffset * s);
    x += p.xAdvance * s;
    return path.toSVG();
  });
  return { d: round(parts.join("")), width: x - x0 };
}

const font = await loadFont();
mkdirSync(OUT, { recursive: true });
for (const [size, z] of Object.entries(SIZES)) {
  // Centres the capitals: Inter's cap height is about 0.727 em.
  const baseline = (z.h + z.font * 0.727) / 2;
  const tx = z.pad + z.duck + z.gap;
  const text = textPath(font, z.font, tx, baseline);
  const w = Math.ceil(tx + text.width + z.pad + 1);
  const duck = `translate(${z.pad} ${(z.h - z.duck) / 2}) scale(${+(z.duck / 24).toFixed(4)})`;
  for (const [theme, c] of Object.entries(THEMES)) {
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${z.h}" viewBox="0 0 ${w} ${z.h}" role="img" aria-label="${TEXT}">` +
      `<title>${TEXT}</title>` +
      `<rect x="0.5" y="0.5" width="${w - 1}" height="${z.h - 1}" rx="${z.h / 2 - 0.5}" fill="${c.bg}" stroke="${c.border}"/>` +
      `<path fill="${c.fg}" fill-rule="evenodd" transform="${duck}" d="${DUCK}"/>` +
      `<path fill="${c.fg}" d="${text.d}"/></svg>\n`;
    const name = `deploy-${theme}${size === "small" ? "-small" : ""}.svg`;
    writeFileSync(`${OUT}${name}`, svg);
    console.log(`${name}: ${w}×${z.h}`);
  }
}
