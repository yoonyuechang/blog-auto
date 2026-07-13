export function trackEvent(type: string, payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const events = JSON.parse(localStorage.getItem('dp_events') || '[]');
  events.push({ type, payload, timestamp: Date.now() });
  localStorage.setItem('dp_events', JSON.stringify(events.slice(-100)));
}
