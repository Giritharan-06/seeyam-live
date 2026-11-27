const courseArtwork: Record<string, string> = {
  "advanced-excel-financial-modeling": "financial-report",
  "business-analyst-product-analytics": "analysis-team",
  "data-analytics-master-program": "analytics-screen",
  "digital-marketing-growth-analytics": "marketing-team",
  "power-bi-business-intelligence": "professional-workspace",
  "python-data-analytics": "python-workspace",
  "sql-for-data-analytics": "code-screen",
  "tableau-visual-analytics": "developer-laptop",
};

export function courseArtworkUrl(slug: string) {
  const name = courseArtwork[slug];
  return name ? `/images/card-photos/${name}.jpg` : undefined;
}
