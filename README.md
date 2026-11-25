# DataChannel website

Webflow → Netlify migration of datachannel.co. Built with **Next.js 15 (static export)**, **Tailwind v4 + shadcn/ui**, and **Decap CMS** (the successor to Netlify CMS). Only the **Home page** is migrated so far.

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

## Deploy to Netlify

`netlify.toml` already sets the build: `npm run build` → publish `out/` (Node 22).

For the CMS in production, the config uses the `git-gateway` backend: in Netlify enable **Identity** and **Git Gateway**, then invite editors. If Identity isn't available on your Netlify plan, switch `backend` in `public/admin/config.yml` to `github` and set up a GitHub OAuth app instead.

## Not done yet

- Every page other than Home (nav/footer links point to the old Webflow URLs/paths).
- The webinar "play" card links to sign-up; the video embed hasn't been wired up yet.
- Webflow API credentials in `.env` aren't used yet. They're there for migrating the CMS collections (blog posts, case studies) later.
