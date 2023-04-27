import { CatalogFilters, CatalogItem } from '@dcl/schemas'
import {
  fetchCatalogFailure,
  fetchCatalogRequest,
  fetchCatalogSuccess,
  FETCH_CATALOG_FAILURE,
  FETCH_CATALOG_REQUEST,
  FETCH_CATALOG_SUCCESS
} from './actions'

const catalogFilters: CatalogFilters = {}

const anErrorMessage = 'An error'

describe('when creating the action to signal the start of the catalog request', () => {
  it('should return an object representing the action', () => {
    expect(fetchCatalogRequest({ filters: catalogFilters })).toEqual({
      type: FETCH_CATALOG_REQUEST,
      meta: undefined,
      payload: { filters: catalogFilters }
    })
  })
})

describe('when creating the action to signal a success in the items request', () => {
  const catalogItems = [{} as CatalogItem]
  const total = 1

  it('should return an object representing the action', () => {
    expect(
      fetchCatalogSuccess(catalogItems, total, { filters: catalogFilters })
    ).toEqual({
      type: FETCH_CATALOG_SUCCESS,
      meta: undefined,
      payload: { catalogItems, total, options: { filters: catalogFilters } }
    })
  })
})

describe('when creating the action to signal a failure items request', () => {
  it('should return an object representing the action', () => {
    expect(
      fetchCatalogFailure(anErrorMessage, { filters: catalogFilters })
    ).toEqual({
      type: FETCH_CATALOG_FAILURE,
      meta: undefined,
      payload: { error: anErrorMessage, options: { filters: catalogFilters } }
    })
  })
})
