import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Star,
  Clock,
  Laptop,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  Award,
  Download,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Phone,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Briefcase,
  FileText,
} from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { publicCatalog as db } from "@/lib/public-catalog";
import {
  MOCK_COURSES,
  MOCK_CATEGORIES,
  MOCK_BRANCHES,
  MOCK_BATCHES,
  MOCK_REVIEWS,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import CounterNumber from "@/components/CounterNumber";
import CourseSyllabusAccordion from "@/components/CourseSyllabusAccordion";
import CourseInterviewQuestions from "@/components/CourseInterviewQuestions";
import CourseHeroBrochureButton from "@/components/CourseHeroBrochureButton";
import UpcomingBatches from "@/components/UpcomingBatches";
import JobPortalLinks from "@/components/JobPortalLinks";
import { CourseDetailSchema } from "@/components/StructuredData";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const courses = await db.getCourses();
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  const categories = await db.getCategories();
  const category = categories.find((c) => c.id === course.categoryId);

  return {
    title: `${course.title} Training & Certification Course`,
    description: `${course.summary} Join Seeyam Technologies for hands-on live projects, 100% placement assurance, and industry mentorship.`,
    keywords: [
      course.title,
      `${course.title} training Chennai`,
      `${course.title} course Bangalore`,
      `${course.title} Hyderabad`,
      `${category?.name || "IT"} certification`,
      "100% placement guarantee",
    ],
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await db.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const categories = await db.getCategories();
  const category = categories.find((c) => c.id === course.categoryId);
  const reviews = await db.getApprovedReviews(course.id);
  const allCourses = await db.getCourses();
  const relatedCourses = allCourses
    .filter((c) => c.categoryId === course.categoryId && c.id !== course.id)
    .slice(0, 3);

  // Fetch interview questions for this course or category
  const courseQuestions = await db.getInterviewQuestions(course.id);
  const allQuestions = await db.getInterviewQuestions();
  const interviewQuestions =
    courseQuestions.length > 0
      ? courseQuestions
      : allQuestions.slice(0, 4);

  // Determine job portal role filter
  let roleFilter = "ALL";
  const lowerSlug = course.slug.toLowerCase();
  if (
    lowerSlug.includes("data") ||
    lowerSlug.includes("power-bi") ||
    lowerSlug.includes("tableau") ||
    lowerSlug.includes("sql")
  ) {
    roleFilter = "data-analyst";
  } else if (
    lowerSlug.includes("full-stack") ||
    lowerSlug.includes("mern") ||
    lowerSlug.includes("java") ||
    lowerSlug.includes("web") ||
    lowerSlug.includes("devops")
  ) {
    roleFilter = "full-stack";
  } else if (
    lowerSlug.includes("python") ||
    lowerSlug.includes("ai") ||
    lowerSlug.includes("machine-learning")
  ) {
    roleFilter = "python-engineer";
  } else if (lowerSlug.includes("digital-marketing") || lowerSlug.includes("seo")) {
    roleFilter = "digital-marketer";
  }

  // Calculate monthly EMI approximation (6 months zero interest)
  const emiPerMonth = Math.round(course.price / 6);

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-20">
      <CourseDetailSchema course={course} reviews={reviews} />
      {/* Breadcrumb Header */}
      <div className="bg-[#071938] border-b border-[#0f2956] py-3 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <Link href="/courses" className="hover:text-blue-400">
            Courses
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-white truncate font-medium">{course.title}</span>
        </div>
      </div>

      {/* Course Hero Banner (Deep Navy Theme from Eduma) */}
      <section className="bg-[#071938] text-white py-14 relative overflow-hidden border-b border-[#0f2956]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                  {category?.name || "IT Certification"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0f2956] text-slate-300 text-xs font-semibold border border-[#1d4282]">
                  {course.mode} Mode
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-extrabold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>
                    <CounterNumber value={course.rating} duration={1200} /> / 5.0
                  </span>
                  <span className="text-slate-400 font-normal">
                    (
                    <CounterNumber
                      value={course.enrolledCount.toLocaleString()}
                      duration={1500}
                    />{" "}
                    Graduates)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {course.summary}
              </p>

              {/* Quick Spec Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#0b224d] p-3 rounded-2xl border border-[#16356c]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Duration</div>
                  <div className="text-xs font-extrabold text-white mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="bg-[#0b224d] p-3 rounded-2xl border border-[#16356c]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Package Range</div>
                  <div className="text-xs font-extrabold text-amber-400 mt-0.5">
                    {course.expectedSalary}
                  </div>
                </div>

                <div className="bg-[#0b224d] p-3 rounded-2xl border border-[#16356c]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Placement</div>
                  <div className="text-xs font-extrabold text-white mt-0.5 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>100% Assistance</span>
                  </div>
                </div>

                <div className="bg-[#0b224d] p-3 rounded-2xl border border-[#16356c]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Starting Tuition</div>
                  <div className="text-xs font-extrabold text-white mt-0.5">
                    {formatCurrency(course.price)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Action Card */}
            <div className="lg:col-span-4 bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4" data-card-3d="analytics" data-card-density="regular">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    All-Inclusive Starting Fee
                  </div>
                  <div className="text-2xl font-black text-[#071938]">
                    {formatCurrency(course.price)}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                    or {formatCurrency(emiPerMonth)}/month (No-Cost EMI)
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  EMI Available
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Real-time Industry Capstone Projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Unlimited Mock Technical Interviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>NASSCOM Aligned Course Certificate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>24x7 High-Compute Lab Server Access</span>
                </li>
              </ul>

              <div className="pt-2 space-y-2.5">
                <a
                  href="#batches"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all text-center block"
                >
                  View Upcoming Batches & Enroll
                </a>

                {/* Brochure Download Trigger */}
                <CourseHeroBrochureButton
                  courseId={course.id}
                  brochureUrl={course.brochureUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Syllabus, Highlights, Reviews, Batches, Interview Qs, Job Openings */}
        <div className="lg:col-span-8 space-y-12">
          {/* Key Course Highlights */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6" data-card-3d="analytics" data-card-density="regular">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#071938] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Program Highlights & Tools</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#F8FAFD] border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Hiring Employers for this Course */}
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Top Companies Hiring for this Profile</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {(course.hiringPartners && course.hiringPartners.length > 0
                  ? course.hiringPartners
                  : ["Amazon", "Microsoft", "Google", "Zoho", "TCS", "Infosys", "Deloitte", "Accenture"]
                ).map((comp) => (
                  <div
                    key={comp}
                    className="p-2.5 px-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200"
                  >
                    <CompanyLogo name={comp} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Module-by-Module Collapsible Syllabus Accordion */}
          <CourseSyllabusAccordion
            courseId={course.id}
            courseTitle={course.title}
            brochureUrl={course.brochureUrl}
            syllabus={course.syllabus}
          />

          {/* Upcoming Batches Interactive Table */}
          <div id="batches">
            <UpcomingBatches
              courseId={course.id}
              title={`Upcoming Batches for ${course.title}`}
              subtitle="Select your preferred branch in Chennai, Bangalore, or Hyderabad to reserve your seat before it fills."
            />
          </div>

          {/* Course Interview Questions Bank */}
          <CourseInterviewQuestions
            questions={interviewQuestions}
            courseTitle={course.title}
          />

          {/* Live Job Openings Links */}
          <JobPortalLinks
            roleFilter={roleFilter}
            title={`Live Hiring Openings for ${course.title} Graduates`}
          />

          {/* Course-Specific Reviews */}
          {reviews.length > 0 && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4" data-card-3d="analytics" data-card-density="regular">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#071938] flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span>Student Reviews for this Course</span>
                </h2>
                <Link
                  href="/reviews"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  View All Reviews →
                </Link>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#F8FAFD] border border-slate-200 space-y-2" data-card-3d="analytics" data-card-density="compact"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {rev.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#071938]">
                            {rev.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Class of {rev.completionYear}
                          </div>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <h4 className="font-bold text-xs text-[#071938]">
                      &ldquo;{rev.title}&rdquo;
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Sticky Contact Card & Related Courses */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Counselor Card */}
          <div className="bg-[#071938] text-white rounded-3xl p-6 shadow-xl border border-[#0f2956] space-y-4 sticky top-24" data-card-3d="analytics" data-card-density="compact">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Speak with Course Mentor</h4>
                <div className="text-[11px] text-amber-400 font-semibold">
                  Free Career Counseling
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Have questions about batch timings, fee installments, or career transitions? Connect with our senior academic counselor today.
            </p>

            <div className="space-y-2 pt-2">
              <a
                href="tel:+918939915577"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                <span>Call Admissions: +91 89399 15577</span>
              </a>

              <a
                href={`https://wa.me/918939915577?text=Hi%20Seeyam%20Technologies,%20I%20am%20interested%20in%20the%20${encodeURIComponent(
                  course.title
                )}%20course.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-2xl bg-[#0e2a5c] hover:bg-[#163d7e] text-slate-200 font-bold text-xs border border-[#1d4282] flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>

              <CourseHeroBrochureButton
                courseId={course.id}
                brochureUrl={course.brochureUrl}
                variant="secondary"
                className="bg-[#0b224d] hover:bg-[#123166] text-slate-200 border border-[#1a4185]"
              />
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div className="pt-4 border-t border-[#0f2956]">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Similar Programs
                </div>
                <div className="space-y-2">
                  {relatedCourses.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/courses/${rel.slug}`}
                      className="block p-3 rounded-xl bg-[#0b224d] hover:bg-[#102d64] border border-[#16356c] text-left transition-colors group"
                    >
                      <div className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                        {rel.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>{rel.duration}</span>
                        <span className="text-amber-400 font-bold">
                          {formatCurrency(rel.price)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
