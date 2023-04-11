// import { CatalogFilters, CatalogItem } from '@dcl/schemas'
import { action } from 'typesafe-actions'
import { CatalogFilters, CatalogItem } from './types'

// Fetch Catalog

export const FETCH_CATALOG_REQUEST = '[Request] Fetch Catalog'
export const FETCH_CATALOG_SUCCESS = '[Success] Fetch Catalog'
export const FETCH_CATALOG_FAILURE = '[Failure] Fetch Catalog'

export const fetchCatalogRequest = (filters: CatalogFilters) =>
  action(FETCH_CATALOG_REQUEST, { filters })

export const fetchCatalogSuccess = (
  catalogItems: CatalogItem[],
  total: number,
  options: CatalogFilters
) => action(FETCH_CATALOG_SUCCESS, { catalogItems, total, options })

export const fetchCatalogFailure = (error: string, options: CatalogFilters) =>
  action(FETCH_CATALOG_FAILURE, { error, options })

export type FetchCatalogRequestAction = ReturnType<typeof fetchCatalogRequest>
export type FetchCatalogSuccessAction = ReturnType<typeof fetchCatalogSuccess>
export type FetchCatalogFailureAction = ReturnType<typeof fetchCatalogFailure>
