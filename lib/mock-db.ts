import {
  MOCK_CATEGORIES,
  MOCK_COURSES,
  MOCK_BRANCHES,
  MOCK_BATCHES,
  MOCK_PLACEMENTS,
  MOCK_REVIEWS,
  INITIAL_LEADS,
  MOCK_FAQS,
  MOCK_INTERVIEW_QUESTIONS,
  MOCK_RESOURCES,
  MOCK_JOB_PORTAL_LINKS,
  LeadData,
  CourseData,
  BranchData,
  CategoryData,
  BatchData,
  PlacementStoryData,
  ReviewData,
  HeroMediaSettings,
  INITIAL_HERO_MEDIA,
  FAQData,
  InterviewQuestionData,
  ResourceData,
  JobPortalLinkData,
  ResourceType,
} from "./mock-data";

// Global in-memory singleton state to preserve data during hot reloads
const globalForDb = globalThis as unknown as {
  mockLeads?: LeadData[];
  mockBatches?: BatchData[];
  mockCourses?: CourseData[];
  mockBranches?: BranchData[];
  mockCategories?: CategoryData[];
  mockPlacements?: PlacementStoryData[];
  mockReviews?: ReviewData[];
  mockHeroMedia?: HeroMediaSettings;
  mockFaqs?: FAQData[];
  mockInterviewQuestions?: InterviewQuestionData[];
  mockResources?: ResourceData[];
  mockJobPortalLinks?: JobPortalLinkData[];
};

if (!globalForDb.mockLeads) {
  globalForDb.mockLeads = [...INITIAL_LEADS];
}
// Always keep preloaded mock courses, categories, batches, placements, and reviews synchronized with mock-data
globalForDb.mockBatches = [...MOCK_BATCHES];
globalForDb.mockCourses = [...MOCK_COURSES];
globalForDb.mockBranches = [...MOCK_BRANCHES];
globalForDb.mockCategories = [...MOCK_CATEGORIES];
globalForDb.mockPlacements = [...MOCK_PLACEMENTS];
globalForDb.mockReviews = [...MOCK_REVIEWS];
if (!globalForDb.mockHeroMedia) {
  globalForDb.mockHeroMedia = { ...INITIAL_HERO_MEDIA };
}
if (!globalForDb.mockFaqs) {
  globalForDb.mockFaqs = [...MOCK_FAQS];
}
if (!globalForDb.mockInterviewQuestions) {
  globalForDb.mockInterviewQuestions = [...MOCK_INTERVIEW_QUESTIONS];
}
if (!globalForDb.mockResources) {
  globalForDb.mockResources = [...MOCK_RESOURCES];
}
if (!globalForDb.mockJobPortalLinks) {
  globalForDb.mockJobPortalLinks = [...MOCK_JOB_PORTAL_LINKS];
}

