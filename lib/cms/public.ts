import type { AllPlatformDataResponse } from "../wordpress";
import { lines, type Item, type Values, type Kind } from "./fields";
import { DEFAULT_TRAINERS } from "./trainers";
import { SEEYAM_CAMPUS, contactDetails, mapLinkFromEmbed } from "../contact";
import { publishedSyllabus } from "../course-curriculum";

export function existingTrainers(json?:string){
  if(json) try {const rows:unknown=JSON.parse(json);if(Array.isArray(rows)&&rows.every(r=>r && typeof r.name==="string" && typeof r.role==="string" && typeof r.bio==="string" && Array.isArray(r.tags)))return rows as typeof DEFAULT_TRAINERS;} catch {}
  return DEFAULT_TRAINERS;
}

export function trainers(items: Item[], defaults = DEFAULT_TRAINERS) {
  const result = new Map(
    defaults.map((t, i) => [
      "trainer-" + (i + 1),
      {
        name: t.name,
        role: t.role,
        experience: t.experience,
        description: t.bio,
        image: t.avatar,
        skills: t.tags.join("\n"),
        order: String(i),
      } as Values,
    ]),
  );
  for (const i of items.filter((i) => i.kind === "trainer")) {
    if (i.values) result.set(i.id, i.values);
    else result.delete(i.id);
  }
  return [...result].sort((a, b) => Number(a[1].order) - Number(b[1].order));
}
export function applyContent(
  base: AllPlatformDataResponse,
  items: Item[],
): AllPlatformDataResponse {
  const settings = { ...base.settings };
  const lookup = (kind: Kind, id: string) =>
    items.find((i) => i.kind === kind && i.id === id);
  const settingsMap = (
    kind: Kind,
    map: Record<string, keyof typeof settings>,
  ) => {
    const v = lookup(kind, "page")?.values;
    if (v)
      for (const [key, target] of Object.entries(map))
        if (v[key]) settings[target] = v[key];
  };
  settingsMap("about", {
    intro: "about_hero_title",
    description: "about_hero_subtitle",
    mission: "about_mission_text",
    vision: "about_vision_text",
  });
  settingsMap("contact", {
    phone: "footer_phone",
    whatsapp: "contact_whatsapp",
    email: "footer_email",
    address: "contact_address",
    maps: "contact_maps",
    facebook: "social_facebook",
    instagram: "social_instagram",
    linkedin: "social_linkedin",
    youtube: "social_youtube",
    twitter: "social_twitter",
  });
  const about = lookup("about", "page")?.values;
  if (about?.values)
    settings.about_pillars_json = JSON.stringify(
      lines(about.values).map((row) => {
        const [title, desc] = row.split("|");
        return { title, desc, color: "bg-blue-50 text-blue-700" };
      }),
    );
  if (items.some((i) => i.kind === "trainer"))
    settings.about_trainers_json = JSON.stringify(
      trainers(items,existingTrainers(settings.about_trainers_json)).map(([, v]) => ({
        name: v.name,
        role: v.role,
        experience: v.experience,
        bio: v.description,
        avatar: v.image,
        tags: lines(v.skills),
      })),
    );
  function visible<T extends { id: string }>(rows: T[], kind: Kind) {
    const entries = new Map(
      items.filter((i) => i.kind === kind).map((i) => [i.id, i.values]),
    );
    return rows
      .filter((r) => entries.get(r.id) !== null)
      .sort(
        (a, b) =>
          Number(entries.get(a.id)?.order || 0) -
          Number(entries.get(b.id)?.order || 0),
      );
  }
  const office = contactDetails(settings);
  const campus = base.branches.find(branch => branch.slug === SEEYAM_CAMPUS.slug);
  const mapEmbedUrl = campus?.mapEmbedUrl || SEEYAM_CAMPUS.mapEmbedUrl;
  settings.contact_maps = mapLinkFromEmbed(mapEmbedUrl) || office.maps;
  const branch = { ...SEEYAM_CAMPUS, ...campus, phone: office.phone, whatsapp: office.whatsapp, email: office.email, address: office.address, mapEmbedUrl };
  return {
    ...base,
    settings,
    branches: [branch],
    batches: base.batches.filter(batch => batch.branchId === branch.id),
    cms: items.filter(
      (i) => !["course", "testimonial", "placement", "seo"].includes(i.kind),
    ),
    courses: visible(base.courses, "course").map(course => {
      const values = lookup("course", course.id)?.values;
      return {
        ...course,
        image: values?.image || course.image,
        languages: lines(values?.languages),
        syllabus: publishedSyllabus(course.slug, course.syllabus, lines(values?.syllabus)),
      };
    }),
    reviews: visible(
      base.reviews.filter((r) => r.status === "APPROVED"),
      "testimonial",
    ).map((r) => ({
      ...r,
      studentEmail: "",
      adminNote: undefined,
      photo: lookup("testimonial", r.id)?.values?.image,
    })),
    placements: visible(base.placements, "placement").map((r) => ({
      ...r,
      placementDate: lookup("placement", r.id)?.values?.date,
    })),
  };
}
