"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  MOCK_COURSES,
  MOCK_BRANCHES,
  MOCK_CATEGORIES,
  MOCK_REVIEWS,
  MOCK_PLACEMENTS,
  INITIAL_HERO_MEDIA,
  CourseData,
  BranchData,
  CategoryData,
  ReviewData,
  PlacementStoryData,
  HeroMediaSettings,
  BatchData,
  FAQData,
  InterviewQuestionData,
  ResourceData,
  JobPortalLinkData,
  MOCK_BATCHES,
  MOCK_FAQS,
  MOCK_INTERVIEW_QUESTIONS,
  MOCK_RESOURCES,
  MOCK_JOB_PORTAL_LINKS,
} from "@/lib/mock-data";
import { fetchLivePlatformData } from "@/actions/platform";
import { getSiteSettings, PlatformSettings } from "@/lib/wordpress";

interface PlatformDataContextType {
  courses: CourseData[];
  branches: BranchData[];
  categories: CategoryData[];
  reviews: ReviewData[];
  placements: PlacementStoryData[];
  batches: BatchData[];
  faqs: FAQData[];
  interviewQuestions: InterviewQuestionData[];
  resources: ResourceData[];
  jobPortalLinks: JobPortalLinkData[];
  heroMedia: HeroMediaSettings;
  siteSettings?: PlatformSettings;
  refreshData: () => Promise<void>;
  loading: boolean;
}

const PlatformDataContext = createContext<PlatformDataContextType>({
  courses: MOCK_COURSES,
  branches: MOCK_BRANCHES,
  categories: MOCK_CATEGORIES,
  reviews: MOCK_REVIEWS.filter((r) => r.status === "APPROVED"),
  placements: MOCK_PLACEMENTS,
  batches: MOCK_BATCHES,
  faqs: MOCK_FAQS,
  interviewQuestions: MOCK_INTERVIEW_QUESTIONS,
  resources: MOCK_RESOURCES,
  jobPortalLinks: MOCK_JOB_PORTAL_LINKS,
  heroMedia: INITIAL_HERO_MEDIA,
  siteSettings: {},
  refreshData: async () => {},
  loading: false,
});

export function PlatformDataProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<CourseData[]>(MOCK_COURSES);
  const [branches, setBranches] = useState<BranchData[]>(MOCK_BRANCHES);
  const [categories, setCategories] = useState<CategoryData[]>(MOCK_CATEGORIES);
  const [reviews, setReviews] = useState<ReviewData[]>(
    MOCK_REVIEWS.filter((r) => r.status === "APPROVED")
  );
  const [placements, setPlacements] = useState<PlacementStoryData[]>(MOCK_PLACEMENTS);
  const [batches, setBatches] = useState<BatchData[]>(MOCK_BATCHES);
  const [faqs, setFaqs] = useState<FAQData[]>(MOCK_FAQS);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestionData[]>(MOCK_INTERVIEW_QUESTIONS);
  const [resources, setResources] = useState<ResourceData[]>(MOCK_RESOURCES);
  const [jobPortalLinks, setJobPortalLinks] = useState<JobPortalLinkData[]>(MOCK_JOB_PORTAL_LINKS);
  const [heroMedia, setHeroMedia] = useState<HeroMediaSettings>(INITIAL_HERO_MEDIA);
  const [siteSettings, setSiteSettings] = useState<PlatformSettings>({});
  const [loading, setLoading] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLivePlatformData();
      if (data) {
        if (data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        }
        if (data.branches && data.branches.length > 0) {
          setBranches(data.branches);
        }
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews.filter((r) => r.status === "APPROVED" || !r.status));
        }
        if (data.placements && data.placements.length > 0) {
          setPlacements(data.placements);
        }
        if (data.batches && data.batches.length > 0) {
          setBatches(data.batches);
        }
        if (data.faqs && data.faqs.length > 0) {
          setFaqs(data.faqs);
        }
        if (data.interviewQuestions && data.interviewQuestions.length > 0) {
          setInterviewQuestions(data.interviewQuestions);
        }
        if (data.resources && data.resources.length > 0) {
          setResources(data.resources);
        }
        if (data.jobPortalLinks && data.jobPortalLinks.length > 0) {
          setJobPortalLinks(data.jobPortalLinks);
        }
        if (data.settings && Object.keys(data.settings).length > 0) {
          setSiteSettings(data.settings);
          if (data.settings.hero_youtube_url || data.settings.hero_video_title) {
            setHeroMedia({
              youtubeUrl: data.settings.hero_youtube_url || "",
              title: data.settings.hero_video_title || "",
              subtitle: data.settings.hero_video_subtitle || "",
              badge: data.settings.hero_video_badge || "",
            });
          }
        }
      }
    } catch (err) {
      console.warn("PlatformDataProvider background sync note:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Single consolidated background sync on client mount
    refreshData();
  }, [refreshData]);

  return (
    <PlatformDataContext.Provider
      value={{
        courses,
        branches,
        categories,
        reviews,
        placements,
        batches,
        faqs,
        interviewQuestions,
        resources,
        jobPortalLinks,
        heroMedia,
        siteSettings,
        refreshData,
        loading,
      }}
    >
      {children}
    </PlatformDataContext.Provider>
  );
}

export function usePlatformData() {
  return useContext(PlatformDataContext);
}
