"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  publicReviewSchema,
  PublicReviewInput,
  reviewModerationSchema,
  ReviewModerationInput,
} from "@/lib/validations/schema";
import { ReviewData } from "@/lib/mock-data";
import { ActionResult } from "./leads";

export async function getApprovedReviews(
  courseId?: string,
  branchId?: string
): Promise<ReviewData[]> {
  return await db.getApprovedReviews(courseId, branchId);
}

export async function getAllReviews(params?: {
  courseId?: string;
  branchId?: string;
  status?: string;
  rating?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  reviews: ReviewData[];
  total: number;
  page: number;
  totalPages: number;
}> {
  return await db.getReviews(params);
}

export async function getReviewStats() {
  return await db.getReviewStats();
}

export async function submitReview(
  formData: PublicReviewInput
): Promise<ActionResult<ReviewData>> {
  try {
    const validated = publicReviewSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        message:
          validated.error.errors[0]?.message ||
          "Please fill all required review fields properly.",
      };
    }

    const review = await db.createReview({
      studentName: validated.data.studentName,
      studentEmail: validated.data.studentEmail,
      courseId: validated.data.courseId,
      branchId: validated.data.branchId,
      rating: validated.data.rating,
      title: validated.data.title,
      body: validated.data.body,
      completionYear: validated.data.completionYear,
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/reviews");

    return {
      success: true,
      message:
        "Thank you! Your review has been submitted and will be displayed after quick verification by our academic team.",
      data: review,
    };
  } catch (error) {
    console.error("submitReview error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while submitting your review. Please try again.",
    };
  }
}

export async function moderateReview(
  formData: ReviewModerationInput
): Promise<ActionResult<ReviewData>> {
  try {
    const validated = reviewModerationSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.errors[0]?.message || "Invalid moderation parameters.",
      };
    }

    const updated = await db.updateReviewStatus(
      validated.data.reviewId,
      validated.data.newStatus,
      validated.data.adminNote
    );

    if (!updated) {
      return {
        success: false,
        message: "Review not found.",
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/reviews", "layout");
    revalidatePath("/admin/reviews");

    return {
      success: true,
      message: `Review status updated to ${validated.data.newStatus}.`,
      data: updated,
    };
  } catch (error) {
    console.error("moderateReview error:", error);
    return {
      success: false,
      message: "Failed to update review status.",
    };
  }
}

export async function deleteReview(id: string): Promise<ActionResult<boolean>> {
  try {
    const deleted = await db.deleteReview(id);
    if (!deleted) {
      return {
        success: false,
        message: "Review not found.",
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/reviews", "layout");
    revalidatePath("/admin/reviews");

    return {
      success: true,
      message: "Review deleted successfully.",
      data: true,
    };
  } catch (error) {
    console.error("deleteReview error:", error);
    return {
      success: false,
      message: "Failed to delete review.",
    };
  }
}
