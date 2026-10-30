"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LeadModalProvider, useLeadModal } from "@/components/LeadModalContext";
import { PlatformDataProvider } from "@/components/PlatformDataContext";

import DynamicThemeProvider from "@/components/DynamicThemeProvider";

import CareerDoubtBot from "@/components/CareerDoubtBot";

function PublicLayoutInner({ children }: { children: React.ReactNode }) {
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

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlatformDataProvider>
      <DynamicThemeProvider>
        <LeadModalProvider>
          <PublicLayoutInner>{children}</PublicLayoutInner>
        </LeadModalProvider>
      </DynamicThemeProvider>
    </PlatformDataProvider>
  );
}
