import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(d);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function extractYoutubeEmbedUrl(url: string): string {
  const id = extractYoutubeId(url);
  if (id) {
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`;
  }
  if (url && url.includes("youtube.com/embed/")) {
    return url;
  }
  // Default fallback YouTube video (e.g. Next.js / Tech showcase)
  return "https://www.youtube-nocookie.com/embed/kqtD5dpn9C8?autoplay=0&rel=0&modestbranding=1";
}

export function decodeHtml(html: string): string {
  if (!html) return "";
  let clean = html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Fix common typo in CMS data if present
  clean = clean.replace(/\bDATA ANALYSIST\b/gi, "Data Analyst");
  clean = clean.replace(/\bANALYSIST\b/gi, "Analyst");

  return clean;
}
