export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface SyllabusModule {
  title: string;
  duration: string;
  topics: string[];
}

export interface CourseData {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  summary: string;
  duration: string;
  mode: "CLASSROOM" | "ONLINE" | "HYBRID";
  price: number;
  expectedSalary: string;
  rating: number;
  enrolledCount: number;
  isFeatured: boolean;
  syllabus: SyllabusModule[];
  syllabusModules?: { moduleTitle: string; topics: string[] }[];
  brochureUrl?: string;
  highlights: string[];
  hiringPartners?: string[];
}

export interface FAQData {
  id: string;
  question: string;
  answer: string;
  courseId?: string | null;
  category?: "placements" | "curriculum" | "admissions" | "modes" | "tools" | "general";
  order: number;
  createdAt: string;
}

export interface InterviewQuestionData {
  id: string;
  courseId: string;
  question: string;
  answer?: string;
  category: string; // e.g. "Power BI", "SQL", "Tableau", "Python", "Digital Marketing"
  order: number;
  createdAt: string;
}

export type ResourceType = "RESUME_TEMPLATE" | "PRACTICE_SHEET" | "BROCHURE" | "SYLLABUS_PDF";

export interface ResourceData {
  id: string;
  title: string;
  type: ResourceType;
  fileUrl: string;
  courseId?: string | null;
  fileSize?: string;
  category?: string;
  description?: string;
  createdAt: string;
}

export interface JobPortalLinkData {
  id: string;
  siteName: string;
  url: string;
  roleFilter: string; // e.g. "data-analyst", "bi-developer", "digital-marketer", "python-engineer"
  icon?: string;
  badge?: string;
  order: number;
  createdAt: string;
}

export interface BranchData {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  timing: string;
  mapEmbedUrl: string;
  landmark: string;
}

export interface BatchData {
  id: string;
  courseId: string;
  branchId: string;
  instructorName: string;
  instructorExp: string;
  startDate: string;
  timing: string;
  maxSeats: number;
  seatsLeft: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
}

export interface PlacementStoryData {
  id: string;
  studentName: string;
  companyName: string;
  role: string;
  packageCtc: string;
  studentAvatarUrl: string;
  courseId: string;
  branchId?: string;
  quote?: string;
  previousRole?: string;
  linkedinUrl?: string;
}

export interface LeadNote {
  id: string;
  timestamp: string;
  text: string;
  author: string;
}

export interface LeadData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  branchId: string;
  courseId: string;
  status: "NEW" | "CONTACTED" | "COUNSELING" | "ENROLLED" | "DROPPED";
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
  source?: string;
  reason?: "ENQUIRY" | "BROCHURE_DOWNLOAD" | "DEMO_VIDEO";
  brochureUrl?: string;
}

export interface ReviewData {
  id: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  branchId: string;
  rating: number;
  title: string;
  body: string;
  completionYear: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeroMediaSettings {
  youtubeUrl: string;
  title: string;
  subtitle: string;
  badge: string;
}

export const INITIAL_HERO_MEDIA: HeroMediaSettings = {
  youtubeUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
  title: "Inside Seeyam Technologies — Campus Tour & Student Transformations",
  subtitle: "Watch how our students master real-world software development, cloud infrastructure, and land top-tier tech jobs.",
  badge: "Featured Campus Tour & Masterclass",
};

// ─── Categories ─────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: CategoryData[] = [
  {
    id: "cat-bi",
    name: "Business Intelligence & Visualization",
    slug: "business-intelligence-visualization",
    icon: "BarChart3",
    description: "Master Power BI, Tableau, executive reporting, interactive dashboards, and DAX modeling.",
  },
  {
    id: "cat-sql",
    name: "SQL & Data Engineering",
    slug: "sql-data-engineering",
    icon: "Database",
    description: "Analytical SQL queries, complex window functions, database schema design, and cloud data warehousing.",
  },
  {
    id: "cat-python",
    name: "Python for Analytics & AI",
    slug: "python-for-analytics-ai",
    icon: "FileCode2",
    description: "Exploratory data analysis, Pandas, NumPy, statistical hypothesis testing, and machine learning models.",
  },
  {
    id: "cat-business",
    name: "Business & Product Analytics",
    slug: "business-product-analytics",
    icon: "LineChart",
    description: "KPI frameworks, Jira, user stories, A/B testing, cohort retention, and product growth funnels.",
  },
  {
    id: "cat-excel",
    name: "Advanced Excel & Financial Modeling",
    slug: "advanced-excel-financial-modeling",
    icon: "Table",
    description: "Power Query, dynamic arrays, VBA macros, financial valuation models, and automated reporting.",
  },
  {
    id: "cat-marketing",
    name: "Digital Marketing & Growth Analytics",
    slug: "digital-marketing-growth-analytics",
    icon: "TrendingUp",
    description: "Google Analytics 4 (GA4), GTM, Meta Ads analytics, SEO data mining, and conversion optimization.",
  },
];

// ─── Branches ───────────────────────────────────────────────────────────────

export const MOCK_BRANCHES: BranchData[] = [
  {
    id: "branch-omr",
    name: "OMR - Navalur (HQ)",
    slug: "omr-navalur",
    address: "Plot No. 42, Rajiv Gandhi Salai (OMR), Navalur, Near AGS Cinemas",
    city: "Chennai",
    phone: "+91 89399 15577",
    whatsapp: "+918939915577",
    email: "omr@seeyamtechnologies.com",
    timing: "Mon - Sun: 7:00 AM - 9:00 PM",
    landmark: "Opposite to Vivira Mall",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.31289182377!2d80.2257!3d12.8436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUwJzM2LjkiTiA4MMKwMTMnMzIuNSJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  },
  {
    id: "branch-vadapalani",
    name: "Vadapalani",
    slug: "vadapalani",
    address: "2nd Floor, Arcot Road, Next to Forum Vijaya Mall, Vadapalani",
    city: "Chennai",
    phone: "+91 89399 25588",
    whatsapp: "+918939925588",
    email: "vadapalani@seeyamtechnologies.com",
    timing: "Mon - Sun: 7:00 AM - 9:00 PM",
    landmark: "Next to Forum Vijaya Mall",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8!2d80.209!3d13.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAzJzAwLjAiTiA4MMKwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  },
  {
    id: "branch-tambaram",
    name: "Tambaram Sanatorium",
    slug: "tambaram-sanatorium",
    address: "GST Road, Near MEPZ Main Gate, Tambaram Sanatorium",
    city: "Chennai",
    phone: "+91 89399 35599",
    whatsapp: "+918939935599",
    email: "tambaram@seeyamtechnologies.com",
    timing: "Mon - Sun: 7:00 AM - 9:00 PM",
    landmark: "Opposite to MEPZ",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d80.125!3d12.925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzMwLjAiTiA4MMKwMDcnMzAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  },
  {
    id: "branch-marathahalli",
    name: "Marathahalli",
    slug: "marathahalli",
    address: "Outer Ring Road, Near Innovative Multiplex, Marathahalli",
    city: "Bangalore",
    phone: "+91 99000 45511",
    whatsapp: "+919900045511",
    email: "bangalore@seeyamtechnologies.com",
    timing: "Mon - Sun: 7:00 AM - 9:00 PM",
    landmark: "Near Marathahalli Bridge",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9!2d77.70!3d12.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU3JzAwLjAiTiA3N8KwNDInMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  },
  {
    id: "branch-hitec",
    name: "HITEC City - Madhapur",
    slug: "hitec-city",
    address: "Image Gardens Road, VIP Hills, Madhapur, Near Cyber Towers",
    city: "Hyderabad",
    phone: "+91 98888 65522",
    whatsapp: "+919888865522",
    email: "hyderabad@seeyamtechnologies.com",
    timing: "Mon - Sun: 7:00 AM - 9:00 PM",
    landmark: "Near Cyber Towers",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2!2d78.38!3d17.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzI0LjAiTiA3OMKwMjInNDguMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin",
  },
];

