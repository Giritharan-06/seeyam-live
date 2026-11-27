"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { wasHandled } from "@/lib/enquiry-prompt";
import { chennaiCourses } from "@/lib/chennai-courses";
import { useLeadModal } from "./LeadModalContext";

export default function PublicEnquiryPrompt() {
  const { openLeadModal } = useLeadModal();
  const pathname = usePathname();

  useEffect(() => {
    let timer: number;
    function showWhenReady() {
      if (wasHandled()) return;
      if (
        document.hidden ||
        document.querySelector('[data-enquiry-blocking-overlay], dialog[open], [aria-modal="true"]') ||
        document.activeElement?.closest("input,select,textarea,[contenteditable=true]")
      ) {
        timer = window.setTimeout(showWhenReady, 500);
        return;
      }
      openLeadModal(undefined, undefined, "DEMO_VIDEO");
    }
    const delay = pathname === chennaiCourses.marketing.path ? 18000 : pathname === chennaiCourses.analytics.path ? 12000 : 5000;
    timer = window.setTimeout(showWhenReady, delay);
    return () => window.clearTimeout(timer);
  }, [openLeadModal, pathname]);

  return null;
}
