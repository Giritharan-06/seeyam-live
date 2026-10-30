import Link from "next/link";
import { GraduationCap, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20">
        <GraduationCap className="w-9 h-9" />
      </div>

      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold uppercase tracking-wider mb-4">
        404 Error
      </span>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        Page Not Found
      </h1>

      <p className="text-slate-400 text-sm sm:text-base max-w-md mt-3 mb-8">
        The course page or resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all"
        >
          <span>Admin Portal</span>
        </Link>
      </div>
    </div>
  );
}
