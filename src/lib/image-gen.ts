/**
 * TogetherAI Flux image pipeline (dispatch 004).
 *
 * Two surfaces:
 *  - generatePreview(prompt, seed) — fast 512x512 schnell, used during
 *    /api/sparky/beat so the kid sees an illustration alongside the text.
 *  - generateHd(prompt, seed) — higher quality, used after parent approves
 *    the page in /portal/approvals (follow-up dispatch wires the trigger).
 *
 * Storage: writes JPEG bytes to public/uploads/<bucket>/<id>.jpg, returns
 * the public URL (`/uploads/<bucket>/<id>.jpg`). Caddy serves from public/
 * directly — no Supabase or S3 dependency.
 *
 * Quota guard lives in the calling API route (UsageEvent counters).
 */
import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TOGETHER_URL = "https://api.together.xyz/v1/images/generations";

const PUBLIC_UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

export interface GenResult {
  ok: true;
  url: string;
  width: number;
  height: number;
  bytes: number;
  seed: number;
}
export interface GenError { ok: false; error: string }

async function callTogether(opts: {
  prompt: string;
  width: number;
  height: number;
  steps: number;
  seed: number;
  model?: string;
}): Promise<{ url: string; seed: number } | { error: string }> {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) return { error: "no_api_key" };
  const model = opts.model ?? process.env.TOGETHER_IMAGE_MODEL ?? "black-forest-labs/FLUX.1-schnell";
  try {
    const res = await fetch(TOGETHER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: opts.prompt,
        width: opts.width,
        height: opts.height,
        steps: opts.steps,
        seed: opts.seed,
        n: 1,
        response_format: "url",
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return { error: `together_${res.status}_${t.slice(0, 100)}` };
    }
    const json = (await res.json()) as { data?: Array<{ url?: string }>; error?: { message?: string } };
    const url = json.data?.[0]?.url;
    if (!url) return { error: `no_url_in_response_${JSON.stringify(json).slice(0, 80)}` };
    return { url, seed: opts.seed };
  } catch (e) {
    return { error: `fetch_exception_${(e as Error).message.slice(0, 60)}` };
  }
}

async function downloadAndStore(remoteUrl: string, bucket: string): Promise<{ localUrl: string; bytes: number }> {
  const res = await fetch(remoteUrl);
  if (!res.ok) throw new Error(`download_${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const id = crypto.randomBytes(12).toString("hex");
  const dir = path.join(PUBLIC_UPLOADS_ROOT, bucket);
  await mkdir(dir, { recursive: true });
  const filename = `${id}.jpg`;
  const filepath = path.join(dir, filename);
  await writeFile(filepath, buf);
  return { localUrl: `/uploads/${bucket}/${filename}`, bytes: buf.length };
}

/** Preview: 512x512 schnell, ~$0.0027/image, ~3s. Used in /api/sparky/beat. */
export async function generatePreview(prompt: string, seed?: number): Promise<GenResult | GenError> {
  const s = seed ?? Math.floor(Math.random() * 0x7fffffff);
  const live = await callTogether({ prompt, width: 512, height: 512, steps: 4, seed: s });
  if ("error" in live) return { ok: false, error: live.error };
  try {
    const { localUrl, bytes } = await downloadAndStore(live.url, "preview");
    return { ok: true, url: localUrl, width: 512, height: 512, bytes, seed: s };
  } catch (e) {
    return { ok: false, error: `store_${(e as Error).message.slice(0, 60)}` };
  }
}

/** HD: 1024x1024 schnell. Used after parent approves a page. */
export async function generateHd(prompt: string, seed?: number): Promise<GenResult | GenError> {
  const s = seed ?? Math.floor(Math.random() * 0x7fffffff);
  const live = await callTogether({ prompt, width: 1024, height: 1024, steps: 4, seed: s });
  if ("error" in live) return { ok: false, error: live.error };
  try {
    const { localUrl, bytes } = await downloadAndStore(live.url, "hd");
    return { ok: true, url: localUrl, width: 1024, height: 1024, bytes, seed: s };
  } catch (e) {
    return { ok: false, error: `store_${(e as Error).message.slice(0, 60)}` };
  }
}

/** Deterministic numeric seed from a Character Bible image-seed string. */
export function seedFromImageSeed(s: string | null | undefined): number {
  if (!s) return Math.floor(Math.random() * 0x7fffffff);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  return h || 1;
}
