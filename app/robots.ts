import type { MetadataRoute } from "next";
import { getOrigin, siteUrl } from "@/lib/config";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  const origin = getOrigin();
  return {
    rules: { userAgent: "*", ...(origin ? { allow: "/" } : { disallow: "/" }) },
    ...(origin ? { sitemap: siteUrl("/sitemap.xml") } : {}),
  };
}
