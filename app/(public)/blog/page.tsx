"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  User,
  ChevronRight,
  TrendingUp,
  Tag,
} from "lucide-react";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-data";

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory !== "ALL" && post.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-24">
      {/* Header Banner */}
      <section className="bg-[#071938] text-white py-16 border-b border-[#0f2956] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Career Advice & Technical Insights</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Seeyam Tech Career & Salary Insights
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              In-depth research on tech salaries in Chennai & Bangalore, tool comparison benchmarks, interview preparation roadmaps, and career transition guides.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Lead Post Banner */}
      {featuredPost && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" data-card-3d="learning" data-card-density="compact">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  Featured Career Guide
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {featuredPost.readTime}
                </span>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="block group"
              >
                <h2 className="text-2xl sm:text-3xl font-black text-[#071938] group-hover:text-blue-600 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
              </Link>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {featuredPost.summary}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {featuredPost.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs text-[#071938]">{featuredPost.author}</div>
                  <div className="text-[10px] text-slate-400">{featuredPost.authorRole}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-gradient-to-br from-[#071938] to-[#0d2857] text-white p-6 rounded-2xl space-y-4 text-center flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider mb-1">
                  Target Course
                </div>
                <h4 className="font-bold text-base text-white">{featuredPost.targetCourseTitle}</h4>
                <p className="text-xs text-slate-300 mt-2">
                  Accelerate your transition with 100% placement assurance and live corporate projects.
                </p>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 flex items-center justify-center gap-1.5 mt-4"
              >
                <span>Read Complete Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Blog List Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-8">
        {/* Controls: Category Pills & Search Box */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                selectedCategory === "ALL"
                  ? "bg-[#071938] text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Articles ({BLOG_POSTS.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search career topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group" data-card-3d="learning" data-card-density="regular"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
                    {post.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="text-base font-extrabold text-[#071938] group-hover:text-blue-600 transition-colors leading-snug">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                    {post.author.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{post.author}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
