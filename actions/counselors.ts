"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { counselorPasswordHash, getSession, hasSecureAdminConfiguration } from "@/lib/auth";
import { prisma } from "@/lib/db";

const fields = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.union([z.literal(""), z.string().min(12).max(256)]),
});

export async function saveCounselor(previous: string, form: FormData) {
  if ((await getSession())?.role !== "ADMIN" || !hasSecureAdminConfiguration) return "A securely configured administrator login is required.";
  const parsed = fields.safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Enter a name, valid email and a password of 12–256 characters when setting a password.";
  const { name, email, password } = parsed.data;
  if ([(process.env.ADMIN_EMAIL || "admin@seeyam.com").toLowerCase(), "counselor@seeyam.com"].includes(email)) return "That email is reserved for an existing staff account.";
  const id = form.get("id");
  try {
    if (!id && !password) return "Enter an initial password.";
    const passwordHash = password ? await counselorPasswordHash(password) : undefined;
    if (typeof id === "string" && id) {
      const result = await prisma.user.updateMany({ where: { id, role: "COUNSELOR" }, data: {
        name, email, active: form.get("active") === "on", passwordHash,
      } });
      if (!result.count) return "Counselor account no longer exists.";
    } else {
      await prisma.user.create({ data: { name, email, passwordHash: passwordHash!, role: "COUNSELOR" } });
    }
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return "That email is already in use.";
    return "Could not save the counselor account. Check the database connection and retry.";
  }
  revalidatePath("/admin/counselors");
  return "Counselor account saved.";
}
