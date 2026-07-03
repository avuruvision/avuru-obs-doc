import React from 'react';
import styles from './ArchitectureTopology.module.css';

interface BoxProps {
  x: number;
  y: number;
  title: string;
  sub: string;
  store?: boolean;
}

const W = 190;
const H = 72;
const SW = 178;
const SH = 96;

function Box({x, y, title, sub, store}: BoxProps): React.ReactElement {
  const w = store ? SW : W;
  const h = store ? SH : H;
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={11}
        className={`${styles.box} ${store ? styles.store : ''}`}
      />
      <text x={cx} y={y + h / 2 - 4} textAnchor="middle" className={styles.title}>
        {title}
      </text>
      <text x={cx} y={y + h / 2 + 15} textAnchor="middle" className={styles.sub}>
        {sub}
      </text>
    </g>
  );
}

/**
 * Brand-themed static topology diagram for the architecture page (and homepage).
 * Telemetry flows top-left → right into ClickHouse; queries flow bottom-left → hub
 * → ClickHouse; the hub pushes config back over OpAMP.
 */
export default function ArchitectureTopology(): React.ReactElement {
  return (
    <div className={styles.wrap}>
      <svg
        viewBox="0 0 780 380"
        className={styles.svg}
        role="img"
        aria-labelledby="archTopoTitle archTopoDesc">
        <title id="archTopoTitle">avuru obs component topology</title>
        <desc id="archTopoDesc">
          The sensor exports telemetry over OTLP to the gateway, which writes all
          signals to ClickHouse. The hub reads ClickHouse over SQL and serves the
          UI over REST and WebSocket, and pushes configuration back over OpAMP.
        </desc>

        <defs>
          <marker
            id="archArrow"
            markerWidth="9"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto"
            markerUnits="userSpaceOnUse">
            <path d="M0,0 L7,3 L0,6 Z" className={styles.arrowFill} />
          </marker>
          <marker
            id="archArrowA"
            markerWidth="9"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto"
            markerUnits="userSpaceOnUse">
            <path d="M0,0 L7,3 L0,6 Z" className={styles.arrowFillAccent} />
          </marker>
        </defs>

        {/* Edges (drawn first, under the boxes) */}
        {/* sensor → gateway : telemetry (accent) */}
        <line
          x1="226" y1="92" x2="298" y2="92"
          className={`${styles.edge} ${styles.accent}`}
          markerEnd="url(#archArrowA)"
        />
        <text x="262" y="83" textAnchor="middle" className={styles.edgeLabel}>
          OTLP
        </text>

        {/* gateway → ClickHouse : write (accent) */}
        <path
          d="M490,96 C536,110 540,150 564,172"
          className={`${styles.edge} ${styles.accent}`}
          markerEnd="url(#archArrowA)"
        />
        <text x="547" y="120" textAnchor="middle" className={styles.edgeLabel}>
          write
        </text>

        {/* ui → hub : REST / WS */}
        <line
          x1="226" y1="298" x2="298" y2="298"
          className={styles.edge}
          markerEnd="url(#archArrow)"
        />
        <text x="262" y="289" textAnchor="middle" className={styles.edgeLabel}>
          REST / WS
        </text>

        {/* hub → ClickHouse : SQL query */}
        <path
          d="M490,294 C536,282 540,244 564,222"
          className={styles.edge}
          markerEnd="url(#archArrow)"
        />
        <text x="547" y="276" textAnchor="middle" className={styles.edgeLabel}>
          SQL
        </text>

        {/* hub → gateway : OpAMP config plane (dashed, upward) */}
        <line
          x1="360" y1="260" x2="360" y2="132"
          className={`${styles.edge} ${styles.dashed}`}
          markerEnd="url(#archArrow)"
        />
        <text x="368" y="200" className={styles.edgeLabel}>
          OpAMP
        </text>

        {/* Nodes */}
        <Box x={36} y={56} title="sensor" sub="eBPF DaemonSet" />
        <Box x={300} y={56} title="gateway" sub="OTel Collector" />
        <Box x={566} y={148} title="ClickHouse" sub="one engine · all signals" store />
        <Box x={300} y={262} title="hub" sub="Go · REST/WS · OpAMP" />
        <Box x={36} y={262} title="ui" sub="static SPA" />
      </svg>
    </div>
  );
}
