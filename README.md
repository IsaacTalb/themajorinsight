# The Major Insight

A Next.js newsroom for finance, markets, technology, AI, science, and culture, with Cloudflare Workers, D1, and R2 supporting the editorial stack.

## Architecture

- **Public website**: articles, category pages, author pages, search, newsletter signup, RSS, and sitemap
- **Admin CMS**: post editing, media uploads, authors, categories, tags, analytics, newsletter, and trends
- **Cloudflare D1**: primary structured data store for editorial/admin records
- **Cloudflare R2**: article images and uploaded media
- **Cloudflare Workers**: trend discovery, brief suggestions, newsletter candidate selection, and cron jobs
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
- `npm run worker:dev` — local Cloudflare Worker
- `npm run worker:deploy` — deploy Worker with Wrangler

## Environment variables

See `.env.example` for the required values.

Common variables include:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_ADS_ENABLED`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- `NEXT_PUBLIC_AD_SLOT_ARTICLE_INTRO`
- `NEXT_PUBLIC_AD_SLOT_ARTICLE_MID`
- `NEXT_PUBLIC_AD_SLOT_ARTICLE_RELATED`
- `NEXT_PUBLIC_AD_SLOT_SIDEBAR`
- `NEXT_PUBLIC_AD_SLOT_HOME_SECTION`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_WORKER_NAME`
- `R2_BUCKET_NAME`

## Cloudflare setup

The Worker and Cloudflare resources are configured through `wrangler.toml`. See [docs/cloudflare-setup.md](docs/cloudflare-setup.md) for the exact manual Cloudflare and Vercel steps, required variables, and production verification checklist.

- Worker: `themajorinsight-worker`
- D1 binding: `DB`
- R2 binding: `MEDIA`
- Keep Worker secrets, R2 credentials, and admin tokens server-side.

## Worker deployment

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
