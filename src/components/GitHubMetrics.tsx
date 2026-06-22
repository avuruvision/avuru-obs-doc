import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './components.module.css';

const REPO = 'avuruvision/avuru-obs';
const API = `https://api.github.com/repos/${REPO}`;

interface Metrics {
  stars: string;
  contributors: string;
  release: string;
}

const FALLBACK: Metrics = {stars: '★', contributors: '—', release: 'unreleased'};

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

/**
 * Live "trusted by / it's alive" banner. Fetches public repo metrics client-side
 * (unauthenticated, rate-limited but fine for docs traffic). Never blocks render:
 * shows fallbacks first, upgrades on success, keeps fallbacks on failure.
 */
export default function GitHubMetrics(): React.ReactElement {
  const [m, setM] = useState<Metrics>(FALLBACK);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const [repo, contribs, release] = await Promise.allSettled([
          fetch(API).then((r) => r.json()),
          fetch(`${API}/contributors?per_page=100&anon=1`).then((r) => r.json()),
          fetch(`${API}/releases/latest`).then((r) => (r.ok ? r.json() : null)),
        ]);
        if (!alive) return;
        const next: Metrics = {...FALLBACK};
        if (repo.status === 'fulfilled' && typeof repo.value?.stargazers_count === 'number') {
          next.stars = fmt(repo.value.stargazers_count);
        }
        if (contribs.status === 'fulfilled' && Array.isArray(contribs.value)) {
          next.contributors = `${contribs.value.length}`;
        }
        if (release.status === 'fulfilled' && release.value?.tag_name) {
          next.release = release.value.tag_name;
        }
        setM(next);
      } catch {
        /* keep fallbacks */
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className={styles.metrics}>
      <Link className={styles.metric} to={`https://github.com/${REPO}/stargazers`}>
        <div className={styles.metricValue}>{m.stars}</div>
        <div className={styles.metricLabel}>
          <Translate id="metrics.stars">GitHub stars</Translate>
        </div>
      </Link>
      <Link className={styles.metric} to={`https://github.com/${REPO}/graphs/contributors`}>
        <div className={styles.metricValue}>{m.contributors}</div>
        <div className={styles.metricLabel}>
          <Translate id="metrics.contributors">Contributors</Translate>
        </div>
      </Link>
      <Link className={styles.metric} to={`https://github.com/${REPO}/releases`}>
        <div className={styles.metricValue}>{m.release}</div>
        <div className={styles.metricLabel}>
          <Translate id="metrics.release">Latest release</Translate>
        </div>
      </Link>
    </div>
  );
}
