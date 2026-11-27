"use client";

import Link from "next/link";
import { ArrowRight, Building2, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { usePlatformData } from "@/components/PlatformDataContext";
import CampusMap from "@/components/CampusMap";
import { contactDetails, phoneHref, SEEYAM_CAMPUS, whatsappHref } from "@/lib/contact";

export default function BranchesPage() {
  const { branches, siteSettings } = usePlatformData();
  const campus = branches[0] ?? SEEYAM_CAMPUS;
  const office = contactDetails(siteSettings);

  return (
    <div className="bg-white pb-16">
      {/* Header Banner (Eduma Deep Navy) */}
      <section className="public-banner public-banner--with-photo bg-[#071938] text-white py-16 border-b border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Thoraipakkam, Chennai</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Visit our Chennai training campus
            </h1>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Find our Thoraipakkam office, contact the admissions team, and get directions.
            </p>
          </div>
        </div>
        <img className="public-banner-photo" src="/images/card-photos/classroom-laptop.jpg" alt="" fetchPriority="high" />
      </section>

      <section aria-labelledby="campus-location" className="premiere-container grid gap-6 py-10 lg:grid-cols-[1fr_1.35fr]">
        <div className="rounded-3xl border border-neutral-200 p-6 sm:p-8">
          <h2 id="campus-location" className="text-2xl font-extrabold text-neutral-950">Thoraipakkam campus</h2>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-neutral-800">
            <a href={office.maps} className="flex items-start gap-3 rounded-sm font-bold leading-relaxed hover:underline">
              <MapPin size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-[#9c3700]" />
              <span>{office.displayAddress}</span>
            </a>
            <a className="flex items-center gap-3 hover:underline" href={phoneHref(office.phone)}>
              <Phone size={17} aria-hidden="true" className="text-[#9c3700]" /> {office.phone}
            </a>
            <a className="flex items-center gap-3 hover:underline" href={whatsappHref(office.whatsapp)} target="_blank" rel="noopener noreferrer">
              <MessageSquare size={17} aria-hidden="true" className="text-[#9c3700]" /> WhatsApp {office.whatsapp}
            </a>
            <a className="flex items-center gap-3 break-all hover:underline" href={`mailto:${office.email}`}>
              <Mail size={17} aria-hidden="true" className="text-[#9c3700]" /> {office.email}
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href={office.maps} className="premiere-primary">Get directions <ArrowRight size={16} aria-hidden="true" /></a>
            <Link href={`/branches/${campus.slug}`} className="text-sm font-bold text-[#9c3700] hover:underline">Campus details</Link>
          </div>
        </div>
        <CampusMap src={campus.mapEmbedUrl || SEEYAM_CAMPUS.mapEmbedUrl} title="Map of SEEYAM Thoraipakkam campus" />
      </section>
    </div>
  );
}
