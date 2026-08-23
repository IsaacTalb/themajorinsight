export type Article = {
  type: "Analysis" | "News" | "Explainer" | "Guide" | "Review" | "Comparison" | "Report" | "Opinion";
  title: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  focusKeyword: string;
  tags: string[];
  imageAlt: string;
  image?: { src: string; caption: string; credit: string };
  author: { name: string; slug: string; role: string; bio: string };
  keyTakeaways?: string[];
  body: string[];
  sources: { label: string; url: string }[];
};

export const articles: Article[] = [
  {
    type: "Analysis",
    title: "Current Mortgage Rate Trends Homebuyers Should Watch",
    slug: "current-mortgage-rate-trends-homebuyers-should-watch",
    categorySlug: "finance-markets",
    categoryName: "Finance & Markets",
    excerpt:
      "A practical briefing template for mortgage rate coverage, refinancing decisions, affordability pressure, and lender comparison updates.",
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-05",
    readingTime: "4 min read",
    focusKeyword: "mortgage rate trends",
    tags: ["Mortgage rates", "Refinancing", "Housing market", "Personal finance"],
    imageAlt: "Homebuyer reviewing mortgage rate options on a laptop.",
    author: { name: "The Major Insight Desk", slug: "major-insight-desk", role: "Editorial team", bio: "The newsroom team covering the forces reshaping markets, technology, science, and culture." },
    keyTakeaways: ["Rate changes affect affordability as much as asking prices.", "Compare APR, fees, and loan terms—not only the headline rate.", "Treat forecasts as context, not guarantees."],
    body: [
      "Mortgage rate coverage should be updated frequently because readers usually arrive with a decision in mind: buy now, wait, refinance, or compare lenders.",
      "The Major Insight format for this topic should lead with what changed, why it matters, who is affected, and which terms readers should compare before making a financial decision.",
      "Every finance article should include educational context and avoid promises, guarantees, or individualized financial advice. The best version of this page will eventually connect to rate tables, calculators, and lender comparison resources."
    ],
    sources: [
      { label: "Federal Reserve economic data", url: "https://fred.stlouisfed.org/" },
      { label: "Consumer Financial Protection Bureau", url: "https://www.consumerfinance.gov/" }
    ]
  },
  {
    type: "Comparison",
    title: "Best AI Tools for Small Business Automation",
    slug: "best-ai-tools-small-business-automation",
    categorySlug: "tech-ai",
    categoryName: "Tech & AI",
    excerpt:
      "A search-focused comparison framework for founders, operators, freelancers, and small teams evaluating AI productivity software.",
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-05",
    readingTime: "5 min read",
    focusKeyword: "best AI tools for small business",
    tags: ["AI tools", "Automation", "SaaS", "Small business"],
    imageAlt: "Small business owner comparing AI automation dashboards.",
    author: { name: "The Major Insight Desk", slug: "major-insight-desk", role: "Editorial team", bio: "The newsroom team covering the forces reshaping markets, technology, science, and culture." },
    keyTakeaways: ["Start with one clearly defined workflow.", "Review privacy, integrations, and total cost before adopting a tool.", "Measure saved time and output quality during a trial."],
    body: [
      "Small businesses usually adopt AI tools when they solve a direct workflow problem: writing, support, scheduling, reporting, lead generation, or internal knowledge search.",
      "The Major Insight comparison format should evaluate pricing, ease of use, integrations, privacy, customer support, and the specific business workflows each product improves.",
      "The long-term SEO opportunity is to maintain updated comparison tables and link them to deeper reviews for each tool."
    ],
    sources: [
      { label: "NIST AI Risk Management Framework", url: "https://www.nist.gov/itl/ai-risk-management-framework" },
      { label: "FTC business guidance", url: "https://www.ftc.gov/business-guidance" }
    ]
  },
  {
    type: "Explainer",
    title: "What Green Energy Breakthroughs Mean for EV Owners",
    slug: "green-energy-breakthroughs-ev-owners",
    categorySlug: "science-future",
    categoryName: "Science & Future",
    excerpt:
      "A future-facing explainer connecting climate innovation, charging infrastructure, batteries, and consumer EV decisions.",
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-05",
    readingTime: "4 min read",
    focusKeyword: "green energy breakthroughs EV owners",
    tags: ["Green energy", "EVs", "Battery tech", "Climate innovation"],
    imageAlt: "Electric vehicle charging near solar panels at sunset.",
    author: { name: "The Major Insight Desk", slug: "major-insight-desk", role: "Editorial team", bio: "The newsroom team covering the forces reshaping markets, technology, science, and culture." },
    body: [
      "Green energy coverage works best when it explains how research, policy, and infrastructure affect everyday costs for readers.",
      "For EV owners, the most useful reporting connects battery improvements, charging availability, grid reliability, and incentives in one practical framework.",
      "This article template can later be expanded with maps, incentives, charging cost calculators, and utility-rate explainers."
    ],
    sources: [
      { label: "U.S. Department of Energy", url: "https://www.energy.gov/" },
      { label: "National Renewable Energy Laboratory", url: "https://www.nrel.gov/" }
    ]
  },
  {
    type: "Analysis",
    title: "Why Viral Internet Trends Become Business News",
    slug: "why-viral-internet-trends-become-business-news",
    categorySlug: "pulse",
    categoryName: "Pulse",
    excerpt:
      "A newsroom template for turning social momentum into useful context about platforms, creators, brands, and audience behavior.",
    publishedAt: "2026-08-05",
    updatedAt: "2026-08-05",
    readingTime: "3 min read",
    focusKeyword: "viral internet trends business news",
    tags: ["Viral trends", "Creator economy", "Social media", "Internet culture"],
    imageAlt: "Creator reviewing social media analytics on a phone.",
    author: { name: "The Major Insight Desk", slug: "major-insight-desk", role: "Editorial team", bio: "The newsroom team covering the forces reshaping markets, technology, science, and culture." },
    body: [
      "Viral stories can bring large traffic spikes, but The Major Insight should treat them as signals rather than gossip.",
      "The strongest Pulse coverage explains what happened, where it started, why it spread, and what it means for creators, platforms, advertisers, or consumers.",
      "This workflow keeps trending content useful while still capturing high-volume search and social discovery traffic."
    ],
    sources: [
      { label: "Reddit trends", url: "https://www.reddit.com/" },
      { label: "Google Trends", url: "https://trends.google.com/" }
    ]
  }
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string) {
  return articles.filter((article) => article.categorySlug === categorySlug);
}
