"use server";

import {
  getSiteSettings,
  AllPlatformDataResponse,
  PlatformSettings,
} from "@/lib/wordpress";
import { getPublishedPlatform } from "@/lib/published-platform";

export async function fetchLivePlatformData(): Promise<AllPlatformDataResponse> {
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
