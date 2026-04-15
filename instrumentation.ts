/**
 * Next.js Instrumentation Hook
 * Runs once when the Next.js server starts (and before SSG page generation).
 * Polyfills browser-only APIs so that client component modules can be safely
 * evaluated on the server during SSR / static site generation.
 */
export async function register() {
  if (typeof globalThis.localStorage === 'undefined') {
    const noopStorage: Storage = {
      length: 0,
      getItem: (_key: string) => null,
      setItem: (_key: string, _value: string) => {},
      removeItem: (_key: string) => {},
      clear: () => {},
      key: (_index: number) => null,
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: noopStorage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: noopStorage,
      writable: true,
      configurable: true,
    });
  }
}
