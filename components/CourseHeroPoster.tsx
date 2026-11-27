import { BarChart3, Database, Filter, Globe2, LineChart, Megaphone, Search, Share2, Table2, Target, Users, Workflow } from "lucide-react";
import type { ChennaiTrack } from "@/lib/chennai-courses";
import styles from "./CourseHeroVisual.module.css";

const topics = {
  analytics: {
    title: "Data Analytics",
    description: "Turn raw data into decisions.",
    image: "/images/card-photos/financial-report.jpg",
    Graphic: LineChart,
    items: [
      { label: "Excel spreadsheets", icon: Table2 },
      { label: "SQL queries", icon: Database },
      { label: "Python analysis", icon: Workflow },
      { label: "Data cleaning", icon: Filter },
      { label: "Power BI dashboards", icon: BarChart3 },
      { label: "Tableau visualisation", icon: LineChart },
    ],
  },
  marketing: {
    title: "Digital Marketing",
    description: "Reach the right people and measure what works.",
    image: "/images/card-photos/professional-workspace.jpg",
    Graphic: Target,
    items: [
      { label: "SEO & search", icon: Search },
      { label: "Paid advertising", icon: Megaphone },
      { label: "Social media", icon: Share2 },
      { label: "Content strategy", icon: Globe2 },
      { label: "Audience targeting", icon: Users },
      { label: "GA4 & conversions", icon: Target },
    ],
  },
};

export default function CourseHeroPoster({ track }: { track: ChennaiTrack }) {
  const { title, description, image, Graphic, items } = topics[track];
  return (
    <div className={`${styles.poster} ${track === "marketing" ? styles.marketingPoster : ""}`}>
      <img className={styles.posterPhoto} src={image} alt="" />
      <div className={styles.posterGraphic} aria-hidden="true"><Graphic size={25} /></div>
      <div className={styles.posterCopy}>
        <h2>{title}</h2>
        <p>{description}</p>
        <ul>
          {items.map(({ label, icon: Icon }) => (
            <li key={label}><Icon size={15} aria-hidden="true" /> {label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
