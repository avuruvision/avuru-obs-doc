import React, {useState} from 'react';
import Link from '@docusaurus/Link';
import {HELM_INSTALL} from '../installCommands';
import {t} from './content';
import {track} from './telemetry';
import styles from '@site/src/pages/index.module.css';

export default function InstallPanel({
  demoUrl,
}: {
  demoUrl: string;
}): React.ReactElement {
  const [copyStatus, setCopyStatus] = useState<
    'copy' | 'copied' | 'copyFailed'
  >('copy');
  async function copy() {
    try {
      await navigator.clipboard.writeText(HELM_INSTALL);
      setCopyStatus('copied');
      track('install_copy', {platform: 'kubernetes'});
    } catch {
      setCopyStatus('copyFailed');
    }
  }
  return (
    <section className={`${styles.end} ${styles.wrap}`}>
      <p className={styles.eyebrow}>{t('endEyebrow')}</p>
      <h2>{t('endTitle')}</h2>
      <p className={styles.sectionIntro}>{t('endBody')}</p>
      <div className={styles.actions}>
        <Link
          className={styles.button}
          to={demoUrl}
          onClick={() => track('demo_click', {placement: 'final'})}
        >
          {t('demo')} ↗
        </Link>
        <Link
          className={styles.textLink}
          to="/docs/getting-started/30-seconds/"
          onClick={() => track('quickstart_click', {placement: 'final'})}
        >
          {t('quickstart')} ↗
        </Link>
      </div>
      <div className={styles.command}>
        <pre>
          <code>{HELM_INSTALL}</code>
        </pre>
        <button type="button" onClick={copy}>
          {t(copyStatus === 'copied' ? 'copied' : 'copy')}
        </button>
      </div>
      <p className={styles.copyStatus} role="status">
        {copyStatus === 'copyFailed'
          ? t('copyFailed')
          : copyStatus === 'copied'
            ? t('copied')
            : ''}
      </p>
      <p className={styles.installNote}>{t('installNote')}</p>
    </section>
  );
}
