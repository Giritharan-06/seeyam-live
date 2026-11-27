"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
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
} from "@/lib/mock-data";
import { fetchLivePlatformData } from "@/actions/platform";
import {
  type AllPlatformDataResponse,
  type PlatformSettings,
} from "@/lib/wordpress";

interface PlatformDataContextType {
  cms?: import("@/lib/cms/fields").Item[];
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

const PlatformDataContext = createContext<PlatformDataContextType | null>(null);

export function PlatformDataProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial: AllPlatformDataResponse;
}) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  React.useEffect(() => setData(initial), [initial]);
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchLivePlatformData());
    } finally {
      setLoading(false);
    }
  }, []);
  const settings = data.settings ?? {};
  const value = {
    ...data,
    faqs: data.faqs ?? [],
    interviewQuestions: data.interviewQuestions ?? [],
    resources: data.resources ?? [],
    jobPortalLinks: data.jobPortalLinks ?? [],
    heroMedia: {
      youtubeUrl: settings.hero_youtube_url ?? INITIAL_HERO_MEDIA.youtubeUrl,
      title: settings.hero_video_title ?? INITIAL_HERO_MEDIA.title,
      subtitle: settings.hero_video_subtitle ?? INITIAL_HERO_MEDIA.subtitle,
      badge: settings.hero_video_badge ?? INITIAL_HERO_MEDIA.badge,
    },
    siteSettings: settings,
    refreshData,
    loading,
  };
  return (
    <PlatformDataContext.Provider value={value}>
      {children}
    </PlatformDataContext.Provider>
  );
}

export function usePlatformData() {
  const context = useContext(PlatformDataContext);
  if (!context)
    throw new Error(
      "Public platform data is unavailable outside its provider.",
    );
  return context;
}
