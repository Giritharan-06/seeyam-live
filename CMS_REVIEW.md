# SEEYAM website CMS

## Architecture and scope

The public site and the staff portal share a Next.js 15.5.23 App Router application, React 19, TypeScript and Tailwind. Server Actions in `actions/` call Prisma 5.22 for PostgreSQL. The live repository is Giritharan-06/seeyam-live. Vercel builds with Prisma generation followed by Next.js, with page generation concurrency limited for the database connection pool. This work is a local extension of that application.

The existing login endpoint is `POST /api/admin/sign-in`. The server checks the configured administrator or counselor credentials, issues the existing signed HTTP-only session cookie and evaluates the role on subsequent requests. The CMS uses the same session and secure configuration check as SEO management. Administrator access is checked at the editor, preview, upload, private media read and mutation boundaries. Counselors retain their existing operational features.

Courses reference categories. Batches and enquiries reference campuses and courses. The platform also has users, reviews, placement stories, FAQs, interview questions, resources, hiring partners, job links, blog posts, site settings and SEO settings. The existing public catalog combines Neon records with optional WordPress site settings. Homepage copy and section order, default trainers, design elements and some supporting marketing copy were component constants. Media consisted of bundled files, external image URLs and YouTube embeds. No configured object-storage integration was found.

The implementation uses section settings for Home, About and Contact, individual editorial records for gallery and trainers, and revisions keyed to the original IDs for courses, reviews and placements. Publishing those last three updates the existing business records in the same transaction. Archiving a course hides the public entry and preserves its operational relationships. SEO publishes to the existing SEO settings table. The existing operational editors remain available and their ordinary edits still take effect directly. Use Website Content for changes that require editorial review. Student registry, job applications, notifications, reporting expansion and payments are a separate requirements phase.

## Publishing and storage

- **Save draft** writes only the validated draft and increments its revision. Simultaneous stale edits are rejected. Refresh before applying a rejected change.
- **Preview saved draft** opens an authenticated, non-indexable preview. Pages use their normal public components with draft data injected for that request. Course preview displays the course card and syllabus. SEO preview displays the search and social fields.
- **Publish** updates the selected item, records the actor and time, promotes image references and revalidates the public pages. Other saved drafts stay private.
- **Unpublish** restores baseline settings for singleton pages or hides a collection entry. The draft remains editable. Publish it again to restore visibility.
- The media library accepts JPEG, PNG and WebP uploads up to 4 MiB. The server decodes them, enforces a pixel limit and re-encodes as WebP. Private drafts use authenticated image reads. Replacing an image updates saved drafts, and publishing makes each replacement visible. Unused media can be removed.
- Local image bytes live in the ignored `.cms-media/` directory. Vercel requires a configured durable provider. The Cloudinary adapter uploads authenticated assets and performs signed reads on the server. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` only in the environment where that adapter is needed. [Cloudinary authenticated assets](https://cloudinary.com/documentation/control_access_to_media)

## Database migration and local setup

The additive migration in `prisma/cms.sql` creates four tables. `cms_documents` keeps independent draft and published JSON values, optimistic version and withdrawal state. `cms_history` records publication events. `cms_media` stores private storage identifiers and file metadata. `cms_media_usage` links media to draft or published documents with foreign keys. Prisma models describe the same tables. The SQL also supplies checks and a partial index.

1. Use a development PostgreSQL database with the current SEEYAM schema, including `seo_settings`. Set the **shell-local** `DATABASE_URL` to this database. Check its host and database name before executing SQL. The repository's existing environment file may point to production.
2. Install the locked dependencies with `npm ci`. Run `npx prisma validate`, then `npx prisma db execute --schema prisma/schema.prisma --file prisma/cms.sql` against the development database. Run `npx prisma generate`. On Windows, a running Next.js process may hold the Prisma engine open. Use an isolated build copy or stop that local process before regenerating.
3. For the local review server, provide `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters) and `SESSION_SECRET` (at least 32 characters) in its own environment. Retain existing production credentials. Local media works without a provider account.
4. Run `npm run dev`, sign in via `/admin/login`, then open **Website Content**. For a production-mode local check, use `npm run build` and `npm start`.
5. Save a draft, open its private preview, and compare with a signed-out public window. Publish, refresh the public page, then unpublish and check Publishing history. For a new image, upload it first, choose it in a draft and publish that item.
6. Before a future production release, review the diff and migration on staging, back up the existing database, configure and test private cloud media, and approve the production migration separately. A code deployment and database migration are distinct operations.

