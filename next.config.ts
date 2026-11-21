import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function nextConfig(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    // Prerender one page at a time within the small production database pool.
    experimental: { cpus: 1, staticGenerationMaxConcurrency: 1 },
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "**" },
      ],
    },
  };
}
