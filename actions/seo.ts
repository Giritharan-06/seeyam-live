"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSession, hasSecureAdminConfiguration } from "@/lib/auth";
import { publicPath, robotsFields, seoFields } from "@/lib/seo-fields";
import { getSeoTargets } from "@/lib/seo";
import { seoCacheTag, writeSeo } from "@/lib/seo-store";

async function canSave() {
  return hasSecureAdminConfiguration && (await getSession())?.role === "ADMIN";
}

export async function savePageSeo(path: string, input: unknown) {
  if (!(await canSave())) return { message: "A securely configured administrator session is required." };
  const fields = seoFields.safeParse(input);
  if (!publicPath.safeParse(path).success || !fields.success) {
    return { message: fields.success ? "Choose a public page." : fields.error.issues[0].message };
  }

  try {
    if (!(await getSeoTargets()).some(target => target.path === path)) return { message: "That public page is no longer available." };
    await writeSeo({ path, fields: fields.data });
    revalidateTag(seoCacheTag);
    revalidatePath(path);
    revalidatePath("/sitemap.xml");
    return { success: true, message: "SEO settings saved." };
  } catch {
    return { message: "SEO settings could not be saved. Check the database connection and try again." };
  }
}

export async function saveRobotsSeo(input: unknown) {
  if (!(await canSave())) return { message: "A securely configured administrator session is required." };
  const robots = robotsFields.safeParse(input);
  if (!robots.success) return { message: "Enter up to 50 valid site-relative paths per list, one path per line." };
  try {
    await writeSeo({ robots: robots.data });
    revalidateTag(seoCacheTag);
    revalidatePath("/robots.txt");
    return { success: true, message: "Crawl rules saved." };
  } catch {
    return { message: "Crawl rules could not be saved. Check the database connection and try again." };
  }
}
