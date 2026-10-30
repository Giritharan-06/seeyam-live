import { MetadataRoute } from "next";
import { MOCK_COURSES, MOCK_BRANCHES } from "@/lib/mock-data";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seeyamtechnologies.com";
  const lastModified = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/placements`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/resources/sql-compiler`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/branches`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Course program routes for SEO indexation
  const courseRoutes: MetadataRoute.Sitemap = MOCK_COURSES.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Branch campus routes for Local SEO
  const branchRoutes: MetadataRoute.Sitemap = MOCK_BRANCHES.map((branch) => ({
    url: `${baseUrl}/branches/${branch.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // High-Intent Career Blog articles for Organic Google Search
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...courseRoutes, ...branchRoutes, ...blogRoutes];
}
