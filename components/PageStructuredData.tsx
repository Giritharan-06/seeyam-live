import { getPageJsonLd } from "@/lib/seo";

export default async function PageStructuredData({ path }: { path: string }) {
  const json = await getPageJsonLd(path);
  return json ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} /> : null;
}
