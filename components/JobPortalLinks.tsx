"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Briefcase,
  Search,
  Building2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { JobPortalLinkData, MOCK_JOB_PORTAL_LINKS } from "@/lib/mock-data";

interface JobPortalLinksProps {
  initialRoleFilter?: string;
  roleFilter?: string;
  customLinks?: JobPortalLinkData[];
  title?: string;
  description?: string;
  subtitle?: string;
  className?: string;
}

const ROLES = [
  { id: "ALL", label: "All Tech Roles" },
  { id: "data-analyst", label: "Data Analyst & BI" },
  { id: "full-stack", label: "Full Stack & Web" },
  { id: "python-engineer", label: "Python & Data Science" },
  { id: "digital-marketer", label: "Digital Marketing & SEO" },
];

export default function JobPortalLinks({
  initialRoleFilter = "ALL",
  roleFilter,
  customLinks,
  title = "Live Tech Hiring Feeds & Portal Shortcuts",
  description,
  subtitle,
  className = "",
}: JobPortalLinksProps) {
  const activeInitial = roleFilter || initialRoleFilter;
  const activeDesc = subtitle || description || "Direct 1-click links to active job search feeds across top platforms for Chennai, Bangalore, and Hyderabad.";
  const [selectedRole, setSelectedRole] = useState<string>(activeInitial);
  const links = customLinks || MOCK_JOB_PORTAL_LINKS;

  const filteredLinks =
    selectedRole === "ALL"
      ? links
      : links.filter((item) => item.roleFilter === selectedRole);

  return (
    <div className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 ${className}`} data-card-3d="growth" data-card-density="regular">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Hiring Market</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#071938] tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedRole === role.id
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFD] border border-slate-200 hover:border-blue-400 hover:bg-white hover:shadow-md transition-all duration-200" data-card-3d="growth" data-card-density="compact"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#071938] group-hover:text-blue-600 transition-colors">
                  {link.siteName}
                </h4>
                {link.badge && (
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    {link.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
              <span className="text-[11px] font-bold hidden sm:inline">Explore Jobs</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>

      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-3 text-xs text-blue-800">
        <span className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Need 1-on-1 resume review before applying? Our placement cell offers free ATS audits.</span>
        </span>
      </div>
    </div>
  );
}
