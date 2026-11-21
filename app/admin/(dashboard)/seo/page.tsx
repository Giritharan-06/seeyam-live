import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import SeoManager from "@/components/admin/SeoManager";
import { getSession, hasSecureAdminConfiguration } from "@/lib/auth";
import { getSeoTargets, siteOrigin } from "@/lib/seo";
import { readSeo } from "@/lib/seo-store";

export default async function SeoDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "ADMIN") {
    return <div><AdminHeader /><main className="p-6"><h1 className="text-xl font-bold">Administrator access required</h1><p>Only administrators can manage public SEO settings.</p></main></div>;
  }
  const [targets, settings] = await Promise.all([getSeoTargets(), readSeo()]);
  const ready = hasSecureAdminConfiguration;
  const notice = !settings
    ? "SEO storage is unavailable. Check the Neon connection and the seo_settings table."
    : !ready
      ? "Set ADMIN_PASSWORD and SESSION_SECRET on the server to enable editing."
      : undefined;

  return <div className="min-w-0"><AdminHeader /><SeoManager targets={targets} settings={settings} writable={Boolean(settings && ready)} origin={siteOrigin} notice={notice} /></div>;
}
