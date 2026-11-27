"use client";

import React from "react";
import { usePlatformData } from "@/components/PlatformDataContext";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  lightText?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  showText = true,
  lightText = false,
}: LogoProps) {
  const { siteSettings } = usePlatformData();

  const brand1 = siteSettings?.brand_name_1 || "SEEYAM";
  const tagline = siteSettings?.brand_tagline || "IT Training • Certification • Placement";

  const sizeDimensions = {
    sm: { box: "h-8 w-11" },
    md: { box: "h-10 w-14" },
    lg: { box: "h-12 w-16" },
    xl: { box: "h-16 w-20" },
  };

  const { box } = sizeDimensions[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* SEEYAM lion mark */}
      <div
        className={`seeyam-mark ${box} p-0.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
      >
        <img
          src="/seeyam-lion.png"
          width={512}
          height={512}
          alt={showText ? "" : brand1}
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`seeyam-wordmark font-black ${size === "sm" ? "text-xs sm:text-sm" : "text-sm sm:text-lg"} tracking-tight ${
                lightText ? "text-white" : "text-[#071938]"
              }`}
            >
              {brand1}
            </span>
          </div>
          <div
            className={`seeyam-tagline hidden sm:block text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase ${
              lightText ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {tagline}
          </div>
        </div>
      )}
    </div>
  );
}
