"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BookOpen, Code2, FileCheck2, FileText, Globe2, ListFilter, Search } from "lucide-react";
import { savePageSeo, saveRobotsSeo } from "@/actions/seo";
import { defaultRobots, emptySeo, isSitemapEligible, privateCrawlPaths, seoFields, type SeoFields, type SeoTarget } from "@/lib/seo-fields";
import type { SeoSettings } from "@/lib/seo-store";

const panel = "min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6";
const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800";
const button = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50";
const link = "inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline";

type Result = { success?: boolean; message: string };

function Status({ result }: { result: Result | null }) {
  if (!result) return null;
  return <p role={result.success ? "status" : "alert"} className={result.success ? "text-sm text-emerald-800" : "text-sm text-red-700"}>{result.message}</p>;
}

function PageEditor({ target, initial, writable, origin }: {
  target: SeoTarget; initial: SeoFields; writable: boolean; origin: string;
}) {
  const router = useRouter();
  const [fields, setFields] = useState(initial);
  const [savedFields, setSavedFields] = useState(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const dirty = JSON.stringify(fields) !== JSON.stringify(savedFields);
  const title = fields.title || (target.path === "/" ? target.title : target.title + " | Seeyam Technologies");
  const description = fields.description || target.description;
  const pageUrl = origin + target.path;
  const socialImage = fields.socialImage || target.image;
  const set = (field: keyof SeoFields, value: string) => setFields(current => ({ ...current, [field]: value }));

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = seoFields.safeParse(fields);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setResult({ message: (issue.path.length ? `${issue.path[0]}: ` : "") + issue.message });
      return;
    }
    setPending(true);
    setResult(null);
    try {
      const response = await savePageSeo(target.path, parsed.data);
      setResult(response);
      if (response.success) {
        setSavedFields(parsed.data);
        setFields(parsed.data);
        router.refresh();
      }
    } catch {
      setResult({ message: "Save failed. Check your connection and try again." });
    } finally {
      setPending(false);
    }
  }

  function field(key: Exclude<keyof SeoFields, "indexing">, label: string, options: { placeholder?: string; multiline?: boolean; limit?: number; guide?: number } = {}) {
    return <label className="block space-y-1.5 text-sm font-semibold text-slate-800">
      <span>{label}</span>
      {options.multiline ?
        <textarea className={input + (key === "structuredData" ? " font-mono" : "")} value={fields[key]} rows={key === "structuredData" ? 7 : 3}
          maxLength={options.limit} placeholder={options.placeholder} onChange={event => set(key, event.target.value)} /> :
        <input className={input} value={fields[key]} maxLength={options.limit} placeholder={options.placeholder} onChange={event => set(key, event.target.value)} />}
      {options.guide && <span className="block text-xs font-normal text-slate-600">{fields[key].length} characters · suggested length around {options.guide}</span>}
    </label>;
  }

  return <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
    <form className={panel + " space-y-5"} onSubmit={save}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div><h2 className="text-lg font-bold">Edit SEO</h2><p className="break-all text-sm text-slate-600">{target.path}</p></div>
        <a className={link + " text-sm"} href={target.path} target="_blank" rel="noreferrer">Open public page <ArrowUpRight size={16} /></a>
      </div>
      <fieldset disabled={pending || !writable} className="min-w-0 space-y-5">
        {field("title", "Meta title", { placeholder: title, limit: 150, guide: 60 })}
        {field("description", "Meta description", { placeholder: target.description, multiline: true, limit: 400, guide: 160 })}
        {field("focusKeywords", "Focus keywords", { placeholder: "Separate phrases with commas", limit: 300 })}
        {field("canonical", "Canonical URL", { placeholder: pageUrl, limit: 2048 })}
        <label className="block space-y-1.5 text-sm font-semibold"><span>Search indexing</span>
          <select className={input} value={fields.indexing} onChange={event => set("indexing", event.target.value)}>
            <option value="inherit">Use page default</option><option value="index">Index</option><option value="noindex">Noindex</option>
          </select>
        </label>
        <details className="rounded-xl border border-slate-200 p-4">
          <summary className="cursor-pointer text-sm font-bold">Open Graph and social sharing</summary>
          <div className="mt-4 space-y-4">
            {field("ogTitle", "Social title", { placeholder: title, limit: 150 })}
            {field("ogDescription", "Social description", { placeholder: description, multiline: true, limit: 400 })}
            {field("socialImage", "Social sharing image URL", { placeholder: target.image || "https://… or /images/…", limit: 2048 })}
            {field("imageAlt", "Image alt text", { placeholder: target.imageAlt || "Describe the image", limit: 250 })}
            <p className="text-xs text-slate-600">Applies to sharing images and the main featured image on WordPress pages.</p>
          </div>
        </details>
        <details className="rounded-xl border border-slate-200 p-4">
          <summary className="cursor-pointer text-sm font-bold">Structured data</summary>
          <div className="mt-4">{field("structuredData", "Additional Schema.org JSON-LD", { multiline: true, limit: 12000, placeholder: '{"@context":"https://schema.org","@type":"WebPage"}' })}</div>
        </details>
        <div className="flex flex-wrap items-center gap-3">
          <button className={button} disabled={!dirty || pending}>{pending ? "Saving…" : "Save SEO settings"}</button>
          <button type="button" className="min-h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold disabled:opacity-50" disabled={!dirty}
            onClick={() => { setFields(savedFields); setResult(null); }}>Reset changes</button>
        </div>
      </fieldset>
      <Status result={result} />
    </form>
    <aside className="min-w-0 space-y-5">
      <section className={panel}>
        <h2 className="flex items-center gap-2 font-bold"><Search size={18} /> Search preview</h2>
        <p className="mt-4 break-all text-xs text-slate-600">{fields.canonical || pageUrl}</p>
        <p className="mt-1 break-words text-lg text-blue-800">{title}</p>
        <p className="mt-1 break-words text-sm text-slate-700">{description}</p>
        {fields.indexing === "noindex" && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Saving this setting excludes the page from the sitemap and asks search engines to skip indexing.</p>}
      </section>
      <section className={panel}>
        <h2 className="flex items-center gap-2 font-bold"><Globe2 size={18} /> Social preview</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          {socialImage && /^(https?:\/\/|\/(?!\/))/i.test(socialImage) &&
            <img src={socialImage} alt={fields.imageAlt || target.imageAlt || ""} referrerPolicy="no-referrer" className="aspect-[1.91] w-full bg-slate-100 object-cover" />}
          <div className="space-y-1 bg-slate-50 p-4"><p className="text-xs text-slate-600">{new URL(origin).host}</p>
          <p className="break-words font-bold">{fields.ogTitle || title}</p><p className="break-words text-sm text-slate-700">{fields.ogDescription || description}</p></div>
        </div>
      </section>
    </aside>
  </div>;
}

