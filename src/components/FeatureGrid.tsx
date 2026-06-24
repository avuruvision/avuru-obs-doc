import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './components.module.css';

type IconKey = 'trace' | 'logs' | 'metrics' | 'profile' | 'ebpf' | 'otel';

/** Lucide-style stroke icons (24×24, currentColor). No emoji. */
const ICONS: Record<IconKey, React.ReactElement> = {
  trace: (
    <>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
  logs: (
    <>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </>
  ),
  metrics: (
    <>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  profile: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
  ebpf: (
    <>
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </>
  ),
  otel: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </>
  ),
};

interface Feature {
  icon: IconKey;
  to: string;
  title: React.ReactNode;
  desc: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    icon: 'trace',
    to: '/docs/signals/traces',
    title: <Translate id="home.feat.traces.title">Distributed tracing</Translate>,
    desc: (
      <Translate id="home.feat.traces.desc">
        Span-by-span waterfalls across every service — auto-stitched, no manual context propagation.
      </Translate>
    ),
  },
  {
    icon: 'logs',
    to: '/docs/signals/logs',
    title: <Translate id="home.feat.logs.title">Correlated logs</Translate>,
    desc: (
      <Translate id="home.feat.logs.desc">
        Structured logs linked to the trace that produced them. Jump from a slow request to its lines.
      </Translate>
    ),
  },
  {
    icon: 'metrics',
    to: '/docs/signals/metrics',
    title: <Translate id="home.feat.metrics.title">Metrics &amp; dashboards</Translate>,
    desc: (
      <Translate id="home.feat.metrics.desc">
        RED metrics out of the box plus custom queries. Build dashboards on one SQL-native engine.
      </Translate>
    ),
  },
  {
    icon: 'profile',
    to: '/docs/signals/profiling',
    title: <Translate id="home.feat.profiling.title">Continuous profiling</Translate>,
    desc: (
      <Translate id="home.feat.profiling.desc">
        Always-on CPU and memory flame graphs from eBPF — find the hot path without a rebuild.
      </Translate>
    ),
  },
  {
    icon: 'ebpf',
    to: '/docs/setup/ebpf-mode',
    title: <Translate id="home.feat.ebpf.title">eBPF auto-instrumentation</Translate>,
    desc: (
      <Translate id="home.feat.ebpf.desc">
        One DaemonSet attaches kernel probes. Zero SDKs, zero sidecars, zero code changes.
      </Translate>
    ),
  },
  {
    icon: 'otel',
    to: '/docs/setup/otel-bridge',
    title: <Translate id="home.feat.otel.title">OpenTelemetry-native</Translate>,
    desc: (
      <Translate id="home.feat.otel.desc">
        Speak OTLP end to end. Bring your existing SDKs and collectors — nothing to rip out.
      </Translate>
    ),
  },
];

export default function FeatureGrid(): React.ReactElement {
  return (
    <div className={styles.featGrid}>
      {FEATURES.map((f, i) => (
        <Link key={i} to={f.to} className={styles.featCard}>
          <span className={styles.featIcon} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              {ICONS[f.icon]}
            </svg>
          </span>
          <h3 className={styles.featTitle}>{f.title}</h3>
          <p className={styles.featDesc}>{f.desc}</p>
          <span className={styles.featLink} aria-hidden="true">
            <Translate id="home.feat.learn">Learn →</Translate>
          </span>
        </Link>
      ))}
    </div>
  );
}
