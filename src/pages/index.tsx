import React, {useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {HeroDashboard, BuiltOn} from '@site/src/components';
import styles from './index.module.css';

const INSTALL_CMD =
  'helm install avuruops ./avuruops -n avuruops --create-namespace';

/** schema.org SoftwareApplication for rich search results. */
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Avuru Obs',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Linux, Kubernetes',
  description:
    'Open-source, eBPF-native observability and APM platform — distributed tracing, metrics, logs, continuous profiling and per-service energy & carbon (gCO2e) in one engine. CSRD-ready green IT reporting, zero code changes. A self-hosted alternative to Datadog, New Relic and the Grafana/Prometheus stack.',
  url: 'https://avuruobs.io',
  license: 'https://www.gnu.org/licenses/agpl-3.0.html',
  isAccessibleForFree: true,
  offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'},
};

/** schema.org Organization — enables a richer Google knowledge panel. */
const ORGANIZATION_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Avuru Obs',
  url: 'https://avuruobs.io',
  logo: 'https://avuruobs.io/img/logo.svg',
  sameAs: ['https://github.com/avuruvision'],
};

/** schema.org WebSite — declares the canonical site to search engines. */
const WEBSITE_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Avuru Obs',
  url: 'https://avuruobs.io',
};

function CopyButton({text}: {text: string}): React.ReactElement {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={styles.copyBtn}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}>
      {copied ? (
        <Translate id="home.copied">Copied!</Translate>
      ) : (
        <Translate id="home.copy">Copy</Translate>
      )}
    </button>
  );
}

function InstallCommand(): React.ReactElement {
  return (
    <div className={styles.command}>
      <div className={styles.commandCode}>
        <span className={styles.dollar}>$ </span>
        {INSTALL_CMD}
      </div>
      <CopyButton text={INSTALL_CMD} />
    </div>
  );
}

/** [x, y, radius] star positions — fixed so SSR and client render identically. */
const STARS_A: Array<[number, number, number]> = [
  [60, 80, 1.2], [150, 190, 0.9], [240, 60, 1.4], [90, 330, 1],
  [200, 430, 1.2], [320, 510, 0.9], [420, 90, 1], [520, 40, 1.3],
  [700, 70, 0.9], [860, 120, 1.4], [960, 60, 1], [1050, 150, 1.2],
  [1130, 90, 0.9], [1080, 300, 1.3], [1150, 420, 1], [980, 470, 1.2],
];
const STARS_B: Array<[number, number, number]> = [
  [40, 180, 0.9], [130, 520, 1.1], [300, 320, 0.8], [390, 180, 1.2],
  [480, 140, 0.8], [610, 50, 1.1], [760, 40, 1.2], [820, 200, 0.8],
  [920, 260, 1.1], [1010, 380, 0.9], [1100, 220, 1.1], [1160, 330, 0.8],
  [560, 90, 0.9], [660, 120, 1], [30, 420, 1.2], [250, 240, 0.8],
];

/** Decorative hero background — starfield, orbit trails with a traveling
    signal dot, radiating sonar rings and a horizon arc. Pure inline SVG. */
