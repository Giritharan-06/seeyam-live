"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  AlertCircle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { usePlatformData } from "@/components/PlatformDataContext";
import { useLeadModal } from "@/components/LeadModalContext";
import { BatchData } from "@/lib/mock-data";

interface UpcomingBatchesProps {
  courseId?: string;
  limit?: number;
  title?: string;
  subtitle?: string;
}

export default function UpcomingBatches({
  courseId,
  limit,
  title = "Upcoming Batches & Class Schedules",
  subtitle = "Flexible weekday, weekend, and evening cohorts with hands-on lab projects across all campus locations.",
}: UpcomingBatchesProps) {
  const { batches, courses, branches } = usePlatformData();
  const { openLeadModal } = useLeadModal();

  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");
  const [selectedTiming, setSelectedTiming] = useState<string>("ALL");

  let filteredBatches = batches.filter((b: BatchData) => {
    if (courseId && b.courseId !== courseId) return false;
    if (selectedBranch !== "ALL" && b.branchId !== selectedBranch) return false;
    if (selectedTiming === "WEEKDAY" && !b.timing.toLowerCase().includes("mon")) return false;
    if (selectedTiming === "WEEKEND" && !b.timing.toLowerCase().includes("sat") && !b.timing.toLowerCase().includes("weekend")) return false;
    return true;
  });

  if (limit && limit > 0) {
    filteredBatches = filteredBatches.slice(0, limit);
  }

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6" data-card-3d="calendar" data-card-density="compact">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Fast-Filling Batches</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#071938] tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">{subtitle}</p>
        </div>

        {/* Quick Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!courseId && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          )}

          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setSelectedTiming("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTiming === "ALL"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedTiming("WEEKDAY")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTiming === "WEEKDAY"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Weekday
            </button>
            <button
              onClick={() => setSelectedTiming("WEEKEND")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedTiming === "WEEKEND"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Weekend
            </button>
          </div>
        </div>
      </div>

      {/* Batch Cards / Table */}
      {filteredBatches.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2" data-card-3d="calendar" data-card-density="compact">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-bold text-slate-700">No scheduled batches match this filter right now.</p>
          <p className="text-xs text-slate-500">
            Reach out to our admissions team to open a custom timing slot for your schedule.
          </p>
          <button
            onClick={() => openLeadModal(courseId)}
            className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Request Custom Batch Date
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                {!courseId && <th className="py-3.5 px-4">Course</th>}
                <th className="py-3.5 px-4">Campus Location</th>
                <th className="py-3.5 px-4">Mentor</th>
                <th className="py-3.5 px-4">Start Date</th>
                <th className="py-3.5 px-4">Timing Slot</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((batch: BatchData) => {
                const course = courses.find((c) => c.id === batch.courseId);
                const branch = branches.find((b) => b.id === batch.branchId);

                return (
                  <tr key={batch.id} className="hover:bg-blue-50/30 transition-colors group">
                    {!courseId && (
                      <td className="py-4 px-4 font-bold text-[#071938]">
                        <Link
                          href={`/courses/${course?.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {course?.title || "Specialized Course"}
                        </Link>
                      </td>
                    )}
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>
                          {branch?.name || "Campus"} ({branch?.city || "Chennai"})
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{batch.instructorName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                        {batch.startDate}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{batch.timing}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {batch.seatsLeft} Seats Left
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => openLeadModal(batch.courseId, batch.branchId)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-[11px] shadow-sm shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-1"
                      >
                        <span>Reserve Seat</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
