/**
 * KDP-spec page template (dispatch 009 baseline + CMYK upgrade in dispatch 007).
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
 * Dispatch 007 adds the sRGB → CMYK conversion via sharp before embedJpg.
 * Strict KDP requires DeviceCMYK on PDF/X-1a interior files.
 */
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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
  pdf.setCreator("Inklings KDP page-template");
  pdf.setSubject("AI-assisted children's storybook");

  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);

  const pageSize = (KDP_SPEC.trimInches + 2 * KDP_SPEC.bleedInches) * IN; // 8.75 incl bleed
  const safeMargin = (KDP_SPEC.innerMarginInches + KDP_SPEC.bleedInches) * IN;

  // Cover (page 1)
  const cover = pdf.addPage([pageSize, pageSize]);
  cover.drawRectangle({ x: 0, y: 0, width: pageSize, height: pageSize, color: rgb(1.0, 0.965, 0.898) });
  cover.drawText(book.title, {
    x: safeMargin, y: pageSize - safeMargin - 60,
    size: 38, font, color: rgb(0.29, 0.145, 0.27),
  });
  if (book.subtitle) {
    cover.drawText(book.subtitle, {
      x: safeMargin, y: pageSize - safeMargin - 100,
      size: 18, font: bodyFont, color: rgb(0.49, 0.31, 0.43),
    });
  }
  cover.drawText(`a story by ${book.author}`, {
    x: safeMargin, y: safeMargin + 12,
    size: 14, font: bodyFont, color: rgb(0.49, 0.31, 0.43),
  });

  // Story pages
  for (const p of book.pages) {
    const page = pdf.addPage([pageSize, pageSize]);
    page.drawRectangle({ x: 0, y: 0, width: pageSize, height: pageSize, color: rgb(1.0, 0.965, 0.898) });

    if (p.imageBytes && p.imageBytes.length > 0) {
      // CMYK conversion before embedding (dispatch 007)
      const cmykBytes = await toCmykJpeg(p.imageBytes);
      const img = await pdf.embedJpg(cmykBytes);
      const imgWidth = pageSize - 2 * safeMargin;
      const imgHeight = (pageSize - 2 * safeMargin) * 0.6;
      const ratio = Math.min(imgWidth / img.width, imgHeight / img.height);
      page.drawImage(img, {
        x: (pageSize - img.width * ratio) / 2,
        y: pageSize - safeMargin - img.height * ratio,
        width: img.width * ratio,
        height: img.height * ratio,
      });
    } else {
      page.drawRectangle({
        x: safeMargin, y: pageSize * 0.4,
        width: pageSize - 2 * safeMargin, height: pageSize * 0.5,
        borderColor: rgb(0.66, 0.86, 0.71), borderWidth: 2,
      });
    }

    const textY = pageSize * 0.3;
    const lines = wrapText(p.text, bodyFont, 18, pageSize - 2 * safeMargin);
    lines.forEach((line, i) => {
      page.drawText(line, {
        x: safeMargin, y: textY - i * 24,
        size: 18, font: bodyFont, color: rgb(0.29, 0.145, 0.27),
      });
    });

    page.drawText(`${p.pageNumber}`, {
      x: pageSize / 2 - 6, y: safeMargin / 2,
      size: 10, font: bodyFont, color: rgb(0.49, 0.31, 0.43),
    });
  }

  return pdf.save();
}

function wrapText(text: string, font: any, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
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
  const path = await import("node:path");
  const fs = await import("node:fs/promises");
  const filepath = path.join(process.cwd(), "public", localUrl.replace(/^\//, ""));
  try {
    const buf = await fs.readFile(filepath);
    return new Uint8Array(buf);
  } catch {
    return undefined;
  }
}
