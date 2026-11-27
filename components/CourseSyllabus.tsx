import { syllabusTopicsForDisplay } from "@/lib/syllabus-topics";
import type { SyllabusModule } from "@/lib/mock-data";
import CourseHeroBrochureButton from "./CourseHeroBrochureButton";

export default function CourseSyllabus({ courseId, brochureUrl, syllabus }: {
  courseId: string;
  brochureUrl?: string;
  syllabus: SyllabusModule[];
}) {
  const topics = syllabusTopicsForDisplay(syllabus);

  return (
    <section id="syllabus" aria-labelledby="syllabus-title" className="scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 pb-3">
        <h2 id="syllabus-title" className="text-2xl font-extrabold text-neutral-950">Course syllabus</h2>
        {brochureUrl && (
          <div className="shrink-0">
            <CourseHeroBrochureButton courseId={courseId} brochureUrl={brochureUrl} />
          </div>
        )}
      </div>
      {topics.length ? (
        <div className="divide-y divide-neutral-200">
          {topics.map(({ title, topics: subtopics }, index) => (
            <section key={`${index}-${title}`} className="py-4 sm:py-5">
              <h3 className="text-base font-bold text-neutral-950 sm:text-lg">{title}</h3>
              {subtopics.length > 0 && (
                <ul className="mt-2 grid list-disc gap-x-10 gap-y-1.5 pl-5 text-sm leading-relaxed text-neutral-700 marker:text-[#b84500] md:grid-cols-2">
                  {subtopics.map(subtopic => <li key={subtopic}>{subtopic}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>
      ) : <p className="mt-4 text-sm text-neutral-700">Contact admissions for the current course syllabus.</p>}
    </section>
  );
}
