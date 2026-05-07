import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { getSiteUrl } from "@/lib/site-url";

const KIND = "ink_magic";

function getSecret(): Uint8Array {
  const s = process.env.INK_SESSION_SECRET ?? process.env.JWT_SECRET;
  if (!s || s.length < 16) throw new Error("INK_SESSION_SECRET must be set, min 16 chars");
  return new TextEncoder().encode(s);
}

export async function signMagicLinkToken(userId: string, email: string, ttlMinutes = 30): Promise<string> {
  return new SignJWT({ kind: KIND, email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${ttlMinutes}m`)
    .sign(getSecret());
}

export async function verifyMagicLinkToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    const p = payload as JWTPayload & Record<string, unknown>;
    if (p.kind !== KIND) return null;
    const userId = typeof p.sub === "string" ? p.sub : null;
    const email = typeof p.email === "string" ? p.email : null;
    if (!userId || !email) return null;
    return { userId, email };
  } catch { return null; }
}

export function buildMagicLinkUrl(token: string, next?: string): string {
  const base = getSiteUrl();
  const url = new URL("/api/auth/verify", base);
  url.searchParams.set("token", token);
  if (next) url.searchParams.set("next", next);
  return url.toString();
}
