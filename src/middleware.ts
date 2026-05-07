import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionTokenEdge } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const secret = process.env.INK_SESSION_SECRET ?? process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    return NextResponse.redirect(new URL("/login?error=server", req.url));
  }

  const token = req.cookies.get("ink_session")?.value;
  if (!token) {
    const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(next)}`, req.url),
    );
  }

  const claims = await verifySessionTokenEdge(token, secret);
  if (!claims) {
    const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(next)}`, req.url),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/studio/:path*"],
};
