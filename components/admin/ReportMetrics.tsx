import { BadgeCheck, BookOpen, BriefcaseBusiness, GraduationCap, Handshake, Presentation, UsersRound, Wallet } from "lucide-react";
import Link from "next/link";
import type { reportData } from "@/lib/operations/store";

type Metrics = Awaited<ReturnType<typeof reportData>>[number];

export default function ReportMetrics({ data }: { data: Metrics }) {
  const money = new Intl.NumberFormat("en-IN", {style: "currency", currency: "INR"});
  const cards = [
    { name:"Active students", value:data.students, icon:GraduationCap, tone:"bg-violet-100 text-violet-800", href:"students" },
    { name:"Current enrolments", value:data.enrolled, icon:BookOpen, tone:"bg-sky-100 text-sky-800", href:"enrolments" },
    { name:"Active trainers", value:data.trainers, icon:Presentation, tone:"bg-teal-100 text-teal-800", href:"trainers" },
    { name:"Open jobs", value:data.jobs, icon:BriefcaseBusiness, tone:"bg-amber-100 text-amber-900", href:"jobs" },
    { name:"Interviews", value:data.interviews, icon:UsersRound, tone:"bg-fuchsia-100 text-fuchsia-800", href:"applications" },
    { name:"Offers", value:data.offers, icon:Handshake, tone:"bg-indigo-100 text-indigo-800", href:"applications" },
    { name:"Placements", value:data.placements, icon:BadgeCheck, tone:"bg-emerald-100 text-emerald-800", href:"placements" },
    { name:"Recorded payments", value:money.format(Number(data.receipts)), icon:Wallet, tone:"bg-rose-100 text-rose-800", href:"payments" },
  ];

  return <main className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-10 sm:px-8">
    <header className="rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-100 via-white to-teal-100 p-6 sm:p-8">
      <h1 className="font-extrabold">Reports</h1>
      <p className="mt-2 text-sm text-slate-700">Current totals from training, hiring, and recorded receipts.</p>
    </header>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ name, value, icon: Icon, tone, href }) =>
        <Link key={name} href={`/admin/operations/${href}`} className="group block min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-violet-400 hover:shadow-md">
          <span className={`inline-flex rounded-xl p-3 ${tone}`}><Icon size={22} aria-hidden="true"/></span>
          <p className="mt-4 text-sm font-semibold text-slate-600">{name}</p>
          <p className="mt-1 break-words text-2xl font-extrabold tabular-nums text-slate-950 sm:text-3xl">{value}</p>
        </Link>)}
    </div>
  </main>;
}
