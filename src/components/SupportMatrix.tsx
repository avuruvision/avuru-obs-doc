import React from 'react';
import styles from './components.module.css';

type Status = 'yes' | 'partial' | 'no';

export interface SignalRow {
  signal: string;
  status: Status;
  notes?: string;
}

const BADGE: Record<Status, {cls: string; label: string}> = {
  yes: {cls: styles.badgeYes, label: '✅ Supported'},
  partial: {cls: styles.badgePartial, label: '⚠️ Partial'},
  no: {cls: styles.badgeNo, label: '❌ No'},
};

const DEFAULT_ROWS: SignalRow[] = [
  {signal: 'Traces', status: 'yes', notes: 'Auto via eBPF + OTLP'},
  {signal: 'Metrics', status: 'yes', notes: 'RED + OTLP'},
  {signal: 'Logs', status: 'yes', notes: 'Correlated by trace_id'},
  {signal: 'Profiling', status: 'partial', notes: 'Continuous, alpha'},
];

export interface SupportMatrixProps {
  signals?: SignalRow[];
}

export default function SupportMatrix({
  signals = DEFAULT_ROWS,
}: SupportMatrixProps): React.ReactElement {
  return (
    <table className={styles.matrix}>
      <thead>
        <tr>
          <th>Signal</th>
          <th>Status</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {signals.map((row) => {
          const badge = BADGE[row.status];
          return (
            <tr key={row.signal}>
              <td>{row.signal}</td>
              <td>
                <span className={`${styles.badge} ${badge.cls}`}>
                  {badge.label}
                </span>
              </td>
              <td>{row.notes ?? '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
