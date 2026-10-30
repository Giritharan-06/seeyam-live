import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Laptop, Star } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import type { CourseData } from "@/lib/mock-data";
import { decodeHtml, formatCurrency } from "@/lib/utils";

export default function HomeCourseCard({ course, category }: { course: CourseData; category: string }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-400 hover:shadow-xl" data-card-3d={course.slug.includes("marketing") ? "marketing" : "analytics"} data-card-density="regular">
      <div className="h-1.5 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-400" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold text-blue-700">{decodeHtml(category)}</span>
          <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber-600"><Star size={14} className="fill-amber-400 text-amber-400" />{course.rating}</span>
        </div>
        <Link href={`/courses/${course.slug}`}><h3 className="text-lg font-extrabold leading-snug text-[#071938] transition group-hover:text-blue-600">{decodeHtml(course.title)}</h3></Link>
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-600">{decodeHtml(course.summary)}</p>
        <div className="my-4 grid grid-cols-2 gap-2 border-y border-slate-100 py-3 text-xs text-slate-600"><span className="flex items-center gap-1.5"><Clock size={14} className="shrink-0 text-blue-600" />{course.duration.split('/')[0].trim()}</span><span className="flex items-center gap-1.5"><Laptop size={14} className="text-indigo-600" />{course.mode === 'HYBRID' ? 'Hybrid' : course.mode === 'ONLINE' ? 'Online' : 'Classroom'}</span></div>
        {course.hiringPartners?.length ? <div className="mb-4 rounded-2xl border border-slate-200 bg-[#F8FAFD] p-3"><p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-500">Companies listed for this program</p><div className="flex flex-wrap gap-2">{course.hiringPartners.slice(0,3).map(company => <span key={company} className="rounded-lg border border-slate-200 bg-white px-2 py-1"><CompanyLogo name={company} size="sm" /></span>)}</div></div> : null}
        <div className="mb-5 space-y-2">{course.highlights?.slice(0,2).map(item => <p key={item} className="flex items-start gap-2 text-xs leading-5 text-slate-600"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-blue-600" /><span className="line-clamp-2">{decodeHtml(item)}</span></p>)}</div>
        <div className="mt-auto flex items-center justify-between rounded-2xl border border-slate-200 bg-[#F8FAFD] p-3"><div><p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Tuition fee</p><p className="mt-1 text-base font-black text-[#071938]">{formatCurrency(course.price)}</p></div><Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-blue-700">View syllabus <ArrowRight size={14} /></Link></div>
      </div>
    </article>
  );
}
