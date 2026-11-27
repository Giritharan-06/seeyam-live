import type { Values } from "@/lib/cms/fields";

export default function EditorialSection({ value }: { value: Values }) {
  return (
    <section className="border-b border-blue-100 bg-blue-50/70">
      <div className={`mx-auto grid max-w-7xl items-center gap-6 px-5 py-8 sm:px-8 ${value.image ? "md:grid-cols-[3fr_2fr]" : ""}`}>
        <div className="min-w-0 space-y-3">
          <h2 className="break-words text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{value.title}</h2>
          {value.description && <p className="max-w-3xl whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{value.description}</p>}
          {value.cta && value.href && <a className="inline-flex rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white" href={value.href}>{value.cta}</a>}
        </div>
        {value.image && <img className="aspect-video w-full rounded-xl object-cover" src={value.image} alt={value.imageAlt || ""} loading="lazy" />}
      </div>
    </section>
  );
}
