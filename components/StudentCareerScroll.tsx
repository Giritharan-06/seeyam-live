"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, Database, Filter, Lightbulb, Megaphone, MousePointerClick, Target, TrendingUp, Check, Sparkles, Heart, Users } from "lucide-react";
import "./student-career-scroll.css";

const stories = {
  analytics: {
    intro: "Follow a shop’s sales from raw numbers to a smarter stock decision.",
    color: "#087bc4", course: "/courses?search=data", steps: [
      { title: "Start with a real question.", text: "What should the shop restock? Collect its sales: 40 shoes, 80 bags and 60 shirts. Every row is a clue.", tool: "Excel & SQL" },
      { title: "Count every sale once.", text: "A repeated row can change the answer. Remove duplicates, check missing values and organize the records before comparing products.", tool: "SQL & Python" },
      { title: "Let the pattern stand out.", text: "Turn those rows into a chart. Bags lead with 80 sales, ahead of shirts at 60 and shoes at 40. The comparison becomes easy to see.", tool: "Power BI & Tableau" },
      { title: "Give the numbers a purpose.", text: "Share the finding: bags are this shop’s best seller. Use that evidence to help plan its next stock order.", tool: "Insights & business storytelling" },
    ],
  },
  marketing: {
    intro: "Follow a course campaign from its first message to measurable sign-ups.",
    color: "#9333c8", course: "/courses?search=marketing", steps: [
      { title: "Know who you’re talking to.", text: "Imagine promoting a new skills course. Learn what graduates and career switchers need, what they search for and where they spend time online.", tool: "Audience research & SEO" },
      { title: "Make the message matter.", text: "Create an ad that connects a real need with a useful skill. In this example, your campaign reaches 2,000 people.", tool: "Creative strategy & paid ads" },
      { title: "Turn curiosity into a visit.", text: "200 people click through to the course page. Clear benefits, helpful content and an easy next step give them a reason to stay.", tool: "Content & landing pages" },
      { title: "Learn from what happens next.", text: "20 of those 200 visitors sign up: a 10% conversion rate. Compare your results, test a new message and improve the next campaign.", tool: "GA4 & conversion tracking" },
    ],
  },
};

type Variant = keyof typeof stories;
const sceneTitles = { analytics: ['Every sale tells a story.', 'Good data. Clear answers.', 'Now you can see the pattern.', 'Turn an insight into action.'], marketing: ['Meet your future audience.', 'Give your idea a voice.', 'Turn attention into interest.', 'Watch your campaign grow.'] };
const clamp = (n: number) => Math.max(0, Math.min(1, n));

function Art({ name, className = '', wide = false }: { name: string; className?: string; wide?: boolean }) {
  return <Image src={wide ? '/images/' + name + '-illustration.png' : '/images/career/' + name + '.png'} alt="" width={wide ? 720 : 512} height={wide ? 480 : 512} sizes="(max-width: 767px) 280px, 500px" loading="eager" className={'journey-png ' + className} />;
}

