# Connect Next.js Project to WordPress Headless CMS

Integrate the existing Seeyam Technologies Next.js 15 (App Router) project with a local WordPress instance at `http://seeyam.local/wp-json/wp/v2` so that pages can be fetched by slug and rendered dynamically.

## User Review Required

> [!IMPORTANT]
> **No `src/` directory exists.** Your request mentions `src/services/wordpress.js`, but this project uses root-level directories (`app/`, `lib/`, `components/`). I'll place the service at **`lib/wordpress.ts`** (TypeScript, consistent with the rest of the codebase) instead.

> [!WARNING]
> **WordPress must be running.** The dynamic page route will make server-side requests to `http://seeyam.local/wp-json/wp/v2/pages?slug=...` at build/request time. If your local WordPress instance is not running, pages will show the fallback "not found" state.

## Open Questions

> [!IMPORTANT]
> **Where should the dynamic WordPress page route live?** The project already has static pages under `app/(public)/` for `about`, `courses`, `branches`, etc. I propose creating a new **catch-all route** at `app/(public)/[...wp-slug]/page.tsx` that will:
> - Only activate for slugs that don't match existing static routes (Next.js prioritizes static routes over dynamic ones)
> - Fetch and render any WordPress page by its slug
> 
> **Alternative:** If you'd prefer a dedicated prefix like `/pages/some-slug`, let me know.

> [!IMPORTANT]
> **Should images from WordPress be allowed?** Your `next.config.ts` already allows all remote image hosts (`hostname: "**"`), so WordPress-embedded images will work automatically. No change needed.

## Proposed Changes

### Environment Configuration

#### [NEW] [.env.local](file:///d:/greens/.env.local)
```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://seeyam.local/wp-json/wp/v2
```
Using `NEXT_PUBLIC_` prefix so it's available on both server and client if needed. However, since we fetch on the server side in App Router, a non-prefixed `WORDPRESS_API_URL` would also work. I'll use `NEXT_PUBLIC_` for flexibility.

---

### WordPress API Service

#### [NEW] [wordpress.ts](file:///d:/greens/lib/wordpress.ts)
A TypeScript service module with:
- **`getPageBySlug(slug: string)`** — Fetches a single WordPress page by slug from the REST API. Returns `null` if not found.
- **`getAllPages()`** — Fetches all published pages (useful for generating static paths or sitemaps later).
- **`getPostBySlug(slug: string)`** — Fetches a single WordPress post by slug (for future blog integration).
- Proper error handling with try/catch, typed interfaces for the WordPress REST API response.
- Uses `fetch()` with `next: { revalidate: 60 }` for ISR (Incremental Static Regeneration) — pages are cached for 60 seconds.

---

### Dynamic Page Route

#### [NEW] [[...wp-slug]/page.tsx](file:///d:/greens/app/(public)/[...wp-slug]/page.tsx)
A Server Component that:
1. Extracts the slug from the catch-all route params
2. Calls `getPageBySlug()` from the WordPress service
3. Renders the page title and HTML content using `dangerouslySetInnerHTML` (standard for WordPress rendered content)
4. Includes proper `<Metadata>` generation with title and excerpt
5. Returns `notFound()` if no page is found (triggers Next.js 404)
6. Uses a Suspense boundary with a styled loading skeleton for the loading state

#### [NEW] [[...wp-slug]/loading.tsx](file:///d:/greens/app/(public)/[...wp-slug]/loading.tsx)
A loading skeleton component that shows while the WordPress page is being fetched — animated pulse placeholders for title, meta, and body content blocks.

---

### Next.js Configuration Update

#### [MODIFY] [next.config.ts](file:///d:/greens/next.config.ts)
Add `seeyam.local` to the allowed image remote patterns so WordPress-hosted media renders correctly. (The existing `**` wildcard may already cover this, but adding `http` protocol explicitly ensures local dev works.)

## Verification Plan

### Manual Verification
1. Start the dev server with `npm run dev`
2. Open the browser and navigate to a WordPress page slug (e.g., `http://localhost:3000/sample-page` if a "Sample Page" exists in WordPress)
3. Verify the page renders with title and content from WordPress
4. Verify existing static routes (`/about`, `/courses`, `/branches`) still work without interference
5. Verify a non-existent slug shows the 404 page
