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

function Icon({k}: {k: IconKey}): React.ReactElement {
  return (
    <span className={styles.featIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[k]}
      </svg>
    </span>
  );
}

/* --- mini visuals (decorative) --- */
function MiniWaterfall(): React.ReactElement {
  const rows = [
    {o: 0, w: 30, db: false},
    {o: 8, w: 18, db: true},
    {o: 30, w: 46, db: false},
    {o: 38, w: 26, db: true},
  ];
  return (
    <div className={styles.miniWaterfall} aria-hidden="true">
      {rows.map((r, i) => (
        <span key={i} className={styles.miniTrack}>
          <span
            className={`${styles.miniBar} ${r.db ? styles.miniBarDb : ''}`}
            style={{marginLeft: `${r.o}%`, width: `${r.w}%`}}
          />
        </span>
      ))}
    </div>
  );
}

function MiniFlame(): React.ReactElement {
  const rows = [
    [100],
    [38, 56],
    [20, 14, 30, 28],
    [12, 22, 18],
  ];
  return (
    <div className={styles.miniFlame} aria-hidden="true">
      {rows.map((cells, i) => (
        <div key={i} className={styles.miniFlameRow}>
          {cells.map((w, j) => (
            <span key={j} className={styles.miniFlameCell} style={{width: `${w}%`}} />
          ))}
        </div>
      ))}
    </div>
  );
}

function MiniLogs(): React.ReactElement {
  const lines = [
    {lvl: 'INFO', cls: styles.lvlInfo, w: 70},
    {lvl: 'WARN', cls: styles.lvlWarn, w: 52},
    {lvl: 'INFO', cls: styles.lvlInfo, w: 64},
    {lvl: 'ERR', cls: styles.lvlErr, w: 44},
  ];
  return (
    <div className={styles.miniLogs} aria-hidden="true">
      {lines.map((l, i) => (
        <div key={i} className={styles.miniLog}>
          <span className={`${styles.miniLvl} ${l.cls}`}>{l.lvl}</span>
          <span className={styles.miniLogText} style={{width: `${l.w}%`}} />
        </div>
      ))}
    </div>
  );
}

function MiniSpark(): React.ReactElement {
  const bars = [40, 60, 50, 75, 65, 85, 70, 95, 80, 100];
  return (
    <div className={styles.miniSpark} aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} className={styles.miniSparkBar} style={{height: `${h}%`}} />
      ))}
    </div>
  );
}

interface Feature {
  icon: IconKey;
  area: string;
  to: string;
  title: React.ReactNode;
  desc: React.ReactNode;
  visual?: React.ReactElement;
}

const FEATURES: Feature[] = [
  {
    icon: 'trace',
    area: styles.areaTrace,
    to: '/docs/signals/traces',
    title: <Translate id="home.feat.traces.title">Distributed tracing</Translate>,
    desc: (
      <Translate id="home.feat.traces.desc">
        Span-by-span waterfalls across every service — auto-stitched, no manual context propagation.
      </Translate>
    ),
    visual: <MiniWaterfall />,
  },
  {
    icon: 'logs',
    area: styles.areaLogs,
    to: '/docs/signals/logs',
    title: <Translate id="home.feat.logs.title">Correlated logs</Translate>,
    desc: (
      <Translate id="home.feat.logs.desc">
        Structured logs linked to the trace that produced them.
      </Translate>
    ),
    visual: <MiniLogs />,
  },
  {
    icon: 'metrics',
    area: styles.areaMetrics,
    to: '/docs/signals/metrics',
    title: <Translate id="home.feat.metrics.title">Metrics &amp; dashboards</Translate>,
    desc: (
      <Translate id="home.feat.metrics.desc">
        RED metrics out of the box on one SQL-native engine.
      </Translate>
    ),
    visual: <MiniSpark />,
  },
  {
    icon: 'profile',
    area: styles.areaProfile,
    to: '/docs/signals/profiling',
    title: <Translate id="home.feat.profiling.title">Continuous profiling</Translate>,
    desc: (
      <Translate id="home.feat.profiling.desc">
        Always-on CPU and memory flame graphs from eBPF — find the hot path without a rebuild.
      </Translate>
    ),
    visual: <MiniFlame />,
  },
  {
    icon: 'ebpf',
    area: styles.areaEbpf,
    to: '/docs/setup/ebpf-mode',
    title: <Translate id="home.feat.ebpf.title">eBPF auto-instrumentation</Translate>,
    desc: (
      <Translate id="home.feat.ebpf.desc">
        One DaemonSet attaches kernel probes. Zero SDKs, zero sidecars.
      </Translate>
    ),
  },
  {
    icon: 'otel',
    area: styles.areaOtel,
    to: '/docs/setup/otel-bridge',
    title: <Translate id="home.feat.otel.title">OpenTelemetry-native</Translate>,
    desc: (
      <Translate id="home.feat.otel.desc">
        Speak OTLP end to end. Bring your existing SDKs and collectors.
      </Translate>
    ),
  },
];

export default function FeatureGrid(): React.ReactElement {
  return (
    <div className={styles.bento}>
      {FEATURES.map((f, i) => (
        <Link key={i} to={f.to} className={`${styles.bentoCard} ${f.area}`}>
          <div className={styles.bentoHead}>
            <Icon k={f.icon} />
            <h3 className={styles.bentoTitle}>{f.title}</h3>
          </div>
          <p className={styles.bentoDesc}>{f.desc}</p>
          {f.visual ? <div className={styles.bentoVisual}>{f.visual}</div> : null}
          <span className={styles.featLink} aria-hidden="true">
            <Translate id="home.feat.learn">Learn →</Translate>
          </span>
        </Link>
      ))}
    </div>
  );
}
