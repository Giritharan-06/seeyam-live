"use server";

import { revalidatePath } from "next/cache";
import { getSession, hasSecureAdminConfiguration } from "@/lib/auth";
import { db } from "@/lib/db";
import { BranchData } from "@/lib/mock-data";
import { branchCreateSchema, BranchCreateInput } from "@/lib/validations/schema";
import { ActionResult } from "./leads";

export async function getAllBranches(): Promise<BranchData[]> {
  return await db.getBranches();
}

export async function getBranchById(id: string): Promise<BranchData | undefined> {
  return await db.getBranchById(id);
}

export async function getBranchBySlug(slug: string): Promise<BranchData | undefined> {
  return await db.getBranchBySlug(slug);
}

export async function createBranch(formData: BranchCreateInput): Promise<ActionResult<BranchData>> {
  try {
    const session = await getSession();
    if (!hasSecureAdminConfiguration || session?.role !== "ADMIN") return { success: false, message: "Please sign in with an authorized staff account." };
    const validated = branchCreateSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        message: validated.error.errors[0]?.message || "Please fill all required branch fields properly.",
      };
    }

    const branch = await db.createBranch({
      name: validated.data.name,
      slug: validated.data.slug,
      address: validated.data.address,
      city: validated.data.city,
      phone: validated.data.phone,
      whatsapp: validated.data.whatsapp,
      email: validated.data.email,
      timing: validated.data.timing || "Mon - Sun: 7:00 AM - 9:00 PM",
      landmark: validated.data.landmark || "",
      mapEmbedUrl: validated.data.mapEmbedUrl || "https://maps.google.com",
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/branches", "layout");

    return {
      success: true,
      message: "Campus branch added successfully!",
      data: branch,
    };
  } catch (error) {
    console.error("createBranch error:", error);
    return {
      success: false,
      message: "Failed to add branch.",
    };
  }
}

export async function updateBranch(
  id: string,
  data: Partial<BranchData>
): Promise<ActionResult<BranchData>> {
  try {
    const session = await getSession();
    if (!hasSecureAdminConfiguration || session?.role !== "ADMIN") return { success: false, message: "Please sign in with an authorized staff account." };
    const updated = await db.updateBranch(id, data);
    if (!updated) {
      return {
        success: false,
        message: "Branch not found.",
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/branches", "layout");

    return {
      success: true,
      message: "Branch details updated successfully!",
      data: updated,
    };
  } catch (error) {
    console.error("updateBranch error:", error);
    return {
      success: false,
      message: "Failed to update branch.",
    };
  }
}

export async function deleteBranch(id: string, replacement?: string): Promise<ActionResult<boolean> & {linked?:boolean}> {
  try {
    const session = await getSession();
    if (!hasSecureAdminConfiguration || session?.role !== "ADMIN") return { success: false, message: "Please sign in with an authorized staff account." };
    const deleted = await db.deleteBranch(id, replacement);
    if (!deleted) {
      return {
        success: false,
        message: "Branch not found.",
      };
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin", "layout");
    revalidatePath("/branches", "layout");

    return {
      success: true,
      message: "Branch deleted successfully!",
      data: true,
    };
  } catch (error) {
    const linked = error instanceof Error && (error.message.startsWith("LINKED_BRANCH:") || ("code" in error && error.code === "P2003"));
    console.error("deleteBranch error:", error);
    return {
      success: false,
      linked,
      message: linked ? (error instanceof Error && error.message.startsWith("LINKED_BRANCH:") ? "Linked to this branch: " + error.message.slice("LINKED_BRANCH:".length) : "Other records reference this branch.") : "Failed to delete branch.",
    };
  }
}