// ─── Courses ────────────────────────────────────────────────────────────────

export const MOCK_COURSES: CourseData[] = [
  {
    id: "course-da-mastery",
    title: "Data Analytics Master Program (Power BI, SQL, Python, Excel & Tableau)",
    slug: "data-analytics-master-program",
    categoryId: "cat-bi",
    summary: "Comprehensive flagship certification covering end-to-end data analytics: Power BI, Advanced SQL, Python (Pandas/NumPy), Tableau, and Advanced Excel with 8 live enterprise capstone projects.",
    duration: "4 Months / 120 Hours",
    mode: "HYBRID",
    price: 38000,
    expectedSalary: "₹ 5.5 - 14.5 LPA",
    rating: 4.95,
    enrolledCount: 18400,
    isFeatured: true,
    hiringPartners: ["Amazon", "Google", "Microsoft", "Zoho", "Deloitte", "Accenture"],
    highlights: [
      "100% Placement Assurance with Tier-1 MNC Recruitment",
      "End-to-End Analytics Stack: Power BI, SQL, Python & Tableau",
      "8 Real-world Enterprise Dashboards & Portfolios",
      "Microsoft PL-300 & Tableau Certified Data Analyst Prep",
    ],
    syllabus: [
      {
        title: "Module 1: Advanced Excel & Business Modeling",
        duration: "3 Weeks",
        topics: ["Advanced XLOOKUP & Dynamic Arrays", "Power Query ETL & Data Modeling", "Pivot Charts & Slicers", "Financial Modeling & Sensitivity Analysis"],
      },
      {
        title: "Module 2: Relational Databases & SQL for Analytics",
        duration: "3 Weeks",
        topics: ["DDL, DML & Schema Design", "Complex Joins & Aggregations", "Window Functions (RANK, DENSE_RANK, LEAD/LAG)", "Subqueries, CTEs & Query Optimization"],
      },
      {
        title: "Module 3: Power BI Business Intelligence",
        duration: "4 Weeks",
        topics: ["Star-Schema Data Modeling", "DAX Formulas & Time Intelligence", "Power BI Service & Workspace Governance", "Row-Level Security (RLS) & Scheduled Refresh"],
      },
      {
        title: "Module 4: Tableau Visual Analytics & Storytelling",
        duration: "3 Weeks",
        topics: ["Visual Best Practices & Chart Types", "Level of Detail (LOD) Calculations", "Parameters & Dynamic Actions", "Interactive Executive Storyboards"],
      },
      {
        title: "Module 5: Python for Exploratory Data Analysis",
        duration: "3 Weeks",
        topics: ["NumPy & Pandas Data Wrangling", "Data Cleaning & Handling Missing Values", "Matplotlib & Seaborn Visualizations", "Statistical Hypothesis Testing & Case Studies"],
      },
    ],
  },
  {
    id: "course-power-bi",
    title: "Power BI & Business Intelligence Masterclass (DAX, Power Query & Fabric)",
    slug: "power-bi-business-intelligence",
    categoryId: "cat-bi",
    summary: "Complete deep dive into Microsoft Power BI: advanced DAX formulas, Power Query M-code, star-schema data modeling, Fabric integration, and enterprise dashboard deployment.",
    duration: "2.5 Months / 75 Hours",
    mode: "HYBRID",
    price: 26000,
    expectedSalary: "₹ 5.0 - 12.0 LPA",
    rating: 4.92,
    enrolledCount: 14200,
    isFeatured: true,
    hiringPartners: ["Deloitte", "EY", "Cognizant", "PwC", "Infosys"],
    highlights: [
      "Microsoft Certified: Power BI Data Analyst Associate (PL-300) Aligned",
      "Advanced DAX: Time Intelligence, Calculate Modifiers & Dynamic Measures",
      "Power BI Service: Workspaces, Gateways, Row-Level Security & Mobile Layouts",
      "5 Live Dashboards: Financial P&L, Sales Performance, HR Analytics",
    ],
    syllabus: [
      {
        title: "Module 1: Data Modeling & Star Schema Design",
        duration: "2 Weeks",
        topics: ["Fact vs Dimension Tables", "Relationship Cardinality & Cross-Filtering", "Snowflake vs Star Schema", "Optimizing VertiPaq Engine"],
      },
      {
        title: "Module 2: Power Query & Advanced M-Code Transformations",
        duration: "2 Weeks",
        topics: ["Custom Column Formulas", "Merging & Appending Multiple Sources", "Pivot / Unpivot Operations", "Automated Error Handling & Parameters"],
      },
      {
        title: "Module 3: DAX Masterclass & Time Intelligence Calculations",
        duration: "3 Weeks",
        topics: ["CALCULATE, FILTER & ALL Functions", "YTD, QTD, MTD & Moving Averages", "Virtual Tables with SUMMARIZE & ADDCOLUMNS", "Performance Profiling with DAX Studio"],
      },
      {
        title: "Module 4: Advanced Visualizations, Bookmarks & Enterprise Deployment",
        duration: "3 Weeks",
        topics: ["Custom Tooltips, Drill-Through & Bookmarks", "Power BI Service Governance & Gateways", "Row-Level Security (RLS) Implementation", "Microsoft Fabric & Direct Lake Integration"],
      },
    ],
  },
  {
    id: "course-sql-analytics",
    title: "SQL for Data Analytics & Cloud Data Warehousing (PostgreSQL & Snowflake)",
    slug: "sql-for-data-analytics",
    categoryId: "cat-sql",
    summary: "Master SQL from complex analytical queries, subqueries, and window functions to query optimization, indexing, and modern cloud warehousing in Snowflake and BigQuery.",
    duration: "2 Months / 60 Hours",
    mode: "CLASSROOM",
    price: 22000,
    expectedSalary: "₹ 4.8 - 11.5 LPA",
    rating: 4.90,
    enrolledCount: 16800,
    isFeatured: true,
    hiringPartners: ["Amazon", "TCS", "Accenture", "Wipro", "Capgemini"],
    highlights: [
      "Complex Window Functions: ROW_NUMBER, DENSE_RANK, NTILE, LAG/LEAD",
      "CTEs, Recursive Queries, Temp Tables & Stored Procedures",
      "Query Optimization, Execution Plans & Indexing Strategies",
      "Hands-on Snowflake & Google BigQuery Cloud Architecture",
    ],
    syllabus: [
      {
        title: "Module 1: SQL Foundations, Aggregations & Joins",
        duration: "2 Weeks",
        topics: ["Relational Algebra & Normalization", "GROUP BY, HAVING & Multi-table Joins", "Self Joins & Anti-Joins", "Data Type Conversions & String Functions"],
      },
      {
        title: "Module 2: Analytical Functions, Subqueries & CTEs",
        duration: "2 Weeks",
        topics: ["Correlated Subqueries & EXISTS", "Common Table Expressions (CTEs)", "Recursive CTEs for Hierarchies", "Date-Time Arithmetic & Timezone Handling"],
      },
      {
        title: "Module 3: Advanced Window Functions & Performance Tuning",
        duration: "2 Weeks",
        topics: ["Ranking Functions: RANK, DENSE_RANK, ROW_NUMBER", "Value Functions: LAG, LEAD, FIRST_VALUE", "Running Totals & Moving Windows", "EXPLAIN ANALYZE & B-Tree Indexing"],
      },
      {
        title: "Module 4: Cloud Data Warehousing with Snowflake & BigQuery",
        duration: "2 Weeks",
        topics: ["Snowflake Virtual Warehouses & Stages", "Loading Semi-Structured JSON Data", "Clustering Keys & Micro-Partitioning", "Connecting SQL to BI Reporting Tools"],
      },
    ],
  },
  {
    id: "course-python-analytics",
    title: "Python for Data Analytics & Exploratory Data Science",
    slug: "python-data-analytics",
    categoryId: "cat-python",
    summary: "Practical, hands-on Python for analysts: NumPy, Pandas data wrangling, data cleaning, automated reporting, Matplotlib/Seaborn visualization, and introductory machine learning algorithms.",
    duration: "3 Months / 90 Hours",
    mode: "HYBRID",
    price: 30000,
    expectedSalary: "₹ 6.0 - 15.0 LPA",
    rating: 4.93,
    enrolledCount: 11500,
    isFeatured: true,
    hiringPartners: ["Google", "Zomato", "Swiggy", "Tiger Analytics", "Mu Sigma"],
    highlights: [
      "Automated Data Pipelines with Pandas & NumPy",
      "Exploratory Data Analysis (EDA) & Statistical Hypothesis Testing",
      "Interactive Web Applications with Streamlit & Plotly",
      "Predictive Modeling: Linear Regression, Logistic Regression & Decision Trees",
    ],
    syllabus: [
      {
        title: "Module 1: Python Essentials & Data Structures for Analysts",
        duration: "3 Weeks",
        topics: ["Lists, Dictionaries, Sets & Tuples", "List Comprehensions & Lambda Functions", "File I/O (CSV, Excel, JSON, Parquet)", "Exception Handling & Modular Code"],
      },
      {
        title: "Module 2: Data Wrangling & Cleaning with NumPy & Pandas",
        duration: "3 Weeks",
        topics: ["NumPy Array Operations & Vectorization", "Pandas DataFrames, Series & Indexing", "Handling Missing Values & Outliers", "Merge, Join, Concat & GroupBy Aggregations"],
      },
      {
        title: "Module 3: Statistical Analysis & Visualization (Matplotlib, Seaborn)",
        duration: "3 Weeks",
        topics: ["Descriptive Statistics & Distributions", "Correlation & Covariance Analysis", "Statistical Hypothesis Testing (T-test, ANOVA, Chi-Sq)", "Interactive Visualizations with Plotly"],
      },
      {
        title: "Module 4: Machine Learning & Interactive Streamlit Apps",
        duration: "3 Weeks",
        topics: ["Linear & Logistic Regression for Business", "Decision Trees & Random Forests", "Model Evaluation (Confusion Matrix, ROC-AUC)", "Building Live Dashboard Apps with Streamlit"],
      },
    ],
  },
  {
    id: "course-tableau-specialist",
    title: "Tableau Desktop & Server Visual Analytics Specialist",
    slug: "tableau-visual-analytics",
    categoryId: "cat-bi",
    summary: "Transform raw transactional data into actionable executive insights with Tableau Desktop & Server: Level of Detail (LOD) calculations, parameters, actions, and server administration.",
    duration: "2 Months / 60 Hours",
    mode: "ONLINE",
    price: 24000,
    expectedSalary: "₹ 5.0 - 13.0 LPA",
    rating: 4.88,
    enrolledCount: 9200,
    isFeatured: false,
    hiringPartners: ["J.P. Morgan", "Deloitte", "Cognizant", "Standard Chartered", "Wipro"],
    highlights: [
      "Tableau Desktop Certified Associate Exam Alignment",
      "Advanced Level of Detail (LOD) Calculations: FIXED, INCLUDE, EXCLUDE",
      "Dynamic Parameter Actions, Set Actions & Dual-Axis Charting",
      "Publishing, Scheduled Extracts & User Permissions on Tableau Server",
    ],
    syllabus: [
      {
        title: "Module 1: Tableau Desktop Architecture & Data Connections",
        duration: "2 Weeks",
        topics: ["Connecting to Excel, SQL & Cloud Databases", "Live vs Extract Connections", "Data Blending & Cross-Database Joins", "Managing Metadata & Data Hierarchies"],
      },
      {
        title: "Module 2: Advanced Calculations & LOD Expressions",
        duration: "2 Weeks",
        topics: ["Table Calculations & Running Totals", "LOD Calculations: FIXED, INCLUDE, EXCLUDE", "Date Functions & Custom Fiscal Years", "String Manipulation & Regular Expressions"],
      },
      {
        title: "Module 3: Interactive Dashboards, Parameters & Visual Storytelling",
        duration: "2 Weeks",
        topics: ["Dashboard Layouts & Container Best Practices", "Filter Actions, Highlight Actions & URL Actions", "Parameter Actions & Set Actions", "Building Executive Story Points"],
      },
      {
        title: "Module 4: Tableau Server, Security & Automated Refresh Schedules",
        duration: "2 Weeks",
        topics: ["Publishing Workbooks & Data Sources", "Row-Level Security & User Filters", "Configuring Scheduled Extract Refreshes", "Tableau Online & Mobile Responsive Layouts"],
      },
    ],
  },
  {
    id: "course-business-analyst",
    title: "Business Analyst & Product Analytics Certification (Agile, Jira & Metrics)",
    slug: "business-analyst-product-analytics",
    categoryId: "cat-business",
    summary: "Bridge business strategy and technical execution: Business Requirement Documents (BRD), User Stories in Jira, Product Funnels, Cohort Analysis, A/B Testing, and stakeholder storytelling.",
    duration: "3 Months / 80 Hours",
    mode: "HYBRID",
    price: 32000,
    expectedSalary: "₹ 6.5 - 16.0 LPA",
    rating: 4.89,
    enrolledCount: 8700,
    isFeatured: true,
    hiringPartners: ["McKinsey", "Deloitte", "Zoho", "Blinkit", "Flipkart"],
    highlights: [
      "ECBA / CCBA International Business Analysis Frameworks",
      "Jira Software, Confluence & Agile Scrum Sprint Management",
      "Product Metrics: Retention, Churn, LTV, CAC & Conversion Funnels",
      "Interactive Case Studies in FinTech, E-Commerce & Healthcare",
    ],
    syllabus: [
      {
        title: "Module 1: Business Analysis Principles & Requirement Engineering",
        duration: "3 Weeks",
        topics: ["BRD, FRD & SRS Documentation", "Stakeholder Elicitation Techniques", "Process Mapping with BPMN & Lucidchart", "Gap Analysis & Feasibility Studies"],
      },
      {
        title: "Module 2: Agile Scrum Framework & Jira Sprint Execution",
        duration: "3 Weeks",
        topics: ["Agile Values, Scrum Ceremonies & Roles", "Writing INVEST-compliant User Stories", "Backlog Grooming & Sprint Planning in Jira", "Confluence Collaboration & Release Notes"],
      },
      {
        title: "Module 3: Product Metrics, Cohort Retention & Funnel Analysis",
        duration: "3 Weeks",
        topics: ["North Star Metric & KPI Frameworks", "DAU, MAU, Churn & LTV Calculation", "Cohort Analysis & Retention Curves", "Mixpanel & Amplitude Analytics"],
      },
      {
        title: "Module 4: A/B Testing Experimentation & Executive Presentation",
        duration: "3 Weeks",
        topics: ["Hypothesis Formulation & Sample Size Calculation", "Significance Testing & P-values in A/B Tests", "Data Storytelling & Executive Pitch Decks", "Capstone: End-to-End Product PRD & Review"],
      },
    ],
  },
  {
    id: "course-advanced-excel",
    title: "Advanced Excel & Financial Modeling Masterclass",
    slug: "advanced-excel-financial-modeling",
    categoryId: "cat-excel",
    summary: "Master advanced Excel formulas (XLOOKUP, INDEX/MATCH, LAMBDA), Power Query automation, dynamic arrays, VBA macros, and financial statement modeling.",
    duration: "1.5 Months / 45 Hours",
    mode: "CLASSROOM",
    price: 18000,
    expectedSalary: "₹ 4.5 - 9.5 LPA",
    rating: 4.86,
    enrolledCount: 13100,
    isFeatured: false,
    hiringPartners: ["KPMG", "EY", "Grant Thornton", "HDFC Bank", "ICICI"],
    highlights: [
      "Advanced Dynamic Arrays: FILTER, UNIQUE, SORTBY & LAMBDA",
      "Power Query ETL: Transforming & Appending Millions of Rows",
      "Automation with VBA Macros: Userforms & Automated Email Reports",
      "3-Statement Financial Modeling & Valuation Models",
    ],
    syllabus: [
      {
        title: "Module 1: Advanced Formula Architectures & Dynamic Arrays",
        duration: "2 Weeks",
        topics: ["XLOOKUP, INDEX & Nested MATCH", "Dynamic Arrays: FILTER, UNIQUE, SORT, SEQUENCE", "LAMBDA Functions & Custom Calculations", "Indirect, Offset & Array Formulas"],
      },
      {
        title: "Module 2: Power Query ETL & Data Model Pivot Tables",
        duration: "2 Weeks",
        topics: ["Automating Repetitive Data Cleaning", "Connecting Multiple Excel Files & Folders", "Data Modeling in Power Pivot (xVelocity)", "DAX Measures in Excel Pivot Tables"],
      },
      {
        title: "Module 3: VBA Automation, Macros & Custom Functions",
        duration: "1 Week",
        topics: ["Macro Recorder & Visual Basic Editor (VBE)", "Variables, Loops & Conditional Logic in VBA", "Automating Email Dispatch via Outlook", "Building Userforms for Data Entry"],
      },
      {
        title: "Module 4: Financial Statements & Business Forecasting Models",
        duration: "1 Week",
        topics: ["Integrated 3-Statement Financial Model", "DCF Valuation & Sensitivity Analysis", "Scenario Manager & Goal Seek", "Executive Summary Financial Dashboard"],
      },
    ],
  },
  {
    id: "course-digital-marketing",
    title: "Digital Marketing & Growth Analytics (GA4, Meta & Performance Marketing)",
    slug: "digital-marketing-growth-analytics",
    categoryId: "cat-marketing",
    summary: "Master data-driven digital marketing: Google Analytics 4 (GA4), Google Tag Manager (GTM), Meta Ads Manager, Performance Marketing, SEO Analytics, and Conversion Rate Optimization.",
    duration: "3 Months / 90 Hours",
    mode: "HYBRID",
    price: 28000,
    expectedSalary: "₹ 5.0 - 13.5 LPA",
    rating: 4.91,
    enrolledCount: 12900,
    isFeatured: true,
    hiringPartners: ["Performics", "GroupM", "Dentsu", "Swiggy", "Zomato"],
    highlights: [
      "Google Analytics 4 (GA4) Custom Explorations & BigQuery Linking",
      "Google Tag Manager (GTM) Server-Side & Event Tracking",
      "High-ROI Performance Marketing on Meta Ads & Google Search Ads",
      "Live Ad Budgets & Attribution Modeling",
    ],
    syllabus: [
      {
        title: "Module 1: Web Analytics with Google Analytics 4 (GA4) & GTM",
        duration: "3 Weeks",
        topics: ["GA4 Event-Driven Data Model", "Google Tag Manager Triggers & Variables", "Custom Exploration Reports & Funnels", "BigQuery Export & User Lifetime Value"],
      },
      {
        title: "Module 2: Performance Marketing (Google Search, Display & P-Max)",
        duration: "3 Weeks",
        topics: ["Google Ads Auction & Quality Score Optimization", "Search Intent & High-Converting Ad Copy", "Performance Max (P-Max) Campaigns", "Smart Bidding Strategies: Target CPA & ROAS"],
      },
      {
        title: "Module 3: Paid Social Analytics (Meta Ads Manager & LinkedIn Ads)",
        duration: "3 Weeks",
        topics: ["Meta Pixel, Conversions API (CAPI) & Custom Audiences", "Advantage+ Shopping & Catalog Ads", "Creative Fatigue Analysis & Split Testing", "B2B Lead Generation on LinkedIn Ads"],
      },
      {
        title: "Module 4: Conversion Rate Optimization (CRO), A/B Testing & Attribution",
        duration: "3 Weeks",
        topics: ["Landing Page CRO & Heatmap Analysis (Hotjar)", "Multi-Touch Attribution Modeling", "Marketing Mix Modeling (MMM) Concepts", "Live Capstone Campaign with Real Ad Budget"],
      },
    ],
  },
];

