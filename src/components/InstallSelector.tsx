import React, {useId, useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import {translate} from '@docusaurus/Translate';
import styles from './components.module.css';
import {HELM_INSTALL, UI_PORT_FORWARD} from './installCommands';

type Snippets = Record<string, {lang: string; code: string}>;

const DEFAULT_SNIPPETS: Snippets = {
  Kubernetes: {
    lang: 'bash',
    code: `# Flagship install — the chart is published to GHCR as an OCI artifact,
# eBPF auto-discovers your services. No repo to add.
${HELM_INSTALL}

# Point apps at the gateway (OTLP):
#   http://avuruobs-gateway:4318   (HTTP)
#   http://avuruobs-gateway:4317   (gRPC)

# Open the UI:
${UI_PORT_FORWARD}`,
  },
  Docker: {
    lang: 'bash',
    code: `# Laptop eval — released images, no checkout.
curl -fsSLO https://raw.githubusercontent.com/avuruvision/avuru-obs/main/deploy/compose/docker-compose.release.yaml
docker compose -f docker-compose.release.yaml up --wait

# UI: http://localhost:3001   ·   OTLP: localhost:4318`,
  },
  VM: {
    lang: 'bash',
    code: `# Bare-metal / VM — run the gateway and point your OTLP exporters at it.
# (See Setup → VM & bare-metal for the systemd unit.)
export OTEL_EXPORTER_OTLP_ENDPOINT=http://avuru-gateway:4318`,
  },
};

export interface InstallSelectorProps {
  options?: string[];
  defaultOption?: string;
  snippets?: Snippets;
}

export default function InstallSelector({
  options,
  defaultOption,
  snippets = DEFAULT_SNIPPETS,
}: InstallSelectorProps): React.ReactElement {
  const id = useId();
  const tabs = options ?? Object.keys(snippets);
  const [active, setActive] = useState(defaultOption ?? tabs[0]);
  const snippet = snippets[active] ?? Object.values(snippets)[0];

  return (
    <div>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label={translate({
          id: 'install.platform',
          message: 'Installation platform',
        })}
        onKeyDown={(event) => {
          const index = tabs.indexOf(active);
          const next =
            event.key === 'ArrowRight'
              ? (index + 1) % tabs.length
              : event.key === 'ArrowLeft'
                ? (index + tabs.length - 1) % tabs.length
                : event.key === 'Home'
                  ? 0
                  : event.key === 'End'
                    ? tabs.length - 1
                    : null;
          if (next === null) return;
          event.preventDefault();
          setActive(tabs[next]);
          event.currentTarget
            .querySelectorAll<HTMLButtonElement>('[role="tab"]')
            [next]?.focus();
        }}
      >
        {tabs.map((opt) => (
          <button
            key={opt}
            type="button"
            role="tab"
            id={`${id}-${opt}`}
            aria-controls={`${id}-panel`}
            tabIndex={opt === active ? 0 : -1}
            aria-selected={opt === active}
            className={`${styles.tab} ${opt === active ? styles.tabActive : ''}`}
            onClick={() => setActive(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <div
        className={styles.tabPanel}
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${active}`}
        tabIndex={0}
      >
        <CodeBlock language={snippet.lang}>{snippet.code}</CodeBlock>
      </div>
    </div>
  );
}
