import { config } from '../../config'
import { getBasename } from '../routing/basename'
import { IAP_VIEW_PARAM, IAP_VIEW_VALUE } from './useIAP'

// Mobile clients already published to the app stores still build classic marketplace
// URLs. In mobile-IAP mode we hand the destinations they link to over to the shop, so a
// shipped build reaches the right storefront without waiting for an app update. Every
// other route stays here — `/success` above all, which fires the deep link back into
// the app.

const BROWSE_SECTION_TO_SHOP_CATEGORY: Record<string, string> = {
  wearables: 'wearable',
  emotes: 'emote'
}

/** `locations.item()` — `/contracts/:contractAddress/items/:itemId`. */
const ITEM_PATH = /^\/contracts\/(0x[0-9a-fA-F]{40})\/items\/(\d+)\/?$/

// Recognises the basename the way `history` does before React Router sees the path:
// case-insensitively, and only when the basename ends at a path boundary. Anything
// stricter here lets a URL the router still resolves skip the redirect below, and
// anything looser strips a prefix the router keeps.
export const stripBasename = (pathname: string): string => {
  const basename = getBasename()
  if (!basename) {
    return pathname
  }
  const isBasename =
    pathname.slice(0, basename.length).toLowerCase() === basename.toLowerCase() &&
    ['/', '', '?', '#'].includes(pathname.charAt(basename.length))
  return isBasename ? pathname.slice(basename.length) || '/' : pathname
}

/** The shop path serving the same destination, or `null` to keep handling it here. */
export const getShopPath = (pathname: string, params: URLSearchParams): string | null => {
  // A trailing slash resolves to the same route, so it has to hand off to the shop the same way.
  // `ITEM_PATH` already tolerates one; the fixed paths below compare against the trimmed form.
  const path = stripBasename(pathname).replace(/(.)\/$/, '$1')

  const item = ITEM_PATH.exec(path)
  if (item) {
    return `/item/${item[1].toLowerCase()}/${item[2]}`
  }
  // Not a listing: the shop swaps the grid for the NAME registration page.
  if (path === '/names/claim') {
    return '/items?category=names'
  }
  if (path === '/' || path === '/browse') {
    const category = BROWSE_SECTION_TO_SHOP_CATEGORY[params.get('section') ?? '']
    return category ? `/items?category=${category}` : '/items'
  }
  return null
}

/** Absolute shop URL, keeping the marker the shop reads under the same spelling. */
export const getShopUrl = (pathname: string, params: URLSearchParams): string | null => {
  const path = getShopPath(pathname, params)
  if (!path) {
    return null
  }
  const url = new URL(`${config.get('SHOP_URL')}${path}`)
  url.searchParams.set(IAP_VIEW_PARAM, IAP_VIEW_VALUE)
  return url.toString()
}
