# Contributing

Thanks for helping. The repo holds:

| Path                    | What                                                                   |
| ----------------------- | ---------------------------------------------------------------------- |
| `skills/stack-diagram/` | The skill: `SKILL.md`, the Python scripts, references, fonts, template |
| `site/`                 | The gallery at https://stacks.caru.moe (TanStack Start on Cloudflare)  |
| `docs/`                 | Images for the README                                                  |

## What a pull request can be

Pull requests are for:

- **Bug fixes.** A small fix for an obvious bug needs no issue. For a larger one, link the issue that shows the bug.
- **Icons.** Official icons for a vendor or project the scripts can't fetch yet, or products missing from a source they already use. Open an issue before adding a new source.
- **Doc fixes.** Wrong, outdated or unclear text.

Everything else goes to an issue: new features, new output formats, changes to how diagrams look, and anything on the site that isn't a bug. A pull request for one of these is closed unless a maintainer asked for it in an issue; link that issue.

Pull requests we close:

- Links to, or instructions for, a product or service you work on or are paid to promote.
- Logos that are redrawn, recolored, or taken from anywhere but the brand, the vendor's own icon package, or the curated sets the scripts already use.
- Refactors, renames, cleanup or style changes, on their own or mixed into a fix.

## Rules for a pull request

- **One problem per pull request.** Include every change the fix needs, tests and docs too, and nothing else. A second fix goes in its own pull request.
- **Show that it works.** Say how you found the problem, how you checked the fix, and what you saw. "Tests pass" is not evidence.
- **3 open pull requests per person.** A fourth is closed. Get one merged or closed first.
- **Name the AI tools you used.** In the pull request, give the harness (such as Claude Code, Codex or Cursor) and the model that wrote the code, or say none did. Pull requests without it are closed.
- **AI tools are fine. You still own the change.** Read every line before you open the pull request, run it yourself, and answer review comments yourself. Pull requests that look unread or untested are closed, and an account that sends them in bulk is blocked.

## The skill

The scripts need Python 3.9+. `fetch_icons.py`, `build.py` and `share.py` use only the standard library; keep it that way. `render_png.py` needs Playwright with Chromium.

Test a change by drawing a diagram with it, the way the agent does in `SKILL.md`: fetch the icons, build the HTML, render the PNGs, and look at them. When the change affects what a diagram looks like, upload the light and dark PNG to the pull request. Don't commit them.

### Adding an icon source

- Use the vendor's official icons: the package its own page links to, as for AWS, Google Cloud and Azure, or a GitHub repository pinned to one commit, as for Kubernetes and CNCF.
- The gallery shows a source's logos only when its URL prefix is in `ICON_PREFIXES` in both `share.py` and `site/src/features/submit/server/icons.ts`, with tests in `icons.test.ts`. A GitHub prefix includes the commit, because raw.githubusercontent.com serves a fork's commits under the parent's path.
- Read the license of the icons. Credit them in "Licenses and trademarks" in `README.md`, and in `SKILL.md` add a bullet to Step 2 and the source to the footer credits in Step 6.

## The site

Read [`site/AGENTS.md`](site/AGENTS.md) before changing anything in `site/`. Then, from `site/`:

```bash
pnpm install
pnpm check
pnpm check-types
pnpm test
pnpm build
```

All four run in CI on every pull request that touches `site/`. `pnpm dev` needs the production Cloudflare and Neon setup, so contributors are not expected to run it. Never edit a migration; change `src/lib/db/schema.ts` and run `pnpm db:generate`. Deploys run only from CI on `main`.

## Commits and pull requests

- Pull request titles and commit subjects follow [Conventional Commits](https://www.conventionalcommits.org) with a scope, at most 72 characters: `feat(icons): ...`, `fix(site): ...`, `docs(readme): ...`. The maintainer may reword the title when merging.
- Fill in the pull request template.
- When you change `README.md`, change the English only; the maintainer updates the translations. A fix to a translation's own wording is welcome.
