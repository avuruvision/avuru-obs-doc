import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  TerminalDemo,
  ArchitectureDiagram,
  GitHubMetrics,
  HeroDashboard,
  FeatureGrid,
  StatBand,
} from '@site/src/components';
import styles from './index.module.css';

const INSTALL_CMD =
  'helm install avuruops ./avuruops -n avuruops --create-namespace';

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
      <div className={styles.heroInner}>
        <div className={styles.eyebrow}>
          eBPF-native · OpenTelemetry · Low footprint
        </div>
        <h1 className={styles.title}>
          <Translate id="home.title">APM &amp; Observability without friction</Translate>
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
            className="button button--primary button--lg"
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
    </header>
  );
}

export default function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={translate({id: 'home.meta.title', message: 'APM & Observability without friction'})}
      description={siteConfig.tagline}>
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
            Apache-2.0, built in the open on GitHub.
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
              className="button button--primary button--lg"
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
