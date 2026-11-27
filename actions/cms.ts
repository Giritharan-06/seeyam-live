"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { change, tag, cmsAdmin } from "@/lib/cms/store";
import { prisma } from "@/lib/db";
import { deleteImage } from "@/lib/cms/media";
import type { Kind, Values } from "@/lib/cms/fields";
export async function editContent(
  kind: Kind,
  id: string,
  version: number,
  action: "save" | "publish" | "unpublish",
  values?: Values,
) {
  try {
    await change(kind, id, version, action, values);
    if (action !== "save") {
      revalidateTag(tag);
      if (kind === "seo") revalidateTag("seeyam-seo");
      revalidatePath("/", "layout");
    }
    revalidatePath("/admin/website-content");
    return {
      ok: true,
      message:
        action === "save"
          ? "Draft saved."
          : action === "publish"
            ? "Published."
            : "Unpublished.",
    };
  } catch (e) {
    const m = e instanceof Error ? e.message : "";
    return {
      ok: false,
      message:
        /^(This content|Invalid |Check |Choose |Administrator |[A-Za-z ]+ is required\.)/.test(
          m,
        ) && m.length < 200
          ? m
          : "Could not save this change. Check the referenced records, URL slug and local CMS setup.",
    };
  }
}
export async function removeMedia(id: string) {
  try {
    await cmsAdmin();
    await deleteImage(id);
    revalidatePath("/admin/website-content");
    return { ok: true, message: "Image deleted." };
  } catch {
    return {
      ok: false,
      message:
        "Unable to delete this image. Remove draft and published references first.",
    };
  }
}

export async function replaceDraftMedia(oldId: string, newId: string) {
  try {
    await cmsAdmin();
    if (oldId === newId) throw Error();
    const count = await prisma.$transaction(
      async (tx) => {
        const selected = await tx.$queryRaw<
          { id: string }[]
        >`SELECT id FROM cms_media WHERE id IN (${oldId}::uuid,${newId}::uuid) AND NOT deleting ORDER BY id FOR SHARE`;
        if (selected.length !== 2) throw Error();
        const docs = await tx.$queryRaw<
          { kind: string; id: string; draft: Values }[]
        >`SELECT d.kind,d.id,d.draft FROM cms_documents d JOIN cms_media_usage u USING(kind,id) WHERE u.media_id=${oldId}::uuid AND u.stage='draft' ORDER BY kind,id FOR UPDATE OF d`;
        for (const doc of docs) {
          const changed = Object.fromEntries(
            Object.entries(doc.draft).map(([k, v]) => [
              k,
              v === "/api/cms/media/" + oldId ? "/api/cms/media/" + newId : v,
            ]),
          );
          await tx.$executeRaw`UPDATE cms_documents SET draft=${JSON.stringify(changed)}::jsonb,version=version+1,updated_at=now() WHERE kind=${doc.kind} AND id=${doc.id}`;
          await tx.$executeRaw`DELETE FROM cms_media_usage WHERE kind=${doc.kind} AND id=${doc.id} AND stage='draft' AND media_id=${oldId}::uuid`;
          await tx.$executeRaw`INSERT INTO cms_media_usage(kind,id,stage,media_id) VALUES(${doc.kind},${doc.id},'draft',${newId}::uuid) ON CONFLICT DO NOTHING`;
        }
        return docs.length;
      },
      { isolationLevel: "Serializable" },
    );
    revalidatePath("/admin/website-content");
    return {
      ok: true,
      message:
        count + " saved draft(s) updated. Review and publish each change.",
    };
  } catch {
    return {
      ok: false,
      message: "Could not replace draft references. Refresh and try again.",
    };
  }
}
