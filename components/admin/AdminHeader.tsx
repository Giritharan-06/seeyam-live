"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  CalendarPlus,
  LogOut,
  Sparkles,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { SessionUser } from "@/lib/auth";

interface AdminHeaderProps {
  user?: SessionUser | null;
  onOpenWalkInModal?: () => void;
  onOpenBatchModal?: () => void;
}

export default function AdminHeader({
  user,
  onOpenWalkInModal,
  onOpenBatchModal,
}: AdminHeaderProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const displayName = user?.name || "Administrator";
  const displayRole = user?.role || "ADMIN";

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
      {/* Left: Search & Global Lead Lookup */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads, courses, batch schedules..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: Role Badge & Quick Actions */}
      <div className="flex items-center gap-3">
        {onOpenWalkInModal && (
          <button
            onClick={onOpenWalkInModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Walk-in Lead</span>
          </button>
        )}

        {onOpenBatchModal && (
          <button
            onClick={onOpenBatchModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#071938] hover:bg-[#0e2a5c] text-white text-xs font-bold shadow-sm transition-all"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>New Batch</span>
          </button>
        )}

        {/* SEO Quick Link */}
        <Link
          href="/admin/seo"
          className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 transition-colors"
        >
          <Globe2 className="w-3.5 h-3.5 text-blue-600" />
          <span>SEO Engine</span>
        </Link>

        {/* Role Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Role: {displayRole}</span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Sign out of CRM"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
