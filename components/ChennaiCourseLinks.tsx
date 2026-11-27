import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { chennaiCourses } from "@/lib/chennai-courses";

export default function ChennaiCourseLinks() {
  return (
    <nav aria-label="Chennai course guides" className="grid gap-3 sm:grid-cols-2">
      {Object.values(chennaiCourses).map(course => (
        <Link key={course.path} href={course.path} className="group flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-sm font-bold text-neutral-950 transition hover:border-orange-500 sm:px-6">
          {course.title}
          <ArrowRight size={17} aria-hidden="true" className="shrink-0 text-[#9c3700] transition group-hover:translate-x-1" />
        </Link>
      ))}
    </nav>
  );
}
