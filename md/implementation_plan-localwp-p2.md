# Migrate All Content to WordPress Headless CMS

Move every piece of hardcoded content out of React/mock-data and into your local WordPress instance, so you can edit everything (hero, courses, branches, reviews, placements, batches, hiring partners, page copy) directly from the WordPress admin dashboard.

---

## User Review Required

> [!IMPORTANT]
> **WordPress Plugins Required.** This plan relies on two free plugins being installed in your Local WP instance:
> 1. **Custom Post Type UI (CPT UI)** — to register custom post types (Course, Branch, Placement, Review, Batch)
> 2. **Advanced Custom Fields (ACF)** — to add structured fields (price, rating, syllabus JSON, map URL, etc.) to each post type
> 3. **ACF to WP REST API** — to expose ACF fields in the REST API response
>
> I will generate a **WordPress theme `functions.php`** that registers all CPTs and ACF field groups programmatically, so you don't need to click through the WP admin to set them up.

> [!WARNING]
> **This is a large migration.** The existing admin dashboard (Prisma/mock-db based CRUD for courses, branches, reviews, leads, batches) will still work alongside WordPress for internal operations. WordPress becomes the **public-facing content source**; the admin panel remains for lead management and internal ops. The two systems will coexist.

> [!IMPORTANT]
> **WordPress Authentication.** The migration script needs to create posts via the WP REST API, which requires authentication. You'll need either:
> - **Application Passwords** (built into WP 5.6+): Generate one from WP Admin → Users → Your Profile → Application Passwords
> - Or install the **Basic Auth** plugin for simpler dev-only auth
>
> I'll use Application Passwords in the script. You'll need to provide your WP admin username and an application password.

---

## Open Questions

