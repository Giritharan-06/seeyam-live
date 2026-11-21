import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { defaultRobots, privateCrawlPaths } from "@/lib/seo-fields";
import { readSeo } from "@/lib/seo-store";

export const revalidate = 30;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = (await readSeo())?.robots || defaultRobots;
  return {
    rules: {
      userAgent: "*",
      allow: settings.allow.filter(path => !privateCrawlPaths.some(privatePath => path.startsWith(privatePath))),
      disallow: [...new Set([...privateCrawlPaths, ...settings.disallow])],
    },
    sitemap: settings.advertiseSitemap ? absoluteUrl("/sitemap.xml") : undefined,
  };
}
