# DataChannel website

Webflow → Netlify migration of datachannel.co. Built with **Next.js 15 (static export)**, **Tailwind v4 + shadcn/ui**, and **Decap CMS** (the successor to Netlify CMS). Migrated so far: the **Home page** and the **integration-family Webflow CMS collections** (~950 pages) on their original URLs.

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

## CMS collections migrated from Webflow

| CMS collection | Folder | Public URL | Entries |
| --- | --- | --- | --- |
| Integrations | `content/integrations` | `/integration/<slug>` | 133 |
| ETL source pages | `content/etl-sources` | `/etl-sources/<slug>` | 534 |
| Destinations | `content/destinations` | `/destinations/<slug>` | 45 |
| Reverse ETL pages | `content/reverse-etl-destinations` | `/reverse-etl-destinations/<slug>` | 232 |
| Warehouses | `content/warehouses` | `/warehouses/<slug>` | 6 |
| Integration / destination categories | `content/*-tags` | (used for filters/badges) | 10 / 8 |

Listing pages: `/integrations`, `/destinations`, `/data-warehouses`. `sitemap.xml` is generated from the same data.

**URL rules (SEO):** the JSON **file name is the URL slug**. Don't rename files for published pages. `trailingSlash: false` makes Next export `integration/foo.html`, which Netlify serves at exactly `/integration/foo` (the Webflow URL). Every page sets a canonical URL on `https://www.datachannel.co`. Titles and descriptions use the same templates as Webflow, and each entry has optional SEO override fields.

**Re-sync from Webflow** (before cut-over only, because it overwrites migrated entries): `docker compose --profile tools run --rm webflow-import`, then review `git diff`.

## Deploy to Netlify

`netlify.toml` already sets the build: `npm run build` → publish `out/` (Node 22).

For the CMS in production, the config uses the **GitHub** backend. Netlify Identity / Git Gateway is deprecated and can't be enabled on new projects. One-time setup:

1. Create a GitHub OAuth App (org Settings → Developer settings → OAuth Apps). Set the homepage to the site URL and the callback URL to `https://api.netlify.com/auth/done`.
2. In Netlify go to Project configuration → Security → OAuth → **Install provider** → GitHub, and paste the app's client ID and secret.
3. Editors open `/admin/` and log in with a GitHub account that has write access to this repo.

## Not done yet

- Remaining pages: blogs, case studies, compare, careers, authors, landing pages, and static pages like pricing and about. Nav and footer links to these 404 until they are built.
- The webinar "play" card links to sign-up; the video embed hasn't been wired up yet.
- Webflow API credentials in `.env` aren't used yet. They're there for migrating the CMS collections (blog posts, case studies) later.
