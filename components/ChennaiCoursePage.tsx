import { ArrowRight, BookOpen, BriefcaseBusiness, ChevronDown, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { chennaiCourses, type ChennaiTrack } from "@/lib/chennai-courses";
import { contactDetails, phoneHref } from "@/lib/contact";
import { getCatalog } from "@/lib/public-catalog";
import CourseSyllabus from "@/components/CourseSyllabus";
import HomeCourseCard from "@/components/HomeCourseCard";
import PageStructuredData from "@/components/PageStructuredData";
import AnalyticsHeroVisual from "@/components/AnalyticsHeroVisual";
import MarketingHeroVisual from "@/components/MarketingHeroVisual";

export default async function ChennaiCoursePage({ track }: { track: ChennaiTrack }) {
  const guide = chennaiCourses[track];
  const catalog = await getCatalog();
  const course = catalog.courses.find(item => item.slug === guide.courseSlug);
  const related = guide.related.flatMap(slug => catalog.courses.filter(item => item.slug === slug));
  const office = contactDetails(catalog.settings);
  const isAnalytics = track === "analytics";

  return (
    <>
      <PageStructuredData path={guide.path} />
      <section className="public-banner grid bg-[#101010] text-white lg:grid-cols-2">
        <div className="w-full px-5 py-12 sm:px-8 sm:py-16 lg:ml-auto lg:max-w-[40rem] lg:self-center">
          <a href={office.maps} className="mb-4 inline-flex items-start gap-2 text-sm font-bold leading-snug text-[#ffb17a] hover:underline">
            <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0" /> <span>{office.displayAddress}</span>
          </a>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{guide.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-200">{guide.introduction}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#syllabus" className="premiere-primary">View syllabus <ArrowRight size={16} aria-hidden="true" /></a>
            <Link href="/contact" className="premiere-outline">Ask about the next batch</Link>
          </div>
        </div>
        {isAnalytics ? <AnalyticsHeroVisual /> : <MarketingHeroVisual />}
      </section>

      <div className="premiere-container space-y-10 py-10 sm:space-y-14 sm:py-14">
        <section aria-labelledby="training-overview" className="grid gap-7 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-9 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <h2 id="training-overview" className="premiere-section-title">Course overview</h2>
            <p className="mt-3 max-w-prose text-sm leading-7 text-neutral-700">
              For students, graduates and working professionals who want practical training in {guide.label.toLowerCase()}.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
              {guide.tools.map(tool => <li key={tool} className="rounded-full bg-[#fff2e8] px-3 py-1.5 text-[#913400]">{tool}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-neutral-950 p-5 text-white sm:p-6">
            <h3 className="text-lg font-bold">Learning format and batches</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-200">Ask about classroom training at our Chennai campus and live online options.</p>
            {course && <p className="mt-3 text-sm font-semibold text-[#ffb17a]">{course.duration}</p>}
            <a href={phoneHref(office.phone)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold hover:underline">
              <Phone size={16} aria-hidden="true" /> Contact admissions
            </a>
          </div>
        </section>

        {course?.syllabus.length ? (
          <CourseSyllabus courseId={course.id} brochureUrl={course.brochureUrl} syllabus={course.syllabus} />
        ) : (
          <section id="syllabus" className="scroll-mt-28 rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-xl font-bold">Course syllabus</h2>
            <p className="mt-2 text-sm text-neutral-700">Contact admissions for the current syllabus and batch availability.</p>
            <Link href="/contact" className="mt-4 inline-block font-bold text-[#913400]">Contact admissions</Link>
          </section>
        )}

        <section aria-labelledby="course-practice">
          <h2 id="course-practice" className="premiere-section-title">What you’ll practise</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {guide.practice.map(item => (
              <article key={item.title} className="rounded-2xl border border-neutral-200 p-5">
                <BookOpen size={22} aria-hidden="true" className="mb-3 text-[#9c3700]" />
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-700">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-[#fff2e8] p-6 sm:p-8">
          <BriefcaseBusiness size={23} aria-hidden="true" className="mb-3 text-[#9c3700]" />
          <h2 className="text-xl font-extrabold text-neutral-950">Placement assistance</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">Get support with your resume, interview preparation and career planning.</p>
          <Link href="/placements" className="mt-3 inline-block text-sm font-bold text-[#913400] hover:underline">See how placement support works</Link>
        </section>

        {related.length > 0 && <section aria-labelledby="related-training">
          <h2 id="related-training" className="premiere-section-title">Related training courses</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(item => <HomeCourseCard key={item.id} course={item} />)}
          </div>
        </section>}

        <section aria-labelledby="course-questions">
          <h2 id="course-questions" className="premiere-section-title">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 px-5">
            {[...guide.faq, { question: "Where is the Chennai training centre?", answer: office.displayAddress }].map(item => (
              <details key={item.question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold">
                  {item.question} <ChevronDown size={18} aria-hidden="true" className="shrink-0 group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-6 text-neutral-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <nav aria-label="Continue exploring" className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-200 pt-5 text-sm font-bold text-[#913400]">
          {course && <Link href={`/courses/${course.slug}`}>View full program details</Link>}
          <Link href={chennaiCourses[track === "analytics" ? "marketing" : "analytics"].path}>Compare the other Chennai course</Link>
          <a href={office.maps}>Get directions to campus</a>
          <Link href="/courses">Browse all courses</Link>
        </nav>
      </div>
    </>
  );
}
