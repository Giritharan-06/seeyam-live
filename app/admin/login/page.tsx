"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await loginAction({
        email,
        password,
        rememberMe,
      });

      if (res.success) {
        setSuccess(res.message || "Authentication successful. Redirecting...");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 800);
      } else {
        setError(res.message || "Invalid email or password");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickFill = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-slate-900/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          {/* Brand Logo Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-white transition-all shadow-lg shadow-black/40 group"
          >
            <div className="h-8 w-11 rounded-xl bg-white p-0.5 flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden shadow-sm">
              <img
                src="/logo.png"
                alt="Seeyam Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                SEEYAM TECHNOLOGIES
                <span className="text-[9px] bg-blue-500/20 text-blue-300 font-semibold px-1.5 py-0.2 rounded uppercase">
                  CRM
                </span>
              </div>
            </div>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">
            Staff & Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to access lead CRM, batch scheduling & analytics
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6" data-card-3d="settings" data-card-density="compact">
          {/* Status Message Alerts */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium">{success}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Work Email</span>
                <span className="text-[10px] text-slate-500">Authorized Personnel Only</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@seeyam.com"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Password</span>
                <span className="text-[10px] text-emerald-400/80">Encrypted Session</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 w-3.5 h-3.5"
                />
                <span className="text-xs text-slate-400">Keep me signed in for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-emerald-400" />
                <span>Quick Test Accounts:</span>
              </span>
              <span className="text-[10px] text-slate-500">Click to autofill</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@seeyam.com", "admin123")}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Admin</span>
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400 truncate">admin@seeyam.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("counselor@seeyam.com", "counselor123")}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-teal-400 flex items-center justify-between">
                  <span>Counselor</span>
                  <Sparkles className="w-3 h-3 text-teal-400" />
                </div>
                <div className="text-[10px] text-slate-400 truncate">counselor@seeyam.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Return to Public Website</span>
          </Link>
          <span>© {new Date().getFullYear()} Seeyam Technologies</span>
        </div>
      </div>
    </div>
  );
}
