"use client";

import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";
import EditorialSection from "@/components/EditorialSection";
import { lines, names, type Kind, type Values } from "@/lib/cms/fields";

export default function CmsLivePreview({kind, values}: {kind:Kind; values:Values}) {
  const [mobile, setMobile] = useState(false);
  const heading = values.title || values.name || values.intro || names[kind];
  const details = [values.description || values.summary || values.body || values.story, values.mission, values.vision].filter(Boolean);
  return <aside className="min-w-0 self-start overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-indigo-50 p-4">
      <div><h2 className="font-bold text-indigo-950">Live content preview</h2><p className="text-xs text-indigo-800">Updates as you type</p></div>
      <div className="flex rounded-lg border bg-white p-1" aria-label="Preview width">
        {[false,true].map(phone => <button key={String(phone)} type="button" aria-pressed={phone === mobile} className={`rounded-md p-2 ${phone === mobile ? "bg-indigo-700 text-white" : "text-indigo-900"}`} aria-label={phone ? "Mobile preview" : "Desktop preview"} onClick={() => setMobile(phone)}>{phone ? <Smartphone size={16}/> : <Monitor size={16}/>}</button>)}
      </div>
    </div>
    <div className="bg-gradient-to-br from-violet-100 via-white to-sky-100 p-3 sm:p-5">
      <div className={`mx-auto overflow-hidden rounded-xl border border-indigo-100 bg-white ${mobile ? "max-w-[320px]" : "w-full"}`}>
        <div className="border-b px-4 py-3 text-xs font-extrabold tracking-wide text-indigo-950">SEEYAM</div>
        <div inert>
          {kind === "page" ? <EditorialSection value={{...values, title:heading}}/> : <div className="space-y-3 break-words p-5">
            {values.path && <p className="text-xs font-semibold text-emerald-800">{values.canonical || values.path}</p>}
            <h3 className="text-xl font-extrabold text-indigo-950">{heading}</h3>
            {kind === "home" && <p className="text-2xl font-extrabold text-indigo-800">{values.analytics || "Data Analytics"} <span className="text-violet-800">&amp; {values.marketing || "Digital Marketing."}</span></p>}
            {details.map((text,index) => <p key={index} className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{text}</p>)}
            {(values.image || values.socialImage) && <img src={values.image || values.socialImage} alt={values.imageAlt || values.alt || ""} className="max-h-56 w-full rounded-lg object-contain"/>}
            {lines(values.highlights || values.skills || values.syllabus).length > 0 && <ul className="list-disc space-y-1 pl-5 text-sm">{lines(values.highlights || values.skills || values.syllabus).map((value,index) => <li key={index}>{value}</li>)}</ul>}
            {[values.company, values.role, values.duration, values.phone, values.email, values.address].filter(Boolean).map((text,index) => <p key={index} className="text-sm text-slate-700">{text}</p>)}
            {values.cta && <span className="inline-block rounded-lg bg-indigo-700 px-3 py-2 text-sm font-bold text-white">{values.cta}</span>}
          </div>}
        </div>
      </div>
    </div>
  </aside>;
}
