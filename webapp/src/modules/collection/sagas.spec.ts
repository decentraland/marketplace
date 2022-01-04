import { select } from '@redux-saga/core/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga-test-plan/matchers'
import { fetchItemsRequest } from '../item/actions'
import { getItemsByContractAddress } from '../item/selectors'
import { collectionAPI } from '../vendor/decentraland'
import {
  fetchCollectionsFailure,
  fetchCollectionsRequest,
  fetchCollectionsSuccess
} from './actions'
import { collectionSaga } from './sagas'

describe('when handling a fetch collections request', () => {
  describe('when should fetch items argument is false', () => {
    describe('when the api call is successful', () => {
      it('should put a success action with collections and count', () => {
        const filters = {
          creator: 'some creator',
          contractAddress: 'some contract address'
        }
        return expectSaga(collectionSaga)
          .provide([
            [
              call([collectionAPI, collectionAPI.fetch], filters),
              { data: [], total: 100 }
            ]
          ])
          .put(fetchCollectionsSuccess([], 100))
          .dispatch(fetchCollectionsRequest(filters))
          .silentRun()
      })
    })

    describe('when the api call fails', () => {
      it('should put a failure action with the error', () => {
        const filters = {
          creator: 'some creator',
          contractAddress: 'some contract address'
        }
        return expectSaga(collectionSaga)
          .provide([
            [
              call([collectionAPI, collectionAPI.fetch], filters),
              Promise.reject(new Error('some error'))
            ]
          ])
          .put(fetchCollectionsFailure('some error'))
          .dispatch(fetchCollectionsRequest(filters))
          .silentRun()
      })
    })
  })
  describe('when should fetch items argument is true', () => {
    it('should put a fetch items request action for each collection', () => {
      const filters = {}
      const contractAddress1 = 'contract address 1'
      const contractAddress2 = 'contract address 2'
      const contractAddress3 = 'contract address 3'
      const size = 3
      const collections = [
        {
          contractAddress: contractAddress1,
          size
        },
        {
          contractAddress: contractAddress2,
          size
        },
        {
          contractAddress: contractAddress3,
          size
        }
      ]

      return (
        expectSaga(collectionSaga)
          .provide([
            [
              call([collectionAPI, collectionAPI.fetch], filters),
              {
                data: collections,
                total: 100
              }
            ],
            [
              select(getItemsByContractAddress),
              {
                [contractAddress1]: [{}, {}, {}],
                [contractAddress2]: [{}, {}]
              }
            ]
          ])
          .put(fetchCollectionsSuccess(collections as any, 100))
          // Fetches items for contract address 2 because sizes are different
          .put(
            fetchItemsRequest({
              filters: { contractAddress: contractAddress2, first: size }
            })
          )
          // Fetches items for contract address 3 because there are no items for that collection stored
          .put(
            fetchItemsRequest({
              filters: { contractAddress: contractAddress3, first: size }
            })
          )
          .dispatch(fetchCollectionsRequest(filters, true))
          .silentRun()
      )
    })
  })
})
