import "server-only";
import { unstable_cache } from "next/cache";
import { publicPath, seoFields } from "../seo-fields";
import { prisma } from "../db";
import { getSession, hasSecureAdminConfiguration } from "../auth";
import { parseSyllabusLines } from "../course-curriculum";
import {
  seoId,
  lines,
  mediaPath,
  validate,
  validKey,
  type Kind,
  type Values,
  type Item,
} from "./fields";
import type { Prisma } from "@prisma/client";

export async function cmsAdmin() {
  const user = await getSession();
  if (!hasSecureAdminConfiguration || user?.role !== "ADMIN")
    throw Error("Administrator sign-in required.");
  return user;
}
export const tag = "website-cms";
const load = unstable_cache(
  async () =>
    prisma.$queryRaw<
      Item[]
    >`SELECT kind,id,published AS values FROM cms_documents WHERE published IS NOT NULL OR withdrawn ORDER BY kind,id`,
  ["cms-live-v1"],
  { tags: [tag], revalidate: 60 },
);
export async function publishedItems() {
  try {
    return await load();
  } catch {
    return [];
  }
}
export type Document = {
  kind: Kind;
  id: string;
  draft: Values;
  published: Values | null;
  withdrawn: boolean;
  version: number;
};
export async function documents() {
  await cmsAdmin();
  return prisma.$queryRaw<
    Document[]
  >`SELECT kind,id,draft,published,withdrawn,version FROM cms_documents ORDER BY updated_at DESC`;
}
export async function history() {
  await cmsAdmin();
  return prisma.$queryRaw<
    { kind: string; id: string; action: string; version: number; at: string }[]
  >`SELECT kind,id,action,version,created_at::text AS at FROM cms_history ORDER BY event_id DESC LIMIT 30`;
}
export function modules(value: string) {
  return parseSyllabusLines(lines(value)).map(({ title, duration, topics }) => ({ title, duration, topics }));
}
async function writeRecord(
  tx: Prisma.TransactionClient,
  kind: Kind,
  id: string,
  v: Values,
) {
  if (kind === "seo") {
    const path = publicPath.parse(v.path);
    const parsed = seoFields.parse({ ...v, indexing: v.indexing || "inherit" });
    await tx.$executeRaw`INSERT INTO seo_settings(key,value) VALUES(${path},${JSON.stringify(parsed)}::jsonb) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value,updated_at=now()`;
  } else if (kind === "course") {
    const syllabus = modules(v.syllabus);
    const data = {
      title: v.title,
      slug: v.slug,
      categoryId: v.categoryId,
      summary: v.summary,
      duration: v.duration,
      price: Number(v.price),
      isFeatured: v.featured === "true",
      syllabusJson: syllabus,
      syllabusModules: syllabus.map((m) => ({
        moduleTitle: m.title,
        topics: m.topics,
      })),
      highlights: lines(v.highlights),
    };
    await tx.course.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  } else if (kind === "placement") {
    const data = {
      studentName: v.name,
      companyName: v.company,
      role: v.role,
      courseId: v.courseId || null,
      packageCtc: v.package,
      quote: v.story,
      studentAvatarUrl: v.image,
    };
    await tx.placementStory.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  } else if (kind === "testimonial") {
    await tx.branch.findUniqueOrThrow({
      where: { id: v.branchId },
      select: { id: true },
    });
    await tx.course.findUniqueOrThrow({
      where: { id: v.courseId },
      select: { id: true },
    });
    const data = {
      studentName: v.name,
      title: v.title,
      body: v.body,
      courseId: v.courseId,
      branchId: v.branchId,
      rating: Number(v.rating),
      status: "APPROVED",
    };
    await tx.review.upsert({
      where: { id },
      create: {
        id,
        ...data,
        studentEmail: "",
        completionYear: String(new Date().getFullYear()),
      },
      update: data,
    });
  }
}
export async function change(
  kind: Kind,
  id: string,
  version: number,
  command: "save" | "publish" | "unpublish",
  input?: unknown,
) {
  const actor = await cmsAdmin();
  if (
    !validKey(kind, id) ||
    !Number.isSafeInteger(version) ||
    version < 0 ||
    !["save", "publish", "unpublish"].includes(command)
  )
    throw Error("Invalid edit.");
  const draft = command === "save" ? validate(kind, input) : null;
  if (kind === "page" && draft) {
    const path = publicPath.parse(draft.path);
    if (id !== seoId(path) || Boolean(draft.cta) !== Boolean(draft.href)) throw Error("Check the page URL and supply both button fields.");
  }
  if (kind === "seo" && draft) {
    draft.indexing ||= "inherit";
    publicPath.parse(draft.path);
    seoFields.parse({ ...draft, indexing: draft.indexing || "inherit" });
    if (id !== seoId(draft.path)) throw Error("Invalid SEO page selection.");
  }
  await prisma.$transaction(
    async (tx) => {
      let count: number;
      if (draft) {
        const json = JSON.stringify(draft);
        count =
          version === 0
            ? await tx.$executeRaw`INSERT INTO cms_documents(kind,id,draft) VALUES (${kind},${id},${json}::jsonb) ON CONFLICT DO NOTHING`
            : await tx.$executeRaw`UPDATE cms_documents SET draft=${json}::jsonb,version=version+1,updated_at=now() WHERE kind=${kind} AND id=${id} AND version=${version}`;
      } else {
        const rows = await tx.$queryRaw<
          { draft: Values }[]
        >`SELECT draft FROM cms_documents WHERE kind=${kind} AND id=${id} AND version=${version} FOR UPDATE`;
        if (!rows.length)
          throw Error("This content changed. Reload the editor.");
        if (command === "publish") {
          const v = validate(kind, rows[0].draft);
          if(kind==="seo")await tx.$executeRaw`UPDATE cms_documents d SET previous_seo=(SELECT value FROM seo_settings WHERE key=${v.path}) WHERE kind=${kind} AND id=${id} AND (published IS NULL OR (SELECT value FROM seo_settings WHERE key=${v.path}) IS DISTINCT FROM published-'path')`;
          await writeRecord(tx, kind, id, v);
          count =
            await tx.$executeRaw`UPDATE cms_documents SET published=draft,withdrawn=false,version=version+1,updated_at=now() WHERE kind=${kind} AND id=${id}`;
        } else {
          if(kind==="seo"){
            await tx.$executeRaw`UPDATE seo_settings s SET value=d.previous_seo,updated_at=now() FROM cms_documents d WHERE d.kind=${kind} AND d.id=${id} AND d.previous_seo IS NOT NULL AND s.key=d.published->>'path' AND s.value=d.published-'path'`;
            await tx.$executeRaw`DELETE FROM seo_settings s USING cms_documents d WHERE d.kind=${kind} AND d.id=${id} AND d.previous_seo IS NULL AND s.key=d.published->>'path' AND s.value=d.published-'path'`;
          }
          count =
            await tx.$executeRaw`UPDATE cms_documents SET published=NULL,withdrawn=true,version=version+1,updated_at=now() WHERE kind=${kind} AND id=${id}`;
        }
      }
      if (count !== 1) throw Error("This content changed. Reload the editor.");
      const stage = draft ? "draft" : "published";
      await tx.$executeRaw`DELETE FROM cms_media_usage WHERE kind=${kind} AND id=${id} AND stage=${stage}`;
      if (draft) {
        const refs = new Set(
          Object.values(draft)
            .map((v) => mediaPath.exec(v)?.[1])
            .filter(Boolean),
        );
        for (const ref of refs) {
          const media = await tx.$queryRaw<
            unknown[]
          >`SELECT id FROM cms_media WHERE id=${ref}::uuid AND NOT deleting FOR SHARE`;
          if (!media.length)
            throw Error("Choose an available image from the media library.");
          await tx.$executeRaw`INSERT INTO cms_media_usage(kind,id,stage,media_id) VALUES(${kind},${id},'draft',${ref}::uuid)`;
        }
      } else {
        if (command === "publish")
          await tx.$executeRaw`INSERT INTO cms_media_usage(kind,id,media_id,stage) SELECT kind,id,media_id,'published' FROM cms_media_usage WHERE kind=${kind} AND id=${id} AND stage='draft'`;
        await tx.$executeRaw`INSERT INTO cms_history(kind,id,version,action,actor_id) VALUES(${kind},${id},${version + 1},${command},${actor.id})`;
      }
    },
    { timeout: 15000 },
  );
}
