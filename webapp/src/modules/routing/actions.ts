import { action } from 'typesafe-actions'
import { BrowseOptions } from './types'

// Browse NFTs

export const BROWSE = 'Browse'

export const browse = (options: BrowseOptions) => action(BROWSE, { options })

export type BrowseAction = ReturnType<typeof browse>

// Navigate

export const FETCH_ASSETS_FROM_ROUTE = 'Fetch assets from route'

export const fetchAssetsFromRoute = (options: BrowseOptions) => action(FETCH_ASSETS_FROM_ROUTE, { options })

export type FetchAssetsFromRouteAction = ReturnType<typeof fetchAssetsFromRoute>

// Clear filters

export const CLEAR_FILTERS = 'Clear filters'

export const clearFilters = () => action(CLEAR_FILTERS)

export type ClearFiltersAction = ReturnType<typeof clearFilters>

// Go Back

export const GO_BACK = 'Go back'

/**
 * @param defaultLocation location to which the router will navigate in case there is no more back history.
 * defaults to root.
 */
export const goBack = (defaultLocation?: string) => action(GO_BACK, { defaultLocation })

export type GoBackAction = ReturnType<typeof goBack>
