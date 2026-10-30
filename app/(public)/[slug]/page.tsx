import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  Home,
  BookOpen,
  ArrowRight,
  Share2,
} from "lucide-react";
import { getPageBySlug, getFeaturedImageUrl } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  // Strip HTML tags for clean description
  const cleanExcerpt = page.excerpt?.rendered
    ? page.excerpt.rendered.replace(/<[^>]*>?/gm, "").trim().slice(0, 160)
    : `Read ${page.title.rendered} at Seeyam Technologies`;

  const featuredImg = getFeaturedImageUrl(page);

  return {
    title: page.title.rendered,
    description: cleanExcerpt,
    openGraph: {
      title: page.title.rendered,
      description: cleanExcerpt,
      images: featuredImg ? [{ url: featuredImg }] : [],
    },
  };
}

export default async function WordPressDynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const featuredImg = getFeaturedImageUrl(page);
  const formattedDate = page.date
    ? new Date(page.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFD] pb-20">
      {/* Top Breadcrumb & Hero Header */}
      <div className="bg-[#071938] text-white pt-10 pb-16 border-b border-[#0f2956] relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-6 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-blue-400 capitalize">Page</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white truncate max-w-[200px] sm:max-w-none">
              {page.title.rendered}
            </span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Data Analytics & Digital Marketing</span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />

          {/* Date & Meta Info */}
          {formattedDate && (
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 pt-2 border-t border-[#0f2956]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                Published: {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                Live from CMS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden" data-card-3d="analytics" data-card-density="regular">
          {/* Featured Image if present */}
          {featuredImg && (
            <div className="w-full h-64 sm:h-96 relative bg-slate-100 overflow-hidden border-b border-slate-200">
              <img
                src={featuredImg}
                alt={page.title.rendered}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Rendered HTML Content with Rich Prose Styling */}
          <div className="p-6 sm:p-10 md:p-14">
            <article
              className="prose prose-slate max-w-none 
                prose-headings:text-[#071938] prose-headings:font-extrabold
                prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-base prose-p:mb-4
                prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#071938] prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-4 prose-ul:text-slate-600
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2 prose-ol:my-4 prose-ol:text-slate-600
                prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-slate-700
                prose-img:rounded-2xl prose-img:shadow-md prose-img:mx-auto prose-img:my-6
                prose-table:w-full prose-table:border prose-table:border-slate-200 prose-table:rounded-xl prose-table:overflow-hidden
                prose-th:bg-slate-50 prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:text-[#071938]
                prose-td:p-3 prose-td:border-t prose-td:border-slate-200 prose-td:text-slate-600
                [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto
                [&_code]:bg-slate-100 [&_code]:text-blue-600 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm"
              dangerouslySetInnerHTML={{ __html: page.content.rendered }} data-card-3d="analytics" data-card-density="compact"
            />

            {/* Bottom Help / CTA Card */}
            <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F8FAFD] p-6 rounded-2xl border border-slate-200/80" data-card-3d="analytics" data-card-density="compact">
              <div>
                <h4 className="text-sm font-bold text-[#071938]">Have questions about our programs?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Talk to our academic advisors and discover the right career roadmap for you.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all shrink-0"
              >
                <span>Contact Advisor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
