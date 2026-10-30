"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, PhoneCall, X } from "lucide-react";

export default function StickyWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    // Show after slight delay to ensure good initial page load UX
    const timer = setTimeout(() => setIsVisible(true), 1500);
    // Show quick tooltip after 4 seconds to draw attention
    const tooltipTimer = setTimeout(() => setIsTooltipOpen(true), 4000);
    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Direct Admissions WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 animate-fade-in"
    >
      {/* Floating Prompt Speech Bubble */}
      {isTooltipOpen && (
        <div className="relative bg-white text-slate-800 p-3.5 rounded-2xl shadow-2xl border border-slate-200 text-xs max-w-xs mb-1 flex items-start gap-2.5 animate-scale-in">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-ping" />
          <div className="space-y-0.5">
            <p className="font-bold text-[#071938] flex items-center gap-1.5">
              <span>Have a question about your career?</span>
              <span>👋</span>
            </p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Wondering if tech is right for you? Chat with an instructor directly — no pressure, just honest advice.
            </p>
          </div>
          <button
            onClick={() => setIsTooltipOpen(false)}
            className="text-slate-400 hover:text-slate-600 ml-1 p-0.5"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main WhatsApp Action Button */}
      <a
        href="https://wa.me/918939915577?text=Hi%20Seeyam%20team,%20I%20would%20love%20to%20get%20some%20guidance%20on%20which%20program%20fits%20my%20background."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-emerald-500/40"
        aria-label="Chat with Seeyam Technologies on WhatsApp"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="text-xs font-extrabold tracking-wide hidden sm:inline">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
}
