"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * GA4 loader. Analytics run on the marketing site and parent pages only, never inside
 * child-facing surfaces (the Studio, the kid Library, and the grown-up hold-to-unlock gate
 * that a child may be looking at).
 */
const CHILD_SURFACE_PREFIXES = ["/studio", "/library", "/grownup"];

export function isChildSurface(pathname: string | null): boolean {
  if (!pathname) return false;
  return CHILD_SURFACE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const blocked = isChildSurface(pathname);

  // If gtag was loaded on an earlier page (client-side navigation into the Studio), GA's
  // documented opt-out flag stops it from sending anything while a child surface is shown.
  useEffect(() => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = blocked;
  }, [blocked, gaId]);

  if (blocked) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', { anonymize_ip: true });
      `}</Script>
    </>
  );
}
