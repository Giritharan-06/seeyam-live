"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { SyllabusModule } from "@/lib/mock-data";
import { useLeadModal } from "@/components/LeadModalContext";

interface CourseSyllabusAccordionProps {
  courseId: string;
  courseTitle: string;
  brochureUrl?: string;
  syllabus: SyllabusModule[];
}

export default function CourseSyllabusAccordion({
  courseId,
  courseTitle,
  brochureUrl,
  syllabus,
}: CourseSyllabusAccordionProps) {
  const { openLeadModal } = useLeadModal();
  // By default, open the first module, keep others collapsed
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({ 0: true });

  const toggleModule = (idx: number) => {
    setOpenModules((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    syllabus.forEach((_, i) => (all[i] = true));
    setOpenModules(all);
  };

  const collapseAll = () => {
    setOpenModules({});
  };

  const handleDownloadBrochure = () => {
    openLeadModal(courseId, undefined, "BROCHURE_DOWNLOAD", brochureUrl);
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6" data-card-3d="learning" data-card-density="regular">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Comprehensive Syllabus</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#071938]">
            Curriculum & Syllabus Breakdown
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Industry-aligned modules with hands-on labs, real datasets, and production projects.
          </p>
        </div>

        {/* Download Brochure Button */}
        <button
          onClick={handleDownloadBrochure}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Syllabus PDF</span>
        </button>
      </div>

      {/* Accordion Controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span className="font-semibold text-slate-700">
          {syllabus.length} Learning Modules • 40+ Practical Labs
        </span>
        <div className="flex items-center gap-3 font-semibold">
          <button
            onClick={expandAll}
            className="hover:text-blue-600 transition-colors"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            onClick={collapseAll}
            className="hover:text-blue-600 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {syllabus.map((mod, idx) => {
          const isOpen = Boolean(openModules[idx]);
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 overflow-hidden bg-[#F8FAFD] transition-all" data-card-3d="learning" data-card-density="compact"
            >
              {/* Header Button */}
              <button
                type="button"
                onClick={() => toggleModule(idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between bg-white hover:bg-slate-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#071938]">{mod.title}</h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {mod.topics.length} Key Subtopics Covered
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold hidden sm:inline-block">
                    {mod.duration}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              {isOpen && (
                <div className="p-4 sm:p-6 border-t border-slate-100 bg-[#F8FAFD] animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {mod.topics.map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-150"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Download Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" data-card-3d="learning" data-card-density="compact">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="font-extrabold text-[#071938]">Want the full 24-page syllabus brochure?</p>
            <p className="text-slate-500 text-[11px]">
              Includes week-by-week timetable, real company project architecture, and tool licenses.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadBrochure}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
        >
          Download PDF Now
        </button>
      </div>
    </section>
  );
}
