export type InputType =
  | "text"
  | "paragraph"
  | "lines"
  | "image"
  | "url"
  | "number"
  | "check"
  | "course"
  | "branch"
  | "category"
  | "date";
export type Field = {
  key: string;
  label: string;
  type: InputType;
  required?: boolean;
};
const f = (
  key: string,
  label: string,
  type: InputType = "text",
  required = false,
): Field => ({ key, label, type, required });
const order = f("order", "Display order", "number"),
  image = f("image", "Image", "image");
export const sections = [
  "hero",
  "journeys",
  "courses",
  "companies",
  "statistics",
  "community",
  "campuses",
  "counseling",
];
export const fields = {
  page: [f("path","Public URL","text",true), f("title","Section heading","text",true), f("description","Page introduction","paragraph"), image, f("imageAlt","Image alternative text"), f("cta","Button label"), f("href","Button destination","url")],
  seo: [
    f("path", "Public page path", "text", true),
    f("title", "Meta title"),
    f("description", "Meta description", "paragraph"),
    f("focusKeywords", "Focus keywords"),
    f("canonical", "Canonical URL", "url"),
    f("ogTitle", "Open Graph title"),
    f("ogDescription", "Open Graph description", "paragraph"),
    f("socialImage", "Social sharing image", "image"),
    f("imageAlt", "Image alternative text"),
    f("indexing", "Indexing (inherit, index, noindex)"),
    f("structuredData", "Structured data JSON", "paragraph"),
  ],
  home: [
    f("headline", "Hero headline"),
    f("headlineAccent", "Hero headline accent"),
    f("intro", "Hero introduction"),
    f("analytics", "Analytics course label"),
    f("marketing", "Marketing course label"),
    f("description", "Hero description", "paragraph"),
    image,
    f("background", "Hero background", "image"),
    f("cta", "Primary button label"),
    f("href", "Primary button link (empty opens enquiry form)", "url"),
    f("secondary", "Secondary button label"),
    f("secondaryUrl", "Secondary button link", "url"),
    f("highlights", "Highlights · one per line", "lines"),
    f("statistics", "Statistics · title | caption per line", "lines"),
    f("featured", "Featured course IDs · one per line", "lines"),
    f("testimonials", "Featured student review IDs · one per line", "lines"),
    f("sections", "Visible sections · one per line in display order", "lines"),
  ],
  about: [
    f("intro", "Company introduction"),
    f("description", "About description", "paragraph"),
    f("mission", "Mission", "paragraph"),
    f("vision", "Vision", "paragraph"),
    f("values", "Core values · title | description per line", "lines"),
    image,
  ],
  contact: [
    f("phone", "Primary phone"),
    f("email", "Email"),
    f("address", "Address", "paragraph"),
    f("whatsapp", "WhatsApp number"),
    f("maps", "Google Maps link", "url"),
    ...["facebook", "instagram", "linkedin", "youtube", "twitter"].map((k) =>
      f(k, k[0].toUpperCase() + k.slice(1) + " URL", "url"),
    ),
  ],
  course: [
    f("title", "Course title", "text", true),
    f("languages", "Teaching languages, one per line", "lines"),
    f("slug", "URL slug", "text", true),
    f("categoryId", "Category", "category", true),
    f("summary", "Description", "paragraph", true),
    f("duration", "Duration", "text", true),
    f("price", "Fees", "number", true),
    f(
      "syllabus",
      "Syllabus · topic | subtopics separated by semicolons",
      "lines",
    ),
    f("highlights", "Features · one per line", "lines"),
    image,
    order,
    f("featured", "Featured", "check"),
  ],
  trainer: [
    f("name", "Trainer name", "text", true),
    f("role", "Designation"),
    f("experience", "Experience"),
    f("skills", "Skills · one per line", "lines"),
    f("description", "Biography", "paragraph"),
    image,
    order,
  ],
  gallery: [
    f("title", "Image title", "text", true),
    f("alt", "Alternative text", "text", true),
    f("category", "Gallery category", "text", true),
    f("image", "Gallery image", "image", true),
    order,
  ],
  testimonial: [
    f("name", "Student name", "text", true),
    f("title", "Headline", "text", true),
    f("body", "Feedback", "paragraph", true),
    f("courseId", "Course", "course", true),
    f("branchId", "Campus", "branch", true),
    f("rating", "Rating (1–5)", "number", true),
    image,
    order,
  ],
  placement: [
    f("name", "Student name", "text", true),
    f("company", "Company", "text", true),
    f("role", "Job role", "text", true),
    f("courseId", "Course", "course"),
    f("package", "Package"),
    f("date", "Placement date", "date"),
    f("story", "Success story", "paragraph"),
    image,
    order,
  ],
} satisfies Record<string, Field[]>;
export type Kind = keyof typeof fields;
export const names: Record<Kind, string> = {
  page: "Public pages",
  seo: "Page SEO",
  home: "Homepage",
  about: "About us",
  contact: "Contact information",
  course: "Courses",
  trainer: "Trainers",
  gallery: "Gallery",
  testimonial: "Testimonials",
  placement: "Placements",
};
export type Values = Record<string, string>;
export type Item = { kind: Kind; id: string; values: Values | null };
export const singleton = (kind: Kind) =>
  ["home", "about", "contact"].includes(kind);
export const lines = (s?: string) =>
  (s || "")
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);
export const validKey = (kind: string, id: string): kind is Kind =>
  Object.hasOwn(fields, kind) &&
  (["seo","page"].includes(kind) ? /^[\w-]{1,500}$/ : /^[\w-]{1,100}$/).test(id) &&
  (!singleton(kind as Kind) || id === "page");
export const mediaPath =
  /^\/api\/cms\/media\/([a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12})$/i;
function safeLink(s: string) {
  if (/[\s\\\u0000-\u001f]/.test(s)) return false;
  if (s.startsWith("/") && !s.startsWith("//")) return true;
  try {
    const u = new URL(s);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}
export function validate(kind: Kind, raw: unknown): Values {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw Error("Invalid content.");
  const result: Values = {};
  for (const field of fields[kind]) {
    const input = (raw as Values)[field.key] ?? "";
    if (
      typeof input !== "string" ||
      input.length >
        (["lines", "paragraph"].includes(field.type) ? 12000 : 2048)
    )
      throw Error("Invalid " + field.label);
    const v = input.trim();
    if (field.required && !v) throw Error(field.label + " is required.");
    if (
      v &&
      ((field.type === "url" && !safeLink(v)) ||
        (field.type === "image" &&
          !mediaPath.test(v) &&
          !(safeLink(v) && (!v.startsWith("/") || v.startsWith("/images/")))) ||
        (field.type === "number" &&
          (!/^\d+(\.\d+)?$/.test(v) ||
            !Number.isFinite(Number(v)) ||
            Number(v) > 1e9)) ||
        (field.key === "rating" && !/^[1-5]$/.test(v)) ||
        (field.key === "slug" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)) ||
        (field.key === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) ||
        (field.type === "date" && !/^\d{4}-\d\d-\d\d$/.test(v)) ||
        (field.key === "sections" &&
          lines(v).some((k) => !sections.includes(k))) ||
        (field.type === "check" && !["true", "false"].includes(v)))
    )
      throw Error("Check " + field.label + ".");
    result[field.key] = v;
  }
  return result;
}

export const seoId = (path: string) =>
  "path-" + path.replaceAll("_", "_u").replaceAll("/", "_s");
