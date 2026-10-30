"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Terminal,
  Search,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Code2,
  CheckCircle2,
  Award,
  Layers,
  Database,
} from "lucide-react";
import { usePlatformData } from "@/components/PlatformDataContext";
import { useLeadModal } from "@/components/LeadModalContext";
import { ResourceData, InterviewQuestionData } from "@/lib/mock-data";

export default function ResourcesPage() {
  const { resources, interviewQuestions } = usePlatformData();
  const { openLeadModal } = useLeadModal();

  const [activeTab, setActiveTab] = useState<"ALL" | "RESUME" | "PRACTICE" | "QUESTIONS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToolCategory, setSelectedToolCategory] = useState("ALL");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  // Filter resources
  const resumeTemplates = resources.filter((r: ResourceData) => r.type === "RESUME_TEMPLATE");
  const practiceSheets = resources.filter((r: ResourceData) => r.type === "PRACTICE_SHEET");

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter interview questions
  const filteredQuestions = interviewQuestions.filter((q: InterviewQuestionData) => {
    if (selectedToolCategory !== "ALL" && q.category.toLowerCase() !== selectedToolCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        q.question.toLowerCase().includes(query) ||
        (q.answer && q.answer.toLowerCase().includes(query)) ||
        q.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const categories: string[] = Array.from(new Set(interviewQuestions.map((q: InterviewQuestionData) => q.category)));

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-[#071938] text-white py-16 border-b border-[#0f2956] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Free Career & Technical Prep Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Free Developer & Analyst Resource Vault
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
              ATS-tested resume templates, live interactive SQL compilers, corporate interview question banks, and lab exercises designed by senior architects to help you crack tech interviews.
            </p>

            {/* Quick Navigation Anchor Tabs */}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/resources/sql-compiler"
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Terminal className="w-4 h-4" />
                <span>Launch Free SQL Compiler</span>
              </Link>
              <a
                href="#resumes"
                className="px-4 py-2.5 rounded-2xl bg-[#0b224d] hover:bg-[#102d64] text-slate-200 font-bold text-xs border border-[#16356c] flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Resume Formats</span>
              </a>
              <a
                href="#questions"
                className="px-4 py-2.5 rounded-2xl bg-[#0b224d] hover:bg-[#102d64] text-slate-200 font-bold text-xs border border-[#16356c] flex items-center gap-2 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Interview Questions</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Banner: Live SQL Playground */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-gradient-to-r from-[#071938] to-[#0f2956] rounded-3xl p-6 sm:p-8 border border-[#1d4282] shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6" data-card-3d="learning" data-card-density="compact">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                Zero Installation Required
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Live In-Browser SQL Compiler & Practice Lab
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Write queries, practice joins, CTEs, and window functions on pre-populated student datasets. Built-in instant execution without creating database accounts.
              </p>
            </div>
          </div>

          <Link
            href="/resources/sql-compiler"
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/30 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
          >
            <span>Open SQL Compiler</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Resource Vault */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 space-y-16">
        {/* Section 1: ATS Resume Templates */}
        <section id="resumes" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Job-Ready Formats</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#071938]">
                ATS-Optimized Tech Resume Templates
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Engineered for automated Applicant Tracking Systems at top MNCs, Zoho, Amazon, and Deloitte.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resumeTemplates.map((item: ResourceData) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group" data-card-3d="learning" data-card-density="regular"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">
                      {item.category || "Technology"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.fileSize || "Word .docx"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#071938] group-hover:text-blue-600 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified ATS Pass
                  </span>

                  <button
                    onClick={() =>
                      openLeadModal(
                        item.courseId || undefined,
                        undefined,
                        "BROCHURE_DOWNLOAD",
                        item.fileUrl
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Practice Sheets & Lab Exercises */}
        <section id="practice" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hands-On Problem Sets</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#071938]">
                Curated Practice Workbooks & Cheat Sheets
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Download step-by-step query manuals, DAX references, and Python Jupyter notebooks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {practiceSheets.map((sheet: ResourceData) => (
              <div
                key={sheet.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group" data-card-3d="learning" data-card-density="regular"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                      {sheet.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {sheet.fileSize || "PDF"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#071938] group-hover:text-emerald-700 transition-colors leading-snug">
                    {sheet.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sheet.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    Includes Solutions
                  </span>

                  <button
                    onClick={() =>
                      openLeadModal(
                        sheet.courseId || undefined,
                        undefined,
                        "BROCHURE_DOWNLOAD",
                        sheet.fileUrl
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Get PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Interview Questions Bank */}
        <section id="questions" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Technical Q&A Vault</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#071938]">
                Real MNC Technical Interview Questions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Questions asked in recent technical rounds at Amazon, Zoho, Cognizant, and Infosys.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedToolCategory("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  selectedToolCategory === "ALL"
                    ? "bg-[#071938] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                All Tools ({interviewQuestions.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedToolCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    selectedToolCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interview questions by keyword (e.g. CTE, RLS, Generator, Docker)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>

          {/* Questions Accordion List */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500" data-card-3d="learning" data-card-density="compact">
                No interview questions matched your search query. Try another term or select All Tools.
              </div>
            ) : (
              filteredQuestions.map((q: InterviewQuestionData) => {
                const isOpen = expandedQuestions[q.id];
                return (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all" data-card-3d="learning" data-card-density="compact"
                  >
                    <button
                      onClick={() => toggleQuestion(q.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase border border-blue-100">
                          {q.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#071938] leading-snug">
                          {q.question}
                        </h4>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-5 pt-0 border-t border-slate-100 bg-[#F8FAFD]/70 animate-fade-in">
                        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed mt-3">
                          <div className="font-extrabold text-[11px] text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Recommended Technical Answer</span>
                          </div>
                          <p>{q.answer || "Answer provided in detailed syllabus workbook."}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Global Enrollment Callout */}
        <section className="bg-gradient-to-br from-[#071938] to-[#0f2956] text-white rounded-3xl p-8 sm:p-12 border border-[#0f2956] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6" data-card-3d="learning" data-card-density="compact">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-extrabold uppercase border border-amber-500/30">
              Live Mentorship Available
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Need Personal Guidance From Tech Architects?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our classroom and online batches include 1-on-1 resume tailoring, 5+ live capstone projects, unlimited mock interviews, and direct placement drives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openLeadModal()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-xl shadow-amber-500/30 transition-all hover:scale-105 whitespace-nowrap"
            >
              Book Free Career Consultation
            </button>
            <Link
              href="/courses"
              className="px-6 py-3.5 rounded-2xl bg-[#0b224d] hover:bg-[#102d64] text-white font-bold text-xs border border-[#16356c] text-center transition-colors"
            >
              Explore All Courses
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