// ─── Batches ────────────────────────────────────────────────────────────────

export const MOCK_BATCHES: BatchData[] = [
  {
    id: "batch-101",
    courseId: "course-da-mastery",
    branchId: "branch-omr",
    instructorName: "Karthik Subramanian (Lead Analytics Architect)",
    instructorExp: "12+ Yrs Exp",
    startDate: "2026-09-01",
    timing: "Mon - Fri: 7:30 AM - 9:30 AM (Morning)",
    maxSeats: 30,
    seatsLeft: 6,
    status: "UPCOMING",
  },
  {
    id: "batch-102",
    courseId: "course-power-bi",
    branchId: "branch-vadapalani",
    instructorName: "Venkatesh Raman (Power BI Solution Architect)",
    instructorExp: "14+ Yrs Exp",
    startDate: "2026-09-05",
    timing: "Sat & Sun: 10:00 AM - 2:00 PM (Weekend)",
    maxSeats: 35,
    seatsLeft: 8,
    status: "UPCOMING",
  },
  {
    id: "batch-103",
    courseId: "course-sql-analytics",
    branchId: "branch-marathahalli",
    instructorName: "Pradeep Reddy (Principal Data Engineer)",
    instructorExp: "10+ Yrs Exp",
    startDate: "2026-09-08",
    timing: "Mon - Fri: 6:30 PM - 8:30 PM (Evening)",
    maxSeats: 30,
    seatsLeft: 4,
    status: "UPCOMING",
  },
  {
    id: "batch-104",
    courseId: "course-python-analytics",
    branchId: "branch-hitec",
    instructorName: "Dr. Ananya Sharma (Ex-Amazon Senior Analytics Lead)",
    instructorExp: "11+ Yrs Exp",
    startDate: "2026-09-12",
    timing: "Sat & Sun: 2:30 PM - 6:30 PM (Weekend)",
    maxSeats: 25,
    seatsLeft: 3,
    status: "UPCOMING",
  },
  {
    id: "batch-105",
    courseId: "course-tableau-specialist",
    branchId: "branch-tambaram",
    instructorName: "Senthil Nathan (Tableau Certified Consultant)",
    instructorExp: "13+ Yrs Exp",
    startDate: "2026-09-03",
    timing: "Mon - Fri: 10:00 AM - 12:00 PM (Regular)",
    maxSeats: 30,
    seatsLeft: 11,
    status: "UPCOMING",
  },
];

