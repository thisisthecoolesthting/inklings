/**
 * print-pdf.js — Inklings Lulu-ready print PDF builder (atelier edition)
 *
 * Exports TWO functions for Lulu's two-file submission requirement:
 *
 *   buildInteriorPDF({ title, childName, pages, pageImages })
 *     → Promise<Uint8Array>   — interior-only (no cover), Lulu-ready
 *
 *   buildCoverPDF({ title, childName, blurb, coverImage, pageCount, binding })
 *     → Promise<Uint8Array>   — wraparound single-page cover (back|spine|front)
 *
 * Design language (matches inklings.shop): warm cream paper, plum ink, coral
 * and gold accents; Zilla Slab for display, Gentium Book Plus for story text
 * (both OFL, bundled at assets/fonts/, Liberation fallback); matted art
 * plates, drop caps, star ornaments, hairline rules.
 *
 * Interior page order:
 *   1. Title / dedication page
 *   2. "This book belongs to" bookplate page
 *   3…N+2. Story pages (matted plate + drop cap + ornament divider)
 *   N+3. "The End" colophon page
 *   …    activity page / star blank appended to reach a multiple of 4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ASSUMPTIONS — confirm all against Lulu's current file-prep guide before use:
 *   [1] Trim 8.5×8.5 in, bleed 0.125 in all edges, safe 0.5 in for text
 *   [2] Saddle-stitch / thin softcover page count should be a multiple of 4
 *   [3] Spine formula hardcover → pageCount × 0.0025 in; softcover → 0
 *   [4] sRGB used here; images should be ≥300 DPI before being passed in
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use strict";

const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit");

/* ─────────────────────────────────────────────
   BRAND FONTS — bundled OFL faces, system fallback
───────────────────────────────────────────── */
const BUNDLED_FONT_DIR = path.join(process.cwd(), "assets", "fonts");
const LIBERATION_DIR = "/usr/share/fonts/truetype/liberation/";

const FONT_FILES = {
  display:   { bundled: "ZillaSlab-Bold.ttf",          fallback: LIBERATION_DIR + "LiberationSerif-Bold.ttf" },
  label:     { bundled: "ZillaSlab-SemiBold.ttf",      fallback: LIBERATION_DIR + "LiberationSerif-Bold.ttf" },
  labelMed:  { bundled: "ZillaSlab-Medium.ttf",        fallback: LIBERATION_DIR + "LiberationSans-Regular.ttf" },
  body:      { bundled: "GentiumBookPlus-Regular.ttf", fallback: LIBERATION_DIR + "LiberationSerif-Regular.ttf" },
  bodyItalic:{ bundled: "GentiumBookPlus-Italic.ttf",  fallback: LIBERATION_DIR + "LiberationSerif-Italic.ttf" },
  bodyBold:  { bundled: "GentiumBookPlus-Bold.ttf",    fallback: LIBERATION_DIR + "LiberationSerif-Bold.ttf" },
};

function readFontBytes(role) {
  const dir = process.env.INK_FONT_DIR
    ? { bundled: path.join(process.env.INK_FONT_DIR, FONT_FILES[role].bundled), fallback: FONT_FILES[role].fallback }
    : { bundled: path.join(BUNDLED_FONT_DIR, FONT_FILES[role].bundled), fallback: FONT_FILES[role].fallback };
  for (const p of [dir.bundled, dir.fallback]) {
    try { return fs.readFileSync(p); } catch (_) { /* try next */ }
  }
  throw new Error("no usable font for role " + role);
}

async function embedBrandFonts(doc) {
  doc.registerFontkit(fontkit);
  const out = {};
  for (const role of Object.keys(FONT_FILES)) {
    out[role] = await doc.embedFont(readFontBytes(role), { subset: true });
  }
  return out;
}

/* ─────────────────────────────────────────────
   PHYSICAL CONSTANTS  (inches → points at 72pt/in)
───────────────────────────────────────────── */
const PT_PER_IN        = 72;

