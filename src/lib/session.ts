import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const COOKIE = "ink_session";

export type SessionClaims = {
  userId: string;
  email: string;
  tier: string; // free | premium
};

function getSecret(): Uint8Array {
  const s = process.env.INK_SESSION_SECRET ?? process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error("INK_SESSION_SECRET (or JWT_SECRET) must be set, min 16 chars");
  }
  return new TextEncoder().encode(s);
}

export async function signSessionToken(claims: SessionClaims, ttlDays = 30): Promise<string> {
  return new SignJWT({ email: claims.email, tier: claims.tier })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.userId)
    .setIssuedAt()
    .setExpirationTime(`${ttlDays}d`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    const p = payload as JWTPayload & Record<string, unknown>;
    const userId = typeof p.sub === "string" ? p.sub : null;
    const email = typeof p.email === "string" ? p.email : null;
    const tier = typeof p.tier === "string" ? p.tier : "free";
    if (!userId || !email) return null;
    return { userId, email, tier };
  } catch { return null; }
}

/** Edge-safe verify for middleware (no Node crypto) */
export async function verifySessionTokenEdge(token: string, secret: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
    const p = payload as JWTPayload & Record<string, unknown>;
    const userId = typeof p.sub === "string" ? p.sub : null;
    const email = typeof p.email === "string" ? p.email : null;
    const tier = typeof p.tier === "string" ? p.tier : "free";
    if (!userId || !email) return null;
    return { userId, email, tier };
  } catch { return null; }
}

export async function getSession(): Promise<SessionClaims | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  return verifySessionToken(raw);
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
