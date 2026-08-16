import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { brand } from "@/lib/brand";
import { SiteChrome } from "@/components/SiteChrome";
import { OrganizationJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${brand.name} — Build a story universe your child runs`,
  description:
    "Inklings lets kids ages 4 and up build a story universe where their characters return across every story. Voice-first, parent-approved, real printed books.",
  applicationName: brand.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop"),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — Build a story universe your child runs`,
    description:
      "A story universe studio for kids ages 4 and up. Voice-first, parent-approved, where characters return in every story.",
    url: "/",
    images: [{ url: "/images/og.png", width: 1728, height: 909, alt: `${brand.name} — Their imagination. Bound forever.` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Build a story universe your child runs`,
    description:
      "A story universe studio for kids ages 4 and up. Characters return in every story.",
    images: ["/images/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF6E5",
  width: "device-width",
  initialScale: 1,
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#main-content" className="skip-link">Skip to main content</a>
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
          <main id="main-content" className="flex-1">{children}</main>
        </SiteChrome>
      </body>
    </html>
  );
}
