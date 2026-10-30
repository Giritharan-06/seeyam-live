import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * On-Demand ISR Revalidation Webhook
 * Triggered automatically by WordPress on save_post or option updates.
 */
export async function POST(req: NextRequest) {
  try {
    const secret =
      req.headers.get("x-revalidate-secret") ||
      req.headers.get("x-seeyam-key") ||
      req.nextUrl.searchParams.get("secret");

    const expectedSecret =
      process.env.REVALIDATE_SECRET ||
      process.env.SEEYAM_API_KEY;

    // Validate secret
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: "Invalid revalidation secret." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { post_type, slug, path: customPath } = body;

    const pathsToRevalidate: Set<string> = new Set();

    if (customPath && typeof customPath === "string") {
      pathsToRevalidate.add(customPath);
    }

    // Always revalidate homepage on content changes
    pathsToRevalidate.add("/");

    // Revalidate based on post type
    switch (post_type) {
      case "course":
        pathsToRevalidate.add("/courses");
        if (slug) {
          pathsToRevalidate.add(`/courses/${slug}`);
          pathsToRevalidate.add(`/${slug}`);
        }
        break;

      case "branch":
        pathsToRevalidate.add("/branches");
        if (slug) {
          pathsToRevalidate.add(`/branches/${slug}`);
          pathsToRevalidate.add(`/${slug}`);
        }
        break;

      case "placement":
        pathsToRevalidate.add("/placements");
        break;

      case "review":
        pathsToRevalidate.add("/reviews");
        break;

      case "batch":
        pathsToRevalidate.add("/courses");
        pathsToRevalidate.add("/branches");
        pathsToRevalidate.add("/admin/batches");
        break;

      case "lead":
        pathsToRevalidate.add("/admin/leads");
        pathsToRevalidate.add("/admin");
        break;

      case "page":
        if (slug) {
          pathsToRevalidate.add(`/${slug}`);
          if (slug === "about" || slug === "about-us") pathsToRevalidate.add("/about");
          if (slug === "contact" || slug === "contact-us") pathsToRevalidate.add("/contact");
        }
        break;

      default:
        // Settings or global update: revalidate all key public pages
        pathsToRevalidate.add("/courses");
        pathsToRevalidate.add("/branches");
        pathsToRevalidate.add("/placements");
        pathsToRevalidate.add("/reviews");
        pathsToRevalidate.add("/about");
        pathsToRevalidate.add("/contact");
        break;
    }

    // Execute revalidation
    const revalidated: string[] = [];
    for (const p of pathsToRevalidate) {
      try {
        revalidatePath(p);
        revalidated.push(p);
      } catch (err) {
        console.warn(`Failed to revalidate path: ${p}`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Revalidation triggered successfully.",
      revalidatedPaths: revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Revalidate API Error]", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

/**
 * GET Handler for easy browser-based manual testing
 * Example: /api/revalidate?secret=YOUR_CONFIGURED_SECRET&path=/courses
 */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const path = req.nextUrl.searchParams.get("path") || "/";

  const expectedSecret =
    process.env.REVALIDATE_SECRET ||
    process.env.SEEYAM_API_KEY;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { success: false, message: "Invalid revalidation secret." },
      { status: 401 }
    );
  }

  try {
    revalidatePath(path);
    return NextResponse.json({
      success: true,
      revalidated: path,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to revalidate." },
      { status: 500 }
    );
  }
}
