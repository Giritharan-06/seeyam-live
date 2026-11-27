import { readImage } from "@/lib/cms/media";
import { mediaPath } from "@/lib/cms/fields";
export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = mediaPath.test("/api/cms/media/" + id)
      ? await readImage(id)
      : null;
    if (body)
      return new Response(Buffer.from(body), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "private, no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
  } catch {}
  return new Response(null, {
    status: 404,
    headers: { "Cache-Control": "private, no-store" },
  });
}