function AnalyticsPanels() {
  return <>
    <div className="journey-panel journey-panel-0">
      <Art name="data-sheets" className="journey-main-art" />
      <Art name="data-chart" className="journey-satellite-art" />
      <div className="journey-ticket ticket-left"><span className="ticket-icon blue"><Database size={20} /></span><div><small>NEW SALES RECORD</small><strong>40 shoes sold</strong></div><span className="ticket-dot" /></div>
      <div className="journey-ticket ticket-right"><span className="ticket-icon coral">👜</span><div><small>ANOTHER CLUE</small><strong>80 bags sold</strong></div></div>
      <div className="journey-tag tag-bottom"><span>Excel</span><span>SQL</span><strong>Real sales. One useful question.</strong></div>
    </div>
    <div className="journey-panel journey-panel-1">
      <Art name="data-filter" className="journey-main-art" />
      <Art name="data-sheets" className="journey-satellite-art" />
      <div className="journey-ticket ticket-left"><span className="ticket-icon coral"><Filter size={20} /></span><div><small>BEFORE</small><strong className="journey-crossed">Duplicate row</strong></div></div>
      <div className="journey-ticket ticket-right"><span className="ticket-icon mint"><Check size={20} /></span><div><small>AFTER</small><strong>Clean & reliable</strong></div></div>
      <div className="journey-tag tag-bottom"><Check size={16} /><strong>Each sale counted once</strong><span>Python</span></div>
    </div>
    <div className="journey-panel journey-panel-2">
      <Art name="data-chart" className="journey-main-art" />
      <Art name="data-filter" className="journey-satellite-art" />
      <div className="journey-mini-chart"><small>UNITS SOLD</small><div>{[40,80,60].map((v,i)=><div key={v}><strong>{v}</strong><span style={{height:v + '%'}} /><small>{['Shoes','Bags','Shirts'][i]}</small></div>)}</div></div>
      <div className="journey-ticket ticket-right"><span className="ticket-icon purple"><BarChart3 size={20} /></span><div><small>THE PATTERN</small><strong>Bags sell the most</strong></div></div>
      <div className="journey-tag tag-bottom"><span>Power BI</span><span>Tableau</span><strong>A clear comparison</strong></div>
    </div>
    <div className="journey-panel journey-panel-3">
      <Art name="analytics-workspace" wide className="journey-main-art journey-wide-art" />
      <Art name="data-chart" className="journey-satellite-art" />
      <div className="journey-ticket ticket-left"><span className="ticket-icon yellow"><Lightbulb size={22} /></span><div><small>YOUR RECOMMENDATION</small><strong>Stock more bags</strong></div></div>
      <div className="journey-result"><span>✦ INSIGHT UNLOCKED</span><strong>80 <small>bags sold</small></strong><p>Explain the finding.<br />Help the shop plan ahead.</p></div>
      <div className="journey-tag tag-bottom"><Check size={16} /><strong>Evidence for the next decision</strong></div>
    </div>
  </>;
}

function MarketingPanels() {
  return <>
    <div className="journey-panel journey-panel-0">
      <Art name="audience" className="journey-main-art" />
      <Art name="campaign-phone" className="journey-satellite-art" />
      <div className="journey-ticket ticket-left"><span className="ticket-icon purple"><Users size={20} /></span><div><small>WHO NEEDS YOUR COURSE?</small><strong>Career switchers</strong></div></div>
      <div className="journey-ticket ticket-right"><span className="ticket-icon coral">🎓</span><div><small>YOUR COMMUNITY</small><strong>Curious graduates</strong></div></div>
      <div className="journey-tag tag-bottom"><Target size={16} /><strong>A message built around a real need</strong></div>
    </div>
    <div className="journey-panel journey-panel-1">
      <Art name="campaign-phone" className="journey-main-art" />
      <Art name="audience" className="journey-satellite-art" />
      <div className="journey-ticket ticket-left"><span className="ticket-icon coral"><Heart size={20} /></span><div><small>YOUR CREATIVE</small><strong>Learn. Build. Grow.</strong></div></div>
      <div className="journey-ticket ticket-right"><span className="ticket-icon mint"><Megaphone size={20} /></span><div><small>CAMPAIGN IS LIVE</small><strong>2,000 people reached</strong></div></div>
      <div className="journey-tag tag-bottom"><span>Meta Ads</span><span>Google Ads</span><strong>2,000 people discover your course</strong></div>
    </div>
    <div className="journey-panel journey-panel-2">
      <Art name="campaign-phone" className="journey-main-art journey-phone-left" />
      <Art name="audience" className="journey-side-audience" />
      <div className="journey-click-path"><MousePointerClick size={26} /><span /><ArrowRight size={25} /></div>
      <div className="journey-ticket ticket-left"><span className="ticket-icon blue"><MousePointerClick size={20} /></span><div><small>FROM AD TO COURSE PAGE</small><strong>200 interested visitors</strong></div></div>
      <div className="journey-ticket ticket-right"><span className="ticket-icon yellow"><Sparkles size={20} /></span><div><small>THE NEXT STEP</small><strong>Explore the course ↗</strong></div></div>
      <div className="journey-tag tag-bottom"><span>Content</span><span>Landing pages</span><strong>200 visitors explore the course</strong></div>
    </div>
    <div className="journey-panel journey-panel-3">
      <Art name="growth-rocket" className="journey-main-art" />
      <Art name="marketing-campaign" wide className="journey-satellite-art" />
      <div className="journey-ticket ticket-left"><span className="ticket-icon mint"><Check size={20} /></span><div><small>CAMPAIGN RESULTS</small><strong>20 new sign-ups</strong></div></div>
      <div className="journey-result"><span>✦ GROWTH UNLOCKED</span><strong>10% <small>conversion</small></strong><p>20 sign-ups ÷ 200 visits.<br />Measure. Learn. Improve.</p></div>
      <div className="journey-tag tag-bottom"><span>GA4</span><TrendingUp size={16} /><strong>20 sign-ups. A result you can improve.</strong></div>
    </div>
  </>;
}

