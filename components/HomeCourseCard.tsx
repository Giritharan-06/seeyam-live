import Link from "next/link";
import { ArrowRight, BookOpen, Globe2 } from "lucide-react";
import type { CourseData } from "@/lib/mock-data";
import { courseArtworkUrl } from "@/lib/redesign-art";
import { decodeHtml } from "@/lib/utils";

export default function HomeCourseCard({course}: {course:CourseData}) {
  const artwork = course.image || courseArtworkUrl(course.slug);
  const href = "/courses/" + course.slug;
  return <article className="premiere-course">
    <Link href={href} tabIndex={-1} aria-hidden="true" className="premiere-course-image">
      {artwork ? <img src={artwork} alt="" width={480} height={320} loading="lazy"/> : <BookOpen size={36}/>}
    </Link>
    <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
      <h3 className="text-base font-extrabold leading-snug">{decodeHtml(course.title)}</h3>
      <p className="flex items-center gap-2 text-sm text-neutral-700">
        <Globe2 size={16} aria-hidden="true" /> {course.languages?.join(", ") || "Tamil, English"}
      </p>
      <div className="mt-auto grid grid-cols-2 gap-2">
        <Link href={href + "#syllabus"} aria-label={"View syllabus for " + decodeHtml(course.title)} className="premiere-card-action premiere-syllabus">Syllabus</Link>
        <Link href={href} aria-label={"Learn more about " + decodeHtml(course.title)} className="premiere-card-action premiere-primary">Learn more <ArrowRight size={14} aria-hidden="true"/></Link>
      </div>
    </div>
  </article>;
}
