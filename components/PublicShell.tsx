"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLeadModal } from "@/components/LeadModalContext";

import CareerDoubtBot from "@/components/CareerDoubtBot";

export default function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { openLeadModal } = useLeadModal();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenLeadModal={openLeadModal} />
      <main className="flex-1">{children}</main>
      <Footer onOpenLeadModal={openLeadModal} />
      <CareerDoubtBot />
    </div>
  );
}