// ─── Placement Stories ──────────────────────────────────────────────────────

export const MOCK_PLACEMENTS: PlacementStoryData[] = [
  {
    id: "plc-1",
    studentName: "Dinesh Kumar",
    companyName: "Amazon Web Services",
    role: "Lead Data Analyst",
    previousRole: "BPO Voice Associate (₹2.4 LPA)",
    packageCtc: "18.5 LPA",
    studentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    courseId: "course-da-mastery",
    branchId: "branch-omr",
    quote: "Coming from a night-shift BPO role, I thought learning SQL and Python was impossible. Seeyam's mentors broke down every query with daily patience until I cleared the AWS technical bar.",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "plc-2",
    studentName: "Priyanka Swaminathan",
    companyName: "Microsoft",
    role: "Power BI Consultant",
    previousRole: "B.Com Graduate (Zero Coding)",
    packageCtc: "16.5 LPA",
    studentAvatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    courseId: "course-power-bi",
    branchId: "branch-vadapalani",
    quote: "From a pure commerce degree to Microsoft! Building real financial intelligence dashboards and DAX models in the lab proved to interviewers that practical skills matter far more than an engineering degree.",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "plc-3",
    studentName: "Rajesh Varma",
    companyName: "JP Morgan Chase",
    role: "Senior SQL & BI Engineer",
    previousRole: "3-Year Career Gap",
    packageCtc: "15.8 LPA",
    studentAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    courseId: "course-sql-analytics",
    branchId: "branch-marathahalli",
    quote: "I was rejected by multiple recruiters because of my 3-year gap. The placement cell at Seeyam rebuilt my resume around live project work and gave me 5 mock interviews until my interview anxiety disappeared.",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "plc-4",
    studentName: "Keerthana Natarajan",
    companyName: "Deloitte Digital",
    role: "Tableau Visual Analytics Lead",
    previousRole: "Manual QA Tester (₹3.2 LPA)",
    packageCtc: "14.2 LPA",
    studentAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    courseId: "course-tableau-specialist",
    branchId: "branch-omr",
    quote: "I was stuck in manual testing with tiny annual increments. Learning visual analytics storytelling and dashboard optimization opened direct doors to Deloitte with a 4x career jump.",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "plc-5",
    studentName: "Mohammed Farhan",
    companyName: "Zomato / Blinkit",
    role: "Product & Growth Analyst",
    previousRole: "Mechanical Engg Graduate",
    packageCtc: "17.0 LPA",
    studentAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    courseId: "course-business-analyst",
    branchId: "branch-hitec",
    quote: "There were almost zero campus placements for mechanical grads. At Seeyam, I learned user funnel metrics, SQL, and A/B testing on real e-commerce data that got me hired at Blinkit.",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "plc-6",
    studentName: "Sneha Reddy",
    companyName: "Accenture Technology",
    role: "Senior Financial Modeling Analyst",
    previousRole: "Junior Accountant (₹2.8 LPA)",
    packageCtc: "12.5 LPA",
    studentAvatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    courseId: "course-advanced-excel",
    branchId: "branch-tambaram",
    quote: "Automating 3-statement financial models with Power Query turned my routine spreadsheet bookkeeping into high-value corporate decision analytics.",
    linkedinUrl: "https://linkedin.com",
  },
];

