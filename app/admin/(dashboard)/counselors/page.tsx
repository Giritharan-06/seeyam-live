import { redirect } from "next/navigation";
import { getSession, hasSecureAdminConfiguration } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminHeader from "@/components/admin/AdminHeader";
import CounselorForm from "@/components/admin/CounselorForm";

export default async function Counselors() {
  if ((await getSession())?.role !== "ADMIN") redirect("/admin");
  const accounts = await prisma?.user.findMany({ where: { role: "COUNSELOR" },
    select: { id: true, name: true, email: true, active: true }, orderBy: { name: "asc" },
  }).catch(() => null);
  const enabled = Boolean(accounts && hasSecureAdminConfiguration);
  return <><AdminHeader /><main className="mx-auto max-w-5xl space-y-5 p-4 md:p-8">
    <h1 className="text-3xl font-bold">Users &amp; Roles</h1>
    <div className="grid gap-3 sm:grid-cols-2"><section className="rounded-xl border bg-white p-4"><h2 className="font-bold">Administrator</h2><p className="mt-1 text-sm text-slate-600">Manages website content, staff access, trainers, payments, reports and training operations.</p></section><section className="rounded-xl border bg-white p-4"><h2 className="font-bold">Counselor</h2><p className="mt-1 text-sm text-slate-600">Handles enquiries, students, enrolments, job openings, applications and placements. Can read staff announcements.</p></section></div>
    {!accounts ? <p role="alert">Counselor accounts could not be loaded. Check the database connection.</p> :
      !enabled && <p role="alert">Set ADMIN_PASSWORD and SESSION_SECRET to manage staff accounts.</p>}
    <section className="space-y-4 rounded-xl bg-white p-5"><h2 className="font-bold">Add counselor</h2>
      <CounselorForm enabled={enabled} /></section>
    <section className="space-y-3"><h2 className="font-bold">Managed accounts</h2>
      {accounts?.length === 0 && <p>No managed counselors yet.</p>}
      {accounts?.map(account => <details key={account.id} className="rounded-xl bg-white p-5">
        <summary className="cursor-pointer font-semibold">{account.name} · {account.active ? "Active" : "Inactive"} <span className="break-all text-sm font-normal">{account.email}</span></summary>
        <div className="mt-4"><CounselorForm key={JSON.stringify(account)} account={account} enabled={enabled} /></div>
      </details>)}
    </section>
  </main></>;
}
