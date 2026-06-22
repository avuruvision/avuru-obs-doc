import React from 'react';
import Link from '@docusaurus/Link';
import styles from './components.module.css';

interface NodeProps {
  to: string;
  title: string;
  sub: string;
  store?: boolean;
}

function Node({to, title, sub, store}: NodeProps): React.ReactElement {
  return (
    <Link to={to} className={`${styles.node} ${store ? styles.store : ''}`}>
      <div className={styles.nodeTitle}>{title}</div>
      <div className={styles.nodeSub}>{sub}</div>
    </Link>
  );
}

/**
 * Clickable data-flow diagram. Each node links to the doc for that component:
 *
 *   sensor ──OTLP──▶ gateway ──▶ ClickHouse ◀──SQL── hub ◀── UI
 */
export default function ArchitectureDiagram(): React.ReactElement {
  return (
    <div className={styles.arch}>
      <div className={styles.archRow}>
        <Node
          to="/docs/setup/ebpf-mode"
          title="sensor"
          sub="eBPF DaemonSet · flows · traces · logs · profiles"
        />
        <span className={styles.arrow}>▶</span>
        <Node
          to="/docs/setup/otel-bridge"
          title="gateway"
          sub="minimal OTel Collector"
        />
        <span className={styles.arrow}>▶</span>
        <Node
          to="/docs/operations/scaling"
          title="ClickHouse"
          sub="one engine · all signals"
          store
        />
      </div>
      <div className={styles.arrowV}>▲ SQL</div>
      <div className={styles.archRow}>
        <Node
          to="/docs/signals/traces"
          title="UI"
          sub="static SPA · own pod"
        />
        <span className={styles.arrow}>▶</span>
        <Node
          to="/reference/api"
          title="hub"
          sub="Go API · OpAMP config plane"
        />
      </div>
    </div>
  );
}
