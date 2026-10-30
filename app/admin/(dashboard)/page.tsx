"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users2,
  CalendarCheck,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  BookOpen,
  Globe2,
  Layers,
  BarChart3,
  Award,
  Target,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getDashboardStats, getLeads, createWalkInLead } from "@/actions/leads";
import { getUpcomingBatches, createBatch } from "@/actions/batches";
import { MOCK_BRANCHES, MOCK_COURSES, LeadData, BatchData } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalLeads: number;
    newToday: number;
    totalEnrolled: number;
    inPipeline: number;
    activeBatches: number;
    conversionRate: string;
    totalCourses: number;
    totalBranches: number;
  } | null>(null);

  const [recentLeads, setRecentLeads] = useState<LeadData[]>([]);
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    branchId: MOCK_BRANCHES[0]?.id || "branch-omr",
    courseId: MOCK_COURSES[0]?.id || "course-fsd-java",
    initialNote: "",
  });
  const [walkInSubmitting, setWalkInSubmitting] = useState(false);
  const [walkInMessage, setWalkInMessage] = useState<string | null>(null);

  // New batch form state
  const [batchForm, setBatchForm] = useState({
    courseId: MOCK_COURSES[0]?.id || "course-fsd-java",
    branchId: MOCK_BRANCHES[0]?.id || "branch-omr",
    instructorName: "",
    instructorExp: "8+ Yrs Exp",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    timing: "Mon - Fri: 7:30 AM - 9:30 AM",
    maxSeats: 30,
  });
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [st, ld, bt] = await Promise.all([
        getDashboardStats(),
        getLeads({ page: 1, pageSize: 6 }),
        getUpcomingBatches(),
      ]);
      setStats(st);
      setRecentLeads(ld.leads);
      setBatches(bt);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalkInSubmitting(true);
    setWalkInMessage(null);

    const res = await createWalkInLead({
      fullName: walkInForm.fullName,
      email: walkInForm.email,
      phone: walkInForm.phone,
      branchId: walkInForm.branchId,
      courseId: walkInForm.courseId,
      initialNote: walkInForm.initialNote,
      status: "COUNSELING",
      source: "Walk-in Desk Entry",
    });

    setWalkInSubmitting(false);
    if (res.success) {
      setWalkInMessage("Walk-in lead saved successfully!");
      setWalkInForm({
        fullName: "",
        email: "",
        phone: "",
        branchId: MOCK_BRANCHES[0]?.id || "branch-omr",
        courseId: MOCK_COURSES[0]?.id || "course-fsd-java",
        initialNote: "",
      });
      loadData();
      setTimeout(() => {
        setIsWalkInOpen(false);
        setWalkInMessage(null);
      }, 1200);
    } else {
      setWalkInMessage(res.message);
    }
  };

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBatchSubmitting(true);
    setBatchMessage(null);

    const res = await createBatch({
      courseId: batchForm.courseId,
      branchId: batchForm.branchId,
      instructorName: batchForm.instructorName,
      instructorExp: batchForm.instructorExp,
      startDate: batchForm.startDate,
      timing: batchForm.timing,
      maxSeats: Number(batchForm.maxSeats),
    });

    setBatchSubmitting(false);
    if (res.success) {
      setBatchMessage("New batch created!");
      loadData();
      setTimeout(() => {
        setIsBatchModalOpen(false);
        setBatchMessage(null);
      }, 1200);
    } else {
      setBatchMessage(res.message);
    }
  };

  const getStatusBadge = (status: LeadData["status"]) => {
    switch (status) {
      case "NEW":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">NEW</span>;
      case "CONTACTED":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">CONTACTED</span>;
      case "COUNSELING":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">COUNSELING</span>;
      case "ENROLLED":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">ENROLLED</span>;
      case "DROPPED":
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">DROPPED</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        onOpenWalkInModal={() => setIsWalkInOpen(true)}
        onOpenBatchModal={() => setIsBatchModalOpen(true)}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome Top Banner */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden" data-card-3d="settings" data-card-density="compact">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Seeyam Technologies CRM • Executive Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admissions, Cohorts & Growth Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Live tracking for admissions pipelines, counselor follow-ups, cohort schedules, and search engine visibility.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
            <button
              onClick={() => setIsWalkInOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Record Walk-in</span>
            </button>

            <Link
              href="/admin/seo"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span>SEO Optimizer</span>
            </Link>

            <Link
              href="/admin/leads"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <span>Lead CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Leads */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between hover:border-emerald-500/40 transition-colors" data-card-3d="settings" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Total Leads</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {stats?.totalLeads ?? 0}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <span>+{stats?.newToday ?? 0} new today</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users2 className="w-6 h-6" />
            </div>
          </div>

          {/* Enrolled Students */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between hover:border-emerald-500/40 transition-colors" data-card-3d="settings" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Total Enrolled</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {stats?.totalEnrolled ?? 0}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                In Pipeline: {stats?.inPipeline ?? 0}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between hover:border-emerald-500/40 transition-colors" data-card-3d="settings" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Conversion Rate</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {stats?.conversionRate ?? "0%"}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">
                Industry benchmark: ~18%
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Active Batches */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between hover:border-emerald-500/40 transition-colors" data-card-3d="settings" data-card-density="compact">
            <div>
              <div className="text-xs font-semibold text-slate-500">Active Batches</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {stats?.activeBatches ?? 0}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">
                Across {stats?.totalBranches ?? 5} campuses
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Lead Funnel & Channel Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversion Funnel */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4" data-card-3d="settings" data-card-density="regular">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>Admission Conversion Funnel</span>
                </h3>
                <p className="text-xs text-slate-500">Stage progression from web visit to batch enrollment</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
                Current Quarter
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>1. New Inquiries (Landing Page & WhatsApp)</span>
                  <span>100% ({stats?.totalLeads || 12} leads)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>2. Contacted / Demo Scheduled</span>
                  <span>75% ({Math.round((stats?.totalLeads || 12) * 0.75)} leads)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-3/4" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>3. In Counseling / Campus Demo Attended</span>
                  <span>50% ({Math.round((stats?.totalLeads || 12) * 0.5)} leads)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full w-1/2" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>4. Confirmed Enrollment & Fee Payment</span>
                  <span>{stats?.conversionRate || "25%"} ({stats?.totalEnrolled || 3} students)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full w-1/4" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Lead Sources */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4" data-card-3d="settings" data-card-density="regular">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-600" />
                <span>Lead Acquisition Channels</span>
              </h3>
              <p className="text-xs text-slate-500">Source breakdown for admissions</p>

              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-800">Organic Search & SEO</span>
                  </div>
                  <span className="font-bold text-emerald-700">48%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="font-semibold text-slate-800">Direct Campus Walk-ins</span>
                  </div>
                  <span className="font-bold text-blue-700">28%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-semibold text-slate-800">Student Referrals</span>
                  </div>
                  <span className="font-bold text-amber-700">16%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span className="font-semibold text-slate-800">Google Ads & Social</span>
                  </div>
                  <span className="font-bold text-purple-700">8%</span>
                </div>
              </div>
            </div>

            <Link
              href="/admin/seo"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Boost Organic SEO & AEO Traffic</span>
            </Link>
          </div>
        </div>

        {/* Main Content Grid: Recent Inquiries & Upcoming Batches */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recent Inquiries Feed */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between" data-card-3d="settings" data-card-density="regular">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Web & Walk-in Inquiries</h3>
                  <p className="text-xs text-slate-500">Latest leads waiting for counselor callback</p>
                </div>
                <Link
                  href="/admin/leads"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>View All Leads</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentLeads.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No inquiries recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentLeads.map((lead) => {
                    const course = MOCK_COURSES.find((c) => c.id === lead.courseId);
                    const branch = MOCK_BRANCHES.find((b) => b.id === lead.branchId);

                    return (
                      <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {lead.fullName}
                            </span>
                            {getStatusBadge(lead.status)}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {course?.title || lead.courseId} • <span className="font-medium text-slate-700">{branch?.name}</span>
                          </div>
                          {lead.notes?.[0] && (
                            <div className="text-[10px] text-slate-400 italic truncate mt-0.5">
                              &ldquo;{lead.notes[0].text}&rdquo;
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </a>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {formatDate(lead.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <Link
                href="/admin/leads"
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors border border-slate-200"
              >
                <span>Launch Interactive Lead CRM Data Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Upcoming Batches Schedule */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between" data-card-3d="settings" data-card-density="regular">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upcoming Batch Schedules</h3>
                  <p className="text-xs text-slate-500">Upcoming cohorts & seat availability</p>
                </div>
                <button
                  onClick={() => setIsBatchModalOpen(true)}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Batch</span>
                </button>
              </div>

              <div className="space-y-3">
                {batches.map((batch) => {
                  const course = MOCK_COURSES.find((c) => c.id === batch.courseId);
                  const branch = MOCK_BRANCHES.find((b) => b.id === batch.branchId);

                  return (
                    <div
                      key={batch.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {course?.title || batch.courseId}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{branch?.name} ({branch?.city})</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                          {batch.seatsLeft} Seats Left
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-600">
                        <span>Starts: <strong>{formatDate(batch.startDate)}</strong></span>
                        <span>{batch.timing}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                + Schedule New Cohort
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Walk-In Lead Drawer / Modal */}
      {isWalkInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsWalkInOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 z-10 animate-scale-in" data-card-3d="settings" data-card-density="regular">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Register Walk-in Lead</h3>
                <p className="text-xs text-slate-500">Record direct campus walk-in inquiry</p>
              </div>
              <button
                onClick={() => setIsWalkInOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {walkInMessage && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {walkInMessage}
              </div>
            )}

            <form onSubmit={handleWalkInSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={walkInForm.fullName}
                  onChange={(e) => setWalkInForm({ ...walkInForm, fullName: e.target.value })}
                  placeholder="e.g. Sivasankaran M"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={walkInForm.email}
                    onChange={(e) => setWalkInForm({ ...walkInForm, email: e.target.value })}
                    placeholder="siva@gmail.com"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">10-Digit Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm({ ...walkInForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Course *</label>
                  <select
                    value={walkInForm.courseId}
                    onChange={(e) => setWalkInForm({ ...walkInForm, courseId: e.target.value })}
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
                    value={walkInForm.branchId}
                    onChange={(e) => setWalkInForm({ ...walkInForm, branchId: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 bg-white"
                  >
                    {MOCK_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counselor Discussion Note</label>
                <textarea
                  rows={2}
                  value={walkInForm.initialNote}
                  onChange={(e) => setWalkInForm({ ...walkInForm, initialNote: e.target.value })}
                  placeholder="Candidate visited center with parents, interested in weekend batch..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={walkInSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {walkInSubmitting ? "Saving Lead..." : "Save Walk-in Lead"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Batch Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsBatchModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 z-10 animate-scale-in" data-card-3d="settings" data-card-density="regular">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create New Cohort Batch</h3>
                <p className="text-xs text-slate-500">Schedule next course start date & timing</p>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {batchMessage && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {batchMessage}
              </div>
            )}

            <form onSubmit={handleBatchSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Course Program *</label>
                <select
                  value={batchForm.courseId}
                  onChange={(e) => setBatchForm({ ...batchForm, courseId: e.target.value })}
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Training Campus *</label>
                <select
                  value={batchForm.branchId}
                  onChange={(e) => setBatchForm({ ...batchForm, branchId: e.target.value })}
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
                  value={batchForm.instructorName}
                  onChange={(e) => setBatchForm({ ...batchForm, instructorName: e.target.value })}
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
                    value={batchForm.startDate}
                    onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Seat Cap</label>
                  <input
                    type="number"
                    min={10}
                    max={50}
                    value={batchForm.maxSeats}
                    onChange={(e) => setBatchForm({ ...batchForm, maxSeats: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Timings *</label>
                <input
                  type="text"
                  required
                  value={batchForm.timing}
                  onChange={(e) => setBatchForm({ ...batchForm, timing: e.target.value })}
                  placeholder="Mon - Fri: 7:30 AM - 9:30 AM"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={batchSubmitting}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {batchSubmitting ? "Scheduling Batch..." : "Schedule Cohort Batch"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
