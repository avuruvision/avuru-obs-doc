import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
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
    'Open-source, eBPF-native observability and APM platform — distributed tracing, metrics, logs and continuous profiling in one engine. A self-hosted alternative to Datadog, New Relic and the Grafana/Prometheus stack.',
  url: 'https://avuruobs.io',
  license: 'https://www.apache.org/licenses/LICENSE-2.0',
  isAccessibleForFree: true,
  offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
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

function Hero(): React.ReactElement {
  return (
    <header className={styles.hero}>
      <div className={styles.heroBg} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blob1}`} />
        <span className={`${styles.blob} ${styles.blob2}`} />
        <span className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <div className={styles.heroInner}>
        <Link className={styles.pill} to="/docs/signals/profiling">
          <span className={styles.pillTag}>New</span>
          <Translate id="home.pill">Continuous eBPF profiling</Translate>
          <span className={styles.pillArrow}>→</span>
        </Link>

        <div className={styles.eyebrow}>
          Open source · eBPF-native · OpenTelemetry
        </div>
        <h1 className={styles.title}>
          <Translate id="home.title.lead">APM &amp; Observability</Translate>{' '}
          <span className={styles.gradText}>
            <Translate id="home.title.grad">without friction</Translate>
          </span>
        </h1>
        <p className={styles.subtitle}>
          <Translate id="home.subtitle">
            Traces, metrics, logs and continuous profiling — one install, one
            engine, zero code changes.
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

        <div className={styles.chips}>
          <span className={styles.chip}>Traces</span>
          <span className={styles.chip}>Logs</span>
          <span className={styles.chip}>Metrics</span>
          <span className={styles.chip}>Profiling</span>
        </div>
      </div>

      <div className={styles.heroShot}>
        <HeroDashboard />
      </div>

      <BuiltOn />
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
          'Avuru Obs is an open-source, eBPF-native observability platform — distributed tracing, metrics, logs and continuous profiling in one engine. A self-hosted alternative to Datadog, New Relic and the Grafana stack.',
      })}>
      <Head>
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
      </Head>
      <Hero />

      <section className={styles.statSection}>
        <StatBand />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Translate id="home.features.title">Every signal, one engine</Translate>
        </h2>
        <p className={styles.sectionLede}>
          <Translate id="home.features.lede">
            Traces, logs, metrics and profiles land in the same store — query and
            correlate them without stitching tools together.
          </Translate>
        </p>
        <FeatureGrid />
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
              text={<Translate id="home.alt.p2.d">Self-hosted and Apache-2.0 — your telemetry never leaves your infrastructure.</Translate>}
            />
            <AltPoint
              title={<Translate id="home.alt.p3.t">No lock-in</Translate>}
              text={<Translate id="home.alt.p3.d">OpenTelemetry-native: standard OTLP in and out, no proprietary agents.</Translate>}
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
            Apache-2.0 and self-hostable — own your telemetry, no per-host or
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
