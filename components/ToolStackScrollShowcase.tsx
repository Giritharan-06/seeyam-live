"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  Database,
  TrendingUp,
  Layers,
  Code2,
  Workflow,
  Smartphone,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface ToolStackScrollShowcaseProps {
  onOpenLeadModal?: (courseId?: string) => void;
}

export default function ToolStackScrollShowcase({
  onOpenLeadModal,
}: ToolStackScrollShowcaseProps) {
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const toolsData = [
    {
      id: "sql",
      name: "SQL",
      tagline: "The Core Foundation of Modern Data Analytics",
      role: "Relational Queries, Schema Design & High-Performance Data Extraction",
      description:
        "Master writing complex JOINs, Window Functions, Aggregate Subqueries, CTEs, and Stored Procedures across PostgreSQL, MySQL, and Snowflake.",
      capstoneProject: "E-Commerce Multi-Million Row Customer Lifetime Value ETL Engine",
      salaryBoost: "+35% Higher CTC",
      level: "Core Prerequisite",
      demand: "98% of Analytics Job Openings",
      accent: "#0072CE",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
      skills: ["Window Functions (RANK, DENSE_RANK)", "Complex Multi-Table JOINs & Subqueries", "Aggregations & Group By Analytics", "Database Indexing & Performance Tuning"],
      icon: (
        <svg viewBox="0 0 80 80" className="w-10 h-10 shrink-0 drop-shadow-md" fill="none">
          <path d="M14 28V52C14 62 25 70 40 70C55 70 66 62 66 52V28" fill="url(#sql_card_grad)" />
          <ellipse cx="40" cy="24" rx="26" ry="12" fill="#75C243" stroke="#5EA332" strokeWidth="2" />
          <ellipse cx="40" cy="24" rx="18" ry="7" fill="#90D756" />
          <text x="40" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900">SQL</text>
          <defs>
            <linearGradient id="sql_card_grad" x1="14" y1="28" x2="66" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0088CC" />
              <stop offset="1" stopColor="#004D7A" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      id: "powerbi",
      name: "Power BI",
      tagline: "Enterprise Business Intelligence & KPI Architecture",
      role: "Interactive Dashboards, DAX Formulation & Star-Schema Data Modeling",
      description:
        "Transform raw enterprise data into rich executive dashboards. Create dynamic measures using advanced DAX, set up automated data refresh, and deploy to Power BI Service.",
      capstoneProject: "CXO Executive Revenue & Supply Chain Command Center",
      salaryBoost: "+42% Higher CTC",
      level: "High Market Demand",
      demand: "Microsoft Ecosystem Leader",
      accent: "#D97706",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      skills: ["Complex DAX Measures (CALCULATE, FILTER)", "Star & Snowflake Schema Data Modeling", "Power Query ETL Transformations", "Row-Level Security (RLS) Configuration"],
      icon: (
        <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0 drop-shadow-md" fill="none">
          <rect x="29" y="8" width="11" height="34" rx="2.5" fill="#D97706" />
          <rect x="18" y="18" width="11" height="24" rx="2.5" fill="#F59E0B" />
          <rect x="7" y="27" width="11" height="15" rx="2.5" fill="#FBBF24" />
        </svg>
      ),
    },
    {
      id: "tableau",
      name: "Tableau",
      tagline: "Executive Storytelling & Interactive Visualizations",
      role: "Visual Analytics, Heatmaps, Dual-Axis Charts & Interactive Storyboards",
      description:
        "Craft visual data stories that influence boardroom decisions. Build responsive multi-layered dashboards, calculated parameters, and dynamic spatial heatmaps.",
      capstoneProject: "Global SaaS Churn, Retention & Cohort Behavioral Storyboard",
      salaryBoost: "+38% Higher CTC",
      level: "Visual Storytelling",
      demand: "Fortune 500 Favorite",
      accent: "#E8762D",
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      skills: ["Level of Detail (LOD) Expressions", "Interactive Dual-Axis & Pareto Charts", "Parameter-Driven Dynamic Metrics", "Tableau Server & Cloud Publishing"],
      icon: (
        <svg viewBox="0 0 100 100" className="w-10 h-10 shrink-0 drop-shadow-md" fill="currentColor">
          <rect x="44" y="24" width="12" height="52" rx="1.5" fill="#E8762D" />
          <rect x="24" y="44" width="52" height="12" rx="1.5" fill="#E8762D" />
          <rect x="46" y="2" width="8" height="26" rx="1" fill="#D22E2E" />
          <rect x="37" y="11" width="26" height="8" rx="1" fill="#D22E2E" />
          <rect x="46" y="72" width="8" height="26" rx="1" fill="#1C3D5A" />
          <rect x="37" y="81" width="26" height="8" rx="1" fill="#1C3D5A" />
          <rect x="11" y="37" width="8" height="26" rx="1" fill="#2E6987" />
          <rect x="2" y="46" width="26" height="8" rx="1" fill="#2E6987" />
          <rect x="81" y="37" width="8" height="26" rx="1" fill="#2E6987" />
          <rect x="72" y="46" width="26" height="8" rx="1" fill="#2E6987" />
        </svg>
      ),
    },
    {
      id: "python",
      name: "Python",
      tagline: "Automated Data Wrangling, Pandas & Predictive ML",
      role: "Automated Pipelines, Exploratory Data Analysis & Machine Learning",
      description:
        "Leverage Python's data science stack to clean messy datasets in seconds, generate automated visual plots, and build predictive churn models.",
      capstoneProject: "Automated Predictive Customer Segmentation & Forecast Model",
      salaryBoost: "+45% Higher CTC",
      level: "High-Growth Skill",
      demand: "#1 Programming Language",
      accent: "#387EB8",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      skills: ["Pandas & NumPy Data Cleaning", "Matplotlib & Seaborn Visualizations", "Scikit-Learn Regression & Classification", "Automated Scripting & API Ingestion"],
      icon: (
        <svg viewBox="0 0 110 110" className="w-10 h-10 shrink-0 drop-shadow-md" fill="none">
          <path d="M54.5 4.5C28.2 4.5 29.8 15.9 29.8 15.9L29.9 27.7H55v3.6H19.9s-15.4 1.7-15.4 27.9c0 26.2 13.5 25.4 13.5 25.4h8v-11.3c0-12.9 11-12.5 11-12.5h25.1c10.8 0 10.3-10.2 10.3-10.2V15.4S94.2 4.5 54.5 4.5z" fill="#387EB8" />
          <path d="M55.5 105.5c26.3 0 24.7-11.4 24.7-11.4l-.1-11.8H55v-3.6h35.1s15.4-1.7 15.4-27.9c0-26.2-13.5-25.4-13.5-25.4h-8v11.3c0 12.9-11 12.5-11 12.5H47.9c-10.8 0-10.3 10.2-10.3 10.2v25.2s-1.8 10.9 37.9 10.9z" fill="#FFE052" />
        </svg>
      ),
    },
    {
      id: "fabric",
      name: "Power Automate & Fabric",
      tagline: "End-to-End Workflow Automation & Cloud Pipelines",
      role: "Robotic Process Automation (RPA), Cloud Triggers & Data Flow",
      description:
        "Eliminate repetitive manual reporting. Set up automated email reports, sync SQL databases to Power BI, and trigger automated alerts based on live data anomalies.",
      capstoneProject: "Zero-Touch Automated Daily Sales Report & Slack/Teams Alert Bot",
      salaryBoost: "+30% Productivity",
      level: "Modern Automation",
      demand: "Rapid Industry Adoption",
      accent: "#0078D4",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      skills: ["Cloud & Desktop Flow Automations", "Automated Daily Multi-Channel Reports", "Microsoft Fabric Lakehouse Sync", "Data Driven Webhook Triggers"],
      icon: (
        <svg viewBox="0 0 64 64" className="w-10 h-10 shrink-0 drop-shadow-md" fill="none">
          <path d="M10 20L28 6L46 20L28 34L10 20Z" fill="#0078D4" />
          <path d="M28 34L46 20L58 29.5L40 43.5L28 34Z" fill="#50E6FF" />
          <path d="M28 34L40 43.5L28 53L16 43.5L28 34Z" fill="#005A9E" />
          <path d="M10 20L28 34L16 43.5L6 33.5L10 20Z" fill="#2899F5" />
        </svg>
      ),
    },
    {
      id: "powerapps",
      name: "Power Apps",
      tagline: "Rapid Low-Code Business Applications & Portals",
      role: "Interactive Internal Tools, Mobile Forms & Operational Portals",
      description:
        "Build enterprise web and mobile applications directly on top of your analytics data without writing complex backend code. Connect with SharePoint, Dataverse, and SQL.",
      capstoneProject: "Enterprise Field Operations & Inventory Audit Mobile Application",
      salaryBoost: "+32% Higher CTC",
      level: "Enterprise Low-Code",
      demand: "Corporate Necessity",
      accent: "#9F2B8D",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      skills: ["Canvas & Model-Driven App Development", "Direct Connection to SQL & Dataverse", "Custom Role-Based Form Validations", "Power FX Business Logic Formulas"],
      icon: (
        <svg viewBox="0 0 64 64" className="w-10 h-10 shrink-0 drop-shadow-md" fill="none">
          <path d="M32 6L54 22L32 38L10 22L32 6Z" fill="#742774" />
          <path d="M32 38L54 22L54 42L32 58L32 38Z" fill="#C037A6" />
          <path d="M32 38L10 22L10 42L32 58L32 38Z" fill="#9F2B8D" />
        </svg>
      ),
    },
  ];

  const currentTool = toolsData[activeToolIndex];

  // Track scroll inside container to subtly advance active tool
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (windowHeight - rect.top) / (windowHeight + rect.height)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-20 lg:py-28 bg-[#07172B] text-white border-y border-[#0F2A4A] relative overflow-hidden select-none"
    >
      {/* Background Animated Gradient Mesh */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading with Text Shimmer */}
        <ScrollReveal direction="up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>THE 6 ESSENTIAL TOOLS OF HIGH-PAID ANALYSTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Master The Complete{" "}
              <span className="text-shimmer-active">Modern Analytics</span> Stack
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every major company expects mastery across these 6 foundational pillars. Click or scroll through each tool to explore industry project deliverables and salary impact.
            </p>
          </div>
        </ScrollReveal>

        {/* 6-Tool Navigation Tabs (Scroll & Click Interactive) */}
        <ScrollReveal direction="up" delay={80}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {toolsData.map((tool, idx) => {
              const isActive = activeToolIndex === idx;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveToolIndex(idx)}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col items-center sm:items-start gap-2 group ${
                    isActive
                      ? "bg-gradient-to-b from-white/15 to-white/5 border-blue-400 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] scale-102"
                      : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20"
                  }`}
                >
                  {/* Active Indicator Top Light Bar */}
                  {isActive && (
                    <div
                      className="absolute top-0 left-4 right-4 h-1 rounded-b-full shadow-sm"
                      style={{ backgroundColor: tool.accent }}
                    />
                  )}

                  <div className="flex items-center justify-between w-full">
                    <div className="w-8 h-8 rounded-lg bg-white/90 p-1 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                      #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-black text-white">{tool.name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {tool.level}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Dynamic Detail Card with Scroll-Linked Content */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#091b30] to-[#061426] border border-blue-500/25 p-6 sm:p-10 shadow-2xl relative overflow-hidden card-3d-hover" data-card-3d="analytics" data-card-density="regular">
          {/* Card Internal Radial Glow */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
            style={{ backgroundColor: currentTool.accent }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Col: Tool Details & Skills */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentTool.badgeColor}`}>
                  {currentTool.level}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {currentTool.salaryBoost}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  • {currentTool.demand}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                  <span>{currentTool.name}</span>
                  <span className="text-sm font-medium text-slate-400 hidden sm:inline">— {currentTool.role}</span>
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2">
                  {currentTool.description}
                </p>
              </div>

              {/* Core Skills Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {currentTool.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-200">{skill}</span>
                  </div>
                ))}
              </div>

              {/* Action Row */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenLeadModal ? onOpenLeadModal(`course-${currentTool.id}`) : null}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-102 active:scale-98 transition-all animate-btn-glow"
                >
                  <span>Start Learning {currentTool.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 hover:text-white font-semibold text-xs border border-white/10 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>View Complete Course Syllabus</span>
                </Link>
              </div>
            </div>

            {/* Right Col: Capstone Project Showcase Box */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md relative overflow-hidden space-y-4" data-card-3d="analytics" data-card-density="compact">
                <div className="text-[11px] font-extrabold tracking-wider uppercase text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Real-World Capstone Deliverable</span>
                </div>

                <div className="p-4 rounded-xl bg-[#040f1c]/90 border border-blue-500/20">
                  <div className="text-sm font-bold text-white leading-snug">
                    {currentTool.capstoneProject}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Corporate case study project mapped to direct hiring requirements.
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-lg font-black text-amber-400">100%</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Live Project Execution</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-lg font-black text-emerald-400">1-on-1</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Mentor Review & Code QA</div>
                  </div>
                </div>

                <div className="text-[11px] text-center text-slate-400">
                  ✨ Resume-Ready Portfolio Artifact with Verified Certificate
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
