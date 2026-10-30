import { z } from "zod";

// Indian 10-digit mobile number or general international format
const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[6789]\d{9}$/;

export const publicLeadSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  email: z
    .string()
    .email({ message: "Please provide a valid email address" }),
  phone: z
    .string()
    .regex(phoneRegex, { message: "Please provide a valid 10-digit mobile number" }),
  branchId: z
    .string()
    .min(1, { message: "Please select your preferred training branch" }),
  courseId: z
    .string()
    .min(1, { message: "Please select your target course of interest" }),
  source: z.string().optional().default("Landing Page Form"),
  reason: z.enum(["ENQUIRY", "BROCHURE_DOWNLOAD", "DEMO_VIDEO"]).optional().default("ENQUIRY"),
});

export type PublicLeadInput = z.input<typeof publicLeadSchema>;

export const leadStatusUpdateSchema = z.object({
  leadId: z.string().min(1, { message: "Lead ID is required" }),
  newStatus: z.enum(["NEW", "CONTACTED", "COUNSELING", "ENROLLED", "DROPPED"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
  note: z.string().optional(),
  author: z.string().optional().default("Counselor"),
});

export type LeadStatusUpdateInput = z.input<typeof leadStatusUpdateSchema>;

export const leadNoteSchema = z.object({
  leadId: z.string().min(1, { message: "Lead ID is required" }),
  text: z.string().min(3, { message: "Note must be at least 3 characters" }),
  author: z.string().min(2, { message: "Counselor name is required" }).default("Counselor"),
});

export type LeadNoteInput = z.input<typeof leadNoteSchema>;

export const walkInLeadSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().regex(phoneRegex, { message: "Valid 10-digit mobile number required" }),
  branchId: z.string().min(1, { message: "Branch is required" }),
  courseId: z.string().min(1, { message: "Course is required" }),
  status: z.enum(["NEW", "CONTACTED", "COUNSELING", "ENROLLED", "DROPPED"]).optional().default("COUNSELING"),
  initialNote: z.string().optional(),
  source: z.string().optional().default("Walk-in / Direct Visit"),
});

export type WalkInLeadInput = z.input<typeof walkInLeadSchema>;

export const courseCreateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  slug: z.string().min(3, { message: "Slug is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
  duration: z.string().min(2, { message: "Duration is required" }),
  mode: z.enum(["CLASSROOM", "ONLINE", "HYBRID"]).optional().default("HYBRID"),
  price: z.number().nonnegative().optional().default(0),
  expectedSalary: z.string().optional().default("₹6.5 - ₹12 LPA"),
  isFeatured: z.boolean().optional().default(false),
  highlights: z.array(z.string()).optional().default([]),
});

export type CourseCreateInput = z.input<typeof courseCreateSchema>;

export const batchCreateSchema = z.object({
  courseId: z.string().min(1, { message: "Course is required" }),
  branchId: z.string().min(1, { message: "Branch is required" }),
  instructorName: z.string().min(2, { message: "Instructor name is required" }),
  instructorExp: z.string().optional().default("8+ Yrs Exp"),
  startDate: z.string().min(1, { message: "Start date is required" }),
  timing: z.string().min(3, { message: "Timing description is required" }),
  maxSeats: z.number().int().positive().optional().default(30),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED"]).optional().default("UPCOMING"),
});

export type BatchCreateInput = z.input<typeof batchCreateSchema>;

export const branchCreateSchema = z.object({
  name: z.string().min(2, { message: "Branch name is required" }),
  slug: z.string().min(2, { message: "Slug is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  phone: z.string().min(8, { message: "Phone number is required" }),
  whatsapp: z.string().min(8, { message: "WhatsApp number is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  timing: z.string().optional().default("Mon - Sun: 7:00 AM - 9:00 PM"),
  landmark: z.string().optional().default(""),
  mapEmbedUrl: z.string().optional().default(""),
});

export type BranchCreateInput = z.input<typeof branchCreateSchema>;

export const leadFilterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  branchId: z.string().optional(),
  courseId: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().optional().default(10),
});

export type LeadFilterInput = z.input<typeof leadFilterSchema>;

export const publicReviewSchema = z.object({
  studentName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name cannot exceed 100 characters" }),
  studentEmail: z
    .string()
    .email({ message: "Please provide a valid email address" }),
  courseId: z
    .string()
    .min(1, { message: "Please select the course you completed" }),
  branchId: z
    .string()
    .min(1, { message: "Please select your campus branch" }),
  rating: z
    .number()
    .min(1, { message: "Please select a rating between 1 and 5 stars" })
    .max(5, { message: "Rating cannot exceed 5 stars" }),
  title: z
    .string()
    .min(4, { message: "Review headline must be at least 4 characters" })
    .max(120, { message: "Headline cannot exceed 120 characters" }),
  body: z
    .string()
    .min(20, { message: "Review text must be at least 20 characters long" })
    .max(1200, { message: "Review cannot exceed 1200 characters" }),
  completionYear: z
    .string()
    .optional()
    .default(new Date().getFullYear().toString()),
});

export type PublicReviewInput = z.input<typeof publicReviewSchema>;

export const reviewModerationSchema = z.object({
  reviewId: z.string().min(1, { message: "Review ID is required" }),
  newStatus: z.enum(["APPROVED", "REJECTED", "PENDING"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
  adminNote: z.string().optional(),
});

export type ReviewModerationInput = z.input<typeof reviewModerationSchema>;
