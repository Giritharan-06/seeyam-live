# Admin operations

The staff dashboard uses the existing sign-in session and sidebar. The operations migration adds student, trainer, enrolment, trainer assignment, job, application, placement, payment and staff announcement records. Enrolments and assignments reference existing batches. Placement records reference offered applications.

Administrators can manage all workspaces. Counselors can manage students, enrolments, job openings, applications and placements and read staff announcements. Account management reuses the existing administrator and counselor roles. The Payments workspace records receipts in INR and can void an incorrect entry. It does not charge students.

## Local setup

1. Point the shell's `DATABASE_URL` at a development database that already has the application schema.
2. Run `npx prisma db execute --schema prisma/schema.prisma --file prisma/admin-operations.sql`.
3. Start the local app and sign in to `/admin`. The existing course catalog, CMS and SEO retain their own controls.
4. Run `node scripts/test-admin-operations.cjs` with a fresh local fixture, `OPS_TEST_EMAIL`, `OPS_TEST_PASSWORD` and a local `OPS_TEST_URL` if it differs from port 4440. Set `CMS_TEST_BROWSER` to a local Chromium executable and `CMS_TEST_PLAYWRIGHT` to the installed Playwright module if it is outside the project.
