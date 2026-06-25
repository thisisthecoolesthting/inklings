import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { KidShell } from "@/components/studio/KidShell";

export default async function LibraryLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/library");
  return <KidShell>{children}</KidShell>;
}
