import React from 'react';
import {translate} from '@docusaurus/Translate';
import styles from './components.module.css';

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
      <div className={`${styles.kpiValue} ${styles[`tone_${tone}`]}`}>
        {value}
        {unit ? <span className={styles.kpiUnit}>{unit}</span> : null}
      </div>
      <div className={styles.spark} aria-hidden="true">
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
 * dashboard (KPIs, service map, trace waterfall) entirely in CSS/SVG so there is
 * no screenshot to maintain and it themes with the brand tokens. The numbers are
 * illustrative — the whole panel is exposed to assistive tech as one summary.
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

      <div className={styles.dashBody} aria-hidden="true">
        <div className={styles.kpiRow}>
          <Kpi label="Requests / min" value="11.6" unit="k" spark={[4, 6, 5, 8, 7, 9, 11, 12]} />
          <Kpi label="p95 latency" value="33" unit="ms" spark={[9, 7, 8, 6, 5, 6, 4, 5]} tone="ok" />
          <Kpi label="Error rate" value="0.20" unit="%" spark={[2, 1, 3, 1, 2, 1, 1, 1]} tone="warn" />
          <Kpi label="SLA" value="99.9" unit="%" spark={[10, 10, 9, 10, 10, 10, 9, 10]} tone="ok" />
        </div>

        <div className={styles.dashGrid}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>Service map</div>
            <svg
              className={styles.map}
              viewBox="0 0 460 150"
              preserveAspectRatio="xMidYMid meet">
              <defs>
                <marker
                  id="avuruArrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse">
                  <path d="M0 0L10 5L0 10z" className={styles.mapArrow} />
                </marker>
              </defs>
              {/* edges */}
              <path className={styles.edge} d="M98 75 C125 75 128 33 150 33" markerEnd="url(#avuruArrow)" />
              <path className={styles.edge} d="M98 75 C125 75 128 117 150 117" markerEnd="url(#avuruArrow)" />
              <path className={styles.edge} d="M236 33 L298 33" markerEnd="url(#avuruArrow)" />
              <path className={styles.edge} d="M236 117 L298 117" markerEnd="url(#avuruArrow)" />
              {/* nodes */}
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
    </figure>
  );
}