> [!IMPORTANT]
> **Should the About page content also come from WordPress?** Currently [about/page.tsx](file:///d:/greens/app/(public)/about/page.tsx) has hardcoded trainer bios, timeline, mission/vision text. Should I also migrate those to WP (as ACF fields on an "About" page), or keep them as code?

> [!IMPORTANT]
> **Footer & Navbar content?** The footer has hardcoded contact info, links, and the navbar has hardcoded menu items. Should these come from WP too (via a WP Menu or ACF Options Page), or keep them static?

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│         WordPress Admin (seeyam.local)          │
│  ┌───────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Pages     │ │ Courses  │ │  Branches     │  │
│  │  (Home,    │ │ (CPT)    │ │  (CPT)        │  │
│  │   About)   │ │          │ │               │  │
│  └───────────┘ └──────────┘ └───────────────┘  │
│  ┌───────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Placements│ │ Reviews  │ │  Batches      │  │
│  │ (CPT)     │ │ (CPT)    │ │  (CPT)        │  │
│  └───────────┘ └──────────┘ └───────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  ACF Options Page (Global Site Settings)  │  │
│  │  Hero, Stats, Hiring Partners, CTA copy   │  │
│  └───────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────┘
                     │ WP REST API
                     ▼
┌─────────────────────────────────────────────────┐
│          Next.js Frontend (localhost:3000)       │
│  ┌──────────────────────────────────────────┐   │
│  │  lib/wordpress.ts  (expanded API client) │   │
│  │  - getCourses(), getCourseBySlug()       │   │
│  │  - getBranches(), getBranchBySlug()      │   │
│  │  - getPlacements(), getReviews()         │   │
│  │  - getGlobalSettings() (hero, stats)     │   │
│  └──────────────────────────────────────────┘   │
│                     │                           │
│  ┌─────────────────────────────────────────┐    │
│  │  Pages & Components (fetch from WP)     │    │
│  │  Home, Courses, Branches, Placements... │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

## Phase 1: WordPress Content Modeling

### WordPress Custom Post Types (CPTs)

Set up via a custom theme `functions.php` or a plugin. Here's what we register:

| CPT Slug       | Label          | ACF Fields                                                                                                    |
|----------------|----------------|---------------------------------------------------------------------------------------------------------------|
| `course`       | Courses        | `summary`, `duration`, `mode` (select), `price` (number), `expected_salary`, `rating` (number), `enrolled_count`, `is_featured` (bool), `syllabus` (repeater), `highlights` (repeater), `category_ref` (taxonomy) |
| `branch`       | Branches       | `address`, `city`, `phone`, `whatsapp`, `email`, `timing`, `map_embed_url`, `landmark`                       |
| `placement`    | Placements     | `student_name`, `company_name`, `role`, `package_ctc`, `student_avatar_url`, `course_ref` (post object), `branch_ref` (post object), `quote` |
| `review`       | Reviews        | `student_name`, `student_email`, `course_ref`, `branch_ref`, `rating`, `review_title`, `body`, `completion_year`, `status` (select), `admin_note` |
| `batch`        | Batches        | `course_ref`, `branch_ref`, `instructor_name`, `instructor_exp`, `start_date`, `timing`, `max_seats`, `seats_left`, `status` (select) |

### WordPress Taxonomies

| Taxonomy Slug      | Attached To | Terms (from mock data)                                                         |
|--------------------|-------------|--------------------------------------------------------------------------------|
| `course_category`  | `course`    | Full Stack Development, Cloud & DevOps, Data Science & AI, Software Testing, Enterprise ERP & Cyber |

### ACF Options Page: "Site Settings"

Global fields that aren't tied to a specific post:

| Field Group          | Fields                                                                              |
|----------------------|------------------------------------------------------------------------------------- |
| **Hero Section**     | `hero_title`, `hero_subtitle`, `hero_badge_text`, `hero_youtube_url`, `hero_video_title`, `hero_video_subtitle`, `hero_video_badge` |
| **Stats Banner**     | `stat_engineers_trained`, `stat_placement_rate`, `stat_average_rating`               |
| **Hiring Partners**  | Repeater: `partner_name`, `partner_badge`                                           |
| **CTA Section**      | `cta_title`, `cta_subtitle`, `cta_button_1_text`, `cta_button_1_url`, `cta_button_2_text`, `cta_button_2_url` |

---

### Files to Create/Modify

#### [NEW] `wp-theme/functions.php`
A standalone PHP file you'll drop into your Local WP site's theme (or as a mu-plugin). Registers all CPTs, taxonomies, and ACF field groups programmatically.

#### [NEW] `wp-theme/acf-fields.json`
Exportable ACF field group JSON that can be imported directly via the ACF admin UI as a backup.

---

## Phase 2: Migration Script — Seed WordPress with Existing Data

#### [NEW] [scripts/migrate-to-wp.ts](file:///d:/greens/scripts/migrate-to-wp.ts)

A Node.js/TypeScript script that:
1. Reads all data from [lib/mock-data.ts](file:///d:/greens/lib/mock-data.ts)
2. Creates WordPress posts for each entity via the WP REST API:
   - Creates `course_category` taxonomy terms first
   - Creates all 5 Branches as `branch` CPT posts
   - Creates all 7 Courses as `course` CPT posts (with ACF fields for syllabus, highlights, etc.)
   - Creates all 6 Placements as `placement` CPT posts
   - Creates all 11 Reviews as `review` CPT posts
   - Creates all 5 Batches as `batch` CPT posts
   - Sets the ACF Options Page values for hero, stats, hiring partners
3. Maps cross-references (e.g., a Batch's `course_ref` → the WordPress post ID of the Course)
4. Logs progress and handles errors gracefully

#### [NEW] `.env.local` updates
```env
# Migration credentials (only needed for the script)
WP_ADMIN_USER=admin
WP_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

---

## Phase 3: Expand WordPress API Service

#### [MODIFY] [lib/wordpress.ts](file:///d:/greens/lib/wordpress.ts)

Add functions for every content type:

```typescript
// Courses
getCourses(): Promise<WPCourse[]>
getCourseBySlug(slug: string): Promise<WPCourse | null>
getFeaturedCourses(): Promise<WPCourse[]>

// Branches
getBranches(): Promise<WPBranch[]>
getBranchBySlug(slug: string): Promise<WPBranch | null>

// Placements
getPlacements(): Promise<WPPlacement[]>

// Reviews
getApprovedReviews(): Promise<WPReview[]>

// Batches
getBatches(): Promise<WPBatch[]>
getBatchesByCourse(courseSlug: string): Promise<WPBatch[]>

// Global Settings (ACF Options)
getGlobalSettings(): Promise<WPGlobalSettings>

// Categories (taxonomy)
getCourseCategories(): Promise<WPCourseCategory[]>
```

Each function maps the WP REST API + ACF fields response into the existing TypeScript interfaces (`CourseData`, `BranchData`, etc.) so downstream components don't need to change their prop types.

---

## Phase 4: Rewire Frontend Components

### Home Page & Context Provider

#### [MODIFY] [components/PlatformDataContext.tsx](file:///d:/greens/components/PlatformDataContext.tsx)
Replace the mock data imports and server action calls with WordPress API calls:
- `getCourses()` → `wpGetCourses()`
- `getAllBranches()` → `wpGetBranches()`
- `getApprovedReviews()` → `wpGetApprovedReviews()`
- `getHeroMedia()` → `wpGetGlobalSettings().hero`

#### [MODIFY] [app/(public)/page.tsx](file:///d:/greens/app/(public)/page.tsx)
Replace `MOCK_PLACEMENTS`, `MOCK_HIRING_PARTNERS`, `MOCK_CATEGORIES` imports with data from the WordPress API (passed via context or fetched server-side).

#### [MODIFY] [components/Hero.tsx](file:///d:/greens/components/Hero.tsx)
Hero already reads from `usePlatformData()` — it will automatically get WP data once the context is updated.

---

### Course Pages

#### [MODIFY] [app/(public)/courses/page.tsx](file:///d:/greens/app/(public)/courses/page.tsx)
Fetch course listing from WordPress instead of mock data.

#### [MODIFY] [app/(public)/courses/[slug]/page.tsx](file:///d:/greens/app/(public)/courses/[slug]/page.tsx)
Fetch individual course by slug from WordPress. Update `generateStaticParams` to use `getCourses()` from WP.

---

### Branch Pages

#### [MODIFY] [app/(public)/branches/page.tsx](file:///d:/greens/app/(public)/branches/page.tsx)
Fetch branch listing from WordPress.

#### [MODIFY] [app/(public)/branches/[slug]/page.tsx](file:///d:/greens/app/(public)/branches/[slug]/page.tsx)
Fetch individual branch from WordPress. Update `generateStaticParams`.

---

### Placements & Reviews Pages

#### [MODIFY] [app/(public)/placements/page.tsx](file:///d:/greens/app/(public)/placements/page.tsx)
Fetch placements from WordPress, including course cross-references.

#### [MODIFY] [app/(public)/reviews/page.tsx](file:///d:/greens/app/(public)/reviews/page.tsx)
Fetch approved reviews from WordPress.

---

## Phase 5: Cleanup & Polish

- Add `revalidate` settings on all WP-fetched pages (ISR with 60s)
- Ensure `generateStaticParams` pulls slugs from WordPress for SSG
- Add error boundaries for WP API failures with graceful fallback to cached data
- Keep [lib/mock-data.ts](file:///d:/greens/lib/mock-data.ts) as a fallback — if WordPress is down, the site still renders with mock data
- Update [app/sitemap.ts](file:///d:/greens/app/sitemap.ts) to pull dynamic slugs from WordPress

---

## Verification Plan

### Phase 1 Verification
- Access `http://seeyam.local/wp-admin` → verify CPTs appear in the sidebar (Courses, Branches, Placements, Reviews, Batches)
- Verify ACF field groups are registered and visible when editing a Course post

### Phase 2 Verification
- Run migration script: `npx tsx scripts/migrate-to-wp.ts`
- Verify in WP Admin that all 7 courses, 5 branches, 6 placements, 11 reviews, and 5 batches exist with correct ACF field data
- Verify taxonomy terms (5 course categories) are created
- Verify the ACF Options Page has hero, stats, and hiring partner data

### Phase 3-4 Verification
- Run `npm run dev` and open `http://localhost:3000`
- Verify the home page loads courses, branches, reviews, and hero content from WordPress
- Navigate to `/courses`, `/courses/full-stack-mern-nextjs`, `/branches`, `/branches/omr-navalur` — verify all render with WP data
- Edit a course title in WP Admin → wait 60s → refresh the frontend and verify the change appears

### Phase 5 Verification
- Stop the WordPress server → verify the Next.js site still renders (falls back to mock data)
- Run `npm run build` → verify zero errors
