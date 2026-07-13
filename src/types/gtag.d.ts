interface GtagWindow {
  gtag: (...args: unknown[]) => void;
  dataLayer: unknown[];
}
declare global {
  interface Window extends GtagWindow {}
}
export {};
