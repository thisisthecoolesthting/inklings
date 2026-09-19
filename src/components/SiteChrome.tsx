"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Bare layout for product surfaces — no marketing chrome. /login keeps the
  // header/footer so users aren't stranded with only the browser back button.
  const bare =
    pathname?.startsWith("/portal") ||
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/reset-password");

  return (
    <>
      {!bare && <Header />}
      {children}
      {!bare && <Footer />}
    </>
  );
}
