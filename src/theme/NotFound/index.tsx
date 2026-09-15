import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import styles from '@site/src/pages/index.module.css';

export default function NotFound(): React.ReactElement {
  return (
    <Layout
      title={translate({id: 'theme.NotFound.title', message: 'Page Not Found'})}
      wrapperClassName={styles.home}
    >
      <Head>
        <html data-atlas="true" />
        <meta name="robots" content="noindex" />
      </Head>
      <main className={styles.main}>
        <section className={`${styles.hero} ${styles.wrap}`}>
          <p className={styles.eyebrow}>404</p>
          <h1>
            <Translate id="atlas.notFound.title">
              A missing connection.
            </Translate>
          </h1>
          <p className={styles.intro}>
            <Translate id="atlas.notFound.body">
              This page could not be found. Start from the service map or find
              your next step in the docs.
            </Translate>
          </p>
          <div className={styles.actions}>
            <Link className={styles.button} to="/">
              <Translate id="atlas.notFound.home">
                Back to the homepage
              </Translate>{' '}
              ↗
            </Link>
            <Link className={styles.textLink} to="/docs/intro/">
              <Translate id="atlas.notFound.docs">Explore the docs</Translate> ↗
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
