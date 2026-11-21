"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Building2,
  Users,
  Award,
  Sparkles,
  CheckCircle,
  Briefcase,
  ArrowRight,
  Search,
  Quote,
  Star,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { MOCK_HIRING_PARTNERS } from "@/lib/mock-data";
import CompanyLogo from "@/components/CompanyLogo";
import { usePlatformData } from "@/components/PlatformDataContext";
import CounterNumber from "@/components/CounterNumber";
import JobPortalLinks from "@/components/JobPortalLinks";

export default function PlacementsPage() {
  const { courses, branches, placements } = usePlatformData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("ALL");

  // Deduplicate placements by studentName or id to prevent repeated cards
  const uniquePlacements = Array.from(
    new Map(placements.map((p) => [p.studentName?.toLowerCase().trim() || p.id, p])).values()
  );

  const filteredPlacements = uniquePlacements.filter((story) => {
    if (selectedCourseFilter !== "ALL" && story.courseId !== selectedCourseFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = story.studentName.toLowerCase().includes(q);
      const matchCompany = story.companyName.toLowerCase().includes(q);
      const matchRole = story.role.toLowerCase().includes(q);
      if (!matchName && !matchCompany && !matchRole) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-20">
      {/* Header Banner (Eduma Deep Navy Header) */}
      <section className="bg-[#071938] text-white py-16 border-b border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Industry-Leading Career Acceleration</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              100% Placement Assurance & Alumni Success Stories
            </h1>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Over 50,000+ engineers have built stellar tech careers through Seeyam Technologies.
              Explore our real graduates, placed companies, salary packages, and testimonials.
            </p>
          </div>
        </div>
      </section>

      {/* KPI Stats Bar with Count Animation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100" data-card-3d="growth" data-card-density="compact">
          <div className="space-y-1">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 mb-1">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#071938]">
              <CounterNumber value="50,000+" duration={2000} />
            </div>
            <div className="text-xs font-bold text-slate-500">Graduates Placed</div>
          </div>

          <div className="space-y-1 pt-4 sm:pt-0">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 mb-1">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#071938]">
              <CounterNumber value="200+" duration={2000} />
            </div>
            <div className="text-xs font-bold text-slate-500">Active Hiring Partners</div>
          </div>

          <div className="space-y-1 pt-4 sm:pt-0">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 mb-1">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              <CounterNumber value="₹ 21.0 LPA" duration={2000} />
            </div>
            <div className="text-xs font-bold text-slate-500">Highest Salary Package</div>
          </div>

          <div className="space-y-1 pt-4 sm:pt-0">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 mb-1">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              <CounterNumber value="₹ 8.5 LPA" duration={2000} />
            </div>
            <div className="text-xs font-bold text-slate-500">Average Salary Package</div>
          </div>
        </div>
      </section>

      {/* 4-Step Placement Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Proven Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071938]">
            Our 4-Step Career Guarantee Roadmap
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Resume & Portfolio Review",
              desc: "ATS-optimized resume crafting, GitHub portfolio curation with 6 deployed capstone projects, and LinkedIn profile branding.",
            },
            {
              step: "02",
              title: "DSA & System Design Sprints",
              desc: "Daily coding challenges, data structures & algorithms problem-solving, and system architecture design mock rounds.",
            },
            {
              step: "03",
              title: "1-on-1 Mock Technical Interviews",
              desc: "Rigorous technical mock interviews conducted by active engineering leads from Amazon, Zomato, and Deloitte.",
            },
            {
              step: "04",
              title: "Direct Placement Drives",
              desc: "Unlimited interview opportunities scheduled directly with our 200+ hiring partners until you secure your desired offer.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 relative hover:border-blue-400 hover:shadow-lg transition-all" data-card-3d="growth" data-card-density="regular"
            >
              <div className="text-3xl font-black text-blue-600">{item.step}</div>
              <h3 className="font-extrabold text-sm text-[#071938]">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter and Search Bar for Placement Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#071938]">
              Verified Graduate Placements
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter alumni by completed course program or company.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate / company..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Course Filter */}
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">All Course Programs</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stories Grid with Company Logos on every card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlacements.map((story) => {
            const course = courses.find((c) => c.id === story.courseId) || courses[0];
            const branch = branches.find((b) => b.id === story.branchId) || branches[0];

            return (
              <div
                key={story.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between" data-card-3d="growth" data-card-density="regular"
              >
                <div>
                  {/* Top Bar: Student info + Company Logo Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={story.studentAvatarUrl}
                        alt={story.studentName}
                        className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-slate-100"
                      />
                      <div>
                        <h4 className="font-extrabold text-sm text-[#071938]">
                          {story.studentName}
                        </h4>
                        <div className="text-xs font-bold text-blue-700 mt-0.5">
                          {story.role}
                        </div>
                      </div>
                    </div>

                    {/* Prominent Company Logo */}
                    <div className="p-2 rounded-xl bg-[#F8FAFD] border border-slate-200 shadow-xs shrink-0">
                      <CompanyLogo name={story.companyName} size="md" />
                    </div>
                  </div>

                  {/* Previous Background Badge */}
                  {story.previousRole && (
                    <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-700">
                      <span className="text-slate-500 font-semibold">Previous:</span>
                      <span className="font-bold text-slate-800">{story.previousRole}</span>
                    </div>
                  )}

                  {/* CTC Package & Course Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-black text-xs border border-amber-200 shadow-xs">
                      <CounterNumber value={story.packageCtc} duration={1500} />
                    </span>
                    <span className="p-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-700 truncate">
                      {course?.title || "IT Course"}
                    </span>
                  </div>

                  {/* Quote */}
                  {story.quote && (
                    <div className="relative pt-2">
                      <Quote className="w-5 h-5 text-blue-100 absolute -top-1 -left-1 -z-0" />
                      <p className="text-xs text-slate-600 italic leading-relaxed relative z-10 pl-2">
                        &ldquo;{story.quote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Career Transition
                  </span>
                  {story.linkedinUrl ? (
                    <a
                      href={story.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 hover:underline"
                    >
                      <span>Alumni Profile</span>
                      <ArrowRight className="w-3 h-3 -rotate-45" />
                    </a>
                  ) : (
                    <span className="font-bold text-slate-600">{branch?.city || "Campus"}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hiring Partners Wall */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>200+ Corporate Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071938]">
            Where Our Alumni Are Hired
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            "Amazon", "Microsoft", "Google", "Zoho", "TCS", "Infosys",
            "Deloitte", "Accenture", "Cognizant", "Capgemini", "Wipro", "IBM",
            "J.P. Morgan", "Oracle", "Zomato", "Cisco", "PayPal", "Walmart"
          ].map((partner) => (
            <div
              key={partner}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-center text-center group" data-card-3d="growth" data-card-density="compact"
            >
              <CompanyLogo name={partner} size="md" />
            </div>
          ))}
        </div>
      </section>

      {/* Live Tech Openings Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <JobPortalLinks
          title="Direct Tech Job Openings & Hiring Links"
          subtitle="Curated hiring boards across LinkedIn, Naukri, Instahyre, and Wellfound for quick interview calls."
        />
      </section>

      {/* Counseling CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-[#071938] text-white rounded-3xl p-8 sm:p-12 border border-[#0f2956] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6" data-card-3d="growth" data-card-density="compact">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Want Guaranteed Placement Support?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Speak directly with our Chief Placement Officer. Get a personalized profile evaluation and learn how we can help you land your dream tech job in 4 months.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-xl shadow-amber-500/30 transition-all hover:scale-105 whitespace-nowrap"
          >
            Book Free Placement Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
