"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Star,
  Clock,
  Laptop,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  GraduationCap,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Phone,
  Briefcase,
} from "lucide-react";
import { formatCurrency, decodeHtml } from "@/lib/utils";
import { usePlatformData } from "@/components/PlatformDataContext";
import CompanyLogo from "@/components/CompanyLogo";
import { CourseData } from "@/lib/mock-data";
import CounterNumber from "@/components/CounterNumber";

function CoursesListingContent() {
  const { courses, categories } = usePlatformData();
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

  const getCourseHiringPartners = (course: CourseData): string[] => {
    if (course.hiringPartners && course.hiringPartners.length > 0) {
      return course.hiringPartners;
    }
    const courseSlug = course.slug || "";
    if (courseSlug.includes("aws") || courseSlug.includes("devops")) {
      return ["Amazon", "Google", "Infosys"];
    }
    if (courseSlug.includes("mern") || courseSlug.includes("fsd") || courseSlug.includes("java")) {
      return ["Microsoft", "Zoho", "TCS", "Accenture"];
    }
    if (courseSlug.includes("ai") || courseSlug.includes("data")) {
      return ["Google", "Amazon", "Microsoft"];
    }
    return ["Cognizant", "Capgemini", "Wipro", "TCS"];
  };

  // Filtering
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
    if (sortBy === "PRICE_LOW") return a.price - b.price;
    if (sortBy === "PRICE_HIGH") return b.price - a.price;
    if (sortBy === "POPULAR") return b.enrolledCount - a.enrolledCount;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-20">
      {/* Header Banner (Eduma Deep Navy Header) */}
      <section className="bg-[#071938] text-white py-16 border-b border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NASSCOM Aligned & Industry-Certified</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Master High-Demand IT Certification Programs
            </h1>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Explore <CounterNumber value={`${courses.length}+`} duration={1500} /> industry-grade IT courses designed by tech architects from Google, Amazon & TCS.
              100% placement assurance with live projects and mock interviews.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 space-y-4" data-card-3d="analytics" data-card-density="compact">
          {/* Top Controls: Search + Mode + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by technology (e.g. Java, React, AWS, Python, Selenium, SAP)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <select
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="FEATURED">Sort: Featured First</option>
                <option value="POPULAR">Sort: Most Enrolled</option>
                <option value="RATING">Sort: Highest Rated</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === "ALL"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Categories ({courses.length})
            </button>
            {categories.map((cat) => {
              const count = courses.filter((c) => c.categoryId === cat.id).length;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{decodeHtml(cat.name)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-blue-800 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-[#071938] font-extrabold"><CounterNumber value={filteredCourses.length} duration={800} /></span> certification programs
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const category = categories.find((c) => c.id === course.categoryId);
              const hiringCompanies = getCourseHiringPartners(course);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between overflow-hidden group" data-card-3d={course.slug.includes("marketing") ? "marketing" : "analytics"} data-card-density="regular"
                >
                  <div className="p-6">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-200">
                        {decodeHtml(category?.name || "IT Course")}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span><CounterNumber value={course.rating} duration={1200} /></span>
                        <span className="text-slate-400 font-normal text-[10px]">
                          (<CounterNumber value={(course.enrolledCount / 1000).toFixed(1)} duration={1200} />k)
                        </span>
                      </div>
                    </div>

                    {/* Course Title */}
                    <Link href={`/courses/${course.slug}`}>
                      <h3 className="text-lg font-extrabold text-[#071938] group-hover:text-blue-600 transition-colors leading-snug mb-2">
                        {decodeHtml(course.title)}
                      </h3>
                    </Link>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {decodeHtml(course.summary)}
                    </p>

                    {/* Key Metrics Chips */}
                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs mb-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Laptop className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{course.mode}</span>
                      </div>
                    </div>

                    {/* Hiring Partner Company Logos on Course Card */}
                    <div className="mb-4 p-3 rounded-2xl bg-[#F8FAFD] border border-slate-200/80">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        <span>Key Hiring Employers</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {hiringCompanies.map((comp) => (
                          <div
                            key={comp}
                            className="bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-2xs"
                          >
                            <CompanyLogo name={comp} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights Bullet List */}
                    <div className="space-y-1.5 mb-4">
                      {(course.highlights || [])
                        .filter((h) => typeof h === "string" && h.trim().length > 0 && h !== "[]")
                        .slice(0, 3)
                        .map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{decodeHtml(h)}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Card Bottom Strip */}
                  <div className="p-6 pt-0">
                    <div className="bg-[#F8FAFD] rounded-2xl p-3.5 flex items-center justify-between mb-3 border border-slate-200">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Salary Potential
                        </div>
                        <div className="text-xs font-extrabold text-amber-600">
                          {course.expectedSalary}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-slate-400">
                          Tuition Fee
                        </div>
                        <div className="text-sm font-black text-[#071938]">
                          {formatCurrency(course.price)}
                        </div>
                      </div>
                    </div>

                    {/* CTAs in Blue & Gold */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="py-2.5 rounded-xl border border-slate-300 hover:border-blue-500 text-slate-800 hover:text-blue-600 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Syllabus</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/courses/${course.slug}#batches`}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs text-center shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-1"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
              href="tel:+918939915577"
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
