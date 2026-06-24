# avuru obs — documentation

Source for the **avuru obs** documentation site, built with
[Docusaurus 3](https://docusaurus.io). English + French. Published to Hostinger
via GitHub Actions (FTPS) on every push to `main`.

> Engine repo: **[avuruvision/avuru-obs](https://github.com/avuruvision/avuru-obs)**
> · License: **Apache-2.0**

## Develop

```bash
npm install
npm start            # English  → http://localhost:3000
npm run start:fr     # French
npm run build        # production build (all locales; throws on broken links)
npm run serve        # preview the production build
npm run lint:docs    # front-matter linter (also runs in CI)
```

Requires Node ≥ 22.

## Structure

| Path | What |
|---|---|
| `docs/` | Default instance → `/docs` (onboarding, setup, signals, ops, contribute) |
| `guides/` | `/guides` — task recipes + architecture |
| `reference/` | `/reference` — configuration, CLI, API, semantic conventions |
| `integrations/` | `/integrations` — languages, frameworks, databases, infra |
| `blog/` | `/blog` — announcements & release notes |
| `src/components/` | MDX components (`InstallSelector`, `SupportMatrix`, …) |
| `src/pages/index.tsx` | Custom home page |
| `templates/` | Copy-paste templates for new pages (linted) |
| `i18n/fr/` | French translations (untranslated pages fall back to English) |
| `scripts/lint-frontmatter.mjs` | Front-matter linter |

## Internationalization

English is canonical; French lives under `i18n/fr/`. To (re)extract UI strings:

```bash
npm run write-translations -- --locale fr
```

Untranslated Markdown automatically falls back to the English source.

## Deployment

`.github/workflows/deploy.yml` builds the site and uploads `build/` to Hostinger
over FTPS on push to `main`. Configure these repo **secrets**:

- `FTP_SERVER` — e.g. `ftp.yourdomain.com`
- `FTP_USERNAME`
- `FTP_PASSWORD`

The deploy uploads to the FTP **login directory** (Hostinger FTP accounts are
chrooted to the site's web root, so that's `public_html`). If your account roots
elsewhere, change the `mirror … .` target in `.github/workflows/deploy.yml`.

> **baseUrl note:** `docusaurus.config.ts` assumes the site is served at the
> domain root (`baseUrl: '/'`). If you deploy into a sub-folder, set
> `baseUrl: '/docs/'` and match `FTP_SERVER_DIR`.

## Contributing

See [`docs/contribute/docs.mdx`](docs/contribute/docs.mdx). Use conventional
commits (`docs: …`), sign your commits, and **do not** add AI co-author trailers
(mirrors the engine repo's `AI_POLICY.md`).
