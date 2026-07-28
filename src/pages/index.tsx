import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  TerminalDemo,
  ArchitectureDiagram,
  GitHubMetrics,
  HeroDashboard,
  FeatureGrid,
  StatBand,
  BuiltOn,
} from '@site/src/components';
import styles from './index.module.css';

const INSTALL_CMD =
  'helm install avuruops ./avuruops -n avuruops --create-namespace';

/** schema.org SoftwareApplication for rich search results. */
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Avuru Obs',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Linux, Kubernetes',
  description:
    'Open-source, eBPF-native observability and APM platform — distributed tracing, metrics, logs, continuous profiling and per-service energy & carbon (gCO2e) in one engine. CSRD-ready green IT reporting, zero code changes. A self-hosted alternative to Datadog, New Relic and the Grafana/Prometheus stack.',
  url: 'https://avuruobs.io',
  license: 'https://www.gnu.org/licenses/agpl-3.0.html',
  isAccessibleForFree: true,
  offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
};

/** schema.org Organization — enables a richer Google knowledge panel. */
const ORGANIZATION_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Avuru Obs',
  url: 'https://avuruobs.io',
  logo: 'https://avuruobs.io/img/logo.svg',
  sameAs: ['https://github.com/avuruvision'],
};

/** schema.org WebSite — declares the canonical site to search engines. */
const WEBSITE_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Avuru Obs',
  url: 'https://avuruobs.io',
};

function AltPoint({
  title,
  text,
}: {
  title: React.ReactNode;
  text: React.ReactNode;
}): React.ReactElement {
  return (
    <div className={styles.altPoint}>
      <svg
        className={styles.altPointIcon}
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span className={styles.altPointText}>
        <strong>{title}</strong>
        {text}
      </span>
    </div>
  );
}

function CopyButton({text}: {text: string}): React.ReactElement {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.copyBtn}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}>
      {copied ? (
        <Translate id="home.copied">Copied!</Translate>
      ) : (
        <Translate id="home.copy">Copy</Translate>
      )}
    </button>
  );
}

function InstallCommand(): React.ReactElement {
  return (
    <div className={styles.command}>
      <div className={styles.commandCode}>
        <span className={styles.dollar}>$ </span>
        {INSTALL_CMD}
      </div>
      <CopyButton text={INSTALL_CMD} />
    </div>
  );
}

