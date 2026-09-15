import React from 'react';
import Link from '@docusaurus/Link';
import {t} from './content';
import styles from '@site/src/pages/index.module.css';

export default function ProductSections(): React.ReactElement {
  const signals = [
    {name: t('trace'), body: t('traceBody'), to: '/docs/signals/traces/'},
    {name: t('logs'), body: t('logsBody'), to: '/docs/signals/logs/'},
    {name: t('metrics'), body: t('metricsBody'), to: '/docs/signals/metrics/'},
  ];
  const modules = [
    {title: t('meshTitle'), body: t('meshBody'), to: '/docs/signals/mesh/'},
    {title: t('costTitle'), body: t('costBody'), to: '/docs/signals/cost/'},
    {title: t('greenTitle'), body: t('greenBody'), to: '/docs/signals/green/'},
    {title: t('aiTitle'), body: t('aiBody'), to: '/docs/signals/ai/'},
  ];
  return (
    <>
      <section className={styles.signalSection}>
        <div className={`${styles.wrap} ${styles.signalLayout}`}>
          <div>
            <p className={styles.eyebrow}>{t('signalsEyebrow')}</p>
            <h2>{t('signalsTitle')}</h2>
            <p className={styles.sectionIntro}>{t('signalsIntro')}</p>
            <Link
              className={styles.textLink}
              to="/guides/investigate-slow-checkout/"
            >
              {t('incidentGuide')} ↗
            </Link>
          </div>
          <div className={styles.tracePreview}>
            <div className={styles.traceHeader}>
              <span>checkout → payment → postgres</span>
              <span>{t('illustrativeTrace')}</span>
            </div>
            <div className={styles.waterfall} aria-hidden="true">
              <div>
                <span>POST /checkout</span>
                <i style={{width: '100%'}} />
              </div>
              <div>
                <span>payment.authorize</span>
                <i style={{width: '82%', marginLeft: '8%'}} />
              </div>
              <div>
                <span>postgresql.query</span>
                <i style={{width: '68%', marginLeft: '15%'}} />
              </div>
            </div>
            <div className={styles.signalLinks}>
              {signals.map((signal) => (
                <Link key={signal.to} to={signal.to}>
                  <strong>
                    {signal.name} <span aria-hidden="true">↗</span>
                  </strong>
                  <span>{signal.body}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className={styles.darkSection}>
        <div className={styles.wrap}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>{t('adoptionEyebrow')}</p>
              <h2>{t('adoptionTitle')}</h2>
            </div>
            <p>{t('adoptionIntro')}</p>
          </div>
          <div className={styles.steps}>
            <article>
              <span className={styles.index}>01 / HELM</span>
              <h3>{t('installStep')}</h3>
              <p>{t('installStepBody')}</p>
              <div className={styles.stepArt}>
                <code>
                  <span>$</span> helm install avuruobs
                </code>
              </div>
              <Link to="/docs/setup/kubernetes/">{t('requirements')} ↗</Link>
            </article>
            <article>
              <span className={styles.index}>02 / eBPF</span>
              <h3>{t('discoverStep')}</h3>
              <p>{t('discoverStepBody')}</p>
              <div className={styles.stepArt} aria-hidden="true">
                <span className={styles.connected}>⬡ — ⬡ — ⬡</span>
              </div>
              <Link to="/docs/signals/service-map/">{t('mapDocs')} ↗</Link>
            </article>
            <article>
              <span className={styles.index}>03 / OTLP</span>
              <h3>{t('otelStep')}</h3>
              <p>{t('otelStepBody')}</p>
              <div className={styles.stepArt}>
                <span className={styles.protocols}>
                  HTTP :4318 <span> / </span> gRPC :4317
                </span>
              </div>
              <Link to="/docs/setup/otel-bridge/">{t('otelGuide')} ↗</Link>
            </article>
          </div>
        </div>
      </section>
      <section className={`${styles.modules} ${styles.wrap}`}>
        <div>
          <p className={styles.eyebrow}>{t('modulesEyebrow')}</p>
          <h2>{t('modulesTitle')}</h2>
          <p className={styles.sectionIntro}>{t('modulesIntro')}</p>
          <Link className={styles.textLink} to="/docs/setup/modules/">
            {t('modulesAction')} ↗
          </Link>
        </div>
        <div className={styles.moduleLinks}>
          {modules.map((module) => (
            <Link to={module.to} key={module.to}>
              <div>
                <h3>{module.title}</h3>
                <p>{module.body}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.trustSection}>
        <div className={`${styles.wrap} ${styles.trustLayout}`}>
          <div>
            <p className={styles.eyebrow}>{t('trustEyebrow')}</p>
            <h2>{t('trustTitle')}</h2>
            <p className={styles.sectionIntro}>{t('trustBody')}</p>
            <div className={styles.trustLinks}>
              <Link to="/guides/architecture/">{t('architecture')} ↗</Link>
              <Link to="https://github.com/avuruvision/avuru-obs/releases">
                {t('releases')} ↗
              </Link>
              <Link to="https://github.com/avuruvision/avuru-obs">
                {t('source')} ↗
              </Link>
            </div>
          </div>
          <div className={styles.architecture}>
            <div className={styles.ingestRow}>
              <span>eBPF</span>
              <span>OpenTelemetry</span>
            </div>
            <div className={styles.archArrow} aria-hidden="true">
              ↓
            </div>
            <div className={styles.archBox}>Gateway</div>
            <div className={styles.archArrow} aria-hidden="true">
              ↓
            </div>
            <div className={`${styles.archBox} ${styles.storage}`}>
              ClickHouse<small>{t('storeLabel')}</small>
            </div>
            <div className={styles.archArrow} aria-hidden="true">
              ↑
            </div>
            <div className={styles.archBox}>
              Hub + UI<small>{t('hubLabel')}</small>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
