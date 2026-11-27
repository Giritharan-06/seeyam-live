import type { SyllabusModule } from "./mock-data";
import { curriculumTracks, parseSyllabusLines } from "./course-curriculum";

type TopicGroup = { title: string; topics: string[] };
const python: TopicGroup[] = [
  { title: "Python setup & programming fundamentals", topics: [
    "Introduction to Python and literate programming", "Install Anaconda and use Jupyter Notebook",
    "Hello World and the print function", "Strings and regular expressions", "Functions, conditions and loops",
    "Lists, tuples, dictionaries and sets", "Packages and modules",
  ] },
  { title: "Python data processing & visualisation", topics: [
    "File handling and file data processing", "Functional programming with map, filter and lambda",
    "NumPy arrays", "Data analysis with pandas", "Charts with Matplotlib",
  ] },
];
const sql: TopicGroup[] = [
  { title: "Oracle SQL & relational databases", topics: [
    "Introduction to SQL and relational databases", "Install and connect to Oracle Database",
    "Data types and operators", "Data query, manipulation and transaction control commands",
    "Joins, constraints and set operators",
  ] },
  { title: "SQL functions & analytical queries", topics: [
    "Case conversion and character functions", "Date, null, numeric and general functions",
    "Aggregate, grouping and analytical functions", "Views and materialized views", "Subqueries and pseudocolumns",
  ] },
];
const tableau: TopicGroup[] = [
  { title: "Tableau Desktop & data preparation", topics: [
    "Tableau products and interface", "Data types, connection types and file extensions",
    "Dimensions and measures", "Sets, parameters, groups, bins and hierarchies",
    "Combining fields, sorting and filtering", "Data modelling in Tableau",
  ] },
  { title: "Tableau calculations & dashboards", topics: [
    "Quick table calculations and analytics functions", "Number, aggregate, logical, string and date functions",
    "Table, window and level-of-detail (LOD) calculations", "Chart types, axes and maps",
    "Dashboard functions and actions", "Build a dashboard from scratch",
  ] },
  { title: "Tableau Server & Online", topics: [
    "Embedded and published data sources", "Site roles and user controls", "Row-level security",
    "Alerts, subscriptions and metrics", "Empty extracts",
  ] },
];
const powerBi: TopicGroup[] = [
  { title: "Power BI data preparation with Power Query", topics: [
    "Microsoft Power BI, Power Query Editor and M", "Data types and column tracking",
    "Split, choose, extract and format columns", "Keep and remove rows and duplicate queries",
    "Append, merge and join queries", "Power Query functions and dimension tables",
  ] },
  { title: "Power BI modelling, DAX & reporting", topics: [
    "Data modelling in Power BI", "DAX data types and basic functions",
    "DAX date, aggregation, logical and filter functions", "DAX time intelligence and information functions",
    "Dashboard visualisation and formatting", "Publishing and working in Power BI Service",
  ] },
];

const analyticsTopicGroups: Record<string, TopicGroup[]> = {
  "python-data-analytics": python,
  "sql-for-data-analytics": sql,
  "tableau-visual-analytics": tableau,
  "power-bi-business-intelligence": powerBi,
};

export function syllabusTopicTitle(title: string) {
  const cleaned = title.trim()
    .replace(/^(?:module|week|unit)\s+[\divxlcdm]+(?:\s*[-–—.:]\s*|\s+|$)/i, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/\s*[([]\s*\d+(?:\s*[-–]\s*\d+)?\s+weeks?\s*[)\]]\s*$/i, "")
    .trim();
  return cleaned;
}

export function syllabusTopicsForDisplay(syllabus: SyllabusModule[]) {
  return syllabus.flatMap(({ title, topics }) => {
    const name = syllabusTopicTitle(title);
    const subtopics = [...new Set(topics.map(topic => topic.trim()).filter(Boolean))];
    return name || subtopics.length ? [{ title: name || "Additional course topics", topics: subtopics }] : [];
  });
}

