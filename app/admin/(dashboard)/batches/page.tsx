"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  BookOpen,
  Sparkles,
  Layers,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getAllBatches, createBatch, updateBatch, deleteBatch } from "@/actions/batches";
import { MOCK_BRANCHES, MOCK_COURSES, BatchData } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function BatchSchedulerPage() {
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Create form state
  const [form, setForm] = useState({
    courseId: MOCK_COURSES[0]?.id || "course-fsd-java",
    branchId: MOCK_BRANCHES[0]?.id || "branch-omr",
    instructorName: "",
    instructorExp: "8+ Yrs Exp",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    timing: "Mon - Fri: 7:30 AM - 9:30 AM",
    maxSeats: 30,
    status: "UPCOMING" as BatchData["status"],
  });

  const [isPending, startTransition] = useTransition();

  const loadBatches = async () => {
    setLoading(true);
    try {
      const list = await getAllBatches();
      setBatches(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const filteredBatches = batches.filter((b) => {
    if (branchFilter !== "ALL" && b.branchId !== branchFilter) return false;
    if (courseFilter !== "ALL" && b.courseId !== courseFilter) return false;
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const course = MOCK_COURSES.find((c) => c.id === b.courseId);
      const branch = MOCK_BRANCHES.find((br) => br.id === b.branchId);

      const matchInstructor = b.instructorName.toLowerCase().includes(q);
      const matchCourse = course?.title.toLowerCase().includes(q);
      const matchBranch = branch?.name.toLowerCase().includes(q) || branch?.city.toLowerCase().includes(q);

      return matchInstructor || matchCourse || matchBranch;
    }

    return true;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    const res = await createBatch({
      courseId: form.courseId,
      branchId: form.branchId,
      instructorName: form.instructorName,
      instructorExp: form.instructorExp,
      startDate: form.startDate,
      timing: form.timing,
      maxSeats: Number(form.maxSeats),
      status: form.status,
    });

    setSubmitting(false);
    if (res.success) {
      setStatusMessage("Batch scheduled successfully!");
      setForm({
        courseId: MOCK_COURSES[0]?.id || "course-fsd-java",
        branchId: MOCK_BRANCHES[0]?.id || "branch-omr",
        instructorName: "",
        instructorExp: "8+ Yrs Exp",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        timing: "Mon - Fri: 7:30 AM - 9:30 AM",
        maxSeats: 30,
        status: "UPCOMING",
      });
      loadBatches();
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setStatusMessage(null);
      }, 1000);
    } else {
      setStatusMessage(res.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    setSubmitting(true);
    setStatusMessage(null);

    const res = await updateBatch(editingBatch.id, editingBatch);
    setSubmitting(false);

    if (res.success) {
      setStatusMessage("Batch updated successfully!");
      loadBatches();
      setTimeout(() => {
        setEditingBatch(null);
        setStatusMessage(null);
      }, 1000);
    } else {
      setStatusMessage(res.message);
    }
  };

  const handleStatusChange = (batchId: string, newStatus: BatchData["status"]) => {
    startTransition(async () => {
      setBatches((prev) =>
        prev.map((b) => (b.id === batchId ? { ...b, status: newStatus } : b))
      );
      await updateBatch(batchId, { status: newStatus });
      loadBatches();
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this batch cohort?")) {
      startTransition(async () => {
        await deleteBatch(id);
        loadBatches();
      });
    }
  };

  const totalSeats = batches.reduce((acc, b) => acc + b.maxSeats, 0);
  const totalSeatsLeft = batches.reduce((acc, b) => acc + b.seatsLeft, 0);
  const activeCount = batches.filter((b) => b.status === "UPCOMING" || b.status === "ONGOING").length;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader onOpenBatchModal={() => setIsCreateModalOpen(true)} />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-slate-800" />
              <span>Cohort Batch Scheduler</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage upcoming classroom & online cohorts, instructor assignments, and seat capacities.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Cohort</span>
          </button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="calendar" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Active Cohorts</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{activeCount}</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                Across {MOCK_BRANCHES.length} Campuses
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="calendar" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Available Seats</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalSeatsLeft}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Out of {totalSeats} Total Capacity
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between" data-card-3d="calendar" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Average Fill Rate</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {totalSeats > 0 ? Math.round(((totalSeats - totalSeatsLeft) / totalSeats) * 100) : 0}%
              </div>
              <div className="text-[11px] text-teal-600 font-bold mt-0.5">
                High Batch Demand
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs" data-card-3d="calendar" data-card-density="regular">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course, instructor, campus..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Branch Filter */}
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="ALL">All Campuses ({MOCK_BRANCHES.length})</option>
              {MOCK_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="ONGOING">ONGOING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
        </div>

        {/* Batches Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden" data-card-3d="calendar" data-card-density="compact">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Course & Campus</th>
                  <th className="py-3.5 px-4">Lead Instructor</th>
                  <th className="py-3.5 px-4">Start Date & Timings</th>
                  <th className="py-3.5 px-4">Seat Availability</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading batch schedules...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No cohort batches found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => {
                    const course = MOCK_COURSES.find((c) => c.id === batch.courseId);
                    const branch = MOCK_BRANCHES.find((b) => b.id === batch.branchId);

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Course & Branch */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-bold text-slate-900">{course?.title || batch.courseId}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{branch?.name} ({branch?.city})</span>
                          </div>
                        </td>

                        {/* Instructor */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{batch.instructorName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{batch.instructorExp}</div>
                        </td>

                        {/* Schedule & Timing */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{formatDate(batch.startDate)}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{batch.timing}</div>
                        </td>

                        {/* Seats */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <strong>{batch.seatsLeft}</strong> / {batch.maxSeats} Left
                          </span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-4 px-4">
                          <select
                            value={batch.status}
                            onChange={(e) => handleStatusChange(batch.id, e.target.value as BatchData["status"])}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${
                              batch.status === "UPCOMING"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : batch.status === "ONGOING"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            <option value="UPCOMING">UPCOMING</option>
                            <option value="ONGOING">ONGOING</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingBatch(batch)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Edit batch"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(batch.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete batch"
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

      {/* Create Batch Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 z-10 animate-scale-in" data-card-3d="calendar" data-card-density="regular">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Schedule New Cohort Batch</h3>
                <p className="text-xs text-slate-500">Configure new course cohort & timing</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Program *</label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  {MOCK_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Branch *</label>
                <select
                  value={form.branchId}
                  onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  {MOCK_BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lead Instructor Name *</label>
                <input
                  type="text"
                  required
                  value={form.instructorName}
                  onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                  placeholder="e.g. Karthik Subramanian (Ex-Zoho)"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    min={10}
                    max={60}
                    value={form.maxSeats}
                    onChange={(e) => setForm({ ...form, maxSeats: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Timings *</label>
                <input
                  type="text"
                  required
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                  placeholder="Mon - Fri: 7:30 AM - 9:30 AM"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Scheduling Cohort..." : "Schedule Cohort Batch"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setEditingBatch(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 z-10 animate-scale-in" data-card-3d="calendar" data-card-density="regular">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Cohort Batch</h3>
                <p className="text-xs text-slate-500">Update cohort timings & instructor</p>
              </div>
              <button onClick={() => setEditingBatch(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lead Instructor Name *</label>
                <input
                  type="text"
                  required
                  value={editingBatch.instructorName}
                  onChange={(e) => setEditingBatch({ ...editingBatch, instructorName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={editingBatch.startDate}
                    onChange={(e) => setEditingBatch({ ...editingBatch, startDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seats Left</label>
                  <input
                    type="number"
                    min={0}
                    max={editingBatch.maxSeats}
                    value={editingBatch.seatsLeft}
                    onChange={(e) => setEditingBatch({ ...editingBatch, seatsLeft: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Timings *</label>
                <input
                  type="text"
                  required
                  value={editingBatch.timing}
                  onChange={(e) => setEditingBatch({ ...editingBatch, timing: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cohort Status *</label>
                <select
                  value={editingBatch.status}
                  onChange={(e) => setEditingBatch({ ...editingBatch, status: e.target.value as BatchData["status"] })}
                  className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ONGOING">ONGOING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {submitting ? "Updating Batch..." : "Save Batch Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
