"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLeadModal } from "./LeadModalContext";

import { rememberEnquiryPrompt, suppressEnquiryPrompt, wasHandled } from "@/lib/enquiry-prompt";

function isBlocked() {
  return document.hidden ||
    Boolean(document.querySelector('[data-enquiry-blocking-overlay], dialog[open], [aria-modal="true"]')) ||
    Boolean(document.activeElement?.closest("input,select,textarea,[contenteditable=true]"));
}

export default function PublicEnquiryPrompt() {
  const { openLeadModal } = useLeadModal();
  const dialog = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (wasHandled()) return;
    let retry: number | undefined;
    function check() {
      if (wasHandled()) return;
      if (isBlocked()) { retry = window.setTimeout(check, 400); return; }
      setVisible(true);
    }
    const initial = window.setTimeout(check, 5000);
    const suppress = () => setVisible(false);
    window.addEventListener("seeyam-enquiry-prompt-handled", suppress);
    return () => {
      window.clearTimeout(initial);
      window.clearTimeout(retry);
      window.removeEventListener("seeyam-enquiry-prompt-handled", suppress);
    };
  }, []);

  useEffect(() => {
    if (!visible || !dialog.current || wasHandled()) return;
    const modal = dialog.current;
    const focused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    // Showing it consumes the session opportunity even if the tab is reloaded.
    rememberEnquiryPrompt();
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      if (focused instanceof HTMLElement && focused.isConnected) focused.focus();
    };
  }, [visible]);

  function close() { suppressEnquiryPrompt(); }

  if (!visible) return null;
  return <dialog ref={dialog} aria-labelledby="enquiry-prompt-title" aria-describedby="enquiry-prompt-summary"
    onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === event.currentTarget) close(); }}
    className="public-enquiry-prompt fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[min(38rem,calc(100%_-_2rem))] max-w-none overflow-y-auto rounded-3xl bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/65">
    <div className="relative grid sm:grid-cols-[8rem_minmax(0,1fr)]">
      <div aria-hidden="true" className="grid min-h-24 place-items-center bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-600 text-white">
        <img src="/images/redesign/career.webp" width={480} height={320} alt="" className="h-full max-h-32 w-full object-cover sm:max-h-none"/>
      </div>
      <button type="button" autoFocus aria-label="Close course enquiry prompt" onClick={close} className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100">
        <X size={19} aria-hidden="true"/>
      </button>
      <section className="space-y-4 p-5 sm:p-8 sm:pr-10">
        <h2 id="enquiry-prompt-title" className="text-2xl font-extrabold tracking-tight text-[#071938] sm:pr-4 sm:text-3xl">Find the program that fits your goals.</h2>
        <p id="enquiry-prompt-summary" className="text-sm leading-6 text-slate-700">Talk through the curriculum, learning options and schedule before you enroll.</p>
        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <button type="button" onClick={() => { close(); openLeadModal(); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800">Book a free demo <ArrowRight size={16} aria-hidden="true"/></button>
          <Link href="/courses" onClick={close} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-[#071938] hover:bg-blue-50">Explore courses</Link>
        </div>
      </section>
    </div>
  </dialog>;
}
