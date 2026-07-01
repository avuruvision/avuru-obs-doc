import React from 'react';
import styles from './components.module.css';

export type Status = 'shipped' | 'in-progress' | 'planned';

const CLS: Record<Status, string> = {
  shipped: styles.statusShipped,
  'in-progress': styles.statusProgress,
  planned: styles.statusPlanned,
};

const DEFAULT_LABEL: Record<Status, string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  planned: 'Planned',
};

/**
 * Small status pill (shipped / in progress / planned). `label` overrides the
 * default English word so translated pages (FR) can pass their own text.
 */
export default function StatusBadge({
  status,
  label,
}: {
  status: Status;
  label?: string;
}): React.ReactElement {
  return (
    <span className={`${styles.statusBadge} ${CLS[status]}`}>
      {label ?? DEFAULT_LABEL[status]}
    </span>
  );
}
