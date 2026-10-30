import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  MapPin,
  Building2,
  Phone,
  MessageSquare,
  Clock,
  Mail,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Laptop,
  Users,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Star,
  GraduationCap,
} from "lucide-react";
import { publicCatalog as db } from "@/lib/public-catalog";
import {
  MOCK_BRANCHES,
  MOCK_BATCHES,
  MOCK_COURSES,
  MOCK_REVIEWS,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

interface BranchDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const branches = await db.getBranches();
  return branches.map((branch) => ({
    slug: branch.slug,
  }));
}

export async function generateMetadata({
  params,
}: BranchDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await db.getBranchBySlug(slug);

  if (!branch) {
    return {
      title: "Campus Not Found",
    };
  }

  return {
    title: `${branch.name} Campus (${branch.city}) | IT Training & Placement Institute`,
    description: `Visit Seeyam Technologies ${branch.name} campus in ${branch.city}. Address: ${branch.address}. 100% placement-oriented Full Stack, Cloud DevOps, AI & Testing programs.`,
    keywords: [
      `IT Training in ${branch.name}`,
      `Software courses ${branch.city}`,
      `Seeyam Technologies ${branch.name}`,
      `Full Stack training ${branch.city}`,
    ],
  };
}

export default async function BranchDetailPage({
  params,
}: BranchDetailPageProps) {
  const { slug } = await params;
  const branch = await db.getBranchBySlug(slug);

  if (!branch) {
    notFound();
  }

  const batches = await db.getBatches(branch.id);
  const branchReviews = await db.getApprovedReviews(undefined, branch.id);
  const allCourses = await db.getCourses();
  const allBranches = await db.getBranches();

  return (
    <div className="bg-[#F8FAFD] min-h-screen pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-[#071938] border-b border-[#0f2956] py-3 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <Link href="/branches" className="hover:text-blue-400">
            Campuses
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-white truncate font-medium">{branch.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="bg-[#071938] text-white py-14 relative overflow-hidden border-b border-[#0f2956]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{branch.city} Training Center</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Seeyam Technologies - {branch.name}
              </h1>

              <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
                {branch.landmark && (
                  <div className="flex items-center gap-2 text-slate-400 pl-6">
                    <span className="font-semibold text-slate-300">Landmark:</span>
                    <span>{branch.landmark}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 pl-6">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{branch.timing}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={`tel:${branch.phone.replace(/[^0-9+]/g, "")}`}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call: {branch.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20Seeyam%20Technologies,%20I%20want%20to%20visit%20the%20${encodeURIComponent(branch.name)}%20campus.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-2xl bg-[#0e2a5c] hover:bg-[#163d7e] text-slate-200 font-bold text-xs border border-[#1d4282] flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>WhatsApp Campus Helpdesk</span>
                </a>
              </div>
            </div>

            {/* Quick Visit Card */}
            <div className="lg:col-span-4 bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4" data-card-3d="campus" data-card-density="regular">
              <h3 className="font-extrabold text-base text-[#071938]">
                Walk-in & Free Demo Session
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visit our campus today for a 1-on-1 counseling session with our senior trainer, live classroom demo, and syllabus copy.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Free Career Consultation & Profile Assessment</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>High-Compute Lab Tour & Server Demo</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Direct Discussion on Placement Opportunities</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-extrabold text-xs shadow-md text-center block transition-all hover:scale-[1.02]"
              >
                Schedule Direct Campus Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Google Map + Batches + Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Map + Batches + Facilities */}
        <div className="lg:col-span-8 space-y-10">
          {/* Embedded Google Map */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3" data-card-3d="campus" data-card-density="compact">
            <h2 className="text-lg font-extrabold text-[#071938] flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <span>Campus Map & Directions</span>
            </h2>
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-80 bg-slate-100">
              {branch.mapEmbedUrl ? (
                <iframe
                  title={branch.name}
                  src={branch.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  Map not available
                </div>
              )}
            </div>
          </section>

          {/* Batches Starting at this Branch */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4" data-card-3d="campus" data-card-density="compact">
            <h2 className="text-lg font-extrabold text-[#071938] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Upcoming Batches at {branch.name}</span>
            </h2>

            {batches.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
                Batches are being scheduled for this campus. Please contact admissions.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-4">Course Program</th>
                      <th className="py-3 px-4">Instructor</th>
                      <th className="py-3 px-4">Start Date</th>
                      <th className="py-3 px-4">Timing</th>
                      <th className="py-3 px-4">Seats Left</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batches.map((batch) => {
                      const course = allCourses.find((c) => c.id === batch.courseId) || MOCK_COURSES.find(c => c.id === batch.courseId);
                      return (
                        <tr key={batch.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-bold text-[#071938]">
                            {course?.title || batch.courseId}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {batch.instructorName}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-blue-700">
                            {batch.startDate}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{batch.timing}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                              {batch.seatsLeft} Seats Left
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href="/contact"
                              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition-colors inline-block"
                            >
                              Enroll
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Branch Reviews */}
          {branchReviews.length > 0 && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4" data-card-3d="campus" data-card-density="regular">
              <h2 className="text-lg font-extrabold text-[#071938] flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>Student Feedback for this Campus</span>
              </h2>

              <div className="space-y-3">
                {branchReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#F8FAFD] border border-slate-200 space-y-2" data-card-3d="campus" data-card-density="compact"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {rev.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-[#071938]">
                            {rev.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Batch {rev.completionYear}
                          </div>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <h4 className="font-bold text-xs text-[#071938]">&ldquo;{rev.title}&rdquo;</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Other Campuses */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4" data-card-3d="campus" data-card-density="regular">
            <h4 className="font-extrabold text-sm text-[#071938]">Other Training Campuses</h4>
            <div className="space-y-3">
              {allBranches.filter((b) => b.id !== branch.id).map((other) => (
                <Link
                  key={other.id}
                  href={`/branches/${other.slug}`}
                  className="block p-3.5 rounded-2xl bg-[#F8FAFD] hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#071938] group-hover:text-blue-600">
                      {other.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {other.city}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">{other.address}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