const TRIM_IN          = 8.5;
const BLEED_IN         = 0.125;
const SAFE_IN          = 0.5;

const TRIM_PT          = TRIM_IN  * PT_PER_IN;   // 612 pt
const BLEED_PT         = BLEED_IN * PT_PER_IN;   //   9 pt
const SAFE_PT          = SAFE_IN  * PT_PER_IN;   //  36 pt
const PAGE_PT          = (TRIM_IN + 2 * BLEED_IN) * PT_PER_IN;  // 630 pt

const SPINE_PER_PAGE_IN = 0.0025;
const SPINE_MIN_FOR_TEXT_IN = 0.25;

const TEXT_INSET = BLEED_PT + SAFE_PT;           // 45 pt — text stays inside this

/* ─────────────────────────────────────────────
   PALETTE — Inklings brand, tuned for print
───────────────────────────────────────────── */
const PAPER      = rgb(1.0,   0.965, 0.898);  // #FFF6E5 warm cream
const CARD       = rgb(1.0,   0.996, 0.976);  // #FFFEF9 plate white
const PLUM       = rgb(0.29,  0.145, 0.27);   // #4A2545 brand ink
const PLUM_DEEP  = rgb(0.137, 0.067, 0.129);  // #231121 cover depth
const CORAL      = rgb(0.878, 0.373, 0.208);  // #E05F35 print-safe coral
const GOLD       = rgb(0.831, 0.647, 0.455);  // #D4A574
const MUTE       = rgb(0.49,  0.31,  0.43);   // #7D506E

/* ─────────────────────────────────────────────
   TEXT HELPERS
───────────────────────────────────────────── */

/** Word-wrap `text` to fit within `maxW` points at `size`. */
function wrap(text, font, size, maxW) {
  const words = String(text).split(/\s+/).filter(Boolean);
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

/** Greedy wrap where each line index can have its own max width (drop-cap slot). */
function wrapWithWidths(text, font, size, widthForLine) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  const idx = lines.length;
  let maxW = widthForLine(idx);
  for (const w of words) {
    const candidate = line ? line + " " + w : w;
    if (font.widthOfTextAtSize(candidate, size) > maxW && line) {
      lines.push(line);
      line = "";
      maxW = widthForLine(lines.length);
    }
    line = line ? line + " " + w : w;
  }
  if (line) lines.push(line);
  return lines;
}

/** Centered text: returns the y it drew at (baseline). */
function centerText(pg, text, font, size, cx, y, color, opacity) {
  const w = font.widthOfTextAtSize(text, size);
  pg.drawText(text, { x: cx - w / 2, y, size, font, color, opacity: opacity ?? 1 });
  return y;
}

/* ─────────────────────────────────────────────
   ORNAMENTS — vector sparkle stars + rules
───────────────────────────────────────────── */

/** 4-point sparkle star, centered on (0,0) at radius 10. Symmetric under flip. */
const STAR_PATH =
  "M 0 -10 C 1.5 -2.5, 2.5 -1.5, 10 0 C 2.5 1.5, 1.5 2.5, 0 10 " +
  "C -1.5 2.5, -2.5 1.5, -10 0 C -2.5 -1.5, -1.5 -2.5, 0 -10 Z";

function drawStar(pg, cx, cy, r, color, opacity) {
  pg.drawSvgPath(STAR_PATH, {
    x: cx, y: cy,
    scale: r / 10,
    color, opacity: opacity ?? 1,
  });
}

/** Classic trio: one larger star flanked by two smaller ones. */
function drawStarCluster(pg, cx, cy, scale, color) {
  drawStar(pg, cx, cy, 9 * scale, color);
  drawStar(pg, cx - 26 * scale, cy - 4 * scale, 5 * scale, color, 0.85);
  drawStar(pg, cx + 26 * scale, cy - 4 * scale, 5 * scale, color, 0.85);
}

