"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquarePlus,
} from "lucide-react";
import { submitReview } from "@/actions/reviews";
import { usePlatformData } from "@/components/PlatformDataContext";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseId?: string;
  initialBranchId?: string;
  onReviewSubmitted?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 Star - Needs Substantial Improvement",
  2: "2 Stars - Below Expectations",
  3: "3 Stars - Average / Met Requirements",
  4: "4 Stars - Very Good / Highly Recommended",
  5: "5 Stars - Exceptional Training & Placements!",
};

export default function ReviewModal({
  isOpen,
  onClose,
  initialCourseId,
  initialBranchId,
  onReviewSubmitted,
}: ReviewModalProps) {
  const { courses, branches, refreshData } = usePlatformData();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseId, setCourseId] = useState(initialCourseId || courses[0]?.id || "");
  const [branchId, setBranchId] = useState(initialBranchId || branches[0]?.id || "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [completionYear, setCompletionYear] = useState(new Date().getFullYear().toString());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await submitReview({
        studentName,
        studentEmail,
        courseId: courseId || courses[0]?.id,
        branchId: branchId || branches[0]?.id,
        rating,
        title,
        body,
        completionYear,
      });

      setLoading(false);

      if (res.success) {
        setSuccess(res.message);
        refreshData();
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        setError(res.message);
      }
    } catch (err) {
      setLoading(false);
      setError("An unexpected error occurred while submitting your review.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#071938]/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 z-10 animate-scale-in max-h-[90vh] overflow-y-auto" data-card-3d="review" data-card-density="compact">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Alumni Feedback</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#071938]">
              Share Your Learning Experience
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Help future tech aspirants make informed career decisions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banners */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-start gap-2.5" data-card-3d="review" data-card-density="compact">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
            <div>
              <div className="font-bold text-sm">Review Submitted!</div>
              <div className="mt-0.5 text-blue-700">{success}</div>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            {/* Star Rating Picker */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center" data-card-3d="review" data-card-density="compact">
              <div className="text-xs font-bold text-slate-700 mb-2">
                Overall Course & Placement Rating *
              </div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          isFilled
                            ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-[11px] font-bold text-amber-600 mt-2">
                {RATING_LABELS[hoverRating || rating]}
              </div>
            </div>

            {/* Student Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Vignesh Sundar"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address * (Private)
                </label>
                <input
                  type="email"
                  required
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="vignesh.s@gmail.com"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Course & Branch selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Completed Course *
                </label>
                <select
                  value={courseId || courses[0]?.id}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-2.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Campus Branch *
                </label>
                <select
                  value={branchId || branches[0]?.id}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-2.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Completion Year */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Batch Completion Year
              </label>
              <select
                value={completionYear}
                onChange={(e) => setCompletionYear(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            {/* Headline Title */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hands-on practical training with excellent placement support"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Detailed Testimonial & Experience *
              </label>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your experience about the trainers, live lab projects, mock interviews, and placement assistance..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 leading-relaxed"
              />
            </div>

            {/* Submit Button in Elegant Gold */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Review...</span>
                ) : (
                  <>
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Submit Student Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
