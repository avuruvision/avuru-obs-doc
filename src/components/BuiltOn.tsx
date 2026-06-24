import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './components.module.css';

interface Tech {
  name: string;
  glyph: React.ReactElement;
}

/** Simple, monochrome representative glyphs (currentColor) — not official logos. */
const TECHS: Tech[] = [
  {
    name: 'ClickHouse',
    glyph: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <rect x="3" y="4" width="3" height="16" rx="0.5" />
        <rect x="8" y="4" width="3" height="16" rx="0.5" />
        <rect x="13" y="4" width="3" height="16" rx="0.5" />
        <rect x="18.5" y="10" width="2.5" height="4" rx="0.5" />
      </svg>
    ),
  },
  {
    name: 'OpenTelemetry',
    glyph: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    name: 'eBPF',
    glyph: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="3" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5" />
      </svg>
    ),
  },
  {
    name: 'Kubernetes',
    glyph: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.4l8 3.8 2 8.4-5.4 6.6H7.4L2 14.6l2-8.4z" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 4.6V9M19.4 8.2 14.7 10.6M18.2 18.4 13.7 14.2M5.8 18.4l4.5-4.2M4.6 8.2l4.7 2.4" />
      </svg>
    ),
  },
];

/** "Built on" social-proof strip — honest tech credits for an open-source project. */
export default function BuiltOn(): React.ReactElement {
  return (
    <div className={styles.builtOn}>
      <span className={styles.builtOnLabel}>
        <Translate id="home.builton.label">Built on</Translate>
      </span>
      <div className={styles.builtOnRow}>
        {TECHS.map((t) => (
          <span key={t.name} className={styles.builtOnItem}>
            {t.glyph}
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}
