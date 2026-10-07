# Norden Carpets & Flooring

This is the website for Norden Carpets & Flooring, Unit 4, Tenterhouse Mill, Greenbooth Road, Norden, Rochdale OL12 7TD. It's built with Vite, React 19, TypeScript and Tailwind CSS v4, and hosted on Cloudflare Pages with one Pages Function for free measure bookings.

## Quick start

```bash
nvm use            # Node 22, from .nvmrc
npm install
npm run dev        # http://localhost:5173 (the booking form needs pages:dev)
```

To test the full site, including `/api/book`, the `_headers` rules and `/privacy` as Cloudflare serves them:

```bash
cp .dev.vars.example .dev.vars   # fill in a Resend test key
npm run build
npm run pages:dev                # http://127.0.0.1:8788
```

`.dev.vars.example` ships with Cloudflare's always-pass Turnstile test secret.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server (client only) |
| `npm run build` | Font subsetting (`prebuild`), typecheck, client build, SSR build, prerender, then `check-dist` |
| `npm run pages:dev` | Serves `dist/` and `functions/` locally through wrangler |
| `npm test` | Vitest: validation, Pages Function, components, hydration, dist guard |
| `npm run typecheck` | `tsc -b` across the app, node config and functions |
| `npm run lint:copy` | Fails on em dashes, en dashes or spaced hyphens in `src/content` and the HTML pages |
| `npm run images` | Rebuilds the responsive AVIF and WebP files from `design-source/` |
| `npm run fonts` | Rebuilds the subset fonts from the characters used in `src/` and the HTML pages. It runs automatically before every build and fails on any character the Latin fonts cannot render |

## Content

All copy, prices, hours, phone numbers and links live in `src/content/site.ts`. Anything the client has not confirmed yet is marked `TODO_CONFIRM`.

- **Builds on `main` fail while any marker remains.** Cloudflare sets `CF_PAGES_BRANCH=main` for production builds. Preview branches and local builds only print a warning, so the first production build fails by design until the client content arrives.
- Outstanding markers:
  - Charlotte Simpson's exact review text, its platform and date, and the source of the 96% rating (`proof` in `site.ts`)
  - The retention period (`src/pages/PrivacyPage.tsx`)
  - The production domain (`index.html`, `privacy.html`, `public/robots.txt`, `public/sitemap.xml`)
  - The production Turnstile site key (`wrangler.toml [vars]`)

## Images

- **Neutral stock imagery** comes from Unsplash and is credited in `src/content/credits.ts` and the footer. Source files live in `design-source/unsplash`.
- **Real installation photos:** drop them into `design-source/installations`, run `npm run images`, then add entries to `installations` in `site.ts`. The gallery stays hidden until it has entries.
- **Caching:** images are served with immutable caching, so give a replacement image a new file name rather than overwriting an old one.

## Deploying to Cloudflare Pages

1. **Create the project.** Go to Workers & Pages, then Create, then Pages, then Connect to Git, and choose `stokie2605/Norden-Carpets-Flooring`.
   - Project name `norden-carpets-flooring`. It must match `name` in `wrangler.toml`.
   - Production branch `main`. Framework preset: none.
   - Build command `npm run build`. Output directory `dist`. Node comes from `.nvmrc`.
2. **Secrets.** Go to Settings, then Variables and Secrets, and add these as encrypted values. Public values live in `wrangler.toml`, not the dashboard.

   | Name | Production | Preview |
   |---|---|---|
   | `RESEND_API_KEY` | live Resend key | Resend key |
   | `TURNSTILE_SECRET_KEY` | widget secret | `1x0000000000000000000000000000000AA` (test) |
   | `BOOKING_TO_EMAIL` | `norden.carpetsflooring@gmail.com` | the developer's own address |
   | `BOOKING_FROM_EMAIL` | `Norden Website <bookings@DOMAIN>` | `Norden Website <onboarding@resend.dev>` |

3. **Turnstile.** Create a widget with the hostnames `norden-carpets-flooring.pages.dev` and, later, the production domain. Put its site key into `wrangler.toml [vars]`. Previews use the test key from `[env.preview.vars]`.
4. **Web Analytics.** Turn on the toggle in the Pages project. It injects the beacon at the edge, and the CSP already allows it.
5. **Resend.** Verify the production domain (SPF, DKIM and DMARC records) before switching `BOOKING_FROM_EMAIL` to it. Until then Resend only delivers from `onboarding@resend.dev` to the Resend account owner's own address.

`public/_headers` sends `X-Robots-Tag: noindex` on the `*.pages.dev` hostnames, so only the custom domain is indexed.
