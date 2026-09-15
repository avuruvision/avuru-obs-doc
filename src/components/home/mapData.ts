export type Lens = 'health' | 'latency' | 'carbon';
export type Service = {
  id: string;
  x: number;
  y: number;
  latency: number | null;
  carbon: number | null;
  status: 'healthy' | 'degraded' | 'inferred';
};

/** Fixed, illustrative values. Missing dependency measurements are not zero. */
export const services: Service[] = [
  {id: 'gateway', x: 10, y: 46, latency: 24, carbon: 1.2, status: 'healthy'},
  {id: 'frontend', x: 30, y: 46, latency: 48, carbon: 2.8, status: 'healthy'},
  {id: 'checkout', x: 51, y: 25, latency: 842, carbon: 4.6, status: 'degraded'},
  {
    id: 'recommendation',
    x: 51,
    y: 73,
    latency: 61,
    carbon: 7.2,
    status: 'healthy',
  },
  {id: 'payment', x: 72, y: 16, latency: 790, carbon: 3.1, status: 'degraded'},
  {id: 'catalog', x: 72, y: 57, latency: 32, carbon: 1.8, status: 'healthy'},
  {
    id: 'postgres',
    x: 92,
    y: 16,
    latency: null,
    carbon: null,
    status: 'inferred',
  },
  {id: 'redis', x: 92, y: 57, latency: null, carbon: null, status: 'inferred'},
  {id: 'worker', x: 72, y: 87, latency: 19, carbon: 0.8, status: 'healthy'},
];

export const edges: [string, string][] = [
  ['gateway', 'frontend'],
  ['frontend', 'checkout'],
  ['frontend', 'recommendation'],
  ['checkout', 'payment'],
  ['checkout', 'redis'],
  ['payment', 'postgres'],
  ['recommendation', 'catalog'],
  ['recommendation', 'worker'],
  ['catalog', 'redis'],
];

export function neighborhood(id: string) {
  return {
    callers: edges.filter(([, to]) => to === id).map(([from]) => from),
    dependencies: edges.filter(([from]) => from === id).map(([, to]) => to),
  };
}
