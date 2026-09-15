# Atlas rollout and search measurement

This branch implements the landing, acquisition content and pre-deployment
checks. Publishing to Hostinger still happens through the existing `main`
deployment workflow. A local build cannot verify hosting redirects, Search
Console indexation or field Core Web Vitals.

## Before publishing

- Review EN and FR, including the interactive map, installation and downloaded examples.
- Run the commands in CONTRIBUTING.md. The browser tests use the production build.
- Review the latest public release before updating `CHART_VERSION` in `src/components/installCommands.ts`.
- Keep existing slugs. `trailingSlash: true` aligns the output with Hostinger's directory redirects.
- Keep the Google verification file and both sitemaps.
- Baseline Search Console clicks/impressions, indexation and chosen canonicals if the property is available. No private Search Console data was available during implementation.

## Hosting changes to apply with access to the live configuration

The current public `www` host serves a duplicate with an apex canonical. Merge
`hostinger-canonical.htaccess.example` into the existing hosting rules after
checking their order. Do not blindly replace the live `.htaccess`. The file is
outside `static/`, so deployment will not overwrite an unseen hosting configuration.

The demo is deployed separately from this documentation repository. Its owner
should add an `X-Robots-Tag: noindex` response header to HTML responses, or the
equivalent robots meta tag in the demo shell. Keep the pages crawlable so the
crawler can read the directive; a robots.txt disallow alone does not remove an
indexed URL. Check nginx `add_header` inheritance when configuring it. Do not
apply demo noindex rules to the documentation domain.

After deployment, verify with real HTTP requests:

- Apex HTTPS homepage and localized documents return 200.
- `www` permanently redirects to the apex, preserving path and query.
- Slashless documentation paths redirect once to the final slash URL.
- Final HTML canonical, reciprocal hreflang and sitemap URLs agree.
- A nonexistent URL returns HTTP 404; a styled page alone is insufficient.
- Demo HTML has noindex; public acquisition pages do not.

Submit or refresh `/sitemap.xml` and `/fr/sitemap.xml` in Search Console and inspect
representative EN/FR pages. Submission does not guarantee indexation.

## Events already implemented

The existing Umami installation receives only explicit landing interactions:

| Event | Properties | Interpretation |
| --- | --- | --- |
| `map_interaction` | `action`, `lens`, optional illustrative `service` | Exploration of an example, not application telemetry |
| `demo_click` | `placement` | Navigation toward the real demo |
| `quickstart_click` | `placement` | Navigation toward installation instructions |
| `install_copy` | `platform` | Successful clipboard write, not a completed installation |

No trace content, user-entered values, ingest keys or actual service names are
collected. A blocked analytics script must not break the page. The repository's
browser tests replace Umami locally; they never send test events to production.

## 30 / 60 / 90 day review

Compare non-brand impressions and clicks by landing page, query, language and
country. Interpret CTR and position with changes in the query mix. Review
excluded URLs, Google-selected canonicals and real French content coverage.
Then compare organic visits progressing toward the demo and quickstart.
Confirmed deployments and user conversations remain the evidence of adoption.

Use field data at the 75th percentile where enough visits exist: LCP at most
2.5 seconds, INP at most 200 ms and CLS at most 0.1. Lab measurements diagnose
issues but cannot establish field INP or guarantee search rankings.

## Follow-up content

Service map, traces, logs, metrics, Go, PostgreSQL and the incident exercise are
covered in this branch, with their priority French destinations. Remaining
fallback translations are inventoried by `npm run audit:i18n`; translating every
archive or legacy reference is a separate editorial task.

The comparison overview now states the verified release and removes unsupported
universal claims. Individual vendor comparison tables still need a dated review
against each vendor's official documentation before being used in new campaigns.
Do not infer missing competitor features from the existing tables.

Further content should answer observed queries: CPU requests versus observed
peak, eBPF capture limits, and progressive OTLP migration. No search volumes,
ranking guarantees or fabricated testimonials are part of this implementation.
