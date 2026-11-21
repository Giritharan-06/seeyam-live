import { z } from "zod";

export const publicPath = z.string().max(240).regex(/^\/(?:[a-z0-9][a-z0-9_-]*(?:\/[a-z0-9][a-z0-9_-]*)*)?$/i)
  .refine(path => !/^\/(admin|api)(\/|$)/i.test(path), "Choose a public path.");

function isWebUrl(value: string) {
  if (!value) return true;
  if (/[\x00-\x20\x7f\\#]/.test(value)) return false;
  if (/^\/(?!\/)/.test(value)) return true;
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

export function parseStructuredData(value: string) {
  const data: unknown = JSON.parse(value);
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Enter a JSON object.");
  const node = data as Record<string, unknown>;
  if (!["https://schema.org", "https://schema.org/"].includes(String(node["@context"])) ||
    !(typeof node["@type"] === "string" && node["@type"].trim() || Array.isArray(node["@graph"]) && node["@graph"].length)) {
    throw new Error('Use the Schema.org context and supply "@type" or a nonempty "@graph".');
  }
  return node;
}

const field = (length: number) => z.string().trim().max(length);
const url = field(2048).refine(isWebUrl, "Use an HTTP(S) URL or a site-relative path.");

export const seoFields = z.object({
  title: field(150),
  description: field(400),
  focusKeywords: field(300),
  canonical: url,
  ogTitle: field(150),
  ogDescription: field(400),
  socialImage: url,
  imageAlt: field(250),
  indexing: z.enum(["inherit", "index", "noindex"]),
  structuredData: field(12000).superRefine((value, ctx) => {
    if (!value) return;
    try { parseStructuredData(value); } catch (error) {
      ctx.addIssue({ code: "custom", message: error instanceof SyntaxError ? "Enter valid JSON." : (error as Error).message });
    }
  }),
});

export type SeoFields = z.infer<typeof seoFields>;
export const emptySeo: SeoFields = {
  title: "", description: "", focusKeywords: "", canonical: "", ogTitle: "",
  ogDescription: "", socialImage: "", imageAlt: "", indexing: "inherit", structuredData: "",
};

const crawlPath = z.string().trim().max(240).regex(/^\/[A-Za-z0-9_./*%?&=$-]*$/).refine(path => !path.startsWith("//"));
export const robotsFields = z.object({
  allow: z.array(crawlPath).max(50),
  disallow: z.array(crawlPath).max(50),
  advertiseSitemap: z.boolean(),
});
export type RobotsFields = z.infer<typeof robotsFields>;
export const defaultRobots: RobotsFields = { allow: ["/"], disallow: [], advertiseSitemap: true };
export const privateCrawlPaths = ["/admin", "/api/"];

export type SeoTarget = {
  path: string;
  kind: "page" | "course" | "campus" | "blog";
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  modified?: string;
};

export function isSitemapEligible(path: string, fields: SeoFields | undefined, origin: string) {
  return fields?.indexing !== "noindex" &&
    (!fields?.canonical || new URL(fields.canonical, origin).href === new URL(path, origin).href);
}
