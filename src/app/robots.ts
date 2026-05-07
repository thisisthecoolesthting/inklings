import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/portal", "/studio", "/api"] },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
