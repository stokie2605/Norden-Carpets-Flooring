# CLAUDE.md

Norden Carpets & Flooring: mobile-first lead generation site for a family run flooring showroom at Tenterhouse Mill, Norden, Rochdale. Specs live in the Second Memory vault: `01 Projects/Norden Carpets & Flooring.md` and `02 Areas/Global Developer Standards.md`.

## 1. Git Workflow

- Remote: `https://github.com/stokie2605/Norden-Carpets-Flooring`
- `main` is production. Cloudflare Pages deploys it to the live site.
- `develop` is the working branch. Every push to it builds a Cloudflare Pages preview. Short-lived feature branches come off `develop` and merge back into it.
- Promote to production by merging `develop` into `main`. Never push work straight to `main`.
- Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`). Propose commit messages before committing.
- Stage files explicitly. Never `git add -A` or `git add .`.
- **A `main` build fails by design** while any `TODO_CONFIRM` marker reaches `dist/` (`scripts/check-dist.mjs`). Preview branches only warn.

---

## 2. Notifications

- None configured for this repo yet.

---

## 3. Decisions

- 2026-10-07: Hosting is Cloudflare Pages through Connect to Git, not Vercel. This overrides the global standard for this project only. The project name `norden-carpets-flooring` must match `wrangler.toml`.
- 2026-10-07: The stack is Vite, React 19, TypeScript strict and Tailwind CSS v4, with no router. Two HTML entry points, `index.html` and `privacy.html`. Pages serves the second at `/privacy`.
- 2026-10-07: Both pages are prerendered at build time (`src/entry-server.tsx`, `scripts/prerender.mjs`) and hydrated on the client. CSS is inlined and the display font is preloaded. Mobile Lighthouse scores 96 or above on all four categories.
- 2026-10-07: Light theme only (Studio White Edition). There is no dark mode toggle in v1.
- 2026-10-07: There is no AggregateRating in the JSON-LD. The 96% rating is visible page content only.
- 2026-10-07: Booking flow (the quote form): Pages Function `functions/api/book.ts`, then Turnstile siteverify plus a honeypot, then shared validation in `src/lib/booking.ts`, then the Resend REST API.
- 2026-10-07: `wrangler.toml [vars]` holds public values only. `VITE_TURNSTILE_SITE_KEY` is read at build time by `vite.config.ts`: `[vars]` on `main`, `[env.preview.vars]` (the Cloudflare test key) elsewhere. Secrets live only in the Cloudflare dashboard and in a local `.dev.vars`.
- 2026-10-07: Cloudflare Web Analytics comes from the Pages dashboard toggle, with no script in the source.
- 2026-10-07: Unsplash is used only for neutral imagery, credited in `src/content/credits.ts`. The installation gallery renders only real team photos and is hidden while empty.
- 2026-10-07: Fonts are subset builds committed in `src/assets/fonts`. 2026-10-14: Archivo only (400 to 800, normal width), Inter dropped. `scripts/subset-fonts.mjs` runs as `prebuild`, collects the glyph set from source, and fails the build on any character outside the Latin fonts.
- 2026-10-07: Every `tel:` link uses +44 format and comes from `phones` in `src/content/site.ts`.
- 2026-10-09: Team is Dave and Wendy (owners), Tom and Jake (fitters). 2026-10-13: over 45 years in the trade. No subcontractor wording anywhere. Bury is not mentioned anywhere, including the areas covered.
- 2026-10-09: The subfloor section is removed. An Our work section (`PreviousWork.tsx`) replaces it and shows only real installation photos from `installations`. No prices anywhere, including the JSON-LD.
- 2026-10-09: Reviews are copied word for word from the Facebook page (96% recommend, 24 reviews), no dates. 2026-10-13: no customer names on any review, only the source (Facebook or Google), so only the team are named. Cut only with "...", never reword. Skip lines naming former staff. No customer photos: Dave supplies the job photos.
- 2026-10-09: Retention: enquiries that don't go ahead are deleted after one month, customer contact details once the job is finished and paid for, invoices kept as HMRC requires.
- 2026-10-09: The business is a sole trader, David Wilshaw trading as Norden Carpets & Flooring, not VAT registered. The legal line sits in the footer and the privacy notice.
- 2026-10-09: Production domain is nordencarpets.co.uk, registered at Cloudflare to David Wilshaw (UK sole trader), auto renew on.
- 2026-10-13: Our work is a swipeable slideshow with thumbnails and a full size viewer. Photos show whole, never cropped (`name-show` files with a light colour lift). One photo per job, and no photo is used twice anywhere on the page (`scripts/photos.test.mjs`). 2026-10-14: Dave wants more carpet, so carpet jobs may show up to two photos (for example stairs and landing), carpet photos lead the gallery, and laminate and vinyl stay at about a dozen.
- 2026-10-13: Reviews also come from Google (4.9 out of 5, 19 reviews). Google quotes are word for word with no reviewer names. The header has no section links. Its Call number, Get quote button and Facebook link are always on show. 2026-10-14: phone numbers show as 5 digits, space, 6 digits (01706 659962). Our work starts with the full room photos.
- 2026-10-14: The homepage follows the Norden 2026 Homepage design from Claude Design (desktop 2a, mobile 3a): black, red and white, Archivo throughout, 6px button corners, sections in the same order with the same wording. Tokens are `bg`, `bg-alt`, `ink` (#111), `ink-soft`, `muted`, `accent` (#d4153b), `accent-deep`, `accent-bright` (red on black panels), `star` (rating stars), `pill` and `line`. The SectionDivider is gone. Our work is a grid of the four newest jobs (tiles crop to fill) with a full size viewer that shows every photo whole. Reviews are a tap or swipe card stack. The vinyl and laminate tabs keep their own photos, so no photo is used twice. Same day: the page is 1440px wide, the hero photo is the shopfront at Tenterhouse Mill (`hero-shopfront`, cropped and colour lifted by `scripts/optimise-images.mjs`, files stop at 1024px because the original is small), the stats strip reads 96%, 4.9 and 45+ years, the showroom is a rounded panel inside the page width, the header button says Get quote, and Facebook is in the header and footer. The quote form is one screen: flooring type, name, phone, postcode, optional notes and a consent tick (email and visit time are no longer asked for; the API gets `preferredTime: 'any'`). The hero button says Get a free quote and the stat reads 45+ years fitting flooring.
- 2026-10-15: 30 more carpet photos added, so Our work has 72 photos (61 carpet first, then 11 laminate and vinyl). Several photos of the same job are fine; the only rule is no photo used twice. Same day: on phones (under 640px) the hero shopfront fills the first screen between the header and contact bar, with a Tap to step inside button; a tap zooms in and folds the photo away. It is in the page flow, not an overlay or popup (Google penalises mobile interstitials), and works as a plain link without JavaScript. It is the one hero photo, so nothing is downloaded twice. Tablets and desktop show it whole as before. After the tap the address becomes `/#inside` (history.replaceState, no storage of any kind, so no cookie consent question), and CSS (`html:has(#inside:target) #step-inside` in index.css) keeps the photo hidden on refresh and back. A fresh visit shows it again.
- 2026-10-09: Agent rules for Antigravity and other tools live in `AGENTS.md` and `.agents/rules/`. `scripts/guardrails.test.mjs` locks these decisions.

