"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Briefcase,
  Zap,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface DataAnalyticsKickstartProps {
  onOpenLeadModal?: (courseId?: string) => void;
}

interface ToolData {
  id: string;
  name: string;
  tagline: string;
  role: string;
  badge: string;
  salaryBoost: string;
  demand: string;
  accent: string;
  description: string;
  ctaText: string;
  courseId: string;
  highlights: {
    title: string;
    desc: string;
    tag?: string;
  }[];
}

export default function DataAnalyticsKickstart({
  onOpenLeadModal,
}: DataAnalyticsKickstartProps) {
  // null = general overview (4 perks from original reference), or tool id ("powerbi", "sql", etc.)
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  const tools: ToolData[] = [
    {
      id: "powerbi",
      name: "Power BI",
      tagline: "Enterprise Business Intelligence & KPI Architecture",
      role: "Interactive Dashboards, DAX Formulation & Star-Schema Data Modeling",
      badge: "High Market Demand",
      salaryBoost: "+42% Higher CTC",
      demand: "Microsoft Ecosystem Leader",
      accent: "#F2C811",
      description:
        "Transform raw enterprise data into rich executive dashboards. Create dynamic measures using advanced DAX, set up automated data refresh, and deploy to Power BI Service.",
      ctaText: "Start Learning Power BI",
      courseId: "powerbi-tableau",
      highlights: [
        {
          title: "DAX Measures & Formulas",
          desc: "Calculate complex revenue, margins, and time-intelligence metrics.",
          tag: "Core Skill",
        },
        {
          title: "Star-Schema Data Modeling",
          desc: "Build high-speed enterprise relational models with Power Query.",
        },
        {
          title: "Executive CXO Dashboard",
          desc: "Corporate deliverable: Multi-Channel Revenue & Supply Chain Command Center.",
          tag: "Capstone",
        },
        {
          title: "8-14 LPA Placement Range",
          desc: "Direct referrals with 1-on-1 mock interviews and portfolio review.",
          tag: "Salary",
        },
      ],
    },
    {
      id: "sql",
      name: "SQL",
      tagline: "The Core Foundation of Modern Data Analytics",
      role: "Relational Queries, Schema Design & High-Performance Data Extraction",
      badge: "Core Prerequisite",
      salaryBoost: "+35% Higher CTC",
      demand: "98% of Analytics Job Openings",
      accent: "#0088CC",
      description:
        "Master writing complex JOINs, Window Functions, Aggregate Subqueries, CTEs, and Stored Procedures across PostgreSQL, MySQL, and Snowflake.",
      ctaText: "Start Learning SQL",
      courseId: "python-data",
      highlights: [
        {
          title: "Window Functions & Ranking",
          desc: "Master RANK, DENSE_RANK, LEAD/LAG, and rolling partition calculations.",
          tag: "Core Skill",
        },
        {
          title: "Complex Multi-Table JOINs",
          desc: "Combine fragmented transactional tables with optimal query performance.",
        },
        {
          title: "Multi-Million Row ETL Pipeline",
          desc: "Corporate deliverable: E-Commerce Customer Lifetime Value (CLV) Engine.",
          tag: "Capstone",
        },
        {
          title: "High Placement Demand",
          desc: "Standard prerequisite tested in 100% of data analyst technical interviews.",
          tag: "Salary",
        },
      ],
    },
    {
      id: "tableau",
      name: "Tableau",
      tagline: "Executive Storytelling & Interactive Visualizations",
      role: "Visual Analytics, Heatmaps, Dual-Axis Charts & Interactive Storyboards",
      badge: "Visual Storytelling",
      salaryBoost: "+38% Higher CTC",
      demand: "Fortune 500 Favorite",
      accent: "#E97627",
      description:
        "Craft visual data stories that influence boardroom decisions. Build responsive multi-layered dashboards, calculated parameters, and dynamic spatial heatmaps.",
      ctaText: "Start Learning Tableau",
      courseId: "powerbi-tableau",
      highlights: [
        {
          title: "Level of Detail (LOD) Expressions",
          desc: "Formulate FIXED, INCLUDE, and EXCLUDE calculated measures with ease.",
          tag: "Core Skill",
        },
        {
          title: "Dual-Axis & Pareto Visuals",
          desc: "Design interactive visual drill-downs that captivate stakeholders.",
        },
        {
          title: "SaaS Retention Storyboard",
          desc: "Corporate deliverable: Interactive Customer Churn & Cohort Analysis Portal.",
          tag: "Capstone",
        },
        {
          title: "Strategic Impact Roles",
          desc: "Direct visibility with CXO decision makers and product leadership.",
          tag: "Salary",
        },
      ],
    },
    {
      id: "python",
      name: "Python",
      tagline: "Automated Data Wrangling, Pandas & Predictive ML",
      role: "Automated Pipelines, Exploratory Data Analysis & Machine Learning",
      badge: "High-Growth Skill",
      salaryBoost: "+45% Higher CTC",
      demand: "#1 Programming Language",
      accent: "#3776AB",
      description:
        "Leverage Python's data science stack to clean messy datasets in seconds, generate automated visual plots, and build predictive churn and forecasting models.",
      ctaText: "Start Learning Python",
      courseId: "python-data",
      highlights: [
        {
          title: "Pandas & NumPy Wrangling",
          desc: "Clean, filter, and reshape messy real-world datasets in seconds.",
          tag: "Core Skill",
        },
        {
          title: "Predictive Machine Learning",
          desc: "Build Scikit-Learn regression, classification, and clustering models.",
        },
        {
          title: "Automated Forecast Model",
          desc: "Corporate deliverable: Predictive Customer Segmentation & Demand Forecasting.",
          tag: "Capstone",
        },
        {
          title: "Highest Compensation Ceiling",
          desc: "Opens dual tracks toward Senior Analytics and Machine Learning Engineering.",
          tag: "Salary",
        },
      ],
    },
    {
      id: "fabric",
      name: "Fabric / Flow",
      tagline: "End-to-End Workflow Automation & Cloud Pipelines",
      role: "Robotic Process Automation (RPA), Cloud Triggers & Data Flow",
      badge: "Modern Automation",
      salaryBoost: "+30% Productivity",
      demand: "Rapid Enterprise Adoption",
      accent: "#0078D4",
      description:
        "Eliminate repetitive manual reporting. Set up automated email reports, sync SQL databases to Power BI, and trigger automated alerts based on live data anomalies.",
      ctaText: "Start Learning Fabric & Flow",
      courseId: "data-analytics-bi-certification",
      highlights: [
        {
          title: "Zero-Code Cloud RPA Flows",
          desc: "Automate repetitive data collection, scheduled emails, and webhooks.",
          tag: "Core Skill",
        },
        {
          title: "Microsoft Fabric Lakehouse",
          desc: "Orchestrate end-to-end modern cloud pipelines with zero maintenance.",
        },
        {
          title: "Automated Reporting Bot",
          desc: "Corporate deliverable: Zero-Touch Daily Sales Pipeline & Teams Alert Bot.",
          tag: "Capstone",
        },
        {
          title: "Automation Specialist Demand",
          desc: "Massive productivity multiplier rewarded with rapid promotions.",
          tag: "Salary",
        },
      ],
    },
    {
      id: "powerapps",
      name: "Power Apps",
      tagline: "Rapid Low-Code Business Applications & Portals",
      role: "Interactive Internal Tools, Mobile Forms & Operational Portals",
      badge: "Enterprise Low-Code",
      salaryBoost: "+32% Higher CTC",
      demand: "Corporate Solution Standard",
      accent: "#9F2B8D",
      description:
        "Build enterprise web and mobile applications directly on top of your analytics data without writing complex backend code. Connect with SharePoint, Dataverse, and SQL.",
      ctaText: "Start Learning Power Apps",
      courseId: "data-analytics-bi-certification",
      highlights: [
        {
          title: "Canvas & Model-Driven Apps",
          desc: "Build drag-and-drop business applications for web, tablet, and mobile.",
          tag: "Core Skill",
        },
        {
          title: "SQL & Dataverse Connectors",
          desc: "Connect directly to live corporate databases with zero backend servers.",
        },
        {
          title: "Field Operations CRM Portal",
          desc: "Corporate deliverable: Enterprise Inventory Audit & Asset Tracking App.",
          tag: "Capstone",
        },
        {
          title: "Business Problem Solver",
          desc: "Deliver working enterprise software in days instead of months.",
          tag: "Salary",
        },
      ],
    },
  ];

  const activeTool = tools.find((t) => t.id === selectedToolId) || null;

  // RIGHT-SIDE CARD THEME & WIDGET CONFIGURATION FOR EACH SELECTED TOOL
  const getToolCardConfig = (toolId: string) => {
    switch (toolId) {
      case "powerbi":
        return {
          cardBg: "bg-gradient-to-br from-[#1c1404] via-[#261c06] to-[#0d0a03]",
          borderStyle: "border-amber-500/50 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.4)]",
          glowColor: "#f59e0b",
          badgeBg: "bg-amber-400/20 text-amber-300 border border-amber-400/40",
          accentColor: "#F2C811",
          btnGradient: "from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-[0_10px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.6)]",
          btnText: "Master Power BI & Get Placed",
          courseId: "powerbi-tableau",
          widget: (
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 backdrop-blur-md space-y-3" data-card-3d="analytics" data-card-density="compact">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-extrabold text-amber-300">Power BI Service • Live Executive KPI Stream</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  DAX Automated
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] font-medium text-amber-200/70">YTD Revenue</div>
                  <div className="text-base font-black text-amber-300">$14.8M</div>
                  <div className="text-[9px] font-bold text-emerald-400">+28.4% YoY</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] font-medium text-amber-200/70">Active Measures</div>
                  <div className="text-base font-black text-white">48 DAX</div>
                  <div className="text-[9px] font-bold text-amber-300">Star-Schema</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] font-medium text-amber-200/70">Refresh Cycle</div>
                  <div className="text-base font-black text-emerald-400">Scheduled</div>
                  <div className="text-[9px] font-bold text-slate-400">Every 60 min</div>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/50 border border-amber-500/20 text-[11px] font-mono text-amber-200/90">
                <span className="text-slate-400">DAX:</span>
                <span className="truncate">Total Sales YTD = TOTALYTD(SUM(FactSales[Revenue]), DimDate[Date])</span>
              </div>
            </div>
          ),
        };

      case "sql":
        return {
          cardBg: "bg-gradient-to-br from-[#061426] via-[#091e38] to-[#020a14]",
          borderStyle: "border-sky-500/50 shadow-[0_25px_60px_-15px_rgba(14,165,233,0.4)]",
          glowColor: "#0ea5e9",
          badgeBg: "bg-sky-400/20 text-sky-300 border border-sky-400/40",
          accentColor: "#0088CC",
          btnGradient: "from-sky-500 via-blue-500 to-indigo-600 text-white shadow-[0_10px_25px_rgba(14,165,233,0.4)] hover:shadow-[0_15px_35px_rgba(14,165,233,0.6)]",
          btnText: "Master SQL Querying & Schemas",
          courseId: "python-data",
          widget: (
            <div className="p-4 rounded-2xl bg-black/50 border border-sky-500/30 backdrop-blur-md space-y-2.5" data-card-3d="analytics" data-card-density="compact">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-extrabold text-sky-300 ml-1">PostgreSQL & Snowflake Query Editor</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold border border-sky-400/30">
                  Window Functions
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/70 border border-sky-500/20 font-mono text-[11px] text-sky-200/90 leading-relaxed overflow-x-auto">
                <div><span className="text-purple-400">SELECT</span> customer_id, region,</div>
                <div className="pl-4">
                  <span className="text-sky-400 font-bold">DENSE_RANK()</span> <span className="text-purple-400">OVER</span> (
                  <span className="text-purple-400">PARTITION BY</span> region <span className="text-purple-400">ORDER BY</span> revenue <span className="text-purple-400">DESC</span>
                  ) <span className="text-purple-400">as</span> sales_rank
                </div>
                <div><span className="text-purple-400">FROM</span> enterprise_fact_sales</div>
                <div><span className="text-purple-400">WHERE</span> order_status = <span className="text-emerald-300">&apos;Completed&apos;</span>;</div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-sky-300/80 pt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span>✓</span> Query OK (0.02s) • 1,250,000 Rows Processed
                </span>
                <span className="text-slate-400">Index Scan: Optimal</span>
              </div>
            </div>
          ),
        };

      case "tableau":
        return {
          cardBg: "bg-gradient-to-br from-[#241a05] via-[#2d2207] to-[#0c0903]",
          borderStyle: "border-amber-500/50 shadow-[0_25px_60px_-15px_rgba(212,175,55,0.4)]",
          glowColor: "#d4af37",
          badgeBg: "bg-amber-400/20 text-amber-300 border border-amber-400/40",
          accentColor: "#d4af37",
          btnGradient: "from-amber-500 via-yellow-500 to-amber-600 text-white shadow-[0_10px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.6)]",
          btnText: "Master Tableau Visual Storytelling",
          courseId: "powerbi-tableau",
          widget: (
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/30 backdrop-blur-md space-y-3" data-card-3d="analytics" data-card-density="compact">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-extrabold text-amber-300">Tableau Desktop • Boardroom Storyboard</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  Dual-Axis Drilldown
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] text-amber-200/90 font-medium mb-1">
                    <span>Enterprise Tech Cohort</span>
                    <span className="font-bold text-amber-400">92.4% Retention</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 w-[92%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-amber-200/90 font-medium mb-1">
                    <span>BFSI Financial Operations</span>
                    <span className="font-bold text-amber-400">86.1% Retention</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 w-[86%]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/20 text-[11px] font-mono text-amber-200/90">
                <span className="text-slate-400">LOD Expression:</span>
                <span className="truncate">{`{ FIXED [Region], [Segment] : SUM([Sales]) }`}</span>
              </div>
            </div>
          ),
        };

      case "python":
        return {
          cardBg: "bg-gradient-to-br from-[#0c1829] via-[#0f223a] to-[#050c14]",
          borderStyle: "border-blue-500/50 shadow-[0_25px_60px_-15px_rgba(59,130,246,0.4)]",
          glowColor: "#3b82f6",
          badgeBg: "bg-blue-400/20 text-blue-300 border border-blue-400/40",
          accentColor: "#3776AB",
          btnGradient: "from-blue-600 via-indigo-500 to-sky-500 text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.6)]",
          btnText: "Master Python Data Science & ML",
          courseId: "python-data",
          widget: (
            <div className="p-4 rounded-2xl bg-black/50 border border-blue-500/30 backdrop-blur-md space-y-2.5" data-card-3d="analytics" data-card-density="compact">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">🐍</span>
                  <span className="font-extrabold text-blue-300">Jupyter Lab • predictive_analytics.py</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                  Scikit-Learn & Pandas
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/70 border border-blue-500/20 font-mono text-[11px] text-blue-200/90 leading-relaxed overflow-x-auto">
                <div><span className="text-pink-400">import</span> pandas <span className="text-pink-400">as</span> pd, numpy <span className="text-pink-400">as</span> np</div>
                <div>df = pd.read_parquet(<span className="text-emerald-300">&apos;telecom_churn.parquet&apos;</span>)</div>
                <div>model = RandomForestClassifier(n_estimators=100)</div>
                <div>model.fit(X_train, y_train)</div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-blue-300/80 pt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span>[✓]</span> Model Precision: 94.8% • AUC-ROC: 0.96
                </span>
                <span className="text-amber-300 font-medium">Ready for Deploy</span>
              </div>
            </div>
          ),
        };

      case "fabric":
        return {
          cardBg: "bg-gradient-to-br from-[#041a2e] via-[#072947] to-[#020e1a]",
          borderStyle: "border-cyan-400/50 shadow-[0_25px_60px_-15px_rgba(6,182,212,0.4)]",
          glowColor: "#06b6d4",
          badgeBg: "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40",
          accentColor: "#0078D4",
          btnGradient: "from-cyan-500 via-teal-500 to-blue-600 text-white shadow-[0_10px_25px_rgba(6,182,212,0.4)] hover:shadow-[0_15px_35px_rgba(6,182,212,0.6)]",
          btnText: "Master Cloud Automation & RPA",
          courseId: "data-analytics-bi-certification",
          widget: (
            <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 backdrop-blur-md space-y-3" data-card-3d="analytics" data-card-density="compact">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-extrabold text-cyan-300">Zero-Code Cloud RPA Workflow Engine</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30">
                  Microsoft Fabric
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[10px] text-cyan-200/70">1. Trigger</div>
                  <div className="font-bold text-white text-[11px] mt-0.5">SQL DB Change</div>
                </div>
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[10px] text-cyan-200/70">2. Power Flow</div>
                  <div className="font-bold text-cyan-300 text-[11px] mt-0.5">ETL Cleansing</div>
                </div>
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[10px] text-cyan-200/70">3. Action</div>
                  <div className="font-bold text-emerald-400 text-[11px] mt-0.5">Teams & OneLake</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-cyan-300/80">
                <span className="text-emerald-400 font-bold">⚡ 1,480 Automated Runs Today</span>
                <span className="text-slate-400">Zero Manual Hours</span>
              </div>
            </div>
          ),
        };

      case "powerapps":
        return {
          cardBg: "bg-gradient-to-br from-[#1e0a29] via-[#2c0f3d] to-[#0d0413]",
          borderStyle: "border-purple-500/50 shadow-[0_25px_60px_-15px_rgba(168,85,247,0.4)]",
          glowColor: "#a855f7",
          badgeBg: "bg-purple-400/20 text-purple-300 border border-purple-400/40",
          accentColor: "#9F2B8D",
          btnGradient: "from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_10px_25px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_35px_rgba(168,85,247,0.6)]",
          btnText: "Build Enterprise Low-Code Apps",
          courseId: "data-analytics-bi-certification",
          widget: (
            <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 backdrop-blur-md space-y-3" data-card-3d="analytics" data-card-density="compact">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span className="font-extrabold text-purple-300">Live Enterprise App Canvas • Web & Mobile</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-400/30">
                  Dataverse Connected
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200/70">Target Application:</span>
                  <span className="font-bold text-white">Field Operations Audit Portal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200/70">Database Source:</span>
                  <span className="font-bold text-purple-300">Direct SQL + SharePoint List</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200/70">Deployment:</span>
                  <span className="font-bold text-emerald-400">Ready on iOS, Android & Browser</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-purple-300/80">
                <span className="text-emerald-400 font-bold">✓ Zero Backend Server Required</span>
                <span className="text-slate-400">Instant Corporate Auth</span>
              </div>
            </div>
          ),
        };

      default:
        return null;
    }
  };

  const currentCardConfig = activeTool ? getToolCardConfig(activeTool.id) : null;

  const handleToolClick = (toolId: string) => {
    // If clicking same tool, toggle or keep active
    if (selectedToolId === toolId) {
      setSelectedToolId(null);
    } else {
      setSelectedToolId(toolId);
    }
  };

  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenLeadModal) {
      onOpenLeadModal(activeTool ? activeTool.courseId : "data-analytics-bi-certification");
    } else {
      const element = document.getElementById("courses");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-[#EBF7F0] via-[#F4FAF6] to-white border-b border-emerald-100/70 overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-200/25 rounded-full blur-2xl pointer-events-none" />

      {/* Subtle Grid Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Interactive 6-Tool Constellation (Clicking selects tool) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <ScrollReveal direction="scale" delay={100} className="w-full">
              <div className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-square mx-auto flex items-center justify-center select-none">
                
                {/* Orbital Ambient Rings */}
                <div className="absolute inset-2 sm:inset-4 rounded-full border border-emerald-400/20 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-12 sm:inset-14 rounded-full border border-dashed border-teal-500/25 animate-[spin_45s_linear_infinite_reverse]" />
                <div className="absolute inset-24 sm:inset-28 rounded-full bg-gradient-to-tr from-emerald-100/50 via-white/80 to-blue-50/60 backdrop-blur-sm shadow-inner" />

                {/* Pulsing Central Glow */}
                <div className="absolute w-36 h-36 rounded-full bg-amber-400/15 blur-xl animate-pulse" />

                {/* Constellation Connection Rays (SVG) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <line x1="50%" y1="18%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.4" />
                  <line x1="18%" y1="46%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.4" />
                  <line x1="82%" y1="46%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.4" />
                  <line x1="26%" y1="82%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.4" />
                  <line x1="74%" y1="82%" x2="50%" y2="50%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" strokeOpacity="0.4" />
                </svg>

                {/* CENTER HUB: TABLEAU */}
                <button
                  type="button"
                  onClick={() => handleToolClick("tableau")}
                  className="relative z-20 group cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none"
                >
                  <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/95 p-3 shadow-[0_15px_35px_-5px_rgba(212,175,55,0.25)] border-2 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-md ${
                    selectedToolId === "tableau"
                      ? "border-amber-500 ring-4 ring-amber-500/30 shadow-[0_20px_45px_-5px_rgba(212,175,55,0.5)] scale-105"
                      : "border-amber-200/90 group-hover:border-amber-500"
                  }`} data-card-3d="analytics" data-card-density="compact">
                    <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-sm" fill="currentColor">
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
                      <rect x="71" y="21" width="6" height="18" rx="0.8" fill="#58A14F" />
                      <rect x="65" y="27" width="18" height="6" rx="0.8" fill="#58A14F" />
                      <rect x="23" y="21" width="6" height="18" rx="0.8" fill="#B07AA1" />
                      <rect x="17" y="27" width="18" height="6" rx="0.8" fill="#B07AA1" />
                      <rect x="23" y="61" width="6" height="18" rx="0.8" fill="#F28E2B" />
                      <rect x="17" y="67" width="18" height="6" rx="0.8" fill="#F28E2B" />
                      <rect x="71" y="61" width="6" height="18" rx="0.8" fill="#E15759" />
                      <rect x="65" y="67" width="18" height="6" rx="0.8" fill="#E15759" />
                    </svg>
                    <span className="text-[11px] font-black text-slate-800 tracking-tight mt-1">Tableau</span>
                  </div>
                </button>

                {/* SATELLITE 1: TOP -> POWER BI */}
                <button
                  type="button"
                  onClick={() => handleToolClick("powerbi")}
                  className="absolute top-0 sm:top-1 left-1/2 -translate-x-1/2 z-20 group cursor-pointer animate-[bounce_4s_ease-in-out_infinite] focus:outline-none"
                >
                  <div className={`w-15 h-15 sm:w-18 sm:h-18 p-2 rounded-2xl bg-white/95 shadow-[0_10px_25px_-5px_rgba(242,200,17,0.35)] border flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    selectedToolId === "powerbi"
                      ? "border-amber-500 ring-4 ring-amber-400/40 shadow-[0_15px_35px_-5px_rgba(242,200,17,0.6)] scale-115"
                      : "border-amber-200 group-hover:scale-115 group-hover:border-amber-400"
                  }`}>
                    <svg viewBox="0 0 48 48" className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-xs" fill="none">
                      <rect x="29" y="8" width="11" height="34" rx="2.5" fill="url(#pbi_gold_3_kick3)" />
                      <rect x="18" y="18" width="11" height="24" rx="2.5" fill="url(#pbi_gold_2_kick3)" />
                      <rect x="7" y="27" width="11" height="15" rx="2.5" fill="url(#pbi_gold_1_kick3)" />
                      <defs>
                        <linearGradient id="pbi_gold_1_kick3" x1="7" y1="27" x2="18" y2="42" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FDE047" />
                          <stop offset="1" stopColor="#EAB308" />
                        </linearGradient>
                        <linearGradient id="pbi_gold_2_kick3" x1="18" y1="18" x2="29" y2="42" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FBBF24" />
                          <stop offset="1" stopColor="#D97706" />
                        </linearGradient>
                        <linearGradient id="pbi_gold_3_kick3" x1="29" y1="8" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#F59E0B" />
                          <stop offset="1" stopColor="#B45309" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-[9px] font-black text-amber-900 tracking-tight mt-0.5">Power BI</span>
                  </div>
                </button>

                {/* SATELLITE 2: LEFT -> PYTHON */}
                <button
                  type="button"
                  onClick={() => handleToolClick("python")}
                  className="absolute left-0 sm:left-1 top-[42%] -translate-y-1/2 z-20 group cursor-pointer animate-[bounce_4.6s_ease-in-out_infinite_0.8s] focus:outline-none"
                >
                  <div className={`w-15 h-15 sm:w-18 sm:h-18 p-2 rounded-2xl bg-white/95 shadow-[0_10px_25px_-5px_rgba(55,118,171,0.3)] border flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    selectedToolId === "python"
                      ? "border-blue-500 ring-4 ring-blue-400/40 shadow-[0_15px_35px_-5px_rgba(55,118,171,0.6)] scale-115"
                      : "border-blue-200 group-hover:scale-115 group-hover:border-blue-400"
                  }`}>
                    <svg viewBox="0 0 110 110" className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-xs" fill="none">
                      <path
                        d="M54.5 4.5C28.2 4.5 29.8 15.9 29.8 15.9L29.9 27.7H55v3.6H19.9s-15.4 1.7-15.4 27.9c0 26.2 13.5 25.4 13.5 25.4h8v-11.3c0-12.9 11-12.5 11-12.5h25.1c10.8 0 10.3-10.2 10.3-10.2V15.4S94.2 4.5 54.5 4.5zm-13.8 8.4c2.6 0 4.7 2.1 4.7 4.7s-2.1 4.7-4.7 4.7-4.7-2.1-4.7-4.7 2.1-4.7 4.7-4.7z"
                        fill="#387EB8"
                      />
                      <path
                        d="M55.5 105.5c26.3 0 24.7-11.4 24.7-11.4l-.1-11.8H55v-3.6h35.1s15.4-1.7 15.4-27.9c0-26.2-13.5-25.4-13.5-25.4h-8v11.3c0 12.9-11 12.5-11 12.5H47.9c-10.8 0-10.3 10.2-10.3 10.2v25.2s-1.8 10.9 37.9 10.9zm13.8-8.4c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7-2.1 4.7-4.7 4.7z"
                        fill="#FFE052"
                      />
                    </svg>
                    <span className="text-[9px] font-black text-slate-800 tracking-tight mt-0.5">Python</span>
                  </div>
                </button>

                {/* SATELLITE 3: RIGHT -> MICROSOFT FABRIC / POWER AUTOMATE */}
                <button
                  type="button"
                  onClick={() => handleToolClick("fabric")}
                  className="absolute right-0 sm:right-1 top-[42%] -translate-y-1/2 z-20 group cursor-pointer animate-[bounce_5.2s_ease-in-out_infinite_1.6s] focus:outline-none"
                >
                  <div className={`w-15 h-15 sm:w-18 sm:h-18 p-2 rounded-2xl bg-white/95 shadow-[0_10px_25px_-5px_rgba(0,120,212,0.3)] border flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    selectedToolId === "fabric"
                      ? "border-sky-500 ring-4 ring-sky-400/40 shadow-[0_15px_35px_-5px_rgba(0,120,212,0.6)] scale-115"
                      : "border-sky-200 group-hover:scale-115 group-hover:border-sky-400"
                  }`}>
                    <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-xs" fill="none">
                      <path d="M10 20L28 6L46 20L28 34L10 20Z" fill="#0078D4" />
                      <path d="M28 34L46 20L58 29.5L40 43.5L28 34Z" fill="#50E6FF" />
                      <path d="M28 34L40 43.5L28 53L16 43.5L28 34Z" fill="#005A9E" />
                      <path d="M10 20L28 34L16 43.5L6 33.5L10 20Z" fill="#2899F5" />
                    </svg>
                    <span className="text-[9px] font-black text-sky-900 tracking-tight mt-0.5">Fabric/Flow</span>
                  </div>
                </button>

                {/* SATELLITE 4: BOTTOM-LEFT -> SQL */}
                <button
                  type="button"
                  onClick={() => handleToolClick("sql")}
                  className="absolute left-6 sm:left-8 bottom-0 sm:bottom-1 z-20 group cursor-pointer animate-[bounce_4.8s_ease-in-out_infinite_0.4s] focus:outline-none"
                >
                  <div className={`w-15 h-15 sm:w-18 sm:h-18 p-2 rounded-2xl bg-white/95 shadow-[0_10px_25px_-5px_rgba(0,136,204,0.35)] border flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    selectedToolId === "sql"
                      ? "border-sky-500 ring-4 ring-sky-400/40 shadow-[0_15px_35px_-5px_rgba(0,136,204,0.6)] scale-115"
                      : "border-sky-200 group-hover:scale-115 group-hover:border-sky-400"
                  }`}>
                    <svg viewBox="0 0 80 80" className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-xs" fill="none">
                      <path d="M14 28V52C14 62 25 70 40 70C55 70 66 62 66 52V28" fill="url(#sql_cyl_body3)" />
                      <ellipse cx="40" cy="52" rx="26" ry="12" fill="#005A9E" fillOpacity="0.4" />
                      <path d="M14 20V36C14 46 25 54 40 54C55 54 66 46 66 36V20" fill="url(#sql_cyl_body3)" />
                      <ellipse cx="40" cy="36" rx="26" ry="12" fill="#005A9E" fillOpacity="0.4" />
                      <path d="M14 12V24C14 34 25 42 40 42C55 42 66 34 66 24V12" fill="url(#sql_cyl_body3)" />
                      <ellipse cx="40" cy="20" rx="26" ry="12" fill="#007ACC" />
                      <ellipse cx="40" cy="18" rx="24" ry="10" fill="#38BFF8" />
                      <defs>
                        <linearGradient id="sql_cyl_body3" x1="14" y1="20" x2="66" y2="70" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#007ACC" />
                          <stop offset="0.5" stopColor="#0284C7" />
                          <stop offset="1" stopColor="#0369A1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-[9px] font-black text-sky-950 tracking-tight mt-0.5">SQL</span>
                  </div>
                </button>

                {/* SATELLITE 5: BOTTOM-RIGHT -> POWER APPS */}
                <button
                  type="button"
                  onClick={() => handleToolClick("powerapps")}
                  className="absolute right-6 sm:right-8 bottom-0 sm:bottom-1 z-20 group cursor-pointer animate-[bounce_4.4s_ease-in-out_infinite_1.2s] focus:outline-none"
                >
                  <div className={`w-15 h-15 sm:w-18 sm:h-18 p-2 rounded-2xl bg-white/95 shadow-[0_10px_25px_-5px_rgba(159,43,141,0.35)] border flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    selectedToolId === "powerapps"
                      ? "border-purple-500 ring-4 ring-purple-400/40 shadow-[0_15px_35px_-5px_rgba(159,43,141,0.6)] scale-115"
                      : "border-purple-200 group-hover:scale-115 group-hover:border-purple-400"
                  }`}>
                    <svg viewBox="0 0 64 64" className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-xs" fill="none">
                      <path d="M32 6L54 18.5V45.5L32 58L10 45.5V18.5L32 6Z" fill="#742774" />
                      <path d="M32 6L54 18.5L32 31L10 18.5L32 6Z" fill="#A83B90" />
                      <path d="M32 31L54 18.5V45.5L32 58V31Z" fill="#581F54" />
                      <path d="M22 26L32 31.5L42 26L32 20.5L22 26Z" fill="#D946EF" />
                    </svg>
                    <span className="text-[9px] font-black text-purple-950 tracking-tight mt-0.5">Power Apps</span>
                  </div>
                </button>

              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT COLUMN: The Dynamic Morphing Card (Changes completely for each selected icon) */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="up" delay={150}>
              <div
                key={activeTool ? activeTool.id : "default"}
                className={`relative rounded-3xl text-white p-6 sm:p-8 overflow-hidden card-3d-hover min-h-[500px] flex flex-col justify-between transition-all duration-500 border ${
                  currentCardConfig
                    ? `${currentCardConfig.cardBg} ${currentCardConfig.borderStyle}`
                    : "bg-gradient-to-br from-[#05261b] via-[#073626] to-[#041d14] border-emerald-500/40 shadow-[0_25px_60px_-15px_rgba(5,38,27,0.6)]"
                }`} data-card-3d="analytics" data-card-density="regular"
              >
                
                {/* Ambient Dynamic Glow matching selected tool */}
                <div
                  className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
                  style={{ backgroundColor: currentCardConfig ? currentCardConfig.glowColor : "#10b981" }}
                />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

                {/* CARD CONTENT */}
                <div className="relative z-10">
                  
                  {activeTool && currentCardConfig ? (
                    /* DYNAMIC TOOL-SPECIFIC CARD DESIGN (UNIQUE FOR EACH SELECTED TOOL) */
                    <div className="space-y-4 animate-fadeIn">
                      
                      {/* Top Action Bar & Tool Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs ${currentCardConfig.badgeBg}`}>
                            {activeTool.badge}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/15 text-white border border-white/20">
                            {activeTool.salaryBoost}
                          </span>
                          <span className="text-xs text-white/70 hidden sm:inline">
                            • {activeTool.demand}
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedToolId(null)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/20 transition-all shadow-xs"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>View 4 General Perks</span>
                        </button>
                      </div>

                      {/* Tool Title & Description */}
                      <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight flex flex-wrap items-center gap-2">
                          <span>{activeTool.name}</span>
                          <span className="text-xs sm:text-sm font-semibold text-white/70">
                            — {activeTool.tagline}
                          </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed mt-1.5">
                          {activeTool.description}
                        </p>
                      </div>

                      {/* TOOL UNIQUE INTERACTIVE WIDGET (KPI / CODE / STORYBOARD / RPA / APP) */}
                      <div className="my-1.5">
                        {currentCardConfig.widget}
                      </div>

                      {/* 2x2 Highlights Grid for Selected Tool */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                        {activeTool.highlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-2 sm:p-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.1] hover:border-white/30 transition-all duration-300 group"
                          >
                            <div
                              className="w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200 mt-0.5"
                              style={{ backgroundColor: currentCardConfig.accentColor }}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] sm:text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                                <span>{item.title}</span>
                                {item.tag && (
                                  <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-white/20 text-white border border-white/30">
                                    {item.tag}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] sm:text-[11px] text-white/70 mt-0.5 leading-snug">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : (
                    /* DEFAULT GENERAL OVERVIEW VIEW (ORIGINAL REFERENCE PERKS) */
                    <div className="space-y-5 animate-fadeIn">
                      
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                          Comprehensive 6-in-1 Master Program
                        </span>
                        <span className="text-xs text-emerald-200/70 hidden sm:inline">
                          • Zero Prior Coding Needed
                        </span>
                      </div>

                      <div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight mb-2">
                          Getting Started With Data Analytics Courses
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-2xl">
                          Step into the fastest growing tech domain without prior coding knowledge. Master Tableau, Power BI, SQL, Python, Power Automate, and Power Apps with live capstone projects and assured placement assistance.
                        </p>
                      </div>

                      {/* 2x2 Interactive Benefit Highlights Matching the Reference */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3.5">
                        
                        {/* Item 1: No Coding */}
                        <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-emerald-400/50 transition-all duration-300 group cursor-default">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white tracking-tight">
                              No Coding
                            </div>
                            <div className="text-[11px] text-emerald-200/70 mt-0.5 leading-snug">
                              Visual drag-and-drop dashboards & no-code BI workflows.
                            </div>
                          </div>
                        </div>

                        {/* Item 2: 8 Laks+ CTC */}
                        <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-emerald-400/50 transition-all duration-300 group cursor-default">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                              <span>8 Laks+ CTC</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">Avg</span>
                            </div>
                            <div className="text-[11px] text-emerald-200/70 mt-0.5 leading-snug">
                              Lucrative entry-level and transition salary packages.
                            </div>
                          </div>
                        </div>

                        {/* Item 3: No Work Pressure */}
                        <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-emerald-400/50 transition-all duration-300 group cursor-default">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white tracking-tight">
                              No Work Pressure
                            </div>
                            <div className="text-[11px] text-emerald-200/70 mt-0.5 leading-snug">
                              Strategic reporting roles with high work-life balance.
                            </div>
                          </div>
                        </div>

                        {/* Item 4: WFH Jobs (Remote) */}
                        <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] hover:border-emerald-400/50 transition-all duration-300 group cursor-default">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200 mt-0.5">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white tracking-tight">
                              WFH Jobs (Remote)
                            </div>
                            <div className="text-[11px] text-emerald-200/70 mt-0.5 leading-snug">
                              Abundant hybrid & pan-India remote working choices.
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* ACTION ROW (DYNMICALLY WIRED TO CURRENT SELECTION) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3">
                    {/* Primary Button with Dynamic Styling */}
                    <button
                      onClick={handlePrimaryAction}
                      className={`relative group inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 overflow-hidden ${
                        currentCardConfig
                          ? `bg-gradient-to-r ${currentCardConfig.btnGradient}`
                          : "bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.6)] animate-btn-glow"
                      }`}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                      <span>{currentCardConfig ? currentCardConfig.btnText : "Start Course"}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </button>

                    {/* Secondary Curriculum Button */}
                    <Link
                      href="/courses"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] text-white/90 hover:text-white font-semibold text-xs sm:text-sm border border-white/10 hover:border-white/30 transition-all duration-200"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{activeTool ? `View ${activeTool.name} Syllabus` : "View Curriculum & Tools"}</span>
                    </Link>
                  </div>

                </div>

                {/* Bottom Trust Strip */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/[0.1] flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">100% Placement Support</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    <span>Hiring Partner Referrals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{activeTool ? "Capstone Deliverable Included" : "6 Core Tools Mastery"}</span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
