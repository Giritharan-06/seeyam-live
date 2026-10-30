"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  publicLeadSchema,
  leadStatusUpdateSchema,
  leadNoteSchema,
  walkInLeadSchema,
  leadFilterSchema,
  PublicLeadInput,
  LeadStatusUpdateInput,
  LeadNoteInput,
  WalkInLeadInput,
  LeadFilterInput,
} from "@/lib/validations/schema";
import { LeadData } from "@/lib/mock-data";

export interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Public Lead Submission Action
 * Triggered by Landing Page Hero, Course Grid, and Global Modal
 */
export async function submitPublicLead(
  formData: PublicLeadInput
): Promise<ActionResult<LeadData>> {
  try {
    const validated = publicLeadSchema.safeParse(formData);

    if (!validated.success) {
      const formattedErrors: Record<string, string[]> = {};
      validated.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!formattedErrors[path]) formattedErrors[path] = [];
        formattedErrors[path].push(issue.message);
      });
      return {
        success: false,
        message: "Please correct the highlighted errors in the form.",
        errors: formattedErrors,
      };
    }

    const reason = validated.data.reason || "ENQUIRY";
    const course = await db.getCourseById(validated.data.courseId);
    const brochureUrl = course?.brochureUrl || "/resources/brochures/seeyam-syllabus.pdf";

    let noteText = "Online inquiry submitted for course with branch preference.";
    let successMessage = "Thank you! Your inquiry has been received. Our senior counselor will call you within 15 minutes.";

    if (reason === "BROCHURE_DOWNLOAD") {
      noteText = `Lead requested syllabus & brochure download for ${course?.title || "selected course"}.`;
      successMessage = "Your brochure access is confirmed! Click below to download your complete syllabus PDF.";
    } else if (reason === "DEMO_VIDEO") {
      noteText = `Lead requested demo class video session for ${course?.title || "selected course"}.`;
      successMessage = "Demo session access link has been sent to your email and WhatsApp!";
    }

    const lead = await db.createLead({
      fullName: validated.data.fullName,
      email: validated.data.email,
      phone: validated.data.phone,
      branchId: validated.data.branchId,
      courseId: validated.data.courseId,
      source: validated.data.source || (reason === "BROCHURE_DOWNLOAD" ? "Brochure Download Modal" : "Website Landing Page"),
      initialNote: noteText,
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin");

    return {
      success: true,
      message: successMessage,
      data: {
        ...lead,
        brochureUrl,
      },
    };
  } catch (error) {
    console.error("submitPublicLead error:", error);
    return {
      success: false,
      message: "Something went wrong while submitting your inquiry. Please try again or reach out on WhatsApp.",
    };
  }
}

/**
 * Counselor / Admin Walk-in Lead Creation
 */
export async function createWalkInLead(
  formData: WalkInLeadInput
): Promise<ActionResult<LeadData>> {
  try {
    const validated = walkInLeadSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid walk-in lead details. Please check all fields.",
      };
    }

    const lead = await db.createLead({
      fullName: validated.data.fullName,
      email: validated.data.email,
      phone: validated.data.phone,
      branchId: validated.data.branchId,
      courseId: validated.data.courseId,
      source: validated.data.source,
      initialNote: validated.data.initialNote || "Walk-in lead recorded by counselor.",
    });

    if (validated.data.status !== "NEW") {
      await db.updateLeadStatus(
        lead.id,
        validated.data.status,
        "Status set during walk-in entry.",
        "Front Desk Counselor"
      );
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Lead for ${lead.fullName} registered successfully!`,
      data: lead,
    };
  } catch (error) {
    console.error("createWalkInLead error:", error);
    return {
      success: false,
      message: "Failed to record walk-in lead.",
    };
  }
}

/**
 * Update Lead Status (e.g. NEW -> CONTACTED -> COUNSELING -> ENROLLED -> DROPPED)
 */
export async function updateLeadStatus(
  input: LeadStatusUpdateInput
): Promise<ActionResult<LeadData>> {
  try {
    const validated = leadStatusUpdateSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        message: "Invalid status or parameters.",
      };
    }

    const updated = await db.updateLeadStatus(
      validated.data.leadId,
      validated.data.newStatus,
      validated.data.note,
      validated.data.author || "Counselor"
    );

    if (!updated) {
      return {
        success: false,
        message: "Lead not found or update failed.",
      };
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Lead status updated to ${validated.data.newStatus}`,
      data: updated,
    };
  } catch (error) {
    console.error("updateLeadStatus error:", error);
    return {
      success: false,
      message: "Failed to update lead status.",
    };
  }
}

/**
 * Add Counselor Note to Lead
 */
export async function addLeadNote(
  input: LeadNoteInput
): Promise<ActionResult<LeadData>> {
  try {
    const validated = leadNoteSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        message: "Note must be at least 3 characters.",
      };
    }

    const updated = await db.addLeadNote(
      validated.data.leadId,
      validated.data.text,
      validated.data.author
    );

    if (!updated) {
      return {
        success: false,
        message: "Lead not found.",
      };
    }

    revalidatePath("/admin/leads");

    return {
      success: true,
      message: "Follow-up note logged successfully.",
      data: updated,
    };
  } catch (error) {
    console.error("addLeadNote error:", error);
    return {
      success: false,
      message: "Failed to log note.",
    };
  }
}

/**
 * Get Paginated & Filtered Leads for CRM
 */
export async function getLeads(filters: LeadFilterInput = {}) {
  try {
    const validated = leadFilterSchema.safeParse(filters);
    const params = validated.success ? validated.data : {};
    return await db.getLeads(params);
  } catch (error) {
    console.error("getLeads error:", error);
    return { leads: [], total: 0, page: 1, totalPages: 1 };
  }
}

/**
 * Get Lead by ID
 */
export async function getLeadById(id: string): Promise<LeadData | undefined> {
  return await db.getLeadById(id);
}

/**
 * Export Leads to CSV string
 */
export async function exportLeadsCsv(filters: LeadFilterInput = {}): Promise<string> {
  const result = await db.getLeads({ ...filters, page: 1, pageSize: 1000 });
  const branches = await db.getBranches();
  const courses = await db.getCourses();

  const branchMap = new Map(branches.map((b) => [b.id, b.name]));
  const courseMap = new Map(courses.map((c) => [c.id, c.title]));

  const headers = ["Lead ID", "Full Name", "Email", "Phone", "Course", "Branch", "Status", "Created At", "Latest Note"];
  const rows = result.leads.map((l) => [
    `"${l.id}"`,
    `"${l.fullName.replace(/"/g, '""')}"`,
    `"${l.email}"`,
    `"${l.phone}"`,
    `"${(courseMap.get(l.courseId) || l.courseId).replace(/"/g, '""')}"`,
    `"${(branchMap.get(l.branchId) || l.branchId).replace(/"/g, '""')}"`,
    `"${l.status}"`,
    `"${new Date(l.createdAt).toLocaleDateString("en-IN")}"`,
    `"${(l.notes?.[0]?.text || "").replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Get Dashboard KPI metrics
 */
export async function getDashboardStats() {
  return await db.getStats();
}
