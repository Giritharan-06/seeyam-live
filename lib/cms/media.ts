import "server-only";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../db";
import { cmsAdmin } from "./store";

export const maxBytes = 4 * 1024 * 1024;
const directory = path.resolve(".cms-media");
export type Media = {
  id: string;
  name: string;
  category: string;
  size: number;
};
type Stored = Media & { storage_key: string; provider: "local" | "cloudinary" };
function cloud() {
  const {
    CLOUDINARY_CLOUD_NAME: cloud_name,
    CLOUDINARY_API_KEY: api_key,
    CLOUDINARY_API_SECRET: api_secret,
  } = process.env;
  if (!cloud_name || !api_key || !api_secret)
    throw Error("Configure the private image storage credentials.");
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  return cloudinary;
}
export async function listMedia() {
  await cmsAdmin();
  return prisma.$queryRaw<
    Media[]
  >`SELECT id,name,category,size FROM cms_media ORDER BY created_at DESC`;
}
export async function uploadImage(
  bytes: Buffer,
  name: string,
  category: string,
) {
  await cmsAdmin();
  if (
    bytes.length > maxBytes ||
    !bytes.length ||
    name.length > 180 ||
    category.length > 100
  )
    throw Error("Use an image below 4 MB and a shorter name.");
  const image = sharp(bytes, { limitInputPixels: 24000000, failOn: "error" });
  const meta = await image.metadata().catch(() => {
    throw Error("Invalid image file.");
  });
  if (
    !["jpeg", "webp", "png"].includes(meta.format || "") ||
    (meta.pages || 1) > 1
  )
    throw Error("Choose a JPEG, PNG or WebP still image.");
  const clean = await image
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();
  if (clean.length > maxBytes) throw Error("Choose a smaller image.");
  const id = randomUUID(),
    key = "seeyam-cms/" + id;
  const provider =
    process.env.VERCEL || process.env.CLOUDINARY_CLOUD_NAME
      ? "cloudinary"
      : "local";
  if (provider === "local") {
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, id + ".webp"), clean, { flag: "wx" });
  } else
    await new Promise<void>((resolve, reject) =>
      cloud()
        .uploader.upload_stream(
          {
            public_id: key,
            type: "authenticated",
            overwrite: false,
            resource_type: "image",
          },
          (error) =>
            error
              ? reject(Error("Image storage rejected the upload."))
              : resolve(),
        )
        .end(clean),
    );
  try {
    await prisma.$executeRaw`INSERT INTO cms_media(id,name,category,mime,size,provider,storage_key) VALUES(${id}::uuid,${name},${category},'image/webp',${clean.length},${provider},${key})`;
  } catch (error) {
    await erase(id, key, provider);
    throw error;
  }
  return id;
}
async function erase(id: string, key: string, provider: string) {
  if (provider === "cloudinary") {
    const r = await cloud().uploader.destroy(key, {
      type: "authenticated",
      invalidate: true,
    });
    if (!["ok", "not found"].includes(r.result))
      throw Error("Unable to remove stored file.");
  } else
    await unlink(path.join(directory, id + ".webp")).catch((e) => {
      if (e.code !== "ENOENT") throw e;
    });
}
export async function deleteImage(id: string) {
  await cmsAdmin();
  const [r] = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM cms_media WHERE id=${id}::uuid FOR UPDATE`;
    const [used] = await tx.$queryRaw<
      { used: boolean }[]
    >`SELECT EXISTS(SELECT 1 FROM cms_media_usage WHERE media_id=${id}::uuid) AS used`;
    if (used.used)
      throw Error("This image is used in a draft or published item.");
    return tx.$queryRaw<
      Stored[]
    >`UPDATE cms_media SET deleting=true WHERE id=${id}::uuid RETURNING *`;
  });
  if (!r) return;
  await erase(id, r.storage_key, r.provider);
  await prisma.$executeRaw`DELETE FROM cms_media WHERE id=${id}::uuid AND deleting`;
}
export async function readImage(id: string) {
  const [r] = await prisma.$queryRaw<
    (Stored & { public: boolean })[]
  >`SELECT m.*, EXISTS (SELECT 1 FROM cms_media_usage u WHERE u.media_id=m.id AND stage='published') AS public FROM cms_media m WHERE m.id=${id}::uuid AND NOT deleting`;
  if (!r) return null;
  if (!r.public) await cmsAdmin();
  if (r.provider === "local")
    return new Uint8Array(await readFile(path.join(directory, id + ".webp")));
  const signed = cloud().url(r.storage_key + ".webp", {
    type: "authenticated",
    sign_url: true,
    secure: true,
  });
  const res = await fetch(signed, { cache: "no-store" });
  if (!res.ok) throw Error("Image unavailable.");
  return new Uint8Array(await res.arrayBuffer());
}
