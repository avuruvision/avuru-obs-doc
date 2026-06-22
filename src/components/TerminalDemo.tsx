import React from 'react';
import styles from './components.module.css';

export interface TerminalDemoProps {
  title?: string;
}

/**
 * Static terminal showing real-looking collector output — the home "show, don't
 * tell" demo. Kept static (no JS animation) so it renders identically in SSR.
 */
export default function TerminalDemo({
  title = 'avuru gateway · live',
}: TerminalDemoProps): React.ReactElement {
  return (
    <div className={styles.terminal}>
      <div className={styles.termBar}>
        <span className={`${styles.dot} ${styles.dotR}`} />
        <span className={`${styles.dot} ${styles.dotY}`} />
        <span className={`${styles.dot} ${styles.dotG}`} />
        <span className={styles.termTitle}>{title}</span>
      </div>
      <div className={styles.termBody}>
        <span className={styles.prompt}>$ </span>
        <span className={styles.out}>kubectl logs -n avuruops ds/avuruops-sensor -f</span>
        {'\n'}
        <span className={styles.dim}>info  ebpf      attached kprobe tcp_connect / tcp_close</span>
        {'\n'}
        <span className={styles.dim}>info  discovery found 7 services · 0 SDKs · 0 sidecars</span>
        {'\n'}
        <span className={styles.out}>info  otlp      exporting traces  → avuruops-gateway:4317</span>
        {'\n'}
        <span className={styles.out}>info  otlp      exporting metrics → avuruops-gateway:4317</span>
        {'\n'}
        <span className={styles.ok}>ok    map       frontend → cart → payment → postgres</span>
        {'\n'}
        <span className={styles.ok}>ok    clickhouse  18,402 spans written (batch 512)</span>
        {'\n'}
        <span className={styles.prompt}>$ </span>
        <span className={styles.cursor} />
      </div>
    </div>
  );
}
