# Seeyam Technologies Platform
### Enterprise IT Training, Certification, Placement & Counselor CRM Suite
> **Next.js 15 (App Router & React 19) • TypeScript • Prisma ORM • PostgreSQL • Three.js (3D WebGL) • GSAP Animation Engine • Counselor CRM**

---

## 📑 Table of Contents

1. [Executive Overview](#-executive-overview)
2. [System Architecture](#-system-architecture)
3. [Technology Stack](#-technology-stack)
4. [Public Student Portal & Interactive Experience](#-public-student-portal--interactive-experience)
5. [3D WebGL & Advanced Animation Engine](#-3d-webgl--advanced-animation-engine)
6. [Counselor CRM & Admissions Operations (`/admin`)](#-counselor-crm--admissions-operations-admin)
7. [Academic, Placement & Career Resource Engine](#-academic-placement--career-resource-engine)
8. [Data Models & Prisma Database Schema](#-data-models--prisma-database-schema)
9. [Next.js Server Actions & API Handlers](#-nextjs-server-actions--api-handlers)
10. [Directory & File Structure](#-directory--file-structure)
11. [Dynamic Theming & Brand Customization Engine](#-dynamic-theming--brand-customization-engine)
12. [Environment Configuration & Setup Guide](#-environment-configuration--setup-guide)
13. [Production Deployment Strategy](#-production-deployment-strategy)

---

## 📋 Executive Overview

The **Seeyam Technologies Platform** is a modern, full-stack enterprise web application and student management system built for premier IT training institutes specializing in:
- **Data Analytics & Engineering** (Python, SQL, Advanced Excel, Statistics)
- **Business Intelligence** (Microsoft Power BI, Tableau, Looker Studio)
- **Full-Stack Software Engineering** (Java, Python, Next.js, Cloud APIs)
- **Cloud & DevOps** (AWS, Azure, Docker, Kubernetes, CI/CD)
- **Digital Marketing & Growth Advertising** (SEO, SEM, Performance Marketing)

The platform bridges digital student discovery with internal admissions and academic operations:
1. **Public Student Experience:** Next.js 15 App Router with React 19 Server Components, delivering high Core Web Vitals, dynamic brand theming, JSON-LD Schema.org rich snippets, and interactive 3D WebGL visualizers.
2. **Career & Placement Hub:** Verified placement tracks, alumni salary package disclosures (3.5 LPA – 18 LPA), hiring partner network showcases (Google, Amazon, Zoho, TCS, Accenture), interview question banks, and live job portal links.
3. **Internal Counselor CRM (`/admin`):** A dedicated operations suite for counselors to track inquiries, update lead stages with timestamped notes, schedule training batches, moderate student reviews, and export CSV reports.
4. **Dual Data Architecture:** Built on Prisma ORM with PostgreSQL, featuring an in-memory database fallback ([lib/mock-db.ts](file:///d:/seeyam/lib/mock-db.ts)) that guarantees 100% visitor uptime and zero-configuration offline demonstration capabilities.

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph "Client Layer"
        Visitor["Prospective Students<br/>(Public Portal)"]
        Counselor["Counselor / Admin<br/>(/admin Suite)"]
    end

    subgraph "Next.js 15 Application Server"
        AppRouter["Next.js App Router (RSC & SSR)<br/>Edge & Node Runtime"]
        ThemeEngine["DynamicThemeProvider<br/>(CSS Variables & Brand Presets)"]
        ServerActions["Server Actions Layer<br/>• submitLeadAction()<br/>• updateLeadStatusAction()<br/>• createBatchAction()<br/>• submitReviewAction()"]
        APIRoutes["Route Handlers<br/>• /api/frames (Dynamic ZIP & Frame Handler)"]
    end

    subgraph "Data Storage & Failover Engine"
        PrismaClient["Prisma ORM Client"]
        PostgresDB["PostgreSQL Database<br/>(Users, Leads, Batches, Courses)"]
        MockDB["In-Memory Store (mockDb)<br/>(Standalone Zero-Downtime Fallback)"]
    end

    subgraph "Client Experiences"
        PublicUI["Public Web Portal<br/>• Hero Particle Canvas<br/>• Three.js 3D Placement Globe<br/>• GSAP Pinned Frame Scrubber<br/>• Course Catalog & Syllabi<br/>• Campus Locator & Lead Modals"]
        AdminUI["Counselor CRM (/admin)<br/>• KPI Analytics Dashboard<br/>• Admissions Lead Sheet<br/>• Batch Allocation & Seat Manager<br/>• Review Moderation Portal"]
    end

    Visitor --> AppRouter
    Counselor --> AppRouter
    AppRouter --> ThemeEngine
    ThemeEngine --> PublicUI
    AppRouter --> AdminUI
    PublicUI --> ServerActions
    AdminUI --> ServerActions
    PublicUI --> APIRoutes
    ServerActions --> PrismaClient
    PrismaClient --> PostgresDB
    PrismaClient -.->|Database Offline or Standalone Mode| MockDB
```

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15.0.3** (App Router), **React 19.2.8**, **TypeScript 5.6.3** | Server Components (RSC), SSR, Static Generation, Dynamic Route Segments |
| **Styling & UI System** | **Tailwind CSS 3.4.15**, **Lucide React 0.468**, CSS Custom Properties | Custom brand variables, modern typography, glassmorphism, responsive grid |
| **3D WebGL Engine** | **Three.js 0.186.0** | Interactive 3D placement globe, particle network simulation with mouse physics |
| **Animation & Motion** | **GSAP 3.15.0**, **ScrollTrigger Plugin** | Pinned canvas frame scrubber (100–192 frames), count-up numbers, scroll reveals |
| **Forms & Validation** | **React Hook Form 7.53**, **Zod 3.23**, `@hookform/resolvers` | Client and server-side type-safe form validation for inquiries and reviews |
| **Database & ORM** | **Prisma ORM 5.22**, **PostgreSQL** / SQLite | Type-safe database queries, schema migrations, relational modeling |
| **Failover Data Store** | **In-Memory Mock Store** ([lib/mock-db.ts](file:///d:/seeyam/lib/mock-db.ts)) | Complete standalone fallback data engine requiring zero external services |
| **Archive Decompression** | **JSZip 3.10.1** | Dynamic decompression and memory caching of ZIP frame archives |
| **Communication Protocols**| WhatsApp Click-to-Chat API, Tel Protocols | Instant routing of inquiries to branch counselors |

---

## 🌐 Public Student Portal & Interactive Experience

| Page Route | Key Features & Functional Components |
| :--- | :--- |
| **`/` (Home)** | `Hero` with interactive particle background, `DataWorkflowScrollAnimation` (GSAP canvas scrubber), `AnalyticsCardsStrip` (live metrics), `CourseGrid` (catalog filters), `WorldPlacement3D` (interactive placement globe), `PlacementSection` (recruiter network), `BranchLocator` (campus cards), `ReviewSection` (verified student reviews), and `FAQSection` (accordion Q&A). |
| **`/courses`** | Full course directory with instant search and category filter tabs (All, Data Analytics, Digital Marketing, AI/Python, Business Intelligence). |
| **`/courses/[slug]`** | Dynamic program detail page: syllabus breakdown, module topics, learning outcomes, career paths, fee details, batch timings, and inquiry form. |
| **`/branches`** | Multi-city campus hub overview across Chennai (OMR, Velachery), Bangalore (BTM, HSR), and Hyderabad (Madhapur) with map navigators and direct contact links. |
| **`/branches/[slug]`** | Campus facility photos, counselor contact info, classroom amenities, local directions, and branch-specific upcoming batch schedules. |
| **`/placements`** | Placement assurance roadmap, recruiter network logos, recent student package stories (3.5 LPA – 18 LPA), and interview testimonials. |
| **`/resources`** | Student career center: downloadable resume templates, practice sheets, topic-wise interview questions, and direct job portal search shortcuts. |
| **`/reviews`** | Filterable student ratings, review submission modal with star rating picker, and verified student badges. |
| **`/about`** | Institute story, mission & vision, leadership team, senior mentor bios with LinkedIn links, and company timeline milestones. |
| **`/contact`** | Multi-branch direct phone, email, WhatsApp directory, and general inquiry form. |

---

## 🎨 3D WebGL & Advanced Animation Engine

### 1. Three.js 3D Interactive Placement Globe
- Implemented in [components/WorldPlacement3D.tsx](file:///d:/seeyam/components/WorldPlacement3D.tsx).
- Renders an interactive WebGL sphere displaying global hiring hubs and student placement markers with orbital rotation and hover interactions.

### 2. Interactive Analytics Particle Network
- Implemented in [components/HeroAnalyticsBackground.tsx](file:///d:/seeyam/components/HeroAnalyticsBackground.tsx).
- Custom 2D/3D canvas simulating node networks and data streams with real-time cursor proximity repulsion physics.

### 3. GSAP ScrollTrigger Pinned Frame Scrubber
- Implemented in [components/DataWorkflowScrollAnimation.tsx](file:///d:/seeyam/components/DataWorkflowScrollAnimation.tsx).
- Seamless frame-by-frame animation (100–192 WebP frames) driven by the user's scroll position.
- Supports high-DPI retina rendering, responsive mobile/desktop sequences, and dynamic ZIP archive loading.

---

## 🛡️ Counselor CRM & Admissions Operations (`/admin`)

Located under the protected **`/admin`** route group:

1. **Executive KPI Dashboard ([app/admin/(dashboard)/page.tsx](file:///d:/seeyam/app/admin/(dashboard)/page.tsx)):**
   - Real-time counters: Total Inquiries, New Leads Today, Enrollment Conversion %, and Active Batches.
   - Quick-action shortcuts and recent inquiries activity feed.

2. **Admissions Lead Management Sheet ([app/admin/(dashboard)/leads/page.tsx](file:///d:/seeyam/app/admin/(dashboard)/leads/page.tsx)):**
   - Searchable and status-filterable data table (`ALL`, `NEW`, `CONTACTED`, `COUNSELING`, `ENROLLED`, `DROPPED`).
   - Inline status switcher modal with counselor note logger.
   - Chronological log of counselor interactions per candidate.
   - Walk-in student quick-registration drawer.
   - One-click CSV export of filtered inquiries for offline reporting.

3. **Batch Scheduling Suite ([app/admin/(dashboard)/batches/page.tsx](file:///d:/seeyam/app/admin/(dashboard)/batches/page.tsx)):**
   - Manage upcoming, ongoing, and completed batches.
   - Assign instructors, select physical branches, allocate seat capacities, and set class schedules.

4. **Review Moderation Queue ([app/admin/(dashboard)/reviews/page.tsx](file:///d:/seeyam/app/admin/(dashboard)/reviews/page.tsx)):**
   - Review submitted student testimonials and approve or reject them before they appear publicly.

5. **Course & Branch Administration ([app/admin/(dashboard)/courses/page.tsx](file:///d:/seeyam/app/admin/(dashboard)/courses/page.tsx), [app/admin/(dashboard)/branches/page.tsx](file:///d:/seeyam/app/admin/(dashboard)/branches/page.tsx)):**
   - Manage programs, syllabus modules, tuition pricing, and campus details.

6. **SEO & Brand Settings ([app/admin/(dashboard)/seo/page.tsx](file:///d:/seeyam/app/admin/(dashboard)/seo/page.tsx)):**
   - Configure global meta titles, Open Graph tags, canonical URLs, Google Analytics (GA4), and Google Tag Manager (GTM).

---

## 📚 Academic, Placement & Career Resource Engine

### 1. Course Catalog & Syllabus Engine
- **Multi-Category Architecture:** Courses categorized into Data Analytics, Business Intelligence, Python/AI, and Digital Marketing.
- **Syllabus Accordion:** Detailed weekly modules, tools covered, project capstones, and certification outcomes.
- **Brochure Downloads:** Immediate syllabus brochure access tied into the lead capture pipeline.

### 2. Career Resources & Interview Question Bank
- **Interview Questions Bank:** Filterable questions and answers by topic (e.g., Power BI, SQL, Python, Tableau, Digital Marketing) in [components/CourseInterviewQuestions.tsx](file:///d:/seeyam/components/CourseInterviewQuestions.tsx).
- **Downloadable Assets:** Curated resume templates, practice datasets, and cheat sheets.
- **Live Job Portal Shortcuts:** Direct pre-filtered links to job openings on LinkedIn, Naukri, Indeed, and Glassdoor in [components/JobPortalLinks.tsx](file:///d:/seeyam/components/JobPortalLinks.tsx).

---

## 🗄️ Data Models & Prisma Database Schema

The relational database schema is configured in [prisma/schema.prisma](file:///d:/seeyam/prisma/schema.prisma):

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

## ⚡ Next.js Server Actions & API Handlers

All client mutations interact directly with Next.js Server Actions:

1. **Lead Operations ([actions/leads.ts](file:///d:/seeyam/actions/leads.ts)):**
   - `submitLeadAction(formData)`: Validates phone number and email with Zod, checks for duplicate inquiries within 24 hours, and creates a new CRM entry.
   - `updateLeadStatusAction({ leadId, status, note, author })`: Advances lead status (`NEW` -> `CONTACTED` -> `COUNSELING` -> `ENROLLED` -> `DROPPED`) and logs notes.
   - `addLeadNoteAction({ leadId, text, author })`: Appends timestamped counselor interaction notes.
2. **Batch Scheduling ([actions/batches.ts](file:///d:/seeyam/actions/batches.ts)):**
   - `createBatchAction(batchData)`: Schedules a new training cohort with instructor name, branch assignment, time slot, and seat limit.
   - `updateBatchAction(batchId, batchData)`: Updates batch timings, status, or seat counts.
3. **Course & Branch Management ([actions/courses.ts](file:///d:/seeyam/actions/courses.ts), [actions/branches.ts](file:///d:/seeyam/actions/branches.ts)):**
   - CRUD actions for updating syllabus modules, pricing, or adding new campuses.
4. **Student Reviews ([actions/reviews.ts](file:///d:/seeyam/actions/reviews.ts)):**
   - `submitReviewAction(reviewData)`: Captures student ratings and testimonials.
   - `updateReviewStatusAction(reviewId, status)`: Approves or rejects testimonials for public display.
5. **Frame Sequence Route Handler ([app/api/frames/route.ts](file:///d:/seeyam/app/api/frames/route.ts)):**
   - Serves image sequences for the GSAP canvas scrubber, supporting dynamic ZIP archive extraction using `JSZip` with in-memory caching.

---

## 📂 Directory & File Structure

```
d:\seeyam
├── actions/                          # Next.js Server Actions (Mutations Layer)
│   ├── auth.ts                       # Counselor and Admin authentication
│   ├── batches.ts                    # Batch scheduling & seat counters
│   ├── branches.ts                   # Campus branches CRUD
│   ├── courses.ts                    # Course curriculum & catalog actions
│   ├── leads.ts                      # CRM lead capture, status & notes
│   ├── media.ts                      # Media management actions
│   └── reviews.ts                    # Review submission & moderation
│
├── app/                              # Next.js 15 App Router
│   ├── (public)/                     # Public Student-Facing Routes
│   │   ├── about/page.tsx            # Mission, vision, timeline & mentors
│   │   ├── blog/                     # Technical articles & career guides
│   │   ├── branches/                 # Campus branch directory & pages
│   │   ├── contact/page.tsx          # General contact & campus map
│   │   ├── courses/                  # Filterable course catalog & syllabus
│   │   ├── placements/page.tsx       # Hiring partners, CTC packages & stories
│   │   ├── resources/page.tsx        # Resumes, interview Q&A & job portals
│   │   ├── reviews/page.tsx          # Verified student testimonials
│   │   ├── layout.tsx                # Public Shell (Navbar, Footer, Modals)
│   │   └── page.tsx                  # Home Landing Page
│   │
│   ├── admin/                        # Protected Counselor CRM Suite
│   │   ├── (dashboard)/              # Operations Dashboard Views
│   │   │   ├── batches/page.tsx      # Batch allocation & seat management
│   │   │   ├── branches/page.tsx     # Physical campus manager
│   │   │   ├── courses/page.tsx      # Curriculum & pricing management
│   │   │   ├── leads/page.tsx        # Filterable Lead Sheet & CSV export
│   │   │   ├── reviews/page.tsx      # Testimonial moderation queue
│   │   │   ├── seo/page.tsx          # Meta tags, Open Graph & schema settings
│   │   │   ├── settings/page.tsx     # System diagnostics & database status
│   │   │   └── page.tsx              # Executive KPI analytics dashboard
│   │   └── layout.tsx                # Admin dashboard layout & navigation
│   │
│   ├── api/                          # API Route Handlers
│   │   └── frames/route.ts           # Dynamic frame sequence decompressor
│   │
│   ├── globals.css                   # Tailwind styles, keyframes & CSS vars
│   ├── layout.tsx                    # Root HTML layout with Google Fonts & SEO
│   ├── robots.ts                     # Search engine crawler instructions
│   └── sitemap.ts                    # Dynamic XML sitemap generator
│
├── components/                       # Modular React UI Components
│   ├── admin/                        # Admin-specific components (Sidebar, Header)
│   ├── AnalyticsCardsStrip.tsx       # Live metric cards with mini-charts
│   ├── BranchLocator.tsx             # Campus map locator with WhatsApp CTAs
│   ├── CourseGrid.tsx                # Filterable course catalog with category pills
│   ├── CourseSyllabusAccordion.tsx   # Expandable module syllabus renderer
│   ├── DataWorkflowScrollAnimation.tsx # GSAP pinned canvas scrubber
│   ├── DynamicThemeProvider.tsx      # CSS variable brand theming engine
│   ├── FAQSection.tsx                # Interactive accordion FAQ
│   ├── HeroAnalyticsBackground.tsx   # Interactive HTML5 particle network canvas
│   ├── LeadModal.tsx                 # Universal course enrollment modal
│   ├── Navbar.tsx                    # Mega-menu header with course categories
│   ├── WorldPlacement3D.tsx          # Three.js 3D WebGL placement globe
│   └── ...
│
├── lib/                              # Core Utility Libraries & Business Logic
│   ├── mock-data.ts                  # Seed data, courses, branches & interview Q&As
│   ├── mock-db.ts                    # In-memory database with CRUD & stats engine
│   ├── prisma.ts                     # Prisma ORM client singleton instance
│   └── utils.ts                      # Tailwind clsx / twMerge utilities
│
├── prisma/                           # Database Layer
│   └── schema.prisma                 # PostgreSQL database schema & enums
│
├── public/                           # Static Assets & Animation Sequences
│   ├── frames-web/                   # High-res WebP desktop frame sequences
│   ├── frames-mobile/                # Optimized mobile frame sequences
│   └── logos/                        # Partner recruiter logos & branding
│
├── package.json                      # NPM dependencies and scripts
├── tailwind.config.ts                # Tailwind design tokens & theme extenders
└── tsconfig.json                     # TypeScript strict configuration
```

---

## 🎨 Dynamic Theming & Brand Customization Engine

The platform features a zero-rebuild runtime theming engine powered by [components/DynamicThemeProvider.tsx](file:///d:/seeyam/components/DynamicThemeProvider.tsx):

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
- **5 Curated Theme Presets:**
  - **Royal Blue & Solar Orange** (`default`): Primary `#2563eb`, Accent `#f97316`
  - **Forest Emerald & Amber** (`emerald`): Primary `#059669`, Accent `#f59e0b`
  - **Electric Violet & Pink** (`violet`): Primary `#7c3aed`, Accent `#ec4899`
  - **Deep Indigo & Cyan** (`indigo`): Primary `#4f46e5`, Accent `#06b6d4`
  - **Ruby Crimson & Sky Blue** (`crimson`): Primary `#e11d48`, Accent `#0284c7`
- **Dynamic Google Fonts Injection:** Automatically injects the selected font stylesheet into the `<head>` (`Inter`, `Plus Jakarta Sans`, `Outfit`, `Poppins`, `Roboto`, `Space Grotesk`, `Lexend`, `DM Sans`).

---

## 🚀 Environment Configuration & Setup Guide

### Prerequisites:
- **Node.js**: v18.18+ or v20+
- **npm** (or **pnpm** / **yarn**)
- *(Optional)* **PostgreSQL** database (the platform operates immediately with its in-memory database store if PostgreSQL is not configured)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env.local` file in the project root:
```env
# Database Connection (PostgreSQL or SQLite) - Optional
DATABASE_URL="postgresql://postgres:password@localhost:5432/seeyam_db?schema=public"

# Public Domain URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Step 3: Initialize Database (If using PostgreSQL)
```bash
npx prisma generate
npx prisma db push
```

### Step 4: Run Development Server
```bash
npm run dev
```

- **Public Student Portal:** [http://localhost:3000](http://localhost:3000)
- **Counselor CRM Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🚢 Production Deployment Strategy

1. **Production Build:**
   ```bash
   npm run build
   npm run start
   ```
2. **Hosting Environments:**
   - **Vercel / AWS Amplify:** Seamless deployment of Next.js 15 Server Components and Server Actions.
   - **Docker / Node.js Container:** Compatible with standalone Node.js environments (`output: "standalone"`).
3. **Zero-Downtime Guarantee:**
   - If a PostgreSQL database connection experiences interruption, the system automatically falls back to the in-memory store ([lib/mock-db.ts](file:///d:/seeyam/lib/mock-db.ts)), preventing runtime errors for website visitors.

---

## 📄 License & Attribution

Developed for **Seeyam Technologies** — Premier Data Analytics, Digital Marketing & Placement Training Institute.  
All rights reserved © 2026.
