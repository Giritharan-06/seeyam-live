"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Target,
  Users2,
  ArrowUpRight,
  Globe2,
  DollarSign,
  Flame,
} from "lucide-react";
import CounterNumber from "@/components/CounterNumber";

interface AnalyticsCardItem {
  id: string;
  title: string;
  category: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  chartType: "bar" | "line" | "donut" | "pie";
  color: string;
  accentColor: string;
  badge: string;
  liveTag: string;
  icon: React.ElementType;
}

const analyticsMetrics: AnalyticsCardItem[] = [
  {
    id: "traffic-donut",
    title: "Multi-Channel Traffic Attribution",
    category: "Attribution Modeling",
    value: "84.6%",
    change: "+28.4%",
    isPositive: true,
    timeframe: "blended conversion rate",
    chartType: "donut",
    color: "from-blue-600 via-indigo-600 to-cyan-500",
    accentColor: "#2563eb",
    badge: "Attribution V2",
    liveTag: "LIVE ATTRIBUTION",
    icon: Target,
  },
  {
    id: "roas-bar",
    title: "Monthly ROAS & Revenue Scale",
    category: "Performance Ads",
    value: "5.8x",
    change: "+42.5%",
    isPositive: true,
    timeframe: "vs industry benchmark (2.4x)",
    chartType: "bar",
    color: "from-emerald-600 via-teal-500 to-cyan-500",
    accentColor: "#059669",
    badge: "AI Bid Engine",
    liveTag: "REAL-TIME ROAS",
    icon: BarChart3,
  },
  {
    id: "spend-pie",
    title: "Omnichannel Budget Allocation",
    category: "Paid Media Strategy",
    value: "$480K",
    change: "+18.2%",
    isPositive: true,
    timeframe: "quarterly ad spend",
    chartType: "pie",
    color: "from-amber-500 via-yellow-500 to-rose-500",
    accentColor: "#d4af37",
    badge: "Multi-Channel",
    liveTag: "BUDGET SYNC",
    icon: PieIcon,
  },
  {
    id: "seo-line",
    title: "Organic SEO & Keyword Reach",
    category: "Search Intelligence",
    value: "3.25M",
    change: "+195.4%",
    isPositive: true,
    timeframe: "monthly search impressions",
    chartType: "line",
    color: "from-indigo-600 via-purple-600 to-pink-500",
    accentColor: "#7c3aed",
    badge: "Top 1% SERP",
    liveTag: "STREAMING",
    icon: Globe2,
  },
  {
    id: "retention-donut",
    title: "Customer Retention & LTV Score",
    category: "Data Science & Retention",
    value: "92.4%",
    change: "+14.8%",
    isPositive: true,
    timeframe: "cohort health index",
    chartType: "donut",
    color: "from-purple-600 via-pink-600 to-rose-500",
    accentColor: "#9333ea",
    badge: "Predictive ML",
    liveTag: "COHORT ML",
    icon: Users2,
  },
  {
    id: "cpc-bar",
    title: "Click-Through & CPC Velocity",
    category: "Cost Optimization",
    value: "$0.32",
    change: "-48.2%",
    isPositive: true,
    timeframe: "cost per acquisition",
    chartType: "bar",
    color: "from-sky-500 via-blue-600 to-indigo-600",
    accentColor: "#0284c7",
    badge: "Lowest CAC",
    liveTag: "BID OPTIMIZED",
    icon: DollarSign,
  },
  {
    id: "geo-pie",
    title: "Audience Demographics & Reach",
    category: "Market Expansion",
    value: "18.4M",
    change: "+240%",
    isPositive: true,
    timeframe: "global active reach",
    chartType: "pie",
    color: "from-rose-500 via-amber-500 to-yellow-500",
    accentColor: "#e11d48",
    badge: "Geo Segmentation",
    liveTag: "GLOBAL AUDIENCE",
    icon: Flame,
  },
  {
    id: "funnel-line",
    title: "Conversion Funnel Acceleration",
    category: "CRO & Funnel Analytics",
    value: "41.8%",
    change: "+31.2%",
    isPositive: true,
    timeframe: "landing-to-checkout rate",
    chartType: "line",
    color: "from-cyan-600 via-teal-600 to-emerald-500",
    accentColor: "#0891b2",
    badge: "High Velocity",
    liveTag: "LIVE CRO",
    icon: Activity,
  },
];

