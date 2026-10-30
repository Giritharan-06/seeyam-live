"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  GraduationCap,
  ShieldCheck,
  Send,
  HelpCircle,
  Laptop,
} from "lucide-react";
import { submitPublicLead } from "@/actions/leads";
import { usePlatformData } from "@/components/PlatformDataContext";
import { decodeHtml } from "@/lib/utils";

const FAQS = [
  {
    q: "How does Seeyam Technologies guarantee 100% placement assistance?",
    a: "We have an active corporate relations network of 200+ IT hiring partners. After completing your capstone projects, our placement cell conducts mock technical interviews, resume optimization, and schedules unlimited interview drives until you receive your offer letter.",
  },
  {
    q: "Are the training classes conducted by real IT working professionals?",
    a: "Yes! 100% of our trainers are active Principal Technical Architects, DevOps leads, and Full Stack consultants with 10+ to 16+ years of real production experience in Tier-1 IT companies.",
  },
  {
    q: "Can I attend a free demo class before enrolling?",
    a: "Absolutely! We offer free 1-on-1 career consultation and live classroom demo sessions across all our campuses and online. You can interact directly with the trainer before making any payment.",
  },
  {
    q: "Do you offer weekend batches for working professionals?",
    a: "Yes, we provide flexible Weekend batches (Saturday & Sunday 3-4 hours each) as well as Fast-Track weekday morning and evening batches.",
  },
  {
    q: "Is there an EMI or installment option for course fees?",
    a: "Yes, we offer 0% interest EMI options through major credit cards as well as 2 to 3 flexible fee installment options.",
  },
];

export default function ContactPage() {
  const { courses, branches, siteSettings } = usePlatformData();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    courseId: courses[0]?.id || "",
    branchId: branches[0]?.id || "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Dynamic FAQs from WordPress settings or fallback list
  let faqList = FAQS;
  if (siteSettings?.faq_items_json) {
    try {
      const parsed = JSON.parse(siteSettings.faq_items_json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqList = parsed;
      }
    } catch (e) {
      // fallback
    }
  }

  const helplinePhone = siteSettings?.footer_phone || siteSettings?.navbar_helpline_phone || "+91 89399 15577";
  const contactEmail = siteSettings?.footer_email || "info@seeyamtechnologies.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await submitPublicLead({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      courseId: formData.courseId || courses[0]?.id,
      branchId: formData.branchId || branches[0]?.id,
      source: "Contact Page Form",
    });

    setLoading(false);

    if (res.success) {
      setSuccess(res.message);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        courseId: courses[0]?.id || "",
        branchId: branches[0]?.id || "",
        notes: "",
      });
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-20">
      {/* Header Banner (Eduma Deep Navy Header) */}
      <section className="bg-[#071938] text-white py-16 border-b border-[#0f2956]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Get Free 1-on-1 Academic Counseling</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Connect with Our Career Advisory Team
            </h1>
            <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
              Have questions about course syllabi, batch timings, placement records, or campus walk-ins? Our senior counselors are available 7 days a week.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Direct Helplines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inquiry Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6" data-card-3d="review" data-card-density="compact">
            <div>
              <h2 className="text-2xl font-extrabold text-[#071938]">
                Book Your Free Demo & Counseling Session
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill out your details below. Our academic advisor will contact you within 15 minutes.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2" data-card-3d="review" data-card-density="compact">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2 text-center" data-card-3d="review" data-card-density="compact">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base">Inquiry Successfully Registered!</h4>
                <p className="text-xs text-blue-700 max-w-sm mx-auto">{success}</p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/918939915577?text=Hi%20Seeyam%20Technologies,%20I%20just%20submitted%20my%20contact%20inquiry."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp for Instant Updates</span>
                  </a>
                </div>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Full Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Anand Kumar"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="anand@gmail.com"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9840123456"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Course & Branch selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Interested Course <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.courseId || courses[0]?.id}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {decodeHtml(c.title)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nearest Branch Campus <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.branchId || branches[0]?.id}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Your Learning Goal or Questions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Non-IT to IT career switch, batch timing preferences, fee installments..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-600 bg-slate-50 focus:bg-white"
                  />
                </div>

                {/* Submit Button in Elegant Gold */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm Free Demo & Counseling Booking</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Helplines & Branch Directory */}
          <div className="lg:col-span-5 space-y-6">
            {/* Toll Free Card */}
            <div className="bg-[#071938] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0f2956] space-y-4" data-card-3d="review" data-card-density="regular">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Central Admissions Helpline</span>
              </div>
              <h3 className="text-xl font-extrabold">Instant Support Hotline</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our head counseling office for immediate fee guidance, batch dates, or corporate inquiries.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${helplinePhone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0b224d] hover:bg-[#102d64] border border-[#16356c] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Direct Line</div>
                    <div className="font-extrabold text-sm text-white">{helplinePhone}</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${helplinePhone.replace(/[^0-9]/g, "")}?text=Hi%20Seeyam%20Technologies,%20I%20would%20like%20to%20know%20more%20about%20your%20IT%20courses.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0b224d] hover:bg-[#102d64] border border-[#16356c] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">WhatsApp Desk</div>
                    <div className="font-extrabold text-sm text-white">Chat with Advisor</div>
                  </div>
                </a>

                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0b224d] hover:bg-[#102d64] border border-[#16356c] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Official Email</div>
                    <div className="font-extrabold text-xs text-white">
                      {contactEmail}
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Branch Phone Directory */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3" data-card-3d="review" data-card-density="regular">
              <h4 className="font-extrabold text-sm text-[#071938]">
                Direct Campus Phone Numbers
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[#071938]">{b.name}</div>
                      <div className="text-[10px] text-slate-400">{b.city}</div>
                    </div>
                    <a
                      href={`tel:${b.phone.replace(/[^0-9+]/g, "")}`}
                      className="font-bold text-blue-600 hover:underline text-xs"
                    >
                      {b.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071938]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqList.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-[#071938] flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-blue-600 font-extrabold text-lg ml-2">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
