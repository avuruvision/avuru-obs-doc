import React from 'react';
import styles from './components.module.css';
import StatusBadge, {type Status} from './StatusBadge';

/** Grid wrapper so MDX can lay milestone cards out responsively. */
export function MilestoneGrid({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <div className={styles.msGrid}>{children}</div>;
}

/**
 * One roadmap milestone card: a version tag (e.g. "M2"), a title, a status
 * pill, and MDX children (the feature list). `statusLabel` lets translated
 * pages localize the pill text.
 */
export default function MilestoneCard({
  tag,
  title,
  status,
  statusLabel,
  children,
}: {
  tag: string;
  title: string;
  status: Status;
  statusLabel?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <div className={styles.msCard}>
      <div className={styles.msHead}>
        <span className={styles.msTag}>{tag}</span>
        <h3 className={styles.msTitle}>{title}</h3>
        <StatusBadge status={status} label={statusLabel} />
      </div>
      <div className={styles.msBody}>{children}</div>
    </div>
  );
}
