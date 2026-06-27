#!/usr/bin/env npx tsx
/**
 * Build one complete demo story for marketing: text-free illustrations + readable typography.
 * Run on VPS: cd /var/www/inklings && npx tsx scripts/build-marketing-showcase.ts
 * Use --force to regenerate images even if files exist.
 * Use --recomposite to refresh typography only (reuses saved raw illustrations).
 */
import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { generatePreview, seedFromImageSeed } from "../src/lib/image-gen";

/** tsx does not auto-load .env — load for --force image generation. */
function loadEnvFile(): void {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* no .env */
  }
}
loadEnvFile();

const OUT_DIR = path.join(process.cwd(), "public", "images", "showcase", "milo-moonbeam");
const SIZE = 1024;
const CREAM = { r: 255, g: 246, b: 229 };
/** Minimum text band — story copy always fits below art, never overlaps it. */
const MIN_TEXT_H = 240;
const MAX_ART_H = SIZE - MIN_TEXT_H;
const PAD_X = 36;
const FONT_SIZE = 30;
const LINE_HEIGHT = 38;
const MAX_LINES = 4;

const DEMO = {
  slug: "milo-moonbeam",
  title: "Milo and the Moonbeam Map",
  childName: "Milo",
  seedKey: "milo-pip-showcase-v2",
  pages: [
    {
      act: "beginning",
      text: "Milo the fox woke up in the Meadowlands. The grass was soft, and the morning smelled like honey.",
      prompt:
        "Coral-orange young fox Milo stretching happily in a sunlit wildflower meadow, golden morning light, whimsical watercolor children's book scene, empty scene no characters facing camera",
    },
    {
      act: "world",
      text: "Pip the puppy trotted over. \"Let's explore the Stardust Woods today!\" Milo grinned and nodded yes.",
      prompt:
        "Coral fox Milo and small golden puppy Pip standing together at the edge of a magical sparkling forest path, Stardust Woods, warm storybook watercolor, friendly adventure mood",
    },
    {
      act: "problem",
      text: "Something was wrong. The moonbeam bell that lit their favorite path had gone completely silent.",
      prompt:
        "Milo fox and Pip puppy looking worried at a dim unlit crystal bell on a mossy post in a forest clearing, soft twilight, watercolor children's illustration",
    },
    {
      act: "adventure",
      text: "They followed a trail of glowing pebbles deeper into the woods. Fireflies danced ahead like tiny lanterns.",
      prompt:
        "Milo fox and Pip puppy walking on a forest trail with glowing pebbles and fireflies, magical adventure, watercolor gouache children's book art",
    },
    {
      act: "adventure",
      text: "A river blocked the way. Pip found stepping-stones shaped like stars — one, two, three hops!",
      prompt:
        "Golden puppy Pip hopping across star-shaped stepping stones over a gentle stream, coral fox Milo waiting on the bank, playful watercolor illustration",
    },
    {
      act: "resolution",
      text: "Behind the waterfall they found the bell, tangled in silver vines. Together they untangled it.",
      prompt:
        "Milo fox and Pip puppy together freeing a glowing crystal bell from silver vines behind a small waterfall, triumphant gentle moment, watercolor children's book",
    },
    {
      act: "celebration",
      text: "The bell rang once — bright and warm. They walked home under a sky full of friendly stars.",
      prompt:
        "Milo fox and Pip puppy walking home through meadow at night under friendly stars and soft moonlight, peaceful happy ending, watercolor storybook",
    },
  ],
} as const;

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function wrapLines(text: string, maxChars = 52): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, MAX_LINES);
}

function storyTextSvg(lines: string[], pageNum: number, textH: number): Buffer {
  const blockH = lines.length * LINE_HEIGHT;
  const startY = Math.round((textH - blockH) / 2) + Math.round(FONT_SIZE * 0.82);
  const textX = PAD_X;
  const textW = SIZE - PAD_X * 2;
  const tspans = lines
    .map(
      (ln, i) =>
        `<tspan x="${textX}" dy="${i === 0 ? 0 : LINE_HEIGHT}" textLength="${textW}" lengthAdjust="spacingAndGlyphs">${escapeXml(ln)}</tspan>`,
    )
    .join("");

  return Buffer.from(`<svg width="${SIZE}" height="${textH}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#FFF6E5"/>
  <rect x="0" y="0" width="${SIZE}" height="3" fill="#E8B84A"/>
  <text
    x="${textX}"
    y="${startY}"
    font-family="Georgia, 'Palatino Linotype', 'Times New Roman', serif"
    font-size="${FONT_SIZE}"
    font-weight="500"
    fill="#4A2545"
  >${tspans}</text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#7D506E" x="${SIZE / 2}" y="${textH - 16}" text-anchor="middle">${pageNum}</text>
</svg>`);
}

