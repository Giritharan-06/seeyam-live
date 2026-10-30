import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seeyamtechnologies.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
