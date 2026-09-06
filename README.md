# The Major Insight

A Next.js newsroom for finance, markets, technology, AI, science, and culture, with Supabase-backed editorial tooling and Cloudflare R2 media storage.

## Architecture

- **Public website**: articles, category pages, author pages, search, newsletter signup, RSS, and sitemap
- **Admin CMS**: post editing, media uploads, authors, categories, tags, analytics, newsletter, and trends
- **Supabase**: PostgreSQL, auth, row-level security, analytics, subscriber records, and editorial metadata
- **Cloudflare R2**: article images and uploaded media
- **Cloudflare Workers**: trend discovery, brief suggestions, and newsletter candidate selection
- **Vercel**: Next.js application hosting

## Local development

```bash
npm install
npm run dev
```

## Scripts

- `npm run build` — production build
- `npm run lint` — linting
- `npm run typecheck` — TypeScript check
- `npm run test` — unit tests

## Environment variables

See `.env.example` for the required values.

Common variables include:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_ADS_ENABLED`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- `NEXT_PUBLIC_AD_SLOT_ARTICLE_INTRO`
- `NEXT_PUBLIC_AD_SLOT_ARTICLE_MID`
- `NEXT_PUBLIC_AD_SLOT_ARTICLE_RELATED`
- `NEXT_PUBLIC_AD_SLOT_SIDEBAR`
- `NEXT_PUBLIC_AD_SLOT_HOME_SECTION`

## Supabase setup

- Create the required tables for posts, authors, categories, tags, newsletter subscribers, trends, media assets, and audit logs.
- Enable RLS on public tables.
- Use the service role key only in trusted server routes and actions.

## Migrations

Apply schema changes before deployment and keep them in version control.

## R2 setup

- Create an R2 bucket for article media.
- Configure the access credentials used by the upload and delete routes.
- Store public media URLs alongside metadata.

## Cloudflare Worker deployment

The worker layer is separate from the CMS and only assists editors.

### Scheduled jobs

- trend discovery
- refreshing trend scores
- identifying content opportunities
- identifying outdated posts
- generating editorial brief suggestions
- newsletter candidate selection

### Rules

- Automation must not publish final editorial content.
- Store source URLs with research output.
- Secure endpoints with secrets and authentication.

## Cloudflare configuration

Use Cloudflare for R2 and Worker deployment only. Keep ad and newsletter secrets server-side.

## Vercel deployment

Deploy the Next.js app to Vercel with the production environment variables configured there.

## Editor/admin workflow

1. Review trends and assign categories.
2. Turn promising trends into article briefs.
3. Draft and edit posts in the CMS.
4. Review newsletter candidates.
5. Publish only after editorial approval.

## Content launch checklist

Prepare the category architecture:

- Finance & Markets
- Tech & AI
- Science & Future
- Pulse

Then verify category pages, authors, sources, disclosures, dates, featured images, image credits, internal links, SEO titles, meta descriptions, sitemap, RSS, newsletter, and related articles.

## Notes

- Ads are configurable and can remain disabled until approval.
- No fake analytics or fabricated audience numbers are shown.
