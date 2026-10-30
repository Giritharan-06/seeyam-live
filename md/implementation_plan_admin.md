# Admin Dashboard Enhancement: Login, Features & SEO/AEO/GEO

## Background

The Seeyam Technologies platform has a working public landing page and an admin CRM dashboard with lead management, batch scheduling, and course catalog features. The admin section currently has **no authentication** — anyone can access `/admin` directly. The user wants:

1. **Admin Login Page** — secure the admin portal behind authentication.
2. **Enhanced Admin Content/Options** — add missing management features and polish the admin UX.
3. **SEO / AEO / GEO Optimization** — implement search engine, answer engine, and generative engine optimization across the platform.

---

## User Review Required

> [!IMPORTANT]
> **Authentication Strategy**: We'll implement a lightweight **credential-based login** using a server-side session cookie (no external auth provider). This avoids adding heavy dependencies like NextAuth/Auth.js while still providing real security. Admin credentials will be stored in environment variables. Is this acceptable, or do you prefer a full OAuth/NextAuth integration?

> [!IMPORTANT]
> **SEO Scope**: SEO/AEO/GEO optimizations will be applied to the **public-facing pages** (landing, courses, branches). The admin panel itself will have `noindex, nofollow` meta tags to prevent search engine indexing. Correct?

---

## Open Questions

1. **Default admin credentials** — We'll use `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables. Should we hardcode a fallback for dev mode (e.g., `admin@seeyam.com` / `admin123`)?
2. **Multiple admin users** — Is it just a single admin account for now, or do you want support for multiple staff users with ADMIN/COUNSELOR roles from the Prisma schema?

---

## Proposed Changes

### Phase 1: Admin Authentication System

This phase adds a complete login flow that protects all `/admin/*` routes.

---

#### [NEW] [lib/auth.ts](file:///d:/greens/lib/auth.ts)
- Server-side authentication utilities
- `hashPassword()` / `verifyPassword()` using Web Crypto API (no bcrypt dependency needed)
- `createSession()` — generates a signed session token, sets an HTTP-only cookie
- `verifySession()` — validates the session cookie on each admin request
- `destroySession()` — clears the session cookie on logout
- Session token uses HMAC-SHA256 with a `SESSION_SECRET` env var

#### [NEW] [actions/auth.ts](file:///d:/greens/actions/auth.ts)
- `loginAction(email, password)` — Server Action that validates credentials against env vars, creates session
- `logoutAction()` — Server Action that destroys session and redirects to login page
- `getCurrentUser()` — Returns the current authenticated user info or `null`

#### [NEW] [lib/validations/auth-schema.ts](file:///d:/greens/lib/validations/auth-schema.ts)
- `loginSchema` — Zod schema for email + password validation

#### [NEW] [app/admin/login/page.tsx](file:///d:/greens/app/admin/login/page.tsx)
- Standalone login page (no sidebar layout) — premium glassmorphism design
- Seeyam Technologies branded card with gradient background
- React Hook Form + Zod validation
- Error state display, loading spinner
- Redirects to `/admin` on successful login

#### [NEW] [app/admin/login/layout.tsx](file:///d:/greens/app/admin/login/layout.tsx)
- Minimal layout for the login page (no admin sidebar)
- Prevents the admin layout from wrapping the login page

#### [MODIFY] [layout.tsx](file:///d:/greens/app/admin/layout.tsx)
- Add server-side session check via `verifySession()`
- If not authenticated → redirect to `/admin/login`
- Pass user info to children via React context or props

#### [MODIFY] [Sidebar.tsx](file:///d:/greens/components/admin/Sidebar.tsx)
- Add logout button that calls `logoutAction()`
- Display logged-in user name from session

#### [MODIFY] [AdminHeader.tsx](file:///d:/greens/components/admin/AdminHeader.tsx)
- Show authenticated user's name/email instead of hardcoded "ADMIN"
- Add logout functionality

---

### Phase 2: Enhanced Admin Features & Content

Add missing management capabilities and improve the admin UX.

---

#### [NEW] [app/admin/seo/page.tsx](file:///d:/greens/app/admin/seo/page.tsx)
- **SEO/AEO/GEO Dashboard** — a dedicated admin page showing:
  - SEO health checklist (meta titles, descriptions, structured data status)
  - AEO readiness indicators (FAQ schema, featured snippet optimization)
  - GEO optimization tips (AI-friendly content structure, entity markup)
  - Quick-action links to key pages that need attention

#### [NEW] [app/admin/settings/page.tsx](file:///d:/greens/app/admin/settings/page.tsx)
- **Platform Settings page** with sections:
  - General: Platform name, contact info, social links
  - Notifications: Email/WhatsApp notification preferences
  - Security: Change admin password, session management
  - Data: Export all data as CSV/JSON

#### [MODIFY] [Sidebar.tsx](file:///d:/greens/components/admin/Sidebar.tsx)
- Add new nav items: "SEO & Analytics" and "Settings"
- Add placement management link
- Group navigation into sections: "Core Operations", "Marketing & Analytics", "System"

#### [MODIFY] [page.tsx](file:///d:/greens/app/admin/page.tsx)
- Enhance dashboard with:
  - Conversion funnel visualization (NEW → CONTACTED → COUNSELING → ENROLLED)
  - Lead source breakdown (Landing Page, Walk-in, Referral)
  - Time-based trend indicators (leads this week vs last week)
  - Quick action cards for common tasks

---

### Phase 3: SEO / AEO / GEO Optimization (Public Pages)

Apply comprehensive optimization to the public-facing landing page and its components.

---

