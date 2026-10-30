"use server";

import {
  getAllPlatformData,
  getSiteSettings,
  AllPlatformDataResponse,
  PlatformSettings,
} from "@/lib/wordpress";
import {
  MOCK_CATEGORIES,
  MOCK_COURSES,
  MOCK_BRANCHES,
  MOCK_PLACEMENTS,
  MOCK_REVIEWS,
  MOCK_BATCHES,
  MOCK_FAQS,
  MOCK_INTERVIEW_QUESTIONS,
  MOCK_RESOURCES,
  MOCK_JOB_PORTAL_LINKS,
} from "@/lib/mock-data";

export async function fetchLivePlatformData(): Promise<AllPlatformDataResponse> {
  try {
    return await getAllPlatformData();
  } catch (error) {
    console.error("[fetchLivePlatformData Error]", error);
    return {
      categories: MOCK_CATEGORIES,
      courses: MOCK_COURSES,
      branches: MOCK_BRANCHES,
      placements: MOCK_PLACEMENTS,
      reviews: MOCK_REVIEWS,
      batches: MOCK_BATCHES,
      faqs: MOCK_FAQS,
      interviewQuestions: MOCK_INTERVIEW_QUESTIONS,
      resources: MOCK_RESOURCES,
      jobPortalLinks: MOCK_JOB_PORTAL_LINKS,
      settings: {},
    };
  }
}

export async function fetchLiveSettings(): Promise<PlatformSettings> {
  try {
    return await getSiteSettings();
  } catch (error) {
    console.error("[fetchLiveSettings Error]", error);
    return {};
  }
}
