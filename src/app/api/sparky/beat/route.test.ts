import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const getSession = vi.fn();
vi.mock("@/lib/session", () => ({ getSession: () => getSession() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { usageEvent: { count: vi.fn().mockResolvedValue(0), create: vi.fn().mockResolvedValue({}) } },
}));
const askSparky = vi.fn();
vi.mock("@/lib/sparky", () => ({ askSparky: (...a: unknown[]) => askSparky(...a) }));
vi.mock("@/lib/image-gen", () => ({
  generatePreview: vi.fn().mockResolvedValue({ ok: false, error: "test" }),
  seedFromImageSeed: () => 1,
}));

import { POST } from "./route";

function req(body: unknown, ip = "203.0.113.9") {
  return new NextRequest("http://localhost/api/sparky/beat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/sparky/beat", () => {
  beforeEach(() => {
    getSession.mockReset();
    askSparky.mockReset();
  });

  it("returns 401 without a session and never calls the LLM", async () => {
    getSession.mockResolvedValue(null);
    const res = await POST(req({ beatId: "x", choiceId: "y" }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "unauthorized" });
    expect(askSparky).not.toHaveBeenCalled();
  });

  it("returns 400 (not 500) on malformed JSON for a signed-in parent", async () => {
    getSession.mockResolvedValue({ userId: "u-badjson", email: "a@b.c", tier: "free" });
    const res = await POST(req("{not json"));
    expect(res.status).toBe(400);
  });

  it("rate limits a single user after 60 beats in the window", async () => {
    getSession.mockResolvedValue({ userId: "u-burst", email: "a@b.c", tier: "free" });
    let last = 0;
    for (let i = 0; i < 61; i++) {
      // Distinct IPs so only the per-user bucket trips.
      const res = await POST(req({ nope: true }, `198.51.100.${i % 200}`));
      last = res.status;
      if (i < 60) expect(res.status).toBe(400);
    }
    expect(last).toBe(429);
  });
});
