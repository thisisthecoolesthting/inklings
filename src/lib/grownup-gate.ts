import { cookies } from "next/headers";

export const KID_MODE_COOKIE = "ink_kid_mode";
export const GROWNUP_COOKIE = "ink_grownup_ok";

export async function isKidMode(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(KID_MODE_COOKIE)?.value === "1";
}

export async function isGrownupUnlocked(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(GROWNUP_COOKIE)?.value === "1";
}

export async function enterKidMode() {
  const jar = await cookies();
  jar.set(KID_MODE_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  jar.delete(GROWNUP_COOKIE);
}

export async function unlockGrownupMode() {
  const jar = await cookies();
  jar.set(GROWNUP_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  jar.delete(KID_MODE_COOKIE);
}

export async function unlockGrownupOnLogin() {
  const jar = await cookies();
  jar.set(GROWNUP_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  jar.delete(KID_MODE_COOKIE);
}
