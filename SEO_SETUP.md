# SEEYAM SEO management

The Next.js server reads page metadata and crawl rules from Neon PostgreSQL. Each public path has its own record in `public.seo_settings`. The key `robots` stores site-wide crawl rules. The same records power the admin editor, public page metadata, structured data, sitemap, and robots.txt.

## Setup

1. Configure the server-only `DATABASE_URL` with a Neon PostgreSQL connection string and TLS enabled. Run `prisma/seo-settings.sql` once in the target database. The application database user needs SELECT, INSERT and UPDATE on the table.
2. Configure `ADMIN_PASSWORD` (12 or more characters) and `SESSION_SECRET` (32 or more characters) in the server environment. Set `ADMIN_EMAIL` for the administrator's login and `NEXT_PUBLIC_SITE_URL` to the public origin. Changing the session secret requires signing in again.
3. Sign in at `/admin/login` and open `/admin/seo`. Save a page's title and check its public HTML. Indexing settings also affect `/sitemap.xml`. The crawl rules editor publishes to `/robots.txt`.

## Content sources

Courses, campuses and CMS pages continue to use their existing content sources. Blog articles come from the local article catalog. WordPress SEO credentials are unnecessary. Any previously saved WordPress SEO overrides would require an explicit import into Neon.