/** Hairline — star — hairline, centered at (cx, y). */
function drawDivider(pg, cx, y, color) {
  const half = 74;
  const gap = 14;
  pg.drawLine({
    start: { x: cx - half, y }, end: { x: cx - gap, y },
    thickness: 0.9, color, opacity: 0.9,
  });
  pg.drawLine({
    start: { x: cx + gap, y }, end: { x: cx + half, y },
    thickness: 0.9, color, opacity: 0.9,
  });
  drawStar(pg, cx, y, 7, color);
}

/** Rounded-rect svg path (for borders only — no fill). */
function roundedRectPath(x, y, w, h, r) {
  return (
    `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} ` +
    `L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} ` +
    `L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} ` +
    `L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`
  );
}

/** Double-rule frame inset `inset` from the physical page edge. */
function drawDoubleFrame(pg, inset, w, h, color) {
  pg.drawRectangle({
    x: inset, y: inset, width: w - 2 * inset, height: h - 2 * inset,
    borderColor: color, borderWidth: 1.6, borderOpacity: 0.85,
  });
  pg.drawRectangle({
    x: inset + 6, y: inset + 6, width: w - 2 * (inset + 6), height: h - 2 * (inset + 6),
    borderColor: color, borderWidth: 0.7, borderOpacity: 0.7,
  });
}

/* ─────────────────────────────────────────────
   IMAGES
───────────────────────────────────────────── */

async function embedImage(doc, bytes) {
  if (!bytes) return null;
  try { return await doc.embedJpg(bytes); }
  catch (_) {
    try { return await doc.embedPng(bytes); }
    catch (__) { return null; }
  }
}

/**
 * Draw an image as a matted plate: near-white card, gold hairline, then the
 * image contain-fit inside with even padding. (x,y) = lower-left of plate.
 */
