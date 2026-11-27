import CmsDirectory from "@/components/CmsDirectory";
import { getStaticSeoMetadata } from "@/lib/seo";
export function generateMetadata() {
  return getStaticSeoMetadata("/gallery");
}
export default function Page() {
  return <CmsDirectory kind="gallery" />;
}