// 1. Light Theme DONUT CHART Component
function DonutChartWidget({ value }: { value: string }) {
  return (
    <div className="w-full h-full flex items-center justify-between gap-4 px-2">
      {/* SVG Ring Container */}
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          {/* Segment 1: Primary (54%) */}
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="#2563eb"
            strokeWidth="12"
            strokeDasharray="276.4"
            strokeDashoffset="127"
            strokeLinecap="round"
            className="animate-stroke-draw"
          />
          {/* Segment 2: Secondary (30%) */}
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="#d4af37"
            strokeWidth="12"
            strokeDasharray="276.4"
            strokeDashoffset="193"
            strokeLinecap="round"
            className="animate-stroke-draw"
            style={{ animationDelay: "0.2s" }}
          />
          {/* Segment 3: Tertiary (16%) */}
          <circle
            cx="60"
            cy="60"
            r="44"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="12"
            strokeDasharray="276.4"
            strokeDashoffset="232"
            strokeLinecap="round"
            className="animate-stroke-draw"
            style={{ animationDelay: "0.4s" }}
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-black text-[#071938] tracking-tight leading-none animate-pulse-subtle">
            {value}
          </span>
          <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mt-0.5">
            Share
          </span>
        </div>
      </div>

      {/* Clean Legend Breakdown */}
      <div className="flex-1 flex flex-col justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="truncate">Organic Search</span>
          </span>
          <span className="font-extrabold text-[#071938]">54%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="truncate">Paid Ads</span>
          </span>
          <span className="font-extrabold text-[#071938]">30%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="truncate">Direct Referral</span>
          </span>
          <span className="font-extrabold text-[#071938]">16%</span>
        </div>
      </div>
    </div>
  );
}

// 2. Light Theme PIE CHART Component
function PieChartWidget() {
  return (
    <div className="w-full h-full flex items-center justify-between gap-4 px-2">
      {/* Segmented SVG Pie */}
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 filter drop-shadow-xs" viewBox="0 0 120 120">
          {/* Slice 1: Google Search (48%) */}
          <path
            d="M 60 60 L 60 14 A 46 46 0 0 1 63 105.8 Z"
            fill="#d4af37"
            className="hover:opacity-90 transition-opacity cursor-pointer"
          />
          {/* Slice 2: Meta Ads (32%) */}
          <path
            d="M 60 60 L 63 105.8 A 46 46 0 0 1 15 45.8 Z"
            fill="#2563eb"
            className="hover:opacity-90 transition-opacity cursor-pointer"
          />
          {/* Slice 3: YouTube & Ads (20%) */}
          <path
            d="M 60 60 L 15 45.8 A 46 46 0 0 1 60 14 Z"
            fill="#10b981"
            className="hover:opacity-90 transition-opacity cursor-pointer"
          />
          {/* Center Separator Ring */}
          <circle cx="60" cy="60" r="7" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
        </svg>
      </div>

      {/* Clean Legend Breakdown */}
      <div className="flex-1 flex flex-col justify-center gap-1.5 text-[11px] font-semibold text-slate-600">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span className="truncate">Google PPC</span>
          </span>
          <span className="font-extrabold text-[#071938]">48%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span className="truncate">Meta / IG</span>
          </span>
          <span className="font-extrabold text-[#071938]">32%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="truncate">YouTube & Ads</span>
          </span>
          <span className="font-extrabold text-[#071938]">20%</span>
        </div>
      </div>
    </div>
  );
}

// 3. Light Theme BAR CHART Component
function BarChartWidget() {
  const barData = [
    { day: "Mon", h: "44%", val: "3.2x", wave: "animate-bar-wave-1", isPeak: false },
    { day: "Tue", h: "62%", val: "4.1x", wave: "animate-bar-wave-2", isPeak: false },
    { day: "Wed", h: "52%", val: "3.8x", wave: "animate-bar-wave-3", isPeak: false },
    { day: "Thu", h: "78%", val: "4.9x", wave: "animate-bar-wave-4", isPeak: false },
    { day: "Fri", h: "90%", val: "5.4x", wave: "animate-bar-wave-5", isPeak: false },
    { day: "Sat", h: "68%", val: "4.5x", wave: "animate-bar-wave-2", isPeak: false },
    { day: "Sun", h: "98%", val: "5.8x", wave: "animate-bar-wave-1", isPeak: true },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between pt-2 pb-1 px-2">
      {/* Bars Track */}
      <div className="flex-1 flex items-end justify-between gap-2 px-1">
        {barData.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 flex flex-col items-center h-full justify-end group/bar relative"
          >
            {/* Hover Tooltip */}
            <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 bg-[#071938] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-xl pointer-events-none transition-all duration-200 z-30 whitespace-nowrap">
              {item.val}
            </div>

            {/* Background Guide Pillar */}
            <div className="w-full h-full bg-slate-200/70 rounded-t-md absolute inset-x-0 bottom-0 pointer-events-none" />

            {/* Animated Active Bar */}
            <div
              style={{ height: item.h }}
              className={`w-full relative rounded-t-md transition-all duration-300 ${item.wave} ${
                item.isPeak
                  ? "bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 shadow-sm shadow-emerald-500/20"
                  : "bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-500 group-hover/bar:from-blue-500 group-hover/bar:to-cyan-400"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Axis Day Labels */}
      <div className="flex justify-between px-1 pt-2 text-[10px] font-bold text-slate-400 border-t border-slate-200 mt-1.5">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span className="text-emerald-600 font-black flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Sun
        </span>
      </div>
    </div>
  );
}

// 4. Light Theme LINE CHART Component
function LineChartWidget({ id, accentColor }: { id: string; accentColor: string }) {
  return (
    <div className="w-full h-full relative flex items-end px-2 pt-2">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-40">
        <div className="border-b border-slate-200 w-full" />
        <div className="border-b border-slate-200 w-full" />
        <div className="border-b border-slate-200 w-full" />
      </div>

      {/* Waveform SVG */}
      <svg
        className="w-full h-full overflow-visible relative z-10"
        viewBox="0 0 200 65"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`line-glow-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Shaded Area Fill */}
        <path
          d="M 0 55 Q 30 46, 60 48 T 110 28 T 160 18 T 200 8 L 200 65 L 0 65 Z"
          fill={`url(#line-glow-grad-${id})`}
        />

        {/* Secondary Target Dashed Baseline */}
        <path
          d="M 0 60 Q 50 52, 100 40 T 200 24"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Glowing Main Curve */}
        <path
          d="M 0 55 Q 30 46, 60 48 T 110 28 T 160 18 T 200 8"
          fill="none"
          stroke={accentColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          className="animate-line-glow"
        />

        {/* Live Peak Node with Ring Indicator */}
        <circle cx="200" cy="8" r="4" fill="#ffffff" stroke={accentColor} strokeWidth="3" />

        {/* Intermediate Nodes */}
        <circle cx="60" cy="48" r="3" fill="#ffffff" stroke={accentColor} strokeWidth="2" />
        <circle cx="110" cy="28" r="3" fill="#ffffff" stroke={accentColor} strokeWidth="2" />
        <circle cx="160" cy="18" r="3" fill="#ffffff" stroke={accentColor} strokeWidth="2" />
      </svg>

      {/* Floating Top Right Tag */}
      <div className="absolute top-2 right-3 text-[9px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full shadow-2xs z-20">
        +195% Surge
      </div>
    </div>
  );
}

// Light Theme Interactive 3D Card
function ModernAnalyticsCard({ metric }: { metric: AnalyticsCardItem }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, isHovered: false });
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = metric.icon;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ rx: rotateX, ry: rotateY, isHovered: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, isHovered: false });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-4px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)",
        transition: tilt.isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
      }}
      className="w-[330px] sm:w-[360px] shrink-0 bg-white rounded-3xl border border-slate-200/90 hover:border-blue-400 p-5 sm:p-6 shadow-md hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden select-none" data-card-3d="analytics" data-card-density="regular"
    >
      {/* Top Accent Gradient Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${metric.color} opacity-90 group-hover:opacity-100 transition-opacity`}
      />

      <div>
        {/* Header: Category + Live Beacon Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">{metric.category}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{metric.liveTag}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-sm text-[#071938] group-hover:text-blue-600 transition-colors line-clamp-1 mb-3">
          {metric.title}
        </h3>

        {/* Big Metric Value + Positive Indicator */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#071938]">
            <CounterNumber value={metric.value} duration={1800} />
          </div>
          <div className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl shadow-2xs">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{metric.change}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CHARTS CONTAINER (Light Studio Display - 100% Contained & Aligned) */}
        {/* ========================================================================= */}
        <div className="h-32 w-full bg-[#F8FAFD] rounded-2xl p-2.5 border border-slate-200/90 flex items-center justify-center relative overflow-hidden group-hover:border-blue-300 transition-colors">
          {metric.chartType === "donut" && (
            <DonutChartWidget value={metric.value} />
          )}

          {metric.chartType === "pie" && <PieChartWidget />}

          {metric.chartType === "bar" && <BarChartWidget />}

          {metric.chartType === "line" && (
            <LineChartWidget id={metric.id} accentColor={metric.accentColor} />
          )}
        </div>
      </div>

      {/* Footer: Timeframe + CTA */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 mt-4">
        <span className="font-medium">{metric.timeframe}</span>
        <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-xs cursor-pointer">
          Live Data <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}

export default function AnalyticsCardsStrip() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-8 bg-[#F8FAFD] text-slate-900 border-y border-slate-200/80 overflow-hidden">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {/* Infinite Horizontal Scrolling Track */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing relative z-10"
      >
        <div className="animate-marquee-scroll flex gap-6 px-4 sm:px-8">
          {/* Doubled for seamless infinite marquee loop */}
          {[...analyticsMetrics, ...analyticsMetrics].map((metric, index) => (
            <ModernAnalyticsCard key={`${metric.id}-${index}`} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
