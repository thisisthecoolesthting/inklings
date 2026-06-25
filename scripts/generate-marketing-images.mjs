#!/usr/bin/env node
/**
 * Generate Inklings marketing photos via Together FLUX.
 * Run on VPS: cd /var/www/inklings && node scripts/generate-marketing-images.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "images", "marketing");

const STYLE =
  "warm natural light, soft cream and coral accents, professional product photography, " +
  "wholesome family-friendly, high quality, no text, no logos, no watermarks";

const SHOTS = [
  {
    file: "print-hardcover.jpg",
    width: 768,
    height: 1024,
    prompt:
      `${STYLE}. Close-up of a beautiful 8.5 inch square hardcover children's storybook on a wooden table, ` +
      "cream cover with colorful watercolor illustration of a fox and puppy in a meadow, soft window light, shallow depth of field.",
  },
  {
    file: "child-holding-book.jpg",
    width: 768,
    height: 1024,
    prompt:
      `${STYLE}. View from behind a 7-year-old child with curly hair holding a hardcover storybook they made, ` +
      "cozy living room, proud moment, book cover shows whimsical animal characters, face not visible.",
  },
  {
    file: "open-storybook-pages.jpg",
    width: 1024,
    height: 768,
    prompt:
      `${STYLE}. Open children's storybook flat lay showing two illustrated pages, watercolor gouache art of ` +
      "magical forest adventure, warm pastel palette, hands turning pages at edge of frame.",
  },
  {
    file: "kid-creating-tablet.jpg",
    width: 1024,
    height: 768,
    prompt:
      `${STYLE}. Child age 6-7 at a tablet creating a story, colorful friendly UI glow, sparkles, ` +
      "storybook illustrations floating above screen, side angle, cozy bedroom, creative and joyful.",
  },
];

async function loadEnv() {
  try {
    const raw = await fs.readFile(path.join(ROOT, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* optional */
  }
}

async function generateOne(shot) {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) throw new Error("TOGETHER_API_KEY missing");

  const model = process.env.TOGETHER_IMAGE_MODEL ?? "black-forest-labs/FLUX.1.1-pro";
  console.log(`Generating ${shot.file} (${model})…`);

  const body = JSON.stringify({
    model,
    prompt: shot.prompt,
    width: shot.width,
    height: shot.height,
    n: 1,
    steps: 4,
  });

  let lastErr = "";
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body,
    });

    if (res.status === 429) {
      const wait = attempt * 15;
      console.log(`  rate limited — waiting ${wait}s (attempt ${attempt}/5)`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }

    if (!res.ok) {
      lastErr = await res.text();
      throw new Error(`Together ${res.status}: ${lastErr.slice(0, 200)}`);
    }

    const json = await res.json();
    const url = json.data?.[0]?.url;
    if (!url) throw new Error("No image URL in response");

    const imgRes = await fetch(url);
    if (!imgRes.ok) throw new Error(`Download failed ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());

    await fs.mkdir(OUT, { recursive: true });
    const outPath = path.join(OUT, shot.file);
    await fs.writeFile(outPath, buf);
    console.log(`  ✓ ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
    return;
  }
  throw new Error(`Rate limit exhausted: ${lastErr.slice(0, 120)}`);
}

await loadEnv();
console.log("Output:", OUT);
for (const shot of SHOTS) {
  const outPath = path.join(OUT, shot.file);
  try {
    await fs.access(outPath);
    console.log(`Skip ${shot.file} (exists)`);
    continue;
  } catch {
    /* generate */
  }
  try {
    await generateOne(shot);
    await new Promise((r) => setTimeout(r, 12000));
  } catch (e) {
    console.error(`  ✗ ${shot.file}:`, e.message);
  }
}
console.log("Done.");
