import { useSyncExternalStore } from "react"

/* Hash router for the site. Hashes are ascii (secimler, simulator); the
   diacritics live in the display labels. Unknown pages fall back to the
   front page. Params ride inside the hash: #/secimler?il=ist */

export type SiteRoute = { page: string; params: URLSearchParams }

export function parseHash(hash: string): SiteRoute {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash
  const path = raw.startsWith("/") ? raw.slice(1) : raw
  const q = path.indexOf("?")
  const page = q === -1 ? path : path.slice(0, q)
  const query = q === -1 ? "" : path.slice(q + 1)
  return { page: page || "anasayfa", params: new URLSearchParams(query) }
}

const subscribe = (cb: () => void) => {
  addEventListener("hashchange", cb)
  return () => removeEventListener("hashchange", cb)
}

export function useHashRoute(): SiteRoute {
  const hash = useSyncExternalStore(subscribe, () => location.hash, () => "")
  return parseHash(hash)
}

export function href(page: string, params?: Record<string, string>): string {
  const q = params ? new URLSearchParams(params).toString() : ""
  return "#/" + page + (q ? "?" + q : "")
}

export function go(page: string, params?: Record<string, string>) {
  location.hash = href(page, params)
}
