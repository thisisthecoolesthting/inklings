#!/usr/bin/env node
/**
 * Generate sample Lulu print PDFs (interior + wraparound cover) using the
 * real Milo showcase art — the visual proof harness for print-pdf.js.
 *
 * Run: node scripts/generate_sample_lulu.cjs
 * Out: build/proof/lulu-sample-interior.pdf, build/proof/lulu-sample-cover.pdf
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { buildInteriorPDF, buildCoverPDF } = require("../src/lib/lulu/print-pdf.js");

const SHOWCASE = path.join(__dirname, "..", "public", "images", "showcase", "milo-moonbeam");

function readImg(name) {
  try {
    return fs.readFileSync(path.join(SHOWCASE, name));
  } catch {
    return null;
  }
}

async function main() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(SHOWCASE, "..", "manifest.json"), "utf8"),
  );

  // Art-only illustrations (page-*.jpg have baked-in text; ill-* are clean art)
  const pageImages = manifest.pages.map((p) =>
    readImg(`ill-${String(p.n).padStart(2, "0")}.jpg`),
  );
  const pages = manifest.pages.map((p) => p.text);
  const coverImage = readImg("ill-cover.jpg") ?? readImg("cover.jpg");

  const interior = await buildInteriorPDF({
    title: manifest.title,
    childName: manifest.childName,
    pages,
    pageImages,
  });

  const pageCount = Math.ceil((3 + pages.length) / 4) * 4;
  const cover = await buildCoverPDF({
    title: manifest.title,
    childName: manifest.childName,
    blurb: `${manifest.childName} made this book — every twist, every character, every page. A real story by a real kid, printed to keep.`,
    coverImage,
    pageCount,
    binding: "softcover",
  });

  const outDir = path.join(__dirname, "..", "build", "proof");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "lulu-sample-interior.pdf"), Buffer.from(interior));
  fs.writeFileSync(path.join(outDir, "lulu-sample-cover.pdf"), Buffer.from(cover));

  console.log("interior:", interior.length, "bytes,", 3 + pages.length, "pages (padded to", pageCount + ")");
  console.log("cover:   ", cover.length, "bytes");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
