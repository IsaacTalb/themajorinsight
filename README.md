# The Major News

Search-first independent reporting on finance, markets, technology, AI, science, and internet culture.

## Local setup

1. Install Node.js 20 and run `npm install`.
2. Copy `.env.example` to `.env.local` and add the Supabase project values.
3. Run `docs/supabase/schema.sql` in the Supabase SQL editor.
4. Start the application with `npm run dev`.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or commit it to Git.

## Implemented

- Next.js App Router pages for the homepage, editorial categories, articles, tags, policies, newsletter, RSS, robots, and sitemap.
- Article metadata, canonical URLs, Open Graph fields, NewsArticle structured data, source links, and author attribution.
- Supabase schema with editorial workflow statuses, tags, subscriber storage, Row Level Security, and an atomic view-counter function.
- Newsletter capture with inline feedback, social share actions, session-deduplicated article views, and SEO-indexable tag archives.

## Delivery roadmap

1. **Data layer:** create the Supabase project, run the schema, seed categories/authors, and replace static article fixtures with server queries.
2. **Editorial admin:** add authenticated editor roles, draft/review/schedule workflows, revisions, source checks, and approval logs.
3. **Media pipeline:** connect Cloudflare R2, image optimization, captions, attribution, and SearchXNG image discovery with mandatory human licensing review.
4. **Distribution:** add consent-based email delivery and Cloudflare Worker cron jobs for trend briefs; keep social publishing behind editor approval.
5. **Revenue and compliance:** add consent management, privacy controls, AdSense placements, ads.txt, and Core Web Vitals monitoring without harming article readability.
6. **Quality:** add unit, API, accessibility, end-to-end, and Lighthouse tests plus Search Console and analytics verification.
