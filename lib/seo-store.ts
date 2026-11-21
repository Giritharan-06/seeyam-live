import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { hasValidDatabaseUrl, prisma } from "./db";
import { robotsFields, seoFields, type RobotsFields, type SeoFields } from "./seo-fields";

export const seoCacheTag = "seeyam-seo";
export type SeoSettings = {
  pages: Array<{ path: string; fields: SeoFields; updatedAt: string }>;
  robots: RobotsFields | null;
};

const loadSettings = unstable_cache(async (): Promise<SeoSettings> => {
  const rows = await prisma.$queryRaw<Array<{ key: string; value: unknown; updated_at: Date }>>`
    SELECT key, value, updated_at FROM public.seo_settings ORDER BY key
  `;
  const result: SeoSettings = { pages: [], robots: null };
  for (const row of rows) {
    if (row.key === "robots") result.robots = robotsFields.parse(row.value);
    else result.pages.push({ path: row.key, fields: seoFields.parse(row.value), updatedAt: row.updated_at.toISOString() });
  }
  return result;
}, ["neon-seo-settings-v1"], { tags: [seoCacheTag], revalidate: 30 });

export const readSeo = cache(async (): Promise<SeoSettings | null> => {
  if (!hasValidDatabaseUrl) return null;
  try { return await loadSettings(); } catch { return null; }
});

export async function writeSeo(change: { path: string; fields: SeoFields } | { robots: RobotsFields }) {
  const key = "path" in change ? change.path : "robots";
  const json = JSON.stringify("fields" in change ? change.fields : change.robots);
  await prisma.$executeRaw`
    INSERT INTO public.seo_settings (key, value) VALUES (${key}, ${json}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}
