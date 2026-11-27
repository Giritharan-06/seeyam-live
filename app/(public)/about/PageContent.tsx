"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, GraduationCap, Laptop, ShieldCheck } from "lucide-react";
import { usePlatformData } from "@/components/PlatformDataContext";
import CounterNumber from "@/components/CounterNumber";
import FeaturedLesson from "@/components/FeaturedLesson";
import ChennaiCourseLinks from "@/components/ChennaiCourseLinks";
import { existingTrainers } from "@/lib/cms/public";
import { aboutCopy } from "@/lib/about-copy";
import { lines } from "@/lib/cms/fields";

export default function AboutPage() {
  const { siteSettings, cms } = usePlatformData();
  const about = cms?.find(item => item.kind === "about" && item.id === "page")?.values;
  const trainers = existingTrainers(siteSettings?.about_trainers_json);
  const values = lines(about?.values);
  const reasons = values.length ? values.map(value => value.replace("|", " ").trim()) : aboutCopy.reasons;

  return (
    <>
      <section className="public-banner public-banner--with-photo py-14 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="mb-3 text-sm font-bold text-[#ffb17a]">About SEEYAM Technologies</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{siteSettings?.about_hero_title || aboutCopy.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-200">{siteSettings?.about_hero_subtitle || aboutCopy.introduction}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/courses" className="premiere-primary">Explore courses <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/branches" className="premiere-outline">Visit our Chennai campus</Link>
          </div>
        </div>
        <img className="public-banner-photo" src={about?.image || "/images/redesign/about-hero.webp"} alt="" fetchPriority="high" />
      </section>
      <div className="premiere-container grid gap-5 py-12 md:grid-cols-2">
        <section className="rounded-3xl border border-neutral-200 p-6 sm:p-8">
          <h2 className="premiere-section-title">Our mission</h2>
          <p className="mt-4 text-sm leading-7 text-neutral-700">{siteSettings?.about_mission_text || aboutCopy.mission}</p>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-neutral-700">
            {aboutCopy.objectives.map(item => <li key={item} className="flex items-start gap-2.5"><CheckCircle2 size={17} aria-hidden="true" className="mt-1 shrink-0 text-[#9c3700]" />{item}</li>)}
          </ul>
        </section>
        <section className="rounded-3xl bg-[#fff2e8] p-6 sm:p-8">
          <h2 className="premiere-section-title">Why choose SEEYAM?</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-neutral-800">
            {reasons.map(item => <li key={item} className="flex items-start gap-2.5"><ShieldCheck size={17} aria-hidden="true" className="mt-1 shrink-0 text-[#9c3700]" />{item}</li>)}
          </ul>
        </section>
      </div>
      <section aria-labelledby="about-courses" className="premiere-container pb-12">
        <h2 id="about-courses" className="premiere-section-title">Our courses</h2>
        <p className="mb-5 mt-3 max-w-prose text-sm leading-7 text-neutral-700">Explore Data Analytics and Digital Marketing in our course catalog. Ask admissions about availability for Data Engineering, Oracle, Snowflake, Azure, Generative AI and Full Stack Development.</p>
        <ChennaiCourseLinks />
      </section>
      <FeaturedLesson />
      <div className="premiere-container grid gap-5 py-12 md:grid-cols-2">
        <section className="rounded-3xl border border-neutral-200 p-6 sm:p-8">
          <Laptop size={24} aria-hidden="true" className="mb-4 text-[#9c3700]" />
          <h2 className="text-xl font-extrabold">Our training methodology</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-700">Build your skills through practical sessions, assignments, real-world projects and assessments that show where you’re ready to progress.</p>
        </section>
        <section className="rounded-3xl border border-neutral-200 p-6 sm:p-8">
          <BriefcaseBusiness size={24} aria-hidden="true" className="mb-4 text-[#9c3700]" />
          <h2 className="text-xl font-extrabold">Placement assistance</h2>
          <p className="mt-3 text-sm leading-7 text-neutral-700">Get help with resume building, interview preparation and career planning.</p>
          <Link href="/placements" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#913400] hover:underline">Explore placement support <ArrowRight size={15} aria-hidden="true" /></Link>
        </section>
      </div>
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Masterclass Mentors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071938]">
            Our trainers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Learn from trainers who bring industry experience and technical expertise to the classroom.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between text-center" data-card-3d="analytics" data-card-density="compact"
            >
              <div>
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="w-24 h-24 rounded-2xl mx-auto object-cover shadow-md mb-4 border border-slate-100"
                />
                <h4 className="font-extrabold text-sm text-[#071938]">{trainer.name}</h4>
                <div className="text-xs text-blue-700 font-bold mt-0.5">{trainer.role}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">
                  <CounterNumber value={trainer.experience} duration={1500} />
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed text-left">
                  {trainer.bio}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 justify-center mt-4 pt-3 border-t border-slate-100">
                {trainer.tags && trainer.tags.map((tag: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="premiere-career">
        <div className="premiere-container flex flex-wrap items-center justify-between gap-6 py-10">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Our commitment</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-200">{siteSettings?.about_vision_text || aboutCopy.commitment}</p>
          </div>
          <Link href="/contact" className="premiere-primary">Talk to admissions <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