const marketingPlan: { title: string; match?: RegExp; topics?: string[] }[] = [
  { title: "Campaign planning & search intent", topics: ["Choose an audience, channel and campaign objective", "Match advertising copy to search intent"] },
  { title: "SEO analytics", topics: ["Measure organic search traffic and engagement", "Assess how organic search contributes to conversions"] },
  { title: "Google Analytics 4", match: /GA4|custom exploration|BigQuery export/i },
  { title: "Google Tag Manager", match: /tag manager/i, topics: ["Plan tags and events for conversion measurement"] },
  { title: "Google Ads: Search, Display & Performance Max", match: /Google Ads|Performance Max|smart bidding/i, topics: ["Search and Display campaign formats"] },
  { title: "Meta Ads & paid social measurement", match: /Meta Pixel|Advantage\+|creative fatigue/i },
  { title: "LinkedIn Ads", match: /LinkedIn/i, topics: ["Measure results for B2B campaigns"] },
  { title: "Landing pages, conversion optimisation & A/B testing", match: /ad copy|landing page|A\/B testing/i, topics: ["Plan a split test and compare conversion rates"] },
  { title: "Attribution & marketing mix", match: /attribution|marketing mix/i },
  { title: "Campaign project & reporting", match: /capstone/i, topics: ["Measure the campaign against its goal and explain what to improve"] },
];

function marketingTopicGroups(modules: SyllabusModule[]): SyllabusModule[] {
  const expected = [/google analytics 4/i, /performance marketing/i, /paid social analytics/i, /conversion rate optimization/i];
  const source = modules.filter(entry => expected.some(match => match.test(entry.title)));
  if (source.length < expected.length) return modules;
  const remaining = new Set(source.flatMap(entry => entry.topics));
  const grouped = marketingPlan.map(area => {
    const topics = [...remaining].filter(topic => area.match?.test(topic));
    topics.forEach(topic => remaining.delete(topic));
    return { title: area.title, duration: "", topics: [...topics, ...(area.topics ?? [])] };
  });
  const additional = modules.flatMap(entry => {
    if (!source.includes(entry)) return [entry];
    const topics = entry.topics.filter(topic => remaining.has(topic));
    return topics.length ? [{ ...entry, topics }] : [];
  });
  return [...grouped.filter(area => area.topics.length > 0), ...additional];
}

export function publicSyllabus(slug: string, modules: SyllabusModule[], editedLines: string[]): SyllabusModule[] {
  const edited = parseSyllabusLines(editedLines);
  if (edited.length) return edited;
  if (slug === "digital-marketing-growth-analytics") return marketingTopicGroups(modules);

  const combined = slug === "data-analytics-master-program";
  const tracks = combined ? curriculumTracks : curriculumTracks.filter(track => track.slug === slug);
  if (!tracks.length) return modules;

  const legacyTopics = new Set(tracks.flatMap(track => track.topics));
  const base = modules.flatMap(module => {
    const topics = module.topics.filter(topic => !legacyTopics.has(topic));
    return topics.length || module.topics.length === 0 ? [{ ...module, topics }] : [];
  });
  if (!combined) {
    return [...tracks.flatMap(track => analyticsTopicGroups[track.slug].map(group => ({ ...group, duration: "" }))), ...base];
  }

  const remaining = new Set(base);
  const organised = tracks.flatMap(track => {
    const matches = [...remaining].filter(module => track.match.test(module.title));
    matches.forEach(module => remaining.delete(module));
    const groups = analyticsTopicGroups[track.slug];
    return groups.map((group, index) => ({
      ...group,
      duration: "",
      topics: index === groups.length - 1
        ? [...new Set([...group.topics, ...matches.flatMap(module => module.topics)])]
        : group.topics,
    }));
  });
  return [...remaining, ...organised];
}