// ─── Hiring Partners ────────────────────────────────────────────────────────

export const MOCK_HIRING_PARTNERS = [
  { name: "Google", logoText: "Google", badge: "Tier 1" },
  { name: "Amazon", logoText: "Amazon", badge: "Cloud & E-com" },
  { name: "Microsoft", logoText: "Microsoft", badge: "Global Tech" },
  { name: "Zoho Corporation", logoText: "ZOHO", badge: "SaaS Leader" },
  { name: "TCS", logoText: "TCS", badge: "Global IT" },
  { name: "Infosys", logoText: "Infosys", badge: "Digital Next" },
  { name: "Wipro", logoText: "Wipro", badge: "Enterprise" },
  { name: "Cognizant", logoText: "Cognizant", badge: "Digital Systems" },
  { name: "Accenture", logoText: "Accenture", badge: "Strategy & Tech" },
  { name: "Capgemini", logoText: "Capgemini", badge: "Consulting" },
  { name: "HCL Technologies", logoText: "HCLTech", badge: "Infrastructure" },
  { name: "LTIMindtree", logoText: "LTIMindtree", badge: "Transformations" },
];

// ─── Sample Initial Leads ───────────────────────────────────────────────────

export const INITIAL_LEADS: LeadData[] = [
  {
    id: "lead-001",
    fullName: "Arunachalam Murugan",
    email: "arun.m@gmail.com",
    phone: "9840123456",
    branchId: "branch-omr",
    courseId: "course-mern",
    status: "NEW",
    notes: [
      {
        id: "note-1",
        timestamp: "2026-08-20T10:15:00.000Z",
        text: "Inquired through website hero form for upcoming September weekday batch. Looking for placement assistance.",
        author: "System (Web Lead)",
      },
    ],
    createdAt: "2026-08-20T10:15:00.000Z",
    updatedAt: "2026-08-20T10:15:00.000Z",
    source: "Website Hero CTA",
  },
  {
    id: "lead-002",
    fullName: "Deepa Ramakrishnan",
    email: "deepa.ramki@outlook.com",
    phone: "9876543210",
    branchId: "branch-vadapalani",
    courseId: "course-aws-devops",
    status: "CONTACTED",
    notes: [
      {
        id: "note-2",
        timestamp: "2026-08-19T14:30:00.000Z",
        text: "Called candidate. Currently working as manual tester with 2 years exp. Interested in moving to DevOps.",
        author: "Counselor Pooja",
      },
      {
        id: "note-3",
        timestamp: "2026-08-20T11:00:00.000Z",
        text: "Shared AWS DevOps syllabus on WhatsApp. Scheduled demo session for Saturday 10 AM.",
        author: "Counselor Pooja",
      },
    ],
    createdAt: "2026-08-19T11:20:00.000Z",
    updatedAt: "2026-08-20T11:00:00.000Z",
    source: "Course Grid Modal",
  },
  {
    id: "lead-003",
    fullName: "Srinivas Rao",
    email: "srinivas.rao@gmail.com",
    phone: "9123456780",
    branchId: "branch-hitec",
    courseId: "course-ai-ds",
    status: "COUNSELING",
    notes: [
      {
        id: "note-4",
        timestamp: "2026-08-18T16:45:00.000Z",
        text: "1-on-1 counseling completed with Senior Trainer Dr. Ananya. Discussed GPU lab setup and live project scope.",
        author: "Counselor Rajesh",
      },
    ],
    createdAt: "2026-08-18T09:00:00.000Z",
    updatedAt: "2026-08-18T16:45:00.000Z",
    source: "Branch Walk-in",
  },
  {
    id: "lead-004",
    fullName: "Kavitha Sundaram",
    email: "kavitha.s@yahoo.com",
    phone: "9444112233",
    branchId: "branch-tambaram",
    courseId: "course-automation-testing",
    status: "ENROLLED",
    notes: [
      {
        id: "note-5",
        timestamp: "2026-08-17T12:00:00.000Z",
        text: "Enrolled in Batch 105 (Sept 3rd). Initial registration fee paid ₹5,000. Balance before batch start.",
        author: "Admin Supervisor",
      },
    ],
    createdAt: "2026-08-16T15:30:00.000Z",
    updatedAt: "2026-08-17T12:00:00.000Z",
    source: "Referral by Alumni",
  },
  {
    id: "lead-005",
    fullName: "Rohan Kulkarni",
    email: "rohan.k@gmail.com",
    phone: "9765432109",
    branchId: "branch-marathahalli",
    courseId: "course-java-fsd",
    status: "DROPPED",
    notes: [
      {
        id: "note-6",
        timestamp: "2026-08-15T10:00:00.000Z",
        text: "Relocating to another city for family reasons. Requested to follow up in Jan 2027.",
        author: "Counselor Pooja",
      },
    ],
    createdAt: "2026-08-14T08:20:00.000Z",
    updatedAt: "2026-08-15T10:00:00.000Z",
    source: "Google Search Ads",
  },
];

