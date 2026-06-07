/**
 * Tiny in-memory sliding-window rate limiter.
 *
 * Process-local (resets on deploy, not shared across instances) — adequate for
 * a single-PM2-process Next.js app behind one Caddy node. For multi-instance
 * scale, swap the Map for Redis with the same interface.
 *
 * Usage:
 *   const rl = rateLimit(req, { key: "login", limit: 10, windowMs: 60_000 });
 *   if (!rl.ok) return tooMany(rl.retryAfter);
 */
import type { NextRequest } from "next/server";

type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

// Opportunistic cleanup so the Map can't grow unbounded.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
}

export function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export interface RateLimitOptions {
  key: string; // logical bucket name, e.g. "login"
  limit: number; // max hits per window
  windowMs: number; // window length in ms
  id?: string; // identity (defaults to client IP)
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfter: number; // seconds until window reset
}

export function rateLimit(req: NextRequest, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const id = opts.id ?? clientIp(req);
  const bucketKey = `${opts.key}:${id}`;
  const existing = buckets.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, retryAfter: 0 };
  }

  existing.count += 1;
  const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
  if (existing.count > opts.limit) {
    return { ok: false, remaining: 0, retryAfter };
  }
  return { ok: true, remaining: opts.limit - existing.count, retryAfter };
}
