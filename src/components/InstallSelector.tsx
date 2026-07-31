import React, {useState} from 'react';
import CodeBlock from '@theme/CodeBlock';
import styles from './components.module.css';

type Snippets = Record<string, {lang: string; code: string}>;

const DEFAULT_SNIPPETS: Snippets = {
  Kubernetes: {
    lang: 'bash',
    code: `# Flagship install — the chart is published to GHCR as an OCI artifact,
# eBPF auto-discovers your services. No repo to add.
helm install avuruobs oci://ghcr.io/avuruvision/charts/avuruobs \\
  --version <X.Y.Z> -n avuruobs --create-namespace

# Point apps at the gateway (OTLP):
#   http://avuruobs-gateway:4318   (HTTP)
#   http://avuruobs-gateway:4317   (gRPC)

# Open the UI:
kubectl -n avuruobs port-forward svc/avuruobs-ui 8080:80`,
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
  const tabs = options ?? Object.keys(snippets);
  const [active, setActive] = useState(defaultOption ?? tabs[0]);
  const snippet = snippets[active] ?? Object.values(snippets)[0];

  return (
    <div>
      <div className={styles.tabs} role="tablist">
        {tabs.map((opt) => (
          <button
            key={opt}
            type="button"
            role="tab"
            aria-selected={opt === active}
            className={`${styles.tab} ${opt === active ? styles.tabActive : ''}`}
            onClick={() => setActive(opt)}>
            {opt}
          </button>
        ))}
      </div>
      <div className={styles.tabPanel}>
        <CodeBlock language={snippet.lang}>{snippet.code}</CodeBlock>
      </div>
    </div>
  );
}
