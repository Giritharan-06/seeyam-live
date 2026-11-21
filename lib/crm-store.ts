import { randomUUID } from "node:crypto";
import type { Lead, PrismaClient, Prisma } from "@prisma/client";
import {
  INITIAL_HERO_MEDIA,
  type HeroMediaSettings,
  type LeadData,
} from "./mock-data";
import type { mockDb } from "./mock-db";

function lead(row: Lead): LeadData {
  return {
    ...row,
    courseId: row.courseId ?? "",
    branchId: row.branchId ?? "",
    source: row.source ?? undefined,
    reason: row.reason as LeadData["reason"],
    brochureUrl: row.brochureUrl ?? undefined,
    notes: (row.notes ?? []) as unknown as LeadData["notes"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
function note(text: string, author: string) {
  return {
    id: randomUUID(),
    text,
    author,
    timestamp: new Date().toISOString(),
  };
}
export function crmStore(p: PrismaClient) {
  async function editLead(
    id: string,
    author: string,
    text?: string,
    status?: LeadData["status"],
  ) {
    return p.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM leads WHERE id = ${id} FOR UPDATE`;
      const row = await tx.lead.findUnique({ where: { id } });
      if (!row) return null;
      const message =
        text ||
        (status && status !== row.status
          ? `Status updated from ${row.status} to ${status}`
          : "");
      const notes = message
        ? [note(message, author), ...lead(row).notes]
        : undefined;
      return lead(
        await tx.lead.update({
          where: { id },
          data: { status, notes: notes?.map((n) => ({ ...n })) },
        }),
      );
    });
  }
  return {
    getLeadById: async (id: string) => {
      const row = await p.lead.findUnique({ where: { id } });
      return row ? lead(row) : undefined;
    },
    getLeads: async (params: Parameters<typeof mockDb.getLeads>[0] = {}) => {
      const {
        status,
        branchId,
        courseId,
        search,
        page = 1,
        pageSize = 10,
      } = params;
      const where: Prisma.LeadWhereInput = {
        status: status === "ALL" ? undefined : (status as LeadData["status"]),
        branchId: branchId === "ALL" ? undefined : branchId,
        courseId: courseId === "ALL" ? undefined : courseId,
        OR: search
          ? ["fullName", "email", "phone"].map((key) => ({
              [key]: { contains: search, mode: "insensitive" },
            }))
          : undefined,
      };
      const [rows, total] = await p.$transaction([
        p.lead.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        p.lead.count({ where }),
      ]);
      return {
        leads: rows.map(lead),
        total,
        page,
        totalPages: Math.ceil(total / pageSize) || 1,
      };
    },
    createLead: async ({
      initialNote,
      ...d
    }: Parameters<typeof mockDb.createLead>[0]) => {
      const email = d.email.trim().toLowerCase();
      return p.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${email + "|" + d.courseId},0))`;
        const [existing] = await tx.$queryRaw<
          Lead[]
        >`SELECT * FROM leads WHERE lower(email)=${email} AND "courseId"=${d.courseId} ORDER BY "createdAt" DESC LIMIT 1 FOR UPDATE`;
        if (existing) {
          const notes = [
            note(
              "Repeated inquiry via " + (d.source || "Website Form"),
              "System",
            ),
            ...lead(existing).notes,
          ];
          return lead(
            await tx.lead.update({
              where: { id: existing.id },
              data: {
                notes: notes.map((n) => ({ ...n })) as Prisma.InputJsonValue,
              },
            }),
          );
        }
        return lead(
          await tx.lead.create({
            data: {
              ...d,
              email,
              notes: [note(initialNote || "Inquiry received", "System")],
            },
          }),
        );
      });
    },
    updateLeadStatus: (
      id: string,
      status: LeadData["status"],
      text?: string,
      author = "Counselor Team",
    ) => editLead(id, author, text, status),
    addLeadNote: (id: string, text: string, author = "Counselor") =>
      editLead(id, author, text),
    getStats: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [
        totalLeads,
        newToday,
        totalEnrolled,
        inPipeline,
        activeBatches,
        totalCourses,
        totalBranches,
      ] = await p.$transaction([
        p.lead.count(),
        p.lead.count({ where: { createdAt: { gte: today } } }),
        p.lead.count({ where: { status: "ENROLLED" } }),
        p.lead.count({
          where: { status: { in: ["CONTACTED", "COUNSELING"] } },
        }),
        p.batch.count({ where: { status: { in: ["ONGOING", "UPCOMING"] } } }),
        p.course.count(),
        p.branch.count(),
      ]);
      return {
        totalLeads,
        newToday,
        totalEnrolled,
        inPipeline,
        activeBatches,
        totalCourses,
        totalBranches,
        conversionRate:
          (totalLeads ? (100 * totalEnrolled) / totalLeads : 0).toFixed(1) +
          "%",
      };
    },
    getHeroMedia: async () => ({
      ...INITIAL_HERO_MEDIA,
      ...((await p.siteSetting.findUnique({ where: { key: "heroMedia" } }))
        ?.value as Partial<HeroMediaSettings>),
    }),
    updateHeroMedia: async (d: Partial<HeroMediaSettings>) => {
      await p.$executeRaw`INSERT INTO site_settings (key,value) VALUES ('heroMedia',${JSON.stringify(d)}::jsonb)
        ON CONFLICT (key) DO UPDATE SET value=site_settings.value || EXCLUDED.value`;
      return {
        ...INITIAL_HERO_MEDIA,
        ...((
          await p.siteSetting.findUniqueOrThrow({ where: { key: "heroMedia" } })
        ).value as Partial<HeroMediaSettings>),
      };
    },
  };
}
