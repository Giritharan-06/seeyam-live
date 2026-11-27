"use client";

import Link from "next/link";
import { ArrowUpRight, Bell, BriefcaseBusiness, ClipboardList, GraduationCap } from "lucide-react";

const links = [
  { label: "Students", detail: "Register learners and manage enrolments", route: "students", icon: GraduationCap, tone: "bg-violet-50 border-violet-200" },
  { label: "Job openings", detail: "Manage partner hiring opportunities", route: "jobs", icon: BriefcaseBusiness, tone: "bg-sky-50 border-sky-200" },
  { label: "Applications", detail: "Track interviews and offers", route: "applications", icon: ClipboardList, tone: "bg-emerald-50 border-emerald-200" },
  { label: "Notifications", detail: "Read staff announcements", route: "notifications", icon: Bell, tone: "bg-amber-50 border-amber-200" },
];

export default function OperationsOverview() {
  return (
    <section aria-labelledby="operations-heading" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <h2 id="operations-heading" className="text-xl font-bold text-slate-950">Staff workspaces</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {links.map(({ label, detail, route, icon: Icon, tone }) => (
          <Link key={route} href={`/admin/operations/${route}`} className={"rounded-xl border p-4 transition hover:shadow-md focus-visible:outline-blue-600 " + tone}>
            <div className="mb-3 flex items-center justify-between text-blue-700"><Icon size={20} aria-hidden="true" /><ArrowUpRight size={16} aria-hidden="true" /></div>
            <div className="font-semibold text-slate-950">{label}</div>
            <p className="mt-1 text-sm text-slate-600">{detail}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
