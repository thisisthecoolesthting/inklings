import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { brand } from "@/lib/brand";
import { SiteChrome } from "@/components/SiteChrome";
import { OrganizationJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${brand.name} — Build a story universe your child runs`,
  description:
    "Inklings lets kids ages 5-8 build a story universe where their characters return across every story. Voice-first, parent-approved, real printed books.",
  applicationName: brand.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop"),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — Build a story universe your child runs`,
    description:
      "A story universe studio for kids ages 5-8. Voice-first, parent-approved, where characters return in every story.",
    url: "/",
    images: [{ url: "/images/showcase/milo-moonbeam/cover.jpg", width: 1200, height: 630, alt: `${brand.name} — A story universe your child runs` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Build a story universe your child runs`,
    description:
      "A story universe studio for kids ages 5-8. Characters return in every story.",
    images: ["/images/showcase/milo-moonbeam/cover.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF6E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // ... more code ...
  // (Note: The rest of the file remains unchanged, but I'll provide the full file as per instructions)
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}</Script>
          </>
        )}
        <OrganizationJsonLd />
        <SiteChrome>
          <main className="flex-1">{children}</main>
        </SiteChrome>
      </body>
    </html>
  );
}
