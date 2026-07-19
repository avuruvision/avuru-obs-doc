import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const FALLBACK_DEMO_URL = 'https://demo.avuruobs.io';

export default function Demo(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  const demoUrl =
    (siteConfig.customFields?.demoUrl as string) || FALLBACK_DEMO_URL;

  return (
    <Layout
      title={translate({id: 'demo.meta.title', message: 'Live Demo'})}
      description={translate({
        id: 'demo.meta.desc',
        message:
          'A public, read-only avuru obs instance watching the OpenTelemetry Astronomy Shop over OTLP.',
      })}>
      <main className={styles.section}>
        <h1 className={styles.sectionTitle}>
          <Translate id="demo.title">See avuru obs on live data</Translate>
        </h1>
        <p className={styles.sectionLede}>
          <Translate id="demo.lede">
            A public, read-only instance watching the OpenTelemetry Astronomy
            Shop — a multi-service demo app — with every signal flowing in over
            standard OTLP. Explore the service map, traces, logs, metrics and
            profiling on real traffic.
          </Translate>
        </p>
        <div className={styles.ctaRow}>
          <Link className={`button button--lg ${styles.btnGrad}`} to={demoUrl}>
            <Translate id="demo.cta.launch">Launch the live demo →</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/30-seconds">
            <Translate id="demo.cta.install">Install your own in 30s</Translate>
          </Link>
        </div>
        <p className={styles.sectionLede}>
          <Translate id="demo.note">
            Read-only — browse everything, change nothing. The demo runs entirely
            on the stable OTLP path. Want it on your own cluster? It’s one Helm
            chart.
          </Translate>
        </p>
      </main>
    </Layout>
  );
}
