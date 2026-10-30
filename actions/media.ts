"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { HeroMediaSettings } from "@/lib/mock-data";
import { ActionResult } from "./leads";

export async function getHeroMedia(): Promise<HeroMediaSettings> {
  return await db.getHeroMedia();
}

export async function updateHeroMedia(
  data: Partial<HeroMediaSettings>
): Promise<ActionResult<HeroMediaSettings>> {
  try {
    const updated = await db.updateHeroMedia(data);
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");

    return {
      success: true,
      message: "Hero video & media configuration updated successfully!",
      data: updated,
    };
  } catch (error) {
    console.error("updateHeroMedia error:", error);
    return {
      success: false,
      message: "Failed to update hero video settings.",
    };
  }
}
