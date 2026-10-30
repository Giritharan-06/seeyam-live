"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users2,
  BookOpen,
  CalendarCheck,
  Building2,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  Globe2,
  MessageSquareText,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { SessionUser } from "@/lib/auth";

interface AdminSidebarProps {
  user?: SessionUser | null;
}

const NAV_GROUPS = [
  {
    label: "Core Operations",
    items: [
      {
        name: "Overview / Analytics",
        href: "/admin",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        name: "Lead CRM Portal",
        href: "/admin/leads",
        icon: Users2,
        badge: "Live",
      },
      {
        name: "Batch Scheduler",
        href: "/admin/batches",
        icon: CalendarCheck,
      },
      {
        name: "Course Catalog",
        href: "/admin/courses",
        icon: BookOpen,
      },
      {
        name: "Campus Branches",
        href: "/admin/branches",
        icon: Building2,
      },
    ],
  },
  {
    label: "Growth & Visibility",
    items: [
      {
        name: "SEO / AEO / GEO Engine",
        href: "/admin/seo",
        icon: Globe2,
        badge: "New",
      },
      {
        name: "Student Reviews",
        href: "/admin/reviews",
        icon: MessageSquareText,
        badge: "Live",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        name: "Platform Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const displayName = user?.name || "Administrator";
  const displayRole = user?.role || "ADMIN";
  const displayEmail = user?.email || "admin@seeyam.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside
      className={`bg-[#071938] text-slate-300 border-r border-[#0f2956] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Logo */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4 border-b border-[#0f2956] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden group">
            <div className="h-10 w-14 rounded-xl bg-white p-0.5 shadow-md flex items-center justify-center shrink-0 border border-[#1d4282] overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="Seeyam Logo"
                className="w-full h-full object-contain"
              />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="font-extrabold text-sm text-white tracking-tight leading-none">
                  SEEYAM CRM
                </div>
                <div className="text-[10px] text-blue-400 font-semibold uppercase mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>Admin Portal</span>
                </div>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0e2a5c] transition-colors hidden md:block"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Grouped Navigation Links */}
        <div className="p-3 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-1.5">
              {!collapsed && (
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                        : "text-slate-400 hover:text-white hover:bg-[#0e2a5c]"
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                      }`}
                    />
                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between truncate">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              isActive
                                ? "bg-blue-800 text-white"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Profile Card & Quick Public Link */}
      <div className="p-3 border-t border-[#0f2956] space-y-2 bg-[#051329]">
        {/* Quick View Public Site */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-[#0e2a5c] transition-colors"
          title="Open Public Website"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {!collapsed && <span>View Public Website</span>}
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#071938] border border-[#0f2956]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {initial}
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{displayName}</div>
                <div className="text-[10px] text-slate-400 truncate">{displayEmail}</div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#0e2a5c] transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
