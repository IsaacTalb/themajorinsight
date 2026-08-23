# The Major Insight

The Major Insight is a search-first independent publication covering finance, markets, technology, AI, science, and internet culture.

## Architecture

- **Framework:** Next.js App Router with TypeScript and Tailwind CSS.
- **Content:** Typed, server-only Supabase queries with an explicit local fixture fallback when Supabase is not configured.
- **Brand configuration:** Publication identity, description, canonical origin, and optional public contact address are centralized in `src/lib/site.ts`.
- **Data services:** RLS-constrained public reads plus isolated service-role administration, newsletter, and view-count operations.
- **Distribution and SEO:** Next.js metadata, `NewsArticle` structured data, canonical links, RSS, robots, and sitemap routes.

## Local setup

1. Install Node.js 20 or later and run `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SITE_URL` to the canonical origin in deployed environments. When it is unset locally, the application uses `http://localhost:3000`; no production domain is assumed.
4. Add the Supabase project values, run `docs/supabase/schema.sql`, and optionally run `docs/supabase/seed.sql` for clearly labelled development fixtures.
5. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` to publish an editorial inbox on the contact page.
6. Start the application with `npm run dev`.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code or commit it to Git.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical site origin used by metadata, RSS, robots, sitemap, and share links. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Public inbox displayed on the contact page. |
| `NEXT_PUBLIC_SUPABASE_URL` | For Supabase | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For public content | Public anon credential; database RLS limits it to published content. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server operations | Server-only credential used by trusted admin, newsletter, and view operations. Never expose it to browser code. |

## Available commands

- `npm run dev` — run the development server.
- `npm run build` — create a production build.
- `npm run start` — serve the production build.
- `npm run typecheck` — run TypeScript without emitting files.

## Implemented

- App Router pages for the homepage, editorial categories, articles, tags, policies, newsletter, RSS, robots, and sitemap.
- Article metadata, environment-driven canonical URLs, Open Graph fields, `NewsArticle` structured data, source links, and publication attribution.
- Production Supabase schema for editorial workflow, revisions, sources, media, trends, redirects, settings, auditing, subscribers, strict Row Level Security, and atomic view counts.
- Paginated server-side article, category, tag, author, latest, featured, and trending data access with development-safe fixtures when Supabase is absent.
- Newsletter capture with inline feedback, social share actions, session-deduplicated article views, and SEO-indexable tag archives.

## Delivery roadmap

1. **Data deployment:** create the Supabase project, apply the schema, seed verified production taxonomy/authors, and configure deployment secrets.
2. **Editorial admin:** add authenticated editor roles, draft/review/schedule workflows, revisions, source checks, and approval logs.
3. **Media pipeline:** connect image storage and optimization with captions, attribution, and mandatory human licensing review.
4. **Distribution:** add consent-based email delivery and scheduled trend briefs; keep social publishing behind editor approval.
5. **Revenue and compliance:** add consent management, privacy controls, advertising placements, `ads.txt`, and Core Web Vitals monitoring without harming article readability.
6. **Quality:** add unit, API, accessibility, end-to-end, and Lighthouse tests plus search-console and analytics verification.