function drawPlate(pg, img, x, y, w, h) {
  pg.drawRectangle({ x, y, width: w, height: h, color: CARD });
  pg.drawRectangle({
    x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1,
    borderColor: GOLD, borderWidth: 1, borderOpacity: 0.8,
  });
  if (!img) return;
  const pad = 12;
  const iw = w - pad * 2;
  const ih = h - pad * 2;
  const scale = Math.min(iw / img.width, ih / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  pg.drawImage(img, {
    x: x + (w - dw) / 2,
    y: y + (h - dh) / 2,
    width: dw, height: dh,
  });
}

/* ─────────────────────────────────────────────
   INTERIOR PDF
───────────────────────────────────────────── */

/**
 * Build the Lulu-ready INTERIOR PDF (no front cover — Lulu prints that separately).
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
  doc.setProducer("Inklings print-pdf.js (atelier)");

  const F = await embedBrandFonts(doc);
  const CX = PAGE_PT / 2;
  const TEXT_W = PAGE_PT - TEXT_INSET * 2;

  function newPaperPage() {
    const pg = doc.addPage([PAGE_PT, PAGE_PT]);
    pg.drawRectangle({ x: 0, y: 0, width: PAGE_PT, height: PAGE_PT, color: PAPER });
    return pg;
  }

  /* ───── PAGE 1 · TITLE / DEDICATION ───── */
  {
    const pg = newPaperPage();
    drawDoubleFrame(pg, BLEED_PT + 15, PAGE_PT, PAGE_PT, GOLD);

    drawStarCluster(pg, CX, PAGE_PT - BLEED_PT - 118, 1.0, GOLD);

    const titleSize = 33;
    const titleLines = wrap(title, F.display, titleSize, TEXT_W - 30);
    let y = PAGE_PT - BLEED_PT - 190;
    for (const ln of titleLines) {
      centerText(pg, ln, F.display, titleSize, CX, y, PLUM);
      y -= titleSize + 10;
    }

    y -= 6;
    drawDivider(pg, CX, y, GOLD);

    y -= 44;
    centerText(pg, "Written and illustrated especially for", F.bodyItalic, 15, CX, y, MUTE);
    y -= 30;
    centerText(pg, childName, F.label, 21, CX, y, CORAL);

    centerText(pg, "I N K L I N G S", F.labelMed, 9.5, CX, TEXT_INSET + 4, MUTE, 0.85);
  }

  /* ───── PAGE 2 · "THIS BOOK BELONGS TO" BOOKPLATE ───── */
  {
    const pg = newPaperPage();
    drawDoubleFrame(pg, BLEED_PT + 15, PAGE_PT, PAGE_PT, GOLD);

    const plateW = PAGE_PT - (BLEED_PT + 84) * 2;
    const plateH = 300;
    const plateX = (PAGE_PT - plateW) / 2;
    const plateY = (PAGE_PT - plateH) / 2 + 10;

    drawStarCluster(pg, CX, plateY + plateH + 46, 0.8, GOLD);

    pg.drawSvgPath(roundedRectPath(plateX, plateY, plateW, plateH, 14), {
      x: 0, y: 0, borderColor: GOLD, borderWidth: 1.4, borderOpacity: 0.9,
    });
    pg.drawSvgPath(roundedRectPath(plateX + 7, plateY + 7, plateW - 14, plateH - 14, 10), {
      x: 0, y: 0, borderColor: GOLD, borderWidth: 0.6, borderOpacity: 0.7,
    });

    let y = plateY + plateH - 58;
    centerText(pg, "This book belongs to", F.label, 17, CX, y, PLUM);

    // ruled name line
    const lineW = plateW - 130;
    y -= 62;
    pg.drawLine({
      start: { x: CX - lineW / 2, y }, end: { x: CX + lineW / 2, y },
      thickness: 0.9, color: MUTE, opacity: 0.75,
    });
    drawStar(pg, CX, y + 40, 6, GOLD, 0.9);

    y -= 48;
    centerText(pg, "and their big imagination", F.bodyItalic, 13.5, CX, y, MUTE);

    centerText(pg, "made with love · inklings.shop", F.labelMed, 9.5, CX, plateY - 34, MUTE, 0.8);
  }

  /* ───── STORY PAGES ───── */
  const hasImages = Array.isArray(pageImages) && pageImages.some((b) => !!b);

  for (let i = 0; i < pages.length; i++) {
    const pg = newPaperPage();
    const para = String(pages[i] ?? "").trim();

    if (hasImages) {
      const img = await embedImage(doc, Array.isArray(pageImages) ? pageImages[i] : null);

      // Matted art plate, centered, upper page. Sized so the text block
      // below (up to 4 lines + folio) always clears the trim edge.
      const plateSize = PAGE_PT - (BLEED_PT + 86) * 2;   // 440 pt plate
      const plateX = (PAGE_PT - plateSize) / 2;
      const plateY = PAGE_PT - BLEED_PT - 24 - plateSize;

      if (img) {
        drawPlate(pg, img, plateX, plateY, plateSize, plateSize);
      } else {
        // no art for this page — empty plate with a star
        drawPlate(pg, null, plateX, plateY, plateSize, plateSize);
        drawStar(pg, CX, plateY + plateSize / 2, 18, GOLD, 0.5);
      }

      const dividerY = plateY - 26;
      drawDivider(pg, CX, dividerY, GOLD);

      // Story text with drop cap. Auto-shrinks: 3 lines at full size, up to
      // 4 lines at the smallest sizes; pathological overflow is truncated.
      let size = 15.5;
      let maxLines = 3;
      let lines = [];
      let capChar = "";
      let rest = para;
      if (rest.length > 0) { capChar = rest[0]; rest = rest.slice(1).trimStart(); }

      for (const [candidate, cap] of [[15.5, 3], [14, 3], [12.75, 4], [11.5, 4]]) {
        size = candidate;
        maxLines = cap;
        const capW = rest ? F.display.widthOfTextAtSize(capChar, size * 2.15) : 0;
        const slot = capW > 0 ? capW + 12 : 0;
        lines = wrapWithWidths(rest, F.body, size, (ln) =>
          TEXT_W - (ln < 2 ? slot : 0),
        );
        if (lines.length <= cap) break;
      }

      const lineStep = size + 6.5;
      const capSize = size * 2.15;
      const capW = capChar ? F.display.widthOfTextAtSize(capChar, capSize) : 0;
      const slot = capW > 0 ? capW + 12 : 0;
      const textTop = dividerY - 26;

      if (capChar) {
        pg.drawText(capChar, {
          x: TEXT_INSET, y: textTop - (lineStep - 5) - (capSize - size) * 0.35,
          size: capSize, font: F.display, color: CORAL,
        });
      }
      let ty = textTop;
      for (let li = 0; li < lines.length && li < maxLines; li++) {
        pg.drawText(lines[li], {
          x: TEXT_INSET + (li < 2 ? slot : 0), y: ty,
          size, font: F.body, color: PLUM,
        });
        ty -= lineStep;
      }
    } else {
      // Text-only page: centered block with ornaments + drop cap
      drawStarCluster(pg, CX, PAGE_PT - BLEED_PT - 120, 0.85, GOLD);
      const size = 18;
      const lineStep = size + 9;
      let capChar = "";
      let rest = para;
      if (rest.length > 0) { capChar = rest[0]; rest = rest.slice(1).trimStart(); }
      const capSize = size * 2.1;
      const capW = capChar ? F.display.widthOfTextAtSize(capChar, capSize) : 0;
      const slot = capW > 0 ? capW + 12 : 0;
      const lines = wrapWithWidths(rest, F.body, size, (ln) => TEXT_W - (ln < 2 ? slot : 0));
      const blockH = lines.length * lineStep;
      let ty = (PAGE_PT + blockH) / 2 - size - 20;

      if (capChar) {
        pg.drawText(capChar, {
          x: TEXT_INSET, y: ty - (lineStep - 5) - (capSize - size) * 0.35,
          size: capSize, font: F.display, color: CORAL,
        });
      }
      for (const ln of lines) {
        pg.drawText(ln, {
          x: TEXT_INSET + (ty > (PAGE_PT + blockH) / 2 - size - 20 - lineStep * 2 ? slot : 0),
          y: ty, size, font: F.body, color: PLUM,
        });
        ty -= lineStep;
      }
      drawDivider(pg, CX, TEXT_INSET + 60, GOLD);
    }

    // Page number — flanked by tiny stars, inside safe zone
    const num = String(i + 1);
    const nw = F.label.widthOfTextAtSize(num, 11);
    const ny = TEXT_INSET - 6;
    centerText(pg, num, F.label, 11, CX, ny, MUTE);
    drawStar(pg, CX - nw / 2 - 14, ny + 4, 4.5, GOLD, 0.9);
    drawStar(pg, CX + nw / 2 + 14, ny + 4, 4.5, GOLD, 0.9);
  }

  /* ───── "THE END" COLOPHON ───── */
  {
    const pg = newPaperPage();
    drawDoubleFrame(pg, BLEED_PT + 15, PAGE_PT, PAGE_PT, GOLD);

    drawStarCluster(pg, CX, PAGE_PT / 2 + 108, 1.0, GOLD);
    centerText(pg, "The End", F.display, 40, CX, PAGE_PT / 2 + 34, PLUM);
    drawDivider(pg, CX, PAGE_PT / 2 - 6, GOLD);

    const colophon = `Made with Inklings — every page dreamed up by ${childName} and approved by their grown-up.`;
    const lines = wrap(colophon, F.bodyItalic, 13, TEXT_W - 80);
    let y = PAGE_PT / 2 - 44;
    for (const ln of lines) {
      centerText(pg, ln, F.bodyItalic, 13, CX, y, MUTE);
      y -= 19;
    }
    centerText(pg, "inklings.shop", F.labelMed, 11, CX, y - 12, GOLD);
  }

  /* ───── PAD TO MULTIPLE OF 4 (activity page, then star blank) ───── */
  const totalPages = 3 + pages.length;   // title + belongs + story + end
  const target = Math.ceil(totalPages / 4) * 4;
  const fillers = target - totalPages;

  if (fillers >= 1) {
    const pg = newPaperPage();
    drawDoubleFrame(pg, BLEED_PT + 15, PAGE_PT, PAGE_PT, GOLD);

    drawStarCluster(pg, CX, PAGE_PT - BLEED_PT - 118, 0.85, GOLD);
    centerText(pg, "Draw your own ending", F.display, 27, CX, PAGE_PT - BLEED_PT - 168, PLUM);
    centerText(pg, "What happens next in your story?", F.bodyItalic, 13.5, CX, PAGE_PT - BLEED_PT - 198, MUTE);

    const boxX = BLEED_PT + 64;
    const boxY = BLEED_PT + 88;
    const boxW = PAGE_PT - boxX * 2;
    const boxH = PAGE_PT - BLEED_PT - 240 - boxY + 60;
    pg.drawSvgPath(roundedRectPath(boxX, boxY, boxW, boxH, 12), {
      x: 0, y: 0, borderColor: GOLD, borderWidth: 1.2, borderOpacity: 0.85,
    });
    drawStar(pg, boxX + 16, boxY + 16, 5, GOLD, 0.7);
    drawStar(pg, boxX + boxW - 16, boxY + 16, 5, GOLD, 0.7);
    drawStar(pg, boxX + 16, boxY + boxH - 16, 5, GOLD, 0.7);
    drawStar(pg, boxX + boxW - 16, boxY + boxH - 16, 5, GOLD, 0.7);
  }

  if (fillers >= 2) {
    const pg = newPaperPage();
    drawStar(pg, CX, PAGE_PT / 2, 8, GOLD, 0.4);
  }

  return doc.save();
}

