"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Bare layout for product surfaces and auth flows — no marketing chrome.
  const bare =
    pathname?.startsWith("/portal") ||
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/login") ||
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
