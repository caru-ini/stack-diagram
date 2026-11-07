# stack-diagram gallery

Read this before changing anything here. It holds only what every change needs and the code does not show.

## Stack

TanStack Start on Cloudflare Workers (`@cloudflare/vite-plugin`, custom `src/server.ts`), React 19, Vite+ (`vp`), TypeScript 7 checked with `tsrs`. Neon Postgres through Drizzle (`neon-http`), Neon Auth (`@neon/auth`, Better Auth with GitHub). Bindings: R2 `BUCKET`, Images `IMAGES`, Workers AI `AI` (Clef through AI Gateway), rate limits `SUBMIT_LIMITER`, `ACTION_LIMITER` and `READ_LIMITER`. UI is Base UI (`@base-ui/react`) with CSS Modules and Phosphor icons.

## Verify a change

`pnpm check`, `pnpm check-types`, `pnpm test`, and `pnpm build`. Run heavy commands under a memory cap: `systemd-run --user --scope -q -p MemoryMax=3G pnpm build`. Do not start dev servers.

## Where things are

| Path                     | What                                                                        |
| ------------------------ | --------------------------------------------------------------------------- |
| `src/routes`             | Thin route files: options and handlers that call into a feature             |
| `src/features/<name>`    | `<name>-page.tsx` + CSS module, `components/`, `server/`, tests beside code |
| `src/components`         | Shared UI, one component and one CSS module per file                        |
| `src/lib`                | Shared logic: db, crypto, client key, settings, `PublicStack`               |
| `src/styles/globals.css` | Design tokens and base styles                                               |
| `drizzle/`               | Generated migrations                                                        |

## Where this repo differs from common defaults

- Features never import each other (lint enforces it). Shared UI goes to `src/components`, shared logic to `src/lib`.
- Adding or renaming a route file needs `pnpm build` to regenerate `routeTree.gen.ts`.
- Relative imports carry their extension, `@/` points at `src`, no type assertions (`as const` and `satisfies` are fine), no barrel files.
- CSS Modules on the tokens in `globals.css`, no utility classes and no inline styles except values that come from data. Saturated colours fill shapes; text stays in the ink tokens.
- CSS module types are generated into `.css-types/` by `pnpm check-types`; never write a `.d.ts` next to a stylesheet.
- Base UI, not Radix: `render={<Link />}` instead of `asChild`.
- Tests import from `vite-plus/test`.
- Comments only for design decisions and logic that is hard to follow, one line, in English.
- UI copy is short, plain, factual English: no taglines, no flourishes, nothing that only describes the implementation.
- Never edit a migration. Change `src/lib/db/schema.ts` and run `pnpm db:generate`.
- Deploys run only from `.github/workflows/site.yml` on `main`, which applies the migrations first. Every Worker secret, `TURNSTILE_SITE_KEY` and `ADMIN_GITHUB_IDS` included, is encrypted with dotenvx in `.env.production` and ships with `wrangler deploy --secrets-file`.
- `@neondatabase/serverless` is pinned to 1.1.0: the 1.2.0 bundle reassigns `const` bindings, so rolldown refuses it and it would throw at run time. Recheck before upgrading.
- `expect(...).toHaveLength` throws in this toolchain (chai 6.3.0 has the same const-reassignment bug); assert on `.length` with `toBe`.

## Design

Figma file `bVLJGqMKwxAOCMYlMmsswM`: Foundations, Components, and Screens with a desktop and a mobile frame for Home, Stack, My posts (signed in and out), How to share and Admin, plus OGP.

- Logo: a hollow iris rounded square (stroke side/6, radius side × 12/60) before the "stack-diagram" wordmark.
- Tech logos are the official files, shown as they are with the name beside them; a wordmark logo (wider than 3:1) goes without the name.
- Status names: Published (mint ●), In review (lilac ▲), Hidden (red ■).
- The diagram on the stack page zooms on tap with medium-zoom, as on the portfolio blog. Cards in lists link to the page and never zoom.

## Invariants

- `PublicStack` (`src/lib/public-stack.ts`) is the only post shape that leaves the server. The GitHub login and id, the IP hash and the delete key hash never do. The user's prompt is never collected.
- R2 keys: `stacks/<id>/{light,dark}.webp`, `stacks/<id>/preview.jpg` (light, at most 1200px wide, for Clef and OG images, which cannot read WebP), `og/<id>.png`, `og/home.png` (with its refresh lock `og/home.lock`) and `icons/<sha256>.<ext>`. `/files/$` serves icons to anyone and stack images only to readers of published posts, or to the owner and admins. It reads R2 before the database, so a made-up key costs one R2 read, and every public file is cached for 5 minutes, so a hidden post or an unused icon stops showing within minutes.
- Uploads fail before any costly step: Content-Length is required and at most 2.5 MB, the body is read with a hard byte limit (never `formData()` on an unchecked body), and each PNG is checked from its IHDR for at most 4000px a side and 8 megapixels before Images sees it. Originals are never stored, only the re-encoded WebP and JPEG. Clef sees both the light and the dark preview, since both are published.
- The daily post caps (`DAILY_LIMIT`, `DAILY_LIMIT_PER_IP`) count spent proofs in `used_challenges`, not rows in `stacks`, so deleting a post or a failed publish never frees a slot.
- `/files/icons/*` serves an icon only while a published post references it, so the bucket can't be used as free hosting.
- Read endpoints validate every query parameter, rate-limit misses with `READ_LIMITER`, and generate OG images only for published posts. `/files/*` and `/og/*` ignore the query string, so `src/server.ts` caches them by path alone.
- Server functions send only intended errors (`httpError`, `notFound`, `redirect`) to the browser; `src/start.ts` replaces any other error, such as a database error with its SQL, with a generic message. Error pages show fixed text, never `error.message`.
- Icons come only from the curated sets in `ICON_PREFIXES` (svgl, gilbarbara/logos, devicon on `master`), never from any GitHub repo, and are served with `Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; sandbox` and `X-Content-Type-Options: nosniff`, and rendered only through `<img>`. A home filter chip uses its tech's most common icon.
- `getSubmissionMode` (`src/lib/settings.ts`) decides open, review or closed; the settings row overrides the `SUBMISSIONS` var, and an unknown value means review.
- Statuses are `published`, `held` and `hidden`. Three reports hide a post, or one exposure report under the rule below. A post hidden by reports stays in the Admin queue until an admin publishes it (which overrules the reporters) or hides it (which confirms the reports).
- Votes and reports are keyed by the voter id from the voter cookie, one per post, never by IP: households and carrier NAT share one address. The cookie is issued once a Turnstile token checks out (signed, HttpOnly, 7 days).
- Per voter id and day: 200 votes, 10 reports, 3 exposure reports. Per `clientKey` (IPv4 or IPv6 /64) and day, loose caps that only blunt cookie resets: 10 votes on one post, 1000 votes and 30 reports overall.
- Keep or Publish on a reported post in Admin adds a strike to every reporter of that post and clears the reports; Hide clears them without strikes. Reporters with 2 or more strikes stop counting toward hiding. A single exposure report hides a post only from a reporter without strikes whose voter pass is at least a day old, because a new pass costs only one Turnstile solve.
- A vote locks its post's row and recomputes the score in SQL in the same transaction, so concurrent votes never save a stale total.
- Admins are the GitHub numeric ids in `ADMIN_GITHUB_IDS`.
