"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { InterviewQuestionData } from "@/lib/mock-data";

interface CourseInterviewQuestionsProps {
  questions: InterviewQuestionData[];
  courseTitle: string;
}

export default function CourseInterviewQuestions({
  questions,
  courseTitle,
}: CourseInterviewQuestionsProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    [questions[0]?.id || ""]: true,
  });

  if (questions.length === 0) return null;

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6" data-card-3d="learning" data-card-density="regular">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interview Preparation Bank</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#071938]">
            Real Interview Questions for {courseTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Frequently asked questions in technical rounds at Amazon, Zoho, TCS, Cognizant, and Deloitte.
          </p>
        </div>

        <Link
          href="/resources"
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
        >
          <span>View All 200+ Questions</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        {questions.map((q) => {
          const isOpen = Boolean(openItems[q.id]);
          return (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 overflow-hidden bg-[#F8FAFD] transition-all" data-card-3d="learning" data-card-density="compact"
            >
              <button
                type="button"
                onClick={() => toggleItem(q.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between bg-white hover:bg-slate-50 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase border border-emerald-100">
                    {q.category}
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-[#071938]">
                    {q.question}
                  </h3>
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 ml-2">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#F8FAFD] animate-fade-in">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
                    <div className="font-extrabold text-[11px] text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Model Answer & Technical Explanation</span>
                    </div>
                    <p>{q.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