/** Decorative radar rings + horizon arc — pure inline SVG, no external assets. */
function HeroRings(): React.ReactElement {
  return (
    <div className={styles.heroArt} aria-hidden="true">
      <svg
        className={styles.heroArtSvg}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        focusable="false">
        <defs>
          <linearGradient id="heroRingGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="0.5" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#818cf8" />
          </linearGradient>
          <radialGradient id="heroHorizonGlow" cx="0.5" cy="1" r="0.9">
            <stop offset="0" stopColor="rgba(52, 211, 153, 0.28)" />
            <stop offset="0.45" stopColor="rgba(34, 211, 238, 0.10)" />
            <stop offset="1" stopColor="rgba(6, 10, 20, 0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="300" width="1200" height="500" fill="url(#heroHorizonGlow)" />
        <circle className={`${styles.ring} ${styles.ring1}`} cx="600" cy="980" r="300" />
        <circle className={`${styles.ring} ${styles.ring2}`} cx="600" cy="980" r="470" />
        <circle className={`${styles.ring} ${styles.ring3}`} cx="600" cy="980" r="640" />
        <circle className={`${styles.ring} ${styles.ring4}`} cx="600" cy="980" r="810" />
        <circle
          cx="600"
          cy="1180"
          r="430"
          fill="#0a1424"
          stroke="rgba(148, 163, 184, 0.18)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

function Hero(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  const demoUrl =
    (siteConfig.customFields?.demoUrl as string) || 'https://demo.avuruobs.io';
  return (
    <header className={styles.hero}>
      <HeroRings />

      <div className={styles.heroInner}>
        <Link className={styles.pill} to="/docs/signals/green">
          <span className={styles.pillTag}>New</span>
          <Translate id="home.pill">Energy &amp; carbon per service — zero code</Translate>
          <span className={styles.pillArrow}>→</span>
        </Link>

        <h1 className={styles.title}>
          <Translate id="home.title.lead">Observe everything.</Translate>{' '}
          <span className={styles.gradText}>
            <Translate id="home.title.grad">Waste nothing.</Translate>
          </span>
        </h1>
        <p className={styles.subtitle}>
          <Translate id="home.subtitle">
            Traces, metrics, logs, continuous profiling — and energy &amp;
            carbon per service. One install, one engine, zero code changes.
          </Translate>
        </p>

        <div className={styles.ctaRow}>
          <Link className={`button button--lg ${styles.btnGrad}`} to={demoUrl}>
            <Translate id="home.cta.demo">Live Demo</Translate>
          </Link>
          <Link
            className={`button button--lg ${styles.btnOutline}`}
            to="/docs/getting-started/30-seconds">
            <Translate id="home.cta.guide">30-second guide</Translate>
          </Link>
        </div>
      </div>

      <div className={styles.heroLogos}>
        <BuiltOn />
      </div>
    </header>
  );
}

export default function Home(): React.ReactElement {
  return (
    <Layout
      title={translate({id: 'home.meta.title', message: 'Open-Source Observability & APM'})}
      description={translate({
        id: 'home.meta.desc',
        message:
          'Avuru Obs is an open-source, eBPF-native observability platform — distributed tracing, metrics, logs, continuous profiling and per-service energy & carbon (gCO2e) in one engine. CSRD-ready green IT reporting, zero code changes. A self-hosted alternative to Datadog, New Relic and the Grafana stack.',
      })}>
      <Head>
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
        <script type="application/ld+json">{JSON.stringify(ORGANIZATION_DATA)}</script>
        <script type="application/ld+json">{JSON.stringify(WEBSITE_DATA)}</script>
      </Head>
      <Hero />

      <section className={styles.statement}>
        <h2 className={styles.statementTitle}>
          <Translate id="home.statement.title">
            Every watt, every request, accounted for.
          </Translate>
        </h2>
        <p className={styles.statementLede}>
          <Translate id="home.statement.lede">
            Per-service energy and carbon alongside your traces — CSRD-ready
            exports, zero code changes, and no data ever leaves your cluster.
          </Translate>
        </p>
      </section>

      <section className={`${styles.section} ${styles.productSection}`}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.product.title">One Helm chart. Full picture.</Translate>
        </h2>
        <p className={styles.sectionLede}>
          <Translate id="home.product.lede">
            Install in 30 seconds and the service map lights up — traces, logs,
            metrics, profiles and energy in one UI.
          </Translate>
        </p>
        <InstallCommand />
        <div className={styles.heroShot}>
          <HeroDashboard />
        </div>
      </section>

      <section className={styles.statSection}>
        <StatBand />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.features.title">Every signal, one engine</Translate>
        </h2>
        <p className={styles.sectionLede}>
          <Translate id="home.features.lede">
            Traces, logs, metrics, profiles and energy land in the same store —
            query and correlate them without stitching tools together.
          </Translate>
        </p>
        <FeatureGrid />
      </section>

      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.dropin.title">Already sending OpenTelemetry?</Translate>
        </h2>
        <p className={styles.sectionLede}>
          <Translate id="home.dropin.lede">
            Point your existing collectors at avuru obs and keep your
            instrumentation. Logs, metrics and continuous profiling land next to
            your traces — in one ClickHouse — with a one-line exporter change.
          </Translate>
        </p>
        <div className={styles.ctaRow}>
          <Link
            className={`button button--lg ${styles.btnGrad}`}
            to="/docs/setup/otel-bridge">
            <Translate id="home.dropin.cta.bridge">OTLP bridge guide</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/compare">
            <Translate id="home.dropin.cta.compare">Compare &amp; migrate</Translate>
          </Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <div className={styles.altPanel}>
          <h2 className={styles.sectionTitle}>
            <Translate id="home.alt.title">
              The open-source alternative to Datadog &amp; the Grafana stack
            </Translate>
          </h2>
          <p className={styles.sectionLede}>
            <Translate id="home.alt.lede">
              Self-host the entire platform on your own cluster. One engine replaces a
              Prometheus + Loki + Tempo + Grafana sprawl — and the proprietary agents from
              Datadog or New Relic — with none of the per-host billing or lock-in.
            </Translate>
          </p>
          <div className={styles.altPoints}>
            <AltPoint
              title={<Translate id="home.alt.p1.t">Predictable cost</Translate>}
              text={<Translate id="home.alt.p1.d">Scale telemetry without per-host or per-GB surprise bills.</Translate>}
            />
            <AltPoint
              title={<Translate id="home.alt.p2.t">Own your data</Translate>}
              text={<Translate id="home.alt.p2.d">Self-hosted and AGPL-3.0 — your telemetry never leaves your infrastructure.</Translate>}
            />
            <AltPoint
              title={<Translate id="home.alt.p3.t">No lock-in</Translate>}
              text={<Translate id="home.alt.p3.d">OpenTelemetry-native: standard OTLP in and out, no proprietary agents.</Translate>}
            />
            <AltPoint
              title={<Translate id="home.alt.p4.t">CSRD-ready green IT</Translate>}
              text={<Translate id="home.alt.p4.d">Per-service energy and gCO₂e computed on your own cluster — carbon reporting without shipping telemetry to a SaaS.</Translate>}
            />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.demo.title">See the collector, not a screenshot</Translate>
        </h2>
        <p className={styles.sectionLede}>
          <Translate id="home.demo.lede">
            Install the chart and the service map lights up — no SDKs, no
            sidecars, no YAML archaeology.
          </Translate>
        </p>
        <TerminalDemo />
      </section>

      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.arch.title">One engine. One control plane. One UI.</Translate>
        </h2>
        <p className={styles.sectionLede}>
          <Translate id="home.arch.lede">
            Click any component to open its docs.
          </Translate>
        </p>
        <ArchitectureDiagram />
      </section>

      <section className={`${styles.section} ${styles.sectionBordered}`}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.metrics.title">Open source &amp; alive</Translate>
        </h2>
        <p className={styles.sectionLede}>
          <Translate id="home.metrics.lede">
            AGPL-3.0 and self-hostable — own your telemetry, no per-host or
            per-GB billing. Built in the open on GitHub.
          </Translate>
        </p>
        <GitHubMetrics />
      </section>

      <section className={styles.section}>
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>
            <Translate id="home.final.title">Ship it in 30 seconds</Translate>
          </h2>
          <p className={styles.ctaLede}>
            <Translate id="home.final.lede">
              One Helm chart and the service map lights up. No agents to wire, no
              code to change.
            </Translate>
          </p>
          <InstallCommand />
          <div className={styles.ctaRow}>
            <Link
              className={`button button--lg ${styles.btnGrad}`}
              to="/docs/getting-started/30-seconds">
              <Translate id="home.cta.guide">30-second guide</Translate>
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              <Translate id="home.cta.docs">Read the docs</Translate>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
