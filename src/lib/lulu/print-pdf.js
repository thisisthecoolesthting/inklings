/**
 * print-pdf.js — Inklings Lulu-ready print PDF builder
 *
 * Exports TWO functions for Lulu's two-file submission requirement:
 *
 *   buildInteriorPDF({ title, childName, pages, pageImages })
 *     → Promise<Uint8Array>   — interior-only (no cover), Lulu-ready
 *
 *   buildCoverPDF({ title, childName, blurb, coverImage, pageCount, binding })
 *     → Promise<Uint8Array>   — wraparound single-page cover (back|spine|front)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ASSUMPTIONS — confirm all against Lulu's current file-prep guide before use:
 *
 *   [1] Trim size       : 8.5 in × 8.5 in  square book
 *                         (TODO: confirm Lulu supports 8.5×8.5 — may need 8×8)
 *   [2] Bleed           : 0.125 in on ALL four edges
 *                         (TODO: confirm — Lulu sometimes uses 0.125 or 0.1875)
 *   [3] Safe zone       : 0.5 in inside trim edge for all text
 *                         (TODO: verify Lulu's minimum safe zone recommendation)
 *   [4] Even page rule  : Lulu requires an even total interior page count
 *                         (TODO: verify — some Lulu products are odd-OK)
 *   [5] Spine formula   : hardcover → pageCount × 0.0025 in per page
 *                         softcover → 0 spine (thin/saddle-stitch)
 *                         (TODO: confirm with Lulu's spine-width calculator;
 *                          actual formula depends on paper type and page count)
 *   [6] PDF color space : sRGB used here; Lulu may prefer CMYK for print
 *                         (TODO: check Lulu's color-space requirements)
 *   [7] Resolution      : images should be embedded at ≥300 DPI before passing
 *                         as buffers — this module does not resample
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use strict";

const { PDFDocument, StandardFonts, rgb, degrees } = require("pdf-lib");
const fs = require("fs");
const fontkit = require("@pdf-lib/fontkit");
const FONT_DIR = "/usr/share/fonts/truetype/liberation/";
const FONT = { serif: FONT_DIR+"LiberationSerif-Regular.ttf", serifBold: FONT_DIR+"LiberationSerif-Bold.ttf", serifItalic: FONT_DIR+"LiberationSerif-Italic.ttf", sans: FONT_DIR+"LiberationSans-Regular.ttf" };

/* ─────────────────────────────────────────────
   PHYSICAL CONSTANTS  (inches → points at 72pt/in)
   TODO: confirm TRIM_IN and BLEED_IN against Lulu spec before submission
───────────────────────────────────────────── */
const PT_PER_IN        = 72;

const TRIM_IN          = 8.5;        // TODO confirm against Lulu spec
const BLEED_IN         = 0.125;      // TODO confirm against Lulu spec
const SAFE_IN          = 0.5;        // minimum text inset from trim edge

// Derived point values
const TRIM_PT          = TRIM_IN  * PT_PER_IN;   // 612 pt
const BLEED_PT         = BLEED_IN * PT_PER_IN;   //   9 pt
const SAFE_PT          = SAFE_IN  * PT_PER_IN;   //  36 pt

// Physical page size for interior pages (trim + bleed on all four sides)
const PAGE_PT          = (TRIM_IN + 2 * BLEED_IN) * PT_PER_IN;  // 630 pt = 8.75 in

// Spine constants
const SPINE_PER_PAGE_IN = 0.0025;   // TODO confirm Lulu spine formula
const SPINE_MIN_FOR_TEXT_IN = 0.25; // only print title on spine if this wide or wider

/* ─────────────────────────────────────────────
   COLOR PALETTE  (mirrors storybook-pdf.js)
───────────────────────────────────────────── */
const INK   = rgb(0.13, 0.11, 0.24);
const CREAM = rgb(0.992, 0.973, 0.937);
const CREAM2= rgb(0.965, 0.925, 0.851);
const GOLD  = rgb(1.0,  0.83, 0.475);
const MUTE  = rgb(0.42, 0.39, 0.52);

/* ─────────────────────────────────────────────
   HELPERS  (identical API to storybook-pdf.js)
───────────────────────────────────────────── */

