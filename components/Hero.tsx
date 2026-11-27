"use client";

import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { usePlatformData } from "./PlatformDataContext";
import { useLeadModal } from "./LeadModalContext";

export default function Hero() {
  const { cms } = usePlatformData();
  const { openLeadModal } = useLeadModal();
  const home = cms?.find(item => item.kind === "home")?.values;
  const demoLabel = home?.cta || "Book a Free Demo";
  const tagline = home?.intro && home.intro !== "Build your career in" ? home.intro : "Practical training. Career support.";
  const analytics = home?.analytics || "Data Analytics";
  const marketing = (home?.marketing || "Digital Marketing").replace(/[.!?]+$/, "");
  const description = home?.description || `Build skills in ${analytics} with Power BI, SQL and Python, or explore ${marketing} with SEO and paid ads. Learn through projects with guidance from mentors.`;
  return (
    <section className="hero-section premiere-hero">
      <img src={home?.image || "/images/redesign/charcoal-hero.webp"} alt="" width={1440} height={960} fetchPriority="high" className="premiere-hero-image" />
      {home?.background && <img src={home.background} alt="" className="premiere-hero-texture" />}
      <div className="premiere-container premiere-hero-content">
        <div className="premiere-hero-copy">
          <h1 className="text-[clamp(2.05rem,4.25vw,3.85rem)] font-black leading-[1.04] tracking-tight">
            {home?.headline || "Software Training"}
            <span className="mt-1 block font-serif font-medium italic tracking-normal text-[#ff994f]">
              {home?.headlineAccent || "Institute in Chennai"}
            </span>
          </h1>
          <p className="mt-5 text-base font-bold sm:text-xl">{tagline}</p>
          <p className="mt-2 max-w-[31rem] text-sm leading-relaxed sm:text-base">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="premiere-primary" href={home?.secondaryUrl || "/courses"}>{home?.secondary || "Explore Courses"} <ArrowRight size={17} aria-hidden="true" /></Link>
            {home?.href ? (
              <a className="premiere-outline" href={home.href}><CalendarCheck size={17} aria-hidden="true" /> {demoLabel}</a>
            ) : (
              <button type="button" className="premiere-outline" onClick={() => openLeadModal()}><CalendarCheck size={17} aria-hidden="true" /> {demoLabel}</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
