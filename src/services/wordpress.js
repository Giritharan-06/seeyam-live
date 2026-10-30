const WP_API_ROOT =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "http://seeyam.local/wp-json/wp/v2";

const WP_HOST = WP_API_ROOT.replace(/\/wp\/v2\/?$/, "");

export async function getAllPlatformData() {
  const url = `${WP_HOST}/seeyam/v1/all-data`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.error("[WordPress API] Error in getAllPlatformData:", err);
    return null;
  }
}

export async function getSiteSettings() {
  const url = `${WP_HOST}/seeyam/v1/site-settings`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error("[WordPress API] Error in getSiteSettings:", err);
  }
  return null;
}

export async function getPageBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());
  const url = `${WP_API_ROOT}/pages?slug=${cleanSlug}&_embed=true`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 15 },
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const pages = await res.json();
      if (Array.isArray(pages) && pages.length > 0) return pages[0];
    }

    const aliases = {
      about: "about-us",
      "about-us": "about",
      contact: "contact-us",
      "contact-us": "contact",
      terms: "terms-and-conditions",
      "terms-and-conditions": "terms",
      privacy: "privacy-policy",
      "privacy-policy": "privacy",
      refund: "refund-policy",
      "refund-policy": "refund",
    };

    const targetAlias = aliases[slug.toLowerCase()];
    if (targetAlias) {
      const aliasSlug = encodeURIComponent(targetAlias);
      const aliasRes = await fetch(`${WP_API_ROOT}/pages?slug=${aliasSlug}&_embed=true`, {
        next: { revalidate: 15 },
        headers: { Accept: "application/json" },
      });
      if (aliasRes.ok) {
        const aliasPages = await aliasRes.json();
        if (Array.isArray(aliasPages) && aliasPages.length > 0) return aliasPages[0];
      }
    }
  } catch (error) {
    console.error(`[WordPress API] Error fetching page "${slug}":`, error);
  }
  return null;
}

export async function getAllPages() {
  const url = `${WP_API_ROOT}/pages?per_page=100&_embed=true`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const pages = await res.json();
    return Array.isArray(pages) ? pages : [];
  } catch (error) {
    console.error("[WordPress API] Error fetching all pages:", error);
    return [];
  }
}

export async function getPostBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = encodeURIComponent(slug.trim().toLowerCase());
  const url = `${WP_API_ROOT}/posts?slug=${cleanSlug}&_embed=true`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;
    return posts[0];
  } catch (error) {
    console.error(`[WordPress API] Error fetching post "${slug}":`, error);
    return null;
  }
}

export function getFeaturedImageUrl(pageOrPost) {
  if (!pageOrPost?._embedded?.["wp:featuredmedia"]?.length) {
    return null;
  }
  return pageOrPost._embedded["wp:featuredmedia"][0]?.source_url || null;
}

export default {
  getAllPlatformData,
  getSiteSettings,
  getPageBySlug,
  getAllPages,
  getPostBySlug,
  getFeaturedImageUrl,
};
