"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { batchCreateSchema, BatchCreateInput } from "@/lib/validations/schema";
import { BatchData } from "@/lib/mock-data";
import { ActionResult } from "./leads";

export async function getUpcomingBatches(branchId?: string, courseId?: string): Promise<BatchData[]> {
  return await db.getBatches(branchId, courseId);
}

export async function getAllBatches(branchId?: string, courseId?: string): Promise<BatchData[]> {
  return await db.getBatches(branchId, courseId);
}

export async function createBatch(formData: BatchCreateInput): Promise<ActionResult<BatchData>> {
  try {
    const validated = batchCreateSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.errors[0]?.message || "Please fill all required batch fields properly.",
      };
    }

    const batch = await db.createBatch({
      courseId: validated.data.courseId,
      branchId: validated.data.branchId,
      instructorName: validated.data.instructorName,
      instructorExp: validated.data.instructorExp || "8+ Yrs Exp",
      startDate: validated.data.startDate,
      timing: validated.data.timing,
      maxSeats: validated.data.maxSeats,
      seatsLeft: validated.data.maxSeats,
      status: validated.data.status || "UPCOMING",
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/courses", "layout");
    revalidatePath("/branches", "layout");

    return {
      success: true,
      message: "Batch scheduled successfully!",
      data: batch,
    };
  } catch (error) {
    console.error("createBatch error:", error);
    return {
      success: false,
      message: "Failed to schedule batch.",
    };
  }
}

export async function updateBatch(
  id: string,
  data: Partial<BatchData>
): Promise<ActionResult<BatchData>> {
  try {
    const updated = await db.updateBatch(id, data);
    if (!updated) {
      return {
        success: false,
        message: "Batch not found.",
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/courses", "layout");
    revalidatePath("/branches", "layout");

    return {
      success: true,
      message: "Batch updated successfully!",
      data: updated,
    };
  } catch (error) {
    console.error("updateBatch error:", error);
    return {
      success: false,
      message: "Failed to update batch.",
    };
  }
}

export async function deleteBatch(id: string): Promise<ActionResult<boolean>> {
  try {
    const deleted = await db.deleteBatch(id);
    if (!deleted) {
      return {
        success: false,
        message: "Batch not found.",
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/courses", "layout");
    revalidatePath("/branches", "layout");

    return {
      success: true,
      message: "Batch deleted successfully!",
      data: true,
    };
  } catch (error) {
    console.error("deleteBatch error:", error);
    return {
      success: false,
      message: "Failed to delete batch.",
    };
  }
}
