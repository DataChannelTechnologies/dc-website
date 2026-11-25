# CLAUDE.md

Guidance for AI agents (and humans) working in this repo. Read this first, then `README.md` (content model, forms, analytics) and `BUGS.md` (open issues).

## What this is

The DataChannel marketing site (www.datachannel.co), migrated from Webflow to **Netlify**. It's a **Next.js 15 static export** (`out/`) using Tailwind v4 + shadcn/ui, with **Decap CMS** (the successor to Netlify CMS) at `/admin/`. All content is JSON in `content/`, edited through the CMS and committed to git.

- Repo: `git@github.com:DataChannelTechnologies/dc-website.git`, branch `main`. 
- Netlify project: `datachanne1` (https://datachanne1.netlify.app). Production domain not switched yet.
- CMS login on Netlify: GitHub backend through Netlify's OAuth provider (Project configuration → Security → OAuth). **Netlify Identity / Git Gateway is deprecated** and can't be enabled on new projects, so don't suggest it.

## Hard rules

1. **Docker only.** Never install anything on the host (no `npm install`, `brew` or `pip` on the host). Every node command runs through `docker compose` or `docker run node:22-alpine`.
2. **Never read secret values.** `.env` holds `WEBFLOW_SITE_ID` and `WEBFLOW_SITE_API_ID` (the Webflow API token). Pass it to containers with `--env-file .env` / `env_file:` and never print it. Reading key names is fine.
3. **URLs must stay identical to Webflow (SEO).** No trailing slashes (`trailingSlash: false`). Collection URLs come from the JSON **file name**; section-page URLs come from the `path` field. Never rename these for published pages. Retired URLs need a 301 in `netlify.toml`.
4. **Check the deploy state before pushing.** As of 2026-11-25, Netlify builds are **stopped**: pushes to `main` don't deploy while the team vets the local workflow, and the user turns builds back on in the Netlify console. Once builds are active again, **don't push to `main` without the user's explicit go-ahead.** Every push, and every CMS save, triggers a Netlify production deploy, and deploys are billed: the budget was 234/300 used on 2026-11-25. Commit locally when asked, and batch changes into one push.
5. **Ports:** host port 3000 belongs to another project. This site uses **3100** (dev), **3101** (prod preview) and **127.0.0.1:8081** (local CMS proxy).

## Running locally

All commands run from the repo root.

### Engineers (UX / code changes)

```bash
docker compose up -d web                  # dev server with hot reload → http://localhost:3100
docker compose logs -f web                # follow logs (first start runs npm install)
docker compose up -d web cms              # also start the local CMS proxy (see below)
docker compose restart web                # after changing package.json (reinstalls deps)
docker compose down                       # stop everything

# Checks (separate container + .next cache, safe while dev is running)
docker compose --profile tools run --rm build                                  # production build → ./out
docker compose --profile tools run --rm build npx tsc --noEmit                 # typecheck
docker compose --profile tools run --rm build node scripts/validate-pages.mjs  # section-page schema check

# Production-like preview of the static export
docker compose --profile prod up preview  # → http://localhost:3101
```

Dependencies live in the `node_modules` Docker volume, not on the host. After adding a dependency to `package.json`, run `docker compose restart web`, and make sure `package-lock.json` is updated in the container (`docker compose --profile tools run --rm build npm install`) so Netlify's install matches.

### Content writers (CMS only, no code)

```bash
docker compose up -d web cms
```

Then open **http://localhost:3100/admin/index.html** (the `index.html` part is needed in local dev). The local CMS uses `decap-server` (`local_backend` in `public/admin/config.yml`), needs no login, and **writes directly to files in `./content` and `public/images/uploads`**. Changes show up in the site at http://localhost:3100 on reload. Nothing is published until someone commits and pushes; see rule 4.

On the live site, writers use https://datachanne1.netlify.app/admin/ with a GitHub account that has write access to the repo. **Each save there is a commit to `main`, which means a deploy.**

### Visual checks (screenshots)

The Playwright CLI runs in a container. The host's dev server is reachable at `host.docker.internal:3100`:

```bash
docker run --rm --add-host=host.docker.internal:host-gateway -v "$PWD/.shots":/shots \
  mcr.microsoft.com/playwright:v1.49.1-noble sh -c \
  "cd /tmp && npx -y playwright@1.49.1 screenshot --full-page --wait-for-timeout 2500 \
   --viewport-size 1440,900 http://host.docker.internal:3100/pricing /shots/pricing.png"
```

Use `--viewport-size 390,844` for mobile. Lazy-loaded images and iframes below the fold show as blank in full-page shots; that's expected. Keep screenshots out of the repo (scratch dir or a gitignored folder).

### Re-importing from Webflow (only before the domain switch)

`docker compose --profile tools run --rm webflow-import` re-downloads the Webflow CMS collections (`scripts/webflow/`) and **overwrites** the migrated entries in `content/`. Review `git diff` afterwards. Don't use it once editors work in the new CMS. Static pages aren't covered; they were transcribed from the published HTML.

## Turning Netlify deploys off and on

Pushes to `main` (including CMS saves) deploy automatically. To pause this, for example to save deploy budget while batching fixes:

**Turn off:** Netlify → project `datachanne1` → **Project configuration → Developer settings** (tab) → **Build settings** (left menu, under "Repository") → **Configure** → **Build status: "Stopped builds"** → **Save**. Pushes and CMS saves still reach GitHub; they just don't build or publish. The live site stays on its last deploy.

**Turn back on:** same place → **"Active builds" → Save.** Commits pushed while builds were stopped are **not** built retroactively, so then go to **Deploys** (left sidebar) → **Trigger deploy → Deploy project** to publish the latest `main` once.

Netlify's menu labels change over time. In older layouts this was under "Site configuration → Build & deploy → Continuous deployment". If a label differs, look for "Build status" / "Stop builds" near the build settings.

**Slack webhook for form notifications:** a Slack app's Incoming Webhook posts into one channel (create the channel first). api.slack.com/apps → Create New App → From scratch → Incoming Webhooks → Activate → Add New Webhook to Workspace → pick the channel → copy the `https://hooks.slack.com/services/...` URL into the Netlify env var `SLACK_WEBHOOK_URL` (scope Functions). The URL is a secret: never commit it or print it.

## Code map

| Path | What |
| --- | --- |
| `src/app/` | Routes. Dedicated templates for each collection (`integration/[slug]`, `etl-sources/[slug]`, `blogs/[slug]`, `case-study/[slug]`, …) plus `[...path]` for section pages. `sitemap.ts`, `robots.ts`. |
| `src/lib/cms.ts` | Build-time loaders and types for collections (`content/<collection>/<slug>.json`), Markdown rendering. |
| `src/lib/pages.ts` | Section-page schema (15 block types) and loader for `content/pages/*.json`. |
| `src/components/blocks/blocks.tsx` | Renderers for section blocks. |
| `src/components/cms/`, `src/components/blog/` | Shared template parts (hero, link grids, directory filters, post cards, …). |
| `src/components/forms/` + `public/__forms.html` | Netlify Forms (`contact`, `lead`, `career-application`). |
| `src/components/analytics.tsx` | GTM / GA4 / HubSpot / LinkedIn / Clarity / Meta pixel; loads only on the production hosts. |
| `netlify/functions/submission-created.mjs` | Posts every form submission to Slack (`SLACK_WEBHOOK_URL`). |
| `public/admin/config.yml` | Decap CMS config: collections and fields for everything in `content/`. |
| `scripts/validate-pages.mjs` | Schema validator for section pages (also checks that local image paths exist). |
| `scripts/webflow/` | Webflow API dump and convert (re-import tool). |
| `netlify.toml` | Build settings, functions dir, 301 redirects (from Webflow's export + retired Ecommerce pages). |

## Gotchas learned the hard way

- **Adding a field to a section block means changing 4 files:** `src/lib/pages.ts` (type), `src/components/blocks/blocks.tsx` (render), `scripts/validate-pages.mjs` (validation) and `public/admin/config.yml` (CMS field). Then run the validator and the build.
- **Section pages:** the first block must be a `hero`, which renders the page's only H1. `path` must be unique and must not collide with a collection route (the validator checks this). Images must be local `/images/...` paths.
- **Next.js page files may only export page things** (`default`, `generateMetadata`, `generateStaticParams`, `dynamicParams`, …). Exporting a component from `page.tsx` fails the build; put it in `src/components/`.
- **Netlify Forms** only store fields declared in `public/__forms.html`. Keep it in sync with `src/components/forms/form-definitions.ts`. Forms POST to `/__forms.html`. Form detection must be enabled in Netlify (Forms tab) and the Slack webhook env var set, or submissions go nowhere.
- **Local Decap proxy:** `decap-server` binds to localhost unless `BIND_HOST=0.0.0.0` is set (it is set in compose; the port is published only on 127.0.0.1).
- **Decap collection names must be unique.** `pages` is the Home page file collection; section pages are `site-pages`.
- **The Webflow API token** can read CMS collections but **not** static pages (no `pages:read` scope). Webflow's sitemap lags behind the API (newer items were missing). The API was the source of truth for collections, and the published sitemap for the page inventory.
- **Webflow content had template leftovers** (e.g. a "Webflow UI tutorial" video on /about, `saasbox.com` mailto links). Check embeds and links when importing.
- **Netlify's Pretty URLs:** `foo.html` is served at `/foo`; `/foo/` 301s to `/foo`. That's what keeps Webflow-style URLs intact.
- **Checking URL parity:** every URL in the old Webflow sitemap (1,161) should return 200 on the deployed site, or a deliberate 301. Re-check after any routing or slug change: compare against `out/*.html` locally before pushing, then curl the deployed site.
