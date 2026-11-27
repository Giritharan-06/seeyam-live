import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { CatalogOptions } from "@/components/admin/CatalogOptions";
import { prisma } from "@/lib/db";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminSidebar from "@/components/admin/Sidebar";
import "../workspace.css";

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
    <div className="admin-workspace flex h-dvh overflow-hidden text-slate-900 font-sans">
      {/* Sidebar with active session data */}
      <AdminSidebar user={session} />

      {/* Main Scrollable Content Area */}
      <div className="admin-main flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminTopbar name={session.name} role={session.role}/>
        <CatalogOptions value={{courses,branches}}>{children}</CatalogOptions>
      </div>
    </div>
  );
}
