import React from 'react';
import {translate} from '@docusaurus/Translate';
import styles from './components.module.css';

/** Tiny sidebar icons (14×14, currentColor). */
const RAIL_ICONS: Record<string, React.ReactElement> = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9v11h14V9" />,
  services: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  traces: (
    <>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
  logs: (
    <>
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
      <path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
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
  profiles: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
};

function RailItem({icon, label, active}: {icon: string; label: string; active?: boolean}): React.ReactElement {
  return (
    <div className={`${styles.railItem} ${active ? styles.railActive : ''}`}>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {RAIL_ICONS[icon]}
      </svg>
      <span>{label}</span>
    </div>
  );
}

/** A KPI tile with a tiny static sparkline. */
function Kpi({
  label,
  value,
  unit,
  spark,
  tone = 'accent',
}: {
  label: string;
  value: string;
  unit?: string;
  spark: number[];
  tone?: 'accent' | 'ok' | 'warn';
}): React.ReactElement {
  const max = Math.max(...spark, 1);
  return (
    <div className={styles.kpi}>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={`${styles.kpiValue} ${styles.gradNum}`}>
        {value}
        {unit ? <span className={styles.kpiUnit}>{unit}</span> : null}
      </div>
      <div className={`${styles.spark} ${styles[`tone_${tone}`]}`} aria-hidden="true">
        {spark.map((h, i) => (
          <span
            key={i}
            className={styles.sparkBar}
            style={{height: `${Math.round((h / max) * 100)}%`}}
          />
        ))}
      </div>
    </div>
  );
}

/** A single span row in the trace waterfall. */
function Span({
  name,
  offset,
  width,
  dur,
  depth = 0,
  db,
}: {
  name: string;
  offset: number;
  width: number;
  dur: string;
  depth?: number;
  db?: boolean;
}): React.ReactElement {
  return (
    <div className={styles.spanRow}>
      <span className={styles.spanName} style={{paddingLeft: `${depth * 14}px`}}>
        {name}
      </span>
      <span className={styles.spanTrack}>
        <span
          className={`${styles.spanBar} ${db ? styles.spanBarDb : ''}`}
          style={{marginLeft: `${offset}%`, width: `${width}%`}}
        />
      </span>
      <span className={styles.spanDur}>{dur}</span>
    </div>
  );
}

/**
 * Static, SSR-safe "product shot" for the hero. Renders a faux observability
 * app — sidebar rail, KPIs, service map and a trace waterfall — entirely in
 * CSS/SVG so there is no screenshot to maintain and it themes with brand tokens.
 * Numbers are illustrative; the whole panel is one summary to assistive tech.
 */
export default function HeroDashboard(): React.ReactElement {
  return (
    <figure
      className={styles.dash}
      role="img"
      aria-label={translate({
        id: 'home.dash.alt',
        message:
          'Avuru Obs dashboard preview: service map, request metrics and a distributed trace waterfall.',
      })}>
      <div className={styles.dashBar} aria-hidden="true">
        <span className={`${styles.dot} ${styles.dotR}`} />
        <span className={`${styles.dot} ${styles.dotY}`} />
        <span className={`${styles.dot} ${styles.dotG}`} />
        <span className={styles.dashUrl}>app.avuruobs.io · overview</span>
        <span className={styles.livePill}>
          <span className={styles.liveDot} />
          live
        </span>
      </div>

      <div className={styles.dashShell} aria-hidden="true">
        <nav className={styles.rail}>
          <div className={styles.railBrand}>
            <span className={styles.railLogo} />
            avuru
          </div>
          <RailItem icon="home" label="Home" />
          <RailItem icon="services" label="Services" />
          <RailItem icon="traces" label="Traces" active />
          <RailItem icon="logs" label="Logs" />
          <RailItem icon="metrics" label="Metrics" />
          <RailItem icon="profiles" label="Profiles" />
        </nav>

        <div className={styles.dashBody}>
          <div className={styles.kpiRow}>
            <Kpi label="Requests / min" value="11.6" unit="k" spark={[4, 6, 5, 8, 7, 9, 11, 12]} />
            <Kpi label="p95 latency" value="33" unit="ms" spark={[9, 7, 8, 6, 5, 6, 4, 5]} tone="ok" />
            <Kpi label="Error rate" value="0.20" unit="%" spark={[2, 1, 3, 1, 2, 1, 1, 1]} tone="warn" />
            <Kpi label="SLA" value="99.9" unit="%" spark={[10, 10, 9, 10, 10, 10, 9, 10]} tone="ok" />
          </div>

          <div className={styles.dashGrid}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>Service map</div>
              <svg className={styles.map} viewBox="0 0 460 150" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <marker id="avuruArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0 0L10 5L0 10z" className={styles.mapArrow} />
                  </marker>
                </defs>
                <path className={styles.edge} d="M98 75 C125 75 128 33 150 33" markerEnd="url(#avuruArrow)" />
                <path className={styles.edge} d="M98 75 C125 75 128 117 150 117" markerEnd="url(#avuruArrow)" />
                <path className={styles.edge} d="M236 33 L298 33" markerEnd="url(#avuruArrow)" />
                <path className={styles.edge} d="M236 117 L298 117" markerEnd="url(#avuruArrow)" />
                <g>
                  <rect className={styles.mapNode} x="12" y="60" width="86" height="30" rx="8" />
                  <circle className={styles.mapDot} cx="26" cy="75" r="3" />
                  <text className={styles.mapText} x="38" y="79">frontend</text>
                </g>
                <g>
                  <rect className={styles.mapNode} x="150" y="18" width="86" height="30" rx="8" />
                  <circle className={styles.mapDot} cx="164" cy="33" r="3" />
                  <text className={styles.mapText} x="176" y="37">cart</text>
                </g>
                <g>
                  <rect className={styles.mapNode} x="150" y="102" width="86" height="30" rx="8" />
                  <circle className={styles.mapDot} cx="164" cy="117" r="3" />
                  <text className={styles.mapText} x="176" y="121">payment</text>
                </g>
                <g>
                  <rect className={`${styles.mapNode} ${styles.mapStore}`} x="300" y="18" width="86" height="30" rx="8" />
                  <circle className={styles.mapDot} cx="314" cy="33" r="3" />
                  <text className={styles.mapText} x="326" y="37">postgres</text>
                </g>
                <g>
                  <rect className={`${styles.mapNode} ${styles.mapStore}`} x="300" y="102" width="86" height="30" rx="8" />
                  <circle className={styles.mapDot} cx="314" cy="117" r="3" />
                  <text className={styles.mapText} x="326" y="121">redis</text>
                </g>
              </svg>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>Trace · checkout</div>
              <div className={styles.waterfall}>
                <Span name="GET /api/cart" offset={0} width={26} dur="28ms" />
                <Span name="SELECT items" offset={6} width={16} dur="12ms" depth={1} db />
                <Span name="POST /api/checkout" offset={28} width={44} dur="41ms" />
                <Span name="payment.authorize" offset={34} width={24} dur="19ms" depth={1} />
                <Span name="INSERT order" offset={60} width={12} dur="7ms" depth={1} db />
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
