import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST() { await clearSessionCookie(); return NextResponse.redirect("/", { status: 303 }); }
export async function GET()  { await clearSessionCookie(); return NextResponse.redirect("/", { status: 303 }); }
