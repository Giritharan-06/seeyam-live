import "server-only";
import type { Metadata } from "next";
import { readSeo } from "./seo-store";
import { parseStructuredData, publicPath, type SeoTarget } from "./seo-fields";
import { getAllPages } from "./wordpress";
import { publicCatalog } from "./public-catalog";
import { BLOG_POSTS } from "./blog-data";
import { decodeHtml } from "./utils";

export const siteOrigin = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://seeyamtechnologies.com").origin;
export const absoluteUrl = (path: string) => new URL(path, siteOrigin).href;

const staticTargets: SeoTarget[] = [
  { path: "/", title: "Seeyam Technologies | Premier Data Analytics, Digital Marketing & Placement Institute", description: "Learn Data Analytics, Power BI, SQL, Python and Digital Marketing through practical projects and mentor guidance." },
  { path: "/about", title: "About Seeyam Technologies", description: "Meet Seeyam Technologies and learn about our approach to IT training and career support." },
  { path: "/courses", title: "IT Training Courses at Seeyam Technologies", description: "Compare Data Analytics, Business Intelligence and Digital Marketing courses, schedules and learning formats." },
  { path: "/placements", title: "Placement Support and Student Careers", description: "Explore student career stories, interview preparation and placement support at Seeyam Technologies." },
  { path: "/branches", title: "Seeyam Technologies Training Campuses", description: "Find training campuses in Chennai, Bangalore and Hyderabad and get directions." },
  { path: "/reviews", title: "Student Reviews of Seeyam Technologies", description: "Read about students’ experiences with training, mentoring and career preparation." },
  { path: "/blog", title: "IT Training and Career Insights", description: "Read Seeyam Technologies articles on analytics, marketing, technology and career development." },
  { path: "/resources", title: "Free IT Training Resources", description: "Find study materials, resume templates and interview practice resources." },
  { path: "/resources/sql-compiler", title: "Online SQL Practice Compiler", description: "Practise SQL queries in an interactive browser workspace." },
  { path: "/contact", title: "Contact Seeyam Technologies", description: "Ask about courses, upcoming batches and campus visits." },
].map(target => ({ ...target, kind: "page" }));

export async function getSeoTargets(): Promise<SeoTarget[]> {
  const [courses, branches, pages] = await Promise.all([publicCatalog.getCourses(), publicCatalog.getBranches(), getAllPages()]);
  const targets: SeoTarget[] = [
    ...staticTargets,
    ...courses.map(course => ({ path: "/courses/" + course.slug, kind: "course" as const, title: course.title + " Training & Certification Course", description: course.summary })),
    ...branches.map(branch => ({ path: "/branches/" + branch.slug, kind: "campus" as const, title: branch.name + " Campus (" + branch.city + ")", description: branch.address })),
    ...BLOG_POSTS.map(post => ({ path: "/blog/" + post.slug, kind: "blog" as const, title: post.title, description: post.summary, modified: post.publishedDate })),
  ];
  const known = new Set(targets.map(target => target.path));
  for (const page of pages) {
    const path = "/" + page.slug;
    if (known.has(path) || ["/admin", "/api"].includes(path)) continue;
    const media = page._embedded?.["wp:featuredmedia"]?.[0];
    targets.push({ path, kind: "page", title: plainText(page.title.rendered), description: plainText(page.excerpt?.rendered || ""), image: media?.source_url, imageAlt: media?.alt_text, modified: page.modified_gmt && page.modified_gmt + "Z" });
    known.add(path);
  }
  return targets.filter(target => publicPath.safeParse(target.path).success);
}

export function plainText(html: string) {
  return decodeHtml(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

export async function getPageSeo(path: string) {
  return (await readSeo())?.pages.find(page => page.path === path)?.fields;
}

export async function getStaticSeoMetadata(path: string) {
  const target = staticTargets.find(page => page.path === path);
  if (!target) throw new Error("Missing SEO defaults for " + path);
  return withPageSeo(path, target);
}

export async function withPageSeo(path: string, defaults: { title: string; description: string }, base: Metadata = {}): Promise<Metadata> {
  const fields = await getPageSeo(path);
  const title = fields?.title || defaults.title;
  const description = fields?.description || defaults.description;
  const canonical = absoluteUrl(fields?.canonical || path);
  const index = fields?.indexing !== "noindex";
  const image = fields?.socialImage ? [{ url: absoluteUrl(fields.socialImage), alt: fields.imageAlt || undefined }] : undefined;
  const fallbackImages = base.openGraph?.images;
  const featuredImages = Array.isArray(fallbackImages) && fields?.imageAlt
    ? fallbackImages.map(item => typeof item === "object" && "url" in item ? { ...item, alt: fields.imageAlt } : item)
    : fallbackImages;
  const socialTitle = fields?.ogTitle || title;
  const socialDescription = fields?.ogDescription || description;

  return {
    ...base,
    title: fields?.title || path === "/" ? { absolute: title } : title,
    description,
    keywords: fields?.focusKeywords ? fields.focusKeywords.split(",").map(keyword => keyword.trim()).filter(Boolean) : base.keywords,
    alternates: { ...base.alternates, canonical },
    robots: { index, follow: true, googleBot: { index, follow: true } },
    openGraph: {
      type: "website", siteName: "Seeyam Technologies", locale: "en_IN",
      ...base.openGraph, url: canonical, title: socialTitle, description: socialDescription,
      images: image || featuredImages,
    },
    twitter: { card: image || featuredImages ? "summary_large_image" : "summary", title: socialTitle, description: socialDescription, images: image || featuredImages },
  };
}

export async function getPageJsonLd(path: string) {
  const value = (await getPageSeo(path))?.structuredData;
  return value ? JSON.stringify(parseStructuredData(value)).replace(/</g, "\\u003c") : undefined;
}
