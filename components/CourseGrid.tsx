"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Layers,
  TrendingUp,
  Star,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Download,
  Briefcase,
} from "lucide-react";
import { MOCK_CATEGORIES, MOCK_COURSES, CourseData, SyllabusModule } from "@/lib/mock-data";
import { formatCurrency, decodeHtml } from "@/lib/utils";
import CompanyLogo from "@/components/CompanyLogo";

interface CourseGridProps {
  selectedCategoryId: string;
  searchQuery: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenLeadModal: (courseId?: string) => void;
}

export default function CourseGrid({
  selectedCategoryId,
  searchQuery,
  onSelectCategory,
  onOpenLeadModal,
}: CourseGridProps) {
  const [activeTab, setActiveTab] = useState(selectedCategoryId || "ALL");
  const [syllabusModalCourse, setSyllabusModalCourse] = useState<CourseData | null>(null);

  // Sync tab if parent changes
  useEffect(() => {
    if (selectedCategoryId) {
      setActiveTab(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const getCourseHiringPartners = (course: CourseData) => {
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

  const filteredCourses = useMemo(() => {
    let list = MOCK_COURSES;

    if (activeTab !== "ALL") {
      list = list.filter((c) => c.categoryId === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.highlights.some((h) => h.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeTab, searchQuery]);

  return (
    <section id="courses" className="py-20 bg-[#F8FAFD] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>NASSCOM Aligned Curriculum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071938] tracking-tight">
            Master Job-Ready IT Certification Programs
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Every course includes live real-time capstone projects, 1-on-1 mentor code reviews, and guaranteed placement drives.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            onClick={() => {
              setActiveTab("ALL");
              onSelectCategory("ALL");
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-xs ${
              activeTab === "ALL"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All Courses ({MOCK_COURSES.length})
          </button>

          {MOCK_CATEGORIES.map((cat) => {
            const count = MOCK_COURSES.filter((c) => c.categoryId === cat.id).length;
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  onSelectCategory(cat.id);
                }}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 shadow-xs ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{decodeHtml(cat.name)}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-blue-800 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Course Search Active Filter Notice */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl">
            <div className="flex items-center gap-2 text-xs text-blue-900 font-semibold">
              <span className="font-bold">Search results for:</span>
              <span className="bg-blue-200/70 text-blue-900 px-2.5 py-0.5 rounded-full font-extrabold">
                &ldquo;{searchQuery}&rdquo;
              </span>
              <span className="text-slate-500">
                ({filteredCourses.length} programs found)
              </span>
            </div>
            <button
              onClick={() => {
                setActiveTab("ALL");
                onSelectCategory("ALL");
              }}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
            >
              Clear Search Filter
            </button>
          </div>
        )}

        {/* Courses Listing Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3" data-card-3d="analytics" data-card-density="compact">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching courses found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or view our complete catalog of certified tech programs.
            </p>
            <button
              onClick={() => {
                setActiveTab("ALL");
                onSelectCategory("ALL");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const category = MOCK_CATEGORIES.find((c) => c.id === course.categoryId);
              const hiringCompanies = getCourseHiringPartners(course);

              return (
                <div
                  key={course.id}
                  className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1" data-card-3d={course.slug.includes("marketing") ? "marketing" : "analytics"} data-card-density="regular"
                >
                  <div>
                    {/* Card Top Banner */}
                    <div className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                          {decodeHtml(category?.name || "IT Certification")}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      <Link href={`/courses/${course.slug}`}>
                        <h3 className="text-xl font-bold text-[#071938] group-hover:text-blue-600 transition-colors line-clamp-2">
                          {decodeHtml(course.title)}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {decodeHtml(course.summary)}
                      </p>
                    </div>

                    {/* Highlights & Specs */}
                    <div className="p-6 space-y-4">
                      {/* Meta stats chips */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-700">
                          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-700">
                          <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span className="capitalize">{course.mode} Mode</span>
                        </div>
                      </div>

                      {/* Company Logos on Course Card */}
                      <div className="p-3 rounded-2xl bg-[#F8FAFD] border border-slate-200/80">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-blue-600" />
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

                      {/* Key highlights checklist */}
                      <div className="space-y-2">
                        {course.highlights.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA & Pricing */}
                  <div className="p-6 pt-0">
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase font-semibold">
                          Salary Potential
                        </div>
                        <div className="text-xs font-extrabold text-amber-600">
                          {course.expectedSalary}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] text-slate-400 uppercase font-semibold">
                          Course Fee
                        </div>
                        <div className="text-base font-black text-[#071938]">
                          {formatCurrency(course.price)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-bold text-xs text-center transition-colors"
                      >
                        Curriculum
                      </Link>

                      <button
                        onClick={() => onOpenLeadModal(course.id)}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-xs text-center shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
