type Event =
  'map_interaction' | 'demo_click' | 'quickstart_click' | 'install_copy';

/** Analytics must never prevent navigation or interaction, including when blocked. */
export function track(
  event: Event,
  properties: Record<string, string> = {},
): void {
  if (typeof window === 'undefined') return;
  const analytics = (
    window as Window & {
      umami?: {
        track: (event: string, properties: Record<string, string>) => unknown;
      };
    }
  ).umami;
  try {
    void Promise.resolve(analytics?.track(event, properties)).catch(
      () => undefined,
    );
  } catch {
    // A blocked or unavailable analytics script is a supported state.
  }
}
