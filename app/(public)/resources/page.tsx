import PageContent from "./PageContent";
import PageStructuredData from "@/components/PageStructuredData";
import { getStaticSeoMetadata } from "@/lib/seo";

const path = "/resources";

export function generateMetadata() {
  return getStaticSeoMetadata(path);
}

export default function Page() {
  return (
    <>
      <PageStructuredData path={path} />
      <PageContent />
    </>
  );
}
