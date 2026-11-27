"use client";

import { useState } from "react";
import { usePlatformData } from "./PlatformDataContext";
import { trainers,existingTrainers } from "@/lib/cms/public";
export default function CmsDirectory({
  kind,
}: {
  kind: "gallery" | "trainer";
}) {
  const { cms = [],siteSettings } = usePlatformData();
  const [category, setCategory] = useState("");
  const rows =
    kind === "trainer"
      ? trainers([],existingTrainers(siteSettings?.about_trainers_json)).map(([id, values]) => ({ id, values }))
      : cms
          .filter((i) => i.kind === "gallery" && i.values)
          .map((i) => ({ id: i.id, values: i.values! }))
          .sort((a, b) => Number(a.values.order) - Number(b.values.order));
  return (
    <>
      <header className="public-banner public-banner--with-photo py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold">{kind === "gallery" ? "Gallery" : "Our trainers"}</h1>
        </div>
        <img className="public-banner-photo" src={kind === "gallery" ? "/images/card-photos/modern-library.jpg" : "/images/card-photos/online-mentor.jpg"} alt="" fetchPriority="high" />
      </header>
      <section className="public-directory mx-auto max-w-7xl px-5 py-14">
        {kind === "gallery" && rows.length > 0 && (
          <label className="mb-6 block">
            Category{" "}
            <select
              className="rounded border p-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {[...new Set(rows.map((r) => r.values.category))].map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
        )}
        {!rows.length && (
          <p>
            {kind === "gallery"
              ? "No gallery images have been published yet."
              : "No trainers are currently listed."}
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows
            .filter((r) => !category || r.values.category === category)
            .map(({ id, values: v }) => (
              <article
                key={id}
                className="overflow-hidden rounded-2xl border bg-white"
              >
                {v.image && (
                  <img
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                    src={v.image}
                    alt={v.alt || v.name || ""}
                  />
                )}
                <div className="space-y-2 p-5">
                  <h2 className="text-xl font-bold">{v.name || v.title}</h2>
                  <p>{v.role || v.category}</p>
                  {v.experience && <p>{v.experience}</p>}
                  {v.description && <p>{v.description}</p>}
                  {v.skills && <p>{v.skills.split("\n").join(" · ")}</p>}
                </div>
              </article>
            ))}
        </div>
      </section>
    </>
  );
}
