import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

/**
 * Studio is gated by the parent's session — middleware already redirects
 * to /login if there's no ink_session cookie. Inside the studio the URL
 * carries ?child=<childId> so a parent can launch the right child profile.
 */
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/studio");
  return (
    <div className="min-h-screen bg-cream-100">
      {children}
    </div>
  );
}