export default function StudentCareerScroll({ variant }: { variant: Variant }) {
  const story = stories[variant];
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let frame = 0;
    let previousTime = 0;
    let displayedProgress: number | null = null;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (time: number) => {
      frame = 0;
      const section = root.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight + 72);
      const target = reduced.matches ? 1 : clamp((72 - rect.top) / distance);
      const elapsed = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      displayedProgress = displayedProgress === null || reduced.matches
        ? target
        : displayedProgress + (target - displayedProgress) * (1 - Math.exp(-elapsed / 75));
      const progress = Math.abs(target - displayedProgress) < 0.0002 ? target : displayedProgress;
      const scene = progress * 3;
      setStage(Math.round(scene));
      section.style.setProperty('--journey-progress', String(progress));
      for (let i = 0; i < 4; i++) {
        const delta = scene - i;
        section.style.setProperty('--scene-' + i, String(clamp((0.58 - Math.abs(delta)) / 0.16)));
        section.style.setProperty('--shift-' + i, String(delta));
      }
      if (progress !== target) frame = requestAnimationFrame(update);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(performance.now());
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    const observer = new ResizeObserver(schedule);
    if (root.current) observer.observe(root.current);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); reduced.removeEventListener('change', schedule); };
  }, []);

  return <section ref={root} className={'career-scroll career-scroll-' + variant} id={variant + '-student-journey'} aria-labelledby={variant + '-journey-title'} style={{ '--career-accent': story.color } as React.CSSProperties}>
    <div className="career-sticky"><div className="career-shell">
      <header className="career-heading"><p><span />{variant === 'analytics' ? 'EXPLORE DATA ANALYTICS' : 'EXPLORE DIGITAL MARKETING'}</p><h2 id={variant + '-journey-title'}>{variant === 'analytics' ? <>Find the story<br /><em>behind the numbers.</em></> : <>Create a campaign.<br /><em>See what it changes.</em></>}</h2><div>{story.intro}</div></header>
      <div className="career-layout">
        <div className="career-lesson">
          <div className="career-step-copy" key={stage}><h3>{story.steps[stage].title}</h3><p>{story.steps[stage].text}</p><span className="career-tool">{story.steps[stage].tool}</span></div>
          <Link href={story.course} className="career-cta">Explore this career <ArrowRight size={16} /></Link>
        </div>
        <div className="journey-canvas" aria-hidden="true"><div className="journey-orbit orbit-one" /><div className="journey-orbit orbit-two" /><span className="journey-spark spark-one">✦</span><span className="journey-spark spark-two">✧</span><span className="journey-spark spark-three">+</span><div className="journey-scene-label">{sceneTitles[variant][stage]}</div>{variant === 'analytics' ? <AnalyticsPanels /> : <MarketingPanels />}</div>
      </div>
      <div className="career-accessible-steps">{story.steps.map(step => <div key={step.title}><h3>{step.title}</h3><p>{step.text}</p></div>)}</div>
    </div></div>
  </section>;
}
