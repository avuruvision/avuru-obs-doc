import {translate} from '@docusaurus/Translate';

// Keep atlas.* translations in i18n/fr/code.json alongside these default messages.
const messages = {
  title: 'Open-Source Kubernetes Observability',
  description:
    'Map Kubernetes services with eBPF. Explore traces, metrics and logs in one self-hosted observability platform. Try the Avuru Obs demo.',
  socialAlt:
    'Avuru Obs — Nothing runs alone. Explore your Kubernetes service dependencies.',
  eyebrow: 'Open-source Kubernetes observability',
  headline: 'Nothing runs',
  headlineAccent: 'alone.',
  intro:
    'Discover your service dependencies with eBPF. Investigate traces, metrics and logs in one self-hosted platform, with no application changes for supported workloads.',
  explore: 'Explore the service map',
  install: 'Install Avuru Obs',
  demo: 'Open live demo',
  mapHeading: 'Explore your Kubernetes service dependencies',
  mapTitle: 'Service map',
  sample: 'Example / shop',
  health: 'Health',
  latency: 'Latency',
  carbon: 'Carbon',
  lensLabel: 'Choose a map view',
  healthy: 'Healthy',
  degraded: 'Degraded',
  inferred: 'Inferred dependency',
  estimated: 'Estimated',
  noData: 'No data',
  notObserved: 'Not observed',
  none: 'None observed',
  selected: 'Selected service',
  callers: 'Called by',
  dependencies: 'Depends on',
  p95: 'Service p95 latency',
  carbonMetric: 'Estimated carbon · example 1 h window',
  degradedHint:
    'Elevated latency. Open a trace to see where one request spent its time.',
  healthyHint:
    'Follow this service’s callers and dependencies, then explore an individual request.',
  inferredHint:
    'Inferred from caller exit spans. This dependency sent no service spans; its own p95 is not reported.',
  carbonHint:
    'Illustrative TDP estimate. The green module is opt-in; measured and estimated energy stay separate.',
  missingCarbonHint:
    'No energy attribution for this dependency. Missing data is not zero.',
  mapCaption:
    'Illustrative data · select a service to explore its neighbourhood',
  mapDocs: 'How the map is built',
  pause: 'Pause motion',
  resume: 'Resume motion',
  reducedMotion: 'Reduced motion',
  allServices: 'Choose a service',
  fullMap: 'Show full map',
  localMap: 'Show neighbourhood',
  swipe: 'Scroll the map horizontally to reach every service.',
  bridge1: 'Discover supported traffic',
  bridge2: 'Keep your instrumentation',
  bridge3: 'Your infrastructure',
  questionsEyebrow: 'Same system. A different question.',
  questionsTitle: 'Change the lens. Keep the context.',
  questionsIntro:
    'Start with a service. Understand what surrounds it, follow a slow request, then explore its footprint.',
  q1: 'What depends on this?',
  q1Body:
    'See callers, downstream services and inferred datastores. Discover the connections worth investigating.',
  q1Action: 'Explore dependencies',
  q2: 'Which path is slow?',
  q2Body:
    'Spot elevated service latency. Open a trace to distinguish a slow dependency from time spent in the application.',
  q2Action: 'Explore latency',
  q3: 'What is its footprint?',
  q3Body:
    'Enable the green module to explore carbon per service. Estimates carry their label; missing data stays missing.',
  q3Action: 'Explore carbon',
  signalsEyebrow: 'From the big picture to one request',
  signalsTitle: 'Follow a request across traces, metrics and logs.',
  signalsIntro:
    'A map shows the relationship. The underlying signals help you investigate it. One engine, one ClickHouse store.',
  trace: 'Trace',
  logs: 'Logs',
  metrics: 'Metrics',
  traceBody:
    'Find the span that accounts for the delay. Compare it with another request.',
  logsBody:
    'Read the events attached to the request when your logs carry its trace ID.',
  metricsBody:
    'Check rate, errors and duration over time before deciding whether this request is typical.',
  incidentGuide: 'Investigate a slow checkout',
  illustrativeTrace: 'Illustrative request · 842 ms',
  adoptionEyebrow: 'Make the first connection',
  adoptionTitle: 'Go from cluster to connected.',
  adoptionIntro:
    'Start where you are. Discover supported traffic with eBPF, or bring the telemetry you already collect.',
  installStep: 'One place to start.',
  installStepBody:
    'The Helm chart brings the sensor, gateway, hub, UI and ClickHouse together.',
  discoverStep: 'Let the calls draw the map.',
  discoverStepBody:
    'eBPF observes supported traffic while your applications keep running. Check kernel and protocol support before installing.',
  otelStep: 'Bring your existing OpenTelemetry data.',
  otelStepBody:
    'Keep your SDKs and collectors. Add an OTLP destination, validate one service, then expand at your own pace.',
  requirements: 'Installation requirements',
  otelGuide: 'OTLP adoption & migration',
  modulesEyebrow: 'Go deeper, when you need to',
  modulesTitle: 'A connected view. Room to grow.',
  modulesIntro:
    'Mesh, cost, green, AI and MCP are opt-in. Enable what your team needs, with the collection and access controls to match.',
  modulesAction: 'Explore the modules',
  meshTitle: 'Inside the service mesh',
  meshBody:
    'Proxy health, workload configuration and declared versus observed traffic.',
  costTitle: 'Capacity worth investigating',
  costBody:
    'Reserved CPU and memory alongside the observed peak. An investigation signal, not an automatic resize.',
  greenTitle: 'Energy with its provenance',
  greenBody:
    'Per-service energy and carbon, with measured and estimated values clearly distinguished.',
  aiTitle: 'Model calls with an owner',
  aiBody:
    'Tokens, latency and agent paths from the GenAI spans your applications send.',
  trustEyebrow: 'Open by design',
  trustTitle: 'Run observability on your own infrastructure.',
  trustBody:
    'AGPL-3.0, with OIDC SSO and project roles in the open edition. You operate the storage and decide which integrations can send data elsewhere.',
  architecture: 'Explore the architecture',
  releases: 'Published releases',
  source: 'Read the source',
  storeLabel: 'Telemetry storage',
  hubLabel: 'Queries & configuration',
  faqTitle: 'A few things before you start.',
  faq1: 'Do I need to change my application code?',
  faq1Body:
    'eBPF discovers supported workloads without application changes. Coverage depends on your kernel, runtime and protocols. Use OpenTelemetry when you need custom spans or signals outside that coverage.',
  faq2: 'Can I keep my existing collectors?',
  faq2Body:
    'Yes. Send OTLP over HTTP or gRPC to the gateway. During an evaluation, dual-export and check service identity, ingest keys and signal coverage before switching over.',
  faq3: 'Is every module enabled by default?',
  faq3Body:
    'No. Green, cost, mesh, AI and MCP are opt-in. CPU profiling is experimental and opt-in too. The module guide lists prerequisites and collection controls.',
  faq4: 'Does my telemetry stay on my infrastructure?',
  faq4Body:
    'Storage is self-hosted. Outgoing exporters, webhooks or an assistant connected through MCP can transmit selected data to destinations you configure. Review these integrations against your data policy.',
  endEyebrow: 'Your system has a shape',
  endTitle: 'Come see it.',
  endBody:
    'Explore the demo, or install the published chart on your cluster. Start with one service and follow its connections.',
  quickstart: 'Follow the installation guide',
  copy: 'Copy command',
  copied: 'Command copied',
  copyFailed: 'Copy unavailable. Select the command and copy it manually.',
  installNote:
    'Check prerequisites and choose a published chart version in the guide. Startup time depends on your cluster.',
} as const;

export function t(key: keyof typeof messages): string {
  return translate({id: `atlas.${key}`, message: messages[key]});
}
