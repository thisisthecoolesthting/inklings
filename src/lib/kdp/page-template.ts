/**
 * KDP-spec page template (dispatch 009 baseline + CMYK upgrade in dispatch 007,
 * atelier design pass 2026-07-30).
 *
 * Per Inklings handoff, non-negotiable:
 *   trim:        8.5" × 8.5"
 *   resolution:  300 DPI minimum
 *   bleed:       0.125" per side (full bleed)
 *   margins:     0.375" inner, 0.25" outer/top/bottom
 *   color:       sRGB import, target CMYK on export (sharp colorspace step)
 *   format:      PDF/X-1a
 *   fonts:       all embedded
 *
 * Design language matches the Lulu lane (print-pdf.js): warm cream paper,
 * plum ink, coral/gold accents, Zilla Slab display + Gentium Book Plus body
 * (OFL, bundled at assets/fonts/), matted art plates, drop caps, star
 * ornaments. Colors here are emitted as DeviceCMYK via rgbToCmyk().
 */
import { PDFDocument, StandardFonts, cmyk } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "node:fs";
import path from "node:path";
import type { PDFPage, PDFFont } from "pdf-lib";

/** Convert sRGB (0..1 each) to a pdf-lib CMYK color object. */
function rgbToCmyk(r: number, g: number, b: number) {
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return cmyk(0, 0, 0, 1);
  return cmyk((1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k);
}

const IN = 72; // points per inch
export const KDP_SPEC = {
  trimInches: 8.5,
  bleedInches: 0.125,
  innerMarginInches: 0.375,
  outerMarginInches: 0.25,
  dpi: 300,
} as const;

export interface PageInput {
  pageNumber: number;
  text: string;
  imageBytes?: Uint8Array; // sRGB JPEG/PNG. Will be converted to CMYK.
  imageFormat?: "png" | "jpg";
}

export interface BookInput {
  title: string;
  subtitle?: string;
  author: string;
  pages: PageInput[];
}

/* ── Palette (sRGB inputs, emitted as CMYK) ── */
const PAPER = rgbToCmyk(1.0, 0.965, 0.898);   // #FFF6E5
const CARD = rgbToCmyk(1.0, 0.996, 0.976);    // #FFFEF9
const PLUM = rgbToCmyk(0.29, 0.145, 0.27);    // #4A2545
const CORAL = rgbToCmyk(0.878, 0.373, 0.208); // #E05F35
const GOLD = rgbToCmyk(0.831, 0.647, 0.455);  // #D4A574
const MUTE = rgbToCmyk(0.49, 0.31, 0.43);     // #7D506E

/* ── Brand fonts (OFL, bundled) with standard-font fallback ── */
type BookFonts = {
  display: PDFFont;
  label: PDFFont;
  body: PDFFont;
  bodyItalic: PDFFont;
};

function readBundledFont(name: string): Buffer | null {
  const dir = process.env.INK_FONT_DIR ?? path.join(process.cwd(), "assets", "fonts");
  try {
    return fs.readFileSync(path.join(dir, name));
  } catch {
    return null;
  }
}

async function embedBookFonts(pdf: PDFDocument): Promise<BookFonts> {
  pdf.registerFontkit(fontkit);
  const zillaBold = readBundledFont("ZillaSlab-Bold.ttf");
  const zillaSemi = readBundledFont("ZillaSlab-SemiBold.ttf");
  const gentium = readBundledFont("GentiumBookPlus-Regular.ttf");
  const gentiumItalic = readBundledFont("GentiumBookPlus-Italic.ttf");

  return {
    display: zillaBold
      ? await pdf.embedFont(zillaBold, { subset: true })
      : await pdf.embedFont(StandardFonts.HelveticaBold),
    label: zillaSemi
      ? await pdf.embedFont(zillaSemi, { subset: true })
      : await pdf.embedFont(StandardFonts.HelveticaBold),
    body: gentium
      ? await pdf.embedFont(gentium, { subset: true })
      : await pdf.embedFont(StandardFonts.Helvetica),
    bodyItalic: gentiumItalic
      ? await pdf.embedFont(gentiumItalic, { subset: true })
      : await pdf.embedFont(StandardFonts.HelveticaOblique),
  };
}

/* ── Ornaments (identical geometry to the Lulu lane) ── */
const STAR_PATH =
  "M 0 -10 C 1.5 -2.5, 2.5 -1.5, 10 0 C 2.5 1.5, 1.5 2.5, 0 10 " +
  "C -1.5 2.5, -2.5 1.5, -10 0 C -2.5 -1.5, -1.5 -2.5, 0 -10 Z";

function drawStar(pg: PDFPage, cx: number, cy: number, r: number, opacity = 1) {
  pg.drawSvgPath(STAR_PATH, { x: cx, y: cy, scale: r / 10, color: GOLD, opacity });
}

function drawStarCluster(pg: PDFPage, cx: number, cy: number, scale: number) {
  drawStar(pg, cx, cy, 9 * scale);
  drawStar(pg, cx - 26 * scale, cy - 4 * scale, 5 * scale, 0.85);
  drawStar(pg, cx + 26 * scale, cy - 4 * scale, 5 * scale, 0.85);
}

function drawDivider(pg: PDFPage, cx: number, y: number) {
  const half = 74;
  const gap = 14;
  pg.drawLine({ start: { x: cx - half, y }, end: { x: cx - gap, y }, thickness: 0.9, color: GOLD, opacity: 0.9 });
  pg.drawLine({ start: { x: cx + gap, y }, end: { x: cx + half, y }, thickness: 0.9, color: GOLD, opacity: 0.9 });
  drawStar(pg, cx, y, 7);
}

function drawDoubleFrame(pg: PDFPage, inset: number, size: number) {
  pg.drawRectangle({
    x: inset, y: inset, width: size - 2 * inset, height: size - 2 * inset,
    borderColor: GOLD, borderWidth: 1.6, borderOpacity: 0.85,
  });
  pg.drawRectangle({
    x: inset + 6, y: inset + 6, width: size - 2 * (inset + 6), height: size - 2 * (inset + 6),
    borderColor: GOLD, borderWidth: 0.7, borderOpacity: 0.7,
  });
}

function centerText(pg: PDFPage, text: string, font: PDFFont, size: number, cx: number, y: number, color: ReturnType<typeof rgbToCmyk>) {
  const w = font.widthOfTextAtSize(text, size);
  pg.drawText(text, { x: cx - w / 2, y, size, font, color });
}

/** Matted plate: card + gold hairline + contain-fit image. */
function drawPlate(pg: PDFPage, img: { width: number; height: number } | null, drawImg: ((dx: number, dy: number, dw: number, dh: number) => void) | null, x: number, y: number, w: number, h: number) {
  pg.drawRectangle({ x, y, width: w, height: h, color: CARD });
  pg.drawRectangle({
    x: x + 0.5, y: y + 0.5, width: w - 1, height: h - 1,
    borderColor: GOLD, borderWidth: 1, borderOpacity: 0.8,
  });
  if (!img || !drawImg) return;
  const pad = 12;
  const scale = Math.min((w - pad * 2) / img.width, (h - pad * 2) / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  drawImg(x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

/** Greedy wrap with per-line max widths (drop-cap slot). */
function wrapWithWidths(text: string, font: PDFFont, size: number, widthForLine: (ln: number) => number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  let maxW = widthForLine(0);
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(candidate, size) > maxW && line) {
      lines.push(line);
      line = "";
      maxW = widthForLine(lines.length);
    }
    line = line ? `${line} ${w}` : w;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Convert input image bytes to CMYK JPEG via sharp.
 * sharp 0.34's `toColorspace('cmyk')` produces a CMYK output buffer.
 * Returns the converted bytes ready for pdf-lib embedJpg.
 */
async function toCmykJpeg(input: Uint8Array): Promise<Uint8Array> {
  // Lazy-load sharp so consumers that don't pass image bytes (e.g. text-only
  // sample renders) don't trigger the native binding load.
  const sharp = (await import('sharp')).default;
  const out = await sharp(Buffer.from(input))
    .toColorspace("cmyk")
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
  return new Uint8Array(out);
}

/** Build a single PDF buffer for a complete KDP-ready book. */
export async function renderBookPdf(book: BookInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(book.title);
  pdf.setAuthor(book.author);
  pdf.setProducer("Inklings");
  pdf.setCreator("Inklings KDP page-template (atelier)");
  pdf.setSubject("AI-assisted children's storybook");

  const F = await embedBookFonts(pdf);

  const pageSize = (KDP_SPEC.trimInches + 2 * KDP_SPEC.bleedInches) * IN; // 8.75 incl bleed
  const safeMargin = (KDP_SPEC.innerMarginInches + KDP_SPEC.bleedInches) * IN;
  const bleed = KDP_SPEC.bleedInches * IN;
  const cx = pageSize / 2;
  const textW = pageSize - 2 * safeMargin;

  /* ── Title page ── */
  {
    const pg = pdf.addPage([pageSize, pageSize]);
    pg.drawRectangle({ x: 0, y: 0, width: pageSize, height: pageSize, color: PAPER });
    drawDoubleFrame(pg, bleed + 15, pageSize);

    drawStarCluster(pg, cx, pageSize - bleed - 118, 1.0);

    const titleSize = 33;
    const titleLines = wrapText(book.title, F.display, titleSize, textW - 30);
    let y = pageSize - bleed - 190;
    for (const ln of titleLines) {
      centerText(pg, ln, F.display, titleSize, cx, y, PLUM);
      y -= titleSize + 10;
    }

    y -= 6;
    drawDivider(pg, cx, y);

    if (book.subtitle) {
      y -= 44;
      centerText(pg, book.subtitle, F.bodyItalic, 15, cx, y, MUTE);
      y -= 4;
    }

    centerText(pg, `a story by ${book.author}`, F.label, 13, cx, safeMargin + 8, CORAL);
  }

  /* ── Story pages ── */
  for (const p of book.pages) {
    const pg = pdf.addPage([pageSize, pageSize]);
    pg.drawRectangle({ x: 0, y: 0, width: pageSize, height: pageSize, color: PAPER });

    let plateBottom = pageSize - bleed - 24;
    if (p.imageBytes && p.imageBytes.length > 0) {
      // CMYK conversion before embedding (dispatch 007)
      const cmykBytes = await toCmykJpeg(p.imageBytes);
      const img = await pdf.embedJpg(cmykBytes);
      const plateSize = pageSize - (bleed + 86) * 2;
      const plateX = (pageSize - plateSize) / 2;
      const plateY = pageSize - bleed - 24 - plateSize;
      drawPlate(
        pg,
        img,
        (dx, dy, dw, dh) => pg.drawImage(img, { x: dx, y: dy, width: dw, height: dh }),
        plateX, plateY, plateSize, plateSize,
      );
      plateBottom = plateY;
    } else {
      // no art — star placeholder where the plate would be
      const plateSize = pageSize - (bleed + 86) * 2;
      const plateY = pageSize - bleed - 24 - plateSize;
      drawStar(pg, cx, plateY + plateSize / 2, 18, 0.4);
      plateBottom = plateY;
    }

    const dividerY = plateBottom - 26;
    drawDivider(pg, cx, dividerY);

    // Story text with drop cap. Auto-shrinks: 3 lines at full size, up to
    // 4 lines at the smallest sizes; pathological overflow is truncated.
    const para = String(p.text ?? "").trim();
    let capChar = "";
    let rest = para;
    if (rest.length > 0) { capChar = rest[0]; rest = rest.slice(1).trimStart(); }

    let size = 15.5;
    let maxLines = 3;
    let lines: string[] = [];
    for (const [candidate, cap] of [[15.5, 3], [14, 3], [12.75, 4], [11.5, 4]] as const) {
      size = candidate;
      maxLines = cap;
      const capW = capChar ? F.display.widthOfTextAtSize(capChar, size * 2.15) : 0;
      const slot = capW > 0 ? capW + 12 : 0;
      lines = wrapWithWidths(rest, F.body, size, (ln) => textW - (ln < 2 ? slot : 0));
      if (lines.length <= cap) break;
    }

    const lineStep = size + 6.5;
    const capSize = size * 2.15;
    const capW = capChar ? F.display.widthOfTextAtSize(capChar, capSize) : 0;
    const slot = capW > 0 ? capW + 12 : 0;
    const textTop = dividerY - 26;

    if (capChar) {
      pg.drawText(capChar, {
        x: safeMargin, y: textTop - (lineStep - 5) - (capSize - size) * 0.35,
        size: capSize, font: F.display, color: CORAL,
      });
    }
    let ty = textTop;
    for (let li = 0; li < lines.length && li < maxLines; li++) {
      pg.drawText(lines[li], {
        x: safeMargin + (li < 2 ? slot : 0), y: ty,
        size, font: F.body, color: PLUM,
      });
      ty -= lineStep;
    }

    // Page number flanked by tiny stars
    const num = `${p.pageNumber}`;
    const nw = F.label.widthOfTextAtSize(num, 11);
    const ny = safeMargin - 6;
    centerText(pg, num, F.label, 11, cx, ny, MUTE);
    drawStar(pg, cx - nw / 2 - 14, ny + 4, 4.5, 0.9);
    drawStar(pg, cx + nw / 2 + 14, ny + 4, 4.5, 0.9);
  }

  return pdf.save();
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const trial = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(trial, size) > maxWidth) {
      if (line) lines.push(line);
      line = w;
    } else { line = trial; }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Helper for /api/book/[id]/export — pulls a Book from Prisma + downloads
 * the per-page imageUrlHd files into byte buffers, then calls renderBookPdf.
 *
 * Lives here so the API route stays thin. (Used by a future export dispatch.)
 */
export async function fetchPageImage(localUrl: string | null): Promise<Uint8Array | undefined> {
  if (!localUrl) return undefined;
  // Local storage path: /uploads/<bucket>/<file>.jpg → /var/www/inklings/public/uploads/...
  const filepath = path.join(process.cwd(), "public", localUrl.replace(/^\//, ""));
  try {
    const buf = await fs.promises.readFile(filepath);
    return new Uint8Array(buf);
  } catch {
    return undefined;
  }
}
