"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function ToolMarqueeStrip() {
  const tools = [
    {
      name: "Tableau",
      category: "Data Visualization",
      color: "from-amber-500/10 to-yellow-500/10 border-amber-200 text-amber-800",
      pill: "Executive Dashboards",
      icon: (
        <svg viewBox="0 0 100 100" className="w-5 h-5 shrink-0" fill="currentColor">
          <rect x="44" y="24" width="12" height="52" rx="1.5" fill="#E8762D" />
          <rect x="24" y="44" width="52" height="12" rx="1.5" fill="#E8762D" />
          <rect x="46" y="2" width="8" height="26" rx="1" fill="#D22E2E" />
          <rect x="37" y="11" width="26" height="8" rx="1" fill="#D22E2E" />
          <rect x="46" y="72" width="8" height="26" rx="1" fill="#1C3D5A" />
          <rect x="37" y="81" width="26" height="8" rx="1" fill="#1C3D5A" />
          <rect x="11" y="37" width="8" height="26" rx="1" fill="#2E6987" />
          <rect x="2" y="46" width="26" height="8" rx="1" fill="#2E6987" />
          <rect x="81" y="37" width="8" height="26" rx="1" fill="#2E6987" />
          <rect x="72" y="46" width="26" height="8" rx="1" fill="#2E6987" />
        </svg>
      ),
    },
    {
      name: "Power BI",
      category: "Business Intelligence",
      color: "from-amber-500/10 to-yellow-500/10 border-amber-200 text-amber-800",
      pill: "DAX & Reporting",
      icon: (
        <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0" fill="none">
          <rect x="29" y="8" width="11" height="34" rx="2.5" fill="#D97706" />
          <rect x="18" y="18" width="11" height="24" rx="2.5" fill="#F59E0B" />
          <rect x="7" y="27" width="11" height="15" rx="2.5" fill="#FBBF24" />
        </svg>
      ),
    },
    {
      name: "SQL",
      category: "Relational Databases",
      color: "from-sky-500/10 to-blue-500/10 border-sky-200 text-sky-800",
      pill: "Queries & Joins",
      icon: (
        <svg viewBox="0 0 80 80" className="w-5 h-5 shrink-0" fill="none">
          <path d="M14 28V52C14 62 25 70 40 70C55 70 66 62 66 52V28" fill="#0072CE" />
          <ellipse cx="40" cy="24" rx="26" ry="12" fill="#75C243" />
          <text x="40" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900">SQL</text>
        </svg>
      ),
    },
    {
      name: "Python",
      category: "Data Science & ML",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-800",
      pill: "Pandas & ETL",
      icon: (
        <svg viewBox="0 0 110 110" className="w-5 h-5 shrink-0" fill="none">
          <path d="M54.5 4.5C28.2 4.5 29.8 15.9 29.8 15.9L29.9 27.7H55v3.6H19.9s-15.4 1.7-15.4 27.9c0 26.2 13.5 25.4 13.5 25.4h8v-11.3c0-12.9 11-12.5 11-12.5h25.1c10.8 0 10.3-10.2 10.3-10.2V15.4S94.2 4.5 54.5 4.5z" fill="#387EB8" />
          <path d="M55.5 105.5c26.3 0 24.7-11.4 24.7-11.4l-.1-11.8H55v-3.6h35.1s15.4-1.7 15.4-27.9c0-26.2-13.5-25.4-13.5-25.4h-8v11.3c0 12.9-11 12.5-11 12.5H47.9c-10.8 0-10.3 10.2-10.3 10.2v25.2s-1.8 10.9 37.9 10.9z" fill="#FFE052" />
        </svg>
      ),
    },
    {
      name: "Power Automate",
      category: "Workflow Automation",
      color: "from-cyan-500/10 to-sky-500/10 border-cyan-200 text-cyan-800",
      pill: "RPA & Cloud Flow",
      icon: (
        <svg viewBox="0 0 64 64" className="w-5 h-5 shrink-0" fill="none">
          <path d="M10 20L28 6L46 20L28 34L10 20Z" fill="#0078D4" />
          <path d="M28 34L46 20L58 29.5L40 43.5L28 34Z" fill="#50E6FF" />
          <path d="M28 34L40 43.5L28 53L16 43.5L28 34Z" fill="#005A9E" />
          <path d="M10 20L28 34L16 43.5L6 33.5L10 20Z" fill="#2899F5" />
        </svg>
      ),
    },
    {
      name: "Power Apps",
      category: "Low-Code Business Apps",
      color: "from-purple-500/10 to-fuchsia-500/10 border-purple-200 text-purple-800",
      pill: "Enterprise Apps",
      icon: (
        <svg viewBox="0 0 64 64" className="w-5 h-5 shrink-0" fill="none">
          <path d="M32 6L54 22L32 38L10 22L32 6Z" fill="#742774" />
          <path d="M32 38L54 22L54 42L32 58L32 38Z" fill="#C037A6" />
          <path d="M32 38L10 22L10 42L32 58L32 38Z" fill="#9F2B8D" />
        </svg>
      ),
    },
  ];

  // Duplicate for seamless 60fps infinite marquee loop
  const marqueeItems = [...tools, ...tools, ...tools];

  return (
    <div className="py-4 bg-[#051829] border-y border-[#0e2c4d] overflow-hidden select-none relative">
      {/* Side Fade Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#051829] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#051829] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-4">
        {marqueeItems.map((tool, idx) => (
          <div
            key={`${tool.name}-${idx}`}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.08] hover:border-blue-400/50 transition-all duration-300 backdrop-blur-md shrink-0 group cursor-default"
          >
            <div className="w-7 h-7 rounded-lg bg-white/90 p-1 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-wide">{tool.name}</span>
              <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline">• {tool.category}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {tool.pill}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
