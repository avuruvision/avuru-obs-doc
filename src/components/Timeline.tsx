import React from 'react';
import styles from './components.module.css';
import StatusBadge, {type Status} from './StatusBadge';

/**
 * One node on the release timeline: version, date, optional status pill, and
 * MDX children (the highlights). `statusLabel` localizes the pill for FR.
 */
export function ReleaseEntry({
  version,
  date,
  status,
  statusLabel,
  children,
}: {
  version: string;
  date?: string;
  status?: Status;
  statusLabel?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <div className={styles.release}>
      <div className={styles.releaseHead}>
        <span className={styles.releaseVersion}>{version}</span>
        {date && <span className={styles.releaseDate}>{date}</span>}
        {status && <StatusBadge status={status} label={statusLabel} />}
      </div>
      <div className={styles.releaseBody}>{children}</div>
    </div>
  );
}

/** Vertical rail wrapper for a stack of <ReleaseEntry>. */
export default function Timeline({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <div className={styles.timeline}>{children}</div>;
}
