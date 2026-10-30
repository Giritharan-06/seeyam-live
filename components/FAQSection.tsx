"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  Laptop,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { FAQSchema } from "@/components/StructuredData";
import { FAQData, MOCK_FAQS } from "@/lib/mock-data";

interface FAQItem {
  id: string;
  category?: string;
  question: string;
  answer: string;
  courseId?: string | null;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "placements",
    question: "Does Seeyam Technologies provide a 100% placement guarantee?",
    answer:
      "Yes. Seeyam Technologies provides comprehensive 100% placement assistance backed by over 200+ hiring partners across Chennai, Bangalore, and Hyderabad. Our dedicated placement cell conducts mock technical interviews, resume building sessions, and direct campus recruitment drives until you secure a verified job offer.",
  },
  {
    id: "faq-2",
    category: "placements",
    question: "What is the average salary package for graduates from Seeyam Technologies?",
    answer:
      "Our graduates secure entry to mid-level IT packages ranging between ₹4.5 LPA and ₹24.5 LPA, with an overall average CTC of ₹8.2 LPA. Candidates with previous non-IT experience or tech transitions often secure packages above ₹10 LPA in Full Stack Development and Cloud DevOps roles.",
  },
  {
    id: "faq-3",
    category: "curriculum",
    question: "Can beginners or non-IT background students enroll in software courses?",
    answer:
      "Absolutely. All courses at Seeyam Technologies start from fundamental programming basics and step-by-step logic building before advancing to enterprise frameworks. Over 40% of our successful alumni transitioned from non-IT backgrounds like Mechanical, Civil, Commerce, and Arts degrees.",
  },
  {
    id: "faq-4",
    category: "curriculum",
    question: "Do you provide hands-on live industry projects and internship certificates?",
    answer:
      "Yes. Every program includes 3+ enterprise-grade capstone projects built using real microservices, cloud deployments, and CI/CD pipelines. Upon completion, students receive an ISO-certified training certificate along with a verified project experience letter.",
  },
  {
    id: "faq-5",
    category: "modes",
    question: "What training modes and batch timings are available?",
    answer:
      "We offer Classroom Training at our physical campuses in Chennai (OMR, Vadapalani, Tambaram), Bangalore (Marathahalli), and Hyderabad (HITEC City), as well as interactive Live Online Instructor-led batches. Timings include Early Morning (7:30 AM), Regular Weekday, and Weekend Batches for working professionals.",
  },
  {
    id: "faq-6",
    category: "admissions",
    question: "Is there an option for zero-cost EMI or installment fee payment?",
    answer:
      "Yes. Seeyam Technologies provides flexible payment options including zero-cost monthly installments (EMI) and milestone-based fee schedules to make top-tier IT training accessible to all deserving students.",
  },
];

interface FAQSectionProps {
  courseId?: string;
  customFaqs?: FAQData[] | FAQItem[];
  title?: string;
  badge?: string;
  description?: string;
  onOpenLeadModal?: (courseId?: string, branchId?: string) => void;
}

export default function FAQSection({
  courseId,
  customFaqs,
  title,
  badge,
  description,
  onOpenLeadModal,
}: FAQSectionProps) {
  // Determine FAQs pool based on courseId or customFaqs prop
  const sourceFaqs: FAQItem[] = customFaqs
    ? customFaqs
    : courseId
    ? MOCK_FAQS.filter((f) => f.courseId === courseId || f.courseId === null)
    : DEFAULT_FAQS;

  const [openId, setOpenId] = useState<string | null>(sourceFaqs[0]?.id || null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredFaqs =
    activeCategory === "ALL"
      ? sourceFaqs
      : sourceFaqs.filter((f) => f.category === activeCategory);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 bg-[#071938] text-white relative overflow-hidden border-t border-[#0f2956]">
      {/* JSON-LD Schema for Google Answer Engine Optimization */}
      <FAQSchema
        faqs={sourceFaqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{badge || "Got Questions? We Have Answers"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {title || "Frequently Asked Questions"}
          </h2>
          <p className="text-sm text-slate-400">
            {description ||
              "Everything you need to know about our IT certifications, placement support, curriculum, and batch timings."}
          </p>
        </div>

        {/* Category Filters (only shown for general FAQ without specific courseId) */}
        {!courseId && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "ALL", label: "All Questions" },
              { id: "placements", label: "Placements & Guarantee" },
              { id: "curriculum", label: "Courses & Projects" },
              { id: "modes", label: "Classroom & Timings" },
              { id: "admissions", label: "Fees & EMI" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === tab.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-[#0b224d] text-slate-300 hover:bg-[#102d64] border border-[#16356c]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion List */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "bg-[#0b224d] border-blue-400/60 shadow-lg shadow-blue-500/5"
                    : "bg-[#0b224d]/60 border-[#16356c] hover:border-blue-400/40"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-white flex items-center gap-3">
                    <HelpCircle
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isOpen ? "text-amber-400" : "text-slate-400"
                      }`}
                    />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#16356c] animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Counseling Bar at Bottom in Elegant Gold */}
        <div className="text-center pt-4">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#0b224d] border border-[#16356c] p-4 sm:px-8 rounded-3xl shadow-xl" data-card-3d="learning" data-card-density="compact">
            <span className="text-xs sm:text-sm text-slate-300">
              Have a specific question not covered here?
            </span>
            {onOpenLeadModal ? (
              <button
                onClick={() => onOpenLeadModal()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105"
              >
                Talk to an Academic Counselor
              </button>
            ) : (
              <a
                href="tel:+918939915577"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Admissions: 1800-123-5577</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
