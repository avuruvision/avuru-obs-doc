# Atlas validation record

Validated locally on 15 September 2026 from the `docs/atlas-landing-seo` branch.

| Check | Result |
| --- | --- |
| TypeScript | `npm run typecheck` passed |
| Documentation front matter | 241 files passed |
| Production build | EN and FR passed without broken-link or broken-anchor warnings |
| Rendered SEO | 5 tests passed; 386 sitemap URLs checked against canonical and reciprocal hreflang targets |
| Browser behavior | 22 Playwright tests passed |
| Accessibility | axe checks passed for EN/FR at 390 and 1440 px, including open mobile navigation |
| Responsive behavior | No page overflow at 320, 390, 768 or 1440 px; compact and full map tested |
| Progressive enhancement | Core content, docs links and FAQ usable without JavaScript |
| Downloadable Python fixture | 2 contract tests passed against a local mock receiver |
| Executable Go example | `go test -race ./...` and `go vet ./...` passed; incoming trace context and shutdown export verified |
| Formatting | Prettier passed on changed frontend and test files; `git diff --check` passed |

The example tests validate payloads and client behavior against mock receivers.
They do not establish a fresh Kubernetes installation or end-to-end ingestion
against the released Avuru Obs stack. Product screenshots come from the engine
repository and are labelled separately from the synthetic exercise.

## Performance diagnostic

Lighthouse mobile on a local preview with gzip and immutable hashed assets:
performance **97**, accessibility **100**, best practices **100**, SEO **100**.
Measured lab values: LCP approximately **2.5 s**, total blocking time **110 ms**,
CLS **0**. The landing font is preloaded from the same hashed asset used by CSS.

The first uncompressed `docusaurus serve` diagnostic scored 79 for performance.
The compressed preview emulates static hosting; these are different serving
conditions, not a controlled before/after measurement of the code alone.
Production compression and cache headers still need verification after deploy.
No field INP, Search Console ranking or traffic improvement has been measured.
A Lighthouse SEO score is a technical checklist, not a guarantee of Google traction.

Local screenshots and raw Lighthouse reports are kept with the private Atlas
study. Reproduce behavior with the committed browser tests. Regenerate the
1200×630 social card with `node scripts/render-social-card.mjs` after installing
Playwright Chromium.

Hosting, demo indexing and Search Console follow-up are tracked in
[the rollout guide](atlas-rollout.md).
