import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// --- Single source of truth for repo/edit links ---------------------------
const ENGINE_REPO = 'https://github.com/avuruvision/avuru-obs';
const DOCS_REPO = 'https://github.com/avuruvision/avuru-obs-doc';
// "Edit this page" → GitHub web editor on the docs repo (the <3 clicks → PR flow).
const EDIT_BASE = `${DOCS_REPO}/edit/main/`;

const config: Config = {
  title: 'Avuru Obs',
  tagline: 'Open-source observability & APM — a self-hosted Datadog & Grafana alternative',
  // .ico is the broadly-compatible default (Safari ignores SVG favicons); the
  // crisp SVG + PNG + apple-touch variants are advertised via headTags below.
  favicon: 'img/favicon.ico',

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Production URL — change to your Hostinger domain. baseUrl '/' assumes the
  // site is served at the domain/subdomain root (public_html). If you deploy
  // into a sub-folder (public_html/docs), set baseUrl '/docs/' and match the
  // FTP server-dir in .github/workflows/deploy.yml.
  url: 'https://avuruobs.io',
  baseUrl: '/',

  organizationName: 'avuruvision',
  projectName: 'avuru-obs-doc',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  // Favicons (raster + svg + apple-touch) and SEO meta. robots.txt +
  // auto-generated /sitemap.xml handle crawler discovery.
  headTags: [
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/svg+xml', href: '/img/favicon.svg'}},
    {tagName: 'link', attributes: {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/img/favicon-32.png'}},
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', sizes: '180x180', href: '/img/apple-touch-icon.png'}},
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'open source observability, open source APM, OpenTelemetry, eBPF, distributed tracing, metrics, logs, continuous profiling, Datadog alternative, New Relic alternative, Grafana alternative, Prometheus, self-hosted observability, OTLP',
      },
    },
    {tagName: 'meta', attributes: {name: 'twitter:card', content: 'summary_large_image'}},
    // Explicit dimensions + alt help WhatsApp/LinkedIn render the large preview.
    {tagName: 'meta', attributes: {property: 'og:image:width', content: '1200'}},
    {tagName: 'meta', attributes: {property: 'og:image:height', content: '630'}},
    {tagName: 'meta', attributes: {property: 'og:image:type', content: 'image/png'}},
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:alt',
        content: 'avuru obs — open-source observability & APM',
      },
    },
  ],

  // Privacy-friendly Umami analytics (shared across avurutech.com, valife, etc.).
  // Injected site-wide into <head>; `defer` keeps it off the critical path.
  scripts: [
    {
      src: 'https://analytics.luxavuru.com/script.js',
      defer: true,
      'data-website-id': '52e5a1de-737a-4217-9e5b-b0561afa8044',
    },
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // English is canonical; French falls back to English for untranslated pages.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    localeConfigs: {
      en: {label: 'English', htmlLang: 'en'},
      fr: {label: 'Français', htmlLang: 'fr'},
    },
  },

  presets: [
    [
      'classic',
      {
        // Default docs instance → /docs (onboarding, setup, signals, ops, contribute, releases)
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.docs.ts',
          editUrl: EDIT_BASE,
        },
        blog: {
          showReadingTime: true,
          editUrl: EDIT_BASE,
          feedOptions: {type: ['rss', 'atom'], xslt: true},
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // Additional docs instances, each with its own route + contextual sidebar.
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guides',
        path: 'guides',
        routeBasePath: 'guides',
        sidebarPath: './sidebars.guides.ts',
        editUrl: EDIT_BASE,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'reference',
        path: 'reference',
        routeBasePath: 'reference',
        sidebarPath: './sidebars.reference.ts',
        editUrl: EDIT_BASE,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'integrations',
        path: 'integrations',
        routeBasePath: 'integrations',
        sidebarPath: './sidebars.integrations.ts',
        editUrl: EDIT_BASE,
      },
    ],
    // Changelog → /changelog. A second blog instance (the preset blog stays at
    // /blog for announcements) rendered as a reverse-chron feed of shipped
    // changes, tagged by product area, with its own RSS/Atom.
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'changelog',
        path: 'changelog',
        routeBasePath: 'changelog',
        blogTitle: 'Changelog',
        blogDescription: "What's new in avuru obs — features, improvements and fixes.",
        blogSidebarTitle: 'Recent changes',
        blogSidebarCount: 'ALL',
        showReadingTime: false,
        editUrl: EDIT_BASE,
        feedOptions: {type: ['rss', 'atom'], xslt: true},
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'ignore',
      },
    ],
  ],

  themeConfig: {
    // Branded Open Graph / Twitter card (1200×630) shown when a link is shared
    // on WhatsApp, Slack, X, LinkedIn, etc. Docusaurus turns this into an
    // absolute og:image + twitter:image; width/height/alt are added in headTags.
    image: 'img/avuru-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Avuru Obs',
      logo: {
        alt: 'Avuru Obs',
        src: 'img/logo.svg',
        width: 28,
        height: 28,
      },
      items: [
        // 6 content entries (locked). The locale dropdown is a utility control.
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          docsPluginId: 'guides',
          position: 'left',
          label: 'Guides',
        },
        {
          type: 'docSidebar',
          sidebarId: 'referenceSidebar',
          docsPluginId: 'reference',
          position: 'left',
          label: 'Reference',
        },
        {
          type: 'docSidebar',
          sidebarId: 'integrationsSidebar',
          docsPluginId: 'integrations',
          position: 'left',
          label: 'Integrations',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'dropdown',
          label: 'Project',
          position: 'left',
          items: [
            {to: '/changelog', label: 'Changelog'},
            {to: '/docs/roadmap', label: 'Roadmap'},
            {to: '/docs/releases', label: 'Releases'},
            {to: '/docs/status', label: 'Feature status'},
          ],
        },
        {type: 'localeDropdown', position: 'right'},
        {
          href: ENGINE_REPO,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: '30 seconds', to: '/docs/getting-started/30-seconds'},
            {label: 'Architecture', to: '/guides/architecture'},
          ],
        },
        {
          title: 'Reference',
          items: [
            {label: 'Configuration', to: '/reference/configuration'},
            {label: 'API', to: '/reference/api'},
            {label: 'Integrations', to: '/integrations'},
          ],
        },
        {
          title: 'Project',
          items: [
            {label: 'Changelog', to: '/changelog'},
            {label: 'Roadmap', to: '/docs/roadmap'},
            {label: 'Releases', to: '/docs/releases'},
            {label: 'Feature status', to: '/docs/status'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Blog', to: '/blog'},
            {label: 'GitHub', href: ENGINE_REPO},
            {label: 'Contribute', to: '/docs/contribute/docs'},
          ],
        },
      ],
      copyright: `avuru obs · Apache-2.0 · built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['bash', 'yaml', 'go', 'rust', 'toml', 'json', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
