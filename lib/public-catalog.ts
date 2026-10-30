import { getAllPlatformData } from "@/lib/wordpress";
import { cache } from "react";

const getCatalog = cache(getAllPlatformData);

// Public detail pages use the same published catalog as the listings.
export const publicCatalog = {
  async getCourses() { return (await getCatalog()).courses; },
  async getCategories() { return (await getCatalog()).categories; },
  async getCourseBySlug(slug: string) { return (await getCatalog()).courses.find(course => course.slug === slug || course.id === slug); },
  async getBranches() { return (await getCatalog()).branches; },
  async getBranchBySlug(slug: string) { return (await getCatalog()).branches.find(branch => branch.slug === slug || branch.id === slug); },
  async getBatches(branchId?: string) { return (await getCatalog()).batches.filter(batch => !branchId || batch.branchId === branchId); },
  async getApprovedReviews(courseId?: string, branchId?: string) { return (await getCatalog()).reviews.filter(review => review.status === "APPROVED" && (!courseId || review.courseId === courseId) && (!branchId || review.branchId === branchId)); },
  async getInterviewQuestions(courseId?: string) { return ((await getCatalog()).interviewQuestions || []).filter(question => !courseId || question.courseId === courseId); },
};
