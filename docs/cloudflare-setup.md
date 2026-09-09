# Cloudflare production setup

## Already provisioned

- Account: `Isaac Talb`
- Worker: `themajorinsight-worker`
- Worker URL: `https://themajorinsight-worker.isaac-talb.workers.dev`
- D1 database ID: `e49a5931-a942-49c6-a51c-bd632112b1eb`
- R2 bucket: `themajorinsight-media`

## Manual Cloudflare steps

1. In **Zero Trust → Access → Applications**, create a **Self-hosted** application for the production hostname and protect `/admin*`.
2. Add an **Allow** policy containing only your administrator email. Keep the site hostname orange-cloud proxied through Cloudflare.
3. Copy the Zero Trust team domain (for example, `your-team.cloudflareaccess.com`) into Vercel as `CLOUDFLARE_ACCESS_TEAM_DOMAIN`.
4. Copy the exact application's **Application Audience (AUD) Tag** into Vercel as `CLOUDFLARE_ACCESS_AUD`.
5. Add the same allowed email to Vercel as `MAJOR_INSIGHT_ADMIN_ALLOWED_EMAIL`, then redeploy Production. `NEXT_PUBLIC_CONTACT_EMAIL` does not grant admin access.
6. Open **Workers & Pages → themajorinsight-worker → Settings → Variables and Secrets**.
7. Add a secret named `WORKER_TOKEN` with a long random value. Do not place the value in Git or `wrangler.toml`.
8. Open **R2 → themajorinsight-media → Settings** and configure a public custom domain (recommended) or an approved public development URL.
9. Put that public origin in `R2_PUBLIC_BASE_URL` in Vercel.
10. In **R2 → Manage R2 API Tokens**, create an object read/write token limited to `themajorinsight-media`.
11. Add its access-key ID and secret access key to Vercel as `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`. Never use `NEXT_PUBLIC_` for either value.
12. Open **Workers & Pages → themajorinsight-worker → Triggers** and verify the cron schedules after they are added to `wrangler.toml` and deployed.
13. Open **D1 → duckcloud → Console** and verify the editorial tables exist. The Worker binding currently points to this database ID.

## Vercel variables

Copy the applicable names from `.env.example` into the Vercel project. Set production values for:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `CLOUDFLARE_ACCESS_TEAM_DOMAIN`
- `CLOUDFLARE_ACCESS_AUD`
- `MAJOR_INSIGHT_ADMIN_ALLOWED_EMAIL`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`
- `CLOUDFLARE_WORKER_NAME`
- `CLOUDFLARE_WORKER_URL`
- `WORKER_TOKEN` when protected Worker calls are enabled
- `R2_ACCOUNT_ID`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_BASE_URL`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`

Leave ads disabled until AdSense approval and consent handling are ready.

## Deploy and verify

```bash
npm run build
npm run test
npm run worker:deploy
```

Then verify:

- `GET https://themajorinsight-worker.isaac-talb.workers.dev/health`
- the production site homepage
- admin login
- media upload to R2
- newsletter signup
- article view tracking

## Important migration warning

The codebase still contains legacy Supabase modules and some public API/data paths that reference them. Do not delete Supabase credentials from an existing production environment until those paths are fully replaced with Worker/D1 API calls. The Cloudflare resources are deployed, but the application migration is not yet complete end-to-end.
