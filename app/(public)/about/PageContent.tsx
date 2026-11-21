"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Users,
  Building2,
  CheckCircle2,
  Sparkles,
  Target,
  Compass,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Star,
  BookOpen,
  Code2,
  Laptop,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { usePlatformData } from "@/components/PlatformDataContext";
import CounterNumber from "@/components/CounterNumber";

const DEFAULT_TRAINERS = [
  {
    name: "Dr. Ananya Sundaram",
    role: "Chief Technical Advisor & AI/ML Lead",
    experience: "16+ Years Experience",
    bio: "Ex-Amazon Senior ML Scientist. Specializes in Deep Learning, PyTorch, and Generative AI pipelines.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
    tags: ["Data Science", "Python", "GenAI"],
  },
  {
    name: "Rajesh Varma",
    role: "Director of Cloud & DevOps Architecture",
    experience: "14+ Years Experience",
    bio: "Certified AWS Solutions Architect Professional & CKA. Built high-scale cloud infrastructure for fintech startups.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    tags: ["AWS", "Kubernetes", "DevOps"],
  },
  {
    name: "Karthik Subramanian",
    role: "Principal Java & Microservices Mentor",
    experience: "12+ Years Experience",
    bio: "Ex-Oracle Senior Tech Lead. Mentored 8,000+ students in Core Java, Spring Boot microservices, and Kafka.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    tags: ["Java Full Stack", "Spring Boot", "Microservices"],
  },
  {
    name: "Pooja Deshmukh",
    role: "Lead QA Automation & SDET Architect",
    experience: "11+ Years Experience",
    bio: "Deloitte Digital QA Lead alumni. Expert in Selenium, Playwright, Cypress, and Test Automation Frameworks.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80",
    tags: ["Selenium", "Playwright", "API Testing"],
  },
];

const DEFAULT_MILESTONES = [
  {
    year: "2014",
    title: "Inception in Chennai",
    desc: "Started with a single classroom in Navalur OMR focusing on Java and Software Testing.",
  },
  {
    year: "2017",
    title: "10,000 Graduates Placed",
    desc: "Expanded to Vadapalani & Tambaram; partnered with 80+ IT service and product companies.",
  },
  {
    year: "2020",
    title: "Bangalore & Hyderabad Expansion",
    desc: "Launched state-of-the-art tech labs in Marathahalli (Bangalore) and HITEC City (Hyderabad).",
  },
  {
    year: "2023",
    title: "AI & GenAI Center of Excellence",
    desc: "Introduced high-compute GPU labs for Data Science, NLP, and Cloud DevOps masterclasses.",
  },
  {
    year: "2026",
    title: "50,000+ Alumni Network",
    desc: "Recognized as South India's top IT training institute with 200+ active hiring partners.",
  },
];

const DEFAULT_PILLARS = [
  {
    title: "100% Placement Assurance",
    desc: "Dedicated corporate placement cell organizing daily interview drives, technical mocks, and resume reviews with 200+ hiring partners.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Corporate Architect Trainers",
    desc: "Learn exclusively from senior software architects and technical leads having 10+ to 16+ years of production experience in Tier-1 IT companies.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Live Production Projects",
    desc: "Work on enterprise-scale capstone projects: E-commerce microservices, AI recommendation systems, automated testing pipelines, and AWS architectures.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "High-Compute Cloud & GPU Labs",
    desc: "24x7 lab access with live SAP S/4HANA servers, AWS sandbox environments, and GPU-enabled deep learning workstations.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Lifetime LMS & Course Recordings",
    desc: "Revisit class recordings, coding exercises, interview question banks, and updated course materials anytime via our student portal.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "ISO & NASSCOM Certified",
    desc: "Receive globally verifiable certifications aligned with national occupational standards and recognized across top global MNCs.",
    color: "bg-blue-50 text-blue-600",
  },
];

