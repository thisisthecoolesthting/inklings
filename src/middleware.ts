import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionTokenEdge } from "@/lib/session";
import { getSiteUrl } from "@/lib/site-url";
import { GROWNUP_COOKIE, KID_MODE_COOKIE } from "@/lib/grownup-gate";

export async function middleware(req: NextRequest) {
  const secret = process.env.INK_SESSION_SECRET ?? process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    return NextResponse.redirect(new URL("/login?error=server", getSiteUrl()));
  }

  const token = req.cookies.get("ink_session")?.value;
  if (!token) {
    const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(next)}`, getSiteUrl()),
    );
  }

  const claims = await verifySessionTokenEdge(token, secret);
  if (!claims) {
    const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(next)}`, getSiteUrl()),
    );
  }

  const pathname = req.nextUrl.pathname;
  const isKidSurface = pathname.startsWith("/studio") || pathname.startsWith("/library");
  const isPortal = pathname.startsWith("/portal");
  const isGrownupPage = pathname.startsWith("/grownup");

  const kidMode = req.cookies.get(KID_MODE_COOKIE)?.value === "1";
  const grownupOk = req.cookies.get(GROWNUP_COOKIE)?.value === "1";

  if (isPortal && kidMode && !grownupOk && !isGrownupPage) {
    return NextResponse.redirect(new URL("/grownup", getSiteUrl()));
  }

  const res = NextResponse.next();

  if (isPortal && grownupOk) {
    res.cookies.delete(KID_MODE_COOKIE);
  }

  if (isKidSurface) {
    res.cookies.set(KID_MODE_COOKIE, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    res.cookies.delete(GROWNUP_COOKIE);
  }

  return res;
}

export const config = {
  matcher: ["/portal/:path*", "/studio/:path*", "/library/:path*"],
};
