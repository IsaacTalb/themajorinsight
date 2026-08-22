const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

function getSiteUrl() {
  if (!configuredSiteUrl) return "http://localhost:3000";

  try {
    return new URL(configuredSiteUrl).origin;
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
  }
}

export const siteConfig = {
  name: "The Major Insight",
  url: getSiteUrl(),
  description:
    "Finance, markets, AI, technology, science, and culture coverage built for smart readers who want clear analysis and practical context.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || null
} as const;

export const categories = [
  {
    name: "Finance & Markets",
    slug: "finance-markets",
    deck: "Personal finance, investing, insurance, loans, side hustles, and market-moving business stories.",
    topics: ["Credit cards", "High-yield savings", "Mortgage rates", "Crypto", "Trading apps", "Startup funding"]
  },
  {
    name: "Tech & AI",
    slug: "tech-ai",
    deck: "AI tools, enterprise software, gadgets, cybersecurity, cloud platforms, and the future of work.",
    topics: ["AI tools", "Automation", "SaaS", "Cybersecurity", "Cloud hosting", "Smartphones"]
  },
  {
    name: "Science & Future",
    slug: "science-future",
    deck: "Space, biotech, health technology, longevity science, green energy, EVs, and climate innovation.",
    topics: ["Space", "Biotech", "Longevity", "EVs", "Solar", "Climate tech"]
  },
  {
    name: "Pulse",
    slug: "pulse",
    deck: "Viral trends, creator economy, social platforms, streaming, entertainment, and internet culture.",
    topics: ["Viral trends", "Creator economy", "Streaming", "Social media", "Entertainment", "Internet culture"]
  }
];

export const sampleArticles = [
  {
    title: "Current Mortgage Rate Trends Homebuyers Should Watch",
    category: "Finance & Markets",
    slug: "current-mortgage-rate-trends-homebuyers-should-watch",
    excerpt: "A practical briefing format for refinancing, affordability, and lender comparison updates.",
    metric: "High CPC"
  },
  {
    title: "Best AI Tools for Small Business Automation",
    category: "Tech & AI",
    slug: "best-ai-tools-small-business-automation",
    excerpt: "A search-focused comparison template for founders, operators, and productivity teams.",
    metric: "B2B demand"
  },
  {
    title: "What Green Energy Breakthroughs Mean for EV Owners",
    category: "Science & Future",
    slug: "green-energy-breakthroughs-ev-owners",
    excerpt: "A future-facing explainer model connecting climate innovation with consumer decisions.",
    metric: "Evergreen"
  }
];