/** Word-wrap `text` to fit within `maxW` points at `size`. */
function wrap(text, font, size, maxW) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const candidate = line ? line + " " + w : w;
    if (font.widthOfTextAtSize(candidate, size) > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Embed image bytes as JPG (PNG fallback). Returns null on failure. */
async function embedImage(doc, bytes) {
  if (!bytes) return null;
  try { return await doc.embedJpg(bytes); }
  catch (_) {
    try { return await doc.embedPng(bytes); }
    catch (__) { return null; }
  }
}

/**
 * Draw an image inside a box using aspect-preserving CONTAIN fit.
 * Fills the box with `bg` first, then centers the scaled image inside it.
 * (Identical to the helper in storybook-pdf.js.)
 */
function drawContain(pg, img, x, y, w, h, bg) {
  pg.drawRectangle({ x, y, width: w, height: h, color: bg });
  if (!img) return;
  const scale = Math.min(w / img.width, h / img.height);
  const dw = img.width  * scale;
  const dh = img.height * scale;
  pg.drawImage(img, {
    x: x + (w - dw) / 2,
    y: y + (h - dh) / 2,
    width:  dw,
    height: dh,
  });
}

/* ─────────────────────────────────────────────
   INTERIOR PDF
───────────────────────────────────────────── */

/**
 * Build the Lulu-ready INTERIOR PDF (no front cover — Lulu prints that separately).
 *
 * Physical page: PAGE_PT × PAGE_PT = 630 pt × 630 pt (8.75 in square)
 * Trim lives 9 pt (0.125 in) inside each physical edge.
 * All text is kept ≥ BLEED_PT + SAFE_PT = 45 pt from the physical page edge.
 *
 * Page order:
 *   1. Title / dedication page
 *   2…N. Story pages (one per `pages[i]`, illustrated with `pageImages[i]`)
 *   N+1. Blank page appended if total count is odd (Lulu even-page requirement)
 *
 * @param {object}              opts
 * @param {string}              opts.title
 * @param {string}              opts.childName
 * @param {string[]}            opts.pages       — one paragraph per story page
 * @param {Array<Buffer|null>}  opts.pageImages  — one JPEG Buffer per story page (null = text only)
 * @returns {Promise<Uint8Array>}
 */
async function buildInteriorPDF({ title, childName, pages, pageImages }) {
  const doc = await PDFDocument.create();
  doc.setTitle(title + " — Interior");
  doc.setAuthor("Inklings");
  doc.setSubject("Inklings personalized storybook — interior file for Lulu");
  doc.setProducer("Inklings print-pdf.js");

  doc.registerFontkit(fontkit);
  const serif       = await doc.embedFont(fs.readFileSync(FONT.serif), { subset: true });
  const serifBold   = await doc.embedFont(fs.readFileSync(FONT.serifBold), { subset: true });
  const serifItalic = await doc.embedFont(fs.readFileSync(FONT.serifItalic), { subset: true });
  const sans        = await doc.embedFont(fs.readFileSync(FONT.sans), { subset: true });

  // Safe text inset from physical page edge = bleed + safe zone
  const TEXT_INSET = BLEED_PT + SAFE_PT;   // 45 pt from physical edge

  // Usable text width (between safe zones on left and right)
  const TEXT_W = PAGE_PT - TEXT_INSET * 2;

  /* ───── TITLE / DEDICATION PAGE ───── */
  {
    const pg = doc.addPage([PAGE_PT, PAGE_PT]);
    pg.drawRectangle({ x: 0, y: 0, width: PAGE_PT, height: PAGE_PT, color: CREAM });

    // Small star ornament, centered, near top
    pg.drawCircle({ x: PAGE_PT / 2, y: PAGE_PT - BLEED_PT - 100, size: 3, color: GOLD });

    // Title, centered
    const titleLines = wrap(title, serifBold, 30, TEXT_W);
    let y = PAGE_PT - BLEED_PT - 180;
    for (const ln of titleLines) {
      const lw = serifBold.widthOfTextAtSize(ln, 30);
      pg.drawText(ln, { x: (PAGE_PT - lw) / 2, y, size: 30, font: serifBold, color: INK });
      y -= 38;
    }

    // Dedication line
    const ded = "Written and illustrated especially for " + childName + ".";
    const dedLines = wrap(ded, serifItalic, 15, TEXT_W);
    y -= 20;
    for (const ln of dedLines) {
      const lw = serifItalic.widthOfTextAtSize(ln, 15);
      pg.drawText(ln, { x: (PAGE_PT - lw) / 2, y, size: 15, font: serifItalic, color: MUTE });
      y -= 22;
    }
  }

  /* ───── STORY PAGES ───── */
  const hasImages = Array.isArray(pageImages) && pageImages.some((b) => !!b);

  for (let i = 0; i < pages.length; i++) {
    const para  = pages[i];
    const bg    = i % 2 === 0 ? CREAM : CREAM2;
    const pg    = doc.addPage([PAGE_PT, PAGE_PT]);

    pg.drawRectangle({ x: 0, y: 0, width: PAGE_PT, height: PAGE_PT, color: bg });

    if (hasImages) {
      const rawImg = Array.isArray(pageImages) ? pageImages[i] : null;
      const img    = await embedImage(doc, rawImg || null);

      // Image band: top ~75% of PAGE, clipped to bleed region at top
      const imgH = PAGE_PT * 0.75;
      drawContain(pg, img, 0, PAGE_PT - imgH, PAGE_PT, imgH, bg);

      // Gold separator rule
      if (img) {
        pg.drawRectangle({ x: 0, y: PAGE_PT - imgH - 2, width: PAGE_PT, height: 2, color: GOLD });
      }

      // Text band: between separator and safe-zone bottom
      const textAreaTop  = PAGE_PT - imgH - 10;
      const textAreaBot  = TEXT_INSET + 20;          // above page-number zone
      const textSize     = 17;
      const lineStep     = textSize + 8;
      const storyLines   = wrap(para, serif, textSize, TEXT_W);

      let ty = textAreaTop - textSize;
      for (const ln of storyLines) {
        if (ty < textAreaBot) break;                 // don't overflow into bleed
        pg.drawText(ln, { x: TEXT_INSET, y: ty, size: textSize, font: serif, color: INK });
        ty -= lineStep;
      }
    } else {
      // Text-only fallback: vertically centered text block
      const textSize  = 21;
      const lineStep  = textSize + 10;
      const storyLines = wrap(para, serif, textSize, TEXT_W);
      const blockH    = storyLines.length * lineStep;
      let ty = (PAGE_PT + blockH) / 2 - textSize;

      for (const ln of storyLines) {
        pg.drawText(ln, { x: TEXT_INSET, y: ty, size: textSize, font: serif, color: INK });
        ty -= lineStep;
      }
    }

    // Page number — inside safe zone, bottom-center
    const num = String(i + 1);
    const nw  = sans.widthOfTextAtSize(num, 12);
    pg.drawText(num, {
      x: (PAGE_PT - nw) / 2,
      y: TEXT_INSET - 14,    // just below the safe-zone floor, still above bleed
      size: 12, font: sans, color: MUTE,
    });
  }

  /* ───── EVEN-PAGE PADDING ─────
     Lulu requires an even total interior page count.
     Count = 1 (dedication) + pages.length; append blank if odd.
     TODO: confirm this requirement for your specific Lulu product type.
  ─────────────────────────────── */
  const totalPages = 1 + pages.length;
  const target = Math.ceil(totalPages / 4) * 4;   // saddle-stitch requires a multiple of 4
  for (let k = totalPages; k < target; k++) {
    const blank = doc.addPage([PAGE_PT, PAGE_PT]);
    blank.drawRectangle({ x: 0, y: 0, width: PAGE_PT, height: PAGE_PT, color: CREAM });
  }

  return doc.save();
}

/* ─────────────────────────────────────────────
   COVER PDF
───────────────────────────────────────────── */

/**
 * Build the Lulu-ready WRAPAROUND COVER PDF (single landscape page).
 *
 * Layout (left → right): [ back cover | spine | front cover ]
 *
 * Height    = trim + 2 * bleed  =  8.75 in  =  630 pt
 * Width     = 2 * (trim + bleed) + spineWidth
 *           = 2 * (8.5 + 0.125) + spineWidth in
 *
 * Spine width:
 *   hardcover → pageCount × SPINE_PER_PAGE_IN  (TODO: confirm formula with Lulu)
 *   softcover → 0  (thin saddle-stitch; Lulu may still require a minimal spine)
 *
 * @param {object}       opts
 * @param {string}       opts.title        — book title
 * @param {string}       opts.childName    — child's name
 * @param {string}       opts.blurb        — one-liner shown on back cover
 * @param {Buffer}       opts.coverImage   — JPEG (or PNG) for the front cover
 * @param {number}       opts.pageCount    — total interior page count (after even-padding)
 * @param {string}       opts.binding      — 'hardcover' | 'softcover' (default: 'softcover')
 * @returns {Promise<Uint8Array>}
 */
async function buildCoverPDF({ title, childName, blurb, coverImage, pageCount, binding = "softcover" }) {
  // Compute spine width
  const spineW_in = binding === "hardcover"
    ? pageCount * SPINE_PER_PAGE_IN    // TODO confirm Lulu spine formula
    : 0;                               // softcover / saddle-stitch: no spine
  const spineW_pt = spineW_in * PT_PER_IN;

  // Full wraparound cover dimensions
  const coverH_pt = PAGE_PT;                                     // 630 pt (8.75 in)
  const panelW_pt = (TRIM_IN + BLEED_IN) * PT_PER_IN;           // one cover panel = 612 pt (8.625 in)
  const coverW_pt = 2 * panelW_pt + spineW_pt;                  // total width

  // X-offsets for each region
  const backX   = 0;
  const spineX  = panelW_pt;
  const frontX  = panelW_pt + spineW_pt;

  const doc = await PDFDocument.create();
  doc.setTitle(title + " — Cover (wraparound)");
  doc.setAuthor("Inklings");
  doc.setSubject("Inklings personalized storybook — cover file for Lulu");
  doc.setProducer("Inklings print-pdf.js");

  doc.registerFontkit(fontkit);
  const serif       = await doc.embedFont(fs.readFileSync(FONT.serif), { subset: true });
  const serifBold   = await doc.embedFont(fs.readFileSync(FONT.serifBold), { subset: true });
  const serifItalic = await doc.embedFont(fs.readFileSync(FONT.serifItalic), { subset: true });
  const sans        = await doc.embedFont(fs.readFileSync(FONT.sans), { subset: true });

  const pg = doc.addPage([coverW_pt, coverH_pt]);

  // Safe text inset within each panel (from physical outer/top/bottom edges)
  const TEXT_INSET = BLEED_PT + SAFE_PT;    // 45 pt

  /* ─── FRONT COVER (right panel) ─── */
  {
    const fw = panelW_pt;
    const fx = frontX;

    // Cover image: contain-fit fills the entire front panel
    const img = await embedImage(doc, coverImage);
    drawContain(pg, img, fx, 0, fw, coverH_pt, INK);

    // Semi-transparent title bar at bottom of front panel
    const barH = 120;
    pg.drawRectangle({ x: fx, y: 0, width: fw, height: barH, color: INK, opacity: 0.88 });

    // Title
    const titleSafe = TEXT_INSET;
    const titleW    = fw - TEXT_INSET * 2;
    const titleLines = wrap(title, serifBold, 26, titleW);
    let ty = barH - 36;
    for (const ln of titleLines) {
      pg.drawText(ln, {
        x: fx + TEXT_INSET, y: ty,
        size: 26, font: serifBold, color: CREAM,
      });
      ty -= 32;
    }

    // "Made for {childName}"
    const sub = "Made for " + childName;
    pg.drawText(sub, {
      x: fx + TEXT_INSET, y: TEXT_INSET - 2,
      size: 14, font: serifItalic, color: GOLD,
    });
  }

  /* ─── BACK COVER (left panel) ─── */
  {
    const bw = panelW_pt;

    // Solid INK background
    pg.drawRectangle({ x: backX, y: 0, width: bw, height: coverH_pt, color: INK });

    // Blurb text, centered vertically in the back panel
    const blurbW     = bw - TEXT_INSET * 2;
    const blurbLines = wrap(blurb || "", serifItalic, 18, blurbW);
    const blurbBlockH = blurbLines.length * 26;
    let by = (coverH_pt + blurbBlockH) / 2 - 18;
    for (const ln of blurbLines) {
      pg.drawText(ln, {
        x: backX + TEXT_INSET, y: by,
        size: 18, font: serifItalic, color: CREAM,
      });
      by -= 26;
    }

    // Inklings.com URL near bottom of back panel
    const urlText = "Inklings.com";
    const urlW    = sans.widthOfTextAtSize(urlText, 13);
    pg.drawText(urlText, {
      x: backX + (bw - urlW) / 2,
      y: TEXT_INSET - 4,
      size: 13, font: sans, color: GOLD, opacity: 0.9,
    });
  }

  /* ─── SPINE (center strip, only if wide enough) ─── */
  if (spineW_pt >= SPINE_MIN_FOR_TEXT_IN * PT_PER_IN) {
    // Fill spine with INK
    pg.drawRectangle({ x: spineX, y: 0, width: spineW_pt, height: coverH_pt, color: INK });

    // Vertical title text, rotated 90° CCW, centered on spine
    const spineTitle  = title;
    const spineFontSz = Math.min(12, spineW_pt * 0.65);          // scale to spine width
    const spineTW     = serifBold.widthOfTextAtSize(spineTitle, spineFontSz);
    const spineCenterX = spineX + spineW_pt / 2;
    const spineCenterY = coverH_pt / 2;

    // pdf-lib rotates around the x,y anchor — place text so center lands on spine center
    pg.drawText(spineTitle, {
      x: spineCenterX - spineFontSz / 2,   // horizontally center the rotated baseline
      y: spineCenterY - spineTW / 2,
      size: spineFontSz,
      font: serifBold,
      color: GOLD,
      rotate: degrees(90),
    });
  } else if (spineW_pt > 0) {
    // Spine exists but too narrow for text — just fill with INK
    pg.drawRectangle({ x: spineX, y: 0, width: spineW_pt, height: coverH_pt, color: INK });
  }

  return doc.save();
}

/* ─────────────────────────────────────────────
   EXPORTS
───────────────────────────────────────────── */
module.exports = { buildInteriorPDF, buildCoverPDF };
