/**
 * Illustration pipeline — matches StoryFawn's providers:
 *   Primary: OpenRouter google/gemini-2.5-flash-image ("nano")
 *   Fallback: Together black-forest-labs/FLUX.1.1-pro ("flux")
 */
import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TOGETHER_URL = "https://api.together.xyz/v1/images/generations";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const NANO_MODEL = "google/gemini-2.5-flash-image";
const PUBLIC_UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

/** StoryFawn STYLE token — keep in sync with fulfillment-v2.js */
export const STORYBOOK_STYLE =
  "warm storybook watercolor and gouache illustration, soft golden light, " +
  "whimsical and tender, professional children's book art, highly detailed, " +
  "cohesive pastel palette, no text, no words, no letters, no captions";

export interface GenResult {
  ok: true;
  url: string;
  width: number;
  height: number;
  bytes: number;
  seed: number;
  provider: "nano" | "flux";
}
export interface GenError { ok: false; error: string }

function imageModel(): "nano" | "flux" {
  const m = (process.env.INKLINGS_IMAGE_MODEL ?? "nano").toLowerCase();
  return m === "flux" ? "flux" : "nano";
}

async function toJpeg(buf: Buffer, maxEdge = 1024): Promise<Buffer> {
  return sharp(buf)
    .rotate()
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
}

async function storeJpeg(jpeg: Buffer, bucket: string): Promise<{ localUrl: string; bytes: number }> {
  const id = crypto.randomBytes(12).toString("hex");
  const dir = path.join(PUBLIC_UPLOADS_ROOT, bucket);
  await mkdir(dir, { recursive: true });
  const filename = `${id}.jpg`;
  await writeFile(path.join(dir, filename), jpeg);
  return { localUrl: `/uploads/${bucket}/${filename}`, bytes: jpeg.length };
}

function extractNanoImage(json: unknown): Buffer {
  const url = (json as { choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }> })
    ?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!url) throw new Error("nano_no_image");
  const commaIdx = url.indexOf(",");
  if (commaIdx === -1) throw new Error("nano_bad_data_url");
  return Buffer.from(url.slice(commaIdx + 1), "base64");
}

async function genNano(prompt: string, referenceJpeg?: Buffer | null): Promise<Buffer> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("no_openrouter_key");

  const fullPrompt = `${STORYBOOK_STYLE}. ${prompt}`;

  let messageContent: unknown;
  if (referenceJpeg?.length) {
    messageContent = [
      { type: "text", text: fullPrompt },
      {
        type: "image_url",
        image_url: { url: `data:image/jpeg;base64,${referenceJpeg.toString("base64")}` },
      },
    ];
  } else {
    messageContent = fullPrompt;
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://inklings.shop",
      "X-Title": "Inklings",
    },
    body: JSON.stringify({
      model: NANO_MODEL,
      messages: [{ role: "user", content: messageContent }],
      modalities: ["image", "text"],
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`openrouter_${res.status}_${t.slice(0, 80)}`);
  }

  return extractNanoImage(await res.json());
}

async function genFlux(prompt: string, width: number, height: number): Promise<{ url: string }> {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) throw new Error("no_together_key");
  const model = process.env.TOGETHER_IMAGE_MODEL ?? "black-forest-labs/FLUX.1.1-pro";
  const fullPrompt = `${STORYBOOK_STYLE}. ${prompt}`;

  const res = await fetch(TOGETHER_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, prompt: fullPrompt, width, height, n: 1, steps: 4 }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`together_${res.status}_${t.slice(0, 80)}`);
  }
  const json = (await res.json()) as { data?: Array<{ url?: string }> };
  const url = json.data?.[0]?.url;
  if (!url) throw new Error("together_no_url");
  return { url };
}

async function downloadUrl(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download_${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function generateIllustration(
  prompt: string,
  opts: { width: number; height: number; bucket: string; seed: number; referencePath?: string | null },
): Promise<GenResult | GenError> {
  let referenceJpeg: Buffer | null = null;
  if (opts.referencePath) {
    try {
      const abs = path.join(process.cwd(), "public", opts.referencePath.replace(/^\//, ""));
      referenceJpeg = await toJpeg(await readFile(abs), 768);
    } catch {
      referenceJpeg = null;
    }
  }

  const prefer = imageModel();
  const attempts: Array<"nano" | "flux"> = prefer === "nano" ? ["nano", "flux"] : ["flux", "nano"];

  for (const provider of attempts) {
    try {
      let jpeg: Buffer;
      if (provider === "nano") {
        jpeg = await toJpeg(await genNano(prompt, referenceJpeg), Math.max(opts.width, opts.height));
      } else {
        const live = await genFlux(prompt, opts.width, opts.height);
        jpeg = await toJpeg(await downloadUrl(live.url), Math.max(opts.width, opts.height));
      }
      const { localUrl, bytes } = await storeJpeg(jpeg, opts.bucket);
      return {
        ok: true,
        url: localUrl,
        width: opts.width,
        height: opts.height,
        bytes,
        seed: opts.seed,
        provider,
      };
    } catch (e) {
      if (provider === attempts[attempts.length - 1]) {
        return { ok: false, error: (e as Error).message.slice(0, 120) };
      }
    }
  }
  return { ok: false, error: "all_providers_failed" };
}

export async function generatePreview(
  prompt: string,
  seed?: number,
  referencePath?: string | null,
): Promise<GenResult | GenError> {
  const s = seed ?? Math.floor(Math.random() * 0x7fffffff);
  return generateIllustration(prompt, { width: 768, height: 768, bucket: "preview", seed: s, referencePath });
}

export async function generateHd(
  prompt: string,
  seed?: number,
  referencePath?: string | null,
): Promise<GenResult | GenError> {
  const s = seed ?? Math.floor(Math.random() * 0x7fffffff);
  return generateIllustration(prompt, { width: 1024, height: 1024, bucket: "hd", seed: s, referencePath });
}

export function seedFromImageSeed(s: string | null | undefined): number {
  if (!s) return Math.floor(Math.random() * 0x7fffffff);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  return h || 1;
}

/** Wrap Sparky scene intent with StoryFawn-style scene grammar. */
export function buildScenePrompt(opts: {
  childName: string;
  characters: string;
  scene: string;
  worldName?: string | null;
}): string {
  const world = opts.worldName ? ` in ${opts.worldName}` : "";
  return (
    `${opts.childName}${world}, ${opts.scene}. ` +
    `Characters: ${opts.characters}. ` +
    "Focus on action and setting; keep characters consistent with prior pages."
  );
}
