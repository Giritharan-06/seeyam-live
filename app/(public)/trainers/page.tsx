import CmsDirectory from "@/components/CmsDirectory";
import { getStaticSeoMetadata } from "@/lib/seo";
export function generateMetadata() {
  return getStaticSeoMetadata("/trainers");
}
export default function Page() {
  return <CmsDirectory kind="trainer" />;
}
