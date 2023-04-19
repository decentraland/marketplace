import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { CatalogFilters, CatalogItem } from '@dcl/schemas'
import {
  fetchCatalogRequest,
  fetchCatalogSuccess,
  fetchCatalogFailure
} from './actions'
import { catalogSaga } from './sagas'
import { catalogAPI } from '../vendor/decentraland/catalog/api'

const catalogFilters: CatalogFilters = {}

const catalogItem = {
  id: 'anId',
  contractAddress: 'aContractAddress',
  price: '5000000000000000000',
  listings: 4,
  minListingPrice: '1500000000000000000000',
  maxListingPrice: '5000000000000000000000'
} as CatalogItem

const anError = 'An error occured'

describe('when handling the fetch catalog items request action', () => {
  describe('when the request fails', () => {
    it('should dispatching a failing action with the error and the options', () => {
      return expectSaga(catalogSaga)
        .provide([
          [
            call([catalogAPI, 'fetch'], catalogFilters),
            Promise.reject(new Error(anError))
          ]
        ])
        .put(fetchCatalogFailure(anError, catalogFilters))
        .dispatch(fetchCatalogRequest(catalogFilters))
        .run()
    })
  })

  describe('when the request is successful', () => {
    const fetchResult = { data: [catalogItem], total: 1 }

    it('should dispatch a successful action with the fetched catalog items', () => {
      return expectSaga(catalogSaga)
        .provide([[call([catalogAPI, 'fetch'], catalogFilters), fetchResult]])
        .put(
          fetchCatalogSuccess(
            fetchResult.data,
            fetchResult.total,
            catalogFilters
          )
        )
        .dispatch(fetchCatalogRequest(catalogFilters))
        .run()
    })
  })
})
