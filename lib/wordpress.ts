import {
  CourseData,
  BranchData,
  CategoryData,
  LeadData,
  PlacementStoryData,
  ReviewData,
  BatchData,
  HeroMediaSettings,
  MOCK_COURSES,
  MOCK_BRANCHES,
  MOCK_CATEGORIES,
  MOCK_PLACEMENTS,
  MOCK_REVIEWS,
  MOCK_BATCHES,
  MOCK_HIRING_PARTNERS,
  INITIAL_HERO_MEDIA,
  FAQData,
  InterviewQuestionData,
  ResourceData,
  JobPortalLinkData,
  ResourceType,
  MOCK_FAQS,
  MOCK_INTERVIEW_QUESTIONS,
  MOCK_RESOURCES,
  MOCK_JOB_PORTAL_LINKS,
} from "@/lib/mock-data";
import { decodeHtml } from "@/lib/utils";

export interface WordPressRendered {
  rendered: string;
  protected?: boolean;
}

export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: WordPressRendered;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WordPressRendered;
  content: WordPressRendered;
  excerpt: WordPressRendered;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, any>;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text?: string;
      media_details?: {
        sizes?: Record<string, { source_url: string }>;
      };
    }>;
  };
}

export interface WordPressPost extends WordPressPage {
  categories: number[];
  tags: number[];
}

export interface PlatformSettings {
  theme_preset?: string;
  primary_color?: string;
  accent_color?: string;
  dark_color?: string;
  font_family?: string;
  border_radius?: string;
  seo_site_title?: string;
  seo_meta_desc?: string;
  seo_keywords?: string;
  seo_canonical_url?: string;
  seo_og_image?: string;
  seo_twitter_handle?: string;
  seo_ga_id?: string;
  seo_gtm_id?: string;
  seo_robots?: string;
  hero_badge?: string;
  hero_headline?: string;
  hero_subtitle?: string;
  hero_val_prop_1?: string;
  hero_val_prop_2?: string;
  hero_val_prop_3?: string;
  hero_youtube_url?: string;
  hero_video_title?: string;
  hero_video_subtitle?: string;
  hero_video_badge?: string;
  stat_engineers?: string;
  stat_engineers_label?: string;
  stat_branches_label?: string;
  stat_placement?: string;
  stat_placement_label?: string;
  stat_rating?: string;
  stat_rating_label?: string;
  hiring_network_title?: string;
  hiring_partners?: string;
  sec_courses_badge?: string;
  sec_courses_title?: string;
  sec_courses_btn_text?: string;
  sec_placements_badge?: string;
  sec_placements_title?: string;
  sec_placements_btn_text?: string;
  sec_reviews_badge?: string;
  sec_reviews_title?: string;
  sec_reviews_btn_text?: string;
  sec_branches_badge?: string;
  sec_branches_title?: string;
  sec_branches_btn_text?: string;
  cta_title?: string;
  cta_subtitle?: string;
  cta_btn1_text?: string;
  cta_btn2_text?: string;
  brand_name_1?: string;
  brand_name_2?: string;
  brand_tagline?: string;
  navbar_badge_1?: string;
  navbar_badge_2?: string;
  navbar_badge_3?: string;
  navbar_helpline_phone?: string;
  footer_about_text?: string;
  footer_badge_1?: string;
  footer_badge_2?: string;
  footer_phone?: string;
  footer_email?: string;
  footer_hours?: string;
  footer_copyright?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_youtube?: string;
  social_twitter?: string;
  about_hero_badge?: string;
  about_hero_title?: string;
  about_hero_subtitle?: string;
  about_mission_title?: string;
  about_mission_text?: string;
  about_vision_title?: string;
  about_vision_text?: string;
  about_pillars_json?: string;
  about_trainers_json?: string;
  about_milestones_json?: string;
  faq_items_json?: string;

  // Secondary Scroll Animation (Section 2)
}

export interface AllPlatformDataResponse {
  categories: CategoryData[];
  courses: CourseData[];
  branches: BranchData[];
  leads?: LeadData[];
  placements: PlacementStoryData[];
  reviews: ReviewData[];
  batches: BatchData[];
  faqs?: FAQData[];
  interviewQuestions?: InterviewQuestionData[];
  resources?: ResourceData[];
  jobPortalLinks?: JobPortalLinkData[];
  settings: PlatformSettings;
}

