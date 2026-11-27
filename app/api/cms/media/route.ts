import { cmsAdmin } from "@/lib/cms/store";
import { uploadImage, maxBytes } from "@/lib/cms/media";
export async function POST(req: Request) {
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return new Response(null, { status: 403 });
  try {
    await cmsAdmin();
  } catch {
    return new Response(null, { status: 403 });
  }
  const reader = req.body?.getReader();
  if (!reader) return new Response(null, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        await reader.cancel();
        return Response.json(
          { message: "Maximum upload size is 4 MB." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    const q = new URL(req.url).searchParams;
    const id = await uploadImage(
      Buffer.concat(chunks),
      q.get("name") || "Image",
      q.get("category") || "",
    );
    return Response.json({ id }, { status: 201 });
  } catch {
    return Response.json(
      {
        message:
          "Upload failed. Check the image format, dimensions and storage settings.",
      },
      { status: 400 },
    );
  }
}
