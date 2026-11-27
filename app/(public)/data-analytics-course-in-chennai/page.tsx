import ChennaiCoursePage from "@/components/ChennaiCoursePage";
import { chennaiCourses } from "@/lib/chennai-courses";
import { getStaticSeoMetadata } from "@/lib/seo";

export const revalidate = 30;

export function generateMetadata() {
  return getStaticSeoMetadata(chennaiCourses.analytics.path);
}

export default function Page() {
  return <ChennaiCoursePage track="analytics" />;
}
