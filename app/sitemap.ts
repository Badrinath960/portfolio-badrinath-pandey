import type { MetadataRoute } from "next";
import { getOrigin, siteUrl } from "@/lib/config";
export const dynamic = "force-static";
import { listProjects } from "@/lib/content/provider";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getOrigin();
  if (!origin) return [];
  return [
    "",
    "/resume",
    ...listProjects()
      .filter((p) => p.publication === "published")
      .map((p) => `/work/${p.slug}`),
  ].map((path) => ({ url: siteUrl(path + "/") }));
}
