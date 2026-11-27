"use client";

import { Bell, BellRing, Check, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getNotificationInbox, setNotificationRead } from "@/actions/operations";

const preference = "seeyam-admin-notification-popups";
type Inbox = NonNullable<Awaited<ReturnType<typeof getNotificationInbox>>>;

export function NotificationPreferences() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => { setEnabled(localStorage.getItem(preference) !== "off"); }, []);
  return <label className="flex items-start justify-between gap-5 rounded-xl border border-violet-200 bg-violet-50 p-5">
    <span><span className="block font-bold text-violet-950">Notification pop-ups</span><span className="text-sm text-violet-800">Show new staff announcements while this browser is open.</span></span>
    <input type="checkbox" className="mt-1 size-5 accent-violet-700" checked={enabled} onChange={event => {
      setEnabled(event.target.checked);
      localStorage.setItem(preference, event.target.checked ? "on" : "off");
    }}/>
  </label>;
}

export default function AdminTopbar({ name, role }: {name:string; role:string}) {
  const [inbox, setInbox] = useState<Inbox | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Inbox["items"][number] | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const seen = useRef<Set<string> | null>(null);
  const menu = useRef<HTMLDivElement>(null);

  async function refresh() {
    const result = await getNotificationInbox().catch(() => null);
    setInbox(result);
    if (!result) return;
    const next = result.items.find(item => item.unread && seen.current && !seen.current.has(item.id));
    if (next && localStorage.getItem(preference) !== "off") setToast(next);
    seen.current = new Set(result.items.map(item => item.id));
  }

  useEffect(() => {
    void refresh();
    const poll = window.setInterval(() => { if (!document.hidden) void refresh(); }, 15000);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(poll); window.removeEventListener("focus", onFocus); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
  }, [open]);

  return <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-4 border-b border-indigo-100 bg-white/95 px-4 shadow-sm sm:px-8">
    <Link href="/admin" className="font-extrabold tracking-tight text-indigo-950">SEEYAM</Link>
    <div className="flex items-center gap-3 sm:gap-5">
      <div ref={menu} className="relative">
        <button type="button" aria-expanded={open} aria-label={`Notifications, ${inbox?.unread ?? 0} unread`} onClick={() => { setOpen(!open); setError(""); if (!open) void refresh(); }} className="relative rounded-xl bg-violet-100 p-2.5 text-violet-800 hover:bg-violet-200">
          <Bell size={20} aria-hidden="true"/>
          {!!inbox?.unread && <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-fuchsia-700 px-1 text-center text-xs font-bold text-white">{inbox.unread > 99 ? "99+" : inbox.unread}</span>}
        </button>
        {open && <section data-admin-popover className="absolute right-0 top-12 w-[min(76vw,23rem)] overflow-hidden rounded-2xl border bg-white shadow-2xl" aria-label="Notification inbox">
          <h2 className="border-b bg-violet-50 p-4 font-bold text-violet-950">Notifications</h2>
          <div className="max-h-80 overflow-y-auto">{!inbox ? <p className="p-4 text-sm">Inbox unavailable. Try opening it again.</p> : !inbox.items.length ? <p className="p-4 text-sm">No announcements yet.</p> : inbox.items.map(item =>
            <article key={item.id} className={`border-b p-4 ${item.unread ? "bg-indigo-50" : ""}`}>
              <div className="flex items-start justify-between gap-2"><h3 className="break-words font-bold">{item.title}</h3>{item.unread && <button aria-label={`Mark ${item.title} as read`} disabled={pending} className="text-indigo-800" onClick={async () => {
                setPending(true); setError("");
                try { const result = await setNotificationRead(item.id,true); if (result.ok) await refresh(); else setError(result.message); }
                catch { setError("Could not mark this announcement as read."); }
                finally { setPending(false); }
              }}><Check size={18}/></button>}</div>
              <p className="mt-1 line-clamp-3 break-words text-sm text-slate-600">{item.body}</p>
            </article>)}</div>
          {error && <p role="alert" className="p-3 text-sm text-rose-800">{error}</p>}
          <Link href="/admin/operations/notifications" onClick={() => setOpen(false)} className="block p-4 text-sm font-bold text-indigo-800">Open notification center</Link>
        </section>}
      </div>
      <div className="hidden max-w-36 text-right sm:block"><p className="truncate text-sm font-bold">{name}</p><p className="text-xs capitalize text-slate-600">{role.toLowerCase()}</p></div>
    </div>
    {toast && <aside role="status" className="fixed bottom-5 right-5 z-50 flex w-[min(88vw,23rem)] items-start gap-3 rounded-xl border border-violet-200 bg-white p-4 shadow-xl">
      <BellRing className="shrink-0 text-fuchsia-700" size={20}/><div className="min-w-0 flex-1"><p className="break-words font-bold">{toast.title}</p><p className="line-clamp-3 break-words text-sm text-slate-700">{toast.body}</p><Link className="mt-1 inline-block text-sm font-bold text-indigo-800" href="/admin/operations/notifications" onClick={() => setToast(null)}>View announcements</Link></div>
      <button aria-label="Dismiss announcement" onClick={() => setToast(null)}><X size={18}/></button>
    </aside>}
  </header>;
}
