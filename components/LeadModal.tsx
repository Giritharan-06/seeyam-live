"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CalendarCheck, CheckCircle, Download, X } from "lucide-react";
import { submitPublicLead } from "@/actions/leads";
import { contactDetails, whatsappHref } from "@/lib/contact";
import { publicLeadSchema, type PublicLeadInput } from "@/lib/validations/schema";
import { usePlatformData } from "./PlatformDataContext";

interface LeadModalProps {
  onClose: () => void;
  initialCourseId?: string;
  initialBranchId?: string;
  initialReason?: PublicLeadInput["reason"];
  initialBrochureUrl?: string;
}

const inputStyle = "w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-base text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#a63d00] sm:text-sm";
const fields = [
  { id: "fullName", label: "Full name", type: "text", autoComplete: "name" },
  { id: "email", label: "Email address", type: "email", autoComplete: "email" },
  { id: "phone", label: "Mobile number", type: "tel", autoComplete: "tel-national" },
] as const;

export default function LeadModal({
  onClose, initialCourseId, initialBranchId, initialReason = "ENQUIRY", initialBrochureUrl,
}: LeadModalProps) {
  const { courses, branches, siteSettings } = usePlatformData();
  const dialog = useRef<HTMLDialogElement>(null);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(initialBrochureUrl);
  const brochure = initialReason === "BROCHURE_DOWNLOAD";
  const demo = initialReason === "DEMO_VIDEO";
  const campus = branches.find(branch => branch.id === initialBranchId) ?? branches[0];
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PublicLeadInput>({
    resolver: zodResolver(publicLeadSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", courseId: initialCourseId || "", branchId: campus?.id || "",
      source: brochure ? "Brochure Download Modal" : demo ? "Book a Free Demo" : "Global Lead Modal",
      reason: initialReason, learningFormat: "", batchTiming: "",
    },
  });

  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  async function onSubmit(data: PublicLeadInput) {
    setServerError("");
    try {
      const result = await submitPublicLead(data);
      if (!result.success) {
        setServerError(result.message);
        return;
      }
      setServerSuccess(result.message);
      if (result.data?.brochureUrl) setDownloadUrl(result.data.brochureUrl);
    } catch {
      setServerError("Your request could not be submitted. Please try again or contact us on WhatsApp.");
    }
  }

  const title = brochure ? "Download the course syllabus" : demo ? "Book a free demo" : "Talk to a course advisor";
  return (
    <dialog
      ref={dialog}
      aria-labelledby="lead-modal-title"
      aria-describedby="lead-modal-description"
      onCancel={event => { event.preventDefault(); if (!isSubmitting) onClose(); }}
      className="public-enquiry-prompt fixed inset-0 m-auto max-h-[calc(100dvh_-_2rem)] w-[min(34rem,calc(100%_-_2rem))] max-w-none overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-950 shadow-2xl backdrop:bg-black/65"
    >
      <header className="relative border-b-4 border-[#f56300] bg-[#111111] px-5 py-5 pr-14 text-white sm:px-7 sm:pr-16">
        <CalendarCheck size={22} className="mb-2 text-[#ff994f]" aria-hidden="true" />
        <h2 id="lead-modal-title" className="text-xl font-extrabold sm:text-2xl">{title}</h2>
        <p id="lead-modal-description" className="mt-1 text-sm leading-relaxed text-neutral-200">
          {brochure ? "Enter your details to access the modules and projects." : "Tell us what you’d like to learn so our team can suggest a session that fits."}
        </p>
        <button type="button" autoFocus aria-label="Close enquiry form" disabled={isSubmitting} onClick={onClose} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/35 text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff994f] disabled:opacity-50">
          <X size={19} aria-hidden="true" />
        </button>
      </header>
      <div className="p-5 sm:px-7 sm:py-6">
        {serverSuccess ? (
          <div className="space-y-4" role="status">
            <CheckCircle size={28} className="text-[#a63d00]" aria-hidden="true" />
            <p className="font-semibold">{serverSuccess}</p>
            {brochure && <a href={downloadUrl || "/resources/brochures/seeyam-syllabus.pdf"} download className="premiere-primary">
              <Download size={17} aria-hidden="true" /> Download syllabus
            </a>}
            <button type="button" onClick={onClose} className="block rounded-lg border border-neutral-300 px-4 py-2 font-semibold hover:bg-neutral-100">Done</button>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            {serverError && <p role="alert" className="rounded-lg border border-[#f4c5a9] bg-[#fff3eb] p-3 text-sm text-[#8d3200] sm:col-span-2">{serverError}</p>}
            {fields.map(field => (
              <div key={field.id} className={field.id === "fullName" ? "sm:col-span-2" : undefined}>
                <label htmlFor={field.id} className="mb-1 block text-sm font-semibold">{field.label} <span className="text-[#a63d00]">*</span></label>
                <input id={field.id} type={field.type} autoComplete={field.autoComplete} required {...register(field.id)}
                  aria-invalid={Boolean(errors[field.id])}
                  aria-describedby={errors[field.id] ? field.id + "-error" : undefined} className={inputStyle} />
                {errors[field.id] && <p id={field.id + "-error"} className="mt-1 text-sm text-[#8d3200]">{errors[field.id]?.message}</p>}
              </div>
            ))}
            <div className="min-w-0 sm:col-span-2">
              <label htmlFor="lead-course" className="mb-1 block text-sm font-semibold">Course of interest <span className="text-[#a63d00]">*</span></label>
              <select id="lead-course" required {...register("courseId")} aria-invalid={Boolean(errors.courseId)} aria-describedby={errors.courseId ? "lead-course-error" : undefined} className={inputStyle}>
                <option value="">Choose a course</option>
                {courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}
              </select>
              {errors.courseId && <p id="lead-course-error" className="mt-1 text-sm text-[#8d3200]">{errors.courseId.message}</p>}
            </div>
            {branches.length > 1 ? (
              <div className="sm:col-span-2">
                <label htmlFor="lead-campus" className="mb-1 block text-sm font-semibold">Preferred campus <span className="text-[#a63d00]">*</span></label>
                <select id="lead-campus" {...register("branchId")} required className={inputStyle}>
                  {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name} ({branch.city})</option>)}
                </select>
              </div>
            ) : <input type="hidden" {...register("branchId")} />}
            {!brochure && <>
              <div>
                <label htmlFor="learning-format" className="mb-1 block text-sm font-semibold">Learning format <span className="font-normal text-neutral-600">(optional)</span></label>
                <select id="learning-format" {...register("learningFormat")} className={inputStyle}>
                  <option value="">Select format</option><option>Classroom</option><option>Live online</option><option>Either</option>
                </select>
              </div>
              <div>
                <label htmlFor="batch-timing" className="mb-1 block text-sm font-semibold">Batch timing <span className="font-normal text-neutral-600">(optional)</span></label>
                <select id="batch-timing" {...register("batchTiming")} className={inputStyle}>
                  <option value="">Select timing</option><option>Weekdays</option><option>Weekends</option><option>Flexible</option>
                </select>
              </div>
            </>}
            <div className="space-y-2 sm:col-span-2">
              {!campus && <p className="text-sm text-[#8d3200]">Online requests are temporarily unavailable.</p>}
              <button type="submit" disabled={isSubmitting || !campus} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#f56300] px-4 py-2.5 font-bold text-[#111111] hover:bg-[#ff8233] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a63d00] disabled:opacity-60">
                {isSubmitting ? "Submitting…" : brochure ? "Get the syllabus" : demo ? "Request my free demo" : "Send my enquiry"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              <p className="text-center text-xs text-neutral-600">
                SEEYAM will use these details to follow up on your request. <a className="font-semibold text-[#8d3200] underline" href={whatsappHref(contactDetails(siteSettings).whatsapp, "Hi SEEYAM, I’m interested in your courses.")} target="_blank" rel="noopener noreferrer">Contact us on WhatsApp</a>
              </p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
