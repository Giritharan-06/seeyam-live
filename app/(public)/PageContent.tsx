"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, GraduationCap, Headphones, Laptop, LibraryBig, MapPin } from "lucide-react";
import Hero from "@/components/Hero";
import HomeCourseCard from "@/components/HomeCourseCard";
import SkillAssessment from "@/components/SkillAssessment";
import ChennaiCourseLinks from "@/components/ChennaiCourseLinks";
import StudentCareerScroll from "@/components/StudentCareerScroll";
import OurStudentsPlacedAtPoster from "@/components/OurStudentsPlacedAtPoster";
import HomeCommunitySections from "@/components/HomeCommunitySections";
import { usePlatformData } from "@/components/PlatformDataContext";
import { useLeadModal } from "@/components/LeadModalContext";
import { lines, sections } from "@/lib/cms/fields";
import { decodeHtml } from "@/lib/utils";

const shortcuts = [
  { title:"Learning formats", text:"Classroom and live online", href:"/courses", icon:Laptop, tone:"bg-sky-100 text-sky-900" },
  { title:"Free learning resources", text:"Study and practice materials", href:"/resources", icon:LibraryBig, tone:"bg-amber-100 text-amber-950" },
  { title:"Chennai training campus", text:"Visit us in Thoraipakkam", href:"/branches", icon:MapPin, tone:"bg-teal-100 text-teal-950" },
  { title:"Free career counseling", text:"Talk through your next step", href:"/contact", icon:Headphones, tone:"bg-violet-100 text-violet-950" },
];

const openingSections: readonly string[] = ["hero", "journeys", "courses", "companies"];

export default function HomePage() {
  const { courses, branches, cms, loading } = usePlatformData();
  const { openLeadModal } = useLeadModal();
  const home = cms?.find(item => item.kind === "home")?.values;
  const featured = lines(home?.featured).flatMap(id => courses.filter(course => course.id === id));
  const highlights = lines(home?.highlights);
  const icons = [Laptop, GraduationCap, BriefcaseBusiness];
  const stats = lines(home?.statistics).map(row => row.split("|"));
  const blocks:Record<string,React.ReactNode> = {
    hero: <Hero/>,
    statistics: <section aria-label="Learning at Seeyam" className="premiere-container premiere-benefits">
      {(stats.length ? stats : (highlights.length ? highlights : ["Hands-on projects","Classroom & online","Career guidance"]).map(label => [label])).map(([label,description],index) => {
        const Icon = icons[index % icons.length];
        return <div key={index} className="flex items-center gap-3 px-4 py-3 sm:justify-center sm:px-6"><Icon size={23} className="shrink-0 text-blue-700"/><div><p className="text-sm font-extrabold">{label}</p>{description && <p className="mt-1 text-xs text-slate-600">{description}</p>}</div></div>;
      })}
    </section>,
    courses: <section id="courses" className="premiere-container scroll-mt-24 py-12 sm:py-16">
      <header className="mb-7 text-center">
        <h2 className="premiere-section-title">Explore our analytics &amp; marketing programs</h2>
        <p className="mt-2 text-sm text-slate-600">Compare the tools, projects and learning options.</p>
      </header>
      <div className="mb-5"><ChennaiCourseLinks /></div>
      <div aria-busy={loading} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(featured.length ? featured : courses).map(course => <HomeCourseCard key={course.id} course={course}/>)}
      </div>
      {!courses.length && !loading && <p className="text-center text-slate-600">No programs are currently listed.</p>}
      <div className="mt-7 text-center"><Link href="/courses" className="premiere-secondary">View all {courses.length} programs <ArrowRight size={16}/></Link></div>
    </section>,
    journeys: <><StudentCareerScroll variant="analytics"/><StudentCareerScroll variant="marketing"/><SkillAssessment /></>,
    companies: <OurStudentsPlacedAtPoster/>,
    community: <section aria-label="Explore Seeyam" className="premiere-container pb-12">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{shortcuts.map(({title,text,href,icon:Icon,tone}) =>
        <Link key={href} href={href} className={"flex items-start gap-3 rounded-2xl p-5 transition hover:shadow-md " + tone}>
          <Icon size={24} className="shrink-0"/><span><span className="block font-extrabold">{title}</span><span className="mt-1 block text-sm">{text}</span></span>
          <ArrowRight size={16} className="ml-auto shrink-0"/>
        </Link>)}</div>

    </section>,
    stories: <HomeCommunitySections/>,
    campuses: <section id="campuses" className="premiere-container pb-12">
      <h2 className="premiere-section-title mb-6">Visit our Chennai training campus</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{branches.map(branch => <Link key={branch.id} href={"/branches/"+branch.slug} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-4 hover:border-blue-400"><Building2 size={20} className="text-blue-700"/><span><span className="block font-bold">{decodeHtml(branch.name)}</span><span className="text-xs text-slate-600">{branch.city}</span></span><ArrowRight size={16} className="ml-auto"/></Link>)}</div>
    </section>,
    counseling: <section className="premiere-career">
      <div className="premiere-container flex flex-wrap items-center justify-between gap-6 py-9">
        <div><h2 className="text-2xl font-extrabold sm:text-3xl">Find the program that fits your goals.</h2><p className="mt-2 text-sm text-neutral-200">Talk through the curriculum, learning options and schedule before you enroll.</p></div>
        <button className="premiere-primary" onClick={() => openLeadModal(undefined, undefined, "DEMO_VIDEO")}>Book a free demo <ArrowRight size={16}/></button>
      </div>
    </section>,
  };
  const enabled = [...new Set((home ? lines(home.sections) : sections).flatMap(key => key === "community" ? ["community", "stories"] : [key]))];
  const order = [...openingSections.filter(key => enabled.includes(key)), ...enabled.filter(key => !openingSections.includes(key))];
  return <>{order.map(key => <Fragment key={key}>{blocks[key]}</Fragment>)}</>;
}
