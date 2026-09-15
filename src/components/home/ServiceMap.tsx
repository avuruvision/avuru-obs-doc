import React, {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {
  edges,
  neighborhood,
  services,
  type Lens,
  type Service,
} from './mapData';
import {t} from './content';
import {track} from './telemetry';
import styles from './ServiceMap.module.css';
import NodeShape from './NodeShape';

type Props = {lens: Lens; onLensChange: (lens: Lens) => void; demoUrl: string};

export default function ServiceMap({
  lens,
  onLensChange,
  demoUrl,
}: Props): React.ReactElement {
  const [selectedId, setSelectedId] = useState('checkout');
  const [fullMap, setFullMap] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const selected = services.find((service) => service.id === selectedId)!;
  const {callers, dependencies} = neighborhood(selectedId);
  const neighbors = new Set([selectedId, ...callers, ...dependencies]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (root.current) observer.observe(root.current);
    return () => {
      media.removeEventListener('change', update);
      observer.disconnect();
    };
  }, []);

  function select(id: string) {
    setSelectedId(id);
    track('map_interaction', {action: 'select_service', service: id, lens});
  }

  function mobilePosition(id: string): [number, number] {
    if (id === selectedId) return [50, 49];
    const index = callers.indexOf(id);
    if (index >= 0) return [(100 * (index + 1)) / (callers.length + 1), 14];
    const dependencyIndex = dependencies.indexOf(id);
    return [(100 * (dependencyIndex + 1)) / (dependencies.length + 1), 84];
  }

  function value(service: Service): string {
    if (lens === 'health') return t(service.status);
    if (lens === 'latency')
      return service.latency === null
        ? t('notObserved')
        : `${service.latency} ms`;
    return service.carbon === null
      ? t('noData')
      : `${service.carbon} g · ${t('estimated')}`;
  }

  const metric = lens === 'carbon' ? selected.carbon : selected.latency;
  const hint =
    lens === 'carbon'
      ? t(metric === null ? 'missingCarbonHint' : 'carbonHint')
      : t(
          selected.status === 'inferred'
            ? 'inferredHint'
            : selected.status === 'degraded'
              ? 'degradedHint'
              : 'healthyHint',
        );

  return (
    <div
      ref={root}
      className={styles.map}
      data-motion={visible && !paused && !reduced}
      data-lens={lens}
    >
      <div className={styles.toolbar}>
        <div className={styles.mapTitle}>
          <span aria-hidden="true">⬡</span>
          <strong>{t('mapTitle')}</strong>
          <span className={styles.sample}>{t('sample')}</span>
        </div>
        <div className={styles.lenses} role="group" aria-label={t('lensLabel')}>
          {(['health', 'latency', 'carbon'] as Lens[]).map((view) => (
            <button
              type="button"
              key={view}
              aria-pressed={view === lens}
              onClick={() => onLensChange(view)}
            >
              {t(view)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.mobileControls}>
        <label>
          {t('allServices')}
          <select
            value={selectedId}
            onChange={(event) => select(event.target.value)}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.id}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          aria-pressed={fullMap}
          onClick={() => setFullMap(!fullMap)}
        >
          {t(fullMap ? 'localMap' : 'fullMap')}
        </button>
      </div>
      <div className={styles.workspace}>
        <div
          className={styles.graphViewport}
          tabIndex={fullMap ? 0 : undefined}
          aria-label={fullMap ? t('swipe') : undefined}
        >
          <div
            className={styles.graph}
            data-full={fullMap}
            role="group"
            aria-label={t('mapTitle')}
          >
            <svg
              className={styles.desktopEdges}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect
                x="20"
                y="3"
                width="62"
                height="94"
                rx="2"
                className={styles.boundary}
              />
              {edges.map(([from, to]) => {
                const a = services.find((service) => service.id === from)!;
                const b = services.find((service) => service.id === to)!;
                const path = `M${a.x} ${a.y} C${(a.x + b.x) / 2} ${a.y} ${(a.x + b.x) / 2} ${b.y} ${b.x} ${b.y}`;
                return (
                  <g
                    key={`${from}-${to}`}
                    data-focused={from === selectedId || to === selectedId}
                  >
                    <path d={path} className={styles.edge} />
                    <path d={path} className={styles.packet} />
                  </g>
                );
              })}
            </svg>
            <svg
              className={styles.mobileEdges}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {[...callers, ...dependencies].map((id) => {
                const [x, y] = mobilePosition(id);
                return (
                  <path
                    key={id}
                    d={`M50 49 L${x} ${y}`}
                    className={styles.edge}
                  />
                );
              })}
            </svg>
            {services.map((service) => {
              const [mx, my] = mobilePosition(service.id);
              return (
                <button
                  type="button"
                  key={service.id}
                  className={styles.node}
                  data-status={service.status}
                  data-neighbor={neighbors.has(service.id)}
                  data-service={service.id}
                  aria-pressed={service.id === selectedId}
                  aria-label={`${service.id} ${value(service)}`}
                  onClick={() => select(service.id)}
                  style={
                    {
                      '--x': `${service.x}%`,
                      '--y': `${service.y}%`,
                      '--mx': `${mx}%`,
                      '--my': `${my}%`,
                    } as React.CSSProperties
                  }
                >
                  <NodeShape inferred={service.status === 'inferred'} />
                  <span className={styles.nodeLabel}>{service.id}</span>
                  <span className={styles.nodeValue}>{value(service)}</span>
                </button>
              );
            })}
          </div>
        </div>
        <aside
          className={styles.readout}
          aria-label={t('selected')}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className={styles.readoutEyebrow}>
            {t('selected')}
            <span>
              {lens === 'carbon'
                ? t(metric === null ? 'noData' : 'estimated')
                : t(selected.status)}
            </span>
          </div>
          <h3>{selectedId}</h3>
          <div
            className={styles.metric}
            data-warning={lens !== 'carbon' && selected.status === 'degraded'}
          >
            {metric ?? '—'}
            {metric !== null && (
              <small>{lens === 'carbon' ? 'gCO₂e' : 'ms'}</small>
            )}
          </div>
          <p className={styles.metricLabel}>
            {t(lens === 'carbon' ? 'carbonMetric' : 'p95')}
          </p>
          <dl>
            <div>
              <dt>{t('callers')}</dt>
              <dd>{callers.join(', ') || t('none')}</dd>
            </div>
            <div>
              <dt>{t('dependencies')}</dt>
              <dd>{dependencies.join(', ') || t('none')}</dd>
            </div>
          </dl>
          <p className={styles.hint}>{hint}</p>
          <Link
            to={demoUrl}
            className={styles.demo}
            onClick={() => track('demo_click', {placement: 'map'})}
          >
            {t('demo')} <span aria-hidden="true">↗</span>
          </Link>
        </aside>
      </div>
      <div className={styles.bottom}>
        <div className={styles.legend}>
          {lens === 'carbon' ? (
            <>
              <span>{t('estimated')} · TDP</span>
              <span>{t('noData')}</span>
              <span>Green · opt-in</span>
            </>
          ) : (
            <>
              <span>
                <i />
                {t('healthy')}
              </span>
              <span>
                <i className={styles.amber} />
                {t('degraded')}
              </span>
              <span>
                <i className={styles.hollow} />
                {t('inferred')}
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          disabled={reduced}
          aria-pressed={paused || reduced}
          onClick={() => setPaused(!paused)}
        >
          {t(reduced ? 'reducedMotion' : paused ? 'resume' : 'pause')}
        </button>
      </div>
    </div>
  );
}
