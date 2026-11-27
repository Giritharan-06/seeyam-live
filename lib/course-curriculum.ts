import type { SyllabusModule } from "./mock-data";

const analyticsTopics = {
  python: [
    "Python introduction and literate programming",
    "Install Anaconda and set up Jupyter Notebook",
    "Hello World and Python basics",
    "Strings and regular expressions",
    "Functions, conditional statements and iteration",
    "Lists, tuples, dictionaries and sets",
    "Packages and modules",
    "File handling and file data processing",
    "Functional programming with map, filter and lambda",
    "NumPy, pandas and Matplotlib",
  ],
  sql: [
    "Introduction to SQL and databases",
    "Oracle database engine installation",
    "Data types and operators",
    "Case conversion and character functions",
    "Date, null, numeric and general functions",
    "Aggregate, grouping and analytical functions",
    "Data manipulation, data query and transaction control commands",
    "Joins, constraints and set operators",
    "Views and materialized views",
    "Subqueries and pseudocolumns",
  ],
  tableau: [
    "Tableau interface and product overview",
    "Desktop data types, connection types and file formats",
    "Dimensions, measures, sets, parameters and groups",
    "Bins, hierarchies, combining fields and sorting",
    "Axes, maps, filters and chart types",
    "Quick table calculations and analytics functions",
    "Number, aggregate, logical, string, window and date functions",
    "Table calculation functions and level of detail (LOD)",
    "Dashboard functions, actions and data modelling",
    "Tableau Server and Online with embedded and published data sources",
    "Site roles, user controls and row-level security",
    "Alerts, subscriptions, metrics and empty extracts",
    "Build a dashboard from scratch",
  ],
  powerBi: [
    "Microsoft Power BI and Power Query M",
    "Data types and column tracking in Power Query Editor",
    "Split, choose, extract and format columns",
    "Keep or remove rows and duplicate queries",
    "Append and merge queries with join kinds",
    "Create dimension tables and build a data model",
    "DAX data types and basic functions",
    "DAX date, aggregation, logical and filter functions",
    "DAX time intelligence and information functions",
    "Power BI visualisation, dashboards and formatting",
    "Publish and work in Power BI Service",
  ],
};

export const curriculumTracks = [
  { slug: "python-data-analytics", title: "Python for Data Analysis", match: /\bpython\b/i, topics: analyticsTopics.python },
  { slug: "sql-for-data-analytics", title: "SQL with Oracle", match: /\bsql\b/i, topics: analyticsTopics.sql },
  { slug: "tableau-visual-analytics", title: "Tableau Desktop and Server", match: /\btableau\b/i, topics: analyticsTopics.tableau },
  { slug: "power-bi-business-intelligence", title: "Power BI, Power Query and DAX", match: /power bi/i, topics: analyticsTopics.powerBi },
];

export function parseSyllabusLines(editedLines: string[]): SyllabusModule[] {
  return editedLines.flatMap(line => {
    const [title, second = "", third] = line.split("|").map(part => part.trim());
    const duration = third === undefined ? "" : second;
    const topics = third ?? second;
    // Legacy rows used commas. New rows use semicolons so topic names can contain commas.
    const separator = third !== undefined && !topics.includes(";") ? "," : ";";
    return title ? [{ title, duration, topics: topics.split(separator).map(topic => topic.trim()).filter(Boolean) }] : [];
  });
}

export function publishedSyllabus(slug: string, modules: SyllabusModule[], editedLines: string[]): SyllabusModule[] {
  const edited = parseSyllabusLines(editedLines);
  if (edited.length) return edited;

  const tracks = slug === "data-analytics-master-program" ? curriculumTracks : curriculumTracks.filter(track => track.slug === slug);
  const syllabus = [...modules];
  for (const track of tracks) {
    const index = modules.findIndex(module => track.match.test(module.title));
    if (index === -1) {
      syllabus.push({ title: track.title, duration: "", topics: track.topics });
    } else {
      const module = syllabus[index];
      syllabus[index] = { ...module, topics: [...new Set([...module.topics, ...track.topics])] };
    }
  }
  return syllabus;
}
