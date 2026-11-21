import type { MetadataRoute } from "next";
import { absoluteUrl, getSeoTargets, siteOrigin } from "@/lib/seo";
import { isSitemapEligible } from "@/lib/seo-fields";
import { readSeo } from "@/lib/seo-store";

export const revalidate = 30;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [targets, saved] = await Promise.all([getSeoTargets(), readSeo()]);
  const records = new Map(saved?.pages.map(record => [record.path, record]));
  return targets.flatMap(target => {
    const entry = records.get(target.path);
    const url = absoluteUrl(target.path);
    if (!isSitemapEligible(target.path, entry?.fields, siteOrigin)) return [];
    const modified = entry?.updatedAt || target.modified;
    return [{ url, lastModified: modified && Number.isFinite(Date.parse(modified)) ? modified : undefined }];
  });
}
