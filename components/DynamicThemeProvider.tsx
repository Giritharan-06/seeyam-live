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

export default function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
  const { siteSettings } = usePlatformData();

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
            --font-family-brand: "${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --radius-brand: ${borderRadius};
          }

          body {
            font-family: var(--font-family-brand) !important;
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