function HeroArt(): React.ReactElement {
  return (
    <div className={styles.heroArt} aria-hidden="true">
      <svg
        className={styles.heroArtSvg}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        focusable="false">
        <defs>
          <linearGradient id="heroRingGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="0.5" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#818cf8" />
          </linearGradient>
          <radialGradient id="heroHorizonGlow" cx="0.5" cy="1" r="0.9">
            <stop offset="0" stopColor="rgba(52, 211, 153, 0.28)" />
            <stop offset="0.45" stopColor="rgba(34, 211, 238, 0.10)" />
            <stop offset="1" stopColor="rgba(6, 10, 20, 0)" />
          </radialGradient>
        </defs>

        <g className={styles.stars1} fill="#e6edf3">
          {STARS_A.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
        <g className={styles.stars2} fill="#e6edf3">
          {STARS_B.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>

        <rect x="0" y="300" width="1200" height="500" fill="url(#heroHorizonGlow)" />

        {/* orbit trails; the arc rotation lives in the path data so the
            SMIL motion below follows the exact same tilted ellipse */}
        <path
          id="orbit1"
          d="M 83 290 A 260 90 -18 0 1 577 130 A 260 90 -18 0 1 83 290"
          fill="none"
          stroke="#818cf8"
          strokeOpacity="0.16"
          strokeWidth="1"
        />
        <path
          d="M 16 312 A 330 120 -18 0 1 644 108 A 330 120 -18 0 1 16 312"
          fill="none"
          stroke="#818cf8"
          strokeOpacity="0.10"
          strokeWidth="1"
        />
        <g className={styles.orbitDot}>
          <circle r="8" fill="#22d3ee" opacity="0.25" />
          <circle r="3.5" fill="#22d3ee" />
          <animateMotion dur="16s" repeatCount="indefinite" rotate="0">
            <mpath href="#orbit1" />
          </animateMotion>
        </g>

        <circle className={styles.ringWave} cx="600" cy="980" r="560" />
        <circle className={`${styles.ringWave} ${styles.ringW2}`} cx="600" cy="980" r="560" />
        <circle className={`${styles.ringWave} ${styles.ringW3}`} cx="600" cy="980" r="560" />
        <circle className={`${styles.ringWave} ${styles.ringW4}`} cx="600" cy="980" r="560" />

        <circle
          cx="600"
          cy="1180"
          r="430"
          fill="#0a1424"
          stroke="rgba(148, 163, 184, 0.18)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

const TYPE_MS = 55;
const ERASE_MS = 30;
const HOLD_MS = 1700;

/** Rotating "For …" line under the headline. Renders the first word fully on
    the server so the page is meaningful without JS; the loop only starts on
    clients that allow motion. */
function Typewriter(): React.ReactElement {
  const words = React.useMemo(
    () => [
      translate({id: 'home.type.w1', message: 'For Kubernetes.'}),
      translate({id: 'home.type.w2', message: 'For SREs.'}),
      translate({id: 'home.type.w3', message: 'For platform teams.'}),
      translate({id: 'home.type.w4', message: 'For CSRD reporting.'}),
      translate({id: 'home.type.w5', message: 'For green IT.'}),
    ],
    [],
  );
  const [text, setText] = useState(words[0]);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    let word = 0;
    let len = words[0].length;
    let erasing = false;
    let timer: number;
    const tick = () => {
      let delay = erasing ? ERASE_MS : TYPE_MS;
      if (erasing) {
        len -= 1;
        if (len === 0) {
          erasing = false;
          word = (word + 1) % words.length;
        }
      } else {
        len += 1;
        if (len === words[word].length) {
          erasing = true;
          delay = HOLD_MS;
        }
      }
      setText(words[word].slice(0, len));
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [words]);

  return (
    <p className={styles.typeLine}>
      <span aria-hidden="true">
        {text}
        <span className={styles.caret} />
      </span>
      <span className={styles.srOnly}>{words.join(' ')}</span>
    </p>
  );
}

/** Decorative energy-bars visual for the sustainability card: per-service
    bars against a dashed budget line, one service over budget. */
function GreenBars(): React.ReactElement {
  const bars = [58, 82, 44, 96, 66, 38, 74, 52];
  return (
    <svg
      className={styles.greenBars}
      viewBox="0 0 300 120"
      aria-hidden="true"
      focusable="false">
      <defs>
        <linearGradient id="greenBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={12 + i * 36}
          y={110 - h}
          width="22"
          height={h}
          rx="4"
          fill="url(#greenBarGrad)"
          opacity="0.85"
        />
      ))}
      <line
        x1="6"
        y1="30"
        x2="294"
        y2="30"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeDasharray="6 5"
        opacity="0.7"
      />
    </svg>
  );
}

function Hero(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  const demoUrl =
    (siteConfig.customFields?.demoUrl as string) || 'https://demo.avuruobs.io';
  return (
    <header className={styles.hero}>
      <HeroArt />

      <div className={styles.heroInner}>
        <Link className={styles.pill} to="/docs/signals/green">
          <span className={styles.pillTag}>New</span>
          <Translate id="home.pill">Energy &amp; carbon per service — zero code</Translate>
          <span className={styles.pillArrow}>→</span>
        </Link>

        <h1 className={styles.title}>
          <Translate id="home.title.lead">Observe everything.</Translate>{' '}
          <span className={styles.gradText}>
            <Translate id="home.title.grad">Waste nothing.</Translate>
          </span>
        </h1>
        <Typewriter />
        <p className={styles.subtitle}>
          <Translate id="home.subtitle">
            Traces, metrics, logs, continuous profiling — and energy &amp;
            carbon per service. One install, one engine, zero code changes.
          </Translate>
        </p>

        <div className={styles.ctaRow}>
          <Link className={`button button--lg ${styles.btnGrad}`} to={demoUrl}>
            <Translate id="home.cta.demo">Live Demo</Translate>
          </Link>
          <Link
            className={`button button--lg ${styles.btnOutline}`}
            to="/docs/getting-started/30-seconds">
            <Translate id="home.cta.guide">30-second guide</Translate>
          </Link>
        </div>
      </div>

      <div className={styles.heroLogos}>
        <BuiltOn />
      </div>
    </header>
  );
}

export default function Home(): React.ReactElement {
  return (
    <Layout
      title={translate({id: 'home.meta.title', message: 'Open-Source Observability & APM'})}
      description={translate({
        id: 'home.meta.desc',
        message:
          'Avuru Obs is an open-source, eBPF-native observability platform — distributed tracing, metrics, logs, continuous profiling and per-service energy & carbon (gCO2e) in one engine. CSRD-ready green IT reporting, zero code changes. A self-hosted alternative to Datadog, New Relic and the Grafana stack.',
      })}>
      <Head>
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
        <script type="application/ld+json">{JSON.stringify(ORGANIZATION_DATA)}</script>
        <script type="application/ld+json">{JSON.stringify(WEBSITE_DATA)}</script>
      </Head>
      <Hero />

      <section className={styles.statement}>
        <h2 className={styles.statementTitle}>
          <Translate id="home.statement.title">
            Every watt, every request, accounted for.
          </Translate>
        </h2>
        <p className={styles.statementLede}>
          <Translate id="home.statement.lede">
            Per-service energy and carbon alongside your traces — CSRD-ready
            exports, zero code changes, and no data ever leaves your cluster.
          </Translate>
        </p>
      </section>

      <section className={styles.pillars}>
        <div className={styles.pillar}>
          <h3 className={styles.pillarTitle}>
            <Translate id="home.pillar.1.t">Every signal</Translate>
          </h3>
          <p className={styles.pillarDesc}>
            <Translate id="home.pillar.1.d">
              Traces, logs, metrics and continuous profiling in one engine —
              correlated out of the box.
            </Translate>
          </p>
        </div>
        <div className={styles.pillar}>
          <h3 className={styles.pillarTitle}>
            <Translate id="home.pillar.2.t">Energy &amp; carbon</Translate>
          </h3>
          <p className={styles.pillarDesc}>
            <Translate id="home.pillar.2.d">
              Wh and gCO₂e per service, with carbon budgets and a CSRD-ready
              export.
            </Translate>
          </p>
        </div>
        <div className={styles.pillar}>
          <h3 className={styles.pillarTitle}>
            <Translate id="home.pillar.3.t">Zero code changes</Translate>
          </h3>
          <p className={styles.pillarDesc}>
            <Translate id="home.pillar.3.d">
              eBPF auto-instrumentation — no SDKs, no sidecars, no redeploys.
            </Translate>
          </p>
        </div>
        <div className={styles.pillar}>
          <h3 className={styles.pillarTitle}>
            <Translate id="home.pillar.4.t">Self-hosted</Translate>
          </h3>
          <p className={styles.pillarDesc}>
            <Translate id="home.pillar.4.d">
              AGPL-3.0 on your own cluster — telemetry never leaves your
              infrastructure.
            </Translate>
          </p>
        </div>
      </section>

      <section className={styles.useCases}>
        <div className={styles.useCase}>
          <div className={styles.cardShot}>
            <HeroDashboard />
          </div>
          <h3 className={styles.useCaseTitle}>
            <Translate id="home.usecase.eng.title">For engineering teams</Translate>
          </h3>
          <p className={styles.useCaseDesc}>
            <Translate id="home.usecase.eng.desc">
              Install the chart and the service map lights up — traces, logs,
              metrics and profiles correlated in one UI. OpenTelemetry in and
              out.
            </Translate>
          </p>
          <Link className={styles.useCaseLink} to="/docs/getting-started/30-seconds">
            <Translate id="home.usecase.eng.cta">30-second guide →</Translate>
          </Link>
        </div>
        <div className={styles.useCase}>
          <div className={styles.cardShot}>
            <GreenBars />
          </div>
          <h3 className={styles.useCaseTitle}>
            <Translate id="home.usecase.green.title">
              For sustainability &amp; finance
            </Translate>
          </h3>
          <p className={styles.useCaseDesc}>
            <Translate id="home.usecase.green.desc">
              Per-service energy and carbon with budgets and an auditable CSRD
              export — computed on your cluster, nothing leaves it.
            </Translate>
          </p>
          <Link className={styles.useCaseLink} to="/docs/signals/green">
            <Translate id="home.usecase.green.cta">Explore the green module →</Translate>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>
            <Translate id="home.final.title">Ship it in 30 seconds</Translate>
          </h2>
          <p className={styles.ctaLede}>
            <Translate id="home.final.lede">
              One Helm chart and the service map lights up. No agents to wire, no
              code to change.
            </Translate>
          </p>
          <InstallCommand />
          <div className={styles.ctaRow}>
            <Link
              className={`button button--lg ${styles.btnGrad}`}
              to="/docs/getting-started/30-seconds">
              <Translate id="home.cta.guide">30-second guide</Translate>
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              <Translate id="home.cta.docs">Read the docs</Translate>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
