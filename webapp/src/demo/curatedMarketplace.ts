import { Item } from '@dcl/schemas'
import { CatalogAPI } from '../modules/vendor/decentraland/catalog/api'
import { ItemAPI } from '../modules/vendor/decentraland/item/api'
import { ItemFilters } from '../modules/vendor/decentraland/item/types'
import curatedItemsJson from './curated-items.json'

// Demo: serve the WHOLE marketplace from a curated set of items (active
// creators, on sale only). We patch the item/catalog API prototypes so every
// consumer (browse sagas, homepage views, bundles, creator sliders…) resolves
// from the local dataset with real filter/sort/pagination semantics. Flip the
// flag to go back to the live catalog.
export const CURATED_MARKETPLACE_ENABLED = true

// The dataset comes from /v1/items, but the cards only use the catalog layout
// (creator + rarity chip + hover actions) when catalog fields like `minPrice`
// exist — synthesize them for these mint-only items.
const curatedItems = (curatedItemsJson as unknown as Item[]).map(item => ({
  ...item,
  minPrice: item.minPrice ?? item.price,
  listings: item.listings ?? 0,
  minListingPrice: item.minListingPrice ?? null,
  maxListingPrice: item.maxListingPrice ?? null,
  owners: item.owners ?? 0
}))

// Wearable category groupings used by the browse sections.
const HEAD_CATEGORIES = new Set(['eyebrows', 'eyes', 'facial_hair', 'hair', 'mouth'])
const ACCESSORY_CATEGORIES = new Set(['earring', 'eyewear', 'hat', 'helmet', 'mask', 'tiara', 'top_head'])

type AnyFilters = ItemFilters & {
  isWearableHead?: boolean
  isWearableAccessory?: boolean
  emoteHasSound?: boolean
  emoteHasGeometry?: boolean
}

const toBigInt = (value?: string | null): bigint => {
  try {
    return BigInt(value || '0')
  } catch {
    return BigInt(0)
  }
}

const matches = (item: Item, filters: AnyFilters): boolean => {
  const wearable = item.data.wearable
  const emote = item.data.emote

  if (filters.category && item.category !== filters.category) return false
  if (filters.ids && filters.ids.length > 0 && !filters.ids.includes(item.id)) return false
  if (filters.contractAddresses && filters.contractAddresses.length > 0 && !filters.contractAddresses.includes(item.contractAddress)) {
    return false
  }
  if (filters.itemId && item.itemId !== filters.itemId) return false
  const creators = filters.creator ? (Array.isArray(filters.creator) ? filters.creator : [filters.creator]) : []
  if (creators.length > 0 && !creators.some(creator => creator.toLowerCase() === item.creator.toLowerCase())) {
    return false
  }
  if (filters.network && item.network !== filters.network) return false
  if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) return false
  if (filters.rarities && filters.rarities.length > 0) {
    const rarity = wearable?.rarity || emote?.rarity
    if (!rarity || !filters.rarities.includes(rarity)) return false
  }
  if (filters.wearableCategory && wearable?.category !== filters.wearableCategory) return false
  if (filters.emoteCategory && emote?.category !== filters.emoteCategory) return false
  if (filters.isWearableSmart && !wearable?.isSmart) return false
  if (filters.isWearableHead && (!wearable || !HEAD_CATEGORIES.has(wearable.category))) return false
  if (filters.isWearableAccessory && (!wearable || !ACCESSORY_CATEGORIES.has(wearable.category))) return false
  if (filters.emotePlayMode && filters.emotePlayMode.length > 0) {
    if (!emote) return false
    const mode = emote.loop ? 'loop' : 'simple'
    if (!(filters.emotePlayMode as string[]).includes(mode)) return false
  }
  if (filters.emoteHasSound && !emote?.hasSound) return false
  if (filters.emoteHasGeometry && !emote?.hasGeometry) return false
  if (filters.minPrice && toBigInt(item.price) < toBigInt(filters.minPrice)) return false
  if (filters.maxPrice && toBigInt(item.price) > toBigInt(filters.maxPrice)) return false
  return true
}

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const sortItems = (items: Item[], sortBy?: string): Item[] => {
  const sorted = [...items]
  switch (sortBy) {
    case 'cheapest':
    case 'cheapest_ever':
      return sorted.sort((a, b) => (toBigInt(a.price) < toBigInt(b.price) ? -1 : 1))
    case 'most_expensive':
      return sorted.sort((a, b) => (toBigInt(a.price) > toBigInt(b.price) ? -1 : 1))
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'recently_sold':
      return sorted.sort((a, b) => toNumber(b.soldAt) - toNumber(a.soldAt))
    case 'recently_reviewed':
      return sorted.sort((a, b) => toNumber(b.reviewedAt) - toNumber(a.reviewedAt))
    case 'recently_listed':
      return sorted.sort((a, b) => toNumber(b.firstListedAt ?? b.createdAt) - toNumber(a.firstListedAt ?? a.createdAt))
    case 'newest':
    default:
      return sorted.sort((a, b) => toNumber(b.createdAt) - toNumber(a.createdAt))
  }
}

const query = (filters: AnyFilters): { data: Item[]; total: number } => {
  const filtered = sortItems(
    curatedItems.filter(item => matches(item, filters)),
    filters.sortBy as string | undefined
  )
  const skip = filters.skip ?? 0
  const first = filters.first ?? filtered.length
  return { data: filtered.slice(skip, skip + first), total: filtered.length }
}

export function enableCuratedMarketplace(): void {
  if (!CURATED_MARKETPLACE_ENABLED) return

  // eslint-disable-next-line no-console
  console.warn(`[demo] curated marketplace ON — serving ${curatedItems.length} on-sale items from active creators`)

  // Kept unbound on purpose — invoked with .call(this) inside the patch.
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalGetOne = ItemAPI.prototype.getOne

  ItemAPI.prototype.get = function (filters: ItemFilters = {}) {
    return Promise.resolve(query(filters))
  }

  ItemAPI.prototype.getTrendings = function (size = 20) {
    const { data } = query({ sortBy: 'recently_sold' as ItemFilters['sortBy'], first: size })
    return Promise.resolve({ data, total: data.length })
  }

  ItemAPI.prototype.getOne = function (contractAddress: string, itemId: string) {
    const found = curatedItems.find(item => item.contractAddress === contractAddress && item.itemId === itemId)
    // Items outside the curated set (old links, tests) still resolve live.
    return found ? Promise.resolve(found) : originalGetOne.call(this, contractAddress, itemId)
  }

  CatalogAPI.prototype.get = function (filters = {}) {
    return Promise.resolve(query(filters as AnyFilters))
  }
}