function CrawlTools({ initial, writable }: { initial: typeof defaultRobots; writable: boolean }) {
  const router = useRouter();
  const [allow, setAllow] = useState(initial.allow.join("\n"));
  const [disallow, setDisallow] = useState(initial.disallow.join("\n"));
  const [advertiseSitemap, setAdvertise] = useState(initial.advertiseSitemap);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const lines = (value: string) => value.split("\n").map(path => path.trim()).filter(Boolean);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    try {
      const response = await saveRobotsSeo({ allow: lines(allow), disallow: lines(disallow), advertiseSitemap });
      setResult(response);
      if (response.success) router.refresh();
    } catch {
      setResult({ message: "Save failed. Check your connection and try again." });
    } finally {
      setPending(false);
    }
  }

  return <div className="grid items-start gap-5 xl:grid-cols-[2fr_1fr]">
    <form onSubmit={save} className={panel + " space-y-4"}>
      <h2 className="text-lg font-bold">robots.txt</h2>
      <p className="text-sm text-slate-600">Enter one site-relative path per line. The admin and API routes are always excluded.</p>
      <fieldset disabled={pending || !writable} className="min-w-0 space-y-4">
        <label className="block space-y-1 text-sm font-semibold">Allow paths<textarea className={input + " font-mono"} value={allow} onChange={event => setAllow(event.target.value)} rows={3} /></label>
        <label className="block space-y-1 text-sm font-semibold">Additional disallow paths<textarea className={input + " font-mono"} value={disallow} onChange={event => setDisallow(event.target.value)} rows={4} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={advertiseSitemap} onChange={event => setAdvertise(event.target.checked)} /> Include sitemap URL in robots.txt</label>
        <button className={button}>{pending ? "Saving…" : "Save crawl rules"}</button>
      </fieldset>
      <Status result={result} />
    </form>
    <section className={panel + " space-y-3"}>
      <h2 className="text-lg font-bold">Published files</h2>
      <p className="text-sm text-slate-600">The sitemap uses current public URLs and updates when SEO settings change.</p>
      <a href="/sitemap.xml" className={link + " flex text-sm"} target="_blank" rel="noreferrer">Open sitemap.xml <ArrowUpRight size={16} /></a>
      <a href="/robots.txt" className={link + " flex text-sm"} target="_blank" rel="noreferrer">Open robots.txt <ArrowUpRight size={16} /></a>
      <p className="text-xs text-slate-600">Protected crawl paths {privateCrawlPaths.join(", ")}</p>
    </section>
  </div>;
}

type Tab = "overview" | "page" | "blog" | "course" | "tools";
const tabs = [{ id: "overview", label: "Overview" }, { id: "page", label: "Website pages" }, { id: "blog", label: "Blog SEO" }, { id: "course", label: "Course SEO" }, { id: "tools", label: "Sitemap & crawl rules" }] as const;

