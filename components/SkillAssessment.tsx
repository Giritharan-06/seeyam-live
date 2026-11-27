"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePlatformData } from "@/components/PlatformDataContext";
import { decodeHtml } from "@/lib/utils";
import { suppressEnquiryPrompt } from "@/lib/enquiry-prompt";

const tracks = {
  analytics: {
    title: "Data Analytics",
    summary: "Explore data, answer business questions, and build dashboards with tools like SQL and Power BI.",
    slug: "data-analytics-master-program",
    matches: /data analytics|business intelligence|power bi/i,
  },
  marketing: {
    title: "Digital Marketing",
    summary: "Plan campaigns, reach the right audience, and measure results with SEO, ads, and web analytics.",
    slug: "digital-marketing-growth-analytics",
    matches: /digital marketing|growth marketing|performance marketing/i,
  },
};

type Track = keyof typeof tracks;
type Answer = Track | "both";

const questions = [
  {
    title: "What would you like to try?",
    analytics: "Look at sales numbers to find what people buy most.",
    marketing: "Make an online ad to bring in more customers.",
  },
  {
    title: "What would you like to make?",
    analytics: "A chart that shows how a shop is doing.",
    marketing: "A social media post that promotes a product.",
  },
  {
    title: "What do you want to learn first?",
    analytics: "How to use Excel to make sense of numbers.",
    marketing: "How to get people to notice a business online.",
  },
];

const choices: Answer[] = ["analytics", "marketing", "both"];

export default function SkillAssessment() {
  const { courses } = usePlatformData();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(Answer | undefined)[]>([]);
  const start = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const finished = step === questions.length;
  const question = questions[step];
  const analytics = answers.filter(answer => answer === "analytics").length;
  const marketing = answers.filter(answer => answer === "marketing").length;
  const recommendations: Track[] = analytics === marketing
    ? ["analytics", "marketing"]
    : [analytics > marketing ? "analytics" : "marketing"];

  useEffect(() => {
    if (open) heading.current?.focus();
  }, [open, step]);

  function close() {
    setOpen(false);
    start.current?.focus();
  }

  return (
    <section id="skill-assessment" aria-labelledby="skill-assessment-title" className="premiere-container mb-12 scroll-mt-28 sm:mb-16">
      <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-[#141414] text-white shadow-xl shadow-black/10 md:grid md:grid-cols-[1fr_1.1fr]">
        <div className="relative flex flex-col items-start justify-center p-6 sm:p-10 lg:p-14">
          <h2 id="skill-assessment-title" className="text-[clamp(2rem,4vw,3.6rem)] font-black leading-[1.05] tracking-tight">
            Find your course.
            <span className="mt-1 block text-[#ff842f]">Make your move.</span>
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-200 sm:text-base">
            Answer three quick questions to find out if Data Analytics or Digital Marketing is a better fit for you.
          </p>
          <button ref={start} type="button" aria-expanded={open} aria-controls="skill-assessment-panel"
            className="premiere-primary mt-7 min-h-12 text-center" onClick={() => {
              if (open) { close(); return; }
              suppressEnquiryPrompt();
              setOpen(true);
            }}>
            {open ? "Hide assessment" : finished ? "View your results" : step > 0 ? "Continue assessment" : "Start free skill assessment"}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[21rem]">
          <img src="/images/redesign/skill-assessment.webp" alt="" width={1280} height={853} loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[72%_30%]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#141414] to-transparent md:inset-y-0 md:left-0 md:right-auto md:h-full md:w-20 md:bg-gradient-to-r" />
        </div>
      </div>

      <div id="skill-assessment-panel" hidden={!open} className="mt-4 scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#913400]">
              {finished ? "Assessment complete" : `Question ${step + 1} of ${questions.length}`}
            </p>
            <h3 ref={heading} tabIndex={-1} id="skill-assessment-step" className="text-xl font-bold text-neutral-950 sm:text-2xl">
              {finished ? (recommendations.length === 1 ? "Your suggested learning path" : "Two paths worth exploring") : question.title}
            </h3>
          </div>
          <button type="button" aria-label="Close assessment" onClick={close} className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100">
            <X size={21} aria-hidden="true" />
          </button>
        </div>
        {finished ? (
          <>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {recommendations.map(key => {
                const track = tracks[key];
                const course = courses.find(item => item.slug === track.slug)
                  ?? courses.find(item => track.matches.test(decodeHtml(item.title)));
                return (
                  <article key={key} className="rounded-xl border border-neutral-200 p-4">
                    <h4 className="font-bold text-neutral-950">{track.title}</h4>
                    <p className="my-2 text-sm leading-relaxed text-neutral-600">{track.summary}</p>
                    <Link href={course ? `/courses/${course.slug}` : "/courses"}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#913400] hover:underline">
                      {course ? decodeHtml(course.title) : "Browse available courses"} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>
            <button type="button" className="mt-5 min-h-11 text-sm font-semibold text-[#913400] underline-offset-4 hover:underline"
              onClick={() => { setAnswers([]); setStep(0); }}>
              Retake assessment
            </button>
          </>
        ) : (
          <form className="mt-5" onSubmit={event => {
            event.preventDefault();
            if (answers[step]) setStep(step + 1);
          }}>
            <fieldset aria-labelledby="skill-assessment-step" className="grid gap-2">
              {choices.map(choice => (
                <label key={choice} className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 p-3 text-sm text-neutral-800 has-[:checked]:border-[#cf5500] has-[:checked]:bg-[#fff3e8]">
                  <input type="radio" name="skill-assessment-interest" value={choice} checked={answers[step] === choice}
                    className="h-4 w-4 shrink-0 accent-[#a13b00]"
                    onChange={() => setAnswers(previous => {
                      const next = [...previous];
                      next[step] = choice;
                      return next;
                    })} />
                  {choice === "both" ? "I’m open to both." : question[choice]}
                </label>
              ))}
            </fieldset>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {step > 0 && <button type="button" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-neutral-700" onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>}
              <button type="submit" disabled={!answers[step]} className="premiere-primary disabled:cursor-not-allowed disabled:opacity-50">
                {step === questions.length - 1 ? "See my result" : "Next question"} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
