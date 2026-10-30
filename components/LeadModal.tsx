"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Sparkles,
  CheckCircle,
  Download,
  ArrowRight,
  MessageSquare,
  Lock,
  FileText,
  GraduationCap,
} from "lucide-react";
import { publicLeadSchema, PublicLeadInput } from "@/lib/validations/schema";
import { submitPublicLead } from "@/actions/leads";
import { usePlatformData } from "@/components/PlatformDataContext";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  initialBranchId?: string;
  initialReason?: "ENQUIRY" | "BROCHURE_DOWNLOAD" | "DEMO_VIDEO";
  initialBrochureUrl?: string;
}

export default function LeadModal({
  isOpen,
  onClose,
  initialCourseId,
  initialBranchId,
  initialReason = "ENQUIRY",
  initialBrochureUrl,
}: LeadModalProps) {
  const { courses, branches } = usePlatformData();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultCourseId = initialCourseId || courses[0]?.id || "";
  const defaultBranchId = initialBranchId || branches[0]?.id || "";

  const isBrochure = initialReason === "BROCHURE_DOWNLOAD";
  const isDemo = initialReason === "DEMO_VIDEO";

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PublicLeadInput>({
    resolver: zodResolver(publicLeadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      courseId: defaultCourseId,
      branchId: defaultBranchId,
      source: isBrochure ? "Brochure Download Modal" : "Global Lead Modal",
      reason: initialReason,
    },
  });

  useEffect(() => {
    if (initialCourseId) setValue("courseId", initialCourseId);
    if (initialBranchId) setValue("branchId", initialBranchId);
    if (initialReason) setValue("reason", initialReason);
    setDownloadUrl(initialBrochureUrl || null);
  }, [initialCourseId, initialBranchId, initialReason, initialBrochureUrl, setValue]);

  const onSubmit = async (data: PublicLeadInput) => {
    setIsSubmitting(true);
    setServerError(null);
    setServerSuccess(null);

    const result = await submitPublicLead(data);
    setIsSubmitting(false);

    if (result.success) {
      setServerSuccess(result.message);
      if (result.data?.brochureUrl) {
        setDownloadUrl(result.data.brochureUrl);
      }
      reset();
    } else {
      setServerError(result.message);
    }
  };

  const handleClose = () => {
    setServerError(null);
    setServerSuccess(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#071938]/70 backdrop-blur-md animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-scale-in">
        {/* Modal Header */}
        <div className="bg-[#071938] text-white p-6 relative border-b border-[#0f2956]">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider border border-amber-500/30">
              {isBrochure ? (
                <>
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Detailed Curriculum & Project Guide
                </>
              ) : isDemo ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  Sit In on a Live Class First
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Friendly 1-on-1 Career Chat
                </>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-[#0e2a5c] text-slate-400 hover:text-white flex items-center justify-center hover:bg-[#163d7e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-2xl font-bold mt-3 text-white">
            {isBrochure
              ? "Download Full Syllabus & Project Blueprint"
              : isDemo
              ? "Experience a Live Class Before You Decide"
              : "Talk to a Mentor (Not a Salesperson)"}
          </h3>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {isBrochure
              ? "Explore the full week-by-week modules, live capstone projects, tool prerequisites, and career outcomes."
              : isDemo
              ? "Interact directly with our working architect trainers, see how concepts are broken down, and ask your questions."
              : "Unsure which course matches your background? Get honest, personalized guidance without pushy sales calls."}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {serverSuccess ? (
            <div className="text-center py-6 space-y-4 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                {isBrochure ? "Your Curriculum PDF is Ready!" : "Inquiry Received Successfully!"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                {serverSuccess}
              </p>

              {isBrochure && (
                <div className="pt-2">
                  <a
                    href={downloadUrl || "/resources/brochures/seeyam-syllabus.pdf"}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Syllabus PDF File</span>
                  </a>
                </div>
              )}

              <div className="pt-3 flex flex-col gap-2">
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Return to Website
                </button>
                <a
                  href="https://wa.me/918939915577?text=Hi%20Seeyam%20Technologies,%20I%20just%20submitted%20my%20form%20and%20want%20instant%20updates."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Chat with Counselor on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {serverError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("fullName")}
                  placeholder="e.g. Priyadharshini K"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.fullName ? "border-red-500 bg-red-50/50" : "border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="priya@gmail.com"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      errors.email ? "border-red-500 bg-red-50/50" : "border-slate-300 focus:border-blue-600"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="9840123456"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      errors.phone ? "border-red-500 bg-red-50/50" : "border-slate-300 focus:border-blue-600"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Course & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("courseId")}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("branchId")}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button in Elegant Gold */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Request...
                  </span>
                ) : (
                  <>
                    <span>
                      {isBrochure
                        ? "Send Me the Syllabus PDF"
                        : isDemo
                        ? "Reserve My Free Demo Seat"
                        : "Get Free Career Roadmap"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2 text-center">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero spam, promise. We only reach out to answer your questions and share batch timings.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
