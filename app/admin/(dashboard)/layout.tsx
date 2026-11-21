import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CatalogOptions } from "@/components/admin/CatalogOptions";
import { prisma } from "@/lib/db";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [courses, branches] = await Promise.all([
    prisma.course.findMany({select:{id:true,title:true},orderBy:{title:"asc"}}),
    prisma.branch.findMany({select:{id:true,name:true,city:true},orderBy:{name:"asc"}}),
  ]);
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      {/* Sidebar with active session data */}
      <AdminSidebar user={session} />

      {/* Main Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <CatalogOptions value={{courses,branches}}>{children}</CatalogOptions>
      </div>
    </div>
  );
}
