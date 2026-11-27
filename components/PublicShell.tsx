"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { usePlatformData } from "./PlatformDataContext";
import PublicEnquiryPrompt from "./PublicEnquiryPrompt";
import EditorialSection from "./EditorialSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLeadModal } from "@/components/LeadModalContext";

import CareerDoubtBot from "@/components/CareerDoubtBot";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const { cms } = usePlatformData();
  const page = cms?.find(item => item.kind === "page" && item.values?.path === path)?.values;
  const { openLeadModal } = useLeadModal();

  return (
    <div className="seeyam-public flex min-h-screen flex-col">
      <Navbar onOpenLeadModal={openLeadModal} />
      <main className="flex-1">{page && <EditorialSection value={page} />}{children}</main>
      <Footer onOpenLeadModal={openLeadModal} />
      <CareerDoubtBot />
      <PublicEnquiryPrompt />
    </div>
  );
}
