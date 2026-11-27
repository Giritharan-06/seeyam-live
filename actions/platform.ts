"use server";

import {
  getSiteSettings,
  AllPlatformDataResponse,
  PlatformSettings,
} from "@/lib/wordpress";
import { getPublishedPlatform, type PublicPlatformData } from "@/lib/published-platform";

export async function fetchLivePlatformData(): Promise<PublicPlatformData> {
  return getPublishedPlatform();
}

export async function fetchLiveSettings(): Promise<PlatformSettings> {
  try {
    return await getSiteSettings();
  } catch (error) {
    console.error("[fetchLiveSettings Error]", error);
    return {};
  }
}