/* ─────────────────────────────────────────────
   COVER PDF
───────────────────────────────────────────── */

/** Deterministic starfield for the back cover (fractions of panel). */
const BACK_STARS = [
  [0.14, 0.86, 5, 1], [0.30, 0.93, 3, 0.8], [0.52, 0.88, 4, 0.9], [0.71, 0.93, 3, 0.7],
  [0.87, 0.84, 5, 1], [0.10, 0.62, 3, 0.7], [0.90, 0.60, 3, 0.8], [0.16, 0.38, 4, 0.8],
  [0.85, 0.36, 4, 0.7], [0.08, 0.16, 3, 0.7], [0.24, 0.10, 4, 0.85], [0.76, 0.12, 3, 0.7],
  [0.90, 0.18, 4, 0.8], [0.42, 0.95, 3, 0.6], [0.62, 0.06, 3, 0.6], [0.36, 0.07, 3, 0.6],
];

/**
 * Build the Lulu-ready WRAPAROUND COVER PDF (single landscape page).
 * Layout (left → right): [ back cover | spine | front cover ]
 *
 * @param {object}       opts
 * @param {string}       opts.title
 * @param {string}       opts.childName
 * @param {string}       opts.blurb        — one-liner shown on back cover
 * @param {Buffer}       opts.coverImage   — JPEG (or PNG) for the front cover
 * @param {number}       opts.pageCount    — total interior page count (after padding)
 * @param {string}       opts.binding      — 'hardcover' | 'softcover'
 * @returns {Promise<Uint8Array>}
 */
