"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Sparkles,
  ArrowRight,
  Award,
  Users,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  CheckCircle,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { usePlatformData } from "@/components/PlatformDataContext";

export default function OurStudentsPlacedAt() {
  const platformData = usePlatformData();
  const siteSettings = platformData?.siteSettings || {};
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);

  // Group 1: Global Cloud, Product & Tech Giants (Track 1)
  const track1Companies = [
    {
      name: "Apple",
      tier: "18-24 LPA",
      role: "Analytics Engineer",
      logo: (
        <svg viewBox="0 0 170 170" className="h-6 w-auto" fill="#000000">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.73-7.99-12.12-14.73-6.42-9.84-11.45-21.2-15.09-34.08-3.64-12.88-5.46-24.89-5.46-36.03 0-14.17 3.52-25.99 10.56-35.47 7.04-9.48 16.03-14.31 26.97-14.49 5.23 0 10.74 1.34 16.54 4.01 5.8 2.68 9.68 4.07 11.65 4.19 1.76-.24 5.76-1.74 12-4.49 6.24-2.76 11.75-4.04 16.54-3.86 11.09.43 20.31 4.7 27.67 12.8-9.83 5.99-14.65 14.34-14.46 25.07.21 8.5 3.48 15.7 9.8 21.6 6.33 5.9 13.88 9.27 22.66 10.11-2.48 7.37-5.49 14.54-9.03 21.52zM119.22 31.84c0-7.39 2.67-14.31 8.01-20.76 5.34-6.45 11.96-10.47 19.86-12.08.13 1.08.2 2.08.2 3.01 0 7.38-2.82 14.53-8.46 21.46-5.64 6.93-12.56 10.9-20.76 11.9-.22-1.04-.33-2.22-.33-3.53z" />
        </svg>
      ),
    },
    {
      name: "Microsoft",
      tier: "16-22 LPA",
      role: "Power BI Architect",
      logo: (
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="1" width="8" height="8" fill="#F25022" />
            <rect x="11" y="1" width="8" height="8" fill="#7FBA00" />
            <rect x="1" y="11" width="8" height="8" fill="#00A4EF" />
            <rect x="11" y="11" width="8" height="8" fill="#FFB900" />
          </svg>
          <span className="text-xs font-black tracking-tight">Microsoft</span>
        </div>
      ),
    },
    {
      name: "Amazon",
      tier: "15-20 LPA",
      role: "Business Intelligence Eng.",
      logo: (
        <svg className="h-6 w-auto" viewBox="0 0 100 30" fill="none">
          <text x="0" y="20" fill="#131921" fontSize="18" fontWeight="800" fontFamily="sans-serif">amazon</text>
          <path d="M12 24C28 30 52 28 65 20" stroke="#FF9900" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M62 17L66 20L63 24" fill="#FF9900" />
        </svg>
      ),
    },
    {
      name: "Meta",
      tier: "18-24 LPA",
      role: "Growth Analyst",
      logo: (
        <div className="flex items-center gap-1.5 font-bold text-[#1877F2]">
          <div className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-black text-sm">
            f
          </div>
          <span className="text-xs font-black tracking-tight">Meta</span>
        </div>
      ),
    },
    {
      name: "IBM",
      tier: "12-16 LPA",
      role: "Data Scientist",
      logo: (
        <svg viewBox="0 0 100 40" className="h-6 w-auto" fill="#006699">
          {/* IBM Classic 8-bar Style */}
          <rect x="5" y="4" width="90" height="2.5" />
          <rect x="5" y="8.5" width="90" height="2.5" />
          <rect x="5" y="13" width="90" height="2.5" />
          <rect x="5" y="17.5" width="90" height="2.5" />
          <rect x="5" y="22" width="90" height="2.5" />
          <rect x="5" y="26.5" width="90" height="2.5" />
          <rect x="5" y="31" width="90" height="2.5" />
          <rect x="5" y="35.5" width="90" height="2.5" />
          <text x="50" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" letterSpacing="4" fontFamily="Arial, sans-serif">IBM</text>
        </svg>
      ),
    },
    {
      name: "Google",
      tier: "20-25 LPA",
      role: "Marketing Analyst",
      logo: (
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span className="text-xs font-black tracking-tight">Google</span>
        </div>
      ),
    },
    {
      name: "Capgemini",
      tier: "8-12 LPA",
      role: "SQL / BI Consultant",
      logo: (
        <div className="flex items-center gap-1.5 text-[#0070AD] font-bold">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#0070AD">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm1-12c2.76 0 5 2.24 5 5 0 2.05-1.23 3.81-3 4.58V14h-2v-1.5c0-.83.67-1.5 1.5-1.5 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3H9c0-2.76 2.24-5 5-5z" />
          </svg>
          <span className="text-xs font-black italic tracking-tight">Capgemini</span>
        </div>
      ),
    },
    {
      name: "Deloitte",
      tier: "10-15 LPA",
      role: "Analytics Consultant",
      logo: (
        <div className="flex items-center gap-0.5 text-xs font-black text-slate-900 tracking-tight">
          <span>Deloitte</span>
          <span className="w-2 h-2 rounded-full bg-[#86BC25]" />
        </div>
      ),
    },
    {
      name: "Accenture",
      tier: "9-14 LPA",
      role: "Data Engineering Associate",
      logo: (
        <div className="flex items-center gap-1 text-xs font-black text-[#A100FF] tracking-tight">
          <span>accenture</span>
          <span className="text-sm font-black">&gt;</span>
        </div>
      ),
    },
  ];

  // Group 2: Enterprise IT Leaders, Consulting & High-Growth Unicorns (Track 2)
  const track2Companies = [
    {
      name: "Cognizant",
      tier: "8-12 LPA",
      role: "Data Analyst",
      logo: (
        <div className="flex items-center gap-1.5 text-[#0033A0]">
          <div className="px-2 py-0.5 rounded bg-[#0033A0] text-white text-[10px] font-black tracking-wider">
            Cognizant
          </div>
        </div>
      ),
    },
    {
      name: "TCS",
      tier: "7-11 LPA",
      role: "System Analyst",
      logo: (
        <div className="flex items-center gap-1 text-slate-800">
          <span className="text-sm font-black bg-gradient-to-r from-[#004B87] via-[#D8232A] to-[#FF9E1B] bg-clip-text text-transparent">tcs</span>
          <span className="text-[10px] font-bold text-slate-500">Tata Consultancy</span>
        </div>
      ),
    },
    {
      name: "Infosys",
      tier: "8-12 LPA",
      role: "Power BI Developer",
      logo: (
        <div className="px-2.5 py-0.5 rounded bg-[#007CC3] text-white text-[11px] font-black tracking-wider">
          Infosys
        </div>
      ),
    },
    {
      name: "Wipro",
      tier: "7-10 LPA",
      role: "Data Associate",
      logo: (
        <div className="flex items-center gap-1.5 text-slate-800">
          <div className="w-4 h-4 rounded-full border-2 border-dashed border-[#F39200] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00928F]" />
          </div>
          <span className="text-xs font-black text-[#262262]">wipro</span>
        </div>
      ),
    },
    {
      name: "Zoho",
      tier: "9-14 LPA",
      role: "Product Marketer & Analyst",
      logo: (
        <div className="flex items-center gap-1.5">
          {/* 4 Connected Blocks Logo */}
          <div className="flex items-center gap-0.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#E31B23]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#00A859]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0082C8]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F7A600]" />
          </div>
          <span className="text-xs font-black text-slate-900 tracking-wider">ZOHO</span>
        </div>
      ),
    },
    {
      name: "HCL",
      tier: "8-11 LPA",
      role: "BI Specialist",
      logo: (
        <div className="text-xs font-black text-[#00519E] tracking-wider italic">
          HCLTech
        </div>
      ),
    },
    {
      name: "Tech Mahindra",
      tier: "7-11 LPA",
      role: "Analytics Engineer",
      logo: (
        <div className="flex items-center gap-1 text-[#E31837]">
          <span className="w-2 h-3.5 rounded-xs bg-[#E31837]" />
          <span className="text-[11px] font-black tracking-tight">Tech Mahindra</span>
        </div>
      ),
    },
    {
      name: "L&T Infotech",
      tier: "8-13 LPA",
      role: "Data Pipeline Developer",
      logo: (
        <div className="flex items-center gap-1 text-[#004B87]">
          <div className="w-4 h-4 rounded-full border-2 border-[#004B87] flex items-center justify-center font-black text-[8px]">
            LT
          </div>
          <span className="text-[10px] font-extrabold text-slate-800">L&T Infotech</span>
        </div>
      ),
    },
    {
      name: "Redington",
      tier: "7-10 LPA",
      role: "Supply Chain Analyst",
      logo: (
        <div className="flex items-center gap-1 text-[#008A44]">
          <span className="text-xs font-black">⚡ Redington</span>
        </div>
      ),
    },
    {
      name: "Adrenalin",
      tier: "7-11 LPA",
      role: "HR Analytics Specialist",
      logo: (
        <div className="text-xs font-black text-slate-900 tracking-wider">
          adrenalin
        </div>
      ),
    },
  ];

  // Repeat items for infinite seamless scroll
  const fullTrack1 = [...track1Companies, ...track1Companies, ...track1Companies];
  const fullTrack2 = [...track2Companies, ...track2Companies, ...track2Companies];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white via-[#F8FAFD] to-[#F1F5F9] border-y border-slate-200/80 relative overflow-hidden select-none">
      
      {/* Background Subtle Mesh & Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>{siteSettings?.hiring_network_title || "OUR STUDENTS PLACED AT"}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#071938] tracking-tight leading-tight mb-4">
              Hired by 350+ Global Tech Giants & Leading Enterprises
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              From Fortune 500 tech leaders and Big 4 consultancies to rapid-growth unicorns, Seeyam alumni drive strategic analytics, automation, and digital growth.
            </p>
          </div>
        </ScrollReveal>

        {/* Dual-Track Velocity Marquee Showcase */}
        <div className="relative space-y-4 my-8">
          {/* Side Fading Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* TRACK 1: Moving Left (Global Tech & Big 4) */}
          <div className="animate-marquee flex items-center gap-3.5 py-1">
            {fullTrack1.map((item, idx) => (
              <div
                key={`track1-${item.name}-${idx}`}
                onMouseEnter={() => setHoveredCompany(item.name)}
                onMouseLeave={() => setHoveredCompany(null)}
                className="group relative inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:scale-105 transition-all duration-300 shrink-0 cursor-default"
              >
                <div className="flex items-center justify-center min-w-[32px]">
                  {item.logo}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.role}
                  </span>
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <span>{item.name}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {item.tier}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* TRACK 2: Moving Right (Enterprise IT & High-Growth Leaders) */}
          <div className="animate-marquee-reverse flex items-center gap-3.5 py-1">
            {fullTrack2.map((item, idx) => (
              <div
                key={`track2-${item.name}-${idx}`}
                onMouseEnter={() => setHoveredCompany(item.name)}
                onMouseLeave={() => setHoveredCompany(null)}
                className="group relative inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:scale-105 transition-all duration-300 shrink-0 cursor-default"
              >
                <div className="flex items-center justify-center min-w-[32px]">
                  {item.logo}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.role}
                  </span>
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <span>{item.name}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {item.tier}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Placement Value Bar with Key Highlights */}
        <ScrollReveal direction="up" delay={120}>
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6" data-card-3d="analytics" data-card-density="compact">
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto text-center divide-x divide-slate-100">
              <div className="space-y-0.5">
                <div className="text-2xl sm:text-3xl font-black text-[#071938]">350+</div>
                <div className="text-xs font-semibold text-slate-500">Recruiter Network</div>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">8.4 LPA</div>
                <div className="text-xs font-semibold text-slate-500">Average Starting CTC</div>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-amber-600">24 LPA</div>
                <div className="text-xs font-semibold text-slate-500">Highest Package</div>
              </div>
              <div className="space-y-0.5 pl-4 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-blue-600">100%</div>
                <div className="text-xs font-semibold text-slate-500">Placement Assistance</div>
              </div>
            </div>

            <Link
              href="/placements"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 hover:shadow-lg hover:scale-102 active:scale-98 transition-all shrink-0 group"
            >
              <span>Explore Verified Alumni Placements</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
