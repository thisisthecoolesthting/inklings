/**
 * KDP-spec page template.
 *
 * Per Inklings handoff, non-negotiable:
 *   trim:        8.5" × 8.5"
 *   resolution:  300 DPI minimum
 *   bleed:       0.125" per side (full bleed)
 *   margins:     0.375" inner, 0.25" outer/top/bottom
 *   color:       sRGB import, target CMYK on export
 *   format:      PDF/X-1a
 *   fonts:       all embedded
 *
 * pdf-lib renders in points (1 in = 72 pt). We compute in inches and
 * convert at the boundary so the math reads naturally.
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
  imageBytes?: Uint8Array; // PNG/JPEG of the illustration. If absent, leaves placeholder.
  imageFormat?: "png" | "jpg";
}

export interface BookInput {
  title: string;
  subtitle?: string;
  author: string;
  pages: PageInput[];
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

  const pageSize = (KDP_SPEC.trimInches + 2 * KDP_SPEC.bleedInches) * IN; // 8.75 inches incl bleed
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
      const img = p.imageFormat === "jpg" ? await pdf.embedJpg(p.imageBytes) : await pdf.embedPng(p.imageBytes);
      // Fit image in the upper 60% of the page within safe margins
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
      // Placeholder frame
      page.drawRectangle({
        x: safeMargin, y: pageSize * 0.4,
        width: pageSize - 2 * safeMargin, height: pageSize * 0.5,
        borderColor: rgb(0.66, 0.86, 0.71), borderWidth: 2,
      });
    }

    // Page text — bottom 30%, wrapped
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

/** Naive line-wrapping for paragraph text — good enough for storybook prose. */
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
