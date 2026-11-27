"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { suppressEnquiryPrompt } from "@/lib/enquiry-prompt";
import LeadModal from "./LeadModal";

interface LeadModalContextType {
  openLeadModal: (
    courseId?: string,
    branchId?: string,
    reason?: "ENQUIRY" | "BROCHURE_DOWNLOAD" | "DEMO_VIDEO",
    brochureUrl?: string
  ) => void;
  closeLeadModal: () => void;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [courseId, setCourseId] = useState<string | undefined>();
  const [branchId, setBranchId] = useState<string | undefined>();
  const [reason, setReason] = useState<"ENQUIRY" | "BROCHURE_DOWNLOAD" | "DEMO_VIDEO" | undefined>();
  const [brochureUrl, setBrochureUrl] = useState<string | undefined>();

  const openLeadModal = useCallback((
    cId?: string,
    bId?: string,
    r?: "ENQUIRY" | "BROCHURE_DOWNLOAD" | "DEMO_VIDEO",
    bUrl?: string
  ) => {
    suppressEnquiryPrompt();
    setCourseId(cId);
    setBranchId(bId);
    setReason(r);
    setBrochureUrl(bUrl);
    setIsOpen(true);
  }, []);

  const closeLeadModal = () => {
    setIsOpen(false);
  };

  return (
    <LeadModalContext.Provider value={{ openLeadModal, closeLeadModal }}>
      {children}
      {isOpen && <LeadModal
        onClose={closeLeadModal}
        initialCourseId={courseId}
        initialBranchId={branchId}
        initialReason={reason}
        initialBrochureUrl={brochureUrl}
      />}
    </LeadModalContext.Provider>
  );
}

export function useLeadModal() {
  const context = useContext(LeadModalContext);
  if (!context) {
    return {
      openLeadModal: () => {},
      closeLeadModal: () => {},
    };
  }
  return context;
}
