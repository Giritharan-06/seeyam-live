"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Media } from "@/lib/cms/media";
import { removeMedia, replaceDraftMedia } from "@/actions/cms";
export default function CmsMedia({ items }: { items: Media[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [search, setSearch] = useState("");
  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold">Media library</h2>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form),
            file = data.get("file") as File;
          if (!file || file.size > 4194304) {
            setMessage("Choose an image under 4 MB.");
            return;
          }
          setBusy(true);
          try {
            const q = new URLSearchParams({
              name: file.name,
              category: String(data.get("category") || ""),
            });
            const res = await fetch("/api/cms/media?" + q, {
              method: "POST",
              body: file,
            });
            if (!res.ok) throw Error();
            form.reset();
            setMessage("Image uploaded. Select it in a draft to publish it.");
            router.refresh();
          } catch {
            setMessage("Upload failed. Check the image and storage settings.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          JPEG, PNG or WebP · 4 MB max
          <input
            className="block"
            required
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
          />
        </label>
        <label>
          Folder
          <input
            className="block rounded border p-2"
            name="category"
            maxLength={100}
          />
        </label>
        <button
          className="rounded bg-blue-700 px-4 py-2 text-white"
          disabled={busy}
        >
          Upload image
        </button>
      </form>
      <p role="status">{message}</p>
      <label>
        Search images or folders
        <input
          className="ml-2 rounded border p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {!items.length && <p>Your media library is empty.</p>}
      <div className="grid gap-3 sm:grid-cols-3">
        {items
          .filter((i) =>
            (i.name + " " + i.category)
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((i) => (
            <article key={i.id} className="rounded-xl border p-3">
              <img
                className="aspect-video w-full object-contain"
                src={"/api/cms/media/" + i.id}
                alt={i.name}
              />
              <p className="break-all">{i.name}</p>
              <small>{i.category}</small>
              {items.length > 1 && (
                <label className="block text-sm">
                  Replace in saved drafts
                  <select
                    disabled={busy}
                    className="mt-1 w-full rounded border p-1"
                    value=""
                    onChange={async (e) => {
                      const next = e.target.value;
                      if (
                        !next ||
                        !confirm(
                          "Replace this image in saved drafts? Publish each draft to update the website.",
                        )
                      )
                        return;
                      setBusy(true);
                      try {
                        const r = await replaceDraftMedia(i.id, next);
                        setMessage(r.message);
                        router.refresh();
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <option value="">Choose replacement…</option>
                    {items
                      .filter((other) => other.id !== i.id)
                      .map((other) => (
                        <option key={other.id} value={other.id}>
                          {other.name}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              <button
                disabled={busy}
                className="block text-red-700"
                onClick={async () => {
                  if (!confirm("Delete this unused image?")) return;
                  setBusy(true);
                  try {
                    const result = await removeMedia(i.id);
                    setMessage(result.message);
                    router.refresh();
                  } catch {
                    setMessage("Could not delete image.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Delete unused image
              </button>
            </article>
          ))}
      </div>
    </section>
  );
}
