import { NextResponse } from "next/server";
import { unlockGrownupMode } from "@/lib/grownup-gate";
import { getSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 });
  await unlockGrownupMode();
  return NextResponse.json({ ok: true });
}
