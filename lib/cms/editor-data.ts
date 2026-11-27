import { contactDetails } from "@/lib/contact";
import { publishedSyllabus } from "@/lib/course-curriculum";
import { getBasePlatform } from "../published-platform";
import { db, prisma } from "../db";
import { emptySeo } from "../seo-fields";
import { getSeoTargets } from "../seo";
import { readSeo } from "../seo-store";
import { sections, seoId, type Kind, type Values } from "./fields";
import { cmsAdmin, documents, history } from "./store";
import { listMedia } from "./media";
import { trainers,existingTrainers } from "./public";
export interface Entry {
  kind: Kind;
  id: string;
  values: Values;
  version: number;
  status: string;
}
export async function editorData() {
  await cmsAdmin();
  const [
    catalog,
    allCourses,
    allReviews,
    allPlacements,
    docs,
    events,
    media,
    seo,
    targets,
  ] = await Promise.all([
    getBasePlatform(),
    db.getCourses(),
    prisma.review.findMany({ where: { status: "APPROVED" } }),
    prisma.placementStory.findMany(),
    documents(),
    history(),
    listMedia(),
    readSeo(),
    getSeoTargets(),
  ]);
  const entries: Entry[] = [];
  function add(kind: Kind, id: string, values: Values) {
    entries.push({ kind, id, values, version: 0, status: "Existing" });
  }
  add("home", "page", {
    headline: "Software Training",
    headlineAccent: "Institute in Chennai",
    intro: "Practical training. Career support.",
    analytics: "Data Analytics",
    marketing: "Digital Marketing",
    sections: sections.join("\n"),
    cta: "Book a Free Demo",
    secondary: "Explore Courses",
    secondaryUrl: "/courses",
  });
  const settings = catalog.settings;
  add("about", "page", {
    intro: settings.about_hero_title || "",
    description: settings.about_hero_subtitle || "",
    mission: settings.about_mission_text || "",
    vision: settings.about_vision_text || "",
  });
  const office = contactDetails(settings);
  add("contact", "page", {
    phone: office.phone,
    email: office.email,
    whatsapp: office.whatsapp,
    address: office.address,
    maps: office.maps,
    facebook: settings.social_facebook || "",
    instagram: settings.social_instagram || "",
    linkedin: settings.social_linkedin || "",
    youtube: settings.social_youtube || "",
    twitter: settings.social_twitter || "",
  });
  allCourses.forEach((c) =>
    add("course", c.id, {
      title: c.title,
      slug: c.slug,
      categoryId: c.categoryId,
      summary: c.summary,
      duration: c.duration,
      price: String(c.price),
      syllabus: publishedSyllabus(c.slug, c.syllabus, [])
        .map((s) => [s.title, s.duration, s.topics.join("; ")].join(" | "))
        .join("\n"),
      highlights: c.highlights.join("\n"),
      featured: String(c.isFeatured),
    }),
  );
  allReviews.forEach((r) =>
    add("testimonial", r.id, {
      name: r.studentName,
      title: r.title,
      body: r.body,
      courseId: r.courseId,
      branchId: r.branchId,
      rating: String(r.rating),
    }),
  );
  allPlacements.forEach((p) =>
    add("placement", p.id, {
      name: p.studentName,
      company: p.companyName,
      role: p.role,
      courseId: p.courseId || "",
      package: p.packageCtc,
      story: p.quote || "",
      image: p.studentAvatarUrl || "",
    }),
  );
  trainers([],existingTrainers(settings.about_trainers_json)).forEach(([id, v]) => add("trainer", id, v));
  for (const target of targets) add("page", seoId(target.path), {path:target.path, title:target.title});
  for (const path of new Set([
    "/",
    "/about",
    "/courses",
    "/trainers",
    "/gallery",
    "/reviews",
    "/placements",
    "/contact",
    "/branches",
    "/blog",
    "/resources",
    ...targets.map(target=>target.path),
    ...allCourses.map((c) => "/courses/" + c.slug),
    ...(seo?.pages || []).map((p) => p.path),
  ])) {
    add("seo", seoId(path), {
      ...emptySeo,
      ...seo?.pages.find((p) => p.path === path)?.fields,
      path,
    });
  }
  for (const d of docs) {
    const i = entries.findIndex((e) => e.kind === d.kind && e.id === d.id);
    const entry = {
      kind: d.kind,
      id: d.id,
      values: d.draft,
      version: d.version,
      status: d.withdrawn
        ? "Unpublished"
        : !d.published
          ? "Draft"
          : JSON.stringify(d.draft) === JSON.stringify(d.published)
            ? "Published"
            : "Draft changes",
    };
    if (i >= 0) entries[i] = entry;
    else entries.push(entry);
  }
  return {
    entries,
    events,
    media,
    options: {
      course: allCourses.map((c) => ({ id: c.id, name: c.title })),
      branch: catalog.branches.map((b) => ({ id: b.id, name: b.name })),
      category: catalog.categories.map((c) => ({ id: c.id, name: c.name })),
    },
  };
}
export type EditorData = Awaited<ReturnType<typeof editorData>>;
