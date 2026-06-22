# Contributing to avuru obs docs

Thanks for improving the docs! The loop is intentionally short.

## Small fixes — the 3-click flow

1. Click **"Edit this page"** at the bottom of any page (opens the GitHub web
   editor on the source `.mdx`).
2. **"Propose changes"** — GitHub forks the repo for you.
3. **"Create pull request"** — the template asks two things: change type and an
   optional linked issue.

No local checkout needed.

## Larger changes — local

```bash
npm install
npm start            # English  → http://localhost:3000
npm run start:fr     # French
npm run build        # production build (throws on broken links)
npm run lint:docs    # front-matter linter
```

## New pages

Copy a template from [`templates/`](templates/), rename it, and fill the
placeholders:

- `integration.mdx` · `metric.mdx` · `guide.mdx` · `adr.mdx`

The front-matter linter (CI) enforces required keys — e.g. an integration page
must declare `support_level` and `since_version`. Follow the template and you'll
pass.

## Translations (French)

English is canonical. French translations live under `i18n/fr/`. Untranslated
pages fall back to English, so you can translate incrementally. Re-extract UI
strings with `npm run write-translations -- --locale fr`.

## Commit hygiene

- **Conventional commits**, scope `docs` (e.g. `docs: clarify OTLP endpoint`).
- **Sign your commits.**
- **No AI co-author trailers** — mirrors the engine repo's `AI_POLICY.md`.
- Branch from `main` as `docs/<topic>`.

## Preview deployments

Vercel/Netlify previews are optional and not wired by default — the CI build is
the PR gate. Production publishes to Hostinger (FTPS) on merge to `main`.
