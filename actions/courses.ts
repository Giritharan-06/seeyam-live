"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { CourseData, CategoryData } from "@/lib/mock-data";
import { courseCreateSchema, CourseCreateInput } from "@/lib/validations/schema";
import { ActionResult } from "./leads";

export async function getAllCategories(): Promise<CategoryData[]> {
  return await db.getCategories();
}

export async function getCourses(categoryId?: string): Promise<CourseData[]> {
  return await db.getCourses(categoryId);
}

export async function getFeaturedCourses(): Promise<CourseData[]> {
  return await db.getFeaturedCourses();
}

export async function getCourseBySlug(slug: string): Promise<CourseData | undefined> {
  return await db.getCourseBySlug(slug);
}

export async function getCourseById(id: string): Promise<CourseData | undefined> {
  return await db.getCourseById(id);
}

export async function searchCourses(query: string): Promise<CourseData[]> {
  return await db.searchCourses(query);
}

export async function createCourse(formData: CourseCreateInput): Promise<ActionResult<CourseData>> {
  try {
    const validated = courseCreateSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.errors[0]?.message || "Please fill all required course fields properly.",
      };
    }

    const course = await db.createCourse({
      title: validated.data.title,
      slug: validated.data.slug,
      categoryId: validated.data.categoryId,
      summary: validated.data.summary,
      duration: validated.data.duration,
      mode: validated.data.mode,
      price: validated.data.price,
      expectedSalary: validated.data.expectedSalary || "₹6.5 - ₹12 LPA",
      rating: 4.9,
      enrolledCount: 1,
      isFeatured: validated.data.isFeatured,
      syllabus: [
        {
          title: "Module 1: Foundations & Architecture",
          duration: "3 Weeks",
          topics: ["Core Fundamentals", "Best Practices", "Design Patterns"],
        },
        {
          title: "Module 2: Advanced Enterprise Implementation",
          duration: "5 Weeks",
          topics: ["Real-world Capstone Project", "Cloud Deployment & CI/CD", "Performance Tuning"],
        },
      ],
      highlights: validated.data.highlights && validated.data.highlights.length > 0 ? validated.data.highlights : [
        "100% Placement Assistance with 200+ Hiring Partners",
        "Live Hands-on Real-time Capstone Projects",
        "1-on-1 Mentor Code Reviews and Mock Interviews",
      ],
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/courses", "layout");

    return {
      success: true,
      message: "Course created successfully!",
      data: course,
    };
  } catch (error) {
    console.error("createCourse error:", error);
    return {
      success: false,
      message: "Failed to create course.",
    };
  }
}

export async function updateCourse(
  id: string,
  data: Partial<CourseData>
): Promise<ActionResult<CourseData>> {
  try {
    const updated = await db.updateCourse(id, data);
    if (!updated) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/courses", "layout");

    return {
      success: true,
      message: "Course updated successfully!",
      data: updated,
    };
  } catch (error) {
    console.error("updateCourse error:", error);
    return {
      success: false,
      message: "Failed to update course.",
    };
  }
}

export async function deleteCourse(id: string): Promise<ActionResult<boolean>> {
  try {
    const deleted = await db.deleteCourse(id);
    if (!deleted) {
      return {
        success: false,
        message: "Course not found.",
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/courses", "layout");

    return {
      success: true,
      message: "Course deleted successfully!",
      data: true,
    };
  } catch (error) {
    console.error("deleteCourse error:", error);
    return {
      success: false,
      message: "Failed to delete course.",
    };
  }
}