#### [MODIFY] [layout.tsx](file:///d:/greens/app/layout.tsx)
- **Enhanced SEO metadata**:
  - Add `openGraph` metadata (title, description, images, site name, type)
  - Add `twitter` card metadata (card type, title, description, image)
  - Add `robots` directive (index, follow for public pages)
  - Add `alternates.canonical` URL
  - Add `metadataBase` for absolute URL resolution
- **Structured Data (JSON-LD)**: Add `Organization` schema in `<script type="application/ld+json">`

#### [NEW] [components/StructuredData.tsx](file:///d:/greens/components/StructuredData.tsx)
- Reusable component that renders JSON-LD `<script>` tags
- Schemas to implement:
  - `Organization` — Seeyam Technologies company info
  - `EducationalOrganization` — Training institute details
  - `Course` — Individual course structured data (for AEO)
  - `FAQPage` — FAQ content for featured snippets (AEO)
  - `LocalBusiness` — Branch locations for local SEO
  - `BreadcrumbList` — Navigation breadcrumbs

#### [NEW] [components/FAQSection.tsx](file:///d:/greens/components/FAQSection.tsx)
- **AEO-optimized FAQ accordion** on the public landing page
- Common questions about IT training, placements, course structure
- Each Q&A pair rendered with proper `<details>`/`<summary>` HTML semantics
- Companion `FAQPage` JSON-LD schema for Google's answer boxes
- Voice-search friendly content (conversational, direct answers)

#### [MODIFY] [page.tsx](file:///d:/greens/app/page.tsx)
- Convert from `"use client"` to a **hybrid approach**: make the outer page a Server Component for SEO metadata, wrap interactive parts in client components
- Add `FAQSection` component
- Add `StructuredData` with `Organization`, `EducationalOrganization`, and `FAQPage` schemas

#### [MODIFY] [Hero.tsx](file:///d:/greens/components/Hero.tsx)
- Add semantic `<h1>` tag optimization (ensure single H1 per page)
- Add `aria-label` attributes for accessibility
- Optimize heading hierarchy (H1 → H2 → H3)

#### [MODIFY] [CourseGrid.tsx](file:///d:/greens/components/CourseGrid.tsx)
- Add `Course` JSON-LD schema for each course card
- Ensure proper heading hierarchy under the main H1
- Add `alt` attributes to any decorative elements

#### [MODIFY] [BranchLocator.tsx](file:///d:/greens/components/BranchLocator.tsx)
- Add `LocalBusiness` JSON-LD for each branch location
- GEO: Include entity-rich descriptions (city names, landmarks, coordinates)

#### [MODIFY] [layout.tsx](file:///d:/greens/app/admin/layout.tsx)
- Add `robots: { index: false, follow: false }` to admin metadata
- Prevent admin pages from appearing in search results

#### [NEW] [app/robots.ts](file:///d:/greens/app/robots.ts)
- Dynamic `robots.txt` generation
- Allow: `/` (public pages)
- Disallow: `/admin`, `/admin/*`
- Sitemap reference

#### [NEW] [app/sitemap.ts](file:///d:/greens/app/sitemap.ts)
- Dynamic XML sitemap generation
- Include: homepage, course pages, branch pages
- Exclude: admin routes
- Set appropriate `changeFrequency` and `priority` values

---

## File Summary

| Phase | File | Action | Purpose |
|-------|------|--------|---------|
| 1 | `lib/auth.ts` | NEW | Session management & crypto utilities |
| 1 | `actions/auth.ts` | NEW | Login/logout Server Actions |
| 1 | `lib/validations/auth-schema.ts` | NEW | Login form Zod schema |
| 1 | `app/admin/login/page.tsx` | NEW | Login page UI |
| 1 | `app/admin/login/layout.tsx` | NEW | Minimal login layout |
| 1 | `app/admin/layout.tsx` | MODIFY | Add auth guard |
| 1 | `components/admin/Sidebar.tsx` | MODIFY | Add logout, user info |
| 1 | `components/admin/AdminHeader.tsx` | MODIFY | Show auth user |
| 2 | `app/admin/seo/page.tsx` | NEW | SEO/AEO/GEO dashboard |
| 2 | `app/admin/settings/page.tsx` | NEW | Platform settings |
| 2 | `components/admin/Sidebar.tsx` | MODIFY | New nav items |
| 2 | `app/admin/page.tsx` | MODIFY | Enhanced dashboard |
| 3 | `app/layout.tsx` | MODIFY | OpenGraph, Twitter, JSON-LD |
| 3 | `components/StructuredData.tsx` | NEW | JSON-LD schema component |
| 3 | `components/FAQSection.tsx` | NEW | AEO FAQ accordion |
| 3 | `app/page.tsx` | MODIFY | Add FAQ, structured data |
| 3 | `components/Hero.tsx` | MODIFY | Heading hierarchy fix |
| 3 | `components/CourseGrid.tsx` | MODIFY | Course schema markup |
| 3 | `components/BranchLocator.tsx` | MODIFY | LocalBusiness schema |
| 3 | `app/admin/layout.tsx` | MODIFY | noindex robots |
| 3 | `app/robots.ts` | NEW | robots.txt generation |
| 3 | `app/sitemap.ts` | NEW | XML sitemap |

---

## Verification Plan

### Automated Tests
```bash
npm run build
```
- Ensures no TypeScript errors, no build failures, and all routes compile.

### Manual Verification
1. **Login Flow**: Navigate to `/admin` → should redirect to `/admin/login` → log in → should reach dashboard → logout → should return to login.
2. **SEO Audit**: View page source of `/` to confirm JSON-LD scripts, OpenGraph tags, and proper heading hierarchy.
3. **robots.txt**: Visit `/robots.txt` to confirm admin routes are disallowed.
4. **sitemap.xml**: Visit `/sitemap.xml` to confirm all public pages are listed.
5. **Admin Features**: Test the new SEO dashboard and Settings pages render correctly with sidebar navigation.