export default function AboutPage() {
  const { branches, siteSettings } = usePlatformData();

  // Dynamic parse helpers
  let trainers = DEFAULT_TRAINERS;
  if (siteSettings?.about_trainers_json) {
    try {
      const parsed = JSON.parse(siteSettings.about_trainers_json);
      if (Array.isArray(parsed) && parsed.length > 0) trainers = parsed;
    } catch (e) {}
  }

  let milestones = DEFAULT_MILESTONES;
  if (siteSettings?.about_milestones_json) {
    try {
      const parsed = JSON.parse(siteSettings.about_milestones_json);
      if (Array.isArray(parsed) && parsed.length > 0) milestones = parsed;
    } catch (e) {}
  }

  let pillars = DEFAULT_PILLARS;
  if (siteSettings?.about_pillars_json) {
    try {
      const parsed = JSON.parse(siteSettings.about_pillars_json);
      if (Array.isArray(parsed) && parsed.length > 0) pillars = parsed;
    } catch (e) {}
  }

  return (
    <div className="bg-[#F8FAFD] min-h-screen">
      {/* Hero Header (Dynamic from WordPress settings) */}
      <section className="bg-[#071938] text-white py-20 relative overflow-hidden border-b border-[#0f2956]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{siteSettings?.about_hero_badge || "Empowering Tech Careers Since 2014"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {siteSettings?.about_hero_title || "Bridging the Gap Between Academics & Tech Industry Excellence"}
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {siteSettings?.about_hero_subtitle ||
                "Seeyam Technologies was built on one fundamental promise: deliver hands-on, production-grade IT training mentored by senior corporate architects, paired with guaranteed placement drives."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/courses"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/30 transition-all hover:scale-105 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explore Certification Courses</span>
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl bg-[#0e2a5c] hover:bg-[#163d7e] text-slate-200 font-bold text-xs border border-[#1d4282] transition-all"
              >
                <span>Visit Campus Nearest You</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar with Live Count-Up */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100" data-card-3d="analytics" data-card-density="compact">
          <div className="space-y-1">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 mb-1">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#071938]">
              <CounterNumber value="50,000+" duration={2000} />
            </div>
            <div className="text-xs font-bold text-slate-500">Graduates & Alumni</div>
          </div>

          <div className="space-y-1 pt-4 sm:pt-0">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 mb-1">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#071938]">
              <CounterNumber value="200+" duration={2000} />
            </div>
            <div className="text-xs font-bold text-slate-500">Hiring Partner Network</div>
          </div>

          <div className="space-y-1 pt-4 sm:pt-0">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 mb-1">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600">
              <CounterNumber value="100%" duration={2000} />
            </div>
            <div className="text-xs font-bold text-slate-500">Placement Assurance</div>
          </div>

          <div className="space-y-1 pt-4 sm:pt-0">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 mb-1">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              <CounterNumber value="15+" duration={2000} />
            </div>
            <div className="text-xs font-bold text-slate-500">Years of Excellence</div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards (Dynamic from WordPress settings) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-3" data-card-3d="analytics" data-card-density="regular">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#071938]">
              {siteSettings?.about_mission_title || "Our Core Mission"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {siteSettings?.about_mission_text ||
                "To transform aspiring engineers, non-IT graduates, and upskilling professionals into job-ready software developers, DevOps practitioners, and AI engineers through real-time industry projects, rigorous code reviews, and guaranteed placement drives."}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-3" data-card-3d="analytics" data-card-density="regular">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#071938]">
              {siteSettings?.about_vision_title || "Our Long-term Vision"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {siteSettings?.about_vision_text ||
                "To be India's premier center of excellence for emerging technologies — providing accessible, enterprise-grade education with high-compute lab infrastructure, industry-recognized global certifications, and lifelong career growth networks."}
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Seeyam (Advantage Pillars from WordPress Settings) */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>The Seeyam Advantage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071938]">
              Why 50,000+ Students Trust Seeyam Technologies
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F8FAFD] border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2.5" data-card-3d="analytics" data-card-density="compact"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color || "bg-blue-50 text-blue-600"} flex items-center justify-center font-bold`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#071938]">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Faculty Showcase (Trainers from WordPress Settings) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Masterclass Mentors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071938]">
            Meet Our Senior Faculty & Architects
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Industry veterans who bring real production architecture and hiring manager insights into every lecture.
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

      {/* Growth Timeline (Milestones from WordPress Settings) */}
      <section className="py-16 bg-[#071938] text-white border-y border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Our Journey of Academic Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From a single classroom in Chennai to <CounterNumber value={branches.length || 5} duration={1200} /> modern campuses across major IT hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#0b224d] border border-[#16356c] rounded-2xl p-5 relative space-y-2 hover:border-blue-400/50 transition-colors" data-card-3d="analytics" data-card-density="compact"
              >
                <div className="text-2xl font-black text-amber-400">
                  <CounterNumber value={m.year} duration={1500} formatWithCommas={false} />
                </div>
                <h4 className="font-bold text-sm text-white">{m.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Highlights Grid (Dynamic from WordPress Campuses CPT) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071938]">
              Our {branches.length} Training Campuses
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Fully air-conditioned classrooms with high-speed fiber internet and dedicated demo rooms.
            </p>
          </div>
          <Link
            href="/branches"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Campus Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <Link
              key={branch.id}
              href={`/branches/${branch.slug}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2 group" data-card-3d="learning" data-card-density="compact"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#071938] group-hover:text-blue-600 transition-colors">
                  {branch.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  {branch.city}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{branch.address}</p>
              <div className="text-[11px] text-blue-700 font-semibold pt-1">
                Landmark: {branch.landmark}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {siteSettings?.cta_title || "Take the First Step Toward Your Dream Tech Job"}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            {siteSettings?.cta_subtitle ||
              "Talk to our academic counselors today. Get free personalized career roadmaps, syllabus PDFs, and demo class schedules."}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-xl hover:scale-105 transition-transform"
            >
              {siteSettings?.cta_btn2_text || "Book Free 1-on-1 Counseling"}
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-xl transition-all hover:scale-105"
            >
              {siteSettings?.cta_btn1_text || "Explore Course Catalog"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
