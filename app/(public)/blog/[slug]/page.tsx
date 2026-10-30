import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Clock,
  Calendar,
  ChevronRight,
  User,
  ArrowRight,
  Share2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Download,
  GraduationCap,
  MessageSquare,
  Phone,
} from "lucide-react";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";
import { db } from "@/lib/db";
import CourseHeroBrochureButton from "@/components/CourseHeroBrochureButton";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.summary,
    keywords: [
      post.title,
      `${post.category} Chennai`,
      "IT Career Guide",
      "Tech Salaries India 2026",
      "Seeyam Technologies",
    ],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  const targetCourse = await db.getCourseById(post.targetCourseId);

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.summary,
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorRole,
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "Seeyam Technologies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://seeyamtechnologies.com/logo.png",
      },
    },
    "datePublished": post.publishedDate,
    "dateModified": post.publishedDate,
  };

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb Header */}
      <div className="bg-[#071938] border-b border-[#0f2956] py-3 text-xs text-slate-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <Link href="/blog" className="hover:text-blue-400">
            Career Insights
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-white truncate font-medium">{post.title}</span>
        </div>
      </div>

      {/* Article Hero Banner */}
      <section className="bg-[#071938] text-white py-14 border-b border-[#0f2956] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                {post.category}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {post.readTime}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Published {post.publishedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {post.summary}
            </p>

            <div className="flex items-center gap-3 pt-3 border-t border-[#0f2956]">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-extrabold text-sm text-white">{post.author}</div>
                <div className="text-xs text-amber-400 font-medium">{post.authorRole}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 gap-12">
        {/* Article Sections */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-10" data-card-3d="learning" data-card-density="regular">
          {post.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#071938] tracking-tight">
                {section.heading}
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {section.body.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {section.callout && (
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border-l-4 border-blue-600 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed" data-card-3d="learning" data-card-density="regular">
                  {section.callout}
                </div>
              )}
            </div>
          ))}

          {/* Embedded Course Conversion Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#071938] to-[#0d2857] text-white border border-[#163870] shadow-xl space-y-4" data-card-3d="learning" data-card-density="regular">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-extrabold uppercase border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Recommended Certification Track
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold">
              Ready to Accelerate Your Career in {post.category}?
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Join Seeyam Technologies for structured mentorship, 5+ live production projects, and 100% placement assurance with top hiring MNCs.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/courses/${targetCourse?.slug || "data-analytics-power-bi"}`}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 text-center"
              >
                View Complete Course & Batches
              </Link>
              {targetCourse && (
                <CourseHeroBrochureButton
                  courseId={targetCourse.id}
                  brochureUrl={targetCourse.brochureUrl}
                  variant="secondary"
                  className="bg-[#0b224d] hover:bg-[#123166] text-slate-200 border border-[#1a4185]"
                />
              )}
            </div>
          </div>

          {/* FAQs Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-xl font-extrabold text-[#071938] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-3">
                {post.faqs.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-5 rounded-2xl bg-[#F8FAFD] border border-slate-200 space-y-2" data-card-3d="learning" data-card-density="compact"
                  >
                    <h4 className="font-bold text-sm text-[#071938] flex items-start gap-2">
                      <span className="text-blue-600 font-extrabold">Q:</span>
                      <span>{faq.question}</span>
                    </h4>
                    <p className="text-xs text-slate-600 pl-5 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Career Articles */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-[#071938]">More High-Intent Guides</h3>
            <Link
              href="/blog"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All Guides →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.slug}
                href={`/blog/${rel.slug}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between" data-card-3d="learning" data-card-density="compact"
              >
                <div>
                  <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">
                    {rel.category}
                  </span>
                  <h4 className="font-bold text-xs text-[#071938] group-hover:text-blue-600 transition-colors mt-2 line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                </div>
                <div className="text-[10px] text-slate-400 mt-3 flex items-center justify-between">
                  <span>{rel.readTime}</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
