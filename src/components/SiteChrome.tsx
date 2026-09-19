"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCtaBar, StickyCtaSpacer } from "@/components/StickyCtaBar";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Bare layout for product surfaces only — no marketing chrome. Login and the
  // password-reset pages keep the header/footer so users are never stranded.
  const bare = pathname?.startsWith("/portal") || pathname?.startsWith("/studio");

  return (
    <>
      {!bare && <Header />}
      {children}
      {!bare && <Footer />}
      {!bare && <StickyCtaSpacer />}
      {!bare && <StickyCtaBar />}
    </>
  );
}
