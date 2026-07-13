export function trackEvent(category: string, action: string, label?: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, { event_category: category, event_label: label });
  }
}

export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-XXXXXXXXXX", { page_path: url });
  }
}
