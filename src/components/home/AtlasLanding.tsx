import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ServiceMap from './ServiceMap';
import ProductSections from './ProductSections';
import InstallPanel from './InstallPanel';
import {t} from './content';
import {track} from './telemetry';
import type {Lens} from './mapData';
import styles from '@site/src/pages/index.module.css';

export default function AtlasLanding(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  const demoUrl = String(
    siteConfig.customFields?.demoUrl || 'https://demo.avuruobs.io',
  );
  const [lens, setLens] = useState<Lens>('health');
  const questions = [
    {title: t('q1'), body: t('q1Body'), action: t('q1Action'), lens: 'health'},
    {title: t('q2'), body: t('q2Body'), action: t('q2Action'), lens: 'latency'},
    {title: t('q3'), body: t('q3Body'), action: t('q3Action'), lens: 'carbon'},
  ] as const;

  function changeLens(next: Lens) {
    setLens(next);
    track('map_interaction', {action: 'change_lens', lens: next});
  }

  return (
    <main className={styles.main}>
      <header className={`${styles.hero} ${styles.wrap}`}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} />
          {t('eyebrow')}
        </p>
        <h1>
          {t('headline')} <span>{t('headlineAccent')}</span>
        </h1>
        <p className={styles.intro}>{t('intro')}</p>
        <div className={styles.actions}>
          <a className={styles.button} href="#explore">
            {t('explore')} <span aria-hidden="true">↓</span>
          </a>
          <Link
            className={styles.textLink}
            to="/docs/getting-started/30-seconds/"
            onClick={() => track('quickstart_click', {placement: 'hero'})}
          >
            {t('install')} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>
      <section
        className={styles.wrap}
        id="explore"
        tabIndex={-1}
        aria-labelledby="map-heading"
      >
        <h2 id="map-heading" className={styles.srOnly}>
          {t('mapHeading')}
        </h2>
        <ServiceMap lens={lens} onLensChange={changeLens} demoUrl={demoUrl} />
        <div className={styles.mapCaption}>
          <span>{t('mapCaption')}</span>
          <Link to="/docs/signals/service-map/">{t('mapDocs')} ↗</Link>
        </div>
      </section>
      <div className={`${styles.bridge} ${styles.wrap}`}>
        <span>
          <b>eBPF</b>
          {t('bridge1')}
        </span>
        <span>
          <b>OTLP</b>
          {t('bridge2')}
        </span>
        <span>
          <b>Self-hosted</b>
          {t('bridge3')}
        </span>
      </div>
      <section className={`${styles.section} ${styles.wrap}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>{t('questionsEyebrow')}</p>
            <h2>{t('questionsTitle')}</h2>
          </div>
          <p>{t('questionsIntro')}</p>
        </div>
        <div className={styles.questions}>
          {questions.map((question, index) => (
            <article key={question.lens}>
              <span className={styles.index}>0{index + 1}</span>
              <h3>{question.title}</h3>
              <p>{question.body}</p>
              <a
                className={styles.textLink}
                href="#explore"
                onClick={() => changeLens(question.lens)}
              >
                {question.action} <span aria-hidden="true">↑</span>
              </a>
            </article>
          ))}
        </div>
      </section>
      <ProductSections />
      <section
        className={`${styles.faq} ${styles.wrap}`}
        aria-labelledby="faq-heading"
      >
        <h2 id="faq-heading">{t('faqTitle')}</h2>
        <div>
          {([1, 2, 3, 4] as const).map((index) => (
            <details key={index}>
              <summary>{t(`faq${index}`)}</summary>
              <p>{t(`faq${index}Body`)}</p>
            </details>
          ))}
        </div>
      </section>
      <InstallPanel demoUrl={demoUrl} />
    </main>
  );
}
