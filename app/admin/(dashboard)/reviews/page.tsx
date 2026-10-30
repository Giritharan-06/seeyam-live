"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  MessageSquareText,
  Search,
  Filter,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  X,
  AlertCircle,
  Building2,
  GraduationCap,
  Sparkles,
  Calendar,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAllReviews, moderateReview, deleteReview, getReviewStats } from "@/actions/reviews";
import { MOCK_COURSES, MOCK_BRANCHES, ReviewData } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function ReviewModerationPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageRating: "5.0",
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState(0);

  // Slide-over review detail state
  const [selectedReview, setSelectedReview] = useState<ReviewData | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const [revData, statData] = await Promise.all([
        getAllReviews({
          search: searchQuery,
          status: statusFilter,
          courseId: courseFilter,
          branchId: branchFilter,
          rating: ratingFilter,
          pageSize: 50,
        }),
        getReviewStats(),
      ]);

      setReviews(revData.reviews);
      if (statData) setStats(statData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, courseFilter, branchFilter, ratingFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleModerate = async (
    reviewId: string,
    newStatus: "APPROVED" | "REJECTED" | "PENDING",
    note?: string
  ) => {
    startTransition(async () => {
      const res = await moderateReview({
        reviewId,
        newStatus,
        adminNote: note !== undefined ? note : adminNote,
      });

      if (res.success) {
        setStatusMessage(`Review ${newStatus.toLowerCase()} successfully.`);
        if (selectedReview && selectedReview.id === reviewId) {
          setSelectedReview(res.data || null);
        }
        loadData();
        setTimeout(() => setStatusMessage(null), 2500);
      }
    });
  };

  const handleDelete = async (reviewId: string) => {
    if (confirm("Are you sure you want to permanently delete this student review?")) {
      startTransition(async () => {
        const res = await deleteReview(reviewId);
        if (res.success) {
          setSelectedReview(null);
          loadData();
        }
      });
    }
  };

  const openReviewDetail = (rev: ReviewData) => {
    setSelectedReview(rev);
    setAdminNote(rev.adminNote || "");
    setStatusMessage(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquareText className="w-6 h-6 text-slate-800" />
              <span>Student Review Moderation</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, verify, and approve student testimonials before publishing to the public portal and Google Rich Snippets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Moderation System Active</span>
            </span>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" data-card-3d="review" data-card-density="regular">
            <div className="text-xs font-semibold text-slate-500">Total Submissions</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">All-time Student Feedback</div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" data-card-3d="review" data-card-density="regular">
            <div className="text-xs font-semibold text-slate-500">Pending Review</div>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.pending}</div>
            <div className="text-[11px] text-amber-700 font-bold mt-0.5">
              Requires Verification
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" data-card-3d="review" data-card-density="regular">
            <div className="text-xs font-semibold text-slate-500">Approved & Live</div>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.approved}</div>
            <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
              Visible on Landing Page
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" data-card-3d="review" data-card-density="regular">
            <div className="text-xs font-semibold text-slate-500">Average Rating</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-center gap-1.5">
              <span>{stats.averageRating}</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-[11px] text-teal-600 font-bold mt-0.5">
              High Student Satisfaction
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" data-card-3d="review" data-card-density="regular">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviewer or title..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="ALL">All Statuses ({stats.total})</option>
              <option value="PENDING">PENDING ({stats.pending})</option>
              <option value="APPROVED">APPROVED ({stats.approved})</option>
              <option value="REJECTED">REJECTED ({stats.rejected})</option>
            </select>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="ALL">All Courses ({MOCK_COURSES.length})</option>
              {MOCK_COURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            {/* Branch Filter */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="ALL">All Branches ({MOCK_BRANCHES.length})</option>
              {MOCK_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value={0}>All Star Ratings</option>
              <option value={5}>5 Stars (Exceptional)</option>
              <option value={4}>4 Stars (Very Good)</option>
              <option value={3}>3 Stars (Average)</option>
              <option value={2}>2 Stars (Below Avg)</option>
              <option value={1}>1 Star (Poor)</option>
            </select>
          </form>
        </div>

        {/* Reviews Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden" data-card-3d="review" data-card-density="compact">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Student Reviewer</th>
                  <th className="py-3.5 px-4">Course & Campus</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Review Headline & Excerpt</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading student reviews...</span>
                      </div>
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      No student reviews found matching the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  reviews.map((rev) => {
                    const course = MOCK_COURSES.find((c) => c.id === rev.courseId);
                    const branch = MOCK_BRANCHES.find((b) => b.id === rev.branchId);

                    return (
                      <tr
                        key={rev.id}
                        onClick={() => openReviewDetail(rev)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        {/* Student Name */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-bold text-slate-900">{rev.studentName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{rev.studentEmail}</div>
                        </td>

                        {/* Course & Branch */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800 max-w-[160px] truncate">
                            {course?.title || rev.courseId}
                          </div>
                          <div className="text-[10px] text-emerald-700 mt-0.5">
                            {branch?.name} ({rev.completionYear})
                          </div>
                        </td>

                        {/* Rating */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{rev.rating}.0</span>
                          </div>
                        </td>

                        {/* Title & Body */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 truncate">
                            &ldquo;{rev.title}&rdquo;
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {rev.body}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              rev.status === "APPROVED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : rev.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {rev.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                          {formatDate(rev.createdAt)}
                        </td>

                        {/* Quick Moderation Actions */}
                        <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {rev.status !== "APPROVED" && (
                              <button
                                onClick={() => handleModerate(rev.id, "APPROVED")}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Approve review"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {rev.status !== "REJECTED" && (
                              <button
                                onClick={() => handleModerate(rev.id, "REJECTED")}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Reject review"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(rev.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Slide-over Review Detail Panel */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setSelectedReview(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl flex flex-col z-10 animate-slide-in">
            {/* Slide-over Top Bar */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Review Moderation
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {selectedReview.studentName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slide-over Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {statusMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                  {statusMessage}
                </div>
              )}

              {/* Status and Rating Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between" data-card-3d="review" data-card-density="compact">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Review Rating
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < selectedReview.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {selectedReview.rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedReview.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedReview.status === "PENDING"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {selectedReview.status}
                </span>
              </div>

              {/* Course and Campus Info */}
              <div className="space-y-2">
                <div className="font-bold text-slate-700">Course & Campus Details</div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-900">
                      {MOCK_COURSES.find((c) => c.id === selectedReview.courseId)?.title ||
                        selectedReview.courseId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-slate-600">
                      {MOCK_BRANCHES.find((b) => b.id === selectedReview.branchId)?.name} (Batch:{" "}
                      {selectedReview.completionYear})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{selectedReview.studentEmail}</span>
                  </div>
                </div>
              </div>

              {/* Review Headline & Body */}
              <div className="space-y-2">
                <div className="font-bold text-slate-700">Student Review Feedback</div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    &ldquo;{selectedReview.title}&rdquo;
                  </h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedReview.body}
                  </p>
                </div>
              </div>

              {/* Admin Moderation Note */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  Internal Moderation Note
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Verified student enrollment in Batch #104. Feedback approved for public landing page."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Slide-over Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDelete(selectedReview.id)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleModerate(selectedReview.id, "REJECTED", adminNote)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                >
                  Reject Review
                </button>
                <button
                  onClick={() => handleModerate(selectedReview.id, "APPROVED", adminNote)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
                >
                  Approve & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
