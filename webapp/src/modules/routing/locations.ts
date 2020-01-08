export enum MarketSection {
  ALL = 'all',
  LAND = 'land',
  PARCELS = 'parcels',
  ESTATES = 'estates',
  WEARABLES = 'wearables'
}

export enum MarketSortBy {
  NEWEST = 'newest',
  CHEAPEST = 'cheapest'
}

export type MarketSearchOptions = {
  page?: number | null
  section?: MarketSection | null
  sortBy?: MarketSortBy | null
}

export const locations = {
  atlas: () => '/atlas',
  market: (options?: MarketSearchOptions) => {
    if (options) {
      const params = new URLSearchParams()
      if (options.page) {
        params.set('page', options.page.toString())
      }
      if (options.section) {
        params.set('section', options.section)
      }
      if (options.sortBy) {
        params.set('sortBy', options.sortBy)
      }
      return `/market?${params.toString()}`
    }
    return '/market'
  },
  address: (address: string) => `/addresses/${address}`,
  ntf: (contract: string, id: string) => `/contracts/${contract}/id/${id}`
}
