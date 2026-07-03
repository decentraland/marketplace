import { CURATED_MARKETPLACE_ENABLED } from './flags'

// Demo: the vercel deploy runs on a foreign origin that several DCL APIs
// reject via CORS (they only allow localhost and *.decentraland.org). Route
// those hosts through same-origin `/dcl-cors/<name>/...` paths, which the
// deploy's vercel.json rewrites back to the real hosts server-side.
// The wearable-preview iframe is NOT affected: it runs on its own
// decentraland.org origin and receives absolute URLs via query params.
const PROXIED_HOSTS = [
  'marketplace-api.decentraland.org',
  'builder-api.decentraland.org',
  'signatures-api.decentraland.org',
  'transactions-api.decentraland.org',
  'cms.decentraland.org',
  'subgraph.decentraland.org'
]

const rewriteUrl = (url: string): string => {
  try {
    const parsed = new URL(url, window.location.origin)
    if (PROXIED_HOSTS.includes(parsed.hostname)) {
      const name = parsed.hostname.split('.')[0]
      return `/dcl-cors/${name}${parsed.pathname}${parsed.search}`
    }
  } catch {
    // Not a parseable URL — leave it untouched.
  }
  return url
}

export function enableCorsProxy(): void {
  if (!CURATED_MARKETPLACE_ENABLED) return
  // Local dev and *.decentraland.org are allowed by the APIs directly.
  if (!window.location.hostname.endsWith('.vercel.app')) return

  const originalFetch = window.fetch.bind(window)
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string') return originalFetch(rewriteUrl(input), init)
    if (input instanceof URL) return originalFetch(rewriteUrl(input.href), init)
    if (input instanceof Request) return originalFetch(new Request(rewriteUrl(input.url), input), init)
    return originalFetch(input, init)
  }

  // Axios (used by the dapps BaseAPI clients) goes through XHR, not fetch.
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, method: string, url: string | URL, ...rest: unknown[]) {
    return (originalOpen as (...args: unknown[]) => void).call(this, method, rewriteUrl(String(url)), ...rest)
  } as typeof XMLHttpRequest.prototype.open
}
