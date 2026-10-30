"use client";

import React, { useEffect } from "react";
import { usePlatformData } from "@/components/PlatformDataContext";

const FONT_MAP: Record<string, string> = {
  Inter: "Inter:wght@300;400;500;600;700;800;900",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@300;400;500;600;700;800",
  Outfit: "Outfit:wght@300;400;500;600;700;800;900",
  Poppins: "Poppins:wght@300;400;500;600;700;800;900",
  Roboto: "Roboto:wght@300;400;500;700;900",
  "Space Grotesk": "Space+Grotesk:wght@300;400;500;600;700",
  Lexend: "Lexend:wght@300;400;500;600;700;800",
  "DM Sans": "DM+Sans:wght@400;500;700",
};

const PRESET_COLORS: Record<string, { primary: string; accent: string; dark: string }> = {
  default: { primary: "#2563eb", accent: "#d4af37", dark: "#071938" },
  gold:    { primary: "#2563eb", accent: "#d4af37", dark: "#071938" },
  emerald: { primary: "#059669", accent: "#d4af37", dark: "#06281e" },
  violet:  { primary: "#7c3aed", accent: "#ec4899", dark: "#1e1035" },
  indigo:  { primary: "#4f46e5", accent: "#06b6d4", dark: "#0b132b" },
  crimson: { primary: "#e11d48", accent: "#0284c7", dark: "#0f172a" },
};

export default function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { siteSettings } = usePlatformData();

  const preset = siteSettings?.theme_preset || "default";
  const presetDefaults = PRESET_COLORS[preset] || PRESET_COLORS.default;

  const primaryColor = siteSettings?.primary_color || presetDefaults.primary;
  const accentColor = siteSettings?.accent_color || presetDefaults.accent;
  const darkColor = siteSettings?.dark_color || presetDefaults.dark;
  const fontFamily = siteSettings?.font_family || "Inter";
  const borderRadius = siteSettings?.border_radius || "24px";

  // Google Font URL
  const fontSpec = FONT_MAP[fontFamily] || FONT_MAP["Inter"];
  const googleFontHref = `https://fonts.googleapis.com/css2?family=${fontSpec}&display=swap`;

  const gaId = siteSettings?.seo_ga_id;
  const gtmId = siteSettings?.seo_gtm_id;

  useEffect(() => {
    // Dynamic Google Font Injection
    const linkId = "seeyam-dynamic-font";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = googleFontHref;

    // Dynamic Google Analytics (GA4) Injection
    if (gaId && !document.getElementById("seeyam-ga-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "seeyam-ga-script";
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gaScript);

      const gaInline = document.createElement("script");
      gaInline.id = "seeyam-ga-inline";
      gaInline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(gaInline);
    }
  }, [googleFontHref, gaId, gtmId]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --primary-brand: ${primaryColor};
            --accent-brand: ${accentColor};
            --accent-brand-hover: #b8860b;
            --accent-brand-dark: #92640a;
            --accent-brand-glow: ${accentColor}55;
            --accent-brand-light: #fbf7ee;
            --accent-brand-border: #ebd99f;
            --dark-brand: ${darkColor};
            --font-family-brand: "${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --radius-brand: ${borderRadius};
          }

          body {
            font-family: var(--font-family-brand) !important;
          }

          /* ---------------- PRIMARY COLOR OVERRIDES ---------------- */
          .bg-blue-600, .bg-blue-700, .hover\\:bg-blue-700:hover {
            background-color: var(--primary-brand) !important;
          }
          .text-blue-600, .text-blue-700 {
            color: var(--primary-brand) !important;
          }
          .border-blue-600, .border-blue-500, .hover\\:border-blue-400:hover {
            border-color: var(--primary-brand) !important;
          }

          /* ---------------- GOLD ACCENT COLOR OVERRIDES (ALL ORANGE/AMBER TO GOLD) ---------------- */
          .bg-orange-500, .bg-orange-600, .bg-amber-500, .bg-amber-600,
          .hover\\:bg-orange-600:hover, .hover\\:bg-amber-600:hover, .hover\\:bg-orange-500:hover {
            background-color: var(--accent-brand) !important;
          }
          .bg-orange-500\\/10, .bg-orange-500\\/20, .bg-amber-500\\/20, .bg-orange-500\\/30 {
            background-color: var(--accent-brand-light) !important;
          }
          .text-orange-400, .text-orange-500, .text-amber-400, .text-amber-500 {
            color: var(--accent-brand) !important;
          }
          .text-orange-600, .text-orange-700, .text-amber-600, .text-amber-700 {
            color: var(--accent-brand-dark) !important;
          }
          .text-orange-300, .text-amber-300 {
            color: #eed68a !important;
          }
          .fill-orange-400, .fill-orange-500, .fill-amber-400, .fill-amber-500 {
            fill: var(--accent-brand) !important;
          }
          .border-orange-500, .border-orange-400, .border-amber-400, .border-amber-500 {
            border-color: var(--accent-brand) !important;
          }
          .border-orange-200, .border-orange-300, .border-amber-200, .border-amber-300,
          .border-orange-500\\/20, .border-orange-500\\/30 {
            border-color: var(--accent-brand-border) !important;
          }
          .bg-orange-50, .bg-amber-50 {
            background-color: var(--accent-brand-light) !important;
          }
          .text-orange-600.bg-orange-50, .text-orange-700.bg-orange-50,
          .text-amber-600.bg-amber-50, .text-amber-700.bg-amber-50 {
            color: var(--accent-brand-dark) !important;
          }

          /* Accent Buttons & Badges with Luxury Gold Gradients */
          .from-orange-500, .from-orange-600, .hover\\:from-orange-600:hover, .hover\\:from-orange-500:hover {
            --tw-gradient-from: #e5b242 var(--tw-gradient-from-position) !important;
            --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position) !important;
            --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
          }
          .to-amber-500, .to-amber-600, .hover\\:to-amber-600:hover, .to-orange-500, .to-orange-600 {
            --tw-gradient-to: #b8860b var(--tw-gradient-to-position) !important;
          }
          .bg-gradient-to-r.from-orange-500.to-amber-500,
          .bg-gradient-to-r.from-orange-600.to-amber-600 {
            background-image: linear-gradient(135deg, #e5b242 0%, #d4af37 50%, #b8860b 100%) !important;
          }

          /* Accent Glow & Shadows */
          .shadow-orange-500\\/25, .shadow-orange-500\\/30, .shadow-orange-500\\/40, .shadow-orange-500 {
            box-shadow: 0 10px 25px -5px var(--accent-brand-glow) !important;
          }

          /* ---------------- DARK BACKGROUND OVERRIDES ---------------- */
          .bg-\\[\\#071938\\] {
            background-color: var(--dark-brand) !important;
          }

          /* ---------------- CORNER RADIUS OVERRIDES ---------------- */
          .rounded-3xl {
            border-radius: var(--radius-brand) !important;
          }
        `,
        }}
      />
      {children}
    </>
  );
}
