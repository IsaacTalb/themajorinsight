export const workerConfig = {
  endpoints: [
    "/worker/trends/discover",
    "/worker/trends/re-score",
    "/worker/content/opportunities",
    "/worker/content/outdated-posts",
    "/worker/content/brief-suggestions",
    "/worker/newsletter/candidates"
  ],
  cron: [
    "trend discovery",
    "refresh trend scores",
    "content opportunities",
    "outdated posts",
    "brief suggestions",
    "newsletter candidates"
  ],
  sources: ["Hacker News", "Product Hunt", "Reddit", "RSS feeds", "company blogs", "public filings", "approved APIs"],
  note: "Automation assists editors and never publishes final editorial content automatically."
} as const;
