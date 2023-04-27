import { CatalogFilters, CatalogItem } from '@dcl/schemas'
import { loadingReducer } from 'decentraland-dapps/dist/modules/loading/reducer'
import {
  fetchCatalogRequest,
  fetchCatalogFailure,
  fetchCatalogSuccess
} from './actions'
import { INITIAL_STATE, catalogReducer } from './reducer'

const catalogFilters: CatalogFilters = {}

const catalogItem = {
  id: 'anId',
  contractAddress: 'aContractAddress',
  price: '5000000000000000000',
  listings: 4,
  minListingPrice: '1500000000000000000000',
  maxListingPrice: '5000000000000000000000'
} as CatalogItem

const anotherCatalogItem = {
  id: 'anotherId',
  contractAddress: 'aContractAddress',
  price: '5000000000000000000',
  listings: 4,
  minListingPrice: '1500000000000000000000',
  maxListingPrice: '5000000000000000000000'
} as CatalogItem

const anErrorMessage = 'An error'

describe(`when reducing the "${fetchCatalogRequest}" action`, () => {
  it('should return a state with the loading set', () => {
    const initialState = {
      ...INITIAL_STATE,
      loading: []
    }

    expect(
      catalogReducer(initialState, fetchCatalogRequest(catalogFilters))
    ).toEqual({
      ...INITIAL_STATE,
      loading: loadingReducer(
        initialState.loading,
        fetchCatalogRequest(catalogFilters)
      )
    })
  })
})

describe(`when reducing the "${fetchCatalogFailure}" action`, () => {
  it('should return a state with the error set and the loading state cleared', () => {
    const initialState = {
      ...INITIAL_STATE,
      error: null,
      loading: loadingReducer([], fetchCatalogRequest(catalogFilters))
    }

    expect(
      catalogReducer(
        initialState,
        fetchCatalogFailure(anErrorMessage, catalogFilters)
      )
    ).toEqual({
      ...INITIAL_STATE,
      error: anErrorMessage,
      loading: []
    })
  })
})

describe('when reducing the successful action of fetching catalog items', () => {
  const requestAction = fetchCatalogRequest(catalogFilters)
  const successAction = fetchCatalogSuccess([catalogItem], 1, catalogFilters)

  const initialState = {
    ...INITIAL_STATE,
    data: { anotherId: anotherCatalogItem },
    loading: loadingReducer([], requestAction)
  }

  it('should return a state with the the loaded items and the loading state cleared', () => {
    expect(catalogReducer(initialState, successAction)).toEqual({
      ...INITIAL_STATE,
      loading: [],
      data: { ...initialState.data, [catalogItem.id]: catalogItem }
    })
  })
})
