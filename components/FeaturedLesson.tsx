"use client";

import { PlayCircle } from "lucide-react";
import { usePlatformData } from "./PlatformDataContext";
import { extractYoutubeEmbedUrl } from "@/lib/utils";

export default function FeaturedLesson(){
  const {heroMedia}=usePlatformData();
  const embedUrl=extractYoutubeEmbedUrl(heroMedia.youtubeUrl);
  return <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
    <div className="relative overflow-hidden rounded-3xl border border-[#16356c] bg-[#071938] p-4 shadow-xl shadow-blue-900/10 sm:p-5" data-card-3d="analytics" data-card-density="compact">
            <div className="mb-4 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-xs font-bold text-white"><PlayCircle size={17} className="text-amber-400" />Watch a featured lesson</span><span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-200">Learn with us</span></div>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
              <iframe src={embedUrl} loading="lazy" title="Seeyam featured learning video" className="h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-300">Get a feel for the learning experience, then talk to our team about your program.</p>
          </div>
  </section>;
}
