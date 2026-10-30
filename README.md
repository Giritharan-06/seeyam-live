# Seeyam Technologies Platform
### Enterprise IT Training, Certification & Placement Management Suite
> **Next.js 15 (App Router & React 19) • Headless WordPress CMS • Prisma ORM • GSAP Animation Engine • Counselor CRM**

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [System Architecture](#-system-architecture)
3. [Key Features & Capabilities](#-key-features--capabilities)
4. [Technology Stack](#-technology-stack)
5. [Directory & File Structure](#-directory--file-structure)
6. [Data Models & Prisma Schema](#-data-models--prisma-schema)
7. [Headless WordPress Integration](#-headless-wordpress-integration)
8. [Next.js API Routes & Server Actions](#-nextjs-api-routes--server-actions)
9. [Public Portal Pages & Components](#-public-portal-pages--components)
10. [Admin CRM & Operations Workspace](#-admin-crm--operations-workspace)
11. [Dynamic Theming & Customization Engine](#-dynamic-theming--customization-engine)
12. [Environment Configuration](#-environment-configuration)
13. [Getting Started & Local Development](#-getting-started--local-development)
14. [Production Deployment & Cache Strategy](#-production-deployment--cache-strategy)

---

## 📋 Project Overview

The **Seeyam Technologies Platform** is a modern, high-performance web platform and enterprise management system designed for premier IT training institutes specializing in **Data Analytics, Business Intelligence (Power BI/Tableau), Python/SQL for Data, Digital Marketing, SEO, and Performance Advertising**.

The application bridges public-facing digital marketing operations with internal academic and counseling operations:
- **Public Website:** Lightning-fast static and server-rendered pages powered by Next.js 15, optimized for Core Web Vitals, Google SEO, dynamic brand theming, and student lead conversions.
- **Headless WordPress CMS:** A custom WordPress plugin (`seeyam-headless-cms`) providing non-technical marketing staff with a full 5-tab settings manager, custom post types (Courses, Branches, Placements, Reviews), and GSAP image-sequence asset management.
- **Internal Counselor CRM:** A dedicated `/admin` management suite for counselors to track inquiries, update lead stages with timestamped notes, manage batch schedules, moderate reviews, and export CSV reports.
- **Resilient Dual-Storage Layer:** Built on Prisma ORM with PostgreSQL, featuring an automatic fallback to an in-memory mock repository if databases or WordPress instances are offline during demonstrations or maintenance.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph "Content & Brand Management"
        WPAdmin["WordPress Admin Panel<br/>(seeyam.local)"]
        WPOptions["5-Tab Settings Suite<br/>• Appearance & Theme Presets<br/>• SEO, GA4 & GTM<br/>• Hero & CTA Badges<br/>• Brand, FAQs & Mentors"]
        WPCustom["Custom Post Types<br/>• Courses & Syllabus<br/>• Campus Branches<br/>• Placement Stories<br/>• Student Reviews"]
        WPAPI["WordPress REST API Engine<br/>/wp-json/seeyam/v1/all-data<br/>/wp-json/wp/v2/pages"]
    end

    subgraph "Next.js 15 Application Server"
        ISR["Next.js App Router (SSR / ISR)<br/>30-second Cache with On-Demand Revalidation"]
        RevalRoute["/api/revalidate Hook"]
        FramesRoute["/api/frames Route Handler<br/>(JSZip Decompressor & Frame Cache)"]
        ServerActions["Server Actions<br/>• submitLeadAction()<br/>• updateLeadStatusAction()<br/>• createBatchAction()"]
        ThemeEngine["DynamicThemeProvider<br/>CSS Variables & Font Injection"]
    end

    subgraph "Data Storage & Failover"
        Prisma["Prisma ORM Client"]
        Postgres["PostgreSQL Database<br/>(Leads, Batches, Users)"]
        MockDB["In-Memory Mock Store<br/>(Zero-Downtime Fallback)"]
    end

    subgraph "Client Experiences"
        PublicSite["Public Web Portal<br/>• Interactive Hero Analytics Canvas<br/>• GSAP Pinned Frame Scrubber<br/>• Mega-Menu & Course Catalog<br/>• Campus Locator & Lead Modals"]
        AdminSite["Admin CRM Suite (/admin)<br/>• KPI Analytics Dashboard<br/>• Counselor Lead Management Sheet<br/>• Batch Allocation & Review Moderation"]
    end

    WPAdmin --> WPOptions & WPCustom
    WPOptions & WPCustom --> WPAPI
    WPAPI --> ISR
    RevalRoute --> ISR
    ISR --> ThemeEngine
    ThemeEngine --> PublicSite
    PublicSite --> ServerActions
    AdminSite --> ServerActions
    ServerActions --> Prisma
    Prisma --> Postgres
    Prisma -.->|DB Offline Fallback| MockDB
    FramesRoute --> PublicSite
```

---

## 💎 Key Features & Capabilities

### 1. Ultra-High Performance Public Portal
- **Next.js 15 Server Components & React 19:** Zero-bundle-size server components deliver near-instant first-contentful paint (FCP).
- **GSAP ScrollTrigger Frame Scrubber:** Full-viewport pinned canvas scrubber executing frame-by-frame animation (100 to 192 frames) supporting WebP sequences, ZIP archive auto-extraction, high-DPI retina rendering, and touch scrub.
- **Interactive Analytics Particle Canvas:** Custom interactive background simulating data streams, node connections, and mouse push physics.
- **Dynamic Course Catalog & Filter Engine:** Instant keyword search and multi-category filtering across Data Analytics, Digital Marketing, AI/Python, and BI tools.
- **Comprehensive Branch Hubs:** Dedicated campus pages (OMR Chennai, Velachery Chennai, BTM Layout Bangalore, HSR Layout Bangalore, Madhapur Hyderabad) with Google Maps embeds, direct WhatsApp links, and counseling inquiry forms.
- **Alumni Placement Showcase:** Verified hiring partner logos (Google, Microsoft, Amazon, Zoho, TCS, Accenture), salary CTC packages, and interview testimonial cards.
- **Verified Student Review Moderation:** Multi-rating breakdown with interactive review submission modal and counselor approval pipeline.

### 2. WordPress Headless CMS & Custom Plugin (`seeyam-headless-cms.php`)
- **5-Tab Visual Customizer:**
  1. **Appearance Tab:** 5 theme presets (Default Blue, Emerald, Violet, Indigo, Crimson), custom hex pickers, Google Fonts dropdown (8 fonts), and border-radius sliders.
  2. **SEO & Analytics Tab:** Meta titles, descriptions, canonical URLs, Open Graph images, Twitter handles, Google Analytics 4 (GA4) ID, and Google Tag Manager (GTM) ID.
  3. **Hero & CTA Tab:** Headlines, subtitle copy, 3 value-proposition pills, YouTube showcase embed URL, and stat counter numbers.
  4. **Brand & Footer Tab:** Brand title, support email, phone numbers, WhatsApp helpline, corporate address, and social links.
  5. **About Us & FAQs Tab:** Mission/vision statements, mentor profiles with LinkedIn URLs, milestone timelines, and expandable FAQ accordion items.
- **GSAP Scroll Animation Asset Manager:** Upload WebP/JPG frame folders or remote ZIP files directly via the WordPress Media Library with auto-detection.
- **Instant Cache Webhook:** One-click revalidation button in WordPress that triggers `/api/revalidate` on the Next.js site to instantly update cached content.

### 3. Counselor CRM & Operations Management Suite (`/admin`)
- **Real-Time KPI Dashboard:** High-level metrics tracking Total Inquiries, New Leads Today, Enrollment Conversion Rate, and Active Batches.
- **Advanced Lead Sheet:** Filter leads by status (`NEW`, `CONTACTED`, `COUNSELING`, `ENROLLED`, `DROPPED`), search by name/phone/course, and change status inline.
- **Counselor Notes Timeline:** Every lead profile maintains a chronological log of timestamped counselor interactions with author tagging.
- **Manual Walk-in Registration:** Direct modal to capture offline walk-in candidates into the CRM pipeline.
- **One-Click CSV Export:** Export filtered lead queries into formatted spreadsheets for offline reporting.
- **Batch Management:** Schedule upcoming training batches, assign instructors, set room/online timings, and track available seats.
- **Review Moderation Portal:** Review submitted student feedback before publishing to the public domain.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | **Next.js 15.0.3** (App Router), **React 19.2.8**, **TypeScript 5.6.3** |
| **Styling & UI** | **Tailwind CSS 3.4.15**, **Lucide React 0.468**, CSS Custom Properties |
| **Animation & Canvas** | **GSAP 3.15.0**, **ScrollTrigger Plugin**, HTML5 2D Canvas Engine |
| **Forms & Validation** | **React Hook Form 7.53**, **Zod 3.23**, `@hookform/resolvers` |
| **Data & ORM Layer** | **Prisma ORM 5.22**, PostgreSQL / SQLite |
| **Decompression & Archives** | **JSZip 3.10.1** (Dynamic Frame Archive Processing) |
| **Headless CMS** | **WordPress 6.x** + Custom PHP Plugin (`seeyam-headless-cms`) |
| **Communication** | WhatsApp Click-to-Chat API, Direct Tel URI protocols |

---

## 📂 Directory & File Structure

```
d:\seeyam
├── actions/                          # Next.js Server Actions (Mutation Layer)
│   ├── batch.ts                      # Create and update training batch schedules
│   ├── lead.ts                       # Lead capture, inline status changes, counselor notes
│   └── review.ts                     # Review submission and moderation actions
│
├── app/                              # Next.js 15 App Router
│   ├── (public)/                     # Public Customer-Facing Routes (Route Group)
│   │   ├── about/page.tsx            # Company history, mission, leadership & timeline
│   │   ├── branches/                 # Branch directory and individual branch pages
│   │   │   ├── [slug]/page.tsx       # Dynamic branch detail page (OMR, Velachery, etc.)
│   │   │   └── page.tsx              # All branches overview & map locator
│   │   ├── contact/page.tsx          # Contact inquiries, campus addresses & forms
│   │   ├── courses/                  # Course catalog and course syllabus pages
│   │   │   ├── [slug]/page.tsx       # Dynamic course details, curriculum & batch info
│   │   │   └── page.tsx              # Filterable course grid with category filters
│   │   ├── placements/page.tsx       # Hiring partners, placement records & salary packages
│   │   ├── reviews/page.tsx          # Student ratings, testimonials & submission modal
│   │   ├── layout.tsx                # Public shell with Navbar, Footer & Providers
│   │   └── page.tsx                  # Home Landing Page
│   │
│   ├── admin/                        # Internal CRM & Operations Suite (Protected)
│   │   ├── (dashboard)/              # Admin Dashboard Views
│   │   │   ├── batches/page.tsx      # Batch scheduling and seat allocation
│   │   │   ├── leads/page.tsx        # CRM Lead Management Sheet with CSV export
│   │   │   ├── reviews/page.tsx      # Review moderation and approval queue
│   │   │   ├── settings/page.tsx     # CMS sync status, revalidation & diagnostics
│   │   │   ├── layout.tsx            # Admin sidebar navigation & status bar
│   │   │   └── page.tsx              # Executive KPI analytics dashboard
│   │   └── layout.tsx                # Root Admin wrapper
│   │
│   ├── api/                          # Next.js Route Handlers
│   │   ├── frames/route.ts           # Dynamic ZIP decompressor & frame scanner
│   │   └── revalidate/route.ts       # On-demand ISR revalidation webhook endpoint
│   │
│   ├── globals.css                   # Global styles, Tailwind base & keyframe animations
│   └── layout.tsx                    # HTML Root layout, SEO metadata & Google Fonts
│
├── components/                       # Modular React UI Components
│   ├── admin/                        # Admin-specific UI components
│   ├── AnalyticsCardsStrip.tsx       # Interactive metric cards with live mini-charts
│   ├── BranchLocator.tsx             # Campus map locator with WhatsApp CTAs
│   ├── CompanyLogo.tsx               # Partner company SVG badge renderers
│   ├── CounterNumber.tsx             # Animated number counter (counts up on scroll)
│   ├── CourseGrid.tsx                # Filterable course grid with category selectors
│   ├── DataWorkflowScrollAnimation.tsx# Pinned GSAP canvas frame scrubber
│   ├── DynamicThemeProvider.tsx      # Injects WordPress colors, fonts & GA4/GTM scripts
│   ├── FAQSection.tsx                # Interactive collapsible accordion FAQ
│   ├── Footer.tsx                    # Footer with site map, branch contact & social links
│   ├── Hero.tsx                      # Hero banner with dynamic headlines & video popup
│   ├── HeroAnalyticsBackground.tsx   # Interactive HTML5 particle network canvas
│   ├── LeadModal.tsx                 # Universal course enrollment / inquiry modal
│   ├── LeadModalContext.tsx          # React context to trigger lead modal globally
│   ├── Navbar.tsx                    # Sticky header with multi-category megamenu
│   ├── PlacementSection.tsx          # Placement statistics, salary packages & alumni cards
│   ├── PlatformDataContext.tsx       # Global React context for WordPress site data
│   ├── ReviewModal.tsx               # Interactive student rating & review submission form
│   ├── ReviewSection.tsx             # Testimonial carousel and review cards
│   ├── ScrollReveal.tsx              # IntersectionObserver fade/slide scroll animations
│   └── StructuredData.tsx            # JSON-LD Schema.org rich snippets generator
│
├── lib/                              # Core Utility Libraries & Business Logic
│   ├── mock-data.ts                  # Seed datasets, fallback courses, branches & settings
│   ├── prisma.ts                     # Prisma ORM client singleton instance
│   ├── utils.ts                      # Tailwind clsx / twMerge helpers
│   └── wordpress.ts                  # Headless WordPress API client, fetchers & transformers
│
├── prisma/                           # Database Layer
│   └── schema.prisma                 # PostgreSQL database schema and enums
│
├── public/                           # Static Assets & Animation Sequences
│   ├── frames-web/                   # Default desktop WebP frame sequences (000-191)
│   ├── frames-mobile/                # Default mobile WebP frame sequences (000-191)
│   └── ...                           # Logos, icons and vector illustrations
│
├── wordpress-plugin/                 # Custom Headless WordPress Plugin
│   └── seeyam-headless-cms.php       # 5-Tab Customizer, CPTs, REST API & Revalidation
│
├── package.json                      # Project dependencies and npm scripts
├── tailwind.config.ts                # Tailwind design tokens, brand variables & animations
└── tsconfig.json                     # TypeScript compiler configuration
```

---

## 🗄️ Data Models & Prisma Schema

The PostgreSQL database schema is managed via **Prisma ORM** (`prisma/schema.prisma`):

```prisma
enum Role {
  ADMIN
  COUNSELOR
}

enum Mode {
  CLASSROOM
  ONLINE
  HYBRID
}

enum BatchStatus {
  UPCOMING
  ONGOING
  COMPLETED
}

enum LeadStatus {
  NEW
  CONTACTED
  COUNSELING
  ENROLLED
  DROPPED
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(COUNSELOR)
  branchId     String?
  branch       Branch?  @relation(fields: [branchId], references: [id])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("users")
}

model Category {
  id      String   @id @default(cuid())
  name    String   @unique
  slug    String   @unique
  icon    String   @default("BookOpen")
  courses Course[]

  @@map("categories")
}

model Course {
  id               String           @id @default(cuid())
  title            String
  slug             String           @unique
  categoryId       String
  category         Category         @relation(fields: [categoryId], references: [id])
  summary          String           @db.Text
  duration         String
  mode             Mode             @default(CLASSROOM)
  price            Float            @default(0)
  syllabusJson     Json?
  isFeatured       Boolean          @default(false)
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
  batches          Batch[]
  leads            Lead[]
  placementStories PlacementStory[]

  @@map("courses")
}

model Batch {
  id             String      @id @default(cuid())
  courseId       String
  course         Course      @relation(fields: [courseId], references: [id])
  branchId       String
  branch         Branch      @relation(fields: [branchId], references: [id])
  instructorName String
  startDate      DateTime
  timing         String
  maxSeats       Int         @default(30)
  seatsLeft      Int         @default(30)
  status         BatchStatus @default(UPCOMING)
  createdAt      DateTime    @default(now())

  @@map("batches")
}

model Branch {
  id          String  @id @default(cuid())
  name        String  @unique
  slug        String  @unique
  address     String  @db.Text
  city        String
  phone       String
  whatsapp    String
  mapEmbedUrl String? @db.Text
  users       User[]
  batches     Batch[]
  leads       Lead[]

  @@map("branches")
}

model Lead {
  id        String     @id @default(cuid())
  fullName  String
  email     String
  phone     String
  branchId  String?
  branch    Branch?    @relation(fields: [branchId], references: [id])
  courseId  String?
  course    Course?    @relation(fields: [courseId], references: [id])
  status    LeadStatus @default(NEW)
  notes     Json?      // Array of { timestamp, text, author }
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@map("leads")
}

model PlacementStory {
  id               String  @id @default(cuid())
  studentName      String
  companyName      String
  role             String
  packageCtc       String
  studentAvatarUrl String?
  courseId         String?
  course           Course? @relation(fields: [courseId], references: [id])

  @@map("placement_stories")
}
```

---

## 🔌 Headless WordPress Integration

The application integrates with WordPress through the **`seeyam-headless-cms`** plugin.

### Key REST API Endpoints:
- `GET /wp-json/seeyam/v1/all-data` — Returns consolidated settings, categories, courses, branches, reviews, placements, FAQs, mentors, and timelines in a single payload.
- `GET /wp-json/seeyam/v1/settings` — Returns the 5-tab settings dictionary (colors, SEO, hero copy, GSAP animation config).
- `GET /wp-json/wp/v2/pages?slug={slug}` — Returns WordPress page content for dynamic pages.

### WordPress Plugin Highlights:
1. **5-Tab Customizer:** Built into `seeyam-headless-cms.php` using WordPress Settings API.
2. **Custom Post Types:**
   - `seeyam_course` (Courses & Curricula)
   - `seeyam_branch` (Campus Hubs)
   - `seeyam_placement` (Placement Records)
   - `seeyam_review` (Student Reviews)
3. **On-Demand Webhook Trigger:** Whenever settings or posts are saved in WordPress, the plugin fires a `POST` request to `https://your-domain.com/api/revalidate?secret=...` to instantly refresh cached pages.

---

## ⚡ Next.js API Routes & Server Actions

### Route Handlers:
1. **`GET /api/frames`** ([app/api/frames/route.ts](file:///d:/seeyam/app/api/frames/route.ts)):
   - Serves image sequences for the GSAP canvas scrubber.
   - Supports local folders (`/frames-web/`, `/frames-mobile/`), single animated files, and remote ZIP archives.
   - Decompresses ZIP files on the fly using `JSZip`, caches extracted frames in memory with a 30-minute TTL, and returns sorted Base64 Data URLs or direct paths.

2. **`POST /api/revalidate`** ([app/api/revalidate/route.ts](file:///d:/seeyam/app/api/revalidate/route.ts)):
   - Receives WordPress webhook calls and invokes `revalidateTag("wordpress")` and `revalidatePath("/")` for instantaneous cache purging.

### Server Actions:
1. **`submitLeadAction(formData)`** ([actions/lead.ts](file:///d:/seeyam/actions/lead.ts)):
   - Validates user input via Zod.
   - Inserts lead into PostgreSQL via Prisma (or in-memory mock store).
   - Returns success status and created lead record.

2. **`updateLeadStatusAction({ leadId, status, note, author })`** ([actions/lead.ts](file:///d:/seeyam/actions/lead.ts)):
   - Updates lead stage (`NEW` -> `CONTACTED` -> `COUNSELING` -> `ENROLLED` -> `DROPPED`).
   - Appends timestamped note to the lead's notes JSON array.

3. **`createBatchAction(batchData)`** ([actions/batch.ts](file:///d:/seeyam/actions/batch.ts)):
   - Schedules a new training batch with instructor, seats, and time slot.

4. **`submitReviewAction(reviewData)`** & **`toggleReviewApprovalAction(reviewId)`** ([actions/review.ts](file:///d:/seeyam/actions/review.ts)):
   - Captures student ratings and allows admin moderation.

---

## 🎨 Dynamic Theming & Customization Engine

The platform features a zero-rebuild theming engine powered by [DynamicThemeProvider.tsx](file:///d:/seeyam/components/DynamicThemeProvider.tsx):

- **CSS Variables Injected at Runtime:**
  ```css
  :root {
    --primary-brand: #2563eb;
    --accent-brand: #f97316;
    --dark-brand: #071938;
    --font-family-brand: "Inter", sans-serif;
    --radius-brand: 24px;
  }
  ```
- **5 Curated Color Presets:**
  - `default`: Royal Blue (`#2563eb`) & Solar Orange (`#f97316`)
  - `emerald`: Forest Emerald (`#059669`) & Warm Amber (`#f59e0b`)
  - `violet`: Electric Violet (`#7c3aed`) & Hot Pink (`#ec4899`)
  - `indigo`: Deep Indigo (`#4f46e5`) & Vivid Cyan (`#06b6d4`)
  - `crimson`: Ruby Crimson (`#e11d48`) & Ocean Sky (`#0284c7`)
- **Dynamic Google Fonts Injection:** Injects chosen font stylesheets into `<head>` (`Inter`, `Plus Jakarta Sans`, `Outfit`, `Poppins`, `Roboto`, `Space Grotesk`, `Lexend`, `DM Sans`).
- **Dynamic Analytics Injection:** Loads GA4 (`gtag.js`) and GTM dynamically based on WordPress settings.

---

## 🖥️ Public Portal Pages & Components

| Page Route | Key Components & Functionality |
| :--- | :--- |
| **`/` (Home)** | `Hero` (particle canvas background), `DataWorkflowScrollAnimation` (pinned GSAP canvas), `AnalyticsCardsStrip` (live metrics), `CourseGrid` (catalog filters), `PlacementSection` (hiring partner strip), `BranchLocator` (interactive campus cards), `ReviewSection` (testimonials slider), `FAQSection` (accordion Q&A). |
| **`/courses`** | Complete searchable course catalog with tab filters (All, Data Analytics, Digital Marketing, AI/Python, Business Intelligence). |
| **`/courses/[slug]`** | Course syllabus breakdown, module topics, learning outcomes, career paths, fee details, batch timings, and lead capture form. |
| **`/branches`** | Full overview of campus hubs across Chennai, Bangalore & Hyderabad with direct contact links and map navigators. |
| **`/branches/[slug]`** | Campus facility photos, counselor contact info, classroom amenities, local directions, and branch-specific batch schedules. |
| **`/placements`** | Placement assurance roadmap, recruiter network logos, recent student package stories (3.5 LPA - 18 LPA), and interview testimonials. |
| **`/reviews`** | Filterable student ratings, review submission modal with star rating picker, and verified student badges. |
| **`/about`** | Institute story, mission & vision, leadership team, senior mentor bios with LinkedIn links, and company timeline milestones. |
| **`/contact`** | Multi-branch direct phone/email/WhatsApp directory and general inquiry form. |

---

## 🛡️ Admin CRM & Operations Workspace

Located at **`/admin`**:

1. **Dashboard (`/admin`)**:
   - Live KPI counter cards (Total Inquiries, Inquiries Today, Enrollment Conversion %, Active Batches).
   - Recent inquiries timeline and quick-access shortcuts.

2. **Leads Sheet (`/admin/leads`)**:
   - Searchable and status-filterable data table.
   - Inline status switcher modal with counselor note logger.
   - Walk-in student quick-registration drawer.
   - One-click CSV export of filtered inquiries.

3. **Batches Scheduler (`/admin/batches`)**:
   - Table of upcoming, ongoing, and completed batches.
   - Create new batches with course, branch, instructor, max seats, and time slots.

4. **Review Moderation (`/admin/reviews`)**:
   - Moderate incoming student reviews before publishing.

5. **Settings & Diagnostics (`/admin/settings`)**:
   - Real-time connectivity health checker for WordPress REST API and PostgreSQL database.
   - Manual cache purge button.

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the project root:

```env
# Database Connection (PostgreSQL or SQLite)
DATABASE_URL="postgresql://postgres:password@localhost:5432/seeyam_db?schema=public"

# Headless WordPress Endpoint (Local WP or Remote WordPress)
NEXT_PUBLIC_WORDPRESS_URL="http://seeyam.local"
WORDPRESS_API_URL="http://seeyam.local"

# Site Public URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Revalidation Webhook Secret (Matches secret set in WordPress plugin)
REVALIDATE_SECRET="YOUR_OWN_RANDOM_SECRET"
```

---

## 🚀 Getting Started & Local Development

### Prerequisites:
- **Node.js** v18.18+ or v20+
- **npm** or **pnpm** / **yarn**
- *(Optional)* **Local WP** or WordPress 6.x instance
- *(Optional)* **PostgreSQL** database (the platform runs seamlessly with mock data if DB is not present)

### Step 1: Clone and Install Dependencies
```bash
git clone https://github.com/Giritharan-06/seeyam-live.git
cd seeyam-live
npm install
```

### Step 2: Set Up Database (Optional)
```bash
npx prisma generate
npx prisma db push
```

### Step 3: Install WordPress Plugin (Optional)
1. Copy the `wordpress-plugin/seeyam-headless-cms.php` file into your WordPress `wp-content/plugins/seeyam-headless-cms/` folder.
2. In the WordPress Admin, go to **Plugins** and click **Activate** on **Seeyam Headless CMS**.
3. Configure your colors, hero copy, and SEO in the **Seeyam Platform Settings** menu.

### Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The admin panel is available at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 🚢 Production Deployment & Cache Strategy

### 1. Build and Validate
```bash
npm run build
npm run start
```

### 2. Cache Invalidation Strategy
- **Incremental Static Regeneration (ISR):** Public pages are cached with a **30-second ISR window**.
- **On-Demand Cache Purging:** When content changes in WordPress, the `seeyam-headless-cms` plugin calls `/api/revalidate`, purging the Next.js cache immediately without requiring a full site redeploy.
- **Failover Guarantee:** If WordPress or the PostgreSQL database experiences downtime, the application automatically falls back to cached data or the in-memory mock repository, ensuring 100% visitor uptime.

---

## 📄 License & Attribution

Developed for **Seeyam Technologies** — Premier Data Analytics, Digital Marketing & Placement Training Institute.  
All rights reserved © 2026.
