import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { editorData } from "@/lib/cms/editor-data";
import Editor from "@/components/admin/CmsEditor";
export const dynamic = "force-dynamic";
export default async function WebsiteContent() {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  if (user.role !== "ADMIN") {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Website Content</h1>
        <p role="alert" className="mt-4">Only a SEEYAM administrator can edit website content.</p>
      </main>
    );
  }
  try {
    return <Editor data={await editorData()} />;
  } catch {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Website Content</h1>
        <p className="mt-4">
          The CMS database is unavailable. Check the connection and apply the
          CMS migration to your local development database.
        </p>
      </main>
    );
  }
}
