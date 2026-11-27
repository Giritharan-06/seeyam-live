const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { PrismaClient } = require("@prisma/client");

function readSiteModule(filename) {
  const file = path.join(__dirname, "..", "lib", filename);
  const source = fs.readFileSync(file, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  new Function("exports", "require", compiled)(exports, require);
  return exports;
}

const { aboutCopy } = readSiteModule("about-copy.ts");
const { SEEYAM_CAMPUS, contactDetails } = readSiteModule("contact.ts");
const { chennaiCourses } = readSiteModule("chennai-courses.ts");
const { publishedSyllabus } = readSiteModule("course-curriculum.ts");
const { emptySeo, seoFields } = readSiteModule("seo-fields.ts");
const office = contactDetails();
const db = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("An explicit DATABASE_URL is required.");
  const counts = await db.$transaction(async tx => {
    await tx.branch.findUniqueOrThrow({ where: { slug: SEEYAM_CAMPUS.slug }, select: { id: true } });
    const copy = {
      home: {
        headline: "Software Training",
        headlineAccent: "Institute in Chennai",
        intro: "Practical training. Career support.",
        analytics: "Data Analytics",
        marketing: "Digital Marketing",
        sections: "hero\njourneys\ncourses\ncompanies\nstatistics\ncommunity\ncampuses\ncounseling",
        cta: "Book a Free Demo",
        secondary: "Explore Courses",
        secondaryUrl: "/courses",
      },
      about: {
        intro: aboutCopy.title,
        description: aboutCopy.introduction,
        mission: aboutCopy.mission,
        vision: aboutCopy.commitment,
      },
      contact: { phone: office.phone, email: office.email, whatsapp: office.whatsapp, address: office.address, maps: office.maps },
    };
    let cms = 0;
    for (const [kind, fields] of Object.entries(copy)) {
      const values = JSON.stringify(fields);
      const added = await tx.$executeRaw`
        INSERT INTO cms_documents (kind, id, draft, published)
        VALUES (${kind}, 'page', ${values}::jsonb, ${values}::jsonb)
        ON CONFLICT (kind, id) DO NOTHING
      `;
      cms += added;
      if (added) await tx.$executeRaw`
        INSERT INTO cms_history (kind, id, version, action, actor_id)
        VALUES (${kind}, 'page', 1, 'publish', 'usr-admin-1')
      `;
    }

    let courses = 0;
    const analyticsSlugs = [
      "data-analytics-master-program", "python-data-analytics", "sql-for-data-analytics",
      "tableau-visual-analytics", "power-bi-business-intelligence",
    ];
    const rows = await tx.course.findMany({ where: { slug: { in: analyticsSlugs } }, select: { id: true, slug: true, syllabusJson: true } });
    for (const course of rows) {
      const previous = Array.isArray(course.syllabusJson) ? course.syllabusJson : [];
      const syllabus = publishedSyllabus(course.slug, previous, []);
      if (JSON.stringify(previous) === JSON.stringify(syllabus)) continue;
      await tx.course.update({ where: { id: course.id }, data: { syllabusJson: syllabus } });
      courses++;
    }

    let seo = 0;
    for (const guide of Object.values(chennaiCourses)) {
      const fields = JSON.stringify(seoFields.parse({
        ...emptySeo, title: guide.title, description: guide.description, focusKeywords: guide.keywords.join(", "),
      }));
      seo += await tx.$executeRaw`
        INSERT INTO seo_settings (key, value) VALUES (${guide.path}, ${fields}::jsonb)
        ON CONFLICT (key) DO NOTHING
      `;
    }
    return { cms, courses, seo };
  }, { timeout: 30000 });
  console.log("Approved site records applied.", counts);
}

main().catch(error => {
  console.error("Approved site seed failed.", error.code || error.name);
  process.exitCode = 1;
}).finally(() => db.$disconnect());
