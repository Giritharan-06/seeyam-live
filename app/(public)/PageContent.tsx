"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Building2, GraduationCap, Laptop, MapPin, Search, Sparkles, Phone } from "lucide-react";
import Hero from "@/components/Hero";
import StudentCareerScroll from "@/components/StudentCareerScroll";
import OurStudentsPlacedAtPoster from "@/components/OurStudentsPlacedAtPoster";
import HomeCourseCard from "@/components/HomeCourseCard";
import HomeCommunitySections from "@/components/HomeCommunitySections";
import { usePlatformData } from "@/components/PlatformDataContext";
import { useLeadModal } from "@/components/LeadModalContext";
import { decodeHtml } from "@/lib/utils";

function getCampusMapUrl(savedUrl: string, encodedAddress: string): string {
  try {
    const url = new URL(savedUrl);
    const isPlaceholder = decodeURIComponent(url.href).includes('!1s0x0:0x0');
    if (!isPlaceholder && url.protocol === 'https:' && (url.hostname === 'www.google.com' || url.hostname === 'maps.google.com') && (url.pathname.startsWith('/maps/embed') || url.searchParams.get('output') === 'embed')) return url.href;
  } catch { /* Use the branch address when no map embed has been configured. */ }
  return `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;
}

export default function HomePage() {
  const { courses, categories, branches, loading, siteSettings } = usePlatformData();
  const { openLeadModal } = useLeadModal();
  const [search, setSearch] = useState("");
  const [track, setTrack] = useState("all");
  const filtered = courses.filter(course => {
    const text = `${course.title} ${course.summary}`.toLowerCase();
    return (!search || text.includes(search.toLowerCase())) && (track === "all" || (track === "marketing" ? text.includes("marketing") : !text.includes("marketing")));
  });
  const featured = [...courses.filter(course => course.isFeatured), ...courses.filter(course => !course.isFeatured)];
  // Keep both core career paths represented on the homepage.
  const marketing = courses.find(course => course.slug.includes("marketing"));
  const selected = featured.slice(0,6);
  if (marketing && !selected.some(course => course.id === marketing.id)) selected[selected.length - 1] = marketing;
  const displayed = search || track !== "all" ? filtered : selected;
  const supportPhone = siteSettings?.footer_phone || branches[0]?.phone;

  return <>
    <Hero onSelectCategory={() => undefined} onSearchCourse={setSearch} onOpenLeadModal={openLeadModal} />

    <section aria-label="Learning at Seeyam" className="border-y border-slate-200 bg-white py-6 sm:py-7">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {[{icon:BookOpen,title:`${courses.length} focused programs`,text:'Analytics, BI & digital growth'},{icon:Building2,title:`${branches.length} training campuses`,text:'Explore classroom locations'},{icon:Laptop,title:'Classroom & online',text:'Find your preferred learning mode'},{icon:GraduationCap,title:'Career preparation',text:'Projects, portfolios & interviews'}].map(item => <div key={item.title} className="flex items-center gap-3"><span className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-blue-600"><item.icon size={22} /></span><div><p className="text-sm font-extrabold text-[#071938]">{item.title}</p><p className="mt-1 text-[11px] leading-4 text-slate-500">{item.text}</p></div></div>)}
      </div>
    </section>

    <section id="courses" className="scroll-mt-24 bg-[#F8FAFD] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"><Sparkles size={14} className="text-amber-500" />Industry-focused learning</span><h2 className="text-2xl font-extrabold tracking-tight text-[#071938] sm:text-3xl">Explore our analytics & marketing programs</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Compare the tools, projects and learning options. Find the program that fits your next step.</p></div>
          <Link href="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600">View all {courses.length} programs <ArrowRight size={16} /></Link>
        </div>
        <div className="my-6 flex flex-wrap items-center gap-2">{[["all", "Featured programs"], ["data", "Data & business analytics"], ["marketing", "Digital marketing"]].map(([value, label]) => <button key={value} onClick={() => { setTrack(value); setSearch(""); }} aria-pressed={track === value} className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${track === value ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>{label}</button>)}{search && <button onClick={() => setSearch("")} className="rounded-xl bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">“{search}” · Clear ×</button>}</div>
        <div aria-busy={loading} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{displayed.map(course => <HomeCourseCard key={course.id} course={course} category={categories.find(category => category.id === course.categoryId)?.name || 'Professional certification'} />)}</div>
        {!displayed.length && <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center" data-card-3d="analytics" data-card-density="compact"><Search className="mx-auto mb-3 text-slate-400" /><p className="text-sm text-slate-600">No programs match this search.</p><button onClick={() => { setSearch(""); setTrack('all'); }} className="mt-3 text-sm font-bold text-blue-600">Show featured programs</button></div>}
      </div>
    </section>

    <div className="border-t border-slate-200 bg-white px-4 py-8 text-center sm:py-10"><span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"><Laptop size={14} />A glimpse of the work</span><h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#071938] sm:text-3xl">See analytics and marketing come to life</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">Follow two practical examples, from the first question to a useful result.</p></div>
    <StudentCareerScroll variant="analytics" />
    <StudentCareerScroll variant="marketing" />

    <OurStudentsPlacedAtPoster />
    <HomeCommunitySections />

    <section id="campuses" className="border-y border-slate-200 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"><Building2 size={14} />Learn closer to home</span><h2 className="text-2xl font-extrabold tracking-tight text-[#071938] sm:text-3xl">Find your nearest training campus</h2><p className="mt-3 text-sm text-slate-600">Explore the locations, get directions and plan a visit to meet our team.</p></div>
          <Link href="/branches" className="inline-flex items-center gap-2 text-xs font-bold text-blue-600">Explore all campuses <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map(branch => {
            const name = decodeHtml(branch.name);
            const location = [branch.address, branch.city].filter(Boolean).join(', ');
            const mapQuery = encodeURIComponent(location || name);
            const mapUrl = getCampusMapUrl(branch.mapEmbedUrl, mapQuery);
            return (
              <article key={branch.id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#F8FAFD] transition hover:border-blue-400 hover:shadow-lg">
                <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-6 py-4"><span className="flex items-center gap-2 text-xs font-extrabold text-blue-700"><MapPin size={17} />{branch.city}</span><Building2 size={23} className="text-blue-300" /></div>
                <div className="flex flex-1 flex-col p-6">
                  <Link href={`/branches/${branch.slug}`} className="hover:text-blue-600"><h3 className="text-lg font-extrabold text-[#071938]">{name}</h3></Link>
                  <p className="mt-2 text-xs leading-6 text-slate-600">{branch.address}</p>
                  {branch.landmark && <p className="mt-1 text-[11px] leading-5 text-slate-500">Landmark: {branch.landmark}</p>}
                  <p className="mt-3 text-[11px] text-slate-500">{branch.timing}</p>
                  <div className="mt-5 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50">
                    <iframe src={mapUrl} title={`${name}, ${branch.city} campus location`} className="h-44 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <Link href={`/branches/${branch.slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600">Campus details <ArrowRight size={14} /></Link>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${name} in ${branch.city} (opens in a new tab)`} className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-white px-3 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50"><MapPin size={14} />Get directions</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>

    <section className="bg-[#F8FAFD] px-4 py-12 sm:px-6 sm:py-16"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl border border-[#16356c] bg-[#071938] p-7 text-white sm:p-10 lg:flex-row lg:items-center" data-card-3d="analytics" data-card-density="compact"><div><span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300"><GraduationCap size={14} className="text-amber-400" />Free career counseling</span><h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Find the program that fits your goals.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Talk through the curriculum, learning options and schedule before you enroll.</p></div><div className="flex flex-wrap gap-3"><button onClick={() => openLeadModal()} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-yellow-700">Book a free demo <ArrowRight size={16} /></button>{supportPhone && <a href={`tel:${supportPhone.replace(/[^0-9+]/g,'')}`} className="inline-flex items-center gap-2 rounded-2xl border border-[#1d4282] bg-[#0e2a5c] px-5 py-3.5 text-xs font-bold text-slate-200"><Phone size={14} className="text-amber-400" />Call our team</a>}</div></div></section>
  </>;
}