// ─── Student Reviews & Testimonials ─────────────────────────────────────────

export const MOCK_REVIEWS: ReviewData[] = [
  {
    id: "rev-001",
    studentName: "Aditya Prakash",
    studentEmail: "aditya.p@gmail.com",
    courseId: "course-da-mastery",
    branchId: "branch-omr",
    rating: 5,
    title: "Life-changing Data Analytics Master Program!",
    body: "I joined Seeyam Technologies as a non-tech graduate with just basic computer knowledge. The Data Analytics Master Program was structured brilliantly — starting from Excel and Advanced SQL all the way to Power BI and Python for analytics. The trainers had 12+ years of real industry experience and the e-commerce analytics capstone was invaluable. Within 2 months of completing the course, I got placed at Cognizant with an 8.5 LPA package. Highly recommend this institute!",
    completionYear: "2026",
    status: "APPROVED",
    createdAt: "2026-07-15T08:30:00.000Z",
    updatedAt: "2026-07-16T10:00:00.000Z",
  },
  {
    id: "rev-002",
    studentName: "Priya Venkatesh",
    studentEmail: "priya.v@outlook.com",
    courseId: "course-power-bi",
    branchId: "branch-vadapalani",
    rating: 5,
    title: "Power BI DAX course exceeded all expectations",
    body: "Coming from a finance background (B.Com graduate), I needed to upskill into Business Intelligence. The Power BI masterclass at Vadapalani campus was incredible. We learned advanced DAX formulas, Power Query M-code, and built live financial P&L dashboards. The mock interview sessions with BI leads prepared me thoroughly. I'm now working as a Power BI Analyst at an MNC with a 7.2 LPA offer.",
    completionYear: "2026",
    status: "APPROVED",
    createdAt: "2026-07-20T14:00:00.000Z",
    updatedAt: "2026-07-21T09:00:00.000Z",
  },
  {
    id: "rev-003",
    studentName: "Karthik Narayanan",
    studentEmail: "karthik.n@gmail.com",
    courseId: "course-sql-analytics",
    branchId: "branch-marathahalli",
    rating: 4,
    title: "Solid SQL & Cloud Data Warehousing training",
    body: "The SQL for Data Analytics course was very comprehensive — covering window functions, CTEs, subqueries, and Snowflake architecture. The instructor Rajesh sir had extensive production data engineering experience. My only suggestion would be to add even more Snowflake querying hours. Overall a very good investment. Landed a SQL Developer role within 6 weeks.",
    completionYear: "2025",
    status: "APPROVED",
    createdAt: "2026-06-10T11:20:00.000Z",
    updatedAt: "2026-06-11T08:00:00.000Z",
  },
  {
    id: "rev-004",
    studentName: "Divya Lakshmi",
    studentEmail: "divya.l@yahoo.com",
    courseId: "course-python-analytics",
    branchId: "branch-hitec",
    rating: 5,
    title: "Best Python for Analytics training in Hyderabad, hands down",
    body: "After comparing 5 different training institutes in Hyderabad, I chose Seeyam Technologies for Python for Data Analytics and it was the best decision. The curriculum covered NumPy, Pandas, Seaborn, exploratory data analysis, and building Streamlit web dashboards. The capstone customer segmentation project was directly praised in my interview at Zomato. Placed with a 12 LPA package as a Junior Analytics Specialist.",
    completionYear: "2026",
    status: "APPROVED",
    createdAt: "2026-08-01T16:45:00.000Z",
    updatedAt: "2026-08-02T10:00:00.000Z",
  },
  {
    id: "rev-005",
    studentName: "Suresh Kumar",
    studentEmail: "suresh.k@gmail.com",
    courseId: "course-tableau-specialist",
    branchId: "branch-omr",
    rating: 5,
    title: "Transformed my career with Tableau Visual Analytics",
    body: "I was stuck in a static reporting role with no career growth. The Tableau course at Seeyam gave me the modern visual analytics skills I needed. The Level of Detail (LOD) calculations and storytelling workshops were brilliant. The placement team connected me with 4 companies and I cracked Deloitte Digital with a 14 LPA package — almost double my previous salary.",
    completionYear: "2026",
    status: "APPROVED",
    createdAt: "2026-07-28T09:00:00.000Z",
    updatedAt: "2026-07-29T11:00:00.000Z",
  },
  {
    id: "rev-006",
    studentName: "Ananya Sharma",
    studentEmail: "ananya.s@gmail.com",
    courseId: "course-business-analyst",
    branchId: "branch-marathahalli",
    rating: 4,
    title: "Great Business Analyst training with practical Jira projects",
    body: "The Business Analyst course at the Marathahalli campus was really well organized. We covered BRD documentation, Jira sprint planning, user stories, and product metrics like churn and cohort analysis. The trainers were patient and gave individual feedback on every case study. Placed at a SaaS company with 8.5 LPA within 2 months of course completion.",
    completionYear: "2025",
    status: "APPROVED",
    createdAt: "2026-05-15T13:30:00.000Z",
    updatedAt: "2026-05-16T08:00:00.000Z",
  },
  {
    id: "rev-007",
    studentName: "Rajesh Iyer",
    studentEmail: "rajesh.iyer@gmail.com",
    courseId: "course-advanced-excel",
    branchId: "branch-tambaram",
    rating: 5,
    title: "Advanced Excel with real financial modeling",
    body: "What sets Seeyam apart is their focus on real corporate automation. Most other places teach simple formulas, but here we mastered Power Query ETL, Dynamic Arrays, and 3-statement financial models. The trainer had 15 years of analytics experience. I'm now working as a Financial Analyst at Accenture with 11 LPA CTC. Best investment I've made.",
    completionYear: "2026",
    status: "APPROVED",
    createdAt: "2026-08-05T10:00:00.000Z",
    updatedAt: "2026-08-06T09:00:00.000Z",
  },
  {
    id: "rev-008",
    studentName: "Meera Krishnan",
    studentEmail: "meera.k@gmail.com",
    courseId: "course-da-mastery",
    branchId: "branch-vadapalani",
    rating: 4,
    title: "Structured curriculum, supportive placement team",
    body: "The Data Analytics program at Vadapalani was well structured and the trainers were knowledgeable. The SQL and Power BI modules were especially strong. The placement cell arranged multiple interviews within my first month after completion. Landed a role at Wipro as a Data Analyst. Highly recommended!",
    completionYear: "2026",
    status: "APPROVED",
    createdAt: "2026-06-20T11:00:00.000Z",
    updatedAt: "2026-06-21T08:00:00.000Z",
  },
  {
    id: "rev-009",
    studentName: "Vikram Reddy",
    studentEmail: "vikram.r@outlook.com",
    courseId: "course-digital-marketing",
    branchId: "branch-hitec",
    rating: 5,
    title: "Hands-on GA4 and Growth Analytics",
    body: "The Digital Marketing Analytics course was practical and packed with real ad spend case studies. The GA4 event model and Meta Ads attribution modules were game-changers for my agency career. Within 3 weeks of finishing, I secured a Performance Marketing Analyst role with 9 LPA.",
    completionYear: "2025",
    status: "APPROVED",
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-04-11T10:00:00.000Z",
  },
  {
    id: "rev-010",
    studentName: "Lakshmi Narasimhan",
    studentEmail: "lakshmi.n@gmail.com",
    courseId: "course-power-bi",
    branchId: "branch-omr",
    rating: 5,
    title: "From zero analytics knowledge to certified BI professional",
    body: "The Power BI course at OMR campus was the perfect launchpad. Starting from data modeling basics to building executive dashboards with complex DAX measures. The mentor sessions every weekend helped me clear every doubt. Now working as a Business Intelligence Developer at an MNC with 8.2 LPA. Forever grateful to Seeyam!",
    completionYear: "2026",
    status: "APPROVED",
    createdAt: "2026-08-10T15:00:00.000Z",
    updatedAt: "2026-08-11T09:00:00.000Z",
  },
  {
    id: "rev-011",
    studentName: "Harish Mohan",
    studentEmail: "harish.m@gmail.com",
    courseId: "course-sql-analytics",
    branchId: "branch-marathahalli",
    rating: 5,
    title: "Outstanding SQL course with real placement results",
    body: "Joined the SQL for Data Analytics program at Marathahalli branch. The window functions and query optimization modules were taught with real enterprise databases. Placement cell arranged 5 interviews and I received 2 offers. Currently working at Infosys as a SQL Analytics Consultant.",
    completionYear: "2026",
    status: "APPROVED",
    createdAt: "2026-08-18T12:00:00.000Z",
    updatedAt: "2026-08-18T12:00:00.000Z",
  },
];

