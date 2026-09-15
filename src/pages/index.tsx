import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import AtlasLanding from '@site/src/components/home/AtlasLanding';
import {t} from '@site/src/components/home/content';
import styles from './index.module.css';
import atlasFont from '@site/static/fonts/inter-latin.woff2';

export default function Home(): React.ReactElement {
  const {siteConfig, i18n} = useDocusaurusContext();
  const root = siteConfig.url;
  const url = `${root}${i18n.currentLocale === 'fr' ? '/fr/' : '/'}`;
  const description = t('description');
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${root}/#organization`,
        name: 'Avuru Obs',
        url: `${root}/`,
        logo: `${root}/img/logo.svg`,
        sameAs: ['https://github.com/avuruvision'],
      },
      {
        '@type': 'WebSite',
        '@id': `${root}/#website`,
        name: 'Avuru Obs',
        url: `${root}/`,
        inLanguage: ['en', 'fr'],
        publisher: {'@id': `${root}/#organization`},
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${root}/#software`,
        name: 'Avuru Obs',
        url,
        description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Linux, Kubernetes',
        license: 'https://www.gnu.org/licenses/agpl-3.0.html',
        isAccessibleForFree: true,
        offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
        publisher: {'@id': `${root}/#organization`},
      },
    ],
  };
  return (
    <Layout
      title={t('title')}
      description={description}
      wrapperClassName={styles.home}
    >
      <Head>
        <html data-atlas="true" />
        <link
          rel="preload"
          href={atlasFont}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <meta
          property="og:image"
          content={`${root}/img/atlas-social-card.png`}
        />
        <meta
          name="twitter:image"
          content={`${root}/img/atlas-social-card.png`}
        />
        <meta property="og:image:alt" content={t('socialAlt')} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
      <AtlasLanding />
    </Layout>
  );
}