## Repeatable browser regression

`scripts/test-cms.cjs` takes an isolated, seeded local PostgreSQL database with a name starting with `cms_` and no CMS documents. It creates local-only test sign-in credentials for its own server, writes test content, and leaves that disposable database available for inspection. It refuses remote database hosts. Use a fresh test database on each run.

Set `CMS_TEST_DATABASE_URL` to its localhost connection string, `CMS_TEST_BUILD` to the directory containing the built application, `CMS_TEST_BROWSER` to a local Chrome or Edge executable, and `CMS_TEST_PLAYWRIGHT` to an installed playwright-core module path if the module is outside the project. Run `node scripts/test-cms.cjs`. Port 4439 is the default, configurable via `CMS_TEST_PORT`.

## Verification results

- Applied the CMS SQL to a disposable UTF-8 PostgreSQL database and loaded the existing sample catalog.
- The isolated checkout passed the production build, including Prisma generation and Next.js type checking.
- The browser suite passed administrator sign-in, counselor and signed-out access checks, draft isolation, private preview, publishing, unpublishing, image validation, image replacement and deletion safeguards, course archiving, publication history, the mobile CMS layout and public routes. It also exercised publishing through About, Contact, Trainers, Testimonials, Placements and Page SEO.
- The existing lint command prompted for ESLint setup because the repository has no ESLint configuration. Cloudinary was unavailable for end-to-end verification because this workspace has no configured account credentials. Local image storage passed the browser checks.

## Review boundaries

The CMS manages the fields listed in each editor. The design, illustrations, generic explanatory copy and functions such as the course search, FAQ widget and enquiry submission continue to live in their existing components. The optional legacy WordPress content integration remains intact. Public previews do not require public preview tokens. CMS history is an event log, not a full historical rollback interface.

## File inventory

### Created

- `CMS_REVIEW.md`
- `actions/cms.ts`
- `app/(public)/gallery/page.tsx`
- `app/(public)/trainers/page.tsx`
- `app/admin/(dashboard)/website-content/page.tsx`
- `app/admin/(dashboard)/website-content/preview/[kind]/[id]/page.tsx`
- `app/api/cms/media/[id]/route.ts`
- `app/api/cms/media/route.ts`
- `components/CmsDirectory.tsx`
- `components/admin/CmsEditor.tsx`
- `components/admin/CmsMedia.tsx`
- `lib/cms/editor-data.ts`
- `lib/cms/fields.ts`
- `lib/cms/media.ts`
- `lib/cms/public.ts`
- `lib/cms/store.ts`
- `lib/cms/trainers.ts`
- `prisma/cms.sql`
- `scripts/test-cms.cjs`

### Modified

- `.gitignore`
- `app/(public)/PageContent.tsx`
- `app/(public)/about/PageContent.tsx`
- `app/(public)/blog/[slug]/page.tsx`
- `app/(public)/contact/PageContent.tsx`
- `app/(public)/courses/PageContent.tsx`
- `app/(public)/layout.tsx`
- `app/(public)/placements/PageContent.tsx`
- `app/(public)/reviews/PageContent.tsx`
- `app/layout.tsx`
- `components/Footer.tsx`
- `components/Hero.tsx`
- `components/HomeCommunitySections.tsx`
- `components/HomeCourseCard.tsx`
- `components/PlatformDataContext.tsx`
- `components/StructuredData.tsx`
- `components/admin/Sidebar.tsx`
- `lib/mock-data.ts`
- `lib/published-platform.ts`
- `lib/seo.ts`
- `lib/wordpress.ts`
- `package-lock.json`
- `package.json`
- `prisma/schema.prisma`
- `tsconfig.json`