export const mockDb = {
  // ─── Categories ─────────────────────────────────────────────────────────
  getCategories: async (): Promise<CategoryData[]> => {
    return globalForDb.mockCategories || MOCK_CATEGORIES;
  },

  getCategoryBySlug: async (slug: string): Promise<CategoryData | undefined> => {
    const list = globalForDb.mockCategories || MOCK_CATEGORIES;
    return list.find((c) => c.slug === slug);
  },

  // ─── Courses ────────────────────────────────────────────────────────────
  getCourses: async (categoryId?: string): Promise<CourseData[]> => {
    const list = globalForDb.mockCourses || MOCK_COURSES;
    if (categoryId && categoryId !== "ALL") {
      return list.filter((c) => c.categoryId === categoryId);
    }
    return list;
  },

  getFeaturedCourses: async (): Promise<CourseData[]> => {
    const list = globalForDb.mockCourses || MOCK_COURSES;
    return list.filter((c) => c.isFeatured);
  },

  getCourseBySlug: async (slug: string): Promise<CourseData | undefined> => {
    const list = globalForDb.mockCourses || MOCK_COURSES;
    return list.find((c) => c.slug === slug || c.id === slug);
  },

  getCourseById: async (id: string): Promise<CourseData | undefined> => {
    const list = globalForDb.mockCourses || MOCK_COURSES;
    return list.find((c) => c.id === id);
  },

  createCourse: async (data: Omit<CourseData, "id">): Promise<CourseData> => {
    const newCourse: CourseData = {
      id: `course-${Date.now()}`,
      ...data,
    };
    if (!globalForDb.mockCourses) globalForDb.mockCourses = [];
    globalForDb.mockCourses.unshift(newCourse);
    return newCourse;
  },

  updateCourse: async (id: string, data: Partial<CourseData>): Promise<CourseData | null> => {
    const list = globalForDb.mockCourses || [];
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...data };
    return list[index];
  },

  deleteCourse: async (id: string): Promise<boolean> => {
    const list = globalForDb.mockCourses || [];
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    return true;
  },

  searchCourses: async (query: string): Promise<CourseData[]> => {
    const list = globalForDb.mockCourses || MOCK_COURSES;
    const q = query.toLowerCase().trim();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.highlights.some((h) => h.toLowerCase().includes(q))
    );
  },

  // ─── Branches ───────────────────────────────────────────────────────────
  getBranches: async (): Promise<BranchData[]> => {
    return globalForDb.mockBranches || MOCK_BRANCHES;
  },

  getBranchById: async (id: string): Promise<BranchData | undefined> => {
    const list = globalForDb.mockBranches || MOCK_BRANCHES;
    return list.find((b) => b.id === id);
  },

  getBranchBySlug: async (slug: string): Promise<BranchData | undefined> => {
    const list = globalForDb.mockBranches || MOCK_BRANCHES;
    return list.find((b) => b.slug === slug || b.id === slug);
  },

  createBranch: async (data: Omit<BranchData, "id">): Promise<BranchData> => {
    const newBranch: BranchData = {
      id: `branch-${Date.now()}`,
      ...data,
    };
    if (!globalForDb.mockBranches) globalForDb.mockBranches = [];
    globalForDb.mockBranches.push(newBranch);
    return newBranch;
  },

  updateBranch: async (id: string, data: Partial<BranchData>): Promise<BranchData | null> => {
    const list = globalForDb.mockBranches || [];
    const index = list.findIndex((b) => b.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...data };
    return list[index];
  },

  deleteBranch: async (id: string): Promise<boolean> => {
    const list = globalForDb.mockBranches || [];
    const index = list.findIndex((b) => b.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    return true;
  },

  // ─── Batches ────────────────────────────────────────────────────────────
  getBatches: async (branchId?: string, courseId?: string): Promise<BatchData[]> => {
    let list = globalForDb.mockBatches || MOCK_BATCHES;
    if (branchId && branchId !== "ALL") {
      list = list.filter((b) => b.branchId === branchId);
    }
    if (courseId && courseId !== "ALL") {
      list = list.filter((b) => b.courseId === courseId);
    }
    return list;
  },

  createBatch: async (data: Omit<BatchData, "id">): Promise<BatchData> => {
    const newBatch: BatchData = {
      id: `batch-${Date.now()}`,
      ...data,
    };
    if (!globalForDb.mockBatches) globalForDb.mockBatches = [];
    globalForDb.mockBatches.unshift(newBatch);
    return newBatch;
  },

  updateBatch: async (id: string, data: Partial<BatchData>): Promise<BatchData | null> => {
    const list = globalForDb.mockBatches || [];
    const index = list.findIndex((b) => b.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...data };
    return list[index];
  },

  deleteBatch: async (id: string): Promise<boolean> => {
    const list = globalForDb.mockBatches || [];
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    return true;
  },

  // ─── Placement Stories ──────────────────────────────────────────────────
  getPlacements: async (): Promise<PlacementStoryData[]> => {
    return globalForDb.mockPlacements || MOCK_PLACEMENTS;
  },

  // ─── Student Reviews & Moderation ───────────────────────────────────────
  getReviews: async (params?: {
    courseId?: string;
    branchId?: string;
    status?: string;
    rating?: number;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ reviews: ReviewData[]; total: number; page: number; totalPages: number }> => {
    let list = [...(globalForDb.mockReviews || [])];

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.body.toLowerCase().includes(q) ||
          r.studentEmail.toLowerCase().includes(q)
      );
    }

    if (params?.courseId && params.courseId !== "ALL") {
      list = list.filter((r) => r.courseId === params.courseId);
    }

    if (params?.branchId && params.branchId !== "ALL") {
      list = list.filter((r) => r.branchId === params.branchId);
    }

    if (params?.status && params.status !== "ALL") {
      list = list.filter((r) => r.status === params.status);
    }

    if (params?.rating && params.rating > 0) {
      list = list.filter((r) => r.rating === params.rating);
    }

    const total = list.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginated = list.slice(startIndex, startIndex + pageSize);

    return {
      reviews: paginated,
      total,
      page,
      totalPages,
    };
  },

  getApprovedReviews: async (courseId?: string, branchId?: string): Promise<ReviewData[]> => {
    let list = (globalForDb.mockReviews || []).filter((r) => r.status === "APPROVED");
    if (courseId && courseId !== "ALL") {
      list = list.filter((r) => r.courseId === courseId);
    }
    if (branchId && branchId !== "ALL") {
      list = list.filter((r) => r.branchId === branchId);
    }
    return list;
  },

  createReview: async (data: {
    studentName: string;
    studentEmail: string;
    courseId: string;
    branchId: string;
    rating: number;
    title: string;
    body: string;
    completionYear?: string;
  }): Promise<ReviewData> => {
    const now = new Date().toISOString();
    const newReview: ReviewData = {
      id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentName: data.studentName.trim(),
      studentEmail: data.studentEmail.toLowerCase().trim(),
      courseId: data.courseId,
      branchId: data.branchId,
      rating: Math.min(5, Math.max(1, data.rating)),
      title: data.title.trim(),
      body: data.body.trim(),
      completionYear: data.completionYear || new Date().getFullYear().toString(),
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    if (!globalForDb.mockReviews) globalForDb.mockReviews = [];
    globalForDb.mockReviews.unshift(newReview);
    return newReview;
  },

  updateReviewStatus: async (
    id: string,
    status: ReviewData["status"],
    adminNote?: string
  ): Promise<ReviewData | null> => {
    const list = globalForDb.mockReviews || [];
    const review = list.find((r) => r.id === id);
    if (!review) return null;

    review.status = status;
    if (adminNote !== undefined) {
      review.adminNote = adminNote;
    }
    review.updatedAt = new Date().toISOString();
    return review;
  },

  deleteReview: async (id: string): Promise<boolean> => {
    const list = globalForDb.mockReviews || [];
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    return true;
  },

  getReviewStats: async () => {
    const reviews = globalForDb.mockReviews || [];
    const approved = reviews.filter((r) => r.status === "APPROVED");
    const pending = reviews.filter((r) => r.status === "PENDING");
    const rejected = reviews.filter((r) => r.status === "REJECTED");

    const totalApproved = approved.length;
    const sumRatings = approved.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = totalApproved > 0 ? (sumRatings / totalApproved).toFixed(1) : "5.0";

    const ratingDistribution = {
      5: approved.filter((r) => r.rating === 5).length,
      4: approved.filter((r) => r.rating === 4).length,
      3: approved.filter((r) => r.rating === 3).length,
      2: approved.filter((r) => r.rating === 2).length,
      1: approved.filter((r) => r.rating === 1).length,
    };

    return {
      total: reviews.length,
      approved: totalApproved,
      pending: pending.length,
      rejected: rejected.length,
      averageRating: avgRating,
      ratingDistribution,
    };
  },

  // ─── Leads & CRM ────────────────────────────────────────────────────────
  getLeads: async (params?: {
    search?: string;
    status?: string;
    branchId?: string;
    courseId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ leads: LeadData[]; total: number; page: number; totalPages: number }> => {
    let list = [...(globalForDb.mockLeads || [])];

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q)
      );
    }

    if (params?.status && params.status !== "ALL") {
      list = list.filter((l) => l.status === params.status);
    }

    if (params?.branchId && params.branchId !== "ALL") {
      list = list.filter((l) => l.branchId === params.branchId);
    }

    if (params?.courseId && params.courseId !== "ALL") {
      list = list.filter((l) => l.courseId === params.courseId);
    }

    const total = list.length;
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginated = list.slice(startIndex, startIndex + pageSize);

    return {
      leads: paginated,
      total,
      page,
      totalPages,
    };
  },

  getLeadById: async (id: string): Promise<LeadData | undefined> => {
    const list = globalForDb.mockLeads || [];
    return list.find((l) => l.id === id);
  },

  createLead: async (data: {
    fullName: string;
    email: string;
    phone: string;
    branchId: string;
    courseId: string;
    source?: string;
    initialNote?: string;
  }): Promise<LeadData> => {
    const list = globalForDb.mockLeads || [];

    // Check for recent duplicate (same email & course within 24 hours)
    const existing = list.find(
      (l) =>
        l.email.toLowerCase() === data.email.toLowerCase() &&
        l.courseId === data.courseId
    );

    const now = new Date().toISOString();
    const newLead: LeadData = {
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      branchId: data.branchId,
      courseId: data.courseId,
      status: "NEW",
      source: data.source || "Website Form",
      notes: [
        {
          id: `note-${Date.now()}`,
          timestamp: now,
          text: data.initialNote || `Inquiry submitted via ${data.source || "Website Form"}.`,
          author: "System (Lead Engine)",
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    if (existing) {
      existing.notes.unshift({
        id: `note-${Date.now()}`,
        timestamp: now,
        text: `Repeated inquiry received for same course via ${data.source || "Website Form"}.`,
        author: "System Duplicate Detector",
      });
      existing.updatedAt = now;
      return existing;
    }

    list.unshift(newLead);
    globalForDb.mockLeads = list;
    return newLead;
  },

  updateLeadStatus: async (
    leadId: string,
    newStatus: LeadData["status"],
    noteText?: string,
    author: string = "Counselor Team"
  ): Promise<LeadData | null> => {
    const list = globalForDb.mockLeads || [];
    const lead = list.find((l) => l.id === leadId);
    if (!lead) return null;

    const oldStatus = lead.status;
    lead.status = newStatus;
    lead.updatedAt = new Date().toISOString();

    if (noteText || oldStatus !== newStatus) {
      lead.notes.unshift({
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString(),
        text: noteText || `Status updated from ${oldStatus} to ${newStatus}`,
        author,
      });
    }

    return lead;
  },

  addLeadNote: async (
    leadId: string,
    text: string,
    author: string = "Counselor"
  ): Promise<LeadData | null> => {
    const list = globalForDb.mockLeads || [];
    const lead = list.find((l) => l.id === leadId);
    if (!lead) return null;

    lead.notes.unshift({
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      text,
      author,
    });
    lead.updatedAt = new Date().toISOString();

    return lead;
  },

  getStats: async () => {
    const leads = globalForDb.mockLeads || [];
    const batches = globalForDb.mockBatches || [];
    const courses = globalForDb.mockCourses || [];
    const branches = globalForDb.mockBranches || [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const totalLeads = leads.length;
    const newToday = leads.filter((l) => l.createdAt >= todayStart).length;
    const enrolled = leads.filter((l) => l.status === "ENROLLED").length;
    const contacted = leads.filter((l) => l.status === "CONTACTED" || l.status === "COUNSELING").length;
    const activeBatches = batches.filter((b) => b.status === "UPCOMING" || b.status === "ONGOING").length;
    const conversionRate = totalLeads > 0 ? ((enrolled / totalLeads) * 100).toFixed(1) : "0.0";

    return {
      totalLeads,
      newToday,
      totalEnrolled: enrolled,
      inPipeline: contacted,
      activeBatches,
      conversionRate: `${conversionRate}%`,
      totalCourses: courses.length,
      totalBranches: branches.length,
    };
  },

  // ─── Hero Video & Media Settings ────────────────────────────────────────
  getHeroMedia: async (): Promise<HeroMediaSettings> => {
    return globalForDb.mockHeroMedia || { ...INITIAL_HERO_MEDIA };
  },

  updateHeroMedia: async (data: Partial<HeroMediaSettings>): Promise<HeroMediaSettings> => {
    const current = globalForDb.mockHeroMedia || { ...INITIAL_HERO_MEDIA };
    globalForDb.mockHeroMedia = { ...current, ...data };
    return globalForDb.mockHeroMedia;
  },

  // ─── FAQs ───────────────────────────────────────────────────────────────
  getFaqs: async (courseId?: string): Promise<FAQData[]> => {
    const list = globalForDb.mockFaqs || MOCK_FAQS;
    if (courseId) {
      return list.filter((f) => f.courseId === courseId || f.courseId === null);
    }
    return list;
  },

  // ─── Interview Questions ────────────────────────────────────────────────
  getInterviewQuestions: async (courseId?: string, category?: string): Promise<InterviewQuestionData[]> => {
    let list = globalForDb.mockInterviewQuestions || MOCK_INTERVIEW_QUESTIONS;
    if (courseId) {
      list = list.filter((q) => q.courseId === courseId);
    }
    if (category && category !== "ALL") {
      list = list.filter((q) => q.category.toLowerCase() === category.toLowerCase());
    }
    return list;
  },

  // ─── Resources ──────────────────────────────────────────────────────────
  getResources: async (type?: ResourceType, courseId?: string): Promise<ResourceData[]> => {
    let list = globalForDb.mockResources || MOCK_RESOURCES;
    if (type) {
      list = list.filter((r) => r.type === type);
    }
    if (courseId) {
      list = list.filter((r) => r.courseId === courseId || r.courseId === null);
    }
    return list;
  },

  // ─── Job Portal Links ───────────────────────────────────────────────────
  getJobPortalLinks: async (roleFilter?: string): Promise<JobPortalLinkData[]> => {
    let list = globalForDb.mockJobPortalLinks || MOCK_JOB_PORTAL_LINKS;
    if (roleFilter && roleFilter !== "ALL") {
      list = list.filter((j) => j.roleFilter === roleFilter);
    }
    return list;
  },
};
