import { notFound, redirect } from "next/navigation";
import { documents, modules, publishedItems } from "@/lib/cms/store";
import { getSession } from "@/lib/auth";
import { validKey, lines } from "@/lib/cms/fields";
import { getBasePlatform } from "@/lib/published-platform";
import { applyContent } from "@/lib/cms/public";
import { PlatformDataProvider } from "@/components/PlatformDataContext";
import { LeadModalProvider } from "@/components/LeadModalContext";
import Home from "@/app/(public)/PageContent";
import About from "@/app/(public)/about/PageContent";
import Contact from "@/app/(public)/contact/PageContent";
import Placements from "@/app/(public)/placements/PageContent";
import Reviews from "@/app/(public)/reviews/PageContent";
import CmsDirectory from "@/components/CmsDirectory";
import EditorialSection from "@/components/EditorialSection";
import HomeCourseCard from "@/components/HomeCourseCard";
import CourseSyllabus from "@/components/CourseSyllabus";
export const dynamic = "force-dynamic";
export const metadata = {
  robots: { index: false, follow: false },
  title: "Private draft preview",
};
export default async function Preview({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  if (user.role !== "ADMIN") notFound();
  const { kind, id } = await params;
  if (!validKey(kind, id)) notFound();
  const [docs, base, live] = await Promise.all([
    documents(),
    getBasePlatform(),
    publishedItems(),
  ]);
  const doc = docs.find((d) => d.kind === kind && d.id === id);
  if (!doc) notFound();
  const v = doc.draft,
    items = [
      ...live.filter((i) => i.kind !== kind || i.id !== id),
      { kind, id, values: v },
    ];
  const view = applyContent(base, items);
  let content;
  if (kind === "page") content = <EditorialSection value={v}/>;
  if (kind === "home") content = <Home />;
  if (kind === "about") content = <About />;
  if (kind === "contact") content = <Contact />;
  if (kind === "trainer" || kind === "gallery")
    content = <CmsDirectory kind={kind} />;
  if (kind === "placement") {
    view.placements = [
      {
        id,
        studentName: v.name,
        companyName: v.company,
        role: v.role,
        courseId: v.courseId,
        packageCtc: v.package,
        quote: v.story,
        studentAvatarUrl: v.image,
        placementDate: v.date,
      },
      ...view.placements.filter((p) => p.id !== id),
    ];
    content = <Placements />;
  }
  if (kind === "testimonial") {
    view.reviews = [
      {
        id,
        studentName: v.name,
        studentEmail: "",
        courseId: v.courseId,
        branchId: v.branchId,
        rating: Number(v.rating),
        body: v.body,
        title: v.title,
        photo: v.image,
        status: "APPROVED",
        completionYear: "",
        createdAt: new Date().toISOString(),
        updatedAt: "",
      },
      ...view.reviews.filter((r) => r.id !== id),
    ];
    content = <Reviews />;
  }
  if (kind === "course") {
    const course = {
      rating: 0,
      enrolledCount: 0,
      mode: "CLASSROOM" as const,
      expectedSalary: "",
      ...base.courses.find((c) => c.id === id),
      id,
      title: v.title,
      slug: v.slug,
      categoryId: v.categoryId,
      summary: v.summary,
      duration: v.duration,
      price: Number(v.price),
      highlights: lines(v.highlights),
      syllabus: modules(v.syllabus),
      image: v.image,
      isFeatured: v.featured === "true",
    };
    content = (
      <div className="mx-auto max-w-xl p-5">
        <HomeCourseCard
          course={course}
        />
        <CourseSyllabus courseId={course.id} syllabus={course.syllabus} />
      </div>
    );
  }
  if (kind === "seo")
    content = (
      <article className="mx-auto max-w-xl space-y-3 rounded-xl bg-white p-6">
        <small>{v.canonical || v.path}</small>
        <h2 className="text-xl text-blue-800">{v.title}</h2>
        <p>{v.description}</p>
        {v.socialImage && <img src={v.socialImage} alt={v.imageAlt} />}
        <strong>{v.ogTitle}</strong>
        <p>{v.ogDescription}</p>
      </article>
    );
  return (
    <main>
      <h1 className="bg-indigo-900 p-3 text-center text-white">
        Private preview · saved draft
      </h1>
      <PlatformDataProvider initial={view}>
        <LeadModalProvider>
          <div inert>{content}</div>
        </LeadModalProvider>
      </PlatformDataProvider>
    </main>
  );
}
