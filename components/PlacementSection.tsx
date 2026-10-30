"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Sparkles,
  TrendingUp,
  Building2,
  Quote,
  CheckCircle2,
  ArrowUpRight,
  Briefcase,
} from "lucide-react";
import { MOCK_PLACEMENTS, MOCK_HIRING_PARTNERS, MOCK_COURSES } from "@/lib/mock-data";
import CompanyLogo from "@/components/CompanyLogo";
import CounterNumber from "@/components/CounterNumber";

interface PlacementSectionProps {
  onOpenLeadModal: (courseId?: string) => void;
}

export default function PlacementSection({ onOpenLeadModal }: PlacementSectionProps) {
  return (
    <section id="placements" className="py-20 bg-[#071938] text-white relative overflow-hidden border-y border-[#0f2956]">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Dedicated Placement Cell & Alumni Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Our Students Work at Global Tech Giants
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Over 50,000+ graduates transitioned into high-paying software engineering, cloud, and QA roles. Here are some of our recent success stories.
          </p>
        </div>

        {/* Placement Highlight Metrics with Count Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-[#0b224d] border border-[#16356c] text-center" data-card-3d="growth" data-card-density="compact">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
              <CounterNumber value="24.5 LPA" duration={2000} />
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">
              Highest Package Offered
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b224d] border border-[#16356c] text-center" data-card-3d="growth" data-card-density="compact">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              <CounterNumber value="8.2 LPA" duration={2000} />
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">
              Average Starting CTC
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b224d] border border-[#16356c] text-center" data-card-3d="growth" data-card-density="compact">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">
              <CounterNumber value="50,000+" duration={2000} />
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">
              Alumni Placed
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b224d] border border-[#16356c] text-center" data-card-3d="growth" data-card-density="compact">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">
              <CounterNumber value="200+" duration={2000} />
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold">
              Active Hiring Partners
            </div>
          </div>
        </div>

        {/* Student Testimonial Cards with Company Logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {MOCK_PLACEMENTS.map((placement) => {
            const course = MOCK_COURSES.find((c) => c.id === placement.courseId);

            return (
              <div
                key={placement.id}
                className="bg-[#0b224d] rounded-3xl border border-[#16356c] p-6 sm:p-8 flex flex-col justify-between hover:border-blue-400/60 transition-all group" data-card-3d="growth" data-card-density="regular"
              >
                <div>
                  {/* Top info + Company Logo Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={placement.studentAvatarUrl}
                        alt={placement.studentName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-white">{placement.studentName}</h4>
                        <div className="text-xs text-blue-300 font-semibold">{placement.role}</div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white text-slate-900 shadow-xs shrink-0">
                      <CompanyLogo name={placement.companyName} size="sm" />
                    </div>
                  </div>

                  {/* Previous Background Badge */}
                  {placement.previousRole && (
                    <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e2a5c] border border-[#1d4282] text-[11px] text-slate-300">
                      <span className="text-slate-400 font-semibold">Previous:</span>
                      <span className="font-bold text-white">{placement.previousRole}</span>
                    </div>
                  )}

                  {/* CTC badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-4">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Package: {placement.packageCtc}</span>
                  </div>

                  {/* Quote */}
                  {placement.quote && (
                    <div className="relative mt-2">
                      <Quote className="w-6 h-6 text-blue-500/30 absolute -top-2 -left-1" />
                      <p className="text-xs text-slate-300 italic pl-5 leading-relaxed">
                        &ldquo;{placement.quote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#16356c] flex items-center justify-between text-xs">
                  <span className="text-slate-400 truncate max-w-[180px]">{course?.title || "IT Course"}</span>
                  {placement.linkedinUrl ? (
                    <a
                      href={placement.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 text-[11px] hover:underline"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Alumni Profile ↗</span>
                    </a>
                  ) : (
                    <span className="text-blue-300 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      Verified Transition
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate Hiring Partners Logo Strip */}
        <div className="bg-[#0b224d]/80 rounded-3xl p-8 border border-[#16356c]" data-card-3d="growth" data-card-density="regular">
          <div className="text-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Our 200+ Corporate Hiring Partners
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {MOCK_HIRING_PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-center group hover:border-blue-400 transition-colors shadow-xs" data-card-3d="growth" data-card-density="compact"
              >
                <CompanyLogo name={partner.name} size="md" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Placement CTA in Elegant Gold */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onOpenLeadModal()}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
          >
            <Briefcase className="w-4 h-4" />
            <span>Apply for Guaranteed Placement Batch</span>
          </button>
        </div>
      </div>
    </section>
  );
}
