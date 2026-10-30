"use client";

import React from "react";
import { Download, FileText } from "lucide-react";
import { useLeadModal } from "@/components/LeadModalContext";

interface CourseHeroBrochureButtonProps {
  courseId: string;
  brochureUrl?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function CourseHeroBrochureButton({
  courseId,
  brochureUrl,
  variant = "secondary",
  className = "",
}: CourseHeroBrochureButtonProps) {
  const { openLeadModal } = useLeadModal();

  const handleClick = () => {
    openLeadModal(courseId, undefined, "BROCHURE_DOWNLOAD", brochureUrl);
  };

  if (variant === "primary") {
    return (
      <button
        onClick={handleClick}
        className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Download Full Syllabus PDF</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 ${className}`}
    >
      <FileText className="w-4 h-4 text-blue-600" />
      <span>Download Full Syllabus & Brochure</span>
    </button>
  );
}
