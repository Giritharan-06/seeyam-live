"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Star,
  Sparkles,
  Award,
  CheckCircle2,
  MessageSquarePlus,
  Building2,
  GraduationCap,
  Filter,
  ThumbsUp,
  Quote,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MOCK_COURSES, MOCK_BRANCHES, MOCK_CATEGORIES, ReviewData, MOCK_REVIEWS } from "@/lib/mock-data";
import { getApprovedReviews } from "@/actions/reviews";
import ReviewModal from "./ReviewModal";

interface ReviewSectionProps {
  onOpenLeadModal?: (courseId?: string) => void;
}

export default function ReviewSection({ onOpenLeadModal }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewData[]>(
    MOCK_REVIEWS.filter((r) => r.status === "APPROVED")
  );
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("ALL");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const fetchReviews = async () => {
    try {
      const data = await getApprovedReviews();
      if (data && data.length > 0) {
        setReviews(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews by Category and Course
  const filteredReviews = reviews.filter((rev) => {
    if (selectedCourseFilter !== "ALL" && rev.courseId !== selectedCourseFilter) {
      return false;
    }
    if (activeCategory !== "ALL") {
      const course = MOCK_COURSES.find((c) => c.id === rev.courseId);
      if (course?.categoryId !== activeCategory) {
        return false;
      }
    }
    return true;
  });

  // Calculate aggregates
  const totalApproved = reviews.length;
  const avgRating =
    totalApproved > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalApproved).toFixed(1)
      : "4.9";

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <section id="reviews" className="py-20 bg-[#071938] text-white relative overflow-hidden border-y border-[#0f2956]">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Alumni Experiences & Student Ratings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Real Stories. Real Careers Transformed.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300">
            Read transparent reviews from over 50,000+ graduates who upgraded their tech skills, cracked Tier-1 product companies, and achieved exceptional package hikes.
          </p>
        </div>

        {/* Rating Scorecard Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0b224d] border border-[#16356c] rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl backdrop-blur-sm items-center" data-card-3d="review" data-card-density="compact">
          {/* Big Rating Block */}
          <div className="lg:col-span-4 text-center lg:text-left lg:border-r lg:border-[#16356c] lg:pr-8">
            <div className="text-5xl sm:text-6xl font-black text-white flex items-center justify-center lg:justify-start gap-3">
              <span>{avgRating}</span>
              <div className="flex flex-col items-start">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-semibold mt-1">
                  Out of 5.0 Rating
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 font-medium">
              Based on <strong>2,480+</strong> verified reviews across Chennai, Bangalore & Hyderabad campuses.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-blue-300 font-bold bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>100% Genuine Student Submissions</span>
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div className="lg:col-span-5 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
              const percentage = totalApproved > 0 ? Math.round((count / totalApproved) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-bold text-slate-300 flex items-center gap-1">
                    {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-[#071938] overflow-hidden border border-[#16356c]">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-semibold">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action CTA in Elegant Gold */}
          <div className="lg:col-span-3 text-center lg:text-right flex flex-col items-center lg:items-end justify-center">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-xl shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Student Review</span>
            </button>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Takes under 2 minutes
            </span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => {
              setActiveCategory("ALL");
              setSelectedCourseFilter("ALL");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
              activeCategory === "ALL"
                ? "bg-blue-600 text-white shadow-blue-600/25 scale-105"
                : "bg-[#0b224d] text-slate-300 hover:bg-[#102d64] border border-[#16356c]"
            }`}
          >
            All Reviews ({reviews.length})
          </button>

          {MOCK_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedCourseFilter("ALL");
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? "bg-blue-600 text-white shadow-blue-600/25 scale-105"
                    : "bg-[#0b224d] text-slate-300 hover:bg-[#102d64] border border-[#16356c]"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredReviews.slice(0, 6).map((review) => {
            const course = MOCK_COURSES.find((c) => c.id === review.courseId);
            const branch = MOCK_BRANCHES.find((b) => b.id === review.branchId);
            const isExpanded = expandedReviewId === review.id;

            return (
              <div
                key={review.id}
                className="bg-[#0b224d] border border-[#16356c] rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between hover:border-blue-400/50 transition-all group" data-card-3d="review" data-card-density="regular"
              >
                <div>
                  {/* Review Top Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {review.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{review.studentName}</h4>
                        <div className="text-[11px] text-blue-300 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-400" />
                          <span>Batch {review.completionYear}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Course / Branch Tag */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#071938] text-blue-300 font-semibold border border-[#16356c]">
                      {course?.title || "IT Course"}
                    </span>
                    <span className="text-slate-400">({branch?.name})</span>
                  </div>

                  {/* Title & Body */}
                  <h5 className="font-bold text-sm text-white mb-2 leading-snug">
                    &ldquo;{review.title}&rdquo;
                  </h5>

                  <div
                    className={`text-xs text-slate-300 leading-relaxed ${
                      isExpanded ? "" : "line-clamp-4"
                    }`}
                  >
                    {review.body}
                  </div>

                  {review.body.length > 200 && (
                    <button
                      onClick={() =>
                        setExpandedReviewId(isExpanded ? null : review.id)
                      }
                      className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                    >
                      <span>{isExpanded ? "Show Less" : "Read Full Story"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#16356c] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-blue-300">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-400" />
                    <span>Verified Review</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Alumni Feedback</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={fetchReviews}
      />
    </section>
  );
}