async function buildCoverPDF({ title, childName, blurb, coverImage, pageCount, binding = "softcover" }) {
  const spineW_in = binding === "hardcover" ? pageCount * SPINE_PER_PAGE_IN : 0;
  const spineW_pt = spineW_in * PT_PER_IN;

  const coverH_pt = PAGE_PT;                                  // 630 pt
  const panelW_pt = (TRIM_IN + BLEED_IN) * PT_PER_IN;         // 621 pt per panel
  const coverW_pt = 2 * panelW_pt + spineW_pt;

  const backX = 0;
  const spineX = panelW_pt;
  const frontX = panelW_pt + spineW_pt;

  const doc = await PDFDocument.create();
  doc.setTitle(title + " — Cover (wraparound)");
  doc.setAuthor("Inklings");
  doc.setSubject("Inklings personalized storybook — cover file for Lulu");
  doc.setProducer("Inklings print-pdf.js (atelier)");

  const F = await embedBrandFonts(doc);
  const pg = doc.addPage([coverW_pt, coverH_pt]);

  /* ─── FRONT COVER (right panel) ─── */
  {
    const fx = frontX;
    const fw = panelW_pt;

    pg.drawRectangle({ x: fx, y: 0, width: fw, height: coverH_pt, color: PLUM_DEEP });

    // Cover art as a matted plate, upper ~2/3 of panel
    const img = await embedImage(doc, coverImage);
    const plateMaxW = fw - TEXT_INSET * 2 - 30;
    const plateMaxH = coverH_pt * 0.62;
    const plateSize = Math.min(plateMaxW, plateMaxH);
    const plateX = fx + (fw - plateSize) / 2;
    const plateY = coverH_pt - BLEED_PT - 34 - plateSize;
    if (img) {
      drawPlate(pg, img, plateX, plateY, plateSize, plateSize);
    } else {
      drawPlate(pg, null, plateX, plateY, plateSize, plateSize);
      drawStar(pg, fx + fw / 2, plateY + plateSize / 2, 22, GOLD, 0.6);
    }

    // Title composition under the plate
    let y = plateY - 44;
    const titleSize = 25;
    const titleLines = wrap(title, F.display, titleSize, fw - TEXT_INSET * 2);
    for (const ln of titleLines.slice(0, 2)) {
      centerText(pg, ln, F.display, titleSize, fx + fw / 2, y, PAPER);
      y -= titleSize + 7;
    }

    y -= 4;
    drawDivider(pg, fx + fw / 2, y, GOLD);

    y -= 30;
    centerText(pg, "Made for " + childName, F.bodyItalic, 14.5, fx + fw / 2, y, GOLD);
  }

  /* ─── BACK COVER (left panel) ─── */
  {
    const bw = panelW_pt;
    pg.drawRectangle({ x: backX, y: 0, width: bw, height: coverH_pt, color: PLUM_DEEP });

    // starfield
    for (const [fxs, fys, r, o] of BACK_STARS) {
      drawStar(pg, backX + fxs * bw, fys * coverH_pt, r, GOLD, o);
    }

    // blurb, centered
    const blurbW = bw - TEXT_INSET * 2 - 40;
    const blurbLines = wrap(blurb || "", F.bodyItalic, 16.5, blurbW);
    let by = coverH_pt / 2 + (blurbLines.length * 24) / 2 + 20;
    for (const ln of blurbLines) {
      centerText(pg, ln, F.bodyItalic, 16.5, backX + bw / 2, by, PAPER);
      by -= 24;
    }

    drawDivider(pg, backX + bw / 2, by - 6, GOLD);

    centerText(
      pg,
      "Parent-approved · No ads · A keepsake they made themselves",
      F.labelMed, 10.5, backX + bw / 2, by - 34, PAPER, 0.75,
    );

    // imprint
    drawStar(pg, backX + bw / 2, TEXT_INSET + 34, 6, GOLD, 0.9);
    centerText(pg, "inklings.shop", F.labelMed, 11.5, backX + bw / 2, TEXT_INSET + 8, GOLD);
  }

  /* ─── SPINE ─── */
  if (spineW_pt > 0) {
    pg.drawRectangle({ x: spineX, y: 0, width: spineW_pt, height: coverH_pt, color: PLUM_DEEP });
    if (spineW_pt >= SPINE_MIN_FOR_TEXT_IN * PT_PER_IN) {
      const spineFontSz = Math.min(12, spineW_pt * 0.65);
      const spineTW = F.display.widthOfTextAtSize(title, spineFontSz);
      pg.drawText(title, {
        x: spineX + spineW_pt / 2 - spineFontSz / 2,
        y: coverH_pt / 2 - spineTW / 2,
        size: spineFontSz, font: F.display, color: GOLD,
        rotate: degrees(90),
      });
    }
  }

  return doc.save();
}

/* ─────────────────────────────────────────────
   EXPORTS
───────────────────────────────────────────── */
module.exports = { buildInteriorPDF, buildCoverPDF };
