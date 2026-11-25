# DataChannel website

Webflow → Netlify migration of datachannel.co. Built with **Next.js 15 (static export)**, **Tailwind v4 + shadcn/ui**, and **Decap CMS** (the successor to Netlify CMS). All public pages of the Webflow site (every URL in its sitemap) are migrated on their **original URLs**: the Home page, all Webflow CMS collections, and the static pages (rebuilt as CMS-editable section pages).

## Run locally (Docker only — nothing to install on the host)

```bash
docker compose up -d          # site: http://localhost:3100   CMS proxy: 127.0.0.1:8081
docker compose logs -f web    # follow the dev server
docker compose down
```

- **CMS (local):** open http://localhost:3100/admin/index.html. Edits are written straight to `content/*.json` and hot-reload in the site.
- **Production preview:** `docker compose --profile prod up preview` → http://localhost:3101 (runs the same `next build` Netlify runs).
- Ports can be changed with `WEB_PORT=… PREVIEW_PORT=… docker compose up`.

## Where things live

| Path | What |
| --- | --- |
| `content/home.json` | All Home page copy, images, links (CMS-editable) |
| `content/site.json` | Announcement bar, nav menus, header buttons, footer (CMS-editable) |
| `public/admin/config.yml` | Decap CMS schema — keep in sync with the JSON shape |
| `src/components/sections/*` | One component per Home page section |
| `src/components/ui/*` | shadcn/ui primitives (`components.json` is set up, so `npx shadcn add …` works inside the container) |
| `public/images/*` | Assets pulled from the live Webflow site |

## Content model

| CMS collection | Folder | Public URL |
| --- | --- | --- |
| Home page / Site settings | `content/home.json`, `content/site.json` | `/`, header, nav, footer |
| Pages (section builder) | `content/pages` | the page's own `path` field, e.g. `/pricing`, `/compare/datachannel-vs-hevo` |
| Blog posts | `content/blogs` | `/blogs/<slug>` (+ index `/blogs`) |
| Blog authors / topics | `content/authors`, `content/blog-tags` | `/author/<slug>`, `/blog-tag/<slug>` |
| Case studies | `content/case-studies` | `/case-study/<slug>` (+ index `/case-studies`) |
| Careers | `content/careers` | `/career/<slug>` (+ index `/careers`) |
| Integrations | `content/integrations` | `/integration/<slug>` (+ index `/integrations`) |
| ETL source pages | `content/etl-sources` | `/etl-sources/<slug>` |
| Destinations | `content/destinations` | `/destinations/<slug>` (+ index `/destinations`) |
| Reverse ETL pages | `content/reverse-etl-destinations` | `/reverse-etl-destinations/<slug>` |
| Warehouses | `content/warehouses` | `/warehouses/<slug>` (+ index `/data-warehouses`) |
| Categories | `content/integration-tags`, `content/destination-tags` | (filters and badges) |

**Section pages** (`content/pages/*.json`) are built from 15 block types (hero, rich text, text + image, feature grid, stats, comparison table, testimonials, logos, FAQ, pricing, steps, CTA banner, CTA cards, embed, form). The schema is in `src/lib/pages.ts` and the renderers are in `src/components/blocks/blocks.tsx`. Check page files with `docker compose run --rm --no-deps web node scripts/validate-pages.mjs`.

`sitemap.xml` and `robots.txt` are generated from the same data.

**URL rules (SEO):** for collections the JSON **file name is the URL slug**, and for section pages it's the `path` field. Don't rename or change them on published pages. `trailingSlash: false` makes Next export `integration/foo.html`, which Netlify serves at exactly `/integration/foo` (the Webflow URL). Every page sets a canonical URL on `https://www.datachannel.co`. Titles and descriptions use the same templates as Webflow, and each entry has optional SEO override fields.

**Re-sync Webflow CMS collections** (before cut-over only, because it overwrites migrated entries; static pages are not included): `docker compose --profile tools run --rm webflow-import`, then review `git diff`.

## Forms and analytics

- **Forms** use Netlify Forms (contact, lead, career application with résumé upload). Netlify detects them from `public/__forms.html`, so keep that file in sync with `src/components/forms/form-definitions.ts`. In Netlify, turn on **Forms → form detection** once, then set up email notifications under Forms → Notifications.
- **Demo and sales schedulers** are HubSpot Meetings embeds. `/schedule-demo` keeps its Calendly embed.
- **Analytics** (GTM, GA4, HubSpot, LinkedIn Insight, Microsoft Clarity, Meta pixel; same IDs as Webflow) are in `src/components/analytics.tsx` and only load on `www.datachannel.co` / `datachannel.co`.
- **Retired Webflow Ecommerce pages** (`/checkout`, `/paypal-checkout`, `/order-confirmation`) 301-redirect to `/pricing` (`netlify.toml`).

## Deploy to Netlify

`netlify.toml` already sets the build: `npm run build` → publish `out/` (Node 22).

For the CMS in production, the config uses the **GitHub** backend. Netlify Identity / Git Gateway is deprecated and can't be enabled on new projects. One-time setup:

1. Create a GitHub OAuth App (org Settings → Developer settings → OAuth Apps). Set the homepage to the site URL and the callback URL to `https://api.netlify.com/auth/done`.
2. In Netlify go to Project configuration → Security → OAuth → **Install provider** → GitHub, and paste the app's client ID and secret.
3. Editors open `/admin/` and log in with a GitHub account that has write access to this repo.

## Before switching the domain

- Copy any 301 redirects configured in Webflow (Site settings → Publishing → 301 redirects) into `netlify.toml`.
- Delete `WEBFLOW_SITE_ID` / `WEBFLOW_SITE_API_ID` from `.env` and revoke the token in Webflow once no more re-syncs are needed.
