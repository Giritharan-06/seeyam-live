"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { editContent } from "@/actions/cms";
import {
  fields,
  sections,
  names,
  singleton,
  seoId,
  type Kind,
  type Values,
} from "@/lib/cms/fields";
import type { EditorData, Entry } from "@/lib/cms/editor-data";
import CmsLivePreview from "./CmsLivePreview";
import CmsMedia from "./CmsMedia";

const input =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900";
const button =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50";
const label = (e: Entry) =>
  e.values.path || e.values.name || e.values.title || names[e.kind];
export default function CmsEditor({ data }: { data: EditorData }) {
  const router = useRouter();
  const [tab, setTab] = useState<Kind | "media" | "history">("home");
  const [item, setItem] = useState<Entry>(data.entries[0]),
    [v, setV] = useState<Values>(item.values);
  const [search, setSearch] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(v) !== JSON.stringify(item.values);
  function choose(e: Entry) {
    setItem(e);
    setV(e.values);
    setMessage("");
  }
  function canLeave() {
    return !dirty || confirm("Discard unsaved changes?");
  }
  function selectTab(k: typeof tab) {
    if (!canLeave()) return;
    setTab(k);
    setSearch("");
    setMessage("");
    if (k !== "media" && k !== "history") {
      const e = data.entries.find((e) => e.kind === k);
      choose(e || fresh(k));
    }
  }
  function fresh(k: Kind): Entry {
    return {
      kind: k,
      id: crypto.randomUUID(),
      version: 0,
      status: "New",
      values: k === "seo" ? { path: "/", indexing: "inherit" } : {},
    };
  }
  async function act(action: "save" | "publish" | "unpublish") {
    if (
      action !== "save" &&
      !confirm(
        action === "publish"
          ? "Publish the saved draft on the website?"
          : "Unpublish this content? Page settings revert to the existing design. Individual entries will be hidden.",
      )
    )
      return;
    const id = (item.kind === "seo" || item.kind === "page") ? seoId(v.path || "/") : item.id;
    setBusy(true);
    try {
      const r = await editContent(item.kind, id, item.version, action, v);
      setMessage(r.message);
      if (r.ok) {
        setItem({
          ...item,
          id,
          values: v,
          version: item.version + 1,
          status:
            action === "save"
              ? "Draft saved"
              : action === "publish"
                ? "Published"
                : "Unpublished",
        });
        router.refresh();
      }
    } catch {
      setMessage("Could not complete the request.");
    } finally {
      setBusy(false);
    }
  }
  const preview =
    item.version > 0 && !dirty
      ? "/admin/website-content/preview/" + item.kind + "/" + item.id
      : "";
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 text-slate-900 sm:p-8">
      <h1 className="text-3xl font-extrabold">Website Content</h1>
      <nav aria-label="Content editors" className="flex flex-wrap items-end gap-4 rounded-2xl border border-indigo-200 bg-white p-4">
        <label className="min-w-52 text-sm font-bold">Content workspace
          <select className={input} value={tab} onChange={e=>selectTab(e.target.value as typeof tab)} disabled={busy}>
            <optgroup label="Pages and sections">{(["home","page","about","contact"] as const).map(k=><option key={k} value={k}>{names[k]}</option>)}</optgroup>
            <optgroup label="Collections">{(["course","trainer","gallery","testimonial","placement"] as const).map(k=><option key={k} value={k}>{names[k]}</option>)}</optgroup>
            <optgroup label="Publishing tools"><option value="seo">Page SEO</option><option value="media">Media library</option><option value="history">Publishing history</option></optgroup>
          </select>
        </label>
      </nav>
      {tab === "media" ? (
        <CmsMedia items={data.media} />
      ) : tab === "history" ? (
        <section>
          <h2 className="text-xl font-bold">Recent publications</h2>
          {!data.events.length && <p>No publishing activity yet.</p>}
          {data.events.map((e) => (
            <p className="border-b py-2" key={e.kind + e.id + e.version}>
              {names[e.kind as Kind]} · {e.id} · {e.action} · {e.at}
            </p>
          ))}
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <aside className="space-y-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 lg:col-span-2">
            <label className="block text-sm font-semibold">
              Find content
              <input
                className={input}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            {!singleton(tab) && tab !== "page" && (
              <button
                className={button}
                disabled={busy}
                onClick={() => {
                  if (canLeave()) choose(fresh(tab));
                }}
              >
                Add {names[tab].toLowerCase().replace(/s$/, "")}
              </button>
            )}
            <ul className="max-h-96 overflow-auto">
              {data.entries
                .filter(
                  (e) =>
                    e.kind === tab &&
                    label(e).toLowerCase().includes(search.toLowerCase()),
                )
                .map((e) => (
                  <li key={e.id}>
                    <button
                      disabled={busy}
                      className="w-full border-b py-2 text-left text-sm"
                      onClick={() => {
                        if (canLeave()) choose(e);
                      }}
                    >
                      {label(e)}{" "}
                      <small className="text-slate-500">{e.status}</small>
                    </button>
                  </li>
                ))}
            </ul>
            {tab === "seo" && (
              <Link className="text-blue-700" href="/admin/seo">
                Sitemap and SEO tools
              </Link>
            )}
          </aside>
          <form
            className="space-y-5 rounded-2xl border bg-white p-5 sm:p-7"
            onSubmit={(e) => {
              e.preventDefault();
              void act("save");
            }}
          >
            <h2 className="text-xl font-bold">{label(item)}</h2>
            <p className="text-sm">{dirty ? "Unsaved changes" : item.status}</p>
            <fieldset disabled={busy} className="space-y-4">
              {fields[tab].map((f) => {
                const value = v[f.key] || "";
                const set = (x: string) => setV({ ...v, [f.key]: x });
                if(tab==="home" && f.key==="sections"){
                  const list=value.split("\n").filter(Boolean); const move=(index:number,step:number)=>{const next=[...list];[next[index],next[index+step]]=[next[index+step],next[index]];set(next.join("\n"));};
                  return <fieldset key={f.key} className="rounded-lg border p-3"><legend>Homepage sections</legend>{[...list,...sections.filter(k=>!list.includes(k))].map((k,i)=><div key={k} className="flex items-center justify-between gap-2 py-1"><label><input type="checkbox" checked={list.includes(k)} onChange={e=>set((e.target.checked?[...list,k]:list.filter(s=>s!==k)).join("\n"))}/> {k}</label>{list.includes(k)&&<div><button type="button" className={button} aria-label={"Move "+k+" up"} disabled={i===0} onClick={()=>move(i,-1)}>↑</button><button type="button" className={button} aria-label={"Move "+k+" down"} disabled={i===list.length-1} onClick={()=>move(i,1)}>↓</button></div>}</div>)}</fieldset>;
                }
                const opts = data.options[f.type as keyof typeof data.options];
                return (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold">
                      {f.label}
                      {f.required ? " *" : ""}
                      {f.type === "check" ? (
                        <input
                          className="ml-3"
                          type="checkbox"
                          checked={value === "true"}
                          onChange={(e) => set(String(e.target.checked))}
                        />
                      ) : opts ? (
                        <select
                          className={input}
                          required={f.required}
                          value={value}
                          onChange={(e) => set(e.target.value)}
                        >
                          <option value="">Select…</option>
                          {opts.map((o) => (
                            <option value={o.id} key={o.id}>
                              {o.name}
                            </option>
                          ))}
                        </select>
                      ) : f.type === "lines" || f.type === "paragraph" ? (
                        <textarea
                          className={input}
                          rows={4}
                          required={f.required}
                          value={value}
                          onChange={(e) => set(e.target.value)}
                        />
                      ) : (
                        <input
                          className={input}
                          disabled={
                            f.key === "path" && (tab === "page" || (tab === "seo" && item.version > 0))
                          }
                          required={f.required}
                          value={value}
                          type={
                            f.type === "number"
                              ? "number"
                              : f.type === "date"
                                ? "date"
                                : "text"
                          }
                          onChange={(e) => set(e.target.value)}
                        />
                      )}
                    </label>
                    {f.type === "image" && (
                      <>
                        <select
                          className={input}
                          aria-label={"Choose library image for " + f.label}
                          value={
                            data.media.some(
                              (i) => "/api/cms/media/" + i.id === value,
                            )
                              ? value
                              : ""
                          }
                          onChange={(e) => set(e.target.value)}
                        >
                          <option value="">Choose a library image…</option>
                          {data.media.map((i) => (
                            <option key={i.id} value={"/api/cms/media/" + i.id}>
                              {i.category ? i.category + " / " : ""}
                              {i.name}
                            </option>
                          ))}
                        </select>
                        {value && (
                          <img
                            alt="Selected image"
                            className="mt-2 h-20 rounded object-contain"
                            src={value}
                          />
                        )}
                      </>
                    )}
                    {tab === "home" && f.key === "testimonials" && (
                      <select
                        aria-label="Add featured testimonial"
                        className={input}
                        value=""
                        onChange={(e) => {
                          if (e.target.value)
                            set(
                              [
                                ...new Set([
                                  ...value.split("\n").filter(Boolean),
                                  e.target.value,
                                ]),
                              ].join("\n"),
                            );
                        }}
                      >
                        <option value="">Add a testimonial…</option>
                        {data.entries
                          .filter((e) => e.kind === "testimonial")
                          .map((e) => (
                            <option key={e.id} value={e.id}>
                              {label(e)}
                            </option>
                          ))}
                      </select>
                    )}
                    {tab === "home" && f.key === "featured" && (
                      <select
                        className={input}
                        aria-label="Add featured course"
                        value=""
                        onChange={(e) => {
                          if (e.target.value)
                            set(
                              [
                                ...new Set([
                                  ...value.split("\n").filter(Boolean),
                                  e.target.value,
                                ]),
                              ].join("\n"),
                            );
                        }}
                      >
                        <option value="">Add a featured course…</option>
                        {data.options.course.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </fieldset>
            <p role="status" aria-live="polite">
              {message}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button disabled={busy} className={button}>
                Save draft
              </button>
              {preview && (
                <Link href={preview} target="_blank" className={button}>
                  Preview saved draft
                </Link>
              )}
              <button
                type="button"
                disabled={dirty || busy || !item.version}
                onClick={() => act("publish")}
                className="rounded-lg bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
              >
                Publish
              </button>
              <button
                type="button"
                disabled={dirty || busy || !item.version}
                className={button}
                onClick={() => act("unpublish")}
              >
                {tab === "course" ? "Archive course" : "Unpublish"}
              </button>
            </div>
          </form>
          <CmsLivePreview key={item.id} kind={item.kind} values={v} />
        </div>
      )}
    </main>
  );
}
