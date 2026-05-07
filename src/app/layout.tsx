import type { Metadata, Viewport } from "next";
import "./globals.css";
import { brand } from "@/lib/brand";
import { SiteChrome } from "@/components/SiteChrome";
import { OrganizationJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: `${brand.name} — Your child stars in their own storybook`,
  description:
    "Inklings turns your child's imagined characters and worlds into a beautifully illustrated children's book. Voice-first, ages 4 to 8, parent-approved before anything publishes. Print real keepsake books.",
  applicationName: brand.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://inklings.shop"),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} — Your child stars in their own storybook`,
    description:
      "AI-guided storybook studio for kids ages 4 to 8. Voice-first, parent-approved, real printed children's books.",
    url: "/",
    images: [{ url: "/images/site/og-default.svg", alt: `${brand.name} — A storybook your child stars in` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Storybooks your child stars in`,
    description:
      "Voice-first storybook studio for kids 4-8. Parent-approved, real printed books.",
    images: ["/images/site/og-default.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF6E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <OrganizationJsonLd />
        <SiteChrome>
          <main className="flex-1">{children}</main>
        </SiteChrome>
      </body>
    </html>
  );
}
