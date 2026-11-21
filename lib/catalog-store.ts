import type {
  PrismaClient,
  Course,
  Branch,
  Batch,
  Review,
  Prisma,
} from "@prisma/client";
import type {
  CourseData,
  BranchData,
  BatchData,
  ReviewData,
} from "./mock-data";
import type { mockDb } from "./mock-db";

function course(row: Course): CourseData {
  const { syllabusJson, syllabusModules, createdAt, updatedAt, ...fields } =
    row;
  return {
    ...fields,
    syllabus: (syllabusJson ?? []) as unknown as CourseData["syllabus"],
    syllabusModules: (syllabusModules ??
      undefined) as CourseData["syllabusModules"],
    brochureUrl: row.brochureUrl ?? undefined,
    expectedSalary: row.expectedSalary ?? "",
    enrolledCount: row.enrolledCount ?? 0,
    rating: row.rating ?? 0,
  };
}
function branch(row: Branch): BranchData {
  return {
    ...row,
    email: row.email ?? "",
    timing: row.timing ?? "",
    landmark: row.landmark ?? "",
    mapEmbedUrl: row.mapEmbedUrl ?? "",
  };
}
function batch({ createdAt, ...row }: Batch): BatchData {
  return {
    ...row,
    instructorExp: row.instructorExp ?? "",
    startDate: row.startDate.toISOString().slice(0, 10),
  };
}
function review(row: Review): ReviewData {
  return {
    ...row,
    status: row.status as ReviewData["status"],
    adminNote: row.adminNote ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
function courseFields(d: Partial<CourseData>) {
  return {
    title: d.title,
    slug: d.slug,
    categoryId: d.categoryId,
    summary: d.summary,
    duration: d.duration,
    mode: d.mode,
    price: d.price,
    expectedSalary: d.expectedSalary,
    rating: d.rating,
    enrolledCount: d.enrolledCount,
    isFeatured: d.isFeatured,
    highlights: d.highlights,
    hiringPartners: d.hiringPartners,
    brochureUrl: d.brochureUrl,
    syllabusJson: d.syllabus as unknown as Prisma.InputJsonValue | undefined,
    syllabusModules: d.syllabusModules,
  };
}
function batchFields(d: Partial<BatchData>) {
  return {
    courseId: d.courseId,
    branchId: d.branchId,
    instructorName: d.instructorName,
    instructorExp: d.instructorExp,
    startDate: d.startDate ? new Date(d.startDate) : undefined,
    timing: d.timing,
    maxSeats: d.maxSeats,
    seatsLeft: d.seatsLeft,
    status: d.status,
  };
}
function branchFields(d: Partial<BranchData>) {
  return {
    name: d.name,
    slug: d.slug,
    address: d.address,
    city: d.city,
    phone: d.phone,
    whatsapp: d.whatsapp,
    email: d.email,
    timing: d.timing,
    landmark: d.landmark,
    mapEmbedUrl: d.mapEmbedUrl,
  };
}
const filter = (value?: string) => (value === "ALL" ? undefined : value);

export function catalogStore(p: PrismaClient) {
  async function remove(
    kind: "course" | "branch",
    id: string,
    replacement?: string,
  ) {
    if (!id || id === replacement) throw new Error("Invalid branch selection.");
    return p.$transaction(
      async (tx) => {
        const courseId = id,
          branchId = id;
        if (kind === "branch" && replacement) {
          await tx.branch.findUniqueOrThrow({ where: { id } });
          await tx.branch.findUniqueOrThrow({ where: { id: replacement } });
          await tx.batch.updateMany({
            where: { branchId: id },
            data: { branchId: replacement },
          });
          await tx.lead.updateMany({
            where: { branchId: id },
            data: { branchId: replacement },
          });
          await tx.user.updateMany({
            where: { branchId: id },
            data: { branchId: replacement },
          });
          await tx.review.updateMany({
            where: { branchId: id },
            data: { branchId: replacement },
          });
          await tx.placementStory.updateMany({
            where: { branchId: id },
            data: { branchId: replacement },
          });
        }
        const dependencies =
          kind === "course"
            ? [
                tx.batch.count({ where: { courseId } }),
                tx.lead.count({ where: { courseId } }),
                tx.placementStory.count({ where: { courseId } }),
                tx.review.count({ where: { courseId } }),
                tx.fAQ.count({ where: { courseId } }),
                tx.resource.count({ where: { courseId } }),
                tx.interviewQuestion.count({ where: { courseId } }),
              ]
            : [
                tx.batch.count({ where: { branchId } }),
                tx.lead.count({ where: { branchId } }),
                tx.user.count({ where: { branchId } }),
                tx.review.count({ where: { branchId } }),
                tx.placementStory.count({ where: { branchId } }),
              ];
        const counts = await Promise.all(dependencies);
        if (kind === "branch" && counts.some((count) => count > 0)) {
          const labels = [
            "Batches",
            "Enquiries",
            "Staff accounts",
            "Reviews",
            "Placement stories",
          ];
          throw new Error(
            "LINKED_BRANCH:" +
              counts
                .map((count, index) =>
                  count ? labels[index] + ": " + count : "",
                )
                .filter(Boolean)
                .join(", "),
          );
        }
        if (counts.some((count) => count > 0)) throw new Error("LINKED_RECORD");
        const result =
          kind === "course"
            ? await tx.course.deleteMany({ where: { id } })
            : await tx.branch.deleteMany({ where: { id } });
        return result.count === 1;
      },
      { isolationLevel: "Serializable", timeout: 15000 },
    );
  }
  return {
    getCategories: async () =>
      (await p.category.findMany()).map((r) => ({
        ...r,
        description: r.description ?? "",
      })),
    getCourses: async (categoryId?: string) =>
      (
        await p.course.findMany({
          where: { categoryId: filter(categoryId) },
          orderBy: { title: "asc" },
        })
      ).map(course),
    getFeaturedCourses: async () =>
      (await p.course.findMany({ where: { isFeatured: true } })).map(course),
    getCourseById: async (id: string) => {
      const r = await p.course.findUnique({ where: { id } });
      return r ? course(r) : undefined;
    },
    getCourseBySlug: async (slug: string) => {
      const r = await p.course.findUnique({ where: { slug } });
      return r ? course(r) : undefined;
    },
    searchCourses: async (query: string) =>
      (
        await p.course.findMany({
          where: {
            OR: ["title", "summary", "slug"].map((key) => ({
              [key]: { contains: query, mode: "insensitive" },
            })),
          },
        })
      ).map(course),
    createCourse: async (d: Omit<CourseData, "id">) =>
      course(
        await p.course.create({
          data: courseFields(d) as Prisma.CourseUncheckedCreateInput,
        }),
      ),
    updateCourse: async (id: string, d: Partial<CourseData>) =>
      course(await p.course.update({ where: { id }, data: courseFields(d) })),
    deleteCourse: async (id: string) => remove("course", id),
    getBranches: async () =>
      (await p.branch.findMany({ orderBy: { name: "asc" } })).map(branch),
    getBranchById: async (id: string) => {
      const r = await p.branch.findUnique({ where: { id } });
      return r ? branch(r) : undefined;
    },
    getBranchBySlug: async (slug: string) => {
      const r = await p.branch.findUnique({ where: { slug } });
      return r ? branch(r) : undefined;
    },
    createBranch: async (d: Omit<BranchData, "id">) =>
      branch(
        await p.branch.create({
          data: branchFields(d) as Prisma.BranchCreateInput,
        }),
      ),
    updateBranch: async (id: string, d: Partial<BranchData>) =>
      branch(await p.branch.update({ where: { id }, data: branchFields(d) })),
    deleteBranch: async (id: string, replacement?: string) =>
      remove("branch", id, replacement),
    getBatches: async (branchId?: string, courseId?: string) =>
      (
        await p.batch.findMany({
          where: { branchId: filter(branchId), courseId: filter(courseId) },
          orderBy: { startDate: "asc" },
        })
      ).map(batch),
    createBatch: async (d: Omit<BatchData, "id">) =>
      batch(
        await p.batch.create({
          data: batchFields(d) as Prisma.BatchUncheckedCreateInput,
        }),
      ),
    updateBatch: async (id: string, d: Partial<BatchData>) =>
      batch(await p.batch.update({ where: { id }, data: batchFields(d) })),
    deleteBatch: async (id: string) =>
      (await p.batch.deleteMany({ where: { id } })).count === 1,
    getApprovedReviews: async (courseId?: string, branchId?: string) =>
      (
        await p.review.findMany({
          where: {
            status: "APPROVED",
            courseId: filter(courseId),
            branchId: filter(branchId),
          },
        })
      ).map(review),
    getReviews: async (
      params: Parameters<typeof mockDb.getReviews>[0] = {},
    ) => {
      const {
        courseId,
        branchId,
        status,
        rating,
        search,
        page = 1,
        pageSize = 10,
      } = params;
      const where: Prisma.ReviewWhereInput = {
        courseId: filter(courseId),
        branchId: filter(branchId),
        status: filter(status),
        rating: rating || undefined,
        OR: search
          ? ["studentName", "studentEmail", "title", "body"].map((key) => ({
              [key]: { contains: search, mode: "insensitive" },
            }))
          : undefined,
      };
      const [rows, total] = await p.$transaction([
        p.review.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        p.review.count({ where }),
      ]);
      return {
        reviews: rows.map(review),
        total,
        page,
        totalPages: Math.ceil(total / pageSize) || 1,
      };
    },
    getReviewStats: async () => {
      const groups = await p.review.groupBy({
        by: ["status", "rating"],
        _count: true,
      });
      const count = (status: string, rating?: number) =>
        groups
          .filter(
            (g) =>
              g.status === status &&
              (rating === undefined || g.rating === rating),
          )
          .reduce((n, g) => n + g._count, 0);
      const approved = count("APPROVED");
      return {
        total: groups.reduce((n, g) => n + g._count, 0),
        approved,
        pending: count("PENDING"),
        rejected: count("REJECTED"),
        averageRating: approved
          ? (
              groups.reduce(
                (n, g) =>
                  n + (g.status === "APPROVED" ? g.rating * g._count : 0),
                0,
              ) / approved
            ).toFixed(1)
          : "5.0",
        ratingDistribution: {
          1: count("APPROVED", 1),
          2: count("APPROVED", 2),
          3: count("APPROVED", 3),
          4: count("APPROVED", 4),
          5: count("APPROVED", 5),
        },
      };
    },
    createReview: async (d: Parameters<typeof mockDb.createReview>[0]) =>
      review(
        await p.review.create({
          data: {
            ...d,
            status: "PENDING",
            completionYear:
              d.completionYear || String(new Date().getFullYear()),
          },
        }),
      ),
    updateReviewStatus: async (
      id: string,
      status: ReviewData["status"],
      adminNote?: string,
    ) =>
      review(
        await p.review.update({ where: { id }, data: { status, adminNote } }),
      ),
    deleteReview: async (id: string) =>
      (await p.review.deleteMany({ where: { id } })).count === 1,
  };
}
