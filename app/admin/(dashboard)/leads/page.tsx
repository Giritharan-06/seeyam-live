"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  FileSpreadsheet,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  getLeads,
  updateLeadStatus,
  addLeadNote,
  exportLeadsCsv,
} from "@/actions/leads";
import {
  MOCK_BRANCHES,
  MOCK_COURSES,
  LeadData,
  LeadNote,
} from "@/lib/mock-data";
import { formatDate, formatTime } from "@/lib/utils";

const STATUSES: Array<LeadData["status"]> = [
  "NEW",
  "CONTACTED",
  "COUNSELING",
  "ENROLLED",
  "DROPPED",
];

export default function LeadCRMPage() {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");

  // Slide-over state
  const [selectedLead, setSelectedLead] = useState<LeadData | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Counselor Priya");
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  // Transition for smooth updates
  const [isPending, startTransition] = useTransition();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await getLeads({
        search: searchQuery,
        status: statusFilter,
        branchId: branchFilter,
        courseId: courseFilter,
        page,
        pageSize,
      });
      setLeads(res.leads);
      setTotalLeads(res.total);
      setTotalPages(res.totalPages);

      // Keep selectedLead updated if open
      if (selectedLead) {
        const fresh = res.leads.find((l) => l.id === selectedLead.id);
        if (fresh) setSelectedLead(fresh);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, pageSize, statusFilter, branchFilter, courseFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleInlineStatusChange = async (
    leadId: string,
    newStatus: LeadData["status"]
  ) => {
    startTransition(async () => {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }

      await updateLeadStatus({
        leadId,
        newStatus,
        note: `Inline status changed to ${newStatus}`,
        author: "Counselor CRM",
      });
      fetchLeads();
    });
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteText.trim()) return;

    setNoteSubmitting(true);
    const res = await addLeadNote({
      leadId: selectedLead.id,
      text: noteText.trim(),
      author: noteAuthor,
    });
    setNoteSubmitting(false);

    if (res.success && res.data) {
      setSelectedLead(res.data);
      setNoteText("");
      fetchLeads();
    }
  };

  const handleExportCsv = async () => {
    const csvContent = await exportLeadsCsv({
      search: searchQuery,
      status: statusFilter,
      branchId: branchFilter,
      courseId: courseFilter,
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `seeyam-leads-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeStyle = (status: LeadData["status"]) => {
    switch (status) {
      case "NEW":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CONTACTED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "COUNSELING":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "ENROLLED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "DROPPED":
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Lead Management CRM
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live database of admissions inquiries, counselor notes, and enrollment workflows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-4" data-card-3d="settings" data-card-density="compact">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, phone..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </form>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="ALL">All Statuses ({STATUSES.length})</option>
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    Status: {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <select
                value={branchFilter}
                onChange={(e) => {
                  setBranchFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="ALL">All Branches ({MOCK_BRANCHES.length})</option>
                {MOCK_BRANCHES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <select
                value={courseFilter}
                onChange={(e) => {
                  setCourseFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="ALL">All Courses ({MOCK_COURSES.length})</option>
                {MOCK_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CRM Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden" data-card-3d="settings" data-card-density="compact">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Candidate Details</th>
                  <th className="py-3.5 px-4">Course & Campus</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4">Latest Counselor Log</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Loading leads...</span>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No leads found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const course = MOCK_COURSES.find((c) => c.id === lead.courseId);
                    const branch = MOCK_BRANCHES.find((b) => b.id === lead.branchId);

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                          selectedLead?.id === lead.id ? "bg-emerald-50/40" : ""
                        }`}
                      >
                        {/* Candidate Details */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-bold text-slate-900">{lead.fullName}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" /> {lead.email}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-700 font-semibold">
                              <Phone className="w-3 h-3 text-emerald-600" /> {lead.phone}
                            </span>
                          </div>
                        </td>

                        {/* Course & Branch */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800 line-clamp-1">
                            {course?.title || lead.courseId}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{branch?.name}</span>
                          </div>
                        </td>

                        {/* Inline Status Dropdown */}
                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleInlineStatusChange(
                                lead.id,
                                e.target.value as LeadData["status"]
                              )
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border focus:outline-none transition-all cursor-pointer ${getStatusBadgeStyle(
                              lead.status
                            )}`}
                          >
                            {STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Latest Note */}
                        <td className="py-4 px-4 max-w-xs">
                          {lead.notes && lead.notes.length > 0 ? (
                            <div className="truncate text-slate-600">
                              <span className="text-[10px] font-semibold text-slate-400 mr-1">
                                [{lead.notes[0].author}]:
                              </span>
                              <span>{lead.notes[0].text}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">No notes logged</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {formatDate(lead.createdAt)}
                        </td>

                        {/* Quick View Button */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          >
                            Open Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              Showing <strong>{leads.length}</strong> of <strong>{totalLeads}</strong> total inquiries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Counselor Slide-Over Details Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedLead(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slide-in-right">
              {/* Slide-over Header */}
              <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    Lead CRM Record
                  </span>
                  <h3 className="text-xl font-bold mt-2">{selectedLead.fullName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-400" /> {selectedLead.phone}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slide-over Content Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Status Selector */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200" data-card-3d="settings" data-card-density="regular">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Update Pipeline Status:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {STATUSES.map((st) => (
                      <button
                        key={st}
                        onClick={() => handleInlineStatusChange(selectedLead.id, st)}
                        className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                          selectedLead.status === st
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                    Lead Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl border border-slate-200 bg-white">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Email</div>
                      <div className="font-semibold text-slate-800 truncate">{selectedLead.email}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Campus</div>
                      <div className="font-semibold text-slate-800">
                        {MOCK_BRANCHES.find((b) => b.id === selectedLead.branchId)?.name || selectedLead.branchId}
                      </div>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-slate-100">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">Target Course</div>
                      <div className="font-semibold text-slate-800">
                        {MOCK_COURSES.find((c) => c.id === selectedLead.courseId)?.title || selectedLead.courseId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Counselor Follow-up Notes History */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                      Counselor Discussion Log
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {selectedLead.notes?.length || 0} notes
                    </span>
                  </div>

                  {/* Add New Note Box */}
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      rows={3}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Type call summary, candidate requirements, or follow-up date..."
                      className="w-full rounded-2xl border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={noteAuthor}
                        onChange={(e) => setNoteAuthor(e.target.value)}
                        placeholder="Counselor Name"
                        className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 w-36"
                      />
                      <button
                        type="submit"
                        disabled={noteSubmitting || !noteText.trim()}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-50"
                      >
                        {noteSubmitting ? "Logging..." : "Log Note"}
                      </button>
                    </div>
                  </form>

                  {/* Notes Stream */}
                  <div className="space-y-3 pt-2">
                    {selectedLead.notes?.map((note) => (
                      <div
                        key={note.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                          <span className="text-emerald-700 font-bold">{note.author}</span>
                          <span>{formatDate(note.timestamp)} {formatTime(note.timestamp)}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slide-over Footer Contact Bar */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Candidate</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedLead.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(selectedLead.fullName)},%20this%20is%20Seeyam%20Technologies%20Counselor.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
