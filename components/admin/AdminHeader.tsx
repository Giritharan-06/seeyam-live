"use client";

import { CalendarPlus, UserPlus } from "lucide-react";
import type { SessionUser } from "@/lib/auth";

interface AdminHeaderProps {
  user?: SessionUser | null;
  onOpenWalkInModal?: () => void;
  onOpenBatchModal?: () => void;
}

export default function AdminHeader({onOpenWalkInModal,onOpenBatchModal}: AdminHeaderProps) {
  if (!onOpenWalkInModal && !onOpenBatchModal) return null;
  return <div className="flex flex-wrap justify-end gap-2 border-b border-indigo-100 bg-indigo-50 px-4 py-3 sm:px-8">
    {onOpenWalkInModal && <button onClick={onOpenWalkInModal} className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-3 py-2 text-sm font-bold text-white"><UserPlus size={16}/>Add walk-in lead</button>}
    {onOpenBatchModal && <button onClick={onOpenBatchModal} className="inline-flex items-center gap-2 rounded-lg bg-sky-800 px-3 py-2 text-sm font-bold text-white"><CalendarPlus size={16}/>New batch</button>}
  </div>;
}