/** Scale illustration into a fixed zone — fit inside, centered, never crop. */
async function centerInCanvas(jpeg: Buffer, width: number, height: number): Promise<Buffer> {
  const resized = await sharp(jpeg)
    .resize(width, height, { fit: "inside", background: CREAM })
    .toBuffer();
  const meta = await sharp(resized).metadata();
  const w = meta.width ?? width;
  const h = meta.height ?? height;
  return sharp({
    create: { width, height, channels: 3, background: CREAM },
  })
    .composite([
      {
        input: resized,
        left: Math.round((width - w) / 2),
        top: Math.round((height - h) / 2),
      },
    ])
    .jpeg({ quality: 88 })
    .toBuffer();
}

async function fitIllustration(illustrationJpeg: Buffer): Promise<Buffer> {
  return centerInCanvas(illustrationJpeg, SIZE, MAX_ART_H);
}

async function compositePage(opts: {
  illustrationJpeg: Buffer;
  text: string;
  pageNum: number;
}): Promise<Buffer> {
  const art = await fitIllustration(opts.illustrationJpeg);
  const lines = wrapLines(opts.text);
  const svg = storyTextSvg(lines, opts.pageNum, MIN_TEXT_H);
  const textBand = await sharp(svg).png().toBuffer();

  return sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: CREAM },
  })
    .composite([
      { input: art, top: 0, left: 0 },
      { input: textBand, top: MAX_ART_H, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

const COVER_BAR_H = 180;

function coverTitleSvg(): Buffer {
  const titleLines = wrapLines(DEMO.title, 26).slice(0, 2);
  const titleSize = 34;
  const lineH = 42;
  const blockH = titleLines.length * lineH;
  const titleY = Math.round(COVER_BAR_H * 0.42 - blockH / 2 + titleSize * 0.82);
  const tspans = titleLines
    .map(
      (ln, i) =>
        `<tspan x="512" dy="${i === 0 ? 0 : lineH}" text-anchor="middle">${escapeXml(ln)}</tspan>`,
    )
    .join("");

  return Buffer.from(`<svg width="${SIZE}" height="${COVER_BAR_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#4A2545"/>
  <rect y="0" width="100%" height="3" fill="#E8B84A"/>
  <text
    x="512"
    y="${titleY}"
    text-anchor="middle"
    font-family="Georgia, 'Palatino Linotype', 'Times New Roman', serif"
    font-size="${titleSize}"
    font-weight="bold"
    fill="#FFF6E5"
  >${tspans}</text>
  <text x="512" y="${COVER_BAR_H - 44}" text-anchor="middle" font-family="Georgia, serif" font-size="16" fill="#E8B84A">A Sparky Studio story</text>
  <text x="512" y="${COVER_BAR_H - 18}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#FAEACA">Inklings · inklings.shop</text>
</svg>`);
}

async function compositeCover(illustrationJpeg: Buffer): Promise<Buffer> {
  const artH = SIZE - COVER_BAR_H;
  const art = await centerInCanvas(illustrationJpeg, SIZE, artH);

  const bar = await sharp(coverTitleSvg()).png().toBuffer();

  return sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: CREAM },
  })
    .composite([
      { input: art, top: 0, left: 0 },
      { input: bar, top: artH, left: 0 },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function saveIllustration(n: number, jpeg: Buffer): Promise<void> {
  const illPath = path.join(OUT_DIR, `ill-${String(n).padStart(2, "0")}.jpg`);
  await writeFile(illPath, jpeg);
}

/** Raw illustration must be full uncropped source — reject legacy 660px extracts. */
async function assertFullIllustration(jpeg: Buffer, label: string): Promise<void> {
  const meta = await sharp(jpeg).metadata();
  const h = meta.height ?? 0;
  if (h < 700) {
    throw new Error(
      `${label} is only ${meta.width}x${h}px — looks like a cropped extract. Regenerate with --force.`,
    );
  }
}

async function loadIllustration(n: number): Promise<Buffer> {
  const illPath = path.join(OUT_DIR, `ill-${String(n).padStart(2, "0")}.jpg`);
  if (!(await fileExists(illPath))) {
    throw new Error(`Missing raw illustration ill-${String(n).padStart(2, "0")}.jpg — run with --force`);
  }
  const bytes = await readFile(illPath);
  await assertFullIllustration(bytes, illPath);
  return bytes;
}

async function loadCoverIllustration(): Promise<Buffer> {
  const illCover = path.join(OUT_DIR, "ill-cover.jpg");
  if (await fileExists(illCover)) {
    const bytes = await readFile(illCover);
    await assertFullIllustration(bytes, illCover);
    return bytes;
  }
  throw new Error("Missing ill-cover.jpg — run with --force");
}

async function main() {
  const force = process.argv.includes("--force");
  const recomposite = process.argv.includes("--recomposite");
  await mkdir(OUT_DIR, { recursive: true });

  const seed = seedFromImageSeed(DEMO.seedKey);
  const manifestPages: Array<{ n: number; file: string; text: string }> = [];
  const coverPath = `/images/showcase/${DEMO.slug}/cover.jpg`;

  console.log(
    `Building showcase: ${DEMO.title} (seed ${seed})${force ? " [force]" : ""}${recomposite ? " [recomposite]" : ""}`,
  );

  for (let i = 0; i < DEMO.pages.length; i++) {
    const page = DEMO.pages[i]!;
    const n = i + 1;
    const filename = `page-${String(n).padStart(2, "0")}.jpg`;
    const outPath = path.join(OUT_DIR, filename);
    const publicPath = `/images/showcase/${DEMO.slug}/${filename}`;

    if (recomposite && !force) {
      console.log(`  recompositing ${filename}…`);
      const illBytes = await loadIllustration(n);
      await writeFile(
        outPath,
        await compositePage({ illustrationJpeg: illBytes, text: page.text, pageNum: n }),
      );
      manifestPages.push({ n, file: publicPath, text: page.text });
      continue;
    }

    if (!force && (await fileExists(outPath))) {
      console.log(`  skip ${filename} (exists)`);
      manifestPages.push({ n, file: publicPath, text: page.text });
      continue;
    }

    console.log(`  generating illustration ${n}/${DEMO.pages.length}…`);
    const gen = await generatePreview(page.prompt, seed + i);
    if (!gen.ok) {
      console.error(`  FAILED page ${n}: ${gen.error}`);
      process.exit(1);
    }

    const illPath = path.join(process.cwd(), "public", gen.url.replace(/^\//, ""));
    const illBytes = await readFile(illPath);
    await saveIllustration(n, illBytes);
    const composite = await compositePage({
      illustrationJpeg: illBytes,
      text: page.text,
      pageNum: n,
    });
    await writeFile(outPath, composite);
    console.log(`  wrote ${filename}`);
    manifestPages.push({ n, file: publicPath, text: page.text });

    if (i === 0 || i === 3) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  const coverOut = path.join(OUT_DIR, "cover.jpg");
  if (recomposite && !force) {
    console.log("  recompositing cover.jpg…");
    const illBytes = await loadCoverIllustration();
    await writeFile(coverOut, await compositeCover(illBytes));
    console.log("  wrote cover.jpg");
  } else if (force || !(await fileExists(coverOut))) {
    const heroGen = await generatePreview(
      "Coral fox Milo and golden puppy Pip sitting together on a hill under stars, magical storybook cover art, warm watercolor, no text",
      seed,
    );
    if (!heroGen.ok) {
      console.error("cover gen failed:", heroGen.error);
      process.exit(1);
    }
    const illPath = path.join(process.cwd(), "public", heroGen.url.replace(/^\//, ""));
    const illBytes = await readFile(illPath);
    await writeFile(path.join(OUT_DIR, "ill-cover.jpg"), illBytes);
    await writeFile(coverOut, await compositeCover(illBytes));
    console.log("  wrote cover.jpg");
  }

  const manifest = {
    slug: DEMO.slug,
    title: DEMO.title,
    childName: DEMO.childName,
    builtAt: new Date().toISOString(),
    cover: coverPath,
    pages: manifestPages,
  };

  const manifestPath = path.join(process.cwd(), "public", "images", "showcase", "manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("Done.", manifestPath);
  console.log(`Pages: ${manifestPages.length}, cover: ${coverPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
