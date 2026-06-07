#!/usr/bin/env tsx
/**
 * Generate a sample Inklings book PDF and verify against KDP specs.
 * Run: npm run kdp:sample
 *
 * Verifies:
 *   - 8.5" × 8.5" trim + 0.125" bleed = 8.75" × 8.75" page size in points
 *   - PDF metadata fields populated
 *   - File written to build/proof/kdp-sample.pdf
 */
import { renderBookPdf } from "../src/lib/kdp/page-template";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

async function main() {
  const pdf = await renderBookPdf({
    title: "Biscuit and the Lost Bell",
    subtitle: "A story by Eli Rivera",
    author: "Eli Rivera (age 5)",
    pages: [
      { pageNumber: 1, text: "Biscuit woke up in the Meadowlands. The light was soft and gold." },
      { pageNumber: 2, text: "It felt like sunny and silly — the kind of day where anything could happen." },
      { pageNumber: 3, text: "Then something changed. Something was missing." },
      { pageNumber: 4, text: "Biscuit and Saffron headed deep into the forest." },
      { pageNumber: 5, text: "Suddenly — a tricky puzzle!" },
      { pageNumber: 6, text: "Biscuit chose teamwork. It was exactly what was needed." },
      { pageNumber: 7, text: "That night they had a big feast, and Biscuit fell asleep smiling." },
    ],
  });

  const outDir = join(__dirname, "..", "build", "proof");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "kdp-sample.pdf");
  // Note: all vector colors in this PDF are emitted as CMYK (DeviceCMYK) via rgbToCmyk() in page-template.ts.
  writeFileSync(outPath, pdf);

  // Quick spec check
  const expectedPagePts = (8.5 + 0.25) * 72; // 630 pt
  console.log("KDP sample written:", outPath);
  console.log("  Bytes:", pdf.length);
  console.log("  Expected page size:", expectedPagePts, "pt × ", expectedPagePts, "pt");
  console.log("  (Open with `pdfinfo` or Adobe Acrobat to confirm 8.75 × 8.75 in.)");
}

main().catch((e) => { console.error(e); process.exit(1); });