export default function SeoManager({ targets, settings, writable, origin, notice }: {
  targets: SeoTarget[]; settings: SeoSettings | null; writable: boolean; origin: string; notice?: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [path, setPath] = useState("/");
  const [query, setQuery] = useState("");
  const records = new Map(settings?.pages.map(record => [record.path, record]));
  const eligible = targets.filter(target => isSitemapEligible(target.path, records.get(target.path)?.fields, origin)).length;
  const custom = targets.filter(target => records.has(target.path)).length;
  const metrics = [
    { label: "Public URLs", count: targets.length, icon: Globe2, tone: "bg-blue-50 text-blue-900" },
    { label: "Sitemap entries", count: eligible, icon: FileCheck2, tone: "bg-emerald-50 text-emerald-900" },
    { label: "Saved SEO overrides", count: settings ? custom : "Unavailable", icon: FileText, tone: "bg-violet-50 text-violet-900" },
    { label: "Blog articles", count: targets.filter(target => target.kind === "blog").length, icon: BookOpen, tone: "bg-amber-50 text-amber-900" },
  ];
  const choices = targets.filter(target => tab === "page" ? target.kind === "page" || target.kind === "campus" : target.kind === tab);
  const selected = choices.find(target => target.path === path) || choices[0];
  const shown = targets.filter(target => (target.title + " " + target.path).toLowerCase().includes(query.trim().toLowerCase()));

  return <main className="mx-auto w-full min-w-0 max-w-7xl space-y-5 p-3 sm:p-6 lg:p-8">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-100 p-3 text-indigo-700"><Search size={24} /></span>
        <div><h1 className="text-2xl font-extrabold tracking-tight">SEO Management</h1><p className="text-sm text-slate-600">Manage how SEEYAM appears in search and social shares.</p></div>
      </div>
      <a href="/sitemap.xml" target="_blank" rel="noreferrer" className={link + " text-sm"}>View sitemap <ArrowUpRight size={16} /></a>
    </div>
    {notice && <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">{notice}</p>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ label, count, icon: Icon, tone }) => <div key={label} className={"rounded-xl border border-slate-200 p-4 " + tone}>
        <p className="flex items-center gap-2 text-sm font-semibold"><Icon size={18} /> {label}</p><p className="mt-2 text-xl font-extrabold">{count}</p>
      </div>)}
    </div>
    <nav aria-label="SEO sections" className="flex flex-wrap gap-2">
      {tabs.map(({ id, label }) => <button type="button" key={id} aria-pressed={tab === id} onClick={() => setTab(id)}
        className={"min-h-10 rounded-lg px-3 text-sm font-semibold " + (tab === id ? "bg-indigo-700 text-white" : "border border-slate-200 bg-white hover:border-indigo-400")}>{label}</button>)}
    </nav>
    {tab === "overview" ? <section className={panel + " space-y-4"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold"><ListFilter size={19} /> Page SEO overview</h2>
        <label className="w-full sm:max-w-xs"><span className="sr-only">Filter public pages</span><input type="search" className={input} placeholder="Filter by title or URL" value={query} onChange={event => setQuery(event.target.value)} /></label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="bg-slate-50 text-slate-700"><tr><th scope="col" className="p-3">Page and SEO title</th><th scope="col" className="p-3">Metadata</th><th scope="col" className="p-3">Index setting</th><th scope="col" className="p-3">Action</th></tr></thead>
          <tbody>{shown.map(target => {
            const fields = records.get(target.path)?.fields;
            return <tr key={target.path} className="border-b border-slate-100">
              <td className="p-3"><p className="font-semibold">{fields?.title || target.title}</p><p className="text-xs text-slate-600">{target.path}</p></td>
              <td className="p-3">{fields ? "Custom" : "Default"}</td><td className="p-3">{fields?.indexing === "noindex" ? "Noindex" : "Index allowed"}</td>
              <td className="p-3"><button type="button" className={link} aria-label={"Edit SEO for " + target.title}
                onClick={() => { setPath(target.path); setTab(target.kind === "blog" || target.kind === "course" ? target.kind : "page"); }}>Edit <Code2 size={15} /></button></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      {!shown.length && <p className="text-sm text-slate-600">No public pages match your search.</p>}
    </section> : tab === "tools" ? <CrawlTools initial={settings?.robots || defaultRobots} writable={writable} /> :
      <div className="space-y-4">
        <label className="block max-w-xl space-y-1 text-sm font-semibold">Choose a public URL
          <select className={input} value={selected?.path || ""} disabled={!selected} onChange={event => setPath(event.target.value)}>
            {choices.map(target => <option key={target.path} value={target.path}>{target.title} · {target.path}</option>)}
          </select>
        </label>
        {selected ? <PageEditor key={selected.path} target={selected} initial={records.get(selected.path)?.fields || emptySeo} writable={writable} origin={origin} /> :
          <p className="text-sm text-slate-600">No published content is available in this section.</p>}
      </div>}
  </main>;
}
