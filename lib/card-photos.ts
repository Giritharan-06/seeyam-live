export interface CardPhoto { name: string; description: string; src: string; topic: string; }

// Photos are illustrative stock, never portraits of a named student or trainer.
export const cardPhotos: CardPhoto[] = [
  {
    "name": "analytics-screen",
    "description": "Laptop displaying coding and data analysis interface",
    "src": "/images/card-photos/analytics-screen.jpg",
    "topic": "analytics"
  },
  {
    "name": "analysis-team",
    "description": "Colleagues reviewing charts and analytics",
    "src": "/images/card-photos/analysis-team.jpg",
    "topic": "analytics"
  },
  {
    "name": "financial-report",
    "description": "Financial report with charts and graphs",
    "src": "/images/card-photos/financial-report.jpg",
    "topic": "finance"
  },
  {
    "name": "python-workspace",
    "description": "Hands coding on a laptop",
    "src": "/images/card-photos/python-workspace.jpg",
    "topic": "code"
  },
  {
    "name": "developer-laptop",
    "description": "Developer working on programming scripts",
    "src": "/images/card-photos/developer-laptop.jpg",
    "topic": "code"
  },
  {
    "name": "code-screen",
    "description": "Colourful programming code on screen",
    "src": "/images/card-photos/code-screen.jpg",
    "topic": "code"
  },
  {
    "name": "data-centre",
    "description": "Data centre with server racks",
    "src": "/images/card-photos/data-centre.jpg",
    "topic": "database"
  },
  {
    "name": "server-storage",
    "description": "Server rack with blue indicators",
    "src": "/images/card-photos/server-storage.jpg",
    "topic": "database"
  },
  {
    "name": "marketing-team",
    "description": "Marketing team planning in an office",
    "src": "/images/card-photos/marketing-team.jpg",
    "topic": "marketing"
  },
  {
    "name": "social-media",
    "description": "Social media on a smartphone",
    "src": "/images/card-photos/social-media.jpg",
    "topic": "social"
  },
  {
    "name": "marketing-workspace",
    "description": "Digital marketing workstation",
    "src": "/images/card-photos/marketing-workspace.jpg",
    "topic": "marketing"
  },
  {
    "name": "classroom-laptop",
    "description": "Laptop in a modern classroom",
    "src": "/images/card-photos/classroom-laptop.jpg",
    "topic": "classroom"
  },
  {
    "name": "interview-preparation",
    "description": "Professional job interview",
    "src": "/images/card-photos/interview-preparation.jpg",
    "topic": "career"
  },
  {
    "name": "career-consultation",
    "description": "Business consultation meeting",
    "src": "/images/card-photos/career-consultation.jpg",
    "topic": "career"
  },
  {
    "name": "resource-library",
    "description": "Bookshelves filled with educational resources",
    "src": "/images/card-photos/resource-library.jpg",
    "topic": "resources"
  },
  {
    "name": "study-space",
    "description": "People studying in a library",
    "src": "/images/card-photos/study-space.jpg",
    "topic": "learning"
  },
  {
    "name": "study-planner",
    "description": "Open planner and notebook",
    "src": "/images/card-photos/study-planner.jpg",
    "topic": "schedule"
  },
  {
    "name": "online-learning",
    "description": "Woman working on a laptop with earphones",
    "src": "/images/card-photos/online-learning.jpg",
    "topic": "online"
  },
  {
    "name": "remote-session",
    "description": "Woman participating in a video call",
    "src": "/images/card-photos/remote-session.jpg",
    "topic": "online"
  },
  {
    "name": "online-mentor",
    "description": "Woman teaching over a video conference",
    "src": "/images/card-photos/online-mentor.jpg",
    "topic": "online"
  },
  {
    "name": "professional-workspace",
    "description": "Woman working at a desk with a laptop",
    "src": "/images/card-photos/professional-workspace.jpg",
    "topic": "growth"
  },
  {
    "name": "modern-library",
    "description": "Modern library interior",
    "src": "/images/card-photos/modern-library.jpg",
    "topic": "resources"
  }
];

const groups: Record<string, string[]> = {
  analytics: ['analytics-screen', 'analysis-team', 'financial-report'],
  code: ['python-workspace', 'developer-laptop', 'code-screen'],
  database: ['data-centre', 'server-storage', 'developer-laptop'],
  finance: ['financial-report', 'analytics-screen', 'analysis-team'],
  marketing: ['marketing-workspace', 'marketing-team', 'social-media'],
  social: ['social-media', 'marketing-workspace', 'marketing-team'],
  campus: ['classroom-laptop', 'study-space', 'modern-library'],
  learning: ['study-space', 'resource-library', 'professional-workspace', 'online-learning'],
  resources: ['resource-library', 'modern-library', 'study-planner'],
  online: ['remote-session', 'online-mentor', 'online-learning'],
  calendar: ['study-planner', 'professional-workspace', 'classroom-laptop'],
  growth: ['career-consultation', 'interview-preparation', 'professional-workspace', 'analysis-team'],
  review: ['classroom-laptop', 'study-planner', 'analytics-screen', 'resource-library'],
  settings: ['developer-laptop', 'server-storage', 'code-screen', 'study-planner'],
};

export function cardPhotoTopic(text: string, theme: string): string {
  if (theme === 'review') return 'review';
  if (/^(data analytics|business analyst|power bi|tableau)/i.test(text)) return 'analytics';
  if (/social media|meta ads|instagram|facebook|content creat/i.test(text)) return 'social';
  if (/digital marketing|marketing|seo|campaign|advertis/i.test(text)) return 'marketing';
  if (/sql|snowflake|warehouse|database|cloud|devops|server|security/i.test(text)) return 'database';
  if (/python|mern|full.stack|javascript|react|compiler|coding|programming/i.test(text)) return 'code';
  if (/excel|financial|finance|accounting/i.test(text)) return 'finance';
  if (/power bi|tableau|dashboard|data analyt|business analyt|metrics/i.test(text)) return 'analytics';
  if (/online session|live online|remote|video call|virtual/i.test(text)) return 'online';
  if (/classroom|campus|training facilit|lab workstation/i.test(text)) return 'campus';
  if (/weekend|weekday|schedule|batch|calendar|timing/i.test(text)) return 'calendar';
  if (/interview|career|job|recruit|counsel|placement|resume/i.test(text)) return 'growth';
  if (/resource|library|handbook|download|practice sheet|brochure|syllabus/i.test(text)) return 'resources';
  return groups[theme] ? theme : 'learning';
}

export function chooseCardPhoto(topic: string, used: Map<string, number>): CardPhoto {
  const names = groups[topic] || groups.learning;
  const candidates = names.map(name => cardPhotos.find(photo => photo.name === name)!);
  const photo = candidates.reduce((best, candidate) => (used.get(candidate.name) || 0) < (used.get(best.name) || 0) ? candidate : best);
  used.set(photo.name, (used.get(photo.name) || 0) + 1);
  return photo;
}
