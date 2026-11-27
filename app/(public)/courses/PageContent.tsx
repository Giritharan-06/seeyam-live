"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, CircleDot, BookOpen, HelpCircle, Phone } from "lucide-react";
import { decodeHtml } from "@/lib/utils";
import { usePlatformData } from "@/components/PlatformDataContext";
import { contactDetails, phoneHref } from "@/lib/contact";
import HomeCourseCard from "@/components/HomeCourseCard";
import ChennaiCourseLinks from "@/components/ChennaiCourseLinks";

function CoursesListingContent() {
  const { courses, categories, siteSettings } = usePlatformData();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedMode, setSelectedMode] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("FEATURED");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory !== "ALL" && course.categoryId !== selectedCategory) {
      return false;
    }
    if (selectedMode !== "ALL" && course.mode !== selectedMode) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchSummary = course.summary.toLowerCase().includes(q);
      const matchHighlights = course.highlights.some((h) => h.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchHighlights) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "RATING") return b.rating - a.rating;
    if (sortBy === "POPULAR") return b.enrolledCount - a.enrolledCount;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-20">
      {/* Header Banner (Eduma Deep Navy Header) */}
      <section className="public-banner public-banner--with-photo bg-[#071938] text-white py-16 border-b border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <CircleDot className="w-3.5 h-3.5 text-amber-400" />
              <span>Our Courses</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Explore our <span className="premiere-first-accent">training courses</span>
            </h1>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Compare programmes, learning modes, and upcoming batches.
            </p>
          </div>
        </div>
        <img className="public-banner-photo" src="/images/redesign/courses-hero.webp" alt="" fetchPriority="high" />
      </section>

      <div className="premiere-container py-6"><ChennaiCourseLinks /></div>
      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 space-y-4" >
          {/* Top Controls: Search + Mode + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                aria-label="Search courses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course or technology"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                aria-label="Learning mode"
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="ALL">All Learning Modes</option>
                <option value="CLASSROOM">Classroom Training</option>
                <option value="ONLINE">Live Interactive Online</option>
                <option value="HYBRID">Hybrid (Classroom + Online)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                aria-label="Sort courses"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="FEATURED">Sort: Featured First</option>
                <option value="POPULAR">Sort: Most Enrolled</option>
                <option value="RATING">Sort: Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3"><label htmlFor="course-category" className="text-sm font-bold">Category</label><select id="course-category" value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)} className="max-w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm sm:flex-none"><option value="ALL">All Categories ({courses.length})</option>{categories.map(category => <option key={category.id} value={category.id}>{decodeHtml(category.name)}</option>)}</select></div>
        </div>
      </section>

      {/* Course Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-[#071938] font-extrabold">{filteredCourses.length}</span> certification programs
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3" data-card-3d="analytics" data-card-density="compact">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching courses found</h3>
            <p className="text-xs text-slate-500">
              Try searching with different keywords or reset your category and mode filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedMode("ALL");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map(course => <HomeCourseCard key={course.id} course={course} />)}
          </div>
        )}
      </section>

      {/* Counseling Advice Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-[#071938] text-white rounded-3xl p-8 sm:p-10 border border-[#0f2956] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6" data-card-3d="analytics" data-card-density="compact">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Free Academic Counseling</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold">
              Not sure which technology path fits your educational background?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our senior counselors analyze your profile, current IT market trends, and package targets to create a tailored 4-month learning roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs text-center shadow-lg shadow-amber-500/30 transition-all hover:scale-105 whitespace-nowrap"
            >
              Book Free 1-on-1 Session
            </Link>
            <a
              href={phoneHref(contactDetails(siteSettings).phone)}
              className="px-6 py-3.5 rounded-2xl bg-[#0e2a5c] hover:bg-[#163d7e] text-slate-200 font-bold text-xs text-center border border-[#1d4282] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Helpline</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CoursesListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center text-slate-500 font-bold text-sm">Loading courses...</div>}>
      <CoursesListingContent />
    </Suspense>
  );
}
