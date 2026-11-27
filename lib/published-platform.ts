import { db, prisma } from "./db";
import type { AllPlatformDataResponse } from "./wordpress";
import { publishedItems } from "./cms/store";
import { applyContent } from "./cms/public";
import { getFallbackPlatformData, getSiteSettings } from "./wordpress";
import type { FAQData } from "./mock-data";

export async function getBasePlatform(): Promise<AllPlatformDataResponse> {
  const [
    categories,
    courses,
    branches,
    batches,
    reviews,
    placements,
    faqs,
    interviewQuestions,
    resources,
    jobPortalLinks,
    hero,
    settings,
  ] = await Promise.all([
    db.getCategories(),
    db.getCourses(),
    db.getBranches(),
    db.getBatches(),
    db.getApprovedReviews(),
    prisma.placementStory.findMany(),
    prisma.fAQ.findMany({ orderBy: { order: "asc" } }),
    prisma.interviewQuestion.findMany({ orderBy: { order: "asc" } }),
    prisma.resource.findMany(),
    prisma.jobPortalLink.findMany({ orderBy: { order: "asc" } }),
    db.getHeroMedia(),
    getSiteSettings(),
  ]);
  return {
    categories,
    courses,
    branches,
    batches,
    reviews: reviews.map((r) => ({
      ...r,
      studentEmail: "",
      adminNote: undefined,
    })),
    placements: placements.map((r) => ({
      ...r,
      studentAvatarUrl: r.studentAvatarUrl ?? "",
      courseId: r.courseId ?? "",
      branchId: r.branchId ?? undefined,
      quote: r.quote ?? undefined,
      previousRole: r.previousRole ?? undefined,
      linkedinUrl: r.linkedinUrl ?? undefined,
    })),
    faqs: faqs.map((r) => ({
      ...r,
      category: r.category as FAQData["category"],
      courseId: r.courseId ?? r.legacyCourseId,
      createdAt: r.createdAt.toISOString(),
    })),
    interviewQuestions: interviewQuestions.map((r) => ({
      ...r,
      courseId: r.courseId ?? r.legacyCourseId ?? "",
      answer: r.answer ?? undefined,
      createdAt: r.createdAt.toISOString(),
    })),
    resources: resources.map((r) => ({
      ...r,
      courseId: r.courseId ?? r.legacyCourseId,
      fileSize: r.fileSize ?? undefined,
      category: r.category ?? undefined,
      description: r.description ?? undefined,
      createdAt: r.createdAt.toISOString(),
    })),
    jobPortalLinks: jobPortalLinks.map((r) => ({
      ...r,
      badge: r.badge ?? undefined,
      icon: r.icon ?? undefined,
      createdAt: r.createdAt.toISOString(),
    })),
    settings: {
      ...settings,
      hero_youtube_url: hero.youtubeUrl,
      hero_video_title: hero.title,
      hero_video_subtitle: hero.subtitle,
      hero_video_badge: hero.badge,
    },
  };
}

export async function getPublishedPlatform(): Promise<AllPlatformDataResponse> {
  const [base, items] = await Promise.all([getBasePlatform().catch(() => ({...getFallbackPlatformData(),courses:[],reviews:[],placements:[],batches:[],branches:[]})), publishedItems()]);
  return applyContent(base,items);
}
