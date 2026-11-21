// Node 24+ supports loading the project's TypeScript content files directly.
require('@next/env').loadEnvConfig(process.cwd());
const { PrismaClient } = require('@prisma/client');
const source = require('../lib/mock-data.ts');
const { BLOG_POSTS } = require('../lib/blog-data.ts');
const db = new PrismaClient();
const courseIds = new Set(source.MOCK_COURSES.map(course => course.id));

function preserveCourseReference(row) {
  if (!row.courseId || courseIds.has(row.courseId)) return row;
  return { ...row, legacyCourseId: row.courseId, courseId: null };
}

const groups = [
  ['category', 'id', source.MOCK_CATEGORIES],
  ['branch', 'id', source.MOCK_BRANCHES],
  ['course', 'id', source.MOCK_COURSES.map(({ syllabus, ...course }) => ({
    ...course, syllabusJson: syllabus,
  }))],
  ['batch', 'id', source.MOCK_BATCHES.map(batch => ({ ...batch, startDate: new Date(batch.startDate) }))],
  ['placementStory', 'id', source.MOCK_PLACEMENTS],
  ['review', 'id', source.MOCK_REVIEWS],
  ['fAQ', 'id', source.MOCK_FAQS.map(preserveCourseReference)],
  ['interviewQuestion', 'id', source.MOCK_INTERVIEW_QUESTIONS.map(preserveCourseReference)],
  ['resource', 'id', source.MOCK_RESOURCES.map(preserveCourseReference)],
  ['jobPortalLink', 'id', source.MOCK_JOB_PORTAL_LINKS],
  ['blogPost', 'slug', BLOG_POSTS.map(({ slug, title, ...content }) => ({ slug, title, content }))],
  ['hiringPartner', 'name', source.MOCK_HIRING_PARTNERS],
  ['siteSetting', 'key', [{ key: 'heroMedia', value: source.INITIAL_HERO_MEDIA }]],
];

async function main() {
  const counts = await db.$transaction(async tx => {
    const results = [];
    for (const [model, key, records] of groups) {
      const { count } = await tx[model].createMany({ data: records, skipDuplicates: true });
      const imported = await tx[model].count({ where: { [key]: { in: records.map(row => row[key]) } } });
      if (imported !== records.length) throw new Error('Missing source records for ' + model);
      results.push({ model, inserted: count, verified: imported });
    }
    return results;
  }, { timeout: 60000 });
  console.table(counts);
}

main().catch(error => {
  console.error(error.code || error.name, error.message.split('Invalid `')[0].slice(0,180));
  process.exitCode = 1;
}).finally(() => db.$disconnect());
