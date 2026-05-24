import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";
import { getSiteUrl } from "@/lib/site-url";

export async function POST() { await clearSessionCookie(); return NextResponse.redirect(new URL(\"/\", getSiteUrl()), { status: 303 }); }
export async function GET()  { await clearSessionCookie(); return NextResponse.redirect(new URL(\"/\", getSiteUrl()), { status: 303 }); }
