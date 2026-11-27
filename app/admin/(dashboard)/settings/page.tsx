"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Bell, Download, Globe2, ShieldCheck, Users2, Video } from "lucide-react";
import { NotificationPreferences } from "@/components/admin/AdminTopbar";
import AdminHeader from "@/components/admin/AdminHeader";
import { exportLeadsCsv } from "@/actions/leads";
import { getHeroMedia, updateHeroMedia } from "@/actions/media";
import { INITIAL_HERO_MEDIA } from "@/lib/mock-data";
import { extractYoutubeEmbedUrl } from "@/lib/utils";

const links = [
  { href: "/admin/website-content", title: "Website profile", caption: "Manage public contact details, homepage content and branding copy.", icon: Globe2 },
  { href: "/admin/leads", title: "Lead CRM", caption: "Review and update incoming enquiries.", icon: Users2 },
  { href: "/admin/operations/notifications", title: "Staff notifications", caption: "Read and manage announcements.", icon: Bell },
  { href: "/admin/counselors", title: "Users & Roles", caption: "Manage counselor access and passwords.", icon: ShieldCheck },
];

export default function PlatformSettingsPage() {
  const [media, setMedia] = useState(INITIAL_HERO_MEDIA);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getHeroMedia().then(value => { setMedia(value); setReady(true); })
      .catch(() => setMessage("Could not load the hero media settings."));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await updateHeroMedia(media);
      setMessage(result.message);
    } catch {
      setMessage("Could not save hero media.");
    } finally { setBusy(false); }
  }

  async function download(format: "csv" | "json") {
    setBusy(true);
    try {
      const content = format === "csv" ? await exportLeadsCsv({}) : JSON.stringify(await getHeroMedia(), null, 2);
      const url = URL.createObjectURL(new Blob([content], { type: format === "csv" ? "text/csv;charset=utf-8" : "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = format === "csv" ? "seeyam-enquiries.csv" : "seeyam-hero-settings.json";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("Export prepared.");
    } catch {
      setMessage("Could not export this data.");
    } finally { setBusy(false); }
  }

  const video = extractYoutubeEmbedUrl(media.youtubeUrl);
  return <>
    <AdminHeader />
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-8">
      <header><h1 className="text-3xl font-extrabold text-[#071938]">Settings</h1><p className="mt-2 text-sm text-slate-600">Manage website media, staff access and exports.</p></header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{links.map(({href,title,caption,icon:Icon}) =>
        <Link key={href} href={href} className="rounded-xl border bg-white p-4 hover:border-blue-400">
          <div className="mb-3 flex justify-between text-blue-700"><Icon size={20}/><ArrowUpRight size={16}/></div>
          <h2 className="font-bold">{title}</h2><p className="mt-1 text-sm text-slate-600">{caption}</p>
        </Link>)}</div>
      <NotificationPreferences />
      <p role="status" className="text-sm text-blue-900">{message}</p>
      <div className="grid gap-5 lg:grid-cols-2">
        <form onSubmit={save} className="space-y-4 rounded-xl border bg-white p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Video size={20}/>Homepage video</h2>
          {(["youtubeUrl","title","subtitle","badge"] as const).map((key,index) =>
            <label key={key} className="block text-sm font-semibold">{["YouTube URL","Title","Subtitle","Badge"][index]}
              <input className="mt-1 w-full rounded-lg border p-2" disabled={!ready || busy} value={media[key]} onChange={event => setMedia({...media,[key]:event.target.value})}/>
            </label>)}
          <button disabled={!ready || busy} className="rounded-lg bg-blue-700 px-4 py-2 text-white disabled:opacity-50">Save video settings</button>
        </form>
        <section className="space-y-4 rounded-xl border bg-white p-5">
          <h2 className="text-xl font-bold">Video preview</h2>
          {video ? <iframe className="aspect-video w-full rounded-lg" title="Homepage video preview" src={video} allowFullScreen/> : <p>Enter a YouTube video URL to preview it.</p>}
        </section>
      </div>
      <section className="space-y-3 rounded-xl border bg-white p-5"><h2 className="flex items-center gap-2 text-xl font-bold"><Download size={20}/>Exports</h2>
        <div className="flex flex-wrap gap-3"><button disabled={busy} onClick={() => download("csv")} className="rounded-lg border px-4 py-2">Download enquiries CSV</button>
          <button disabled={busy} onClick={() => download("json")} className="rounded-lg border px-4 py-2">Download video settings JSON</button></div>
      </section>
    </main>
  </>;
}