const WP_API_ROOT =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "http://seeyam.local/wp-json/wp/v2";

// Base host without /wp/v2
const WP_HOST = WP_API_ROOT.replace(/\/wp\/v2\/?$/, "");

/* -------------------------------------------------------------------------- */
/* ALL DATA IN ONE FAST BUNDLE                                                */
/* -------------------------------------------------------------------------- */

export async function getAllPlatformData(): Promise<AllPlatformDataResponse> {
  const url = `${WP_HOST}/seeyam/v1/all-data`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 }, // 30s cache for fast live updates
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      console.warn(`[WP API] /seeyam/v1/all-data returned status ${res.status}. Using fallback.`);
      return getFallbackPlatformData();
    }

    const json = await res.json();
    if (json && json.success && json.data) {
      const rawCategories: CategoryData[] = json.data.categories?.length ? json.data.categories : MOCK_CATEGORIES;
      const cleanCategories = rawCategories.map((c) => ({
        ...c,
        name: decodeHtml(c.name),
      }));

      return {
        categories: cleanCategories,
        courses: (json.data.courses?.length ? json.data.courses : MOCK_COURSES).map((course: CourseData) => ({
          ...course,
          title: decodeHtml(course.title),
          summary: decodeHtml(course.summary),
        })),
        branches: (json.data.branches?.length ? json.data.branches : MOCK_BRANCHES).map((branch: BranchData) => ({
          ...branch,
          name: decodeHtml(branch.name),
          address: decodeHtml(branch.address),
        })),
        leads: json.data.leads || [],
        placements: json.data.placements?.length ? json.data.placements : MOCK_PLACEMENTS,
        reviews: json.data.reviews?.length ? json.data.reviews : MOCK_REVIEWS,
        batches: json.data.batches?.length ? json.data.batches : MOCK_BATCHES,
        faqs: json.data.faqs?.length ? json.data.faqs : MOCK_FAQS,
        interviewQuestions: json.data.interviewQuestions?.length ? json.data.interviewQuestions : MOCK_INTERVIEW_QUESTIONS,
        resources: json.data.resources?.length ? json.data.resources : MOCK_RESOURCES,
        jobPortalLinks: json.data.jobPortalLinks?.length ? json.data.jobPortalLinks : MOCK_JOB_PORTAL_LINKS,
        settings: json.data.settings || getDefaultSettings(),
      };
    }
  } catch (error) {
    console.warn(`[WP API] Failed to fetch all-data from ${url}:`, error);
  }

  return getFallbackPlatformData();
}

/* -------------------------------------------------------------------------- */
/* WORDPRESS LEAD CRM API INTEGRATION                                         */
/* -------------------------------------------------------------------------- */

export async function createWordPressLead(data: {
  fullName: string;
  email: string;
  phone: string;
  courseId: string;
  branchId: string;
  source?: string;
  initialNote?: string;
}): Promise<LeadData | null> {
  try {
    const res = await fetch(`${WP_HOST}/seeyam/v1/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.lead) return json.lead;
    }
  } catch (err) {
    console.warn("[WP API] Failed to push lead to WordPress:", err);
  }
  return null;
}

export async function getWordPressLeads(): Promise<LeadData[]> {
  try {
    const res = await fetch(`${WP_HOST}/seeyam/v1/leads`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.leads) return json.leads;
    }
  } catch (err) {
    console.warn("[WP API] Failed to fetch leads from WordPress:", err);
  }
  return [];
}

export async function updateWordPressLeadStatus(
  leadId: string,
  newStatus: string,
  note?: string,
  author?: string
): Promise<boolean> {
  try {
    const res = await fetch(`${WP_HOST}/seeyam/v1/leads/${leadId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, note, author }),
    });
    return res.ok;
  } catch (err) {
    console.warn("[WP API] Failed to update lead status in WordPress:", err);
    return false;
  }
}

