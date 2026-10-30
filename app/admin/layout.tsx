import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CRM & Placement Portal | Seeyam Technologies",
  description: "Internal Lead Management, Batch Scheduling & Curriculum Analytics.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