// ─── FAQs ───────────────────────────────────────────────────────────────────

export const MOCK_FAQS: FAQData[] = [
  {
    id: "faq-global-1",
    question: "Does Seeyam Technologies provide a 100% placement guarantee?",
    answer: "Yes. Seeyam Technologies provides comprehensive 100% placement assistance backed by over 200+ hiring partners across Chennai, Bangalore, and Hyderabad. Our dedicated placement cell conducts mock technical interviews, resume building sessions, and direct campus recruitment drives until you secure a verified job offer.",
    category: "placements",
    order: 1,
    courseId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-global-2",
    question: "What is the average salary package for graduates from Seeyam Technologies?",
    answer: "Our graduates secure entry to mid-level IT packages ranging between ₹4.5 LPA and ₹24.5 LPA, with an overall average CTC of ₹8.2 LPA. Candidates with previous non-IT experience or tech transitions often secure packages above ₹10 LPA in Full Stack Development and Cloud DevOps roles.",
    category: "placements",
    order: 2,
    courseId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-global-3",
    question: "Can beginners or non-IT background students enroll in software courses?",
    answer: "Absolutely. All courses at Seeyam Technologies start from fundamental programming basics and step-by-step logic building before advancing to enterprise frameworks. Over 40% of our successful alumni transitioned from non-IT backgrounds like Mechanical, Civil, Commerce, and Arts degrees.",
    category: "curriculum",
    order: 3,
    courseId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-global-4",
    question: "Do you provide hands-on live industry projects and internship certificates?",
    answer: "Yes. Every program includes 3+ enterprise-grade capstone projects built using real microservices, cloud deployments, and CI/CD pipelines. Upon completion, students receive an ISO-certified training certificate along with a verified project experience letter.",
    category: "curriculum",
    order: 4,
    courseId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-global-5",
    question: "What training modes and batch timings are available?",
    answer: "We offer Classroom Training at our physical campuses in Chennai (OMR, Vadapalani, Tambaram), Bangalore (Marathahalli), and Hyderabad (HITEC City), as well as interactive Live Online Instructor-led batches. Timings include Early Morning (7:30 AM), Regular Weekday, and Weekend Batches for working professionals.",
    category: "modes",
    order: 5,
    courseId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-global-6",
    question: "Is there an option for zero-cost EMI or installment fee payment?",
    answer: "Yes. Seeyam Technologies provides flexible payment options including zero-cost monthly installments (EMI) and milestone-based fee schedules to make top-tier IT training accessible to all deserving students.",
    category: "admissions",
    order: 6,
    courseId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-course-mern-1",
    question: "What prerequisites are needed for the Full Stack MERN course?",
    answer: "Basic computer familiarity is sufficient. We cover HTML5, Modern CSS, ES6+ JavaScript, TypeScript, React 19, Node.js, and databases starting from absolute zero fundamentals.",
    category: "curriculum",
    order: 1,
    courseId: "course-mern",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-course-mern-2",
    question: "How many live capstone projects will I build in this MERN program?",
    answer: "You will build 6 real-world production projects including an E-Commerce multi-vendor platform, SaaS AI analytics dashboard, social media real-time chat application, and microservices billing system.",
    category: "curriculum",
    order: 2,
    courseId: "course-mern",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-course-ai-1",
    question: "Do I need a strong mathematics or statistics background for the Generative AI course?",
    answer: "No advanced math degree is needed. We teach the required applied linear algebra, calculus intuition, and probability step-by-step with practical Python code visualizers.",
    category: "curriculum",
    order: 1,
    courseId: "course-ai-ds",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "faq-course-aws-1",
    question: "Does the AWS & DevOps course include real cloud account credits?",
    answer: "Yes! Every enrolled student receives access to our pre-configured AWS sandboxed laboratory environments to deploy VPCs, EKS clusters, and EC2 instances without surprise personal billing.",
    category: "curriculum",
    order: 1,
    courseId: "course-aws-devops",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

// ─── Interview Questions ────────────────────────────────────────────────────

export const MOCK_INTERVIEW_QUESTIONS: InterviewQuestionData[] = [
  {
    id: "iq-sql-01",
    courseId: "course-mern",
    category: "SQL",
    question: "What is the difference between WHERE and HAVING clauses in SQL?",
    answer: "The WHERE clause filters rows BEFORE aggregate functions are applied and cannot be used with aggregate functions like SUM() or COUNT(). The HAVING clause filters groups of rows AFTER the GROUP BY aggregation has taken place.",
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-sql-02",
    courseId: "course-mern",
    category: "SQL",
    question: "Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK().",
    answer: "All three are SQL window ranking functions. ROW_NUMBER() assigns a unique sequential integer to every row without ties (1,2,3,4). RANK() gives identical values the same rank and skips subsequent numbers (1,2,2,4). DENSE_RANK() gives identical values the same rank but does NOT skip numbers (1,2,2,3).",
    order: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-sql-03",
    courseId: "course-ai-ds",
    category: "SQL",
    question: "What are Common Table Expressions (CTEs) and when should you use them over subqueries?",
    answer: "A CTE (defined with the WITH keyword) is a temporary named result set within a single SQL statement. CTEs greatly improve query readability, can reference themselves recursively (hierarchies, organizational charts), and avoid redundant evaluations of identical nested subqueries.",
    order: 3,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-pbi-01",
    courseId: "course-mern",
    category: "Power BI",
    question: "What is the difference between Calculated Columns and Measures in DAX?",
    answer: "Calculated Columns evaluate during data refresh for every row of a table and consume physical RAM storage in the VertiPaq engine. Measures evaluate on the fly based on the current report visual filter context (dynamic aggregation) and consume minimal RAM until calculated.",
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-pbi-02",
    courseId: "course-mern",
    category: "Power BI",
    question: "How does the CALCULATE function work in DAX?",
    answer: "CALCULATE evaluates an expression in a modified filter context. It is the most powerful function in DAX because it can override existing report slicer filters, add new filters, or activate relationships using USERELATIONSHIP().",
    order: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-pbi-03",
    courseId: "course-mern",
    category: "Power BI",
    question: "What is Row-Level Security (RLS) in Power BI and how is it implemented?",
    answer: "RLS restricts data access for specific users based on DAX filter rules. In Power BI Desktop, you define roles (e.g. [Region] = USERNAME()) and then assign users or security groups to those roles in the Power BI Service workspace.",
    order: 3,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-tab-01",
    courseId: "course-mern",
    category: "Tableau",
    question: "What are Level of Detail (LOD) expressions in Tableau?",
    answer: "LOD expressions allow you to compute values at the data source level and visualization level. The three types are: FIXED (computes aggregate at the exact dimensions specified), INCLUDE (calculates at specified dimensions plus viz level), and EXCLUDE (omits specified viz dimensions).",
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-py-01",
    courseId: "course-ai-ds",
    category: "Python",
    question: "What are Python Generators and how do they differ from standard functions?",
    answer: "Generators use the yield keyword instead of return. They produce values lazily on-demand using the iterator protocol, which consumes almost zero memory when streaming large datasets or CSV files compared to loading entire lists into RAM.",
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-py-02",
    courseId: "course-ai-ds",
    category: "Python",
    question: "Explain vectorization in NumPy and Pandas.",
    answer: "Vectorization is the process of executing operations on entire arrays without explicit Python for-loops. Under the hood, operations run in optimized compiled C/Fortran code utilizing SIMD CPU instructions, making vectorization 50x to 100x faster than standard Python loops.",
    order: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "iq-dev-01",
    courseId: "course-aws-devops",
    category: "AWS & DevOps",
    question: "What is the difference between Docker and Kubernetes?",
    answer: "Docker is a containerization platform used to package applications and their dependencies into standardized container images. Kubernetes (K8s) is an orchestration platform that manages, auto-scales, load balances, and self-heals hundreds of Docker containers across a cluster of servers.",
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

// ─── Downloadable Resources ─────────────────────────────────────────────────

export const MOCK_RESOURCES: ResourceData[] = [
  {
    id: "res-001",
    title: "ATS-Optimized Data Analyst & BI Specialist Resume Template",
    type: "RESUME_TEMPLATE",
    fileUrl: "/resources/templates/data-analyst-ats-resume-2026.docx",
    category: "Data Analytics",
    fileSize: "245 KB",
    description: "Battle-tested 1-page ATS format designed specifically for Data Analysts, SQL specialists, and Power BI report developers. Passed corporate ATS screenings at Google, Amazon, and Zoho.",
    courseId: "course-mern",
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "res-002",
    title: "Senior Full Stack & React/Node Developer Resume Template",
    type: "RESUME_TEMPLATE",
    fileUrl: "/resources/templates/full-stack-developer-resume.docx",
    category: "Full Stack",
    fileSize: "280 KB",
    description: "Modern single-page resume layout showcasing GitHub repos, live production links, system architecture proficiencies, and microservices projects.",
    courseId: "course-mern",
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "res-003",
    title: "Cloud DevOps & SRE Engineer Executive Resume Format",
    type: "RESUME_TEMPLATE",
    fileUrl: "/resources/templates/cloud-devops-sre-resume.docx",
    category: "Cloud & DevOps",
    fileSize: "230 KB",
    description: "Structured template highlighting AWS certifications, Terraform IaC modules, Kubernetes deployments, and CI/CD pipelines.",
    courseId: "course-aws-devops",
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "res-004",
    title: "Top 50 Real-World SQL Interview Queries & Solutions Handbook",
    type: "PRACTICE_SHEET",
    fileUrl: "/resources/practice/50-must-solve-sql-queries.pdf",
    category: "SQL",
    fileSize: "1.8 MB",
    description: "Comprehensive 40-page workbook featuring 50 complex SQL challenges with schema diagrams, step-by-step CTE breakdowns, and window function explanations.",
    courseId: "course-mern",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "res-005",
    title: "Power BI DAX Formula Cheat Sheet & Practice Sales Dataset",
    type: "PRACTICE_SHEET",
    fileUrl: "/resources/practice/powerbi-dax-cheat-sheet.pdf",
    category: "Power BI",
    fileSize: "1.4 MB",
    description: "Quick reference guide for Time Intelligence, CALCULATE variations, FILTER contexts, and clean data modeling best practices.",
    courseId: "course-mern",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "res-006",
    title: "Python for Data Analysis (Pandas & NumPy) Exercise Lab",
    type: "PRACTICE_SHEET",
    fileUrl: "/resources/practice/python-data-analysis-lab.pdf",
    category: "Python",
    fileSize: "2.1 MB",
    description: "Hands-on Jupyter notebook challenge sheet with 35 real e-commerce data wrangling, missing data imputation, and outlier detection exercises.",
    courseId: "course-ai-ds",
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "res-007",
    title: "Complete Data Analytics & Power BI Master Curriculum Brochure",
    type: "BROCHURE",
    fileUrl: "/resources/brochures/seeyam-data-analytics-brochure.pdf",
    category: "Brochures",
    fileSize: "3.2 MB",
    description: "Official 16-page syllabus brochure covering tool schedules, hiring partners, placement salary statistics, and lab infrastructure details.",
    courseId: "course-mern",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "res-008",
    title: "Full Stack Web Development (MERN & Next.js) Syllabus PDF",
    type: "SYLLABUS_PDF",
    fileUrl: "/resources/brochures/seeyam-full-stack-mern-brochure.pdf",
    category: "Brochures",
    fileSize: "2.9 MB",
    description: "Detailed week-by-week curriculum roadmap, capstone project blueprints, and corporate interview schedule.",
    courseId: "course-mern",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

// ─── Job Portal Links ───────────────────────────────────────────────────────

export const MOCK_JOB_PORTAL_LINKS: JobPortalLinkData[] = [
  {
    id: "job-001",
    siteName: "LinkedIn Jobs — Data Analyst & BI Developer",
    url: "https://www.linkedin.com/jobs/search/?keywords=Data%20Analyst&location=Chennai%2C%20Tamil%20Nadu%2C%20India",
    roleFilter: "data-analyst",
    badge: "5,000+ Active Roles",
    order: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "job-002",
    siteName: "Naukri — Power BI & SQL Developer Jobs",
    url: "https://www.naukri.com/power-bi-jobs-in-chennai",
    roleFilter: "data-analyst",
    badge: "High Response Rate",
    order: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "job-003",
    siteName: "Naukri — Full Stack & MERN Developer Openings",
    url: "https://www.naukri.com/mern-stack-developer-jobs",
    roleFilter: "full-stack",
    badge: "Immediate Joiners",
    order: 3,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "job-004",
    siteName: "Instahyre — Curated Tech & AI Product Companies",
    url: "https://www.instahyre.com/software-engineer-jobs/",
    roleFilter: "full-stack",
    badge: "Top Startups & MNCs",
    order: 4,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "job-005",
    siteName: "Indeed — Python Data Science & ML Openings",
    url: "https://in.indeed.com/jobs?q=python+data+science&l=Bangalore",
    roleFilter: "python-engineer",
    badge: "Entry to Mid-Level",
    order: 5,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "job-006",
    siteName: "Wellfound (AngelList) — High Growth Remote Startups",
    url: "https://wellfound.com/jobs",
    roleFilter: "full-stack",
    badge: "Global Remote",
    order: 6,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "job-007",
    siteName: "Naukri — Digital Marketing, SEO & Performance Ads",
    url: "https://www.naukri.com/digital-marketing-jobs-in-chennai",
    roleFilter: "digital-marketer",
    badge: "High Demand",
    order: 7,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];