---

## 4. Session Mode

- **Client note (standing rule):** At the start of every session, read `C:\Users\Wilshaw\Documents\Second memory\01 Projects\Norden Carpets\Norden Carpets & Flooring.md` for context. At the end of every session, update it.
  - Keep it short and written for a human. Sections, in order: 1 properties at the top (status: building, preview or live; client; hosting; repo; preview URL; domain; next action), 2 Status (two or three lines), 3 Links (preview, GitHub repo, Cloudflare project, connected notes), 4 Waiting on client (checklist), 5 Next actions (checklist), 6 Brief, 7 Session log (dated, newest first, one or two lines per session).
  - Only ever update sections 1 to 5 and 7 automatically. Leave the Brief alone unless the user asks.
  - **Vault scope:**
    - Norden zone (read and edit): `01 Projects\Norden Carpets\`.
    - Shared zone (read only, edit only when the user asks): everything in `02 Areas\` and `03 Resources\` outside the Forge zone.
    - Forge zone (never open): `01 Projects\Forge Platform\`, `03 Resources\Phil's Frameworks\`, `03 Resources\Forge Skill Directory.md`, `03 Resources\Forge Tooling & MCP Connectors.md`.
    - Commit vault changes in the vault's own git repo.
  - A local vault pre-commit hook rejects any commit that mixes Norden and Forge files, a Norden note that mentions Forge or links into the Forge zone, and the reverse. Never bypass it with `--no-verify`.
  - Never put secrets, API keys or customer personal data in the note.
- Plan first for any multi-file change.
- Ask before adding dependencies.
- Never read, print or modify `.dev.vars` or real secrets. Print the key name needed and stop.
- All client copy lives in `src/content/site.ts`. No em dashes, en dashes, spaced hyphens or decorative emojis anywhere (`npm run lint:copy`).
- Before proposing a commit, run `npm run typecheck`, `npm test`, `npm run lint:copy` and `npm run build`.
- Check that ports 5173 (Vite) and 8788 (wrangler) are free before starting dev servers.

---

## 5. Current State

### What got done
- 2026-10-07: Built v1. It has the header, editorial hero, tabbed material switcher, subfloor timeline, team strip, proof wall, showroom card with catchment map and tap-to-load Google map, a 3 step booking modal with Turnstile, the mobile utility bar (Call and WhatsApp), the footer and the privacy notice.
- The Pages Function, `_headers` (CSP, noindex on pages.dev), JSON-LD, sitemap, robots, the image and font pipelines, and the copy and dist guards are all in place. 63 tests pass.
- 2026-10-07: Pinned Node 24 in `.nvmrc`. Added a test proving `check-dist` reports markers in `assets/*.js` chunks on every branch.

### Where things stand
- `main` and `develop` are both pushed to GitHub.
- The Cloudflare Pages project `norden-carpets-flooring` exists and is connected to Git. `develop` is the preview branch.
- The `main` build fails on `TODO_CONFIRM` by design. It reports 19 markers. A local or preview build reports 18, because only `main` inlines the `[vars]` placeholder `TODO_CONFIRM_TURNSTILE_SITE_KEY` into the JS bundle. Reproduce the `main` result locally with `CF_PAGES_BRANCH=main npm run build`.

### Next
- Confirm the first `develop` preview build succeeds on Node 24.
- Set the secrets in the Pages dashboard, create the Turnstile widget and turn on Web Analytics.

### Blocked on
- The client (Dave): whether the ICO fee is paid or the business is exempt, and real installation photos.
- Resend domain verification for nordencarpets.co.uk, and Cloudflare Email Routing for hello@nordencarpets.co.uk.
- The production Turnstile site key, which must go into `wrangler.toml [vars]`.
