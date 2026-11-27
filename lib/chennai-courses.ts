export const chennaiCourses = {
  analytics: {
    path: "/data-analytics-course-in-chennai",
    label: "Data Analytics",
    title: "Data Analytics Course in Chennai",
    description: "Learn Data Analytics in Thoraipakkam, Chennai with practical training in SQL, Python, Power BI, Tableau and Excel. Explore the syllabus and request batch details.",
    introduction: "Turn business questions into useful answers. Practise querying databases, preparing datasets and building dashboards you can explain.",
    courseSlug: "data-analytics-master-program",
    related: ["sql-for-data-analytics", "python-data-analytics", "power-bi-business-intelligence", "tableau-visual-analytics", "advanced-excel-financial-modeling", "business-analyst-product-analytics"],
    image: "/images/card-photos/analytics-screen.jpg",
    keywords: ["data analytics course in Chennai", "data analytics training in Chennai", "Power BI training in Chennai", "SQL and Python course in Chennai", "Tableau training in Chennai", "data analytics course in Thoraipakkam"],
    tools: ["SQL with Oracle", "Python", "Power BI", "Tableau", "Excel"],
    practice: [
      { title: "Query and prepare a dataset", text: "Join tables with SQL and use Python to clean, explore and visualise the results." },
      { title: "Build an interactive dashboard", text: "Model your data in Power BI or Tableau, compare trends and explain the findings." },
    ],
    faq: [
      { question: "Which tools does the course cover?", answer: "The curriculum covers SQL with Oracle, Python with pandas and NumPy, Power BI, Tableau and Excel." },
      { question: "Is this suitable for beginners?", answer: "The syllabus starts with fundamentals in Python and SQL before progressing to analytical functions and dashboards. Contact admissions to discuss your starting point." },
    ],
  },
  marketing: {
    path: "/digital-marketing-course-in-chennai",
    label: "Digital Marketing",
    title: "Digital Marketing Course in Chennai",
    description: "Explore Digital Marketing training in Thoraipakkam, Chennai. Learn SEO analytics, Google Ads, Meta Ads, GA4 and campaign measurement at SEEYAM.",
    introduction: "Learn how people find businesses online, plan campaigns for the right audience and use measurement to decide what to improve.",
    courseSlug: "digital-marketing-growth-analytics",
    related: [],
    image: "/images/card-photos/marketing-team.jpg",
    keywords: ["digital marketing course in Chennai", "digital marketing training in Chennai", "performance marketing course Chennai", "SEO training in Chennai", "Google Ads and GA4 training Chennai", "digital marketing course in Thoraipakkam"],
    tools: ["SEO analytics", "Google Ads", "Meta Ads", "GA4", "Google Tag Manager"],
    practice: [
      { title: "Plan and evaluate a campaign", text: "Choose an audience and a channel, draft an ad, then decide which metrics show whether it worked." },
      { title: "Track and improve conversions", text: "Set up a measurement plan with GA4 and Google Tag Manager and assess where visitors drop off." },
    ],
    faq: [
      { question: "What does the digital marketing course cover?", answer: "The program covers web analytics, Google Ads, paid social, conversion optimisation and attribution. Open the syllabus for the full list of topics." },
      { question: "Can I learn campaign measurement?", answer: "Yes. The curriculum includes GA4 events, Google Tag Manager, funnel reports and measuring conversions." },
    ],
  },
} as const;

export type ChennaiTrack = keyof typeof chennaiCourses;
