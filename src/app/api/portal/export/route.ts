import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(
      new URL("/login?next=/portal/settings", getSiteUrl()),
    );
  }

  const data = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      children: {
        include: {
          characters: true,
          worlds: true,
          series: true,
          books: {
            include: {
              pages: true,
            },
          },
        },
      },
      orders: true,
    },
  });

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="inklings-data-export-${session.userId}.json"`,
    },
  });
}