export async function addWordPressLeadNote(
  leadId: string,
  text: string,
  author?: string
): Promise<boolean> {
  try {
    const res = await fetch(`${WP_HOST}/seeyam/v1/leads/${leadId}/note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, author }),
    });
    return res.ok;
  } catch (err) {
    console.warn("[WP API] Failed to add lead note in WordPress:", err);
    return false;
  }
}

function getDefaultSettings(): PlatformSettings {
  return {
    theme_preset: "default",
    primary_color: "#2563eb",
    accent_color: "#d4af37",
    dark_color: "#071938",
    font_family: "Inter",
    border_radius: "24px",
    seo_site_title: "Seeyam Technologies | Premier IT Training, Certification & 100% Placement Institute",
    seo_meta_desc: "Accelerate your IT career with Seeyam Technologies. Master Full Stack Java/Python, Cloud DevOps, AI & Data Science, and Software Testing with 100% placement assistance across Chennai, Bangalore & Hyderabad.",
    seo_keywords: "IT Training Institute, Full Stack Java Training, AWS DevOps Certification, Data Science AI Course, 100% Placement Guarantee",
    seo_canonical_url: "http://localhost:3000",
    seo_og_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    seo_twitter_handle: "@seeyamtech",
    seo_ga_id: "",
    seo_gtm_id: "",
    seo_robots: "index, follow",
    hero_badge: "Ranked #1 IT Training & 100% Placement Institute",
    hero_headline: "Build Your Future with Industry-Ready Tech Skills.",
    hero_subtitle:
      "Master Full Stack Development, Cloud DevOps, AI & Data Science, and QA Automation. Learn directly from Principal IT Architects with guaranteed placement drives & live corporate capstone projects.",
    hero_val_prop_1: "100% Placement Record",
    hero_val_prop_2: "Real-time Enterprise Labs",
    hero_val_prop_3: "Weekday & Weekend Batches",
    hero_youtube_url: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    hero_video_title: "Inside Seeyam Technologies — Campus Tour & Student Transformations",
    hero_video_subtitle:
      "Watch how our students master real-world software development, cloud infrastructure, and land top-tier tech jobs.",
    hero_video_badge: "Featured Masterclass & Tour",
    stat_engineers: "50,000+",
    stat_engineers_label: "Engineers Trained",
    stat_branches_label: "Campus Locations",
    stat_placement: "100%",
    stat_placement_label: "Placement Assistance",
    stat_rating: "4.9★",
    stat_rating_label: "Student Rating",
    hiring_network_title: "Top Hiring Recruiter Network:",
    hiring_partners:
      "Amazon, Microsoft, Google, Zoho, TCS, Infosys, Deloitte, Accenture, Cognizant",
    sec_courses_badge: "Trending Masterclasses",
    sec_courses_title: "Featured IT Certification Programs",
    sec_courses_btn_text: "View All Courses",
    sec_placements_badge: "100% Placement Assurance",
    sec_placements_title: "Recent Alumni Success Stories",
    sec_placements_btn_text: "View All Placements",
    sec_reviews_badge: "Verified Student Feedback",
    sec_reviews_title: "What Our 50,000+ Alumni Say",
    sec_reviews_btn_text: "Read All Reviews",
    sec_branches_badge: "Campuses Across South India",
    sec_branches_title: "Find Your Nearest Campus",
    sec_branches_btn_text: "View All Branches",
    cta_title: "Ready to Launch Your IT Career?",
    cta_subtitle:
      "Join 50,000+ successful graduates who transformed their careers with Seeyam Technologies. Book a free 1-on-1 career counseling session today.",
    cta_btn1_text: "Explore All Courses",
    cta_btn2_text: "Book Free Counseling",
    brand_name_1: "SEEYAM",
    brand_name_2: "TECHNOLOGIES",
    brand_tagline: "IT Training • Certification • Placement",
    navbar_badge_1: "ISO 9001:2015 Certified Institute",
    navbar_badge_2: "NASSCOM Aligned Tech Curriculum",
    navbar_badge_3: "100% Placement Assurance",
    navbar_helpline_phone: "+91 89399 15577",
    footer_about_text:
      "Empowering engineers and tech graduates with practical, production-grade IT training, masterclasses, and dedicated placement support across Chennai, Bangalore, and Hyderabad.",
    footer_badge_1: "ISO 9001:2015 Certified",
    footer_badge_2: "NASSCOM Aligned",
    footer_phone: "+91 89399 15577",
    footer_email: "info@seeyamtechnologies.com",
    footer_hours: "Mon - Sun: 7:00 AM - 9:00 PM",
    footer_copyright: "Seeyam Technologies Pvt. Ltd. All rights reserved.",
    social_facebook: "https://facebook.com/seeyamtech",
    social_instagram: "https://instagram.com/seeyamtech",
    social_linkedin: "https://linkedin.com/company/seeyamtech",
    social_youtube: "https://youtube.com/@seeyamtech",
    social_twitter: "https://twitter.com/seeyamtech",
    about_hero_badge: "Empowering Tech Careers Since 2014",
    about_hero_title: "Bridging the Gap Between Academics & Tech Industry Excellence",
    about_hero_subtitle:
      "Seeyam Technologies was built on one fundamental promise: deliver hands-on, production-grade IT training mentored by senior corporate architects, paired with guaranteed placement drives.",
    about_mission_title: "Our Core Mission",
    about_mission_text:
      "To transform aspiring engineers, non-IT graduates, and upskilling professionals into job-ready software developers, DevOps practitioners, and AI engineers through real-time industry projects, rigorous code reviews, and guaranteed placement drives.",
    about_vision_title: "Our Long-term Vision",
    about_vision_text:
      "To be India's premier center of excellence for emerging technologies — providing accessible, enterprise-grade education with high-compute lab infrastructure, industry-recognized global certifications, and lifelong career growth networks.",

    // Scroll Animation 2 (Secondary)
  };
}

function getFallbackPlatformData(): AllPlatformDataResponse {
  return {
    categories: MOCK_CATEGORIES,
    courses: MOCK_COURSES,
    branches: MOCK_BRANCHES,
    placements: MOCK_PLACEMENTS,
    reviews: MOCK_REVIEWS,
    batches: MOCK_BATCHES,
    faqs: MOCK_FAQS,
    interviewQuestions: MOCK_INTERVIEW_QUESTIONS,
    resources: MOCK_RESOURCES,
    jobPortalLinks: MOCK_JOB_PORTAL_LINKS,
    settings: getDefaultSettings(),
  };
}

/* -------------------------------------------------------------------------- */
/* SPECIFIC ENTITY FETCHERS                                                   */
/* -------------------------------------------------------------------------- */

export async function getPlatformFaqs(courseId?: string): Promise<FAQData[]> {
  const data = await getAllPlatformData();
  const list = data.faqs || MOCK_FAQS;
  if (courseId) {
    return list.filter((f) => f.courseId === courseId || f.courseId === null);
  }
  return list;
}

export async function getPlatformInterviewQuestions(
  courseId?: string,
  category?: string
): Promise<InterviewQuestionData[]> {
  const data = await getAllPlatformData();
  let list = data.interviewQuestions || MOCK_INTERVIEW_QUESTIONS;
  if (courseId) {
    list = list.filter((q) => q.courseId === courseId);
  }
  if (category && category !== "ALL") {
    list = list.filter((q) => q.category.toLowerCase() === category.toLowerCase());
  }
  return list;
}

export async function getPlatformResources(
  type?: ResourceType,
  courseId?: string
): Promise<ResourceData[]> {
  const data = await getAllPlatformData();
  let list = data.resources || MOCK_RESOURCES;
  if (type) {
    list = list.filter((r) => r.type === type);
  }
  if (courseId) {
    list = list.filter((r) => r.courseId === courseId || r.courseId === null);
  }
  return list;
}

export async function getPlatformJobPortalLinks(
  roleFilter?: string
): Promise<JobPortalLinkData[]> {
  const data = await getAllPlatformData();
  let list = data.jobPortalLinks || MOCK_JOB_PORTAL_LINKS;
  if (roleFilter && roleFilter !== "ALL") {
    list = list.filter((j) => j.roleFilter === roleFilter);
  }
  return list;
}

export async function getSiteSettings(): Promise<PlatformSettings> {
  const url = `${WP_HOST}/seeyam/v1/site-settings`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn(`[WP API] Error fetching site settings from ${url}:`, error);
  }
  return getDefaultSettings();
}

export async function getCourses(): Promise<CourseData[]> {
  const data = await getAllPlatformData();
  return data.courses;
}

export async function getCourseBySlug(slug: string): Promise<CourseData | null> {
  const courses = await getCourses();
  return (
    courses.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase() || c.id.toLowerCase() === slug.toLowerCase()
    ) || null
  );
}

export async function getBranches(): Promise<BranchData[]> {
  const data = await getAllPlatformData();
  return data.branches;
}

export async function getBranchBySlug(slug: string): Promise<BranchData | null> {
  const branches = await getBranches();
  return (
    branches.find(
      (b) => b.slug.toLowerCase() === slug.toLowerCase() || b.id.toLowerCase() === slug.toLowerCase()
    ) || null
  );
}

export async function getPlacements(): Promise<PlacementStoryData[]> {
  const data = await getAllPlatformData();
  return data.placements;
}

export async function getReviews(): Promise<ReviewData[]> {
  const data = await getAllPlatformData();
  return data.reviews;
}

export async function getApprovedReviews(): Promise<ReviewData[]> {
  const reviews = await getReviews();
  return reviews.filter((r) => r.status === "APPROVED");
}

export async function getBatches(): Promise<BatchData[]> {
  const data = await getAllPlatformData();
  return data.batches;
}

export async function getCategories(): Promise<CategoryData[]> {
  const data = await getAllPlatformData();
  return data.categories;
}

/* -------------------------------------------------------------------------- */
/* STANDARD WORDPRESS PAGES & POSTS                                           */
/* -------------------------------------------------------------------------- */

export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
  if (!slug) return null;

  const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());
  const url = `${WP_API_ROOT}/pages?slug=${cleanSlug}&_embed=true`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 15 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const pages: WordPressPage[] = await res.json();
      if (Array.isArray(pages) && pages.length > 0) {
        return pages[0];
      }
    }

    // Check alias mappings (e.g. terms -> terms-and-conditions, contact-us -> contact)
    const aliases: Record<string, string> = {
      about: "about-us",
      "about-us": "about",
      contact: "contact-us",
      "contact-us": "contact",
      terms: "terms-and-conditions",
      "terms-and-conditions": "terms",
      privacy: "privacy-policy",
      "privacy-policy": "privacy",
      refund: "refund-policy",
      "refund-policy": "refund",
    };

    const targetAlias = aliases[slug.toLowerCase()];
    if (targetAlias) {
      const aliasSlug = encodeURIComponent(targetAlias);
      const aliasRes = await fetch(`${WP_API_ROOT}/pages?slug=${aliasSlug}&_embed=true`, {
        next: { revalidate: 15 },
        headers: { Accept: "application/json" },
      });
      if (aliasRes.ok) {
        const aliasPages: WordPressPage[] = await aliasRes.json();
        if (Array.isArray(aliasPages) && aliasPages.length > 0) {
          return aliasPages[0];
        }
      }
    }
  } catch (error) {
    console.error(`[WordPress API] Error fetching page "${slug}":`, error);
  }

  return null;
}

export async function getAllPages(): Promise<WordPressPage[]> {
  const url = `${WP_API_ROOT}/pages?per_page=100&_embed=true`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];
    const pages: WordPressPage[] = await res.json();
    return Array.isArray(pages) ? pages : [];
  } catch (error) {
    console.error(`[WordPress API] Error fetching all pages:`, error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  if (!slug) return null;

  const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());
  const url = `${WP_API_ROOT}/posts?slug=${cleanSlug}&_embed=true`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;
    const posts: WordPressPost[] = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;
    return posts[0];
  } catch (error) {
    console.error(`[WordPress API] Error fetching post "${slug}":`, error);
    return null;
  }
}

export function getFeaturedImageUrl(
  pageOrPost: WordPressPage | WordPressPost | null
): string | null {
  if (!pageOrPost?._embedded?.["wp:featuredmedia"]?.length) {
    return null;
  }
  return pageOrPost._embedded["wp:featuredmedia"][0]?.source_url || null;
}
