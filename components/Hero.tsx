"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Search, BarChart3, Megaphone, Sparkles, PlayCircle } from "lucide-react";
import HeroAnalyticsBackground from "@/components/HeroAnalyticsBackground";
import { usePlatformData } from "@/components/PlatformDataContext";
import { extractYoutubeEmbedUrl } from "@/lib/utils";

interface HeroProps {
  onSelectCategory: (categoryId: string) => void;
  onSearchCourse: (query: string) => void;
  onOpenLeadModal: (courseId?: string) => void;
}

export default function Hero({ onSearchCourse, onOpenLeadModal }: HeroProps) {
  const [query, setQuery] = useState("");
  const { heroMedia } = usePlatformData();
  const embedUrl = extractYoutubeEmbedUrl(heroMedia.youtubeUrl);
  return (
    <section className="hero-section relative isolate overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#F0F6FF] to-[#F8FAFD] py-10 sm:py-14 lg:py-16">
      <HeroAnalyticsBackground />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        <div className="min-w-0">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-blue-700"><Sparkles size={14} className="text-amber-500" />Practical training. Career-focused learning.</p>
          <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-[#071938] sm:text-4xl lg:text-[2.7rem] xl:text-[3.2rem]">Build your career in<br /><span className="text-blue-600">Data Analytics</span><br />& Digital Marketing.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">Turn spreadsheets into insights and ideas into campaigns. Learn Power BI, SQL, Python, SEO and paid advertising through practical projects and mentor guidance.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => onOpenLeadModal()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-amber-500/20 transition hover:from-amber-600 hover:to-yellow-700">Book a free demo <ArrowRight size={17} /></button>
            <Link href="/courses" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-300">Explore courses</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-600">{["Hands-on projects", "Classroom & online", "Career guidance"].map(text => <span key={text} className="inline-flex items-center gap-1.5"><Check size={14} className="text-blue-600" />{text}</span>)}</div>
          <form onSubmit={event => { event.preventDefault(); onSearchCourse(query.trim()); document.getElementById('courses')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }} className="mt-8 flex max-w-lg items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
            <Search size={18} className="ml-2 shrink-0 text-slate-400" />
            <input aria-label="Search courses" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Power BI, SQL or marketing" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-800 outline-none" />
            <button className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700">Find course</button>
          </form>
        </div>
        <div className="relative min-w-0 pb-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#16356c] bg-[#071938] p-4 shadow-xl shadow-blue-900/10 sm:p-5" data-card-3d="analytics" data-card-density="compact">
            <div className="mb-4 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-xs font-bold text-white"><PlayCircle size={17} className="text-amber-400" />Watch a featured lesson</span><span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-200">Learn with us</span></div>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
              <iframe src={embedUrl} title="Seeyam featured learning video" className="h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-300">Get a feel for the learning experience, then talk to our team about your program.</p>
          </div>
          <div className="mx-1 mt-4 flex flex-wrap items-center gap-2 sm:mx-3"><span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Tools you can learn</span>{['Power BI','SQL','Python','GA4','Meta Ads'].map(tool => <span key={tool} className="rounded-lg border border-blue-100 bg-white px-2.5 py-1.5 text-[10px] font-bold text-blue-700">{tool}</span>)}</div>
          <div className="relative mx-1 mt-4 grid grid-cols-2 gap-3 sm:mx-3">
            <Link href="/courses?search=data" className="flex min-w-0 flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1" data-card-3d="analytics" data-card-density="compact"><span className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><BarChart3 size={21} /></span><span className="text-xs font-bold text-slate-900">Data analytics<span className="mt-1 block text-[10px] font-medium text-slate-500">Find the story in data</span></span></Link>
            <Link href="/courses?search=marketing" className="flex min-w-0 flex-col items-start gap-2 rounded-2xl border border-slate-100 bg-white p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1" data-card-3d="analytics" data-card-density="compact"><span className="rounded-xl bg-violet-50 p-2.5 text-violet-600"><Megaphone size={21} /></span><span className="text-xs font-bold text-slate-900">Digital marketing<span className="mt-1 block text-[10px] font-medium text-slate-500">Turn ideas into growth</span></span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
