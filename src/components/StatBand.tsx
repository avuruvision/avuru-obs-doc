import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './components.module.css';

const REPO = 'avuruvision/avuru-obs';

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

/**
 * Social-proof band: three static product claims plus one live GitHub stat.
 * Never blocks render — shows a fallback star glyph and upgrades on success.
 */
export default function StatBand(): React.ReactElement {
  const [stars, setStars] = useState<string>('★');

  useEffect(() => {
    let alive = true;
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data && typeof data.stargazers_count === 'number') {
          setStars(fmt(data.stargazers_count));
        }
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className={styles.statBand}>
      <div className={styles.stat}>
        <div className={styles.statValue}>4</div>
        <div className={styles.statLabel}>
          <Translate id="home.stat.signals">signals, one engine</Translate>
        </div>
      </div>
      <div className={styles.stat}>
        <div className={styles.statValue}>0</div>
        <div className={styles.statLabel}>
          <Translate id="home.stat.code">code changes</Translate>
        </div>
      </div>
      <div className={styles.stat}>
        <div className={styles.statValue}>0</div>
        <div className={styles.statLabel}>
          <Translate id="home.stat.sidecars">sidecars to run</Translate>
        </div>
      </div>
      <Link className={styles.stat} to={`https://github.com/${REPO}/stargazers`}>
        <div className={styles.statValue}>{stars}</div>
        <div className={styles.statLabel}>
          <Translate id="home.stat.stars">GitHub stars</Translate>
        </div>
      </Link>
    </div>
  );
}
