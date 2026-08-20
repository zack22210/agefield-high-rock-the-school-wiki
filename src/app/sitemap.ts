import type { MetadataRoute } from "next";
import { getAllContentPaths } from "@/lib/content";
import { CONTENT_TYPES } from "@/config/navigation";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.agefieldhighrocktheschool.online").replace(/\/$/, "");

  // Static paths that always exist
  const staticPaths = ["/", "/privacy-policy", "/terms-of-service", "/copyright", "/about", ...CONTENT_TYPES.map((ct) => `/${ct}`)];

  const entries = await Promise.all(routing.locales.map(async (locale) => {
    const contentPaths = await getAllContentPaths(locale);
    const dynamicPaths = contentPaths.map((item) => `/${[item.contentType, ...item.slug].join("/")}`);
    const paths = [...staticPaths, ...dynamicPaths];
    return paths.map((path) => ({
      url: `${siteUrl}${locale === "en" ? "" : `/${locale}`}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : path === "/guide" ? 0.9 : 0.6,
    }));
  }));

  return entries.flat();
}
