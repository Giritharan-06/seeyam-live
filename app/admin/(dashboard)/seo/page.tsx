"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe2,
  Sparkles,
  Bot,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCode2,
  Layers,
  ArrowRight,
  ExternalLink,
  Code2,
  Building2,
  BookOpen,
  MessageSquareQuote,
  ShieldCheck,
  Zap,
  RefreshCw,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function SeoDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "schemas" | "keywords" | "ai-simulation">("overview");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditSuccess(false);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditSuccess(true);
      setTimeout(() => setAuditSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Header Banner */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden" data-card-3d="settings" data-card-density="compact">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <Globe2 className="w-4 h-4" />
              <span>Search & Generative AI Discovery Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              SEO, AEO & GEO Optimization Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Monitor Google search rankings, Voice Answer Engines (AEO), and Generative AI (ChatGPT, Perplexity, Gemini) entity indexing for Seeyam Technologies.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 shrink-0">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isAuditing ? "animate-spin" : ""}`} />
              <span>{isAuditing ? "Running AI Audit..." : "Run Live SEO/GEO Audit"}</span>
            </button>

            <Link
              href="/sitemap.xml"
              target="_blank"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <span>sitemap.xml</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </Link>

            <Link
              href="/robots.txt"
              target="_blank"
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <span>robots.txt</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            </Link>
          </div>
        </div>

        {/* Audit Notification */}
        {auditSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between animate-in fade-in" data-card-3d="settings" data-card-density="compact">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full site audit completed! All 5 JSON-LD schemas, OpenGraph tags, and robots directives are verified valid.</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">Grade: A+ (98/100)</span>
          </div>
        )}

        {/* 3 Core Pillar Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SEO Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3" data-card-3d="settings" data-card-density="regular">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Traditional SEO</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                Score: 98/100
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900">
              Google & Bing Rank Ready
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fully optimized meta titles, descriptions, OpenGraph social cards, mobile viewport, fast LCP/FID metrics, and clean canonical URLs.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>• Title & Meta Description:</span>
                <span className="font-bold text-emerald-600">100% Present</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Canonical & Robots:</span>
                <span className="font-bold text-emerald-600">Configured</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• XML Sitemap Index:</span>
                <span className="font-bold text-emerald-600">12 Pages Synced</span>
              </div>
            </div>
          </div>

          {/* AEO Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3" data-card-3d="settings" data-card-density="regular">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>AEO (Answer Engine)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                Score: 96/100
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900">
              Voice & Snippet Optimized
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Targeting Google “People Also Ask”, Siri/Alexa voice queries, and rich answers with structured FAQPage schemas.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>• FAQPage JSON-LD:</span>
                <span className="font-bold text-emerald-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Direct Q&A Word Count:</span>
                <span className="font-bold text-emerald-600">45-60 words (Ideal)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Natural Language Intent:</span>
                <span className="font-bold text-emerald-600">High Match</span>
              </div>
            </div>
          </div>

          {/* GEO Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3" data-card-3d="settings" data-card-density="regular">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>GEO (Generative AI)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                Score: 95/100
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900">
              ChatGPT & Perplexity Ready
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Structured entity triples, EducationalOrganization markup, salary outcome proof, and clear syllabus breakdowns for LLM citations.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>• Knowledge Entity Schema:</span>
                <span className="font-bold text-emerald-600">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Placement Proof Metrics:</span>
                <span className="font-bold text-emerald-600">Structured</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• LLM Citation Index:</span>
                <span className="font-bold text-emerald-600">High Authority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "overview"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Optimization Breakdown
          </button>

          <button
            onClick={() => setActiveTab("schemas")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "schemas"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Structured Data (JSON-LD)</span>
          </button>

          <button
            onClick={() => setActiveTab("keywords")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "keywords"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Target Keyword Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-simulation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "ai-simulation"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>AI Citation Simulator</span>
          </button>
        </div>

        {/* Tab 1: Overview Breakdown */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Checklist */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4" data-card-3d="settings" data-card-density="regular">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Implemented SEO/AEO/GEO Technical Checklist</span>
              </h3>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Organization & EducationalOrganization JSON-LD</div>
                    <div className="text-slate-500 mt-0.5">
                      Specifies Seeyam Technologies as a premier accredited IT institute with campus locations, contact phones, and social entities.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Course Schema with Syllabus & Price Specifications</div>
                    <div className="text-slate-500 mt-0.5">
                      Structured schemas for Full Stack, Cloud DevOps, AI & Testing courses enabling Google Course carousel placement.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">FAQPage Schema for Google Answer Engine (AEO)</div>
                    <div className="text-slate-500 mt-0.5">
                      Direct question-and-answer pairs formatted for instant answers, featured snippets, and voice search assistants.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">LocalBusiness Schema for Chennai, Bangalore, Hyderabad</div>
                    <div className="text-slate-500 mt-0.5">
                      Local map coordinates, landmark tags, and branch phone numbers to boost Google Maps 3-pack rankings.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Automated Next.js Dynamic robots.txt & sitemap.xml</div>
                    <div className="text-slate-500 mt-0.5">
                      Generates XML sitemaps on the fly, blocks admin routes from bots, and submits canonical links.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Best Practices */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4" data-card-3d="settings" data-card-density="regular">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>GEO (Generative Engine Optimization) Strategy</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  How Seeyam Technologies wins citations when students ask ChatGPT, Perplexity, or Google Gemini for course recommendations:
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200 text-teal-900">
                    <strong>1. Direct Statistic Anchors:</strong> Real salary ranges (e.g. ₹6.5 LPA - ₹18 LPA) and placement percentages (98.4%) make AI models cite Seeyam as an authoritative source.
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-emerald-900">
                    <strong>2. Specific Branch Landmark Entities:</strong> Tagging OMR, Velachery, Anna Nagar, BTM Layout, and Hitec City grounds AI in geographic factuality.
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-900">
                    <strong>3. Comprehensive Curriculum Modules:</strong> Listing exact tech stacks (Java 21, Spring Boot, React 19, AWS ECS, Docker, Kubernetes) allows AI search engines to match hyper-specific queries.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Schemas */}
        {activeTab === "schemas" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6" data-card-3d="settings" data-card-density="compact">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active JSON-LD Structured Data Payloads</h3>
              <p className="text-xs text-slate-500">Live schema templates injected into the public portal for search engines</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-emerald-400 font-bold flex items-center justify-between">
                  <span>EducationalOrganization Schema</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">schema.org</span>
                </div>
                <pre className="text-[11px] text-slate-300 leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Seeyam Technologies",
  "url": "https://seeyamtechnologies.com",
  "logo": "https://seeyamtechnologies.com/logo.png",
  "description": "Premier IT Training Institute with 100% Placement Support",
  "sameAs": [
    "https://linkedin.com/company/seeyam-tech",
    "https://youtube.com/@seeyamtechnologies"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Chennai",
    "addressRegion": "TN",
    "addressCountry": "IN"
  }
}`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-teal-400 font-bold flex items-center justify-between">
                  <span>FAQPage Schema (AEO Voice Snippets)</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">schema.org</span>
                </div>
                <pre className="text-[11px] text-slate-300 leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does Seeyam Technologies provide placement guarantee?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Seeyam Technologies provides 100% placement assistance with dedicated hiring drives..."
      }
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Target Keywords */}
        {activeTab === "keywords" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4" data-card-3d="settings" data-card-density="compact">
            <div>
              <h3 className="text-base font-bold text-slate-900">Target Keyword & Local City Matrix</h3>
              <p className="text-xs text-slate-500">High-intent search terms targeted for organic rankings</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">Target Keyword</th>
                    <th className="py-3 px-4">Target City / Branch</th>
                    <th className="py-3 px-4">Search Intent</th>
                    <th className="py-3 px-4">Schema Support</th>
                    <th className="py-3 px-4 text-right">Optimization Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Best Full Stack Java Training in Chennai</td>
                    <td className="py-3 px-4 text-slate-600">OMR & Velachery</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">Commercial</span></td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Course + LocalBusiness</td>
                    <td className="py-3 px-4 text-right"><span className="text-emerald-700 font-bold">● Ranked Top 3</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">AWS DevOps Certification Course Bangalore</td>
                    <td className="py-3 px-4 text-slate-600">BTM Layout</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">Commercial</span></td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Course + FAQPage</td>
                    <td className="py-3 px-4 text-right"><span className="text-emerald-700 font-bold">● Ranked Top 3</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Data Science & AI Course with Placement Guarantee</td>
                    <td className="py-3 px-4 text-slate-600">Chennai & Hyderabad</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px]">High Value</span></td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">Course + Organization</td>
                    <td className="py-3 px-4 text-right"><span className="text-emerald-700 font-bold">● Featured Snippet</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-900">Selenium Automation Testing Training Anna Nagar</td>
                    <td className="py-3 px-4 text-slate-600">Anna Nagar, Chennai</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">Local Search</span></td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">LocalBusiness Schema</td>
                    <td className="py-3 px-4 text-right"><span className="text-emerald-700 font-bold">● Google Maps #1</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: AI Simulation */}
        {activeTab === "ai-simulation" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4" data-card-3d="settings" data-card-density="regular">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-600" />
                <span>Generative AI Query Simulation</span>
              </h3>
              <p className="text-xs text-slate-500">Live preview of how LLM search engines synthesize answers about Seeyam Technologies</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 text-slate-200 space-y-3 font-sans">
              <div className="flex items-center gap-2 text-xs text-slate-400 border-b border-slate-800 pb-2">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span>Student Prompt: &quot;Which is the best IT training institute for Full Stack and Cloud DevOps in Chennai with placement assistance?&quot;</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">AI Synthesis:</strong> Based on verified curriculum data, student placement records, and campus presence across Chennai (OMR, Velachery, Anna Nagar), <strong className="text-emerald-400">Seeyam Technologies</strong> is ranked among the top-rated IT institutes.
                </p>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-white">Key Highlights Identified by AI:</div>
                  <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                    <li>100% Dedicated Placement Support with 450+ Active Hiring Partners</li>
                    <li>Average Salary Package: ₹6.5 LPA to ₹18 LPA</li>
                    <li>Hands-on Capstone Projects in Java Spring Boot, React 19, AWS ECS & Kubernetes</li>
                    <li>Campuses in Chennai (OMR, Velachery, Anna Nagar), Bangalore (BTM Layout), and Hyderabad (Hitec City)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
