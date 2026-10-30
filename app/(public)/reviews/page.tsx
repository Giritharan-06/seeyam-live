"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  CheckCircle2,
  MessageSquarePlus,
  Building2,
  GraduationCap,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Award,
} from "lucide-react";
import { ReviewData, MOCK_REVIEWS } from "@/lib/mock-data";
import { getApprovedReviews } from "@/actions/reviews";
import ReviewModal from "@/components/ReviewModal";
import { usePlatformData } from "@/components/PlatformDataContext";
import CounterNumber from "@/components/CounterNumber";
import { decodeHtml } from "@/lib/utils";

export default function StudentReviewsPage() {
  const { courses, branches } = usePlatformData();
  const [reviews, setReviews] = useState<ReviewData[]>(
    MOCK_REVIEWS.filter((r) => r.status === "APPROVED")
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  // Filters
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("ALL");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("ALL");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Filtered List
  const filteredReviews = reviews.filter((rev) => {
    if (selectedCourseFilter !== "ALL" && rev.courseId !== selectedCourseFilter) {
      return false;
    }
    if (selectedBranchFilter !== "ALL" && rev.branchId !== selectedBranchFilter) {
      return false;
    }
    if (selectedRatingFilter > 0 && rev.rating !== selectedRatingFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = rev.studentName.toLowerCase().includes(q);
      const matchTitle = rev.title.toLowerCase().includes(q);
      const matchBody = rev.body.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchBody) {
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
    <div className="bg-[#F8FAFD] min-h-screen pb-20">
      {/* Header Banner (Eduma Deep Navy Header) */}
      <section className="bg-[#071938] text-white py-16 border-b border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Alumni Feedback & Ratings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Student Reviews & Course Testimonials
            </h1>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Read honest experiences from 50,000+ engineers who upgraded their skills and transitioned into high-paying IT roles.
            </p>
          </div>
        </div>
      </section>

      {/* Scorecard Strip with Count Animation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl items-center" data-card-3d="review" data-card-density="compact">
          {/* Big Score */}
          <div className="lg:col-span-4 text-center lg:text-left lg:border-r lg:border-slate-100 lg:pr-6 space-y-2">
            <div className="text-5xl sm:text-6xl font-black text-[#071938] flex items-center justify-center lg:justify-start gap-3">
              <span>
                <CounterNumber value={avgRating} duration={2000} />
              </span>
              <div className="flex flex-col items-start">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-semibold mt-0.5">
                  Out of 5.0 Rating
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Based on <strong><CounterNumber value="2,480+" duration={2000} /></strong> verified reviews across Chennai, Bangalore & Hyderabad campuses.
            </p>
            <div className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-blue-600" />
              <span>100% Academic Integrity Verified</span>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="lg:col-span-5 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
              const percentage =
                totalApproved > 0 ? Math.round((count / totalApproved) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-bold text-slate-700 flex items-center gap-1">
                    {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-semibold text-[11px]">
                    <CounterNumber value={`${percentage}%`} duration={1500} />
                  </span>
                </div>
              );
            })}
          </div>

          {/* CTA Button in Elegant Gold */}
          <div className="lg:col-span-3 text-center lg:text-right flex flex-col items-center lg:items-end justify-center">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Student Review</span>
            </button>
            <span className="text-[10px] text-slate-400 mt-2 block">
              Takes less than 2 minutes
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm" data-card-3d="review" data-card-density="compact">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews or keywords..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            {/* Course Filter */}
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="ALL">All Course Programs ({courses.length})</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* Branch Filter */}
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value="ALL">All Campus Branches ({branches.length})</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={selectedRatingFilter}
              onChange={(e) => setSelectedRatingFilter(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            >
              <option value={0}>All Star Ratings</option>
              <option value={5}>5 Stars (Exceptional)</option>
              <option value={4}>4 Stars (Very Good)</option>
              <option value={3}>3 Stars (Average)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-bold text-slate-500">
            Showing <span className="text-[#071938]">{filteredReviews.length}</span> student reviews
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3" data-card-3d="review" data-card-density="compact">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No reviews match your filters</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your course, campus branch, or star rating filter.
            </p>
            <button
              onClick={() => {
                setSelectedCourseFilter("ALL");
                setSelectedBranchFilter("ALL");
                setSelectedRatingFilter(0);
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => {
              const course = courses.find((c) => c.id === review.courseId || c.slug === review.courseId);
              const branch = branches.find((b) => b.id === review.branchId || b.slug === review.branchId);
              const isExpanded = expandedReviewId === review.id;

              return (
                <div
                  key={review.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-400 hover:shadow-lg transition-all" data-card-3d="review" data-card-density="regular"
                >
                  <div>
                    {/* Top Bar */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
                          {review.studentName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#071938]">
                            {review.studentName}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-blue-700 font-semibold mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Alumni ({review.completionYear})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-amber-800 text-xs font-extrabold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{review.rating}.0</span>
                      </div>
                    </div>

                    {/* Course & Branch Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold truncate max-w-[200px]">
                        {decodeHtml(course?.title || "IT Certification")}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                        <Building2 className="w-2.5 h-2.5" />
                        <span>{branch?.name || "Main Campus"}</span>
                      </span>
                    </div>

                    {/* Review Headline */}
                    <h5 className="font-bold text-sm text-[#071938] mb-2 leading-snug">
                      &ldquo;{decodeHtml(review.title)}&rdquo;
                    </h5>

                    {/* Review Body */}
                    <div
                      className={`text-xs text-slate-600 leading-relaxed ${
                        isExpanded ? "" : "line-clamp-4"
                      }`}
                    >
                      {review.body}
                    </div>

                    {review.body.length > 220 && (
                      <button
                        onClick={() =>
                          setExpandedReviewId(isExpanded ? null : review.id)
                        }
                        className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors"
                      >
                        <span>{isExpanded ? "Show Less" : "Read Full Story"}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Card Footer CTA */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-blue-700 font-semibold">
                      <ThumbsUp className="w-3 h-3" />
                      <span>Recommended Program</span>
                    </span>
                    {course && (
                      <Link
                        href={`/courses/${course.slug}`}
                        className="text-amber-600 hover:text-amber-700 font-bold"
                      >
                        Explore Course →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={fetchReviews}
      />
    </div>
  );
}
